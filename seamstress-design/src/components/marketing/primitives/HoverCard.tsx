/**
 * HoverCard
 *
 * A clickable card container with border and hover effect.
 * Used for platform features, customer cards, and story cards.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface HoverCardProps {
  href: string;
  children: React.ReactNode;
  variant?: 'outline' | 'filled';
  sx?: SxProps<Theme>;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  href,
  children,
  variant = 'outline',
  sx,
}) => {
  const { marketingColors } = useMarketingTheme();

  const baseStyles: SxProps<Theme> = {
    display: 'block',
    borderRadius: '8px',
    textDecoration: 'none',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  };

  const variantStyles: Record<string, SxProps<Theme>> = {
    outline: {
      border: `1px solid ${marketingColors.border}`,
      bgcolor: marketingColors.surface,
      '&:hover': {
        borderColor: marketingColors.accent,
        bgcolor: marketingColors.hoverBg,
      },
    },
    filled: {
      bgcolor: marketingColors.hoverBg,
      '&:hover': {
        bgcolor: marketingColors.accentBgLight,
        transform: 'translateY(-2px)',
      },
    },
  };

  return (
    <Box
      component="a"
      href={href}
      sx={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
