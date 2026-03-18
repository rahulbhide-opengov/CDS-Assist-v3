/**
 * MarketingHomePage
 *
 * Marketing home page with NASA Graphics Manual-inspired layouts.
 * Features hero section, product overview, customer stories, and stats.
 *
 * REFACTORED: Now uses streamlined marketing primitives and CSS variables
 * for automatic light/dark mode support with minimal boilerplate.
 */

import React from 'react';
import { Box, Grid } from '@mui/material';
import { AccountBalance, Assessment, Speed, Security, Cloud, GroupWork } from '@mui/icons-material';
import { marketingStyles } from '../../theme/marketing-styles';
import {
  // Section components
  MarketingSection,
  MarketingStatsBar,
  MarketingCtaBanner,
  // UI primitives
  IconBadge,
  HoverCard,
  BulletedListSection,
  // Button components
  MarketingButton,
  MarketingButtonOnAccent,
  // Typography components
  Eyebrow,
  DisplayHeading,
  LeadText,
  SectionHeader,
  CardTitle,
  CardDescription,
} from '../../components/marketing/primitives';
import { marketingCssVars as css } from '../../theme/marketing-palette';

// Why OpenGov bullet points
const whyOpenGov = [
  {
    label: 'For Your Residents',
    items: [
      'Faster service, fewer trips to city hall',
      'Pay bills, pull permits, track requests online',
      'Transparency that builds lasting trust',
    ],
  },
  {
    label: 'For Your Team',
    items: [
      'Eliminate manual work that wastes talent',
      'One platform, every department connected',
      'Time back for work that actually matters',
    ],
  },
  {
    label: 'For Your Mission',
    items: [
      'Join 2,000+ governments already transforming',
      'Real results: 40% average time savings',
      'A partner invested in your success',
    ],
  },
];

const features = [
  { icon: AccountBalance, title: 'Financial Clarity', description: 'See your entire financial picture in one place. Close the books faster. Make decisions with confidence.' },
  { icon: Assessment, title: 'Insights That Matter', description: 'Stop digging through spreadsheets. Get real-time answers to the questions your council is asking.' },
  { icon: Speed, title: 'Hours Back in Your Day', description: 'Automate the busywork. Route approvals instantly. Let your team focus on serving residents.' },
  { icon: Security, title: 'Sleep-Well Security', description: 'SOC 2 certified. Bank-grade encryption. Your data protected like it should be.' },
  { icon: Cloud, title: 'Always On, Always Current', description: 'No more upgrade weekends. No more server rooms. Just 99.9% uptime and continuous improvements.' },
  { icon: GroupWork, title: 'Residents First', description: 'Give your community the digital experience they expect. Online payments, permit tracking, 24/7 access.' },
];

const stats = [
  { value: '2,000+', label: 'Governments Transformed' },
  { value: '$50B+', label: 'Public Dollars Managed' },
  { value: '99.9%', label: 'Uptime, Every Day' },
  { value: '40%', label: 'Time Given Back' },
];

const customers = [
  { name: 'City of Phoenix', type: 'City Government' },
  { name: 'State of California', type: 'State Government' },
  { name: 'Miami-Dade County', type: 'County Government' },
  { name: 'City of Austin', type: 'City Government' },
];

const MarketingHomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section - uses MarketingSection with 'background' variant */}
      <MarketingSection variant="background" py={{ xs: 8, md: 12, lg: 16 }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Eyebrow>There's a better way</Eyebrow>
            <DisplayHeading accent="excellent government">
              Your community deserves
            </DisplayHeading>
            <LeadText>
              Residents get faster service. Staff get time back. Leaders get clarity. One platform that connects every department and puts your mission first.
            </LeadText>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MarketingButton showArrow>
                See it in action
              </MarketingButton>
              <MarketingButton variant="outline">
                Watch the story
              </MarketingButton>
            </Box>
          </Grid>
        </Grid>
      </MarketingSection>

      {/* Stats Section - uses dedicated MarketingStatsBar */}
      <MarketingStatsBar stats={stats} />

      {/* Features Section */}
      <MarketingSection variant="background">
        <SectionHeader
          eyebrow="What changes"
          heading="Less frustration. More impact."
          centered
        />
        <Box sx={marketingStyles.threeColumnGrid}>
          {features.map((feature) => (
            <Box key={feature.title} sx={marketingStyles.featureCard}>
              <Box sx={{ mb: 2.5 }}>
                <IconBadge icon={feature.icon} size="lg" />
              </Box>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Box>
          ))}
        </Box>
      </MarketingSection>

      {/* Why OpenGov - Bulleted Lists */}
      <MarketingSection
        eyebrow="The OpenGov difference"
        heading="Everyone wins."
        variant="light"
      >
        <BulletedListSection columns={whyOpenGov} sx={{ mt: 8 }} />
      </MarketingSection>

      {/* Customer Stories Section */}
      <MarketingSection variant="background">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Eyebrow>Governments like yours</Eyebrow>
            <Box component="h2" sx={{ ...marketingStyles.sectionHeading, color: css.foreground }}>
              They took the leap. Here's what happened.
            </Box>
            <LeadText sx={{ mb: 4 }}>
              Small towns. Big cities. Entire states. They all had the same frustrations you do. Now they're running excellent governments.
            </LeadText>
            <MarketingButton variant="ghost" showArrow>
              Read their stories
            </MarketingButton>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {customers.map((customer) => (
                <Grid size={{ xs: 6 }} key={customer.name}>
                  <HoverCard href="#" variant="filled" sx={{ p: 3, cursor: 'pointer' }}>
                    <Box sx={{ mb: 2 }}>
                      <IconBadge icon={AccountBalance} size="md" />
                    </Box>
                    <CardTitle sx={{ mb: 0.5 }}>{customer.name}</CardTitle>
                    <CardDescription>{customer.type}</CardDescription>
                  </HoverCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MarketingSection>

      {/* CTA Section - uses dedicated MarketingCtaBanner */}
      <MarketingCtaBanner
        heading="Your residents are waiting."
        subheading="Every day with outdated systems is a day your community isn't getting the service they deserve. Let's change that together."
      >
        <MarketingButtonOnAccent showArrow>
          Start the conversation
        </MarketingButtonOnAccent>
        <MarketingButtonOnAccent variant="outline">
          Talk to our team
        </MarketingButtonOnAccent>
      </MarketingCtaBanner>
    </Box>
  );
};

export default MarketingHomePage;
