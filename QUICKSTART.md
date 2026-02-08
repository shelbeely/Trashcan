# Quick Start Guide

Get Trashcan up and running in 5 minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ **Docker** (and Docker daemon running)
- ✅ **Docker Compose**
- ✅ **Bun runtime** (for building from source)

## Step 1: Build Trashcan

```bash
# Clone the repository
git clone https://github.com/shelbeely/Trashcan.git
cd Trashcan

# Build the single binary
bun run build

# The binary is now at: dist/trashcan
```

## Step 2: Install Trashcan

```bash
# Run the installation script
./install.sh

# Or manually copy to /usr/local/bin
sudo cp dist/trashcan /usr/local/bin/trashcan
sudo chmod +x /usr/local/bin/trashcan
```

## Step 3: Initialize Trashcan

```bash
# Initialize with your email for Let's Encrypt SSL certificates
trashcan init admin@yourdomain.com
```

This creates:
- Configuration at `~/.trashcan/config.json`
- Database at `~/.trashcan/data/`
- Caddy reverse proxy container

## Step 4: Deploy Your First Site

### Option A: Deploy from Git Repository

```bash
trashcan deploy \
  --name my-blog \
  --domain blog.yourdomain.com \
  --git https://github.com/yourusername/nextjs-blog.git
```

### Option B: Deploy from Local Directory

```bash
# Copy your Next.js app to the site directory
mkdir -p ~/.trashcan/sites/my-app/source
cp -r /path/to/your/nextjs-app/* ~/.trashcan/sites/my-app/source/

# Deploy
trashcan deploy \
  --name my-app \
  --domain app.yourdomain.com
```

## Step 5: Verify Deployment

```bash
# Check site status
trashcan list

# View detailed information
trashcan info my-blog

# Check logs
trashcan logs my-blog

# Check health
trashcan health my-blog
```

## Step 6: Configure DNS

Point your domain to your server:

```
Type: A
Name: blog.yourdomain.com
Value: YOUR_SERVER_IP
TTL: 300
```

Caddy will automatically provision an SSL certificate via Let's Encrypt!

## Common Commands

```bash
# List all sites
trashcan list

# Start/stop a site
trashcan stop my-blog
trashcan start my-blog
trashcan restart my-blog

# View logs (last 100 lines)
trashcan logs my-blog --lines 100

# Create a backup
trashcan backup my-blog

# Run AI diagnostics
trashcan diagnose my-blog

# Remove a site
trashcan remove my-blog
```

## Next Steps

1. **Set up backups**: Configure automatic backups in `~/.trashcan/config.json`
2. **Add monitoring**: Health checks run automatically every 30 seconds
3. **Configure AI**: Add your OpenRouter API key for AI diagnostics:

```bash
# Edit config
nano ~/.trashcan/config.json

# Add your OpenRouter API key:
{
  "openrouter": {
    "apiKey": "sk-or-v1-...",
    "model": "anthropic/claude-3-sonnet"
  }
}
```

## Troubleshooting

### Docker not running?
```bash
# Start Docker daemon
sudo systemctl start docker
```

### Port 80/443 already in use?
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services (e.g., nginx, apache)
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### Site not building?
```bash
# Check logs for errors
trashcan logs my-site

# Check Docker logs directly
docker logs trashcan-my-site
```

### SSL certificate not working?
```bash
# Ensure DNS is configured
dig blog.yourdomain.com

# Check Caddy logs
docker logs trashcan-caddy

# Restart Caddy
docker restart trashcan-caddy
```

## Architecture Overview

```
┌─────────────────┐
│   Your Domain   │
│  (with SSL)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Caddy Proxy    │ ← Automatic HTTPS with Let's Encrypt
│  (Port 80/443)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Docker Network │
│   "trashcan"    │
└────────┬────────┘
         │
         ├─────► Site 1 Container (Port 3000)
         ├─────► Site 2 Container (Port 3001)
         └─────► Site 3 Container (Port 3002)
```

## Useful Resources

- [Full Documentation](README.md)
- [Examples](EXAMPLES.md)
- [Specification](SPEC.md)
- [Docker Documentation](https://docs.docker.com/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## Getting Help

If you encounter issues:

1. Check the logs: `trashcan logs <site-name>`
2. Review the [EXAMPLES.md](EXAMPLES.md) file
3. Open an issue on GitHub

Happy deploying! 🦝
