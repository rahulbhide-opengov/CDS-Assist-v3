/**
 * FeaturedCard
 *
 * A card with image/gradient, badge, title, description, and CTA.
 * Used in ResourcesMenu, CompanyMenu, and CustomersMenu.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { HoverCard } from './HoverCard';
import { CtaLink } from './CtaLink';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export type BadgeVariant = 'success' | 'info';

interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
}

export interface FeaturedCardProps {
  href: string;
  image?: string;
  gradient?: string;
  badge?: BadgeConfig;
  date?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  width?: number | string;
}

// Badge styles will be computed per-instance using marketingColors
const getBadgeStyles = (variant: BadgeVariant, marketingColors: ReturnType<typeof import('../../../contexts/MarketingThemeContext').useMarketingTheme>['marketingColors']) => ({
  success: {
    bgcolor: marketingColors.successBg,
    color: marketingColors.successText,
  },
  info: {
    bgcolor: marketingColors.accentBgMedium,
    color: marketingColors.accent,
  },
}[variant]);

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  href,
  image,
  gradient,
  badge,
  date,
  title,
  description,
  ctaLabel = 'Learn more',
  width = 280,
}) => {
  const { marketingColors } = useMarketingTheme();
  const showHeader = image || gradient;

  return (
    <HoverCard
      href={href}
      variant="outline"
      sx={{
        width,
        flexShrink: 0,
        '&:hover': {
          borderColor: marketingColors.accent,
          bgcolor: marketingColors.hoverBg,
          '& .featured-title': {
            color: marketingColors.accent,
          },
          '& .cta-link': {
            color: marketingColors.accent,
            '& .MuiTypography-root': {
              color: marketingColors.accent,
            },
            '& svg': {
              color: marketingColors.accent,
              opacity: 1,
              transform: 'translateX(0)',
            },
          },
        },
      }}
    >
      {/* Image/Gradient Area - only show if image or gradient provided */}
      {showHeader && (
        <Box
          sx={{
            height: 140,
            bgcolor: marketingColors.hoverBg,
            backgroundImage: image ? `url(${image})` : gradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Badge */}
        {badge && (
          <Box
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              mb: date ? 1 : 2,
              ...getBadgeStyles(badge.variant, marketingColors),
            }}
          >
            {badge.label}
          </Box>
        )}

        {/* Date */}
        {date && (
          <Typography sx={{ fontSize: '0.8125rem', color: marketingColors.muted, mb: 1 }}>
            {date}
          </Typography>
        )}

        {/* Title */}
        <Typography
          className="featured-title"
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: marketingColors.foreground,
            mb: 1,
            lineHeight: 1.3,
            transition: 'color 0.2s ease',
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: marketingColors.muted,
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* CTA */}
        <CtaLink href={href}>{ctaLabel}</CtaLink>
      </Box>
    </HoverCard>
  );
};
