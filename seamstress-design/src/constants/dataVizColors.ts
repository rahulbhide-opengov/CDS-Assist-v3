/**
 * Data Visualization Color System
 *
 * A comprehensive 20-color palette with 5 series for OpenGov data visualizations.
 *
 * **Series Overview:**
 * - Series 1 (1.0): Solid colors for primary data representation
 * - Series 2 (0.8): 80% opacity for overlapping/layered visualizations
 * - Series 3 (0.6): 60% opacity for secondary data or backgrounds
 * - Series 4 (0.4): 40% opacity for subtle emphasis or ranges
 * - Series 5 (0.2): 20% opacity for background fills or heat maps
 *
 * **Usage:**
 * ```ts
 * import { dataVizPalette, getSequentialColors, getCategoricalColors } from '@/constants/dataVizColors';
 *
 * // Get first 3 colors for a multi-series chart
 * const colors = getSequentialColors(3);
 *
 * // Get well-spaced colors for categories
 * const categoryColors = getCategoricalColors(5);
 *
 * // Get a specific color with opacity
 * const color = getColorBySeries(0, 2); // First color at 80% opacity
 * ```
 *
 * @module dataVizColors
 */

import { cdsColors } from '../theme/cds';
import { alpha } from '@mui/material';

/**
 * Color definition interface
 */
export interface DataVizColor {
  /** Human-readable name */
  name: string;
  /** Token reference (e.g., 'blurple/500') */
  token: string;
  /** Hex color value */
  value: string;
  /** Primary use case */
  usage: string;
  /** Optional category (sequential, categorical, status) */
  category?: 'sequential' | 'categorical' | 'status';
}

/**
 * Series pattern types
 *
 * Each series uses a different visual pattern for accessibility:
 * - Series 1: Solid color (no pattern)
 * - Series 2: Diagonal right stripes (///)
 * - Series 3: Dot stipple pattern
 * - Series 4: Diagonal left stripes (\\\)
 * - Series 5: Horizontal lines
 *
 * See dataVizPatterns.tsx for SVG pattern implementations
 */
export const SERIES_DESCRIPTIONS: Record<number, string> = {
  1: 'Solid (no pattern)',
  2: 'Diagonal stripes (right)',
  3: 'Dot stipple',
  4: 'Diagonal stripes (left)',
  5: 'Horizontal lines',
};

/**
 * 20-Color Data Visualization Palette (Series 1 - Solid)
 *
 * Uses Capital Design System foundation colors.
 * Exact order from the design specification.
 */
export const dataVizPalette: DataVizColor[] = [
  {
    name: 'Blurple',
    token: 'blurple/500',
    value: cdsColors.blurple500,
    usage: 'Primary data series, categorical charts',
    category: 'sequential',
  },
  {
    name: 'Terracotta',
    token: 'terracotta/500',
    value: cdsColors.terracotta500,
    usage: 'Warning data, alert states',
    category: 'status',
  },
  {
    name: 'Purple',
    token: 'purple/600',
    value: cdsColors.purple600,
    usage: 'Secondary data series',
    category: 'sequential',
  },
  {
    name: 'Turquoise',
    token: 'turquoise/500',
    value: cdsColors.turquoise500,
    usage: 'Success states, positive trends',
    category: 'status',
  },
  {
    name: 'Magenta',
    token: 'magenta/500',
    value: cdsColors.magenta500,
    usage: 'Accent data, categorical distinction',
    category: 'categorical',
  },
  {
    name: 'Blue',
    token: 'blue/600',
    value: cdsColors.blue600,
    usage: 'Stable data, neutral metrics',
    category: 'sequential',
  },
  {
    name: 'Red',
    token: 'red/600',
    value: cdsColors.red600,
    usage: 'Error states, negative trends',
    category: 'status',
  },
  {
    name: 'Violet',
    token: 'violet/500',
    value: cdsColors.violet500,
    usage: 'Light accent, backgrounds',
    category: 'sequential',
  },
  {
    name: 'Green',
    token: 'green/500',
    value: cdsColors.green500,
    usage: 'Growth metrics, positive indicators',
    category: 'status',
  },
  {
    name: 'Yellow',
    token: 'yellow/500',
    value: cdsColors.yellow500,
    usage: 'Caution states, pending indicators',
    category: 'status',
  },
  {
    name: 'Blurple Dark',
    token: 'blurple/600',
    value: cdsColors.blurple600,
    usage: 'Dark variant for contrast',
    category: 'sequential',
  },
  {
    name: 'Orange',
    token: 'orange/600',
    value: cdsColors.orange600,
    usage: 'Warm accent, emphasis',
    category: 'categorical',
  },
  {
    name: 'Purple Light',
    token: 'purple/500',
    value: cdsColors.purple500,
    usage: 'Light purple variant',
    category: 'sequential',
  },
  {
    name: 'Turquoise Dark',
    token: 'turquoise/600',
    value: cdsColors.turquoise600,
    usage: 'Dark turquoise variant',
    category: 'sequential',
  },
  {
    name: 'Magenta Dark',
    token: 'magenta/700',
    value: cdsColors.magenta700,
    usage: 'Deep accent color',
    category: 'categorical',
  },
  {
    name: 'Blue Dark',
    token: 'blue/700',
    value: cdsColors.blue700,
    usage: 'Dark blue for depth',
    category: 'sequential',
  },
  {
    name: 'Orange Light',
    token: 'orange/500',
    value: cdsColors.orange500,
    usage: 'Bright orange accent',
    category: 'categorical',
  },
  {
    name: 'Violet Dark',
    token: 'violet/600',
    value: cdsColors.violet600,
    usage: 'Deep violet tone',
    category: 'sequential',
  },
  {
    name: 'Green Dark',
    token: 'green/600',
    value: cdsColors.green600,
    usage: 'Forest green for contrast',
    category: 'status',
  },
  {
    name: 'Yellow Dark',
    token: 'yellow/600',
    value: cdsColors.yellow600,
    usage: 'Amber tone for warnings',
    category: 'status',
  },
];

/**
 * Status color mappings for common UI patterns
 */
export const statusColors = {
  success: dataVizPalette[8].value,    // Green (green/500)
  warning: dataVizPalette[9].value,    // Yellow (yellow/500)
  error: dataVizPalette[6].value,      // Red (red/600)
  info: dataVizPalette[0].value,       // Blurple (blurple/500)
  neutral: dataVizPalette[5].value,    // Blue (blue/600)
};

/**
 * Get a color from the palette (always returns solid color)
 *
 * For pattern variations (Series 2-5), use getFillWithPattern from dataVizPatterns.tsx
 *
 * @param index - Color index (0-19)
 * @returns Color hex string
 *
 * @example
 * ```ts
 * const blue = getColorByIndex(0);  // '#7939FF'
 * ```
 */
export function getColorByIndex(index: number): string {
  const colorIndex = index % dataVizPalette.length;
  return dataVizPalette[colorIndex].value;
}

/**
 * Get N sequential colors from the palette (solid colors only)
 *
 * For pattern fills, use getSequentialFills from dataVizPatterns.tsx
 *
 * @param count - Number of colors needed (1-20)
 * @returns Array of color hex strings
 *
 * @example
 * ```ts
 * // For a 3-line chart
 * const colors = getSequentialColors(3);
 * // ['#7939FF', '#F3072B', '#A527FF']
 * ```
 */
export function getSequentialColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < Math.min(count, dataVizPalette.length); i++) {
    colors.push(getColorByIndex(i));
  }
  return colors;
}

/**
 * Get N categorical colors with maximum differentiation (solid colors only)
 *
 * For pattern fills, use getCategoricalFills from dataVizPatterns.tsx
 *
 * @param count - Number of colors needed (1-20)
 * @returns Array of color hex strings evenly spaced
 *
 * @example
 * ```ts
 * // For a 5-category pie chart
 * const colors = getCategoricalColors(5);
 * // Spaced colors: indices [0, 4, 8, 12, 16]
 * ```
 */
export function getCategoricalColors(count: number): string[] {
  if (count <= 0) return [];
  if (count === 1) return [getColorByIndex(0)];

  const colors: string[] = [];
  const step = Math.floor(dataVizPalette.length / count);

  for (let i = 0; i < count; i++) {
    const index = (i * step) % dataVizPalette.length;
    colors.push(getColorByIndex(index));
  }

  return colors;
}

/**
 * Get all 20 colors as solid hex values
 *
 * @returns Array of all 20 color hex strings
 */
export function getAllColors(): string[] {
  return dataVizPalette.map(color => color.value);
}

/**
 * Get colors by category type (solid colors only)
 *
 * @param category - Category type ('sequential', 'categorical', 'status')
 * @returns Array of color hex strings matching the category
 *
 * @example
 * ```ts
 * const statusColorValues = getColorsByCategory('status');
 * // Returns all status-type color hex values
 * ```
 */
export function getColorsByCategory(
  category: 'sequential' | 'categorical' | 'status'
): string[] {
  return dataVizPalette
    .filter(color => color.category === category)
    .map(color => color.value);
}

/**
 * Get contrasting text color (black or white) for a given background
 *
 * @param hexColor - Background color in hex format
 * @returns '#000000' or '#FFFFFF' for optimal contrast
 */
export function getContrastingTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}


/**
 * Export default configuration for common use cases
 */
export default {
  palette: dataVizPalette,
  getColor: getColorByIndex,
  sequential: getSequentialColors,
  categorical: getCategoricalColors,
  status: statusColors,
  allColors: getAllColors,
  series: SERIES_DESCRIPTIONS,
};
