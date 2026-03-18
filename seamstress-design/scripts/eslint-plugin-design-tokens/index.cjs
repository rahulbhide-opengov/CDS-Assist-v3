/**
 * ESLint Plugin: Design Tokens
 *
 * Custom ESLint rules to enforce design system consistency by detecting
 * hardcoded colors and other values that should use theme tokens.
 */

/** @type {import('eslint').Rule.RuleModule} */
const noHardcodedColors = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded color values in favor of theme tokens',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedColor: 'Avoid hardcoded color "{{color}}". Use theme tokens instead (e.g., theme.palette.primary.main, theme.palette.success.main).',
      hardcodedRgba: 'Avoid hardcoded rgba value "{{color}}". Use theme tokens instead (e.g., theme.palette.action.hover, theme.palette.divider).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedColors: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of allowed hardcoded colors (e.g., transparent, inherit, currentColor)',
          },
          ignorePatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Regex patterns to ignore (e.g., comments, specific files)',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedColors = new Set([
      'transparent',
      'inherit',
      'currentColor',
      'none',
      'initial',
      'unset',
      ...(options.allowedColors || []),
    ]);

    // Hex color patterns
    const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

    // RGB/RGBA patterns
    const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;

    // Check if value is a hardcoded color
    function isHardcodedColor(value) {
      if (typeof value !== 'string') return false;
      const trimmed = value.trim().toLowerCase();

      if (allowedColors.has(trimmed)) return false;

      return hexColorRegex.test(value) || rgbaRegex.test(value);
    }

    // Get the color type for the error message
    function getColorType(value) {
      if (hexColorRegex.test(value)) return 'hardcodedColor';
      if (rgbaRegex.test(value)) return 'hardcodedRgba';
      return 'hardcodedColor';
    }

    // Check if we're in a context where colors are expected
    function isColorProperty(propertyName) {
      const colorProperties = new Set([
        'color',
        'backgroundColor',
        'background',
        'borderColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
        'outlineColor',
        'fill',
        'stroke',
        'stopColor',
        'floodColor',
        'lightingColor',
        'textDecorationColor',
        'caretColor',
        'columnRuleColor',
        'accentColor',
      ]);
      return colorProperties.has(propertyName);
    }

    // Check if we're in a chart/visualization context (more lenient)
    function isChartContext(node) {
      let parent = node.parent;
      while (parent) {
        if (parent.type === 'JSXElement') {
          const elementName = parent.openingElement?.name?.name;
          // Common chart library components
          if (['Cell', 'Line', 'Bar', 'Area', 'Pie', 'Scatter'].includes(elementName)) {
            return true;
          }
        }
        parent = parent.parent;
      }
      return false;
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value !== 'string') return;

        if (!isHardcodedColor(node.value)) return;

        // Skip if in a chart context (charts often need specific colors)
        // But still warn - they should ideally use theme too
        const messageId = getColorType(node.value);

        context.report({
          node,
          messageId,
          data: { color: node.value },
        });
      },

      // Check template literals
      TemplateLiteral(node) {
        // Only check simple template literals without expressions
        if (node.expressions.length > 0) return;

        const value = node.quasis[0]?.value?.raw;
        if (!value || !isHardcodedColor(value)) return;

        const messageId = getColorType(value);

        context.report({
          node,
          messageId,
          data: { color: value },
        });
      },
    };
  },
};

/** @type {import('eslint').ESLint.Plugin} */
module.exports = {
  meta: {
    name: 'eslint-plugin-design-tokens',
    version: '1.0.0',
  },
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
  },
  configs: {
    recommended: {
      rules: {
        'design-tokens/no-hardcoded-colors': 'warn',
      },
    },
    strict: {
      rules: {
        'design-tokens/no-hardcoded-colors': 'error',
      },
    },
  },
};
