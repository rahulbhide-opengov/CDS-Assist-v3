# CDS React Code Generation — Complete Reference

Production-quality Vite + React + TypeScript code generation using the CDS Design System.
Every generated project must be hostable locally (`npm run dev`) or on GitHub Pages / any static host (`npm run build`).

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
├── public/
│   └── vite.svg
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
    │   ├── PageTransition.tsx   # Framer motion page transitions (optional)
    │   └── navigation/
    │       ├── index.ts
    │       ├── types.ts         # SuiteNavMenuItem, GlobalNavConfig, etc.
    │       ├── UnifiedNavigation.tsx  # Global nav + suite nav
    │       ├── GlobalNavSection.tsx   # Logo, entity, search, user avatar
    │       └── SuiteNav/
    │           ├── SuiteNav.tsx       # App name + menu items + favorites
    │           └── SuiteNavMenuItem.tsx
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
    ├── hooks/                   # Custom hooks (useDebounce, usePagination, etc.)
    ├── services/                # API service layer with mock data
    ├── types/                   # Shared TypeScript interfaces
    └── utils/                   # Pure utility functions
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
    "@mui/x-data-grid": "^8.11.2",
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

### Optional Dependencies (add when needed)

| Feature | Package | When to add |
|---------|---------|-------------|
| Data grids | `@mui/x-data-grid` | Tables with sort/filter/pagination |
| Date pickers | `@mui/x-date-pickers` | Date/time fields |
| Charts | `recharts` | Dashboards with graphs |
| Rich text | `@tiptap/react` + `@tiptap/starter-kit` | Document editing |
| Drag and drop | `@hello-pangea/dnd` | Kanban, reordering |
| Form validation | `react-hook-form` + `yup` | Complex forms |
| Data fetching | `@tanstack/react-query` | API-heavy pages |
| Animation | `framer-motion` | Page transitions, micro-interactions |
| AI patterns | `@opengov/components-ai-patterns` | OG Assist / AI features |
| Pagination | `@opengov/components-pagination` | Paginated lists |
| File mgmt | `@opengov/components-file-management` | File upload/download |
| Modals | `@opengov/components-modal` | Dialog workflows |
| Drawers | `@opengov/components-drawer` | Side panels |

---

## Theme Architecture

CDS uses a layered theme approach. Never build a theme from scratch.

```typescript
// src/theme/index.ts
import { createTheme } from '@mui/material/styles';
import { capitalMuiTheme, capitalDesignTokens } from '@opengov/capital-mui-theme';
import type { ThemeOptions } from '@mui/material/styles';

const cdsComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: theme.palette.primary.main,
          outlineOffset: 2,
        },
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: theme.palette.primary.main,
          outlineOffset: 2,
        },
      }),
    },
  },
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
        backgroundColor: theme.palette.background.secondary,
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

export const createCdsTheme = () => {
  return createTheme(capitalMuiTheme, {
    palette: {
      ...capitalMuiTheme.palette,
      background: {
        ...capitalMuiTheme.palette.background,
        secondary: '#f8f8f8',
      },
    },
    components: cdsComponents,
  });
};

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

## Entry Points

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>{{APP_TITLE}} - OpenGov</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### main.tsx

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@opengov/capital-mui-theme/dist/fonts.css';
import './global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### global.css

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; -webkit-font-smoothing: antialiased; }
```

---

## Vite Configuration

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui-core': ['@mui/material', '@mui/system'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-opengov': [
            '@opengov/components-page-header',
            '@opengov/components-nav-bar',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  server: { hmr: { overlay: false } },
});
```

---

## TypeScript Configuration

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "incremental": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Import Order (every file)

```typescript
// 1. React
import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';

// 2. @opengov packages
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// 3. MUI components
import { Box, Button, Typography, TextField, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// 4. Local imports
import { BaseLayout } from '../components/BaseLayout';

// 5. Types (ALWAYS use import type)
import type { ProjectData } from '../types';
```

**CRITICAL**: `verbatimModuleSyntax` is enabled. Every type-only import MUST use `import type`. Failure causes blank pages at runtime.

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

// Layouts
import { SuiteLayout } from './layouts/SuiteLayout';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('./pages/suite/DashboardPage'));
const ListPage = lazy(() => import('./pages/suite/ListPage'));
const DetailPage = lazy(() => import('./pages/suite/DetailPage'));

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
              <Route path="/" element={<Navigate to="/suite/dashboard" replace />} />
              <Route element={<SuiteLayout><Outlet /></SuiteLayout>}>
                <Route path="/suite/dashboard" element={<DashboardPage />} />
                <Route path="/suite/items" element={<ListPage />} />
                <Route path="/suite/items/:id" element={<DetailPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

### Rules:
- Every page is lazy-loaded with `React.lazy(() => import(...))`
- Wrap all routes in `<Suspense fallback={<Loading />}>`
- Wrap in `<ErrorBoundary>` for graceful error handling
- Default route redirects to the primary dashboard
- Suite routes are nested under a layout with `<Outlet />`

---

## Page Structure (MANDATORY — three layers)

### Layer 1: Layout wrapper

Provides navigation bar (global + suite). Every route group wraps in a layout.

```typescript
// src/layouts/SuiteLayout.tsx
import React from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { suiteLayoutConfig } from '../config/suiteNavConfig';

export function SuiteLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout config={suiteLayoutConfig}>{children}</BaseLayout>;
}
```

### Layer 2: PageHeaderComposable

Every page starts with the CDS page header. Never build a custom header.

```typescript
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

<PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
  <PageHeaderComposable.Header
    actions={[
      <Button key="create" variant="contained" startIcon={<AddIcon />}>Create New</Button>,
    ]}
  >
    <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
    <PageHeaderComposable.Description>Optional subtitle text</PageHeaderComposable.Description>
  </PageHeaderComposable.Header>
</PageHeaderComposable>
```

### Layer 3: Content area

```typescript
<Box
  component="main"
  sx={{
    maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
    mx: 'auto',
    px: { xs: 2, sm: 4, md: 6 },
    py: 4,
  }}
>
  {/* Page content */}
</Box>
```

---

## Navigation Config Pattern

Every suite needs a nav config file:

```typescript
// src/config/suiteNavConfig.ts
import type { BaseLayoutConfig } from '../components/BaseLayout';

export const suiteLayoutConfig: BaseLayoutConfig = {
  appName: 'Suite Name',
  menuOptions: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      url: '/suite/dashboard',
      tooltipText: 'Suite Dashboard',
      isActive: false,
    },
    {
      id: 'items',
      label: 'Items',
      url: '/suite/items',
      tooltipText: 'Manage Items',
      isActive: false,
    },
  ],
  searchConfig: {
    filterOptions: [
      { value: 'all', label: 'All', Icon: undefined },
      { value: 'type-a', label: 'Type A', Icon: undefined },
    ],
    suggestions: [
      { title: 'Recent Item #1', type: 'type-a', id: '1', url: '/suite/items/1' },
    ],
  },
};
```

---

## Component Usage Rules

### MUI Components — use props, never sx overrides:

| Component | Required Props | Theme Handles |
|-----------|---------------|---------------|
| Typography | `variant` + `color` | fontSize, lineHeight, fontWeight, fontFamily |
| Button | `variant` + `color` + `size` | bgcolor, height, borderRadius, hover/focus |
| TextField | `size` + `label` + `fullWidth` | label above input, radius, focus ring |
| Select | `size` + `label` | same as TextField |
| Checkbox/Radio/Switch | `color` + `size` + `FormControlLabel` | checked color, touch target |
| Chip | `color` + `size` | borderRadius, typography |
| Alert | `severity` + optional `variant` | backgroundColor, borderColor |
| Card/Paper | use as-is | border, borderRadius, elevation=0 |
| Table | use subcomponents | header bg, row hover, last-row border |
| Accordion | use subcomponents | border, expanded border color |

### sx = layout only

**Allowed**: `display`, `flex`, `flexDirection`, `gap`, `p`/`m`/`mb`/`mt`/`px`/`py`, `width`, `maxWidth`, `minHeight`, `position`, `textAlign`, `overflow`, `opacity`, `gridTemplateColumns`, `gridTemplateRows`

**Forbidden**: `fontSize`, `fontWeight`, `fontFamily`, `color` (use prop), `borderRadius`, `bgcolor` with hex values, hover/focus overrides

### Palette paths — never import tokens

```typescript
// CORRECT
<Box sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
<Typography color="text.secondary">

// WRONG
import { colorTokens } from '../../theme/tokens';
```

---

## Responsive Design

All layouts must work at three breakpoints: Desktop (1440px), Tablet (768px), Mobile (390px).

```typescript
// Grid that adapts from 3 columns to 1
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
  gap: 3,
}}>
  {items.map(item => <Card key={item.id}>...</Card>)}
</Box>

// Stack components on mobile
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 2,
  alignItems: { xs: 'stretch', md: 'center' },
}}>
  <TextField size="small" fullWidth />
  <Button variant="contained">Search</Button>
</Box>

// Hide non-essential elements on mobile
<Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
  Additional description text
</Typography>
```

---

## Accessibility Requirements

- `focus-visible` outlines on all interactive elements (theme handles this)
- Skip-to-content link as first focusable element (BaseLayout provides this)
- `aria-label` on every `IconButton`
- `component="nav"` with `aria-label` on navigation regions
- `component="main"` with `id="main-content"` on content area
- Color contrast ≥ 4.5:1 for text (CDS palette satisfies this)
- Logical tab order: navigation → page header → actions → content

---

## Mock Data Pattern

Every page uses realistic mock data with TypeScript types:

```typescript
// src/services/mockData.ts
import type { Item } from '../types';

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Infrastructure Maintenance',
    status: 'active',
    priority: 'high',
    assignee: 'Jane Smith',
    createdAt: '2025-12-15T10:30:00Z',
    updatedAt: '2026-01-20T14:15:00Z',
  },
  // ... more items with realistic gov/enterprise data
];
```

---

## Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3, justifyContent: 'center' }}>
            Something went wrong
          </Alert>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
```

---

## Build & Deploy

### Local development
```bash
npm install
npm run dev          # Vite dev server at http://localhost:5173
```

### Production build
```bash
npm run build        # Output to dist/
npm run preview      # Preview production build locally
```

### GitHub Pages
```bash
# In vite.config.ts, set base: '/repo-name/'
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## Verification Checklist (run after every generation)

1. `npm run dev` — zero build errors, dev server starts
2. Open in browser — visible content, not blank/white page
3. Browser console — zero JS errors
4. All `import type` statements correct (prevents blank page crash)
5. `PageHeaderComposable` present on every page
6. Layout wrapper on every route
7. No hardcoded colors — only palette paths
8. No hardcoded spacing — only `theme.spacing(n)` or MUI shorthand (`p: 2`)
9. Responsive at 1440, 768, 390px — no horizontal scroll, no overflow
10. Keyboard navigation works — tab through all interactive elements
11. `npm run build` — zero errors, dist/ generated
