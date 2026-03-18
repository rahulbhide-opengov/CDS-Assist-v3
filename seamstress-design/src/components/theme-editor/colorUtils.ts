/**
 * Color Utility Functions
 *
 * Helpers for validating, manipulating, and analyzing colors
 */

import { lighten, darken, getContrastRatio } from '@mui/system/colorManipulator';
import { cdsColors } from '../../theme/cds';

/**
 * Validates if a string is a valid hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normalizes a 3-digit hex to 6-digit format
 */
export function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }

  if (hex.length === 4) {
    // Convert #RGB to #RRGGBB
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  return hex.toUpperCase();
}

/**
 * Lightens a color by a given amount
 */
export function lightenColor(hex: string, amount: number = 0.2): string {
  return lighten(hex, amount);
}

/**
 * Darkens a color by a given amount
 */
export function darkenColor(hex: string, amount: number = 0.2): string {
  return darken(hex, amount);
}

/**
 * Determines if white or black text has better contrast on the given background
 */
export function getContrastText(bgColor: string): string {
  const whiteContrast = getContrastRatio(bgColor, cdsColors.white);
  const blackContrast = getContrastRatio(bgColor, cdsColors.black);

  return whiteContrast > blackContrast ? cdsColors.white : cdsColors.black;
}

/**
 * Gets the contrast ratio between two colors
 */
export function getColorContrastRatio(foreground: string, background: string): number {
  return getContrastRatio(foreground, background);
}

/**
 * Determines WCAG compliance level for a contrast ratio
 */
export function getWCAGLevel(contrastRatio: number, fontSize: 'normal' | 'large' = 'normal'): {
  level: 'AAA' | 'AA' | 'fail';
  passes: boolean;
} {
  const threshold = fontSize === 'large' ? 3 : 4.5;
  const aaaThreshold = fontSize === 'large' ? 4.5 : 7;

  if (contrastRatio >= aaaThreshold) {
    return { level: 'AAA', passes: true };
  } else if (contrastRatio >= threshold) {
    return { level: 'AA', passes: true };
  } else {
    return { level: 'fail', passes: false };
  }
}

/**
 * Generates a complete primary color palette from a single hex color
 */
export function generatePrimaryPalette(mainColor: string) {
  const normalized = normalizeHex(mainColor);

  return {
    main: normalized,
    light: lightenColor(normalized, 0.3),
    dark: darkenColor(normalized, 0.2),
    contrastText: getContrastText(normalized),
  };
}
