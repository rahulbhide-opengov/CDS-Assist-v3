/**
 * LinkColumn
 *
 * A column with a title and vertical list of links.
 * Used in mega-nav menus and footer.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { MenuSectionTitle } from './MenuSectionTitle';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface LinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface LinkColumnProps {
  title: string;
  links: LinkItem[];
  linkColor?: 'blurple' | 'gray';
}

export const LinkColumn: React.FC<LinkColumnProps> = ({
  title,
  links,
  linkColor = 'blurple',
}) => {
  const { marketingColors } = useMarketingTheme();

  const linkStyles = {
    blurple: {
      color: marketingColors.accent,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    gray: {
      color: marketingColors.muted,
      '&:hover': {
        color: marketingColors.foreground,
      },
    },
  };

  return (
    <Box>
      <MenuSectionTitle>{title}</MenuSectionTitle>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {links.map((link) => (
          <Typography
            key={link.href}
            component="a"
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            sx={{
              fontSize: '0.9375rem',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              ...linkStyles[linkColor],
            }}
          >
            {link.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
