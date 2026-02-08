---
name: health-checks
description: Automated health monitoring for deployed sites using Rat module. Check container status, HTTP endpoints, and response times.
---

# Health Checks Workflow

## Rat Module Implementation

Use `src/modules/rat/index.ts` for all health check operations.

## Check Types

### 1. Container Health
```bash
docker ps --filter name=trashcan-{site-name} --format "{{.Status}}"
```

### 2. HTTP Health Check
```bash
curl -f -s -o /dev/null -w "%{http_code}" https://{domain}
```
- Expect 200-299 for success
- Timeout after 10 seconds

### 3. Response Time
```bash
curl -w "%{time_total}" -o /dev/null -s https://{domain}
```
- Alert if > 3 seconds

## Data Model

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

## Alert Conditions

- 🔴 CRITICAL: Container not running
- 🔴 CRITICAL: HTTP status >= 500
- 🟠 WARNING: HTTP status >= 400
- 🟡 SLOW: Response time > 3s
- 🟢 HEALTHY: All checks passing

## Error Recovery

- 1 failure: Log warning
- 2 consecutive: Alert
- 3 consecutive: Attempt restart
- 5 consecutive: Mark as 'error'

## Boundaries
- Only check sites in ~/.trashcan/data/sites.json
- Never modify configurations during checks
- Handle network errors gracefully
