/**
 * CtaLink
 *
 * A link with optional arrow icon, used for "Learn more" CTAs.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { East } from '@mui/icons-material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  showArrow?: boolean;
  color?: 'dark' | 'blurple';
}

export const CtaLink: React.FC<CtaLinkProps> = ({
  href,
  children,
  showArrow = true,
  color = 'dark',
}) => {
  const { marketingColors } = useMarketingTheme();
  const textColor = color === 'blurple' ? marketingColors.accent : marketingColors.foreground;

  return (
    <Box
      component="a"
      href={href}
      className="cta-link"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        '&:hover': {
          textDecoration: 'underline',
          '& .MuiSvgIcon-root': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: textColor,
          transition: 'color 0.2s ease',
        }}
      >
        {children}
      </Typography>
      {showArrow && (
        <East
          sx={{
            fontSize: 16,
            color: textColor,
            opacity: 0,
            transform: 'translateX(-8px)',
            transition: 'all 0.2s ease',
          }}
        />
      )}
    </Box>
  );
};
