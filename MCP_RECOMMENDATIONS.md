# MCP Server & Agent Skills Recommendations for Trashcan 🦝

> **Last Updated:** February 8, 2026  
> **Codebase:** Trashcan - Single-binary CLI hosting panel for Bun+Next.js applications

---

## 📋 Executive Summary

This document provides curated Model Context Protocol (MCP) server recommendations and GitHub Copilot configurations specifically tailored for the Trashcan codebase—a hosting panel for deploying Bun+Next.js applications with Docker, Caddy reverse proxy, and AI-powered diagnostics.

**Two GitHub Copilot Systems Configured:**

1. **Agent Skills** (`.github/skills/`) - For VS Code and IDEs
   - Provides guidance while coding
   - Works synchronously with developer
   - 6 skills: deploy-site, docker-operations, caddy-config, health-checks, backup-restore, ai-diagnostics

2. **Custom Agents** (`.github/agents/`) - For GitHub.com coding agent  
   - Works autonomously on assigned issues
   - Creates PRs independently
   - 4 agents: trashcan-deploy, trashcan-monitor, trashcan-backup, trashcan-dev

**See [.github/AGENTS_VS_SKILLS.md](.github/AGENTS_VS_SKILLS.md) for detailed comparison.**

**Key Technologies in Trashcan:**
- **Runtime:** Bun (TypeScript, ES Modules)
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Caddy with automatic HTTPS
- **Database:** JSON-based storage
- **AI Integration:** OpenRouter API
- **Architecture:** Modular "trash-animal" naming system

---

## 🎯 Priority 1: Essential MCP Servers

These MCP servers directly support core Trashcan workflows and should be integrated first.

### 1. Docker MCP Server ⭐⭐⭐⭐⭐

**Why It's Critical:**
- Trashcan heavily relies on Docker for container management
- Manages per-site containers and shared Caddy reverse proxy
- Automates docker-compose operations

**Capabilities:**
- Container lifecycle management (start/stop/restart)
- Docker Compose orchestration
- Image management and builds
- Network and volume management
- Container logs and health checks
- Docker API integration

**Installation:**
```bash
# Via Docker MCP Catalog
docker run -d --name mcp-docker \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/modelcontextprotocol/mcp-docker:latest

# Or via NPM
npm install -g @modelcontextprotocol/server-docker
```

**Configuration (.mcp.json):**
```json
{
  "mcpServers": {
    "docker": {
      "command": "docker-mcp-server",
      "env": {
        "DOCKER_SOCKET": "/var/run/docker.sock"
      }
    }
  }
}
```

**Use Cases in Trashcan:**
- Automate site deployment container creation (Opossum module)
- Monitor container health (Rat module)
- Manage Caddy reverse proxy container (Badger module)
- Retrieve container logs (Seagull module)

---

### 2. Filesystem MCP Server ⭐⭐⭐⭐⭐

**Why It's Critical:**
- Trashcan stores all configuration in JSON files
- Manages site directories at `~/.trashcan/sites/`
- Handles backups, logs, and Caddyfile generation

**Capabilities:**
- Secure file read/write operations
- Directory management and listings
- Path validation and sandboxing
- Batch file operations
- File metadata retrieval
- Allowed directory restrictions

**Installation:**
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**Configuration (.mcp.json):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "server-filesystem",
      "args": [
        "/home/runner/.trashcan",
        "/home/runner/work/Trashcan/Trashcan"
      ]
    }
  }
}
```

**Use Cases in Trashcan:**
- Manage JSON database files (`sites.json`, `backups.json`, etc.)
- Generate docker-compose.yml and Caddyfile
- Read/write site configurations
- Backup management (Crow module)
- Log file access (Seagull module)

**Security Note:**
- Configure allowed directories to prevent unauthorized access
- Trashcan should restrict to `~/.trashcan/` and project directories

**References:**
- GitHub: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

---

### 3. Git MCP Server ⭐⭐⭐⭐

**Why It's Important:**
- Site deployments support Git repository cloning
- Enables version control for site source code
- Supports branch and tag deployment options

**Capabilities:**
- Clone repositories
- Check status and diff
- Manage branches and remotes
- View commit history
- Git operations (fetch, pull, push)

**Installation:**
```bash
npm install -g @modelcontextprotocol/server-git
```

**Configuration (.mcp.json):**
```json
{
  "mcpServers": {
    "git": {
      "command": "server-git",
      "args": [
        "/home/runner/.trashcan/sites",
        "/home/runner/work/Trashcan/Trashcan"
      ]
    }
  }
}
```

**Use Cases in Trashcan:**
- Clone Next.js repositories during deployment
- Track site source code versions
- Implement git-based deployment workflows
- Support branch-specific deployments

---

### 4. GitHub MCP Server ⭐⭐⭐

**Why It's Valuable:**
- Trashcan supports GitHub repository deployments
- Enables repository browsing and management
- Supports workflow automation

**Capabilities:**
- Repository operations
- Issue and PR management
- Code search
- Workflow management
- Release management

**Installation:**
```bash
npm install -g @modelcontextprotocol/server-github
```

**Configuration (.mcp.json):**
```json
{
  "mcpServers": {
    "github": {
      "command": "server-github",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Use Cases in Trashcan:**
- Validate repository URLs during deployment
- Fetch repository metadata
- Automated issue creation for failed deployments
- Integration with CI/CD workflows

---

### 5. HTTP/Fetch MCP Server ⭐⭐⭐

**Why It's Valuable:**
- Health check HTTP requests (Rat module)
- OpenRouter API integration (Fox module)
- Domain DNS verification
- SSL certificate validation

**Capabilities:**
- HTTP/HTTPS requests
- Response inspection
- Header management
- Timeout handling
- Error diagnostics

**Installation:**
```bash
npm install -g @modelcontextprotocol/server-fetch
```

**Configuration (.mcp.json):**
```json
{
  "mcpServers": {
    "fetch": {
      "command": "server-fetch"
    }
  }
}
```

**Use Cases in Trashcan:**
- Automated health checks
- API endpoint testing
- SSL certificate verification
- Domain availability checks

---

## 🎯 Priority 2: Optional Enhancement Servers

### 6. Postgres/Database MCP Server ⭐⭐

**Future Use Case:**
- If Trashcan evolves from JSON to PostgreSQL
- Currently uses JSON-based storage

### 7. Slack/Discord MCP Server ⭐⭐

**Use Case:**
- Notifications for deployments
- Alert on health check failures
- Backup completion notifications

---

## 🤖 GitHub Copilot: Agent Skills & Custom Agents

GitHub Copilot has two distinct agent systems for different environments. **Both are configured** for Trashcan.

### Agent Skills (VS Code / IDE)

**Location:** `.github/skills/`  
**Purpose:** Guide developers while coding in VS Code  
**Format:** `SKILL.md` files  

Agent Skills teach GitHub Copilot Chat how to work with Trashcan patterns when you're coding locally.

**Configured Skills:**

1. **deploy-site** - Site deployment workflow (Opossum module)
2. **docker-operations** - Docker container management (Badger module)
3. **caddy-config** - Caddy reverse proxy configuration
4. **health-checks** - Health monitoring workflow (Rat module)
5. **backup-restore** - Backup and restore operations (Crow module)
6. **ai-diagnostics** - AI-powered troubleshooting (Fox module)

### Custom Agents (GitHub.com)

**Location:** `.github/agents/`  
**Purpose:** Autonomous agents that work on GitHub.com  
**Format:** `.agent.md` files with YAML frontmatter  

Custom Agents work independently to complete tasks assigned through GitHub issues or mentions.

**Configured Agents:**

1. **trashcan-deploy** - Deployment specialist (Opossum) 🦡
   - Deploy new Next.js sites
   - Generate docker-compose.yml and Caddyfile
   - Manage site lifecycle

2. **trashcan-monitor** - Health monitoring specialist (Rat) 🐀
   - Container and HTTP health checks
   - Automated recovery actions
   - Response time monitoring

3. **trashcan-backup** - Backup specialist (Crow) 🦅
   - Create and manage backups
   - Retention policies
   - Safe restore operations

4. **trashcan-dev** - General development (Raccoon) 🦝
   - Full-stack Trashcan development
   - Understands all modules
   - Bun runtime expertise

### Comparison

| Feature | Agent Skills | Custom Agents |
|---------|--------------|---------------|
| **Environment** | VS Code / IDE | GitHub.com |
| **Execution** | Synchronous | Autonomous |
| **Use Case** | Coding guidance | Task completion |
| **Output** | Suggestions | Pull requests |

**Detailed comparison:** See [.github/AGENTS_VS_SKILLS.md](.github/AGENTS_VS_SKILLS.md)

### Directory Structure

```
.github/
├── copilot-instructions.md    # Project conventions
├── mcp-config.json            # MCP server configuration
├── skills/                    # Agent Skills (VS Code)
│   ├── deploy-site/SKILL.md
│   ├── docker-operations/SKILL.md
│   ├── caddy-config/SKILL.md
│   ├── health-checks/SKILL.md
│   ├── backup-restore/SKILL.md
│   └── ai-diagnostics/SKILL.md
└── agents/                    # Custom Agents (GitHub.com)
    ├── trashcan-deploy.agent.md
    ├── trashcan-monitor.agent.md
    ├── trashcan-backup.agent.md
    └── trashcan-dev.agent.md
```

---

## 📝 Agent Skill Examples (VS Code)

These skills guide developers in VS Code. Full files in `.github/skills/`.

### Agent Skill: Deploy Site

**File:** `.github/skills/deploy-site.md`

```markdown
---
name: deploy-site
description: Deploy a new Next.js site with Trashcan using the Opossum module. Generate docker-compose.yml, configure Caddy, and start containers.
---

# Deploy Site Workflow

## Prerequisites
- Docker and Docker Compose installed
- Bun runtime available
- Valid domain name
- Git repository URL (optional)

## Steps

1. **Validate Input**
   - Site name must be lowercase with hyphens (slug format)
   - Domain must be valid FQDN
   - Port must be available (range: 3000-9000)
   - Check if site name already exists in `~/.trashcan/data/sites.json`

2. **Create Site Directory**
   ```bash
   mkdir -p ~/.trashcan/sites/{site-name}/source
   mkdir -p ~/.trashcan/sites/{site-name}/data
   ```

3. **Clone Repository (if --git provided)**
   ```bash
   cd ~/.trashcan/sites/{site-name}/source
   git clone {repo-url} .
   git checkout {branch}  # if --branch provided
   ```

4. **Generate docker-compose.yml**
   - Use YAML format (not JSON)
   - Include Next.js app service
   - Set PORT environment variable dynamically
   - Mount volumes for source and data
   - Connect to `trashcan` network

5. **Update Caddyfile**
   - Add reverse proxy rule for domain
   - Include aliases if provided
   - Generate at `~/.trashcan/caddy/Caddyfile`
   - Reload Caddy container (don't restart)

6. **Add to Database**
   - Create site record in `~/.trashcan/data/sites.json`
   - Generate UUID for id
   - Set status to 'deploying'
   - Include all metadata

7. **Start Containers**
   ```bash
   cd ~/.trashcan/sites/{site-name}
   docker-compose up -d
   ```

8. **Update Status**
   - Set status to 'running' after successful start
   - Set to 'error' if container fails

## Naming Convention
- Use Opossum module: `src/modules/opossum/index.ts`
- Follow trash-animal naming theme

## Example Command
```bash
bun run src/cli/index.ts deploy \
  --name my-nextjs-site \
  --domain mysite.com \
  --git https://github.com/user/nextjs-app.git \
  --port 3000
```

## Error Handling
- Validate all inputs before operations
- Rollback on failure (remove directories, database entry)
- Provide clear error messages with emoji: ❌
- Never leave partial deployments

## Security
- Never expose secrets in logs
- Store environment variables in .env files
- Use Docker secrets where possible
- Validate domain ownership before Let's Encrypt
```

---

## 📝 Agent Skill: Docker Operations

**File:** `.github/skills/docker-operations.md`

```markdown
---
name: docker-operations
description: Manage Docker containers for Trashcan sites. Start, stop, restart, remove containers. Monitor status and logs.
---

# Docker Operations Workflow

## Container Naming Convention
- Site containers: `trashcan-{site-name}`
- Caddy container: `trashcan-caddy`
- Network: `trashcan`

## Operations

### Start Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose up -d
```
- Update database status to 'running'
- Use emoji: 🟢

### Stop Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose stop
```
- Update database status to 'stopped'
- Use emoji: 🔴

### Restart Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose restart
```
- Maintain 'running' status

### Remove Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose down -v  # Remove volumes
```
- Remove site from database
- Remove Caddyfile entry
- Reload Caddy

### View Container Logs
```bash
docker logs -f trashcan-{site-name}
```
- Use Seagull module
- Support tail, follow, since options

### Health Check
```bash
docker ps --filter name=trashcan-{site-name} --format "{{.Status}}"
```
- Use Rat module for automated checks

## Caddy Container Management

### Reload Caddy Configuration
```bash
docker exec trashcan-caddy caddy reload --config /etc/caddy/Caddyfile
```
- NEVER restart Caddy (causes downtime)
- Use reload for config changes

### Restart Caddy (emergency only)
```bash
cd ~/.trashcan/caddy
docker-compose restart
```

## Network Operations

### Create Trashcan Network (if not exists)
```bash
docker network create trashcan
```

### Inspect Network
```bash
docker network inspect trashcan
```

## Error Handling
- Check if Docker daemon is running
- Validate docker-compose.yml syntax
- Handle missing containers gracefully
- Provide actionable error messages

## Performance
- Use `docker-compose` not `docker compose` for compatibility
- Cache container status to reduce API calls
- Batch operations when possible
```

---

## 📝 Agent Skill: Caddy Configuration

**File:** `.github/skills/caddy-config.md`

```markdown
---
name: caddy-config
description: Generate and manage Caddyfile for reverse proxy. Handle automatic HTTPS, domain aliases, and proxy rules.
---

# Caddy Configuration Workflow

## Caddyfile Location
- Path: `~/.trashcan/caddy/Caddyfile`
- Generate dynamically from all sites
- Use Badger module

## Caddyfile Structure

```caddy
# Site: {site-name}
{domain} {
    reverse_proxy trashcan-{site-name}:{port}
}

# Aliases for {site-name}
{alias1}, {alias2} {
    reverse_proxy trashcan-{site-name}:{port}
}
```

## Generation Process

1. **Read All Sites**
   - Load from `~/.trashcan/data/sites.json`
   - Filter only 'running' and 'deploying' sites

2. **Build Caddyfile**
   - Add header comment
   - Generate block for each site
   - Include primary domain
   - Add aliases as comma-separated
   - Use container name as upstream

3. **Write File**
   ```typescript
   await Bun.write(
     '~/.trashcan/caddy/Caddyfile',
     caddyfileContent
   );
   ```

4. **Reload Caddy**
   ```bash
   docker exec trashcan-caddy caddy reload --config /etc/caddy/Caddyfile
   ```

## Automatic HTTPS
- Caddy handles Let's Encrypt automatically
- Requires valid email in config
- Validates domain ownership
- Renews certificates automatically

## Testing Configuration

```bash
docker exec trashcan-caddy caddy validate --config /etc/caddy/Caddyfile
```

## Error Handling
- Validate Caddyfile syntax before reload
- Backup previous Caddyfile
- Rollback on reload failure
- Log all configuration changes

## Security
- Never expose internal ports
- Use HTTPS only (Caddy default)
- Validate domains before adding
- Implement rate limiting if needed

## Example Caddyfile

```caddy
# Trashcan Caddyfile
# Auto-generated - DO NOT EDIT MANUALLY

# Site: my-nextjs-site
mysite.com {
    reverse_proxy trashcan-my-nextjs-site:3000
}

www.mysite.com {
    reverse_proxy trashcan-my-nextjs-site:3000
}

# Site: another-site
another.com {
    reverse_proxy trashcan-another-site:3001
}
```
```

---

## 📝 Agent Skill: Health Checks

**File:** `.github/skills/health-checks.md`

```markdown
---
name: health-checks
description: Automated health monitoring for deployed sites. Check container status, HTTP endpoints, and response times.
---

# Health Checks Workflow

## Check Types

### 1. Container Health
```bash
docker ps --filter name=trashcan-{site-name} --format "{{.Status}}"
```
- Check if container is running
- Verify no restart loops
- Monitor uptime

### 2. HTTP Health
```bash
curl -f -s -o /dev/null -w "%{http_code}" https://{domain}
```
- Expect 200-299 status codes
- Handle redirects
- Timeout after 10 seconds

### 3. Response Time
```bash
curl -w "@curl-format.txt" -o /dev/null -s https://{domain}
```
- Measure time_total
- Alert if > 3 seconds
- Track trends

## Rat Module Implementation

**File:** `src/modules/rat/index.ts`

### Scheduled Checks
- Run every 5 minutes (configurable)
- Store results in `~/.trashcan/data/health-checks.json`

### Data Model
```typescript
interface HealthCheck {
  id: string;
  siteId: string;
  timestamp: Date;
  containerStatus: 'running' | 'stopped' | 'error';
  httpStatus: number | null;
  responseTime: number | null;
  success: boolean;
  error?: string;
}
```

### Alert Conditions
- Container not running: 🔴 CRITICAL
- HTTP status >= 500: 🔴 CRITICAL
- HTTP status >= 400: 🟠 WARNING
- Response time > 3s: 🟡 SLOW
- SSL certificate expiring < 7 days: 🟠 WARNING

### Notification Actions
1. Log to `~/.trashcan/logs/health-checks.log`
2. Update site status in database
3. Trigger Fox AI diagnostics if repeated failures
4. (Optional) Send Slack/Discord notification

## CLI Commands

### Run Manual Check
```bash
bun run src/cli/index.ts rat check my-site
```

### View Health History
```bash
bun run src/cli/index.ts rat history my-site --days 7
```

### View All Failing Sites
```bash
bun run src/cli/index.ts rat status --failing
```

## Error Recovery

### Automatic Actions
- 1 failure: Log warning
- 2 consecutive failures: Alert
- 3 consecutive failures: Attempt restart
- 5 consecutive failures: Mark site as 'error', require manual intervention

### Recovery Commands
```bash
# Automated restart
bun run src/cli/index.ts restart {site-name}

# Run AI diagnostics
bun run src/cli/index.ts fox diagnose {site-name}
```

## Performance
- Use async checks for all sites
- Parallel execution with concurrency limit (10)
- Cache DNS resolution
- Reuse HTTP connections
```

---

## 📝 Agent Skill: Backup & Restore

**File:** `.github/skills/backup-restore.md`

```markdown
---
name: backup-restore
description: Automated backup and restore operations for site data, databases, and configurations.
---

# Backup & Restore Workflow

## Crow Module Implementation

**File:** `src/modules/crow/index.ts`

## Backup Types

### 1. Site Data Backup
- Include: Site configuration, environment variables, volumes
- Exclude: node_modules, .git, build artifacts

### 2. Database Backup
- Backup JSON database files
- Include: sites.json, backups.json, health-checks.json

### 3. Full System Backup
- All sites + global configuration
- Caddy configuration
- Docker volumes

## Backup Location
- Path: `~/.trashcan/backups/{site-name}/{timestamp}.tar.gz`
- Retention: Keep last 7 days by default

## Backup Process

```bash
# 1. Create backup directory
mkdir -p ~/.trashcan/backups/{site-name}

# 2. Archive site data
tar -czf ~/.trashcan/backups/{site-name}/{timestamp}.tar.gz \
  -C ~/.trashcan/sites/{site-name} \
  --exclude=node_modules \
  --exclude=.git \
  .

# 3. Record backup in database
# Add entry to ~/.trashcan/data/backups.json
```

## Data Model

```typescript
interface Backup {
  id: string;
  siteId: string;
  siteName: string;
  timestamp: Date;
  size: number;
  path: string;
  type: 'manual' | 'scheduled';
  status: 'completed' | 'failed';
}
```

## Scheduled Backups

- Daily at 2 AM (configurable)
- Use cron or systemd timer
- Automatic cleanup of old backups

## Restore Process

```bash
# 1. Stop site container
bun run src/cli/index.ts stop {site-name}

# 2. Extract backup
tar -xzf ~/.trashcan/backups/{site-name}/{timestamp}.tar.gz \
  -C ~/.trashcan/sites/{site-name}

# 3. Restart site
bun run src/cli/index.ts start {site-name}

# 4. Verify health
bun run src/cli/index.ts rat check {site-name}
```

## CLI Commands

### Create Backup
```bash
bun run src/cli/index.ts crow backup my-site
```

### List Backups
```bash
bun run src/cli/index.ts crow list my-site
```

### Restore Backup
```bash
bun run src/cli/index.ts crow restore my-site {backup-id}
```

### Cleanup Old Backups
```bash
bun run src/cli/index.ts crow cleanup --days 7
```

## Error Handling
- Verify sufficient disk space before backup
- Handle corrupted backups gracefully
- Always test restore in non-production first
- Keep at least 1 backup always

## Security
- Encrypt backups at rest (optional)
- Exclude sensitive files (.env with secrets)
- Store encryption keys separately
- Implement backup integrity checks
```

---

## 📝 Agent Skill: AI Diagnostics

**File:** `.github/skills/ai-diagnostics.md`

```markdown
---
name: ai-diagnostics
description: Use AI-powered diagnostics to analyze errors, suggest fixes, and generate unified diffs for automated repairs.
---

# AI Diagnostics Workflow

## Fox Module Implementation

**File:** `src/modules/fox/index.ts`

## OpenRouter Integration

### Configuration
- API Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `anthropic/claude-3-sonnet` (default)
- API Key: Stored in `~/.trashcan/config.json`

### Environment Setup
```bash
bun run src/cli/index.ts config set openrouter-api-key {key}
```

## Diagnostic Process

### 1. Collect Context
```typescript
interface DiagnosticContext {
  siteName: string;
  containerLogs: string;      // Last 100 lines
  healthCheckHistory: HealthCheck[];
  dockerComposeYaml: string;
  environmentVars: Record<string, string>;
  errorMessages: string[];
}
```

### 2. AI Analysis Request
```typescript
const prompt = `Analyze this Next.js deployment issue:

Site: ${context.siteName}
Status: ${context.status}

Container Logs:
${context.containerLogs}

Health Check Results:
${context.healthCheckHistory}

Please provide:
1. Root cause analysis
2. Step-by-step fix recommendations
3. Unified diff patches if code changes needed
4. Confidence score (0-1)
`;
```

### 3. Parse AI Response
- Extract analysis
- Parse unified diffs
- Extract confidence scores
- Generate actionable suggestions

### 4. Present to User
```bash
🦊 Fox AI Diagnostics

Analysis:
  Root Cause: Port 3000 already in use
  Confidence: 0.95

Suggestions:
  1. Change port in docker-compose.yml
  2. Stop conflicting service
  
Suggested Fix (Unified Diff):
--- docker-compose.yml
+++ docker-compose.yml
@@ -5,7 +5,7 @@
     environment:
-      - PORT=3000
+      - PORT=3001
     ports:
-      - "3000:3000"
+      - "3001:3001"

Apply fix? [y/N]:
```

## CLI Commands

### Diagnose Site
```bash
bun run src/cli/index.ts fox diagnose my-site
```

### Preview Fix
```bash
bun run src/cli/index.ts fox fix my-site --preview
```

### Apply Fix
```bash
bun run src/cli/index.ts fox fix my-site --apply
```

### Analyze Logs
```bash
bun run src/cli/index.ts fox analyze my-site --logs
```

## Unified Diff Handling

### Parse Diff
```typescript
function parseDiff(diffText: string): FilePatch[] {
  // Parse unified diff format
  // Extract file paths, line numbers, changes
}
```

### Apply Diff
```typescript
function applyDiff(filePath: string, patch: FilePatch): void {
  // Read file
  // Apply patch
  // Write file
  // Verify changes
}
```

### Preview Mode
- Show diffs in color-coded format
- Require explicit user confirmation
- Never auto-apply without review

## Error Categories

### Common Issues
1. **Port Conflicts**: Suggest available ports
2. **Missing Dependencies**: Suggest `bun install`
3. **Build Failures**: Analyze build logs
4. **Environment Variables**: Check for missing vars
5. **Network Issues**: Verify Docker network
6. **SSL Issues**: Check Caddy configuration

## Data Model

```typescript
interface Diagnostic {
  id: string;
  siteId: string;
  timestamp: Date;
  context: DiagnosticContext;
  analysis: string;
  suggestions: string[];
  diffs: UnifiedDiff[];
  confidence: number;
  applied: boolean;
}
```

## Storage
- Save diagnostics to `~/.trashcan/data/diagnostics.json`
- Track success rate of applied fixes
- Learn from user feedback

## Safety
- Always preview before applying
- Create backup before modifying files
- Validate file syntax after changes
- Rollback on failure
- Never modify Docker socket or system files
```

---

## 🔧 Implementation Guide

### Step 1: Configure GitHub Copilot MCP Servers

The MCP server configuration is already set up in `.github/mcp-config.json`. This file is automatically discovered by GitHub Copilot coding agent.

**Location:** `.github/mcp-config.json`

The configuration uses `npx` to install MCP servers on-demand, so no global installation is required.

### Step 2: Configure MCP Servers on GitHub.com (Repository Settings)

For team-wide configuration:

1. Go to your repository on GitHub.com
2. Navigate to **Settings** → **Copilot** → **Coding agent**
3. Add the MCP configuration from `.github/mcp-config.json`
4. Set repository secrets for sensitive values:
   - `COPILOT_MCP_GITHUB_TOKEN` - GitHub personal access token

This ensures all team members using GitHub Copilot have access to the same MCP servers.

### Step 3: Agent Skills (Already Configured ✅)

Agent Skills are already set up in `.github/skills/`:

- `deploy-site/SKILL.md` - Site deployment workflow
- `docker-operations/SKILL.md` - Docker container management
- `caddy-config/SKILL.md` - Caddy reverse proxy configuration
- `health-checks/SKILL.md` - Health monitoring workflow
- `backup-restore/SKILL.md` - Backup and restore operations
- `ai-diagnostics/SKILL.md` - AI-powered troubleshooting

GitHub Copilot coding agent automatically discovers and uses these skills.

### Step 4: Verify Configuration

Check that GitHub Copilot can access the configuration:

1. Open the repository in VS Code or on GitHub.com
2. Use GitHub Copilot Chat
3. Ask: "@workspace What MCP servers are configured?"
4. Ask: "@workspace List available agent skills"

### Step 5: Using Agent Skills with GitHub Copilot

Invoke skills naturally in conversation:

```
You: Deploy a new Next.js site called "my-app" with domain myapp.com
Copilot: [Uses deploy-site skill to guide the process]

You: Check the health of my-app site
Copilot: [Uses health-checks skill to run diagnostics]

You: Create a backup of my-app
Copilot: [Uses backup-restore skill to create backup]
```

---

## 📊 Integration Checklist

- [x] Created `.github/mcp-config.json` with core MCP servers
- [x] Configured Docker MCP for container operations  
- [x] Configured Filesystem MCP for JSON database and configs
- [x] Configured Git MCP for repository cloning
- [x] Configured GitHub MCP for repository integration
- [x] Configured Fetch MCP for health checks
- [x] Created `.github/skills/` directory structure
- [x] Added `deploy-site` Agent Skill
- [x] Added `docker-operations` Agent Skill  
- [x] Added `caddy-config` Agent Skill
- [x] Added `health-checks` Agent Skill
- [x] Added `backup-restore` Agent Skill
- [x] Added `ai-diagnostics` Agent Skill
- [ ] Configure MCP servers in GitHub repository settings (team admin)
- [ ] Add `COPILOT_MCP_GITHUB_TOKEN` repository secret
- [ ] Test GitHub Copilot integration
- [ ] Train team on Agent Skills usage
- [ ] Update team documentation with examples

---

## 🔒 Security Best Practices

### MCP Server Security

1. **Filesystem Access**
   - Restrict to `~/.trashcan/` and project directory
   - Never allow `/` or system directories
   - Validate all file paths

2. **Shell Commands**
   - Whitelist allowed commands
   - Set command timeouts
   - Audit all executions
   - Never allow `sudo` or system modifications

3. **Docker Access**
   - Limit to Trashcan containers only
   - Secure Docker socket access
   - Use read-only mode where possible

4. **API Keys**
   - Store in environment variables
   - Never commit to repository
   - Rotate regularly
   - Use secret management for production

### Agent Skills Security

1. **Never Include Secrets**
   - No API keys in skill files
   - Reference environment variables only
   - Use placeholders like `${API_KEY}`

2. **Validate Inputs**
   - Check all user inputs
   - Sanitize file paths
   - Validate domains and URLs

3. **Least Privilege**
   - Grant minimum required permissions
   - Restrict file access
   - Limit command execution

---

## 📚 Additional Resources

### Official Documentation
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [MCP Servers GitHub](https://github.com/modelcontextprotocol/servers)
- [Docker MCP Integration](https://www.docker.com/blog/mcp-servers-docker-toolkit-cagent-gateway/)
- [GitHub Copilot Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)

### Community Resources
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Market](https://mcpmarket.com/)
- [MCP Server Templates](https://data-everything.github.io/mcp-server-templates/)

### Trashcan-Specific
- [Trashcan SPEC.md](./SPEC.md)
- [Trashcan GitHub Copilot Instructions](./.github/copilot-instructions.md)
- [Trashcan Examples](./EXAMPLES.md)

---

## 🦝 Trash-Animal Theme Alignment

The recommended MCP servers align with Trashcan's trash-animal naming philosophy:

- **Docker MCP** → Supports Opossum (deployment), Badger (proxy), Rat (health), Seagull (logs)
- **Filesystem MCP** → Supports Crow (backups), all modules for JSON database access
- **Git MCP** → Supports Opossum (deployment from repos)
- **GitHub MCP** → Supports integration with GitHub repositories
- **Fetch MCP** → Supports Rat (health checks), Fox (API calls)

---

**Last Updated:** February 8, 2026  
**Maintainer:** Trashcan Development Team  
**Questions?** Open an issue or discussion on GitHub
