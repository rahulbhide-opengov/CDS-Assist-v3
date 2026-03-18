/**
 * MarketingButton
 *
 * Themed button component for marketing pages.
 * Uses CSS variables for automatic light/dark mode support.
 * Reduces repeated inline button styling across marketing pages.
 */

import React from 'react';
import { Button, type ButtonProps } from '@mui/material';
import { East } from '@mui/icons-material';
import { marketingCssVars as css } from '../../../theme/marketing-palette';

export type MarketingButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted';
export type MarketingButtonSize = 'small' | 'medium' | 'large';

export interface MarketingButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  /** Button style variant */
  variant?: MarketingButtonVariant;
  /** Button size */
  size?: MarketingButtonSize;
  /** Show arrow icon at end */
  showArrow?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

const sizeStyles: Record<MarketingButtonSize, object> = {
  small: {
    px: 2.5,
    py: 1,
    fontSize: '0.875rem',
  },
  medium: {
    px: 3,
    py: 1.25,
    fontSize: '0.9375rem',
  },
  large: {
    px: 4,
    py: 1.5,
    fontSize: '1rem',
  },
};

const baseStyles = {
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: 'none',
  },
};

const variantStyles: Record<MarketingButtonVariant, object> = {
  primary: {
    bgcolor: css.accent,
    color: css.invertedText,
    border: 'none',
    '&:hover': {
      bgcolor: css.accent,
      filter: 'brightness(0.9)',
    },
  },
  secondary: {
    bgcolor: css.surface,
    color: css.foreground,
    border: `1px solid ${css.border}`,
    '&:hover': {
      borderColor: css.accent,
      bgcolor: css.hoverBg,
    },
  },
  outline: {
    bgcolor: 'transparent',
    color: css.foreground,
    border: `1px solid ${css.border}`,
    '&:hover': {
      borderColor: css.accent,
      bgcolor: css.hoverBg,
    },
  },
  ghost: {
    bgcolor: 'transparent',
    color: css.accent,
    border: 'none',
    p: 0,
    minWidth: 'auto',
    '&:hover': {
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  },
  inverted: {
    bgcolor: css.invertedText,
    color: css.accent,
    border: 'none',
    '&:hover': {
      bgcolor: css.invertedTextMuted,
    },
  },
};

// Styles for inverted context (on accent backgrounds)
const invertedOutlineStyles = {
  borderColor: css.invertedTextMuted,
  color: css.invertedText,
  '&:hover': {
    borderColor: css.invertedText,
    bgcolor: 'rgba(255, 255, 255, 0.1)',
  },
};

export const MarketingButton: React.FC<MarketingButtonProps> = ({
  variant = 'primary',
  size = 'large',
  showArrow = false,
  fullWidth = false,
  children,
  sx,
  ...props
}) => {
  return (
    <Button
      endIcon={showArrow ? <East /> : undefined}
      sx={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(fullWidth && { width: '100%' }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * Preset button for use on accent/dark backgrounds
 * (e.g., CTA banners with bgcolor: accent)
 */
export const MarketingButtonOnAccent: React.FC<Omit<MarketingButtonProps, 'variant'> & { variant?: 'primary' | 'outline' }> = ({
  variant = 'primary',
  size = 'large',
  showArrow = false,
  children,
  sx,
  ...props
}) => {
  const accentVariantStyles = variant === 'primary'
    ? variantStyles.inverted
    : invertedOutlineStyles;

  return (
    <Button
      endIcon={showArrow ? <East /> : undefined}
      sx={{
        ...baseStyles,
        ...sizeStyles[size],
        ...accentVariantStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MarketingButton;
