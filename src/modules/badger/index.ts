/**
 * Badger - Reverse Proxy Manager Module
 * Manages Caddy reverse proxy configuration and SSL certificates
 */

import { join } from 'path';
import { homedir } from 'os';
import type { Site } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';
import { getConfigManager } from '../../core/config/index.ts';
import { exec, ensureDir } from '../../core/utils/index.ts';

export class BadgerManager {
  private db = getDatabase();
  private config = getConfigManager();
  private caddyDir: string;
  private caddyfile: string;

  constructor() {
    this.caddyDir = join(homedir(), '.trashcan', 'caddy');
    this.caddyfile = join(this.caddyDir, 'Caddyfile');
  }

  /**
   * Initialize Caddy setup
   */
  async init(email: string): Promise<void> {
    await ensureDir(this.caddyDir);

    // Update config with email
    await this.config.update({
      caddy: {
        ...this.config.get().caddy,
        email
      }
    });

    // Generate initial Caddyfile
    await this.generateCaddyfile();

    // Create docker-compose.yml for Caddy
    await this.createCaddyCompose();

    // Start Caddy container
    await this.startCaddy();
  }

  /**
   * Generate Caddyfile from all sites
   */
  async generateCaddyfile(): Promise<void> {
    const sites = await this.db.getSites();
    const config = this.config.get();
    
    let caddyfileContent = `{\n  email ${config.caddy.email}\n}\n\n`;

    for (const site of sites) {
      if (site.status === 'running') {
        // Add primary domain
        caddyfileContent += `${site.domain} {\n`;
        caddyfileContent += `  reverse_proxy trashcan-${site.name}:${site.port}\n`;
        caddyfileContent += `}\n\n`;

        // Add aliases
        for (const alias of site.aliases) {
          caddyfileContent += `${alias} {\n`;
          caddyfileContent += `  reverse_proxy trashcan-${site.name}:${site.port}\n`;
          caddyfileContent += `}\n\n`;
        }
      }
    }

    await Bun.write(this.caddyfile, caddyfileContent);
  }

  /**
   * Create docker-compose.yml for Caddy
   */
  private async createCaddyCompose(): Promise<void> {
    const composeConfig = {
      version: '3.8',
      services: {
        caddy: {
          image: 'caddy:latest',
          container_name: 'trashcan-caddy',
          restart: 'unless-stopped',
          ports: [
            '80:80',
            '443:443',
            '2019:2019' // Admin API
          ],
          volumes: [
            './Caddyfile:/etc/caddy/Caddyfile',
            'caddy_data:/data',
            'caddy_config:/config'
          ],
          networks: ['trashcan']
        }
      },
      networks: {
        trashcan: {
          name: 'trashcan'
        }
      },
      volumes: {
        caddy_data: {},
        caddy_config: {}
      }
    };

    const composePath = join(this.caddyDir, 'docker-compose.yml');
    await Bun.write(composePath, JSON.stringify(composeConfig, null, 2));
  }

  /**
   * Start Caddy container
   */
  async startCaddy(): Promise<void> {
    const { exitCode, stderr } = await exec('docker compose up -d', this.caddyDir);
    
    if (exitCode !== 0) {
      throw new Error(`Failed to start Caddy: ${stderr}`);
    }
  }

  /**
   * Stop Caddy container
   */
  async stopCaddy(): Promise<void> {
    const { exitCode, stderr } = await exec('docker compose down', this.caddyDir);
    
    if (exitCode !== 0) {
      throw new Error(`Failed to stop Caddy: ${stderr}`);
    }
  }

  /**
   * Reload Caddy configuration
   */
  async reload(): Promise<void> {
    // Regenerate Caddyfile
    await this.generateCaddyfile();

    // Reload Caddy using the API
    const { exitCode, stderr } = await exec(
      'docker exec trashcan-caddy caddy reload --config /etc/caddy/Caddyfile'
    );

    if (exitCode !== 0) {
      throw new Error(`Failed to reload Caddy: ${stderr}`);
    }
  }

  /**
   * Add a site to Caddy configuration
   */
  async addSite(site: Site): Promise<void> {
    await this.reload();
  }

  /**
   * Remove a site from Caddy configuration
   */
  async removeSite(siteName: string): Promise<void> {
    await this.reload();
  }

  /**
   * Get SSL certificate status for a domain
   */
  async getCertificateStatus(domain: string): Promise<any> {
    try {
      // Query Caddy API for certificate info
      const response = await fetch(`http://localhost:2019/pki/certificates/${domain}`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * List all configured domains
   */
  async listDomains(): Promise<string[]> {
    const sites = await this.db.getSites();
    const domains: string[] = [];

    for (const site of sites) {
      if (site.status === 'running') {
        domains.push(site.domain);
        domains.push(...site.aliases);
      }
    }

    return domains;
  }
}
