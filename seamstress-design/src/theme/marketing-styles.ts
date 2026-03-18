/**
 * Marketing Page Style Utilities
 *
 * Reusable sx prop objects for marketing page sections.
 * Uses CSS custom properties for automatic theme responsiveness.
 *
 * Inspired by NASA 1976 Graphics Standards Manual:
 * - Clean, modernist typography with strong hierarchy
 * - Grid-based systematic layouts
 * - Flush-left alignment, generous whitespace
 * - Modular, consistent approach to sections
 */

import type { SxProps, Theme } from '@mui/material';
import { marketingCssVars as css } from './marketing-palette';

/**
 * Hero section styles
 */
export const heroSection: SxProps<Theme> = {
  py: { xs: 8, md: 12 },
  px: { xs: 2, sm: 3, md: 4 },
  bgcolor: css.surface,
  color: css.foreground,
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

export const heroSectionDark: SxProps<Theme> = {
  py: { xs: 8, md: 12 },
  px: { xs: 2, sm: 3, md: 4 },
  bgcolor: css.surfaceDark,
  color: '#ffffff',
  transition: 'background-color 0.3s ease',
};

/**
 * Split layout - 50/50 image and content
 */
export const splitSection: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: { xs: 4, md: 6 },
  alignItems: 'center',
};

export const splitSectionReverse: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: { xs: 4, md: 6 },
  alignItems: 'center',
  '& > *:first-of-type': {
    order: { xs: 1, md: 2 },
  },
  '& > *:last-of-type': {
    order: { xs: 2, md: 1 },
  },
};

/**
 * Section containers
 */
export const sectionContainer: SxProps<Theme> = {
  maxWidth: 1280,
  mx: 'auto',
  px: { xs: 2, sm: 3, md: 4 },
};

export const sectionPadding: SxProps<Theme> = {
  py: { xs: 6, md: 10 },
};

export const sectionLight: SxProps<Theme> = {
  py: { xs: 6, md: 10 },
  bgcolor: css.background,
  color: css.foreground,
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

export const sectionDark: SxProps<Theme> = {
  py: { xs: 6, md: 10 },
  bgcolor: css.surfaceDark,
  color: '#ffffff',
  transition: 'background-color 0.3s ease',
};

/**
 * Typography styles - NASA Graphics Manual inspired
 */
export const displayHeading: SxProps<Theme> = {
  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
  fontWeight: 600,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  mb: 3,
  maxWidth: 600,
};

export const sectionHeading: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  mb: 2,
  maxWidth: 600,
};

export const sectionSubheading: SxProps<Theme> = {
  fontSize: { xs: '1rem', md: '1.125rem' },
  color: css.muted,
  lineHeight: 1.6,
  maxWidth: 600,
};

export const eyebrowLabel: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: css.accent,
  mb: 1.5,
  fontFamily: '"DM Sans", sans-serif',
};

/**
 * Stats display - large numbers with labels
 */
export const statValue: SxProps<Theme> = {
  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
  fontWeight: 300,
  lineHeight: 1,
  color: css.accent,
};

export const statLabel: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: css.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  mt: 1,
};

export const statsGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
  gap: { xs: 4, md: 6 },
  textAlign: 'center',
};

/**
 * Card styles - use CSS variables for theme responsiveness
 */
export const featureCard: SxProps<Theme> = {
  p: { xs: 3, md: 4 },
  bgcolor: css.surface,
  borderRadius: '4px',
  border: `1px solid ${css.border}`,
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderColor: css.accent,
  },
};

export const productCard: SxProps<Theme> = {
  p: { xs: 3, md: 4 },
  bgcolor: css.surface,
  borderRadius: '4px',
  border: `1px solid ${css.border}`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: css.accent,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(75, 63, 255, 0.1)',
  },
};

/**
 * Card with border and hover effect (reusable pattern)
 */
export const cardBorder: SxProps<Theme> = {
  border: `1px solid ${css.border}`,
  borderRadius: '4px',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: css.accent,
  },
};

/**
 * Grid layouts
 */
export const threeColumnGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gap: { xs: 3, md: 4 },
};

export const fourColumnGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
  gap: { xs: 3, md: 4 },
};

/**
 * List styles - arrow bullets instead of dots
 */
export const arrowList: SxProps<Theme> = {
  listStyle: 'none',
  p: 0,
  m: 0,
  '& li': {
    position: 'relative',
    pl: 3,
    py: 0.75,
    '&::before': {
      content: '"\\2192"', // Unicode right arrow
      position: 'absolute',
      left: 0,
      color: css.accent,
      fontWeight: 600,
    },
  },
};

/**
 * Divider styles
 */
export const sectionDivider: SxProps<Theme> = {
  height: 1,
  bgcolor: css.border,
  my: { xs: 6, md: 10 },
};

/**
 * Menu link styles - for blurple links in mega-nav
 */
export const menuLinkBlurple: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: css.accent,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
};

/**
 * Article typography styles - for Terminal (blog-style) pages
 */
export const articleContainer: SxProps<Theme> = {
  maxWidth: 720,
  mx: 'auto',
  px: { xs: 2, sm: 3 },
};

export const articleHeading: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', md: '1.75rem' },
  fontWeight: 600,
  lineHeight: 1.3,
  color: css.foreground,
  mb: 2,
};

export const articleBody: SxProps<Theme> = {
  fontSize: '1.0625rem',
  lineHeight: 1.8,
  color: css.muted,
  '& p': {
    mb: 2,
  },
};

export const pullQuote: SxProps<Theme> = {
  borderLeft: `4px solid ${css.accent}`,
  pl: 3,
  py: 1,
  my: 4,
  fontStyle: 'italic',
  fontSize: '1.125rem',
  color: css.muted,
};

export const imageCaption: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: css.muted,
  fontStyle: 'italic',
  textAlign: 'center',
  mt: 1.5,
};

export const calloutBox: SxProps<Theme> = {
  bgcolor: css.hoverBg,
  borderRadius: '4px',
  p: { xs: 3, md: 4 },
  my: 4,
};

/**
 * Export all styles as a single object for convenience
 */
export const marketingStyles = {
  // Sections
  heroSection,
  heroSectionDark,
  splitSection,
  splitSectionReverse,
  sectionContainer,
  sectionPadding,
  sectionLight,
  sectionDark,

  // Typography
  displayHeading,
  sectionHeading,
  sectionSubheading,
  eyebrowLabel,

  // Stats
  statValue,
  statLabel,
  statsGrid,

  // Cards
  featureCard,
  productCard,
  cardBorder,

  // Grids
  threeColumnGrid,
  fourColumnGrid,

  // Lists
  arrowList,

  // Dividers
  sectionDivider,

  // Menu links
  menuLinkBlurple,

  // Article styles
  articleContainer,
  articleHeading,
  articleBody,
  pullQuote,
  imageCaption,
  calloutBox,
};

export default marketingStyles;
