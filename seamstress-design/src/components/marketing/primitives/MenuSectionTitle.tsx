/**
 * MenuSectionTitle
 *
 * Typography wrapper for section titles in mega-nav menus.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Typography } from '@mui/material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface MenuSectionTitleProps {
  children: React.ReactNode;
}

export const MenuSectionTitle: React.FC<MenuSectionTitleProps> = ({ children }) => {
  const { marketingColors } = useMarketingTheme();

  return (
    <Typography
      sx={{
        fontSize: '0.9375rem',
        fontWeight: 600,
        color: marketingColors.foreground,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
};
