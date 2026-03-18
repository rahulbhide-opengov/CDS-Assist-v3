/**
 * MarketingTypography
 *
 * Semantic typography components for marketing pages.
 * Uses CSS variables for automatic light/dark mode support.
 * Provides consistent heading hierarchy and text styling.
 */

import React from 'react';
import { Typography, Box, type TypographyProps, type SxProps, type Theme } from '@mui/material';
import { marketingCssVars as css } from '../../../theme/marketing-palette';

/**
 * Eyebrow - Small uppercase label above headings
 */
export interface EyebrowProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children, sx, ...props }) => (
  <Typography
    component="span"
    sx={{
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 400,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: css.muted,
      mb: 1.5,
      fontFamily: 'monospace',
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * DisplayHeading - Large hero headlines (h1)
 */
export interface DisplayHeadingProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
  /** Accent colored text */
  accent?: string;
}

export const DisplayHeading: React.FC<DisplayHeadingProps> = ({ children, accent, sx, ...props }) => (
  <Typography
    component="h1"
    sx={{
      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: css.foreground,
      mb: 3,
      maxWidth: 600,
      ...sx,
    }}
    {...props}
  >
    {accent ? (
      <>
        {children}{' '}
        <Box component="span" sx={{ color: css.accent }}>
          {accent}
        </Box>
      </>
    ) : (
      children
    )}
  </Typography>
);

/**
 * SectionHeading - Section headers (h2)
 */
export interface SectionHeadingProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
  /** Center align the heading */
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ children, centered, sx, ...props }) => (
  <Typography
    component="h2"
    sx={{
      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: css.foreground,
      mb: 2,
      maxWidth: 600,
      ...(centered && { textAlign: 'center', mx: 'auto' }),
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * SubsectionHeading - Smaller section headers (h3)
 */
export interface SubsectionHeadingProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const SubsectionHeading: React.FC<SubsectionHeadingProps> = ({ children, sx, ...props }) => (
  <Typography
    component="h3"
    sx={{
      fontSize: { xs: '1.25rem', md: '1.5rem' },
      fontWeight: 600,
      lineHeight: 1.3,
      color: css.foreground,
      mb: 1.5,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * LeadText - Large introductory paragraph text
 */
export interface LeadTextProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const LeadText: React.FC<LeadTextProps> = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: { xs: '1.125rem', md: '1.25rem' },
      color: css.muted,
      lineHeight: 1.6,
      mb: 4,
      maxWidth: 540,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * BodyText - Standard paragraph text
 */
export interface BodyTextProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const BodyText: React.FC<BodyTextProps> = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: '1rem',
      color: css.muted,
      lineHeight: 1.6,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * AccentText - Text in accent color
 */
export interface AccentTextProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const AccentText: React.FC<AccentTextProps> = ({ children, sx, ...props }) => (
  <Typography
    component="span"
    sx={{
      color: css.accent,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * StatValue - Large statistic number
 */
export interface StatValueProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
  /** Use white color (for dark backgrounds) */
  light?: boolean;
}

export const StatValue: React.FC<StatValueProps> = ({ children, light, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
      fontWeight: 300,
      lineHeight: 1,
      color: light ? css.invertedText : css.accent,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * StatLabel - Label beneath stat value
 */
export interface StatLabelProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
  /** Use light color (for dark backgrounds) */
  light?: boolean;
}

export const StatLabel: React.FC<StatLabelProps> = ({ children, light, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: '0.875rem',
      fontWeight: 500,
      color: light ? css.invertedTextMuted : css.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      mt: 1,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * CardTitle - Title text for cards
 */
export interface CardTitleProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: '1.125rem',
      fontWeight: 600,
      color: css.foreground,
      mb: 1,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * CardDescription - Description text for cards
 */
export interface CardDescriptionProps extends Omit<TypographyProps, 'variant'> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      fontSize: '0.9375rem',
      color: css.muted,
      lineHeight: 1.6,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

/**
 * SectionHeader - Combined eyebrow + heading for section intros
 */
export interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  centered?: boolean;
  sx?: SxProps<Theme>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  centered = false,
  sx,
}) => (
  <Box sx={{ mb: { xs: 6, md: 8 }, ...(centered && { textAlign: 'center' }), ...sx }}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <SectionHeading centered={centered}>{heading}</SectionHeading>
  </Box>
);

export default {
  Eyebrow,
  DisplayHeading,
  SectionHeading,
  SubsectionHeading,
  LeadText,
  BodyText,
  AccentText,
  StatValue,
  StatLabel,
  CardTitle,
  CardDescription,
  SectionHeader,
};
