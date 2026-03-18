/**
 * Marketing Primitives
 *
 * Reusable components for marketing pages.
 * These components extract common patterns from mega-nav menus and marketing pages
 * to reduce duplication and improve maintainability.
 *
 * All components use CSS variables for automatic light/dark mode support.
 */

// Core primitives
export { IconBadge } from './IconBadge';
export type { IconBadgeProps } from './IconBadge';

export { MenuSectionTitle } from './MenuSectionTitle';
export type { MenuSectionTitleProps } from './MenuSectionTitle';

export { CtaLink } from './CtaLink';
export type { CtaLinkProps } from './CtaLink';

export { LinkColumn } from './LinkColumn';
export type { LinkColumnProps, LinkItem } from './LinkColumn';

export { HoverCard } from './HoverCard';
export type { HoverCardProps } from './HoverCard';

export { FeaturedCard } from './FeaturedCard';
export type { FeaturedCardProps, BadgeVariant } from './FeaturedCard';

export { PhotoPlaceholder } from './PhotoPlaceholder';
export type { PhotoPlaceholderProps, AspectRatio } from './PhotoPlaceholder';

export { TestimonialCard } from './TestimonialCard';
export type { TestimonialCardProps } from './TestimonialCard';

export { ProfileLockup } from './ProfileLockup';
export type { ProfileLockupProps } from './ProfileLockup';

export { ComparisonTable } from './ComparisonTable';
export type { ComparisonTableProps } from './ComparisonTable';

export { BulletedListSection } from './BulletedListSection';
export type { BulletedListSectionProps, ListColumn } from './BulletedListSection';

export { ThemedLogo } from './ThemedLogo';
export type { ThemedLogoProps } from './ThemedLogo';

// Section components
export {
  MarketingSection,
  MarketingSplitSection,
  MarketingStatsBar,
  MarketingCtaBanner,
} from './MarketingSection';
export type {
  MarketingSectionProps,
  MarketingSectionVariant,
  MarketingSplitSectionProps,
  MarketingStatsBarProps,
  MarketingCtaBannerProps,
} from './MarketingSection';

// Button components
export { MarketingButton, MarketingButtonOnAccent } from './MarketingButton';
export type { MarketingButtonProps, MarketingButtonVariant, MarketingButtonSize } from './MarketingButton';

// Typography components
export {
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
} from './MarketingTypography';
export type {
  EyebrowProps,
  DisplayHeadingProps,
  SectionHeadingProps,
  SubsectionHeadingProps,
  LeadTextProps,
  BodyTextProps,
  AccentTextProps,
  StatValueProps,
  StatLabelProps,
  CardTitleProps,
  CardDescriptionProps,
  SectionHeaderProps,
} from './MarketingTypography';
