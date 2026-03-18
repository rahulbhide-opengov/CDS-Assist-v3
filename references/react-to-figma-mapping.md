# React → Figma Mapping Reference (Universal)

**MANDATORY**: Load this file whenever creating Figma designs from React code. Every React prop, sx value, and component has a 1:1 Figma equivalent. NEVER guess — use this mapping.

## 1. MUI sx Props → Figma Auto-Layout Properties

### Layout Direction
| React (sx / Stack) | Figma Property | Value |
|---------------------|----------------|-------|
| `display: 'flex', flexDirection: 'row'` | `layoutMode` | `'HORIZONTAL'` |
| `display: 'flex', flexDirection: 'column'` | `layoutMode` | `'VERTICAL'` |
| `<Stack direction="row">` | `layoutMode` | `'HORIZONTAL'` |
| `<Stack direction="column">` | `layoutMode` | `'VERTICAL'` |

### Alignment
| React (sx / Stack) | Figma Property | Value |
|---------------------|----------------|-------|
| `justifyContent: 'flex-start'` | `primaryAxisAlignItems` | `'MIN'` |
| `justifyContent: 'center'` | `primaryAxisAlignItems` | `'CENTER'` |
| `justifyContent: 'flex-end'` | `primaryAxisAlignItems` | `'MAX'` |
| `justifyContent: 'space-between'` | `primaryAxisAlignItems` | `'SPACE_BETWEEN'` |
| `alignItems: 'flex-start'` | `counterAxisAlignItems` | `'MIN'` |
| `alignItems: 'center'` | `counterAxisAlignItems` | `'CENTER'` |
| `alignItems: 'flex-end'` | `counterAxisAlignItems` | `'MAX'` |
| `alignItems: 'stretch'` | `counterAxisAlignItems` | `'STRETCH'` (Figma: child `layoutSizingVertical = 'FILL'`) |

### Spacing (MUI theme.spacing units → pixels: multiply by 8)
| React sx | Pixels | Figma Property |
|----------|--------|----------------|
| `spacing={0.5}` or `gap: 0.5` | 4px | `itemSpacing = 4` |
| `spacing={1}` or `gap: 1` | 8px | `itemSpacing = 8` |
| `spacing={1.5}` or `gap: 1.5` | 12px | `itemSpacing = 12` |
| `spacing={2}` or `gap: 2` | 16px | `itemSpacing = 16` |
| `spacing={3}` or `gap: 3` | 24px | `itemSpacing = 24` |
| `spacing={4}` or `gap: 4` | 32px | `itemSpacing = 32` |

### Padding (MUI units → pixels: multiply by 8)
| React sx | Figma Properties |
|----------|-----------------|
| `p: 1` | `paddingTop=paddingBottom=paddingLeft=paddingRight = 8` |
| `p: 2` | All padding = 16 |
| `p: 3` | All padding = 24 |
| `px: 2` | `paddingLeft = paddingRight = 16` |
| `py: 1.5` | `paddingTop = paddingBottom = 12` |
| `pt: 2` | `paddingTop = 16` |
| `pb: 1` | `paddingBottom = 8` |
| `pl: 6` | `paddingLeft = 48` |
| `mb: 3` (bottom margin) | Parent `itemSpacing` or wrapper frame with `paddingBottom = 24` |

### Sizing
| React sx | Figma Property |
|----------|----------------|
| `flex: 1` | `layoutGrow = 1` AND `layoutSizingHorizontal = 'FILL'` |
| `width: 250` or `minWidth: 250` | `layoutSizingHorizontal = 'FIXED'`, `resize(250, height)` |
| `width: '100%'` or `fullWidth` | `layoutSizingHorizontal = 'FILL'` |
| `height: '100%'` | `layoutSizingVertical = 'FILL'` |
| `height: 'calc(100vh - 96px)'` | Screen-level: `layoutSizingVertical = 'HUG'` (content drives height) |
| `minHeight: 400` | `minHeight = 400` |
| `maxWidth: 1440` | `layoutSizingHorizontal = 'FIXED'`, `resize(1440, h)` |
| `overflow: 'auto'` or `overflow: 'hidden'` | `clipsContent = true` |

### Borders & Corners
| React sx | Figma Property |
|----------|----------------|
| `borderRight: 1, borderColor: 'divider'` | `strokes` with bound variable, `strokesIncludedInLayout = false`, stroke on RIGHT only |
| `borderTop: 1` | Stroke on TOP only |
| `border: 1, borderColor: 'divider'` | All-side stroke |
| `borderRadius: 1` (= 4px) | `cornerRadius = 4` |
| `borderRadius: 2` (= 8px) | `cornerRadius = 8` |

### Background Colors
| React sx palette path | Figma Variable |
|-----------------------|----------------|
| `bgcolor: 'background.default'` | `Colors/background/tertiary` (#f5f5f5) |
| `bgcolor: 'background.paper'` | `Colors/background/paper-elevation-0` (#ffffff) |
| `bgcolor: 'grey.50'` | `Colors/background/tertiary` (#f5f5f5) |
| `bgcolor: 'grey.100'` | Nearest: `Colors/background/tertiary` or manual frame with light fill |
| `bgcolor: 'primary.main'` | `Colors/primary/main` |
| `bgcolor: 'action.selected'` | `Colors/action/selected` (use alpha) |

## 2. MUI Component → CDS Figma Component

### CRITICAL: Use `figma_search_components` + `figma_instantiate_component` for ALL of these

| React MUI Component | Figma CDS Library Component | Search Query | Notes |
|---------------------|----------------------------|--------------|-------|
| `<Button variant="contained" color="primary">` | Button (Primary, Contained) | `"Button"` | Set variant: `{Type: 'Primary', Size: 'Medium'}` |
| `<Button variant="outlined" color="secondary">` | Button (Secondary, Outlined) | `"Button"` | Set variant: `{Type: 'Secondary'}` |
| `<IconButton>` | IconButton | `"IconButton"` | |
| `<ButtonGroup>` | ButtonGroup | `"ButtonGroup"` | |
| `<TextField size="small">` | TextField (Small) | `"TextField"` | |
| `<Checkbox>` | Checkbox | `"Checkbox"` | |
| `<Chip label="X" size="small">` | Chip (Small) | `"Chip"` | Override label text |
| `<Chip variant="outlined">` | Chip (Outlined) | `"Chip"` | Set variant: `{Style: 'Outlined'}` |
| `<Avatar sx={{ width: 28, height: 28 }}>` | Avatar (Small) | `"Avatar"` | 28px = Small, 40px = Medium |
| `<Divider />` | Divider | `"Divider"` | Set key: `6220bea7da4756b30bf4c62afc80e1bc63c92053` |
| `<Card variant="outlined">` | Card | `"Card"` | Set key: `6c3442350d8e8be5c7f6802eb755a06365aa7c13` |
| `<Tabs>` with `<Tab>` | Tabs | `"Tabs"` | Contains Tab items |
| `<Tab label="Table" icon={...}>` | Tab (within Tabs) | `"Tab"` | Set label + icon |
| `<Table>` | Data Table | `"Table"` or `"Data Table"` | |
| `<TablePagination>` | Pagination | `"Pagination"` | |
| `<Alert severity="error">` | Alert | `"Alert"` | Set variant: `{Severity: 'Error'}` |
| `<Link>` | Link | `"Link"` | Set key: `3c37c5b1b73ff3f5b85fc17322de631c9bd87faa` |
| `<Dialog>` | Dialog/Modal | `"Dialog"` | |
| `<List>` with `<ListItemButton>` | List | `"List"` | Contains ListItem children |
| `<ListItemButton>` | ListItem | `"ListItem"` or `"List Item"` | |
| `<ListItemIcon>` | Part of ListItem instance | — | Icon slot within ListItem |
| `<ListItemText>` | Part of ListItem instance | — | Text slot within ListItem |
| `<LinearProgress>` | LinearProgress | `"LinearProgress"` or `"Progress"` | |
| `<Tooltip>` | (No visual in static design) | — | Add annotation if needed |
| `<Skeleton>` | Skeleton | `"Skeleton"` | |
| `<Breadcrumbs>` | Breadcrumbs | `"Breadcrumbs"` | Set key: `84b669e3ff9efd869c1d2600879d0e9ebb2ae118` |
| `<Switch>` | Switch | `"Switch"` | |
| `<Radio>` | Radio | `"Radio"` | |
| `<Select>` | Select/Dropdown | `"Select"` | |
| `<Accordion>` | Accordion | `"Accordion"` | |
| `<PageHeaderComposable>` | Page Heading | `"Page Heading"` | Set key: `ed8d390034cdc9b76fc11e1e2647856ff734d33d` |

## 3. Typography Variant → Figma Text Style

| React `<Typography variant="...">` | Figma Text Style Key | Font | Size | Weight |
|------------------------------------|---------------------|------|------|--------|
| `h1` | `3951ac1380692cc265c3c34dc9a6de06f7a8cd7b` | DM Sans | 48px | SemiBold |
| `h2` | `6cf42b54f5be7dddbbe18b05f9d6869d6276fe00` | DM Sans | 32px | SemiBold |
| `h3` | `74f3552f49b3c03c91234b606d7c63c15c7ac7dd` | DM Sans | 24px | SemiBold |
| `h4` | `eb8c8f295bb8e40ac267d2c626c7bbb0f56d8f7f` | DM Sans | 20px | SemiBold |
| `h5` | `68788195cb9117147385a04550cbe87479249e0c` | DM Sans | 16px | SemiBold |
| `h6` | `e7f596274da2deba475efc2e88bec9a56156899f` | DM Sans | 14px | SemiBold |
| `subtitle1` | `b4f1514de40a3ed4e5b037d92030b7420bdc054a` | DM Sans | 16px | Regular |
| `subtitle2` | `767d25d675dd5bcfd9386a2327a99f2391e40f7d` | DM Sans | 14px | Medium |
| `body1` | `178d78f7c340b70b643a05a7e768640655abd231` | DM Sans | 14px | Regular |
| `body2` | `213cabbb6965c1f310536cb317d976f060e2cf3b` | DM Sans | 12px | Regular |
| `caption` | `b9f1b832f90acd527efc3000e59c7c72d3d3ab0c` | DM Sans | 12px | Medium |
| `overline` | `b6f2714c6174d7f0ab58d63d6a54ad1b1276f8bf` | DM Sans | 12px | Medium |
| `button` (MUI) | `02659678b7c961f57a5dc23790723b1e754d2dab` | DM Sans | 14px | Medium |

## 4. Typography Color → Figma Variable

| React `color` prop | Figma Variable Key | Hex |
|--------------------|--------------------|-----|
| `"text.primary"` | `c45fa8f7347b51c3bd7302deefb9e1edeeee9271` | #212121 |
| `"text.secondary"` | `1aa140f793df4f3ce76d2ae909c78c0360b50aab` | #666666 |
| `"text.disabled"` | `39271f756d2f79b7f05c56e2ec926e051c3b1a0d` | #bdbdbd |
| `"primary"` or `"primary.main"` | `17d88b1b3dbec658b6fcbb5eeaa572643304f54e` | #4b3fff |
| `"secondary"` | `374f6557312280d07693087b2266f90d8b77ed74` | #546574 |
| `"error"` or `"error.main"` | `6e95dc04449b16b81c035fed90619098b23a31ca` | #d32f2f |
| `"success.main"` | `cfc60e9d1f9af9567185e93af3e73f030a02f724` | #2e7d32 |
| `"warning.main"` | `a5752b26f275ed6c73ae93dceba16cfe33401f81` | #ed6c02 |
| `"info.main"` | `7f72b4c3a13333f7324d16df08e88332471d25e0` | #0288d1 |
| `"grey.500"` | Use `Colors/text/secondary` as nearest | #666666 |

## 5. MDI Icon Name → CDS Icon Key (Common Icons)

React uses `@mdi/js` icon paths. Figma uses CDS 37 Icons library. Map by name:

| React MDI Import | CDS Icon Name | CDS Icon Key |
|-----------------|---------------|--------------|
| `mdiMagnify` | `magnify` | `0e7c3ee4aff54edb3d4a8e34c69a7e20a3d77397` |
| `mdiPlus` | `plus` | `fe8e2e6e7b10c2a7f17d3b59e47b50f2d399bc73` |
| `mdiChevronLeft` | `chevron-left` | `7a72a9b8c0bf61c13a0eb9b7563c72f4a5aa6e47` |
| `mdiChevronDown` | `chevron-down` | `3e63e76c28e1ceca9e28ef70b46d3fd73f3b8ee2` |
| `mdiChevronUp` | `chevron-up` | `89e29b04e8c0b8a39b9bde3b8c6b9c4a21d5a4f1` |
| `mdiAccount` | `account` | `ebfa3121d0ecf86ce77793a7d2a90c9b759ece8d` |
| `mdiAccountGroupOutline` | `account-group-outline` | `d874f60cf775a63f4aab5680963e5be7a91ab264` |
| `mdiCalendar` | `calendar` | `bc6f51ef6b608949329399c7085a291e597e906c` |
| `mdiCalendarSync` | `calendar-sync` | `439e148b7cb2e60c2232572c195420552f655a28` |
| `mdiDotsHorizontal` | `dots-horizontal` | look up in `figma-icons-catalog.md` |
| `mdiDotsVertical` | `dots-vertical` | look up in `figma-icons-catalog.md` |
| `mdiFileDocumentMultiple` | `file-document-multiple` | look up in `figma-icons-catalog.md` |
| `mdiFilterPlusOutline` | `filter-plus-outline` | look up in `figma-icons-catalog.md` |
| `mdiTableEdit` | `table-edit` | look up in `figma-icons-catalog.md` |
| `mdiTableLarge` | `table-large` | look up in `figma-icons-catalog.md` |
| `mdiChartBar` | `chart-bar` | look up in `figma-icons-catalog.md` |
| `mdiMapOutline` | `map-outline` | look up in `figma-icons-catalog.md` |
| `mdiCashMultiple` | `cash-multiple` | look up in `figma-icons-catalog.md` |
| `mdiLock` | `lock` | look up in `figma-icons-catalog.md` |
| `mdiMenuDown` | `menu-down` | look up in `figma-icons-catalog.md` |
| `mdiFolder` | `folder` | look up in `figma-icons-catalog.md` |

**For any MDI icon not in this table**: Convert `mdiCamelCase` to `kebab-case` (e.g., `mdiClipboardTextOutline` → `clipboard-text-outline`) and look up in `references/figma-icons-catalog.md`.

**Icon instantiation pattern:**
```javascript
const iconComp = await figma.importComponentByKeyAsync(iconKey);
const iconInst = iconComp.createInstance();
iconInst.resize(24, 24); // default, or 18/20/28 based on context
```

## 6. Responsive Breakpoint Adaptations

| React Pattern | Desktop (1440) | Tablet (768) | Mobile (390) |
|--------------|----------------|--------------|--------------|
| `<Stack direction={{ xs: 'column', sm: 'row' }}>` | `HORIZONTAL` | `HORIZONTAL` | `VERTICAL` |
| `<Stack direction={{ xs: 'column', md: 'row' }}>` | `HORIZONTAL` | `VERTICAL` | `VERTICAL` |
| Sidebar (250px) | Visible, 250px | Collapsed (48px) | Hidden |
| `useMediaQuery(theme.breakpoints.down('md'))` | Show desktop | Adapt | Show mobile |

## 7. Chart Components

Charts don't have direct CDS Figma library equivalents. Use:
1. **Clone existing chart instances** from other pages in the file
2. If no existing charts, create placeholder frames with the chart title and approximate layout
3. Chart heights from React (e.g., `<ResponsiveContainer height={280}>`) → Figma frame `resize(width, 280)`

## 8. Conversion Algorithm

When translating React → Figma, follow this exact order for EVERY component:

1. **Read the JSX element** — identify MUI component type, all props, sx values
2. **Look up Figma equivalent** in section 2 above
3. **Search for component**: `figma_search_components(query)` to get current session keys
4. **Instantiate**: `figma_instantiate_component(componentKey, nodeId, variant, overrides, parentId)`
5. **If component not found**: use `figma_execute` to import by key from catalog
6. **Set layout properties** from section 1 mapping
7. **Apply text style** from section 3
8. **Bind color variable** from section 4
9. **Add icons** from section 5
10. **Verify** with screenshot
