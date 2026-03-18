---
name: CDS Theme System
description: Theme resolution, tokens, and styling rules for CDS. Use when applying colors, spacing, typography, or theming.
---

# CDS Theme System

## Resolution Order

```
MUI → Capital Tokens → Capital MUI Theme → CDS Overrides → Dark/Light Mode
```

**Principle**: Extend, don't replace. Build on Capital with minimal overrides only.

---

## Light + Dark Mode

- `theme.palette.mode` — 'light' | 'dark'

---

## Tokens

| Token | Value |
|-------|-------|
| Primary | #4b3fff (Blurple) |
| Secondary | #546574 (Slate) |
| Error | #d32f2f |
| Warning | #ed6c02 |
| Info | #0288d1 |
| Success | #2e7d32 |

---

## Typography

- **Font**: DM Sans
- **Headings**: weight 600
- **Button**: weight 500
- **Body**: weight 400

---

## Spacing

- **4px grid** — `theme.spacing(n)`

---

## Border Radius

- **4px** default

---

## Breakpoints

| Key | Value |
|-----|-------|
| xs | 0 |
| sm | 600 |
| md | 900 |
| lg | 1200 |
| xl | 1536 |

**Design targets**: Mobile 390, Tablet 768, Desktop 1440

---

## Component Sizes

| Size | Height |
|------|--------|
| Small | 28px |
| Medium | 32px |
| Large | 40px |

---

## Chart Theming

- `useTheme()` + `capitalDesignTokens` for recharts/highcharts colors
- `theme.palette.divider` for grid lines
- `theme.typography` for text

---

## Transitions

| Element | Duration |
|---------|----------|
| Tooltips | 150ms |
| Drawers | 200ms |
| Pages | 250ms |
| Modals | 300ms |

---

## Keywords

theme, dark mode, light mode, color, token, spacing, typography
