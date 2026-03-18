---
name: CDS Component Hierarchy
description: Component priority hierarchy and import order for OpenGov CDS design system. Use when selecting which component to use, organizing imports, or building UI.
---

# CDS Component Hierarchy

## Priority Order

### Priority 1: OpenGov Packages
Use these first when available:
- `@opengov/components-page-header` — PageHeaderComposable
- `@opengov/components-nav-bar` — Navigation
- `@opengov/capital-mui-theme` — CDS theme
- `@opengov/react-capital-assets` — Icons, illustrations

### Priority 2: MUI Components with CDS Theme
70+ components themed. Use with theme props — never override visual props in sx:
- Button, TextField, Card, DataGrid, Typography
- Checkbox, Radio, Switch, Select, Autocomplete
- Dialog, Accordion, Tabs, Chip, Alert
- And 60+ more

### Priority 3: Custom Components with CDS Tokens
Only when P1 and P2 do not provide the needed component.

---

## Import Order

```ts
// 1. React / hooks
import { useState, useEffect } from 'react';

// 2. OpenGov packages
import { PageHeaderComposable } from '@opengov/components-page-header';
import { IconName } from '@opengov/react-capital-assets';

// 3. MUI
import { Button, TextField, Card } from '@mui/material';

// 4. Third-party (recharts, highcharts, react-hook-form)
import { useForm } from 'react-hook-form';

// 5. Local
import { MetricCard } from '@/components/MetricCard';

// 6. Type-only imports last
import type { Vendor } from '@/types/procurement';
```

---

## Decision Tree

```
Does OpenGov provide this component?
├── YES → Use it
└── NO → Does MUI have it?
         ├── YES → Use with CDS theme props (variant, color, size)
         └── NO → Build custom with CDS design tokens
```

---

## Icon Decision

1. **First**: Check `@opengov/react-capital-assets`
2. **Second**: `@mui/icons-material` only if OpenGov does not have the icon

---

## Keywords

component, import, hierarchy, button, input, card, which component
