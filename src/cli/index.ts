#!/usr/bin/env bun
/**
 * Trashcan - Main CLI Entry Point (Raccoon)
 * A single-binary CLI hosting panel for Bun+Next.js
 */

import { getConfigManager } from '../core/config/index.ts';
import { getDatabase } from '../core/db/index.ts';
import { OpossumManager } from '../modules/opossum/index.ts';
import { BadgerManager } from '../modules/badger/index.ts';
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

    // Get email for Let's Encrypt
    const email = args[0] || 'admin@example.com';
    
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
