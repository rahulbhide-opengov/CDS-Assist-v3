/**
 * Chart Color Utilities
 *
 * Provides theme-aware color palettes for data visualization.
 * These functions generate chart colors derived from the MUI theme
 * to ensure consistency across light and dark modes.
 */

import type { Theme } from '@mui/material/styles';

/**
 * Standard chart color palette - 6 colors
 * For general-purpose charts with limited data series
 */
export const getChartColors = (theme: Theme): string[] => [
  theme.palette.primary.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
  theme.palette.secondary.main,
  theme.palette.info.main,
];

/**
 * Extended chart color palette - 12 colors
 * For charts with many data series
 */
export const getExtendedChartColors = (theme: Theme): string[] => [
  theme.palette.primary.main,
  theme.palette.primary.light,
  theme.palette.success.main,
  theme.palette.success.light,
  theme.palette.warning.main,
  theme.palette.warning.light,
  theme.palette.error.main,
  theme.palette.error.light,
  theme.palette.secondary.main,
  theme.palette.secondary.light,
  theme.palette.info.main,
  theme.palette.info.light,
];

/**
 * Periwinkle/Purple gradient palette
 * For branded visualizations using the primary purple color scale
 */
export const getPeriwinklePalette = (theme: Theme): string[] => {
  const base = theme.palette.primary.main;
  // Generate a purple/periwinkle gradient based on primary
  return [
    theme.palette.primary.dark,      // Darkest
    theme.palette.primary.main,      // Base
    theme.palette.primary.light,     // Light
    theme.palette.secondary.dark,    // Secondary dark
    theme.palette.secondary.main,    // Secondary
    theme.palette.secondary.light,   // Secondary light
  ];
};

/**
 * Sequential color palette for ordered data
 * Generates shades from dark to light of a single hue
 */
export const getSequentialPalette = (
  theme: Theme,
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary',
  count: number = 6
): string[] => {
  const palette = theme.palette[color];
  const colors: string[] = [];

  // Generate shades by interpolating between dark and light
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    if (ratio < 0.33) {
      colors.push(palette.dark);
    } else if (ratio < 0.66) {
      colors.push(palette.main);
    } else {
      colors.push(palette.light);
    }
  }

  return colors;
};

/**
 * Status colors for categorical data with semantic meaning
 */
export const getStatusColors = (theme: Theme) => ({
  success: theme.palette.success.main,
  warning: theme.palette.warning.main,
  error: theme.palette.error.main,
  info: theme.palette.info.main,
  neutral: theme.palette.grey[500],
  pending: theme.palette.warning.main,
  active: theme.palette.success.main,
  inactive: theme.palette.grey[400],
});

/**
 * Diverging color palette for data with positive/negative values
 */
export const getDivergingPalette = (theme: Theme): string[] => [
  theme.palette.error.dark,
  theme.palette.error.main,
  theme.palette.error.light,
  theme.palette.grey[300],
  theme.palette.success.light,
  theme.palette.success.main,
  theme.palette.success.dark,
];

/**
 * Get a color from the chart palette by index (wraps around)
 */
export const getChartColor = (theme: Theme, index: number): string => {
  const colors = getChartColors(theme);
  return colors[index % colors.length];
};

/**
 * Procurement-specific palette
 * Purple/periwinkle shades for procurement dashboards
 */
export const getProcurementPalette = (theme: Theme): string[] => {
  // Use primary (purple) shades with varying opacity/lightness
  const primary = theme.palette.primary;
  const secondary = theme.palette.secondary;

  return [
    primary.dark,
    primary.main,
    primary.light,
    secondary.dark,
    secondary.main,
    secondary.light,
    theme.palette.info.main,
    theme.palette.info.light,
    theme.palette.grey[400],
  ];
};

/**
 * Extended periwinkle/purple scale for procurement charts
 * 10 shades from darkest (900) to lightest (50)
 */
export const getPeriwinkleScale = (theme: Theme): Record<string, string> => {
  // Generate a scale based on primary palette
  // These map to the branded periwinkle colors used in procurement
  const primary = theme.palette.primary;

  return {
    900: primary.dark,
    800: primary.dark,
    700: primary.main,
    600: primary.main,
    500: primary.main,
    400: primary.light,
    300: primary.light,
    200: theme.palette.grey[300],
    100: theme.palette.grey[200],
    50: theme.palette.grey[100],
  };
};

/**
 * Get an array of periwinkle colors for charts with many segments
 */
export const getPeriwinkleChartColors = (theme: Theme): string[] => {
  const primary = theme.palette.primary;
  const secondary = theme.palette.secondary;

  return [
    primary.dark,      // Darkest
    primary.main,
    primary.light,
    secondary.dark,
    secondary.main,
    secondary.light,
    theme.palette.info.dark,
    theme.palette.info.main,
    theme.palette.info.light,
    theme.palette.grey[400],
  ];
};

/**
 * Blue gradient scale for time-based visualizations
 */
export const getBlueScale = (theme: Theme): string[] => [
  theme.palette.info.dark,
  theme.palette.info.main,
  theme.palette.info.light,
  theme.palette.grey[400],
  theme.palette.grey[300],
];

/**
 * Hook-friendly chart colors generator
 * Returns an object with various palette functions bound to a theme
 */
export const createChartColorUtils = (theme: Theme) => ({
  standard: getChartColors(theme),
  extended: getExtendedChartColors(theme),
  periwinkle: getPeriwinklePalette(theme),
  periwinkleChart: getPeriwinkleChartColors(theme),
  periwinkleScale: getPeriwinkleScale(theme),
  procurement: getProcurementPalette(theme),
  status: getStatusColors(theme),
  diverging: getDivergingPalette(theme),
  blueScale: getBlueScale(theme),
  getByIndex: (index: number) => getChartColor(theme, index),
  sequential: (color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info', count?: number) =>
    getSequentialPalette(theme, color, count),
});

export type ChartColorUtils = ReturnType<typeof createChartColorUtils>;
