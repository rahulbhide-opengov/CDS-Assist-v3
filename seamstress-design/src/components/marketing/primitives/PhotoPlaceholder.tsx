/**
 * PhotoPlaceholder
 *
 * A placeholder component for photography with defined aspect ratios.
 * Displays a gradient background with optional centered label.
 * Used in marketing page templates until real photography is available.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export type AspectRatio = '1:1' | '4:3' | '16:9' | '21:9';

export interface PhotoPlaceholderProps {
  aspectRatio?: AspectRatio;
  label?: string;
  sx?: SxProps<Theme>;
}

const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '1:1': 100,
  '4:3': 75,
  '16:9': 56.25,
  '21:9': 42.86,
};

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({
  aspectRatio = '16:9',
  label,
  sx,
}) => {
  const { marketingColors, isDark } = useMarketingTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${ASPECT_RATIOS[aspectRatio]}%`,
        borderRadius: '8px',
        overflow: 'hidden',
        background: isDark
          ? `linear-gradient(135deg, ${marketingColors.surface} 0%, ${marketingColors.iconBg} 50%, ${marketingColors.surface} 100%)`
          : `linear-gradient(135deg, ${marketingColors.hoverBg} 0%, ${marketingColors.border} 50%, ${marketingColors.hoverBg} 100%)`,
        ...sx,
      }}
    >
      {/* Center content */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {/* Camera icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: marketingColors.hoverBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: marketingColors.muted,
            fontSize: '1.5rem',
          }}
        >
          📷
        </Box>

        {/* Label */}
        {label && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: marketingColors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              px: 2,
            }}
          >
            {label}
          </Typography>
        )}

        {/* Aspect ratio indicator */}
        <Typography
          sx={{
            fontSize: '0.625rem',
            color: marketingColors.muted,
            fontFamily: 'monospace',
            opacity: 0.6,
          }}
        >
          {aspectRatio}
        </Typography>
      </Box>
    </Box>
  );
};
