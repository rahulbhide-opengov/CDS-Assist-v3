/**
 * Theme Editor Token Utilities
 *
 * Functions to extract and work with design tokens from CDS Design System
 */

import { cdsDesignTokens } from '../../theme/cds';
import type { ColorToken } from './types';

/**
 * Extracts all color tokens from cdsDesignTokens
 */
export function extractColorTokens(): ColorToken[] {
  const tokens: ColorToken[] = [];

  // Extract from foundations.colors
  if (cdsDesignTokens.foundations?.colors) {
    Object.entries(cdsDesignTokens.foundations.colors).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        tokens.push({
          path: `foundations.colors.${key}`,
          value,
          category: 'Foundations',
          subcategory: 'Colors',
          displayName: formatTokenName(key),
        });
      }
    });
  }

  // Extract from semanticColors
  if (cdsDesignTokens.semanticColors) {
    Object.entries(cdsDesignTokens.semanticColors).forEach(([category, subcategories]) => {
      if (typeof subcategories === 'object' && subcategories !== null) {
        Object.entries(subcategories).forEach(([subkey, value]) => {
          if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgba'))) {
            tokens.push({
              path: `semanticColors.${category}.${subkey}`,
              value,
              category: 'Semantic',
              subcategory: formatTokenName(category),
              displayName: formatTokenName(subkey),
            });
          }
        });
      }
    });
  }

  return tokens;
}

/**
 * Gets a token value by path
 */
export function getTokenValue(tokenPath?: string): string | null {
  // Handle undefined or null tokenPath
  if (!tokenPath) {
    return null;
  }

  const pathParts = tokenPath.split('.');
  let value: any = cdsDesignTokens;

  for (const part of pathParts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return null;
    }
  }

  return typeof value === 'string' ? value : null;
}

/**
 * Formats a token name for display
 */
function formatTokenName(name: string): string {
  // Convert camelCase to Title Case with spaces
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/([0-9]+)/g, ' $1')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Groups tokens by category and subcategory
 */
export function groupTokensByCategory(tokens: ColorToken[]): Record<string, Record<string, ColorToken[]>> {
  const grouped: Record<string, Record<string, ColorToken[]>> = {};

  tokens.forEach((token) => {
    if (!grouped[token.category]) {
      grouped[token.category] = {};
    }

    const subcategory = token.subcategory || 'Other';
    if (!grouped[token.category][subcategory]) {
      grouped[token.category][subcategory] = [];
    }

    grouped[token.category][subcategory].push(token);
  });

  return grouped;
}

/**
 * Filters tokens by search query
 */
export function filterTokens(tokens: ColorToken[], query: string): ColorToken[] {
  if (!query.trim()) {
    return tokens;
  }

  const lowerQuery = query.toLowerCase();
  return tokens.filter(
    (token) =>
      token.displayName.toLowerCase().includes(lowerQuery) ||
      token.path.toLowerCase().includes(lowerQuery) ||
      token.value.toLowerCase().includes(lowerQuery) ||
      token.category.toLowerCase().includes(lowerQuery) ||
      token.subcategory?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Checks if a color is light or dark (for contrast text)
 */
export function isLightColor(color: string): boolean {
  // Remove # if present
  const hex = color.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
}

/**
 * Suggests a contrast text color based on background color
 */
export function suggestContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? cdsDesignTokens.foundations.colors.black : cdsDesignTokens.foundations.colors.white;
}
