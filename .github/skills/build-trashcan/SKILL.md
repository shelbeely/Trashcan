---
name: build-trashcan
description: Build the Trashcan CLI binary from TypeScript source using Bun's compile feature. Handles compilation, optimization, and output to dist/trashcan.
---

# Build Trashcan CLI

Build the single-binary Trashcan CLI tool from TypeScript source.

## Build Command

```bash
bun build src/cli/index.ts --compile --outfile dist/trashcan
```

## What This Does

1. **Compiles TypeScript** - Transpiles all `.ts` files to JavaScript
2. **Bundles Dependencies** - Includes all imports in single binary
3. **Creates Executable** - Produces `dist/trashcan` with execute permissions
4. **Optimizes** - Minifies and tree-shakes unused code

## Build Process

### 1. Clean Previous Build

```bash
rm -rf dist/
mkdir -p dist/
```

### 2. Run Bun Build

```bash
bun build src/cli/index.ts --compile --outfile dist/trashcan
```

**Flags:**
- `--compile` - Create standalone executable
- `--outfile` - Specify output path

### 3. Verify Build

```bash
# Check file was created
ls -lh dist/trashcan

# Test execution
./dist/trashcan --version
```

## Build Errors

### Common Issues

**Error: Cannot find module**
- Check all imports use correct paths
- Verify `tsconfig.json` paths configuration
- Ensure all files have `.ts` extension in imports

**Error: Compile failed**
- Check TypeScript syntax errors
- Run `bun run dev` first to catch issues
- Check `tsconfig.json` is valid

**Permission denied**
- Build creates executable automatically
- If needed: `chmod +x dist/trashcan`

## Development vs Production

### Development (no compile)
```bash
# Run directly from source
bun run src/cli/index.ts [command]

# Or using npm script
bun run dev [command]
```

### Production (compiled binary)
```bash
# Build first
bun run build

# Then execute
./dist/trashcan [command]
```

## Build Optimization

### Reduce Binary Size

Current: ~90MB (includes Bun runtime)

Tips:
- Remove unused imports
- Use tree-shaking compatible code
- Avoid dynamic requires
- Keep dependencies minimal

### Faster Builds

```bash
# Use Bun's cache
bun build src/cli/index.ts --compile --outfile dist/trashcan

# Parallel builds (if multiple targets)
bun build src/cli/index.ts --target=bun --outfile dist/trashcan
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v1

- name: Build Trashcan
  run: bun run build

- name: Upload Artifact
  uses: actions/upload-artifact@v3
  with:
    name: trashcan-binary
    path: dist/trashcan
```

## File Structure

```
Trashcan/
├── src/
│   ├── cli/
│   │   └── index.ts       ← Entry point
│   ├── core/
│   │   ├── config/
│   │   ├── db/
│   │   └── utils/
│   └── modules/
│       ├── opossum/       ← All modules included
│       ├── badger/
│       └── ...
├── dist/
│   └── trashcan          ← Output binary
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Binary Too Large

Check what's included:
```bash
# Analyze bundle (requires separate tool)
bun build src/cli/index.ts --analyze

# Check imports
grep -r "import" src/
```

### Binary Doesn't Work

```bash
# Check it's executable
ls -l dist/trashcan

# Check it runs
./dist/trashcan --help

# Check for missing system libs
ldd dist/trashcan  # Linux only
```

### Different Platforms

Bun compile creates platform-specific binaries:
- Build on Linux → Linux binary
- Build on macOS → macOS binary
- Build on Windows → Windows binary

Cross-compile not yet supported - build on target platform.

## Related Commands

- **Test before building**: `bun test`
- **Type check**: `bun run tsc --noEmit`
- **Run without building**: `bun run dev`
- **Install binary**: `bun install -g .`

## Best Practices

1. **Always test before building**
   ```bash
   bun test && bun run build
   ```

2. **Version your builds**
   ```bash
   bun run build
   mv dist/trashcan dist/trashcan-v1.0.0
   ```

3. **Clean builds**
   ```bash
   rm -rf dist/ && bun run build
   ```

4. **Verify functionality**
   ```bash
   bun run build
   ./dist/trashcan init --help
   ./dist/trashcan deploy --help
   ```

## Using Bun MCP

With Bun MCP server, you can:

```typescript
// Build via MCP
await bunMCP.execute_script({
  script: 'bun build src/cli/index.ts --compile --outfile dist/trashcan'
});

// Or using npm script
await bunMCP.run_script({
  name: 'build'
});
```
