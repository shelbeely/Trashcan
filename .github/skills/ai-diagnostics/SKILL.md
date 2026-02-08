---
name: ai-diagnostics
description: AI-powered diagnostics using Fox module and OpenRouter API. Analyze errors, suggest fixes, and generate unified diffs.
---

# AI Diagnostics Workflow

## Fox Module Implementation

Use `src/modules/fox/index.ts` for all AI-powered diagnostics.

## OpenRouter Integration

- API Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `anthropic/claude-3-sonnet`
- API Key: Store in `~/.trashcan/config.json`

## Diagnostic Process

1. **Collect Context**
   - Site name and status
   - Container logs (last 100 lines)
   - Health check history
   - docker-compose.yml content
   - Error messages

2. **Build AI Prompt**
   ```
   Analyze this Next.js deployment issue:
   - Site: {name}
   - Status: {status}
   - Logs: {logs}
   - Health checks: {checks}
   
   Provide:
   1. Root cause analysis
   2. Fix recommendations
   3. Unified diffs if needed
   4. Confidence score (0-1)
   ```

3. **Parse Response**
   - Extract analysis
   - Parse unified diffs
   - Get confidence scores

4. **Present to User**
   ```
   🦊 Fox AI Diagnostics
   
   Analysis: {root cause}
   Confidence: {score}
   
   Suggested Fix (Unified Diff):
   {diff}
   
   Apply fix? [y/N]:
   ```

## CLI Commands

- `fox diagnose my-site` - Analyze issues
- `fox fix my-site --preview` - Preview fixes
- `fox fix my-site --apply` - Apply fixes

## Common Error Patterns

1. Port conflicts → Suggest available ports
2. Missing dependencies → Run `bun install`
3. Build failures → Analyze build logs
4. Missing env vars → Add to .env
5. Network issues → Check Docker network
6. SSL issues → Verify domain DNS

## Safety Measures

- Always preview before applying
- Create backup before changes
- Validate file syntax after patches
- Rollback on failure
- Never modify system files

## Boundaries
- Only analyze sites in ~/.trashcan/
- Never send sensitive data to AI API
- Always require user confirmation
- Log all AI interactions
