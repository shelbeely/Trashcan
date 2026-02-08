/**
 * Core type definitions for Trashcan
 * Using trash-animal naming system throughout
 */

// Site status enumeration
export enum SiteStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  DEPLOYING = 'deploying',
  BUILDING = 'building'
}

// Health check configuration
export interface HealthCheckConfig {
  enabled: boolean;
  url: string;
  interval: number; // seconds
  timeout: number; // seconds
  retries: number;
}

// Backup configuration
export interface BackupConfig {
  enabled: boolean;
  schedule: string; // cron expression
  retention: number; // days
  path: string;
}

// Site configuration
export interface Site {
  id: string;
  name: string;
  domain: string;
  aliases: string[];
  port: number;
  status: SiteStatus;
  healthCheck: HealthCheckConfig;
  backup: BackupConfig;
  env: Record<string, string>;
  created: Date;
  updated: Date;
  path: string;
  gitRepo?: string;
  branch?: string;
}

// Backup metadata
export enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental'
}

export enum BackupStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  INPROGRESS = 'inprogress'
}

export interface Backup {
  id: string;
  siteId: string;
  siteName: string;
  timestamp: Date;
  size: number; // bytes
  path: string;
  type: BackupType;
  status: BackupStatus;
}

// Health check result
export interface HealthCheckResult {
  id: string;
  siteId: string;
  timestamp: Date;
  status: number; // HTTP status code
  responseTime: number; // milliseconds
  success: boolean;
  error?: string;
}

// Resource metrics
export interface ResourceMetrics {
  cpu: number; // percentage
  memory: number; // MB
  disk: number; // MB
}

// AI diagnostic
export interface Fix {
  id: string;
  description: string;
  diff: string; // unified diff format
  confidence: number; // 0-1
  files: string[];
  applied: boolean;
}

export interface Diagnostic {
  id: string;
  siteId: string;
  timestamp: Date;
  logs: string[];
  metrics: ResourceMetrics;
  analysis: string;
  suggestions: Fix[];
}

// Global configuration
export interface CaddyConfig {
  configPath: string;
  apiUrl: string;
  email: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  endpoint: string;
}

export interface TrashcanConfig {
  version: string;
  dataDir: string;
  sitesDir: string;
  backupDir: string;
  logsDir: string;
  caddy: CaddyConfig;
  openrouter: OpenRouterConfig;
}

// Error types
export enum ErrorCategory {
  DOCKER = 'docker',
  NETWORK = 'network',
  CONFIG = 'config',
  DEPLOYMENT = 'deployment',
  AI = 'ai'
}

export class TrashcanError extends Error {
  category: ErrorCategory;
  code: string;
  recoverable: boolean;

  constructor(
    message: string,
    category: ErrorCategory,
    code: string,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'TrashcanError';
    this.category = category;
    this.code = code;
    this.recoverable = recoverable;
  }
}
