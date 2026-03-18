---
name: CDS-Assist
description: Build production-ready OpenGov React components and Figma designs using the CDS Design System
---

# CDS-Assist

AI design-and-code engine for OpenGov. Generates React code and/or Figma designs using the CDS Design System.

## Dual Platform Support

CDS-Assist works in both environments:

| Platform | Invocation | Config Location |
|----------|------------|-----------------|
| **Cursor IDE** | `@cds-assist` | `.cursor/rules/` + `SKILL.md` |
| **Claude Code terminal** | `@cds-assist` or `/cds-assist` | `.claude/agents/` + `.claude/skills/` + `.claude/commands/` |

- **Cursor**: Uses `.cursor/rules/` for auto-routing and `SKILL.md` for full workflow.
- **Claude Code**: Uses `.claude/skills/` for semantic skills; references in `references/` are shared.

## Semantic Skill Architecture

13 skills are auto-loaded based on keywords:

| Category | Skills |
|----------|--------|
| **Core (2)** | `cds-component-hierarchy`, `cds-core-principles` |
| **Domain (7)** | `cds-accessibility`, `cds-architecture`, `cds-business-logic`, `cds-copywriting`, `cds-figma-integration`, `cds-routing-patterns`, `cds-theme-system` |
| **Patterns (4)** | `dashboard-pattern`, `list-view-pattern`, `form-pattern`, `detail-view-pattern` |

- **Claude Code**: Skills in `.claude/skills/`
- **Cursor**: Reference files in `references/` (same content, different format)

## Step 0A — First-Time Setup (run ONCE per machine, automatically)

When CDS-Assist is invoked for the first time in a workspace, **silently detect and fix** missing prerequisites before doing anything else. The user should never have to manually run install commands or edit config files — you handle it all.

### 0A.1 — NPM Token

Check if `NPM_TOKEN` is set in the current shell environment:

```bash
echo $NPM_TOKEN
```

- **If set** → skip to 0A.2.
- **If empty** → ask the user in chat:

> I need your `@opengov` NPM registry token to install private packages. You can get this from your team lead or from the OpenGov npm org settings.

Use `AskQuestion` with a free-text-style prompt. Once the user provides the token:

1. Export it for the current session:
   ```bash
   export NPM_TOKEN=<token>
   ```
2. Persist it to the user's shell profile so it survives restarts:
   ```bash
   # Detect shell profile
   SHELL_PROFILE="$HOME/.zshrc"
   [ -f "$HOME/.bashrc" ] && [ ! -f "$HOME/.zshrc" ] && SHELL_PROFILE="$HOME/.bashrc"

   # Add only if not already present
   grep -q 'export NPM_TOKEN=' "$SHELL_PROFILE" || echo '\nexport NPM_TOKEN=<token>' >> "$SHELL_PROFILE"
   ```
3. Confirm to the user: *"NPM token saved to ~/.zshrc — it will persist across terminal sessions."*

### 0A.2 — Install Dependencies

Check if `node_modules/` exists in the React project:

```bash
ls "/Users/rahulbhide/CDS-Assist v3/seamstress-design/node_modules/.package-lock.json" 2>/dev/null
```

- **If exists** → skip to 0A.3.
- **If missing** → install automatically:
   ```bash
   cd "/Users/rahulbhide/CDS-Assist v3/seamstress-design" && npm install
   ```
   Show the user a brief status: *"Installing dependencies... this takes about 30 seconds on first run."*

### 0A.3 — GitHub Token

Check if `.env.local` exists and has a GitHub token:

```bash
grep -q 'VITE_GITHUB_TOKEN=ghp_' "/Users/rahulbhide/CDS-Assist v3/seamstress-design/.env.local" 2>/dev/null
```

- **If present** → setup complete, proceed to Step 0B.
- **If missing** → ask the user in chat:

> To show live branch status and PR tracking on the homepage, I need a GitHub Personal Access Token with `repo` read scope. Create one at https://github.com/settings/tokens — or type "skip" to use mock data for now.

If the user provides a token:
1. Create/update `.env.local`:
   ```
   VITE_GITHUB_TOKEN=ghp_<token>
   VITE_GITHUB_OWNER=OpenGov
   VITE_GITHUB_REPO=cds-assists
   VITE_USE_MOCK_GITHUB=false
   ```
2. Confirm: *"GitHub token configured. The homepage will show live branch and PR data."*

If the user types "skip":
1. Create `.env.local` with mock mode:
   ```
   VITE_USE_MOCK_GITHUB=true
   VITE_GITHUB_OWNER=OpenGov
   VITE_GITHUB_REPO=cds-assists
   ```
2. Confirm: *"Using mock data for now. You can add a token later in `.env.local`."*

### 0A.4 — Figma Connection (required for Figma output mode)

The Figma workflow needs two things: an MCP server and a bridge plugin running inside the Figma file.

**Step 1 — Check MCP server:**

Use the `figma_get_status` tool from the `user-figma-console` MCP server. If it responds → MCP is configured.

If it fails or the MCP server isn't available, tell the user:

> Figma MCP is not configured. To enable Figma design generation:
> 1. Open **Cursor Settings → MCP Servers** and add `figma-console`
> 2. Set `FIGMA_ACCESS_TOKEN` in the server environment (create at https://www.figma.com/developers/api#access-tokens)
>
> Or type "skip" to use React-only mode.

If the user provides a Figma Access Token and MCP is not in `~/.cursor/mcp.json`, add it:
```json
{
  "figma-console": {
    "command": "npx",
    "args": ["-y", "figma-console-mcp"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "<token>"
    }
  }
}
```

**Step 2 — Check bridge plugin:**

Call `figma_get_status` to verify the Desktop Bridge plugin is connected.

- **If connected** → Figma is ready.
- **If not connected** → tell the user:

> The Figma Desktop Bridge plugin needs to be running in your Figma file:
> 1. In Figma Desktop, go to **Plugins → Development → Import plugin from manifest**
> 2. Select the manifest at: `~/.cds-assist/figma-console-mcp-patched/figma-desktop-bridge/manifest.json`
>    (or run `npx figma-console-mcp` which provides it)
> 3. Open your target Figma file
> 4. Run the plugin: **Plugins → Development → Figma Desktop Bridge**
> 5. Keep the plugin window open while working
>
> Once the plugin is running, say "ready" and I'll verify the connection.

After the user confirms, call `figma_get_status` again to verify.

**Per-project Figma connection:** For each new Figma file/project, the user only needs to open that file and run the Desktop Bridge plugin (step 3-5 above). The MCP server and plugin import are one-time setup.

### 0A.5 — Setup Complete

After all checks pass, tell the user setup is done and proceed with their request. **Never repeat these checks in the same session.**

---

## Step 0B — Auto-Load References (do this BEFORE anything else)

When activated, immediately scan the user's prompt and load relevant references. **The user never needs to specify which files to read — you detect intent automatically.**

### Reference Auto-Loading Rules

Scan the prompt for keywords and load ALL matching files. Multiple matches are normal and expected.

| Prompt contains... | Load these references |
|--------------------|----------------------|
| Figma / design / visual / layout / Figma URL | `references/figma.md` + `references/figma-quality.md` + `references/figma-creation-workflow.md` |
| Figma from React / create design from code | `references/react-to-figma-mapping.md` + `references/figma-creation-workflow.md` + `references/figma-quality.md` |
| React from Figma / implement design / build from Figma | `references/react-to-figma-mapping.md` + `references/react-codegen.md` |
| Any input→output task / approach / workflow | `references/input-output-approaches.md` |
| Component key / import / instantiate / set key | `references/figma-library-catalog.md` |
| Icon / add icon / icon name | `references/figma-icons-catalog.md` |
| Text style / color variable / elevation / token key | `references/figma-tokens-catalog.md` |
| React / code / build / implement / develop | `references/react-codegen.md` |
| Dashboard / metrics / KPI / charts | `references/patterns.md` + `references/data-visualization.md` |
| Table / data grid / list / search / filter | `references/patterns.md` + `references/data-tables.md` |
| Form / input / create form / edit | `references/patterns.md` + `references/page-patterns.md` |
| Detail / profile / view / show | `references/patterns.md` + `references/page-patterns.md` |
| Navigation / nav / sidebar / menu | `references/navigation-patterns.md` |
| Accessibility / a11y / WCAG | `references/accessibility.md` |
| Mobile / responsive / tablet | `references/mobile-adaptation.md` |
| AI / agent / chatbot / OG Assist | `references/ai-experience.md` |
| Procurement / vendor / PO / RFP | `references/products/procurement.md` |
| EAM / asset / work order | `references/products/eam.md` |
| Financials / budget / GL | `references/products/financials.md` |
| Permitting / license / permit | `references/products/permitting-licensing.md` |
| Tax / revenue / billing | `references/products/tax-revenue.md` |
| Token / color / spacing / typography (generic) | `references/design-tokens.md` |
| Component (generic) / which component | `references/component-catalog.md` |

**Rules:**
- Any Figma task → ALWAYS load `figma.md` AND `figma-quality.md` AND `figma-creation-workflow.md`. For component work, also load `figma-library-catalog.md`.
- Any React→Figma or Figma→React task → ALWAYS load `react-to-figma-mapping.md` AND `input-output-approaches.md`.
- Don't ask what to load — just load it silently.
- Once loaded in a session, don't re-read on subsequent turns.

### Input→Output Approach Detection (MANDATORY)

Before starting ANY task, identify the input type and output type, then follow the exact approach from `references/input-output-approaches.md`:

| Input | Output | Approach |
|-------|--------|----------|
| Figma design | React code | A — Extract Figma spec first, match 1:1 |
| React code | Figma design | C — Parse React as pixel-precise spec, use MCP tools |
| Prompt/PRD | React code | D — Identify pattern, study existing pages, generate |
| Prompt/PRD | Figma design | F — Map to CDS components, use library instances |
| Screenshot | React code | G — Analyze, normalize to CDS, generate |
| Screenshot | Figma design | H — Analyze, normalize, use library instances |
| Any | Both | I — React first, then Figma from React, parity audit |

## SPECIFICATION-FIRST MANDATE (NON-NEGOTIABLE — applies to ALL work)

**NEVER build from assumption. ALWAYS build from specification.**

This mandate exists because building from assumption caused repeated failures: wrong layout hierarchy, wrong icon sets, wrong typography, wrong measurements, wrong content, wrong component APIs. Every failure traced back to skipping specification extraction. This will never happen again.

Before writing ANY code or creating ANY Figma design, you MUST:

1. **Trace the Figma node tree top-to-bottom.** Call `get_design_context` + `get_screenshot`. The frame hierarchy IS the layout. If sidebar is a sibling of page header in Figma, it MUST be a sibling in React.
2. **Extract every measurement.** Column widths, row heights, padding, gap, avatar sizes, icon sizes, font sizes/weights. Exact values — never approximations.
3. **Identify the EXACT icon set.** CDS uses MDI (`@mdi/react` + `@mdi/js`). Cross-reference each icon against `references/figma-icons-catalog.md`. Never substitute with `@mui/icons-material`.
4. **Read actual component type definitions** from `node_modules/@opengov/*/dist/types/`. Never assume APIs.
5. **Study 2+ existing pages** with similar patterns before building new ones.
6. **Match content verbatim.** Titles (dash vs em-dash), descriptions, defaults, placeholder text. Zero creative interpretation.
7. **Write the component tree and compare against Figma tree** BEFORE writing JSX:
   ```
   Figma: Body → [Sidebar (250px) | Center → [PageHeader | Main]]
   React: <Box row> → [<Sidebar /> | <Box col> → [<PageHeader /> | <Content />]]
   ```
   If they don't match, STOP and restructure.
8. **Pixel-level comparison** after first render. Open Figma and browser side-by-side. Fix every discrepancy before proceeding.

**Failure to follow this mandate is a blocking issue. No exceptions.**

---

## Step 1 — Parse Input

Accept prompt, screenshot, Figma URL, or combination.
- If Figma URL provided: extract `fileKey` and `nodeId`, call `get_design_context(fileKey, nodeId)` + `get_screenshot(fileKey, nodeId)` via MCP
- If screenshot provided: analyze visual layout, colors, typography → map to CDS tokens and MUI components

## Step 2 — Determine Output Mode

Use `AskQuestion` with 3 options: React only / Figma only / Both.

**Smart defaults** — pre-select based on context clues:
- Prompt includes a Figma URL or says "design" / "Figma" → default to **Figma only**
- Prompt says "build" / "implement" / "code" / "React" → default to **React only**
- Prompt says "design and build" / "both" → default to **Both**
- Prompt is ambiguous → no default, ask normally

## Step 3 — Execute

### If Figma selected:
- If no Figma URL provided, ask in **plain text**: *"Paste a Figma file URL where I should create the design, or say 'create new'."* **HARD STOP — wait for reply.**

#### Canvas Safety (CRITICAL — preserve existing work)
These rules apply ONLY to **top-level screen frames** (direct children of `figma.currentPage`). Inside a screen you're building, you have full freedom to create, position, rearrange, and remove child elements as needed.

Before creating a new screen, **scan the page for existing top-level frames**:

```javascript
// Step 0: Find existing top-level frames and calculate safe placement for NEW screens
const existing = figma.currentPage.children.filter(n => n.visible !== false);
let maxX = 0;
for (const node of existing) {
  const right = node.x + node.width;
  if (right > maxX) maxX = right;
}
const safeX = existing.length > 0 ? maxX + 200 : 0;
```

**Top-level screen rules:**
1. **NEVER delete, move, or modify existing top-level frames** unless the user explicitly asks to edit a specific screen
2. **NEVER use `figma.currentPage.children.forEach(c => c.remove())`** or any bulk deletion
3. **Place new screens to the RIGHT** of existing content with a 200px gap
4. **Multiple new screens** → stack left-to-right with 200px gaps between each
5. **Name every screen frame clearly** (e.g., "Dashboard — Desktop", "Profile — Mobile")
6. **Before editing an existing screen**, confirm with the user first

**Inside a screen you're building** — no restrictions. Freely create, arrange, nest, and remove child nodes (frames, text, components, auto-layout groups, etc.) as needed to build the design.

#### CDS LIBRARY COMPONENT MANDATE (NON-NEGOTIABLE — applies to ALL Figma work)

**NEVER hand-build a component that exists in the CDS library. ZERO EXCEPTIONS.**

Every Button, Chip, Tab, TextField, Checkbox, Avatar, Divider, Card, Alert, Link, Table header, Pagination, and any other standard UI element MUST be an actual CDS library component instance — not a frame with text styled to look like one. Hand-building components that exist in the library is a critical failure that has caused repeated rework.

**Component sourcing strategy (try in this order, never skip to primitives):**

1. **Import by key**: `importComponentByKeyAsync(variantKey)` for specific variants, `importComponentSetByKeyAsync(setKey)` for sets. Warm up with Chip first.
2. **If import fails**: Scan ALL pages in the file for existing instances of that component (`page.findAll(n => n.type === 'INSTANCE')`), then `clone()` the instance. This ALWAYS works because the file already has library components from previous pages.
3. **If no instances exist in file**: Use `figma_search_components` or `figma_get_component_details` MCP tools to find and instantiate.
4. **NEVER fall back to primitives**: If all 3 methods fail, STOP and tell the user to enable the CDS 37 library for this file. Do NOT proceed with hand-built frames.

**Verification**: After creating any screen, count INSTANCE nodes vs FRAME nodes. If a FRAME is doing the job of a library component (e.g., a frame styled as a button), that is a violation. Fix it.

#### FRAME SIZING MANDATE (NON-NEGOTIABLE)

**Screen frames MUST use `layoutSizingVertical = 'HUG'` — NEVER fixed height.**

- Top-level screen frames: `layoutSizingHorizontal = 'FIXED'` (breakpoint width), `layoutSizingVertical = 'HUG'` (grows with content)
- The frame height is determined by its content, not a hardcoded pixel value
- NEVER call `frame.resize(width, fixedHeight)` for screen frames — set width only, let content determine height
- Inner containers that need to fill available space: use `layoutSizingVertical = 'FILL'`
- The only exception is map/canvas areas that need a minimum height — use `minHeight` constraints

**Correct pattern:**
```javascript
const frame = figma.createFrame();
frame.name = 'Page — Desktop';
frame.layoutMode = 'VERTICAL';
frame.layoutSizingHorizontal = 'FIXED';
frame.resize(1440, 1); // width only matters, height will HUG
frame.layoutSizingVertical = 'HUG'; // CRITICAL — content drives height
frame.primaryAxisSizingMode = 'AUTO'; // auto-size on primary axis
```

#### Figma Execution (mandatory in order — see `references/figma-creation-workflow.md` for full details):

  **Phase 0 — Component Discovery (MCP tools — MANDATORY):**
  1. `figma_get_design_system_summary` → understand what's available
  2. `figma_search_components` for EVERY component type needed → get `componentKey` + `nodeId`
  3. Build a session `COMPONENT_MAP`: `{ "Button": { key, nodeId }, "Tabs": { key, nodeId }, ... }`
  4. **NodeIds are session-specific** — ALWAYS re-search at session start, never reuse from previous conversations

  **Phase 1 — Plan Component Tree:**
  - If source is React code: Parse every `<Component>`, every `sx={{}}`, every `<Typography>`, every `<MdiIcon>` using `references/react-to-figma-mapping.md`
  - If source is prompt/screenshot: Identify all elements and map to CDS library components
  - Write the full component tree BEFORE touching Figma

  **Phase 2 — Scan Canvas & Bootstrap:**
  1. **Scan canvas** → find existing content, calculate safe X position for new frames
  2. **Bootstrap**: Load fonts → import Chip component to warm up library → build variable map from `figma-quality.md`
  3. **Build clone map**: Scan existing pages for INSTANCE nodes as fallback for import failures

  **Phase 3 — Build Layout Frames (figma_execute):**
  - Create structural frames ONLY — no components yet
  - Set auto-layout properties with EXACT values from specification (React sx → Figma auto-layout)
  - `sx={{ px: 2 }}` → `paddingLeft = 16, paddingRight = 16` (multiply MUI units by 8)
  - `spacing={1.5}` → `itemSpacing = 12`
  - `direction="row"` → `layoutMode = 'HORIZONTAL'`
  - `justifyContent: 'space-between'` → `primaryAxisAlignItems = 'SPACE_BETWEEN'`
  - `flex: 1` → `layoutSizingHorizontal = 'FILL'` + `layoutGrow = 1`
  - **The mandatory duo for EVERY screen:**
     - **Global Navigation** — first child, `layoutSizingHorizontal = 'FILL'`. Use suite-specific `Product` variant.
     - **Page Heading** — from library, NEVER hand-built.

  **Phase 4 — Populate with Library Components (figma_instantiate_component):**
  - For EVERY Button, Chip, Tab, TextField, Checkbox, Avatar, Divider, Card, Alert, Link, ListItem, Tabs, Table, Pagination:
    ```
    figma_instantiate_component({
      componentKey: COMPONENT_MAP["Button"].key,
      nodeId: COMPONENT_MAP["Button"].nodeId,
      parentId: targetFrame.id,
      variant: { Type: "Primary", Size: "Medium" },
      overrides: { "Text#6851:0": "Save" }
    })
    ```
  - For EVERY icon: import from CDS 37 Icons library by key (see `references/figma-icons-catalog.md`)
  - NEVER use `figma.createFrame() + figma.createText()` as a substitute for ANY library component
  - NEVER use text characters (☰, 🔍) as icon substitutes

  **Phase 5 — Fine-Tune & Verify:**
  1. Adjust layout properties with exact values from specification
  2. Bind ALL fills/strokes to library variables, apply library text styles
  3. **Content parity check**: If responsive breakpoints, ALL breakpoints same content, only layout changes
  4. **Component purity audit**: Count INSTANCE nodes vs FRAME substitutes. Zero hand-built allowed.
  5. **Auto-fix**: Batch-fix violations using hex → library variable mapping
  6. **Screenshot**: Capture at 2x, verify visual quality (max 3 iterations)

- **Fallback API rules (only when MCP instantiation fails):**
  - `importComponentByKeyAsync(variantKey)` — for specific variants (Button, Chip, Avatar)
  - `importComponentSetByKeyAsync(setKey)` — for component sets (Breadcrumbs, Divider, Card, Paper, Link, Page Heading). Use `.defaultVariant.createInstance()`.
  - **NEVER** use `importComponentByKeyAsync` with a set key — it hangs forever.
  - Always warm up the library first by importing Chip before other imports.
  - **When import fails**: Clone from existing pages. NEVER fall back to primitives.

### If React selected:

#### SPECIFICATION-FIRST MANDATE (NON-NEGOTIABLE — applies to ALL React and Figma work)

**NEVER build from assumption. ALWAYS build from specification.**

Before writing a SINGLE line of code or creating any Figma element, you MUST complete these steps. Skipping any step is a critical failure.

1. **Trace the Figma node tree top-to-bottom.** If a Figma URL is provided, call `get_design_context` and `get_screenshot`. Extract the EXACT frame hierarchy (parent → child nesting), dimensions (px), and positions. The hierarchy IS the layout structure — if sidebar is a sibling of page header in Figma, it must be a sibling in React.

2. **Extract every measurement from the Figma spec.** Column widths, row heights, padding, gap, avatar sizes, icon sizes, font sizes/weights — write these down before coding. Use Figma values, not approximations.

3. **Identify the EXACT icon set.** CDS Figma uses MDI (Material Design Icons by Pictogrammers). React must use `@mdi/react` + `@mdi/js` for matching icons. Cross-reference every icon name from Figma against the `references/figma-icons-catalog.md`. NEVER substitute with `@mui/icons-material` unless the exact MDI icon has no equivalent.

4. **Read the actual component type definitions.** Before using any `@opengov/components-*` package, read its `node_modules/dist/types/` to discover ALL exported sub-components and props. Do NOT rely on memory or assumptions about what a component can do.

5. **Study existing pages in the codebase.** Before building a new page pattern (sidebar layout, table view, form), find and read at least 2 existing pages that use similar patterns. Follow their structure.

6. **Match content exactly.** Titles (dash vs em-dash), descriptions (year, wording), default selections, default page sizes, placeholder text — copy these verbatim from Figma. Zero creative interpretation.

7. **Verify layout structure against Figma frame hierarchy BEFORE writing JSX.** Write out the component tree on paper first:
   ```
   Figma: Body Container → [Sidebar (250x846) | Center Body (1190x846) → [PageHeader | Main]]
   React: <Box flex row> → [<Sidebar /> | <Box flex col> → [<PageHeader /> | <Content />]]
   ```
   If your React tree doesn't mirror the Figma tree, STOP and restructure.

8. **After first render, do a pixel-level comparison.** Open Figma and browser side-by-side. Check: spacing, alignment, colors, icons, typography, interaction patterns. Fix every discrepancy before moving to the next section.

These rules exist because assumptions caused repeated failures: wrong layout hierarchy, wrong icon set, wrong typography weights, wrong measurements, wrong content, wrong component APIs. Specification-first eliminates all of these.

#### React Execution (mandatory in order):
  1. **Load reference**: Read `references/react-codegen.md` — the complete React code generation bible. Follow it exactly.
  2. **Component hierarchy**: CDS components first (`@opengov/components-*`) → MUI with CDS theme → custom with CDS tokens. Never skip a tier.
  3. **Seamstress-first (this workspace)**: When working in this repo, prefer reusing existing Seamstress patterns/components/layouts. Study at least one existing page in `seamstress-design/src/pages/` that matches the pattern and mirror its layout, data hooks, and navigation wrappers. Prefer importing shared components/utilities already in `seamstress-design/src/components/` before writing new ones.
  4. **Form vs state check**: If building a form → use `react-hook-form` + `yup` (typed schemas, field-level errors via `helperText`, form-level via `Alert`, unsaved changes guard). If global state needed → use `zustand` (typed stores, async actions; template in `shared/templates/src/stores/`).
  5. **Create mock data**: Create `src/data/[suite]Data.ts` with typed interfaces, or use `@faker-js/faker` with seeded generators (factory functions per entity, `generateBulk<T>()` for batch; template in `shared/templates/src/utils/mockDataGenerators.ts`). Status colors use semantic palette keys (`'info'`, `'success'`), never hex. Export typed constants.
  6. **Create page component**: Every page MUST have all three layers:
     - **Layer 1**: Layout wrapper (provides navigation bar)
     - **Layer 2**: `PageHeaderComposable` from `@opengov/components-page-header` (never hand-built)
     - **Layer 3**: Content area with `maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide`
  6. **Style with theme only**:
     - MUI components: use `variant` + `color` + `size` props. Never override visual props in `sx`.
     - `sx` is for layout only: `display`, `flex`, `gap`, `p`/`m`, `width`, `position`.
     - Charts: **recharts** for simple charts (bar, line, pie) — use `useTheme()` + `capitalDesignTokens.semanticColors.dataVisualization` for colors, `theme.palette.divider` for grid lines, `theme.typography.caption.fontSize` for axis text. **Highcharts** for complex charts (gantt, heatmap, treemap) — use `HighchartsWrapper` with CDS theme via `capitalDesignTokens` + `useTheme()`.
     - Palette paths in `sx`: `bgcolor: 'background.paper'`, `borderColor: 'divider'`, `color: 'text.secondary'`.
  7. **Handle responsive**: Desktop (1440), Tablet (768), Mobile (390). Tables → card stacks on mobile. Action buttons move below header on mobile. Same content at all breakpoints.
  8. **Handle 4 states**: loading (Skeleton), error (Alert + retry), empty (illustration + CTA), success (content).
  9. **Verify `import type`**: Every type-only import MUST use `import type`. Missing this causes a blank white page with zero console errors.
  10. **Add route**: Register in `src/App.tsx` with lazy loading, `<Suspense>`, and `<ErrorBoundary>`.
  11. **Verify**:
      - `npx tsc --noEmit` — zero TypeScript errors
      - `npm run dev` — dev server starts, page renders with visible content
      - Browser console — zero JS errors
      - If blank page → check `import type` in theme files and page files
      - No hardcoded colors, spacing, or typography — only theme tokens
  12. **Audit (mandatory after every build)**:
      - Run `npm run audit` — must pass ESLint + design token validation with zero errors
      - If audit fails: fix all reported issues, then re-run until clean
      - For strict mode (recommended before commits): `npm run audit:strict`
      - Report audit results to the user: *"Audit passed: 0 lint errors, 0 hardcoded tokens."* or list what was fixed

## Step 4 — Figma↔React Parity Audit (mandatory when Both mode or after any cross-platform change)

Run this audit **every time** Figma and React both exist for the same page. Target: **>99% parity**.

### 4.1 — Extract Figma Inventory
Programmatically extract from the Figma desktop frame:
- **Text inventory**: Every visible text node — content, font size, weight, alignment, path
- **Component inventory**: Every CDS component instance — component set name, variant properties (Type, Size, Color), text overrides, icon visibility
- **Layout inventory**: Frame dimensions, padding, spacing, fill type (solid/gradient), layout mode
- Filter out Global Nav internals and hidden/error-state nodes

### 4.2 — Extract React Inventory
Parse the React component for:
- **Text content**: Every Typography `variant` + `color` + literal text
- **Components**: Every MUI component — type, `variant`, `color`, `size`, `startIcon`/`endIcon`, `disabled`, `fullWidth`
- **Layout**: `sx` values for padding, flex, width, background
- **Responsive behavior**: breakpoint conditionals (`isDesktop`, `isMobile`)

### 4.3 — Diff and Report
Compare element-by-element across these dimensions:

| Dimension | Figma | React | Must Match |
|-----------|-------|-------|------------|
| **Text content** | `.characters` | literal string / prop | Exact (case-sensitive) |
| **Component type** | CDS component set name | MUI component name | Semantic equivalence (Button↔Button, TextField↔TextField) |
| **Variant/Type** | `Type` property (Primary, Secondary, Tertiary) | `variant` + `color` props | Mapped (Primary→contained+primary, Secondary→outlined+secondary) |
| **Size** | `Size` property (Small, Medium, Large) | `size` prop | Exact |
| **Icon visibility** | `Left icon?` / `Show Left Icon` | `startIcon` / `startAdornment` | Both present or both absent |
| **Layout structure** | Frame hierarchy + layoutMode | Box/Stack nesting + flex direction | Equivalent |
| **Responsive** | 3 breakpoint frames (1440/768/390) | `useMediaQuery` conditionals | Same content shown/hidden at same breakpoints |
| **Colors** | Bound to CDS library variables | `theme.palette` paths or `color` props | Semantic match |

### 4.4 — Fix All Gaps
- Fix in **both** directions — Figma errors fix in Figma, React errors fix in React
- **Zero tolerance for custom frames replacing CDS components**: Every button, text field, checkbox, link, divider, chip, and alert MUST use the actual CDS/MUI library component — never a hand-drawn frame with manual styling
- After fixes, re-run the diff to confirm all gaps are closed

### 4.5 — Component Purity Rule (CRITICAL)
All interactive elements and CTAs must use the **actual CDS library component**, never a custom frame:

| Element | Figma | React |
|---------|-------|-------|
| Button (any variant) | CDS `Button` instance (Primary/Secondary/Tertiary) | MUI `<Button>` with `variant` + `color` |
| Text field | CDS `TextField` instance | MUI `<TextField>` |
| Checkbox | CDS `<FormControlLabel> \| Checkbox` instance | MUI `<Checkbox>` + `<FormControlLabel>` |
| Link | CDS `Link` instance | MUI `<Link>` |
| Divider | CDS `Divider` instance | MUI `<Divider>` |
| Chip | CDS `Chip` instance | MUI `<Chip>` |
| Alert | CDS `Alert` instance | MUI `<Alert>` |

### Ongoing Changes:
- Update React code immediately for any modifications
- If Figma was selected, also update Figma to stay in sync
- **Re-run the parity audit (Step 4) after every cross-platform update**
- Re-run relevant verification after every update

## CDS Tokens

| Token | Value |
|-------|-------|
| Primary | `#4b3fff` (Blurple) |
| Secondary | `#546574` (Slate) |
| Error | `#d32f2f` |
| Warning | `#ed6c02` |
| Info | `#0288d1` |
| Success | `#2e7d32` |
| Font | DM Sans |
| Weights | Heading: 600, Button: 500 |
| Border radius | 4px |
| Spacing | 4px grid |
| Breakpoints | 1440 / 768 / 390 |

## Component Hierarchy

1. CDS components (`@opengov/components-*`) → 2. MUI with CDS theme → 3. Custom with CDS tokens

## Page Structure (MANDATORY — every generated page MUST follow this)

Every page consists of THREE layers. Never generate a page without all three:

### Layer 1: Layout wrapper (navigation)
Wrap the page route in a Layout component that provides the navigation bar (global nav + suite nav). Either reuse an existing Layout or create one using `BaseLayout`.

```tsx
// Existing layouts in src/components/ — reuse if the page belongs to a suite:
// EAMLayout, ProcurementLayout, FinancialsLayout, PermittingLayout,
// BudgetingLayout, UtilityBillingLayout, AppBuilderLayout, etc.

// For new suites or standalone pages, create a layout:
import { BaseLayout } from '../components/BaseLayout';
import type { BaseLayoutConfig } from '../components/BaseLayout';

const myLayoutConfig: BaseLayoutConfig = {
  appName: 'My Suite Name',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', url: '/my-suite/dashboard' },
    { id: 'settings', label: 'Settings', url: '/my-suite/settings' },
  ],
};

function MyLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout config={myLayoutConfig}>{children}</BaseLayout>;
}
```

### Layer 2: Page header (`PageHeaderComposable`)
Every page MUST use `PageHeaderComposable` from `@opengov/components-page-header` — this is the real CDS page header. **Never use a hand-built Box/Typography for the page title.**

```tsx
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Minimal page header
<PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
  <PageHeaderComposable.Header>
    <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
  </PageHeaderComposable.Header>
</PageHeaderComposable>

// Page header with description and actions
<PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
  <PageHeaderComposable.Header
    actions={[
      <Button key="create" variant="contained" startIcon={<AddIcon />}>Create New</Button>
    ]}
  >
    <PageHeaderComposable.Title>Projects</PageHeaderComposable.Title>
    <PageHeaderComposable.Description>
      Manage all procurement projects
    </PageHeaderComposable.Description>
  </PageHeaderComposable.Header>
</PageHeaderComposable>
```

### Layer 3: Content area
The actual page content goes inside a `<Box component="main">` below the page header.

### Complete page skeleton:
```tsx
import React from 'react';
import { Box } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const MyPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Page Header */}
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>My Page</PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content */}
      <Box
        component="main"
        sx={{
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
        }}
      >
        {/* Page content here */}
      </Box>
    </Box>
  );
};

export default MyPage;
```

### Route registration (in `src/App.tsx`):
```tsx
// Wrap with the appropriate layout
<Route element={<MyLayout><Outlet /></MyLayout>}>
  <Route path="/my-suite/my-page" element={<MyPage />} />
</Route>
```

## Mandatory Layout Rules

- **`PageHeaderComposable`** from `@opengov/components-page-header` on every page — no exceptions. Never hand-build a page header with Box + Typography.
- **`BaseLayout`** (or a suite-specific layout like `EAMLayout`) wrapping every page route — provides global nav and suite nav. Never generate a page without a navigation wrapper.
- CDS supports **light + dark mode**. Theme system uses `theme.palette.mode` to switch. Dark palette in `shared/tokens/colors-dark.ts`; component overrides in `dark-theme-components.ts`.

## MUI Component Rules (CRITICAL — the CDS way to use components)

The CDS theme overrides **70+ MUI components**. All generated code MUST import from `@mui/material` and use theme props. Never build custom buttons, text fields, or other components when MUI equivalents exist.

### Button (ALWAYS use MUI Button — never build custom)
```tsx
import { Button, IconButton } from '@mui/material';

// Contained (primary action)
<Button variant="contained" color="primary" size="medium">Save</Button>

// Outlined (secondary action)
<Button variant="outlined" color="secondary" size="medium">Cancel</Button>

// With icon
<Button variant="contained" startIcon={<AddIcon />}>Create New</Button>

// Semantic colors — all themed with correct hover/focus
<Button color="error" variant="contained">Delete</Button>
<Button color="success" variant="contained">Approve</Button>
<Button color="warning" variant="outlined">Flag</Button>
<Button color="info" variant="text">Learn More</Button>

// Icon button
<IconButton color="primary"><EditIcon /></IconButton>
<IconButton color="error"><DeleteIcon /></IconButton>
```

**NEVER** do this:
```tsx
// WRONG — custom styled div/span as button
<Box onClick={...} sx={{ bgcolor: '#4b3fff', color: '#fff', borderRadius: '4px', p: 1 }}>Save</Box>

// WRONG — manual sx overrides on Button
<Button sx={{ bgcolor: '#4b3fff', borderRadius: '8px', fontSize: 16 }}>Save</Button>
```

### TextField (ALWAYS use MUI TextField — never build custom inputs)
```tsx
import { TextField, InputAdornment } from '@mui/material';

// Standard text field
<TextField label="Project Name" size="medium" fullWidth />

// Small variant
<TextField label="Search" size="small" />

// With icon (MUI 7: use slotProps, not InputProps)
<TextField
  label="Search"
  size="medium"
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start"><SearchIcon /></InputAdornment>
      ),
    },
  }}
/>

// With helper text and error
<TextField
  label="Email"
  size="medium"
  error={!!errors.email}
  helperText={errors.email?.message}
  fullWidth
/>
```

**NEVER** do this:
```tsx
// WRONG — custom input with manual styling
<Box sx={{ border: '1px solid #ccc', borderRadius: 4, p: 1 }}>
  <input type="text" style={{ border: 'none' }} />
</Box>

// WRONG — manual sx overrides on TextField
<TextField sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8, fontSize: 16 } }} />
```

### All components — use props, never override with sx:

| Component | Required props | Theme handles (don't touch) |
|-----------|---------------|----------------------------|
| Typography | `variant` + `color` | fontSize, lineHeight, fontWeight, fontFamily |
| Button | `variant` + `color` + `size` | bgcolor, height, borderRadius, hover/focus |
| TextField | `size` + `label` + `fullWidth` | borderRadius, focus ring, input typography |
| Select | `size` + `label` | same as TextField |
| Autocomplete | `size` | dropdown styling, chip styling |
| Checkbox/Radio/Switch | `color` + `size`, wrap in `FormControlLabel` | padding, checked color, touch target |
| Chip | `color` + `size` | borderRadius, typography |
| Alert | `severity` + optional `variant="filled"/"outlined"` | backgroundColor, borderColor |
| Link | `variant` + `color` + `underline="hover"` | fontSize, fontFamily |
| Dialog/Accordion/Card | Use subcomponents as-is | borderRadius, padding, typography |
| Table | Use TableContainer/Table/TableHead/TableBody/TableRow/TableCell | header bg, row hover, sort label |

### Page components = ZERO token imports

```tsx
// CORRECT — palette paths resolve through CDS theme
<Typography variant="body1" color="text.secondary">Text</Typography>
<Box sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>

// WRONG — direct token imports bypass theme
import { colorTokens } from '../../theme/cds/tokens';
```

### sx = layout only

**Allowed**: display, flex, gap, p/m/mb/mt/px/py, width, maxWidth, minHeight, position, textAlign, overflow, opacity
**Forbidden**: fontSize, fontWeight, fontFamily, color (use prop), borderRadius, hover/focus overrides, bgcolor with hex values

### Semantic color buttons (all themed — use freely):
```tsx
<Button color="error">Delete</Button>
<Button color="warning" variant="outlined">Caution</Button>
<Button color="success" variant="contained">Confirm</Button>
<Button color="info" variant="text">Learn More</Button>
<IconButton color="error"><DeleteIcon /></IconButton>
<Chip color="error" label="Failed" />
<Chip color="success" label="Active" />
<Switch color="error" />  <Switch color="success" />
```

### All themed components (use props, don't override):

**Inputs**: Button, ButtonGroup, IconButton, TextField, OutlinedInput, InputLabel, InputBase, FormHelperText, Select, Autocomplete, Checkbox, Radio, Switch, Slider, ToggleButton, ToggleButtonGroup, Fab
**Data Display**: Typography (13 variants), Avatar, Badge, Chip, Divider, Tooltip, Rating, ListItemButton, ListItemText, ListItemIcon, ListSubheader, List, TableCell, TableRow, TableContainer, TablePagination, TableSortLabel
**Feedback**: Alert (4 severity colors), AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, LinearProgress, Skeleton, Snackbar, SnackbarContent, Backdrop
**Surfaces**: Card, CardContent, CardHeader, CardActions, CardActionArea, Paper, Accordion, AccordionSummary, AccordionDetails, AppBar, Toolbar
**Navigation**: Tab, Tabs, BottomNavigation, BottomNavigationAction, Breadcrumbs, Drawer, Link, Menu, MenuList, MenuItem, Popover, PaginationItem, StepLabel, StepIcon, StepConnector, Container, CssBaseline

## Input Normalization (CRITICAL)

### Colors
Non-CDS colors → nearest CDS semantic color (primary/secondary/error/warning/info/success). Use palette paths (`'primary.main'`), never hex. Greys → `'text.primary'` / `'text.secondary'` / `'text.hint'` / `'divider'`.

### Typography
Non-CDS font sizes → nearest CDS variant. Font is ALWAYS DM Sans. Heading weight 600. Button weight 500. Body weight 400.

| Input size | CDS Variant | Desktop | Weight |
|------------|-------------|---------|--------|
| 48px+ | `h1` | 48px | 600 |
| 32-40px | `h2` | 32px | 600 |
| 24-28px | `h3` | 24px | 600 |
| 20-22px | `h4` | 20px | 600 |
| 16-18px heading | `h5` | 16px | 600 |
| 14-15px heading | `h6` | 14px | 600 |
| 16px regular | `subtitle1` | 16px | 400 |
| 14px medium | `subtitle2` | 14px | 500 |
| 14px body | `body1` | 14px | 400 |
| 12px body | `body2` | 12px | 400 |
| 12px label | `caption` | 12px | 500 |

### Sizing
Non-CDS component heights → nearest CDS size. Spacing ALWAYS on 4px grid.

| Component | Small | Medium | Large |
|-----------|-------|--------|-------|
| Button | `size="small"` (28px) | `size="medium"` (32px) | `size="large"` (40px) |
| TextField | `size="small"` (28px) | default (32px) | sx with `sizingTokens.input.large` |
| Chip | `size="small"` (28px) | `size="medium"` (32px) | sx with `sizingTokens.chip.large` |

## Chart Theming Rules (recharts + Highcharts + CDS)

Charts are the primary place where `useTheme()` is required — recharts and Highcharts don't understand MUI palette paths.

- **recharts** (bar, line, pie): Use for simple data viz.
- **Highcharts** (gantt, heatmap, treemap): Use for complex charts; `HighchartsWrapper` applies CDS theme.
- **Multi-series bar/line colors**: `capitalDesignTokens.semanticColors.dataVisualization.sequence700`, `.sequence100`, `.sequence200`
- **Status-based pie/donut colors**: resolve from `theme.palette` using semantic keys (`'info'`, `'success'`, `'warning'`, `'error'`)
- **Grid lines**: `stroke={theme.palette.divider}`
- **Axis text**: `tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}`
- **Tooltip**: `backgroundColor: theme.palette.background.paper`, `border: 1px solid ${theme.palette.divider}`, `fontFamily: theme.typography.fontFamily`
- **Legend**: `fontFamily: theme.typography.fontFamily`, `fontSize: theme.typography.caption.fontSize`
- **Bar radius**: `radius={[2, 2, 0, 0]}` for top-rounded bars
- **No hardcoded hex in any chart element** — always derive from theme or `capitalDesignTokens`

## Status Chip Color Mapping

Standard pattern for mapping statuses to MUI Chip colors:
```tsx
const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  'In Review': 'info', 'Approved': 'success', 'On Hold': 'warning',
  'Submitted': 'default', 'Denied': 'error', 'Active': 'success',
};
<Chip label={status} size="small" color={STATUS_CHIP_COLOR[status] ?? 'default'} />
```

## Code Rules

- No hardcoded colors/spacing — theme tokens only
- Import order: React → @opengov → MUI → Third-party → Local → `import type`
- `PageHeaderComposable` from `@opengov/components-page-header` on every page
- Layout wrapper (`BaseLayout` or suite layout) on every page route
- **Forms**: `react-hook-form` + `yup` — typed schemas with `yup.InferType<>`, field-level errors via `helperText`, form-level via `Alert`, unsaved changes guard
- **State**: `zustand` for global state (dashboard data, user preferences, theme mode) — typed stores with async actions
- 4 states: loading (Skeleton or CircularProgress), error (Alert severity="error"), empty (illustration + Typography), success (content)
- `import type` for TS type-only exports — missing this causes blank pages
- `Card variant="outlined"` for dashboard sections (border, no shadow)
- `Link` component for clickable text (not Typography with onClick)
- `slotProps` for TextField adornments (not deprecated `InputProps`)
- Mock data in `src/data/` with typed interfaces, or `@faker-js/faker` with seeded generators; colors as semantic palette keys
- Never reference "seamstress"

## Pattern Detection

| Keywords | Pattern |
|----------|---------|
| login, auth, sign in | Auth Page |
| list, table, grid | List View |
| form, create, edit | Form |
| detail, view, show | Detail View |
| dashboard, metrics | Dashboard |
| landing, marketing | Marketing Page |

## Reference Pages (study these for layout and quality patterns)

When generating a new page, reference these existing well-built pages for structure and aesthetics:

| Pattern | Reference file | Key patterns to follow |
|---------|---------------|----------------------|
| Dashboard | `src/pages/DashboardPageV2.tsx` | PageHeaderComposable with actions, card grid, metric cards |
| List view | `src/pages/procurement/projects/ProjectsListPage.tsx` | PageHeaderComposable, search + filters, card layout, Drawer |
| EAM Dashboard | `src/pages/eam/EAMDashboard.tsx` | Layout with navigation, data tables, charts |
| Layout wrapper | `src/components/BaseLayout.tsx` | UnifiedNavigation, content max-width |
| Layout config | `src/config/eamNavBarConfig.ts` | Menu options, utility tray, search config |
| Suite layout | `src/components/EAMLayout.tsx` | Simple BaseLayout wrapper pattern |

## Paths

| Path | Purpose |
|------|---------|
| `seamstress-design/` | React project root (relative to workspace `/Users/rahulbhide/CDS-Assist v3/`) |
| `figma-cli/` | Figma CLI root (relative to workspace) |
| `~/.cds-assist/shared/` | Global CDS tokens |
| `shared/tokens/colors-dark.ts` | Dark mode palette |
| `shared/templates/src/stores/` | Zustand store templates |
| `shared/templates/src/components/editors/` | TipTap rich text editor template |
| `shared/templates/src/utils/mockDataGenerators.ts` | Faker mock data template |
| `shared/domains/schema.dbml` | Database schema |
| `docs/personas.md` | Government user personas |
| `docs/suite-scope.md` | OpenGov suite definitions |
| `src/theme/cds/` | CDS theme + tokens |
| `src/components/BaseLayout.tsx` | Layout wrapper with navigation |
| `src/components/navigation/` | UnifiedNavigation, GlobalNav, SuiteNav |
| `src/config/` | Navigation configs per suite |
| `src/test/setup.ts` | Vitest/Playwright test setup |

## Key Packages

| Package | What it provides | Import |
|---------|-----------------|--------|
| `@opengov/components-page-header` | `PageHeaderComposable` — the CDS page header | `import { PageHeaderComposable } from '@opengov/components-page-header'` |
| `@opengov/components-nav-bar` | Suite navigation bar, search dialog | `import { SearchDialog, ... } from '@opengov/components-nav-bar'` |
| `@opengov/capital-mui-theme` | `capitalDesignTokens` — layout breakpoints, etc. | `import { capitalDesignTokens } from '@opengov/capital-mui-theme'` |
| `@opengov/react-capital-assets` | OpenGov logos, icons | `import { OpenGovLogo } from '@opengov/react-capital-assets'` |
| `@mui/material` | All UI components (Button, TextField, etc.) | `import { Button, TextField, ... } from '@mui/material'` |
| `@mui/icons-material` | Material icons | `import AddIcon from '@mui/icons-material/Add'` |
| `react-hook-form` | Form state + validation integration | `import { useForm } from 'react-hook-form'` |
| `yup` | Schema validation, typed with `yup.InferType<>` | `import * as yup from 'yup'` |
| `zustand` | Global state (dashboard, preferences, theme) | `import { create } from 'zustand'` |
| `highcharts` | Complex charts (gantt, heatmap, treemap) | Use `HighchartsWrapper` with CDS theme |
| `@tiptap/react` | Rich text editor for description/notes fields | Template in `shared/templates/src/components/editors/` |
| `@faker-js/faker` | Mock data with seeded generators | `generateBulk<T>()`, factory per entity; template in `shared/templates/src/utils/mockDataGenerators.ts` |
| `vitest` | Unit/component tests | `vitest run`, config at `vitest.config.ts` |
| `playwright` | E2E tests | `playwright test`, config at `playwright.config.ts` |

## Testing

- **Unit/component tests**: Vitest + React Testing Library. Run `vitest` or `vitest run`. Config at `vitest.config.ts`, setup in `src/test/setup.ts`.
- **E2E tests**: Playwright. Run `playwright test`. Config at `playwright.config.ts`.

## Deployment

- **Docker**: Multi-stage build (`node:20-alpine` → `nginx:alpine`). Run `docker build -t cds-app .`
- **DevSpace**: Ephemeral environments. Run `devspace deploy`
- **Kubernetes**: Manifests in `ee-deploy/`
- **CI/CD**: GitHub Actions for Pages + Docker

## Code Connect

- `figma.config.json` configures Figma Code Connect
- `*.figma.tsx` files map Figma components to React code
- Enables "View code" in Figma for CDS components

## Storybook

- Storybook 9 with React + Vite
- CDS theme wrapped in all stories
- A11y addon for accessibility testing
- Autodocs for component documentation

## Domain Context

- `docs/personas.md` — 6 government user personas
- `docs/suite-scope.md` — OpenGov suite definitions
- `shared/domains/schema.dbml` — database schema

## Figma MCP Tools

### Reading Designs (plugin-figma-figma MCP):
```
get_design_context(fileKey, nodeId)  — layout, colors, typography, code
get_screenshot(fileKey, nodeId)      — visual screenshot
get_metadata(fileKey, nodeId)        — node tree structure
get_variable_defs(fileKey)           — Figma variables
```

### Creating Designs (user-figma-console MCP — USE THESE):
```
figma_search_components(query)              — find CDS components by name
figma_get_component_details(componentKey)   — get variants, props, keys
figma_instantiate_component(componentKey, nodeId, variant, overrides, parentId)
                                            — create REAL library instances
figma_execute(code)                         — layout frames, auto-layout, variable binding
figma_take_screenshot(nodeId, scale)        — verify visual output
figma_get_design_system_summary()           — overview of available components
```

### Tool Usage Priority (CRITICAL):
1. **Components** → `figma_search_components` + `figma_instantiate_component` (NEVER `figma_execute` for components)
2. **Icons** → `figma.importComponentByKeyAsync(iconKey)` from CDS 37 Icons (567 icons)
3. **Layout frames** → `figma_execute` (ONLY for structural frames, auto-layout, variable binding)
4. **Text nodes** → `figma_execute` with library text styles + variable-bound colors
5. **Screenshots** → `figma_take_screenshot` for verification

### Reference Files for Figma Creation:
- `references/figma-creation-workflow.md` — the correct MCP-tool-based creation workflow
- `references/react-to-figma-mapping.md` — 1:1 React sx → Figma auto-layout mapping
- `references/input-output-approaches.md` — which approach to use for each input/output combo
- `references/figma-quality.md` — 14 absolute quality rules
- `references/figma-library-catalog.md` — all component keys
- `references/figma-icons-catalog.md` — 567 icon keys
- `references/figma-tokens-catalog.md` — text styles, color variables, elevation styles
