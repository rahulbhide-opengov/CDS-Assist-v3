/**
 * CDS-Assist navigation-specific tokens.
 * References cdsColors.nav for light/dark variants.
 */

import { cdsColors } from './colors';

/** CDS navigation layout and sizing tokens. */
export const cdsNavTokens = {
  width: {
    default: 240,
    slim: 64,
    combined: 320,
    smallScreen: 280,
  },
  itemHeight: 48,
  itemHeightCollapsed: 64,
  itemPaddingHorizontal: 16,
  itemPaddingVertical: 12,
  iconSize: 24,
  iconSpacing: 16,
  expandIconSize: 20,
  colors: cdsColors.nav,
} as const;
