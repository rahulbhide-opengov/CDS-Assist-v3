# Seamstress Theme Architecture

## Overview

The Seamstress theme extends the OpenGov Capital MUI Theme with minimal, well-documented overrides. This directory contains the single source of truth for all theme customizations.

## Philosophy

**"Extend, don't replace"** - We build on top of Capital's design system rather than reimplementing it.

## File Structure

```
src/theme/
├── index.ts        # Main theme configuration and exports
├── overrides.ts    # Documentation of all overrides with justifications
└── README.md       # This file
```

## Usage

### Basic Import

```typescript
import { theme, tokens } from '@/theme';

// Use in ThemeProvider
<ThemeProvider theme={theme}>
  {children}
</ThemeProvider>

// Use tokens in components
<Box sx={{ padding: tokens.spacing.md }}>
```

### Status Colors

```typescript
import { tokens } from '@/theme';

// Use for entity status
<Chip
  label="Published"
  sx={{
    backgroundColor: tokens.statusColors.published,
    color: 'white'
  }}
/>
```

## Theme Hierarchy

```
1. MUI Base Components
   ↓
2. Capital Design Tokens
   ↓
3. Capital MUI Theme
   ↓
4. Seamstress Overrides (this directory)
```

## What We Override

### Palette Extensions
- **Status Colors**: Custom colors for entity states (draft, published, active, inactive, deprecated)
- **Background Secondary**: Gray50 for content areas

### Component Overrides
- **MuiButton**: Custom hover for outlined/text variants
- **MuiChip**: Success color variant
- **MuiToggleButton**: Selected state with blurple tint
- **MuiPaper**: Border for elevation0
- **MuiDataGrid**: Gray header background

## What We DON'T Override

Capital already provides excellent defaults for:
- Typography (fonts, sizes, weights)
- Form controls (TextField, Select, etc.)
- Navigation (Tabs, Breadcrumbs, Links)
- Feedback (Alert, Snackbar)
- Layout (Container, Grid, Stack)

## Adding New Overrides

Before adding a new override:

1. **Check Capital First**: Does `@opengov/capital-mui-theme` already provide what you need?
2. **Justify the Override**: Document why it's necessary in `overrides.ts`
3. **Use Design Tokens**: Never hardcode values, use `capitalDesignTokens`
4. **Keep it Minimal**: Only override what's truly different
5. **Update Documentation**: Add to `overrides.ts` with justification

### Example

```typescript
// In index.ts
const seamstressComponents: ThemeOptions['components'] = {
  // Existing overrides...

  MuiNewComponent: {
    styleOverrides: {
      root: {
        // Use design tokens, not hardcoded values
        backgroundColor: capitalDesignTokens.foundations.colors.gray100,
      },
    },
  },
};

// In overrides.ts
MuiNewComponent: {
  description: 'What we're changing',
  capitalDefault: 'What Capital provides',
  seamstressOverride: 'Our changes',
  justification: 'Why this is necessary',
  usage: ['Where this is used'],
},
```

## Validation

Run the validation function to check override health:

```typescript
import { validateOverrides } from '@/theme/overrides';

validateOverrides();
// Outputs override statistics and ratio
```

## Best Practices

1. **Always use Capital tokens**: `capitalDesignTokens.foundations.colors.*`
2. **Document everything**: Every override needs a justification
3. **Review quarterly**: Remove overrides that are no longer needed
4. **Prefer composition**: Use `sx` prop for one-off styles instead of theme overrides
5. **Test in Storybook**: Verify overrides work correctly with Capital components

## Migration Notes

### September 2024 Simplification
- Consolidated from 16+ files to 3 files
- Removed duplicate Capital theme files
- Moved pattern styles to component level
- Documented all overrides with justifications

## Common Patterns

### Using Status Colors

```typescript
const getStatusColor = (status: string) => {
  return tokens.statusColors[status] || tokens.statusColors.inactive;
};
```

### Applying Standard Spacing

```typescript
<Stack spacing={theme.spacing(2)}> // or tokens.spacing.md
```

### Using Borders

```typescript
<Paper sx={{ border: tokens.borders.default }}>
```

## Transitions

Seamstress provides centralized transition configurations for consistent animations across the application.

### Standard Durations

```typescript
import { transitions } from '@/theme';

transitions.durations.shortest    // 150ms - Tooltips, ripples
transitions.durations.shorter     // 200ms - Chips, badges
transitions.durations.short       // 250ms - Most UI elements
transitions.durations.standard    // 300ms - Default
transitions.durations.complex     // 375ms - Complex animations
transitions.durations.enteringScreen  // 225ms - Components entering
transitions.durations.leavingScreen   // 195ms - Components leaving
```

### Component-Specific Settings

```typescript
// Modal transitions
transitions.components.modal.content.timeout     // 300ms
transitions.components.modal.backdrop.timeout    // 500ms

// Drawer transitions (horizontal slide)
transitions.components.drawer.timeout            // 200ms

// Dialog transitions
transitions.components.dialog.timeout            // 200ms

// Page transitions
transitions.components.page.timeout              // 250ms
```

### Accessibility

All transitions respect user motion preferences:

```typescript
// Automatically returns 0 if user prefers reduced motion
const duration = transitions.getDuration(transitions.durations.standard);
```

### Usage Examples

**In Components:**
```typescript
import { Fade } from '@mui/material';
import { transitions } from '@/theme';

<Fade timeout={transitions.getDuration(transitions.durations.standard)}>
  {content}
</Fade>
```

**Page Transitions:**
```typescript
import PageTransition from '@/components/PageTransition';

<PageTransition type="fade">
  <YourPage />
</PageTransition>
```

## Resources

- [Capital MUI Theme Docs](https://opengov.com/capital-design)
- [MUI Documentation](https://mui.com/material-ui/)
- [MUI Transitions](https://mui.com/material-ui/transitions/)
- [Figma Designs](https://figma.com/opengov-seamstress)