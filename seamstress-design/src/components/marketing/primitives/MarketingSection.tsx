/**
 * MarketingSection
 *
 * Full-width section wrapper with OpenGov brand backgrounds.
 * Includes optional header with eyebrow, heading, and logo.
 * Uses CSS variables for automatic light/dark mode support.
 *
 * This is the primary building block for marketing pages - use it
 * instead of manual Box + Container wrappers.
 */

import React from 'react';
import { Box, Typography, Container, Grid, type SxProps, type Theme } from '@mui/material';
import { marketingCssVars as css } from '../../../theme/marketing-palette';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

/**
 * Background variants for marketing sections
 *
 * - 'background': Page background color (gray in light, slate in dark)
 * - 'surface': Card/panel surface (white in light, slate800 in dark)
 * - 'light': Accent background (subtle tint)
 * - 'dark': Dark surface (surfaceDark)
 * - 'accent': Primary accent color background
 */
export type MarketingSectionVariant = 'background' | 'surface' | 'light' | 'dark' | 'accent';

export interface MarketingSectionProps {
  /** Section eyebrow label (small monospace text) */
  eyebrow?: string;
  /** Main section heading */
  heading?: string;
  /** Subheading text below the heading */
  subheading?: string;
  /** Center align header content */
  headerCentered?: boolean;
  /** Show OpenGov logo in top right */
  showLogo?: boolean;
  /** Background variant */
  variant?: MarketingSectionVariant;
  /** Maximum width of content */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
  /** Vertical padding */
  py?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  /** Horizontal padding (defaults to responsive values) */
  px?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  /** Children content */
  children: React.ReactNode;
  /** Additional styles for outer Box */
  sx?: SxProps<Theme>;
  /** Additional styles for Container */
  containerSx?: SxProps<Theme>;
  /** ID for anchor links */
  id?: string;
}

// Simple OpenGov logo mark
const OpenGovLogo: React.FC<{ light?: boolean }> = ({ light }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Typography
      sx={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: light ? css.invertedText : css.accent,
        letterSpacing: '-0.02em',
      }}
    >
      OpenGov
    </Typography>
    <Box
      sx={{
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '14px solid',
        borderTopColor: light ? css.invertedText : css.accent,
        transform: 'rotate(90deg)',
        ml: 0.5,
      }}
    />
  </Box>
);

/**
 * Get background color for variant
 */
const getVariantBgColor = (variant: MarketingSectionVariant): string => {
  switch (variant) {
    case 'background':
      return css.background;
    case 'surface':
      return css.surface;
    case 'light':
      return css.accentBg;
    case 'dark':
      return css.surfaceDark;
    case 'accent':
      return css.accent;
    default:
      return css.background;
  }
};

/**
 * Check if variant uses light text (dark or accent backgrounds)
 */
const isLightText = (variant: MarketingSectionVariant): boolean => {
  return variant === 'dark' || variant === 'accent';
};

export const MarketingSection: React.FC<MarketingSectionProps> = ({
  eyebrow,
  heading,
  subheading,
  headerCentered = false,
  showLogo = false,
  variant = 'background',
  maxWidth = 'lg',
  py = { xs: 8, md: 12 },
  px = { xs: 2, sm: 3, md: 4 },
  children,
  sx,
  containerSx,
  id,
}) => {
  const lightText = isLightText(variant);
  const bgColor = getVariantBgColor(variant);

  // Text colors based on variant
  const textColor = lightText ? css.invertedText : css.foreground;
  const mutedColor = lightText ? css.invertedTextMuted : css.muted;
  const accentColor = lightText ? css.invertedText : css.accent;

  const hasHeader = eyebrow || heading || showLogo;

  return (
    <Box
      id={id}
      sx={{
        bgcolor: bgColor,
        py,
        px,
        color: textColor,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth} disableGutters sx={containerSx}>
        {/* Header with eyebrow, heading, and optional logo */}
        {hasHeader && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: headerCentered ? 'center' : 'space-between',
              alignItems: 'flex-start',
              mb: heading ? 6 : 0,
              ...(headerCentered && { textAlign: 'center' }),
            }}
          >
            <Box sx={headerCentered ? { maxWidth: 600 } : undefined}>
              {eyebrow && (
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    color: accentColor,
                    fontWeight: 400,
                    mb: 1,
                  }}
                >
                  {eyebrow}
                </Typography>
              )}
              {heading && (
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: accentColor,
                    maxWidth: headerCentered ? undefined : 600,
                  }}
                >
                  {heading}
                </Typography>
              )}
              {subheading && (
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    color: mutedColor,
                    lineHeight: 1.6,
                    mt: 2,
                    maxWidth: headerCentered ? undefined : 540,
                  }}
                >
                  {subheading}
                </Typography>
              )}
            </Box>
            {showLogo && !headerCentered && (
              <Box sx={{ flexShrink: 0 }}>
                <OpenGovLogo light={lightText} />
              </Box>
            )}
          </Box>
        )}

        {children}
      </Container>
    </Box>
  );
};

/**
 * MarketingSplitSection
 *
 * A section with 50/50 split layout for content + media.
 * Useful for hero sections and feature spotlights.
 */
export interface MarketingSplitSectionProps extends Omit<MarketingSectionProps, 'children'> {
  /** Left/content side */
  content: React.ReactNode;
  /** Right/media side */
  media: React.ReactNode;
  /** Reverse the order (media on left) */
  reverse?: boolean;
  /** Vertical alignment */
  alignItems?: 'flex-start' | 'center' | 'flex-end';
}

export const MarketingSplitSection: React.FC<MarketingSplitSectionProps> = ({
  content,
  media,
  reverse = false,
  alignItems = 'center',
  ...sectionProps
}) => {
  return (
    <MarketingSection {...sectionProps}>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems={alignItems}>
        <Grid size={{ xs: 12, md: 6 }} sx={reverse ? { order: { xs: 1, md: 2 } } : undefined}>
          {content}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={reverse ? { order: { xs: 2, md: 1 } } : undefined}>
          {media}
        </Grid>
      </Grid>
    </MarketingSection>
  );
};

/**
 * MarketingStatsBar
 *
 * Dark background section for displaying key statistics.
 */
export interface MarketingStatsBarProps {
  stats: Array<{ value: string; label: string }>;
  py?: number | { xs?: number; sm?: number; md?: number; lg?: number };
}

export const MarketingStatsBar: React.FC<MarketingStatsBarProps> = ({
  stats,
  py = { xs: 6, md: 8 },
}) => {
  return (
    <MarketingSection variant="dark" py={py}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: `repeat(${stats.length}, 1fr)` },
          gap: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                fontWeight: 300,
                lineHeight: 1,
                color: css.invertedText,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: css.invertedTextMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mt: 1,
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </MarketingSection>
  );
};

/**
 * MarketingCtaBanner
 *
 * Full-width CTA section with accent background.
 */
export interface MarketingCtaBannerProps {
  heading: string;
  subheading?: string;
  children: React.ReactNode; // Buttons go here
  py?: number | { xs?: number; sm?: number; md?: number; lg?: number };
}

export const MarketingCtaBanner: React.FC<MarketingCtaBannerProps> = ({
  heading,
  subheading,
  children,
  py = { xs: 8, md: 10 },
}) => {
  return (
    <MarketingSection variant="accent" py={py} maxWidth="md">
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: css.invertedText,
            mb: 2,
            lineHeight: 1.2,
          }}
        >
          {heading}
        </Typography>
        {subheading && (
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: css.invertedTextMuted,
              mb: 4,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            {subheading}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {children}
        </Box>
      </Box>
    </MarketingSection>
  );
};

export default MarketingSection;
