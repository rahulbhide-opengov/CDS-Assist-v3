/**
 * ThemedLogo
 *
 * A theme-aware wrapper for the OpenGov logo.
 * Applies CSS filters to invert the logo for dark backgrounds.
 * The blurple arrow always stays visible; only the text inverts.
 */

import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { OpenGovLogo } from '@opengov/react-capital-assets';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface ThemedLogoProps {
  /** Height of the logo (width auto-scales) */
  height?: number | string;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

/**
 * Theme-aware OpenGov logo that inverts for dark mode.
 * Uses CSS filter to make the text white while preserving the blurple arrow.
 */
export const ThemedLogo: React.FC<ThemedLogoProps> = ({
  height = 24,
  sx,
}) => {
  const { isDark, marketingColors } = useMarketingTheme();

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        '& svg': {
          height: '100%',
          width: 'auto',
          // In dark mode, invert the black text to white
          // brightness(0) makes everything black, then invert(1) makes it white
          // The blurple (#4b3fff) arrow is preserved because it's not pure black
          filter: isDark ? 'brightness(0) invert(1)' : 'none',
          transition: 'filter 0.3s ease',
          // Target only the text path (the one without fill attribute)
          '& path:not([fill])': {
            fill: marketingColors.logoFill,
          },
        },
        ...sx,
      }}
    >
      <OpenGovLogo />
    </Box>
  );
};

export default ThemedLogo;
