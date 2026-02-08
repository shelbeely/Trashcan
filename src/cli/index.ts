#!/usr/bin/env bun
/**
 * Trashcan - Main CLI Entry Point (Raccoon)
 * A single-binary CLI hosting panel for Bun+Next.js
 */

import { getConfigManager } from '../core/config/index.ts';
import { getDatabase } from '../core/db/index.ts';
import { OpossumManager } from '../modules/opossum/index.ts';
import { BadgerManager } from '../modules/badger/index.ts';
import { SeagullManager } from '../modules/seagull/index.ts';
import { RatManager } from '../modules/rat/index.ts';
import { CrowManager } from '../modules/crow/index.ts';
import { FoxManager } from '../modules/fox/index.ts';
import { checkDocker, checkDockerCompose } from '../core/utils/index.ts';

const VERSION = '1.0.0';

// ASCII art banner with trash animal theme
const BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🦝  TRASHCAN - Bun+Next.js Hosting Panel  🦝           ║
║                                                           ║
║   A cPanel/Plesk-style hosting panel with                ║
║   Docker, Caddy, and AI-powered assistance               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

interface CLICommand {
  name: string;
  description: string;
  usage: string;
  action: (args: string[]) => Promise<void>;
}

class TrashcanCLI {
  private commands: Map<string, CLICommand> = new Map();
  private configManager = getConfigManager();
  private db = getDatabase();
  private opossum = new OpossumManager();
  private badger = new BadgerManager();
  private seagull = new SeagullManager();
  private rat = new RatManager();
  private crow = new CrowManager();
  private fox = new FoxManager();

  constructor() {
    this.registerCommands();
  }

  /**
   * Register all CLI commands
   */
  private registerCommands(): void {
    this.commands.set('init', {
      name: 'init',
      description: 'Initialize Trashcan in the current directory',
      usage: 'trashcan init [email]',
      action: this.initCommand.bind(this)
    });

    this.commands.set('deploy', {
      name: 'deploy',
      description: 'Deploy a new site',
      usage: 'trashcan deploy --name <name> --domain <domain> [options]',
      action: this.deployCommand.bind(this)
    });

    this.commands.set('list', {
      name: 'list',
      description: 'List all sites',
      usage: 'trashcan list',
      action: this.listCommand.bind(this)
    });

    this.commands.set('start', {
      name: 'start',
      description: 'Start a site',
      usage: 'trashcan start <name>',
      action: this.startCommand.bind(this)
    });

    this.commands.set('stop', {
      name: 'stop',
      description: 'Stop a site',
      usage: 'trashcan stop <name>',
      action: this.stopCommand.bind(this)
    });

    this.commands.set('restart', {
      name: 'restart',
      description: 'Restart a site',
      usage: 'trashcan restart <name>',
      action: this.restartCommand.bind(this)
    });

    this.commands.set('remove', {
      name: 'remove',
      description: 'Remove a site',
      usage: 'trashcan remove <name>',
      action: this.removeCommand.bind(this)
    });

    this.commands.set('info', {
      name: 'info',
      description: 'Show site information',
      usage: 'trashcan info <name>',
      action: this.infoCommand.bind(this)
    });

    this.commands.set('logs', {
      name: 'logs',
      description: 'View site logs',
      usage: 'trashcan logs <name> [--lines 100]',
      action: this.logsCommand.bind(this)
    });

    this.commands.set('health', {
      name: 'health',
      description: 'Check site health',
      usage: 'trashcan health <name>',
      action: this.healthCommand.bind(this)
    });

    this.commands.set('backup', {
      name: 'backup',
      description: 'Create a backup',
      usage: 'trashcan backup <name>',
      action: this.backupCommand.bind(this)
    });

    this.commands.set('restore', {
      name: 'restore',
      description: 'Restore from backup',
      usage: 'trashcan restore <name> <backup-id>',
      action: this.restoreCommand.bind(this)
    });

    this.commands.set('diagnose', {
      name: 'diagnose',
      description: 'AI-powered diagnostics',
      usage: 'trashcan diagnose <name>',
      action: this.diagnoseCommand.bind(this)
    });

    this.commands.set('version', {
      name: 'version',
      description: 'Show Trashcan version',
      usage: 'trashcan version',
      action: this.versionCommand.bind(this)
    });

    this.commands.set('help', {
      name: 'help',
      description: 'Show help information',
      usage: 'trashcan help [command]',
      action: this.helpCommand.bind(this)
    });
  }

  /**
   * Initialize Trashcan
   */
  private async initCommand(args: string[]): Promise<void> {
    console.log(BANNER);
    console.log('🔧 Initializing Trashcan...\n');

    // Check prerequisites
    console.log('✓ Checking prerequisites...');
    
    if (!await checkDocker()) {
      console.error('❌ Docker is not installed or not running');
      console.error('   Please install Docker: https://docs.docker.com/get-docker/');
      process.exit(1);
    }
    console.log('  ✓ Docker is installed');

    if (!await checkDockerCompose()) {
      console.error('❌ Docker Compose is not installed');
      console.error('   Please install Docker Compose: https://docs.docker.com/compose/install/');
      process.exit(1);
    }
    console.log('  ✓ Docker Compose is installed');

    // Initialize configuration
    console.log('\n✓ Creating configuration...');
    await this.configManager.init();
    await this.db.init();
    console.log('  ✓ Configuration created');

    // Get email for Let's Encrypt (required)
    const email = args[0];
    if (!email || !email.includes('@')) {
      console.error('\n❌ Valid email address required for Let\'s Encrypt SSL certificates');
      console.error('   Usage: trashcan init your@email.com');
      process.exit(1);
    }
    
    // Initialize Caddy
    console.log('\n✓ Setting up Caddy reverse proxy...');
    await this.badger.init(email);
    console.log('  ✓ Caddy initialized');

    console.log('\n✅ Trashcan initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Deploy your first site: trashcan deploy --name my-site --domain mysite.com');
    console.log('  2. View all sites: trashcan list');
    console.log('  3. Get help: trashcan help');
  }

  /**
   * Deploy a new site
   */
  private async deployCommand(args: string[]): Promise<void> {
    const options = this.parseArgs(args);

    if (!options.name || !options.domain) {
      console.error('❌ Missing required arguments');
      console.error('Usage: trashcan deploy --name <name> --domain <domain>');
      process.exit(1);
    }

    console.log(`🚀 Deploying site: ${options.name}`);

    try {
      const site = await this.opossum.deploy({
        name: options.name,
        domain: options.domain,
        aliases: options.aliases?.split(','),
        port: options.port ? parseInt(options.port) : undefined,
        env: options.env ? JSON.parse(options.env) : undefined,
        gitRepo: options.git,
        branch: options.branch
      });

      // Update Caddy configuration
      await this.badger.addSite(site);

      console.log(`\n✅ Site deployed successfully!`);
      console.log(`   Name: ${site.name}`);
      console.log(`   Domain: ${site.domain}`);
      console.log(`   Port: ${site.port}`);
      console.log(`   Status: ${site.status}`);
    } catch (error) {
      console.error(`❌ Deployment failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * List all sites
   */
  private async listCommand(): Promise<void> {
    const sites = await this.opossum.listSites();

    if (sites.length === 0) {
      console.log('No sites found. Deploy your first site with: trashcan deploy');
      return;
    }

    console.log('\n📋 Sites:\n');
    console.log('NAME                 DOMAIN                      PORT    STATUS');
    console.log('─'.repeat(70));

    for (const site of sites) {
      const name = site.name.padEnd(20);
      const domain = site.domain.padEnd(28);
      const port = site.port.toString().padEnd(8);
      const status = this.getStatusEmoji(site.status) + ' ' + site.status;
      console.log(`${name}${domain}${port}${status}`);
    }

    console.log('');
  }

  /**
   * Start a site
   */
  private async startCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`▶️  Starting site: ${name}`);
    await this.opossum.startSite(site.id);
    await this.badger.reload();
    console.log(`✅ Site started successfully`);
  }

  /**
   * Stop a site
   */
  private async stopCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`⏸️  Stopping site: ${name}`);
    await this.opossum.stopSite(site.id);
    await this.badger.reload();
    console.log(`✅ Site stopped successfully`);
  }

  /**
   * Restart a site
   */
  private async restartCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`🔄 Restarting site: ${name}`);
    await this.opossum.restartSite(site.id);
    console.log(`✅ Site restarted successfully`);
  }

  /**
   * Remove a site
   */
  private async removeCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`🗑️  Removing site: ${name}`);
    await this.opossum.removeSite(site.id);
    await this.badger.removeSite(name);
    console.log(`✅ Site removed successfully`);
  }

  /**
   * Show site information
   */
  private async infoCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`\n📊 Site Information: ${site.name}\n`);
    console.log(`ID:           ${site.id}`);
    console.log(`Domain:       ${site.domain}`);
    console.log(`Aliases:      ${site.aliases.join(', ') || 'None'}`);
    console.log(`Port:         ${site.port}`);
    console.log(`Status:       ${this.getStatusEmoji(site.status)} ${site.status}`);
    console.log(`Path:         ${site.path}`);
    console.log(`Created:      ${site.created.toISOString()}`);
    console.log(`Updated:      ${site.updated.toISOString()}`);
    
    if (site.gitRepo) {
      console.log(`Git Repo:     ${site.gitRepo}`);
      console.log(`Branch:       ${site.branch}`);
    }

    console.log('');
  }

  /**
   * View logs
   */
  private async logsCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const options = this.parseArgs(args);
    const lines = parseInt(options.lines || '100');

    try {
      const logs = await this.seagull.getLogs(name, lines);
      console.log(`\n📋 Logs for ${name} (last ${lines} lines):\n`);
      console.log(logs);
      console.log(`\nTo stream logs in real-time, run:`);
      console.log(`  ${this.seagull.getStreamCommand(name)}`);
    } catch (error) {
      console.error(`❌ Failed to get logs: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Check health
   */
  private async healthCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    console.log(`🏥 Checking health for ${name}...`);

    try {
      // Perform health check
      const result = await this.rat.check(site);
      
      console.log(`\n📊 Health Check Result:\n`);
      console.log(`Status:        ${result.success ? '✅ Healthy' : '❌ Unhealthy'}`);
      console.log(`HTTP Status:   ${result.status}`);
      console.log(`Response Time: ${result.responseTime}ms`);
      
      if (result.error) {
        console.log(`Error:         ${result.error}`);
      }

      // Get health summary
      const summary = await this.rat.getHealthSummary(site.id);
      console.log(`\n📈 Health Summary (24h):\n`);
      console.log(`Status:        ${this.getHealthEmoji(summary.status)} ${summary.status}`);
      console.log(`Uptime:        ${summary.uptime.toFixed(2)}%`);
      console.log(`Avg Response:  ${summary.avgResponseTime.toFixed(0)}ms`);
    } catch (error) {
      console.error(`❌ Health check failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Create backup
   */
  private async backupCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    try {
      const backup = await this.crow.backup(name);
      console.log(`\n✅ Backup created successfully!`);
      console.log(`   ID: ${backup.id}`);
      console.log(`   Path: ${backup.path}`);
    } catch (error) {
      console.error(`❌ Backup failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Restore from backup
   */
  private async restoreCommand(args: string[]): Promise<void> {
    const name = args[0];
    const backupId = args[1];

    if (!name || !backupId) {
      console.error('❌ Usage: trashcan restore <name> <backup-id>');
      process.exit(1);
    }

    try {
      await this.crow.restoreBackup(backupId);
      console.log(`\n✅ Restore completed successfully!`);
    } catch (error) {
      console.error(`❌ Restore failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * AI-powered diagnostics
   */
  private async diagnoseCommand(args: string[]): Promise<void> {
    const name = args[0];
    if (!name) {
      console.error('❌ Site name required');
      process.exit(1);
    }

    const site = await this.opossum.getSite(name);
    if (!site) {
      console.error(`❌ Site not found: ${name}`);
      process.exit(1);
    }

    try {
      const diagnostic = await this.fox.diagnose(site);
      
      console.log(`\n🦊 AI Diagnostic Report for ${name}\n`);
      console.log('━'.repeat(60));
      console.log(diagnostic.analysis);
      console.log('━'.repeat(60));

      if (diagnostic.suggestions.length > 0) {
        console.log(`\n💡 Suggested Fixes (${diagnostic.suggestions.length}):\n`);
        
        for (const [index, fix] of diagnostic.suggestions.entries()) {
          console.log(`${index + 1}. ${fix.description}`);
          console.log(`   Confidence: ${(fix.confidence * 100).toFixed(0)}%`);
          
          if (fix.files.length > 0) {
            console.log(`   Files: ${fix.files.join(', ')}`);
          }
          
          if (fix.diff) {
            console.log(`   Preview: trashcan preview-fix ${name} ${fix.id}`);
            console.log(`   Apply:   trashcan apply-fix ${name} ${fix.id}`);
          }
          console.log('');
        }
      } else {
        console.log('\n✅ No issues detected or no fixes suggested.');
      }
    } catch (error) {
      console.error(`❌ Diagnostic failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Show version
   */
  private async versionCommand(): Promise<void> {
    console.log(BANNER);
    console.log(`Version: ${VERSION}\n`);
  }

  /**
   * Show help
   */
  private async helpCommand(args: string[]): Promise<void> {
    const commandName = args[0];

    if (commandName) {
      const command = this.commands.get(commandName);
      if (!command) {
        console.error(`❌ Unknown command: ${commandName}`);
        process.exit(1);
      }

      console.log(`\n${command.name} - ${command.description}`);
      console.log(`\nUsage: ${command.usage}\n`);
      return;
    }

    console.log(BANNER);
    console.log('Available commands:\n');

    for (const [, command] of this.commands) {
      console.log(`  ${command.name.padEnd(15)} ${command.description}`);
    }

    console.log('\nUse "trashcan help <command>" for more information about a command.\n');
  }

  /**
   * Parse command line arguments
   */
  private parseArgs(args: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const key = args[i].substring(2);
        const value = args[i + 1];
        if (value && !value.startsWith('--')) {
          result[key] = value;
          i++;
        }
      }
    }

    return result;
  }

  /**
   * Get status emoji
   */
  private getStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      running: '🟢',
      stopped: '🔴',
      error: '❌',
      deploying: '🚀',
      building: '🔨'
    };
    return emojis[status] || '⚪';
  }

  /**
   * Get health status emoji
   */
  private getHealthEmoji(status: string): string {
    const emojis: Record<string, string> = {
      healthy: '🟢',
      degraded: '🟡',
      down: '🔴'
    };
    return emojis[status] || '⚪';
  }

  /**
   * Run the CLI
   */
  async run(argv: string[]): Promise<void> {
    const args = argv.slice(2);
    const commandName = args[0];

    if (!commandName) {
      await this.helpCommand([]);
      return;
    }

    const command = this.commands.get(commandName);
    if (!command) {
      console.error(`❌ Unknown command: ${commandName}`);
      console.log('Run "trashcan help" for available commands.');
      process.exit(1);
    }

    try {
      await command.action(args.slice(1));
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      process.exit(1);
    }
  }
}

// Main entry point
if (import.meta.main) {
  const cli = new TrashcanCLI();
  cli.run(process.argv).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { TrashcanCLI };
