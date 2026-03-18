import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { SeamstressLogo } from '../../components/SeamstressLogo';
import {
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Lightbulb as LightbulbIcon,
  Terminal as TerminalIcon,
  Chat as ChatIcon,
  Memory as ContextIcon,
  Refresh as RefreshIcon,
  Rule as RuleIcon,
  Warning as WarningIcon,
  ThumbUp as DoIcon,
  ThumbDown as DontIcon,
  Cancel as CancelIcon,
  GitHub as GitHubIcon,
  AccountTree as BranchIcon,
  CloudUpload as PushIcon,
  MergeType as MergeIcon,
  Share as ShareIcon,
  Label as LabelIcon,
  Schema as SchemaIcon,
  EditNote as PlanIcon,
  OpenInNew as ExternalLinkIcon,
} from '@mui/icons-material';
import { cdsColors } from '../../theme/cds';
import { SeamstressLayout } from '../../components/SeamstressLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`seamstress-tabpanel-${index}`}
    aria-labelledby={`seamstress-tab-${index}`}
  >
    {value === index && children}
  </Box>
);

function a11yProps(index: number) {
  return {
    id: `seamstress-tab-${index}`,
    'aria-controls': `seamstress-tabpanel-${index}`,
  };
}

const CodeBlock = ({ children, title }: { children: string; title?: string }) => {
  const theme = useTheme();
  return (
    <Box>
      {title && (
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      )}
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
    </Box>
  );
};

export default function SeamstressOverview() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // CDS Primary (Blurple) for agent accent
  const agentColor = cdsColors.blurple700;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const patternKeywords = [
    { keyword: '"list", "table", "grid", "search"', result: 'DataGrid with search/filters' },
    { keyword: '"form", "create", "edit", "new"', result: 'Form with validation' },
    { keyword: '"detail", "view", "show"', result: 'Read-only detail display' },
    { keyword: '"dashboard", "metrics", "charts"', result: 'Metrics cards + charts' },
  ];

  const contextLevels = [
    { range: 'Under 50%', action: 'Normal operation, continue working', color: 'success', value: 40 },
    { range: '50-75%', action: 'Consider focusing on fewer files', color: 'info', value: 65 },
    { range: '75-90%', action: 'Wrap up current task, avoid opening new files', color: 'warning', value: 82 },
    { range: 'Over 90%', action: 'Finish current work, then start a new session', color: 'error', value: 95 },
  ];

  const goldenRules = [
    {
      title: 'Be Specific About What You Want',
      doExample: `@seamstress build a work orders list with search by title,
filter by status (open, in progress, completed),
and 50 mock items`,
      dontExample: '@seamstress build a list',
      why: 'Specific prompts generate components that match your needs the first time.',
    },
    {
      title: 'Use Pattern Keywords',
      doExample: `@seamstress build a LIST VIEW for work orders
@seamstress create a FORM for new permits`,
      dontExample: `@seamstress build something for work orders
@seamstress make a page`,
      why: 'Pattern keywords (list, form, detail, dashboard) trigger the correct patterns.',
    },
    {
      title: 'Iterate Incrementally',
      doExample: `# Start simple
@seamstress build a work orders list with search

# Then add features
@seamstress add status and priority filters`,
      dontExample: `# Everything at once
@seamstress build a work orders list with search, filters,
sorting, bulk actions, pagination, badges...`,
      why: 'Incremental builds are easier to review and correct.',
    },
  ];

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section - Overview header with Seamstress logo */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2 }}>
                <SeamstressLogo size={64} variant="auto" animated={true} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: '3rem',
                  letterSpacing: '-0.03em',
                }}
              >
                Seamstress
              </Typography>
            </Box>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{ mb: 3 }}
            >
              AI-Powered Figma to React Code Generation
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800 }}>
              Transform Figma designs and data schemas into React components
              using OpenGov-approved patterns. Seamstress generates design reference code
              that follows CDS Design System standards—ideal for prototyping,
              stakeholder reviews, and developer handoff.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label="@opengov Components" color="primary" />
              <Chip label="Figma MCP Integration" color="secondary" />
              <Chip label="TypeScript + React" />
              <Chip label="Design Reference Code" />
            </Stack>

            {/* Tabs Navigation */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Seamstress documentation tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mt: 4 }}
            >
              <Tab iconPosition="start" label="Quick Start" {...a11yProps(0)} />
              <Tab iconPosition="start" label="Interaction Model" {...a11yProps(1)} />
              <Tab iconPosition="start" label="Do's & Don'ts" {...a11yProps(2)} />
              <Tab iconPosition="start" label="Git & GitHub" {...a11yProps(3)} />
              <Tab iconPosition="start" label="FAQ" {...a11yProps(4)} />
            </Tabs>
          </Container>
        </Box>

        {/* Tab Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>

          {/* ============== TAB 0: QUICK START ============== */}
          <TabPanel value={tabValue} index={0}>
            {/* Prerequisites & Installation */}
            <Paper
              elevation={0}
              sx={{
                mb: 6,
                p: 4,
                border: `2px solid ${theme.palette.info.main}`,
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              <Typography variant="h4" gutterBottom>
                Step 0: Install Claude Code
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Seamstress requires Claude Code, Anthropic's official CLI for Claude.
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    1. Install Claude Code
                  </Typography>
                  <CodeBlock title="npm (Recommended):">
{`npm install -g @anthropic-ai/claude-code

# Or with Homebrew
brew tap anthropics/claude-code
brew install claude-code`}
                  </CodeBlock>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    2. Verify Installation
                  </Typography>
                  <CodeBlock>
{`claude --version

# Should output: claude version x.x.x`}
                  </CodeBlock>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    3. Navigate to Seamstress Project
                  </Typography>
                  <CodeBlock>
{`cd /path/to/seamstress

# Launch Claude Code
claude`}
                  </CodeBlock>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    4. Invoke the Seamstress Agent
                  </Typography>
                  <CodeBlock>
{`# In the Claude Code CLI, type:
@seamstress build a skills list page with search

# Or use the slash command:
/seamstress build a form for agents`}
                  </CodeBlock>
                </Box>
              </Stack>
            </Paper>

            {/* Builder Agent Info */}
            <Paper
              elevation={0}
              sx={{
                mb: 6,
                p: 3,
                border: `2px solid ${agentColor}`,
                bgcolor: alpha(agentColor, 0.05),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: agentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}
                >
                  🟣
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Seamstress Agent
                </Typography>
              </Stack>
              <Typography variant="body2" paragraph>
                The <strong>@seamstress</strong> agent automatically handles code generation.
                You can invoke it three ways:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  🟣 <strong>Direct Mention (Recommended):</strong> @seamstress build a skills list page with search
                </Typography>
                <Typography variant="body2">
                  🎯 <strong>Slash Command:</strong> /seamstress build a form for agents
                </Typography>
                <Typography variant="body2">
                  💬 <strong>Natural Language:</strong> &quot;Generate a dashboard for work orders&quot;
                </Typography>
              </Stack>
            </Paper>

            {/* Pattern Keywords */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Pattern Keywords Quick Reference
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Seamstress automatically detects patterns from your prompt:
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Say This</strong></TableCell>
                      <TableCell><strong>Get This</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patternKeywords.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {row.keyword}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Interactive Workflow */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Generate Your First Component
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel onClick={() => setActiveStep(0)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="h6">Choose a Pattern</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" paragraph>
                      Start with one of the 4 core patterns. We&apos;ll use a list view as an example.
                    </Typography>
                    <Grid container spacing={2}>
                      {['List View', 'Form', 'Detail View', 'Dashboard'].map((pattern, idx) => (
                        <Grid size={{ xs: 6, md: 3 }} key={pattern}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: idx === 0
                                ? `2px solid ${theme.palette.success.main}`
                                : `1px solid ${theme.palette.divider}`,
                              bgcolor: idx === 0 ? alpha(theme.palette.success.main, 0.05) : undefined,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold">
                              {pattern}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={() => setActiveStep(1)}>
                        Continue
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel onClick={() => setActiveStep(1)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="h6">Ask Claude in Natural Language</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" paragraph>
                      Describe what you want to build. Be specific but natural.
                    </Typography>
                    <CodeBlock title="Example Request:">
                      &quot;@seamstress build a skills list page with search, filters, and 20 mock items&quot;
                    </CodeBlock>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={() => setActiveStep(2)} sx={{ mr: 1 }}>
                        Continue
                      </Button>
                      <Button onClick={() => setActiveStep(0)}>Back</Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel onClick={() => setActiveStep(2)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="h6">Review Generated Code</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" paragraph>
                      Claude generates design reference code following OpenGov patterns. Verify these elements:
                    </Typography>
                    <List dense>
                      {[
                        'PageHeaderComposable with title and Create button',
                        'DataGrid component for list display',
                        'Theme tokens used (p: 2, not padding: "16px")',
                        'All 4 states: loading, error, empty, success',
                      ].map((item) => (
                        <ListItem key={item}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={() => setActiveStep(3)} sx={{ mr: 1 }}>
                        Continue
                      </Button>
                      <Button onClick={() => setActiveStep(1)}>Back</Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel>
                    <Typography variant="h6">Test Your Component</Typography>
                  </StepLabel>
                  <StepContent>
                    <CodeBlock title="Run Dev Server:">
{`npm run dev
# or
yarn dev`}
                    </CodeBlock>
                    <Alert severity="success" sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        🎉 Success!
                      </Typography>
                      <Typography variant="body2">
                        You&apos;ve generated your first Seamstress component!
                      </Typography>
                    </Alert>
                    <Box sx={{ mt: 2 }}>
                      <Button onClick={() => setActiveStep(2)}>Back</Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>

            {/* Next Steps */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Next Steps
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Now that you&apos;ve generated your first component, explore these resources:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
                <Button variant="contained" href="/seamstress/how-it-works" startIcon={<CodeIcon />}>
                  How It Works
                </Button>
                <Button variant="outlined" href="/seamstress/skills-reference" startIcon={<LightbulbIcon />}>
                  View All 13 Skills
                </Button>
                <Button variant="outlined" href="/seamstress/building-from-figma">
                  Building from Figma
                </Button>
              </Stack>
            </Paper>
          </TabPanel>

          {/* ============== TAB 1: INTERACTION MODEL ============== */}
          <TabPanel value={tabValue} index={1}>
            {/* Terminal vs Chat */}
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Terminal vs Chat: When to Use Each
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 6 }}>
              {/* Terminal */}
              <Card elevation={0} sx={{ border: `2px solid ${theme.palette.success.main}` }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                      <TerminalIcon sx={{ color: 'success.main', fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="success.main">Use Terminal (Claude Code CLI)</Typography>
                      <Chip label="Primary Interface" size="small" color="success" />
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Your primary interface for <strong>building and modifying code</strong>.
                  </Typography>
                  <CodeBlock>
{`# Launch Claude Code in terminal
claude

# Then use @seamstress commands
@seamstress build a work orders list`}
                  </CodeBlock>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>Best for:</Typography>
                  <List dense disablePadding>
                    {['Building new components', 'Modifying existing code', 'Working with Figma designs', 'Any task involving file changes'].map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Chat */}
              <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                      <ChatIcon sx={{ color: 'info.main', fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="info.main">Use Chat (claude.ai)</Typography>
                      <Chip label="Questions Only" size="small" />
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Use for <strong>questions and planning</strong> when you don't need code changes.
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Best for:</Typography>
                  <List dense disablePadding>
                    {['Asking general React/MUI questions', 'Planning architecture decisions', 'Understanding how something works', 'Getting explanations of patterns'].map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* @seamstress vs /seamstress */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              The @seamstress vs /seamstress Distinction
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Command</strong></TableCell>
                    <TableCell><strong>What It Does</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Chip label="@seamstress" color="success" size="small" sx={{ fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>Invokes the Seamstress agent to build components</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="/seamstress" size="small" sx={{ fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>Shows help/info about the Seamstress skill</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="body2">
                <strong>Always use <code>@seamstress</code> when you want to build something.</strong>
              </Typography>
            </Alert>

            <Divider sx={{ my: 4 }} />

            {/* Context Window */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <ContextIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Typography variant="h4">Context Window and Limits</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              Claude Code maintains a "context window" - the total amount of information it can hold in memory
              during a session. This includes your conversation history, files read, code generated, and responses.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Understanding Context Levels
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              {contextLevels.map((level) => (
                <Paper
                  key={level.range}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette[level.color as 'success' | 'info' | 'warning' | 'error'].main}`,
                    bgcolor: alpha(theme.palette[level.color as 'success' | 'info' | 'warning' | 'error'].main, 0.05),
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{level.range}</Typography>
                      <Typography variant="body2" color="text.secondary">{level.action}</Typography>
                    </Box>
                    <Box sx={{ width: 150 }}>
                      <LinearProgress
                        variant="determinate"
                        value={level.value}
                        color={level.color as 'success' | 'info' | 'warning' | 'error'}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Session Continuity */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <RefreshIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4">Session Continuity: Resuming Work</Typography>
            </Stack>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Within a Session</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Claude Code remembers everything within a single session. You can reference previous builds
              and request modifications.
            </Typography>

            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
              <CardContent>
                <CodeBlock>
{`# Build something
@seamstress build a work orders list

# Later in the same session
@seamstress add a priority filter to that list

# Still works - Claude remembers the context`}
                </CodeBlock>
              </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Between Sessions</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              When you exit Claude Code (Ctrl+C or 'exit'), the session ends. To resume work, reference the file directly:
            </Typography>

            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <CodeBlock>
{`# In a new session, reference the existing file:
@seamstress update src/pages/WorkOrdersList.tsx to add a date range filter`}
                </CodeBlock>
              </CardContent>
            </Card>
          </TabPanel>

          {/* ============== TAB 2: DO'S AND DON'TS ============== */}
          <TabPanel value={tabValue} index={2}>
            {/* Golden Rules */}
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              The Golden Rules
            </Typography>

            <Stack spacing={4} sx={{ mb: 6 }}>
              {goldenRules.map((rule, idx) => (
                <Card key={idx} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Chip label={idx + 1} color="primary" />
                      <Typography variant="h5">{rule.title}</Typography>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      {/* DO */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="subtitle1" color="success.main" fontWeight={600}>DO</Typography>
                        </Stack>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                          }}
                        >
                          <CodeBlock>{rule.doExample}</CodeBlock>
                        </Paper>
                      </Box>

                      {/* DON'T */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <CancelIcon color="error" />
                          <Typography variant="subtitle1" color="error.main" fontWeight={600}>DON'T</Typography>
                        </Stack>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          }}
                        >
                          <CodeBlock>{rule.dontExample}</CodeBlock>
                        </Paper>
                      </Box>
                    </Box>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2"><strong>Why:</strong> {rule.why}</Typography>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Anti-Patterns */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
              <Typography variant="h4">Anti-Patterns to Avoid</Typography>
            </Stack>

            <Stack spacing={3} sx={{ mb: 6 }}>
              {[
                {
                  name: 'The Kitchen Sink Prompt',
                  bad: '@seamstress build a complete work order management system with list, detail, form, dashboard, reports, settings...',
                  good: `@seamstress build a work orders list
@seamstress build a work order detail page
@seamstress build a work order form`,
                },
                {
                  name: 'The Vague Modification',
                  bad: '@seamstress make it look better',
                  good: '@seamstress add spacing between the filter chips',
                },
                {
                  name: 'The Hardcoded Expectation',
                  bad: '@seamstress build a list with the button at exactly 16px from the top right',
                  good: '@seamstress build a list with an action button in the toolbar',
                },
              ].map((pattern, idx) => (
                <Card key={idx} elevation={0} sx={{ border: `1px solid ${theme.palette.error.main}` }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{pattern.name}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="error.main" sx={{ mb: 1 }}>Anti-pattern:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                          <CodeBlock>{pattern.bad}</CodeBlock>
                        </Paper>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>Better:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                          <CodeBlock>{pattern.good}</CodeBlock>
                        </Paper>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Quick Reference */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Quick Reference Card
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.success.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <DoIcon color="success" />
                  <Typography variant="h6" color="success.main">Always DO</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'Use pattern keywords (list, form, detail, dashboard)',
                    'Specify business context (entity, domain)',
                    'Be explicit about features needed',
                    'Iterate incrementally',
                    'Reference existing files when helpful',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.error.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <DontIcon color="error" />
                  <Typography variant="h6" color="error.main">Never DO</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'Ask for vague improvements',
                    'Over-specify implementation details',
                    'Expect context to persist between sessions',
                    'Request multiple unrelated components at once',
                    'Use hardcoded values instead of theme tokens',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CancelIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </TabPanel>

          {/* ============== TAB 3: GIT & GITHUB ============== */}
          <TabPanel value={tabValue} index={3}>
            {/* The Seamstress Workflow - Hero Section */}
            <Paper
              elevation={0}
              sx={{
                mb: 6,
                p: 4,
                border: `2px solid ${theme.palette.primary.main}`,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                The Seamstress Workflow
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                The complete workflow for building and sharing prototypes:
              </Typography>

              {/* Workflow Steps Visualization */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 4,
                  justifyContent: 'center',
                }}
              >
                {[
                  { label: 'Branch', icon: <BranchIcon fontSize="small" /> },
                  { label: 'Schema', icon: <SchemaIcon fontSize="small" /> },
                  { label: 'Plan', icon: <PlanIcon fontSize="small" /> },
                  { label: 'Build', icon: <TerminalIcon fontSize="small" /> },
                  { label: 'Test', icon: <CheckCircleIcon fontSize="small" /> },
                  { label: 'Commit', icon: <CodeIcon fontSize="small" /> },
                  { label: 'PR', icon: <MergeIcon fontSize="small" /> },
                  { label: 'deploy-ee', icon: <LabelIcon fontSize="small" /> },
                  { label: 'Share', icon: <ShareIcon fontSize="small" /> },
                ].map((step, idx, arr) => (
                  <React.Fragment key={step.label}>
                    <Chip
                      icon={step.icon}
                      label={step.label}
                      color="primary"
                      variant={idx === 0 || idx === arr.length - 1 ? 'filled' : 'outlined'}
                    />
                    {idx < arr.length - 1 && (
                      <Typography sx={{ alignSelf: 'center', color: 'text.secondary' }}>
                        →
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </Box>

              {/* Workflow Steps */}
              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Create a Feature Branch</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Scope branches to a single feature or system. Ask the agent:
                    </Typography>
                    <CodeBlock>&quot;create a new branch called feature/work-orders-list&quot;</CodeBlock>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Naming:</strong> Use <code>feature/</code> for new work, <code>experiment/</code> for exploration, <code>fix/</code> for bugs
                      </Typography>
                    </Alert>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Generate Schema with UX Advocate GPT</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Use the UX Advocate GPT to generate comprehensive schema for your feature:
                    </Typography>
                    <CodeBlock>{`Give me comprehensive schema for Tasks & Notifications for Platform.
Include all relevant suites, systems, and applications.
Write all schema in a single markdown file.`}</CodeBlock>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<ExternalLinkIcon />}
                      href="https://chatgpt.com/share/e/697150bd-7080-8003-8521-8391a727ca5f"
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      See Example: Platform Notifications Schema
                    </Button>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Use Plan Mode</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      For complex features, the agent will enter plan mode to analyze requirements before building:
                    </Typography>
                    <CodeBlock>@seamstress build a notifications center based on docs/schema/notifications.md</CodeBlock>
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Plan mode prevents wasted effort by getting alignment before code is written.
                      </Typography>
                    </Alert>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Build with Schema Reference</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      With schema in hand and a plan approved, build your component:
                    </Typography>
                    <CodeBlock>@seamstress build a notifications list based on docs/schema/notifications.md</CodeBlock>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Test Your Changes Locally</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Verify in browser at <code>http://localhost:5173</code>. Check all states work (loading, empty, error, success).
                    </Typography>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Commit When Functional</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Once tested and working, simply ask the agent to commit. It will analyze the changes and write an appropriate message:
                    </Typography>
                    <CodeBlock>&quot;commit these changes&quot;</CodeBlock>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Push and Create PR</Typography>
                  </StepLabel>
                  <StepContent>
                    <CodeBlock>&quot;push this branch and create a pull request&quot;</CodeBlock>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Trigger Ephemeral Build</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Add the <Chip label="deploy-ee" size="small" color="success" /> label to your PR on GitHub to trigger a preview environment.
                    </Typography>
                  </StepContent>
                </Step>

                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Share and Review</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Share the ephemeral URL with stakeholders for feedback:
                    </Typography>
                    <CodeBlock>https://seamstress-pr-123.preview.opengov.com</CodeBlock>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>

            <Divider sx={{ my: 4 }} />

            {/* Git Basics */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <GitHubIcon sx={{ fontSize: 40, color: 'text.primary' }} />
              <Typography variant="h4">Git Basics</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              If you followed the Seamstress setup, Git should already be installed. To verify:
            </Typography>

            <CodeBlock>{`git --version
# Should output: git version 2.x.x`}</CodeBlock>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Essential Commands via Agent
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You rarely need to type Git commands directly. Just ask the agent:
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>What You Want</strong></TableCell>
                    <TableCell><strong>What to Say</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { want: 'Create a branch', say: '"create a branch called feature/my-feature"' },
                    { want: 'See what changed', say: '"show me what files have changed"' },
                    { want: 'Save changes', say: '"commit these changes"' },
                    { want: 'Upload to GitHub', say: '"push this branch"' },
                    { want: 'Create a PR', say: '"create a pull request"' },
                    { want: 'Get latest code', say: '"pull the latest changes from main"' },
                  ].map((row) => (
                    <TableRow key={row.want}>
                      <TableCell>{row.want}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
                          {row.say}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body2">
                <strong>Git vs GitHub:</strong> Git is version control software that runs locally. GitHub is the cloud platform where your code is hosted and reviewed.
              </Typography>
            </Alert>

            <Divider sx={{ my: 4 }} />

            {/* Building with Reference Schema */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <SchemaIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Typography variant="h4">Building with Reference Schema</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              Schema gives Seamstress the domain knowledge to build accurate prototypes with correct field names, proper relationships, and realistic data.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: `2px solid ${theme.palette.secondary.main}`,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              }}
            >
              <Typography variant="h6" gutterBottom>Using UX Advocate GPT</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The UX Advocate GPT is trained on OpenGov&apos;s product structure and generates comprehensive schema for any system.
              </Typography>
              <Typography variant="subtitle2" gutterBottom>Example prompt:</Typography>
              <CodeBlock>{`Give me comprehensive schema for [YOUR FEATURE] for [SUITE/PLATFORM].
Include all relevant suites, systems, and applications.
Write all schema in a single markdown file.`}</CodeBlock>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ExternalLinkIcon />}
                  href="https://chatgpt.com/share/e/697150bd-7080-8003-8521-8391a727ca5f"
                  target="_blank"
                >
                  See Example: Platform Notifications Schema
                </Button>
              </Box>
            </Paper>

            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Referencing Schema in Prompts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Once you have schema, save it to <code>docs/schema/[feature-name].md</code> and reference it:
            </Typography>
            <CodeBlock>{`@seamstress build a work orders list based on docs/schema/work-orders.md

@seamstress build a form for creating work orders
using the WorkOrder entity from docs/schema/work-orders.md`}</CodeBlock>

            <Divider sx={{ my: 4 }} />

            {/* Plan Mode */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PlanIcon sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h4">Plan Mode</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              For complex features, the agent enters plan mode to analyze requirements before building. This prevents wasted effort by getting alignment upfront.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
              When to Use Plan Mode
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 4 }}>
              {[
                { title: 'Complex features', desc: 'Multiple components or pages' },
                { title: 'Schema-based builds', desc: 'Working from reference schema' },
                { title: 'Uncertain requirements', desc: 'Need to explore options' },
                { title: 'Multi-step workflows', desc: 'Forms with multiple stages' },
              ].map((item) => (
                <Card key={item.title} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              How Plan Mode Works
            </Typography>
            <CodeBlock>{`# Agent enters plan mode automatically for complex requests
@seamstress build a complete notifications center with inbox,
preferences, and notification detail views`}</CodeBlock>

            <Alert severity="success" sx={{ mt: 3, mb: 4 }}>
              <Typography variant="body2">
                <strong>In plan mode, the agent will:</strong> Analyze schema, identify patterns to use, propose file structure, list components to create, and wait for your approval before writing code.
              </Typography>
            </Alert>

            <Divider sx={{ my: 4 }} />

            {/* Branching Best Practices */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <BranchIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Typography variant="h4">Branching Best Practices</Typography>
            </Stack>

            <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Branch Naming Conventions
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
              {[
                { prefix: 'feature/', desc: 'New features or pages', example: 'feature/budget-dashboard', color: 'success' },
                { prefix: 'experiment/', desc: 'Exploratory work', example: 'experiment/new-nav-layout', color: 'info' },
                { prefix: 'fix/', desc: 'Bug fixes', example: 'fix/search-not-working', color: 'warning' },
              ].map((item) => (
                <Card key={item.prefix} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Chip
                      label={item.prefix}
                      color={item.color as 'success' | 'info' | 'warning'}
                      size="small"
                      sx={{ mb: 1, fontFamily: 'monospace' }}
                    />
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.desc}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {item.example}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Working with Multiple Branches
            </Typography>

            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Can I have multiple branches at once?</strong> Yes! But only one can be &quot;active&quot; (checked out) at a time.
              </Typography>
            </Alert>

            <CodeBlock>{`# See all your branches
"show me all my branches"

# Switch to another branch
"switch to the budget-dashboard branch"`}</CodeBlock>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Visualizing Branches
            </Typography>

            <List>
              {[
                'GitHub.com - View branches in the repository',
                'Terminal: git branch -a (shows all branches)',
                'VS Code: Source Control panel shows current branch',
                'Ask the agent: "show me all my branches"',
              ].map((item) => (
                <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 4 }} />

            {/* Committing & Pushing */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PushIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4">Committing & Pushing</Typography>
            </Stack>

            <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
              When to Commit
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.success.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6" color="success.main">DO Commit When</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'A feature is working and tested',
                    'You\'re about to try something risky',
                    'At the end of a work session',
                    'Before switching branches',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.error.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CancelIcon color="error" />
                  <Typography variant="h6" color="error.main">DON&apos;T Commit</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'Broken or untested code',
                    'Half-finished features',
                    'After every tiny change',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CancelIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Commit Message Conventions
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              Good commit messages describe WHAT changed and WHY:
            </Typography>

            <CodeBlock>{`# Good
"Add work orders list with search and status filter"
"Fix pagination not updating on filter change"

# Bad
"Updates"
"WIP"
"Fixed stuff"`}</CodeBlock>

            <Divider sx={{ my: 4 }} />

            {/* Pull Requests & Deployment */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <MergeIcon sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h4">Pull Requests & Deployment</Typography>
            </Stack>

            <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Creating a PR via Agent
            </Typography>

            <CodeBlock>&quot;create a pull request with title &apos;Add work orders list&apos; and describe the changes&quot;</CodeBlock>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              The deploy-ee Label (Ephemeral Environments)
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: `2px solid ${theme.palette.success.main}`,
                bgcolor: alpha(theme.palette.success.main, 0.05),
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <LabelIcon color="success" />
                <Typography variant="h6">How to Get a Preview URL</Typography>
              </Stack>
              <List dense>
                {[
                  'Open your PR on GitHub',
                  'Click "Labels" on the right sidebar',
                  'Select "deploy-ee"',
                  'Wait 2-3 minutes for the build',
                  'Check the PR comments for your preview URL',
                ].map((item, idx) => (
                  <ListItem key={item} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Chip label={idx + 1} size="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="body2">
                <strong>Why use ephemeral builds?</strong> Share working prototypes without local setup, get feedback from stakeholders, and test in a production-like environment.
              </Typography>
            </Alert>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Sharing Preview URLs
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              Ephemeral URLs follow this pattern:
            </Typography>

            <CodeBlock>https://seamstress-pr-{'{PR_NUMBER}'}.preview.opengov.com</CodeBlock>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Share this URL in Slack messages, design reviews, stakeholder meetings, or Figma comments.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Do's & Don'ts for Git */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <RuleIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              <Typography variant="h4">Git Do&apos;s & Don&apos;ts</Typography>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.success.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <DoIcon color="success" />
                  <Typography variant="h6" color="success.main">DO</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'Generate schema first with UX Advocate GPT',
                    'Use plan mode for complex features',
                    'Scope branches to features',
                    'Test before committing',
                    'Use deploy-ee for previews',
                    'Pull main before new branches',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.error.main}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <DontIcon color="error" />
                  <Typography variant="h6" color="error.main">DON&apos;T</Typography>
                </Stack>
                <List dense disablePadding>
                  {[
                    'Build without schema',
                    'Skip planning for complex features',
                    'Commit untested code',
                    'Work directly on main',
                    'Make huge PRs',
                    'Ignore merge conflicts',
                  ].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CancelIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            {/* Common Issues & Recovery */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Common Issues & Recovery
            </Typography>

            <Stack spacing={2}>
              {[
                {
                  issue: '"My changes disappeared!"',
                  cause: 'Switched branches without committing',
                  fix: 'Ask the agent: "I lost my changes, can you help me find them?"',
                },
                {
                  issue: '"Merge conflict!"',
                  cause: 'Someone else changed the same file',
                  fix: 'Ask the agent: "there\'s a merge conflict in [file], can you help resolve it?"',
                },
                {
                  issue: '"Accidentally committed to main"',
                  cause: 'Forgot to create a feature branch',
                  fix: 'Ask the agent: "I accidentally committed to main, can you move my changes to a new branch?"',
                },
              ].map((item) => (
                <Card key={item.issue} elevation={0} sx={{ border: `1px solid ${theme.palette.warning.main}` }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} color="warning.main">
                      {item.issue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Cause:</strong> {item.cause}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Fix:</strong> {item.fix}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Link to Full Guide */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mt: 6,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${theme.palette.info.main}`,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Need More Details?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                For a comprehensive reference including command cheat sheets and FAQ, see the full Git guide:
              </Typography>
              <Button
                variant="contained"
                color="info"
                startIcon={<GitHubIcon />}
                href="https://github.com/OpenGov/cds-assists/blob/main/seamstress-design/docs/SEAMSTRESS_PROMPTING_GUIDE.md"
                target="_blank"
              >
                View Prompting Guide
              </Button>
            </Paper>
          </TabPanel>

          {/* ============== TAB 4: FAQ ============== */}
          <TabPanel value={tabValue} index={4}>
            {/* Hero Alert */}
            <Alert
              severity="info"
              sx={{
                mb: 4,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Common Questions
              </Typography>
              <Typography variant="body2">
                Answers to frequently asked questions about Seamstress, the tools involved, and what&apos;s in scope for prototyping.
              </Typography>
            </Alert>

            {/* ============== SECTION 1: TOOLS & TERMINOLOGY ============== */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Tools & Terminology
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Understanding the tools you&apos;re working with and how they fit together.
            </Typography>

            {/* Terminology Table */}
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '25%' }}><strong>Term</strong></TableCell>
                    <TableCell><strong>What It Is</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>Claude Code</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Anthropic&apos;s official CLI tool that runs in your terminal. This is what you launch with the <code>claude</code> command. It&apos;s your primary interface for building with Seamstress.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>Seamstress</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        A specialized agent that runs <em>inside</em> Claude Code. Invoke it with <code>@seamstress</code> to build OpenGov components following design system patterns.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>Claude (Sonnet)</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        The AI model powering everything. This is Anthropic&apos;s Claude model (not GPT/ChatGPT). Sonnet is the default model variant used by Claude Code.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>Cursor</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        An AI-powered IDE (code editor). <strong>Use Cursor to visually track your changes and branch status</strong>&mdash;it&apos;s great for seeing what files changed and which branch you&apos;re on. However, <strong>do NOT use Cursor for prompting or git commands</strong>. All building and git operations go through Claude Code.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>UX Advocate GPT</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        A custom GPT (on ChatGPT) trained on OpenGov&apos;s product structure. Use it to generate schema before building with Seamstress&mdash;it&apos;s a separate tool, not part of Claude Code.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* How They Fit Together */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              How Do They Fit Together?
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${theme.palette.info.main}`,
              }}
            >
              <CodeBlock>
{`┌─────────────────────────────────────────────────────────────┐
│  Your Terminal                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Claude Code (CLI)                                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  @seamstress agent                              │  │  │
│  │  │  • Reads Figma designs                          │  │  │
│  │  │  • Generates React/MUI code                     │  │  │
│  │  │  • Creates mock data                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                        ↓                              │  │
│  │            Powered by Claude (Sonnet) AI              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘`}
              </CodeBlock>
            </Paper>

            {/* Key Clarifications */}
            <Alert severity="success" sx={{ mb: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Key Clarifications</Typography>
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cursor = visual tracking only (see changes, branches)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Claude Code = all prompting and git commands"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="@seamstress is invoked inside Claude Code"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="The AI is Claude by Anthropic, not ChatGPT/GPT-4"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="UX Advocate GPT is a separate tool for generating schema (runs on ChatGPT)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Alert>

            <Divider sx={{ my: 4 }} />

            {/* ============== SECTION 2: LIMITATIONS & SCOPE ============== */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Limitations & Scope
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Understanding what Seamstress is designed for&mdash;and what it&apos;s not.
            </Typography>

            {/* What Seamstress IS For */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              What Seamstress Is For
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: `2px solid ${theme.palette.success.main}`,
                bgcolor: alpha(theme.palette.success.main, 0.03),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" color="success.main">Designed For</Typography>
              </Stack>
              <List dense disablePadding>
                {[
                  { primary: 'Rapid prototyping for design exploration', secondary: 'Quickly build working UI to validate ideas before committing to production development' },
                  { primary: 'Building working UI with mock data', secondary: 'Generate realistic interfaces with simulated data that looks and feels real' },
                  { primary: 'Sharing previews via ephemeral builds', secondary: 'Use the deploy-ee label to create shareable preview URLs for stakeholder feedback' },
                  { primary: 'Creating design reference code', secondary: 'Code that demonstrates OpenGov-approved patterns for developer handoff' },
                ].map((item) => (
                  <ListItem key={item.primary} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* What Seamstress Is NOT For */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              What Seamstress Is NOT For
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '35%' }}><strong>Request</strong></TableCell>
                    <TableCell><strong>Why It&apos;s Not Supported</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Export code to Figma</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        The workflow is <strong>Figma → Code</strong>, not reverse. Prototypes are code&mdash;they don&apos;t go back into Figma. Share preview URLs instead.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Voice input for prompting</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Not a current feature of Claude Code. Prompts are typed in the terminal.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Connect to real OpenGov APIs</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Prototypes use <strong>mock data only</strong>. Real API integration is production code work, not prototyping.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Prompt templates/library</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Use UX Advocate GPT for generating schema. Prompts to Seamstress are freeform natural language.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Ship directly to production</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Prototypes serve as design references. Production code is written separately by engineering teams with real APIs, authentication, and error handling.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 4 }} />

            {/* Prototype Lifecycle */}
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              What Happens When a Prototype Is Done?
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              Prototypes serve as living design references for exploration and stakeholder alignment.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stepper orientation="vertical" sx={{ mt: 1 }}>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Prototypes live in seamstress-design indefinitely</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Each prototype stays in the repository as a reference. Old prototypes aren&apos;t deleted&mdash;they&apos;re historical artifacts.
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Share via ephemeral builds for feedback</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Add the <Chip label="deploy-ee" size="small" color="success" sx={{ mx: 0.5 }} /> label to your PR to generate a preview URL. Share this with stakeholders.
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Iterate based on stakeholder input</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Use feedback to refine the prototype. Make changes, commit, and the preview URL automatically updates.
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Developers reference prototypes when building production</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      When engineering builds the real feature, they can reference the prototype for UI patterns, component structure, and interaction models.
                    </Typography>
                  </StepContent>
                </Step>
                <Step active>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight={600}>Prototype code serves as a design reference, not a starting point</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      Prototype code demonstrates OpenGov-approved patterns with mock data. Production code requires real APIs, authentication, error handling, and more. They&apos;re separate codebases.
                    </Typography>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>

            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>For Developers</Typography>
              <Typography variant="body2">
                <strong>&quot;Can we share the prototypes with devs?&quot;</strong> Yes! Share the preview URL or point them to the PR. Developers can review the component structure and patterns as a design reference, but they&apos;ll implement production code with real data sources and requirements.
              </Typography>
            </Alert>
          </TabPanel>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
