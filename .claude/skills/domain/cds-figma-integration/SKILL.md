---
name: CDS Figma Integration
description: Figma-to-React workflow, Code Connect, and token sync for CDS. Use when translating designs, validating Figma output, or syncing tokens.
---

# CDS Figma Integration

## Figma-to-React Workflow

1. **get_design_context** — Fetch design from Figma
2. **Map to CDS components** — Match design elements to CDS hierarchy
3. **Generate code** — Output React with CDS components

---

## Code Connect

- `figma.config.json` for mapping Figma components to code
- Links design components to implementation

---

## Token Sync

```
Figma Variables → Capital Design Tokens → React Theme
```

---

## Validation Checklist

- Spacing on **4px grid**
- Colors match tokens
- Button heights correct: S 28px, M 32px, L 40px

---

## Canvas Safety

- **Never delete** existing top-level screen frames
- Place new frames to the **right** with **200px gap**

---

## MCP Tools

- `get_design_context` — Design + code + hints
- `get_screenshot` — Visual capture
- `get_metadata` — File/node metadata
- `get_variable_defs` — Variable definitions

---

## Desktop Bridge

Plugin for real-time Figma manipulation.

---

## Keywords

figma, design, visual, layout, component key, token
