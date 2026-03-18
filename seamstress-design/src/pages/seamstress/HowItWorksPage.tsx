import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Alert,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Search as SearchIcon,
  Hub as HubIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Compress as CompressIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { cdsColors } from '../../theme/cds';
import { SeamstressLayout } from '../../components/SeamstressLayout';

const CodeBlock = ({ children }: any) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '14px',
        overflow: 'auto',
      }}
    >
      <pre style={{ margin: 0 }}>{children}</pre>
    </Paper>
  );
};

export default function HowItWorksPage() {
  const theme = useTheme();

  // CDS Primary (Blurple) for agent accent
  const agentColor = cdsColors.blurple700;

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <PsychologyIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                How Seamstress Works
              </Typography>
            </Stack>
            <Typography variant="h5" color="text.secondary" paragraph>
              From Natural Language to Production-Ready Code
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Seamstress uses Claude Code&apos;s native semantic skills framework to generate
              React components from natural language. No commands to memorize—just describe
              what you want to build.
            </Typography>
          </Box>

          {/* The 4-Step Process */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: agentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                🟣
              </Box>
              <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                The Generation Process
              </Typography>
            </Stack>

            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body2">
                The <strong>@seamstress agent</strong> orchestrates this entire process.
                It uses Claude Code's semantic skills framework to automatically discover and apply the right patterns for your request.
              </Typography>
            </Alert>

            <Stepper orientation="vertical" activeStep={4}>
              <Step active>
                <StepLabel>
                  <Typography variant="h6">Step 1: Natural Language Input</Typography>
                </StepLabel>
                <Box sx={{ pl: 4, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    You describe what you want to build in plain English. No special syntax or
                    commands required.
                  </Typography>
                  <CodeBlock>
{`"@seamstress build a skills list page with search and 20 mock items"
"@seamstress create a form for editing agents with validation"
"@seamstress build a dashboard showing work order metrics"`}
                  </CodeBlock>
                </Box>
              </Step>

              <Step active>
                <StepLabel>
                  <Typography variant="h6">Step 2: Semantic Discovery</Typography>
                </StepLabel>
                <Box sx={{ pl: 4, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Claude analyzes your request and automatically discovers relevant skills
                    based on keywords and intent.
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      Example: &quot;skills list page with search&quot;
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label="list-view-pattern"
                        color="success"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                      <Chip
                        label="core-principles"
                        color="primary"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                      <Chip
                        label="routing-patterns"
                        color="secondary"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                      <Chip
                        label="business-logic"
                        color="secondary"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                    </Stack>
                  </Paper>
                </Box>
              </Step>

              <Step active>
                <StepLabel>
                  <Typography variant="h6">Step 3: Skill Composition</Typography>
                </StepLabel>
                <Box sx={{ pl: 4, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Skills automatically compose and work together. Pattern skills inherit from
                    core principles, domain skills provide specialized knowledge.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          list-view-pattern provides:
                        </Typography>
                        <List dense>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="DataGrid structure"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="Search & filter components"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="4 states (loading, error, empty, success)"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          core-principles ensures:
                        </Typography>
                        <List dense>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="PageHeaderComposable required"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="Theme tokens only (no hardcoded values)"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary="Entity-scoped routes"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Step>

              <Step active>
                <StepLabel>
                  <Typography variant="h6">Step 4: Code Generation</Typography>
                </StepLabel>
                <Box sx={{ pl: 4, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                Claude generates production-ready TypeScript code following all principles
                from the loaded skills. The code includes proper imports, types, and follows
                CDS Design System patterns.
                  </Typography>
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <Typography variant="body2" fontWeight="bold">
                      Production-ready code generated with proper imports, types, and design patterns
                    </Typography>
                  </Alert>
                </Box>
              </Step>
            </Stepper>
          </Paper>

          {/* Pattern Recognition */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Intelligent Pattern Recognition
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Seamstress recognizes 4 core UI patterns and automatically applies the appropriate
              structure, components, and behavior.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `2px solid ${theme.palette.success.main}`,
                  }}
                >
                  <Typography variant="h6" color="success.main" gutterBottom>
                    List View Pattern
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    For displaying collections with search, filters, and pagination.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Triggers on:</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="list" size="small" variant="outlined" />
                    <Chip label="table" size="small" variant="outlined" />
                    <Chip label="grid" size="small" variant="outlined" />
                    <Chip label="search" size="small" variant="outlined" />
                    <Chip label="filter" size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="subtitle2" gutterBottom>Generates:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="DataGrid with columns"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Search TextField"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pagination controls"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `2px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  <Typography variant="h6" color="secondary.main" gutterBottom>
                    Form Pattern
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    For creating or editing entities with validation.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Triggers on:</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="form" size="small" variant="outlined" />
                    <Chip label="create" size="small" variant="outlined" />
                    <Chip label="edit" size="small" variant="outlined" />
                    <Chip label="validation" size="small" variant="outlined" />
                    <Chip label="save" size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="subtitle2" gutterBottom>Generates:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Form fields with labels"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Validation logic + error messages"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="isDirty tracking + unsaved warning"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `2px solid ${theme.palette.info.main}`,
                  }}
                >
                  <Typography variant="h6" color="info.main" gutterBottom>
                    Detail View Pattern
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    For displaying single entity information with actions.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Triggers on:</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="detail" size="small" variant="outlined" />
                    <Chip label="view" size="small" variant="outlined" />
                    <Chip label="show" size="small" variant="outlined" />
                    <Chip label="display" size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="subtitle2" gutterBottom>Generates:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Read-only field display"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Edit and Delete actions"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Confirmation dialogs"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                    border: `2px solid ${theme.palette.warning.main}`,
                  }}
                >
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    Dashboard Pattern
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    For displaying metrics, charts, and aggregated data.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Triggers on:</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="dashboard" size="small" variant="outlined" />
                    <Chip label="metrics" size="small" variant="outlined" />
                    <Chip label="stats" size="small" variant="outlined" />
                    <Chip label="overview" size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="subtitle2" gutterBottom>Generates:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Metric cards with numbers"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Responsive grid layout"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Data visualizations"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Try It Yourself */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <LightbulbIcon color="primary" fontSize="large" />
              <Typography variant="h4">
                Try It Yourself
              </Typography>
            </Stack>

            <Typography variant="body1" paragraph>
              Test semantic discovery with these example requests:
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Learning Requests
                  </Typography>
                  <CodeBlock>
{`"What are Seamstress golden rules?"
"Explain the list view pattern"
"How do entity-scoped routes work?"
"What's the component hierarchy?"
"Show me mock data generation"`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Generation Requests
                  </Typography>
                  <CodeBlock>
{`"@seamstress build a skills list page with 20 items"
"@seamstress create a form for editing agents"
"@seamstress build a dashboard with work order metrics"
"@seamstress build a detail view for skill entities"
"@seamstress build a table with search and filters"`}
                  </CodeBlock>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                What to Expect
              </Typography>
              <Typography variant="body2">
                • Claude should mention skills by name (e.g., &quot;core-principles skill&quot;)
                <br />
                • Generated code includes PageHeaderComposable, theme tokens, entity-scoped routes
                <br />
                • All 4 states present (loading, error, empty, success)
                <br />
                • Code follows all Seamstress principles automatically
              </Typography>
            </Alert>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" href="/seamstress/skills-reference">
                  View All 13 Skills
                </Button>
                <Button variant="outlined" href="/seamstress/getting-started">
                  Getting Started Guide
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
