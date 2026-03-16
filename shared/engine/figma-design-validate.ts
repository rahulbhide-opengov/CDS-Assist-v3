/**
 * CDS-Assist: Figma Design Validation + Auto-Fix
 *
 * Validates created designs against the DS manifest:
 *   - Detects hardcoded fills/strokes when matching tokens exist
 *   - Detects non-instance nodes that should be DS component instances
 *   - Detects text nodes missing text styles
 *   - Detects instances whose mainComponent isn't from configured sources
 *
 * Provides one auto-fix pass that binds tokens and replaces primitives
 * with DS instances where possible.
 */

import { FIGMA_MCP_SERVERS } from './mcp-bridge.js';
import type { MCPToolCall } from './mcp-bridge.js';
import type { DSManifest } from './figma-ds-manifest.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IssueType =
  | 'HARDCODED_FILL'
  | 'HARDCODED_STROKE'
  | 'NOT_INSTANCE_WHEN_SHOULD_BE'
  | 'MISSING_TEXT_STYLE'
  | 'UNKNOWN_MAIN_COMPONENT';

export interface ValidationIssue {
  type: IssueType;
  nodeId: string;
  nodeName: string;
  value?: string;
  suggestedToken?: string;
  suggestedTokenId?: string;
  suggestedComponentKey?: string;
  severity: 'error' | 'warning';
}

export interface ValidationReport {
  ok: boolean;
  issues: ValidationIssue[];
  stats: {
    nodesChecked: number;
    instanceCount: number;
    hardcodedFills: number;
    hardcodedStrokes: number;
    missingTextStyles: number;
    unknownComponents: number;
  };
}

// ---------------------------------------------------------------------------
// Validation code generation (runs inside Figma via figma_execute)
// ---------------------------------------------------------------------------

/**
 * Generate figma_execute code that traverses a frame and detects issues.
 * Returns a structured JSON report.
 *
 * The code runs inside the Figma plugin sandbox and has access to
 * the full Plugin API including node traversal and variable inspection.
 */
export function buildValidationCode(
  nodeId: string,
  manifest: DSManifest
): string {
  const componentNames = Object.keys(manifest.components.byName);
  const tokenNames = Object.entries(manifest.tokens.byName).map(
    ([name, id]) => ({ name, id })
  );
  const sourceComponentKeys = new Set(
    manifest.components.items.map(c => c.componentKey)
  );

  return `
const targetNode = figma.getNodeById('${nodeId}');
if (!targetNode) return { ok: false, issues: [], stats: { nodesChecked: 0 } };

const dsComponentNames = ${JSON.stringify(componentNames)};
const dsTokens = ${JSON.stringify(tokenNames)};
const dsComponentKeys = new Set(${JSON.stringify([...sourceComponentKeys])});

const issues = [];
let nodesChecked = 0;
let instanceCount = 0;
let hardcodedFills = 0;
let hardcodedStrokes = 0;
let missingTextStyles = 0;
let unknownComponents = 0;

function rgbToHex(r, g, b) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function traverse(node) {
  nodesChecked++;

  // Check for hardcoded fills
  if ('fills' in node && node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID' && fill.visible !== false) {
        const hasBoundVar = node.boundVariables?.fills?.length > 0;
        if (!hasBoundVar && fill.color) {
          const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
          hardcodedFills++;
          issues.push({
            type: 'HARDCODED_FILL',
            nodeId: node.id,
            nodeName: node.name,
            value: hex,
            severity: 'error'
          });
        }
      }
    }
  }

  // Check for hardcoded strokes
  if ('strokes' in node && node.strokes && Array.isArray(node.strokes)) {
    for (const stroke of node.strokes) {
      if (stroke.type === 'SOLID' && stroke.visible !== false) {
        const hasBoundVar = node.boundVariables?.strokes?.length > 0;
        if (!hasBoundVar && stroke.color) {
          const hex = rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b);
          hardcodedStrokes++;
          issues.push({
            type: 'HARDCODED_STROKE',
            nodeId: node.id,
            nodeName: node.name,
            value: hex,
            severity: 'warning'
          });
        }
      }
    }
  }

  // Check if node should be a DS instance
  if (node.type === 'FRAME' || node.type === 'GROUP') {
    const nameLower = node.name.toLowerCase();
    for (const dsName of dsComponentNames) {
      if (nameLower === dsName || nameLower.startsWith(dsName + '/') || nameLower.startsWith(dsName + ' ')) {
        issues.push({
          type: 'NOT_INSTANCE_WHEN_SHOULD_BE',
          nodeId: node.id,
          nodeName: node.name,
          suggestedComponentKey: dsName,
          severity: 'warning'
        });
        break;
      }
    }
  }

  // Check text nodes for missing text styles
  if (node.type === 'TEXT') {
    if (!node.textStyleId || node.textStyleId === '') {
      missingTextStyles++;
      issues.push({
        type: 'MISSING_TEXT_STYLE',
        nodeId: node.id,
        nodeName: node.name,
        severity: 'warning'
      });
    }
  }

  // Check instances for unknown main components
  if (node.type === 'INSTANCE') {
    instanceCount++;
    const mainComp = node.mainComponent;
    if (mainComp && mainComp.key && !dsComponentKeys.has(mainComp.key)) {
      unknownComponents++;
      issues.push({
        type: 'UNKNOWN_MAIN_COMPONENT',
        nodeId: node.id,
        nodeName: node.name,
        value: mainComp.key,
        severity: 'warning'
      });
    }
  }

  if ('children' in node && node.children) {
    for (const child of node.children) {
      traverse(child);
    }
  }
}

traverse(targetNode);

return {
  ok: issues.filter(i => i.severity === 'error').length === 0,
  issues: issues.slice(0, 100),
  stats: { nodesChecked, instanceCount, hardcodedFills, hardcodedStrokes, missingTextStyles, unknownComponents }
};
`.trim();
}

// ---------------------------------------------------------------------------
// Fix pass code generation
// ---------------------------------------------------------------------------

/**
 * Generate figma_execute code for a single fix action.
 * The agent calls these one at a time based on the validation report.
 */
export function buildFixCode(issue: ValidationIssue, manifest: DSManifest): string | null {
  switch (issue.type) {
    case 'HARDCODED_FILL': {
      if (!issue.suggestedTokenId) return null;
      return `
const node = figma.getNodeById('${issue.nodeId}');
if (node && 'fills' in node) {
  const variable = await figma.variables.getVariableByIdAsync('${issue.suggestedTokenId}');
  if (variable && node.fills.length > 0) {
    const newFills = [...node.fills];
    newFills[0] = figma.variables.setBoundVariableForPaint(newFills[0], 'color', variable);
    node.fills = newFills;
    return { fixed: true, nodeId: '${issue.nodeId}', type: 'HARDCODED_FILL' };
  }
}
return { fixed: false, nodeId: '${issue.nodeId}' };
`.trim();
    }

    case 'HARDCODED_STROKE': {
      if (!issue.suggestedTokenId) return null;
      return `
const node = figma.getNodeById('${issue.nodeId}');
if (node && 'strokes' in node) {
  const variable = await figma.variables.getVariableByIdAsync('${issue.suggestedTokenId}');
  if (variable && node.strokes.length > 0) {
    const newStrokes = [...node.strokes];
    newStrokes[0] = figma.variables.setBoundVariableForPaint(newStrokes[0], 'color', variable);
    node.strokes = newStrokes;
    return { fixed: true, nodeId: '${issue.nodeId}', type: 'HARDCODED_STROKE' };
  }
}
return { fixed: false, nodeId: '${issue.nodeId}' };
`.trim();
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Public API — MCP call builders for validation workflow
// ---------------------------------------------------------------------------

/** Build the MCP call to validate a design frame */
export function buildValidateCall(
  nodeId: string,
  manifest: DSManifest
): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_execute',
    arguments: { code: buildValidationCode(nodeId, manifest) },
  };
}

/** Build MCP calls for the fix pass based on a validation report */
export function buildFixCalls(
  report: ValidationReport,
  manifest: DSManifest
): MCPToolCall[] {
  const calls: MCPToolCall[] = [];

  for (const issue of report.issues) {
    if (issue.type === 'HARDCODED_FILL' || issue.type === 'HARDCODED_STROKE') {
      enrichIssueWithTokenSuggestion(issue, manifest);
    }

    const code = buildFixCode(issue, manifest);
    if (code) {
      calls.push({
        server: FIGMA_MCP_SERVERS.console,
        toolName: 'figma_execute',
        arguments: { code },
      });
    }
  }

  return calls;
}

/**
 * Match a hardcoded hex value to the nearest DS token.
 * Mutates the issue to add suggestedToken and suggestedTokenId.
 */
function enrichIssueWithTokenSuggestion(
  issue: ValidationIssue,
  manifest: DSManifest
): void {
  if (!issue.value) return;

  const hex = issue.value.toLowerCase();
  let bestMatch: { name: string; id: string; dist: number } | null = null;

  for (const token of manifest.tokens.items) {
    if (token.type !== 'COLOR') continue;
    const resolved = token.resolvedValue;
    if (!resolved || typeof resolved !== 'object') continue;

    const rv = resolved as Record<string, number>;
    const tokenHex = rgbObjToHex(rv);
    if (tokenHex === hex) {
      issue.suggestedToken = token.name;
      issue.suggestedTokenId = token.variableId;
      return;
    }

    const dist = hexDistance(hex, tokenHex);
    if (!bestMatch || dist < bestMatch.dist) {
      bestMatch = { name: token.name, id: token.variableId, dist };
    }
  }

  if (bestMatch && bestMatch.dist < 50) {
    issue.suggestedToken = bestMatch.name;
    issue.suggestedTokenId = bestMatch.id;
  }
}

function rgbObjToHex(rgb: Record<string, number>): string {
  const r = Math.round((rgb.r ?? 0) * 255);
  const g = Math.round((rgb.g ?? 0) * 255);
  const b = Math.round((rgb.b ?? 0) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexDistance(a: string, b: string): number {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  if (!pa || !pb) return Infinity;
  return Math.sqrt((pa.r - pb.r) ** 2 + (pa.g - pb.g) ** 2 + (pa.b - pb.b) ** 2);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}
