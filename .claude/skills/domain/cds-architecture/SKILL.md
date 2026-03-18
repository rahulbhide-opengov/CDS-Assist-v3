---
name: CDS Architecture
description: Project structure and organization for CDS-based applications. Use when scaffolding, organizing, or discussing project layout.
---

# CDS Architecture

## Project Structure

```
src/
├── pages/          # Route-level page components
├── components/     # Reusable UI (MetricCard, BaseLayout, etc.)
├── hooks/          # Custom React hooks
├── stores/         # Zustand state stores
├── services/       # API/data services
├── data/           # Mock data with faker.js generators
├── theme/          # CDS theme (light + dark mode)
├── types/          # TypeScript interfaces per domain
├── utils/          # Formatters, validators, helpers
└── test/           # Test setup and utilities
```

---

## Component Hierarchy

OpenGov → MUI → Custom

---

## Entity-Scoped Routing

Route shape: `/suite/resource/:id`

---

## Separation of Concerns

| Folder | Responsibility |
|--------|-----------------|
| pages | Routes, page composition |
| components | Reusable UI |
| hooks | Logic, state, side effects |
| services | API calls, data fetching |
| stores | Global/domain state |

---

## OpenGov Packages

- `capital-mui-theme` — Theme
- `capital-design-tokens` — Tokens
- `components-page-header` — PageHeaderComposable
- `components-nav-bar` — Navigation
- `react-capital-assets` — Icons, illustrations

---

## Keywords

architecture, structure, project, folder, organize
