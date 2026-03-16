# Mobile & Tablet Adaptation — CDS Reference

Read this file when designing for mobile (390px) or tablet (768px) breakpoints, or when adapting a desktop design to smaller screens.

**Trigger keywords:** mobile, tablet, responsive, touch, small screen, bottom sheet, native, swipe, breakpoint, adaptive

---

## CRITICAL: Content Parity Rule

When creating responsive breakpoints, **NEVER drop, truncate, or omit content** for smaller screens. Every tablet and mobile version MUST show the same data as the desktop:
- Same number of KPI cards
- Same number of table rows / list items (transform to cards if needed, but keep all rows)
- Same chart sections (simplify the visualization if needed, but include the section)
- Same sidebar/panel content (stack vertically instead of side-by-side)
- Same Global Navigation at the top of every screen

Only the **layout** adapts — not the **content**. Columns become stacks, tables become cards, side panels move below — but nothing gets removed.

---

## CDS Breakpoints

| Name | Width | Columns | Margins | Gutter |
|------|-------|---------|---------|--------|
| Mobile | 390px | 4 | 16px | 16px |
| Tablet | 768px | 8 | 24px | 24px |
| Desktop | 1440px | 12 | 32px | 24px |

Use MUI `Grid` with responsive props: `xs` (mobile), `sm` (tablet), `md`/`lg` (desktop).

---

## Touch Target Minimums

| Target type | Mobile | Tablet | Desktop |
|------------|--------|--------|---------|
| Buttons | 48px height | 44px height | 36px (CDS small) |
| Icon buttons | 48 × 48px | 44 × 44px | 40 × 40px |
| List items | 48px row height | 44px row height | 36px row height |
| Checkboxes / Radios | 48 × 48px hit area | 44 × 44px hit area | 24px visual + padding |
| Links in text | 48px line height | 44px line height | Default line height |

### Spacing between touch targets

- Minimum 8px gap between adjacent tap targets on mobile
- Never place two small actions (icon buttons) side-by-side without at least 8px gap
- CDS `spacing(2)` = 8px — use this as the minimum gap

Cross-reference: `references/accessibility.md` for WCAG 2.1 touch target guidance.

---

## Navigation Adaptation

### Desktop → Mobile transformation rules

| Desktop pattern | Tablet | Mobile |
|----------------|--------|--------|
| Sidebar navigation (persistent) | Collapsible drawer (hamburger) | Hamburger → full-screen overlay drawer |
| Horizontal tabs (> 4 tabs) | Scrollable tabs | Bottom navigation (max 5 items) or scrollable tabs |
| Horizontal tabs (≤ 4 tabs) | Same | Same (if space allows) or bottom nav |
| Breadcrumbs | Same | Show only current + parent, collapse middle levels |
| Top action bar with multiple buttons | Same | Primary action visible, secondary in overflow menu (MoreVert) |
| Page-level filter bar | Same | "Filters" button → bottom sheet filter panel |

### Bottom navigation

When converting to bottom navigation on mobile:

```
BottomNavigation
  sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1100 }}
  showLabels
├── BottomNavigationAction label="Home" icon={<Home />}
├── BottomNavigationAction label="Search" icon={<Search />}
├── BottomNavigationAction label="Create" icon={<Add />}
├── BottomNavigationAction label="Alerts" icon={<Notifications />}     (with Badge)
└── BottomNavigationAction label="Menu" icon={<Menu />}
```

Rules:
- Max 5 items in bottom nav
- Always show labels (no icon-only bottom nav)
- Add `spacing(7)` (56px) bottom padding to page content to avoid overlap
- Use `primary.main` for active item, `text.secondary` for inactive

---

## Form Adaptation

| Desktop | Mobile |
|---------|--------|
| Two-column form layout | Single-column, full-width inputs |
| Side-by-side fields (first + last name) | Stacked vertically |
| Inline labels | Floating labels (MUI default) |
| Submit button at bottom-right | Full-width sticky button at bottom |
| Date pickers (calendar popover) | Native date input (`type="date"`) on mobile |

### Mobile form pattern

```
Stack spacing={3} px={2} pb={10}  ← bottom padding for sticky button
├── TextField fullWidth label="First name"
├── TextField fullWidth label="Last name"
├── TextField fullWidth label="Email" type="email"
├── Select fullWidth label="Department"
└── Sticky bottom bar
    Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}
    └── Button fullWidth variant="contained": "Submit application"
```

### Input types for mobile

Always set the correct `type` to trigger the right mobile keyboard:

| Field | Input type | Keyboard |
|-------|-----------|----------|
| Email | `type="email"` | @ and .com visible |
| Phone | `type="tel"` | Numeric pad |
| Number | `inputMode="numeric"` | Numeric pad (no spinner) |
| URL | `type="url"` | / and .com visible |
| Search | `type="search"` | Shows "Search" on submit key |
| Password | `type="password"` | Auto masked |

### Prevent auto-zoom on iOS

If input font size is < 16px, iOS Safari zooms in on focus. Fix: ensure mobile input font size is at least 16px:

```tsx
<TextField
  sx={{ '& input': { fontSize: { xs: '16px', md: '14px' } } }}
/>
```

---

## Table → Card Transformation

When a data table has > 4 columns, transform to cards on mobile.

### Decision matrix

| Columns | Mobile strategy |
|---------|----------------|
| 1-3 | Keep as table, full-width |
| 4-5 | Horizontal scroll with pinned first column |
| 6+ | Card view |

### Card view pattern

Each table row becomes a card:

```
Paper sx={{ p: 2, mb: 1 }}
├── Stack direction="row" justifyContent="space-between" alignItems="center"
│   ├── Typography variant="subtitle2": primary field (name/title)
│   └── Chip size="small": status
├── Grid container spacing={1} mt={1}
│   ├── Grid item xs={6}
│   │   ├── Typography variant="caption" color="text.secondary": "Amount"
│   │   └── Typography variant="body2": "$1,234.00"
│   ├── Grid item xs={6}
│   │   ├── Typography variant="caption" color="text.secondary": "Date"
│   │   └── Typography variant="body2": "Mar 12, 2026"
│   └── ... (additional field pairs)
└── Stack direction="row" justifyContent="flex-end" mt={1}
    ├── IconButton size="small": Edit
    └── IconButton size="small": MoreVert
```

### Priority columns

When using horizontal scroll, decide which columns to show first:

1. **Always visible**: item name/title, status, primary action
2. **Priority 2**: date, key metric
3. **Priority 3**: secondary fields, ID, category
4. **Hidden on mobile**: audit fields (created by, modified date), low-value metadata

---

## Bottom Sheets vs Modals vs Full-Screen

| Content | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Simple confirmation | Dialog (small) | Dialog (small) | Dialog (small) |
| Form (3-5 fields) | Dialog (medium) | Dialog (medium) | Full-screen dialog |
| Form (6+ fields) | Dialog (large) or page | Full-screen dialog | Full-screen dialog |
| Filter panel | Inline/sidebar | Bottom sheet | Bottom sheet |
| Action menu (3-5 items) | Menu (popover) | Menu (popover) | Bottom sheet |
| Detail preview | Side panel (drawer) | Bottom sheet | Full-screen |
| Date/time picker | Popover | Popover | Bottom sheet or native |

### Bottom sheet implementation

```
Drawer
  anchor="bottom"
  PaperProps={{
    sx: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      maxHeight: '80vh',
    }
  }}
├── Box sx={{ width: 32, height: 4, bgcolor: 'grey.300', borderRadius: 2, mx: 'auto', my: 1.5 }}
│   ← drag handle indicator
├── Typography variant="h6" px={2}: "Filters"
├── Divider
├── Content area (scrollable)
└── Sticky bottom actions
    Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
    └── Stack direction="row" spacing={2}
        ├── Button fullWidth variant="outlined": "Reset"
        └── Button fullWidth variant="contained": "Apply filters"
```

### Full-screen dialog pattern (mobile)

```
Dialog fullScreen (only on xs breakpoint)
├── AppBar position="sticky" color="default" elevation={0}
│   ├── IconButton edge="start": Close (X icon)
│   ├── Typography variant="h6" flexGrow={1}: "Edit [item]"
│   └── Button color="primary": "Save"
├── DialogContent
│   └── Form fields (full-width, single column)
└── (no DialogActions — save button is in the AppBar)
```

Use `useMediaQuery` to conditionally switch between dialog and fullScreen:

```tsx
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
<Dialog fullScreen={isMobile} ... />
```

---

## Swipe Gestures

Use sparingly — swipe is invisible UI and requires discovery.

| Gesture | Use case | Implementation |
|---------|----------|---------------|
| Swipe left on list item | Reveal quick actions (delete, archive) | Custom or MUI SwipeableDrawer |
| Swipe down to dismiss | Bottom sheets, notifications | Native Drawer behavior |
| Swipe between tabs | Tab navigation | MUI Tabs with SwipeableViews |
| Pull to refresh | Data lists, feeds | Custom implementation, show spinner |

### Rules

- Never make swipe the only way to access an action — always provide a visible alternative
- Show a visual hint on first use (subtle animation or tooltip)
- Destructive swipe actions (delete): require confirmation or offer undo (Snackbar with "Undo" action, 5 seconds)

---

## Responsive Spacing

CDS spacing adapts at breakpoints:

| Desktop | Tablet | Mobile | Usage |
|---------|--------|--------|-------|
| `spacing(4)` (32px) | `spacing(3)` (24px) | `spacing(2)` (16px) | Page padding |
| `spacing(3)` (24px) | `spacing(3)` (24px) | `spacing(2)` (16px) | Section gaps |
| `spacing(3)` (24px) | `spacing(2)` (16px) | `spacing(2)` (16px) | Card padding |
| `spacing(2)` (16px) | `spacing(2)` (16px) | `spacing(1)` (8px) | Element spacing within cards |

Use responsive syntax:

```tsx
sx={{ p: { xs: 2, sm: 3, md: 4 } }}
```

---

## Common Responsive Patterns

### Content priority on mobile

Not everything visible on desktop needs to be visible on mobile. Apply progressive disclosure:

| Priority | Mobile behavior |
|----------|----------------|
| Primary content (title, key value, status) | Always visible |
| Secondary content (description, metadata) | Truncated or hidden behind "Show more" |
| Tertiary content (audit trail, tags) | Hidden, accessible via detail view |
| Actions | Primary action visible, secondary in overflow |

### Image handling

| Desktop | Mobile |
|---------|--------|
| Fixed aspect ratio | Same ratio, fluid width |
| Image gallery (grid) | Single column or horizontal scroll |
| Background images | Use CSS object-fit: cover; reduce height |
| Decorative illustrations | Hidden on mobile (`display: { xs: 'none', md: 'block' }`) |

---

## Accessibility on Mobile

- All touch targets ≥ 48px (WCAG 2.5.8)
- Support both portrait and landscape (`@media (orientation: ...)`)
- Don't disable pinch-to-zoom: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Ensure focus is visible on all interactive elements (even though most mobile users don't use keyboard, some use assistive devices)
- Bottom-anchored elements must not overlap content — add equivalent bottom padding
- Test with VoiceOver (iOS) and TalkBack (Android) for screen reader compatibility
