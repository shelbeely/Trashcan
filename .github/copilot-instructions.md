# Trashcan GitHub Copilot Instructions

## Project Overview

Trashcan is a single-binary CLI hosting panel for Bun+Next.js applications. It uses Docker for containerization, Caddy for reverse proxy with automatic Let's Encrypt SSL, and integrates with OpenRouter for AI-powered diagnostics.

## Trash-Animal Naming Convention 🦝

**CRITICAL**: All components MUST use trash/urban animal names. These animals thrive in human environments and represent resilience and adaptability.

### Core Modules (Already Implemented)
- **Raccoon** - Main CLI entry point (`src/cli/index.ts`) - master scavengers
- **Opossum** - Site deployment system (`src/modules/opossum/`) - resilient survivors
- **Badger** - Reverse proxy manager (`src/modules/badger/`) - persistent & protective
- **Seagull** - Log viewer (`src/modules/seagull/`) - always watching
- **Rat** - Health check system (`src/modules/rat/`) - ultimate survivors
- **Crow** - Backup system (`src/modules/crow/`) - collectors & hoarders
- **Fox** - AI assistant (`src/modules/fox/`) - clever problem-solvers
- **Skunk** - SSL/Security manager (integrated in Badger) - self-protective

### Naming Guidelines
- New features should use similar trash-animal names (e.g., Pigeon, Squirrel, Coyote, Bear)
- Variable names should reflect the animal theme where appropriate
- Functions should be descriptive but can reference the animal metaphor
- Example: `OpossumManager` for deployment, `SeagullManager` for logs

## Technology Stack

### Runtime & Language
- **Bun** - JavaScript runtime (NOT Node.js)
- **TypeScript** - All source files use `.ts` extension
- **ES Modules** - Use `import/export`, NOT `require()`
- **No external dependencies** at runtime - self-contained binary

### Key Technologies
- **Docker & Docker Compose** - Container orchestration
- **Caddy** - Reverse proxy with automatic HTTPS
- **OpenRouter API** - AI diagnostics integration
- **JSON files** - Lightweight database (no SQLite/PostgreSQL)

## Architecture Patterns

### Module Structure
```
src/
├── cli/index.ts           # Main CLI entry (Raccoon)
├── core/
│   ├── config/index.ts    # Configuration management
│   ├── db/index.ts        # JSON-based database
│   └── utils/index.ts     # Utility functions
├── modules/
│   ├── opossum/index.ts   # Deployment
│   ├── badger/index.ts    # Reverse proxy
│   ├── seagull/index.ts   # Logs
│   ├── rat/index.ts       # Health checks
│   ├── crow/index.ts      # Backups
│   └── fox/index.ts       # AI diagnostics
└── types/index.ts         # TypeScript interfaces
```

### Manager Pattern
Each module exports a Manager class:
```typescript
export class OpossumManager {
  private db = getDatabase();
  private config = getConfigManager();
  
  async deploy(options: DeployOptions): Promise<Site> {
    // Implementation
  }
}
```

### Singleton Pattern for Core Services
```typescript
let database: Database | null = null;

export function getDatabase(): Database {
  if (!database) {
    database = new Database();
  }
  return database;
}
```

## Code Style Guidelines

### TypeScript Conventions
- Use **interfaces** for data models (not classes for DTOs)
- Use **enums** for status types: `enum SiteStatus { RUNNING = 'running', ... }`
- Use **async/await** - no callbacks or raw Promises
- Export types from `src/types/index.ts`

### File Organization
- One primary export per file (Manager class or function set)
- Group related functionality in modules
- Keep modules focused on single responsibility

### Error Handling
- Use custom `TrashcanError` class with categories
- Always provide user-friendly error messages
- Log errors but don't crash the CLI

### Docker Integration
- Generate docker-compose.yml as **YAML format** (not JSON)
- Use template literals for YAML generation
- Environment variables passed via docker-compose, not Dockerfile

### CLI Patterns
- Use emoji status indicators: 🟢 running, 🔴 stopped, ❌ error, 🚀 deploying
- Commands should be verb-based: `deploy`, `start`, `stop`, `backup`
- Always validate user input before operations
- Provide clear success/failure messages

## Database & Storage

### JSON-Based Storage
- Store data in `~/.trashcan/data/` as JSON files
- Files: `sites.json`, `backups.json`, `health-checks.json`, `diagnostics.json`
- Use `readJSON()` and `writeJSON()` utility functions
- No SQL - simple array filtering and mapping

### Data Models
```typescript
interface Site {
  id: string;        // UUID
  name: string;      // slug format (lowercase, hyphens)
  domain: string;
  port: number;
  status: SiteStatus;
  // ... more fields
}
```

## Testing Conventions

### Test Structure
- Tests in `test/` directory with `.test.ts` suffix
- Use Bun's built-in test runner
- Test file structure:
```typescript
import { describe, test, expect } from 'bun:test';

describe('Module Name', () => {
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

### What to Test
- Utility functions (validation, formatting)
- Data model creation and validation
- Error handling paths
- NOT Docker operations (too complex for unit tests)

## Documentation

### Code Comments
- Add JSDoc comments for public functions/methods
- Explain WHY, not WHAT (code should be self-explanatory)
- Document parameters and return types
- Include examples for complex functions

### README Conventions
- Use emoji for visual hierarchy (🦝, 🚀, 📚, etc.)
- Include code examples with syntax highlighting
- Keep quick start section prominent
- Document all CLI commands

## AI Integration (Fox Module)

### OpenRouter API
- Model: `anthropic/claude-3-sonnet` (default)
- API endpoint: `https://openrouter.ai/api/v1/chat/completions`
- API key stored in `~/.trashcan/config.json`
- Response format: JSON with analysis and suggestions

### Unified Diff Format
- AI suggests fixes as unified diffs
- Parse diffs to extract file changes
- Preview before applying (never auto-apply)
- Track confidence scores (0-1)

## Docker Patterns

### Per-Site Containers
- One docker-compose.yml per site
- Container name: `trashcan-{site-name}`
- Network: shared `trashcan` network
- Volumes: map `./data` for persistence

### Caddy Container
- Single shared Caddy container: `trashcan-caddy`
- Dynamic Caddyfile generation from all sites
- Reload via Docker exec, not restart
- Automatic Let's Encrypt SSL

## Common Pitfalls to Avoid

1. **Don't use `require()`** - Use ES module `import` syntax
2. **Don't use Node.js APIs** - Use Bun equivalents (e.g., `Bun.file()`)
3. **Don't hardcode paths** - Use `getConfigManager().getSitePath()`
4. **Don't use SQLite** - Use JSON file storage
5. **Don't create duplicate database records** - Check existence first
6. **Email is REQUIRED for init** - No default placeholder emails
7. **Generate YAML, not JSON** for docker-compose files
8. **Use runtime ENV for PORT** in Dockerfiles, not hardcode

## Examples

### Creating a New Module
```typescript
// src/modules/pigeon/index.ts
import type { Site } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';

export class PigeonManager {
  private db = getDatabase();
  
  async notify(site: Site, message: string): Promise<void> {
    console.log(`🐦 Pigeon delivering message to ${site.name}`);
    // Implementation
  }
}
```

### Adding a CLI Command
```typescript
this.commands.set('notify', {
  name: 'notify',
  description: 'Send notification about a site',
  usage: 'trashcan notify <name> <message>',
  action: this.notifyCommand.bind(this)
});
```

### Generating YAML
```typescript
const composeYaml = `version: '3.8'

services:
  app:
    image: myapp:latest
    environment:
      - PORT=${site.port}
    ports:
      - "${site.port}:${site.port}"
`;
await Bun.write(composePath, composeYaml);
```

## Project Values

1. **Simplicity** - Prefer simple solutions over complex ones
2. **Self-contained** - Minimize external dependencies
3. **User-friendly** - Clear error messages and helpful output
4. **Docker-native** - Embrace containerization fully
5. **Type-safe** - Use TypeScript's type system effectively
6. **Memorable** - Trash-animal names make the tool fun and approachable

## When Adding Features

1. Choose an appropriate trash-animal name
2. Create a Manager class in `src/modules/{animal}/`
3. Add CLI command in `src/cli/index.ts`
4. Update types in `src/types/index.ts` if needed
5. Add tests in `test/`
6. Document in README.md and EXAMPLES.md
7. Update SPEC.md if architectural change

## Quick Reference

- **Main CLI**: `src/cli/index.ts` (Raccoon)
- **Config**: `~/.trashcan/config.json`
- **Database**: `~/.trashcan/data/*.json`
- **Sites**: `~/.trashcan/sites/{site-name}/`
- **Backups**: `~/.trashcan/backups/{site-name}/`
- **Build**: `bun build src/cli/index.ts --compile --outfile dist/trashcan`
- **Test**: `bun test`
- **Run**: `bun run src/cli/index.ts [command]`
