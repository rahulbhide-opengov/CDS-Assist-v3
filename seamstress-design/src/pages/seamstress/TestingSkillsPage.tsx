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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
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

interface QuickTest {
  id: string;
  name: string;
  prompt: string;
  expected: string;
  successCriteria: string[];
}

const quickTests: QuickTest[] = [
  {
    id: 'test-1',
    name: 'Core Principles Discovery',
    prompt: '"What are Seamstress golden rules?"',
    expected: 'Claude cites seamstress-core-principles skill',
    successCriteria: [
      'Mentions PageHeaderComposable requirement',
      'Mentions theme tokens only (no hardcoded values)',
      'Mentions entity-scoped routes',
      'References the skill by name',
    ],
  },
  {
    id: 'test-2',
    name: 'Pattern Discovery',
    prompt: '"Explain the list view pattern"',
    expected: 'Claude cites list-view-pattern skill',
    successCriteria: [
      'Shows DataGrid structure',
      'Mentions 4 states (loading, error, empty, success)',
      'Includes PageHeaderComposable',
      'References the skill by name',
    ],
  },
  {
    id: 'test-3',
    name: 'Code Generation with Principles',
    prompt: '"Generate a skills list page"',
    expected: 'Code has PageHeaderComposable + theme tokens + entity-scoped routes',
    successCriteria: [
      'PageHeaderComposable is present',
      'Uses theme tokens (e.g., p: 2, not padding: "16px")',
      'Entity-scoped routes (/entity/${entityId}/skills)',
      'No hardcoded colors or spacing',
    ],
  },
  {
    id: 'test-4',
    name: 'Routing Patterns Discovery',
    prompt: '"How do routes work in Seamstress?"',
    expected: 'Claude explains /entity/{entityId}/resource pattern',
    successCriteria: [
      'Shows /entity/{entityId}/resource pattern',
      'Cites seamstress-routing-patterns skill',
      'Mentions entity-scoped navigation',
      'Provides route examples',
    ],
  },
  {
    id: 'test-5',
    name: 'Form Pattern with Validation',
    prompt: '"Build a form for agents with validation"',
    expected: 'Code has validation + isDirty + unsaved warning',
    successCriteria: [
      'Form validation logic present',
      'isDirty flag for tracking changes',
      'Unsaved changes warning dialog',
      'Field-level error messages',
    ],
  },
];

export default function TestingSkillsPage() {
  const theme = useTheme();
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  const toggleTest = (testId: string) => {
    setCompletedTests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const passRate =
    quickTests.length > 0 ? Math.round((completedTests.size / quickTests.length) * 100) : 0;

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <ScienceIcon sx={{ fontSize: 48, color: 'success.main' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                Testing Skills Framework
              </Typography>
            </Stack>
            <Typography variant="h5" color="text.secondary" paragraph>
              Validate that your Seamstress skills setup is working correctly
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Run these tests to ensure skills are being discovered properly and code generation
              follows all principles.
            </Typography>
          </Box>

          {/* Progress Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              bgcolor: alpha(
                passRate === 100 ? theme.palette.success.main : theme.palette.primary.main,
                0.05
              ),
              border: `2px solid ${
                passRate === 100 ? theme.palette.success.main : theme.palette.primary.main
              }`,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" gutterBottom>
                  Quick Validation Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedTests.size} of {quickTests.length} tests completed
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                <Typography variant="h2" fontWeight="bold" color="success.main">
                  {passRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pass Rate
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Setup Instructions */}
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Before You Begin
            </Typography>
            <Typography variant="body2">
              • Start a fresh Claude Code conversation (no history)
              <br />
              • Ensure you're in the Seamstress project directory
              <br />
              • Run each test prompt exactly as shown
              <br />• Check that Claude's response matches the expected criteria
            </Typography>
          </Alert>

          {/* Quick Tests */}
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Quick Validation Tests (5)
          </Typography>

          <Stack spacing={3} sx={{ mb: 6 }}>
            {quickTests.map((test, index) => (
              <Accordion
                key={test.id}
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                    <Checkbox
                      checked={completedTests.has(test.id)}
                      onChange={() => toggleTest(test.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">
                        Test {index + 1}: {test.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {test.prompt}
                      </Typography>
                    </Box>
                    {completedTests.has(test.id) && (
                      <CheckCircleIcon color="success" fontSize="large" />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 7 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Test Prompt:
                    </Typography>
                    <CodeBlock>{test.prompt}</CodeBlock>

                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Expected Result:
                      </Typography>
                      <Typography variant="body2">{test.expected}</Typography>
                    </Alert>

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                      Success Criteria:
                    </Typography>
                    <List dense>
                      {test.successCriteria.map((criteria, i) => (
                        <ListItem key={i}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={criteria} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          {/* Success Alert */}
          {passRate === 100 && (
            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                ✅ All Quick Tests Passed!
              </Typography>
              <Typography variant="body2">
                Your Seamstress skills framework is working correctly. Skills are being discovered
                and code generation follows all principles.
              </Typography>
            </Alert>
          )}

          {/* Full Test Suite */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom>
              Comprehensive Test Suite (22 Tests)
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              For thorough validation, run the complete test suite covering all skills, skill
              composition, token efficiency, and edge cases.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Skills Discovery Tests
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h3" color="secondary.main" fontWeight="bold">
                    6
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Composition & Application Tests
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    4
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Efficiency & Edge Case Tests
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                href="https://github.com/OpenGov/cds-assists/blob/main/seamstress-design/.claude/SKILLS_TEST_SUITE.md"
                target="_blank"
              >
                View Full Test Suite
              </Button>
            </Box>
          </Paper>

          {/* Expected Behavior */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom>
              What to Look For
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  ✓ Good Signs
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Claude mentions skills by name (e.g., 'core-principles skill')" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Generated code has PageHeaderComposable" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Uses theme tokens (p: 2, not padding: '16px')" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Entity-scoped routes (/entity/${entityId}/resource)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="All 4 states present (loading, error, empty, success)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Correct import order (React → OpenGov → MUI → Local)" />
                  </ListItem>
                </List>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" color="error.main" gutterBottom>
                  ✗ Red Flags
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Claude doesn't cite skills by name" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Missing PageHeaderComposable in generated pages" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Hardcoded values (colors, spacing, etc.)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Non-entity-scoped routes" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Missing states (only shows success state)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Wrong import order" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* Troubleshooting */}
          <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom>
              Troubleshooting
            </Typography>

            <Accordion
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                '&:before': { display: 'none' },
                mt: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Skills Not Being Discovered</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Symptom:</strong> Claude doesn't mention skills by name
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Possible Causes:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Skill files not in correct directory (.claude/skills/)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="YAML frontmatter missing or incorrect" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Skill descriptions don't match query keywords" />
                  </ListItem>
                </List>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary='1. Verify files are in .claude/skills/ with SKILL.md filename' />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Check YAML frontmatter has clear description with keywords" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Try more specific prompts matching skill descriptions" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                '&:before': { display: 'none' },
                mt: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Generated Code Violates Principles</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Symptom:</strong> Code has hardcoded values or missing components
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Possible Causes:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Core principles skill not being loaded/applied" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pattern skill doesn't reference core-principles" />
                  </ListItem>
                </List>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary='1. Explicitly mention "following Seamstress principles" in prompt' />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Update pattern skills to reference core-principles" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Make principles more prominent in skill content" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                '&:before': { display: 'none' },
                mt: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Wrong Skills Loaded</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Symptom:</strong> Irrelevant skills loaded for request
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Possible Cause:</strong> Skill descriptions might be too broad or overlap
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="1. Make skill descriptions more specific" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary='2. Add "Use when..." vs "Don&apos;t use when..." guidance' />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Refine prompt to be more precise" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
