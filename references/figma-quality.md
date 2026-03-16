# CDS-Assist — Figma Design Quality Standard

**MANDATORY**: Read this file alongside `figma.md` for every Figma design. This file defines the non-negotiable quality rules that separate amateur output from production-grade design system work.

## The 11 Absolute Rules

1. **ZERO hardcoded colors** — every solid fill and stroke MUST be bound to a CDS **library** variable
2. **ZERO local copies** — NEVER create local text styles, color variables, or effect styles. Use them from the CDS 37 library.
3. **ZERO manual shapes for DS components** — if a CDS component exists, instantiate it from the library
4. **100% auto-layout** — every frame with children MUST use `layoutMode`
5. **Library references only** — all styles and variables must come from CDS 37 (core) or CDS 37 Patterns (published libraries)
6. **ZERO destructive canvas changes** — NEVER delete, move, or overwrite existing **top-level screen frames**. Place new screens to the RIGHT with a 200px gap. (Inside a screen you're building, freely manage child elements.)
7. **Global Navigation on EVERY screen** — every screen frame MUST start with a `Global Navigation` component instance as its first child, with `layoutSizingHorizontal = 'FILL'`. Use the **suite-specific Product variant** when one exists; otherwise use the Default variant. Applies to ALL breakpoints. No screen is complete without it.
   - **Product variant keys**: Default `c24369659d8f75ec3815d2d3ffb1342dd7e551b5` | Procurement `0fae83904386321411e98e161624e268adeb9421` | B&P `35705b7547c5297e06e23fe6e8128fd1f7a0e3f6` | Utility Billing `3dba805ed57e9a20dac1e8aa086645029ec05c0f` | Asset Management `cdf8e5d33da9e62840d34f374e23024994c0d69f` | Agents Studio `6cd1426337fe22414c939ede70f4aa97630c72a8` | Vendor Portal `2945658715a063337c3e72bd6f557c07e23849f6` | Command Center `011496137077293e614fd65154c6944ca0db6655`
   - Set via: `instance.setProperties({ 'Product': 'Procurement' })` or import the specific variant key directly.
8. **Content parity across breakpoints** — when building responsive variations (desktop/tablet/mobile), ALL breakpoints MUST show the same data: same sections, same number of table rows or list items, same KPI cards, same charts. Only the **layout** changes (columns → stacked, table → cards, side-by-side → vertical). NEVER drop, truncate, or reduce content for smaller screens.
9. **Page Heading from library** — NEVER hand-build page headers with raw text/frames. Always use the `Page Heading` component (set key `ed8d390034cdc9b76fc11e1e2647856ff734d33d`, default variant key `17d737470c3a274dececd1d355b594e75e2622c1`). Set `layoutSizingHorizontal = 'FILL'`, configure breadcrumbs/description/actions via boolean properties, use `Small Screen: True` for tablet/mobile. Override text via `findAll` on TEXT nodes (h1 = title, body1 = description, body2 = breadcrumb items).
10. **PSP Menu on EVERY screen** — the Platform Side Panel (PSP) Menu MUST be present on every design. On **desktop**: show as a visible 320px left sidebar (below Global Nav, left of content) with Entity selector, Action Hubs, Products, Capabilities, and Preferences sections. Highlight the current product in the Products list. On **tablet/mobile**: PSP is hidden behind the hamburger menu icon in the Global Nav (no visible sidebar). The PSP Menu component key is `16da480901ce5bdd694aa97596f7f6bd3eddff32` (import may time out for complex components — build manually if needed, matching the CDS pattern exactly).
11. **Global Nav + Page Heading + PSP = mandatory on EVERY design** — no screen is complete without all three. Global Navigation at top, PSP Menu as sidebar (desktop) or behind hamburger (tablet/mobile), and Page Heading as the first content element after the nav area. This applies to every page, every breakpoint, no exceptions.

## Library Architecture

CDS uses four Figma library files:

| Library | File Key | Role | Contains |
|---------|----------|------|----------|
| **CDS 37** (core) | `MxdeZ8e13qSmlenBVMmzzI` | `core` | 113 component sets, 486 color variables, 54 text styles, 24 elevation styles |
| **CDS 37 Patterns** | `ovXZlZTFwlNBTISlap4s4p` | `patterns` | 29 component sets (Global Nav, Platform Nav, Page Header, Layout, Cards, Drawers, Forms, Modals, Templates, AI Patterns) |
| **CDS 37 Icons** | `xaElUstGXrXTsCRKp2IOhF` | `icons` | 7 component sets + 567 standalone icon components |
| **Agents** | `x2US3gmKKjSeby3troKJRa` | `product` | Product design file — consumes CDS 37 and Patterns (no published components) |

**CRITICAL**: CDS 37 core and Patterns libraries must be enabled in the target file before designing. Icons library needed when using icons.

## Phase 0: Canvas Safety (run EVERY time before creating new screens)

These rules protect **top-level screen frames** (direct children of `figma.currentPage`). Inside a screen you're building, you have full freedom to create, nest, rearrange, and remove child elements.

```javascript
// Scan existing TOP-LEVEL frames and calculate safe placement for new screens
const existing = figma.currentPage.children.filter(n => n.visible !== false);
let maxX = 0;
for (const node of existing) {
  const right = node.x + node.width;
  if (right > maxX) maxX = right;
}
const SAFE_X = existing.length > 0 ? maxX + 200 : 0;
// Use SAFE_X as the x position for every new top-level screen frame
```

### Top-Level Screen Rules

1. **NEVER delete existing top-level frames** — no `remove()` on any direct child of `figma.currentPage` that you didn't create in this session
2. **NEVER move existing screens** — no reassigning `x`, `y`, `width`, `height` on pre-existing top-level frames
3. **NEVER bulk-clear the page** — `figma.currentPage.children.forEach(c => c.remove())` is absolutely forbidden
4. **Place new screens to the RIGHT** — always use `SAFE_X` calculated above as the starting x position
5. **Multiple new screens** → stack left-to-right with 200px gaps: `SAFE_X`, `SAFE_X + frameWidth + 200`, etc.
6. **Name every screen frame** — use descriptive names like "Dashboard — Desktop 1440", "Profile — Mobile 390"
7. **Before editing an existing screen** — always ask the user first: *"I found an existing frame 'X'. Should I modify it or create a new version?"*

### Inside a Screen (no restrictions)

When building the internals of a new screen frame, freely:
- Create, position, and nest child frames, text nodes, and components
- Use auto-layout, set padding, spacing, alignment on child elements
- Remove or rearrange child nodes as needed to get the layout right
- Import and instantiate library components anywhere in the tree

## Phase 1: Bootstrap (run once per file)

Before creating ANY design elements, set up the file's foundation.

### 1a. Load fonts

```javascript
await figma.loadFontAsync({ family: 'DM Sans', style: 'Regular' });
await figma.loadFontAsync({ family: 'DM Sans', style: 'Medium' });
await figma.loadFontAsync({ family: 'DM Sans', style: 'SemiBold' });
await figma.loadFontAsync({ family: 'DM Sans', style: 'Bold' });
```

### 1b. Import a CDS base component to bootstrap library access

Import a base component (Chip is reliable) to establish the library connection. This also makes `importVariableByKeyAsync()` and `importStyleByKeyAsync()` work for subsequent calls.

```javascript
// Import Chip to bootstrap library access
const chipComp = await Promise.race([
  figma.importComponentByKeyAsync('06e566f8ad1c0154f850ac4fecb74c3b3b63f657'),
  new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 20000))
]);
const tempChip = chipComp.createInstance();
figma.currentPage.appendChild(tempChip);
tempChip.remove(); // Library connection remains active
```

### 1c. Build a library variable lookup map

Library variables use the format `VariableID:<key>/<publishedRef>`. These are the known CDS 37 semantic color variable IDs:

```javascript
const V = {
  'Colors/primary/main':            'VariableID:17d88b1b3dbec658b6fcbb5eeaa572643304f54e/18138:6999',
  'Colors/primary/contrastText':    'VariableID:8b91295e2aa06f5a24be2183a70bd78c776b1f40/18138:7002',
  'Colors/secondary/main':          'VariableID:374f6557312280d07693087b2266f90d8b77ed74/18138:7010',
  'Colors/error/main':              'VariableID:6e95dc04449b16b81c035fed90619098b23a31ca/18138:6991',
  'Colors/warning/main':            'VariableID:a5752b26f275ed6c73ae93dceba16cfe33401f81/18138:6890',
  'Colors/info/main':               'VariableID:7f72b4c3a13333f7324d16df08e88332471d25e0/18138:6900',
  'Colors/success/main':            'VariableID:cfc60e9d1f9af9567185e93af3e73f030a02f724/18138:6910',
  'Colors/text/primary':            'VariableID:c45fa8f7347b51c3bd7302deefb9e1edeeee9271/18138:6932',
  'Colors/text/secondary':          'VariableID:1aa140f793df4f3ce76d2ae909c78c0360b50aab/18138:6933',
  'Colors/text/disabled':           'VariableID:39271f756d2f79b7f05c56e2ec926e051c3b1a0d/18138:6934',
  'Colors/action/active':           'VariableID:766968d92ecd79de0fc2b4afb248bb60731a33bc/18138:7019',
  'Colors/background/paper-elevation-0': 'VariableID:70597df059e67b9286730e00064743f0bfec94c3/18138:6941',
  'Colors/background/tertiary':     'VariableID:4427f744e224f749a7d0a43553a58fa962bb8376/18138:6940',
  'Colors/avatar/fill':             'VariableID:6129eed05091f493005ea04b8fc12fae12e1da1b/18138:6967',
};

// Helper to bind a node's fill to a library variable
async function bindFill(node, varId) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (!v) return;
  const f = node.fills?.[0] ? JSON.parse(JSON.stringify(node.fills[0])) : { type: 'SOLID', color: {r:0,g:0,b:0} };
  node.fills = [figma.variables.setBoundVariableForPaint(f, 'color', v)];
}
```

### 1d. Import library text styles

After bootstrap, `importStyleByKeyAsync()` works. Import all needed text styles upfront with a 5s timeout per style:

```javascript
const STYLE_IDS = {};
const styleKeys = [
  ['typography/h1',   '3951ac1380692cc265c3c34dc9a6de06f7a8cd7b'],
  ['typography/h2',   '6cf42b54f5be7dddbbe18b05f9d6869d6276fe00'],
  ['typography/h3',   '74f3552f49b3c03c91234b606d7c63c15c7ac7dd'],
  ['typography/h4',   'eb8c8f295bb8e40ac267d2c626c7bbb0f56d8f7f'],
  ['typography/h5',   '68788195cb9117147385a04550cbe87479249e0c'],
  ['typography/h6',   'e7f596274da2deba475efc2e88bec9a56156899f'],
  ['typography/body1','178d78f7c340b70b643a05a7e768640655abd231'],
  ['typography/body2','213cabbb6965c1f310536cb317d976f060e2cf3b'],
  ['typography/caption','b9f1b832f90acd527efc3000e59c7c72d3d3ab0c'],
  ['typography/subtitle2','767d25d675dd5bcfd9386a2327a99f2391e40f7d'],
  ['typography/overline','b6f2714c6174d7f0ab58d63d6a54ad1b1276f8bf'],
  ['Button/medium',   '02659678b7c961f57a5dc23790723b1e754d2dab'],
];
for (const [name, key] of styleKeys) {
  try {
    const s = await Promise.race([
      figma.importStyleByKeyAsync(key),
      new Promise((_, r) => setTimeout(() => r(new Error('TIMEOUT')), 5000))
    ]);
    STYLE_IDS[name] = '' + s.id;
  } catch (e) { /* timeout — use fontSize/weight matching as fallback */ }
}
```

**Known working `S:key,ref` IDs** (verified in consumer files):

| Style | S:key,ref |
|-------|-----------|
| `typography/h1` | `S:3951ac1380692cc265c3c34dc9a6de06f7a8cd7b,18138:6457` |
| `typography/h2` | `S:6cf42b54f5be7dddbbe18b05f9d6869d6276fe00,18466:104` |
| `typography/h3` | `S:74f3552f49b3c03c91234b606d7c63c15c7ac7dd,18466:98` |
| `typography/h4` | `S:eb8c8f295bb8e40ac267d2c626c7bbb0f56d8f7f,18138:6479` |
| `typography/h5` | `S:68788195cb9117147385a04550cbe87479249e0c,18138:6488` |
| `typography/h6` | `S:e7f596274da2deba475efc2e88bec9a56156899f,18138:6497` |
| `typography/body1` | `S:178d78f7c340b70b643a05a7e768640655abd231,18138:6511` |
| `typography/body2` | `S:213cabbb6965c1f310536cb317d976f060e2cf3b,18138:6524` |
| `typography/caption` | `S:b9f1b832f90acd527efc3000e59c7c72d3d3ab0c,18138:6563` |
| `typography/subtitle2` | `S:767d25d675dd5bcfd9386a2327a99f2391e40f7d,18138:6544` |
| `typography/overline` | `S:b6f2714c6174d7f0ab58d63d6a54ad1b1276f8bf,18138:6554` |
| `Button/medium` | `S:02659678b7c961f57a5dc23790723b1e754d2dab,18348:7683` |

### 1e. Import library variables on demand

After bootstrap, `importVariableByKeyAsync()` also works:

```javascript
const textSecondary = await figma.variables.importVariableByKeyAsync('1aa140f793df4f3ce76d2ae909c78c0360b50aab');
```

### 1f. fontSize/weight → style mapping for auto-application

When applying styles to existing text nodes, match by fontSize + fontWeight:

```javascript
const FONT_TO_STYLE = {
  '32_SemiBold': STYLE_IDS['typography/h1'],
  '24_SemiBold': STYLE_IDS['typography/h2'],
  '20_SemiBold': STYLE_IDS['typography/h3'],
  '16_SemiBold': STYLE_IDS['typography/h4'],
  '14_SemiBold': STYLE_IDS['typography/h5'],
  '12_SemiBold': STYLE_IDS['typography/h6'],
  '16_Regular':  STYLE_IDS['typography/body1'],
  '14_Regular':  STYLE_IDS['typography/body2'],
  '12_Regular':  STYLE_IDS['typography/caption'],
  '14_Medium':   STYLE_IDS['Button/medium'],
  '12_Medium':   STYLE_IDS['typography/overline'],
};
```

## Phase 2: Variable-Bound Creation Patterns

### CORRECT: Creating a text node with variable-bound color + text style

```javascript
const text = figma.createText();
text.fontName = { family: 'DM Sans', style: 'Regular' };
text.fontSize = 14;
text.characters = 'Hello World';

// 1. Apply text style
await text.setTextStyleIdAsync(STYLE_MAP['typography/body1']);

// 2. Bind fill to variable (NEVER use raw RGB)
const fillPaint = { type: 'SOLID', color: { r: 0.129, g: 0.129, b: 0.129 } };
text.fills = [figma.variables.setBoundVariableForPaint(fillPaint, 'color', VAR_MAP['colors/text/primary'])];
```

### CORRECT: Creating a frame with variable-bound fills

```javascript
const card = figma.createFrame();
card.name = 'Card';
card.layoutMode = 'VERTICAL';
card.paddingTop = 16; card.paddingBottom = 16;
card.paddingLeft = 16; card.paddingRight = 16;
card.itemSpacing = 12;
card.cornerRadius = 8;

// Bind fill to paper variable
const paperFill = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
card.fills = [figma.variables.setBoundVariableForPaint(paperFill, 'color', VAR_MAP['colors/background/paper'])];

// Apply elevation style
await card.setEffectStyleIdAsync(EFFECT_MAP['elevation/1']);
```

### WRONG — never do this:

```javascript
// WRONG: hardcoded fill color
card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

// WRONG: hardcoded text color
text.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

// WRONG: text without style
text.fontName = { family: 'DM Sans', style: 'Regular' };
text.fontSize = 14;
// missing: await text.setTextStyleIdAsync(...)
```

## Hex → CDS Library Variable Mapping

Use this to determine which **library variable** to bind for any color. Variable IDs reference the CDS 37 published library.

| Hex | Library Variable | Variable ID | Usage |
|-----|-----------------|-------------|-------|
| `#4b3fff` | `Colors/primary/main` | `VariableID:17d88b1b3dbec658b6fcbb5eeaa572643304f54e/18138:6999` | Brand, active states, links |
| `#546574` | `Colors/secondary/main` | `VariableID:374f6557312280d07693087b2266f90d8b77ed74/18138:7010` | Secondary actions |
| `#d32f2f` | `Colors/error/main` | `VariableID:6e95dc04449b16b81c035fed90619098b23a31ca/18138:6991` | Error, destructive |
| `#ed6c02` | `Colors/warning/main` | `VariableID:a5752b26f275ed6c73ae93dceba16cfe33401f81/18138:6890` | Warning indicators |
| `#0288d1` | `Colors/info/main` | `VariableID:7f72b4c3a13333f7324d16df08e88332471d25e0/18138:6900` | Informational |
| `#2e7d32` | `Colors/success/main` | `VariableID:cfc60e9d1f9af9567185e93af3e73f030a02f724/18138:6910` | Success states |
| `#212121` | `Colors/text/primary` | `VariableID:c45fa8f7347b51c3bd7302deefb9e1edeeee9271/18138:6932` | Headings, primary body |
| `#666666` | `Colors/text/secondary` | `VariableID:1aa140f793df4f3ce76d2ae909c78c0360b50aab/18138:6933` | Labels, secondary text |
| `#ffffff` | `Colors/background/paper-elevation-0` | `VariableID:70597df059e67b9286730e00064743f0bfec94c3/18138:6941` | Cards, dialogs, sidebar |
| `#f5f5f5` | `Colors/background/tertiary` | `VariableID:4427f744e224f749a7d0a43553a58fa962bb8376/18138:6940` | Page background |
| `#54616d` | `Colors/action/active` | `VariableID:766968d92ecd79de0fc2b4afb248bb60731a33bc/18138:7019` | Dividers, borders |
| avatar | `Colors/avatar/fill` | `VariableID:6129eed05091f493005ea04b8fc12fae12e1da1b/18138:6967` | Avatar backgrounds |
| `#ffffff` | `Colors/primary/contrastText` | `VariableID:8b91295e2aa06f5a24be2183a70bd78c776b1f40/18138:7002` | White text on primary |

## CDS Text Styles (from CDS 37 library)

**NEVER create local copies.** These styles are published in CDS 37. The REST API node_ids are listed for reference — the actual `S:key,ref` IDs must be extracted from imported component instances at runtime.

| Style Name | Font | Weight | Size | Style Key (for REST API lookup) |
|-----------|------|--------|------|---------------------------------|
| `typography/h1` | DM Sans | SemiBold | 32 | `3951ac1380692cc265c3c34dc9a6de06f7a8cd7b` |
| `typography/h2` | DM Sans | SemiBold | 24 | `6cf42b54f5be7dddbbe18b05f9d6869d6276fe00` |
| `typography/h3` | DM Sans | SemiBold | 20 | `74f3552f49b3c03c91234b606d7c63c15c7ac7dd` |
| `typography/h4` | DM Sans | SemiBold | 16 | `eb8c8f295bb8e40ac267d2c626c7bbb0f56d8f7f` |
| `typography/h5` | DM Sans | SemiBold | 14 | `68788195cb9117147385a04550cbe87479249e0c` |
| `typography/h6` | DM Sans | SemiBold | 12 | `e7f596274da2deba475efc2e88bec9a56156899f` |
| `typography/body1` | DM Sans | Regular | 16 | `178d78f7c340b70b643a05a7e768640655abd231` |
| `typography/body2` | DM Sans | Regular | 14 | `213cabbb6965c1f310536cb317d976f060e2cf3b` |
| `typography/body3` | DM Sans | Regular | 12 | `4fe6df4072126a8d132f548df7a7802e74a5b800` |
| `typography/subtitle1` | DM Sans | Regular | 16 | `b4f1514de40a3ed4e5b037d92030b7420bdc054a` |
| `typography/subtitle2` | DM Sans | Regular | 14 | `767d25d675dd5bcfd9386a2327a99f2391e40f7d` |
| `typography/caption` | DM Sans | Regular | 12 | `b9f1b832f90acd527efc3000e59c7c72d3d3ab0c` |
| `typography/overline` | DM Sans | Medium | 12 | `b6f2714c6174d7f0ab58d63d6a54ad1b1276f8bf` |
| `Button/medium` | DM Sans | Medium | 14 | `02659678b7c961f57a5dc23790723b1e754d2dab` |
| `Avatar/Initials md` | DM Sans | SemiBold | 12 | `695d57972942a4fdd037577b667ad41cb549d4b1` |
| `Chip/medium` | DM Sans | Medium | 13 | `45afd2107ebf9809dbf6c102d10a9ed3386f7d6b` |

**Preferred approach**: After bootstrap (step 1b), use `importStyleByKeyAsync(key)` with a 5s timeout to get the `S:key,ref` ID, then apply via `setTextStyleIdAsync()`. See section 1d for the full working code.

**Fallback**: If `importStyleByKeyAsync` times out for a specific style, extract the `textStyleId` from an imported component instance that uses that style.

## CDS Elevation Styles (from CDS 37 library)

**NEVER create local copies.** These are published in CDS 37. Full list of all 24 levels:

| Style Name | Style Key |
|-----------|-----------|
| `elevation/1` | `bb7dbbad890c6ff793ae67d0574262fce2f116c5` |
| `elevation/2` | `4ebe2e39bf101e2e5a1c053f5d22c0487f275a6a` |
| `elevation/3` | `9772c34fa8b7e900b40e444a03f050be7effd244` |
| `elevation/4` | `3b820a202ba3478bb8902df666d30f8080b0abd7` |
| `elevation/5` | `25fb2345484fc2b6f7c5c18f9abf804eebfab2b5` |
| `elevation/6` | `e27505e4a881fec45b7b5c852cfa3e7e26847dcb` |
| `elevation/7` | `78b15a6ab1042363f5704f41af9d0eed4f2dea54` |
| `elevation/8` | `20c7b9c215f2b383f84c24be273c067c6348818f` |
| `elevation/9` | `bac9b6dd6377867617aa2ff529145f529ea57968` |
| `elevation/10` | `648e4a46ef709ba162d168493dd083f33357c711` |
| `elevation/11` | `703428bb5423c01815a5a5506ff90ba9e5e3c986` |
| `elevation/12` | `a1f9ca5ef4356e56bbe8d872e2d391944d8500a8` |
| `elevation/13` | `e2bc5344c82172e504cf5b36e32880b8936104a1` |
| `elevation/14` | `819f7648e42f6095dd8c183e9eaf10b081ba307e` |
| `elevation/15` | `c39c75592c878434a34324b70b8b8518e62c32fc` |
| `elevation/16` | `4cf7da6f289554bd07d14d18e55ae9569d433042` |
| `elevation/17` | `9e5d9d534cb9b1321ec7d6768d08c39f7421311e` |
| `elevation/18` | `6eb5e0faa88d8ad924caed4a7817eacc4e90f79f` |
| `elevation/19` | `c82be7cc72b48055799494830e3f70581cc23e9a` |
| `elevation/20` | `0ccc7ca5d04b5bc7ad10103944fe4a45f61d9059` |
| `elevation/21` | `b5746001fbb75f11ac459db1731c297450942b37` |
| `elevation/22` | `03982874ccb37185855eca400c53a247c5890281` |
| `elevation/23` | `ee62e59c63d9bd91018c26ae1561a22a0cd3d6d2` |
| `elevation/24` | `5652ba79d75e31aae9982963b4527370fa4e61c9` |

To apply: `const style = await figma.importStyleByKeyAsync(key); await frame.setEffectStyleIdAsync(style.id);`

## Comprehensive Catalogs

For complete component, icon, and token references, see:
- **`references/figma-library-catalog.md`** — 113 core + 29 pattern + 7 icon component sets with all keys and properties
- **`references/figma-icons-catalog.md`** — 567 icons with name-to-key mapping
- **`references/figma-tokens-catalog.md`** — All 54 text styles, 24 effect styles, semantic color variables with keys

## Component Instantiation Rules

### CDS 37 (core) — Base component keys

**Reliably imports** (tested, works consistently):

| Component | Variant | Key | Properties |
|-----------|---------|-----|------------|
| Chip | Gray Neutral, Medium, Default | `06e566f8ad1c0154f850ac4fecb74c3b3b63f657` | `Chip Label#18107:0` (TEXT) |
| Button | Primary, Medium, Idle | `55efd1bad246063d611f64b3ba500504a7143cb5` | `Text#6851:0` (TEXT), `Left icon?#6851:282` (BOOL), `Right icon?#7121:0` (BOOL) |
| Avatar | 40px, Circular, Text | `388cfd6d2c251258f7e3bedf1851aa126b5e0d34` | `Initials#10264:0` (TEXT), `Badge#9899:0` (BOOL) |
| Avatar | 40px, Circular, Text (set 1) | `7d41714cdff8c297733a75a28f84c513abcb2966` | Same props |

**Import via `importComponentSetByKeyAsync`** (these are COMPONENT_SET keys, not variant keys):

| Component | Set Key | Default Variant |
|-----------|---------|-----------------|
| Breadcrumbs | `84b669e3ff9efd869c1d2600879d0e9ebb2ae118` | Separator=Text, Collapsed=False |
| Divider | `6220bea7da4756b30bf4c62afc80e1bc63c92053` | Middle=Default |
| Card | `6c3442350d8e8be5c7f6802eb755a06365aa7c13` | Small Screen=False, Blank=False |
| Paper | `3348b0f144843164290abd47754c77e9871187f8` | Elevation=1, Square=False |
| Link | `3c37c5b1b73ff3f5b85fc17322de631c9bd87faa` | Type=Standalone, Size=Medium, State=Default |
| Page Heading | `ed8d390034cdc9b76fc11e1e2647856ff734d33d` | Has Breadcrumbs, Title, Description, Chip, Actions, Divider |
| Typography | `6499ac965918418c8e528d210840e2da71236f82` | h1 variant |

```javascript
// Use importComponentSetByKeyAsync for component sets, NOT importComponentByKeyAsync
const compSet = await figma.importComponentSetByKeyAsync(setKey);
const inst = compSet.defaultVariant.createInstance();
```

### CDS 37 Patterns — Pattern component keys

**Reliably imports:**

| Component | Variant | Key |
|-----------|---------|-----|
| Global Navigation | Default | `c24369659d8f75ec3815d2d3ffb1342dd7e551b5` |

**Import via `importComponentSetByKeyAsync`:**

| Component | Set Key |
|-----------|---------|
| Platform Navigation | `a2f05f4a4f7304555c28d51039163464e4d7fae8` |
| Page Header Pattern | `0d6c86e45e52734653f21e06461ada3de429400c` |
| Layout | `ee9ccff43c4c351d1ac5d6546dc5a7d006c87216` |
| Card (Patterns) | `64cde24e60f94cdcfc9f3c4b4c258e4c1c3c26b4` |

**CRITICAL**: The root cause of previous "timeouts" was using `importComponentByKeyAsync` with COMPONENT_SET keys. This hangs indefinitely. The fix:
- For **specific variants** (Chip Gray Medium, Button Primary Idle): use `importComponentByKeyAsync(variantKey)`
- For **component sets** (Breadcrumbs, Divider, Card, Paper, Link, Page Heading, etc.): use `importComponentSetByKeyAsync(setKey)` then `.defaultVariant.createInstance()`
- **Always warm up the library** first by importing a simple component (Chip or Button) before importing others

### Variable source priority (CRITICAL)

Always prefer **CDS 37 core** variables (collection prefix `18138:`) over CDS 37 Patterns variables (prefix `22582:` or others). Specifically:
- `Colors/text/secondary` (`18138:6933`) — NOT `Foreground/secondary` (`22582:77` from Patterns)
- All semantic colors (`primary/*`, `secondary/*`, `error/*`, `warning/*`, `info/*`, `success/*`, `text/*`, `background/*`, `action/*`) come from CDS 37 core

### Priority order for component usage

1. **Library instance from component set** — use `importComponentSetByKeyAsync(setKey)` for Breadcrumbs, Divider, Card, Paper, Link, Page Heading, Typography, etc.
2. **Library instance from specific variant** — use `importComponentByKeyAsync(variantKey)` for Button, Chip, Avatar, Global Navigation with specific variant props
3. **Manual build with ALL library bindings** — only as last resort: bind fills to library variables, apply library text styles via `importStyleByKeyAsync`, use proper auto-layout with hug content
4. **NEVER** use hardcoded colors, local variable copies, or text without library styles

### Setting instance properties after placement

```javascript
inst.setProperties({
  "Chip Label#18107:0": "Active",
  "Color": "Gray - Neutral"
});
```

## Auto-Layout Best Practices

### Every frame must have auto-layout

```javascript
frame.layoutMode = 'VERTICAL';           // or 'HORIZONTAL'
frame.primaryAxisSizingMode = 'AUTO';     // height wraps content
frame.counterAxisSizingMode = 'FIXED';    // width is fixed
```

### Children sizing

```javascript
// After appending to parent:
child.layoutSizingHorizontal = 'FILL';   // stretch to fill
child.layoutSizingVertical = 'HUG';      // wrap content

// IMPORTANT: set layoutSizing AFTER appendChild, not before
```

### Sizing mode rules (CRITICAL)

- **HORIZONTAL auto-layout**: `counterAxisSizingMode` = `'AUTO'` (hug height) unless the frame must be a fixed height (e.g., avatar, divider). NEVER use `'FIXED'` for rows that hold variable-height children.
- **VERTICAL auto-layout**: `primaryAxisSizingMode` = `'AUTO'` (hug height) for most frames. Only use `'FIXED'` if the frame has a known fixed height.
- **NEVER default to 100px height.** When creating frames via `figma.createFrame()`, the default size is 100×100. ALWAYS set the sizing mode to `'AUTO'` immediately after setting `layoutMode`.

### Common patterns

| Pattern | Config |
|---------|--------|
| Page frame (1440px) | VERTICAL, counterAxisSizingMode: FIXED, primaryAxisSizingMode: AUTO |
| Two-column layout | HORIZONTAL parent, sidebar: FIXED width, main: FILL |
| Card grid | HORIZONTAL, wrap children with FILL |
| Stack items | VERTICAL, itemSpacing: 8/12/16/24 (4px grid) |

### Spacing grid (4px)

All spacing values MUST be multiples of 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64.

## Phase 3: Post-Creation Validation (MANDATORY)

After creating ANY design, run this audit:

```javascript
// The agent MUST run this after every design creation
function auditNode(node, path) {
  const np = path + '/' + node.name;
  
  // Check fills bound to variables
  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID' && fill.visible !== false) {
        const bound = fill.boundVariables && fill.boundVariables.color;
        if (!bound) {
          // VIOLATION: hardcoded fill
          // FIX: look up hex in the mapping table, bind to correct variable
        }
      }
    }
  }
  
  // Check text styles
  if (node.type === 'TEXT' && (!node.textStyleId || node.textStyleId === '')) {
    // VIOLATION: missing text style
    // FIX: determine correct style from fontSize/weight, apply via setTextStyleIdAsync
  }
  
  // Skip instance internals (library handles those)
  if (node.type === 'INSTANCE') return;
  
  if (node.children) {
    for (const child of node.children) auditNode(child, np);
  }
}
```

### Zero-tolerance checklist

- [ ] 0 hardcoded solid fills — all bound to CDS **library** variables (not local copies)
- [ ] 0 hardcoded solid strokes — all bound to CDS **library** variables
- [ ] 0 text nodes without library text styles — every TEXT node must have `textStyleId` set to `S:key,ref`
- [ ] 0 non-CDS 37 core variables for semantic colors — all `Colors/*` must come from CDS 37 core (`18138:` prefix)
- [ ] 0 local text styles, color variables, or effect styles — use library references only
- [ ] 0 frames with 100px default height — all auto-layout frames must have sizing set to AUTO/HUG
- [ ] All spacing on 4px grid
- [ ] CDS library components used where available (Chip for badges, library Nav when importable)
- [ ] Layer names are semantic (not "Frame 47" or "Rectangle 12")

### Auto-fix procedure

When the audit finds violations, fix them using library variable IDs:

```javascript
// Map hex → library variable ID for auto-fix
const HEX_TO_VAR_ID = {
  '#212121': 'VariableID:c45fa8f7347b51c3bd7302deefb9e1edeeee9271/18138:6932',
  '#666666': 'VariableID:1aa140f793df4f3ce76d2ae909c78c0360b50aab/18138:6933',
  '#4b3fff': 'VariableID:17d88b1b3dbec658b6fcbb5eeaa572643304f54e/18138:6999',
  '#2e7d32': 'VariableID:cfc60e9d1f9af9567185e93af3e73f030a02f724/18138:6910',
  '#0288d1': 'VariableID:7f72b4c3a13333f7324d16df08e88332471d25e0/18138:6900',
  '#ed6c02': 'VariableID:a5752b26f275ed6c73ae93dceba16cfe33401f81/18138:6890',
  '#d32f2f': 'VariableID:6e95dc04449b16b81c035fed90619098b23a31ca/18138:6991',
  '#ffffff': 'VariableID:70597df059e67b9286730e00064743f0bfec94c3/18138:6941',
  '#f5f5f5': 'VariableID:4427f744e224f749a7d0a43553a58fa962bb8376/18138:6940',
  '#546574': 'VariableID:374f6557312280d07693087b2266f90d8b77ed74/18138:7010',
};

function getHex(color) {
  return '#' + [color.r, color.g, color.b]
    .map(c => Math.round(c * 255).toString(16).padStart(2, '0'))
    .join('');
}

// For each violation, look up the library variable and bind it
const varId = HEX_TO_VAR_ID[hex];
const variable = await figma.variables.getVariableByIdAsync(varId);
const paintCopy = JSON.parse(JSON.stringify(existingPaint));
node.fills = [figma.variables.setBoundVariableForPaint(paintCopy, 'color', variable)];
```
