/**
 * CDS-Assist token validation utilities.
 * Validates code against CDS design tokens for consistency.
 *
 * @module shared/validation/validate-tokens
 */

import { cdsColors, cdsSpacing } from '../tokens';

/** Single validation finding. */
export interface ValidationResult {
  file?: string;
  line?: number;
  column?: number;
  message: string;
  value?: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

/** Token usage report with coverage metrics. */
export interface Report {
  coverage: number;
  totalFiles: number;
  filesWithViolations: number;
  totalViolations: number;
  colorViolations: number;
  spacingViolations: number;
  unknownTokens: string[];
  suggestions: string[];
}

/** Recursively collects hex color values from an object. */
function collectHexColors(obj: Record<string, unknown>): Set<string> {
  const result = new Set<string>();
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' && v.startsWith('#')) {
      result.add(v.toLowerCase());
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      collectHexColors(v as Record<string, unknown>).forEach((c) => result.add(c));
    }
  }
  return result;
}

/** Flattened set of valid CDS hex colors. */
const CDS_VALID_HEX_COLORS = collectHexColors(cdsColors as unknown as Record<string, unknown>);

/** Valid CDS spacing values (px). */
const CDS_VALID_SPACING = new Set<number>(Object.values(cdsSpacing.values));

/** Figma variable for cross-checking. */
export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, { type: string; value: string | number }>;
}

/** CDS tokens shape for mapping. */
export interface CDSTokens {
  colors?: typeof cdsColors;
  spacing?: typeof cdsSpacing;
  [key: string]: unknown;
}

const HEX_REGEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;

/** Forbidden colors (old branding) - reported as error. */
const CDS_FORBIDDEN_COLORS = new Set(['#3b82f6', '#9c27b0']);
const PX_REGEX = /(\d+(?:\.\d+)?)\s*px/g;

/**
 * Scans code for hex colors not in the CDS palette.
 * @param code - Source code string to scan
 * @returns Array of validation results
 */
export function validateNoHardcodedColors(code: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const matches = line.matchAll(HEX_REGEX);
    for (const match of matches) {
      const hex = match[0].toLowerCase();
      if (!CDS_VALID_HEX_COLORS.has(hex)) {
        const isForbidden = CDS_FORBIDDEN_COLORS.has(hex);
        results.push({
          line: index + 1,
          message: `Hardcoded color "${match[0]}" is not in CDS palette. Use a token from cdsColors.`,
          value: match[0],
          severity: isForbidden ? 'error' : 'warning',
          suggestion: 'Replace with cdsColors.primary.main, cdsColors.grey[500], etc.',
        });
      }
    }
  });

  return results;
}

/**
 * Scans code for px values not in the CDS spacing scale.
 * @param code - Source code string to scan
 * @returns Array of validation results
 */
export function validateNoHardcodedSpacing(code: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const matches = line.matchAll(PX_REGEX);
    for (const match of matches) {
      const px = parseFloat(match[1]);
      if (!Number.isNaN(px) && !CDS_VALID_SPACING.has(px)) {
        results.push({
          line: index + 1,
          message: `Hardcoded spacing "${match[0]}" is not in CDS spacing scale. Use cdsSpacing.values.`,
          value: match[0],
          severity: 'warning',
          suggestion: `Use cdsSpacing.values (0, 2, 4, 6, 8, 12, 16, 18, 20, 24, 28, 32) or cdsSpacing.responsive.`,
        });
      }
    }
  });

  return results;
}

/**
 * Cross-checks Figma variables against CDS tokens.
 * @param figmaVars - Figma variable definitions
 * @param cdsTokens - CDS token object (defaults to cdsColors + cdsSpacing)
 * @returns Array of validation results
 */
export function validateFigmaTokenMapping(
  figmaVars: FigmaVariable[],
  cdsTokens: CDSTokens = { colors: cdsColors, spacing: cdsSpacing }
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const colorTokens = cdsTokens.colors ?? cdsColors;
  const spacingTokens = cdsTokens.spacing ?? cdsSpacing;

  figmaVars.forEach((variable) => {
    const modeValue = Object.values(variable.valuesByMode)[0]?.value;
    if (modeValue == null) {
      results.push({
        message: `Figma variable "${variable.name}" has no value in any mode.`,
        severity: 'warning',
      });
      return;
    }

    if (variable.resolvedType === 'COLOR') {
      const hex = String(modeValue).toLowerCase();
      if (hex.startsWith('#') && !CDS_VALID_HEX_COLORS.has(hex)) {
        results.push({
          message: `Figma variable "${variable.name}" value "${modeValue}" is not in CDS color palette.`,
          value: String(modeValue),
          severity: 'warning',
        });
      }
    } else if (variable.resolvedType === 'FLOAT') {
      const num = Number(modeValue);
      const validSpacing = new Set([
        ...Object.values(spacingTokens.values),
        ...Object.values(spacingTokens.responsive ?? {}),
      ]);
      if (!validSpacing.has(num)) {
        results.push({
          message: `Figma variable "${variable.name}" value ${modeValue} is not in CDS spacing scale.`,
          value: String(modeValue),
          severity: 'warning',
        });
      }
    }
  });

  return results;
}

/**
 * Generates a token usage report across files.
 * @param files - Array of { path, content } file objects
 * @returns Report with coverage metrics
 */
export function generateTokenUsageReport(
  files: Array<{ path: string; content: string }>
): Report {
  let colorViolations = 0;
  let spacingViolations = 0;
  const filesWithViolations = new Set<string>();
  const unknownTokens: string[] = [];

  files.forEach(({ path, content }) => {
    const colorResults = validateNoHardcodedColors(content);
    const spacingResults = validateNoHardcodedSpacing(content);

    colorResults.forEach((r) => {
      colorViolations++;
      filesWithViolations.add(path);
      if (r.value) unknownTokens.push(r.value);
    });
    spacingResults.forEach((r) => {
      spacingViolations++;
      filesWithViolations.add(path);
      if (r.value) unknownTokens.push(r.value);
    });
  });

  const totalViolations = colorViolations + spacingViolations;
  const totalFiles = files.length;
  const coverage = totalFiles > 0
    ? Math.max(0, 100 - (filesWithViolations.size / totalFiles) * 100)
    : 100;

  return {
    coverage,
    totalFiles,
    filesWithViolations: filesWithViolations.size,
    totalViolations,
    colorViolations,
    spacingViolations,
    unknownTokens: [...new Set(unknownTokens)],
    suggestions:
      totalViolations > 0
        ? [
            'Replace hardcoded colors with cdsColors tokens.',
            'Replace hardcoded spacing with cdsSpacing.values or cdsSpacing.responsive.',
          ]
        : [],
  };
}
