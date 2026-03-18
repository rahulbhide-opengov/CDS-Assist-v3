/**
 * IconBadge
 *
 * A colored circle containing an icon, used in feature cards and menus.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box } from '@mui/material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

const SIZES = {
  sm: { container: 32, icon: 16 },
  md: { container: 40, icon: 20 },
  lg: { container: 48, icon: 24 },
} as const;

export interface IconBadgeProps {
  icon: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'blurple' | 'gray';
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon: Icon,
  size = 'md',
  variant = 'blurple',
}) => {
  const { marketingColors } = useMarketingTheme();
  const sizeConfig = SIZES[size];

  const variants = {
    blurple: {
      bgcolor: marketingColors.iconBg,
      iconColor: marketingColors.accent,
    },
    gray: {
      bgcolor: marketingColors.hoverBg,
      iconColor: marketingColors.muted,
    },
  };

  const variantConfig = variants[variant];

  return (
    <Box
      sx={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: '8px',
        bgcolor: variantConfig.bgcolor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: sizeConfig.icon, color: variantConfig.iconColor }} />
    </Box>
  );
};
