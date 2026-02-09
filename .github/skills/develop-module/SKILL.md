---
name: develop-module
description: Create a new trash-animal module for Trashcan. Follows naming conventions, structure patterns, and integration guidelines.
---

# Develop New Trashcan Module

Create a new trash-animal themed module for Trashcan.

## Naming Convention 🦝

**CRITICAL**: Use trash/urban animal names (animals that thrive in human environments)

**Existing modules:**
- Raccoon 🦝 - Main CLI
- Opossum 🦡 - Deployment
- Badger 🦡 - Reverse proxy
- Seagull 🐦 - Logs
- Rat 🐀 - Health checks
- Crow 🦅 - Backups
- Fox 🦊 - AI diagnostics
- Skunk 🦨 - SSL/Security

**Available names:** Pigeon, Squirrel, Coyote, Bear, Gull, Magpie, etc.

## Module Structure

```
src/modules/[animal-name]/
├── index.ts          ← Main module export
└── types.ts          ← Module-specific types (optional)
```

## Template

```typescript
// src/modules/pigeon/index.ts
import { getDatabase } from '../../core/db/index.ts';
import { getConfigManager } from '../../core/config/index.ts';
import type { Site } from '../../types/index.ts';

export class PigeonManager {
  private db = getDatabase();
  private config = getConfigManager();
  
  async doSomething(site: Site): Promise<void> {
    console.log(`🐦 Pigeon handling ${site.name}`);
    // Implementation
  }
}
```

## Integration Steps

1. **Create module directory**
   ```bash
   mkdir -p src/modules/pigeon
   ```

2. **Create index.ts with Manager class**
3. **Add types to src/types/index.ts** (if needed)
4. **Create tests in test/modules/pigeon.test.ts**
5. **Add CLI command in src/cli/index.ts**
6. **Update documentation**

## CLI Integration

```typescript
// In src/cli/index.ts
import { PigeonManager } from '../modules/pigeon/index.ts';

this.commands.set('pigeon', {
  name: 'pigeon',
  description: '🐦 Pigeon module description',
  usage: 'trashcan pigeon [options]',
  action: this.pigeonCommand.bind(this)
});
```

## Best Practices

- **Single responsibility** - One focused purpose per module
- **Use emojis** - Match trash-animal theme
- **Error handling** - Use TrashcanError class
- **Async operations** - Use async/await
- **Type safety** - Export types from types/index.ts

## Using Context7 MCP

When developing modules, Context7 MCP provides:
- Code examples from existing modules
- Pattern matching for structure
- Documentation context

## Using Bun MCP

```typescript
// Test module quickly
await bunMCP.execute_script({
  script: 'bun run src/cli/index.ts pigeon --help'
});
```
