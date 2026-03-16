# CDS React Code Generation — Complete Reference

Production-quality Vite + React + TypeScript code generation using the CDS Design System.
Every generated project must compile with zero errors (`npx tsc --noEmit`), run locally (`npm run dev`), and build for production (`npm run build`).

---

## Project Architecture

```
my-project/
├── index.html                  # Entry HTML — loads DM Sans, viewport meta
├── package.json                # Dependencies: React 18, MUI 7, @opengov/*, Vite 7
├── tsconfig.json               # References tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json           # Strict TS, bundler mode, verbatimModuleSyntax
├── tsconfig.node.json          # Node-specific (Vite config)
├── vite.config.ts              # Vite + React plugin, manual chunks, optimizeDeps
├── eslint.config.js            # ESLint 9 flat config with React hooks + a11y
└── src/
    ├── main.tsx                # StrictMode + createRoot + font CSS import
    ├── App.tsx                 # BrowserRouter, ThemeProvider, Routes, lazy pages
    ├── global.css              # Minimal global resets only
    ├── theme/
    │   └── index.ts            # createCdsTheme() extending capitalMuiTheme
    ├── contexts/
    │   └── ThemeContext.tsx     # MUI ThemeProvider + CssBaseline wrapper
    ├── components/
    │   ├── BaseLayout.tsx       # Universal layout: nav + main content area
    │   ├── ErrorBoundary.tsx    # React error boundary with fallback UI
    │   └── dashboard/
    │       └── MetricCard.tsx   # Reusable KPI card
    ├── config/
    │   ├── navBarTypes.ts       # IMenuOption, IMenuItem, IUtilityTrayOptions
    │   └── [suite]NavConfig.ts  # Per-suite nav config exporting BaseLayoutConfig
    ├── layouts/
    │   └── [Suite]Layout.tsx    # Thin wrappers: <BaseLayout config={suiteConfig}>
    ├── pages/
    │   └── [suite]/
    │       ├── DashboardPage.tsx
    │       ├── ListPage.tsx
    │       ├── DetailPage.tsx
    │       └── FormPage.tsx
    ├── data/                    # Mock data with TypeScript types
    │   └── [suite]Data.ts
    ├── hooks/                   # Custom hooks (useDebounce, usePagination, etc.)
    ├── services/                # API service layer
    ├── types/                   # Shared TypeScript interfaces
    └── utils/                   # Pure utility functions (formatters, etc.)
```

---

## Critical Dependencies (exact packages)

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "@mui/system": "^7.3.2",
    "@opengov/capital-mui-theme": "^37.13.0",
    "@opengov/components-nav-bar": "^37.13.1",
    "@opengov/components-page-header": "^37.6.0",
    "@opengov/react-capital-assets": "^37.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "react-use": "^17.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "~5.8.3",
    "vite": "^7.1.2",
    "eslint": "^9.33.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react-hooks": "^5.2.0"
  }
}
```

### Optional Dependencies (add only when needed)

| Feature | Package | When to add |
|---------|---------|-------------|
| Charts | `recharts` | Dashboards with bar/line/pie charts |
| Data grids | `@mui/x-data-grid` | Tables with sort/filter/pagination |
| Date pickers | `@mui/x-date-pickers` + `dayjs` | Date/time fields |
| Rich text | `@tiptap/react` + `@tiptap/starter-kit` | Document editing |
| Drag and drop | `@hello-pangea/dnd` | Kanban, reordering |
| Form validation | `react-hook-form` + `yup` | Complex forms (5+ fields) |
| Data fetching | `@tanstack/react-query` | API-heavy pages |
| Animation | `framer-motion` | Page transitions, micro-interactions |
| AI patterns | `@opengov/components-ai-patterns` | OG Assist / AI features |
| Pagination | `@opengov/components-pagination` | Paginated lists |
| File mgmt | `@opengov/components-file-management` | File upload/download |
| Modals | `@opengov/components-modal` | Dialog workflows |
| Drawers | `@opengov/components-drawer` | Side panels |

---

## Import Order (every file, no exceptions)

```typescript
// 1. React core
import React, { useState, useCallback, useMemo } from 'react';

// 2. @opengov packages (CDS first)
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// 3. MUI components
import { Box, Button, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// 4. Third-party (recharts, etc.)
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// 5. Local imports
import { BaseLayout } from '../components/BaseLayout';
import { plcKPIs } from '../data/plcDashboardData';

// 6. Type-only imports (MUST use `import type`)
import type { ProjectData } from '../types';
```

### `import type` — The Blank-Page Rule

`verbatimModuleSyntax` is enabled. Every type-only import **MUST** use `import type`. Failure causes a **blank white page at runtime** with zero console errors — the hardest bug to diagnose.

**Common pitfalls:**
```typescript
// WRONG — will cause blank page if ThemeOptions is type-only
import { createTheme, ThemeOptions } from '@mui/material/styles';

// CORRECT
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// WRONG — mixing runtime and type imports
import { Theme, useTheme } from '@mui/material';

// CORRECT
import { useTheme } from '@mui/material';
import type { Theme } from '@mui/material';
```

**Rule of thumb:** If a symbol is only used in type annotations (`: Type`, `as Type`, `<Generic>`), it MUST be `import type`. If used at runtime (called, instantiated, compared), use regular `import`.

---

## Theme Architecture

CDS uses a layered theme. Never build a theme from scratch.

```typescript
// src/theme/index.ts
import { createTheme } from '@mui/material/styles';
import { capitalMuiTheme } from '@opengov/capital-mui-theme';
import type { ThemeOptions } from '@mui/material/styles';

const cdsComponents: ThemeOptions['components'] = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: ({ theme }: any) => ({
        backgroundColor: theme.palette.grey[50],
        fontWeight: 600,
      }),
      root: {
        'tbody tr:last-child &': { borderBottom: 'none' },
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius || '4px',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { borderColor: theme.palette.primary.main },
      }),
    },
  },
};

export const createCdsTheme = () =>
  createTheme(capitalMuiTheme, { components: cdsComponents });

export const theme = createCdsTheme();
```

### ThemeContext (wrap entire app)

```typescript
// src/contexts/ThemeContext.tsx
import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
```

---

## Component Hierarchy — The Golden Rule

Every UI decision follows this precedence. No exceptions.

### Tier 1: CDS components (`@opengov/components-*`)
Always the first choice when a CDS component exists.

| Component | Package | Use |
|-----------|---------|-----|
| Page header | `@opengov/components-page-header` | Every page title area |
| Navigation bar | `@opengov/components-nav-bar` | Suite navigation |
| Logo/icons | `@opengov/react-capital-assets` | OpenGov branding |

### Tier 2: MUI components with CDS theme
When no CDS component exists. The CDS theme overrides 70+ MUI components — just use props.

### Tier 3: Custom components with CDS tokens
Last resort. Build with `useTheme()` and `capitalDesignTokens`. No hardcoded values.

---

## MUI Component Rules (The CDS Way)

### The Two Access Patterns for Theme Values

**Pattern A: `sx` prop with palette paths** — for layout and simple styling in JSX

```typescript
// String palette paths resolve through the theme automatically
<Box sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
<Typography color="text.secondary">
<Chip color="success">
```

**Pattern B: `useTheme()` hook** — for computed values, third-party libraries, and conditional logic

```typescript
const theme = useTheme();

// Chart axis styling
tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}

// Conditional colors
color={isPositive ? 'success.main' : 'error.main'}

// Dynamic border
border: `1px solid ${theme.palette.divider}`
```

**When to use which:**
- `sx` palette paths → static styling on MUI components
- `useTheme()` → chart libraries (recharts), conditional logic, computed values, template literals

### Component Props — Use Props, Never Override

| Component | Required Props | Theme Handles (never touch in sx) |
|-----------|---------------|-----------------------------------|
| Typography | `variant` + `color` | fontSize, lineHeight, fontWeight, fontFamily |
| Button | `variant` + `color` + `size` | bgcolor, height, borderRadius, hover/focus |
| TextField | `size` + `label` + `fullWidth` | borderRadius, focus ring, input typography |
| Select | `size` + `label` | same as TextField |
| Checkbox/Radio/Switch | `color` + `size`, wrap in `FormControlLabel` | checked color, touch target |
| Chip | `color` + `size` + optional `variant="outlined"` | borderRadius, typography |
| Alert | `severity` + optional `variant="filled"/"outlined"` | backgroundColor, borderColor |
| Link | `variant` + `color` + `underline="hover"` | fontSize, fontFamily, text decoration |
| Card | `variant="outlined"` for bordered cards | border, borderRadius, elevation |
| Dialog/Accordion | subcomponents as-is | borderRadius, padding, typography |
| Table | subcomponents (Head/Body/Row/Cell) | header bg, row hover, last-row border |
| IconButton | `color` + `aria-label` (required!) | hover bg, focus ring |

### sx Prop = Layout Only

**Allowed in `sx`:**
`display`, `flex`, `flexDirection`, `gap`, `p`/`m`/`mb`/`mt`/`px`/`py`, `width`, `maxWidth`, `minWidth`, `minHeight`, `position`, `textAlign`, `overflow`, `opacity`, `gridTemplateColumns`, `gridTemplateRows`, `justifyContent`, `alignItems`

**Forbidden in `sx`:**
`fontSize`, `fontWeight`, `fontFamily`, `color` with hex values, `borderRadius`, `bgcolor` with hex values, `hover`/`focus` overrides, `lineHeight`

### TextField — MUI 7 uses `slotProps`, not `InputProps`

```typescript
// CORRECT (MUI 7)
<TextField
  label="Search"
  size="small"
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start"><SearchIcon /></InputAdornment>
      ),
    },
  }}
/>

// DEPRECATED (MUI 5/6 — still works but avoid in new code)
<TextField InputProps={{ startAdornment: ... }} />
```

### Card — Use `variant="outlined"` for Dashboard Sections

CDS dashboards use outlined cards (border, no shadow) for content sections:

```typescript
<Card variant="outlined">
  <CardContent>
    <Typography variant="h6" sx={{ mb: 2 }}>Section Title</Typography>
    {/* section content */}
  </CardContent>
</Card>
```

The theme applies `border: 1px solid divider` and `borderRadius: 4px` automatically.

### Link — For Clickable Text (Not Typography with onClick)

```typescript
// CORRECT — themed Link component
<Link variant="body2" color="primary" underline="hover" href="#">
  PER-2024-1089
</Link>

// WRONG — manual fontWeight on Typography
<Typography sx={{ fontWeight: 500, cursor: 'pointer', color: 'primary.main' }} onClick={...}>
  PER-2024-1089
</Typography>
```

---

## Page Structure (MANDATORY — Three Layers)

Every page must have all three layers. No exceptions.

### Layer 1: Layout Wrapper

Provides the navigation bar. Every route group wraps in a layout.

```typescript
// src/layouts/PermittingLayout.tsx
import React from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { permittingLayoutConfig } from '../config/permittingNavConfig';

export function PermittingLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout config={permittingLayoutConfig}>{children}</BaseLayout>;
}
```

### Layer 2: PageHeaderComposable

Every page MUST use `PageHeaderComposable`. Never build a custom header with Box + Typography.

```typescript
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

<Box component="header">
  <PageHeaderComposable
    maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}
  >
    <PageHeaderComposable.Header
      actions={[
        <Button key="export" variant="outlined" color="secondary" size="medium"
                startIcon={<FileDownloadOutlinedIcon />}>Export</Button>,
        <Button key="create" variant="contained" color="primary" size="medium"
                startIcon={<AddIcon />}>New Permit</Button>,
      ]}
    >
      <PageHeaderComposable.Title>PLC Dashboard</PageHeaderComposable.Title>
      <PageHeaderComposable.Description>
        Overview of permits, licenses, and inspections.
      </PageHeaderComposable.Description>
    </PageHeaderComposable.Header>
  </PageHeaderComposable>
</Box>
```

### Layer 3: Content Area

```typescript
<Box
  component="main"
  sx={{
    maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
    mx: 'auto',
    px: { xs: 2, sm: 3, md: 4 },
    py: 3,
  }}
>
  {/* Page content */}
</Box>
```

### Mobile Action Buttons

On mobile, header action buttons can overflow. Move them below the header:

```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

{/* Desktop: actions in PageHeader. Mobile: actions below header */}
<PageHeaderComposable.Header actions={isMobile ? undefined : [/* buttons */]}>
  ...
</PageHeaderComposable.Header>

{isMobile && (
  <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
    <Button variant="outlined" color="secondary" size="small" fullWidth
            startIcon={<FileDownloadOutlinedIcon />}>Export</Button>
    <Button variant="contained" color="primary" size="small" fullWidth
            startIcon={<AddIcon />}>New Permit</Button>
  </Stack>
)}
```

---

## Dashboard Patterns

### KPI / Metric Cards

Reusable `MetricCard` component for KPI rows:

```typescript
// src/components/dashboard/MetricCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface MetricCardProps {
  label: string;
  value: string;
  changePercentage?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, changePercentage }) => {
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h4" sx={{ my: 1 }}>{value}</Typography>
        {changePercentage !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive
              ? <TrendingUpIcon fontSize="small" color="success" />
              : <TrendingDownIcon fontSize="small" color="error" />}
            <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
              {isPositive ? '+' : ''}{changePercentage}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
```

KPI grid layout:
```typescript
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
    gap: 2,
  }}
>
  {kpis.map((kpi) => (
    <MetricCard key={kpi.label} label={kpi.label} value={kpi.formatted}
                changePercentage={kpi.change} />
  ))}
</Box>
```

### Dashboard Content Layout

Two-section rows using flex:
```typescript
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
  <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
    {/* Primary content (wider) */}
  </Card>
  <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
    {/* Secondary content (narrower) */}
  </Card>
</Box>
```

The `flex: '2 1 0'` / `flex: '1 1 0'` pattern creates a 2:1 ratio on desktop, stacked on mobile. `minWidth: 0` prevents flex overflow.

---

## Chart Theming (Recharts + CDS)

Charts are the main place where `useTheme()` is required, because recharts doesn't understand MUI palette paths.

### Data Visualization Colors

Use `capitalDesignTokens.semanticColors.dataVisualization` for multi-series chart data:

```typescript
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const chartColors = {
  series1: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
  series2: capitalDesignTokens.semanticColors.dataVisualization.sequence100,
  series3: capitalDesignTokens.semanticColors.dataVisualization.sequence200,
};
```

For status-based colors (pie charts, status breakdowns), resolve from `theme.palette`:

```typescript
const theme = useTheme();

const statusColors: Record<string, string> = {
  info: (theme.palette.info as { main: string }).main,
  success: (theme.palette.success as { main: string }).main,
  warning: (theme.palette.warning as { main: string }).main,
  error: (theme.palette.error as { main: string }).main,
};
```

### Chart Axis and Grid Styling

Every recharts element must use theme tokens:

```typescript
const theme = useTheme();

<CartesianGrid
  strokeDasharray="3 3"
  vertical={false}
  stroke={theme.palette.divider}
/>
<XAxis
  dataKey="month"
  tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
  axisLine={{ stroke: theme.palette.divider }}
  tickLine={false}
/>
<YAxis
  tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
  axisLine={false}
  tickLine={false}
/>
```

### Chart Tooltip Styling

```typescript
<Tooltip
  contentStyle={{
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily as string,
    fontSize: theme.typography.body2.fontSize,
  }}
/>
```

### Chart Legend Styling

```typescript
<Legend
  wrapperStyle={{
    fontFamily: theme.typography.fontFamily as string,
    fontSize: theme.typography.caption.fontSize,
  }}
/>
```

### Complete Chart Example (Bar Chart)

```typescript
function PermitActivityChart() {
  const theme = useTheme();

  const chartColors = {
    submitted: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    approved: capitalDesignTokens.semanticColors.dataVisualization.sequence100,
    denied: capitalDesignTokens.semanticColors.dataVisualization.sequence200,
  };

  return (
    <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Permit Activity</Typography>
          <Typography variant="caption" color="text.secondary">Last 12 months</Typography>
        </Stack>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis dataKey="month"
                   tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
                   axisLine={{ stroke: theme.palette.divider }} tickLine={false} />
            <YAxis tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
                   axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              fontFamily: theme.typography.fontFamily as string,
            }} />
            <Legend wrapperStyle={{ fontFamily: theme.typography.fontFamily as string, fontSize: theme.typography.caption.fontSize }} />
            <Bar dataKey="submitted" name="Submitted" fill={chartColors.submitted} radius={[2, 2, 0, 0]} />
            <Bar dataKey="approved" name="Approved" fill={chartColors.approved} radius={[2, 2, 0, 0]} />
            <Bar dataKey="denied" name="Denied" fill={chartColors.denied} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## Status Chip Color Mapping

A reusable pattern for mapping status strings to MUI Chip colors:

```typescript
const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  'In Review': 'info',
  'Approved': 'success',
  'On Hold': 'warning',
  'Submitted': 'default',
  'Denied': 'error',
  'Active': 'success',
  'Inactive': 'default',
  'Overdue': 'error',
};

// Usage
<Chip label={item.status} size="small" color={STATUS_CHIP_COLOR[item.status] ?? 'default'} />
```

---

## Responsive Table-to-Card Pattern

Tables on desktop should collapse to card-style stacks on mobile. This is the canonical pattern:

```typescript
function DataSection() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  if (isSmall) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Applications</Typography>
          <Stack spacing={0} divider={<Divider />}>
            {items.map((item) => (
              <Box key={item.id} sx={{ py: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Link variant="body2" color="primary" underline="hover" href="#">
                    {item.id}
                  </Link>
                  <Chip label={item.status} size="small"
                        color={STATUS_CHIP_COLOR[item.status]} />
                </Stack>
                <Typography variant="body2">{item.title}</Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">{item.subtitle}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="h6" sx={{ px: 2, pt: 2, pb: 1 }}>Recent Applications</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Link variant="body2" color="primary" underline="hover" href="#">
                      {item.id}
                    </Link>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Chip label={item.status} size="small"
                          color={STATUS_CHIP_COLOR[item.status]} />
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
```

Key patterns:
- Card wraps table with `overflow: 'hidden'` to clip border-radius
- `CardContent` uses `p: 0` and `'&:last-child': { pb: 0 }` to eliminate default padding
- Table title is inside `CardContent` with `px: 2, pt: 2, pb: 1`
- Use `<Link>` for clickable IDs, not Typography with click handlers

---

## Mock Data Architecture

### File Organization

```
src/data/
├── plcDashboardData.ts     # Typed mock data for PLC dashboard
├── procurementData.ts      # Mock data for procurement pages
└── eamData.ts              # Mock data for EAM pages
```

### Typing Rules

- Every mock data file exports TypeScript interfaces at the top
- Status fields use union types for type safety
- Colors use semantic palette keys, never hex values

```typescript
// src/data/plcDashboardData.ts

export interface PLCApplication {
  id: string;
  recordType: string;
  applicant: string;
  status: 'In Review' | 'Approved' | 'On Hold' | 'Submitted' | 'Denied';
  submitted: string;
  assigned: string;
}

export interface PLCStatusDistribution {
  label: string;
  value: number;
  paletteColor: string;   // Semantic key: 'info' | 'success' | 'warning' | 'error'
}

export const plcStatusDistribution: PLCStatusDistribution[] = [
  { label: 'In Review', value: 42, paletteColor: 'info' },
  { label: 'Approved', value: 31, paletteColor: 'success' },
  { label: 'On Hold', value: 15, paletteColor: 'warning' },
  { label: 'Denied', value: 12, paletteColor: 'error' },
];
```

### KPI Data Shape

```typescript
export const plcKPIs = {
  activePermits: { value: 1247, change: 12.3, label: 'Active Permits' },
  pendingReviews: { value: 83, change: -5.1, label: 'Pending Reviews' },
  inspectionsScheduled: { value: 36, change: 8.7, label: 'Inspections Scheduled' },
  revenueThisMonth: { value: 428500, change: 18.2, label: 'Revenue This Month' },
};
```

---

## Data Formatting Utilities

Common formatters used across dashboards:

```typescript
// src/utils/formatters.ts

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
```

---

## Four Required States (every data-driven component)

```typescript
// Loading
if (loading) {
  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} />
    </Box>
  );
}

// Error
if (error) {
  return (
    <Alert
      severity="error"
      action={<Button size="small" onClick={retry}>Retry</Button>}
    >
      {error.message || 'Something went wrong. Please try again.'}
    </Alert>
  );
}

// Empty
if (!data || data.length === 0) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No items yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Get started by creating your first item.
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />}>
        Create First Item
      </Button>
    </Box>
  );
}

// Success — render content
return <>{/* data-driven UI */}</>;
```

---

## Routing Architecture

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CircularProgress, Box } from '@mui/material';

import { PermittingLayout } from './layouts/PermittingLayout';

const DashboardPage = lazy(() => import('./pages/permitting/DashboardPage'));
const ListPage = lazy(() => import('./pages/permitting/ListPage'));

const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/permitting/dashboard" replace />} />
              <Route element={<PermittingLayout><Outlet /></PermittingLayout>}>
                <Route path="/permitting/dashboard" element={<DashboardPage />} />
                <Route path="/permitting/applications" element={<ListPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

Rules:
- Every page is lazy-loaded with `React.lazy(() => import(...))`
- Wrap all routes in `<Suspense fallback={<Loading />}>`
- Wrap in `<ErrorBoundary>` for graceful error handling
- Default route redirects to the primary dashboard
- Suite routes are nested under a layout with `<Outlet />`

---

## Responsive Design

All layouts must work at three breakpoints: Desktop (1440px), Tablet (768px), Mobile (390px).

### Grid Patterns

```typescript
// 4-column → 2-column → 2-column KPI grid
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
  gap: 2,
}}>

// 2:1 ratio → stacked
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
  <Card sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
  <Card sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
</Box>
```

### Content Padding Scale

```typescript
px: { xs: 2, sm: 3, md: 4 }   // 8px → 12px → 16px
py: 3                           // 12px consistent
```

### Hiding Non-Essential Elements

```typescript
// Hide on mobile only
<Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
  Additional info
</Typography>

// Show different content per breakpoint
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

---

## Accessibility Requirements

- `focus-visible` outlines on all interactive elements (theme handles this)
- Skip-to-content link as first focusable element (BaseLayout provides this)
- `aria-label` on every `IconButton` — no exceptions
- `component="nav"` with `aria-label` on navigation regions
- `component="main"` with `id="main-content"` on content area
- Color contrast ≥ 4.5:1 for text (CDS palette satisfies this)
- Logical tab order: navigation → page header → actions → content
- Charts: `aria-label` describing the chart's purpose
- Never rely on color alone: pair with icons, labels, or patterns

---

## Input Normalization

### Colors
Non-CDS colors → nearest CDS semantic color. Use palette paths, never hex.

### Typography
Non-CDS font sizes → nearest CDS variant:

| Input size | CDS Variant | Weight |
|------------|-------------|--------|
| 48px+ | `h1` | 600 |
| 32-40px | `h2` | 600 |
| 24-28px | `h3` | 600 |
| 20-22px | `h4` | 600 |
| 16-18px heading | `h5` | 600 |
| 14-15px heading | `h6` | 600 |
| 16px regular | `subtitle1` | 400 |
| 14px medium | `subtitle2` | 500 |
| 14px body | `body1` | 400 |
| 12px body | `body2` | 400 |
| 12px label | `caption` | 500 |

### Sizing
All spacing on 4px grid. Component heights use `size` prop, not manual `sx`.

---

## Build & Verification Checklist

### After every generation, run in order:

1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run dev` — dev server starts
3. Open in browser — visible content, not blank/white page
4. Browser console — zero JS errors
5. If blank page → check `import type` in theme files and page files
6. `PageHeaderComposable` present on every page
7. Layout wrapper on every route
8. No hardcoded colors — only palette paths or `theme.palette.*`
9. No hardcoded spacing — only `theme.spacing(n)` or MUI shorthand
10. Charts use `capitalDesignTokens` or `theme.palette` for colors
11. Responsive at 1440, 768, 390px — no horizontal scroll, no overflow
12. Keyboard navigation works — tab through all interactive elements
13. `npm run build` — zero errors, dist/ generated

### Common Build Failures

| Error | Fix |
|-------|-----|
| Blank page, no console errors | `import type` missing on a type-only import |
| `Module not found: @opengov/*` | Run `npm install` — package not in node_modules |
| `Property does not exist on type Theme` | Use `(theme.palette.info as { main: string }).main` for palette access |
| `Cannot find name 'React'` | Add `import React from 'react'` or check `jsx: 'react-jsx'` in tsconfig |
| Chart colors show default blue | Using recharts defaults — apply `capitalDesignTokens` colors |
| Typography shows wrong font | Missing DM Sans import in `index.html` or `main.tsx` |

---

## Key Packages Quick Reference

| Package | Import | Use |
|---------|--------|-----|
| `@opengov/components-page-header` | `PageHeaderComposable` | CDS page header on every page |
| `@opengov/components-nav-bar` | `SearchDialog` | Suite navigation, search |
| `@opengov/capital-mui-theme` | `capitalDesignTokens`, `capitalMuiTheme` | Layout breakpoints, data viz colors, base theme |
| `@opengov/react-capital-assets` | `OpenGovLogo` | OpenGov branding |
| `@mui/material` | All UI components | Buttons, Typography, Cards, etc. |
| `@mui/icons-material` | `*Icon` | Material icons (Outlined + Filled only) |
| `recharts` | `BarChart`, `PieChart`, etc. | Data visualization |

---

## Anti-Patterns (Never Do This)

```typescript
// NEVER: Hardcoded colors
<Box sx={{ bgcolor: '#4b3fff', color: '#fff' }}>

// NEVER: Manual font styling
<Typography sx={{ fontSize: 16, fontWeight: 600, fontFamily: 'DM Sans' }}>

// NEVER: Custom button styling
<Box onClick={fn} sx={{ bgcolor: 'primary.main', borderRadius: 1, p: 1, cursor: 'pointer' }}>

// NEVER: Hand-built page header
<Box sx={{ p: 3, borderBottom: 1 }}>
  <Typography variant="h4">Page Title</Typography>
</Box>

// NEVER: Direct token imports in page components
import { cdsColors } from '../../theme/cds/tokens';

// NEVER: Mixing import and import type
import { Theme, useTheme, ThemeOptions } from '@mui/material';
```
