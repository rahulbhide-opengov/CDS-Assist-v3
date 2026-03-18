#!/usr/bin/env node
/**
 * Design Token Validation Script
 *
 * Scans the codebase for hardcoded colors and other design token violations.
 * Can be run in CI to catch violations before merge.
 *
 * Usage:
 *   node scripts/validate-design-tokens.js [--fix] [--strict] [path...]
 *
 * Options:
 *   --fix     Show suggestions for fixing violations
 *   --strict  Fail on any violation (default: warn only)
 *   path...   Specific paths to check (default: src/)
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Color patterns to detect
const HEX_COLOR_REGEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const RGBA_REGEX = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)/gi;

// Allowed values that shouldn't trigger warnings
const ALLOWED_PATTERNS = [
  /transparent/i,
  /inherit/i,
  /currentColor/i,
  /none/i,
  // Theme token usages
  /theme\.palette\./,
  /capitalDesignTokens\./,
  /palette\.(primary|secondary|error|warning|info|success|grey|text|background|action|divider)/,
  // CSS custom properties (var())
  /var\(--/,
];

// File patterns to ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.min\.(js|css)$/,
  /dist\//,
  /build\//,
  /storybook-static/,
  /\.stories\.(tsx?|jsx?)$/, // Stories may have example colors
  /\.test\.(tsx?|jsx?)$/,
  /\.spec\.(tsx?|jsx?)$/,
];

// Common color mappings for suggestions
const COLOR_SUGGESTIONS = {
  // Greens (success)
  '#4caf50': 'theme.palette.success.main',
  '#22c55e': 'theme.palette.success.main',
  '#10b981': 'theme.palette.success.main',
  '#00C49F': 'theme.palette.success.main',
  '#66bb6a': 'theme.palette.success.light',
  '#81c784': 'theme.palette.success.light',

  // Reds (error)
  '#f44336': 'theme.palette.error.main',
  '#ef4444': 'theme.palette.error.main',
  '#e57373': 'theme.palette.error.light',
  '#d32f2f': 'theme.palette.error.dark',
  '#FF8042': 'theme.palette.error.light',

  // Yellows/Oranges (warning)
  '#ff9800': 'theme.palette.warning.main',
  '#ffa726': 'theme.palette.warning.main',
  '#f59e0b': 'theme.palette.warning.main',
  '#fbbf24': 'theme.palette.warning.main',
  '#FFBB28': 'theme.palette.warning.main',
  '#ffb74d': 'theme.palette.warning.light',
  '#f57c00': 'theme.palette.warning.dark',

  // Blues (primary/info)
  '#0088FE': 'theme.palette.primary.main',
  '#3b82f6': 'theme.palette.primary.main',
  '#4b3fff': 'theme.palette.primary.main',
  '#0ea5e9': 'theme.palette.info.main',
  '#06b6d4': 'theme.palette.info.main',
  '#29b6f6': 'theme.palette.info.main',
  '#67e8f9': 'theme.palette.info.light',

  // Purples (secondary)
  '#8884d8': 'theme.palette.secondary.main',
  '#ce93d8': 'theme.palette.secondary.main',
  '#ab47bc': 'theme.palette.secondary.dark',
  '#f472b6': 'theme.palette.secondary.light',

  // Grays
  '#9e9e9e': 'theme.palette.grey[500]',
  '#6b7280': 'theme.palette.grey[500]',
  '#82ca9d': 'theme.palette.grey[400]',

  // Dark mode backgrounds
  '#121212': 'theme.palette.background.default',
  '#1e1e1e': 'theme.palette.background.paper',
  '#2d2d2d': 'theme.palette.background.secondary',
  '#3d3d3d': 'theme.palette.action.hover',

  // Light mode backgrounds
  '#f9fafb': 'theme.palette.background.secondary',
  '#f8f8f8': 'theme.palette.background.secondary',
  '#ffffff': 'theme.palette.background.paper',
  '#fff': 'theme.palette.background.paper',

  // Borders/Dividers
  '#e5e7eb': 'theme.palette.divider',
  'rgba(255, 255, 255, 0.12)': 'theme.palette.divider',
  'rgba(0, 0, 0, 0.12)': 'theme.palette.divider',

  // Text colors
  'rgba(255, 255, 255, 0.87)': 'theme.palette.text.primary',
  'rgba(255, 255, 255, 0.7)': 'theme.palette.text.secondary',
  'rgba(255, 255, 255, 0.5)': 'theme.palette.text.disabled',
  'rgba(0, 0, 0, 0.87)': 'theme.palette.text.primary',
  'rgba(0, 0, 0, 0.6)': 'theme.palette.text.secondary',

  // Action states
  'rgba(255, 255, 255, 0.08)': 'theme.palette.action.hover',
  'rgba(255, 255, 255, 0.04)': 'theme.palette.action.hover',
  'rgba(0, 0, 0, 0.04)': 'theme.palette.action.hover',
};

class DesignTokenValidator {
  constructor(options = {}) {
    this.showFix = options.fix || false;
    this.strict = options.strict || false;
    this.violations = [];
    this.filesScanned = 0;
  }

  shouldIgnoreFile(filePath) {
    return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  shouldIgnoreLine(line) {
    // Ignore lines with allowed patterns
    return ALLOWED_PATTERNS.some(pattern => pattern.test(line));
  }

  isInComment(line, match, matchIndex) {
    // Check if the match is inside a comment
    const beforeMatch = line.substring(0, matchIndex);

    // Single-line comment
    if (beforeMatch.includes('//')) return true;

    // Multi-line comment start (simple check)
    if (beforeMatch.includes('/*') && !beforeMatch.includes('*/')) return true;

    // JSDoc or block comment
    if (beforeMatch.trim().startsWith('*')) return true;

    return false;
  }

  getSuggestion(color) {
    const normalizedColor = color.toLowerCase();
    return COLOR_SUGGESTIONS[normalizedColor] || COLOR_SUGGESTIONS[color] || null;
  }

  scanFile(filePath) {
    if (this.shouldIgnoreFile(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    this.filesScanned++;

    lines.forEach((line, lineIndex) => {
      if (this.shouldIgnoreLine(line)) return;

      // Check for hex colors
      let match;
      while ((match = HEX_COLOR_REGEX.exec(line)) !== null) {
        if (this.isInComment(line, match[0], match.index)) continue;

        this.violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          color: match[0],
          suggestion: this.getSuggestion(match[0]),
          context: line.trim().substring(0, 80),
        });
      }

      // Reset regex lastIndex
      HEX_COLOR_REGEX.lastIndex = 0;

      // Check for rgba colors
      while ((match = RGBA_REGEX.exec(line)) !== null) {
        if (this.isInComment(line, match[0], match.index)) continue;

        this.violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          color: match[0],
          suggestion: this.getSuggestion(match[0]),
          context: line.trim().substring(0, 80),
        });
      }

      RGBA_REGEX.lastIndex = 0;
    });
  }

  async scanDirectory(patterns) {
    const files = await glob(patterns, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    });

    for (const file of files) {
      this.scanFile(file);
    }
  }

  printReport() {
    console.log('\n📊 Design Token Validation Report\n');
    console.log(`Files scanned: ${this.filesScanned}`);
    console.log(`Violations found: ${this.violations.length}\n`);

    if (this.violations.length === 0) {
      console.log('✅ No hardcoded colors found!\n');
      return;
    }

    // Group by file
    const byFile = {};
    this.violations.forEach(v => {
      if (!byFile[v.file]) byFile[v.file] = [];
      byFile[v.file].push(v);
    });

    Object.entries(byFile).forEach(([file, violations]) => {
      console.log(`\n📁 ${file}`);
      violations.forEach(v => {
        console.log(`   Line ${v.line}:${v.column} - ${v.color}`);
        if (this.showFix && v.suggestion) {
          console.log(`   💡 Suggestion: ${v.suggestion}`);
        }
        console.log(`   Context: ${v.context}`);
      });
    });

    console.log('\n' + '─'.repeat(60));

    if (this.strict) {
      console.log('\n❌ Validation failed (strict mode)\n');
    } else {
      console.log('\n⚠️  Warnings found. Run with --fix for suggestions.\n');
    }
  }

  getExitCode() {
    if (this.violations.length === 0) return 0;
    return this.strict ? 1 : 0;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const options = {
    fix: args.includes('--fix'),
    strict: args.includes('--strict'),
  };

  const paths = args.filter(a => !a.startsWith('--'));
  const patterns = paths.length > 0 ? paths : ['src/**/*.{ts,tsx,js,jsx}'];

  const validator = new DesignTokenValidator(options);
  await validator.scanDirectory(patterns);
  validator.printReport();

  process.exit(validator.getExitCode());
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
