/**
 * CDS-Assist border radius tokens.
 * 4px default radius.
 */

/** CDS border radius scale. */
export const cdsBorderRadius = {
  none: 0,
  extraSmall: 2,
  small: 4,
  medium: 8,
  large: 12,
  circular: '50%' as const,
  full: 9999,
} as const;
