---
name: debug-cli
description: Debug Trashcan CLI issues during development. Troubleshoot command execution, module errors, and build problems.
---

# Debug Trashcan CLI

Troubleshoot issues during Trashcan development.

## Quick Debug

### Run in Development Mode

```bash
# Run from source (not compiled)
bun run src/cli/index.ts [command] [args]

# Or using npm script
bun run dev [command] [args]
```

### Enable Verbose Logging

```typescript
// Add to code
console.log('Debug:', { variable, state });
console.error('Error:', error);
```

## Common Issues

### Command Not Found

```bash
# Check command registration
grep -r "commands.set" src/cli/index.ts

# List all commands
bun run dev --help
```

### Module Import Errors

```bash
# Check import paths
grep -r "import.*from" src/

# Verify file exists
ls src/modules/[module-name]/index.ts
```

### TypeScript Errors

```bash
# Check types
bun run tsc --noEmit

# Or just run - Bun shows TS errors
bun run dev [command]
```

### Runtime Errors

```bash
# Add debug output
console.log('Reached here:', new Error().stack);

# Check error messages
bun run dev [command] 2>&1 | tee error.log
```

## Debugging Tools

### Bun REPL

```bash
bun repl
> import { OpossumManager } from './src/modules/opossum/index.ts'
> const opossum = new OpossumManager()
> await opossum.deploy(...)
```

### Test Specific Function

```typescript
// test/debug.test.ts
import { test } from 'bun:test';
import { OpossumManager } from '../src/modules/opossum/index.ts';

test('debug deploy', async () => {
  const opossum = new OpossumManager();
  await opossum.deploy({
    name: 'test-site',
    domain: 'test.com',
    port: 3000
  });
});
```

### Check Database

```bash
# View database contents
cat ~/.trashcan/data/sites.json | jq '.'

# Or using Bun
bun -e "console.log(JSON.parse(await Bun.file('~/.trashcan/data/sites.json').text()))"
```

## Using Bun MCP for Debugging

```typescript
// Execute with detailed output
await bunMCP.execute_script({
  script: 'bun run src/cli/index.ts [command]',
  capture_output: true
});

// Run REPL
await bunMCP.start_repl();
```

## Performance Debugging

### Measure Command Time

```bash
time bun run dev [command]
```

### Memory Usage

```bash
# Run with memory stats
bun run --smol dev [command]
```

## Breakpoints (VSCode)

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "bun",
      "request": "launch",
      "name": "Debug Trashcan CLI",
      "program": "${workspaceFolder}/src/cli/index.ts",
      "args": ["deploy", "--name", "test"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

## Best Practices

1. **Use dev mode** - Don't debug compiled binary
2. **Add console.log** - Simple and effective
3. **Write tests** - Reproduce bugs in tests
4. **Check types** - Many errors caught by TypeScript
5. **Read stack traces** - Bun shows helpful errors
