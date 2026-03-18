# CDS-Assist v3.0

**AI design-and-code engine for OpenGov.** Generate production-ready Figma designs and React code using the CDS (Capital Design System) — powered by Claude.

CDS-Assist is a multi-platform AI agent that teaches Claude how to build OpenGov interfaces. It works in **both Cursor IDE and Claude Code terminal**, knows the complete CDS token system, 86+ Figma library components, all page patterns, and generates staff-engineer-grade React with proper state management, form validation, testing, and deployment.

---

## What Can It Do?

| Capability | Description |
|-----------|-------------|
| **Figma Design** | Create complete, multi-breakpoint Figma designs using real CDS library components, tokens, and text styles |
| **React Code** | Generate production-ready React + TypeScript using CDS hierarchy (CDS first, themed MUI second, custom last) |
| **Both at Once** | Generate Figma and React in a single session, kept in sync |
| **Responsive** | Desktop (1440), Tablet (768), and Mobile (390) — same content, adapted layouts |
| **Dark Mode** | Full light + dark mode support with semantic tokens that adapt automatically |
| **Form Validation** | react-hook-form + yup with typed schemas and CDS-styled error display |
| **State Management** | Zustand stores with typed async actions |
| **Charts** | Recharts (simple) + Highcharts (complex) with CDS theme integration |
| **Rich Text** | TipTap editor with CDS-styled toolbar |
| **Testing** | Vitest (unit) + Playwright (E2E) with CDS theme context |
| **Code Connect** | Figma Code Connect maps design components directly to React code |
| **Storybook** | Component documentation with CDS theme, a11y addon, and autodocs |
| **Deployment** | Docker + DevSpace + Kubernetes for ephemeral environments |

### Example Prompts

```
@cds-assist design a procurement dashboard
@cds-assist create a vendor registration form in Figma
@cds-assist build a work order list view with search and filters
@cds-assist redesign this page [paste Figma URL]
@cds-assist create a PLC dashboard, make it responsive for tablet and mobile
```

---

## Quick Start (2 commands)

### Prerequisites

| Requirement | Notes |
|------------|-------|
| **Node.js 20+** | [Download here](https://nodejs.org) (LTS recommended) |
| **Cursor** or **Claude Code** | [Download Cursor](https://cursor.com) or install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) |
| **Figma Desktop** | Required for design creation. [Download here](https://www.figma.com/downloads/) |
| **Figma Access Token** | [Create one here](https://help.figma.com/hc/en-us/articles/8085703771159) (optional — can add later) |

### Install

```bash
git clone https://github.com/rahulbhide-opengov/CDS-Assist-v3.git
cd CDS-Assist-v3 && ./setup
```

> **See [SETUP.md](SETUP.md) for the detailed walkthrough with screenshots and troubleshooting.**

### After Setup

1. **Restart your IDE** (required to pick up new skills and MCP)
2. Start designing:

```
@cds-assist design a procurement dashboard
```

---

## Architecture

### Semantic Skill System (13 skills)

CDS-Assist uses a semantic skill architecture where skills auto-load based on keywords in your prompt. Only relevant skills are loaded per request — no token bloat.

| Category | Skills | Activated by |
|----------|--------|-------------|
| **Core (2)** | Component Hierarchy, Core Principles | Every request |
| **Domain (7)** | Accessibility, Architecture, Business Logic, Copywriting, Figma Integration, Routing, Theme System | Keywords in prompt |
| **Patterns (4)** | Dashboard, List View, Form, Detail View | Pattern keywords |

**Example:** "build a dashboard" loads `dashboard-pattern` + `cds-core-principles` + `cds-theme-system`. "create a form" loads `form-pattern` + `cds-business-logic` + `cds-accessibility`.

### Dual Platform Support

| Platform | Agent Config | Skills | Rules |
|----------|-------------|--------|-------|
| **Cursor IDE** | `SKILL.md` + `rules/cds-assist.mdc` | `references/` (auto-loaded) | `.cursor/rules/` |
| **Claude Code** | `.claude/agents/cds-assist.md` | `.claude/skills/` (13 skills) | `.claude/guidelines.md` |

Both platforms share the same design system knowledge, tokens, templates, and patterns.

### Component Hierarchy

1. **CDS components** (`@opengov/components-*`) — always first choice
2. **MUI components + CDS theme** (`@opengov/capital-mui-theme`) — when no CDS equivalent exists
3. **Custom components + CDS tokens** — last resort, using design tokens from the theme

---

## Repository Structure

```
CDS-Assist-v3/
├── setup                               # One-command installer
├── SKILL.md                            # Main skill file (Cursor reads this)
├── cds-assist.config.json              # Figma library configuration
│
├── .claude/                            # Claude Code terminal support
│   ├── agents/cds-assist.md            # Agent identity + pattern detection
│   ├── commands/cds-assist.md          # /cds-assist slash command
│   ├── guidelines.md                   # CDS rules for Claude Code
│   ├── settings.json                   # Tool permissions
│   └── skills/                         # 13 semantic skills
│       ├── core/                       # Component hierarchy + core principles
│       ├── domain/                     # a11y, architecture, business-logic,
│       │                               #   copywriting, figma, routing, theme
│       └── patterns/                   # Dashboard, list, form, detail
│
├── references/                         # Auto-loaded reference docs (Cursor)
│   ├── react-codegen.md               # React code generation rules
│   ├── figma.md + figma-quality.md    # Figma design workflow
│   ├── component-catalog.md           # All CDS components with React props
│   ├── figma-library-catalog.md       # 113 core + 29 pattern + 7 icon sets
│   ├── accessibility.md               # WCAG 2.1 AA rules
│   └── products/                      # Domain references (EAM, PLC, PRO, FIN)
│
├── shared/                             # CDS tokens, engine, templates
│   ├── tokens/                        # colors, colors-dark, typography, spacing...
│   ├── templates/                     # React project scaffolding
│   │   └── src/
│   │       ├── components/
│   │       │   ├── charts/HighchartsWrapper.tsx.template
│   │       │   └── editors/RichTextEditor.tsx.template
│   │       ├── stores/dashboardStore.ts.template
│   │       ├── hooks/useForm.ts.template
│   │       ├── utils/mockDataGenerators.ts.template
│   │       ├── theme/
│   │       │   ├── index.ts.template
│   │       │   └── dark-theme-components.ts.template
│   │       └── pages/DashboardPage.tsx.template
│   ├── engine/                        # Figma ↔ React bridge, CLI
│   ├── domains/                       # Nav configs, personas, DB schema
│   └── validation/                    # Design token validation
│
├── docs/                              # Domain context
│   ├── personas.md                    # 6 government user personas
│   ├── suite-scope.md                 # B&P, EAM, PLC, PRO, FIN definitions
│   └── infra.md                       # Infrastructure overview
│
├── .storybook/                        # Storybook 9 configuration
│   ├── main.ts                        # React + Vite, a11y addon, autodocs
│   └── preview.ts                     # CDS ThemeProvider, light/dark toggle
│
├── .github/workflows/                 # CI/CD
│   ├── deploy-gh-pages.yml            # Deploy to GitHub Pages
│   └── docker-build.yml               # Build + push to GHCR
│
├── ee-deploy/                         # Kubernetes deployment
│   ├── deploy.yaml                    # Deployment manifest
│   ├── service.yaml                   # ClusterIP service
│   └── ingress.yaml                   # Ingress with TLS
│
├── Dockerfile                         # Multi-stage (node:20 → nginx)
├── devspace.yaml                      # DevSpace ephemeral environments
├── nginx/default.conf                 # SPA routing + caching
├── figma.config.json                  # Figma Code Connect config
├── vitest.config.ts                   # Unit test configuration
├── playwright.config.ts               # E2E test configuration
├── rules/cds-assist.mdc              # Cursor auto-routing rule
└── package.json
```

---

## Technology Stack

### Core

| Package | Purpose |
|---------|---------|
| `@opengov/capital-mui-theme` | CDS theme + design tokens |
| `@opengov/components-page-header` | PageHeaderComposable |
| `@opengov/components-nav-bar` | Suite navigation |
| `@opengov/react-capital-assets` | OpenGov icons + logos |
| `@mui/material` + `@mui/x-data-grid` | UI components with CDS theme |

### State & Forms

| Package | Purpose |
|---------|---------|
| `zustand` | Global state management |
| `react-hook-form` | Form state + validation |
| `yup` + `@hookform/resolvers` | Schema validation |

### Data Visualization

| Package | Purpose |
|---------|---------|
| `recharts` | Simple charts (bar, line, pie) |
| `highcharts` + `highcharts-react-official` | Complex charts (gantt, heatmap, treemap) |

### Rich Content

| Package | Purpose |
|---------|---------|
| `@tiptap/react` + `@tiptap/starter-kit` | Rich text editor |

### Data Generation

| Package | Purpose |
|---------|---------|
| `@faker-js/faker` | Seeded mock data generators |

### Testing

| Package | Purpose |
|---------|---------|
| `vitest` + `@testing-library/react` | Unit + component tests |
| `playwright` | E2E browser tests |

### Deployment

| Tool | Purpose |
|------|---------|
| Docker (multi-stage) | Containerized builds |
| DevSpace | Ephemeral environments |
| GitHub Actions | CI/CD pipelines |
| Kubernetes | Production deployment |

---

## CDS Design System

| Token | Value |
|-------|-------|
| Primary | `#4b3fff` (Blurple) |
| Secondary | `#546574` (Slate) |
| Font | DM Sans |
| Border radius | 4px |
| Spacing | 4px grid |
| Breakpoints | 1440 / 768 / 390 |
| Mode | Light + Dark |

### Figma Libraries

| Library | File Key | Contents |
|---------|----------|----------|
| **CDS 37** | `MxdeZ8e13qSmlenBVMmzzI` | 113 component sets, 486 color variables, 54 text styles |
| **CDS 37 Patterns** | `ovXZlZTFwlNBTISlap4s4p` | 29 component sets (navigation, layout, forms, AI) |
| **CDS 37 Icons** | `xaElUstGXrXTsCRKp2IOhF` | 567 standalone icons |
| **Agents** | `x2US3gmKKjSeby3troKJRa` | OG Assist / AI components |

---

## Design Rules (Enforced Automatically)

- **Global Navigation** on every screen (suite-specific variant when available)
- **PageHeaderComposable** from CDS library on every page (never hand-built)
- **Content parity** across all breakpoints — same data, adapted layout
- **No hardcoded values** — colors, spacing, typography from CDS tokens only
- **DM Sans** font family, always
- **4px spacing grid**, always
- **Light + dark mode** — semantic tokens adapt automatically
- **Accessibility** — 7-rule pre-output checklist validated on every component

---

## Contributing

1. Clone the repo and run `./setup`
2. Make changes to skills, references, or templates
3. Test by invoking `@cds-assist` in Cursor or Claude Code
4. Push changes — all users get updates via `git pull`

### Key Guidelines

- `SKILL.md` is the source of truth for Cursor agent behavior
- `.claude/` is the source of truth for Claude Code agent behavior
- `references/` files are self-contained — each loaded independently
- `shared/tokens/` must match CDS npm packages
- Never commit `.env`, `.figma-token`, or `config/`

---

## License

MIT
