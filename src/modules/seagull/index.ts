/**
 * Seagull - Log Management Module
 * Collects and displays logs from Docker containers
 */

import { exec } from '../../core/utils/index.ts';
import { getDatabase } from '../../core/db/index.ts';

export interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  source: string;
}

export class SeagullManager {
  private db = getDatabase();

  /**
   * Get logs for a site
   */
  async getLogs(siteName: string, lines: number = 100): Promise<string> {
    const containerName = `trashcan-${siteName}`;
    
    try {
      const { stdout, exitCode } = await exec(`docker logs --tail ${lines} ${containerName}`);
      
      if (exitCode !== 0) {
        throw new Error('Failed to fetch logs');
      }

      return stdout;
    } catch (error) {
      throw new Error(`Failed to get logs for ${siteName}: ${error}`);
    }
  }

  /**
   * Stream logs in real-time (returns command for user to run)
   */
  getStreamCommand(siteName: string): string {
    const containerName = `trashcan-${siteName}`;
    return `docker logs -f ${containerName}`;
  }

  /**
   * Parse logs into structured entries
   */
  parseLogs(logs: string): LogEntry[] {
    const lines = logs.split('\n').filter(line => line.trim());
    const entries: LogEntry[] = [];

    for (const line of lines) {
      // Try to parse structured logs
      try {
        const json = JSON.parse(line);
        entries.push({
          timestamp: new Date(json.timestamp || json.time || Date.now()),
          level: json.level || 'info',
          message: json.message || json.msg || line,
          source: json.source || 'app'
        });
      } catch {
        // Fallback to plain text
        entries.push({
          timestamp: new Date(),
          level: 'info',
          message: line,
          source: 'app'
        });
      }
    }

    return entries;
  }

  /**
   * Filter logs by level
   */
  filterByLevel(entries: LogEntry[], level: string): LogEntry[] {
    return entries.filter(entry => entry.level === level);
  }

  /**
   * Search logs
   */
  search(entries: LogEntry[], query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.message.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get error logs only
   */
  async getErrors(siteName: string, lines: number = 100): Promise<LogEntry[]> {
    const logs = await this.getLogs(siteName, lines);
    const entries = this.parseLogs(logs);
    return entries.filter(entry => 
      entry.level === 'error' || 
      entry.message.toLowerCase().includes('error')
    );
  }

  /**
   * Export logs to file
   */
  async exportLogs(siteName: string, outputPath: string, lines: number = 1000): Promise<void> {
    const logs = await this.getLogs(siteName, lines);
    await Bun.write(outputPath, logs);
  }
}
