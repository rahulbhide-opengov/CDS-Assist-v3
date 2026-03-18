import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Code as CodeIcon,
  Palette as PaletteIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Extension as ExtensionIcon,
  Groups as GroupsIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { SeamstressLayout } from '../../components/SeamstressLayout';

const FeatureCard = ({ icon, title, description, link }: any) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="h3" sx={{ ml: 2 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Button
          variant="text"
          size="small"
          sx={{ mt: 1 }}
          href={link}
        >
          Learn More →
        </Button>
      </CardContent>
    </Card>
  );
};

const QuickStartCard = ({ title, description, role, link, color }: any) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: alpha(theme.palette[color].main, 0.05),
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: alpha(theme.palette[color].main, 0.1),
          borderColor: theme.palette[color].main,
        },
      }}
    >
      <Chip
        label={role}
        size="small"
        color={color}
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Button
        variant="contained"
        color={color}
        size="small"
        href={link}
        sx={{ mt: 1 }}
      >
        Get Started
      </Button>
    </Paper>
  );
};

export default function SeamstressHome() {
  const theme = useTheme();

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 10,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Seamstress
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 3 }}
                >
                  The modern design system that threads together design and development
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Build beautiful, consistent, and accessible applications with our comprehensive
                  component library and design guidelines. Perfect for developers, designers, and
                  product teams working together.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    href="/seamstress/getting-started"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/seamstress/playground"
                  >
                    Try Playground
                  </Button>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AutoAwesomeIcon
                    sx={{
                      fontSize: 300,
                      color: alpha(theme.palette.primary.main, 0.2),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Quick Start Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Start Your Journey
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <QuickStartCard
                title="For Developers"
                description="Dive into our React component library, explore our APIs, and learn best practices for building scalable applications."
                role="Developer"
                link="/seamstress/getting-started/developers"
                color="primary"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <QuickStartCard
                title="For Designers"
                description="Access our design tokens, learn about our visual language, and discover how to create beautiful, cohesive interfaces."
                role="Designer"
                link="/seamstress/getting-started/designers"
                color="secondary"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <QuickStartCard
                title="For Product Managers"
                description="Understand our design system capabilities, learn how to leverage components for faster delivery, and align your team."
                role="Product Manager"
                link="/seamstress/getting-started/product-managers"
                color="success"
              />
            </Grid>
          </Grid>
        </Container>

        {/* Features Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 2 }}>
              Why Seamstress?
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
              Everything you need to build modern, accessible, and beautiful applications
            </Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<ExtensionIcon color="primary" fontSize="large" />}
                  title="Comprehensive Components"
                  description="Over 50+ pre-built, customizable React components ready for production use. From basic buttons to complex data grids."
                  link="/seamstress/components"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<PaletteIcon color="secondary" fontSize="large" />}
                  title="Design System Foundation"
                  description="Built on solid design principles with consistent spacing, typography, and color systems that scale."
                  link="/seamstress/design-system"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<SpeedIcon color="success" fontSize="large" />}
                  title="Developer Experience"
                  description="TypeScript support, comprehensive documentation, and tooling that makes development a breeze."
                  link="/seamstress/developers"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<BusinessIcon color="info" fontSize="large" />}
                  title="Enterprise Ready"
                  description="Battle-tested in production environments with accessibility, security, and performance as core priorities."
                  link="/seamstress/resources"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<GroupsIcon color="warning" fontSize="large" />}
                  title="Active Community"
                  description="Join thousands of developers and designers using Seamstress to build amazing products."
                  link="/seamstress/resources/community"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FeatureCard
                  icon={<CodeIcon color="error" fontSize="large" />}
                  title="Open Source"
                  description="Free and open source with a permissive license. Contribute, customize, and make it your own."
                  link="https://github.com/seamstress/seamstress"
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Statistics Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Built for Scale
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Seamstress powers applications used by millions of users worldwide.
                Our components are optimized for performance and accessibility.
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box>
                  <Typography variant="h3" color="primary.main">
                    50+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Production-ready components
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" color="secondary.main">
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accessibility compliance (WCAG 2.1 AA)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" color="success.main">
                    &lt;50ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average component render time
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Latest Updates
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="primary.main">
                      v2.5.0 - New Data Grid Component
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Advanced data grid with sorting, filtering, and virtualization
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.main">
                      v2.4.0 - Dark Mode Support
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Complete dark mode theming across all components
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.main">
                      v2.3.0 - Performance Improvements
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      30% faster render times and reduced bundle size
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="text"
                  size="small"
                  sx={{ mt: 2 }}
                  href="/seamstress/resources/changelog"
                >
                  View Full Changelog →
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: 8,
            mt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4 }}>
              Join thousands of teams building with Seamstress
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
                href="/seamstress/getting-started"
              >
                Start Building
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
                href="https://github.com/seamstress/seamstress"
                startIcon={<GitHubIcon />}
              >
                View on GitHub
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
    </SeamstressLayout>
  );
}