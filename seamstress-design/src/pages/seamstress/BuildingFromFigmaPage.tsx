import React from 'react';
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
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Layers as LayersIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { SeamstressLayout } from '../../components/SeamstressLayout';

const CodeBlock = ({ children, title }: any) => {
  const theme = useTheme();
  return (
    <Box>
      {title && (
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
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

export default function BuildingFromFigmaPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <LayersIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                Building from Figma
              </Typography>
            </Stack>
            <Typography variant="h5" color="text.secondary" paragraph>
              Turn Figma Designs into React Code with MCP Integration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Seamstress integrates with Figma via MCP (Model Context Protocol) to extract
              designs and generate production-ready React components that match your designs
              pixel-perfectly.
            </Typography>
          </Box>

          {/* Prerequisites */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `2px solid ${theme.palette.info.main}`,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Prerequisites
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Before building from Figma, ensure you have:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Figma MCP Server Configured"
                  secondary="Claude Code should have Figma MCP integration enabled"
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Access to CDS 37 Figma Files"
                  secondary="Permissions to view Capital Design System components and patterns"
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Figma URLs Ready"
                  secondary="Copy the full Figma URL (file or specific frame/node)"
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Figma MCP Setup
              </Typography>
              <Typography variant="body2">
                The Figma MCP server is typically configured in your Claude Code settings. If
                you don&apos;t have access, ask about setting up the Figma MCP integration.
              </Typography>
            </Alert>
          </Paper>

          {/* Automatic Layout Detection */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `2px solid ${theme.palette.success.main}`,
            }}
          >
            <Typography variant="h4" gutterBottom>
              🤖 Automatic Layout Detection
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              When building from Figma, Seamstress automatically detects OpenGov global navigation
              components and creates suite-specific layouts if they don&apos;t exist.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Box sx={{ height: '100%' }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    1. Detect NavBar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Checks if the Figma design contains an OpenGov NavBar component from
                    @opengov/components-nav-bar
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Box sx={{ height: '100%' }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    2. Check Existing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Searches for existing Layout component and nav config for the detected suite
                    (e.g., EAMLayout.tsx)
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Box sx={{ height: '100%' }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    3. Create if Needed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    If not found, automatically generates Layout component, nav config, and updates
                    routing in App.tsx
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Example: Building an EAM Dashboard
              </Typography>
              <Typography variant="body2">
                When you ask to build from a Figma URL with &quot;Enterprise Asset Management&quot; NavBar,
                Seamstress will check for EAMLayout.tsx and eamNavBarConfig.ts. If they exist, it uses
                them. If not, it creates both files following OpenGov patterns and updates your routing.
              </Typography>
            </Alert>
          </Paper>

          {/* Step-by-Step Workflow */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Figma-to-Code Workflow
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel
                  onClick={() => setActiveStep(0)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">Step 1: Get Your Figma URL</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" paragraph>
                    Navigate to your Figma design and copy the URL. You can use:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Full File URL
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          For extracting multiple components or understanding overall structure
                        </Typography>
                        <CodeBlock>
{`https://www.figma.com/design/
MxdeZ8e13qSmlenBVMmzzI/CDS-37`}
                        </CodeBlock>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Specific Frame URL
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          For extracting a specific component or section
                        </Typography>
                        <CodeBlock>
{`https://www.figma.com/design/
...?node-id=123-456`}
                        </CodeBlock>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => setActiveStep(1)}>
                      Continue
                    </Button>
                  </Box>
                </StepContent>
              </Step>

              <Step>
                <StepLabel
                  onClick={() => setActiveStep(1)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">Step 2: Ask Claude to Extract the Design</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" paragraph>
                    Provide the Figma URL and describe what you want to build in natural language.
                  </Typography>
                  <CodeBlock title="Example Request:">
{`"Extract the Skills List component from this Figma design and generate
React code following Seamstress principles:

https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=123-456

Use DataGrid for the table, include search and filters, and generate
20 mock items."`}
                  </CodeBlock>
                  <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                    Claude will automatically:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Connect to Figma via MCP"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Detect OpenGov NavBar and create layout if needed"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Extract design properties (colors, spacing, typography)"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Map Figma components to React components"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Generate code following all Seamstress principles"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => setActiveStep(2)} sx={{ mr: 1 }}>
                      Continue
                    </Button>
                    <Button onClick={() => setActiveStep(0)}>Back</Button>
                  </Box>
                </StepContent>
              </Step>

              <Step>
                <StepLabel
                  onClick={() => setActiveStep(2)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">Step 3: Review & Validate Generated Code</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" paragraph>
                    Claude generates code that matches your Figma design. Validate these key areas:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Aspect</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>What to Check</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Spacing
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Matches Figma auto-layout gaps (8px grid: p: 1, 2, 3, 4...)
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Colors
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Uses theme tokens (primary.main, secondary.light, etc.)
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Typography
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Typography variants match Figma text styles (h1-h6, body1-2)
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Layout
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Stack/Grid directions match Figma auto-layout (horizontal/vertical)
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Components
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Correct OpenGov/MUI components used per hierarchy
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                  <Typography variant="h6">Step 4: Refine & Iterate</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" paragraph>
                    If the generated code doesn&apos;t match exactly, provide specific feedback:
                  </Typography>
                  <CodeBlock title="Example Refinement Request:">
{`"The spacing between the header and the table should be 24px (p: 3),
not 16px. Also, the button color should use primary.main instead of
secondary."`}
                  </CodeBlock>
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      🎉 Success!
                    </Typography>
                    <Typography variant="body2">
                      Your component now matches the Figma design and follows all Seamstress
                      principles. Test it in your browser to verify responsiveness and interactions.
                    </Typography>
                  </Alert>
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={() => setActiveStep(2)}>Back</Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>

          {/* Common Patterns */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Common Figma Extraction Patterns
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Extract a Single Component
                    </Typography>
                    <Typography variant="body2" paragraph color="text.secondary">
                      Best for: Buttons, cards, form fields, navigation items
                    </Typography>
                    <CodeBlock>
{`"Extract the skill card component from:
https://www.figma.com/.../node-id=123

Generate a reusable SkillCard component
with hover effects and proper spacing."`}
                    </CodeBlock>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      <strong>Result:</strong> Single component file with props and TypeScript
                      types
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="secondary.main" gutterBottom>
                      Extract a Full Page
                    </Typography>
                    <Typography variant="body2" paragraph color="text.secondary">
                      Best for: Complete views with multiple sections
                    </Typography>
                    <CodeBlock>
{`"Extract the Skills List page from:
https://www.figma.com/.../node-id=456

Generate a complete page with header,
search, filters, and DataGrid."`}
                    </CodeBlock>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      <strong>Result:</strong> Full page component with all sections and mock data
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Extract Design Tokens
                    </Typography>
                    <Typography variant="body2" paragraph color="text.secondary">
                      Best for: Understanding color/spacing system
                    </Typography>
                    <CodeBlock>
{`"What design tokens are used in this Figma file?
https://www.figma.com/.../CDS-37

Show me the color palette, spacing scale,
and typography styles."`}
                    </CodeBlock>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      <strong>Result:</strong> Documentation of design system values
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="warning.main" gutterBottom>
                      Validate Against Figma
                    </Typography>
                    <Typography variant="body2" paragraph color="text.secondary">
                      Best for: Checking existing code matches design
                    </Typography>
                    <CodeBlock>
{`"Validate this SkillCard component against
the Figma design:
https://www.figma.com/.../node-id=789

[paste your existing code]"`}
                    </CodeBlock>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      <strong>Result:</strong> List of discrepancies and suggestions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* CDS 37 Resources */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PaletteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4">
                CDS 37 Figma Resources
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${theme.palette.primary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <LinkIcon color="primary" />
                    <Typography variant="h6">Components</Typography>
                  </Stack>
                  <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
                    Core component library with buttons, inputs, cards, and more
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    href="https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37"
                    target="_blank"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Open in Figma
                  </Button>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${theme.palette.secondary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <LinkIcon color="secondary" />
                    <Typography variant="h6">Patterns</Typography>
                  </Stack>
                  <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
                    Complete patterns for modals, drawers, page headers, and layouts
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    href="https://www.figma.com/design/ovXZlZTFwlNBTISlap4s4p/CDS-37-Patterns"
                    target="_blank"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Open in Figma
                  </Button>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${theme.palette.success.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <LinkIcon color="success" />
                    <Typography variant="h6">Icons</Typography>
                  </Stack>
                  <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
                    Complete icon library for OpenGov applications
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    href="https://www.figma.com/design/xaElUstGXrXTsCRKp2IOhF/CDS-37-Icons"
                    target="_blank"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Open in Figma
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Troubleshooting */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              border: `2px solid ${theme.palette.warning.main}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <WarningIcon fontSize="large" sx={{ color: 'warning.main' }} />
              <Typography variant="h4">
                Common Issues & Solutions
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error">
                    ❌ Issue: &quot;Cannot access Figma file&quot;
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    Claude can&apos;t connect to the Figma URL you provided.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Solutions:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="1. Verify Figma MCP is configured"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="2. Check file permissions (you need view access)"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="3. Ensure URL is complete and correct"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error">
                    ❌ Issue: Generated code doesn&apos;t match design
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    Colors, spacing, or layout differs from Figma.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Solutions:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="1. Provide specific feedback with measurements"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary='2. Ask: "Validate against Figma and list differences"'
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="3. Check if Figma uses auto-layout (preferred)"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error">
                    ❌ Issue: Hardcoded values in generated code
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    Code has #hex colors or pixel values instead of theme tokens.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Solutions:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary='1. Remind: "Use theme tokens only, no hardcoded values"'
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="2. Ensure Figma uses design tokens/variables"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="3. Reference seamstress-core-principles explicitly"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error">
                    ❌ Issue: Missing responsive behavior
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    Component doesn&apos;t adapt to different screen sizes.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Solutions:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary='1. Ask: "Make this responsive for mobile/tablet/desktop"'
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="2. Specify Grid xs/sm/md/lg breakpoints needed"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText
                        primary="3. Check if Figma has mobile/tablet frames"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Best Practices */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `2px solid ${theme.palette.success.main}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <InfoIcon fontSize="large" sx={{ color: 'success.main' }} />
              <Typography variant="h4">
                Best Practices
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Use Figma auto-layout"
                      secondary="Makes spacing and direction extraction accurate"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Name Figma layers descriptively"
                      secondary="Helps Claude understand component purpose"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Use Figma design tokens/variables"
                      secondary="Ensures theme token mapping is accurate"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Start with small components"
                      secondary="Build confidence before tackling full pages"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reference CDS 37 components"
                      secondary="Link to official OpenGov Figma files"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Always validate against principles"
                      secondary="Ask Claude to check for hardcoded values"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
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
              Ready to Build from Figma?
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Now that you understand the Figma-to-code workflow, try it with a real design!
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
              <Button variant="contained" href="/seamstress/getting-started" startIcon={<CodeIcon />}>
                Getting Started Guide
              </Button>
              <Button
                variant="outlined"
                href="/seamstress/components-patterns"
                startIcon={<PaletteIcon />}
              >
                Components & Patterns
              </Button>
              <Button
                variant="outlined"
                href="/seamstress/testing"
                startIcon={<CheckCircleIcon />}
              >
                Validate Your Setup
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
