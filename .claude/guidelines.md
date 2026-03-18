# CDS Design System Guidelines

Design-and-code rules for OpenGov prototypes using the Capital Design System (CDS).

---

## Component Hierarchy

1. **OpenGov CDS** (`@opengov/components-*`) — use first when available
2. **MUI** with CDS theme — use for standard UI (Button, TextField, etc.)
3. **Custom** with CDS tokens — only when no CDS/MUI component fits

---

## Import Order

```
React → @opengov → @mui → third-party → local → import type
```

- Use `import type` for type-only imports (missing this can cause blank pages)

---

## Theme Tokens Only

- **No hardcoded colors** — use palette paths: `'primary.main'`, `'text.secondary'`, `'background.paper'`, `'divider'`
- **No hardcoded spacing** — use `theme.spacing(n)` or `sx` with theme values
- **No hardcoded typography** — use `variant` and `color` props on Typography

---

## Page Structure

- **PageHeaderComposable** from `@opengov/components-page-header` on every page — never hand-build with Box + Typography
- **BaseLayout** (or suite layout) wrapping every route — provides global nav and suite nav
- Content area with `maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide`

---

## Four States

Every data-driven view must handle:

1. **Loading** — Skeleton or CircularProgress
2. **Error** — Alert severity="error" + retry
3. **Empty** — illustration + Typography + CTA
4. **Success** — content

---

## Typography

- **Font**: DM Sans (always)
- **Variants**: h1–h6 for headings, body1/body2 for body, caption for labels
- **Weights**: Heading 600, Button 500, Body 400
- Use `variant` + `color` props — never manual fontSize/fontWeight/fontFamily

---

## Spacing

- **4px grid** — all spacing on multiples of 4
- Use `theme.spacing(n)` or MUI spacing props

---

## Colors

| Semantic | Hex | Palette Path |
|----------|-----|--------------|
| Primary | #4b3fff (Blurple) | `primary.main` |
| Secondary | #546574 (Slate) | `secondary.main` |
| Error | #d32f2f | `error.main` |
| Warning | #ed6c02 | `warning.main` |
| Info | #0288d1 | `info.main` |
| Success | #2e7d32 | `success.main` |

---

## sx Usage

**Allowed**: `display`, `flex`, `gap`, `p`/`m`/`px`/`py`, `width`, `maxWidth`, `position`, `textAlign`, `overflow`, `opacity`

**Forbidden**: `fontSize`, `fontWeight`, `fontFamily`, `color` (use prop), `borderRadius`, hover/focus overrides, `bgcolor` with hex

---

## Status Chip Color Mapping

```tsx
const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  'In Review': 'info', 'Approved': 'success', 'On Hold': 'warning',
  'Submitted': 'default', 'Denied': 'error', 'Active': 'success',
};
<Chip label={status} size="small" color={STATUS_CHIP_COLOR[status] ?? 'default'} />
```

---

## Chart Theming (recharts)

- Use `useTheme()` + `capitalDesignTokens.semanticColors.dataVisualization` for series colors
- Grid lines: `theme.palette.divider`
- Axis text: `theme.typography.caption.fontSize`, `theme.palette.text.secondary`
- Tooltip: `theme.palette.background.paper`, `theme.palette.divider`
- No hardcoded hex in any chart element

---

## Accessibility (Pre-Output Checklist)

1. **IconButton** — every IconButton has `aria-label`
2. **Input** — every input has `label` or `aria-label`
3. **Decorative icons** — use `aria-hidden="true"`
4. **Non-button clickable** — has `role`, `tabIndex`, `onKeyDown`
5. **Table** — every Table has `aria-label`
6. **ToggleButtonGroup** — every ToggleButtonGroup has `aria-label`
7. **Loading states** — use `aria-busy` or `role="status"`

---

## Mode Support

- **CDS supports light + dark mode** — use `theme.palette.mode` to switch
- Dark palette defined in `shared/tokens/colors-dark.ts`; component overrides in `dark-theme-components.ts`
- Always use semantic tokens (`'primary.main'`, `'background.paper'`) — they adapt to mode automatically
