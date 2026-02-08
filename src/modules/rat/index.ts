/**
 * Rat - Health Monitor Module
 * Performs health checks on sites and tracks their status
 */

import type { Site, HealthCheckResult } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';
import { generateId } from '../../core/utils/index.ts';

export class RatManager {
  private db = getDatabase();
  private runningChecks: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Perform a single health check
   */
  async check(site: Site): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      id: generateId(),
      siteId: site.id,
      timestamp: new Date(),
      status: 0,
      responseTime: 0,
      success: false
    };

    if (!site.healthCheck.enabled) {
      return result;
    }

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), site.healthCheck.timeout * 1000);

      const response = await fetch(site.healthCheck.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Trashcan-Health-Check/1.0'
        }
      });

      clearTimeout(timeoutId);

      result.status = response.status;
      result.responseTime = Date.now() - startTime;
      result.success = response.status >= 200 && response.status < 400;
    } catch (error) {
      result.responseTime = Date.now() - startTime;
      result.success = false;
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Save result to database
    await this.db.createHealthCheck(result);

    return result;
  }

  /**
   * Start continuous monitoring for a site
   */
  async startMonitoring(site: Site): Promise<void> {
    if (!site.healthCheck.enabled) {
      return;
    }

    // Stop existing monitoring if any
    this.stopMonitoring(site.id);

    // Perform initial check
    await this.check(site);

    // Schedule periodic checks
    const interval = setInterval(async () => {
      try {
        const currentSite = await this.db.getSite(site.id);
        if (currentSite && currentSite.status === 'running') {
          await this.check(currentSite);
        } else {
          // Site no longer running, stop monitoring
          this.stopMonitoring(site.id);
        }
      } catch (error) {
        console.error(`Health check failed for ${site.name}:`, error);
      }
    }, site.healthCheck.interval * 1000);

    this.runningChecks.set(site.id, interval);
  }

  /**
   * Stop monitoring a site
   */
  stopMonitoring(siteId: string): void {
    const interval = this.runningChecks.get(siteId);
    if (interval) {
      clearInterval(interval);
      this.runningChecks.delete(siteId);
    }
  }

  /**
   * Get recent health check results
   */
  async getRecentChecks(siteId: string, limit: number = 10): Promise<HealthCheckResult[]> {
    return await this.db.getHealthChecks(siteId, limit);
  }

  /**
   * Calculate uptime percentage
   */
  async calculateUptime(siteId: string, hours: number = 24): Promise<number> {
    const checks = await this.db.getHealthChecks(siteId, 1000);
    
    if (checks.length === 0) {
      return 0;
    }

    // Filter checks within the time window
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentChecks = checks.filter(check => 
      new Date(check.timestamp) >= cutoff
    );

    if (recentChecks.length === 0) {
      return 0;
    }

    const successCount = recentChecks.filter(check => check.success).length;
    return (successCount / recentChecks.length) * 100;
  }

  /**
   * Get health status summary
   */
  async getHealthSummary(siteId: string): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    avgResponseTime: number;
    lastCheck: HealthCheckResult | null;
  }> {
    const checks = await this.getRecentChecks(siteId, 10);
    
    if (checks.length === 0) {
      return {
        status: 'down',
        uptime: 0,
        avgResponseTime: 0,
        lastCheck: null
      };
    }

    const lastCheck = checks[checks.length - 1];
    const uptime = await this.calculateUptime(siteId, 24);
    
    const avgResponseTime = checks.reduce((sum, check) => sum + check.responseTime, 0) / checks.length;

    let status: 'healthy' | 'degraded' | 'down' = 'down';
    if (uptime >= 99) {
      status = 'healthy';
    } else if (uptime >= 90) {
      status = 'degraded';
    }

    return {
      status,
      uptime,
      avgResponseTime,
      lastCheck
    };
  }

  /**
   * Check if a site is currently down
   */
  async isDown(siteId: string, consecutiveFailures: number = 3): Promise<boolean> {
    const checks = await this.getRecentChecks(siteId, consecutiveFailures);
    
    if (checks.length < consecutiveFailures) {
      return false;
    }

    // Check if all recent checks failed
    return checks.every(check => !check.success);
  }
}
