import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Widgets as WidgetsIcon,
  CheckCircle as CheckCircleIcon,
  Layers as LayersIcon,
  Palette as PaletteIcon,
  ArrowForward as ArrowForwardIcon,
  GridView as GridViewIcon,
  Code as CodeIcon,
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

export default function ComponentsPatternsPage() {
  const theme = useTheme();

  return (
    <SeamstressLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <WidgetsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                Components & Patterns
              </Typography>
            </Stack>
            <Typography variant="h5" color="text.secondary" paragraph>
              Component Hierarchy, Design Patterns, and Figma Integration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Seamstress follows a strict component hierarchy and integrates seamlessly with
              CDS Design System Figma files for design-to-code generation.
            </Typography>
          </Box>

          {/* Component Hierarchy */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Component Hierarchy
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Seamstress enforces a three-tier component priority system guided by the{' '}
              <strong>seamstress-component-hierarchy</strong> skill.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `2px solid ${theme.palette.primary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip label="Priority 1" color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      OpenGov Components
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Always use @opengov components first. These are production-tested, accessible,
                    and follow OpenGov design patterns.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Examples:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="NavBar, PageHeaderComposable"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="DataGrid, Modal, Drawer"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="50+ production components"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                  <CodeBlock>
{`import { NavBar } from '@opengov/components-nav-bar';
import { PageHeaderComposable } from '@opengov/capital-mui';`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `2px solid ${theme.palette.secondary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip label="Priority 2" color="secondary" />
                    <Typography variant="h6" fontWeight="bold">
                      MUI Components
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Use @mui/material when no OpenGov equivalent exists. MUI provides the
                    foundation for all OpenGov components.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Examples:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Box, Stack, Grid, Container"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Typography, Button, TextField"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Paper, Card, Alert, Chip"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                  <CodeBlock>
{`import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                    border: `2px solid ${theme.palette.warning.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip label="Priority 3" color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      Custom Components
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Only create custom components when neither OpenGov nor MUI provides the
                    needed functionality.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Guidelines:</Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Build on MUI primitives"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Use theme tokens only"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Follow accessibility standards"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                  <CodeBlock>
{`const CustomCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));`}
                  </CodeBlock>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Decision Rule
              </Typography>
              <Typography variant="body2">
                <strong>Step 1:</strong> Check if OpenGov has the component → Use it
                <br />
                <strong>Step 2:</strong> If not, check if MUI has it → Use it
                <br />
                <strong>Step 3:</strong> If neither exists → Build custom on MUI primitives
              </Typography>
            </Alert>
          </Paper>

          {/* Import Order Convention */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Import Order Convention
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Seamstress enforces a specific import order for consistency and readability.
            </Typography>

            <CodeBlock>
{`// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. OpenGov component imports
import { NavBar } from '@opengov/components-nav-bar';
import { PageHeaderComposable } from '@opengov/capital-mui';

// 3. MUI imports (grouped: components, icons, styles)
import { Box, Stack, Typography, Grid, Paper } from '@mui/material';
import { CheckCircle, Edit, Delete } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// 4. Third-party library imports
import { useNavigate } from 'react-router-dom';
import * as Effect from 'effect/Effect';

// 5. Local component imports
import { MyCustomComponent } from './components/MyCustomComponent';

// 6. Type imports (if using separate import statement)
import type { MyType } from './types';`}
            </CodeBlock>

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                ✅ This import order is automatically enforced by the seamstress-component-hierarchy
                skill when generating code.
              </Typography>
            </Alert>
          </Paper>

          {/* Tables and Grids */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Tables & Grids Usage Patterns
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Learn existing patterns before implementing tables or grids using the{' '}
              <strong>seamstress-pattern-discovery</strong> skill.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={12} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `2px solid ${theme.palette.primary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Data Tables (DataGrid)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    For displaying tabular data with sorting, filtering, pagination, and row actions.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Use DataGrid from @mui/x-data-grid:</Typography>
                  <CodeBlock>
{`import { DataGrid } from '@mui/x-data-grid';

<DataGrid
  rows={data}
  columns={columns}
  initialState={{
    pagination: {
      paginationModel: { pageSize: 25, page: 0 },
    },
  }}
  pageSizeOptions={[10, 25, 50, 100]}
  onRowClick={(params) => navigate(\`/items/\${params.row.id}\`)}
  sx={{
    '& .MuiDataGrid-cell': {
      display: 'flex',
      alignItems: 'center',
    },
  }}
/>`}
                  </CodeBlock>
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>✅ Vertical Centering:</strong> Always apply <code>display: 'flex'</code> and <code>alignItems: 'center'</code> to DataGrid cells for proper vertical alignment.
                    </Typography>
                  </Alert>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Pattern Discovery:</strong><br />
                      Search: <code>grep -r "DataGrid" src/pages/</code><br />
                      Example: AgentsListPageNew.tsx:159-179
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `2px solid ${theme.palette.secondary.main}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Responsive Grids (CSS Grid or MUI Grid)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    For card layouts or responsive content grids.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>Option 1: MUI Grid (Stable API):</Typography>
                  <CodeBlock>
{`import { Grid } from '@mui/material';

<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 4 }}>
    <Card>...</Card>
  </Grid>
</Grid>`}
                  </CodeBlock>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Option 2: CSS Grid (Modern):</Typography>
                  <CodeBlock>
{`<Box sx={{
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
  },
  gap: 3,
}}>
  <Card>...</Card>
</Box>`}
                  </CodeBlock>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>⚠️ Do NOT use:</strong> <code>@mui/material/Unstable_Grid2</code><br />
                      This import doesn't exist in this project.
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Before implementing tables/grids:
              </Typography>
              <Typography variant="body2" component="div">
                1. Search for existing usage: <code>grep -r "DataGrid\|Grid from" src/pages/</code><br />
                2. Review working examples in the codebase<br />
                3. Match the API pattern used in existing code<br />
                4. Test that imports resolve correctly
              </Typography>
            </Alert>
          </Paper>

          {/* Figma Integration */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <LayersIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4">
                Figma Integration
              </Typography>
            </Stack>

            <Typography variant="body1" paragraph color="text.secondary">
              Seamstress integrates with CDS Design System Figma files via the
              Figma MCP protocol, guided by the <strong>seamstress-figma-integration</strong> skill.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <PaletteIcon color="primary" />
                      <Typography variant="h6">CDS 37 Components</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Core component library mapped directly to MUI components
                    </Typography>
                    <Button
                      size="small"
                      href="https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37"
                      target="_blank"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View in Figma
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <GridViewIcon color="secondary" />
                      <Typography variant="h6">CDS 37 Patterns</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Patterns for drawers, modals, page headers, and layouts
                    </Typography>
                    <Button
                      size="small"
                      href="https://www.figma.com/design/ovXZlZTFwlNBTISlap4s4p/CDS-37-Patterns"
                      target="_blank"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View in Figma
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <CodeIcon color="success" />
                      <Typography variant="h6">CDS 37 Icons</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Complete icon library for OpenGov applications
                    </Typography>
                    <Button
                      size="small"
                      href="https://www.figma.com/design/xaElUstGXrXTsCRKp2IOhF/CDS-37-Icons"
                      target="_blank"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View in Figma
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Design Validation */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Design Validation Checklist
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              When implementing designs from Figma, validate against these criteria:
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Validation Rule</TableCell>
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
                        ✅ All spacing uses 8px grid (8, 16, 24, 32, etc.)
                        <br />
                        ❌ No arbitrary values (12px, 18px, 25px)
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
                        ✅ All colors from theme.palette.* tokens
                        <br />
                        ❌ No hardcoded hex values (#3f51b5, etc.)
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
                        ✅ Use Typography component with variant prop
                        <br />
                        ❌ No custom font-size, font-weight, line-height
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
                        ✅ Matches Figma auto-layout direction (horizontal/vertical)
                        <br />
                        ✅ Proper responsive breakpoints (xs, sm, md, lg, xl)
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
                        ✅ Figma component mapped to correct React component
                        <br />
                        ✅ Follows component hierarchy (OpenGov → MUI → Custom)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Pro Tip: Ask Claude to Validate
              </Typography>
              <Typography variant="body2">
                Use natural language: &quot;Validate this component against Figma design
                standards&quot; to trigger the seamstress-figma-integration skill&apos;s
                validation checklist.
              </Typography>
            </Alert>
          </Paper>

          {/* Token Mapping */}
          <Paper elevation={0} sx={{ p: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Design Token Mapping
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Figma design tokens map directly to MUI theme properties. Use these conversions:
            </Typography>

            <Grid container spacing={3}>
              <Grid size={12} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Spacing (8px Base Unit)
                  </Typography>
                  <CodeBlock>
{`// Figma: 8px, 16px, 24px, 32px
// Code:
p: 1    // 8px
p: 2    // 16px
p: 3    // 24px
p: 4    // 32px
spacing: theme.spacing(2)  // 16px`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Colors
                  </Typography>
                  <CodeBlock>
{`// Figma: Primary/500, Secondary/Main
// Code:
color: 'primary.main'
bgcolor: 'secondary.light'
borderColor: 'divider'
theme.palette.primary.main`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Typography
                  </Typography>
                  <CodeBlock>
{`// Figma: Heading/H1, Body/Regular
// Code:
<Typography variant="h1">
<Typography variant="body1">
typography: theme.typography.h6`}
                  </CodeBlock>
                </Paper>
              </Grid>

              <Grid size={12} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Elevation
                  </Typography>
                  <CodeBlock>
{`// Figma: Drop Shadow/Elevation-2
// Code:
elevation={2}
boxShadow: 2
theme.shadows[4]`}
                  </CodeBlock>
                </Paper>
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
              Ready to Build?
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Now that you understand component hierarchy and Figma integration, start building
              with Seamstress using natural language.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" href="/seamstress/getting-started">
                Getting Started Guide
              </Button>
              <Button variant="outlined" href="/seamstress/skills-reference">
                View All Skills
              </Button>
              <Button variant="text" href="/seamstress/how-it-works">
                How It Works
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </SeamstressLayout>
  );
}
