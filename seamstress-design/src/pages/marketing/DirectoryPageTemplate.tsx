/**
 * DirectoryPageTemplate
 *
 * Product hub page template that links to modular features/sub-products.
 * Example content: ERP product page linking to Budgeting, Financial Management, Payroll, etc.
 *
 * REFACTORED: Now uses streamlined marketing primitives and CSS variables
 * for automatic light/dark mode support with minimal boilerplate.
 */

import React from 'react';
import { Box, Grid } from '@mui/material';
import { PlayArrow, AccountBalance, Assessment, Payments, CardGiftcard, ShoppingCart, Inventory } from '@mui/icons-material';
import { marketingStyles } from '../../theme/marketing-styles';
import {
  // Section components
  MarketingSection,
  MarketingSplitSection,
  MarketingStatsBar,
  MarketingCtaBanner,
  // UI primitives
  IconBadge,
  HoverCard,
  PhotoPlaceholder,
  TestimonialCard,
  ProfileLockup,
  ComparisonTable,
  // Button components
  MarketingButton,
  MarketingButtonOnAccent,
  // Typography components
  Eyebrow,
  DisplayHeading,
  LeadText,
  SectionHeader,
  SectionHeading,
  CardTitle,
  CardDescription,
  BodyText,
} from '../../components/marketing/primitives';
import { marketingCssVars as css } from '../../theme/marketing-palette';

// ERP Product Modules
const productModules = [
  {
    icon: Assessment,
    title: 'Budgeting & Planning',
    description: 'Build budgets your council will actually understand. Scenario planning that answers "what if" in seconds.',
    href: '/marketing/products/budgeting',
  },
  {
    icon: AccountBalance,
    title: 'Financial Management',
    description: 'Close the books in days, not weeks. Real-time visibility into every fund, every department.',
    href: '/marketing/products/financial-management',
  },
  {
    icon: Payments,
    title: 'Payroll',
    description: 'Pay your people accurately, on time, every time. Compliance handled automatically.',
    href: '/marketing/products/payroll',
  },
  {
    icon: CardGiftcard,
    title: 'Grants Management',
    description: 'Win more grants. Spend them compliantly. Report effortlessly from application to closeout.',
    href: '/marketing/products/grants',
  },
  {
    icon: ShoppingCart,
    title: 'Procurement',
    description: 'From requisition to payment in a fraction of the time. Your vendors will notice the difference.',
    href: '/marketing/products/procurement',
  },
  {
    icon: Inventory,
    title: 'Asset Management',
    description: 'Know what you own, where it is, and when it needs attention. No more spreadsheet archaeology.',
    href: '/marketing/products/assets',
  },
];

// Feature bullets for spotlight section
const featureBullets = [
  'One place for all your financial data—no more hunting',
  'Approvals that route themselves, not pile up on desks',
  'Dashboards that show each department what they need',
  'Data flows automatically—enter it once, use it everywhere',
  'Reports that build themselves while you focus on decisions',
];

// Stats data
const stats = [
  { value: '$50B+', label: 'Public Dollars Trusted to Us' },
  { value: '2,000+', label: 'Governments Running Better' },
  { value: '99.9%', label: 'Uptime, Every Single Day' },
  { value: '40%', label: 'Time Given Back to Your Team' },
];

// Integration partners
const integrationPartners = [
  'Tyler Technologies',
  'Workday',
  'ADP',
  'Salesforce',
];

// ERP comparison data
const erpComparison = {
  columns: ['Features', 'Horizontal ERP', 'Legacy Govtech', 'OpenGov'],
  rows: [
    { feature: 'Built for Government Workflows', values: ['warning', 'check', 'check'] },
    { feature: 'Cloud-Native Architecture', values: ['check', 'x', 'check'] },
    { feature: 'Modern User Experience', values: ['check', 'x', 'check'] },
    { feature: 'Multi-Fund Accounting', values: ['x', 'check', 'check'] },
    { feature: 'GASB/GAAP Compliance', values: ['warning', 'check', 'check'] },
    { feature: 'Real-Time Reporting', values: ['check', 'warning', 'check'] },
    { feature: 'Integrated Budgeting', values: ['warning', 'warning', 'check'] },
  ],
};

const DirectoryPageTemplate: React.FC = () => {
  return (
    <Box>
      {/* SECTION 1: HERO (split layout) */}
      <MarketingSplitSection
        variant="surface"
        content={
          <>
            <Eyebrow>There's a better way</Eyebrow>
            <DisplayHeading accent="works like you do">
              Finally, an ERP that
            </DisplayHeading>
            <LeadText>
              Your finance team deserves software that makes them heroes, not hostages. One platform where budgets, books, payroll, and procurement all speak the same language.
            </LeadText>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MarketingButton showArrow>
                See it in action
              </MarketingButton>
              <MarketingButton variant="outline" startIcon={<PlayArrow />}>
                Watch their story
              </MarketingButton>
            </Box>
          </>
        }
        media={
          <PhotoPlaceholder aspectRatio="4:3" label="ERP Dashboard Screenshot" />
        }
      />

      {/* SECTION 2: PRODUCT MODULES GRID */}
      <MarketingSection variant="background">
        <SectionHeader
          eyebrow="What's included"
          heading="Six problems. One solution."
          centered
        />
        <Box sx={marketingStyles.threeColumnGrid}>
          {productModules.map((module) => (
            <HoverCard key={module.title} href={module.href} variant="outline">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ mb: 2.5 }}>
                  <IconBadge icon={module.icon} size="lg" />
                </Box>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </Box>
            </HoverCard>
          ))}
        </Box>
      </MarketingSection>

      {/* SECTION 3: FEATURE SPOTLIGHT (split layout, reversed) */}
      <MarketingSplitSection
        variant="surface"
        reverse
        content={
          <>
            <Eyebrow>The end of workarounds</Eyebrow>
            <SectionHeading>When everything connects, everything changes.</SectionHeading>
            <LeadText sx={{ mb: 4, maxWidth: 'none' }}>
              No more exporting to Excel, emailing for updates, or reconciling across systems. Your data lives in one place and moves where it needs to go.
            </LeadText>
            <Box component="ul" sx={marketingStyles.arrowList}>
              {featureBullets.map((bullet) => (
                <li key={bullet}>
                  <BodyText>{bullet}</BodyText>
                </li>
              ))}
            </Box>
          </>
        }
        media={
          <PhotoPlaceholder aspectRatio="16:9" label="Workflow Screenshot" />
        }
      />

      {/* SECTION 4: STATS BAR */}
      <MarketingStatsBar stats={stats} />

      {/* SECTION 5: INTEGRATION PARTNERS */}
      <MarketingSection variant="background" py={{ xs: 8, md: 10 }}>
        <SectionHeader
          eyebrow="Plays well with others"
          heading="Keep what works. Connect it to what's next."
          centered
        />
        <Box sx={marketingStyles.fourColumnGrid}>
          {integrationPartners.map((partner) => (
            <Box
              key={partner}
              sx={{
                bgcolor: css.surface,
                border: `1px solid ${css.border}`,
                borderRadius: '8px',
                p: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 100,
              }}
            >
              <BodyText sx={{ fontWeight: 600 }}>{partner}</BodyText>
            </Box>
          ))}
        </Box>
      </MarketingSection>

      {/* SECTION 6: COMPARISON TABLE */}
      <MarketingSection
        eyebrow="Why it matters"
        heading="Not all ERP is created equal."
        variant="light"
      >
        <ComparisonTable
          columns={erpComparison.columns}
          rows={erpComparison.rows}
          highlightColumns={[3]}
          sx={{ mt: 8 }}
        />
      </MarketingSection>

      {/* SECTION 7: TESTIMONIAL (split layout) */}
      <MarketingSplitSection
        variant="surface"
        content={
          <TestimonialCard
            quote="We used to dread month-end close. Now we're done in three days and actually trust the numbers. Our council can finally see where every dollar goes—and so can our residents."
            author="Sarah Mitchell"
            title="Finance Director"
            organization="City of Riverside"
            caseStudyHref="/marketing/customers/riverside"
          />
        }
        media={
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Box
              component="img"
              src="/images/marketing/starkville-mississippi/our-customers-82-1920.webp"
              alt="Historic building in Starkville, Mississippi"
              sx={{
                maxWidth: 300,
                width: '100%',
                aspectRatio: '1 / 1.5',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </Box>
        }
      />

      {/* SECTION 8: CUSTOMER PROFILE */}
      <MarketingSection variant="light">
        <ProfileLockup
          name="Robert Thompson"
          title="Finance Director, Taylor County, West Virginia"
          bio={[
            'Robert has led Taylor County\'s finance department for over 15 years, managing a $42 million budget serving 17,000 residents. He championed the county\'s digital transformation initiative that modernized decades-old financial systems.',
            'Since adopting OpenGov ERP, Taylor County has reduced month-end close from 12 days to 3 days and eliminated 40 hours of manual reconciliation each month. The county received the GFOA Certificate of Achievement for Excellence in Financial Reporting for the first time in its history.',
          ]}
          imageUrl="/images/marketing/taylor-county-west-virginia/our-customers-dam-1200.webp"
          linkedInUrl="https://linkedin.com"
        />
      </MarketingSection>

      {/* SECTION 9: CTA BANNER */}
      <MarketingCtaBanner
        heading="Your finance team deserves better."
        subheading="Every day with disconnected systems is another day of workarounds, manual reconciliation, and unanswered questions. Let's fix that."
      >
        <MarketingButtonOnAccent showArrow>
          See it in action
        </MarketingButtonOnAccent>
        <MarketingButtonOnAccent variant="outline">
          Talk to our team
        </MarketingButtonOnAccent>
      </MarketingCtaBanner>
    </Box>
  );
};

export default DirectoryPageTemplate;
