/**
 * ComponentsShowcase
 *
 * Documents all 12 marketing primitives with live examples,
 * props tables, and code snippets.
 */

import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import {
  AutoAwesome,
  Speed,
  Security,
  CloudQueue,
} from '@mui/icons-material';
import { cdsColors } from '../../../theme/cds';
import { ComponentDocBlock } from './ComponentDocBlock';
import {
  IconBadge,
  MenuSectionTitle,
  CtaLink,
  LinkColumn,
  HoverCard,
  FeaturedCard,
  PhotoPlaceholder,
  TestimonialCard,
  ProfileLockup,
  ComparisonTable,
  BulletedListSection,
  MarketingSection,
} from '../primitives';
import { componentPropsData, codeSnippets } from '../../../data/marketingDocsData';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

const colors = cdsColors;

export const ComponentsShowcase: React.FC = () => {
  const { marketingColors } = useMarketingTheme();

  return (
    <Box>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        12 marketing primitives built for OpenGov brand consistency. Each component
        follows the NASA 1976 Graphics Standards Manual-inspired design system.
      </Typography>

      {/* IconBadge */}
      <ComponentDocBlock
        name="IconBadge"
        description="A colored circle containing an icon, used in feature cards and menus."
        code={codeSnippets.IconBadge}
        propsData={componentPropsData.IconBadge}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <IconBadge icon={AutoAwesome} size="sm" variant="blurple" />
          <IconBadge icon={Speed} size="md" variant="blurple" />
          <IconBadge icon={Security} size="lg" variant="blurple" />
          <IconBadge icon={CloudQueue} size="md" variant="gray" />
        </Stack>
      </ComponentDocBlock>

      {/* MenuSectionTitle */}
      <ComponentDocBlock
        name="MenuSectionTitle"
        description="Typography wrapper for section titles in mega-nav menus."
        code={codeSnippets.MenuSectionTitle}
        propsData={componentPropsData.MenuSectionTitle}
      >
        <MenuSectionTitle>Products & Solutions</MenuSectionTitle>
      </ComponentDocBlock>

      {/* CtaLink */}
      <ComponentDocBlock
        name="CtaLink"
        description="A link with optional arrow icon, used for 'Learn more' CTAs."
        code={codeSnippets.CtaLink}
        propsData={componentPropsData.CtaLink}
      >
        <Stack direction="row" spacing={4}>
          <CtaLink href="#" color="dark">Learn more</CtaLink>
          <CtaLink href="#" color="blurple">View details</CtaLink>
          <CtaLink href="#" showArrow={false}>No arrow</CtaLink>
        </Stack>
      </ComponentDocBlock>

      {/* LinkColumn */}
      <ComponentDocBlock
        name="LinkColumn"
        description="A column with a title and vertical list of links. Used in mega-nav and footer."
        code={codeSnippets.LinkColumn}
        propsData={componentPropsData.LinkColumn}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6}>
          <LinkColumn
            title="Products"
            links={[
              { label: 'ERP Cloud', href: '#' },
              { label: 'Permitting & Licensing', href: '#' },
              { label: 'Budgeting & Planning', href: '#' },
            ]}
            linkColor="blurple"
          />
          <LinkColumn
            title="Resources"
            links={[
              { label: 'Blog', href: '#' },
              { label: 'Webinars', href: '#' },
              { label: 'Case Studies', href: '#' },
            ]}
            linkColor="gray"
          />
        </Stack>
      </ComponentDocBlock>

      {/* HoverCard */}
      <ComponentDocBlock
        name="HoverCard"
        description="A clickable card container with border and hover effect."
        code={codeSnippets.HoverCard}
        propsData={componentPropsData.HoverCard}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <HoverCard href="#" variant="outline" sx={{ width: 200 }}>
            <Box sx={{ p: 3 }}>
              <IconBadge icon={Speed} size="md" />
              <Typography sx={{ fontWeight: 600, mt: 2 }}>
                Outline Variant
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: marketingColors.muted, mt: 1 }}>
                Default card style
              </Typography>
            </Box>
          </HoverCard>
          <HoverCard href="#" variant="filled" sx={{ width: 200 }}>
            <Box sx={{ p: 3 }}>
              <IconBadge icon={Security} size="md" />
              <Typography sx={{ fontWeight: 600, mt: 2 }}>
                Filled Variant
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: marketingColors.muted, mt: 1 }}>
                Subtle background
              </Typography>
            </Box>
          </HoverCard>
        </Stack>
      </ComponentDocBlock>

      {/* FeaturedCard */}
      <ComponentDocBlock
        name="FeaturedCard"
        description="A card with image/gradient, badge, title, description, and CTA."
        code={codeSnippets.FeaturedCard}
        propsData={componentPropsData.FeaturedCard}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <FeaturedCard
            href="#"
            gradient={`linear-gradient(135deg, ${colors.blurple100} 0%, ${colors.blurple200} 100%)`}
            badge={{ label: 'New', variant: 'success' }}
            title="Customer Success Story"
            description="How Springfield saved 40% on permit processing time."
            width={280}
          />
          <FeaturedCard
            href="#"
            badge={{ label: 'Webinar', variant: 'info' }}
            date="February 15, 2024"
            title="2024 Budget Planning"
            description="Best practices for government financial planning."
            ctaLabel="Register now"
            width={280}
          />
        </Stack>
      </ComponentDocBlock>

      {/* PhotoPlaceholder */}
      <ComponentDocBlock
        name="PhotoPlaceholder"
        description="A placeholder component for photography with defined aspect ratios."
        code={codeSnippets.PhotoPlaceholder}
        propsData={componentPropsData.PhotoPlaceholder}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
          <Box sx={{ width: 200 }}>
            <PhotoPlaceholder aspectRatio="1:1" label="Profile" />
          </Box>
          <Box sx={{ width: 280 }}>
            <PhotoPlaceholder aspectRatio="16:9" label="Hero" />
          </Box>
          <Box sx={{ width: 200 }}>
            <PhotoPlaceholder aspectRatio="4:3" label="Thumbnail" />
          </Box>
        </Stack>
      </ComponentDocBlock>

      {/* TestimonialCard */}
      <ComponentDocBlock
        name="TestimonialCard"
        description="A card displaying a customer quote with author information."
        code={codeSnippets.TestimonialCard}
        propsData={componentPropsData.TestimonialCard}
      >
        <Box sx={{ maxWidth: 600 }}>
          <TestimonialCard
            quote="OpenGov transformed how we manage our city's budget. The transparency and efficiency gains have been remarkable."
            author="Jane Smith"
            title="City Manager"
            organization="Springfield, IL"
            caseStudyHref="#"
          />
        </Box>
      </ComponentDocBlock>

      {/* ProfileLockup */}
      <ComponentDocBlock
        name="ProfileLockup"
        description="Split layout for leadership/team member profiles with portrait photo and bio."
        code={codeSnippets.ProfileLockup}
        propsData={componentPropsData.ProfileLockup}
      >
        <Box sx={{ maxWidth: 900 }}>
          <ProfileLockup
            name="Zac Bookman"
            title="CEO & Co-Founder"
            bio="Zac founded OpenGov with a mission to power more effective and accountable government. Under his leadership, OpenGov has grown to serve over 2,000 governments across the United States."
            linkedInUrl="#"
          />
        </Box>
      </ComponentDocBlock>

      {/* ComparisonTable */}
      <ComponentDocBlock
        name="ComparisonTable"
        description="Feature comparison table with check/x/warning indicators and optional hatched column highlighting."
        code={codeSnippets.ComparisonTable}
        propsData={componentPropsData.ComparisonTable}
      >
        <Box sx={{ maxWidth: 600 }}>
          <ComparisonTable
            columns={['Features', 'Legacy Systems', 'OpenGov']}
            rows={[
              { feature: 'Cloud-native architecture', values: ['x', 'check'] },
              { feature: 'Real-time reporting', values: ['warning', 'check'] },
              { feature: 'Mobile access', values: ['x', 'check'] },
              { feature: 'Automatic updates', values: ['x', 'check'] },
            ]}
            highlightColumns={[2]}
          />
        </Box>
      </ComponentDocBlock>

      {/* BulletedListSection */}
      <ComponentDocBlock
        name="BulletedListSection"
        description="Multi-column layout with labeled arrow-bulleted lists."
        code={codeSnippets.BulletedListSection}
        propsData={componentPropsData.BulletedListSection}
      >
        <BulletedListSection
          columns={[
            {
              label: 'Benefits',
              items: [
                'Faster permit approvals',
                'Improved citizen satisfaction',
                'Reduced administrative costs',
              ],
            },
            {
              label: 'Features',
              items: [
                'Automated workflows',
                'Real-time dashboards',
                'Mobile inspector app',
              ],
            },
          ]}
          columnCount={2}
        />
      </ComponentDocBlock>

      {/* MarketingSection */}
      <ComponentDocBlock
        name="MarketingSection"
        description="Full-width section wrapper with OpenGov brand backgrounds."
        code={codeSnippets.MarketingSection}
        propsData={componentPropsData.MarketingSection}
      >
        <Box sx={{ mx: -4, mb: -4 }}>
          <Stack spacing={0}>
            <MarketingSection
              eyebrow="Our Platform"
              heading="Modern cloud software"
              variant="light"
              py={4}
              maxWidth={false}
            >
              <Typography sx={{ color: marketingColors.muted }}>
                Light variant with eyebrow and heading
              </Typography>
            </MarketingSection>
            <MarketingSection
              variant="dark"
              py={4}
              maxWidth={false}
            >
              <Typography sx={{ fontWeight: 600, color: marketingColors.invertedText }}>
                Dark variant section
              </Typography>
            </MarketingSection>
          </Stack>
        </Box>
      </ComponentDocBlock>
    </Box>
  );
};
