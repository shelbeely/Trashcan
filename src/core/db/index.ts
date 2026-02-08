/**
 * Simple JSON-based database for Trashcan
 * Stores data in JSON files for sites, backups, health checks, and diagnostics
 */

import { join } from 'path';
import type { Site, Backup, HealthCheckResult, Diagnostic } from '../../types/index.ts';
import { getConfigManager } from '../config/index.ts';
import { readJSON, writeJSON, ensureDir } from '../utils/index.ts';

export class Database {
  private sitesFile: string;
  private backupsFile: string;
  private healthChecksFile: string;
  private diagnosticsFile: string;

  constructor() {
    const config = getConfigManager().get();
    const dbDir = config.dataDir;
    this.sitesFile = join(dbDir, 'sites.json');
    this.backupsFile = join(dbDir, 'backups.json');
    this.healthChecksFile = join(dbDir, 'health-checks.json');
    this.diagnosticsFile = join(dbDir, 'diagnostics.json');
  }

  /**
   * Initialize database files
   */
  async init(): Promise<void> {
    const config = getConfigManager().get();
    await ensureDir(config.dataDir);

    // Create empty files if they don't exist
    if (!(await Bun.file(this.sitesFile).exists())) {
      await writeJSON(this.sitesFile, []);
    }
    if (!(await Bun.file(this.backupsFile).exists())) {
      await writeJSON(this.backupsFile, []);
    }
    if (!(await Bun.file(this.healthChecksFile).exists())) {
      await writeJSON(this.healthChecksFile, []);
    }
    if (!(await Bun.file(this.diagnosticsFile).exists())) {
      await writeJSON(this.diagnosticsFile, []);
    }
  }

  // Sites operations
  async getSites(): Promise<Site[]> {
    const sites = await readJSON<Site[]>(this.sitesFile);
    return sites || [];
  }

  async getSite(id: string): Promise<Site | null> {
    const sites = await this.getSites();
    return sites.find(site => site.id === id) || null;
  }

  async getSiteByName(name: string): Promise<Site | null> {
    const sites = await this.getSites();
    return sites.find(site => site.name === name) || null;
  }

  async createSite(site: Site): Promise<void> {
    const sites = await this.getSites();
    sites.push(site);
    await writeJSON(this.sitesFile, sites);
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<void> {
    const sites = await this.getSites();
    const index = sites.findIndex(site => site.id === id);
    if (index === -1) {
      throw new Error(`Site not found: ${id}`);
    }
    sites[index] = { ...sites[index], ...updates, updated: new Date() };
    await writeJSON(this.sitesFile, sites);
  }

  async deleteSite(id: string): Promise<void> {
    const sites = await this.getSites();
    const filtered = sites.filter(site => site.id !== id);
    await writeJSON(this.sitesFile, filtered);
  }

  // Backups operations
  async getBackups(siteId?: string): Promise<Backup[]> {
    const backups = await readJSON<Backup[]>(this.backupsFile);
    const allBackups = backups || [];
    if (siteId) {
      return allBackups.filter(backup => backup.siteId === siteId);
    }
    return allBackups;
  }

  async createBackup(backup: Backup): Promise<void> {
    const backups = await this.getBackups();
    backups.push(backup);
    await writeJSON(this.backupsFile, backups);
  }

  async deleteBackup(id: string): Promise<void> {
    const backups = await this.getBackups();
    const filtered = backups.filter(backup => backup.id !== id);
    await writeJSON(this.backupsFile, filtered);
  }

  // Health checks operations
  async getHealthChecks(siteId: string, limit: number = 100): Promise<HealthCheckResult[]> {
    const checks = await readJSON<HealthCheckResult[]>(this.healthChecksFile);
    const allChecks = checks || [];
    return allChecks
      .filter(check => check.siteId === siteId)
      .slice(-limit);
  }

  async createHealthCheck(check: HealthCheckResult): Promise<void> {
    const checks = await readJSON<HealthCheckResult[]>(this.healthChecksFile);
    const allChecks = checks || [];
    allChecks.push(check);
    // Keep only last 1000 checks per site to prevent file growth
    const grouped = new Map<string, HealthCheckResult[]>();
    allChecks.forEach(c => {
      if (!grouped.has(c.siteId)) {
        grouped.set(c.siteId, []);
      }
      grouped.get(c.siteId)!.push(c);
    });
    
    const trimmed: HealthCheckResult[] = [];
    grouped.forEach((siteChecks) => {
      trimmed.push(...siteChecks.slice(-1000));
    });
    
    await writeJSON(this.healthChecksFile, trimmed);
  }

  // Diagnostics operations
  async getDiagnostics(siteId: string, limit: number = 10): Promise<Diagnostic[]> {
    const diagnostics = await readJSON<Diagnostic[]>(this.diagnosticsFile);
    const allDiagnostics = diagnostics || [];
    return allDiagnostics
      .filter(diag => diag.siteId === siteId)
      .slice(-limit);
  }

  async createDiagnostic(diagnostic: Diagnostic): Promise<void> {
    const diagnostics = await readJSON<Diagnostic[]>(this.diagnosticsFile);
    const allDiagnostics = diagnostics || [];
    allDiagnostics.push(diagnostic);
    await writeJSON(this.diagnosticsFile, allDiagnostics);
  }
}

// Singleton instance
let database: Database | null = null;

export function getDatabase(): Database {
  if (!database) {
    database = new Database();
  }
  return database;
}
