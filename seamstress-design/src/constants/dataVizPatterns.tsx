/**
 * Data Visualization Pattern System
 *
 * SVG pattern definitions for the 5-series data visualization system.
 * Each series uses patterns (stripes, dots) overlaid on base colors for accessibility.
 *
 * **Series Overview:**
 * - Series 1: Solid colors (no pattern)
 * - Series 2: Diagonal stripes (right-leaning ///)
 * - Series 3: Dot/stipple pattern
 * - Series 4: Diagonal stripes (left-leaning \\\)
 * - Series 5: Horizontal lines
 *
 * **Why Patterns?**
 * - Readable in grayscale/print
 * - Distinguishable for colorblind users
 * - Better accessibility (redundant encoding)
 * - Professional data visualization standard
 *
 * @module dataVizPatterns
 */

import React from 'react';

/**
 * Pattern type definitions
 */
export type PatternType = 'solid' | 'diagonal-right' | 'dots' | 'diagonal-left' | 'horizontal';

/**
 * Series to pattern mapping
 */
export const SERIES_PATTERNS: Record<number, PatternType> = {
  1: 'solid',           // No pattern
  2: 'diagonal-right',  // /// stripes
  3: 'dots',            // Dot stipple
  4: 'diagonal-left',   // \\\ stripes
  5: 'horizontal',      // Horizontal lines
};

/**
 * Generate a unique pattern ID for a color and series combination
 *
 * @param colorIndex - Index of the color (0-19)
 * @param series - Series number (1-5)
 * @returns Pattern ID string
 */
export function getPatternId(colorIndex: number, series: number): string {
  const patternType = SERIES_PATTERNS[series];
  return `pattern-${patternType}-color${colorIndex}`;
}

/**
 * SVG Pattern Definitions Component
 *
 * Renders all SVG pattern definitions for use in charts.
 * Include this component once at the top level of your chart container.
 *
 * @example
 * ```tsx
 * <ResponsiveContainer>
 *   <DataVizPatternDefs colors={dataVizPalette.map(c => c.value)} />
 *   <BarChart>
 *     <Bar dataKey="value" fill="url(#pattern-diagonal-right-color0)" />
 *   </BarChart>
 * </ResponsiveContainer>
 * ```
 */
interface DataVizPatternDefsProps {
  /** Array of color hex values */
  colors: string[];
}

export const DataVizPatternDefs: React.FC<DataVizPatternDefsProps> = ({ colors }) => {
  return (
    <defs>
      {colors.map((color, colorIndex) => (
        <React.Fragment key={colorIndex}>
          {/* Series 2: Diagonal Right Stripes /// */}
          <pattern
            id={getPatternId(colorIndex, 2)}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill={color} />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
          </pattern>

          {/* Series 3: Dots Pattern */}
          <pattern
            id={getPatternId(colorIndex, 3)}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <rect width="8" height="8" fill={color} />
            <circle
              cx="2"
              cy="2"
              r="1.5"
              fill="#FFFFFF"
            />
            <circle
              cx="6"
              cy="6"
              r="1.5"
              fill="#FFFFFF"
            />
          </pattern>

          {/* Series 4: Diagonal Left Stripes \\\ */}
          <pattern
            id={getPatternId(colorIndex, 4)}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(-45)"
          >
            <rect width="8" height="8" fill={color} />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
          </pattern>

          {/* Series 5: Horizontal Lines */}
          <pattern
            id={getPatternId(colorIndex, 5)}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <rect width="8" height="8" fill={color} />
            <line
              x1="0"
              y1="2"
              x2="8"
              y2="2"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="6"
              x2="8"
              y2="6"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </pattern>
        </React.Fragment>
      ))}
    </defs>
  );
};

/**
 * Get fill value for a chart element (either solid color or pattern URL)
 *
 * @param colorIndex - Index of the color (0-19)
 * @param series - Series number (1-5, default: 1)
 * @param colors - Array of color hex values
 * @returns Fill string (hex color or pattern URL)
 *
 * @example
 * ```tsx
 * const fill = getFillWithPattern(0, 2, dataVizPalette.map(c => c.value));
 * // Returns: 'url(#pattern-diagonal-right-color0)'
 *
 * const solidFill = getFillWithPattern(0, 1, dataVizPalette.map(c => c.value));
 * // Returns: '#7939FF' (solid color)
 * ```
 */
export function getFillWithPattern(
  colorIndex: number,
  series: number,
  colors: string[]
): string {
  if (series === 1) {
    // Series 1 is solid color
    return colors[colorIndex % colors.length];
  }

  // Series 2-5 use patterns
  return `url(#${getPatternId(colorIndex, series)})`;
}

/**
 * Get multiple fills for sequential data
 *
 * @param count - Number of fills needed
 * @param series - Series number (1-5, default: 1)
 * @param colors - Array of color hex values
 * @returns Array of fill strings
 *
 * @example
 * ```tsx
 * const fills = getSequentialFills(3, 2, dataVizPalette.map(c => c.value));
 * // Returns pattern URLs for first 3 colors in series 2
 * ```
 */
export function getSequentialFills(
  count: number,
  series: number,
  colors: string[]
): string[] {
  const fills: string[] = [];
  for (let i = 0; i < Math.min(count, colors.length); i++) {
    fills.push(getFillWithPattern(i, series, colors));
  }
  return fills;
}

/**
 * Get fills for categorical data with maximum differentiation
 *
 * @param count - Number of fills needed
 * @param series - Series number (1-5, default: 1)
 * @param colors - Array of color hex values
 * @returns Array of fill strings evenly spaced
 *
 * @example
 * ```tsx
 * const fills = getCategoricalFills(5, 3, dataVizPalette.map(c => c.value));
 * // Returns dot-pattern fills evenly spaced across the palette
 * ```
 */
export function getCategoricalFills(
  count: number,
  series: number,
  colors: string[]
): string[] {
  if (count <= 0) return [];
  if (count === 1) return [getFillWithPattern(0, series, colors)];

  const fills: string[] = [];
  const step = Math.floor(colors.length / count);

  for (let i = 0; i < count; i++) {
    const index = (i * step) % colors.length;
    fills.push(getFillWithPattern(index, series, colors));
  }

  return fills;
}

/**
 * Export default pattern configuration
 */
export default {
  PatternDefs: DataVizPatternDefs,
  getPatternId,
  getFill: getFillWithPattern,
  getSequential: getSequentialFills,
  getCategorical: getCategoricalFills,
  series: SERIES_PATTERNS,
};
