# CDS Page Patterns

Complete templates for the four standard CDS page patterns. Each pattern includes a component tree, token usage, and responsive behavior.

## Pattern 1: Dashboard

**Trigger keywords:** dashboard, metrics, overview, analytics, home, summary

### Component Tree

```
Layout Wrapper (suite-specific layout)
└── Page
    ├── PageHeaderComposable
    │   ├── Title: "Dashboard"
    │   ├── Description: "Overview of key metrics"
    │   └── Actions: [date range picker, export button]
    │
    ├── Metric Cards Section
    │   ├── Grid (responsive: xs=12, sm=6, md=3)
    │   │   ├── MetricCard: Paper
    │   │   │   ├── Typography caption: metric label
    │   │   │   ├── Typography h3: metric value
    │   │   │   └── Chip: trend indicator (+/-)
    │   │   ├── MetricCard (repeat 3-4 cards)
    │   │   └── ...
    │
    ├── Charts Section
    │   ├── Grid (xs=12, md=8): Primary chart (Paper)
    │   │   ├── Typography h5: chart title
    │   │   └── Chart area (300px min-height)
    │   └── Grid (xs=12, md=4): Secondary chart (Paper)
    │       ├── Typography h5: chart title
    │       └── Chart area
    │
    ├── Recent Items Section
    │   ├── Paper
    │   │   ├── Typography h5: "Recent [Items]"
    │   │   └── List
    │   │       ├── ListItemButton → navigates to detail
    │   │       │   ├── ListItemText primary: item title
    │   │       │   └── ListItemText secondary: status/date
    │   │       └── ... (5-10 items)
    │
    └── Status Distribution Section (optional)
        ├── Paper
        │   ├── Typography h5: "Status Overview"
        │   └── Chip group or chart showing status breakdown
```

### Token Usage

| Element | Token |
|---------|-------|
| Page background | `background.default` |
| Metric cards | `background.paper`, elevation: `card` |
| Metric labels | `text.secondary`, variant: `caption` |
| Metric values | `text.primary`, variant: `h3` |
| Positive trend | `success.main` |
| Negative trend | `error.main` |
| Section headings | `text.primary`, variant: `h5` |
| Card padding | `spacing(3)` (12px) |
| Section gap | `spacing(3)` (12px) |
| Card gap | `spacing(2)` (8px) |

### Responsive Behavior

| Breakpoint | Metric cards | Charts | Layout |
|------------|-------------|--------|--------|
| Desktop (1440) | 4 columns | Side by side | Full width content |
| Tablet (768) | 2 columns | Stacked | Reduced padding |
| Mobile (390) | 1 column | Stacked, full width | Minimal padding, 48px touch targets |

### States

- **Loading:** Skeleton cards (4 rectangular), skeleton chart, skeleton list (5 items)
- **Error:** Alert severity="error" with retry button
- **Empty:** Illustration + "No data yet" + CTA button
- **Success:** All sections populated

---

## Pattern 2: List View

**Trigger keywords:** list, table, grid, search, index, browse, manage

### Component Tree

```
Layout Wrapper
└── Page
    ├── PageHeaderComposable
    │   ├── Title: "[Resource] List"
    │   ├── Description: "Manage all [resources]"
    │   └── Actions: [Button "Create New"]
    │
    ├── Toolbar Section
    │   ├── Stack direction="row" spacing={2}
    │   │   ├── TextField: search input (startAdornment: SearchIcon)
    │   │   ├── Select or Button: filter dropdown
    │   │   └── ToggleButtonGroup: view toggle (list/grid) — optional
    │
    ├── Active Filters (conditional)
    │   ├── Stack direction="row" spacing={1} flexWrap="wrap"
    │   │   ├── Chip: active filter (with onDelete)
    │   │   ├── Chip: active filter
    │   │   └── Button text: "Clear all"
    │
    ├── Data Section
    │   │   Option A: Table (data-dense)
    │   │   ├── Table with TableHead + TableBody
    │   │   │   ├── TableRow (hover highlight)
    │   │   │   │   ├── TableCell: ID/name (clickable → detail)
    │   │   │   │   ├── TableCell: status (Chip)
    │   │   │   │   ├── TableCell: date
    │   │   │   │   └── TableCell: actions (IconButtons)
    │   │
    │   │   Option B: Card Grid (visual)
    │   │   ├── Grid container spacing={2}
    │   │   │   ├── Grid item (xs=12, sm=6, md=4)
    │   │   │   │   └── Card (clickable → detail)
    │   │   │   │       ├── CardContent
    │   │   │   │       │   ├── Typography h6: title
    │   │   │   │       │   ├── Chip: status
    │   │   │   │       │   └── Typography body2: description
    │   │   │   │       └── CardActions
    │   │   │   │           └── IconButton: more options
    │
    └── Pagination
        ├── Pagination component (bottom of list)
        └── Typography caption: "Showing X-Y of Z results"
```

### Token Usage

| Element | Token |
|---------|-------|
| Search field | `size="small"` (28px), `background.paper` |
| Filter chips | `color="primary"`, `size="small"` |
| Table header | `text.secondary`, `caption` weight, `grey.100` bg |
| Table row hover | `primary.50` or `rgba(0,0,0,0.04)` |
| Status chips | Semantic color matching status (success/warning/error/info) |
| Clickable row | cursor: pointer, hover elevation change |
| Toolbar gap | `spacing(2)` |
| Content padding | `spacing(3)` to `spacing(4)` |

### Responsive Behavior

| Breakpoint | Search | Table/Grid | Pagination |
|------------|--------|------------|------------|
| Desktop | Fixed width (320px) | Full table with all columns | Standard |
| Tablet | Full width | Hide less important columns | Standard |
| Mobile | Full width | Card layout (stack) | Simplified |

### States

- **Loading:** Skeleton table rows (5-10), skeleton search bar
- **Error:** Alert with retry
- **Empty (no data):** Illustration + "No [resources] yet" + "Create" CTA
- **Empty (no results):** "No results match your filters" + "Clear filters" button
- **Success:** Populated table/grid with pagination

---

## Pattern 3: Form

**Trigger keywords:** form, create, edit, save, new, add, register, submit

### Component Tree

```
Layout Wrapper
└── Page
    ├── PageHeaderComposable
    │   ├── Title: "New [Resource]" or "Edit [Resource]"
    │   ├── Breadcrumbs: Entity > Resources > New/Edit
    │   └── Actions: [Button outlined "Cancel", Button contained "Save"]
    │
    ├── Form Sections
    │   ├── Paper (section wrapper)
    │   │   ├── Typography h5: "Basic Information"
    │   │   ├── Grid container spacing={3}
    │   │   │   ├── Grid item xs=12 md=6
    │   │   │   │   └── TextField label="Name" required
    │   │   │   ├── Grid item xs=12 md=6
    │   │   │   │   └── Select label="Category"
    │   │   │   ├── Grid item xs=12
    │   │   │   │   └── TextField label="Description" multiline rows=3
    │   │   │   └── ...
    │   │
    │   ├── Paper (another section)
    │   │   ├── Typography h5: "Details"
    │   │   ├── Grid container spacing={3}
    │   │   │   ├── Grid item xs=12 md=4
    │   │   │   │   └── TextField label="Start Date" type="date"
    │   │   │   ├── Grid item xs=12 md=4
    │   │   │   │   └── Select label="Priority"
    │   │   │   └── ...
    │   │
    │   └── Paper (optional: attachments)
    │       ├── Typography h5: "Attachments"
    │       └── FileUpload accept=".pdf,.docx"
    │
    └── Bottom Actions (mobile only — duplicate of header actions)
        ├── Stack direction="row" spacing={2} justifyContent="flex-end"
        │   ├── Button outlined: "Cancel"
        │   └── Button contained: "Save"
```

### Token Usage

| Element | Token |
|---------|-------|
| Section paper | `background.paper`, elevation: `card`, padding: `spacing(3)` |
| Section heading | variant: `h5`, color: `text.primary` |
| Field labels | Handled by TextField component (12px caption weight) |
| Required indicator | `error.main` for asterisk |
| Error helper text | `error.main`, variant: `caption` |
| Section gap | `spacing(3)` |
| Field gap | `spacing(3)` in Grid |
| Cancel button | `variant="outlined"`, `color="inherit"` |
| Save button | `variant="contained"`, `color="primary"` |

### Form Behavior

- **Controlled inputs** — all fields use `value` + `onChange`
- **Validation** — on blur and on submit
- **isDirty tracking** — compare current values to initial values
- **Unsaved changes** — block navigation when dirty, show confirmation dialog
- **Error display** — field-level (helperText) and form-level (Alert at top)

### Responsive Behavior

| Breakpoint | Layout | Actions |
|------------|--------|---------|
| Desktop | 2-column grid per section | Header actions only |
| Tablet | 2-column, reduced padding | Header actions only |
| Mobile | Single column, full width | Header + bottom actions |

### States

- **Loading (edit mode):** Skeleton fields
- **Error (load fail):** Alert with retry
- **Saving:** Save button in loading state, fields disabled
- **Validation error:** Error helper text on invalid fields, scroll to first error
- **Success (save):** Navigate to detail or list, show success snackbar

---

## Pattern 4: Detail View

**Trigger keywords:** detail, view, show, display, read, inspect

### Component Tree

```
Layout Wrapper
└── Page
    ├── PageHeaderComposable
    │   ├── Title: "[Resource Name/ID]"
    │   ├── Breadcrumbs: Entity > Resources > [ID]
    │   └── Actions: [Button outlined "Edit", Button error "Delete"]
    │
    ├── Status Bar (optional)
    │   ├── Paper with Stack direction="row"
    │   │   ├── Chip: status indicator
    │   │   ├── Typography caption: "Created: [date]"
    │   │   └── Typography caption: "Last modified: [date]"
    │
    ├── Detail Sections
    │   ├── Paper
    │   │   ├── Typography h5: "Basic Information"
    │   │   ├── Grid container spacing={2}
    │   │   │   ├── DetailRow: label + value (2-column)
    │   │   │   │   ├── Typography caption color="text.secondary": "Name"
    │   │   │   │   └── Typography body1: "[value]"
    │   │   │   └── ... (repeat for each field)
    │   │
    │   ├── Paper
    │   │   ├── Typography h5: "Related Items"
    │   │   └── List or mini-Table of related resources
    │   │
    │   └── Paper (optional: activity/history)
    │       ├── Typography h5: "Activity"
    │       └── Timeline or List of events
    │
    └── Delete Confirmation Dialog
        ├── Dialog
        │   ├── DialogTitle: "Delete [Resource]?"
        │   ├── DialogContent: "This action cannot be undone."
        │   └── DialogActions
        │       ├── Button: "Cancel"
        │       └── Button color="error": "Delete"
```

### Token Usage

| Element | Token |
|---------|-------|
| Field labels | `text.secondary`, variant: `caption` |
| Field values | `text.primary`, variant: `body1` |
| Section paper | `background.paper`, elevation: `card` |
| Status chip | Semantic color matching status |
| Edit button | `variant="outlined"` |
| Delete button | `color="error"` |
| Metadata text | `text.secondary`, variant: `caption` |
| Detail row gap | `spacing(2)` |

### Responsive Behavior

| Breakpoint | Layout | Details grid |
|------------|--------|-------------|
| Desktop | Full width, 2-col details | 2 columns |
| Tablet | Full width, 2-col details | 2 columns |
| Mobile | Full width, single column | 1 column, stacked |

### States

- **Loading:** Skeleton layout matching detail sections
- **Error:** Alert with "Resource not found" or generic error + back button
- **Success:** Full detail view
- **Deleting:** Delete button loading, dialog shows spinner

---

## Pattern 5: Auth Page

**Trigger keywords:** login, signin, sign in, auth, authenticate, password

### Component Tree

```
Centered Layout (no nav wrapper)
├── Box (centered vertically and horizontally, min-height: 100vh)
│   ├── Paper (max-width: 400px)
│   │   ├── Logo (OpenGov logo, centered)
│   │   ├── Typography h4: "Sign In"
│   │   ├── Typography body2 color="text.secondary": subtitle
│   │   ├── Form
│   │   │   ├── TextField: email/username
│   │   │   ├── TextField: password (type="password")
│   │   │   ├── FormControlLabel + Checkbox: "Remember me"
│   │   │   └── Button fullWidth variant="contained": "Sign In"
│   │   └── Link: "Forgot password?"
```

---

## Pattern 6: Settings Page

**Trigger keywords:** settings, preferences, config, configuration, options

### Component Tree

```
Layout Wrapper
└── Page
    ├── PageHeaderComposable
    │   ├── Title: "Settings"
    │   └── Description: "Manage your preferences"
    │
    ├── Tabs (horizontal)
    │   ├── Tab: "General"
    │   ├── Tab: "Notifications"
    │   ├── Tab: "Security"
    │   └── Tab: "Integrations"
    │
    └── Tab Content (form-like sections per tab)
        ├── Paper
        │   ├── Typography h5: section title
        │   ├── Form fields for that section
        │   └── Button: "Save Changes"
```

---

## Composition Rules

1. Every page starts with a Layout wrapper (provides navigation)
2. Every page has a PageHeaderComposable (title, optional description, optional actions)
3. Content sections use Paper with consistent padding (`spacing(3)`)
4. Section headings use Typography variant `h5`
5. Fields within sections use Grid for responsive columns
6. All data-driven sections handle 4 states: loading, error, empty, success
7. Navigation between pages: row click (list→detail), breadcrumbs (back), buttons (create/edit)
