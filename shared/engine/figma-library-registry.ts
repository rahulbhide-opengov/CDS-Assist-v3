/**
 * CDS-Assist: Figma Library Registry
 *
 * Manages Figma library sources (CDS Core, Patterns, Icons, etc.).
 * Resolves config from repo defaults + user overrides.
 * Provides add/remove/update/list operations for library sources.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FigmaSource {
  id: string;
  name: string;
  fileUrl: string;
  fileKey: string;
  role: 'core' | 'patterns' | 'icons' | 'product' | 'other';
  priority: number;
  include: Array<'tokens' | 'components' | 'styles'>;
  enabled: boolean;
  description?: string;
}

export interface FigmaSourcesConfig {
  version: number;
  sources: FigmaSource[];
}

export interface FigmaRepoConfig {
  figma: {
    autoSyncBeforeCreate: boolean;
    manifestFormat: 'compact' | 'full';
    includeImagesInKit: boolean;
    syncTtlSeconds: number;
    sourcePrecedence: string[];
    autoFix: boolean;
  };
  defaultSources?: FigmaSource[];
}

export interface FigmaRuntimeConfig {
  repo: FigmaRepoConfig;
  sources: FigmaSource[];
}

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

function getRepoRoot(): string {
  const envHome = process.env.CDS_ASSIST_HOME;
  if (envHome) return envHome;
  return join(dirname(new URL(import.meta.url).pathname), '..', '..');
}

function getConfigDir(): string {
  return join(getRepoRoot(), 'config');
}

function getCacheDir(): string {
  return join(getRepoRoot(), 'cache', 'figma');
}

function getLocalCacheDir(): string {
  return join(getRepoRoot(), '.figma-cache');
}

export function getSourcesConfigPath(): string {
  return join(getConfigDir(), 'figma.sources.json');
}

export function getRepoConfigPath(): string {
  return join(getRepoRoot(), 'cds-assist.config.json');
}

export function getManifestCachePath(): string {
  return join(getCacheDir(), 'ds.manifest.json');
}

export function getLocalManifestCachePath(): string {
  return join(getLocalCacheDir(), 'ds.manifest.json');
}

// ---------------------------------------------------------------------------
// File key parsing
// ---------------------------------------------------------------------------

/**
 * Extract fileKey from a Figma URL.
 * Handles /design/, /file/, and /board/ URL formats, plus branch URLs.
 */
export function parseFileKeyFromUrl(url: string): string | null {
  const patterns = [
    /figma\.com\/design\/([a-zA-Z0-9]+)/,
    /figma\.com\/file\/([a-zA-Z0-9]+)/,
    /figma\.com\/board\/([a-zA-Z0-9]+)/,
    /figma\.com\/design\/[a-zA-Z0-9]+\/branch\/([a-zA-Z0-9]+)/,
  ];
  for (const pat of patterns) {
    const match = url.match(pat);
    if (match) return match[1];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

function loadRepoConfig(): FigmaRepoConfig {
  const path = getRepoConfigPath();
  if (!existsSync(path)) {
    return {
      figma: {
        autoSyncBeforeCreate: true,
        manifestFormat: 'compact',
        includeImagesInKit: false,
        syncTtlSeconds: 0,
        sourcePrecedence: ['core', 'patterns', 'icons', 'product', 'other'],
        autoFix: true,
      },
    };
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function loadSourcesConfig(): FigmaSourcesConfig {
  const path = getSourcesConfigPath();
  if (!existsSync(path)) {
    return { version: 1, sources: [] };
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function saveSourcesConfig(config: FigmaSourcesConfig): void {
  const path = getSourcesConfigPath();
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = path + '.tmp';
  writeFileSync(tmp, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  const { renameSync } = require('fs');
  renameSync(tmp, path);
}

function validateSource(source: Partial<FigmaSource>): string[] {
  const errors: string[] = [];
  if (!source.id) errors.push('id is required');
  if (!source.name) errors.push('name is required');
  if (!source.fileKey && !source.fileUrl) errors.push('fileKey or fileUrl is required');
  if (source.fileUrl && !source.fileKey) {
    const parsed = parseFileKeyFromUrl(source.fileUrl);
    if (!parsed) errors.push(`Could not parse fileKey from URL: ${source.fileUrl}`);
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get merged runtime config from repo defaults + user sources.
 *
 * Org-wide libraries (defaultSources in cds-assist.config.json) are
 * always included. User sources (config/figma.sources.json) are merged
 * on top — user entries with the same id override the default.
 */
export function getFigmaRuntimeConfig(): FigmaRuntimeConfig {
  const repo = loadRepoConfig();
  const userConfig = loadSourcesConfig();

  const defaults = repo.defaultSources || [];
  const userSourcesById = new Map(userConfig.sources.map(s => [s.id, s]));

  const merged: FigmaSource[] = [];
  const seenIds = new Set<string>();

  for (const def of defaults) {
    const userOverride = userSourcesById.get(def.id);
    merged.push(userOverride ? { ...def, ...userOverride } : def);
    seenIds.add(def.id);
  }
  for (const src of userConfig.sources) {
    if (!seenIds.has(src.id)) {
      merged.push(src);
    }
  }

  const precedence = repo.figma.sourcePrecedence;
  const sorted = merged.sort((a, b) => {
    const aIdx = precedence.indexOf(a.role);
    const bIdx = precedence.indexOf(b.role);
    const aPri = aIdx >= 0 ? aIdx : precedence.length;
    const bPri = bIdx >= 0 ? bIdx : precedence.length;
    if (aPri !== bPri) return aPri - bPri;
    return b.priority - a.priority;
  });

  return { repo, sources: sorted };
}

/** List all configured Figma library sources (defaults + user) */
export function listFigmaSources(): FigmaSource[] {
  return getFigmaRuntimeConfig().sources;
}

/** List only user-added sources (not org defaults) */
export function listUserSources(): FigmaSource[] {
  return loadSourcesConfig().sources;
}

/** List only org-default sources from cds-assist.config.json */
export function listDefaultSources(): FigmaSource[] {
  return loadRepoConfig().defaultSources || [];
}

/** Add a new Figma library source */
export function addFigmaSource(input: {
  name: string;
  fileUrl: string;
  fileKey?: string;
  role?: 'core' | 'patterns' | 'icons' | 'product' | 'other';
  priority?: number;
  include?: Array<'tokens' | 'components' | 'styles'>;
}): FigmaSource {
  const config = loadSourcesConfig();

  const fileKey = input.fileKey || parseFileKeyFromUrl(input.fileUrl);
  if (!fileKey) throw new Error(`Cannot parse fileKey from URL: ${input.fileUrl}`);

  const id = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

  if (config.sources.some(s => s.id === id)) {
    throw new Error(`Source with id "${id}" already exists. Use update instead.`);
  }
  if (config.sources.some(s => s.fileKey === fileKey)) {
    throw new Error(`Source with fileKey "${fileKey}" already exists.`);
  }

  const source: FigmaSource = {
    id,
    name: input.name,
    fileUrl: input.fileUrl,
    fileKey,
    role: input.role || 'other',
    priority: input.priority ?? 50,
    include: input.include || ['tokens', 'components', 'styles'],
    enabled: true,
  };

  const errors = validateSource(source);
  if (errors.length) throw new Error(`Invalid source: ${errors.join(', ')}`);

  config.sources.push(source);
  saveSourcesConfig(config);
  return source;
}

/** Update an existing Figma library source */
export function updateFigmaSource(
  id: string,
  patch: Partial<Omit<FigmaSource, 'id'>>
): FigmaSource {
  const config = loadSourcesConfig();
  const idx = config.sources.findIndex(s => s.id === id);
  if (idx < 0) throw new Error(`Source "${id}" not found`);

  if (patch.fileUrl && !patch.fileKey) {
    patch.fileKey = parseFileKeyFromUrl(patch.fileUrl) || undefined;
  }

  config.sources[idx] = { ...config.sources[idx], ...patch };
  const errors = validateSource(config.sources[idx]);
  if (errors.length) throw new Error(`Invalid source after update: ${errors.join(', ')}`);

  saveSourcesConfig(config);
  return config.sources[idx];
}

/** Remove a Figma library source */
export function removeFigmaSource(id: string): boolean {
  const config = loadSourcesConfig();
  const before = config.sources.length;
  config.sources = config.sources.filter(s => s.id !== id);
  if (config.sources.length === before) throw new Error(`Source "${id}" not found`);
  saveSourcesConfig(config);
  return true;
}

/** Enable or disable a Figma library source */
export function enableFigmaSource(id: string, enabled: boolean): FigmaSource {
  return updateFigmaSource(id, { enabled });
}

/** Ensure config and cache directories exist */
export function ensureDirectories(): void {
  for (const dir of [getConfigDir(), getCacheDir(), getLocalCacheDir()]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}

/** Initialize a starter sources config if none exists */
export function initSourcesConfig(): void {
  ensureDirectories();
  const path = getSourcesConfigPath();
  if (!existsSync(path)) {
    saveSourcesConfig({ version: 1, sources: [] });
  }
}
