/**
 * CDS-Assist: Figma Connection Manager
 *
 * Provides ensureFigmaConnected() — the single gate before any Figma operation.
 * Uses figma-console MCP tools: figma_get_status and figma_reconnect.
 *
 * This module returns MCP tool call descriptors (MCPToolCall) that the
 * agent runtime executes. The logic here describes the workflow; the
 * agent follows the returned steps.
 */

import { FIGMA_MCP_SERVERS } from './mcp-bridge.js';
import type { MCPToolCall } from './mcp-bridge.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConnectionStatus {
  ok: boolean;
  fileName?: string;
  fileKey?: string;
  transport?: string;
  port?: number;
}

export interface ConnectionResult {
  ok: boolean;
  status?: ConnectionStatus;
  steps?: string[];
}

// ---------------------------------------------------------------------------
// MCP tool call builders
// ---------------------------------------------------------------------------

export function getStatus(): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_get_status',
    arguments: {},
  };
}

export function reconnect(): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_reconnect',
    arguments: {},
  };
}

export function navigateToFile(fileUrl: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_navigate',
    arguments: { url: fileUrl },
  };
}

// ---------------------------------------------------------------------------
// Connection status parsing
// ---------------------------------------------------------------------------

/**
 * Parse raw figma_get_status response into a normalized ConnectionStatus.
 * Handles the shape returned by figma-console MCP.
 */
export function parseStatusResponse(raw: Record<string, unknown>): ConnectionStatus {
  const setup = raw.setup as Record<string, unknown> | undefined;
  const transport = raw.transport as Record<string, unknown> | undefined;
  const ws = transport?.websocket as Record<string, unknown> | undefined;
  const connectedFile = ws?.connectedFile as Record<string, unknown> | undefined;

  const isValid = setup?.valid === true;
  const isInitialized = raw.initialized === true;

  return {
    ok: isValid && isInitialized,
    fileName: (raw.currentFileName as string) || connectedFile?.fileName as string || undefined,
    fileKey: (raw.currentFileKey as string) || connectedFile?.fileKey as string || undefined,
    transport: (transport?.active as string) || undefined,
    port: ws?.port ? Number(ws.port) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Reconnection step messages
// ---------------------------------------------------------------------------

const RECONNECT_STEPS = [
  '1. Open Figma Desktop (the app, not the browser)',
  '2. Open any Figma file in the app',
  '3. Run the Desktop Bridge plugin:',
  '   Plugins > Development > Figma Desktop Bridge',
  '   (If not imported yet: Plugins > Development > Import plugin from manifest',
  '    → select figma-plugin/manifest.json from the CDS-Assist repo)',
  '4. Wait a few seconds for the WebSocket connection to establish',
  '5. Re-run your command or ask the agent to try again',
];

// ---------------------------------------------------------------------------
// Public API — used by agent workflow
// ---------------------------------------------------------------------------

/**
 * Ensure-connected workflow descriptor.
 *
 * The agent should:
 * 1. Call getStatus() and parse the result
 * 2. If ok → proceed
 * 3. If not → call reconnect(), then getStatus() again
 * 4. If still not ok → show steps to the user
 *
 * Returns the MCP calls and logic as a structured workflow
 * that the agent executes step by step.
 */
export function ensureFigmaConnectedWorkflow(): {
  step1_checkStatus: MCPToolCall;
  step2_reconnect: MCPToolCall;
  step3_recheckStatus: MCPToolCall;
  failureSteps: string[];
} {
  return {
    step1_checkStatus: getStatus(),
    step2_reconnect: reconnect(),
    step3_recheckStatus: getStatus(),
    failureSteps: RECONNECT_STEPS,
  };
}

/**
 * Build a ConnectionResult from a parsed status.
 * Used by the agent after executing the status MCP call.
 */
export function buildConnectionResult(
  status: ConnectionStatus,
  afterReconnectAttempt: boolean
): ConnectionResult {
  if (status.ok) {
    return { ok: true, status };
  }
  if (afterReconnectAttempt) {
    return { ok: false, steps: RECONNECT_STEPS };
  }
  return { ok: false };
}
