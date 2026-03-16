# CDS Design Tokens — Complete Reference

Source: CDS Design System v3.0.0 | MUI 6.1.0

## Color Palette

### Primary (Blurple)

| Step | Hex | Use |
|------|-----|-----|
| 50 | `#f5f3ff` | Subtle backgrounds, hover tints |
| 100 | `#eef1fc` | Light backgrounds, selected states |
| 200 | `#d6d4ff` | Borders, light accents |
| 400 | `#a098ff` | Disabled primary, light text |
| 700 (main) | `#4b3fff` | Primary buttons, links, active indicators |
| 900 | `#19009b` | Dark primary, pressed states |

Contrast text: `#ffffff`

### Secondary (Slate)

| Step | Hex | Use |
|------|-----|-----|
| 50 | `#f8f9fa` | Subtle backgrounds |
| 100 | `#e9ecef` | Light backgrounds |
| 200 | `#cbd2d9` | Borders |
| 400 | `#8e9ba8` | Muted text, disabled |
| 700 (main) | `#546574` | Secondary buttons, muted actions |
| 900 | `#2d3748` | Dark secondary |

Contrast text: `#ffffff`

### Semantic Colors

| Color | Main | Light | Dark | Use |
|-------|------|-------|------|-----|
| Error | `#d32f2f` | `#ef5350` | `#b71c1c` | Destructive actions, validation errors |
| Warning | `#ed6c02` | `#ff9800` | `#e65100` | Caution, non-blocking alerts |
| Success | `#2e7d32` | `#4caf50` | `#1b5e20` | Positive confirmations, active status |
| Info | `#0288d1` | `#03a9f4` | `#01579b` | Help text, informational banners |

All semantic colors have `contrastText: '#ffffff'`.

### Text Colors

| Token | Value | Use |
|-------|-------|-----|
| `text.primary` | `rgba(0,0,0,0.87)` | Headings, body text |
| `text.secondary` | `rgba(0,0,0,0.6)` | Descriptions, labels |
| `text.disabled` | `rgba(0,0,0,0.38)` | Disabled elements |
| `text.hint` | `rgba(0,0,0,0.26)` | Placeholders |

### Background Colors

| Token | Value | Use |
|-------|-------|-----|
| `background.default` | `#fafafa` | Page background |
| `background.paper` | `#ffffff` | Cards, surfaces, dialogs |
| `background.tertiary` | `#f2f2f2` | Subtle section backgrounds |

### Grey Scale

| Step | Hex |
|------|-----|
| 50 | `#fafafa` |
| 100 | `#f5f5f5` |
| 200 | `#eeeeee` |
| 300 | `#e0e0e0` |
| 400 | `#bdbdbd` |
| 500 | `#9e9e9e` |
| 600 | `#757575` |
| 700 | `#616161` |
| 800 | `#424242` |
| 900 | `#212121` |

### Divider

`rgba(0,0,0,0.12)` — borders, separators, table lines

### Navigation Colors

| Token | Value | Use |
|-------|-------|-----|
| `nav.background` | `#ffffff` | Nav panel background |
| `nav.itemHover` | `rgba(0,0,0,0.04)` | Item hover state |
| `nav.itemActive` | `rgba(75,63,255,0.08)` | Active item background |
| `nav.itemText` | `rgba(0,0,0,0.87)` | Nav item text |
| `nav.itemTextActive` | `#4b3fff` | Active nav item text |

## Typography

Font: **DM Sans** (always — no exceptions)

### Heading Variants

| Variant | Desktop Size | Weight | Line Height | Use |
|---------|-------------|--------|-------------|-----|
| `h1` | 48px | 600 | 1.2 | Page titles |
| `h2` | 32px | 600 | 1.2 | Section headings |
| `h3` | 24px | 600 | 1.3 | Card headings |
| `h4` | 20px | 600 | 1.3 | Form headings, subsections |
| `h5` | 16px | 600 | 1.4 | Small headings |
| `h6` | 14px | 600 | 1.4 | Subheadings |

### Body Variants

| Variant | Size | Weight | Use |
|---------|------|--------|-----|
| `subtitle1` | 16px | 400 | Subtitle text |
| `subtitle2` | 14px | 500 | Emphasized subtitle |
| `body1` | 14px | 400 | Default body text |
| `body2` | 12px | 400 | Small text |
| `caption` | 12px | 500 | Labels, metadata |
| `overline` | 12px | 400 | Uppercase labels |

### Button Typography

| Size | Font Size | Weight |
|------|-----------|--------|
| Small | 12px | 500 |
| Medium | 14px | 500 |
| Large | 16px | 500 |

### Display Typography (for hero sections)

| Token | Size | Weight |
|-------|------|--------|
| `display1` | 60px | 600 |
| `display2` | 56px | 600 |
| `display3` | 48px | 600 |
| `display4` | 40px | 600 |
| `display5` | 32px | 600 |

### Responsive Typography

| Desktop | Tablet | Mobile | Use |
|---------|--------|--------|-----|
| 48px/700 | 36px/700 | 28px/700 | Hero heading |
| 24px/600 | 22px/600 | 20px/600 | Section title |
| 16px/400 | 14px/400 | 13px/400 | Subtitle |
| 14px/400 | 14px/400 | 14px/400 | Body |
| 12px/400 | 12px/400 | 12px/400 | Captions |

### Size Normalization

When input contains non-CDS font sizes, map to the nearest variant:

| Input size (approx) | Maps to |
|---------------------|---------|
| 48px+ heading | `h1` |
| 32-40px heading | `h2` |
| 24-28px heading | `h3` |
| 20-22px heading | `h4` |
| 16-18px heading | `h5` |
| 14-15px heading | `h6` |
| 16px regular | `subtitle1` |
| 14px medium | `subtitle2` |
| 14px regular | `body1` |
| 12px regular | `body2` |
| 12px medium | `caption` |
| 12px uppercase | `overline` |

## Spacing

Base unit: **4px**. All spacing MUST be multiples of 4.

### Fixed Scale

| Multiplier | Value | Common use |
|------------|-------|------------|
| 0 | 0px | No space |
| 0.5 | 2px | Hairline gap |
| 1 | 4px | Tight gap (icon-to-text) |
| 1.5 | 6px | Compact padding |
| 2 | 8px | Standard internal padding |
| 3 | 12px | Standard gap between elements |
| 4 | 16px | Section padding, card padding |
| 4.5 | 18px | Medium gap |
| 5 | 20px | Comfortable padding |
| 6 | 24px | Section gap |
| 7 | 28px | Large gap |
| 8 | 32px | Section separation |

### Responsive Scale

| Multiplier | Value | Use |
|------------|-------|-----|
| 10 | 40px | Large section gap |
| 12 | 48px | Page section gap |
| 16 | 64px | Hero padding |
| 18 | 72px | Large hero padding |
| 20 | 80px | Page-level padding |
| 24 | 96px | Maximum padding |

## Component Sizing

### Buttons

| Size | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Small | 28px | 32px | 32px |
| Medium | 32px | 36px | 36px |
| Large | 40px | 44px | 44px |

### Text Inputs

| Size | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Small | 28px | 32px | 32px |
| Medium | 32px | 36px | 40px |
| Large | 40px | 44px | 48px |

### Chips

| Size | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Small | 28px | 32px | 32px |
| Medium | 32px | 36px | 36px |
| Large | 40px | 44px | 44px |

### Other Components

| Component | Small | Medium | Large |
|-----------|-------|--------|-------|
| Fab | 32px | 40px | 50px |
| Avatar | 24px | 40px | 56px |
| Icon | 20px | 24px | 32px |
| AppBar | — | 56px (mobile) | 64px (desktop) |
| Table header | 50px (desktop) | 56px (tablet) | 64px (mobile) |
| Table cell | 50px (desktop) | 56px (tablet) | 64px (mobile) |

### Navigation

| Element | Value |
|---------|-------|
| Drawer width (standard) | 240px |
| Drawer width (wide) | 320px |
| Drawer width (slim/collapsed) | 64px |
| Nav item height | 48px |
| Nav icon size | 24px |
| Nav icon spacing | 16px |

### Touch Targets

| Breakpoint | Minimum |
|------------|---------|
| Desktop | No minimum |
| Tablet | 44px |
| Mobile | 48px |

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `none` | 0px | No rounding |
| `extraSmall` | 2px | Subtle rounding |
| `small` | 4px | Default (buttons, cards, inputs) |
| `medium` | 8px | Medium rounding |
| `large` | 12px | Large rounding (modals) |
| `circular` | 50% | Circular elements (avatars) |
| `full` | 9999px | Pill shapes |

Default border radius for all CDS components: **4px**.

## Elevation / Shadows

| Token | Shadow | Use |
|-------|--------|-----|
| `card` | `0px 2px 8px rgba(0,0,0,0.1)` | Cards, papers |
| `dropdown` | `0px 4px 12px rgba(0,0,0,0.1)` | Menus, dropdowns, popovers |
| `dialog` | `0px 8px 24px rgba(0,0,0,0.2)` | Dialogs, modals |
| `navigation` | `0px 2px 4px rgba(0,0,0,0.08)` | AppBar, drawers |

MUI shadow scale (0-24) is also available for fine-grained control.

## Breakpoints

### MUI Breakpoints

| Name | Value |
|------|-------|
| `xs` | 0px |
| `sm` | 600px |
| `md` | 900px |
| `lg` | 1200px |
| `xl` | 1536px |

### Figma Breakpoints

| Name | Value |
|------|-------|
| Mobile | 390px |
| Tablet | 768px |
| Desktop | 1440px |

## Transitions

### Durations

| Token | Value | Use |
|-------|-------|-----|
| `shortest` | 150ms | Micro-interactions (checkbox, switch) |
| `shorter` | 200ms | Quick transitions (hover) |
| `short` | 250ms | Standard transitions |
| `standard` | 300ms | Default animation duration |
| `complex` | 375ms | Complex animations (expand/collapse) |
| `enteringScreen` | 225ms | Elements entering viewport |
| `leavingScreen` | 195ms | Elements leaving viewport |

### Easing

| Token | Value | Use |
|-------|-------|-----|
| `easeInOut` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `easeOut` | `cubic-bezier(0.0, 0, 0.2, 1)` | Entering |
| `easeIn` | `cubic-bezier(0.4, 0, 1, 1)` | Leaving |
| `sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` | Drawer slide |

Always respect `prefers-reduced-motion` — disable/shorten animations when user prefers reduced motion.

## Z-Index Scale

| Component | Z-Index |
|-----------|---------|
| Mobile stepper | 1000 |
| FAB | 1050 |
| Speed dial | 1050 |
| AppBar | 1100 |
| Drawer | 1200 |
| Modal | 1300 |
| Snackbar | 1400 |
| Tooltip | 1500 |
