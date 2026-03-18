/**
 * Marketing Color Palette
 *
 * FOUNDATION (Light) and MIDNIGHT (Dark) color palettes for marketing pages.
 * Uses semantic token names for consistent theming.
 */

import { cdsColors } from './cds';

const colors = cdsColors;

/**
 * Marketing color tokens
 */
export interface MarketingColorPalette {
  /** Page/section background */
  background: string;
  /** Card/panel surface */
  surface: string;
  /** Alternative surface for dark sections */
  surfaceDark: string;
  /** Primary text color */
  foreground: string;
  /** Secondary/muted text */
  muted: string;
  /** Accent color (links, buttons) */
  accent: string;
  /** Muted accent (quote marks, decorative elements) */
  accentMuted: string;
  /** Light accent background for selected states */
  accentBgLight: string;
  /** Accent section background (e.g., "The OpenGov Difference") */
  accentBg: string;
  /** Medium accent background for icon badges */
  accentBgMedium: string;
  /** Accent border for selected states */
  accentBorder: string;
  /** Border color for cards and dividers */
  border: string;
  /** Hover background for interactive elements */
  hoverBg: string;
  /** Icon badge background */
  iconBg: string;
  /** Success badge background */
  successBg: string;
  /** Success badge text */
  successText: string;
  /** Logo fill color (for SVG styling) */
  logoFill: string;
  /** Inverted text (white on dark/accent backgrounds) */
  invertedText: string;
  /** Inverted muted text (semi-transparent white on dark/accent backgrounds) */
  invertedTextMuted: string;
}

/**
 * FOUNDATION - Light mode palette
 * Light page background with light cards/components
 */
export const FOUNDATION: MarketingColorPalette = {
  background: colors.gray50, // Light page/section background
  surface: colors.white, // Card/component backgrounds
  surfaceDark: colors.slate900, // Dark sections (stats bar, etc.)
  foreground: colors.gray900, // Text on light surfaces
  muted: colors.slate700,
  accent: colors.blurple700, // #4B3FFF exact CDS match
  accentMuted: colors.blurple300,
  accentBgLight: colors.blurple50,
  accentBg: colors.blurple100, // Accent section background
  accentBgMedium: colors.blurple100,
  accentBorder: colors.blurple300,
  border: colors.gray200,
  hoverBg: colors.gray50,
  iconBg: colors.blurple100,
  successBg: colors.green50,
  successText: colors.green700,
  logoFill: colors.gray900, // Dark logo on light page background
  invertedText: '#ffffff',
  invertedTextMuted: 'rgba(255, 255, 255, 0.7)',
};

/**
 * MIDNIGHT - Dark mode palette
 * Uses CDS slate colors for dark grays
 */
export const MIDNIGHT: MarketingColorPalette = {
  background: colors.slate900, // #2B343D - Primary dark background
  surface: colors.slate800, // #3F4C58 - Card/panel surfaces
  surfaceDark: colors.slate1000, // #161C22 - Darkest sections
  foreground: colors.white,
  muted: colors.slate200, // #D8DFE5 - Secondary text
  accent: colors.blurple500, // Accent color
  accentMuted: 'rgba(139, 133, 255, 0.4)',
  accentBgLight: 'rgba(139, 133, 255, 0.15)',
  accentBg: colors.slate1000, // Accent section background
  accentBgMedium: 'rgba(139, 133, 255, 0.2)',
  accentBorder: 'rgba(139, 133, 255, 0.4)',
  border: colors.slate700, // #546574 - Borders
  hoverBg: 'rgba(255, 255, 255, 0.08)',
  iconBg: 'rgba(139, 133, 255, 0.2)',
  successBg: 'rgba(34, 197, 94, 0.2)',
  successText: '#86efac',
  logoFill: colors.white, // White logo on dark background
  invertedText: '#ffffff',
  invertedTextMuted: 'rgba(255, 255, 255, 0.7)',
};

/**
 * Get palette by mode
 */
export const getMarketingPalette = (mode: 'light' | 'dark'): MarketingColorPalette => {
  return mode === 'light' ? FOUNDATION : MIDNIGHT;
};

/**
 * CSS custom property names for marketing colors
 */
export const MARKETING_CSS_VARS = {
  background: '--marketing-background',
  surface: '--marketing-surface',
  surfaceDark: '--marketing-surface-dark',
  foreground: '--marketing-foreground',
  muted: '--marketing-muted',
  accent: '--marketing-accent',
  accentMuted: '--marketing-accent-muted',
  accentBgLight: '--marketing-accent-bg-light',
  accentBg: '--marketing-accent-bg',
  accentBgMedium: '--marketing-accent-bg-medium',
  accentBorder: '--marketing-accent-border',
  border: '--marketing-border',
  hoverBg: '--marketing-hover-bg',
  iconBg: '--marketing-icon-bg',
  successBg: '--marketing-success-bg',
  successText: '--marketing-success-text',
  logoFill: '--marketing-logo-fill',
  invertedText: '--marketing-inverted-text',
  invertedTextMuted: '--marketing-inverted-text-muted',
} as const;

export type MarketingCSSVar = typeof MARKETING_CSS_VARS[keyof typeof MARKETING_CSS_VARS];

/**
 * CSS variable references for use in sx props
 * These return `var(--marketing-*)` strings that automatically respond to theme changes
 */
export const marketingCssVars = {
  background: 'var(--marketing-background)',
  surface: 'var(--marketing-surface)',
  surfaceDark: 'var(--marketing-surface-dark)',
  foreground: 'var(--marketing-foreground)',
  muted: 'var(--marketing-muted)',
  accent: 'var(--marketing-accent)',
  accentMuted: 'var(--marketing-accent-muted)',
  accentBgLight: 'var(--marketing-accent-bg-light)',
  accentBg: 'var(--marketing-accent-bg)',
  accentBgMedium: 'var(--marketing-accent-bg-medium)',
  accentBorder: 'var(--marketing-accent-border)',
  border: 'var(--marketing-border)',
  hoverBg: 'var(--marketing-hover-bg)',
  iconBg: 'var(--marketing-icon-bg)',
  successBg: 'var(--marketing-success-bg)',
  successText: 'var(--marketing-success-text)',
  logoFill: 'var(--marketing-logo-fill)',
  invertedText: 'var(--marketing-inverted-text)',
  invertedTextMuted: 'var(--marketing-inverted-text-muted)',
} as const;

export type MarketingCssVars = typeof marketingCssVars;
