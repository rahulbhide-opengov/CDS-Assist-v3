import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Chip,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  TextFields as TypographyIcon,
  ViewQuilt as LayoutIcon,
  Category as ComponentsIcon,
  BarChart as ChartIcon,
  Accessibility as AccessibilityIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  ArrowForward as ArrowIcon,
  Visibility as VisibilityIcon,
  ToggleOn as ToggleIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../components/DocsLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { withBasePath } from '../../utils/basePath';

export default function DocsOverview() {
  const theme = useTheme();
  const navigate = useNavigate();

  useDocumentTitle('Documentation');

  const docsSections = [
    {
      title: 'Theme System',
      description: 'CDS Design Tokens — color palettes, 4px spacing grid, border radius, elevation, focus rings. Every value flows through tokens.',
      icon: PaletteIcon,
      color: theme.palette.primary.main,
      path: '/docs/theme-system',
      highlights: [
        'Live color swatches with CDS tokens',
        '4px spacing grid with visual reference',
        'Border radius & elevation tokens',
        'Focus ring accessibility tokens',
      ],
    },
    {
      title: 'Typography',
      description: 'DM Sans type scale with responsive values across Desktop, Tablet, and Mobile. All 13+ CDS text styles with weights and line-heights.',
      icon: TypographyIcon,
      color: theme.palette.info.main,
      path: '/docs/typography',
      highlights: [
        'DM Sans responsive typography scale',
        'Responsive values (Desktop/Tablet/Mobile)',
        'Hierarchy guidelines (do/don\'t)',
        'Component-specific typography tokens',
      ],
    },
    {
      title: 'Layout Rules',
      description: 'Page structure patterns, responsive grid systems, and spacing guidelines. Interactive demo shows a complete list page with annotated spacing.',
      icon: LayoutIcon,
      color: theme.palette.success.main,
      path: '/docs/layout-rules',
      highlights: [
        'Interactive spacing callouts toggle',
        'Live NavBar + PageHeader + Toolbar demo',
        'DataGrid with proper spacing',
        'Responsive breakpoint guidelines',
      ],
    },
    {
      title: 'Component Patterns',
      description: '74 CDS-themed MUI components with variant showcase, state demos, and do/don\'t guidelines. Every component uses CDS tokens.',
      icon: ComponentsIcon,
      color: theme.palette.info.main,
      path: '/docs/component-patterns',
      highlights: [
        'Button variants (6 colors x 3 styles)',
        'Alert severities (4 x 3 variants)',
        'Interactive controls (Checkbox, Radio, Switch)',
        'Do/Don\'t patterns for each component',
      ],
    },
    {
      title: 'Data Visualization',
      description: 'Chart types, color palettes for data, and accessibility patterns. Live Recharts examples demonstrate the visualization system.',
      icon: ChartIcon,
      color: theme.palette.warning.main,
      path: '/docs/data-visualization',
      highlights: [
        'Bar, Line, Area chart examples',
        'Pie chart with legend patterns',
        'Accessible color sequences',
        'Pattern fills for colorblind users',
      ],
    },
    {
      title: 'Accessibility',
      description: 'Guidelines for building accessible interfaces. Covers keyboard navigation, screen reader support, mobile accessibility, and WCAG compliance.',
      icon: AccessibilityIcon,
      color: theme.palette.secondary.main,
      path: '/docs/accessibility',
      highlights: [
        'Keyboard navigation patterns',
        'Screen reader best practices',
        'Mobile accessibility guidelines',
        'WCAG 2.1 AA compliance',
      ],
    },
  ];

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 8,
            width: '100%',
          }}
        >
          <Container>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
            >
              CDS Design System
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              The Capital Design System (CDS) for OpenGov. Blurple primary, DM Sans, 4px grid, light mode only.
              74 MUI components fully themed through CDS tokens. Every value — colors, typography, spacing, sizing — is a token.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Chip icon={<VisibilityIcon />} label="Visual Examples" color="primary" />
              <Chip icon={<ToggleIcon />} label="Interactive Demos" color="success" />
              <Chip icon={<CodeIcon />} label="Toggleable Code" />
            </Stack>
          </Container>
        </Box>

        {/* Content */}
        <Container sx={{ py: 8 }}>
          {/* Documentation Sections */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
              Documentation Sections
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              {docsSections.map((section) => (
                <Card
                  key={section.title}
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: section.color,
                      boxShadow: `0 4px 20px ${alpha(section.color, 0.15)}`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(withBasePath(section.path))}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: alpha(section.color, 0.1),
                          }}
                        >
                          <section.icon sx={{ color: section.color, fontSize: 32 }} />
                        </Box>
                        <Typography variant="h3">
                          {section.title}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {section.description}
                      </Typography>

                      <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        What's Included
                      </Typography>
                      <Stack spacing={0.5}>
                        {section.highlights.map((highlight, idx) => (
                          <Stack key={idx} direction="row" spacing={1} alignItems="center">
                            <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            <Typography variant="body2">{highlight}</Typography>
                          </Stack>
                        ))}
                      </Stack>

                      <Button
                        endIcon={<ArrowIcon />}
                        sx={{ mt: 2, color: section.color }}
                      >
                        View Documentation
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Design Principles */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
              Design Principles
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                <Typography variant="h3" mb={2} gutterBottom color="primary">
                  Consistency
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '300px' }} color="text.secondary">
                  Every value flows through CDS tokens. No hardcoded colors, spacing, or font sizes.
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                <Typography variant="h3" mb={2} gutterBottom color="success">
                  Accessibility
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '300px' }} color="text.secondary">
                  WCAG 2.1 AA compliant with keyboard nav and screen reader support.
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                <Typography variant="h3" mb={2} gutterBottom color="info">
                  Clarity
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '300px' }} color="text.secondary">
                  Clear visual hierarchies guide users through content and actions.
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                <Typography variant="h3" mb={2} gutterBottom color="warning">
                  Efficiency
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '300px' }} color="text.secondary">
                  Minimize cognitive load and optimize user productivity.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Quick Start */}
          <Box>
            <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
              Quick Start
            </Typography>
            <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Chip label="1" size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Start with Theme System"
                    secondary="Understand CDS color tokens, the 4px spacing grid, border radius, and elevation"
                  />
                  <Button
                    size="small"
                    onClick={() => navigate(withBasePath('/docs/theme-system'))}
                    endIcon={<ArrowIcon />}
                  >
                    Go
                  </Button>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Chip label="2" size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Learn Layout Rules"
                    secondary="Master page structure, responsive grids, and spacing patterns"
                  />
                  <Button
                    size="small"
                    onClick={() => navigate(withBasePath('/docs/layout-rules'))}
                    endIcon={<ArrowIcon />}
                  >
                    Go
                  </Button>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Chip label="3" size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Explore Component Patterns"
                    secondary="See visual examples of lists, forms, details, and dashboards"
                  />
                  <Button
                    size="small"
                    onClick={() => navigate(withBasePath('/docs/component-patterns'))}
                    endIcon={<ArrowIcon />}
                  >
                    Go
                  </Button>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Chip label="4" size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Review Data Visualization"
                    secondary="Apply accessible chart patterns and color palettes"
                  />
                  <Button
                    size="small"
                    onClick={() => navigate(withBasePath('/docs/data-visualization'))}
                    endIcon={<ArrowIcon />}
                  >
                    Go
                  </Button>
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Container>
      </Box>
    </DocsLayout>
  );
}
