import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import {
  Speed,
  Language,
  Assessment,
  PhoneAndroid,
  Autorenew,
  Security,
  CreditCard,
  Backup,
  Support,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { marketingStyles } from '../../theme/marketing-styles';
import { IconBadge, PhotoPlaceholder, TestimonialCard, MarketingSection, BulletedListSection } from '../../components/marketing/primitives';

const colors = capitalDesignTokens.foundations.colors;

// Data structures
const keyBenefits = [
  {
    icon: Speed,
    title: 'Days become hours',
    description: 'Permits that used to take weeks now move in days. Residents get answers faster. Your team stops drowning in backlog.',
  },
  {
    icon: Language,
    title: 'Open 24/7, no overtime',
    description: 'Residents apply, pay, and check status whenever it works for them. Your front desk gets quieter. Everyone wins.',
  },
  {
    icon: Assessment,
    title: 'See what\'s really happening',
    description: 'Dashboards that show you bottlenecks before they become problems. Answer council questions with actual data.',
  },
  {
    icon: PhoneAndroid,
    title: 'Inspections, no paperwork',
    description: 'Inspectors update records from the field. Photos, notes, approvals—all in one place before they get back to the office.',
  },
  {
    icon: Autorenew,
    title: 'Renewals that run themselves',
    description: 'Automatic reminders. Online processing. Revenue that never slips through the cracks. Compliance without chasing.',
  },
];

const coreFeatures = [
  {
    title: 'Record Management',
    description: 'Every permit, license, and application in one place. Find anything in seconds, not file cabinets.',
  },
  {
    title: 'Workflows Your Way',
    description: 'Route approvals, trigger inspections, collect payments—exactly how your process needs to work.',
  },
  {
    title: 'Forms That Fit',
    description: 'Ask for exactly what you need. No more "see attached" or chasing missing information.',
  },
  {
    title: 'Renewal Campaigns',
    description: 'Set it and forget it. Reminders go out, payments come in, compliance stays on track.',
  },
  {
    title: 'Reporting That Answers',
    description: 'Stop building reports. Start getting answers. Trends, performance, bottlenecks—all visible.',
  },
  {
    title: 'Mobile App',
    description: 'Works offline. Syncs when connected. Your inspectors stay productive wherever the job takes them.',
  },
];

const portalFeatures = [
  'Apply online with forms that guide them through',
  'Pay instantly—credit card, e-check, their choice',
  'Upload documents without visiting your office',
  'Schedule inspections when it works for them',
  'Check status anytime, renew with a few clicks',
];

const backOfficeFeatures = [
  'Create records fast—fewer clicks, less frustration',
  'One inbox for everything that needs attention',
  'Assign inspections, see the full schedule',
  'Payments reconciled, refunds processed cleanly',
  'See what every department is working on',
];

const securityFeatures = [
  { icon: Security, label: 'SOC 2 certified security' },
  { icon: CreditCard, label: 'Bank-grade payment processing' },
  { icon: Backup, label: 'Your data backed up and protected' },
  { icon: Support, label: 'A team invested in your success' },
];

// Why OpenGov Permitting bullet points
const whyPermitting = [
  {
    label: 'For Residents',
    items: [
      'Apply from home, at midnight if they want',
      'Know exactly where their application stands',
      'Pay the way that works for them',
    ],
  },
  {
    label: 'For Staff',
    items: [
      'Approvals route themselves to the right person',
      'Inspections managed from their phone',
      'Reports ready when they need them',
    ],
  },
  {
    label: 'For Leaders',
    items: [
      'See how every department is performing',
      'Processing times cut in half—or more',
      'Revenue protected through automatic compliance',
    ],
  },
];

const PLCMarketingPage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={marketingStyles.splitSection}>
            <Box>
              <Typography sx={marketingStyles.eyebrowLabel}>
                There's a better way
              </Typography>
              <Typography sx={marketingStyles.displayHeading}>
                Permits and licenses{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  without the pain
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  color: colors.gray700,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Your residents shouldn't have to take time off work to pull a permit. Your staff shouldn't spend their days on data entry. From application to inspection to renewal—there's a better way.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.125rem',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  See it in action
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.125rem',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Watch their story
                </Button>
              </Box>
            </Box>
            <Box>
              <PhotoPlaceholder aspectRatio="4:3" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Key Benefits Section */}
      <Box sx={{ bgcolor: colors.gray50, py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              color: colors.gray900,
              textAlign: 'center',
              mb: 6,
            }}
          >
            What actually changes
          </Typography>
          <Box sx={marketingStyles.threeColumnGrid}>
            {keyBenefits.map((benefit, index) => (
              <Box key={index} sx={marketingStyles.featureCard}>
                <IconBadge icon={benefit.icon} size="lg" />
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: colors.gray900,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: colors.gray700, lineHeight: 1.6 }}>
                  {benefit.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Why OpenGov Permitting - Bulleted Lists */}
      <MarketingSection
        eyebrow="Everyone wins"
        heading="Better for residents. Easier for staff. Visible to leaders."
        variant="light"
      >
        <BulletedListSection columns={whyPermitting} sx={{ mt: 8 }} />
      </MarketingSection>

      {/* Core Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              color: colors.gray900,
              textAlign: 'center',
              mb: 6,
            }}
          >
            Everything you need. Nothing you don't.
          </Typography>
          <Box sx={marketingStyles.threeColumnGrid}>
            {coreFeatures.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: 2,
                  p: { xs: 3, md: 4 },
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: colors.primary,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.gray900,
                    mb: 1,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.gray700, lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Public Portal Experience Section */}
      <Box sx={{ bgcolor: colors.gray50, py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={marketingStyles.splitSection}>
            <Box>
              <PhotoPlaceholder aspectRatio="16:9" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: colors.gray900,
                  mb: 2,
                }}
              >
                Your 24/7 front desk
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  color: colors.gray600,
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Residents and businesses get the digital experience they expect—from any device, at any hour. Fewer phone calls, shorter lines, happier community.
              </Typography>
              <Box sx={marketingStyles.arrowList}>
                {portalFeatures.map((feature, index) => (
                  <Typography key={index} component="li">
                    {feature}
                  </Typography>
                ))}
              </Box>
              <Typography
                sx={{
                  mt: 4,
                  fontStyle: 'italic',
                  fontSize: '1.125rem',
                  color: colors.gray700,
                  borderLeft: `4px solid ${colors.primary}`,
                  pl: 3,
                }}
              >
                "Our call volume dropped 40% in the first month. Residents love it."
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Back Office Efficiency Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={marketingStyles.splitSectionReverse}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: colors.gray900,
                  mb: 2,
                }}
              >
                Your team gets time back
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  color: colors.gray600,
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Less data entry. Fewer phone calls. Automatic routing. Your staff can focus on the work that actually needs their expertise.
              </Typography>
              <Box sx={marketingStyles.arrowList}>
                {backOfficeFeatures.map((feature, index) => (
                  <Typography key={index} component="li">
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box>
              <PhotoPlaceholder aspectRatio="16:9" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box sx={{ bgcolor: colors.gray50, py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={marketingStyles.splitSection}>
            <Box>
              <TestimonialCard
                quote="Permits that used to take two weeks now take three days. Our contractors are thrilled, and so are we."
                author="Building Department, City of Riverside"
              />
            </Box>
            <Box>
              <PhotoPlaceholder aspectRatio="1:1" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Security, Compliance, and Support Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={marketingStyles.calloutBox}>
            <Typography
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: colors.gray900,
                textAlign: 'center',
                mb: 6,
              }}
            >
              Built to earn your trust
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 4,
                textAlign: 'center',
              }}
            >
              {securityFeatures.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconBadge icon={feature.icon} size="md" />
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: colors.gray900,
                    }}
                  >
                    {feature.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Final CTA Banner */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'white',
                mb: 4,
              }}
            >
              Your community deserves faster, better service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.125rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: colors.gray50,
                  },
                }}
              >
                See it in action
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.125rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Talk to our team
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footnotes Section */}
      <Box
        sx={{
          bgcolor: colors.gray50,
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          borderTop: `1px solid ${colors.gray200}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600, lineHeight: 1.8 }}>
            <sup>1</sup> Based on Renewal Campaign capabilities documented in OpenGov training
            materials.
            <br />
            <sup>2</sup> Referencing Workflow step types: Approval, Document, Inspection, Payment
            as outlined in Permitting & Licensing configuration guides.
            <br />
            <sup>3</sup> Mobile inspection capabilities require the OpenGov mobile app, available
            for iOS and Android.
            <br />
            <sup>4</sup> Payment processing integrates with Stripe for secure credit card and
            e-check transactions.
            <br />
            <sup>5</sup> Explore reporting tools provide customizable dashboards and data exports
            for performance analysis.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PLCMarketingPage;
