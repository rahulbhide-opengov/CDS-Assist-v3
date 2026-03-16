# Data Tables & Filtering — CDS Reference

Read this file when the design involves tables, data grids, list views, filtering, sorting, bulk actions, or paginated data.

**Trigger keywords:** table, data grid, list view, filter, sort, column, bulk action, pagination, export, row, cell, search results

---

## Table Anatomy

```
Paper (elevation: card)
├── Toolbar
│   ├── Stack direction="row" spacing={2} alignItems="center"
│   │   ├── Typography variant="h5": "Items"           → text.primary
│   │   ├── Chip size="small": "142 results"            → secondary
│   │   └── Spacer (flexGrow: 1)
│   ├── Search: TextField size="small" with SearchIcon
│   ├── Filter controls (see Filtering section)
│   └── Actions: [export button, create button]
├── Active Filters Bar (conditional)
│   └── Stack direction="row" spacing={1} flexWrap="wrap"
│       ├── Chip: "Status: Active" onDelete={clear}
│       ├── Chip: "Date: Last 30 days" onDelete={clear}
│       └── Button variant="text" size="small": "Clear all"
├── Table
│   ├── TableHead
│   │   └── TableRow
│   │       ├── TableCell padding="checkbox": Checkbox (select all)
│   │       ├── TableCell: "Name" + SortIndicator
│   │       ├── TableCell: "Status"
│   │       ├── TableCell align="right": "Amount"
│   │       └── TableCell: "Actions"
│   ├── TableBody
│   │   └── TableRow (hover highlight, click to navigate)
│   │       ├── TableCell: Checkbox
│   │       ├── TableCell: text or link
│   │       ├── TableCell: Chip (status)
│   │       ├── TableCell align="right": formatted number
│   │       └── TableCell: IconButton menu
│   └── TableFooter (optional)
│       └── Summary row or totals
├── Bulk Action Bar (conditional, appears on selection)
│   └── Stack direction="row" spacing={2} alignItems="center"
│       ├── Typography: "3 selected"
│       ├── Button: "Export"
│       ├── Button: "Assign"
│       └── Button color="error": "Delete"
└── Pagination
    └── TablePagination: rows per page [10, 25, 50] + page nav
```

---

## Column Types

| Type | Alignment | Format | Example |
|------|-----------|--------|---------|
| Text | Left | As-is | "John Smith" |
| Numeric | Right | Formatted with locale | "1,234.56" |
| Currency | Right | Currency symbol + formatted | "$12,345.00" |
| Date | Left | Consistent format (MMM DD, YYYY) | "Mar 12, 2026" |
| Date-time | Left | Date + time | "Mar 12, 2026 2:30 PM" |
| Status | Left | Chip with semantic color | Chip: "Active" (success) |
| Boolean | Center | Icon (CheckCircle / Cancel) | Check icon or dash |
| Actions | Right | IconButton or overflow menu | MoreVert icon |
| ID/Code | Left | Monospace font optional | "PRQ-2847" |

### Column width rules

- Name/title columns: `flexGrow: 1` (fills remaining space)
- Status columns: fixed 120px
- Date columns: fixed 140px (160px for date-time)
- Numeric columns: fixed 120px
- Action columns: fixed 60px (single icon) or 100px (multiple)
- Checkbox column: fixed 48px

---

## Filtering Patterns

### When to use which pattern

| Scenario | Pattern | Implementation |
|----------|---------|---------------|
| 1-3 filters, simple values | Inline filter bar | Dropdowns in toolbar |
| 4-8 filters | Filter panel (collapsible) | Drawer or expandable section above table |
| Complex/nested filters | Filter modal | Dialog with form sections |
| User-saved filter sets | Saved filters dropdown | Persisted presets in dropdown |

### Filter bar (default for most tables)

```
Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap"
├── Select size="small" label="Status": [All, Active, Inactive, Pending]
├── Select size="small" label="Department": [All, Finance, HR, ...]
├── DateRangePicker size="small" label="Date range"
└── Button variant="text" size="small": "More filters" (opens panel)
```

### Active filter chips

Always show active filters as removable chips below the toolbar so users see what's filtering the data:

```
Stack direction="row" spacing={1} py={1} flexWrap="wrap"
├── Chip variant="outlined" size="small" onDelete: "Status: Active"
├── Chip variant="outlined" size="small" onDelete: "Dept: Finance"
└── Button variant="text" size="small": "Clear all filters"
```

---

## Sort Behavior

- Default: single column sort, indicated by arrow icon in header
- Click header to cycle: unsorted → ascending → descending → unsorted
- Active sort column: header text in `primary.main`, arrow icon visible
- Inactive sortable columns: show arrow on hover only
- Multi-column sort: hold Shift + click (power user feature, not default)

---

## Selection & Bulk Actions

### Selection rules

- Checkbox column is always the first column
- "Select all" checkbox in header: selects current page only (not all pages)
- Indeterminate state when some rows selected
- Selection count shown in bulk action bar: "3 of 142 selected"
- Selection persists across pagination (if technically feasible)

### Bulk action bar

Appears as a sticky bar above or below the table when >= 1 row selected:

| Element | Token |
|---------|-------|
| Bar background | `primary.50` (subtle blurple tint) |
| Selection count | `text.primary`, variant: `body1` |
| Action buttons | Standard CDS button variants |
| Destructive actions | `color="error"` — always require confirmation dialog |

---

## Pagination vs Infinite Scroll

| Criteria | Pagination | Infinite Scroll |
|----------|-----------|----------------|
| Data size | Any | < 500 items total |
| User intent | Browse, compare pages | Scan/skim quickly |
| Deep linking | URL preserves page number | Cannot deep-link to position |
| Accessibility | Better (clear boundaries) | Worse (no landmarks) |
| CDS recommendation | **Default choice** | Only for feeds/timelines |

### Pagination rules

- Default rows per page: 25
- Options: [10, 25, 50]
- Show "1-25 of 142" format
- Use MUI `TablePagination` component

---

## Performance

| Row count | Strategy |
|-----------|---------|
| < 100 | Standard table rendering |
| 100-500 | Consider pagination (25 per page) |
| 500-5000 | Pagination required, consider virtual scrolling for smooth UX |
| > 5000 | Server-side pagination + virtual scrolling, skeleton row loading |

### Skeleton loading

- Show 5 skeleton rows matching column widths while loading
- Use `Skeleton variant="text"` inside each cell
- Header renders immediately (not skeleton)
- Maintain column widths between loading and loaded states

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (1440) | Full table with all columns visible |
| Tablet (768) | Hide low-priority columns (use `display: { xs: 'none', md: 'table-cell' }`). Keep: name, status, primary metric, actions. |
| Mobile (390) | Two options below |

### Mobile option A: Horizontal scroll

Wrap table in a scrollable container. Pin the first column (name). Show scroll hint shadow on the right edge.

### Mobile option B: Card view

Transform each row into a stacked card:

```
Paper (elevation: card, p={2}, mb={1})
├── Stack direction="row" justifyContent="space-between"
│   ├── Typography variant="subtitle2": row title
│   └── Chip size="small": status
├── Stack direction="row" spacing={2} mt={1}
│   ├── Typography variant="caption" color="text.secondary": "Amount"
│   ├── Typography variant="body2": "$1,234.00"
│   ├── Typography variant="caption" color="text.secondary": "Date"
│   └── Typography variant="body2": "Mar 12, 2026"
└── Stack direction="row" justifyContent="flex-end" mt={1}
    └── IconButton size="small": MoreVert
```

Use card view when the table has > 4 columns at mobile width.

---

## Token Usage

| Element | Token |
|---------|-------|
| Table container | `background.paper`, elevation: `card` |
| Header row background | `grey.50` |
| Header text | `text.primary`, variant: `subtitle2` (14px/500) |
| Body text | `text.primary`, variant: `body2` (12px/400) |
| Row hover | `action.hover` (grey.100) |
| Row selected | `primary.50` |
| Row divider | `divider` token |
| Pagination text | `text.secondary`, variant: `caption` |
| Empty state | `text.secondary`, centered with illustration |

---

## Empty & Error States

| State | Display |
|-------|---------|
| Empty (no data exists) | Illustration + "No [items] yet" + primary CTA: "Create first [item]" |
| Empty (filters exclude all) | "No results match your filters" + "Clear filters" button |
| Error loading | Alert severity="error": "Could not load [items]. Please try again." + Retry button |
| Loading | 5 skeleton rows |
| Partial error | Show loaded rows + banner: "Some data could not be loaded" |
