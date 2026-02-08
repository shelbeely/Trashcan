# MCP Configuration for GitHub Copilot Coding Agent

This file explains the MCP (Model Context Protocol) configuration for Trashcan's GitHub Copilot integration.

## Overview

The MCP configuration in `.github/mcp-config.json` enables GitHub Copilot coding agent to access external tools through standardized MCP servers. This follows the official specification from:
- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp

## Configuration Format

Our configuration follows the official JSON schema:

```json
{
  "mcpServers": {
    "SERVER_NAME": {
      "type": "local",           // Required: "local", "stdio", "http", or "sse"
      "command": "npx",          // Required for local: command to run
      "args": [...],             // Required for local: arguments
      "tools": ["*"],            // Required: tools to enable (* = all)
      "env": {                   // Optional: environment variables
        "VAR_NAME": "$COPILOT_MCP_SECRET_NAME"
      }
    }
  }
}
```

## Key Requirements

### 1. Tools Field (Required)

Per official docs, every MCP server MUST include a `tools` field:

- `["*"]` - Enables all tools from the server
- `["tool1", "tool2"]` - Enables only specific tools
- `[]` - Disables all tools

**Example:**
```json
"docker": {
  "tools": ["*"],  // Enable all Docker tools
  ...
}
```

### 2. Environment Variables

Environment variables must follow specific naming conventions:

- **In Repository Secrets:** Variables must be prefixed with `COPILOT_MCP_`
- **In Configuration:** Reference with `$COPILOT_MCP_VARIABLE_NAME`

**Example:**
```json
"github": {
  "env": {
    "GITHUB_TOKEN": "$COPILOT_MCP_GITHUB_TOKEN"
  }
}
```

To set up:
1. Go to Repository **Settings** → **Environments**
2. Create/edit the **copilot** environment
3. Add secret: `COPILOT_MCP_GITHUB_TOKEN`

### 3. Type Field (Required)

Specifies how the MCP server communicates:

- `"local"` - Local command execution (most common)
- `"stdio"` - Standard input/output (alias for local)
- `"http"` - HTTP server
- `"sse"` - Server-Sent Events

## Our MCP Servers

### Docker MCP
```json
"docker": {
  "type": "local",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-docker"],
  "tools": ["*"],
  "env": {
    "DOCKER_SOCKET": "/var/run/docker.sock"
  }
}
```

**Purpose:** Container lifecycle management for Trashcan sites

**Tools Available:**
- List containers
- Start/stop containers
- View logs
- Execute commands in containers

### Filesystem MCP
```json
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
}
```

**Purpose:** Secure file operations in allowed directories

**Allowed Directories:**
- `~/.trashcan/` - Trashcan data directory
- Repository root - For code changes

**Tools Available:**
- Read/write files
- Create/delete directories
- List directory contents
- Search files

### Git MCP
```json
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
}
```

**Purpose:** Version control operations

**Allowed Directories:**
- `~/.trashcan/sites/` - Site repositories
- Repository root - Main Trashcan repo

**Tools Available:**
- Clone repositories
- Commit changes
- Check status
- View diffs

### GitHub MCP
```json
"github": {
  "type": "local",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "tools": ["*"],
  "env": {
    "GITHUB_TOKEN": "$COPILOT_MCP_GITHUB_TOKEN"
  }
}
```

**Purpose:** GitHub API integration

**Requires:** `COPILOT_MCP_GITHUB_TOKEN` in repository environment

**Tools Available:**
- Create issues/PRs
- Search code
- Manage releases
- View repository info

### Fetch MCP
```json
"fetch": {
  "type": "local",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"],
  "tools": ["*"]
}
```

**Purpose:** HTTP/HTTPS requests

**Tools Available:**
- Make HTTP requests
- Check site availability
- Fetch API data

## Security Considerations

### Tool Access

⚠️ **Warning:** Once configured, Copilot coding agent can use tools autonomously without asking for approval.

**Best Practices:**
- Use `["*"]` only for trusted, read-only servers
- Specify exact tools for servers with write access
- Review tool capabilities before enabling

**Example of restricted access:**
```json
"github": {
  "tools": ["search_code", "get_repository"],  // Read-only tools
  ...
}
```

### Environment Variables

**Secure Pattern:**
```json
"env": {
  "API_KEY": "$COPILOT_MCP_SECRET_NAME"  // ✅ References secret
}
```

**Insecure Pattern:**
```json
"env": {
  "API_KEY": "ghp_actualtoken123"  // ❌ NEVER do this
}
```

### Directory Restrictions

MCP servers should only access:
- Repository directory
- `~/.trashcan/` for Trashcan-specific data
- Site directories under `~/.trashcan/sites/`

**Never allow:**
- System directories (`/etc`, `/usr`, etc.)
- Other user home directories
- Unrestricted filesystem access

## Setup Instructions

### 1. Add Configuration to GitHub.com

1. Go to repository **Settings** → **Copilot** → **Coding agent**
2. Paste contents of `.github/mcp-config.json` in **MCP configuration** field
3. Click **Save**
4. Configuration will be validated

### 2. Set Up Environment (if needed)

For servers requiring secrets (like GitHub MCP):

1. Go to repository **Settings** → **Environments**
2. Create environment named **copilot**
3. Add secrets with `COPILOT_MCP_` prefix:
   - `COPILOT_MCP_GITHUB_TOKEN` - GitHub PAT with repo access

### 3. Verify Configuration

**Test on GitHub.com:**
1. Create an issue
2. Mention `@copilot` with a request that needs MCP tools
3. Copilot should be able to execute the request

**Test in VS Code:**
1. Open Copilot Chat
2. Ask about repository structure (uses filesystem MCP)
3. Should get accurate information

## Troubleshooting

### Configuration Validation Errors

If you get validation errors when saving:

1. **Check JSON syntax** - Use a JSON validator
2. **Verify required fields** - `type`, `command`, `args`, `tools`
3. **Check quotes** - All strings must use double quotes

### MCP Server Not Working

If Copilot can't access MCP tools:

1. **Check environment variables** - Must start with `COPILOT_MCP_`
2. **Verify server installation** - MCP servers install on-demand via `npx`
3. **Check tool names** - Ensure `tools: ["*"]` or correct tool names
4. **Review logs** - Check Copilot agent logs for errors

### Permission Errors

If you get permission errors:

1. **Docker socket** - Ensure Docker is running and accessible
2. **File paths** - Check directories exist and are accessible
3. **GitHub token** - Verify token has required scopes

## References

- [Official MCP Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

## Updates

This configuration follows the official GitHub Copilot MCP specification as of February 2026. Check official documentation for any updates to the specification.
