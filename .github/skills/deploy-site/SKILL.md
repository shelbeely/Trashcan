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

## Boundaries
- Only modify files in ~/.trashcan/ directory
- Never modify system files
- Always validate file paths
- Use Bun APIs, not Node.js APIs
