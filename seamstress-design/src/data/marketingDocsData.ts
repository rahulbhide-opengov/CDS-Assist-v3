/**
 * Marketing Documentation Data
 *
 * Contains props definitions, image manifest, and code snippets
 * for the marketing design system documentation page.
 */

import { cdsColors } from '../theme/cds';

// ============ PROPS DEFINITIONS ============

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export const componentPropsData: Record<string, PropDefinition[]> = {
  IconBadge: [
    { name: 'icon', type: 'React.ElementType', description: 'MUI icon component to render', required: true },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant (32px, 40px, 48px)' },
    { name: 'variant', type: "'blurple' | 'gray'", default: "'blurple'", description: 'Color variant' },
  ],
  MenuSectionTitle: [
    { name: 'children', type: 'React.ReactNode', description: 'Title text content', required: true },
  ],
  CtaLink: [
    { name: 'href', type: 'string', description: 'Link destination URL', required: true },
    { name: 'children', type: 'React.ReactNode', description: 'Link text content', required: true },
    { name: 'showArrow', type: 'boolean', default: 'true', description: 'Show arrow icon after text' },
    { name: 'color', type: "'dark' | 'blurple'", default: "'dark'", description: 'Text color variant' },
  ],
  LinkColumn: [
    { name: 'title', type: 'string', description: 'Column header title', required: true },
    { name: 'links', type: 'LinkItem[]', description: 'Array of link items with label and href', required: true },
    { name: 'linkColor', type: "'blurple' | 'gray'", default: "'blurple'", description: 'Link text color' },
  ],
  HoverCard: [
    { name: 'href', type: 'string', description: 'Card link destination', required: true },
    { name: 'children', type: 'React.ReactNode', description: 'Card content', required: true },
    { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Visual style variant' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  FeaturedCard: [
    { name: 'href', type: 'string', description: 'Card link destination', required: true },
    { name: 'title', type: 'string', description: 'Card title text', required: true },
    { name: 'description', type: 'string', description: 'Card description text', required: true },
    { name: 'image', type: 'string', description: 'URL for header image' },
    { name: 'gradient', type: 'string', description: 'CSS gradient for header (if no image)' },
    { name: 'badge', type: '{ label: string; variant: BadgeVariant }', description: 'Optional badge configuration' },
    { name: 'date', type: 'string', description: 'Optional date string' },
    { name: 'ctaLabel', type: 'string', default: "'Learn more'", description: 'CTA link text' },
    { name: 'width', type: 'number | string', default: '280', description: 'Card width' },
  ],
  PhotoPlaceholder: [
    { name: 'aspectRatio', type: "'1:1' | '4:3' | '16:9' | '21:9'", default: "'16:9'", description: 'Aspect ratio of placeholder' },
    { name: 'label', type: 'string', description: 'Optional centered label text' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  TestimonialCard: [
    { name: 'quote', type: 'string', description: 'Quote text content', required: true },
    { name: 'author', type: 'string', description: 'Author name', required: true },
    { name: 'title', type: 'string', description: 'Author job title', required: true },
    { name: 'organization', type: 'string', description: 'Author organization name', required: true },
    { name: 'caseStudyHref', type: 'string', description: 'Optional link to case study' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  ProfileLockup: [
    { name: 'name', type: 'string', description: "Person's full name", required: true },
    { name: 'title', type: 'string', description: 'Job title or role', required: true },
    { name: 'bio', type: 'string | string[]', description: 'Bio text (single or multiple paragraphs)', required: true },
    { name: 'imageUrl', type: 'string', description: 'URL to portrait image' },
    { name: 'linkedInUrl', type: 'string', description: 'LinkedIn profile URL' },
    { name: 'xUrl', type: 'string', description: 'X (Twitter) profile URL' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  ComparisonTable: [
    { name: 'columns', type: 'string[]', description: 'Column headers (first is usually "Features")', required: true },
    { name: 'rows', type: 'Array<{ feature: string; values: CellValue[] }>', description: 'Row data with feature name and values', required: true },
    { name: 'highlightColumns', type: 'number[]', description: 'Indices of columns to highlight with hatched background' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  BulletedListSection: [
    { name: 'columns', type: 'ListColumn[]', description: 'Array of columns with labels and items', required: true },
    { name: 'columnCount', type: '1 | 2 | 3 | 4', description: 'Number of columns to display' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
  MarketingSection: [
    { name: 'children', type: 'React.ReactNode', description: 'Section content', required: true },
    { name: 'eyebrow', type: 'string', description: 'Small monospace label above heading' },
    { name: 'heading', type: 'string', description: 'Main section heading' },
    { name: 'showLogo', type: 'boolean', default: 'false', description: 'Show OpenGov logo in top right' },
    { name: 'variant', type: "'white' | 'light' | 'dark' | 'primary'", default: "'light'", description: 'Background color variant' },
    { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | false", default: "'lg'", description: 'Maximum content width' },
    { name: 'py', type: 'number | ResponsiveValue', default: '{ xs: 8, md: 12 }', description: 'Vertical padding' },
    { name: 'sx', type: 'SxProps<Theme>', description: 'Additional MUI sx styles' },
  ],
};

// ============ IMAGE MANIFEST ============

export interface ImageAsset {
  id: string;
  filename: string;
  folder: string;
  path: string;
  size: number | null;
  format: 'webp' | 'jpg' | 'png';
}

export const IMAGE_FOLDERS = [
  'agent-studio',
  'eufaula-alabama',
  'starkville-mississippi',
  'taylor-county-west-virginia',
] as const;

export type ImageFolder = typeof IMAGE_FOLDERS[number];

// Generate image manifest from folder structure
export const imageManifest: ImageAsset[] = [
  // Agent Studio (PNG, no size variants)
  { id: 'agent-studio-dashboard', filename: 'dashboard.png', folder: 'agent-studio', path: '/images/marketing/agent-studio/dashboard.png', size: null, format: 'png' },
  { id: 'agent-studio-skill-editor', filename: 'skill-editor.png', folder: 'agent-studio', path: '/images/marketing/agent-studio/skill-editor.png', size: null, format: 'png' },

  // Eufaula, Alabama
  ...['35', '37', '39', '40', '41', '42'].flatMap((num) =>
    [800, 1200, 1920].flatMap((size) =>
      (['webp', 'jpg'] as const).map((format) => ({
        id: `eufaula-${num}-${size}-${format}`,
        filename: `our-customers-${num}-${size}.${format}`,
        folder: 'eufaula-alabama' as const,
        path: `/images/marketing/eufaula-alabama/our-customers-${num}-${size}.${format}`,
        size,
        format,
      }))
    )
  ),

  // Starkville, Mississippi
  ...['72', '74', '75', '76', '77', '78', '79', '80', '81', '82'].flatMap((num) =>
    [800, 1200, 1920].flatMap((size) =>
      (['webp', 'jpg'] as const).map((format) => ({
        id: `starkville-${num}-${size}-${format}`,
        filename: `our-customers-${num}-${size}.${format}`,
        folder: 'starkville-mississippi' as const,
        path: `/images/marketing/starkville-mississippi/our-customers-${num}-${size}.${format}`,
        size,
        format,
      }))
    )
  ),

  // Taylor County, West Virginia
  ...['2', '3', '13', '14', '15', '16', 'dam', 'dam2'].flatMap((num) =>
    [800, 1200, 1920].flatMap((size) =>
      (['webp', 'jpg'] as const).map((format) => ({
        id: `taylor-${num}-${size}-${format}`,
        filename: `our-customers-${num}-${size}.${format}`,
        folder: 'taylor-county-west-virginia' as const,
        path: `/images/marketing/taylor-county-west-virginia/our-customers-${num}-${size}.${format}`,
        size,
        format,
      }))
    )
  ),
];

// ============ CODE SNIPPETS ============

export const codeSnippets = {
  IconBadge: `import { IconBadge } from '@/components/marketing/primitives';
import { AutoAwesome } from '@mui/icons-material';

<IconBadge icon={AutoAwesome} size="md" variant="blurple" />`,

  MenuSectionTitle: `import { MenuSectionTitle } from '@/components/marketing/primitives';

<MenuSectionTitle>Section Title</MenuSectionTitle>`,

  CtaLink: `import { CtaLink } from '@/components/marketing/primitives';

<CtaLink href="/products" showArrow color="dark">
  Learn more
</CtaLink>`,

  LinkColumn: `import { LinkColumn } from '@/components/marketing/primitives';

<LinkColumn
  title="Products"
  links={[
    { label: 'ERP Cloud', href: '/products/erp' },
    { label: 'Permitting', href: '/products/permitting' },
    { label: 'Budgeting', href: '/products/budgeting' },
  ]}
  linkColor="blurple"
/>`,

  HoverCard: `import { HoverCard } from '@/components/marketing/primitives';

<HoverCard href="/product" variant="outline">
  <Box sx={{ p: 3 }}>
    <Typography variant="h6">Product Title</Typography>
    <Typography variant="body2">Description text</Typography>
  </Box>
</HoverCard>`,

  FeaturedCard: `import { FeaturedCard } from '@/components/marketing/primitives';

<FeaturedCard
  href="/blog/post"
  image="/images/blog-header.jpg"
  badge={{ label: 'New', variant: 'success' }}
  date="January 15, 2024"
  title="Blog Post Title"
  description="Brief description of the blog post content."
  ctaLabel="Read more"
  width={320}
/>`,

  PhotoPlaceholder: `import { PhotoPlaceholder } from '@/components/marketing/primitives';

<PhotoPlaceholder
  aspectRatio="16:9"
  label="Hero Image"
/>`,

  TestimonialCard: `import { TestimonialCard } from '@/components/marketing/primitives';

<TestimonialCard
  quote="OpenGov transformed how we manage our city's budget."
  author="Jane Smith"
  title="City Manager"
  organization="Springfield, IL"
  caseStudyHref="/customers/springfield"
/>`,

  ProfileLockup: `import { ProfileLockup } from '@/components/marketing/primitives';

<ProfileLockup
  name="Zac Bookman"
  title="CEO & Co-Founder"
  bio="Zac founded OpenGov with a mission to power more effective government."
  imageUrl="/images/team/zac.jpg"
  linkedInUrl="https://linkedin.com/in/zacbookman"
/>`,

  ComparisonTable: `import { ComparisonTable } from '@/components/marketing/primitives';

<ComparisonTable
  columns={['Features', 'Legacy', 'OpenGov']}
  rows={[
    { feature: 'Cloud-native', values: ['x', 'check'] },
    { feature: 'Real-time reporting', values: ['warning', 'check'] },
    { feature: 'Mobile access', values: ['x', 'check'] },
  ]}
  highlightColumns={[2]}
/>`,

  BulletedListSection: `import { BulletedListSection } from '@/components/marketing/primitives';

<BulletedListSection
  columns={[
    {
      label: 'Benefits',
      items: ['Faster approvals', 'Better visibility', 'Lower costs'],
    },
    {
      label: 'Features',
      items: ['Workflow automation', 'Real-time dashboards', 'Mobile access'],
    },
  ]}
  columnCount={2}
/>`,

  MarketingSection: `import { MarketingSection } from '@/components/marketing/primitives';

<MarketingSection
  eyebrow="Why OpenGov"
  heading="Transform your government operations"
  variant="light"
  showLogo
>
  {/* Section content */}
</MarketingSection>`,
};

// ============ DESIGN TOKEN EXAMPLES ============

export const typographyTokens = [
  { name: 'displayHeading', description: 'Hero headlines, 4rem desktop', styles: 'fontSize: { xs: "2.5rem", md: "4rem" }, fontWeight: 700, lineHeight: 1.1' },
  { name: 'sectionHeading', description: 'Section titles, 2.5rem desktop', styles: 'fontSize: { xs: "1.75rem", md: "2.5rem" }, fontWeight: 700, lineHeight: 1.2' },
  { name: 'sectionSubheading', description: 'Section descriptions', styles: 'fontSize: { xs: "1rem", md: "1.125rem" }, color: gray600, lineHeight: 1.6' },
  { name: 'eyebrowLabel', description: 'Small caps label above headings', styles: 'fontSize: "0.75rem", textTransform: uppercase, letterSpacing: "0.1em", fontFamily: monospace' },
  { name: 'articleHeading', description: 'Blog/article titles', styles: 'fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700, lineHeight: 1.3' },
  { name: 'articleBody', description: 'Long-form content', styles: 'fontSize: "1.0625rem", lineHeight: 1.8, color: gray700' },
];

export const layoutTokens = [
  { name: 'splitSection', description: '50/50 image and content grid', styles: 'display: grid, gridTemplateColumns: { md: "1fr 1fr" }, gap: { xs: 4, md: 6 }' },
  { name: 'threeColumnGrid', description: 'Responsive 3-column layout', styles: 'gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }' },
  { name: 'fourColumnGrid', description: 'Responsive 4-column layout', styles: 'gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }' },
  { name: 'statsGrid', description: 'Stats display grid', styles: 'gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, textAlign: center' },
];

export const colorTokens = [
  { name: 'blurple50', value: cdsColors.blurple50, description: 'Lightest blurple, backgrounds' },
  { name: 'blurple100', value: cdsColors.blurple100, description: 'Light blurple, section backgrounds' },
  { name: 'blurple300', value: cdsColors.blurple300, description: 'Medium blurple, borders' },
  { name: 'blurple500', value: cdsColors.blurple500, description: 'Primary blurple, interactive elements' },
  { name: 'blurple600', value: cdsColors.blurple600, description: 'Dark blurple, primary buttons' },
  { name: 'gray50', value: cdsColors.gray50, description: 'Lightest gray, subtle backgrounds' },
  { name: 'gray100', value: cdsColors.gray100, description: 'Light gray, card backgrounds' },
  { name: 'gray200', value: cdsColors.gray200, description: 'Border gray' },
  { name: 'gray500', value: cdsColors.gray500, description: 'Secondary text' },
  { name: 'gray600', value: cdsColors.gray600, description: 'Body text' },
  { name: 'gray700', value: cdsColors.gray700, description: 'Dark sections' },
  { name: 'gray900', value: cdsColors.gray900, description: 'Heading text' },
];
