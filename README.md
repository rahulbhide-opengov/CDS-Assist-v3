# CDS-Assist v3.0

**AI design-and-code engine for OpenGov.** Generate production-ready Figma designs and React code using the CDS (Capital Design System) — powered by Claude.

CDS-Assist is an AI agent skill that teaches Claude how to build OpenGov interfaces. It knows the complete CDS token system (colors, typography, spacing, sizing), all 86+ components across 4 Figma libraries, page patterns (dashboards, list views, forms, detail pages), responsive layouts, and WCAG 2.1 AA accessibility rules.

---

## What Can It Do?

| Capability | Description |
|-----------|-------------|
| **Figma Design** | Create complete, multi-breakpoint Figma designs using real CDS library components, tokens, and text styles — not hand-drawn rectangles |
| **React Code** | Generate production-ready React + TypeScript using the CDS component hierarchy (CDS first, themed MUI second, custom last) |
| **Both at Once** | Generate Figma and React in a single session, kept in sync |
| **Responsive** | Desktop (1440), Tablet (768), and Mobile (390) — same content, adapted layouts |
| **Design System Aware** | Knows every CDS token, component variant, page pattern, and product domain |

### Example Prompts

```
@cds-assist design a procurement dashboard
```
```
@cds-assist create a vendor registration form in Figma
```
```
@cds-assist build a work order list view with search and filters
```
```
@cds-assist redesign this page [paste Figma URL]
```
```
@cds-assist create a PLC dashboard, make it responsive for tablet and mobile
```

---

## Quick Start (2 commands)

### Prerequisites

| Requirement | Notes |
|------------|-------|
| **Node.js 18+** | [Download here](https://nodejs.org) (LTS recommended) |
| **Cursor** or **Claude Code** | [Download Cursor](https://cursor.com) or install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) |
| **Figma Desktop** | Required for design creation. [Download here](https://www.figma.com/downloads/) |
| **Figma Access Token** | [Create one here](https://help.figma.com/hc/en-us/articles/8085703771159) (optional — can add later) |

### Install

```bash
git clone https://github.com/opengov/CDS-Assist.git
cd CDS-Assist && ./setup
```

That's it. The `./setup` script will:

1. Check that Node.js 18+ is installed
2. Ask for your Figma access token (press Enter to skip)
3. Auto-detect your IDE (Cursor / Claude Code)
4. Install the skill, rules, and Figma MCP server
5. Copy the Figma Desktop Bridge plugin for easy import

> **See [SETUP.md](SETUP.md) for the detailed walkthrough with screenshots and troubleshooting.**

### After Setup

1. **Restart your IDE** (required to pick up new skills and MCP)
2. If using Figma: import the plugin at `figma-plugin/manifest.json`
   - Figma Desktop → Plugins → Development → Import plugin from manifest
3. In your Figma file, run: **Plugins → Development → Figma Desktop Bridge**
4. Start designing:

```
@cds-assist design a procurement dashboard
```

### Update

```bash
cd CDS-Assist && git pull
```

The installer uses symlinks — `git pull` refreshes everything instantly.

### Uninstall

```bash
bash scripts/install.sh --uninstall
```

---

## How It Works

When you type `@cds-assist` followed by a prompt, the agent:

1. **Detects intent** — Figma design, React code, or both
2. **Auto-loads references** — scans your prompt for keywords and loads the right reference docs (component catalogs, pattern guides, domain-specific docs)
3. **Asks for output mode** — React / Figma / Both (with smart defaults based on your prompt)
4. **Generates production-ready output** — using CDS tokens, library components, and proper patterns
5. **Verifies quality** — automated audit for hardcoded values, missing styles, layout issues

You never need to tell it which files to read or which components to use — it handles everything automatically.

### Component Hierarchy

The agent follows a strict precedence order:

1. **CDS components** (`@opengov/components-*`) — always first choice
2. **MUI components + CDS theme** (`@opengov/capital-mui-theme`) — when no CDS equivalent exists
3. **Custom components + CDS tokens** — last resort, using design tokens from the theme

### Design Rules (Enforced Automatically)

- **Global Navigation** on every screen (suite-specific variant when available)
- **PSP Menu** on every screen (visible sidebar on desktop, behind hamburger on mobile)
- **Page Heading** from the CDS library on every page (never hand-built)
- **Content parity** across all breakpoints — same data, adapted layout
- **No hardcoded values** — all colors, spacing, typography, and sizing come from CDS tokens
- **DM Sans** font family, always
- **4px spacing grid**, always
- **Light mode only** — CDS does not support dark mode

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

### Figma Libraries

| Library | File Key | Role | Contents |
|---------|----------|------|----------|
| **CDS 37** | `MxdeZ8e13qSmlenBVMmzzI` | Core | 113 component sets, 486 color variables, 54 text styles, 24 elevation styles |
| **CDS 37 Patterns** | `ovXZlZTFwlNBTISlap4s4p` | Patterns | 29 component sets (navigation, layout, forms, modals, AI patterns) |
| **CDS 37 Icons** | `xaElUstGXrXTsCRKp2IOhF` | Icons | 7 component sets + 567 standalone icons |
| **Agents** | `x2US3gmKKjSeby3troKJRa` | Product | Reference product file (OG Assist / OpenGov AI components) |

---

## Repository Structure

```
CDS-Assist/
├── setup                           # One-command installer (run this first!)
├── SKILL.md                        # Main skill file (what Claude reads)
├── SETUP.md                        # Detailed setup & usage guide
├── cds-assist.config.json          # Figma library configuration (4 libraries)
│
├── references/                     # Auto-loaded reference docs
│   ├── figma-quality.md            # Mandatory quality rules for Figma designs
│   ├── figma.md                    # Figma design creation workflow
│   ├── figma-library-catalog.md    # Complete catalog: 113 core + 29 pattern + 7 icon sets
│   ├── figma-icons-catalog.md      # 567 icon name-to-key mappings
│   ├── figma-tokens-catalog.md     # 54 text styles, 24 effect styles, all color variable keys
│   ├── component-catalog.md        # All CDS components with React props
│   ├── design-tokens.md            # CDS design token tables
│   ├── patterns.md                 # Page pattern templates
│   ├── page-patterns.md            # Page structure templates
│   ├── navigation-patterns.md      # Navigation patterns
│   ├── accessibility.md            # WCAG 2.1 AA rules
│   ├── react-codegen.md            # React code generation rules
│   ├── data-tables.md              # Data table patterns
│   ├── data-visualization.md       # Charts and visualization
│   ├── ai-experience.md            # AI/Agent UX patterns
│   ├── mobile-adaptation.md        # Responsive design
│   ├── copywriting.md              # UX writing guidelines
│   └── products/                   # Domain-specific references
│       ├── financials.md
│       ├── procurement.md
│       ├── permitting-licensing.md
│       ├── eam.md
│       ├── payroll.md
│       ├── tax-revenue.md
│       ├── erp-platform.md
│       └── chart-of-accounts.md
│
├── shared/                         # CDS design tokens & engine (TypeScript)
│   ├── tokens/                     # colors, typography, spacing, sizing, etc.
│   ├── types/                      # Shared TypeScript types
│   ├── engine/                     # Figma ↔ React bridge, CLI, validation
│   ├── templates/                  # React project scaffolding templates
│   ├── domains/                    # Navigation configs per OpenGov suite
│   └── validation/                 # Design validation rules
│
├── scripts/
│   └── install.sh                  # Advanced installer (more options, per-platform)
│
├── rules/
│   └── cds-assist.mdc              # Auto-routing Cursor rule (installed by setup)
│
└── package.json
```

### How the Pieces Fit Together

| File / Folder | Who reads it | Purpose |
|---------------|-------------|---------|
| `SKILL.md` | Claude (the AI) | Master instructions — workflow, rules, component hierarchy |
| `references/` | Claude (auto-loaded) | Progressive disclosure — only loaded when relevant to the prompt |
| `shared/tokens/` | Generated React code | TypeScript design tokens used in runtime code |
| `shared/engine/` | Build tooling | Figma ↔ React bridge, CLI, validation engine |
| `rules/cds-assist.mdc` | Cursor IDE | Auto-routes `@cds-assist` prompts to the skill |
| `setup` | You (the human) | One-time installer |
| `README.md` | You (GitHub) | This file — overview and quick start |
| `SETUP.md` | You (GitHub) | Detailed setup walkthrough and usage guide |

---

## Platform Support

| Platform | Skill | Rules | Figma MCP | Install |
|----------|-------|-------|-----------|---------|
| **Cursor** | Symlink | Auto-installed | Auto-configured in `mcp.json` | `./setup` |
| **Claude Code** | Symlink | N/A | `claude mcp add` | `./setup` |
| **Claude.ai** | Zip upload | N/A | Not supported (no MCP) | Manual |

---

## Figma Integration

CDS-Assist uses [Figma Console MCP](https://github.com/southleft/figma-console-mcp) for design creation. The installer configures it automatically.

### Figma Desktop Bridge Plugin

The installer copies the Figma Desktop Bridge plugin to `figma-plugin/`. This plugin connects Figma Desktop to the MCP server via WebSocket.

**One-time setup in Figma Desktop:**

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest**
3. Navigate to `CDS-Assist/figma-plugin/` and select `manifest.json`
4. In your Figma file, run: **Plugins → Development → Figma Desktop Bridge**

### Figma Capabilities

- Create components, frames, and layouts directly in Figma
- Import and configure CDS library components with correct variants
- Apply design tokens, text styles, and color variables
- Build responsive layouts across breakpoints
- Take screenshots for visual validation
- 57+ Figma tools available via MCP

---

## Contributing

1. Clone the repo
2. Run `./setup` to install locally
3. Make changes to `SKILL.md`, `references/`, or `shared/`
4. Test by invoking `@cds-assist` in Cursor
5. Push changes — all users get updates via `git pull`

### Key Guidelines

- **SKILL.md** is the source of truth for agent behavior
- **references/** files should be self-contained — each one is loaded independently
- **shared/tokens/** must match the CDS npm packages exactly
- **Never commit** `.env`, `.figma-token`, or `config/` (these are machine-specific)

---

## License

MIT
