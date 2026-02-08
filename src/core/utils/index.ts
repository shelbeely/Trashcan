/**
 * Utility functions for Trashcan
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from string
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Validate site name (slug format)
 */
export function validateSiteName(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name);
}

/**
 * Validate domain name
 */
export function validateDomain(domain: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/.test(domain);
}

/**
 * Validate port number
 */
export function validatePort(port: number): boolean {
  return port >= 1024 && port <= 65535;
}

/**
 * Execute shell command
 */
export async function exec(command: string, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(command.split(' '), {
    cwd: cwd || process.cwd(),
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  return { stdout, stderr, exitCode };
}

/**
 * Check if Docker is installed and running
 */
export async function checkDocker(): Promise<boolean> {
  try {
    const { exitCode } = await exec('docker --version');
    return exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Check if Docker Compose is installed
 */
export async function checkDockerCompose(): Promise<boolean> {
  try {
    const { exitCode } = await exec('docker compose version');
    return exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Get next available port starting from a given port
 */
export async function getNextAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < 65535; port++) {
    try {
      const server = Bun.serve({
        port,
        fetch() {
          return new Response('OK');
        },
      });
      server.stop();
      return port;
    } catch {
      // Port is in use, try next
    }
  }
  throw new Error('No available ports found');
}

/**
 * Sanitize environment variable value
 */
export function sanitizeEnvValue(value: string): string {
  // Remove any quotes and escape special characters
  return value.replace(/["']/g, '').replace(/\$/g, '\\$');
}

/**
 * Parse cron expression (basic validation)
 */
export function validateCronExpression(expression: string): boolean {
  const parts = expression.split(' ');
  return parts.length === 5;
}

/**
 * Get timestamp for filenames
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Ensure directory exists
 */
export async function ensureDir(path: string): Promise<void> {
  try {
    await Bun.write(Bun.file(path + '/.keep'), '');
  } catch {
    // Directory might already exist
  }
}

/**
 * Read JSON file safely
 */
export async function readJSON<T>(path: string): Promise<T | null> {
  try {
    const file = Bun.file(path);
    if (await file.exists()) {
      return await file.json();
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Write JSON file
 */
export async function writeJSON(path: string, data: any): Promise<void> {
  await Bun.write(path, JSON.stringify(data, null, 2));
}
