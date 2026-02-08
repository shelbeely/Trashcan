# Additional MCP Servers & Agent Skills for Trashcan

Based on research of GitHub and the internet, here are recommended MCP servers and Agent Skills that complement your existing Context7 and Next.js MCPs.

## 🎯 Executive Summary

You mentioned already using:
- **Context7 MCP** - Documentation and code context
- **Next.js MCP** - Next.js development support

Current Trashcan MCP servers:
- Docker, Filesystem, Git, GitHub, Fetch

**Recommended additions:** 3 high-value MCP servers + 2 additional Agent Skills

---

## 🚀 Highly Recommended MCP Servers

### 1. Bun MCP Server ⭐⭐⭐⭐⭐

**Why Essential for Trashcan:**
- Trashcan uses **Bun** runtime (not Node.js)
- Native TypeScript execution and optimization
- Perfect for managing Bun-based deployments

**Capabilities:**
- Execute Bun scripts (`bun run`, `bun install`, `bun test`)
- Build and bundle optimization
- Performance benchmarking
- Process management for Bun servers
- Hot reload and development workflows

**Installation:**
```json
{
  "mcpServers": {
    "bun": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@carlosedp/mcp-bun"],
      "tools": ["*"]
    }
  }
}
```

**Use Cases in Trashcan:**
- Run Bun build commands during deployment
- Execute site initialization scripts
- Performance analysis of deployed apps
- Automated testing before deployment
- Package management for dependencies

**References:**
- [MCP Bun Server on LobeHub](https://lobehub.com/mcp/carlosedp-mcp-bun)
- [MCP Bun Server on MCPMarket](https://mcpmarket.com/server/bun)

---

### 2. Caddy MCP Server ⭐⭐⭐⭐⭐

**Why Essential for Trashcan:**
- Trashcan uses **Caddy** for reverse proxy
- Automate Caddyfile generation and updates
- SSL certificate management

**Capabilities:**
- Retrieve and update Caddy configuration programmatically
- Convert between Caddyfile, JSON, YAML formats
- Monitor reverse proxy upstreams
- Manage SSL/TLS certificates via API
- Force certificate renewal
- Check ACME status

**Installation:**
```json
{
  "mcpServers": {
    "caddy": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "caddy-mcp"],
      "tools": ["*"],
      "env": {
        "CADDY_ADMIN_URL": "http://127.0.0.1:2019"
      }
    }
  }
}
```

**Use Cases in Trashcan:**
- Automate Caddyfile updates when deploying sites
- Verify SSL certificate status
- Convert Caddyfile to JSON for validation
- Monitor reverse proxy health
- Reload Caddy configuration programmatically

**Current Workaround:** Trashcan currently uses Docker exec to reload Caddy. The Caddy MCP server would provide safer, more programmatic control.

**References:**
- [Caddy MCP Server on GitHub](https://github.com/lum8rjack/caddy-mcp)
- [Caddy MCP on LobeHub](https://lobehub.com/mcp/cabooman-caddy-mcp)

---

### 3. Prometheus MCP Server ⭐⭐⭐⭐

**Why Valuable for Trashcan:**
- Enhance **Rat module** (health checks) with metrics
- Real-time monitoring and alerting
- Historical performance analysis

**Capabilities:**
- Query Prometheus metrics via PromQL
- Natural language metric queries
- Health check endpoints
- Alert rule management
- Time-series data analysis
- Service discovery monitoring

**Installation:**
```json
{
  "mcpServers": {
    "prometheus": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "prometheus-mcp-server"],
      "tools": ["*"],
      "env": {
        "PROMETHEUS_URL": "http://localhost:9090"
      }
    }
  }
}
```

**Use Cases in Trashcan:**
- Collect container metrics (CPU, memory, network)
- Monitor site response times
- Track deployment success rates
- Alert on resource exhaustion
- Visualize historical performance

**Integration with Rat Module:**
- Current: Container status + HTTP checks
- Enhanced: + CPU usage, memory pressure, disk I/O, network stats

**Optional Setup:**
```bash
# Add Prometheus to Trashcan stack
docker run -d \
  --name trashcan-prometheus \
  --network trashcan \
  -p 9090:9090 \
  -v ~/.trashcan/prometheus:/etc/prometheus \
  prom/prometheus
```

**References:**
- [Prometheus MCP Server on GitHub](https://github.com/pab1it0/prometheus-mcp-server)
- [AWS Blog: Prometheus MCP](https://aws.amazon.com/blogs/mt/prometheus-mcp-server-ai-driven-monitoring-intelligence-for-aws-users/)

---

## 📚 Additional Agent Skills Recommendations

### 1. CI/CD Pipeline Skill

**Purpose:** Integrate with GitHub Actions for automated deployments

**Skill Name:** `ci-cd-integration`

**Why Useful:**
- Automate deployment triggers
- Monitor workflow status
- Handle deployment rollbacks
- Integrate with Opossum module

**Example SKILL.md:**
```markdown
---
name: ci-cd-integration
description: Integrate Trashcan deployments with GitHub Actions CI/CD pipelines. Monitor workflows, trigger deployments, handle rollbacks.
---

# CI/CD Integration Workflow

## Deploy on Push
1. Create `.github/workflows/deploy-trashcan.yml`
2. On push to main, trigger Opossum deployment
3. Use GitHub MCP to monitor workflow status
4. Report deployment success/failure

## Rollback on Failure
1. Detect failed deployment via Rat health checks
2. Use Crow backup to restore previous version
3. Notify via GitHub issue

## Commands
- Monitor workflows: Use GitHub MCP `list_workflow_runs`
- Get logs: Use GitHub MCP `get_job_logs`
- Trigger deployment: Call Opossum `deploy` method
```

---

### 2. Log Analysis Skill

**Purpose:** Analyze container logs with AI assistance

**Skill Name:** `log-analysis`

**Why Useful:**
- Faster debugging with Seagull module
- Pattern recognition in logs
- Error classification
- Integration with Fox AI diagnostics

**Example SKILL.md:**
```markdown
---
name: log-analysis
description: Analyze Docker container logs for deployed sites. Identify errors, patterns, and performance issues using Seagull and Fox modules.
---

# Log Analysis Workflow

## Fetch Logs
Use Seagull module to get container logs:
```bash
bun run src/cli/index.ts seagull view {site-name} --lines 1000
```

## Analyze with Fox
1. Extract error patterns
2. Identify stack traces
3. Correlate with deployment events
4. Suggest fixes using OpenRouter AI

## Common Patterns
- Next.js hydration errors
- Port binding failures
- Environment variable issues
- Database connection timeouts

## Integration
- Docker MCP: Fetch logs
- Fox module: AI analysis
- GitHub MCP: Create issues for recurring errors
```

---

## 🎯 Priority Matrix

| MCP Server | Priority | Effort | Value | Ready for Production |
|------------|----------|--------|-------|---------------------|
| **Bun** | ⭐⭐⭐⭐⭐ | Low | Very High | Yes |
| **Caddy** | ⭐⭐⭐⭐⭐ | Medium | Very High | Yes |
| **Prometheus** | ⭐⭐⭐⭐ | Medium | High | Yes (requires Prometheus setup) |

| Agent Skill | Priority | Effort | Value |
|-------------|----------|--------|-------|
| **CI/CD Integration** | ⭐⭐⭐⭐ | Medium | High |
| **Log Analysis** | ⭐⭐⭐ | Low | Medium |

---

## 🔧 Implementation Plan

### Phase 1: Core Enhancements (High Value, Low Effort)

1. **Add Bun MCP Server** (30 minutes)
   - Update `.github/mcp-config.json`
   - Test with `bun run` commands
   - Document in skills

2. **Add Caddy MCP Server** (1 hour)
   - Update MCP configuration
   - Test Caddyfile retrieval
   - Integrate with Badger module

### Phase 2: Monitoring Enhancement (Medium Effort)

3. **Add Prometheus MCP Server** (2-3 hours)
   - Set up Prometheus container
   - Configure scrape targets
   - Update Rat module integration

### Phase 3: Advanced Skills (Optional)

4. **Create CI/CD Integration Skill** (2 hours)
   - Write SKILL.md
   - Add workflow examples
   - Test with sample deployment

5. **Create Log Analysis Skill** (1 hour)
   - Write SKILL.md
   - Integrate with Seagull and Fox
   - Add common patterns

---

## 📋 Updated MCP Configuration

Here's how your `.github/mcp-config.json` would look with all recommendations:

```json
{
  "mcpServers": {
    "docker": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"],
      "tools": ["*"],
      "env": {
        "DOCKER_SOCKET": "/var/run/docker.sock"
      }
    },
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/runner/.trashcan",
        "/home/runner/work/Trashcan/Trashcan"
      ],
      "tools": ["*"]
    },
    "git": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "/home/runner/.trashcan/sites",
        "/home/runner/work/Trashcan/Trashcan"
      ],
      "tools": ["*"]
    },
    "github": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "tools": ["*"],
      "env": {
        "GITHUB_TOKEN": "$COPILOT_MCP_GITHUB_TOKEN"
      }
    },
    "fetch": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "tools": ["*"]
    },
    "bun": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@carlosedp/mcp-bun"],
      "tools": ["*"],
      "description": "Bun runtime management for TypeScript/JavaScript execution"
    },
    "caddy": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "caddy-mcp"],
      "tools": ["*"],
      "env": {
        "CADDY_ADMIN_URL": "http://127.0.0.1:2019"
      },
      "description": "Caddy reverse proxy configuration and SSL management"
    },
    "prometheus": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "prometheus-mcp-server"],
      "tools": ["*"],
      "env": {
        "PROMETHEUS_URL": "http://localhost:9090"
      },
      "description": "Metrics collection and monitoring integration"
    }
  }
}
```

---

## 🔍 Why These Specific Servers?

### Alignment with Trashcan Architecture

1. **Bun MCP** → Trashcan uses Bun runtime (not Node.js)
2. **Caddy MCP** → Trashcan uses Caddy for reverse proxy
3. **Prometheus MCP** → Enhances existing Rat health check module

### Complementing Existing MCPs

- **Context7** (documentation) + **Bun** (execution) = Complete dev workflow
- **Next.js MCP** (framework) + **Bun** (runtime) = Deployment optimization
- **Docker MCP** (containers) + **Prometheus** (metrics) = Full observability

### Integration with Trash-Animal Modules

| Module | Enhanced By |
|--------|-------------|
| Opossum (Deploy) | Bun MCP - execute build scripts |
| Badger (Reverse Proxy) | Caddy MCP - programmatic config |
| Rat (Health) | Prometheus MCP - detailed metrics |
| Seagull (Logs) | Bun MCP - analyze Bun errors |
| Crow (Backup) | All - better automation |
| Fox (AI) | All - more context for diagnostics |

---

## 🚫 Servers NOT Recommended (and Why)

### Kubernetes MCP
**Why Not:** Trashcan uses Docker Compose, not Kubernetes. Would add unnecessary complexity.

### Database MCPs (PostgreSQL, MongoDB)
**Why Not:** Trashcan uses JSON file storage. If you migrate to a database, reconsider this.

### AWS/Azure Cloud MCPs
**Why Not:** Trashcan is designed for self-hosted environments. Cloud MCPs add vendor lock-in.

### Slack/Discord MCPs
**Why Not:** Nice-to-have but not core to hosting panel functionality. Add later if needed.

---

## 📚 Additional Resources

### MCP Server Directories
- [Awesome MCP Servers](https://mcp-awesome.com/)
- [GitHub: Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Market](https://mcpmarket.com/)

### Agent Skills Examples
- [Anthropic Skills Repo](https://github.com/anthropics/skills)
- [GitHub Awesome Copilot](https://github.com/github/awesome-copilot)

### Bun Resources
- [Building High-Performance MCP Servers with Bun](https://dev.to/gorosun/building-high-performance-mcp-servers-with-bun-a-complete-guide-32nj)
- [Best MCP Servers 2026](https://www.builder.io/blog/best-mcp-servers-2026)

---

## ✅ Next Steps

1. **Review this document** - Decide which servers to add
2. **Phase 1 implementation** - Add Bun and Caddy MCPs (highest value)
3. **Test integration** - Verify with existing modules
4. **Update documentation** - Add to `MCP_RECOMMENDATIONS.md`
5. **Phase 2 implementation** - Add Prometheus if monitoring is needed
6. **Create new skills** - CI/CD and Log Analysis
7. **Share with team** - Update `COPILOT_GUIDE.md`

---

## 💡 Pro Tips

1. **Start with Bun MCP** - It's essential for your Bun-based architecture
2. **Caddy MCP next** - Removes manual Caddyfile editing
3. **Prometheus is optional** - Only if you want advanced metrics beyond Docker stats
4. **Test each addition** - Add one server at a time, verify it works
5. **Update Agent Skills** - Teach Copilot how to use the new servers

---

## 🎉 Expected Benefits

After implementing these recommendations:

✅ **Faster deployments** - Bun MCP automates build steps
✅ **Safer configuration** - Caddy MCP validates before applying
✅ **Better monitoring** - Prometheus MCP provides detailed metrics
✅ **Improved AI assistance** - More tools for Copilot to use
✅ **Reduced manual work** - Automation of repetitive tasks

**Total setup time:** 4-6 hours for all recommendations
**Maintenance:** Minimal - MCP servers auto-update via npx

---

**Questions or suggestions?** Open an issue or discussion on the Trashcan repository!
