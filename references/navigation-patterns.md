# CDS Navigation Architecture — Reference

Three-layer navigation system used by all OpenGov products. Every generated project MUST follow this architecture.

---

## Navigation Layers

```
┌─────────────────────────────────────────────────────┐
│ Global Nav (56px)                                    │
│ [☰ Logo] [Entity ▾]         [🔍] [🔔] [AI] [👤]   │
├─────────────────────────────────────────────────────┤
│ Suite Nav (48px)                                     │
│ Suite Name  ★ Dashboard  Items  Settings             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Page Content (inside BaseLayout)                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Layer 1: Global Navigation (GlobalNavSection)
- Height: 56px, fixed at top
- Left: OpenGov logo + entity/org dropdown
- Right: Search icon, notifications, AI assistant, user avatar
- Scrolls away on scroll-down, reappears on scroll-up
- `centeredBranding: true` vertically stacks logo + entity (used by Command Center)
- `hideSuiteNav: true` hides the suite nav bar entirely

### Layer 2: Suite Navigation (SuiteNav)
- Height: 48px, below global nav
- Shows: suite name (bold, primary color) + favorites dropdown + horizontal menu items
- Horizontally scrollable on narrow viewports
- Active item has a bottom border indicator
- Menu items are simple links with `id`, `label`, `url`

### Layer 3: Content Area
- Wrapped in `<Box component="main" id="main-content">`
- Default `maxWidth` from `capitalDesignTokens.foundations.layout.breakpoints.desktop.wide`
- Horizontally centered with `mx: 'auto'`

---

## BaseLayout Component

The universal wrapper that combines all three layers. Every route group MUST use `BaseLayout` or a thin suite-specific wrapper around it.

### BaseLayoutConfig interface

```typescript
export interface BaseLayoutConfig {
  appName: string;                    // Suite name displayed in nav
  menuOptions: IMenuOption[];         // Navigation menu items
  favoritesData?: IFavoritesSection[]; // Optional favorites sections
  searchConfig?: SearchConfig;         // Optional search functionality
  globalNav?: GlobalNavConfig;         // Optional global nav overrides
}

interface GlobalNavConfig {
  visible?: boolean;          // Show/hide global nav (default: true)
  scrollBehavior?: boolean;   // Auto-hide on scroll (default: true)
  centeredBranding?: boolean; // Center logo + entity (default: false)
  hideSuiteNav?: boolean;     // Hide suite nav bar (default: false)
}

interface SearchConfig {
  filterOptions: SearchFilterOption[];
  suggestions: SearchSuggestion[];
}
```

### BaseLayout usage

```typescript
import { BaseLayout } from '../components/BaseLayout';
import type { BaseLayoutConfig } from '../components/BaseLayout';

const config: BaseLayoutConfig = {
  appName: 'Enterprise Asset Management',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', url: '/eam/dashboard' },
    { id: 'assets', label: 'Assets', url: '/eam/assets' },
    { id: 'work-orders', label: 'Work Orders', url: '/eam/work-orders' },
  ],
};

function EAMLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout config={config}>{children}</BaseLayout>;
}
```

### BaseLayout internals (what it renders)

```
<Box minHeight="100vh" bgcolor="background.default">
  <!-- Skip to content link (accessibility) -->
  <a href="#main-content">Skip to main content</a>

  <!-- Navigation (UnifiedNavigation) -->
  <UnifiedNavigation
    globalNav={config.globalNav}
    appName={config.appName}
    menuItems={config.menuOptions}
    favorites={config.favoritesData}
  />

  <!-- Optional: SearchDialog -->

  <!-- Main content area -->
  <Box component="main" id="main-content"
    sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto' }}>
    {children}
  </Box>
</Box>
```

---

## Menu Option Types

```typescript
// Minimal menu item (most common)
interface IMenuOption {
  id: string;
  label: string;
  url: string;
  tooltipText?: string;
  isActive?: boolean;
}

// With nested submenus (mega menu pattern)
interface IMenuOption {
  id: string;
  label: string;
  url?: string;
  submenuSections?: ISubmenuSection[];
  shouldFetchNestedMenuItems?: boolean;
}

interface ISubmenuSection {
  title?: string;
  items?: IMenuItem[];
}

interface IMenuItem {
  id: string;
  label: string;
  url?: string;
  openInNewTab?: boolean;
}
```

---

## Suite Layout Pattern (thin wrapper)

Every suite creates a thin layout file — just a one-line wrapper around BaseLayout:

```typescript
// src/layouts/EAMLayout.tsx
import React from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { eamLayoutConfig } from '../config/eamNavConfig';

export function EAMLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout config={eamLayoutConfig}>{children}</BaseLayout>;
}
```

This pattern means:
- Nav config is fully declarative (just data)
- Layout component is trivially thin
- Changing navigation = editing config object only
- Multiple suites share identical layout structure

---

## Route Registration with Layouts

```typescript
// In App.tsx
import { EAMLayout } from './layouts/EAMLayout';
import { ProcurementLayout } from './layouts/ProcurementLayout';

<Routes>
  {/* EAM Suite */}
  <Route element={<EAMLayout><Outlet /></EAMLayout>}>
    <Route path="/eam/dashboard" element={<EAMDashboard />} />
    <Route path="/eam/assets" element={<AssetsList />} />
    <Route path="/eam/assets/:id" element={<AssetDetail />} />
    <Route path="/eam/work-orders" element={<WorkOrdersList />} />
  </Route>

  {/* Procurement Suite */}
  <Route element={<ProcurementLayout><Outlet /></ProcurementLayout>}>
    <Route path="/procurement/dashboard" element={<ProcurementDashboard />} />
    <Route path="/procurement/projects" element={<ProjectsList />} />
    <Route path="/procurement/projects/:id" element={<ProjectDetail />} />
  </Route>

  {/* Default redirect */}
  <Route path="/" element={<Navigate to="/eam/dashboard" replace />} />
</Routes>
```

---

## Search Integration

Optional — only add when the suite needs in-app search.

```typescript
searchConfig: {
  filterOptions: [
    { value: 'all', label: 'All', Icon: undefined },
    { value: 'work-orders', label: 'Work Orders', Icon: undefined },
    { value: 'assets', label: 'Assets', Icon: undefined },
  ],
  suggestions: [
    { title: 'Work Order #WO-2847', type: 'work-orders', id: '0', url: '/eam/work-orders/2847' },
    { title: 'Asset: HVAC Unit #12', type: 'assets', id: '1', url: '/eam/assets/hvac-12' },
    { title: 'Create Work Order', type: 'work-orders', id: '2', url: '/eam/work-orders/new' },
  ],
},
```

The `SearchDialog` from `@opengov/components-nav-bar` provides:
- Full-text search input with debounce
- Filter tabs
- Recent suggestions
- Result table with focused preview
- Keyboard navigation

---

## Navigation States

| State | Global Nav | Suite Nav | Use Case |
|-------|-----------|-----------|----------|
| Standard | Visible, scroll-hide | Visible | Most pages |
| Command Center | Centered branding | Hidden | Landing/overview pages |
| Standalone | Hidden | Hidden | Public portals, marketing |
| Full-width | Visible | Visible, `maxContentWidth: 'none'` | Map views, builders |

---

## Favorites

Optional per suite. Shows a star dropdown next to the suite name with bookmarked pages:

```typescript
favoritesData: [
  {
    id: 'recent',
    label: 'Recent',
    items: [
      { id: 'fav-1', label: 'Work Order #WO-2847', url: '/eam/work-orders/2847' },
      { id: 'fav-2', label: 'Asset Performance Report', url: '/eam/reports/performance' },
    ],
  },
],
```

---

## Multi-Suite Projects

For projects spanning multiple OpenGov suites, create separate layout + config per suite:

```
src/
├── config/
│   ├── eamNavConfig.ts
│   ├── procurementNavConfig.ts
│   └── financialsNavConfig.ts
├── layouts/
│   ├── EAMLayout.tsx
│   ├── ProcurementLayout.tsx
│   └── FinancialsLayout.tsx
```

Each suite gets its own:
- Navigation config with suite-specific menu items
- Route group with the suite's layout wrapper
- URL prefix (e.g., `/eam/`, `/procurement/`, `/financials/`)
