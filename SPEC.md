# Trashcan Specification

## Project Overview
Trashcan is a single-binary CLI tool with an Ink TUI that acts as a cPanel/Plesk-style hosting panel specifically designed for Bun+Next.js applications. It embraces a trash-animal naming system throughout its architecture.

## Theme: Trash-Animal Naming System
All components, commands, and features use names inspired by animals that thrive in trash/urban environments:
- **Raccoon** - Main CLI binary (raccoons are master scavengers)
- **Opossum** - Site deployment system (opossums are resilient)
- **Crow** - Backup system (crows collect and store things)
- **Seagull** - Log viewer (seagulls are always watching)
- **Rat** - Health check system (rats are survivors)
- **Fox** - AI assistant (foxes are clever)
- **Skunk** - Security/SSL (skunks protect themselves)
- **Badger** - Reverse proxy manager (badgers are persistent)

## User Experience (UX)

### Installation
```bash
# Install via npm/bun
bun install -g trashcan

# Or download binary
curl -fsSL https://trashcan.dev/install.sh | bash
```

### CLI Interface

#### Main Command Structure
```
trashcan [command] [options]

Commands:
  init          Initialize Trashcan in the current directory
  den           Open the interactive TUI (main control panel)
  opossum       Site management (deploy, remove, list)
  seagull       View and tail logs
  rat           Run health checks
  crow          Backup management
  fox           AI-powered assistance
  skunk         SSL certificate management
  badger        Reverse proxy configuration
```

#### Interactive TUI (Den)
The TUI provides a dashboard with:
1. **Sites Overview** - List of all deployed sites with status indicators
2. **Resource Metrics** - CPU, Memory, Disk usage
3. **Recent Logs** - Scrollable log viewer
4. **Quick Actions** - Deploy, restart, backup, AI assist
5. **Navigation** - Keyboard shortcuts (vim-style: j/k, arrow keys)

### Workflow Examples

#### Deploy a New Site
```bash
# Via CLI
trashcan opossum deploy --name my-site --domain mysite.com --port 3000

# Via TUI
# Navigate to Sites → Press 'n' for new → Fill form → Confirm
```

#### View Logs
```bash
# CLI - tail logs
trashcan seagull tail my-site

# TUI - real-time log viewer with filtering
trashcan den
# Press 'l' → Select site → View logs
```

#### AI-Assisted Fixes
```bash
# Analyze errors and get AI suggestions
trashcan fox diagnose my-site

# Preview and apply suggested fixes
trashcan fox fix my-site --preview
trashcan fox fix my-site --apply
```

## Data Model

### Site Configuration
```typescript
interface Site {
  id: string;                    // UUID
  name: string;                  // Unique site identifier (slug)
  domain: string;                // Primary domain
  aliases: string[];             // Additional domains
  port: number;                  // Internal port
  status: SiteStatus;            // running | stopped | error | deploying
  healthCheck: HealthCheckConfig;
  backup: BackupConfig;
  env: Record<string, string>;   // Environment variables
  created: Date;
  updated: Date;
  path: string;                  // Site directory path
  gitRepo?: string;              // Optional git repository
  branch?: string;               // Git branch
}

enum SiteStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  DEPLOYING = 'deploying',
  BUILDING = 'building'
}

interface HealthCheckConfig {
  enabled: boolean;
  url: string;                   // Health check endpoint
  interval: number;              // Seconds between checks
  timeout: number;               // Request timeout
  retries: number;               // Failed attempts before alert
}

interface BackupConfig {
  enabled: boolean;
  schedule: string;              // Cron expression
  retention: number;             // Days to keep backups
  path: string;                  // Backup storage path
}
```

### Backup Metadata
```typescript
interface Backup {
  id: string;
  siteId: string;
  siteName: string;
  timestamp: Date;
  size: number;                  // Bytes
  path: string;                  // Backup file path
  type: BackupType;              // full | incremental
  status: BackupStatus;          // completed | failed | inprogress
}

enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental'
}

enum BackupStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  INPROGRESS = 'inprogress'
}
```

### Health Check Result
```typescript
interface HealthCheckResult {
  id: string;
  siteId: string;
  timestamp: Date;
  status: number;                // HTTP status code
  responseTime: number;          // Milliseconds
  success: boolean;
  error?: string;
}
```

### AI Diagnostic
```typescript
interface Diagnostic {
  id: string;
  siteId: string;
  timestamp: Date;
  logs: string[];                // Recent error logs
  metrics: ResourceMetrics;
  analysis: string;              // AI analysis
  suggestions: Fix[];
}

interface Fix {
  id: string;
  description: string;
  diff: string;                  // Unified diff format
  confidence: number;            // 0-1 score
  files: string[];               // Affected files
  applied: boolean;
}

interface ResourceMetrics {
  cpu: number;                   // Percentage
  memory: number;                // MB
  disk: number;                  // MB
}
```

### Global Configuration
```typescript
interface TrashcanConfig {
  version: string;
  dataDir: string;               // ~/.trashcan/data
  sitesDir: string;              // ~/.trashcan/sites
  backupDir: string;             // ~/.trashcan/backups
  logsDir: string;               // ~/.trashcan/logs
  caddy: CaddyConfig;
  openrouter: OpenRouterConfig;
}

interface CaddyConfig {
  configPath: string;
  apiUrl: string;
  email: string;                 // Let's Encrypt email
}

interface OpenRouterConfig {
  apiKey: string;
  model: string;                 // Default AI model
  endpoint: string;
}
```

## Architecture

### Technology Stack
- **Runtime**: Bun (TypeScript)
- **TUI Framework**: Ink + React
- **CLI Framework**: Commander.js
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Caddy (with automatic HTTPS)
- **AI**: OpenRouter API
- **Data Storage**: JSON files + SQLite for structured data

### Directory Structure
```
~/.trashcan/
├── config.json              # Global configuration
├── trashcan.db             # SQLite database
├── sites/                  # Site-specific directories
│   ├── site-1/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   ├── source/         # Application code
│   │   └── data/           # Persistent data
│   └── site-2/
├── backups/                # Backup storage
│   ├── site-1/
│   │   ├── backup-2024-01-01.tar.gz
│   │   └── backup-2024-01-02.tar.gz
│   └── site-2/
├── logs/                   # Centralized logs
│   ├── trashcan.log       # Main system log
│   ├── caddy.log          # Reverse proxy log
│   └── sites/
│       ├── site-1.log
│       └── site-2.log
└── caddy/
    ├── Caddyfile           # Generated configuration
    └── docker-compose.yml  # Caddy container
```

### Component Architecture

#### 1. Core CLI (Raccoon)
The main entry point that routes commands to specialized modules.

```typescript
// src/cli/index.ts
- Parse commands with Commander
- Initialize configuration
- Route to appropriate modules
- Handle global flags
```

#### 2. TUI Dashboard (Den)
Interactive terminal interface built with Ink.

```typescript
// src/tui/
├── components/
│   ├── Dashboard.tsx       # Main dashboard
│   ├── SiteList.tsx       # Site overview
│   ├── LogViewer.tsx      # Log viewer
│   ├── Metrics.tsx        # Resource metrics
│   └── ActionMenu.tsx     # Quick actions
├── hooks/
│   ├── useSites.ts        # Site data
│   ├── useLogs.ts         # Log streaming
│   └── useMetrics.ts      # Resource monitoring
└── index.tsx              # TUI entry point
```

#### 3. Site Manager (Opossum)
Handles site lifecycle: deploy, start, stop, remove.

```typescript
// src/modules/opossum/
├── deploy.ts              # Deployment logic
├── template.ts            # docker-compose template
├── builder.ts             # Build Next.js apps
└── manager.ts             # Site CRUD operations
```

**Deployment Flow**:
1. Validate site configuration
2. Create site directory structure
3. Clone/copy application code
4. Generate docker-compose.yml
5. Build Docker image
6. Start containers
7. Update Caddy configuration
8. Verify deployment

#### 4. Log Manager (Seagull)
Aggregates and displays logs from all sources.

```typescript
// src/modules/seagull/
├── collector.ts           # Collect logs from Docker
├── viewer.ts              # Display logs
├── filter.ts              # Log filtering
└── parser.ts              # Parse and format logs
```

#### 5. Health Monitor (Rat)
Periodic health checks with alerting.

```typescript
// src/modules/rat/
├── checker.ts             # HTTP health checks
├── scheduler.ts           # Cron-based scheduling
├── monitor.ts             # Continuous monitoring
└── alerter.ts             # Alert on failures
```

#### 6. Backup System (Crow)
Automated backups with retention policies.

```typescript
// src/modules/crow/
├── backup.ts              # Create backups
├── restore.ts             # Restore from backup
├── scheduler.ts           # Scheduled backups
└── storage.ts             # Backup storage management
```

#### 7. AI Assistant (Fox)
OpenRouter integration for diagnostics and fixes.

```typescript
// src/modules/fox/
├── client.ts              # OpenRouter API client
├── diagnostics.ts         # Analyze logs/metrics
├── fixer.ts               # Generate and apply fixes
└── prompts.ts             # AI prompt templates
```

#### 8. SSL Manager (Skunk)
Manages SSL certificates via Caddy.

```typescript
// src/modules/skunk/
├── certManager.ts         # Certificate operations
├── renewal.ts             # Auto-renewal
└── validator.ts           # Validate certificates
```

#### 9. Proxy Manager (Badger)
Manages Caddy reverse proxy configuration.

```typescript
// src/modules/badger/
├── config.ts              # Caddyfile generation
├── reload.ts              # Reload configuration
└── manager.ts             # Proxy management
```

### Docker Architecture

#### Per-Site Docker Compose
Each site gets its own `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./source
      dockerfile: Dockerfile
    container_name: trashcan-${SITE_NAME}
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=${PORT}
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - ./data:/app/data
    networks:
      - trashcan
    labels:
      - "trashcan.site=${SITE_NAME}"
      - "trashcan.domain=${DOMAIN}"

networks:
  trashcan:
    external: true
```

#### Shared Caddy Container
Single Caddy instance for all sites:

```yaml
# ~/.trashcan/caddy/docker-compose.yml
version: '3.8'

services:
  caddy:
    image: caddy:latest
    container_name: trashcan-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - trashcan

networks:
  trashcan:
    name: trashcan

volumes:
  caddy_data:
  caddy_config:
```

#### Dynamic Caddyfile
Generated from site configurations:

```
{
  email your@email.com
}

site1.example.com {
  reverse_proxy trashcan-site1:3000
}

site2.example.com {
  reverse_proxy trashcan-site2:3001
}
```

### Database Schema (SQLite)

```sql
-- Sites table
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  aliases TEXT,              -- JSON array
  port INTEGER NOT NULL,
  status TEXT NOT NULL,
  health_check TEXT,         -- JSON object
  backup_config TEXT,        -- JSON object
  env TEXT,                  -- JSON object
  created TEXT NOT NULL,
  updated TEXT NOT NULL,
  path TEXT NOT NULL,
  git_repo TEXT,
  branch TEXT
);

-- Health checks table
CREATE TABLE health_checks (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status INTEGER,
  response_time INTEGER,
  success INTEGER NOT NULL,
  error TEXT,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Backups table
CREATE TABLE backups (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Diagnostics table
CREATE TABLE diagnostics (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  logs TEXT NOT NULL,        -- JSON array
  metrics TEXT NOT NULL,     -- JSON object
  analysis TEXT NOT NULL,
  suggestions TEXT NOT NULL, -- JSON array
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Create indexes
CREATE INDEX idx_sites_name ON sites(name);
CREATE INDEX idx_health_checks_site_id ON health_checks(site_id);
CREATE INDEX idx_backups_site_id ON backups(site_id);
CREATE INDEX idx_diagnostics_site_id ON diagnostics(site_id);
```

## Build System

### Single Binary Compilation
Using Bun's built-in compiler:

```bash
# Build single binary
bun build src/cli/index.ts --compile --outfile trashcan

# The binary includes:
# - All TypeScript/JavaScript code
# - Node modules
# - Bun runtime
```

### Package Structure
```json
{
  "name": "trashcan",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "trashcan": "./dist/trashcan"
  },
  "scripts": {
    "build": "bun build src/cli/index.ts --compile --outfile dist/trashcan",
    "dev": "bun run src/cli/index.ts",
    "test": "bun test"
  }
}
```

## Security Considerations

1. **SSL/TLS**: Automatic HTTPS via Let's Encrypt through Caddy
2. **Environment Variables**: Secure storage, never logged
3. **API Keys**: Encrypted storage for OpenRouter key
4. **Docker Isolation**: Each site runs in isolated container
5. **Network**: Dedicated Docker network for internal communication
6. **File Permissions**: Restricted access to config/data directories

## AI Integration (Fox)

### OpenRouter Configuration
```typescript
const openRouterConfig = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-3-sonnet',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://trashcan.dev',
    'X-Title': 'Trashcan'
  }
}
```

### Diagnostic Workflow
1. **Collect Context**:
   - Recent error logs (last 100 lines)
   - Resource metrics (CPU, memory, disk)
   - Site configuration
   - Container status

2. **Send to AI**:
   ```typescript
   const prompt = `Analyze this Next.js application issue:
   
   Logs:
   ${logs}
   
   Metrics:
   CPU: ${cpu}%
   Memory: ${memory}MB
   
   Provide:
   1. Root cause analysis
   2. Specific fixes as unified diffs
   3. Prevention recommendations
   `;
   ```

3. **Parse Response**:
   - Extract unified diff sections
   - Parse affected files
   - Calculate confidence scores

4. **Preview Mode**:
   - Show diffs with syntax highlighting
   - Display before/after comparison
   - Require user confirmation

5. **Apply Mode**:
   - Apply patches to files
   - Validate syntax
   - Restart services if needed
   - Rollback on failure

## Error Handling

### Graceful Degradation
- Network errors: Show cached data
- Docker errors: Provide manual recovery steps
- AI unavailable: Fall back to manual diagnostics

### Error Categories
```typescript
class TrashcanError extends Error {
  category: ErrorCategory;
  code: string;
  recoverable: boolean;
}

enum ErrorCategory {
  DOCKER = 'docker',
  NETWORK = 'network',
  CONFIG = 'config',
  DEPLOYMENT = 'deployment',
  AI = 'ai'
}
```

## Performance Requirements

- **Startup Time**: < 1 second for CLI commands
- **TUI Rendering**: 60 FPS smooth updates
- **Log Streaming**: Real-time with < 100ms latency
- **Health Checks**: Configurable (default: 30s interval)
- **Docker Operations**: Parallel where possible
- **Binary Size**: < 50MB compiled

## Testing Strategy

1. **Unit Tests**: Individual module testing
2. **Integration Tests**: Docker operations, Caddy config
3. **E2E Tests**: Full deployment workflows
4. **TUI Tests**: Component rendering
5. **Manual Tests**: Real Next.js deployments

## Future Enhancements

1. **Multi-server Support**: Manage sites across multiple servers
2. **GitHub Integration**: Deploy from GitHub releases/branches
3. **Monitoring Dashboard**: Web-based overview
4. **Plugin System**: Extensible architecture
5. **Database Support**: PostgreSQL, MySQL containers
6. **Load Balancing**: Multiple instances per site
7. **Blue-Green Deployments**: Zero-downtime updates
8. **Custom Domains**: Bulk domain management

## Implementation Phases

### Phase 1: Core Foundation (MVP)
- [ ] Project setup and structure
- [ ] CLI framework with Commander
- [ ] Configuration management
- [ ] SQLite database setup
- [ ] Docker compose templates
- [ ] Basic site deployment (Opossum)
- [ ] Caddy integration (Badger)

### Phase 2: TUI Interface
- [ ] Ink-based dashboard (Den)
- [ ] Site list component
- [ ] Log viewer (Seagull)
- [ ] Navigation and keyboard shortcuts
- [ ] Real-time updates

### Phase 3: Monitoring & Operations
- [ ] Health checks (Rat)
- [ ] Backup system (Crow)
- [ ] SSL management (Skunk)
- [ ] Resource metrics
- [ ] Alert system

### Phase 4: AI Integration
- [ ] OpenRouter client (Fox)
- [ ] Diagnostic system
- [ ] Unified diff parser
- [ ] Preview and apply workflow
- [ ] Error analysis

### Phase 5: Polish & Production
- [ ] Single binary compilation
- [ ] Installation scripts
- [ ] Documentation
- [ ] Error handling
- [ ] Performance optimization
- [ ] Security audit

## Success Metrics

1. **Deploy Time**: < 2 minutes for new Next.js site
2. **Uptime**: 99.9% for managed sites
3. **SSL Renewal**: 100% automatic success rate
4. **AI Accuracy**: > 80% helpful suggestions
5. **User Satisfaction**: Intuitive TUI, clear documentation

---

This specification provides a comprehensive blueprint for building Trashcan. Each component is well-defined with clear responsibilities, and the trash-animal naming system creates a memorable and cohesive user experience.
