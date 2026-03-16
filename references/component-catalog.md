# CDS Component Catalog

Complete catalog of all CDS Design System components. Source: CDS Design System v3.0.0.

## Component Selection Priority

1. **CDS components** → always first choice
2. **MUI components + CDS theme** → when no CDS equivalent exists
3. **Custom components + CDS tokens** → last resort

## Buttons (6 components)

### Button
Primary interactive element. Supports all semantic colors.

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `primary`, `secondary`, `tertiary` (CDS-first) / `contained`, `outlined`, `text` (MUI) | `primary` |
| `color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `inherit` | `primary` |
| `size` | `small` (28px), `medium` (32px), `large` (40px) | `medium` |
| `loading` | `boolean` | `false` |
| `leftIcon` / `rightIcon` | React node | — |
| `disabled` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

**States:** default, hover, active, focus (2px outline), disabled (60% opacity), loading (spinner)

### IconButton
Icon-only button. MUST always have `aria-label`.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `inherit` |
| `size` | `small`, `medium`, `large` |

### FAB (Floating Action Button)
Primary page action. Positioned fixed bottom-right.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error` |
| `size` | `small` (32px), `medium` (40px), `large` (50px) |
| `variant` | `circular`, `extended` |

### ButtonGroup
Groups related buttons.

### ToggleButton / ToggleButtonGroup
Multi-select or exclusive selection. Must have `aria-label`.

### LoadingButton
Button with built-in loading indicator.

## Forms (17 components)

### TextField
Text input with label, helper text, and validation states.

| Prop | Values |
|------|--------|
| `size` | `small` (28px), `medium` (32px) |
| `state` | `default`, `error`, `success` |
| `readOnly` | `boolean` |
| `helperText` | `string` |
| `label` | `string` |
| `fullWidth` | `boolean` |
| `multiline` | `boolean` |
| `rows` | `number` |

**States:** default, hover (border darkens), focus (primary border + ring), error (red border + helper), success (green border), disabled (grey bg), read-only (purple-tinted bg)

### Checkbox
Checkmark toggle. Wrap in `FormControlLabel` for label.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error` |
| `size` | `small`, `medium` |
| `checked` | `boolean` |
| `indeterminate` | `boolean` |

### Radio / RadioGroup
Single selection from a group.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error` |
| `size` | `small`, `medium` |

### Switch
On/off toggle.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error`, `success` |
| `size` | `small`, `medium` |

### Select
Dropdown selection.

| Prop | Values |
|------|--------|
| `size` | `small`, `medium` |
| `multiple` | `boolean` |
| `native` | `boolean` |

### Slider
Range input.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary` |
| `size` | `small`, `medium` |
| `marks` | `boolean` or `array` |
| `valueLabelDisplay` | `auto`, `on`, `off` |

### Rating
Star rating.

| Prop | Values |
|------|--------|
| `size` | `small`, `medium`, `large` |
| `precision` | `0.5`, `1` |
| `readOnly` | `boolean` |

### Autocomplete
Searchable dropdown with type-ahead.

| Prop | Values |
|------|--------|
| `size` | `small`, `medium` |
| `multiple` | `boolean` |
| `freeSolo` | `boolean` |

### TransferList
Dual-list selector for moving items between lists.

### FormControl, FormLabel, FormControlLabel, FormHelperText, FormGroup, InputLabel, OutlinedInput
Form infrastructure components for building complex form layouts.

## Layout (15 components)

### Container
Max-width content wrapper.

| Prop | Values |
|------|--------|
| `maxWidth` | `xs`, `sm`, `md`, `lg`, `xl`, `false` |
| `fixed` | `boolean` |

### Box
Generic layout container. The `sx` prop escape hatch.

### Stack
One-dimensional layout (row or column).

| Prop | Values |
|------|--------|
| `direction` | `row`, `column`, `row-reverse`, `column-reverse` |
| `spacing` | Number (theme.spacing multiplier) |
| `alignItems` | Standard flex values |

### Grid
Two-dimensional responsive grid.

| Prop | Values |
|------|--------|
| `container` | `boolean` |
| `item` | `boolean` |
| `xs`, `sm`, `md`, `lg`, `xl` | 1-12 |
| `spacing` | Number |

### Paper
Elevated surface.

| Prop | Values |
|------|--------|
| `elevation` | CDS: `none`, `low`, `medium`, `high` / MUI: 0-24 |

### Card (+ CardHeader, CardContent, CardActions, CardMedia)
Content container with optional header, body, actions, and media.

### Section
Named section wrapper.

### PageContainer
Max-width page content wrapper.

### Divider
Visual separator.

| Prop | Values |
|------|--------|
| `orientation` | `horizontal`, `vertical` |
| `variant` | `fullWidth`, `inset`, `middle` |

### Link
Styled anchor element.

| Prop | Values |
|------|--------|
| `variant` | Typography variants |
| `color` | Palette colors |
| `underline` | `always`, `hover`, `none` |

## Navigation (15 components)

### AppBar
Top navigation bar / header.

| Prop | Values |
|------|--------|
| `position` | `fixed`, `absolute`, `sticky`, `static`, `relative` |
| `color` | `default`, `primary`, `secondary`, `transparent`, `inherit` |
| `elevation` | 0-24 |

Height: 56px (mobile), 64px (desktop). Use with `Toolbar` inside.

### Drawer
Side navigation panel.

| Prop | Values |
|------|--------|
| `variant` | `permanent`, `persistent`, `temporary` |
| `anchor` | `left`, `right`, `top`, `bottom` |
| `width` | Number (default 240px) |

### BottomNavigation (+ BottomNavigationAction)
Mobile tab bar at bottom of screen. Fixed position, 56px height.

### Tabs / Tab
Tabbed navigation. Horizontal or vertical.

| Prop | Values |
|------|--------|
| `orientation` | `horizontal`, `vertical` |
| `scrollable` | `boolean` |
| `centered` | `boolean` |
| `indicatorColor` | `primary`, `secondary` |

### NavLink
Navigation link with active state.

| Prop | Values |
|------|--------|
| `active` | `boolean` |

### Menu / MenuItem
Dropdown menu triggered by button or icon.

### Pagination
Page navigation for data lists.

| Prop | Values |
|------|--------|
| `count` | Number of pages |
| `shape` | `circular`, `rounded` |
| `variant` | `text`, `outlined` |

### SpeedDial / SpeedDialAction
Quick action FAB with expanding options.

### TreeView / TreeItem
Hierarchical tree navigation (uses `@mui/x-tree-view`).

### Stepper (+ Step, StepLabel, StepContent)
Multi-step process indicator.

| Prop | Values |
|------|--------|
| `orientation` | `horizontal`, `vertical` |
| `activeStep` | Number |
| `alternativeLabel` | `boolean` |

## Data Display (17 components)

### Typography
Text rendering with CDS type scale.

| Prop | Values |
|------|--------|
| `variant` | `h1`-`h6`, `subtitle1`, `subtitle2`, `body1`, `body2`, `caption`, `overline`, `button` |
| `color` | `text.primary`, `text.secondary`, `primary`, `error`, etc. |

NEVER manually set fontSize, fontWeight, or fontFamily — use `variant` prop.

### Avatar / AvatarGroup
User representation. Sizes: 24px, 40px, 56px.

### Badge
Notification indicator on icons or avatars.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` |
| `variant` | `standard`, `dot` |
| `max` | Number |

### Chip
Compact element for tags, filters, selections.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` |
| `size` | `small` (28px), `medium` (32px) |
| `variant` | `filled`, `outlined` |
| `onDelete` | Function (shows delete icon) |

### Tooltip
Information popup on hover/focus.

| Prop | Values |
|------|--------|
| `placement` | `top`, `bottom`, `left`, `right` + corners |

### List (+ ListItem, ListItemButton, ListItemIcon, ListItemText, ListItemAvatar)
Vertical list of items. Use ListItemButton for clickable rows.

### Table (+ TableHead, TableBody, TableRow, TableCell)
Data table.

| TableCell Prop | Values |
|------|--------|
| `align` | `left`, `center`, `right` |
| `padding` | `normal`, `checkbox`, `none` |

### ImageList / ImageListItem
Grid of images.

### Accordion (+ AccordionSummary, AccordionDetails)
Expandable content sections.

## Feedback (10 components)

### Alert
Status message banner.

| Prop | Values |
|------|--------|
| `severity` | `error`, `warning`, `info`, `success` |
| `variant` | `standard`, `filled`, `outlined` |

All 3 variants x 4 severities are themed — just set props.

### Snackbar
Temporary notification at screen edge.

| Prop | Values |
|------|--------|
| `anchorOrigin` | `{ vertical, horizontal }` |
| `autoHideDuration` | Number (ms) |

### Dialog (+ DialogTitle, DialogContent, DialogActions)
Modal dialog.

| Prop | Values |
|------|--------|
| `maxWidth` | `xs`, `sm`, `md`, `lg`, `xl` |
| `fullScreen` | `boolean` |
| `fullWidth` | `boolean` |

### CircularProgress / LinearProgress
Loading indicators.

| Prop | Values |
|------|--------|
| `color` | `primary`, `secondary`, `error`, etc. |
| `variant` | `determinate`, `indeterminate` |

### Skeleton
Content placeholder during loading.

| Prop | Values |
|------|--------|
| `variant` | `text`, `circular`, `rectangular`, `rounded` |

### Backdrop
Overlay behind modals/drawers.

## Utility (10 components)

### Popover
Anchored overlay panel.

### Collapse
Expand/collapse animation wrapper.

### Modal
Low-level modal overlay (prefer Dialog for most cases).

### ClickAwayListener
Detects clicks outside a component.

### Fade / Grow / Slide / Zoom
Transition animations.

### Portal
Renders children outside parent DOM tree.

### FileUpload
File selection with drag-and-drop, validation, and progress.

| Prop | Values |
|------|--------|
| `accept` | File types |
| `maxSize` | Bytes |
| `multiple` | `boolean` |

## Branding (3 components)

### Logo
OpenGov logo component.

| Prop | Values |
|------|--------|
| `variant` | `fullcolor`, `blurple`, `black`, `white`, `gray`, `reverse` |
| `size` | `small`, `medium`, `large` |

### OpenGovLogo
Full OpenGov wordmark logo.

### OpenGovWand
OpenGov wand icon (tri-colored or monochrome).

| Prop | Values |
|------|--------|
| `variant` | `tricolored`, `blurple`, `black`, `white`, `gray` |
| `size` | `small`, `medium`, `large` |

## MUI Re-exports

These MUI components are re-exported through CDS with theme applied:

- `Typography`, `Toolbar`, `CssBaseline`
- `FormControl`, `FormControlLabel`, `FormHelperText`, `FormGroup`
- `InputAdornment`, `InputLabel`
- `BottomNavigationAction`, `Breadcrumbs`
- `styled`, `ThemeProvider`
- All `@mui/icons-material` icons (Outlined + Filled styles only)

## Icon Policy

- **Allowed**: Outlined (primary style), Filled (secondary style)
- **Forbidden**: Rounded, TwoTone, Sharp
- Use CDS semantic colors only for icon colors
- Decorative icons: `aria-hidden="true"`
- Functional icons (in IconButton): `aria-label` required
- Sizes: small (20px), medium (24px), large (32px)
