/**
 * Crow - Backup Management Module
 * Handles site backups and restores
 */

import { join } from 'path';
import type { Site, Backup, BackupType, BackupStatus } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';
import { getConfigManager } from '../../core/config/index.ts';
import { generateId, getTimestamp, exec, formatBytes } from '../../core/utils/index.ts';

export class CrowManager {
  private db = getDatabase();
  private config = getConfigManager();

  /**
   * Create a backup of a site
   */
  async createBackup(site: Site, type: BackupType = 'full'): Promise<Backup> {
    const timestamp = getTimestamp();
    const backupId = generateId();
    const backupFileName = `backup-${timestamp}.tar.gz`;
    const backupPath = join(site.backup.path, backupFileName);

    const backup: Backup = {
      id: backupId,
      siteId: site.id,
      siteName: site.name,
      timestamp: new Date(),
      size: 0,
      path: backupPath,
      type,
      status: 'inprogress' as BackupStatus
    };

    // Save backup record
    await this.db.createBackup(backup);

    try {
      // Create tar.gz archive of site directory
      const { exitCode, stderr } = await exec(
        `tar -czf ${backupPath} -C ${site.path} .`
      );

      if (exitCode !== 0) {
        throw new Error(`Backup creation failed: ${stderr}`);
      }

      // Get backup file size
      const file = Bun.file(backupPath);
      const size = file.size;

      // Update backup with size and status
      backup.size = size;
      backup.status = 'completed' as BackupStatus;
      
      // Update in database (we need to recreate it since we can't update easily)
      await this.db.createBackup(backup);

      console.log(`✅ Backup created: ${formatBytes(size)}`);

      // Apply retention policy
      await this.applyRetention(site);

      return backup;
    } catch (error) {
      backup.status = 'failed' as BackupStatus;
      await this.db.createBackup(backup);
      throw error;
    }
  }

  /**
   * Restore a site from backup
   */
  async restoreBackup(backupId: string): Promise<void> {
    const backups = await this.db.getBackups();
    const backup = backups.find(b => b.id === backupId);

    if (!backup) {
      throw new Error('Backup not found');
    }

    const site = await this.db.getSite(backup.siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    console.log(`🔄 Restoring backup for ${site.name}...`);

    // Stop the site first
    const { exitCode: stopCode } = await exec('docker compose down', site.path);
    if (stopCode !== 0) {
      console.warn('Failed to stop site, continuing anyway...');
    }

    try {
      // Extract backup
      const { exitCode, stderr } = await exec(
        `tar -xzf ${backup.path} -C ${site.path}`
      );

      if (exitCode !== 0) {
        throw new Error(`Restore failed: ${stderr}`);
      }

      // Restart the site
      await exec('docker compose up -d', site.path);

      console.log(`✅ Backup restored successfully`);
    } catch (error) {
      console.error(`❌ Restore failed: ${error}`);
      throw error;
    }
  }

  /**
   * List backups for a site
   */
  async listBackups(siteId: string): Promise<Backup[]> {
    return await this.db.getBackups(siteId);
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    const backups = await this.db.getBackups();
    const backup = backups.find(b => b.id === backupId);

    if (!backup) {
      throw new Error('Backup not found');
    }

    // Delete the backup file
    try {
      await exec(`rm -f ${backup.path}`);
    } catch (error) {
      console.warn(`Failed to delete backup file: ${error}`);
    }

    // Remove from database
    await this.db.deleteBackup(backupId);
  }

  /**
   * Apply retention policy (delete old backups)
   */
  async applyRetention(site: Site): Promise<void> {
    const backups = await this.listBackups(site.id);
    
    // Sort by timestamp, newest first
    backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - site.backup.retention);

    // Delete backups older than retention period
    for (const backup of backups) {
      if (new Date(backup.timestamp) < retentionDate) {
        console.log(`🗑️  Deleting old backup: ${backup.id}`);
        await this.deleteBackup(backup.id);
      }
    }
  }

  /**
   * Schedule automatic backups for a site
   */
  async scheduleBackups(site: Site): Promise<void> {
    if (!site.backup.enabled) {
      return;
    }

    // For now, we'll just document the cron schedule
    // In a production system, you'd integrate with cron or a job scheduler
    console.log(`📅 Backup scheduled for ${site.name}: ${site.backup.schedule}`);
    console.log(`   Retention: ${site.backup.retention} days`);
  }

  /**
   * Get total backup size for a site
   */
  async getTotalBackupSize(siteId: string): Promise<number> {
    const backups = await this.listBackups(siteId);
    return backups.reduce((total, backup) => total + backup.size, 0);
  }

  /**
   * Create backup and return info
   */
  async backup(siteName: string): Promise<Backup> {
    const site = await this.db.getSiteByName(siteName);
    if (!site) {
      throw new Error(`Site not found: ${siteName}`);
    }

    console.log(`💾 Creating backup for ${siteName}...`);
    return await this.createBackup(site);
  }
}
