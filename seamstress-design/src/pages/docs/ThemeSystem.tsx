import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  useTheme,
  alpha,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  TextFields as TypographyIcon,
  SpaceBar as SpacingIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { cdsColors } from '../../theme/cds';
import { DocsLayout } from '../../components/DocsLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

// Helper to convert any color value to hex
const colorToHex = (color: string): string => {
  // If already hex, return as-is
  if (color.startsWith('#')) return color.toUpperCase();

  // Handle rgba/rgb
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  }

  return color;
};

// Mapping of semantic tokens to Capital Design System foundational tokens
// Light mode mappings (from capitalMuiTheme)
const semanticToFoundationalMap: Record<string, string> = {
  // Primary
  'primary.light': 'foundations.colors.blurple100',
  'primary.main': 'foundations.colors.blurple700',
  'primary.dark': 'foundations.colors.blurple900',
  'primary.contrastText': 'foundations.colors.white',
  // Secondary
  'secondary.light': 'foundations.colors.slate100',
  'secondary.main': 'foundations.colors.slate700',
  'secondary.dark': 'foundations.colors.slate900',
  'secondary.contrastText': 'foundations.colors.white',
  // Error
  'error.light': 'foundations.colors.red100',
  'error.main': 'foundations.colors.red700',
  'error.dark': 'foundations.colors.red900',
  'error.contrastText': 'foundations.colors.white',
  // Warning
  'warning.light': 'foundations.colors.yellow100',
  'warning.main': 'foundations.colors.yellow700',
  'warning.dark': 'foundations.colors.yellow900',
  'warning.contrastText': 'foundations.colors.white',
  // Info
  'info.light': 'foundations.colors.teal100',
  'info.main': 'foundations.colors.teal700',
  'info.dark': 'foundations.colors.teal900',
  'info.contrastText': 'foundations.colors.white',
  // Success
  'success.light': 'foundations.colors.green100',
  'success.main': 'foundations.colors.green700',
  'success.dark': 'foundations.colors.green900',
  'success.contrastText': 'foundations.colors.white',
  // Grey
  'grey.50': 'foundations.colors.gray50',
  'grey.100': 'foundations.colors.gray100',
  'grey.200': 'foundations.colors.gray200',
  'grey.300': 'foundations.colors.gray300',
  'grey.400': 'foundations.colors.gray400',
  'grey.500': 'foundations.colors.gray500',
  'grey.600': 'foundations.colors.gray600',
  'grey.700': 'foundations.colors.gray700',
  'grey.800': 'foundations.colors.gray800',
  'grey.900': 'foundations.colors.gray900',
  // Background
  'background.default': 'foundations.colors.white',
  'background.paper': 'foundations.colors.white',
  'background.secondary': 'foundations.colors.gray50',
  // Common
  'common.white': 'foundations.colors.white',
  'common.black': 'foundations.colors.black',
};

export default function ThemeSystem() {
  const theme = useTheme();
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  useDocumentTitle('Theme System');

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Enhanced ColorSwatch with token and hex display
  const ColorSwatch = ({
    color,
    token,
    label,
    foundationalToken
  }: {
    color: string;
    token: string;
    label?: string;
    foundationalToken?: string;
  }) => {
    const hexValue = colorToHex(color);
    const displayLabel = label || token.split('.').pop() || token;
    // Look up foundational token if not provided
    const cdsToken = foundationalToken || semanticToFoundationalMap[token];

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          height: '100%',
        }}
      >
        <Stack spacing={1.5}>
          <Box
            sx={{
              width: '100%',
              height: 64,
              borderRadius: 1,
              bgcolor: color,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
          <Box>
            <Typography variant="caption" fontWeight="bold" display="block">
              {displayLabel}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
              >
                {token}
              </Typography>
              <Tooltip title={copiedToken === token ? 'Copied!' : 'Copy token'}>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(token, token)}
                  sx={{ p: 0.25 }}
                >
                  <CopyIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            </Stack>
            {cdsToken && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
                >
                  {cdsToken}
                </Typography>
                <Tooltip title={copiedToken === `${token}-cds` ? 'Copied!' : 'Copy CDS token'}>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(cdsToken, `${token}-cds`)}
                    sx={{ p: 0.25 }}
                  >
                    <CopyIcon sx={{ fontSize: 10 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
              >
                {hexValue}
              </Typography>
              <Tooltip title={copiedToken === `${token}-hex` ? 'Copied!' : 'Copy hex'}>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(hexValue, `${token}-hex`)}
                  sx={{ p: 0.25 }}
                >
                  <CopyIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    );
  };

  const CodeBlock = ({ children }: { children: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        overflow: 'auto',
      }}
    >
      <pre style={{ margin: 0 }}>{children}</pre>
    </Paper>
  );

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
            >
              Theme System
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              Comprehensive guide to theme tokens, color palettes, typography, spacing, and dark mode support
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Chip label="CDS Design System" color="primary" />
              <Chip label="Material-UI v7" color="success" />
              <Chip label="Light Mode Only" />
              <Chip label="4px Grid" />
            </Stack>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Introduction */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" gutterBottom>
              Theme Architecture
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The CDS theme is built on Material-UI v7 and provides a complete, light-mode-only design system.
              Every value — colors, typography, spacing, sizing, elevations, border-radius, and component defaults —
              is defined as a CDS design token. Zero raw values leak through.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Use the exported <code>cdsTheme</code> with MUI's <code>ThemeProvider</code>:
            </Typography>
            <CodeBlock>{`import { ThemeProvider } from '@mui/material/styles';
import { cdsTheme } from './theme/cds';

<ThemeProvider theme={cdsTheme}>
  <App />
</ThemeProvider>`}</CodeBlock>
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  1. CDS Design Tokens (tokens.ts)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  colorTokens, typographyTokens, spacingTokens, sizingTokens, borderRadiusTokens,
                  elevationTokens, zIndexTokens, transitionTokens, breakpointTokens
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  2. 74 MUI Component Overrides (theme.ts)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every MUI component styled through CDS tokens — Button, TextField, Card, Dialog, Table,
                  Chip, Alert, Tabs, Accordion, Slider, and 64 more
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  3. Responsive Design (3 breakpoints)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desktop (1440+), Tablet (768-1439), Mobile (390-767) — typography and sizing
                  scale automatically across breakpoints
                </Typography>
              </Paper>
            </Stack>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Color Palette */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <PaletteIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Color Palette</Typography>
            </Stack>

            {/* Primary Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Primary Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Primary color is used for main actions, links, and focus states.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.primary.light} token="primary.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.primary.main} token="primary.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.primary.dark} token="primary.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.primary.contrastText} token="primary.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Secondary Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Secondary Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Secondary color is used for secondary actions and accents.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.secondary.light} token="secondary.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.secondary.main} token="secondary.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.secondary.dark} token="secondary.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.secondary.contrastText} token="secondary.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Error Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Error Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use for error states, destructive actions, and critical alerts.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.error.light} token="error.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.error.main} token="error.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.error.dark} token="error.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.error.contrastText} token="error.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Warning Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Warning Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use for warning states and cautionary messages.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.warning.light} token="warning.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.warning.main} token="warning.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.warning.dark} token="warning.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.warning.contrastText} token="warning.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Info Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Info Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use for informational messages and neutral highlights.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.info.light} token="info.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.info.main} token="info.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.info.dark} token="info.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.info.contrastText} token="info.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Success Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Success Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use for success states, confirmations, and positive feedback.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.success.light} token="success.light" label="Light" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.success.main} token="success.main" label="Main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.success.dark} token="success.dark" label="Dark" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <ColorSwatch color={theme.palette.success.contrastText} token="success.contrastText" label="Contrast Text" />
                </Grid>
              </Grid>
            </Box>

            {/* Grey Scale */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Grey Scale
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Neutral greys for borders, backgrounds, and subtle UI elements.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[50]} token="grey.50" label="50" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[100]} token="grey.100" label="100" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[200]} token="grey.200" label="200" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[300]} token="grey.300" label="300" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[400]} token="grey.400" label="400" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[500]} token="grey.500" label="500" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[600]} token="grey.600" label="600" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[700]} token="grey.700" label="700" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[800]} token="grey.800" label="800" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey[900]} token="grey.900" label="900" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey.A100} token="grey.A100" label="A100" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.grey.A200} token="grey.A200" label="A200" />
                </Grid>
              </Grid>
            </Box>

            {/* Text Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Text Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Text colors ensure proper contrast and readability across light and dark modes.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.text.primary} token="text.primary" label="Primary" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.text.secondary} token="text.secondary" label="Secondary" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.text.disabled} token="text.disabled" label="Disabled" />
                </Grid>
              </Grid>
            </Box>

            {/* Background Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Background Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Background colors establish visual hierarchy and content grouping.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.background.default} token="background.default" label="Default" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.background.paper} token="background.paper" label="Paper" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch
                    color={(theme.palette.background as any).secondary || cdsColors.gray100}
                    token="background.secondary"
                    label="Secondary"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Action Colors */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Action Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Colors for interactive states like hover, selected, and disabled.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.active} token="action.active" label="Active" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.hover} token="action.hover" label="Hover" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.selected} token="action.selected" label="Selected" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.disabled} token="action.disabled" label="Disabled" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.disabledBackground} token="action.disabledBackground" label="Disabled Bg" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <ColorSwatch color={theme.palette.action.focus} token="action.focus" label="Focus" />
                </Grid>
              </Grid>
            </Box>

            {/* Divider & Common */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Divider & Common Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Utility colors for dividers and common use cases.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.divider} token="divider" label="Divider" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.common.white} token="common.white" label="White" />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <ColorSwatch color={theme.palette.common.black} token="common.black" label="Black" />
                </Grid>
              </Grid>
            </Box>

            {/* Using Colors */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Using Theme Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Access theme colors via the <code>theme</code> object or MUI's <code>sx</code> prop shorthand:
              </Typography>
              <CodeBlock>{`import { useTheme } from '@mui/material';

const theme = useTheme();

// Using theme object
<Box sx={{ bgcolor: theme.palette.primary.main }} />

// Using sx shorthand (preferred)
<Box sx={{ bgcolor: 'primary.main' }} />
<Typography color="text.secondary" />
<Paper sx={{ bgcolor: 'background.paper' }} />`}</CodeBlock>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Typography */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <TypographyIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Typography</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              The theme uses Material-UI&apos;s typography system with CDS Design System fonts (DM Sans). The type scale is designed for
              clarity and hierarchy across all screen sizes.
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Variant</strong></TableCell>
                    <TableCell><strong>Use Case</strong></TableCell>
                    <TableCell><strong>Example</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><code>h1</code></TableCell>
                    <TableCell>Page titles</TableCell>
                    <TableCell><Typography variant="h1" sx={{ fontSize: '2rem' }}>Heading 1</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>h2</code></TableCell>
                    <TableCell>Section titles</TableCell>
                    <TableCell><Typography variant="h2" sx={{ fontSize: '1.5rem' }}>Heading 2</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>h3</code></TableCell>
                    <TableCell>Subsection titles</TableCell>
                    <TableCell><Typography variant="h3" sx={{ fontSize: '1.25rem' }}>Heading 3</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>body1</code></TableCell>
                    <TableCell>Primary body text</TableCell>
                    <TableCell><Typography variant="body1">Body text example</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>body2</code></TableCell>
                    <TableCell>Secondary body text</TableCell>
                    <TableCell><Typography variant="body2">Smaller body text</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>caption</code></TableCell>
                    <TableCell>Captions, labels</TableCell>
                    <TableCell><Typography variant="caption">Caption text</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Using Typography
              </Typography>
              <CodeBlock>{`// Using Typography component
<Typography variant="h1">Page Title</Typography>
<Typography variant="body1" color="text.secondary">
  Body text with secondary color
</Typography>

// Font weight
<Typography variant="h3" fontWeight="bold">
  Bold heading
</Typography>

// Text alignment
<Typography variant="body1" align="center">
  Centered text
</Typography>`}</CodeBlock>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Spacing */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <SpacingIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Spacing System</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              CDS uses a <strong>4px base spacing unit</strong>. All spacing values must land on the 4px grid.
              Use the <code>theme.spacing()</code> function or <code>sx</code> prop multipliers.
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Multiplier</strong></TableCell>
                    <TableCell><strong>Pixels</strong></TableCell>
                    <TableCell><strong>Token</strong></TableCell>
                    <TableCell><strong>Usage</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><code>0.5</code></TableCell>
                    <TableCell>2px</TableCell>
                    <TableCell><code>spacingTokens.values[0.5]</code></TableCell>
                    <TableCell>Tab indicator height, fine borders</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>1</code></TableCell>
                    <TableCell>4px</TableCell>
                    <TableCell><code>spacingTokens.base</code></TableCell>
                    <TableCell>Minimal spacing, progress bar height</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>2</code></TableCell>
                    <TableCell>8px</TableCell>
                    <TableCell><code>spacingTokens.values[2]</code></TableCell>
                    <TableCell>Small gaps, compact padding</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>3</code></TableCell>
                    <TableCell>12px</TableCell>
                    <TableCell><code>spacingTokens.values[3]</code></TableCell>
                    <TableCell>Accordion content margin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>4</code></TableCell>
                    <TableCell>16px</TableCell>
                    <TableCell><code>spacingTokens.values[4]</code></TableCell>
                    <TableCell>Standard element spacing, card padding</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>6</code></TableCell>
                    <TableCell>24px</TableCell>
                    <TableCell><code>spacingTokens.values[6]</code></TableCell>
                    <TableCell>Dialog padding, large section gaps</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>8</code></TableCell>
                    <TableCell>32px</TableCell>
                    <TableCell><code>spacingTokens.values[8]</code></TableCell>
                    <TableCell>List subheader line-height, major sections</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Spacing visual */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Spacing Grid Visual
              </Typography>
              <Stack spacing={1}>
                {[
                  { label: '4px (1)', width: 4 },
                  { label: '8px (2)', width: 8 },
                  { label: '12px (3)', width: 12 },
                  { label: '16px (4)', width: 16 },
                  { label: '24px (6)', width: 24 },
                  { label: '32px (8)', width: 32 },
                ].map(({ label, width }) => (
                  <Stack key={label} direction="row" alignItems="center" spacing={2}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', minWidth: 80 }}>{label}</Typography>
                    <Box sx={{ width: width * 4, height: 16, bgcolor: 'primary.main', borderRadius: 0.5, opacity: 0.7 }} />
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Using Spacing
              </Typography>
              <CodeBlock>{`// CDS uses 4px base, so multipliers are:
<Box sx={{ p: 1 }}>          {/* 4px padding all sides */}
<Box sx={{ p: 2 }}>          {/* 8px padding all sides */}
<Box sx={{ p: 4 }}>          {/* 16px — standard card padding */}
<Stack spacing={2}>          {/* 8px gap between children */}

// Direct token access
import { spacingTokens } from './theme/cds';
padding: spacingTokens.values[4]  // 16
gap: spacingTokens.values[2]      // 8`}</CodeBlock>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Border Radius */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <CodeIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Border Radius</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              CDS defines 6 border-radius levels. Every component uses these tokens — never raw pixel values.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[
                { name: 'none', value: '0px', usage: 'Progress bars, flat edges', radius: 0 },
                { name: 'extraSmall', value: '2px', usage: 'Chips, text skeletons', radius: 2 },
                { name: 'small (default)', value: '4px', usage: 'Buttons, inputs, cards, dialogs', radius: 4 },
                { name: 'medium', value: '8px', usage: 'Extended FABs, rounded containers', radius: 8 },
                { name: 'large', value: '12px', usage: 'Prominent cards, panels', radius: 12 },
                { name: 'circular', value: '50%', usage: 'Avatars, FABs, status dots', radius: '50%' },
              ].map(({ name, value, usage, radius }) => (
                <Grid key={name} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                        borderRadius: typeof radius === 'string' ? radius : `${radius}px`,
                        mx: 'auto',
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" fontWeight="bold" display="block">{name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontFamily: 'monospace' }}>{value}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{usage}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <CodeBlock>{`import { borderRadiusTokens } from './theme/cds';

borderRadiusTokens.none       // 0
borderRadiusTokens.extraSmall // 2
borderRadiusTokens.small      // 4  ← default
borderRadiusTokens.medium     // 8
borderRadiusTokens.large      // 12
borderRadiusTokens.circular   // '50%'`}</CodeBlock>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Elevation */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
              Elevation
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              CDS uses 4 named elevation levels. Components reference these tokens instead of raw shadow indices.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[
                { name: 'none (0)', desc: 'Accordion, flat surfaces', elevation: 0 },
                { name: 'card (1)', desc: 'Cards, subtle lift', elevation: 1 },
                { name: 'appBar (4)', desc: 'App bars, toolbars', elevation: 4 },
                { name: 'bottomNav (8)', desc: 'Bottom nav, floating elements', elevation: 8 },
              ].map(({ name, desc, elevation }) => (
                <Grid key={name} size={{ xs: 6, md: 3 }}>
                  <Paper
                    elevation={elevation}
                    sx={{ p: 3, textAlign: 'center', border: elevation === 0 ? `1px solid ${theme.palette.divider}` : 'none' }}
                  >
                    <Typography variant="subtitle2" gutterBottom>{name}</Typography>
                    <Typography variant="caption" color="text.secondary">{desc}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <CodeBlock>{`import { componentElevationTokens } from './theme/cds';

componentElevationTokens.none             // 0
componentElevationTokens.card             // 1
componentElevationTokens.appBar           // 4
componentElevationTokens.bottomNavigation // 8`}</CodeBlock>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Focus Ring */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
              Focus Ring (Accessibility)
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              All interactive components show a CDS focus ring on <code>:focus-visible</code>.
              The ring uses Blurple at 30% opacity with a 3px spread.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" gutterBottom>Focus Ring Tokens</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><code>focusRing.width</code></TableCell>
                          <TableCell>3px</TableCell>
                          <TableCell>Standard ring for buttons, inputs</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>focusRing.sliderSpread</code></TableCell>
                          <TableCell>8px</TableCell>
                          <TableCell>Slider thumb focus halo</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>focusRing.outlineOffset.default</code></TableCell>
                          <TableCell>0px</TableCell>
                          <TableCell>Inputs, buttons (ring hugs element)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>focusRing.outlineOffset.link</code></TableCell>
                          <TableCell>2px</TableCell>
                          <TableCell>Links (ring offset from text)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" gutterBottom>Border Tokens</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><code>border.thin</code></TableCell>
                          <TableCell>1px</TableCell>
                          <TableCell>Standard border width for inputs, cards, dividers</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Component Default Tokens</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><code>textField.variant</code></TableCell>
                          <TableCell>'outlined'</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>skeleton.animation</code></TableCell>
                          <TableCell>'wave'</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>container.maxWidth</code></TableCell>
                          <TableCell>'lg'</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Best Practices */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <CodeIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Best Practices</Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.success.main}`, height: '100%' }}>
                  <Typography variant="h6" color="success" gutterBottom>
                    Do
                  </Typography>
                  <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
                    <Typography variant="body2" component="li">
                      Use <code>colorTokens</code>, <code>typographyTokens</code>, <code>spacingTokens</code> for all values
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use <code>variant</code> and <code>color</code> props instead of <code>sx</code> overrides
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use semantic colors (<code>color="error"</code>, <code>color="success"</code>) for meaning
                    </Typography>
                    <Typography variant="body2" component="li">
                      Keep all spacing on the 4px grid
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use <code>Typography</code> component with CDS variants
                    </Typography>
                    <Typography variant="body2" component="li">
                      Include <code>CDSPageHeader</code> on every page
                    </Typography>
                    <Typography variant="body2" component="li">
                      Handle all 4 states: loading, error, empty, success
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use palette paths: <code>bgcolor: 'primary.main'</code>
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.error.main}`, height: '100%' }}>
                  <Typography variant="h6" color="error" gutterBottom>
                    Don't
                  </Typography>
                  <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
                    <Typography variant="body2" component="li">
                      Hardcode hex colors — use <code>colorTokens.*</code> or palette paths
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use pixel values for spacing — use <code>spacingTokens.values[n]</code>
                    </Typography>
                    <Typography variant="body2" component="li">
                      Override font sizes with inline <code>sx</code> — use typography variants
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use <code>borderRadius: 8</code> — use <code>borderRadiusTokens.medium</code>
                    </Typography>
                    <Typography variant="body2" component="li">
                      Apply <code>textTransform: 'uppercase'</code> — CDS is always <code>'none'</code>
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use raw elevation numbers — use <code>componentElevationTokens.*</code>
                    </Typography>
                    <Typography variant="body2" component="li">
                      Design for dark mode — CDS is light mode only
                    </Typography>
                    <Typography variant="body2" component="li">
                      Use fonts other than DM Sans
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </DocsLayout>
  );
}
