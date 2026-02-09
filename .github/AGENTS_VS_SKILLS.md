# GitHub Copilot: Agent Skills vs Custom Agents

Understanding the difference between these two GitHub Copilot features for Trashcan.

## 🔄 Two Different Systems

GitHub Copilot has **two separate agent systems** that work in different environments:

### 1. Agent Skills (VS Code / IDE)
**Location:** `.github/skills/`  
**Format:** `SKILL.md` files  
**Environment:** Your local IDE (VS Code, JetBrains, etc.)  
**Purpose:** Teach Copilot Chat how to work with your codebase in the IDE

### 2. Custom Agents (GitHub.com)
**Location:** `.github/agents/`  
**Format:** `.agent.md` files with YAML frontmatter  
**Environment:** GitHub.com platform (autonomous agent)  
**Purpose:** Create specialized autonomous agents that work on issues and PRs

## 📊 Comparison Table

| Feature | Agent Skills | Custom Agents |
|---------|--------------|---------------|
| **Location** | `.github/skills/` | `.github/agents/` |
| **File Format** | `SKILL.md` | `.agent.md` with YAML frontmatter |
| **Environment** | VS Code, IDEs | GitHub.com |
| **Execution** | Synchronous (with developer) | Asynchronous (autonomous) |
| **Use Case** | Guide developer workflows | Complete tasks independently |
| **Tools Access** | Via IDE extensions | Via MCP servers |
| **Output** | Suggestions, code snippets | Pull requests, commits |

## 🎯 Trashcan Implementation

We've implemented **both systems** to cover all use cases:

### Agent Skills (IDE Development)

```
.github/skills/
├── deploy-site/SKILL.md
├── docker-operations/SKILL.md
├── caddy-config/SKILL.md
├── health-checks/SKILL.md
├── backup-restore/SKILL.md
└── ai-diagnostics/SKILL.md
```

**When to use:** Working in VS Code, need guidance on Trashcan patterns

**Example:**
```
You: [In VS Code Copilot Chat] Deploy a new site called my-blog
Copilot: [Uses deploy-site skill to guide you through the process]
```

### Custom Agents (Autonomous Tasks)

```
.github/agents/
├── trashcan-deploy.agent.md      # Deploy specialist (Opossum)
├── trashcan-monitor.agent.md     # Health check specialist (Rat)
├── trashcan-backup.agent.md      # Backup specialist (Crow)
└── trashcan-dev.agent.md         # General development
```

**When to use:** Assign tasks to Copilot on GitHub.com, automated PR creation

**Example:**
```
GitHub Issue: "Add health monitoring for my-blog site"
→ Assign to @copilot
→ Copilot uses trashcan-monitor agent
→ Creates PR with health check implementation
```

## 🔧 MCP Servers (Shared by Both)

**Location:** `.github/mcp-config.json`

Both systems use the same MCP servers for tools:
- Docker MCP
- Filesystem MCP  
- Git MCP
- GitHub MCP
- Fetch MCP

## 📖 Usage Examples

### Using Agent Skills in VS Code

1. Open VS Code with Copilot extension
2. Open Copilot Chat (`Ctrl+Shift+I`)
3. Ask: "@workspace Deploy a Next.js site"
4. Copilot uses `deploy-site` skill to guide you

### Using Custom Agents on GitHub.com

1. Open an issue or PR on GitHub
2. Mention `@copilot` or assign issue to Copilot
3. Copilot chooses appropriate agent (e.g., `trashcan-deploy`)
4. Works autonomously to complete task
5. Creates PR or commits changes
6. Requests your review

## 🎨 Trash-Animal Alignment

Both systems follow Trashcan's trash-animal theme:

**Agent Skills:** Reference modules by name
- deploy-site → Opossum module
- docker-operations → Badger module
- health-checks → Rat module
- backup-restore → Crow module
- ai-diagnostics → Fox module

**Custom Agents:** Named after the animals
- trashcan-deploy → 🦡 Opossum agent
- trashcan-monitor → 🐀 Rat agent
- trashcan-backup → 🦅 Crow agent
- trashcan-dev → 🦝 Raccoon agent (general)

## 🚀 When to Use Which?

### Use Agent Skills (IDE) when:
- ✅ Developing code locally in VS Code
- ✅ Need guidance on Trashcan patterns
- ✅ Want code suggestions and completions
- ✅ Working synchronously with AI assistance

### Use Custom Agents (GitHub.com) when:
- ✅ Want autonomous task completion
- ✅ Assigning straightforward issues to AI
- ✅ Need PRs created automatically
- ✅ Want work to happen in background
- ✅ Prefer GitHub-based collaboration

## 📚 Documentation

- **Agent Skills Guide:** `.github/COPILOT_GUIDE.md`
- **Custom Agents Details:** This file
- **MCP Recommendations:** `MCP_RECOMMENDATIONS.md`
- **Project Instructions:** `.github/copilot-instructions.md`

## 🔒 Configuration Requirements

### For Agent Skills (VS Code)
- Install GitHub Copilot extension
- `.github/mcp-config.json` is auto-discovered
- Skills in `.github/skills/` are auto-loaded

### For Custom Agents (GitHub.com)
- GitHub Copilot Pro, Business, or Enterprise subscription
- Agents in `.github/agents/` are auto-discovered
- MCP servers configured in repository settings (optional)
- Repository must have Copilot enabled

## 💡 Best Practices

1. **Use descriptive names:** Both skills and agents should have clear names
2. **Be specific:** Provide detailed instructions and examples
3. **Set boundaries:** Define what agents must and must not do
4. **Include examples:** Show good vs bad outputs
5. **Follow conventions:** Use Trashcan's trash-animal naming
6. **Keep updated:** Maintain both as codebase evolves

## 🆘 Troubleshooting

### Agent Skills not working?
- Check VS Code Copilot extension is installed and active
- Verify `.github/skills/` directory exists with `SKILL.md` files
- Try: `@workspace List available skills`

### Custom Agents not working?
- Verify GitHub Copilot subscription is active
- Check `.github/agents/` directory exists with `.agent.md` files
- Ensure YAML frontmatter is valid
- Try mentioning `@copilot` in an issue

### MCP Servers not accessible?
- Check `.github/mcp-config.json` exists and is valid JSON
- Verify required tokens are set (e.g., `COPILOT_MCP_GITHUB_TOKEN`)
- For GitHub.com: Configure in Settings → Copilot → Coding agent

## 🎯 Summary

**Two systems, one goal:** Make AI assistance available everywhere you work.

- **Agent Skills** = IDE companion (sync, guidance)
- **Custom Agents** = GitHub automaton (async, autonomous)

Both leverage MCP servers, both follow Trashcan conventions, both make development faster! 🦝
