# Awesome Lists Analysis for Trashcan Development

Analysis of three major awesome lists to identify relevant MCP servers and Agent Skills for **building and developing Trashcan**.

## Sources Analyzed

1. **[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)** - Official skills from Anthropic, Vercel, Cloudflare, HuggingFace, Stripe, Trail of Bits, and community
2. **[heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills)** - Curated skills collection with detailed documentation
3. **[punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)** - Comprehensive MCP servers directory (500+ servers)

---

## Executive Summary

**Already Using:**
- ✅ Bun MCP - Essential for Trashcan's Bun-based build
- ✅ Filesystem MCP - Repository access
- ✅ Git MCP - Version control
- ✅ GitHub MCP - Repository management
- ✅ Context7 MCP - Documentation (user mentioned)
- ✅ Next.js MCP - Framework knowledge (user mentioned)

**High-Value Additions for Building Trashcan:**
1. **Testing MCP** - Test automation and verification
2. **Code Review Skills** - Quality assurance patterns
3. **TypeScript MCP** - Type checking and validation
4. **Documentation Generator** - Auto-generate docs from code

---

## Recommended MCP Servers

### 1. Testing & Quality Assurance

#### Playwright MCP ⭐⭐⭐⭐⭐
**Source:** VoltAgent awesome-agent-skills (Anthropic official)

**Why Essential:**
- Test Trashcan CLI commands
- Verify build process
- End-to-end testing
- UI testing (if Trashcan adds web UI)

**Installation:**
```json
{
  "playwright": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-playwright"],
    "tools": ["*"]
  }
}
```

**Use Cases:**
- Test CLI commands: `bun run src/cli/index.ts deploy --help`
- Verify error messages
- Test interactive prompts
- Validate command outputs

**From:** anthropics/webapp-testing skill

---

#### Memory MCP ⭐⭐⭐⭐
**Source:** punkpeye/awesome-mcp-servers

**Why Useful:**
- Store build patterns
- Remember common errors
- Track development decisions
- Document solutions

**Installation:**
```json
{
  "memory": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "tools": ["*"]
  }
}
```

**Use Cases:**
- Remember "Why did we choose Bun over Node.js?"
- Store "Common build errors and solutions"
- Track "Module naming conventions"

---

### 2. Code Quality & Analysis

#### TypeScript/ESLint MCP ⭐⭐⭐⭐
**Source:** Community servers in awesome-mcp-servers

**Why Useful:**
- Type checking during development
- Lint code automatically
- Fix common issues
- Enforce code quality

**Alternative:** Use Bun MCP with `bun run tsc --noEmit`

**Use Cases:**
- Check types before committing
- Auto-fix linting issues
- Validate imports
- Ensure code consistency

---

### 3. Documentation

#### README Generator MCP ⭐⭐⭐
**Source:** Community patterns

**Why Useful:**
- Keep README.md updated
- Generate module documentation
- Create API references
- Update examples

**Use Cases:**
- Auto-update README when adding modules
- Generate EXAMPLES.md from code
- Create module documentation
- Keep docs in sync with code

---

### 4. Development Workflow

#### Sequential Thinking MCP ⭐⭐⭐⭐⭐
**Source:** punkpeye/awesome-mcp-servers

**Why Essential:**
- Break down complex tasks
- Plan before coding
- Structured problem-solving
- Better code quality

**Installation:**
```json
{
  "sequential-thinking": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    "tools": ["*"]
  }
}
```

**Use Cases:**
- Plan new module implementation
- Debug complex issues
- Refactor code systematically
- Design new features

---

#### Everart MCP (Code Execution) ⭐⭐⭐
**Source:** awesome-mcp-servers aggregators

**Why Useful:**
- Execute code snippets safely
- Test algorithms
- Prototype quickly
- Validate logic

**Use Cases:**
- Test Bun code snippets
- Prototype new utilities
- Validate JSON parsing
- Test regex patterns

---

## Recommended Agent Skills

### 1. Code Review Skill ⭐⭐⭐⭐⭐

**Based on:** Sentry's code-review skill, Trail of Bits security skills

**What it teaches:**
```markdown
---
name: code-review-trashcan
description: Review Trashcan code changes for quality, security, and conventions. Focus on Bun APIs, trash-animal naming, ES modules, and zero dependencies.
---

# Trashcan Code Review

## Review Checklist

### 1. Bun Conventions
- ✅ Uses Bun.file(), not fs.readFileSync()
- ✅ Uses Bun.write(), not fs.writeFileSync()
- ✅ ES modules (import/export), not require()
- ✅ No Node.js APIs

### 2. Trash-Animal Naming
- ✅ Module names use trash/urban animals
- ✅ Emojis match animal theme
- ✅ Manager class pattern followed

### 3. Code Quality
- ✅ TypeScript types defined
- ✅ Async/await used correctly
- ✅ Error handling with TrashcanError
- ✅ No external dependencies added

### 4. Security
- ✅ No hardcoded credentials
- ✅ Input validation present
- ✅ File paths sanitized
- ✅ No command injection risks

### 5. Testing
- ✅ Tests added for new features
- ✅ Tests pass: bun test
- ✅ Edge cases covered

## Common Issues

**Using Node.js APIs:**
```typescript
// ❌ Don't use
import fs from 'fs';
const data = fs.readFileSync('file.txt', 'utf-8');

// ✅ Do use
const file = Bun.file('file.txt');
const data = await file.text();
```

**Missing Trash-Animal Names:**
```typescript
// ❌ Generic name
class NotificationManager {}

// ✅ Trash-animal name
class PigeonManager {} // 🐦
```

**External Dependencies:**
```typescript
// ❌ Adding dependencies
import axios from 'axios';

// ✅ Use Bun's fetch
const response = await fetch(url);
```
```

**Create as:** `.github/skills/code-review-trashcan/SKILL.md`

---

### 2. Module Creation Workflow ⭐⭐⭐⭐⭐

**Enhanced version of our develop-module skill**

**Based on:** Vercel composition-patterns, HuggingFace tool-builder patterns

```markdown
---
name: module-creation-workflow
description: Complete workflow for creating new Trashcan modules following best practices, testing, and integration.
---

# Module Creation Workflow

Step-by-step process for adding new modules to Trashcan.

## Phase 1: Planning

1. **Choose Trash-Animal Name**
   - Available: Pigeon, Squirrel, Coyote, Bear, Magpie, Gull
   - Must thrive in urban/human environments
   - Check name not already used

2. **Define Purpose**
   - Single responsibility
   - Clear use case
   - Fits Trashcan's mission

3. **Plan Integration**
   - CLI command design
   - Database changes needed
   - Type definitions required

## Phase 2: Implementation

1. **Create Module Structure**
   ```bash
   mkdir -p src/modules/pigeon
   touch src/modules/pigeon/index.ts
   ```

2. **Implement Manager Class**
   ```typescript
   import { getDatabase } from '../../core/db/index.ts';
   
   export class PigeonManager {
     private db = getDatabase();
     
     async notify(message: string): Promise<void> {
       console.log(`🐦 Pigeon: ${message}`);
       // Implementation
     }
   }
   ```

3. **Add Types** (if needed)
   ```typescript
   // src/types/index.ts
   export interface PigeonNotification {
     id: string;
     message: string;
     timestamp: Date;
   }
   ```

## Phase 3: Testing

1. **Create Test File**
   ```bash
   touch test/modules/pigeon.test.ts
   ```

2. **Write Tests**
   ```typescript
   import { describe, test, expect } from 'bun:test';
   import { PigeonManager } from '../../src/modules/pigeon/index.ts';
   
   describe('PigeonManager', () => {
     test('sends notification', async () => {
       const pigeon = new PigeonManager();
       await pigeon.notify('test');
       // Assertions
     });
   });
   ```

3. **Run Tests**
   ```bash
   bun test test/modules/pigeon.test.ts
   ```

## Phase 4: CLI Integration

1. **Add Command**
   ```typescript
   // src/cli/index.ts
   this.commands.set('pigeon', {
     name: 'pigeon',
     description: '🐦 Send notifications',
     usage: 'trashcan pigeon <message>',
     action: this.pigeonCommand.bind(this)
   });
   ```

2. **Implement Handler**
   ```typescript
   private async pigeonCommand(args: string[]): Promise<void> {
     const pigeon = new PigeonManager();
     await pigeon.notify(args[0]);
   }
   ```

## Phase 5: Documentation

1. **Update README.md**
   - Add to features list
   - Add emoji 🐦
   - Add description

2. **Update EXAMPLES.md**
   - Add usage examples
   - Show common use cases

3. **Add JSDoc Comments**
   ```typescript
   /**
    * Send a notification message
    * @param message - The message to send
    */
   async notify(message: string): Promise<void> {}
   ```

## Phase 6: Verification

1. **Build Test**
   ```bash
   bun run build
   ./dist/trashcan pigeon --help
   ```

2. **Integration Test**
   ```bash
   bun run dev pigeon "Test message"
   ```

3. **Full Test Suite**
   ```bash
   bun test
   ```

## Checklist

- [ ] Trash-animal name chosen
- [ ] Purpose clearly defined
- [ ] Module structure created
- [ ] Manager class implemented
- [ ] Types added (if needed)
- [ ] Tests written and passing
- [ ] CLI command added
- [ ] Documentation updated
- [ ] Build succeeds
- [ ] Integration tests pass
```

**Create as:** `.github/skills/module-creation-workflow/SKILL.md`

---

### 3. Debugging Workflow ⭐⭐⭐⭐

**Based on:** Trail of Bits differential-review, Sentry find-bugs patterns

```markdown
---
name: debugging-workflow-trashcan
description: Systematic approach to debugging Trashcan CLI issues using Bun's tools and sequential thinking.
---

# Debugging Workflow for Trashcan

## Quick Debug Process

1. **Reproduce the Issue**
   ```bash
   bun run dev [failing-command]
   ```

2. **Check TypeScript Errors**
   ```bash
   bun run tsc --noEmit
   ```

3. **Add Debug Logging**
   ```typescript
   console.log('Debug:', { variable, state });
   ```

4. **Use Bun's Inspector**
   ```bash
   bun --inspect run src/cli/index.ts [command]
   ```

## Systematic Debugging

### Step 1: Gather Information
- What command failed?
- What was the error message?
- What was the expected behavior?
- Can you reproduce it?

### Step 2: Isolate the Issue
- Does it happen with all commands or just one?
- Does it happen with specific inputs?
- Is it a build issue or runtime issue?

### Step 3: Check Recent Changes
```bash
git log --oneline -10
git diff HEAD~1
```

### Step 4: Verify Environment
```bash
bun --version
which bun
node --version  # Should NOT be used!
```

### Step 5: Test in Isolation
```typescript
// test/debug.test.ts
import { test } from 'bun:test';
import { ProblematicFunction } from '../src/modules/module/index.ts';

test('debug specific function', () => {
  // Reproduce issue in isolation
});
```

## Common Trashcan Issues

### Issue: "Cannot find module"
**Cause:** Import path wrong or missing .ts extension
**Solution:**
```typescript
// ❌ Wrong
import { Module } from '../modules/module';

// ✅ Correct
import { Module } from '../modules/module/index.ts';
```

### Issue: "Command not found"
**Cause:** Command not registered in CLI
**Solution:**
```typescript
// Check src/cli/index.ts
this.commands.set('command-name', {
  name: 'command-name',
  // ...
});
```

### Issue: "Database file not found"
**Cause:** Database not initialized
**Solution:**
```bash
bun run dev init --email user@example.com
```

### Issue: "Build fails"
**Cause:** TypeScript errors
**Solution:**
```bash
# Check errors
bun run tsc --noEmit

# Fix errors, then rebuild
bun run build
```

## Using Sequential Thinking

When debugging complex issues:

1. Break down the problem
2. Form hypotheses
3. Test each hypothesis
4. Eliminate possibilities
5. Find root cause
6. Implement fix
7. Verify fix
8. Prevent recurrence

## Prevention

1. **Write Tests First**
   - Catch issues early
   - Document expected behavior

2. **Use TypeScript Strictly**
   - Enable strict mode
   - No `any` types

3. **Review Before Committing**
   - Run tests: `bun test`
   - Check types: `bun run tsc --noEmit`
   - Test build: `bun run build`

4. **Document Edge Cases**
   - Add comments for tricky logic
   - Explain assumptions
```

**Create as:** `.github/skills/debugging-workflow-trashcan/SKILL.md`

---

### 4. Documentation Maintenance ⭐⭐⭐

**Based on:** Sentry agents-md skill, internal-comms patterns

```markdown
---
name: documentation-maintenance
description: Keep Trashcan documentation synchronized with code changes. Update README, EXAMPLES, and module docs.
---

# Documentation Maintenance

Keep documentation in sync with code.

## Files to Maintain

1. **README.md** - Project overview and quick start
2. **EXAMPLES.md** - Usage examples
3. **SPEC.md** - Technical specification  
4. **DEVELOPMENT_WORKFLOW.md** - Development guide
5. **Module docs** - Individual module documentation

## When to Update

### Adding New Module

**README.md:**
```markdown
- **🐦 Pigeon** - Send notifications via email/SMS
```

**EXAMPLES.md:**
```bash
# Send notification
bun run dev pigeon "Deployment complete"

# Schedule notification
bun run dev pigeon schedule "Daily backup" --cron "0 0 * * *"
```

### Changing CLI Commands

Update help text, usage examples, and command reference.

### Adding Features

Document new features with:
- Description
- Usage example
- Common use cases
- Troubleshooting

### Fixing Bugs

Add to troubleshooting section if it's a common issue.

## Documentation Style

### Command Examples
```bash
# Use actual working commands
bun run dev deploy --name my-site --domain example.com

# Show output
🚀 Deploying my-site...
✅ Deployment successful!
```

### Code Examples
```typescript
// Show complete, working code
import { PigeonManager } from './modules/pigeon/index.ts';

const pigeon = new PigeonManager();
await pigeon.notify('Hello!');
```

### Emojis
Use consistently:
- 🦝 Raccoon - CLI
- 🦡 Opossum - Deployment  
- 🦡 Badger - Reverse proxy
- 🐦 Seagull - Logs
- 🐀 Rat - Health checks
- 🦅 Crow - Backups
- 🦊 Fox - AI diagnostics

## Maintenance Checklist

- [ ] README.md updated with new features
- [ ] EXAMPLES.md has working examples
- [ ] SPEC.md reflects architecture changes
- [ ] Module docs match implementation
- [ ] CLI help text is current
- [ ] Troubleshooting section updated
- [ ] Links work (no broken links)
- [ ] Code examples are tested
```

**Create as:** `.github/skills/documentation-maintenance/SKILL.md`

---

## Implementation Priority

### Phase 1: Essential (Immediate)
1. ✅ **Bun MCP** - Already have
2. ✅ **Development Skills** - Already created (build, test, develop, debug)
3. 🆕 **Sequential Thinking MCP** - Better planning
4. 🆕 **Memory MCP** - Remember decisions

### Phase 2: Quality (Next Sprint)
5. 🆕 **Code Review Skill** - Quality assurance
6. 🆕 **Module Creation Workflow** - Enhanced process
7. 🆕 **Debugging Workflow** - Systematic debugging

### Phase 3: Polish (Future)
8. 🆕 **Playwright MCP** - If adding UI testing
9. 🆕 **Documentation Maintenance** - Keep docs current
10. 🆕 **README Generator** - Auto-generate docs

---

## Updated MCP Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/runner/work/Trashcan/Trashcan"],
      "tools": ["*"]
    },
    "git": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "/home/runner/work/Trashcan/Trashcan"],
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
    "bun": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@carlosedp/mcp-bun"],
      "tools": ["*"]
    },
    "sequential-thinking": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "tools": ["*"]
    },
    "memory": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "tools": ["*"]
    }
  }
}
```

---

## Skills Not Recommended (and Why)

### Docker/Container Skills ❌
**Why:** Trashcan doesn't need Docker during development. Docker is used by deployed sites, not for building Trashcan.

### Cloud Platform MCPs ❌
**Why:** Trashcan is designed for self-hosted environments. No AWS/GCP/Azure needed.

### Database MCPs ❌
**Why:** Trashcan uses JSON file storage, not databases.

### Web Scraping/API MCPs ❌
**Why:** Not relevant to building a CLI tool.

### Social Media MCPs ❌
**Why:** Not part of development workflow.

---

## Key Insights from Awesome Lists

### 1. Official Skills Are Battle-Tested
- Anthropic's official skills (docx, xlsx, pdf) show best practices
- Vercel's React patterns demonstrate quality standards
- Trail of Bits security skills show thorough reviews

### 2. Development Workflow Patterns
- Sequential thinking improves code quality
- Memory helps with consistency
- Code review catches issues early

### 3. Testing Is Critical
- Playwright for UI testing
- Bun test for unit tests
- Integration tests before builds

### 4. Documentation Matters
- Keep docs in sync with code
- Use working examples
- Update continuously

---

## Resources

### Awesome Lists
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- [heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills)
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)

### Official Documentation
- [Anthropic Skills](https://github.com/anthropics/skills)
- [MCP Specification](https://modelcontextprotocol.io/)
- [GitHub Copilot Skills](https://docs.github.com/copilot/concepts/agents/about-agent-skills)

### Trashcan Documentation
- `.github/DEVELOPMENT_WORKFLOW.md` - How we use MCP/Skills
- `.github/copilot-instructions.md` - Project conventions
- `.github/skills/` - Our current skills

---

## Summary

**What We're Adding:**
1. Sequential Thinking MCP - Better planning
2. Memory MCP - Remember decisions
3. Enhanced skills - Code review, module creation, debugging, documentation

**What We're Keeping:**
- Bun MCP (essential)
- Filesystem/Git/GitHub MCPs
- Context7 & Next.js MCPs (user has these)
- Current development skills

**What We're NOT Adding:**
- Docker/Cloud/Database MCPs (not for building)
- Social media/API MCPs (not relevant)
- Runtime tools (focus on development)

**Result:**
Focused development environment for building Trashcan with minimal tools and maximum productivity! 🦝
