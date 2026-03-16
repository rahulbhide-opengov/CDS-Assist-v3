/**
 * CDS-Assist: Design System Manifest — Multi-File Merge Engine
 *
 * Syncs a merged DS manifest from all configured Figma library sources.
 * The manifest is the single source of truth the agent uses when creating
 * designs — every componentKey, variable ID, and style ID comes from here.
 *
 * Workflow:
 *   1. ensureFigmaConnected() gate
 *   2. Load runtime config + enabled sources
 *   3. For each source: call figma_get_design_system_kit via MCP
 *   4. Merge results using priority-based conflict resolution
 *   5. Write manifest to cache (both global + local)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { FIGMA_MCP_SERVERS } from './mcp-bridge.js';
import type { MCPToolCall } from './mcp-bridge.js';
import {
  getFigmaRuntimeConfig,
  getManifestCachePath,
  getLocalManifestCachePath,
  ensureDirectories,
} from './figma-library-registry.js';
import type { FigmaSource, FigmaRuntimeConfig } from './figma-library-registry.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ManifestComponent {
  name: string;
  componentKey: string;
  nodeId?: string;
  sourceId: string;
  role: string;
  priority: number;
  description?: string;
  variants?: Record<string, string[]>;
}

export interface ManifestStyle {
  name: string;
  styleKey: string;
  sourceId: string;
  type: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  description?: string;
}

export interface ManifestToken {
  name: string;
  variableId: string;
  collectionName?: string;
  sourceId: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  resolvedValue?: unknown;
}

export interface ManifestConflict {
  type: 'token' | 'style';
  name: string;
  winner: { sourceId: string; id: string };
  losers: Array<{ sourceId: string; id: string }>;
}

export interface DSManifest {
  generatedAt: string;
  sources: Array<{
    id: string;
    name: string;
    fileKey: string;
    role: string;
    priority: number;
    enabled: boolean;
  }>;
  components: {
    items: ManifestComponent[];
    byName: Record<string, string[]>;
  };
  styles: {
    items: ManifestStyle[];
    byName: Record<string, string[]>;
  };
  tokens: {
    items: ManifestToken[];
    byName: Record<string, string>;
    conflicts: ManifestConflict[];
  };
}

export interface ManifestSummary {
  componentCount: number;
  tokenCount: number;
  styleCount: number;
  sourceCount: number;
  conflicts: ManifestConflict[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// MCP tool call builders
// ---------------------------------------------------------------------------

export function getDesignSystemKit(
  fileKey: string,
  include: string[],
  format: string,
  includeImages: boolean
): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_get_design_system_kit',
    arguments: {
      fileKey,
      include: include.join(','),
      format,
      includeImages,
    },
  };
}

export function searchComponentsFallback(query: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_search_components',
    arguments: { query },
  };
}

export function getComponentDetailsFallback(nodeId: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_get_component_details',
    arguments: { nodeId },
  };
}

// ---------------------------------------------------------------------------
// Kit response normalization
// ---------------------------------------------------------------------------

/**
 * Normalize the raw response from figma_get_design_system_kit into
 * typed manifest items tagged with their source.
 */
export function normalizeKitResponse(
  raw: Record<string, unknown>,
  source: FigmaSource
): {
  components: ManifestComponent[];
  styles: ManifestStyle[];
  tokens: ManifestToken[];
} {
  const components: ManifestComponent[] = [];
  const styles: ManifestStyle[] = [];
  const tokens: ManifestToken[] = [];

  const rawComponents = (raw.components || raw.componentSets || []) as Array<Record<string, unknown>>;
  for (const comp of rawComponents) {
    components.push({
      name: (comp.name as string) || 'Unknown',
      componentKey: (comp.key as string) || (comp.componentKey as string) || (comp.id as string) || '',
      nodeId: (comp.id as string) || (comp.nodeId as string) || undefined,
      sourceId: source.id,
      role: source.role,
      priority: source.priority,
      description: (comp.description as string) || undefined,
      variants: (comp.variants as Record<string, string[]>) || undefined,
    });
  }

  const rawStyles = (raw.styles || []) as Array<Record<string, unknown>>;
  for (const style of rawStyles) {
    styles.push({
      name: (style.name as string) || 'Unknown',
      styleKey: (style.key as string) || (style.styleKey as string) || (style.id as string) || '',
      sourceId: source.id,
      type: (style.styleType as ManifestStyle['type']) || (style.type as ManifestStyle['type']) || 'FILL',
      description: (style.description as string) || undefined,
    });
  }

  const rawTokens = (raw.variables || raw.tokens || []) as Array<Record<string, unknown>>;
  for (const token of rawTokens) {
    tokens.push({
      name: (token.name as string) || 'Unknown',
      variableId: (token.id as string) || (token.variableId as string) || '',
      collectionName: (token.collectionName as string) || undefined,
      sourceId: source.id,
      type: (token.resolvedType as ManifestToken['type']) || (token.type as ManifestToken['type']) || 'COLOR',
      resolvedValue: token.resolvedValue || token.value || undefined,
    });
  }

  return { components, styles, tokens };
}

// ---------------------------------------------------------------------------
// Merge logic
// ---------------------------------------------------------------------------

function mergeComponents(
  allComponents: ManifestComponent[]
): { items: ManifestComponent[]; byName: Record<string, string[]> } {
  const items = [...allComponents].sort((a, b) => b.priority - a.priority);

  const byName: Record<string, string[]> = {};
  for (const comp of items) {
    const key = comp.name.toLowerCase();
    if (!byName[key]) byName[key] = [];
    byName[key].push(comp.componentKey);
  }

  return { items, byName };
}

function mergeStyles(
  allStyles: ManifestStyle[]
): { items: ManifestStyle[]; byName: Record<string, string[]> } {
  const items = [...allStyles];
  const byName: Record<string, string[]> = {};
  for (const style of items) {
    const key = style.name.toLowerCase();
    if (!byName[key]) byName[key] = [];
    byName[key].push(style.styleKey);
  }
  return { items, byName };
}

function mergeTokens(
  allTokens: ManifestToken[],
  sourcePriority: Record<string, number>
): {
  items: ManifestToken[];
  byName: Record<string, string>;
  conflicts: ManifestConflict[];
} {
  const grouped = new Map<string, ManifestToken[]>();
  for (const t of allTokens) {
    const key = t.name.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  const items: ManifestToken[] = [];
  const byName: Record<string, string> = {};
  const conflicts: ManifestConflict[] = [];

  for (const [name, candidates] of grouped) {
    const sorted = candidates.sort(
      (a, b) => (sourcePriority[b.sourceId] ?? 0) - (sourcePriority[a.sourceId] ?? 0)
    );
    const winner = sorted[0];
    items.push(winner);
    byName[name] = winner.variableId;

    if (sorted.length > 1) {
      conflicts.push({
        type: 'token',
        name,
        winner: { sourceId: winner.sourceId, id: winner.variableId },
        losers: sorted.slice(1).map(t => ({ sourceId: t.sourceId, id: t.variableId })),
      });
    }
  }

  return { items, byName, conflicts };
}

// ---------------------------------------------------------------------------
// Manifest persistence
// ---------------------------------------------------------------------------

function writeManifest(manifest: DSManifest): void {
  ensureDirectories();
  const paths = [getManifestCachePath(), getLocalManifestCachePath()];
  const data = JSON.stringify(manifest, null, 2) + '\n';

  for (const p of paths) {
    const dir = dirname(p);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(p, data, 'utf-8');
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the list of MCP calls needed to sync the manifest.
 * The agent executes these and feeds results back to mergeKitResults().
 */
export function buildSyncCalls(config?: FigmaRuntimeConfig): {
  calls: Array<{ source: FigmaSource; mcpCall: MCPToolCall }>;
  config: FigmaRuntimeConfig;
} {
  const rt = config || getFigmaRuntimeConfig();
  const enabledSources = rt.sources.filter(s => s.enabled);

  const calls = enabledSources.map(source => ({
    source,
    mcpCall: getDesignSystemKit(
      source.fileKey,
      source.include,
      rt.repo.figma.manifestFormat,
      rt.repo.figma.includeImagesInKit
    ),
  }));

  return { calls, config: rt };
}

/**
 * Merge raw kit responses into a DSManifest and persist it.
 * Called by the agent after executing all MCP sync calls.
 */
export function mergeKitResults(
  results: Array<{ source: FigmaSource; raw: Record<string, unknown> }>,
  config: FigmaRuntimeConfig
): DSManifest {
  const allComponents: ManifestComponent[] = [];
  const allStyles: ManifestStyle[] = [];
  const allTokens: ManifestToken[] = [];

  for (const { source, raw } of results) {
    const normalized = normalizeKitResponse(raw, source);
    allComponents.push(...normalized.components);
    allStyles.push(...normalized.styles);
    allTokens.push(...normalized.tokens);
  }

  const sourcePriority: Record<string, number> = {};
  for (const s of config.sources) {
    sourcePriority[s.id] = s.priority;
  }

  const manifest: DSManifest = {
    generatedAt: new Date().toISOString(),
    sources: config.sources.map(s => ({
      id: s.id, name: s.name, fileKey: s.fileKey,
      role: s.role, priority: s.priority, enabled: s.enabled,
    })),
    components: mergeComponents(allComponents),
    styles: mergeStyles(allStyles),
    tokens: mergeTokens(allTokens, sourcePriority),
  };

  writeManifest(manifest);
  return manifest;
}

/**
 * Placeholder for agent-driven sync. In practice the agent:
 * 1. Calls buildSyncCalls()
 * 2. Executes each MCP call
 * 3. Calls mergeKitResults() with the responses
 *
 * This function documents the expected return shape.
 */
export async function syncDesignSystemManifest(
  opts: { force?: boolean } = {}
): Promise<ManifestSummary> {
  const existing = loadDesignSystemManifest();
  const config = getFigmaRuntimeConfig();
  const ttl = config.repo.figma.syncTtlSeconds;

  if (!opts.force && existing && ttl > 0) {
    const age = (Date.now() - new Date(existing.generatedAt).getTime()) / 1000;
    if (age < ttl) {
      return {
        componentCount: existing.components.items.length,
        tokenCount: existing.tokens.items.length,
        styleCount: existing.styles.items.length,
        sourceCount: existing.sources.length,
        conflicts: existing.tokens.conflicts,
        generatedAt: existing.generatedAt,
      };
    }
  }

  // In agent mode, this would execute MCP calls.
  // In CLI mode, print guidance:
  console.log('Agent must execute MCP calls to sync. Use buildSyncCalls() + mergeKitResults().');

  return {
    componentCount: 0,
    tokenCount: 0,
    styleCount: 0,
    sourceCount: config.sources.filter(s => s.enabled).length,
    conflicts: [],
    generatedAt: new Date().toISOString(),
  };
}

/** Load the cached manifest from disk. Returns null if no cache exists. */
export function loadDesignSystemManifest(): DSManifest | null {
  for (const path of [getManifestCachePath(), getLocalManifestCachePath()]) {
    if (existsSync(path)) {
      try {
        return JSON.parse(readFileSync(path, 'utf-8'));
      } catch { /* corrupted cache, ignore */ }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Resolution helpers — used by design creation
// ---------------------------------------------------------------------------

/**
 * Find the best componentKey for a given name or intent.
 * Searches byName index with fuzzy matching.
 */
export function resolveComponent(
  manifest: DSManifest,
  query: string
): { primary: string | null; alternatives: string[] } {
  const q = query.toLowerCase().trim();

  if (manifest.components.byName[q]) {
    const keys = manifest.components.byName[q];
    return { primary: keys[0], alternatives: keys.slice(1) };
  }

  // Fuzzy: check for partial matches
  const matches: string[] = [];
  for (const [name, keys] of Object.entries(manifest.components.byName)) {
    if (name.includes(q) || q.includes(name)) {
      matches.push(...keys);
    }
  }

  if (matches.length > 0) {
    return { primary: matches[0], alternatives: matches.slice(1) };
  }

  return { primary: null, alternatives: [] };
}

/**
 * Find the best token variable ID for a given name.
 */
export function resolveToken(
  manifest: DSManifest,
  name: string
): { variableId: string | null; alternatives: string[] } {
  const q = name.toLowerCase().trim();

  if (manifest.tokens.byName[q]) {
    return { variableId: manifest.tokens.byName[q], alternatives: [] };
  }

  // Fuzzy match
  const fuzzy: string[] = [];
  for (const [key, id] of Object.entries(manifest.tokens.byName)) {
    if (key.includes(q) || q.includes(key)) {
      fuzzy.push(id);
    }
  }

  return {
    variableId: fuzzy[0] || null,
    alternatives: fuzzy.slice(1),
  };
}

/**
 * Find the best style key for a given name.
 */
export function resolveStyle(
  manifest: DSManifest,
  name: string
): { styleKey: string | null; alternatives: string[] } {
  const q = name.toLowerCase().trim();

  if (manifest.styles.byName[q]) {
    const keys = manifest.styles.byName[q];
    return { styleKey: keys[0], alternatives: keys.slice(1) };
  }

  const fuzzy: string[] = [];
  for (const [key, ids] of Object.entries(manifest.styles.byName)) {
    if (key.includes(q) || q.includes(key)) {
      fuzzy.push(...ids);
    }
  }

  return {
    styleKey: fuzzy[0] || null,
    alternatives: fuzzy.slice(1),
  };
}
