/**
 * Opossum - Site Manager Module
 * Handles site deployment, management, and lifecycle operations
 */

import { join } from 'path';
import type { Site, SiteStatus } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';
import { getConfigManager } from '../../core/config/index.ts';
import { generateId, validateSiteName, validateDomain, validatePort, getNextAvailablePort, ensureDir, writeJSON, exec } from '../../core/utils/index.ts';

export interface DeployOptions {
  name: string;
  domain: string;
  aliases?: string[];
  port?: number;
  env?: Record<string, string>;
  gitRepo?: string;
  branch?: string;
}

export class OpossumManager {
  private db = getDatabase();
  private config = getConfigManager();

  /**
   * Deploy a new site
   */
  async deploy(options: DeployOptions): Promise<Site> {
    // Validate inputs
    if (!validateSiteName(options.name)) {
      throw new Error('Invalid site name. Use lowercase letters, numbers, and hyphens only.');
    }

    if (!validateDomain(options.domain)) {
      throw new Error('Invalid domain name.');
    }

    // Check if site already exists
    const existing = await this.db.getSiteByName(options.name);
    if (existing) {
      throw new Error(`Site "${options.name}" already exists.`);
    }

    // Get next available port if not specified
    const port = options.port || await getNextAvailablePort(3000);
    if (!validatePort(port)) {
      throw new Error('Invalid port number. Must be between 1024 and 65535.');
    }

    // Create site object
    const site: Site = {
      id: generateId(),
      name: options.name,
      domain: options.domain,
      aliases: options.aliases || [],
      port,
      status: 'deploying' as SiteStatus,
      healthCheck: {
        enabled: true,
        url: `http://localhost:${port}`,
        interval: 30,
        timeout: 5,
        retries: 3
      },
      backup: {
        enabled: true,
        schedule: '0 2 * * *', // 2 AM daily
        retention: 7,
        path: this.config.getBackupPath(options.name)
      },
      env: options.env || {},
      created: new Date(),
      updated: new Date(),
      path: this.config.getSitePath(options.name),
      gitRepo: options.gitRepo,
      branch: options.branch || 'main'
    };

    // Save site to database
    await this.db.createSite(site);

    // Create site directory structure
    await this.createSiteStructure(site);

    // Generate docker-compose.yml
    await this.generateDockerCompose(site);

    // If git repo provided, clone it
    if (options.gitRepo) {
      await this.cloneRepository(site);
    }

    // Update status to building
    await this.db.updateSite(site.id, { status: 'building' as SiteStatus });

    // Build and start the site (async)
    this.startSite(site.id).catch(error => {
      console.error(`Failed to start site ${site.name}:`, error);
      this.db.updateSite(site.id, { status: 'error' as SiteStatus });
    });

    return site;
  }

  /**
   * Create site directory structure
   */
  private async createSiteStructure(site: Site): Promise<void> {
    const sitePath = site.path;
    await ensureDir(sitePath);
    await ensureDir(join(sitePath, 'source'));
    await ensureDir(join(sitePath, 'data'));
    await ensureDir(site.backup.path);

    // Create .env file
    const envContent = Object.entries(site.env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    await Bun.write(join(sitePath, '.env'), envContent);
  }

  /**
   * Generate docker-compose.yml for the site
   */
  private async generateDockerCompose(site: Site): Promise<void> {
    const composeConfig = {
      version: '3.8',
      services: {
        app: {
          build: {
            context: './source',
            dockerfile: 'Dockerfile'
          },
          container_name: `trashcan-${site.name}`,
          restart: 'unless-stopped',
          environment: Object.entries(site.env).map(([key, value]) => `${key}=${value}`),
          ports: [`${site.port}:${site.port}`],
          volumes: ['./data:/app/data'],
          networks: ['trashcan'],
          labels: {
            'trashcan.site': site.name,
            'trashcan.domain': site.domain
          }
        }
      },
      networks: {
        trashcan: {
          external: true
        }
      }
    };

    // Write docker-compose.yml
    const composePath = join(site.path, 'docker-compose.yml');
    await Bun.write(composePath, JSON.stringify(composeConfig, null, 2));
  }

  /**
   * Clone git repository
   */
  private async cloneRepository(site: Site): Promise<void> {
    if (!site.gitRepo) return;

    const sourcePath = join(site.path, 'source');
    const command = `git clone -b ${site.branch} ${site.gitRepo} ${sourcePath}`;
    
    try {
      const { exitCode, stderr } = await exec(command);
      if (exitCode !== 0) {
        throw new Error(`Git clone failed: ${stderr}`);
      }
    } catch (error) {
      throw new Error(`Failed to clone repository: ${error}`);
    }
  }

  /**
   * Start a site
   */
  async startSite(siteId: string): Promise<void> {
    const site = await this.db.getSite(siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    // Ensure Docker network exists
    await this.ensureDockerNetwork();

    // Build and start with docker compose
    const { exitCode, stderr } = await exec(`docker compose up -d --build`, site.path);
    
    if (exitCode !== 0) {
      await this.db.updateSite(siteId, { status: 'error' as SiteStatus });
      throw new Error(`Docker compose failed: ${stderr}`);
    }

    await this.db.updateSite(siteId, { status: 'running' as SiteStatus });
  }

  /**
   * Stop a site
   */
  async stopSite(siteId: string): Promise<void> {
    const site = await this.db.getSite(siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    const { exitCode, stderr } = await exec(`docker compose down`, site.path);
    
    if (exitCode !== 0) {
      throw new Error(`Docker compose down failed: ${stderr}`);
    }

    await this.db.updateSite(siteId, { status: 'stopped' as SiteStatus });
  }

  /**
   * Restart a site
   */
  async restartSite(siteId: string): Promise<void> {
    await this.stopSite(siteId);
    await this.startSite(siteId);
  }

  /**
   * Remove a site
   */
  async removeSite(siteId: string): Promise<void> {
    const site = await this.db.getSite(siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    // Stop the site first
    try {
      await this.stopSite(siteId);
    } catch {
      // Ignore if already stopped
    }

    // Remove from database
    await this.db.deleteSite(siteId);

    // Note: We don't delete files to prevent accidental data loss
    // User can manually delete the directory if needed
  }

  /**
   * List all sites
   */
  async listSites(): Promise<Site[]> {
    return await this.db.getSites();
  }

  /**
   * Get site by name
   */
  async getSite(name: string): Promise<Site | null> {
    return await this.db.getSiteByName(name);
  }

  /**
   * Ensure Docker network exists
   */
  private async ensureDockerNetwork(): Promise<void> {
    // Check if network exists
    const { exitCode } = await exec('docker network inspect trashcan');
    
    if (exitCode !== 0) {
      // Create network
      await exec('docker network create trashcan');
    }
  }
}
