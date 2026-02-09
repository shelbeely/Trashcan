---
name: test-trashcan
description: Run Trashcan's test suite using Bun's built-in test runner. Execute unit tests for modules, core utilities, and CLI commands.
---

# Test Trashcan

Run the test suite for Trashcan development.

## Quick Test

```bash
bun test
```

## Test Structure

```
test/
├── core/
│   ├── config.test.ts
│   ├── db.test.ts
│   └── utils.test.ts
└── modules/
    ├── opossum.test.ts
    ├── badger.test.ts
    └── ...
```

## Test Patterns

### Run All Tests
```bash
bun test
```

### Run Specific File
```bash
bun test test/core/db.test.ts
```

### Watch Mode
```bash
bun test --watch
```

### With Coverage
```bash
bun test --coverage
```

## Writing Tests

```typescript
import { describe, test, expect } from 'bun:test';

describe('Module Name', () => {
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

## Best Practices

1. **Test before committing**
   ```bash
   bun test && git commit
   ```

2. **Test before building**
   ```bash
   bun test && bun run build
   ```

3. **Add tests for new features**
   - Create test file in `test/`
   - Match src structure
   - Test edge cases

## Using Bun MCP

```typescript
// Run tests via MCP
await bunMCP.run_tests({
  path: 'test/',
  watch: false
});
```
