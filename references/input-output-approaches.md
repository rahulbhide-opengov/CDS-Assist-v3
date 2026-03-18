# Input → Output Approaches (Universal)

**MANDATORY**: Before starting ANY CDS-Assist task, identify your input type and output type, then follow the exact approach below. No shortcuts.

## The Matrix

| Input ↓ / Output → | **React Code** | **Figma Design** |
|---------------------|---------------|------------------|
| **Figma Design** | Approach A | Approach E (Figma → Figma edit) |
| **React Code** | Approach B (React → React edit) | Approach C |
| **Prompt / PRD** | Approach D | Approach F |
| **Screenshot** | Approach G | Approach H |
| **Figma + React (Both)** | Approach I | Approach I |

---

## Approach A: Figma Design → React Code

**"I have a Figma design, generate React code"**

### Steps:
1. **Extract specification from Figma** (SPECIFICATION-FIRST MANDATE)
   - Call `get_design_context(fileKey, nodeId)` + `get_screenshot(fileKey, nodeId)`
   - Trace the FULL node tree top-to-bottom
   - Extract EVERY measurement: frame dimensions, padding, gap, font sizes, icon sizes, colors
   - Identify every component instance and its variant properties
   - Map each Figma component to its MUI equivalent
   - Map each icon to MDI icon name (cross-reference `figma-icons-catalog.md`)

2. **Write the component tree BEFORE coding**
   ```
   Figma tree:          React equivalent:
   Screen               <Box>
   ├── GlobalNav          (provided by Layout wrapper)
   ├── Body (H)           <Box sx={{ display: 'flex' }}>
   │   ├── Sidebar(250)     <Box sx={{ width: 250 }}>
   │   └── Main(FILL)       <Box sx={{ flex: 1 }}>
   │       ├── PageHead      <PageHeaderComposable>
   │       └── Content       <Box>
   ```

3. **Generate React code** following SKILL.md React Execution steps
   - Use exact measurements from Figma (not approximations)
   - Every Figma text style → Typography variant
   - Every Figma color variable → palette path in sx
   - Every Figma component instance → MUI component with matching props
   - Every icon → `@mdi/js` import with exact name

4. **Pixel-level verification**
   - Open browser and Figma side-by-side
   - Fix every spacing, color, typography discrepancy

### Key Files to Load:
- `references/figma.md` + `references/figma-quality.md`
- `references/figma-library-catalog.md`
- `references/figma-icons-catalog.md`
- `references/react-codegen.md`
- `references/react-to-figma-mapping.md` (reverse direction)

---

## Approach C: React Code → Figma Design

**"I have React code, create the Figma design"**

### THIS IS THE MOST CRITICAL APPROACH — previously failed due to wrong tooling

### Steps:
1. **Parse the React code as a pixel-precise specification**
   - Read the ENTIRE component file
   - Extract every `<Component>` → map to CDS Figma library component
   - Extract every `sx={{ }}` → map to exact Figma auto-layout values using `react-to-figma-mapping.md`
   - Extract every `<Typography variant="x" color="y">` → map to text style + color variable
   - Extract every `<MdiIcon path={mdiXxx}>` → map to CDS icon key
   - Extract every spacing value: `spacing={2}` = 16px, `px: 3` = 24px

2. **Write the complete Figma component tree** (same as React tree, translated)
   - Every `<Box>` or `<Stack>` → Figma Frame with matching auto-layout
   - Every MUI component → CDS library instance (NEVER a manual frame)
   - Every icon → CDS 37 Icons library instance (NEVER text characters)
   - Every Typography → Text node with library text style + variable-bound color

3. **Discover components** (Phase 0 from `figma-creation-workflow.md`)
   - `figma_search_components` for every component type needed
   - Build the session COMPONENT_MAP

4. **Build layout frames** (Phase 2 from `figma-creation-workflow.md`)
   - Create structural frames with EXACT spacing from React sx props
   - `sx={{ px: 2 }}` → `paddingLeft = 16, paddingRight = 16`
   - `sx={{ gap: 1.5 }}` → `itemSpacing = 12`
   - `direction="row"` → `layoutMode = 'HORIZONTAL'`

5. **Populate with library components** (Phase 3 from `figma-creation-workflow.md`)
   - `figma_instantiate_component` for EVERY Button, Chip, Tab, TextField, etc.
   - Pass `parentId` to place inside the correct frame
   - Set `variant` and `overrides` to match React props

6. **Add icons from CDS Icons library**
   - Convert MDI name to CDS icon key
   - `figma.importComponentByKeyAsync(iconKey)` → `.createInstance()`
   - Resize to match React icon size

7. **Responsive breakpoints**
   - Clone Desktop → resize to 768 and 390
   - Adapt layout (collapse sidebar, stack columns)
   - NEVER remove content

8. **Audit and verify**
   - Component purity: INSTANCE count vs FRAME count
   - Screenshot comparison against React rendering
   - React↔Figma parity audit (Step 4 from SKILL.md)

### Key Files to Load:
- `references/react-to-figma-mapping.md` (PRIMARY — the 1:1 mapping table)
- `references/figma-creation-workflow.md` (the MCP tool workflow)
- `references/figma-quality.md` (quality rules)
- `references/figma-library-catalog.md` (component keys)
- `references/figma-icons-catalog.md` (icon keys)

---

## Approach D: Prompt / PRD → React Code

**"Build me a dashboard page for procurement"**

### Steps:
1. **Identify the page pattern** — Dashboard, List, Form, Detail, or custom
2. **Load domain references** — e.g., `references/products/procurement.md`
3. **Load pattern references** — e.g., `references/patterns.md` + `references/data-visualization.md`
4. **Study 2+ existing pages** with the same pattern in the codebase
5. **Design the component tree** — map all described elements to MUI components
6. **Generate** following SKILL.md React Execution (mock data, all 4 states, theme tokens only)
7. **Verify** — dev server, browser check, audit

### Key Files to Load:
- `references/react-codegen.md`
- `references/patterns.md`
- Domain-specific reference (procurement, eam, etc.)
- Pattern-specific (data-tables, data-visualization, etc.)

---

## Approach F: Prompt / PRD → Figma Design

**"Design a permit inspection form in Figma"**

### Steps:
1. **Identify the page pattern and all needed components**
2. **Map described elements to CDS library components**
   - "a search bar" → TextField with search icon
   - "a data table" → Table with CDS header/row components
   - "action buttons" → Button library instances
   - "status tags" → Chip library instances
3. **Write the component tree** (same format as Approach C step 2)
4. **Follow figma-creation-workflow.md Phases 0-5**
5. **Use CDS design tokens** for all colors, typography, spacing
6. **Create responsive variants** (Desktop, Tablet, Mobile)

### Key Files to Load:
- `references/figma-creation-workflow.md`
- `references/figma-quality.md`
- `references/figma-library-catalog.md`
- `references/figma-icons-catalog.md`
- Domain + pattern references

---

## Approach G: Screenshot → React Code

**"Here's a screenshot, build this in React"**

### Steps:
1. **Analyze the screenshot** — identify all UI elements, layout structure, colors, typography
2. **Normalize to CDS** — map every visual element to nearest CDS equivalent:
   - Non-CDS colors → nearest semantic color (primary/secondary/error/etc.)
   - Non-CDS fonts → DM Sans with nearest weight
   - Non-standard components → nearest MUI component
   - Approximate measurements → nearest 4px grid values
3. **Write the component tree**
4. **Generate** following SKILL.md React Execution
5. **Compare** against screenshot, fix discrepancies

---

## Approach H: Screenshot → Figma Design

**"Here's a screenshot, recreate this in Figma"**

### Steps:
1. **Analyze the screenshot** — same as Approach G step 1
2. **Normalize to CDS** — same as Approach G step 2
3. **Map all elements to CDS library components** — NEVER recreate with primitives
4. **Follow figma-creation-workflow.md Phases 0-5**
5. **Compare** against screenshot, fix discrepancies

---

## Approach I: Both (React + Figma simultaneously)

**"Build this in React AND create the Figma design"**

### Steps:
1. **Generate React first** (using appropriate approach A/D/G above)
2. **Use the React code as the spec for Figma** (Approach C)
3. **Run React↔Figma Parity Audit** (SKILL.md Step 4) — MANDATORY
4. **Fix all gaps** in both directions
5. **Keep in sync** for all subsequent changes

---

## Decision Flowchart

```
User request arrives
│
├── Has Figma URL? → Extract spec → Approach A (→React) or E (→Figma edit)
├── Has React code? → Parse as spec → Approach B (→React edit) or C (→Figma)
├── Has screenshot? → Analyze + normalize → Approach G (→React) or H (→Figma)
├── Has prompt/PRD? → Identify pattern → Approach D (→React) or F (→Figma)
│
└── Both output modes?
    → Build React first (D/G/A), then Figma from React (C), then parity audit (I)
```

## Universal Rules (ALL approaches)

1. **NEVER skip specification extraction** — always know exact values before building
2. **NEVER use primitives for library components** — search → instantiate → verify
3. **NEVER guess spacing** — read from source (React sx, Figma measurements, or 4px grid)
4. **ALWAYS normalize to CDS** — no hardcoded colors, non-DM-Sans fonts, or arbitrary sizes
5. **ALWAYS run post-creation audit** — component purity, variable binding, text styles
6. **ALWAYS create responsive variants** — Desktop 1440, Tablet 768, Mobile 390
7. **ALWAYS use the mapping tables** — `react-to-figma-mapping.md` for React↔Figma translation
