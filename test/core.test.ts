import { test, expect, describe } from 'bun:test';
import { generateId, validateSiteName, validateDomain, validatePort, formatBytes } from '../src/core/utils/index.ts';

describe('Utility Functions', () => {
  test('generateId creates a valid UUID', () => {
    const id = generateId();
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  test('validateSiteName accepts valid names', () => {
    expect(validateSiteName('my-site')).toBe(true);
    expect(validateSiteName('site123')).toBe(true);
    expect(validateSiteName('test-site-123')).toBe(true);
  });

  test('validateSiteName rejects invalid names', () => {
    expect(validateSiteName('My-Site')).toBe(false); // uppercase
    expect(validateSiteName('my_site')).toBe(false); // underscore
    expect(validateSiteName('my site')).toBe(false); // space
    expect(validateSiteName('my@site')).toBe(false); // special char
  });

  test('validateDomain accepts valid domains', () => {
    expect(validateDomain('example.com')).toBe(true);
    expect(validateDomain('sub.example.com')).toBe(true);
    expect(validateDomain('my-site.example.com')).toBe(true);
  });

  test('validateDomain rejects invalid domains', () => {
    expect(validateDomain('Example.com')).toBe(false); // uppercase
    expect(validateDomain('-example.com')).toBe(false); // starts with dash
    expect(validateDomain('example-.com')).toBe(false); // ends with dash
    expect(validateDomain('exam ple.com')).toBe(false); // contains space
  });

  test('validatePort accepts valid ports', () => {
    expect(validatePort(3000)).toBe(true);
    expect(validatePort(8080)).toBe(true);
    expect(validatePort(65535)).toBe(true);
  });

  test('validatePort rejects invalid ports', () => {
    expect(validatePort(80)).toBe(false); // too low (privileged)
    expect(validatePort(1023)).toBe(false); // too low
    expect(validatePort(65536)).toBe(false); // too high
    expect(validatePort(0)).toBe(false); // zero
    expect(validatePort(-1)).toBe(false); // negative
  });

  test('formatBytes formats sizes correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
  });
});

describe('Configuration', () => {
  test('default configuration is valid', async () => {
    const { getConfigManager } = await import('../src/core/config/index.ts');
    const config = getConfigManager();
    const cfg = config.get();
    
    expect(cfg.version).toBe('1.0.0');
    expect(cfg.dataDir).toContain('.trashcan');
    expect(cfg.caddy).toBeDefined();
    expect(cfg.openrouter).toBeDefined();
  });
});

describe('Types', () => {
  test('SiteStatus enum has correct values', async () => {
    const { SiteStatus } = await import('../src/types/index.ts');
    
    expect(SiteStatus.RUNNING).toBe('running');
    expect(SiteStatus.STOPPED).toBe('stopped');
    expect(SiteStatus.ERROR).toBe('error');
    expect(SiteStatus.DEPLOYING).toBe('deploying');
    expect(SiteStatus.BUILDING).toBe('building');
  });

  test('TrashcanError creates proper error', async () => {
    const { TrashcanError, ErrorCategory } = await import('../src/types/index.ts');
    
    const error = new TrashcanError(
      'Test error',
      ErrorCategory.CONFIG,
      'TEST_ERROR',
      true
    );
    
    expect(error.message).toBe('Test error');
    expect(error.category).toBe(ErrorCategory.CONFIG);
    expect(error.code).toBe('TEST_ERROR');
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('TrashcanError');
  });
});
