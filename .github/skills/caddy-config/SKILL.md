---
name: caddy-config
description: Generate and manage Caddyfile for reverse proxy using Badger module. Handle automatic HTTPS, domain aliases, and proxy rules.
---

# Caddy Configuration Workflow

## Caddyfile Location
- Path: `~/.trashcan/caddy/Caddyfile`
- Generate dynamically from all active sites
- Use Badger module: `src/modules/badger/index.ts`

## Caddyfile Structure

```caddy
# Site: {site-name}
{domain} {
    reverse_proxy trashcan-{site-name}:{port}
}

# Aliases
{alias1}, {alias2} {
    reverse_proxy trashcan-{site-name}:{port}
}
```

## Generation Process

1. Read all sites from `~/.trashcan/data/sites.json`
2. Filter only 'running' and 'deploying' sites
3. Generate block for each site
4. Write file using `Bun.write()`
5. Reload Caddy with: `docker exec trashcan-caddy caddy reload --config /etc/caddy/Caddyfile`

## Automatic HTTPS
- Caddy handles Let's Encrypt automatically
- Requires valid email in config
- Validates domain ownership
- Renews certificates automatically

## Boundaries
- Only modify Caddyfile in ~/.trashcan/caddy/
- Never modify system-level Caddy configuration
- Always use Bun.write() for file operations
- Validate all domain names
