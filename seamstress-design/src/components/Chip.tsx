/**
 * OpenGov Chip Component
 *
 * Extended Chip component with additional color variants and styles
 * following OpenGov Capital Design System specifications.
 *
 * This component extends MUI's Chip with OpenGov-specific colors and variants:
 * - Extended colors: default, success, error, warning, inProgress, indigo, periwinkle, jade, port, rose, magenta, orange, terracotta
 * - Extended variants: filled, outlined, minimal, strong
 * - Extended sizes: small, medium, large
 *
 * @example
 * import { Chip } from './Chip';
 *
 * <Chip label="Label" color="success" variant="filled" size="medium" />
 */

import React from 'react';
import { Chip as MuiChip, styled } from '@mui/material';
import { cdsColors } from '../theme/cds';

// Define MuiChipProps locally since it's not exported
interface MuiChipProps {
  label?: React.ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDelete?: (event: React.MouseEvent<HTMLDivElement>) => void;
  deleteIcon?: React.ReactElement;
  icon?: React.ReactElement;
  avatar?: React.ReactElement;
  disabled?: boolean;
  [key: string]: any;
}

// Extended color types
export type ChipColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'inProgress'
  | 'indigo'
  | 'periwinkle'
  | 'jade'
  | 'port'
  | 'rose'
  | 'magenta'
  | 'orange'
  | 'terracotta';

// Extended variant types
export type ChipVariant = 'filled' | 'outlined' | 'minimal' | 'strong';

// Extended size types
export type ChipSize = 'small' | 'medium' | 'large';

export interface ChipProps extends Omit<MuiChipProps, 'color' | 'variant' | 'size'> {
  color?: ChipColor;
  variant?: ChipVariant;
  size?: ChipSize;
}

// Color mappings for custom colors
const getColorStyles = (color: ChipColor, variant: ChipVariant, theme?: any) => {
  // Define color mappings using CDS tokens
  const colorMap: Record<ChipColor, Record<ChipVariant, any>> = {
    default: {
      filled: { bg: cdsColors.gray200, text: cdsColors.gray900 },
      outlined: { border: cdsColors.gray500, text: cdsColors.gray900, bg: 'transparent' },
      minimal: { bg: cdsColors.gray50, text: cdsColors.gray900 },
      strong: { bg: cdsColors.gray800, text: cdsColors.gray50 },
    },
    primary: {
      filled: { bg: theme?.palette?.primary?.light || cdsColors.blurple100, text: theme?.palette?.primary?.dark || cdsColors.blurple900 },
      outlined: { border: theme?.palette?.primary?.main || cdsColors.blurple700, text: theme?.palette?.primary?.dark || cdsColors.blurple900, bg: 'transparent' },
      minimal: { bg: theme?.palette?.primary?.light || cdsColors.blurple50, text: theme?.palette?.primary?.dark || cdsColors.blurple900 },
      strong: { bg: theme?.palette?.primary?.main || cdsColors.blurple700, text: theme?.palette?.primary?.contrastText || cdsColors.white },
    },
    success: {
      filled: { bg: cdsColors.green100, text: cdsColors.green700 },
      outlined: { border: cdsColors.green500, text: cdsColors.green700, bg: 'transparent' },
      minimal: { bg: cdsColors.green50, text: cdsColors.green700 },
      strong: { bg: cdsColors.green600, text: cdsColors.white },
    },
    error: {
      filled: { bg: cdsColors.red100, text: cdsColors.red700 },
      outlined: { border: cdsColors.red600, text: cdsColors.red700, bg: 'transparent' },
      minimal: { bg: cdsColors.red50, text: cdsColors.red700 },
      strong: { bg: cdsColors.red600, text: cdsColors.white },
    },
    warning: {
      filled: { bg: cdsColors.orange100, text: cdsColors.orange700 },
      outlined: { border: cdsColors.orange600, text: cdsColors.orange700, bg: 'transparent' },
      minimal: { bg: cdsColors.orange50, text: cdsColors.orange700 },
      strong: { bg: cdsColors.orange600, text: cdsColors.white },
    },
    inProgress: {
      filled: { bg: cdsColors.blue100, text: cdsColors.blue700 },
      outlined: { border: cdsColors.blue600, text: cdsColors.blue700, bg: 'transparent' },
      minimal: { bg: cdsColors.blue50, text: cdsColors.blue700 },
      strong: { bg: cdsColors.blue600, text: cdsColors.white },
    },
    indigo: {
      filled: { bg: cdsColors.blurple200, text: cdsColors.blurple900 },
      outlined: { border: cdsColors.blurple500, text: cdsColors.blurple900, bg: 'transparent' },
      minimal: { bg: cdsColors.blurple50, text: cdsColors.blurple900 },
      strong: { bg: cdsColors.blurple700, text: cdsColors.white },
    },
    periwinkle: {
      filled: { bg: cdsColors.blurple200, text: cdsColors.blurple900 },
      outlined: { border: cdsColors.blurple500, text: cdsColors.blurple900, bg: 'transparent' },
      minimal: { bg: cdsColors.blurple50, text: cdsColors.blurple900 },
      strong: { bg: cdsColors.blurple700, text: cdsColors.white },
    },
    jade: {
      filled: { bg: cdsColors.green100, text: cdsColors.green700 },
      outlined: { border: cdsColors.turquoise500, text: cdsColors.green700, bg: 'transparent' },
      minimal: { bg: cdsColors.green50, text: cdsColors.green700 },
      strong: { bg: cdsColors.turquoise600, text: cdsColors.white },
    },
    port: {
      filled: { bg: cdsColors.blurple200, text: cdsColors.blurple900 },
      outlined: { border: cdsColors.blurple500, text: cdsColors.blurple900, bg: 'transparent' },
      minimal: { bg: cdsColors.blurple50, text: cdsColors.blurple900 },
      strong: { bg: cdsColors.blurple700, text: cdsColors.white },
    },
    rose: {
      filled: { bg: cdsColors.red100, text: cdsColors.magenta700 },
      outlined: { border: cdsColors.magenta500, text: cdsColors.magenta700, bg: 'transparent' },
      minimal: { bg: cdsColors.red50, text: cdsColors.magenta700 },
      strong: { bg: cdsColors.magenta700, text: cdsColors.white },
    },
    magenta: {
      filled: { bg: cdsColors.red100, text: cdsColors.magenta700 },
      outlined: { border: cdsColors.magenta500, text: cdsColors.magenta700, bg: 'transparent' },
      minimal: { bg: cdsColors.red50, text: cdsColors.magenta700 },
      strong: { bg: cdsColors.magenta700, text: cdsColors.white },
    },
    orange: {
      filled: { bg: cdsColors.orange100, text: cdsColors.orange700 },
      outlined: { border: cdsColors.orange600, text: cdsColors.orange700, bg: 'transparent' },
      minimal: { bg: cdsColors.orange50, text: cdsColors.orange700 },
      strong: { bg: cdsColors.orange600, text: cdsColors.white },
    },
    terracotta: {
      filled: { bg: cdsColors.orange100, text: cdsColors.terracotta500 },
      outlined: { border: cdsColors.terracotta500, text: cdsColors.terracotta500, bg: 'transparent' },
      minimal: { bg: cdsColors.orange50, text: cdsColors.terracotta500 },
      strong: { bg: cdsColors.orange600, text: cdsColors.white },
    },
  };

  return colorMap[color]?.[variant] || colorMap.default[variant];
};

// Styled chip with custom colors
const StyledChip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'customColor' && prop !== 'customVariant' && prop !== 'customSize',
})<{ customColor: ChipColor; customVariant: ChipVariant; customSize: ChipSize }>(
  ({ customColor, customVariant, customSize, theme }) => {
    const colorStyles = getColorStyles(customColor, customVariant, theme);

    // Size mappings
    const sizeStyles = {
      small: {
        height: 24,
        fontSize: '0.75rem',
        '& .MuiChip-label': {
          paddingLeft: 8,
          paddingRight: 8,
        },
        '& .MuiChip-icon': {
          fontSize: '1rem',
          marginLeft: 6,
        },
        '& .MuiChip-deleteIcon': {
          fontSize: '1rem',
          marginRight: 6,
        },
      },
      medium: {
        height: 32,
        fontSize: '0.875rem',
      },
      large: {
        height: 40,
        fontSize: '1rem',
        '& .MuiChip-label': {
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    };

    const styles: any = {
      ...sizeStyles[customSize],
    };

    // Apply variant-specific styles
    if (customVariant === 'outlined') {
      styles.backgroundColor = colorStyles.bg;
      styles.color = colorStyles.text;
      styles.border = `1px solid ${colorStyles.border}`;
      styles['&:hover'] = {
        backgroundColor: colorStyles.bg === 'transparent'
          ? 'rgba(0, 0, 0, 0.04)'
          : colorStyles.bg,
      };
    } else if (customVariant === 'minimal') {
      styles.backgroundColor = colorStyles.bg;
      styles.color = colorStyles.text;
      styles.border = 'none';
    } else if (customVariant === 'strong') {
      styles.backgroundColor = colorStyles.bg;
      styles.color = colorStyles.text;
      styles.border = 'none';
      styles.fontWeight = 500;
    } else {
      // filled
      styles.backgroundColor = colorStyles.bg;
      styles.color = colorStyles.text;
      styles.border = 'none';
    }

    return styles;
  }
);

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ color = 'default', variant = 'filled', size = 'medium', ...props }, ref) => {
    return (
      <StyledChip
        ref={ref}
        customColor={color}
        customVariant={variant}
        customSize={size}
        {...props}
      />
    );
  }
);

Chip.displayName = 'Chip';
