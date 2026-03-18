---
name: CDS Accessibility
description: Pre-output checklist and accessibility rules for CDS components. Use when generating any UI component or page.
---

# CDS Accessibility

## Pre-Output Checklist (7 Rules)

Before emitting ANY component code, verify:

1. **IconButton** — Every IconButton has `aria-label`
2. **Input** — Every input has `label` or `aria-label`
3. **Decorative icons** — Use `aria-hidden="true"`
4. **Non-button clickable** — Has `role`, `tabIndex`, `onKeyDown`
5. **Table** — Every Table has `aria-label`
6. **ToggleButtonGroup** — Every ToggleButtonGroup has `aria-label`
7. **Loading states** — Use `aria-busy` or `role="status"`

---

## Color Contrast

- **Body text**: 4.5:1 minimum
- **Headings / UI**: 3:1 minimum

---

## Keyboard

- All interactive elements reachable via Tab
- Visible focus indicator
- Escape closes modals

---

## Information Conveyance

- **No color-only information** — Use icons, text, or patterns in addition to color

---

## Focus Management

- Modals trap focus
- Return focus on modal close

---

## Buttons vs Links

- **Buttons** — For actions (submit, delete, save)
- **Links** — For navigation (href to another page)

---

## Keywords

accessibility, a11y, WCAG, screen reader, keyboard
