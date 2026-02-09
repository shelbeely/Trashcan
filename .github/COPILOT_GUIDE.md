# GitHub Copilot Quick Reference for Trashcan 🦝

This guide shows you how to use GitHub Copilot coding agent with the configured MCP servers and Agent Skills for Trashcan development.

## ✅ What's Already Configured

- **MCP Servers**: Docker, Filesystem, Git, GitHub, Fetch (in `.github/mcp-config.json`)
- **Agent Skills**: 6 specialized skills for common Trashcan workflows (in `.github/skills/`)

## 🚀 Getting Started

### 1. Enable GitHub Copilot

Make sure you have:
- GitHub Copilot subscription
- VS Code with GitHub Copilot extension, OR
- Access to GitHub.com Copilot coding agent

### 2. Open Copilot Chat

**In VS Code:**
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)
- Or click the Copilot icon in the sidebar

**On GitHub.com:**
- Open a pull request or issue
- Click "Copilot" in the top-right corner

## 💬 Using Agent Skills

Agent Skills teach Copilot how to work with Trashcan. Just ask naturally:

### Deploy a Site

```
You: Deploy a new Next.js site called "my-blog" with domain myblog.com from the repo https://github.com/user/nextjs-blog
```

Copilot will use the `deploy-site` skill to:
- Validate inputs
- Create site directories
- Clone the repository
- Generate docker-compose.yml
- Update Caddyfile
- Start containers

### Manage Docker Containers

```
You: Stop the my-blog site
You: Restart all running sites
You: Show logs for my-blog from the last hour
```

Copilot uses the `docker-operations` skill.

### Update Caddy Configuration

```
You: Regenerate the Caddyfile for all active sites
You: Add an alias www.myblog.com to my-blog
```

Copilot uses the `caddy-config` skill.

### Run Health Checks

```
You: Check the health of my-blog
You: Show me all sites with failing health checks
You: What's the response time for my-blog?
```

Copilot uses the `health-checks` skill.

### Create Backups

```
You: Create a backup of my-blog
You: List all backups for my-blog
You: Restore my-blog from the latest backup
```

Copilot uses the `backup-restore` skill.

### AI-Powered Diagnostics

```
You: Diagnose why my-blog is not responding
You: Analyze the errors in my-blog logs
You: Suggest a fix for the deployment failure
```

Copilot uses the `ai-diagnostics` skill (which calls Fox module with OpenRouter API).

## 🛠️ Using MCP Servers Directly

MCP servers give Copilot access to tools. You can ask:

### Docker MCP

```
You: List all Docker containers
You: Show me the status of trashcan-my-blog container
You: Get logs from trashcan-caddy
```

### Filesystem MCP

```
You: Read ~/.trashcan/data/sites.json
You: Show me the structure of ~/.trashcan/sites/my-blog/
You: Update the port in ~/.trashcan/sites/my-blog/docker-compose.yml
```

### Git MCP

```
You: Clone https://github.com/user/nextjs-blog to ~/.trashcan/sites/my-blog/source
You: Check git status in my-blog source directory
You: Pull latest changes for my-blog
```

### GitHub MCP

```
You: Create an issue for deployment failure
You: Search for similar issues in the repository
You: Get the latest release notes
```

### Fetch MCP

```
You: Check if myblog.com is responding
You: Get the HTTP status code for myblog.com
You: Measure response time for myblog.com
```

## 📝 Best Practices

### Be Specific

❌ Bad: "Fix the site"
✅ Good: "Diagnose why my-blog site is returning 502 errors"

### Use Site Names

❌ Bad: "Show logs"
✅ Good: "Show logs for my-blog site from the last hour"

### Confirm Destructive Actions

Copilot will always ask before:
- Deleting sites
- Applying AI-suggested fixes
- Restoring backups
- Stopping production sites

### Trust the Skills

Agent Skills encode best practices:
- Never restart Caddy (always reload)
- Always backup before restore
- Validate inputs before deployment
- Use Bun APIs, not Node.js

## 🔍 Troubleshooting

### Copilot Doesn't See MCP Servers

1. Check that `.github/mcp-config.json` exists
2. Reload VS Code or refresh GitHub.com
3. Ask: "@workspace Show MCP configuration"

### Copilot Doesn't Use Skills

1. Check that `.github/skills/` directory exists with SKILL.md files
2. Ask: "@workspace List available skills"
3. Be explicit: "Use the deploy-site skill to deploy my-app"

### MCP Server Errors

1. Check that required tools are installed (Docker, Git, Bun)
2. Verify permissions for file access
3. Check GitHub token for GitHub MCP

## 📚 Learn More

- [MCP Recommendations](./MCP_RECOMMENDATIONS.md) - Detailed MCP server documentation
- [Agent Skills Guide](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [GitHub Copilot Docs](https://docs.github.com/en/copilot/)
- [Trashcan SPEC](./SPEC.md) - Project architecture and design

## 💡 Example Workflows

### Complete Site Deployment

```
You: I want to deploy a Next.js site
Copilot: I can help with that. What's the site name and domain?
You: Call it my-app with domain myapp.com from https://github.com/user/my-app
Copilot: [Uses deploy-site skill]
       ✅ Created site directories
       ✅ Cloned repository
       ✅ Generated docker-compose.yml
       ✅ Updated Caddyfile
       ✅ Started container
       Site is running at https://myapp.com
```

### Troubleshooting Workflow

```
You: my-app is not working
Copilot: Let me check. [Uses health-checks skill]
       ❌ Container status: stopped
       ❌ HTTP status: unreachable
       
You: Why is it stopped?
Copilot: [Uses docker-operations skill to get logs]
       Error: Port 3000 already in use
       
You: Suggest a fix
Copilot: [Uses ai-diagnostics skill]
       💡 Change port to 3001 in docker-compose.yml
       Here's a unified diff...
       
You: Apply the fix
Copilot: [Applies patch, restarts container]
       ✅ Site is now running on port 3001
```

### Backup and Recovery

```
You: Create a backup of my-app before making changes
Copilot: [Uses backup-restore skill]
       ✅ Backup created: 45.2 MB
       Location: ~/.trashcan/backups/my-app/2026-02-08T230000Z.tar.gz
       
[... make changes ...]

You: Something broke, restore the backup
Copilot: [Uses backup-restore skill]
       🔴 Stopping site
       ⚠️  Extracting backup
       🟢 Starting site
       ✅ Site restored successfully
```

---

**Pro Tip:** The more you use Copilot with these skills, the better it becomes at understanding Trashcan workflows! 🦝
