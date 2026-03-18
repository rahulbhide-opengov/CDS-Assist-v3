# CDS-Assist Skills Inventory

Skills are loaded automatically based on keywords in the user prompt. You never need to specify which skills to load — the agent detects intent and loads the relevant ones.

---

## Core (2)

| Skill | Path | When Loaded |
|-------|------|-------------|
| **cds-component-hierarchy** | `core/cds-component-hierarchy/SKILL.md` | Component selection, import order, building UI |
| **cds-core-principles** | `core/cds-core-principles/SKILL.md` | Any React/TypeScript component or page |

---

## Domain (7)

| Skill | Path | When Loaded |
|-------|------|-------------|
| **cds-accessibility** | `domain/cds-accessibility/SKILL.md` | Any UI component, a11y, WCAG |
| **cds-architecture** | `domain/cds-architecture/SKILL.md` | Scaffolding, project layout |
| **cds-business-logic** | `domain/cds-business-logic/SKILL.md` | State, forms, data fetching, API |
| **cds-copywriting** | `domain/cds-copywriting/SKILL.md` | Labels, messages, CTAs |
| **cds-figma-integration** | `domain/cds-figma-integration/SKILL.md` | Figma-to-React, Code Connect |
| **cds-routing-patterns** | `domain/cds-routing-patterns/SKILL.md` | Routes, layouts, navigation |
| **cds-theme-system** | `domain/cds-theme-system/SKILL.md` | Colors, spacing, typography, tokens |

---

## Patterns (1+)

| Skill | Path | When Loaded |
|-------|------|-------------|
| **dashboard-pattern** | `patterns/dashboard-pattern/SKILL.md` | dashboard, overview, metrics, analytics, KPI, charts |
| **list-view** | (in main SKILL / references) | list, table, grid, search, browse |
| **form-pattern** | (in main SKILL / references) | form, create, edit, save, new |
| **detail-view** | (in main SKILL / references) | detail, view, show, profile |

---

## Auto-Discovery

**Example**: "build a procurement dashboard with charts"

Loads:

- `dashboard-pattern` (keywords: dashboard, charts)
- `cds-core-principles` (always for pages)
- `cds-theme-system` (charts need tokens)
- `cds-component-hierarchy` (component selection)
- References: `patterns.md`, `data-visualization.md`, `products/procurement.md`

---

## Reference Files

References live in `/references/` and are loaded by keyword (Figma, React, dashboard, table, form, etc.). See the main SKILL.md auto-routing table for the full mapping.
