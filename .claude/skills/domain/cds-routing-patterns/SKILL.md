---
name: CDS Routing Patterns
description: Route shape, CRUD patterns, and navigation for CDS applications. Use when defining routes, layouts, or navigation.
---

# CDS Routing Patterns

## Route Shape

```
/suite/resource/:resourceId
```

---

## CRUD Routes

| Action | Route Pattern |
|--------|---------------|
| List | `resource` (index) |
| New | `resource/new` |
| Detail | `resource/:id` |
| Edit | `resource/:id?mode=edit` |

---

## Layout Wrapping

Every route wrapped in a suite Layout component.

---

## Lazy Loading

- `React.lazy()` for route-level code splitting
- `Suspense` for loading fallback

---

## Breadcrumbs

Use `PageHeaderComposable.Breadcrumbs`

---

## Unsaved Changes

Guard for forms — warn before navigating away with unsaved changes.

---

## Document Title

Use `useDocumentTitle` hook for per-page titles.

---

## Route Registration

Register routes in `App.tsx`.

---

## Keywords

route, navigation, url, path, breadcrumb, lazy
