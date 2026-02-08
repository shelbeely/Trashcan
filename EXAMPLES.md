# Trashcan Examples

## Example 1: Deploy a Simple Next.js Site

```bash
# Initialize Trashcan
trashcan init admin@example.com

# Deploy from a Git repository
trashcan deploy \
  --name my-blog \
  --domain blog.example.com \
  --git https://github.com/yourusername/nextjs-blog.git

# Check the status
trashcan list
trashcan info my-blog
```

## Example 2: Deploy with Custom Port and Environment Variables

```bash
trashcan deploy \
  --name api-service \
  --domain api.example.com \
  --port 4000 \
  --env '{"DATABASE_URL":"postgresql://...","API_KEY":"secret123"}'
```

## Example 3: Deploy with Multiple Domains (Aliases)

```bash
trashcan deploy \
  --name main-app \
  --domain example.com \
  --aliases www.example.com,app.example.com
```

## Example 4: Monitor and Maintain a Site

```bash
# View logs
trashcan logs my-blog --lines 200

# Check health
trashcan health my-blog

# Create a backup
trashcan backup my-blog

# Restart the site
trashcan restart my-blog
```

## Example 5: AI-Powered Diagnostics

```bash
# Run AI diagnostics on a site with errors
trashcan diagnose my-blog

# The AI will analyze logs and suggest fixes
# Preview a suggested fix:
trashcan preview-fix my-blog <fix-id>

# Apply the fix:
trashcan apply-fix my-blog <fix-id>
```

## Example 6: Backup and Restore Workflow

```bash
# Create a backup before making changes
trashcan backup my-blog

# Make changes to your site...

# If something goes wrong, restore from backup
trashcan restore my-blog <backup-id>
```

## Example 7: Managing Multiple Sites

```bash
# Deploy multiple sites
trashcan deploy --name site1 --domain site1.com
trashcan deploy --name site2 --domain site2.com
trashcan deploy --name site3 --domain site3.com

# List all sites
trashcan list

# Get health status for all
trashcan health site1
trashcan health site2
trashcan health site3

# Create backups for all
trashcan backup site1
trashcan backup site2
trashcan backup site3
```

## Example 8: Development Workflow

```bash
# Deploy a staging site
trashcan deploy \
  --name myapp-staging \
  --domain staging.myapp.com \
  --git https://github.com/user/myapp.git \
  --branch develop

# Deploy production site
trashcan deploy \
  --name myapp-prod \
  --domain myapp.com \
  --git https://github.com/user/myapp.git \
  --branch main
```

## Directory Structure After Setup

After running `trashcan init`, your home directory will have:

```
~/.trashcan/
├── config.json              # Global configuration
│   └── Contains OpenRouter API key, Caddy email, etc.
├── data/                    # JSON database files
│   ├── sites.json          # All site configurations
│   ├── backups.json        # Backup metadata
│   ├── health-checks.json  # Health check history
│   └── diagnostics.json    # AI diagnostic history
├── sites/                   # Site-specific directories
│   ├── my-blog/
│   │   ├── docker-compose.yml  # Container configuration
│   │   ├── .env                # Environment variables
│   │   ├── source/             # Your application code
│   │   └── data/               # Persistent data
│   └── api-service/
│       └── ...
├── backups/                 # Backup storage
│   ├── my-blog/
│   │   ├── backup-2024-01-01.tar.gz
│   │   └── backup-2024-01-02.tar.gz
│   └── api-service/
│       └── ...
├── logs/                    # Centralized logs
│   ├── trashcan.log
│   └── sites/
│       ├── my-blog.log
│       └── api-service.log
└── caddy/                   # Reverse proxy
    ├── Caddyfile            # Auto-generated configuration
    └── docker-compose.yml   # Caddy container setup
```

## Common Commands Reference

### Site Management
- `trashcan init [email]` - Initialize Trashcan
- `trashcan deploy` - Deploy a new site
- `trashcan list` - List all sites
- `trashcan info <name>` - Show site details
- `trashcan start <name>` - Start a site
- `trashcan stop <name>` - Stop a site
- `trashcan restart <name>` - Restart a site
- `trashcan remove <name>` - Remove a site

### Monitoring
- `trashcan logs <name>` - View logs
- `trashcan health <name>` - Check health

### Backup & Restore
- `trashcan backup <name>` - Create backup
- `trashcan restore <name> <id>` - Restore backup

### AI Assistant
- `trashcan diagnose <name>` - AI diagnostics

### Information
- `trashcan version` - Show version
- `trashcan help [command]` - Show help

## Troubleshooting

### Site won't start
```bash
# Check logs for errors
trashcan logs my-site

# Check Docker status
docker ps -a | grep trashcan

# Try restarting
trashcan restart my-site
```

### SSL certificate issues
```bash
# Ensure email is configured
cat ~/.trashcan/config.json

# Check Caddy logs
docker logs trashcan-caddy

# Verify DNS is pointing to your server
```

### AI diagnostics not working
```bash
# Add OpenRouter API key to config
nano ~/.trashcan/config.json

# Add your key:
{
  "openrouter": {
    "apiKey": "sk-or-v1-..."
  }
}
```
