/**
 * CDS-Assist: MCP Bridge
 *
 * Provides a unified interface for calling Figma tools via
 * either the figma-console MCP or the official Figma MCP server.
 * Falls back to CDP CLI commands when MCP is unavailable.
 */

export interface MCPToolCall {
  server: string;
  toolName: string;
  arguments: Record<string, unknown>;
}

export interface ScreenshotResult {
  imageData?: string;
  error?: string;
}

export interface ComponentSearchResult {
  nodeId: string;
  name: string;
  description?: string;
}

/** Available MCP servers for Figma */
export const FIGMA_MCP_SERVERS = {
  console: 'user-figma-console',
  official: 'plugin-figma-figma',
} as const;

/** Take a screenshot of the current Figma canvas or a specific node */
export function takeScreenshot(nodeId?: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_take_screenshot',
    arguments: nodeId ? { node_id: nodeId } : {},
  };
}

/** Search for CDS components in the current Figma file */
export function searchComponents(query: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_search_components',
    arguments: { query },
  };
}

/** Execute arbitrary Figma Plugin API code */
export function executeCode(code: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_execute',
    arguments: { code },
  };
}

/** Get design context from a Figma URL (official MCP) */
export function getDesignContext(fileKey: string, nodeId?: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.official,
    toolName: 'get_design_context',
    arguments: {
      file_key: fileKey,
      ...(nodeId ? { node_id: nodeId } : {}),
    },
  };
}

/** Get a screenshot from the official Figma MCP */
export function getScreenshot(fileKey: string, nodeId?: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.official,
    toolName: 'get_screenshot',
    arguments: {
      file_key: fileKey,
      ...(nodeId ? { node_id: nodeId } : {}),
    },
  };
}

/** Get variable definitions from a Figma file */
export function getVariableDefs(fileKey: string): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.official,
    toolName: 'get_variable_defs',
    arguments: { file_key: fileKey },
  };
}

/** Create a Figma variable via console MCP */
export function createVariable(
  name: string,
  collectionName: string,
  type: 'COLOR' | 'FLOAT' | 'STRING',
  value: string | number
): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_create_variable',
    arguments: { name, collection_name: collectionName, type, value },
  };
}

/** Batch create variables for CDS token push */
export function batchCreateVariables(
  variables: Array<{ name: string; type: 'COLOR' | 'FLOAT' | 'STRING'; value: string | number }>,
  collectionName: string
): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_batch_create_variables',
    arguments: {
      collection_name: collectionName,
      variables,
    },
  };
}

/** Instantiate a CDS component in Figma */
export function instantiateComponent(nodeId: string, x?: number, y?: number): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_instantiate_component',
    arguments: {
      component_node_id: nodeId,
      ...(x !== undefined ? { x } : {}),
      ...(y !== undefined ? { y } : {}),
    },
  };
}

/** Get design system summary */
export function getDesignSystemSummary(): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_get_design_system_summary',
    arguments: {},
  };
}

/** Audit design system for CDS compliance */
export function auditDesignSystem(): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_audit_design_system',
    arguments: {},
  };
}

/** Check design parity between Figma and code */
export function checkDesignParity(): MCPToolCall {
  return {
    server: FIGMA_MCP_SERVERS.console,
    toolName: 'figma_check_design_parity',
    arguments: {},
  };
}

/**
 * Visual Validation Loop
 *
 * After creating a design in Figma, take a screenshot and analyze it.
 * Returns MCP calls to execute in sequence.
 */
export function visualValidationLoop(frameName: string): MCPToolCall[] {
  return [
    // Step 1: Take screenshot
    takeScreenshot(),
    // Step 2: Audit design system compliance
    auditDesignSystem(),
    // Step 3: Check design parity
    checkDesignParity(),
  ];
}

/**
 * CDS Setup Pipeline
 *
 * Returns MCP calls to set up the CDS design system in a Figma file.
 */
export function cdsSetupPipeline(): MCPToolCall[] {
  return [
    getDesignSystemSummary(),
    // If no CDS variables found, the agent should run ds setup via CLI
  ];
}
