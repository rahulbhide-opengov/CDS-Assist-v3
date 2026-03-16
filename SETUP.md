# CDS-Assist Setup & Usage Guide

A step-by-step guide to installing CDS-Assist and creating your first design. No development experience required.

---

## Table of Contents

1. [What You'll Need](#1-what-youll-need)
2. [Install Node.js](#2-install-nodejs)
3. [Get a Figma Access Token](#3-get-a-figma-access-token)
4. [Install Cursor IDE](#4-install-cursor-ide)
5. [Clone and Run Setup](#5-clone-and-run-setup)
6. [Connect Figma Desktop](#6-connect-figma-desktop)
7. [Verify Everything Works](#7-verify-everything-works)
8. [Your First Design](#8-your-first-design)
9. [Usage Guide](#9-usage-guide)
10. [Updating](#10-updating)
11. [Troubleshooting](#11-troubleshooting)
12. [Uninstalling](#12-uninstalling)

---

## 1. What You'll Need

| Tool | Required? | What it does |
|------|-----------|-------------|
| **Node.js 18+** | Yes | Runs the Figma MCP server |
| **Cursor IDE** or **Claude Code** | Yes | The AI-powered editor that runs CDS-Assist |
| **Figma Desktop** | For designs | Required to create Figma designs (not needed for React-only) |
| **Figma Access Token** | For designs | Lets the AI talk to Figma (free, takes 30 seconds to create) |
| **Git** | Yes | To clone and update the repo |

**Time to complete:** ~10 minutes.

---

## 2. Install Node.js

If you already have Node.js 18+, skip this step. Check by running:

```bash
node -v
```

If it shows `v18.x.x` or higher, you're good. Otherwise:

### macOS

```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org) (choose "LTS").

### Windows

Download from [nodejs.org](https://nodejs.org) and run the installer.

### Linux

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 3. Get a Figma Access Token

> Skip this step if you only plan to generate React code (no Figma designs).

1. Open [Figma](https://www.figma.com) in your browser
2. Click your **profile icon** (top-right) → **Settings**
3. Scroll down to **Personal access tokens**
4. Click **Generate new token**
5. Give it a name (e.g., "CDS-Assist")
6. Copy the token — it starts with `figd_`
7. **Save it somewhere safe** — you'll need it during setup

> Detailed instructions: [Figma help article](https://help.figma.com/hc/en-us/articles/8085703771159)

---

## 4. Install Cursor IDE

If you don't have Cursor yet:

1. Go to [cursor.com](https://cursor.com)
2. Download and install for your platform
3. Open Cursor and complete the initial setup

> **Alternative:** You can use [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instead of Cursor. The setup script supports both.

---

## 5. Clone and Run Setup

Open your terminal (Terminal app on macOS, Command Prompt on Windows) and run:

```bash
git clone https://github.com/rahulbhide-opengov/CDS-Assist-v3.git
cd CDS-Assist-v3
./setup
```

The setup script will walk you through everything:

```
  CDS-Assist Setup
  ─────────────────

✓ Node.js v20.11.0

  Figma Access Token (needed for design creation)
  Get one at: https://help.figma.com/hc/en-us/articles/8085703771159
  Press Enter to skip (you can add it later).

  Token: figd_xxxxxxxxxxxxx

→ Detected Cursor IDE — installing...
✓ Skill linked → ~/.cursor/skills/cds-assist
✓ Rule installed → ~/.cursor/rules/cds-assist.mdc
✓ Figma MCP added to ~/.cursor/mcp.json
→ Setting up Figma Desktop Bridge plugin...
✓ Figma plugin ready at figma-plugin/

  ✅ Setup complete!
```

### What the setup script does

| Step | What happens | Where |
|------|-------------|-------|
| 1 | Checks Node.js 18+ is installed | — |
| 2 | Asks for your Figma token (optional) | — |
| 3 | Symlinks the skill to your IDE | `~/.cursor/skills/cds-assist` |
| 4 | Installs the auto-routing rule | `~/.cursor/rules/cds-assist.mdc` |
| 5 | Adds the Figma MCP server to IDE config | `~/.cursor/mcp.json` |
| 6 | Copies the Figma Desktop Bridge plugin | `CDS-Assist-v3/figma-plugin/` |

### Skipped the Figma token?

You can add it later by editing `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma-console": {
      "command": "npx",
      "args": ["-y", "figma-console-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_YOUR_TOKEN_HERE",
        "ENABLE_MCP_APPS": "true"
      }
    }
  }
}
```

Then restart Cursor.

---

## 6. Connect Figma Desktop

> Skip this step if you only plan to generate React code.

The Figma Desktop Bridge plugin connects Figma to the AI agent via WebSocket. This is a **one-time setup**.

### Import the Plugin

1. Open **Figma Desktop** (not the browser version)
2. Open any Figma file (or create a new one)
3. Go to **Plugins → Development → Import plugin from manifest**
4. Navigate to the `CDS-Assist-v3/figma-plugin/` folder inside the repo you cloned
5. Select `manifest.json` and click **Open**

### Run the Plugin

Every time you want the AI to create designs in a Figma file:

1. Open the Figma file you want to work in
2. Go to **Plugins → Development → Figma Desktop Bridge**
3. You should see a small dialog confirming the WebSocket connection is active

> The plugin must be running in the Figma file where you want designs created. If you switch files, run it again in the new file.

---

## 7. Verify Everything Works

1. **Restart Cursor** (or Claude Code) — this is required to load the new skill and MCP server
2. Open any project folder in Cursor
3. In the chat panel, type:

```
@cds-assist hello
```

If the agent responds and mentions CDS Design System, you're all set.

### Verify Figma Connection

If you set up Figma, also test:

```
@cds-assist take a screenshot of my current Figma file
```

If it returns a screenshot, the Figma MCP connection is working.

---

## 8. Your First Design

Let's create a simple dashboard. Make sure:
- Cursor is open
- Figma Desktop Bridge is running in your Figma file

Then type:

```
@cds-assist design a procurement dashboard with KPI cards, a bar chart, and a recent orders table
```

The agent will:
1. Ask you if you want React, Figma, or both
2. Auto-load all relevant reference docs
3. Create the design with proper CDS components, tokens, and patterns
4. Show you a screenshot of the result

### More Examples

**Dashboard with responsive views:**
```
@cds-assist design a PLC dashboard, make it responsive for tablet and mobile
```

**Form page:**
```
@cds-assist design a vendor registration form with company info, contacts, and document upload
```

**React code from a Figma URL:**
```
@cds-assist create a React version of this: https://www.figma.com/design/xxx/yyy
```

**Both Figma and React:**
```
@cds-assist design and build a work order list view with search, filters, and status badges
```

---

## 9. Usage Guide

### Invoking CDS-Assist

Always start your prompt with `@cds-assist`. The agent activates automatically when it sees this mention.

### Output Modes

| Mode | When to use |
|------|------------|
| **React only** | Building front-end code for an existing project |
| **Figma only** | Creating visual designs and prototypes |
| **Both** | Full end-to-end — Figma design + matching React code |

The agent will ask which mode you want (or auto-detect from your prompt).

### What Happens Automatically

You don't need to manage any of this — the agent does it all:

- **Reference loading** — scans your prompt for keywords like "dashboard", "form", "Figma", "procurement" and loads the relevant reference docs
- **Component selection** — picks the right CDS component for each UI element
- **Token usage** — applies CDS colors, typography, spacing, and sizing tokens
- **Responsive layout** — creates desktop, tablet, and mobile breakpoints with the same content
- **Quality validation** — checks for hardcoded values, missing components, and accessibility issues

### CDS Mandatory Elements

Every screen the agent creates includes:

| Element | Desktop | Tablet/Mobile |
|---------|---------|--------------|
| **Global Navigation** | Full width at top | Full width at top with hamburger |
| **PSP Menu** | 320px left sidebar | Hidden behind hamburger menu |
| **Page Heading** | CDS library component | CDS library component (small screen variant) |

### Product-Specific Designs

Mention the OpenGov product suite and the agent will use the correct navigation variant and domain patterns:

```
@cds-assist design a Procurement purchase order detail page
```
```
@cds-assist design a Permitting & Licensing inspection schedule
```
```
@cds-assist design an Asset Management work order form
```

Supported products: Procurement, B&P (Budgeting & Planning), Utility Billing, Asset Management, Agents Studio, Vendor Portal, Command Center, Permitting & Licensing, Financials, Tax & Revenue, Payroll, ERP Platform.

### React Code Standards

Generated React code follows these rules:

1. **CDS components first** — `@opengov/components-*`
2. **MUI components with CDS theme** — when no CDS equivalent
3. **Custom components with CDS tokens** — last resort
4. **No hardcoded values** — colors, spacing, typography all from the theme
5. **Responsive** — uses `useMediaQuery` and responsive `sx` props
6. **TypeScript** — all components are typed, using `import type` for type-only imports

---

## 10. Updating

The installer uses symlinks, so updating is instant:

```bash
cd CDS-Assist-v3
git pull
```

No need to re-run setup. Just restart Cursor to pick up any new rules.

---

## 11. Troubleshooting

### "Node.js is required but not found"

Install Node.js 18+ from [nodejs.org](https://nodejs.org).

### "@cds-assist doesn't respond" or "skill not found"

1. Make sure you restarted Cursor after running `./setup`
2. Check the symlink exists: `ls -la ~/.cursor/skills/cds-assist`
3. Check the rule exists: `ls -la ~/.cursor/rules/cds-assist.mdc`

### "Figma MCP connection failed"

1. Make sure Figma Desktop is open (not the browser version)
2. Make sure the Desktop Bridge plugin is running in your file
3. Check your token is valid — try regenerating it in Figma settings
4. Verify `~/.cursor/mcp.json` contains the `figma-console` entry with your token

### "Component import timed out" in Figma

Some complex CDS components (like PSP Menu) may time out during import. The agent handles this automatically by either:
- Cloning from an existing instance in the file
- Building the component manually using CDS patterns

This is expected behavior — the end result is visually identical.

### Figma plugin shows "WebSocket disconnected"

1. Close and reopen the Figma Desktop Bridge plugin
2. If that doesn't work, restart Figma Desktop
3. Make sure no firewall is blocking localhost WebSocket connections

### Setup script fails on Windows

The `./setup` script requires bash. On Windows, use:
- **Git Bash** (comes with Git for Windows)
- **WSL** (Windows Subsystem for Linux)
- **PowerShell** with Git Bash: `bash ./setup`

### React dev server won't start

1. Make sure dependencies are installed: `npm install` in the React project directory
2. Check for TypeScript errors: `npx tsc --noEmit`
3. The agent generates code for a Vite + React + TypeScript stack — make sure your project matches

---

## 12. Uninstalling

### Quick Uninstall

```bash
bash scripts/install.sh --uninstall
```

This removes:
- Cursor skill symlink (`~/.cursor/skills/cds-assist`)
- Cursor rule (`~/.cursor/rules/cds-assist.mdc`)
- Claude Code skill symlink (`~/.claude/skills/cds-assist`)
- Local config and cache directories

### Manual Cleanup

The uninstaller does **not** remove the MCP entry from `~/.cursor/mcp.json`. To remove it manually, open the file and delete the `"figma-console"` block.

### Delete the Repo

After uninstalling, you can safely delete the cloned repo:

```bash
rm -rf CDS-Assist-v3
```

---

## Appendix: Advanced Setup (scripts/install.sh)

The `./setup` script at the root is the recommended installer for most users. For more control, use the advanced installer:

```bash
bash scripts/install.sh
```

This provides:
- Per-platform install selection (Cursor / Claude Code / Claude.ai)
- Claude.ai upload instructions (zip-based, no MCP)
- Optional CDS Design System documentation download
- Verbose output with full paths

### Claude.ai (No MCP)

CDS-Assist works on Claude.ai for React code generation (no Figma). To upload:

```bash
cd CDS-Assist-v3
zip -r cds-assist.zip SKILL.md references/ shared/
```

Then in Claude.ai: Settings → Capabilities → Skills → Upload skill → select `cds-assist.zip`.

---

## Need Help?

- Check the [Troubleshooting](#11-troubleshooting) section above
- Open an issue on GitHub
- Reach out to the CDS Design System team
