---
name: ci-cd-integration
description: Integrate Trashcan deployments with GitHub Actions CI/CD pipelines. Monitor workflows, trigger deployments, handle rollbacks using GitHub MCP and Trashcan modules.
---

# CI/CD Integration Workflow

Automate Trashcan deployments using GitHub Actions and GitHub MCP server integration.

## Deployment Workflow

### Create GitHub Actions Workflow

`.github/workflows/deploy-trashcan.yml`:

```yaml
name: Deploy to Trashcan

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - name: Deploy
        run: |
          bun run src/cli/index.ts deploy \
            --name my-site \
            --domain mysite.com \
            --git ${{ github.repository }} \
            --port 3000
```

## Monitor with GitHub MCP

Use GitHub MCP to check deployment status:
- `list_workflow_runs` - Get workflow history
- `get_job_logs` - Fetch logs for debugging

## Rollback Strategy

```bash
# Health check fails → Automatic rollback
bun run src/cli/index.ts crow restore my-site --latest
```

## Integration Points

- **Opossum**: Deployment
- **Rat**: Post-deployment health checks
- **Crow**: Pre-deployment backups
- **Fox**: Failure analysis
