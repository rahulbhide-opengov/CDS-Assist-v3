---
name: CDS Core Principles
description: Golden rules that apply to ALL generated code. Use when generating any React/TypeScript component or page.
---

# CDS Core Principles

## ALWAYS

- **PageHeaderComposable** on every page
- **Theme tokens only** — no hardcoded colors, spacing, or font sizes
- **Entity-scoped routes** — `/suite/resource/:id`
- **Handle all 4 states**: loading, error, empty, success
- **TypeScript types** for props and data
- **`import type`** for type-only imports

## NEVER

- Hardcode colors or spacing
- Skip PageHeaderComposable
- Use inline styles
- Use MUI icons when OpenGov has them
- Override theme-handled visual props in sx (fontSize, fontWeight, color, borderRadius, hover/focus)

---

## Theme Architecture

```
MUI Base → Capital Design Tokens → Capital MUI Theme → CDS Overrides → Dark Mode
```

---

## Page Structure

```
Layout wrapper → PageHeaderComposable → Content area
```

---

## Spacing

- **4px grid** — use `theme.spacing(n)` only

---

## Typography

- **Font**: ALWAYS DM Sans
- **Heading weight**: 600
- **Button weight**: 500
- **Body weight**: 400

---

## Input Normalization

- Non-CDS colors → nearest semantic color
- Non-CDS sizes → nearest CDS size

---

## sx Usage

**Allowed**: layout only — `display`, `flex`, `gap`, `p`, `m`, `width`, `position`, `textAlign`

**Forbidden**: `fontSize`, `fontWeight`, `color` (use prop), `borderRadius`, `hover`/`focus` overrides

---

## Transition Policy

| Element | Duration |
|---------|----------|
| Tooltips | 150ms |
| Drawers | 200ms |
| Pages | 250ms |
| Modals | 300ms |

---

## Keywords

principles, rules, theme, tokens, spacing, golden rules
