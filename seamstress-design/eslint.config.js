// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// Custom design tokens plugin
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const designTokensPlugin = require('./scripts/eslint-plugin-design-tokens/index.cjs');

export default tseslint.config([
  globalIgnores(['dist', 'lib', 'node_modules', '.worktrees', 'storybook-static', '**/*.min.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      'design-tokens': designTokensPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // Warn on hardcoded colors - set to 'error' for strict enforcement
      'design-tokens/no-hardcoded-colors': 'warn',

      // Accessibility rules (jsx-a11y)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      // Warning mode for rules that may need case-by-case review
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
], storybook.configs["flat/recommended"]);
