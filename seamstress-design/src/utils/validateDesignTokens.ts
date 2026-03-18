import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import type {
  FigmaToTokenMapping,
  TokenValidationResult,
  ValidatedTokenReference,
  FigmaVariable,
} from '../types/figma-variables';

/**
 * Validates that Figma variables map correctly to design tokens
 * This ensures consistency between Figma designs and code implementation
 */
export function validateFigmaTokenMapping(
  figmaVariables: FigmaVariable[],
  mode: 'Light' | 'Dark' = 'Light'
): TokenValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const mappedTokens: ValidatedTokenReference<keyof FigmaToTokenMapping>[] = [];

  figmaVariables.forEach((variable) => {
    const tokenPath = mapFigmaVariableToToken(variable.name);

    if (!tokenPath) {
      warnings.push(`No token mapping found for Figma variable: ${variable.name}`);
      return;
    }

    const tokenValue = getTokenValue(tokenPath);

    if (!tokenValue) {
      errors.push(`Token path ${tokenPath} does not exist in design system`);
      return;
    }

    const figmaValue = getFigmaVariableValue(variable, mode);

    if (figmaValue && !valuesMatch(tokenValue, figmaValue)) {
      warnings.push(
        `Value mismatch for ${variable.name}: Figma=${figmaValue}, Token=${tokenValue}`
      );
    }

    mappedTokens.push({
      figmaVariable: variable.name as keyof FigmaToTokenMapping,
      tokenPath: tokenPath as any,
      value: tokenValue,
      validated: true,
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    mappedTokens,
  };
}

/**
 * Maps Figma variable names to design token paths
 */
function mapFigmaVariableToToken(variableName: string): string | null {
  // Convert Figma naming convention to token path
  // e.g., "Color/Primary/500" -> "colors.primary500"
  const mappings: Record<string, string> = {
    // Color mappings
    'Color/Primary/Base': 'foundations.colors.blurple700',
    'Color/Primary/Light': 'foundations.colors.blurple100',
    'Color/Primary/Dark': 'foundations.colors.blurple900',
    'Color/Success': 'semanticColors.foreground.successLarge',
    'Color/Error': 'semanticColors.foreground.errorLarge',
    'Color/Warning': 'semanticColors.foreground.warningLarge',
    'Color/Info': 'semanticColors.foreground.infoLarge',

    // Spacing mappings
    'Spacing/XS': 'foundations.units.unitHalf',
    'Spacing/SM': 'foundations.units.unit1',
    'Spacing/MD': 'foundations.units.unit2',
    'Spacing/LG': 'foundations.units.unit3',
    'Spacing/XL': 'foundations.units.unit4',

    // Typography mappings
    'Typography/H1': 'foundations.typography.fontSize.h1',
    'Typography/H2': 'foundations.typography.fontSize.h2',
    'Typography/H3': 'foundations.typography.fontSize.h3',
    'Typography/Body': 'foundations.typography.fontSize.bodyDefault',
    'Typography/Caption': 'foundations.typography.fontSize.bodyXSmall',
  };

  return mappings[variableName] || null;
}

/**
 * Gets the value of a design token by path
 */
function getTokenValue(tokenPath: string): string | number | null {
  const pathParts = tokenPath.split('.');
  let value: any = capitalDesignTokens;

  for (const part of pathParts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return null;
    }
  }

  return value;
}

/**
 * Extracts the value of a Figma variable for a specific mode
 */
function getFigmaVariableValue(
  variable: FigmaVariable,
  mode: 'Light' | 'Dark'
): string | number | null {
  const modeId = Object.keys(variable.valuesByMode).find((key) =>
    key.toLowerCase().includes(mode.toLowerCase())
  );

  if (!modeId) {
    return null;
  }

  const value = variable.valuesByMode[modeId];

  if (value.type === 'COLOR' || value.type === 'STRING') {
    return value.value as string;
  } else if (value.type === 'FLOAT') {
    return value.value as number;
  }

  return null;
}

/**
 * Checks if two values match (with type coercion for colors)
 */
function valuesMatch(tokenValue: string | number, figmaValue: string | number): boolean {
  if (typeof tokenValue === typeof figmaValue) {
    return tokenValue === figmaValue;
  }

  // Handle color format differences (hex vs rgba)
  if (typeof tokenValue === 'string' && typeof figmaValue === 'string') {
    return normalizeColor(tokenValue) === normalizeColor(figmaValue);
  }

  return false;
}

/**
 * Normalizes color values for comparison
 */
function normalizeColor(color: string): string {
  // Remove spaces and convert to lowercase
  return color.replace(/\s/g, '').toLowerCase();
}

/**
 * Validates that no hardcoded values are used in styles
 */
export function validateNoHardcodedValues(
  styleObject: Record<string, any>,
  filePath: string
): string[] {
  const violations: string[] = [];

  function checkValue(key: string, value: any, path: string) {
    if (typeof value === 'string') {
      // Check for hardcoded colors (hex, rgb, rgba)
      if (value.match(/^#[0-9a-fA-F]{3,6}$/) || value.startsWith('rgb')) {
        violations.push(`${filePath}: Hardcoded color "${value}" at ${path}.${key}`);
      }

      // Check for hardcoded spacing (px, rem values)
      if (value.match(/^\d+(\.\d+)?(px|rem|em)$/)) {
        violations.push(`${filePath}: Hardcoded spacing "${value}" at ${path}.${key}`);
      }
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([k, v]) => {
        checkValue(k, v, `${path}.${key}`);
      });
    }
  }

  Object.entries(styleObject).forEach(([key, value]) => {
    checkValue(key, value, 'style');
  });

  return violations;
}

/**
 * Generates a report of token usage in the codebase
 */
export function generateTokenUsageReport(
  usedTokens: Set<string>,
  availableTokens: string[]
): {
  coverage: number;
  unusedTokens: string[];
  unknownTokens: string[];
} {
  const unusedTokens = availableTokens.filter((token) => !usedTokens.has(token));
  const unknownTokens = Array.from(usedTokens).filter(
    (token) => !availableTokens.includes(token)
  );

  const coverage = ((availableTokens.length - unusedTokens.length) / availableTokens.length) * 100;

  return {
    coverage,
    unusedTokens,
    unknownTokens,
  };
}

/**
 * Helper to extract all available token paths from the design system
 */
export function getAllTokenPaths(): string[] {
  const paths: string[] = [];

  function extractPaths(obj: any, prefix = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        extractPaths(value, currentPath);
      } else {
        paths.push(currentPath);
      }
    });
  }

  extractPaths(capitalDesignTokens);
  return paths;
}