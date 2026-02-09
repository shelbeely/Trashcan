# MCP & Agent Skills for Building Trashcan

This document explains how MCP servers and Agent Skills are configured to help **develop and build Trashcan itself** - not for using Trashcan to deploy sites.

## 🎯 Purpose

**What these tools do:**
- ✅ Help **build** the Trashcan CLI binary
- ✅ Help **develop** new Trashcan modules
- ✅ Help **test** the Trashcan codebase
- ✅ Help **debug** Trashcan CLI issues

**What these tools DON'T do:**
- ❌ Deploy sites using Trashcan (that's what Trashcan itself does)
- ❌ Manage Docker containers at runtime
- ❌ Configure Caddy for deployed sites

---

## 🔧 MCP Servers (for Development)

Located in: `.github/mcp-config.json`

### 1. Filesystem MCP

**Purpose:** Access Trashcan source code

**Configured for:**
- `/home/runner/work/Trashcan/Trashcan` - Repository root only

**Use cases:**
- Read TypeScript source files
- Edit module code
- Update configuration files
- Create new files

### 2. Git MCP

**Purpose:** Version control for Trashcan repository

**Configured for:**
- `/home/runner/work/Trashcan/Trashcan` - Repository only

**Use cases:**
- Commit changes to Trashcan code
- Check repository status
- View diffs
- Manage branches

### 3. GitHub MCP

**Purpose:** Interact with Trashcan repository on GitHub

**Use cases:**
- Create issues for bugs/features
- Manage pull requests
- View repository information
- Search Trashcan code

**Requires:** `COPILOT_MCP_GITHUB_TOKEN` environment variable

### 4. Bun MCP ⭐ NEW

**Purpose:** Execute Bun commands for building/testing Trashcan

**Use cases:**
- **Build:** `bun build src/cli/index.ts --compile --outfile dist/trashcan`
- **Test:** `bun test`
- **Run:** `bun run src/cli/index.ts [command]`
- **Install:** `bun install`

**Why essential:** Trashcan uses Bun runtime (not Node.js)

---

## 📚 Agent Skills (for Development)

Located in: `.github/skills/`

### 1. build-trashcan

**Purpose:** Build the Trashcan CLI binary

**What it teaches Copilot:**
- How to compile TypeScript to binary
- Build command: `bun build src/cli/index.ts --compile --outfile dist/trashcan`
- Build troubleshooting
- Binary optimization

**When to use:**
- "Build Trashcan"
- "Compile the CLI"
- "Create binary executable"

### 2. test-trashcan

**Purpose:** Run Trashcan's test suite

**What it teaches Copilot:**
- How to run tests: `bun test`
- Test file structure
- Writing new tests
- Coverage reports

**When to use:**
- "Run tests"
- "Test my changes"
- "Check if tests pass"

### 3. develop-module

**Purpose:** Create new trash-animal modules

**What it teaches Copilot:**
- Trash-animal naming convention
- Module structure pattern
- Manager class pattern
- Integration with CLI

**When to use:**
- "Create new module called Pigeon"
- "Add functionality for notifications"
- "Develop new feature"

### 4. debug-cli

**Purpose:** Debug Trashcan CLI issues

**What it teaches Copilot:**
- Run in development mode
- Common error patterns
- Debugging techniques
- VSCode breakpoints

**When to use:**
- "Debug this error"
- "CLI command not working"
- "Fix this bug"

---

## 🤖 Custom Agents (for Development)

Located in: `.github/agents/`

### 1. trashcan-builder

**Specialization:** Building and compiling

**Assign for:**
- "Build Trashcan CLI"
- "Create release build"
- "Fix compilation errors"
- "Optimize binary size"

**What it does:**
1. Cleans previous builds
2. Runs `bun build --compile`
3. Verifies binary works
4. Reports build status

### 2. trashcan-tester

**Specialization:** Testing

**Assign for:**
- "Run test suite"
- "Add tests for new feature"
- "Fix failing tests"
- "Generate coverage report"

**What it does:**
1. Runs `bun test`
2. Analyzes failures
3. Fixes or adds tests
4. Reports results

### 3. trashcan-dev

**Specialization:** General development

**Assign for:**
- "Add new module"
- "Fix bug in Opossum"
- "Refactor code"
- "Add CLI command"

**What it does:**
1. Analyzes request
2. Reviews existing patterns
3. Implements changes
4. Adds tests
5. Creates PR

---

## 🚀 Usage Examples

### Building Trashcan

**In VS Code (using Agent Skills):**
```
You: [Copilot Chat] Build the Trashcan CLI
Copilot: [Uses build-trashcan skill]
         I'll help you build Trashcan. Running:
         bun build src/cli/index.ts --compile --outfile dist/trashcan
```

**On GitHub.com (using Custom Agents):**
```
Issue: "Build Trashcan for release v1.0.0"
→ Assign to @copilot
→ Uses trashcan-builder agent
→ Creates PR with compiled binary
```

### Testing Changes

**In VS Code:**
```
You: Run tests before I commit
Copilot: [Uses test-trashcan skill]
         Running: bun test
         All tests passed! ✅
```

**On GitHub.com:**
```
Issue: "Add tests for new Pigeon module"
→ Assign to @copilot (trashcan-tester)
→ Creates test file with examples
→ Creates PR
```

### Creating New Module

**In VS Code:**
```
You: Create a new module called Pigeon for notifications
Copilot: [Uses develop-module skill]
         I'll create a new trash-animal module...
```

**On GitHub.com:**
```
Issue: "Develop Pigeon module for email notifications"
→ Assign to @copilot (trashcan-dev)
→ Creates module structure
→ Adds CLI integration
→ Creates PR
```

---

## 🔄 Development Workflow

### 1. Code Changes (with Copilot)

```bash
# In VS Code with Copilot
You: Add a --force flag to the deploy command

# Copilot helps write the code using:
# - Context7 MCP (documentation)
# - Next.js MCP (if relevant)
# - develop-module skill (patterns)
```

### 2. Test Changes

```bash
# Via Copilot
You: Test my changes

# Copilot uses:
# - test-trashcan skill
# - Bun MCP to run: bun test
```

### 3. Build Binary

```bash
# Via Copilot
You: Build the CLI

# Copilot uses:
# - build-trashcan skill
# - Bun MCP to run: bun build --compile
```

### 4. Commit & Push

```bash
# Via Copilot
You: Commit these changes

# Copilot uses:
# - Git MCP (commit)
# - GitHub MCP (create PR)
```

---

## 📊 Comparison: Before vs After

### Before (Misunderstanding)

| Tool | Configuration | Purpose |
|------|---------------|---------|
| Docker MCP | `/var/run/docker.sock` | Manage deployed sites |
| Filesystem MCP | `~/.trashcan/` | Access site data |
| Git MCP | `~/.trashcan/sites/` | Clone site repos |
| Skills | deploy-site, docker-ops | Use Trashcan tool |

**Problem:** Configured for **using** Trashcan to deploy sites

### After (Correct Understanding)

| Tool | Configuration | Purpose |
|------|---------------|---------|
| Bun MCP | Repository | Build/test Trashcan |
| Filesystem MCP | Repository only | Edit source code |
| Git MCP | Repository only | Version control |
| Skills | build, test, develop | Develop Trashcan |

**Correct:** Configured for **building** the Trashcan tool itself

---

## 🎓 Key Concepts

### Context7 MCP (You Already Have)

**What it provides:**
- Documentation for libraries you use
- Code examples and patterns
- Best practices

**How it helps build Trashcan:**
- Bun API documentation
- TypeScript patterns
- Module development examples

### Next.js MCP (You Already Have)

**What it provides:**
- Next.js framework documentation
- Since Trashcan deploys Next.js apps, understanding Next.js helps

**How it helps build Trashcan:**
- Understanding what Trashcan users need
- Better deployment features
- Troubleshooting deployed apps

### Bun MCP (New)

**What it provides:**
- Execute Bun commands
- Build TypeScript code
- Run tests
- Manage dependencies

**How it helps build Trashcan:**
- **Critical:** Trashcan uses Bun runtime
- Build CLI binary
- Run test suite
- Development workflow

---

## 🛠️ Setup Instructions

### 1. MCP Servers (Already Configured ✅)

The `.github/mcp-config.json` is ready to use. GitHub Copilot will automatically discover it.

### 2. Environment Variables

Only needed for GitHub MCP:

1. Go to Repository Settings → Environments
2. Create **copilot** environment
3. Add secret: `COPILOT_MCP_GITHUB_TOKEN`

### 3. Verify Setup

**In VS Code:**
1. Open Copilot Chat
2. Ask: "What skills are available?"
3. Should see: build-trashcan, test-trashcan, develop-module, debug-cli

**On GitHub.com:**
1. Create test issue
2. Mention `@copilot`
3. Should have access to Bun MCP and skills

---

## 💡 Pro Tips

### For VS Code Development

1. **Ask specific questions:**
   - ❌ "Help me"
   - ✅ "Build Trashcan CLI using Bun"

2. **Reference skills:**
   - "Use build-trashcan skill to compile"
   - "Run tests with test-trashcan skill"

3. **Leverage MCPs:**
   - Copilot has access to your source code (Filesystem MCP)
   - Can execute Bun commands (Bun MCP)
   - Can commit changes (Git MCP)

### For GitHub.com Autonomous Work

1. **Clear issue titles:**
   - ❌ "Fix stuff"
   - ✅ "Build Trashcan binary for v1.0.0 release"

2. **Assign the right agent:**
   - Build tasks → @copilot (trashcan-builder)
   - Testing → @copilot (trashcan-tester)
   - New features → @copilot (trashcan-dev)

3. **Let agents work:**
   - Agents will create PRs
   - Review their changes
   - Provide feedback if needed

---

## 🔍 Troubleshooting

### Copilot Not Using Skills

**Check:**
1. Files exist in `.github/skills/`
2. Each has proper YAML frontmatter
3. VS Code Copilot extension updated

### Bun MCP Not Working

**Check:**
1. Bun is installed: `bun --version`
2. MCP config has correct path
3. Can run manually: `bun build ...`

### Agent Not Responding

**Check:**
1. Issue assigned to @copilot
2. Issue has clear description
3. Repository has MCP config

---

## 📚 Additional Resources

- **Bun Documentation:** https://bun.sh/docs
- **GitHub Copilot Agents:** https://docs.github.com/en/copilot/
- **MCP Specification:** https://modelcontextprotocol.io/
- **Trashcan Development:** See `.github/copilot-instructions.md`

---

## ✅ Summary

**Purpose:** MCP servers and Agent Skills help **build Trashcan**, not use it

**Tools:**
- Bun MCP - Build/test Trashcan (essential!)
- Filesystem MCP - Edit source code
- Git MCP - Version control
- GitHub MCP - Repository management

**Skills:**
- build-trashcan - Compile CLI binary
- test-trashcan - Run test suite
- develop-module - Create modules
- debug-cli - Fix issues

**Agents:**
- trashcan-builder - Building specialist
- trashcan-tester - Testing specialist
- trashcan-dev - General development

Everything is focused on the **development workflow** for the Trashcan project itself! 🦝
