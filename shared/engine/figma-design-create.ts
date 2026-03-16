/**
 * CDS-Assist: Figma Design Creation Engine
 *
 * Translates a user prompt into a ScreenRecipe referencing actual DS
 * component keys and token IDs from the synced manifest, then executes
 * the recipe via figma-console MCP tools.
 *
 * Workflow:
 *   1. ensureFigmaConnected() gate
 *   2. Auto-sync manifest (if configured)
 *   3. Load manifest
 *   4. Build ScreenRecipe from prompt (component + token references)
 *   5. Execute recipe: create frame, instantiate components, bind tokens
 *   6. Validate + optional auto-fix
 */

import { FIGMA_MCP_SERVERS } from './mcp-bridge.js';
import type { MCPToolCall } from './mcp-bridge.js';
import type { DSManifest, ManifestComponent } from './figma-ds-manifest.js';
import { resolveComponent, resolveToken, resolveStyle } from './figma-ds-manifest.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single element in the screen recipe */
export interface RecipeNode {
  /** Human-readable name for this element */
  name: string;
  /** How to realize it in Figma */
  type: 'ds-instance' | 'frame' | 'text' | 'divider';
  /** DS component key (for ds-instance type) */
  componentKey?: string;
  /** Fallback options if primary componentKey not in manifest */
  alternatives?: string[];
  /** Component override props (variant, size, label, etc.) */
  overrides?: Record<string, string>;
  /** Layout props for frame type */
  layout?: {
    direction: 'VERTICAL' | 'HORIZONTAL';
    spacing?: number;
    padding?: number | { top: number; right: number; bottom: number; left: number };
    width?: number | 'FILL';
    height?: number | 'HUG';
    align?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    crossAlign?: 'MIN' | 'CENTER' | 'MAX';
  };
  /** Token bindings for fills, strokes, text colors */
  tokenBindings?: {
    fill?: string;
    stroke?: string;
    textColor?: string;
  };
  /** Style bindings (text style keys) */
  styleBindings?: {
    textStyle?: string;
  };
  /** Text content (for text type) */
  text?: string;
  /** Font overrides (only when no text style available) */
  font?: {
    family?: string;
    style?: string;
    size?: number;
  };
  /** Nested children */
  children?: RecipeNode[];
}

/** The full recipe for a screen */
export interface ScreenRecipe {
  name: string;
  width: number;
  height: number;
  description: string;
  rootLayout: RecipeNode;
}

/** Result of creating a design */
export interface CreateResult {
  ok: boolean;
  frameNodeId?: string;
  frameName?: string;
  recipe?: ScreenRecipe;
  validationReport?: unknown;
  errors?: string[];
}

/** An unresolved component reference in the recipe */
export interface UnresolvedComponent {
  name: string;
  reason: 'not_in_manifest' | 'no_sources_configured' | 'disabled_source';
  suggestions: string[];
}

// ---------------------------------------------------------------------------
// Recipe validation against manifest
// ---------------------------------------------------------------------------

/**
 * Validate a ScreenRecipe: ensure all componentKeys and token references
 * exist in the manifest. Returns unresolved items.
 */
export function validateRecipe(
  recipe: ScreenRecipe,
  manifest: DSManifest
): { valid: boolean; unresolved: UnresolvedComponent[] } {
  const unresolved: UnresolvedComponent[] = [];
  const componentKeys = new Set(manifest.components.items.map(c => c.componentKey));

  function walk(node: RecipeNode) {
    if (node.type === 'ds-instance' && node.componentKey) {
      if (!componentKeys.has(node.componentKey)) {
        const resolved = resolveComponent(manifest, node.name);
        unresolved.push({
          name: node.name,
          reason: 'not_in_manifest',
          suggestions: resolved.alternatives.slice(0, 3),
        });
      }
    }
    node.children?.forEach(walk);
  }

  walk(recipe.rootLayout);
  return { valid: unresolved.length === 0, unresolved };
}

// ---------------------------------------------------------------------------
// MCP call generation from recipe
// ---------------------------------------------------------------------------

/**
 * Generate the sequence of MCP calls to execute a ScreenRecipe.
 *
 * Returns an ordered list of MCP calls + metadata. The agent executes
 * them in sequence (some calls depend on nodeIds from previous results).
 */
export function generateCreateCalls(recipe: ScreenRecipe): {
  description: string;
  calls: Array<{
    step: string;
    mcpCall: MCPToolCall;
    dependsOn?: string;
  }>;
} {
  const calls: Array<{ step: string; mcpCall: MCPToolCall; dependsOn?: string }> = [];

  // Step 1: Create root frame via figma_execute
  const rootLayout = recipe.rootLayout.layout;
  const createRootCode = buildCreateFrameCode(recipe.name, {
    width: recipe.width,
    height: recipe.height,
    direction: rootLayout?.direction || 'VERTICAL',
    spacing: rootLayout?.spacing ?? 0,
    padding: rootLayout?.padding,
    fill: recipe.rootLayout.tokenBindings?.fill,
  });

  calls.push({
    step: 'create_root_frame',
    mcpCall: {
      server: FIGMA_MCP_SERVERS.console,
      toolName: 'figma_execute',
      arguments: { code: createRootCode },
    },
  });

  // Step 2+: Process children recursively
  const childCalls = buildChildCalls(recipe.rootLayout.children || [], 'rootFrame');
  calls.push(...childCalls);

  return {
    description: `Create "${recipe.name}" (${recipe.width}x${recipe.height})`,
    calls,
  };
}

function buildCreateFrameCode(
  name: string,
  opts: {
    width: number;
    height: number;
    direction: 'VERTICAL' | 'HORIZONTAL';
    spacing: number;
    padding?: number | { top: number; right: number; bottom: number; left: number };
    fill?: string;
  }
): string {
  const pad = typeof opts.padding === 'number'
    ? `frame.paddingTop = ${opts.padding};\nframe.paddingRight = ${opts.padding};\nframe.paddingBottom = ${opts.padding};\nframe.paddingLeft = ${opts.padding};`
    : opts.padding
      ? `frame.paddingTop = ${opts.padding.top};\nframe.paddingRight = ${opts.padding.right};\nframe.paddingBottom = ${opts.padding.bottom};\nframe.paddingLeft = ${opts.padding.left};`
      : '';

  return `
const frame = figma.createFrame();
frame.name = ${JSON.stringify(name)};
frame.resize(${opts.width}, ${opts.height});
frame.layoutMode = '${opts.direction}';
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'FIXED';
frame.itemSpacing = ${opts.spacing};
frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
${pad}
figma.currentPage.appendChild(frame);
figma.viewport.scrollAndZoomIntoView([frame]);
return { nodeId: frame.id, name: frame.name };
`.trim();
}

function buildChildCalls(
  children: RecipeNode[],
  parentRef: string
): Array<{ step: string; mcpCall: MCPToolCall; dependsOn?: string }> {
  const calls: Array<{ step: string; mcpCall: MCPToolCall; dependsOn?: string }> = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const stepName = `child_${i}_${child.name.replace(/\s+/g, '_').toLowerCase()}`;

    if (child.type === 'ds-instance' && child.componentKey) {
      calls.push({
        step: stepName,
        mcpCall: {
          server: FIGMA_MCP_SERVERS.console,
          toolName: 'figma_instantiate_component',
          arguments: {
            component_node_id: child.componentKey,
            ...(child.overrides || {}),
          },
        },
        dependsOn: parentRef,
      });

      if (child.overrides && Object.keys(child.overrides).length > 0) {
        calls.push({
          step: `${stepName}_set_props`,
          mcpCall: {
            server: FIGMA_MCP_SERVERS.console,
            toolName: 'figma_set_instance_properties',
            arguments: {
              nodeId: `$\{${stepName}.nodeId}`,
              properties: child.overrides,
            },
          },
          dependsOn: stepName,
        });
      }
    } else if (child.type === 'frame') {
      const layout = child.layout || { direction: 'VERTICAL' as const };
      const code = buildNestedFrameCode(child.name, {
        direction: layout.direction,
        spacing: layout.spacing ?? 0,
        padding: layout.padding,
        width: layout.width,
        height: layout.height,
        align: layout.align,
        crossAlign: layout.crossAlign,
        fill: child.tokenBindings?.fill,
      });

      calls.push({
        step: stepName,
        mcpCall: {
          server: FIGMA_MCP_SERVERS.console,
          toolName: 'figma_execute',
          arguments: { code },
        },
        dependsOn: parentRef,
      });

      if (child.children?.length) {
        calls.push(...buildChildCalls(child.children, stepName));
      }
    } else if (child.type === 'text') {
      const code = buildTextNodeCode(child);
      calls.push({
        step: stepName,
        mcpCall: {
          server: FIGMA_MCP_SERVERS.console,
          toolName: 'figma_execute',
          arguments: { code },
        },
        dependsOn: parentRef,
      });
    } else if (child.type === 'divider') {
      calls.push({
        step: stepName,
        mcpCall: {
          server: FIGMA_MCP_SERVERS.console,
          toolName: 'figma_execute',
          arguments: {
            code: `
const div = figma.createFrame();
div.name = 'Divider';
div.resize(100, 1);
div.fills = [{ type: 'SOLID', color: { r: 0.878, g: 0.878, b: 0.878 } }];
return { nodeId: div.id };`.trim(),
          },
        },
        dependsOn: parentRef,
      });
    }
  }

  return calls;
}

function buildNestedFrameCode(
  name: string,
  opts: {
    direction: 'VERTICAL' | 'HORIZONTAL';
    spacing: number;
    padding?: number | { top: number; right: number; bottom: number; left: number };
    width?: number | 'FILL';
    height?: number | 'HUG';
    align?: string;
    crossAlign?: string;
    fill?: string;
  }
): string {
  const pad = typeof opts.padding === 'number'
    ? `f.paddingTop = ${opts.padding}; f.paddingRight = ${opts.padding}; f.paddingBottom = ${opts.padding}; f.paddingLeft = ${opts.padding};`
    : opts.padding
      ? `f.paddingTop = ${opts.padding.top}; f.paddingRight = ${opts.padding.right}; f.paddingBottom = ${opts.padding.bottom}; f.paddingLeft = ${opts.padding.left};`
      : '';

  return `
const f = figma.createFrame();
f.name = ${JSON.stringify(name)};
f.layoutMode = '${opts.direction}';
f.itemSpacing = ${opts.spacing};
f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
f.cornerRadius = 4;
${opts.align ? `f.primaryAxisAlignItems = '${opts.align}';` : ''}
${opts.crossAlign ? `f.counterAxisAlignItems = '${opts.crossAlign}';` : ''}
${pad}
return { nodeId: f.id };`.trim();
}

function buildTextNodeCode(node: RecipeNode): string {
  const family = node.font?.family || 'DM Sans';
  const style = node.font?.style || 'Regular';
  const size = node.font?.size || 14;
  const text = node.text || '';

  return `
await figma.loadFontAsync({ family: '${family}', style: '${style}' });
const t = figma.createText();
t.fontName = { family: '${family}', style: '${style}' };
t.fontSize = ${size};
t.characters = ${JSON.stringify(text)};
t.fills = [{ type: 'SOLID', color: { r: 0.129, g: 0.129, b: 0.129 } }];
return { nodeId: t.id };`.trim();
}

// ---------------------------------------------------------------------------
// Token binding code generation
// ---------------------------------------------------------------------------

/**
 * Generate figma_execute code to bind a variable to a node's fill.
 * Used post-creation to replace hardcoded colors with variable bindings.
 */
export function buildVariableBindCode(
  nodeId: string,
  variableId: string,
  property: 'fills' | 'strokes' = 'fills'
): string {
  return `
const node = figma.getNodeById('${nodeId}');
if (node && 'fills' in node) {
  const variable = await figma.variables.getVariableByIdAsync('${variableId}');
  if (variable) {
    const fillsCopy = [...node.${property}];
    fillsCopy[0] = figma.variables.setBoundVariableForPaint(fillsCopy[0], 'color', variable);
    node.${property} = fillsCopy;
  }
}
return { bound: true, nodeId: '${nodeId}', variableId: '${variableId}' };
`.trim();
}

/**
 * Generate figma_execute code to apply a text style to a text node.
 */
export function buildApplyTextStyleCode(
  nodeId: string,
  styleKey: string
): string {
  return `
const node = figma.getNodeById('${nodeId}');
if (node && node.type === 'TEXT') {
  const style = figma.getStyleById('${styleKey}');
  if (style && style.type === 'TEXT') {
    node.textStyleId = style.id;
  }
}
return { applied: true, nodeId: '${nodeId}', styleKey: '${styleKey}' };
`.trim();
}
