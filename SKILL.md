---
name: CDS-Assist
description: Build production-ready OpenGov React components and Figma designs using the CDS Design System
---

# CDS-Assist

AI design-and-code engine for OpenGov. Generates React code and/or Figma designs using the CDS Design System.

## Step 0 — Auto-Load References (do this BEFORE anything else)

When activated, immediately scan the user's prompt and load relevant references. **The user never needs to specify which files to read — you detect intent automatically.**

### Reference Auto-Loading Rules

Scan the prompt for keywords and load ALL matching files. Multiple matches are normal and expected.

| Prompt contains... | Load these references |
|--------------------|----------------------|
| Figma / design / visual / layout / Figma URL | `references/figma.md` + `references/figma-quality.md` |
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
- Any Figma task → ALWAYS load `figma.md` AND `figma-quality.md`. For component work, also load `figma-library-catalog.md`.
- Don't ask what to load — just load it silently.
- Once loaded in a session, don't re-read on subsequent turns.

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

#### Figma Execution (mandatory in order):
  1. **Scan canvas** → find existing content, calculate safe X position for new frames
  2. **Bootstrap**: Load fonts → import Chip component to warm up library → build variable map from `figma-quality.md`
  3. **Create**: Place new frames at safe X position. **The mandatory trio for EVERY screen**:
     - **Global Navigation** — first child, `layoutSizingHorizontal = 'FILL'`. Use suite-specific `Product` variant when one exists (Procurement, B&P, Utility Billing, Asset Management, Agents Studio, Vendor Portal, Command Center); else Default (key `c24369659d8f75ec3815d2d3ffb1342dd7e551b5`).
     - **PSP Menu** — on **desktop**: visible 320px left sidebar (below Global Nav, left of content) with Entity, Action Hubs, Products (highlight current suite), Capabilities, Preferences. On **tablet/mobile**: hidden behind hamburger (no visible sidebar). Component key: `16da480901ce5bdd694aa97596f7f6bd3eddff32` (import may time out — build manually if needed).
     - **Page Heading** — from library (set key `ed8d390034cdc9b76fc11e1e2647856ff734d33d`), NEVER hand-built. `layoutSizingHorizontal = 'FILL'`, `Small Screen: True` for tablet/mobile. Override h1 (title), body1 (description), body2 (breadcrumbs) via text node find.
     - Use library components from `figma-library-catalog.md`, bind ALL fills/strokes to library variables, apply library text styles
  4. **Content parity check**: If creating responsive breakpoints, verify ALL breakpoints contain the same data sections, same number of items/rows, and same content — only the layout changes (e.g., columns → stack, table → cards). Never drop or truncate content for smaller screens.
  5. **Audit**: Zero hardcoded fills, zero local styles/variables, zero manual shapes for CDS components
  6. **Auto-fix**: Batch-fix violations using hex → library variable mapping
  7. **Screenshot**: Capture at 2x, verify visual quality (max 3 iterations)
- **CRITICAL API rules:**
  - `importComponentByKeyAsync(variantKey)` — for specific variants (Button, Chip, Avatar)
  - `importComponentSetByKeyAsync(setKey)` — for component sets (Breadcrumbs, Divider, Card, Paper, Link, Page Heading). Use `.defaultVariant.createInstance()`.
  - **NEVER** use `importComponentByKeyAsync` with a set key — it hangs forever.
  - Always warm up the library first by importing Chip before other imports.

### If React selected:
- Generate React/TS with CDS theme + MUI. Add route to `src/App.tsx` if new page.
- **MANDATORY**: Wrap every page in Layout + PageHeaderComposable (see Page Structure below)
- Handle 4 states: loading, error, empty, success
- `import type` for TS type-only exports
- **React Verification:**
  1. Start dev server (`npm run dev`) — zero build errors
  2. Open page in browser — visible content, zero console errors
  3. If blank page: check `import type` in theme files

### Ongoing Changes:
- Update React code immediately for any modifications
- If Figma was selected, also update Figma to stay in sync
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
- CDS is **light mode only**. If user asks for dark mode, explain CDS doesn't support it and build in light mode.

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

// With icon
<TextField
  label="Search"
  size="medium"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start"><SearchIcon /></InputAdornment>
    ),
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

## Code Rules

- No hardcoded colors/spacing — theme tokens only
- Import order: React → @opengov → MUI → Local
- `PageHeaderComposable` from `@opengov/components-page-header` on every page
- Layout wrapper (`BaseLayout` or suite layout) on every page route
- 4 states: loading (Skeleton or CircularProgress), error (Alert severity="error"), empty (illustration + Typography), success (content)
- Never reference "seamstress"
- `import type` for TS type-only exports

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
| `cds-assist/seamstress-design/` | React project root |
| `cds-assist/figma-cli/` | Figma CLI root |
| `~/.cds-assist/shared/` | Global CDS tokens |
| `src/theme/cds/` | CDS theme + tokens |
| `src/components/BaseLayout.tsx` | Layout wrapper with navigation |
| `src/components/navigation/` | UnifiedNavigation, GlobalNav, SuiteNav |
| `src/config/` | Navigation configs per suite |

## Key Packages

| Package | What it provides | Import |
|---------|-----------------|--------|
| `@opengov/components-page-header` | `PageHeaderComposable` — the CDS page header | `import { PageHeaderComposable } from '@opengov/components-page-header'` |
| `@opengov/components-nav-bar` | Suite navigation bar, search dialog | `import { SearchDialog, ... } from '@opengov/components-nav-bar'` |
| `@opengov/capital-mui-theme` | `capitalDesignTokens` — layout breakpoints, etc. | `import { capitalDesignTokens } from '@opengov/capital-mui-theme'` |
| `@opengov/react-capital-assets` | OpenGov logos, icons | `import { OpenGovLogo } from '@opengov/react-capital-assets'` |
| `@mui/material` | All UI components (Button, TextField, etc.) | `import { Button, TextField, ... } from '@mui/material'` |
| `@mui/icons-material` | Material icons | `import AddIcon from '@mui/icons-material/Add'` |

## Figma MCP Tools (for reading designs — works in any output mode)

```
get_design_context(fileKey, nodeId)  — layout, colors, typography, code
get_screenshot(fileKey, nodeId)      — visual screenshot
get_metadata(fileKey, nodeId)        — node tree structure
get_variable_defs(fileKey)           — Figma variables
```
