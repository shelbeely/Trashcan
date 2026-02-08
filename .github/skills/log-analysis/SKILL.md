---
name: log-analysis
description: Analyze Docker container logs for deployed Trashcan sites. Identify errors, patterns, and performance issues using Seagull module, Docker MCP, and Fox AI diagnostics.
---

# Log Analysis Workflow

Analyze container logs in Trashcan deployments.

## Quick Access

```bash
# View recent logs
bun run src/cli/index.ts seagull view {site-name}

# Tail in real-time
bun run src/cli/index.ts seagull view {site-name} --follow

# Last 100 lines
bun run src/cli/index.ts seagull view {site-name} --lines 100
```

## Common Error Patterns

### Next.js Hydration Errors
Pattern: `Error: Hydration failed`
Solution: Use `useEffect` for client-only code

### Port Binding Failures
Pattern: `EADDRINUSE: address already in use`
Solution: Choose different port

### Environment Variables
Pattern: `process is not defined`
Solution: Add missing variables to .env

### Memory Issues
Pattern: `JavaScript heap out of memory`
Solution: Increase container memory limit

## AI-Powered Analysis

```bash
# Analyze with Fox AI
bun run src/cli/index.ts fox diagnose {site-name}
```

Fox will:
1. Extract error patterns
2. Correlate with deployment events
3. Suggest fixes
4. Generate unified diffs

## Integration

- **Seagull**: Log viewer
- **Docker MCP**: Direct log access
- **Fox**: AI analysis
- **Rat**: Trigger analysis on health check failures
