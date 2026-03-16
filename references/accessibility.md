# CDS Accessibility Reference — WCAG 2.1 Level AA

All CDS designs must comply with WCAG 2.1 Level AA. This reference covers the mandatory accessibility requirements for every design specification.

## Interactive Elements

### Buttons

| Rule | Requirement |
|------|-------------|
| Text buttons | Label must describe the action ("Save Changes", not "Click Here") |
| Icon-only buttons (IconButton) | MUST have `aria-label` describing the action |
| Disabled buttons | Must remain visible (60% opacity), include `aria-disabled="true"` |
| Loading buttons | Include `aria-busy="true"`, label changes to indicate loading |
| Button groups | Group container has `role="group"` and `aria-label` |

### Form Fields

| Rule | Requirement |
|------|-------------|
| Every field | MUST have an associated visible label (via `label` prop or `InputLabel`) |
| Required fields | Mark with asterisk (*) and include `aria-required="true"` |
| Error states | Error message linked via `aria-describedby` to the field |
| Helper text | Linked via `aria-describedby` |
| Field groups | Wrap in `FormGroup` or `fieldset` with `legend` |

### Select / Autocomplete

| Rule | Requirement |
|------|-------------|
| Dropdown | Must be keyboard navigable (arrow keys, enter, escape) |
| Label | Associated with the select control |
| Options | Each option must be readable by screen readers |

### Toggle Controls

| Rule | Requirement |
|------|-------------|
| Checkbox | Wrap in `FormControlLabel` for accessible label |
| Radio | Group with `RadioGroup` and `aria-label` on the group |
| Switch | Wrap in `FormControlLabel`, describe the on/off state |
| ToggleButtonGroup | MUST have `aria-label` describing the group purpose |

## Data Display

### Tables

| Rule | Requirement |
|------|-------------|
| Table element | `aria-label` describing table purpose |
| Header cells | Use `<th>` with `scope="col"` or `scope="row"` |
| Sortable columns | `aria-sort="ascending"`, `"descending"`, or `"none"` |
| Row actions | Action buttons must have descriptive `aria-label` including row context |
| Empty table | Announce "No data" to screen readers |

### Lists

| Rule | Requirement |
|------|-------------|
| Interactive list | Use `ListItemButton` for clickable items |
| Non-interactive list | Use `ListItem` |
| Item actions | Action buttons need `aria-label` with item context |

### Tooltips

| Rule | Requirement |
|------|-------------|
| Trigger | Must be keyboard focusable |
| Content | Must be readable by screen readers |
| Dismissal | Escape key dismisses tooltip |

## Navigation

### Page Structure

| Rule | Requirement |
|------|-------------|
| Landmarks | Use semantic HTML: `<header>`, `<main>`, `<nav>`, `<footer>` |
| Skip link | "Skip to main content" link (hidden until focused) as first element |
| Page title | Unique, descriptive `<title>` for each page |
| Heading hierarchy | h1 → h2 → h3 (never skip levels) |

### Navigation Components

| Rule | Requirement |
|------|-------------|
| AppBar | `role="banner"` (implicit in `<header>`) |
| Drawer | `role="navigation"`, `aria-label="Main navigation"` |
| Tabs | `role="tablist"` on Tabs, `role="tab"` on Tab, `aria-selected` for active |
| Breadcrumbs | `aria-label="Breadcrumb"` on the `<nav>` wrapper |
| Active nav item | `aria-current="page"` on the current page link |

### Keyboard Navigation

| Key | Expected Behavior |
|-----|-------------------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate button, submit form, select option |
| Space | Toggle checkbox/switch, select option |
| Escape | Close modal/drawer/dropdown, cancel action |
| Arrow keys | Navigate within tabs, menus, radio groups, tree views |
| Home/End | First/last item in lists, menus |

## Feedback Components

### Dialogs / Modals

| Rule | Requirement |
|------|-------------|
| Focus trap | Focus stays within dialog while open |
| Initial focus | First focusable element receives focus on open |
| Close | Escape key closes dialog |
| Return focus | Focus returns to trigger element on close |
| Labeling | `aria-labelledby` pointing to DialogTitle |

### Alerts

| Rule | Requirement |
|------|-------------|
| Live region | `role="alert"` for errors (assertive), `role="status"` for info (polite) |
| Persistence | Error alerts stay until user dismisses or fixes the issue |
| Actions | If alert has actions (retry, dismiss), they must be keyboard accessible |

### Snackbars

| Rule | Requirement |
|------|-------------|
| Announcement | `aria-live="polite"` for non-urgent, `"assertive"` for errors |
| Auto-dismiss | Minimum 5 seconds for messages requiring reading |
| Action | If snackbar has an action button, it must be focusable before dismiss |

### Loading States

| Rule | Requirement |
|------|-------------|
| Container | `aria-busy="true"` on the loading container |
| Announcement | `aria-live="polite"` + screen reader text "Loading..." |
| Skeleton | `aria-hidden="true"` (decorative placeholder) |
| Progress | `aria-label` describing what's loading, `aria-valuenow` for determinate |

## Visual Design

### Color Contrast

| Element | Minimum ratio |
|---------|---------------|
| Normal text (under 18px) | 4.5:1 against background |
| Large text (18px+ or 14px bold) | 3:1 against background |
| UI components and graphics | 3:1 against adjacent colors |
| Focus indicators | 3:1 against adjacent background |

CDS tokens meet these requirements when used correctly. Never adjust color opacity below these thresholds.

### Focus Indicators

| Rule | Requirement |
|------|-------------|
| Visibility | 2px solid primary (`#4b3fff`) outline with 2px offset |
| All interactive elements | Must show visible focus ring when focused via keyboard |
| Custom focus styles | Must meet 3:1 contrast ratio |

### Touch Targets

| Breakpoint | Minimum size |
|------------|-------------|
| Desktop | No strict minimum (but 32px recommended) |
| Tablet | 44px × 44px |
| Mobile | 48px × 48px |

Ensure adequate spacing between touch targets (minimum 8px gap).

### Motion

| Rule | Requirement |
|------|-------------|
| `prefers-reduced-motion` | Respect OS setting — disable or shorten animations |
| Auto-play | Never auto-play animations that can't be paused |
| Duration | Transitions under 5 seconds |

## Icons

### Decorative Icons

Icons that don't convey additional meaning:
- Set `aria-hidden="true"`
- Accompany with visible text

### Functional Icons

Icons that convey meaning or trigger actions:
- In IconButton: `aria-label` is required
- Standalone: provide `aria-label` or accompany with `<Typography>` label
- Status icons: ensure meaning isn't conveyed by color alone (use shape + label)

## Checklist for Design Specs

Before finalizing any design specification, verify:

- [ ] Every interactive element is keyboard accessible
- [ ] Every form field has a visible label
- [ ] Every icon-only button has `aria-label`
- [ ] Color contrast meets 4.5:1 for text, 3:1 for UI
- [ ] Touch targets meet minimum sizes at each breakpoint
- [ ] Focus indicators are visible (2px primary outline)
- [ ] Loading states are announced to screen readers
- [ ] Modals trap focus and return it on close
- [ ] Error messages are linked to their fields
- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] Skip link is present
- [ ] `prefers-reduced-motion` is respected
- [ ] Status is not conveyed by color alone
