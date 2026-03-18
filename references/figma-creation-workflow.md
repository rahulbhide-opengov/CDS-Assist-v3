# Figma Design Creation Workflow (Universal)

**MANDATORY**: This is the correct workflow for creating ANY Figma design. It replaces the old approach of writing raw `figma_execute` JavaScript for everything.

## The 3 Rules That Fix Everything

1. **Use MCP tools for components** — `figma_search_components` → `figma_get_component_details` → `figma_instantiate_component`. NOT raw `figma.createFrame()` + text styling.
2. **Use the React code as a pixel-precise spec** — Every sx prop, every spacing value, every Typography variant maps 1:1 to Figma (see `react-to-figma-mapping.md`).
3. **Use `figma_execute` ONLY for layout orchestration** — Creating parent frames, setting auto-layout, binding variables, arranging children. NEVER for building components that exist in the library.

## Anti-Patterns (NEVER DO THESE)

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| `figma.createFrame()` + `figma.createText()` styled to look like a Tab | `figma_search_components("Tab")` → `figma_instantiate_component(...)` |
| Text character `☰` for hamburger icon | Import `menu` icon from CDS 37 Icons library by key |
| Manual frame with blue fill + white text for a Button | `figma_instantiate_component` with Button variant |
| `figma.createRectangle()` for a Divider | Import Divider from library (key `6220bea7da4756b30bf4c62afc80e1bc63c92053`) |
| Guessing padding values (16px everywhere) | Read React sx: `px: 3` = 24px, `py: 1.5` = 12px |
| Fixed height on screen frames | `layoutSizingVertical = 'HUG'` always |
| `figma.createEllipse()` for Avatar | Import Avatar from library (key `388cfd6d2c251258f7e3bedf1851aa126b5e0d34`) |

## Phase 0: Component Discovery (ONCE per session)

Before building anything, discover all available components:

```
Step 1: figma_get_design_system_summary
  → Returns categories, counts, overview of what's available

Step 2: figma_search_components (for each component you'll need)
  → "Button" → get componentKey + nodeId
  → "Tabs" → get componentKey + nodeId
  → "Chip" → get componentKey + nodeId
  → "TextField" → get componentKey + nodeId
  → "Avatar" → get componentKey + nodeId
  → "Divider" → get componentKey + nodeId
  → "Card" → get componentKey + nodeId
  → "ListItem" → get componentKey + nodeId
  → "Checkbox" → get componentKey + nodeId
  → "Page Heading" → get componentKey + nodeId
  → "Global Navigation" → get componentKey + nodeId

Step 3: Store all keys for the session
  → Build a COMPONENT_MAP: { "Button": { key, nodeId }, "Tabs": { key, nodeId }, ... }
```

**CRITICAL**: NodeIds are session-specific. ALWAYS re-search at the start of each new session. Never reuse IDs from previous conversations.

## Phase 1: Plan the Component Tree

Before creating anything in Figma, write out the full component tree from the specification:

### From React Code:
```
ExploreReportsPage
├── GlobalNavigation (library instance)
├── Body (HORIZONTAL auto-layout)
│   ├── Sidebar (250px FIXED, VERTICAL)
│   │   ├── "Reports" (Typography h5)
│   │   ├── Divider (library)
│   │   ├── Department section
│   │   │   ├── "Department" (Typography subtitle2, text.secondary)
│   │   │   └── Button (library, outlined, secondary) "Building Services"
│   │   ├── "Report Categories" (Typography subtitle2)
│   │   ├── TextField (library, small) "Search Reports..."
│   │   ├── List (VERTICAL)
│   │   │   ├── ListItem (library) "Records" + icon + count
│   │   │   ├── ListItem (library) "Approvals" + icon + count
│   │   │   └── ...
│   │   ├── Divider (library)
│   │   └── Button (library, outlined, primary) "New Report"
│   └── Main Content (FILL, VERTICAL)
│       ├── Page Heading (library) "Ledger - FY'25"
│       ├── Metadata row (HORIZONTAL, spacing=12)
│       │   ├── Icon + "Created on: 15 Jan 2025" (caption, grey.500)
│       │   └── ...
│       ├── View Toggle + Filters (VERTICAL)
│       │   ├── Row (HORIZONTAL, SPACE_BETWEEN)
│       │   │   ├── Tabs (library) [Table, Analytics, Map]
│       │   │   └── Buttons row (HORIZONTAL)
│       │   │       ├── Button (library, outlined) "Advance Filters"
│       │   │       └── Button (library, outlined) "Columns"
│       │   └── Filter chips row (HORIZONTAL)
│       │       ├── "Config:" (caption)
│       │       ├── Chip (library) "Status equals to Rejected, Hold"
│       │       └── Chip (library) "Date is between..."
│       ├── Divider (library)
│       └── [Table/Analytics/Map content]
```

### From Prompt/PRD/Screenshot:
1. Identify all visible components in the design
2. Map each to the nearest CDS library component
3. Write the tree the same way as above
4. Note any components that DON'T have CDS equivalents — these are the ONLY ones built manually

## Phase 2: Build Layout Frames (figma_execute)

Create the structural frames ONLY — no components yet:

```javascript
// Create the screen frame
const screen = figma.createFrame();
screen.name = 'Page — Desktop';
screen.layoutMode = 'VERTICAL';
screen.resize(1440, 1);
screen.layoutSizingVertical = 'HUG';
screen.x = SAFE_X;

// Create Body (horizontal: sidebar + main)
const body = figma.createFrame();
body.name = 'Body';
body.layoutMode = 'HORIZONTAL';
body.layoutSizingHorizontal = 'FILL';
body.layoutSizingVertical = 'HUG';
body.fills = []; // transparent

// Create Sidebar (from React: width: 250, borderRight: 1)
const sidebar = figma.createFrame();
sidebar.name = 'Sidebar';
sidebar.layoutMode = 'VERTICAL';
sidebar.resize(250, 1);
sidebar.layoutSizingHorizontal = 'FIXED';
sidebar.layoutSizingVertical = 'HUG';
sidebar.paddingTop = 16; sidebar.paddingBottom = 16;  // from React sx pt:2, pb:2
sidebar.paddingLeft = 16; sidebar.paddingRight = 16;  // from React sx px:2
sidebar.itemSpacing = 0;
// Bind fill to grey.50 / background.tertiary
// Add right border stroke bound to divider variable

// Create Main Content (from React: flex: 1)
const main = figma.createFrame();
main.name = 'Main Content';
main.layoutMode = 'VERTICAL';
main.layoutSizingHorizontal = 'FILL';
main.layoutSizingVertical = 'HUG';
main.fills = [];

// Assemble hierarchy
body.appendChild(sidebar);
body.appendChild(main);
screen.appendChild(body); // GlobalNav will be inserted before this
```

## Phase 3: Populate with Library Components (figma_instantiate_component)

Now add actual library components into the frames:

```
// For each component in the tree:
figma_instantiate_component({
  componentKey: COMPONENT_MAP["GlobalNavigation"].key,
  nodeId: COMPONENT_MAP["GlobalNavigation"].nodeId,
  parentId: screen.id,           // goes INTO the screen frame
  variant: { Product: "Default" }
})

figma_instantiate_component({
  componentKey: COMPONENT_MAP["Button"].key,
  nodeId: COMPONENT_MAP["Button"].nodeId,
  parentId: sidebar.id,
  variant: { Type: "Secondary", Size: "Small" },
  overrides: { "Text#6851:0": "Building Services" }
})

figma_instantiate_component({
  componentKey: COMPONENT_MAP["TextField"].key,
  nodeId: COMPONENT_MAP["TextField"].nodeId,
  parentId: sidebar.id,
  variant: { Size: "Small" },
  overrides: { "Placeholder": "Search Reports..." }
})

// Icons
figma_instantiate_component({
  componentKey: "bc6f51ef6b608949329399c7085a291e597e906c",  // calendar icon
  parentId: metadataRow.id
})
```

## Phase 4: Fine-Tune Layout Properties (figma_execute)

After all components are placed, adjust layout properties:

```javascript
// Read exact values from React sx props and apply
// sidebar header: sx={{ px: 2, pt: 2, pb: 1.5 }}
sidebarHeader.paddingLeft = 16;
sidebarHeader.paddingRight = 16;
sidebarHeader.paddingTop = 16;
sidebarHeader.paddingBottom = 12;

// metadata row: sx={{ px: 3, pb: 1.5 }}, spacing={1.5}
metadataRow.paddingLeft = 24;
metadataRow.paddingRight = 24;
metadataRow.paddingBottom = 12;
metadataRow.itemSpacing = 12;

// filter row: sx={{ mt: 1.5 }}, spacing={1}
filterRow.itemSpacing = 8;
// mt: 1.5 = add 12px to parent's itemSpacing or use a wrapper
```

## Phase 5: Verify

1. **Component audit**: `figma_execute` to count INSTANCE vs FRAME nodes
2. **Screenshot**: `figma_take_screenshot` at 2x scale
3. **Compare** against React rendering or specification
4. **Fix** any discrepancies (max 3 iterations)

## Responsive Cloning Workflow

After Desktop is verified:

1. **Clone** desktop frame for Tablet (768px) and Mobile (390px)
2. **Resize** outer frame width
3. **Adapt layout**:
   - Tablet: collapse sidebar to 48px, replace content with menu icon
   - Mobile: remove sidebar entirely, change Body from HORIZONTAL to VERTICAL
   - Change `direction={{ xs: 'column', md: 'row' }}` frames from HORIZONTAL to VERTICAL on mobile
4. **NEVER remove content** — only change layout direction and sizing
5. **Verify** each breakpoint has the same content sections as Desktop

## When Source is Prompt/PRD (no React code)

1. Design the component tree on paper first
2. Identify ALL components needed
3. Map each to CDS library components
4. Follow Phases 0-5 above
5. After Figma design is approved, generate React code FROM the Figma design

## When Source is Screenshot

1. Analyze the screenshot for components, layout, colors, typography
2. Normalize all visual elements to nearest CDS equivalents
3. Map identified components to CDS library components
4. Follow Phases 0-5 above
5. Use `react-to-figma-mapping.md` for any layout details visible in the screenshot
