---
name: backup-restore
description: Automated backup and restore operations using Crow module. Handle site data, configurations, and Docker volumes.
---

# Backup & Restore Workflow

## Crow Module Implementation

Use `src/modules/crow/index.ts` for all backup/restore operations.

## Backup Process

```bash
# Create backup directory
mkdir -p ~/.trashcan/backups/{site-name}

# Archive site data
tar -czf ~/.trashcan/backups/{site-name}/{timestamp}.tar.gz \
  -C ~/.trashcan/sites/{site-name} \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  .
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

## Restore Process

```bash
# 1. Stop site
bun run src/cli/index.ts stop {site-name}

# 2. Extract backup
tar -xzf ~/.trashcan/backups/{site-name}/{timestamp}.tar.gz \
  -C ~/.trashcan/sites/{site-name}

# 3. Restart site
bun run src/cli/index.ts start {site-name}

# 4. Verify
bun run src/cli/index.ts rat check {site-name}
```

## CLI Commands

- `crow backup my-site` - Create backup
- `crow list my-site` - List backups
- `crow restore my-site {backup-id}` - Restore backup
- `crow cleanup --days 7` - Cleanup old backups

## Boundaries
- Only backup files in ~/.trashcan/
- Never backup system files
- Validate backup integrity after creation
- Use Bun.spawn() for tar operations
