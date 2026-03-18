import React from 'react';
import {
  Box,
  Container,
  Typography,
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
  CardHeader,
  Grid,
  Button,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  TextFields as TypographyIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../components/DocsLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import MetricCard from '../../components/dashboard/MetricCard';

/**
 * Typography Documentation Page
 *
 * Shows the typography scale and demonstrates usage in a complex
 * dashboard-like page structure matching production patterns.
 */
export default function TypographyDocs() {
  const theme = useTheme();

  useDocumentTitle('Typography');

  const typographyVariants = [
    { variant: 'h1', description: 'Page titles, hero metrics', usage: 'One per page, primary headline', weight: 600, desktopSize: '32px' },
    { variant: 'h2', description: 'Section headers', usage: 'Major content sections', weight: 600, desktopSize: '24px' },
    { variant: 'h3', description: 'Card titles, subsections', usage: 'Card headers, grouped content', weight: 600, desktopSize: '20px' },
    { variant: 'h4', description: 'Smaller headings', usage: 'Nested sections, dialogs', weight: 600, desktopSize: '18px' },
    { variant: 'h5', description: 'Minor headings', usage: 'List group headers', weight: 600, desktopSize: '16px' },
    { variant: 'h6', description: 'Smallest heading', usage: 'Inline headings, labels', weight: 600, desktopSize: '14px' },
    { variant: 'subtitle1', description: 'Large supporting text', usage: 'Page descriptions, lead text', weight: 500, desktopSize: '16px' },
    { variant: 'subtitle2', description: 'Small supporting text', usage: 'Card subtitles, metadata', weight: 500, desktopSize: '14px' },
    { variant: 'body1', description: 'Primary body text', usage: 'Main content, paragraphs', weight: 400, desktopSize: '14px' },
    { variant: 'body2', description: 'Secondary body text', usage: 'Descriptions, helper text', weight: 400, desktopSize: '13px' },
    { variant: 'button', description: 'Button labels', usage: 'Buttons, action links', weight: 500, desktopSize: '14px' },
    { variant: 'caption', description: 'Small annotations', usage: 'Timestamps, footnotes', weight: 400, desktopSize: '12px' },
    { variant: 'overline', description: 'Label text', usage: 'Section labels, categories', weight: 500, desktopSize: '11px' },
    { variant: 'd5', description: 'Display 5 - Large metrics', usage: 'Metric cards (3 or fewer)', weight: 600, desktopSize: '28px' },
    { variant: 'd6', description: 'Display 6 - Small metrics', usage: 'Metric cards (4 or more)', weight: 600, desktopSize: '24px' },
  ] as const;

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 6,
          }}
        >
          <Container>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <TypographyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              </Box>
              <Typography variant="h1">Typography</Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              CDS uses <strong>DM Sans</strong> exclusively. Typography is fully responsive across
              Desktop (1440), Tablet (768), and Mobile (390) breakpoints. All sizes, weights, and
              line-heights are defined as CDS tokens.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Chip label="DM Sans" color="primary" />
              <Chip label="Responsive" color="success" />
              <Chip label="13+ text styles" />
            </Stack>
          </Container>
        </Box>

        <Container sx={{ py: 6 }}>
          <Stack spacing={6}>
            {/* ================================================================
                Typography Scale Reference
                ================================================================ */}
            <Box component="section">
              <Typography variant="h2" gutterBottom>
                Typography Scale
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The complete typography scale available through MUI's Typography component.
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant</TableCell>
                      <TableCell>Example</TableCell>
                      <TableCell>Size (Desktop)</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Common Usage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {typographyVariants.map(({ variant, description, usage, weight, desktopSize }) => (
                      <TableRow key={variant}>
                        <TableCell>
                          <Chip label={variant} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant={variant}>
                            Sample Text
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{desktopSize}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{weight}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{usage}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Display Variants for Metric Cards
                </Typography>
                <Typography variant="body2">
                  Use <strong>d5</strong> for metric card values when displaying 3 or fewer cards in a row.
                  Use <strong>d6</strong> for metric card values when displaying 4 or more cards in a row.
                </Typography>
              </Alert>

              {/* Component-Specific Typography Tokens */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h3" gutterBottom>
                  Component-Specific Typography Tokens
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Beyond standard variants, CDS defines typography tokens for specific components.
                  These are applied automatically through the theme — you rarely need to reference them directly.
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell>Component</TableCell>
                        <TableCell>Applied To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { token: 'typographyTokens.button.small/medium/large', component: 'Button, FAB', applied: 'Button label per size variant' },
                        { token: 'typographyTokens.input.labelSm/Md/Lg', component: 'InputLabel', applied: 'Label text per input size' },
                        { token: 'typographyTokens.input.valueSm/Md/Lg', component: 'OutlinedInput, Select', applied: 'Field value text per size' },
                        { token: 'typographyTokens.input.helper', component: 'FormHelperText', applied: 'Helper/error text below fields' },
                        { token: 'typographyTokens.chip.small/medium', component: 'Chip', applied: 'Chip label per size' },
                        { token: 'typographyTokens.alert.title/description', component: 'Alert, AlertTitle', applied: 'Alert heading and body' },
                        { token: 'typographyTokens.dialog.title/content', component: 'Dialog', applied: 'Dialog heading and body' },
                        { token: 'typographyTokens.tooltip.default', component: 'Tooltip', applied: 'Tooltip text' },
                        { token: 'typographyTokens.badge.default', component: 'Badge', applied: 'Badge count text' },
                        { token: 'typographyTokens.table.header/cell/footer', component: 'Table', applied: 'Table text per row type' },
                        { token: 'typographyTokens.stepper.label', component: 'StepLabel', applied: 'Stepper step labels' },
                        { token: 'typographyTokens.slider.valueLabel', component: 'Slider', applied: 'Value tooltip on slider' },
                        { token: 'typographyTokens.menuItem.default/dense', component: 'MenuItem', applied: 'Menu item text' },
                      ].map(({ token, component, applied }) => (
                        <TableRow key={token}>
                          <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{token}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{component}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{applied}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* CDS Typography Rules */}
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  CDS Typography Rules
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    <strong>Font:</strong> Always DM Sans — never override with another font family
                  </Typography>
                  <Typography variant="body2">
                    <strong>Text transform:</strong> Always <code>none</code> — never use uppercase on buttons, tabs, or labels
                  </Typography>
                  <Typography variant="body2">
                    <strong>Heading weight:</strong> 600 (SemiBold) — never use 700 (Bold) for headings
                  </Typography>
                  <Typography variant="body2">
                    <strong>Button weight:</strong> 500 (Medium) — consistent across all button sizes
                  </Typography>
                  <Typography variant="body2">
                    <strong>Responsive:</strong> All typography scales automatically — never hardcode font sizes in <code>sx</code>
                  </Typography>
                </Stack>
              </Alert>
            </Box>

            <Divider />

            {/* ================================================================
                Dashboard Example - Real Usage
                ================================================================ */}
            <Box component="section">
              <Typography variant="h2" gutterBottom>
                Dashboard Layout Example
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                A complete dashboard showing typography hierarchy in context.
                This matches the production Agent Studio dashboard structure.
              </Typography>

              {/* Simulated Dashboard */}
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'background.secondary',
                }}
              >
                <Stack spacing={4}>
                  {/* ============ Page Title ============ */}
                  <Box>
                    <Typography variant="h1" gutterBottom>
                      Agent Studio Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Real-time observability, usage analytics, and performance metrics
                    </Typography>
                  </Box>

                  <Divider />

                  {/* ============ Section 1: KPIs ============ */}
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Box>
                        <Typography variant="h2" gutterBottom>
                          Key Performance Indicators
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Real-time metrics for the current reporting period
                        </Typography>
                      </Box>
                      <Button variant="outlined" startIcon={<TrendingUpIcon />}>
                        View Details
                      </Button>
                    </Stack>

                    <Grid container spacing={2}>
                      {[
                        { label: 'Total Tasks', value: '8,547', changePercentage: 23.5 },
                        { label: 'Active Agents', value: '12', changePercentage: 9.1 },
                        { label: 'Satisfaction Rate', value: '94.2%', changePercentage: 2.8 },
                        { label: 'Active Users', value: '342', changePercentage: 15.3 },
                        { label: 'Success Rate', value: '97.1%', changePercentage: 1.2 },
                        { label: 'Total Messages', value: '24,891', changePercentage: 31.7 },
                      ].map((metric) => (
                        <Grid key={metric.label} sx={{ flex: '1 1 200px' }} minWidth="200px">
                          <MetricCard
                            label={metric.label}
                            value={metric.value}
                            changePercentage={metric.changePercentage}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Divider />

                  {/* ============ Section 2: Agent Performance ============ */}
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="h2">Agent Performance</Typography>
                      <Button variant="text" endIcon={<TrendingUpIcon />}>
                        View All Agents
                      </Button>
                    </Stack>

                    <Grid container spacing={3}>
                      {/* Performance Table Card */}
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                          <CardHeader
                            title="Top Performing Agents"
                            subheader="Ranked by satisfaction rate this period"
                            titleTypographyProps={{ variant: 'h3' }}
                            subheaderTypographyProps={{ variant: 'body2' }}
                            action={
                              <IconButton>
                                <MoreVertIcon />
                              </IconButton>
                            }
                          />
                          <CardContent>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant="subtitle2">Agent Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle2">Category</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Tasks</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Avg Response</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Satisfaction</Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {[
                                    { name: 'Budget Analyst', category: 'Finance', tasks: 1234, response: '1.2s', satisfaction: 96.2 },
                                    { name: 'Permit Helper', category: 'Permitting', tasks: 987, response: '0.8s', satisfaction: 94.8 },
                                    { name: 'Document Builder', category: 'Productivity', tasks: 756, response: '2.1s', satisfaction: 93.1 },
                                    { name: 'Code Assistant', category: 'Development', tasks: 623, response: '1.5s', satisfaction: 92.7 },
                                    { name: 'Data Analyst', category: 'Analytics', tasks: 512, response: '1.8s', satisfaction: 91.4 },
                                  ].map((agent) => (
                                    <TableRow key={agent.name} hover>
                                      <TableCell>
                                        <Typography variant="body2">
                                          {agent.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip label={agent.category} size="small" variant="outlined" />
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2">{agent.tasks.toLocaleString()}</Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2" color="text.secondary">
                                          {agent.response}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2" color="success.main" fontWeight="medium">
                                          {agent.satisfaction}%
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Summary Card */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                          <CardHeader title="Performance Summary" titleTypographyProps={{ variant: 'h3' }} />
                          <CardContent>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Total Agents
                                </Typography>
                                <Typography variant="h3">12</Typography>
                              </Box>
                              <Divider />
                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Active This Week
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="baseline">
                                  <Typography variant="h3" color="success.main">10</Typography>
                                  <Typography variant="body2" color="text.secondary">of 12</Typography>
                                </Stack>
                              </Box>
                              <Divider />
                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Average Satisfaction
                                </Typography>
                                <Typography variant="h3">94.2%</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  +2.8% from last period
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider />

                  {/* ============ Section 3: Recent Activity & Feedback ============ */}
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Recent Activity
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Recent Feedback */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                          <CardHeader
                            title="Recent Feedback"
                            subheader="Latest user feedback on agent interactions"
                            titleTypographyProps={{ variant: 'h3' }}
                            subheaderTypographyProps={{ variant: 'body2' }}
                          />
                          <CardContent>
                            <Stack spacing={2}>
                              {[
                                { user: 'Sarah Chen', agent: 'Budget Analyst', rating: 'positive', comment: 'Very helpful with quarterly projections!', time: '2 hours ago' },
                                { user: 'Mike Johnson', agent: 'Permit Helper', rating: 'positive', comment: 'Saved me hours of work on the application.', time: '4 hours ago' },
                                { user: 'Emily Davis', agent: 'Document Builder', rating: 'negative', comment: 'Response was too slow for my needs.', time: '5 hours ago' },
                              ].map((feedback, idx) => (
                                <Box key={idx} sx={{ pb: 2, borderBottom: idx < 2 ? `1px solid ${theme.palette.divider}` : 'none' }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                      <Typography variant="subtitle2">{feedback.user}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {feedback.agent} • {feedback.time}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={feedback.rating === 'positive' ? 'Positive' : 'Negative'}
                                      size="small"
                                      color={feedback.rating === 'positive' ? 'success' : 'error'}
                                    />
                                  </Stack>
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    "{feedback.comment}"
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* System Status */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                          <CardHeader title="System Status" titleTypographyProps={{ variant: 'h3' }} />
                          <CardContent>
                            <Stack spacing={3}>
                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Overall Health
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CheckIcon color="success" fontSize="small" />
                                  <Typography variant="body1" fontWeight="medium">
                                    All Systems Operational
                                  </Typography>
                                </Stack>
                              </Box>

                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Model Providers
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                  {[
                                    { name: 'Anthropic Claude', status: 'operational', latency: '245ms' },
                                    { name: 'OpenAI GPT-4', status: 'operational', latency: '312ms' },
                                    { name: 'Google Gemini', status: 'degraded', latency: '890ms' },
                                  ].map((provider) => (
                                    <Stack key={provider.name} direction="row" justifyContent="space-between" alignItems="center">
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Box
                                          sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: provider.status === 'operational' ? 'success.main' : 'warning.main',
                                          }}
                                        />
                                        <Typography variant="body2">{provider.name}</Typography>
                                      </Stack>
                                      <Typography variant="caption" color="text.secondary">
                                        {provider.latency}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              </Box>

                              <Divider />

                              <Box>
                                <Typography variant="overline" color="text.secondary">
                                  Last Updated
                                </Typography>
                                <Typography variant="caption" display="block">
                                  February 16, 2026 at 2:45 PM
                                </Typography>
                              </Box>

                              <Alert severity="info">
                                <Typography variant="body2">
                                  Next scheduled maintenance: March 1, 2026
                                </Typography>
                              </Alert>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider />

                  {/* ============ Section 4: Cost & Resources ============ */}
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Cost & Resource Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Monitor API usage, token consumption, and associated costs across all agents.
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Cost Summary Cards - Using d5 for 3 cards */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                          <CardContent>
                            <Typography variant="overline" color="text.secondary">
                              Total Cost
                            </Typography>
                            <Typography variant="d5" color="primary.main">
                              $2,847
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current billing period
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                          <CardContent>
                            <Typography variant="overline" color="text.secondary">
                              Token Usage
                            </Typography>
                            <Typography variant="d5" color="secondary.main">
                              12.4M
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Input + Output tokens
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                          <CardContent>
                            <Typography variant="overline" color="text.secondary">
                              Cost per Task
                            </Typography>
                            <Typography variant="d5" color="success.main">
                              $0.33
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Average across all agents
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Model Breakdown Table */}
                      <Grid size={{ xs: 12 }}>
                        <Card>
                          <CardHeader
                            title="Cost Breakdown by Model"
                            subheader="Detailed usage and costs per model provider"
                            titleTypographyProps={{ variant: 'h3' }}
                            subheaderTypographyProps={{ variant: 'body2' }}
                          />
                          <CardContent>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant="subtitle2">Model</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle2">Provider</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">API Calls</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Tokens</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Avg Latency</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Cost</Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {[
                                    { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', calls: 45230, tokens: '8.2M', latency: '1.2s', cost: 1642 },
                                    { model: 'GPT-4 Turbo', provider: 'OpenAI', calls: 12450, tokens: '3.1M', latency: '1.8s', cost: 892 },
                                    { model: 'Claude 3 Haiku', provider: 'Anthropic', calls: 28900, tokens: '1.1M', latency: '0.4s', cost: 213 },
                                    { model: 'Gemini Pro', provider: 'Google', calls: 5200, tokens: '0.8M', latency: '2.1s', cost: 100 },
                                  ].map((row) => (
                                    <TableRow key={row.model} hover>
                                      <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                          {row.model}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                          {row.provider}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2">
                                          {row.calls.toLocaleString()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2">
                                          {row.tokens}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2" color="text.secondary">
                                          {row.latency}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography variant="body2" fontWeight="medium">
                                          ${row.cost.toLocaleString()}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            </Box>

            <Divider />

            {/* ================================================================
                Typography Hierarchy Guidelines
                ================================================================ */}
            <Box component="section">
              <Typography variant="h2" gutterBottom>
                Hierarchy Guidelines
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h3" gutterBottom color="success.main">
                      Do
                    </Typography>
                    <List dense>
                      {[
                        'Use h1 once per page for the main title',
                        'Use h2 for major section breaks',
                        'Use h3 for card titles and subsections',
                        'Use body1 for primary content, body2 for supporting',
                        'Use caption for timestamps and metadata',
                        'Use overline for category labels above content',
                        'Use variant and color props, not sx overrides',
                        'Let responsive typography scale automatically',
                      ].map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                          <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h3" gutterBottom color="error.main">
                      Don't
                    </Typography>
                    <List dense>
                      {[
                        'Skip heading levels (h1 to h3 without h2)',
                        'Use multiple h1 elements on a page',
                        'Hardcode fontSize in sx — use variants instead',
                        'Use textTransform: \'uppercase\' — CDS is always none',
                        'Use fontWeight: 700 for headings — CDS uses 600',
                        'Use a font other than DM Sans',
                        'Mix body1 and body2 inconsistently',
                        'Use caption for important content',
                      ].map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <WarningIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                          <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* ================================================================
                Color with Typography
                ================================================================ */}
            <Box component="section">
              <Typography variant="h2" gutterBottom>
                Typography Colors
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Use semantic color props for consistent text coloring.
              </Typography>

              <Grid container spacing={2}>
                {[
                  { color: 'text.primary', label: 'text.primary', desc: 'Main content' },
                  { color: 'text.secondary', label: 'text.secondary', desc: 'Supporting text' },
                  { color: 'text.disabled', label: 'text.disabled', desc: 'Disabled states' },
                  { color: 'primary.main', label: 'primary.main', desc: 'Links, emphasis' },
                  { color: 'success.main', label: 'success.main', desc: 'Positive values' },
                  { color: 'error.main', label: 'error.main', desc: 'Errors, negative' },
                  { color: 'warning.main', label: 'warning.main', desc: 'Warnings, caution' },
                  { color: 'info.main', label: 'info.main', desc: 'Informational' },
                ].map(({ color, label, desc }) => (
                  <Grid key={label} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h3" color={color} gutterBottom>
                        Aa
                      </Typography>
                      <Typography variant="caption" display="block">
                        <code>{label}</code>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </DocsLayout>
  );
}
