/**
 * Configuration Manager for Trashcan
 * Manages global configuration and initializes directories
 */

import { join } from 'path';
import { homedir } from 'os';
import type { TrashcanConfig } from '../../types/index.ts';

const DEFAULT_CONFIG: TrashcanConfig = {
  version: '1.0.0',
  dataDir: join(homedir(), '.trashcan', 'data'),
  sitesDir: join(homedir(), '.trashcan', 'sites'),
  backupDir: join(homedir(), '.trashcan', 'backups'),
  logsDir: join(homedir(), '.trashcan', 'logs'),
  caddy: {
    configPath: join(homedir(), '.trashcan', 'caddy', 'Caddyfile'),
    apiUrl: 'http://localhost:2019',
    email: ''
  },
  openrouter: {
    apiKey: '',
    model: 'anthropic/claude-3-sonnet',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions'
  }
};

export class ConfigManager {
  private config: TrashcanConfig;
  private configPath: string;

  constructor() {
    this.configPath = join(homedir(), '.trashcan', 'config.json');
    this.config = DEFAULT_CONFIG;
  }

  /**
   * Initialize configuration and create necessary directories
   */
  async init(): Promise<void> {
    // Create base directory
    const baseDir = join(homedir(), '.trashcan');
    await Bun.write(Bun.file(baseDir), ''); // Create directory
    
    try {
      // Try to load existing config
      const file = Bun.file(this.configPath);
      if (await file.exists()) {
        const data = await file.json();
        this.config = { ...DEFAULT_CONFIG, ...data };
      } else {
        // Create new config
        await this.save();
      }
    } catch (error) {
      console.warn('Could not load config, using defaults');
      await this.save();
    }

    // Create all required directories
    await this.createDirectories();
  }

  /**
   * Create all required directories
   */
  private async createDirectories(): Promise<void> {
    const dirs = [
      this.config.dataDir,
      this.config.sitesDir,
      this.config.backupDir,
      this.config.logsDir,
      join(homedir(), '.trashcan', 'caddy')
    ];

    for (const dir of dirs) {
      try {
        await Bun.write(Bun.file(dir + '/.keep'), '');
      } catch (error) {
        // Directory might already exist, ignore
      }
    }
  }

  /**
   * Save configuration to disk
   */
  async save(): Promise<void> {
    await Bun.write(
      this.configPath,
      JSON.stringify(this.config, null, 2)
    );
  }

  /**
   * Get current configuration
   */
  get(): TrashcanConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  async update(updates: Partial<TrashcanConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    await this.save();
  }

  /**
   * Get path for a specific site
   */
  getSitePath(siteName: string): string {
    return join(this.config.sitesDir, siteName);
  }

  /**
   * Get backup path for a specific site
   */
  getBackupPath(siteName: string): string {
    return join(this.config.backupDir, siteName);
  }

  /**
   * Get log path for a specific site
   */
  getLogPath(siteName: string): string {
    return join(this.config.logsDir, `${siteName}.log`);
  }
}

// Singleton instance
let configManager: ConfigManager | null = null;

export function getConfigManager(): ConfigManager {
  if (!configManager) {
    configManager = new ConfigManager();
  }
  return configManager;
}
