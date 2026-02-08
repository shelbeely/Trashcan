---
name: docker-operations
description: Manage Docker containers for Trashcan sites. Start, stop, restart, remove containers. Monitor status and logs using Badger module.
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

### Stop Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose stop
```

### Restart Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose restart
```

### Remove Site Container
```bash
cd ~/.trashcan/sites/{site-name}
docker-compose down -v
```

### View Container Logs
```bash
docker logs -f trashcan-{site-name}
```
- Use Seagull module: `src/modules/seagull/index.ts`

### Reload Caddy (Preferred)
```bash
docker exec trashcan-caddy caddy reload --config /etc/caddy/Caddyfile
```
- NEVER restart Caddy (causes downtime)
- Always use reload for config changes

## Boundaries
- Only manage containers with `trashcan-` prefix
- Never modify Docker daemon configuration
- Validate all container names before operations
