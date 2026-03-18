import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { SeamstressLayout } from '../../components/SeamstressLayout';
import { SkillCard } from '../../components/SkillCard';
import type { SkillCardProps } from '../../components/SkillCard';

const allSkills: SkillCardProps[] = [
  // Core Skills
  {
    name: 'seamstress-core-principles',
    category: 'core',
    description:
      'Golden rules and validation checklist for building Seamstress React prototypes. Enforces PageHeaderComposable requirement, theme tokens only, entity-scoped routes, and all 4 states (loading, error, empty, success).',
    keywords: ['principles', 'rules', 'validation', 'best practices', 'golden rules', 'standards'],
    useCases: [
      'Ask "What are Seamstress golden rules?"',
      'Validate generated code follows principles',
      'Learn about PageHeaderComposable requirement',
      'Understand anti-patterns to avoid',
    ],
    relatedSkills: ['component-hierarchy', 'all patterns'],
  },
  {
    name: 'seamstress-component-hierarchy',
    category: 'core',
    description:
      'Component selection priority and import order conventions. Defines Priority 1: OpenGov components → Priority 2: MUI components → Priority 3: Custom components. Includes decision trees and import organization.',
    keywords: ['imports', 'components', 'hierarchy', 'priority', 'opengov', 'mui'],
    useCases: [
      'Ask "What\'s the component priority hierarchy?"',
      'Learn which component library to use first',
      'Understand import order conventions',
      'Decide between OpenGov vs MUI components',
    ],
    relatedSkills: ['core-principles', 'theme-system'],
  },

  // Domain Skills
  {
    name: 'seamstress-routing-patterns',
    category: 'domain',
    description:
      'Entity-scoped routing patterns using /entity/{entityId}/resource format. Includes navigation examples, breadcrumbs, route guards, and integration with React Router v6.',
    keywords: ['routes', 'routing', 'navigation', 'entity-scoped', 'breadcrumbs', 'urls'],
    useCases: [
      'Ask "How do entity-scoped routes work?"',
      'Learn route structure for resources',
      'Understand navigation patterns',
      'Implement breadcrumbs correctly',
    ],
    relatedSkills: ['core-principles', 'architecture'],
  },
  {
    name: 'seamstress-business-logic',
    category: 'domain',
    description:
      'Effect.ts patterns for async operations, custom hooks with abort controllers, CRUD operations, error handling, and state management. Includes mock data generation patterns.',
    keywords: ['effect', 'async', 'hooks', 'data', 'fetching', 'crud', 'state'],
    useCases: [
      'Ask "How do I fetch data with Effect.ts?"',
      'Implement custom hooks for data loading',
      'Handle async operations with abort controllers',
      'Generate mock data for testing',
    ],
    relatedSkills: ['form-pattern', 'list-view-pattern', 'detail-view-pattern'],
  },
  {
    name: 'seamstress-theme-system',
    category: 'domain',
    description:
      'Theme token usage, design tokens from capitalDesignTokens, spacing (8px base unit), typography scale, color palette. Prohibits hardcoded values and enforces minimal overrides philosophy.',
    keywords: ['theme', 'tokens', 'colors', 'spacing', 'typography', 'styling', 'design tokens'],
    useCases: [
      'Ask "How do I customize colors?"',
      'Learn about theme token usage',
      'Understand spacing system (8px grid)',
      'Avoid hardcoded style values',
    ],
    relatedSkills: ['core-principles', 'figma-integration', 'accessibility'],
  },
  {
    name: 'seamstress-figma-integration',
    category: 'domain',
    description:
      'Design validation checklist, token mapping from Figma to code, 8px grid alignment, visual hierarchy verification, and Code Connect patterns for design-to-code workflow.',
    keywords: ['figma', 'design', 'validation', 'tokens', 'grid', 'design-to-code'],
    useCases: [
      'Ask "How do I validate against Figma?"',
      'Map Figma design tokens to code',
      'Verify 8px grid alignment',
      'Use Figma MCP for extraction',
    ],
    relatedSkills: ['theme-system', 'accessibility'],
  },
  {
    name: 'seamstress-architecture',
    category: 'domain',
    description:
      'System architecture and build resolution hierarchy: MUI → Capital Design Tokens → Capital MUI Theme → Seamstress Overrides. Explains project structure, layer organization, and design philosophy.',
    keywords: ['architecture', 'structure', 'layers', 'hierarchy', 'build', 'system design'],
    useCases: [
      'Ask "Explain Seamstress architecture"',
      'Understand build resolution order',
      'Learn project structure conventions',
      'See how layers compose',
    ],
    relatedSkills: ['component-hierarchy', 'theme-system', 'routing-patterns'],
  },
  {
    name: 'seamstress-accessibility',
    category: 'domain',
    description:
      'WCAG 2.1 AA compliance standards, keyboard navigation patterns, ARIA attributes, color contrast requirements (4.5:1 for text, 3:1 for UI), focus management, and screen reader support.',
    keywords: ['accessibility', 'a11y', 'wcag', 'keyboard', 'aria', 'contrast', 'focus'],
    useCases: [
      'Ask "What are accessibility requirements?"',
      'Verify color contrast ratios',
      'Implement keyboard navigation',
      'Add proper ARIA labels',
    ],
    relatedSkills: ['core-principles', 'theme-system'],
  },
  {
    name: 'seamstress-figma-layout-detection',
    category: 'domain',
    description:
      'Automatically detects OpenGov NavBar components in Figma designs and generates suite-specific layouts and navigation configs. Checks for existing layout files before creating new ones, extracts suite name and menu structure, and updates routing.',
    keywords: ['figma', 'layout', 'navbar', 'nav', 'suite', 'detection', 'opengov', 'generate layout'],
    useCases: [
      'Ask "Does this Figma have a NavBar?"',
      'Automatically generate suite layouts',
      'Check for existing layout files',
      'Create nav configs for new suites',
    ],
    relatedSkills: ['figma-integration', 'architecture', 'routing-patterns'],
  },
  {
    name: 'seamstress-pattern-discovery',
    category: 'domain',
    description:
      'Discovers existing component usage patterns in the codebase before implementing new features. Uses grep/glob to find existing patterns for APIs, components, imports, and implementations. Prevents API misuse by referencing actual working examples.',
    keywords: ['grep', 'search', 'pattern', 'discovery', 'existing', 'usage', 'examples', 'codebase'],
    useCases: [
      'Ask "How is DataGrid used in this codebase?"',
      'Find existing PageHeaderComposable usage patterns',
      'Check Grid component API before using',
      'Search for component import patterns',
    ],
    relatedSkills: ['component-hierarchy', 'core-principles', 'list-view-pattern'],
  },

  // Pattern Skills
  {
    name: 'list-view-pattern',
    category: 'patterns',
    description:
      'DataGrid list views with search, filters, sorting, pagination. Includes all 4 states (loading, error, empty, success), column definitions, action buttons, and entity-scoped navigation.',
    keywords: ['list', 'table', 'datagrid', 'search', 'filter', 'pagination', 'grid'],
    useCases: [
      'Ask "Explain the list view pattern"',
      'Generate a list page with DataGrid',
      'Implement search and filters',
      'Add pagination and sorting',
    ],
    relatedSkills: ['core-principles', 'routing-patterns', 'business-logic'],
  },
  {
    name: 'form-pattern',
    category: 'patterns',
    description:
      'Create/edit forms with validation, isDirty tracking, unsaved changes warning, field-level error messages, form state management, and submit/cancel actions.',
    keywords: ['form', 'create', 'edit', 'validation', 'input', 'save', 'isDirty'],
    useCases: [
      'Ask "How do I build a form?"',
      'Generate create/edit form',
      'Implement form validation',
      'Add unsaved changes warning',
    ],
    relatedSkills: ['core-principles', 'business-logic', 'routing-patterns'],
  },
  {
    name: 'detail-view-pattern',
    category: 'patterns',
    description:
      'Read-only detail views with edit/delete actions, field display patterns, metadata sections, confirmation dialogs, and proper status indicators.',
    keywords: ['detail', 'view', 'display', 'show', 'read-only', 'metadata'],
    useCases: [
      'Ask "Show me the detail view pattern"',
      'Generate a detail page',
      'Display entity information',
      'Add edit/delete actions',
    ],
    relatedSkills: ['core-principles', 'routing-patterns', 'form-pattern'],
  },
  {
    name: 'dashboard-pattern',
    category: 'patterns',
    description:
      'Dashboard pages with metric cards, data visualizations, responsive grid layouts, aggregated data display, and time-based filtering.',
    keywords: ['dashboard', 'metrics', 'cards', 'charts', 'stats', 'summary', 'overview'],
    useCases: [
      'Ask "How do I build a dashboard?"',
      'Generate metric card layouts',
      'Display aggregated data',
      'Add data visualizations',
    ],
    relatedSkills: ['core-principles', 'business-logic', 'theme-system'],
  },
];

export default function SkillsReferencePage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'domain' | 'patterns'>(
    'all'
  );

  const filteredSkills = allSkills.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const coreSkills = filteredSkills.filter((s) => s.category === 'core');
  const domainSkills = filteredSkills.filter((s) => s.category === 'domain');
  const patternSkills = filteredSkills.filter((s) => s.category === 'patterns');

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                Skills Reference
              </Typography>
            </Stack>
            <Typography variant="h5" color="text.secondary" paragraph>
              Complete catalog of all 13 Seamstress semantic skills
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Each skill is a focused knowledge module that Claude can discover and use
              automatically. Browse by category or search for specific capabilities.
            </Typography>
          </Box>

          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              How to Use This Reference
            </Typography>
            <Typography variant="body2">
              Skills live in <code>.claude/skills/</code> and are auto-discovered by Claude based
              on keywords in your request. You don't need to memorize skill names—just ask what
              you want in natural language, and Claude will find the relevant skills.
            </Typography>
          </Alert>

          {/* Search and Filter */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  placeholder="Search skills by name, description, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Tabs
                  value={selectedCategory}
                  onChange={(_, newValue) => setSelectedCategory(newValue)}
                  variant="fullWidth"
                >
                  <Tab label="All" value="all" />
                  <Tab label="Core" value="core" />
                  <Tab label="Domain" value="domain" />
                  <Tab label="Patterns" value="patterns" />
                </Tabs>
              </Grid>
            </Grid>

            {/* Results Count */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredSkills.length} of {allSkills.length} skills
              </Typography>
            </Box>
          </Paper>

          {/* Core Skills Section */}
          {(selectedCategory === 'all' || selectedCategory === 'core') && coreSkills.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label="Core" color="primary" />
                  <Typography variant="h4" component="h2">
                    Core Foundation Skills ({coreSkills.length})
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Essential principles and hierarchies that guide all Seamstress code generation.
                  These skills are referenced by most pattern and domain skills.
                </Typography>
              </Paper>

              <Grid container spacing={3}>
                {coreSkills.map((skill) => (
                  <Grid size={{ xs: 12, md: 6 }} key={skill.name}>
                    <SkillCard {...skill} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Domain Skills Section */}
          {(selectedCategory === 'all' || selectedCategory === 'domain') &&
            domainSkills.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `2px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label="Domain" color="secondary" />
                    <Typography variant="h4" component="h2">
                      Domain Knowledge Skills ({domainSkills.length})
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Specialized knowledge for specific technical domains like routing, business
                    logic, theming, Figma integration, architecture, and accessibility.
                  </Typography>
                </Paper>

                <Grid container spacing={3}>
                  {domainSkills.map((skill) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={skill.name}>
                      <SkillCard {...skill} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

          {/* Pattern Skills Section */}
          {(selectedCategory === 'all' || selectedCategory === 'patterns') &&
            patternSkills.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `2px solid ${theme.palette.success.main}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label="Patterns" color="success" />
                    <Typography variant="h4" component="h2">
                      UI Pattern Skills ({patternSkills.length})
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Reusable UI patterns for common page types: lists, forms, detail views, and
                    dashboards. These combine core and domain skills automatically.
                  </Typography>
                </Paper>

                <Grid container spacing={3}>
                  {patternSkills.map((skill) => (
                    <Grid size={{ xs: 12, md: 6 }} key={skill.name}>
                      <SkillCard {...skill} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

          {/* No Results */}
          {filteredSkills.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No skills found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search query or category filter
              </Typography>
            </Paper>
          )}

          {/* Skills Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Skills Organization
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  2
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  Core Skills
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Foundation principles and component hierarchy
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h3" color="secondary.main" fontWeight="bold">
                  7
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  Domain Skills
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Routing, business logic, theming, Figma integration, layout detection, architecture, accessibility
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  4
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  Pattern Skills
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  List, form, detail view, and dashboard patterns
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
