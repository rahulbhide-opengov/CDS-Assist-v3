/**
 * TestimonialCard
 *
 * A card displaying a customer quote with author information.
 * Optionally links to a case study for more details.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { CtaLink } from './CtaLink';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  organization: string;
  caseStudyHref?: string;
  sx?: SxProps<Theme>;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  title,
  organization,
  caseStudyHref,
  sx,
}) => {
  const { marketingColors } = useMarketingTheme();

  return (
    <Box sx={sx}>
      {/* Quote mark */}
      <Typography
        sx={{
          fontSize: '4rem',
          lineHeight: 1,
          color: marketingColors.accentMuted,
          fontFamily: 'Georgia, serif',
          mb: -2,
        }}
      >
        "
      </Typography>

      {/* Quote text */}
      <Typography
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 400,
          lineHeight: 1.6,
          color: marketingColors.muted,
          fontStyle: 'italic',
          mb: 3,
        }}
      >
        {quote}
      </Typography>

      {/* Author info */}
      <Box>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: marketingColors.foreground,
          }}
        >
          {author}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: marketingColors.muted,
          }}
        >
          {title}, {organization}
        </Typography>
      </Box>

      {/* Case study link */}
      {caseStudyHref && (
        <Box sx={{ mt: 3 }}>
          <CtaLink href={caseStudyHref}>Read case study</CtaLink>
        </Box>
      )}
    </Box>
  );
};
