#!/usr/bin/env bash
set -euo pipefail

# CDS-Assist Agent Installer
# Installs the CDS-Assist agent for Cursor, Claude Code, and/or Claude.ai

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}[info]${NC} $1"; }
success() { echo -e "${GREEN}[ok]${NC} $1"; }
warn()    { echo -e "${YELLOW}[warn]${NC} $1"; }
error()   { echo -e "${RED}[error]${NC} $1"; }

header() {
  echo ""
  echo -e "${BOLD}========================================${NC}"
  echo -e "${BOLD}  CDS-Assist Agent Installer v2.0.0${NC}"
  echo -e "${BOLD}========================================${NC}"
  echo ""
}

# ---------------------------------------------------------------------------
# Uninstall mode
# ---------------------------------------------------------------------------

uninstall() {
  echo ""
  echo -e "${BOLD}Uninstalling CDS-Assist...${NC}"
  echo ""

  # Cursor
  if [ -L "$HOME/.cursor/skills/cds-assist" ]; then
    rm "$HOME/.cursor/skills/cds-assist"
    success "Removed Cursor skill symlink"
  fi
  if [ -f "$HOME/.cursor/rules/cds-assist.mdc" ]; then
    rm "$HOME/.cursor/rules/cds-assist.mdc"
    success "Removed Cursor rule"
  fi

  # Claude Code
  if [ -L "$HOME/.claude/skills/cds-assist" ]; then
    rm "$HOME/.claude/skills/cds-assist"
    success "Removed Claude Code skill symlink"
  fi

  REPO_DIR_UNINSTALL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

  # Figma plugin copy
  if [ -d "$REPO_DIR_UNINSTALL/figma-plugin" ]; then
    rm -rf "$REPO_DIR_UNINSTALL/figma-plugin"
    success "Removed Figma Desktop Bridge plugin copy"
  fi

  # Config and cache
  if [ -d "$REPO_DIR_UNINSTALL/config" ]; then
    rm -rf "$REPO_DIR_UNINSTALL/config"
    success "Removed config directory"
  fi
  if [ -d "$REPO_DIR_UNINSTALL/cache" ]; then
    rm -rf "$REPO_DIR_UNINSTALL/cache"
    success "Removed cache directory"
  fi
  if [ -d "$REPO_DIR_UNINSTALL/.figma-cache" ]; then
    rm -rf "$REPO_DIR_UNINSTALL/.figma-cache"
    success "Removed local cache directory"
  fi

  warn "MCP config entries were NOT removed (manual cleanup needed in mcp.json)"
  success "Uninstall complete."
  exit 0
}

if [[ "${1:-}" == "--uninstall" ]]; then
  uninstall
fi

# ---------------------------------------------------------------------------
# Prerequisites
# ---------------------------------------------------------------------------

header

info "Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
  error "Node.js is required but not installed."
  echo "  Install with: brew install node"
  echo "  Or download from: https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js 18+ required. Found: $(node -v)"
  exit 1
fi
success "Node.js $(node -v)"

# npm
if ! command -v npm &> /dev/null; then
  error "npm is required but not installed."
  exit 1
fi
success "npm $(npm -v)"

# git
if ! command -v git &> /dev/null; then
  error "git is required but not installed."
  exit 1
fi
success "git $(git --version | awk '{print $3}')"

echo ""

# ---------------------------------------------------------------------------
# Figma Access Token
# ---------------------------------------------------------------------------

info "Figma Console MCP requires a personal access token for design creation."
echo "  Get one at: https://help.figma.com/hc/en-us/articles/8085703771159"
echo ""

FIGMA_TOKEN=""
while true; do
  read -rp "Figma access token (starts with figd_): " FIGMA_TOKEN
  if [[ "$FIGMA_TOKEN" == figd_* ]]; then
    success "Token format valid"
    break
  elif [[ "$FIGMA_TOKEN" == "skip" || "$FIGMA_TOKEN" == "" ]]; then
    warn "Skipping Figma token. You can add it later to your MCP config."
    FIGMA_TOKEN=""
    break
  else
    warn "Token should start with 'figd_'. Type 'skip' to skip."
  fi
done

echo ""

# ---------------------------------------------------------------------------
# Platform Detection and Selection
# ---------------------------------------------------------------------------

info "Detecting available platforms..."

HAS_CURSOR=false
HAS_CLAUDE_CODE=false

if [ -d "$HOME/.cursor" ]; then
  HAS_CURSOR=true
  success "Cursor detected"
else
  info "Cursor not detected (~/.cursor/ not found)"
fi

if command -v claude &> /dev/null; then
  HAS_CLAUDE_CODE=true
  success "Claude Code detected"
else
  info "Claude Code not detected"
fi

echo ""

INSTALL_CURSOR=false
INSTALL_CLAUDE_CODE=false
INSTALL_CLAUDE_AI=false

if $HAS_CURSOR; then
  read -rp "Install for Cursor? [Y/n] " yn
  case $yn in
    [nN]*) ;;
    *) INSTALL_CURSOR=true ;;
  esac
fi

if $HAS_CLAUDE_CODE; then
  read -rp "Install for Claude Code? [Y/n] " yn
  case $yn in
    [nN]*) ;;
    *) INSTALL_CLAUDE_CODE=true ;;
  esac
fi

read -rp "Show Claude.ai upload instructions? [y/N] " yn
case $yn in
  [yY]*) INSTALL_CLAUDE_AI=true ;;
  *) ;;
esac

echo ""

# ---------------------------------------------------------------------------
# Install for Cursor
# ---------------------------------------------------------------------------

if $INSTALL_CURSOR; then
  info "Installing for Cursor..."

  # Create directories
  mkdir -p "$HOME/.cursor/skills"
  mkdir -p "$HOME/.cursor/rules"

  # Symlink skill folder
  if [ -L "$HOME/.cursor/skills/cds-assist" ]; then
    rm "$HOME/.cursor/skills/cds-assist"
  elif [ -d "$HOME/.cursor/skills/cds-assist" ]; then
    warn "Existing cds-assist skill directory found. Backing up to cds-assist.bak"
    mv "$HOME/.cursor/skills/cds-assist" "$HOME/.cursor/skills/cds-assist.bak"
  fi
  ln -s "$REPO_DIR" "$HOME/.cursor/skills/cds-assist"
  success "Symlinked skill: ~/.cursor/skills/cds-assist -> $REPO_DIR"

  # Install Cursor rule (substitute path placeholder)
  sed "s|__CDS_ASSIST_HOME__|$REPO_DIR|g" "$REPO_DIR/rules/cds-assist.mdc" \
    > "$HOME/.cursor/rules/cds-assist.mdc"
  success "Installed Cursor rule: ~/.cursor/rules/cds-assist.mdc"

  # Configure MCP (merge figma-console into existing config)
  MCP_FILE="$HOME/.cursor/mcp.json"

  if [ -n "$FIGMA_TOKEN" ]; then
    if [ -f "$MCP_FILE" ]; then
      # Check if figma-console already exists
      if grep -q '"figma-console"' "$MCP_FILE" 2>/dev/null; then
        info "figma-console already exists in Cursor MCP config. Skipping."
      else
        # Use node to safely merge JSON
        node -e "
          const fs = require('fs');
          const config = JSON.parse(fs.readFileSync('$MCP_FILE', 'utf8'));
          if (!config.mcpServers) config.mcpServers = {};
          config.mcpServers['figma-console'] = {
            command: 'npx',
            args: ['-y', 'figma-console-mcp@latest'],
            env: {
              FIGMA_ACCESS_TOKEN: '$FIGMA_TOKEN',
              ENABLE_MCP_APPS: 'true'
            }
          };
          fs.writeFileSync('$MCP_FILE', JSON.stringify(config, null, 2) + '\n');
        "
        success "Added figma-console to Cursor MCP config"
      fi
    else
      # Create new mcp.json
      node -e "
        const fs = require('fs');
        const config = {
          mcpServers: {
            'figma-console': {
              command: 'npx',
              args: ['-y', 'figma-console-mcp@latest'],
              env: {
                FIGMA_ACCESS_TOKEN: '$FIGMA_TOKEN',
                ENABLE_MCP_APPS: 'true'
              }
            }
          }
        };
        fs.writeFileSync('$MCP_FILE', JSON.stringify(config, null, 2) + '\n');
      "
      success "Created Cursor MCP config with figma-console"
    fi
  else
    info "No Figma token provided. Skipping MCP config."
  fi

  success "Cursor installation complete"
  echo ""
fi

# ---------------------------------------------------------------------------
# Install for Claude Code
# ---------------------------------------------------------------------------

if $INSTALL_CLAUDE_CODE; then
  info "Installing for Claude Code..."

  # Create skills directory
  mkdir -p "$HOME/.claude/skills"

  # Symlink skill folder
  if [ -L "$HOME/.claude/skills/cds-assist" ]; then
    rm "$HOME/.claude/skills/cds-assist"
  elif [ -d "$HOME/.claude/skills/cds-assist" ]; then
    warn "Existing cds-assist skill directory found. Backing up."
    mv "$HOME/.claude/skills/cds-assist" "$HOME/.claude/skills/cds-assist.bak"
  fi
  ln -s "$REPO_DIR" "$HOME/.claude/skills/cds-assist"
  success "Symlinked skill: ~/.claude/skills/cds-assist -> $REPO_DIR"

  # Add MCP server via Claude CLI
  if [ -n "$FIGMA_TOKEN" ]; then
    claude mcp add figma-console -s user \
      -e FIGMA_ACCESS_TOKEN="$FIGMA_TOKEN" \
      -e ENABLE_MCP_APPS=true \
      -- npx -y figma-console-mcp@latest 2>/dev/null \
      && success "Added figma-console MCP to Claude Code" \
      || warn "Could not add MCP via CLI. Add manually: claude mcp add figma-console ..."
  fi

  success "Claude Code installation complete"
  echo ""
fi

# ---------------------------------------------------------------------------
# Claude.ai Instructions
# ---------------------------------------------------------------------------

if $INSTALL_CLAUDE_AI; then
  echo ""
  echo -e "${BOLD}Claude.ai Upload Instructions:${NC}"
  echo ""
  echo "  1. Create a zip of the skill folder:"
  echo "     cd $REPO_DIR && zip -r cds-assist.zip SKILL.md references/ shared/"
  echo ""
  echo "  2. Open Claude.ai > Settings > Capabilities > Skills"
  echo ""
  echo "  3. Click 'Upload skill' and select cds-assist.zip"
  echo ""
  echo "  4. Toggle on the CDS-Assist skill"
  echo ""
  echo "  Note: Claude.ai does not support MCP servers."
  echo "  Figma integration requires Cursor or Claude Code."
  echo ""
fi

# ---------------------------------------------------------------------------
# Create config + cache directories
# ---------------------------------------------------------------------------

info "Setting up config and cache directories..."

mkdir -p "$REPO_DIR/config"
mkdir -p "$REPO_DIR/cache/figma"
mkdir -p "$REPO_DIR/.figma-cache"

# Create starter figma.sources.json if missing
SOURCES_FILE="$REPO_DIR/config/figma.sources.json"
if [ ! -f "$SOURCES_FILE" ]; then
  cat > "$SOURCES_FILE" << 'SOURCES_EOF'
{
  "version": 1,
  "sources": []
}
SOURCES_EOF
  success "Created starter config: config/figma.sources.json"
else
  info "Config already exists: config/figma.sources.json"
fi

echo ""

# ---------------------------------------------------------------------------
# Copy Figma Desktop Bridge Plugin to visible location
# ---------------------------------------------------------------------------

if [ -n "$FIGMA_TOKEN" ]; then
  info "Setting up Figma Desktop Bridge plugin..."

  PLUGIN_DEST="$REPO_DIR/figma-plugin"

  # Pre-fetch the package and find the bridge plugin
  BRIDGE_SRC=""
  NPX_CACHE=$(npm exec --yes -- figma-console-mcp --print-path 2>/dev/null || true)

  if [ -n "$NPX_CACHE" ] && [ -d "$NPX_CACHE/figma-desktop-bridge" ]; then
    BRIDGE_SRC="$NPX_CACHE/figma-desktop-bridge"
  else
    # Fallback: search the npx cache
    BRIDGE_SRC=$(find "$HOME/.npm/_npx" -path "*/figma-console-mcp/figma-desktop-bridge" -type d 2>/dev/null | head -1)
  fi

  if [ -z "$BRIDGE_SRC" ]; then
    # Last resort: trigger npx to cache the package, then search again
    npx -y figma-console-mcp@latest --help > /dev/null 2>&1 || true
    BRIDGE_SRC=$(find "$HOME/.npm/_npx" -path "*/figma-console-mcp/figma-desktop-bridge" -type d 2>/dev/null | head -1)
  fi

  if [ -n "$BRIDGE_SRC" ] && [ -d "$BRIDGE_SRC" ]; then
    rm -rf "$PLUGIN_DEST"
    cp -r "$BRIDGE_SRC" "$PLUGIN_DEST"
    success "Figma Desktop Bridge plugin copied to: $PLUGIN_DEST/"
    echo ""
    echo -e "  ${BOLD}IMPORTANT — One-time Figma setup:${NC}"
    echo "  1. Open Figma Desktop"
    echo "  2. Go to: Plugins > Development > Import plugin from manifest"
    echo -e "  3. Select: ${GREEN}$PLUGIN_DEST/manifest.json${NC}"
    echo "  4. Run it in your file: Plugins > Development > Figma Desktop Bridge"
    echo ""
  else
    warn "Could not locate Figma Desktop Bridge plugin."
    echo "  You can find it manually after first MCP use:"
    echo "  find ~/.npm/_npx -path '*/figma-desktop-bridge/manifest.json'"
    echo ""
  fi
fi

# ---------------------------------------------------------------------------
# Download CDS Design System Docs (optional)
# ---------------------------------------------------------------------------

echo ""
read -rp "Download CDS Design System documentation? [y/N] " yn
case $yn in
  [yY]*)
    CACHE_DIR="$REPO_DIR/.design-system-cache"
    if [ -d "$CACHE_DIR" ]; then
      info "Updating existing CDS Design System docs..."
      cd "$CACHE_DIR" && git pull --quiet
    else
      info "Cloning CDS Design System documentation..."
      git clone --quiet https://github.com/rahulbhide-opengov/CDS-Design-System.git "$CACHE_DIR"
    fi
    success "CDS Design System docs available at: $CACHE_DIR"
    ;;
  *)
    info "Skipping. You can clone it later: git clone https://github.com/rahulbhide-opengov/CDS-Design-System.git"
    ;;
esac

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo -e "${BOLD}========================================${NC}"
echo -e "${BOLD}  Installation Complete${NC}"
echo -e "${BOLD}========================================${NC}"
echo ""

echo -e "  Repo location: ${GREEN}$REPO_DIR${NC}"
echo ""

if $INSTALL_CURSOR; then
  echo -e "  ${GREEN}Cursor${NC}"
  echo "    Skill:  ~/.cursor/skills/cds-assist (symlink)"
  echo "    Rule:   ~/.cursor/rules/cds-assist.mdc"
  if [ -n "$FIGMA_TOKEN" ]; then
    echo "    MCP:    figma-console in ~/.cursor/mcp.json"
  fi
  echo "    Action: Restart Cursor to activate"
  echo ""
fi

if $INSTALL_CLAUDE_CODE; then
  echo -e "  ${GREEN}Claude Code${NC}"
  echo "    Skill:  ~/.claude/skills/cds-assist (symlink)"
  if [ -n "$FIGMA_TOKEN" ]; then
    echo "    MCP:    figma-console (user scope)"
  fi
  echo ""
fi

if [ -d "$REPO_DIR/figma-plugin" ]; then
  echo -e "  ${GREEN}Figma Desktop Bridge Plugin${NC}"
  echo "    Location: $REPO_DIR/figma-plugin/manifest.json"
  echo "    Import in Figma: Plugins > Development > Import plugin from manifest"
  echo ""
fi

echo -e "  ${GREEN}Config & Cache${NC}"
echo "    Sources:  $REPO_DIR/config/figma.sources.json"
echo "    Cache:    $REPO_DIR/cache/figma/"
echo "    Local:    $REPO_DIR/.figma-cache/"
echo ""

echo "  To update: cd $REPO_DIR && git pull"
echo "  To uninstall: bash $REPO_DIR/scripts/install.sh --uninstall"
echo ""

echo -e "${BOLD}  Next steps:${NC}"
echo ""
echo "  1. Add your CDS Figma library files:"
echo "     npm run cds:figma:libs:add -- --url \"<figma url>\" --name \"CDS Core\" --role core"
echo ""
echo "  2. Open Figma Desktop + run Desktop Bridge plugin"
echo ""
echo "  3. Ask Claude: \"@cds-assist design a procurement dashboard\""
echo ""
