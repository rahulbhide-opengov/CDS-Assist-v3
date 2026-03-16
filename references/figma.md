# CDS-Assist — Figma Design Creation Reference

Read this file when generating Figma designs. Not needed for design-spec-only or React-only output.

> **CRITICAL**: Also read `references/figma-quality.md` — it defines the mandatory quality rules for variable binding, text styles, and elevation. Every design MUST pass the zero-tolerance checklist before delivery.

> **Component & Token Catalogs**: For complete component keys, icon mappings, and token references, see:
> - `references/figma-library-catalog.md` — All 113 core + 29 pattern + 7 icon component sets
> - `references/figma-icons-catalog.md` — 567 icons with name-to-key mapping
> - `references/figma-tokens-catalog.md` — 54 text styles, 24 effect styles, all color variable keys

> **Note**: Before creating any Figma design, the agent runs a Design Reasoning step (see SKILL.md step 2) and loads domain-specific reference files based on detected keywords (e.g., `references/data-visualization.md` for dashboards, `references/data-tables.md` for grids). After creation, a Design Critique step (SKILL.md step 5) self-reviews the output for hierarchy, consistency, copy, responsive, and accessibility issues before technical verification.

## Prerequisites

- **figma-console MCP** installed (done by `install.sh`)
- **Figma Desktop** open with the Desktop Bridge plugin running
- **CDS library sources** configured (at least one; see Multi-Library Setup below)
- Verify connection: ask Claude "Check Figma status" or use `figma_get_status`

## Multi-Library Setup

CDS-Assist supports multiple Figma library files (Core components, Patterns, Icons, etc.).

### How it works

1. **Org defaults** (`cds-assist.config.json` — committed): ships with 4 pre-configured CDS libraries that every install gets automatically
2. **User overrides** (`config/figma.sources.json` — not committed): users can add product-specific libraries or override defaults
3. **Auto-sync**: before creating any design, the agent calls `figma_get_design_system_kit` for each enabled source
4. **Merged manifest** (`.figma-cache/ds.manifest.json`): contains all componentKeys, variable IDs, and style IDs from all libraries
5. **Design creation**: uses componentKeys from the manifest to instantiate real library components (not recreated shapes)

### Pre-configured org libraries (ship with repo)

These are available immediately after install — no setup needed:

| ID | Name | Role | What it provides |
|----|------|------|-----------------|
| `cds-37` | CDS 37 | core | Primary component library — all base components + tokens + styles |
| `cds-37-patterns` | CDS 37 Patterns | patterns | Page-level patterns and organisms (dashboards, forms, data tables) |
| `cds-37-icons` | CDS 37 Icons | icons | All approved icon components |
| `agents` | Agents (OG Assist) | product | OG Assist / OpenGov AI agent-specific components and patterns |

### Adding more libraries

For product-specific or team-specific libraries, add them via CLI:

```bash
npm run cds:figma:libs:add -- --url "https://figma.com/design/XXXX/My-Product" --name "My Product" --role product
```

Via agent:
```
@cds-assist add figma library "https://figma.com/design/XXXX/My-Product" as "My Product" with role product
```

### Managing libraries

```bash
npm run cds:figma:libs:list                                    # List all sources
npm run cds:figma:libs:update -- --id cds-core --priority 200  # Update priority
npm run cds:figma:libs:remove -- --id cds-icons                # Remove source
npm run cds:figma:sync                                         # Manual re-sync
```

### Source roles and precedence

| Role | Priority | What it provides |
|------|----------|-----------------|
| `core` | Highest | Base components (Button, TextField, Card, etc.) + color/spacing tokens |
| `patterns` | High | Page-level patterns (Dashboard, Form, List View, etc.) |
| `icons` | Medium | Icon components |
| `product` | Medium-Low | Product-specific components (e.g., OG Assist agent UI) |
| `other` | Default | Custom/team-specific libraries |

When tokens conflict across libraries, the highest-priority source wins.

### What file URLs/keys are

- **File URL**: `https://figma.com/design/ABC123/My-Library` — the URL from your browser
- **File key**: `ABC123` — extracted automatically from the URL; uniquely identifies the file
- Libraries must be **published** in Figma for components to be instantiable in other files

### Auto-sync behavior

| Config | Behavior |
|--------|----------|
| `syncTtlSeconds: 0` (default) | Always sync before every create |
| `syncTtlSeconds: 300` | Re-sync only if manifest is >5 min old |
| Force sync | `npm run cds:figma:sync -- --force true` |

When libraries are updated and published in Figma, the next sync automatically picks up the latest component keys and tokens.

## Design Creation Workflow (DS-First)

## Available MCP Tools

The figma-console MCP provides 57+ tools. Key ones for design creation:

### Reading Designs

| Tool | Purpose |
|------|---------|
| `figma_get_status` | Check connection status |
| `figma_navigate` | Open a Figma URL |
| `figma_take_screenshot` | Capture current canvas |
| `figma_get_variables` | Extract design tokens/variables |
| `figma_get_styles` | Get color, text, effect styles |
| `figma_get_component` | Get component data |
| `figma_search_components` | Search component library by name |
| `figma_get_file_data` | Full file structure |
| `figma_get_design_system_kit` | Full design system in one call |

### Creating Designs

| Tool | Purpose |
|------|---------|
| `figma_execute` | **Power tool** — run any Figma Plugin API code |
| `figma_instantiate_component` | Place existing components |
| `figma_create_child` | Create child nodes |
| `figma_set_text` | Set text content |
| `figma_set_fills` | Set fill colors |
| `figma_set_strokes` | Set stroke/border |
| `figma_move_node` | Position elements |
| `figma_resize_node` | Resize elements |
| `figma_clone_node` | Duplicate elements |
| `figma_rename_node` | Rename layers |
| `figma_delete_node` | Remove elements |
| `figma_arrange_component_set` | Organize variants into component sets |

### Variable/Token Management

| Tool | Purpose |
|------|---------|
| `figma_create_variable_collection` | Create token collection with modes |
| `figma_create_variable` | Create a single variable |
| `figma_batch_create_variables` | Create up to 100 variables at once |
| `figma_update_variable` | Update variable values |
| `figma_batch_update_variables` | Update up to 100 values at once |
| `figma_setup_design_tokens` | Create complete token system atomically |
| `figma_add_mode` | Add modes (e.g., "Dark", "Mobile") |

## Design Creation Workflow

### Step 0: Scan Canvas & Bootstrap (MANDATORY — see `figma-quality.md` Phase 0 + Phase 1)

Before creating ANY design elements:

1. **Scan existing top-level screens** — find all direct children of `figma.currentPage`, calculate the rightmost edge, set `SAFE_X = rightmostEdge + 200` (or 0 if page is empty). New screen frames start at `SAFE_X`. NEVER delete or move existing top-level frames. (Inside a screen you're building, freely manage child elements.)
2. Load all DM Sans font weights
3. Check for existing CDS variable collections → create if missing
4. Build `VAR_MAP` (variable name → variable object)
5. Check for text styles → create CDS text styles if missing → build `STYLE_MAP`
6. Check for effect styles → create CDS elevation styles if missing → build `EFFECT_MAP`
7. **Import Global Navigation** — insert as the FIRST child of every new screen frame with `layoutSizingHorizontal = 'FILL'`. Use the **suite-specific Product variant** when one exists; else use Default (key `c24369659d8f75ec3815d2d3ffb1342dd7e551b5`). This is mandatory for ALL breakpoints.
   - **Product variant keys**: Default `c24369659d8f75ec3815d2d3ffb1342dd7e551b5` | Procurement `0fae83904386321411e98e161624e268adeb9421` | B&P `35705b7547c5297e06e23fe6e8128fd1f7a0e3f6` | Utility Billing `3dba805ed57e9a20dac1e8aa086645029ec05c0f` | Asset Management `cdf8e5d33da9e62840d34f374e23024994c0d69f` | Agents Studio `6cd1426337fe22414c939ede70f4aa97630c72a8` | Vendor Portal `2945658715a063337c3e72bd6f557c07e23849f6` | Command Center `011496137077293e614fd65154c6944ca0db6655`
8. **Add PSP Menu** — the Platform Side Panel (PSP) is mandatory on every screen. On **desktop**: add a visible 320px left sidebar (below Global Nav, left of content area) with sections: Entity selector, Action Hubs (Command Center, Notifications, Workflows, Reports, Data Management), Products (list all OpenGov suites, highlight the current one), Capabilities (Agent Studio, Government App Builder), Preferences (Admin settings). On **tablet/mobile**: PSP is hidden behind the hamburger menu icon in the Global Nav — no visible sidebar needed. Component key: `16da480901ce5bdd694aa97596f7f6bd3eddff32` (import may time out for this complex component — build manually if needed, matching the CDS pattern exactly).
9. **Import Page Heading** — NEVER hand-build page headers. Use the `Page Heading` component (set key `ed8d390034cdc9b76fc11e1e2647856ff734d33d`, default variant key `17d737470c3a274dececd1d355b594e75e2622c1`). Insert after the nav area. Set `layoutSizingHorizontal = 'FILL'`. For tablet/mobile, set `Small Screen: True`. Override text nodes: `h1` = title, `body1` = description, `body2` items = breadcrumbs. Configure booleans: `Breadcrumbs`, `Description`, `Actions`, `Divider` as needed.
10. **Plan content parity** — if creating multiple breakpoints, list all content sections from the desktop version. Every tablet and mobile screen MUST include every section with the same data (same rows, same items, same charts). Only the layout changes.

### Step 1: Connect and Navigate

```
figma_get_status → verify connection is active
figma_navigate → open the target Figma file URL
```

### Step 2: Set Up CDS Design Tokens (if needed)

Use `figma_setup_design_tokens` to create the full CDS token system:

```javascript
// Via figma_setup_design_tokens tool:
{
  "collectionName": "CDS Tokens",
  "modes": ["Light"],
  "variables": [
    { "name": "primary/main", "type": "COLOR", "values": { "Light": "#4b3fff" } },
    { "name": "secondary/main", "type": "COLOR", "values": { "Light": "#546574" } },
    { "name": "error/main", "type": "COLOR", "values": { "Light": "#d32f2f" } },
    { "name": "warning/main", "type": "COLOR", "values": { "Light": "#ed6c02" } },
    { "name": "info/main", "type": "COLOR", "values": { "Light": "#0288d1" } },
    { "name": "success/main", "type": "COLOR", "values": { "Light": "#2e7d32" } },
    { "name": "text/primary", "type": "COLOR", "values": { "Light": "#212121" } },
    { "name": "text/secondary", "type": "COLOR", "values": { "Light": "#666666" } },
    { "name": "background/default", "type": "COLOR", "values": { "Light": "#fafafa" } },
    { "name": "background/paper", "type": "COLOR", "values": { "Light": "#ffffff" } },
    { "name": "divider", "type": "COLOR", "values": { "Light": "#e0e0e0" } }
  ]
}
```

### Step 3: Create Design via `figma_execute`

`figma_execute` runs Figma Plugin API code. Use it to create frames, text, shapes, and layouts.

**Example: Create a card component (with proper variable binding)**

> See `references/figma-quality.md` Phase 1 for the VAR_MAP, STYLE_MAP, and EFFECT_MAP setup code that must run first.

```javascript
// Create card frame with auto-layout
const card = figma.createFrame();
card.name = "Card";
card.layoutMode = "VERTICAL";
card.paddingTop = 16; card.paddingBottom = 16;
card.paddingLeft = 16; card.paddingRight = 16;
card.itemSpacing = 12;
card.cornerRadius = 8;

// Bind fill to CDS variable (NEVER hardcode color)
const paperFill = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
card.fills = [figma.variables.setBoundVariableForPaint(paperFill, 'color', VAR_MAP['colors/background/paper'])];

// Apply elevation style (NEVER manual shadow)
await card.setEffectStyleIdAsync(EFFECT_MAP['elevation/1']);

// Add title with text style + variable-bound color
const title = figma.createText();
title.fontName = { family: "DM Sans", style: "SemiBold" };
title.fontSize = 24;
title.characters = "Card Heading";
await title.setTextStyleIdAsync(STYLE_MAP['typography/h4']);
const titleFill = { type: 'SOLID', color: { r: 0.13, g: 0.13, b: 0.13 } };
title.fills = [figma.variables.setBoundVariableForPaint(titleFill, 'color', VAR_MAP['colors/text/primary'])];
card.appendChild(title);

// Add body text with text style + variable-bound color
const body = figma.createText();
body.fontName = { family: "DM Sans", style: "Regular" };
body.fontSize = 14;
body.characters = "Body text content goes here.";
await body.setTextStyleIdAsync(STYLE_MAP['typography/body1']);
const bodyFill = { type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } };
body.fills = [figma.variables.setBoundVariableForPaint(bodyFill, 'color', VAR_MAP['colors/text/secondary'])];
card.appendChild(body);

// Use library Button component instead of manual shape
// const buttonResult = await figma_instantiate_component(buttonComponentKey, { parentId: card.id });

figma.currentPage.appendChild(card);
```

### Step 4: Automated Quality Audit (MANDATORY — see `figma-quality.md` Phase 3)

Run the full audit via `figma_execute` to check:
- 0 hardcoded solid fills (every fill bound to a CDS variable)
- 0 hardcoded solid strokes
- 0 text nodes without text styles
- All cards/paper have elevation effect styles
- All spacing on 4px grid

If violations found → auto-fix by mapping hex to CDS variable (see `figma-quality.md` auto-fix procedure).

### Step 5: Visual Validation + Screenshot

```
figma_capture_screenshot → capture result at 2x
```

Analyze the screenshot:
- Check alignment, spacing, visual hierarchy
- Verify text is readable and not clipped/wrapping unexpectedly
- Confirm component instances render correctly
- Fix any issues, re-screenshot (max 3 iterations)

## CDS Color Values for Figma

Figma uses 0-1 RGB values. Here are the CDS colors:

| CDS Token | Hex | Figma RGB (r, g, b) |
|-----------|-----|---------------------|
| Primary (Blurple) | `#4b3fff` | 0.294, 0.247, 1.0 |
| Secondary (Slate) | `#546574` | 0.329, 0.396, 0.455 |
| Error | `#d32f2f` | 0.827, 0.184, 0.184 |
| Warning | `#ed6c02` | 0.929, 0.424, 0.008 |
| Info | `#0288d1` | 0.008, 0.533, 0.820 |
| Success | `#2e7d32` | 0.180, 0.490, 0.196 |
| Text primary | `#212121` | 0.129, 0.129, 0.129 |
| Text secondary | `#666666` | 0.400, 0.400, 0.400 |
| Hint | `#bdbdbd` | 0.741, 0.741, 0.741 |
| Divider | `#e0e0e0` | 0.878, 0.878, 0.878 |
| Background | `#fafafa` | 0.980, 0.980, 0.980 |
| Paper (white) | `#ffffff` | 1.0, 1.0, 1.0 |

## CDS Typography for Figma

Font: **DM Sans** (always load before setting text)

| Role | Size | Style (fontName.style) |
|------|------|----------------------|
| h1 | 48 | "SemiBold" |
| h2 | 32 | "SemiBold" |
| h3 | 24 | "SemiBold" |
| h4 | 20 | "SemiBold" |
| h5 | 16 | "SemiBold" |
| h6 | 14 | "SemiBold" |
| body1 | 14 | "Regular" |
| body2 | 12 | "Regular" |
| subtitle1 | 16 | "Regular" |
| caption | 12 | "Medium" |
| button | 14 | "Medium" |

Always call `await figma.loadFontAsync({ family: "DM Sans", style: "..." })` before setting `fontName`.

## CDS Component Sizing

| Component | Small | Medium | Large |
|-----------|-------|--------|-------|
| Button height | 28px | 32px | 40px |
| TextField height | 28px | 32px | 40px |
| Chip height | 28px | 32px | 40px |
| Avatar | 24px | 40px | 56px |
| AppBar | — | 56px | 64px |
| Border radius | — | 4px | — |

## Layout Patterns

### Auto-layout (preferred for all containers)

```javascript
frame.layoutMode = "VERTICAL"; // or "HORIZONTAL"
frame.primaryAxisAlignItems = "MIN"; // MIN, CENTER, MAX, SPACE_BETWEEN
frame.counterAxisAlignItems = "MIN"; // MIN, CENTER, MAX
frame.itemSpacing = 12; // gap between children
frame.paddingTop = 16;
frame.paddingBottom = 16;
frame.paddingLeft = 16;
frame.paddingRight = 16;
```

### Fill container width

```javascript
child.layoutAlign = "STRETCH"; // fills parent width in vertical layout
child.layoutGrow = 1; // fills remaining space
```

## Troubleshooting

### "figma_execute failed"
- Ensure Figma Desktop is open with the Desktop Bridge plugin running
- Check `figma_get_status` shows WebSocket connected
- Load fonts with `figma.loadFontAsync()` before setting text

### Fonts not rendering
- Always `await figma.loadFontAsync({ family: "DM Sans", style: "Regular" })` first
- DM Sans styles: "Regular", "Medium", "SemiBold", "Bold"

### Elements invisible
- Check fills are set (empty fills = transparent)
- Check the element is appended to the current page
- Check size is not 0x0

### Design tokens not binding
- Ensure library sources are configured: `npm run cds:figma:libs:list`
- Sync manifest: `npm run cds:figma:sync`
- Use variable IDs from the manifest, not hardcoded IDs

### Missing componentKey in manifest
- Library file may not be published — publish it in Figma first
- Check the fileKey is correct: `npm run cds:figma:libs:list`
- Try re-syncing: `npm run cds:figma:sync -- --force true`

### Validation reporting hardcoded fills
- This means fills are not bound to library variables
- Run auto-fix: the agent's fix pass binds the nearest matching token
- If no token match found: check that your library has the required color variables published

## Validation & Auto-Fix

After creating designs, the agent validates:

| Check | Issue type | Severity |
|-------|-----------|----------|
| Solid fills not bound to variables | `HARDCODED_FILL` | Error |
| Solid strokes not bound to variables | `HARDCODED_STROKE` | Warning |
| Frame/group matching DS component name but not an instance | `NOT_INSTANCE_WHEN_SHOULD_BE` | Warning |
| Text nodes without text styles | `MISSING_TEXT_STYLE` | Warning |
| Instances from unknown/unconfigured libraries | `UNKNOWN_MAIN_COMPONENT` | Warning |

**Auto-fix pass** (one pass max):
- `HARDCODED_FILL/STROKE`: binds the nearest matching token variable
- Other issues: reported for manual review

## Best Practices for Library Files

1. **Publish components + variables** in Figma — unpublished items can't be instantiated in other files
2. **Stable naming conventions** — the manifest uses component names for matching; renaming breaks references
3. **Use modes** for theming (Light/Dark) — CDS is light-only but the system supports multi-mode tokens
4. **Version your libraries** — publish updates incrementally; the sync picks up latest automatically

## Desktop Bridge Plugin Setup

Required for full write access (design creation, variable management):

1. After running `install.sh`, the plugin is at: `figma-plugin/manifest.json`
2. In Figma Desktop: Plugins > Development > Import plugin from manifest
3. Select `figma-plugin/manifest.json` from the CDS-Assist repo
4. Run the plugin in your Figma file: Plugins > Development > Figma Desktop Bridge
5. It auto-connects via WebSocket (ports 9223-9232)

One-time setup. Plugin persists in Development plugins list.
