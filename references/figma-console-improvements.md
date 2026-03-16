# Figma Console MCP — Suggested Improvements

These are upstream enhancement requests for [figma-console-mcp](https://github.com/southleft/figma-console-mcp) that would reduce custom `figma_execute` code in CDS-Assist. These are NOT blockers — CDS-Assist works with the current tool set.

## 1. `figma_ensure_connected` tool

**Problem**: CDS-Assist currently calls `figma_get_status` → checks result → conditionally calls `figma_reconnect` → re-checks. This is 2-3 MCP calls with branching logic.

**Proposed tool**: `figma_ensure_connected`
- Internally: status → reconnect (if needed) → re-check
- Returns: `{ connected: true }` or `{ connected: false, steps: [...] }`
- Standardizes the "steps to fix" messaging

## 2. `figma_get_design_system_kit_bulk` tool

**Problem**: For multi-library setups, CDS-Assist calls `figma_get_design_system_kit` N times (once per library file). Each call is a separate MCP roundtrip.

**Proposed tool**: `figma_get_design_system_kit_bulk({ fileKeys: ["ABC", "DEF", "GHI"] })`
- Single roundtrip for all libraries
- Returns results keyed by fileKey
- Massive latency improvement for 3+ library setups

## 3. `figma_audit_token_bindings` tool

**Problem**: CDS-Assist runs a large `figma_execute` block that traverses all descendants, checks for hardcoded paints, and suggests token matches. This is complex Plugin API code sent over the wire.

**Proposed tool**: `figma_audit_token_bindings({ nodeId: "123:456" })`
- Returns: `{ hardcoded: [{ nodeId, property, value, suggestedVariable }] }`
- Built-in matching against published variables in the file
- Could leverage Figma's internal variable resolution for better accuracy

## 4. `figma_instantiate_component_auto_layout` helper

**Problem**: After instantiating a component, CDS-Assist often needs a second `figma_execute` call to set up auto-layout constraints (FILL width, spacing, alignment) in the parent frame.

**Proposed tool**: `figma_instantiate_component_auto_layout({ componentKey, parentNodeId, layoutSizing: "FILL", position: "APPEND" })`
- Instantiate + parent + constrain in one call
- Reduces two MCP calls to one

## Priority

| Improvement | Impact | Complexity |
|-------------|--------|-----------|
| ensure_connected | Medium (saves ~2 calls per session) | Low |
| kit_bulk | High (saves N-1 calls per sync) | Medium |
| audit_token_bindings | High (replaces ~50 lines of figma_execute) | Medium |
| instantiate_auto_layout | Medium (saves 1 call per component) | Low |
