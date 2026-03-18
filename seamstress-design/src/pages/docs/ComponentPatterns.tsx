import React, { useState } from 'react';
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
  Card,
  CardContent,
  CardActions,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Category as ComponentsIcon,
  ViewList as ListIcon,
  Dashboard as DashboardIcon,
  Description as DetailIcon,
  Input as FormIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachmentIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../components/DocsLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ExampleBlock, CodeBlock } from '../../components/docs';
import {
  sampleListItems,
  sampleMetrics,
  sampleDetailData,
  formCategories,
  formDepartments,
  formPriorities,
  statusColors,
  statusLabels,
} from '../../data/componentPatternsMockData';

export default function ComponentPatterns() {
  const theme = useTheme();
  const [showCodeByDefault, setShowCodeByDefault] = useState(false);

  useDocumentTitle('Component Patterns');

  // DataGrid columns for List Pattern example
  const listColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 0.35, minWidth: 200 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.15,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value]}
          color={statusColors[params.value]}
          size="small"
        />
      ),
    },
    { field: 'department', headerName: 'Department', flex: 0.2, minWidth: 120 },
    { field: 'date', headerName: 'Date', flex: 0.15, minWidth: 100 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.15,
      minWidth: 100,
      valueFormatter: (value: number) =>
        value ? `$${value.toLocaleString()}` : '-',
    },
  ];

  // Code snippets for examples
  const dataGridCode = `<DataGrid
  rows={rows}
  columns={columns}
  pageSizeOptions={[5, 10, 25]}
  checkboxSelection
  disableRowSelectionOnClick
  autoHeight
/>`;

  const cardGridCode = `<Grid container spacing={2}>
  {items.map(item => (
    <Grid size={12} sx={{ flex: '1 1 400px', minWidth: '300px' }} key={item.id}>
      <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6">{item.name}</Typography>
            <Chip label={item.status} color={statusColors[item.status]} size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.department} • {item.date}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View Details</Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>`;

  const formCode = `{/* CDS Form: 4px grid, outlined TextFields (default), slotProps for adornments */}
<Paper elevation={0} sx={{ p: 4, maxWidth: 600, border: '1px solid', borderColor: 'divider' }}>
  <Typography variant="h6" gutterBottom>Create New Request</Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
    Fields marked with * are required
  </Typography>

  <Stack spacing={4}> {/* 16px on CDS 4px grid */}
    <TextField label="Title" required fullWidth placeholder="Enter request title" />

    <TextField
      label="Description"
      required
      fullWidth
      multiline
      rows={3}
      placeholder="Describe your request"
    />

    {/* Two-column row using CSS Grid — gap on 4px grid */}
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2, {/* 8px */}
    }}>
      <TextField label="Category" required fullWidth select defaultValue="">
        <MenuItem value="" disabled>Select category</MenuItem>
        {categories.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
      <TextField label="Department" required fullWidth select defaultValue="">
        <MenuItem value="" disabled>Select department</MenuItem>
        {departments.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
    </Box>

    {/* Use slotProps (not InputProps) for adornments */}
    <TextField
      label="Amount"
      required
      fullWidth
      error={Boolean(errors.amount)}
      helperText={errors.amount || 'Enter budget amount'}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        },
      }}
    />

    {/* Cancel = outlined, Submit = contained */}
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained" disabled={!isValid}>Submit Request</Button>
    </Stack>
  </Stack>
</Paper>`;

  const detailCode = `{/* CDS Detail View: elevation={0} with border, palette paths for colors */}
<Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
  {/* Header */}
  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
    <Box>
      <Typography variant="overline" color="text.secondary">{data.id}</Typography>
      <Typography variant="h4">{data.title}</Typography>
      <Chip label={data.status} color={statusColors[data.status]} sx={{ mt: 1 }} />
    </Box>
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" startIcon={<EditIcon />}>Edit</Button>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
    </Stack>
  </Stack>

  {/* Detail sections — use overline for labels, body1 for values */}
  <Stack spacing={4} divider={<Divider />}>
    <Box>
      <Typography variant="overline" color="text.secondary">Description</Typography>
      <Typography variant="body1">{data.description}</Typography>
    </Box>

    <Grid container spacing={4}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Typography variant="overline" color="text.secondary">Department</Typography>
        <Typography variant="body1">{data.department}</Typography>
      </Grid>
      {/* More fields... */}
    </Grid>
  </Stack>
</Paper>`;

  const dashboardCode = `{/* CDS Dashboard: use palette paths, semantic color props, CDS elevation */}
<Grid container spacing={2}>
  {metrics.map(metric => (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.id}>
      <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography variant="h3" sx={{ mt: 1 }}>{metric.value}</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            {metric.change > 0
              ? <TrendingUpIcon color="success" />
              : <TrendingDownIcon color="error" />}
            <Typography
              variant="body2"
              color={metric.change > 0 ? 'success.dark' : 'error.main'}
            >
              {Math.abs(metric.change)}% {metric.changeLabel}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>`;

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
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
              Component Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              74 MUI components fully themed through CDS tokens. Every color, size, spacing, and radius flows through the design system.
              Below are live component variant showcases and layout patterns.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Chip label="74 CDS Components" color="primary" />
              <Chip label="6 Semantic Colors" color="success" />
              <Chip label="3 Variants" color="info" />
            </Stack>
          </Container>
        </Box>

        {/* Page-level toggle for code visibility */}
        <Box
          sx={{
            bgcolor: 'grey.100',
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 1.5,
          }}
        >
          <Container maxWidth="lg">
            <FormControlLabel
              control={
                <Switch
                  checked={showCodeByDefault}
                  onChange={(e) => setShowCodeByDefault(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Show code by default
                </Typography>
              }
            />
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* ================================================================
              CDS Component Variants Showcase
              ================================================================ */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" gutterBottom>
              CDS Component Variants
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              All 74 MUI components are themed through CDS tokens. Below are the most commonly used components
              showing their full variant and color matrix.
            </Typography>

            {/* Buttons */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" gutterBottom>Buttons</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                6 semantic colors × 3 variants (contained, outlined, text). CDS never uses uppercase.
              </Typography>
              {(['contained', 'outlined', 'text'] as const).map((variant) => (
                <Box key={variant} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {variant}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button variant={variant} color="primary">Primary</Button>
                    <Button variant={variant} color="secondary">Secondary</Button>
                    <Button variant={variant} color="error">Error</Button>
                    <Button variant={variant} color="warning">Warning</Button>
                    <Button variant={variant} color="info">Info</Button>
                    <Button variant={variant} color="success">Success</Button>
                  </Stack>
                </Box>
              ))}
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="contained" size="small">Small</Button>
                <Button variant="contained" size="medium">Medium</Button>
                <Button variant="contained" size="large">Large</Button>
              </Stack>

              {/* Button Do/Don't */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.success.main}` }}>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>Do</Typography>
                    <Typography variant="body2">Use <code>variant</code> and <code>color</code> props</Typography>
                    <Typography variant="body2">Use <code>size="small|medium|large"</code> for sizing</Typography>
                    <Typography variant="body2">Use semantic colors for meaning (error for delete, success for confirm)</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.error.main}` }}>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>Don't</Typography>
                    <Typography variant="body2">Don't use <code>sx</code> to override button colors</Typography>
                    <Typography variant="body2">Don't use <code>textTransform: 'uppercase'</code></Typography>
                    <Typography variant="body2">Don't hardcode border-radius or padding values</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Alerts */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" gutterBottom>Alerts</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                4 severities × 3 variants (standard, filled, outlined).
              </Typography>
              {(['standard', 'filled', 'outlined'] as const).map((variant) => (
                <Box key={variant} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {variant}
                  </Typography>
                  <Stack spacing={1}>
                    <Alert severity="error" variant={variant}>Error — something went wrong.</Alert>
                    <Alert severity="warning" variant={variant}>Warning — proceed with caution.</Alert>
                    <Alert severity="info" variant={variant}>Info — here's some information.</Alert>
                    <Alert severity="success" variant={variant}>Success — operation completed.</Alert>
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* Chips */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" gutterBottom>Chips</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                6 semantic colors, 2 sizes, filled and outlined variants.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Error" color="error" />
                <Chip label="Warning" color="warning" />
                <Chip label="Info" color="info" />
                <Chip label="Success" color="success" />
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                <Chip label="Primary" color="primary" variant="outlined" />
                <Chip label="Secondary" color="secondary" variant="outlined" />
                <Chip label="Error" color="error" variant="outlined" />
                <Chip label="Warning" color="warning" variant="outlined" />
                <Chip label="Info" color="info" variant="outlined" />
                <Chip label="Success" color="success" variant="outlined" />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="Small" size="small" color="primary" />
                <Chip label="Medium" color="primary" />
              </Stack>
            </Box>

            {/* Interactive Controls */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" gutterBottom>Interactive Controls</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Checkbox, Radio, and Switch all support primary, secondary, and error colors with CDS focus rings.
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" gutterBottom>TextField</Typography>
                    <Stack spacing={2}>
                      <TextField label="Default" size="small" fullWidth />
                      <TextField label="Error" size="small" error helperText="Required field" fullWidth />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" gutterBottom>Controls</Typography>
                    <Stack spacing={1}>
                      <FormControlLabel control={<Switch defaultChecked />} label="Primary switch" />
                      <FormControlLabel control={<Switch defaultChecked color="success" />} label="Success switch" />
                      <FormControlLabel control={<Switch color="error" />} label="Error switch" />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" gutterBottom>Sizing</Typography>
                    <Stack spacing={1}>
                      <TextField label="Small input" size="small" fullWidth />
                      <TextField label="Medium input" size="medium" fullWidth />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {/* Controls Do/Don't */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.success.main}` }}>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>Do</Typography>
                    <Typography variant="body2">Use <code>FormControlLabel</code> to pair label with control</Typography>
                    <Typography variant="body2">Use <code>color="error"</code> for destructive toggles</Typography>
                    <Typography variant="body2">Use <code>variant="outlined"</code> (default) for TextFields</Typography>
                    <Typography variant="body2">Handle all 4 states: loading, error, empty, success</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.error.main}` }}>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>Don't</Typography>
                    <Typography variant="body2">Don't override focus ring with custom box-shadow</Typography>
                    <Typography variant="body2">Don't use <code>InputBase</code> — use <code>TextField</code></Typography>
                    <Typography variant="body2">Don't hardcode input height — use <code>size</code> prop</Typography>
                    <Typography variant="body2">Don't use inline color values for error states</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* UI Patterns */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <ComponentsIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Common UI Patterns</Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" paragraph>
              Four core UI patterns cover most application needs: List views for browsing data, Form views for
              data entry, Detail views for individual records, and Dashboard views for metrics and analytics.
            </Typography>

            {/* List Pattern */}
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <ListIcon color="info" />
                <Typography variant="h3">List Pattern</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                For displaying collections of items. Use DataGrid for tabular data, Card grids for rich content,
                or MUI List for simple items.
              </Typography>

              {/* DataGrid Example */}
              <ExampleBlock
                title="DataGrid for Tabular Data"
                description="Sortable, filterable tabular data with built-in pagination and selection"
                code={dataGridCode}
                defaultShowCode={showCodeByDefault}
              >
                <DataGrid
                  rows={sampleListItems}
                  columns={listColumns}
                  pageSizeOptions={[5]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  checkboxSelection
                  disableRowSelectionOnClick
                  autoHeight
                />
              </ExampleBlock>

              {/* Card Grid Example */}
              <ExampleBlock
                title="Card Grid for Rich Content"
                description="Flexible card layout for items with varied content, images, or actions"
                code={cardGridCode}
                defaultShowCode={showCodeByDefault}
              >
                <Grid container spacing={2}>
                  {sampleListItems.slice(0, 3).map((item) => (
                    <Grid size={12} sx={{ flex: '1 1 280px', minWidth: '260px' }} key={item.id}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1, pr: 1 }}>
                              {item.name}
                            </Typography>
                            <Chip
                              label={statusLabels[item.status]}
                              color={statusColors[item.status]}
                              size="small"
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.department} • {item.date}
                          </Typography>
                          {item.amount && (
                            <Typography variant="h6" sx={{ mt: 2 }}>
                              ${item.amount.toLocaleString()}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button size="small">View Details</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </ExampleBlock>
            </Box>

            {/* Form Pattern */}
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <FormIcon color="success" />
                <Typography variant="h3">Form Pattern</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                For data entry and editing. Use Stack with <code>spacing={'{4}'}</code> (16px on CDS 4px grid)
                for vertical layouts, CSS Grid for multi-column rows, and always show validation feedback.
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>CDS Form Rules:</strong> All fields use <code>fullWidth</code> and <code>variant="outlined"</code> (default).
                  Required fields show asterisk (*). Errors display below via <code>helperText</code>.
                  Cancel is <code>variant="outlined"</code>, Submit is <code>variant="contained"</code>.
                  Use <code>size="small"</code> or <code>"medium"</code> — never override height via <code>sx</code>.
                  Use <code>slotProps</code> for adornments, not deprecated <code>InputProps</code>.
                </Typography>
              </Alert>

              <ExampleBlock
                title="Form with Validation"
                description="CSS Grid for two-column rows, validation states, and proper button hierarchy"
                code={formCode}
                defaultShowCode={showCodeByDefault}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    elevation={0}
                    sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, maxWidth: 600, width: '100%' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Create New Request
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Fields marked with * are required
                    </Typography>

                    <Stack spacing={4}>
                      <TextField
                        label="Title"
                        required
                        fullWidth
                        placeholder="Enter request title"
                        helperText="Required field"
                      />

                      <TextField
                        label="Description"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Describe your request in detail"
                      />

                      {/* Two-column row using CSS Grid */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2,
                        }}
                      >
                        <TextField label="Category" required select fullWidth defaultValue="">
                          <MenuItem value="" disabled>
                            Select category
                          </MenuItem>
                          {formCategories.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField label="Department" required select fullWidth defaultValue="">
                          <MenuItem value="" disabled>
                            Select department
                          </MenuItem>
                          {formDepartments.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      {/* Two-column row with validation error example */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2,
                        }}
                      >
                        <TextField
                          label="Estimated Amount"
                          required
                          fullWidth
                          error
                          helperText="Amount is required"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                              ),
                            },
                          }}
                        />
                        <TextField label="Priority" select fullWidth defaultValue="medium">
                          {formPriorities.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <TextField
                        label="Additional Notes"
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Optional additional information"
                        helperText="Optional"
                      />

                      <Divider />

                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined">Cancel</Button>
                        <Button variant="contained" disabled>
                          Submit Request
                        </Button>
                      </Stack>

                      <Alert severity="warning">
                        <Typography variant="caption">
                          Submit button is disabled because required fields have errors
                        </Typography>
                      </Alert>
                    </Stack>
                  </Paper>
                </Box>
              </ExampleBlock>
            </Box>

            {/* Detail Pattern */}
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <DetailIcon color="warning" />
                <Typography variant="h3">Detail Pattern</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                For displaying individual record details. Use sections, clear labels, and consistent spacing.
                Combine with tabs for complex records.
              </Typography>

              <ExampleBlock
                title="Record Detail View"
                description="Structured layout with header, metadata, and action buttons"
                code={detailCode}
                defaultShowCode={showCodeByDefault}
              >
                <Paper
                  elevation={0}
                  sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}
                >
                  {/* Header */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    spacing={2}
                    sx={{ mb: 4 }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {sampleDetailData.id}
                      </Typography>
                      <Typography variant="h4">{sampleDetailData.title}</Typography>
                      <Chip
                        label={statusLabels[sampleDetailData.status]}
                        color={statusColors[sampleDetailData.status]}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" startIcon={<EditIcon />}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                        Delete
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Details */}
                  <Stack spacing={3} divider={<Divider />}>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">{sampleDetailData.description}</Typography>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="overline" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="body1">{sampleDetailData.department}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="overline" color="text.secondary">
                          Requested By
                        </Typography>
                        <Typography variant="body1">{sampleDetailData.requestedBy}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="overline" color="text.secondary">
                          Created
                        </Typography>
                        <Typography variant="body1">{sampleDetailData.createdDate}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="overline" color="text.secondary">
                          Estimated Amount
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          ${sampleDetailData.estimatedAmount.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AttachmentIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {sampleDetailData.attachments} attachments
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CommentIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {sampleDetailData.comments} comments
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              </ExampleBlock>
            </Box>

            {/* Dashboard Pattern */}
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <DashboardIcon color="error" />
                <Typography variant="h3">Dashboard Pattern</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                For metrics, analytics, and data visualization. Use flexbox grid for metric cards and consistent
                card heights for visual harmony.
              </Typography>

              <ExampleBlock
                title="Metric Cards Grid"
                description="Key performance indicators with trend indicators and comparison data"
                code={dashboardCode}
                defaultShowCode={showCodeByDefault}
              >
                <Grid container spacing={2}>
                  {sampleMetrics.map((metric) => (
                    <Grid size={12} sx={{ flex: '1 1 200px', minWidth: '180px' }} key={metric.id}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <CardContent>
                          <Typography variant="overline" color="text.secondary">
                            {metric.label}
                          </Typography>
                          <Typography variant="h3" sx={{ mt: 1 }}>
                            {metric.value}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                            {metric.change > 0 ? (
                              <TrendingUpIcon color="success" fontSize="small" />
                            ) : (
                              <TrendingDownIcon color="error" fontSize="small" />
                            )}
                            <Typography
                              variant="body2"
                              color={metric.change > 0 ? 'success.dark' : 'error.main'}
                            >
                              {Math.abs(metric.change)}% {metric.changeLabel}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </ExampleBlock>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Component Best Practices */}
          <Box sx={{ mb: 8 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <CodeIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h2">Best Practices</Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Card Components
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use elevation={0} with border for flat cards"
                          secondary="CDS default — borderColor: 'divider'"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Set height: '100%' for grid cards"
                          secondary="Ensures even row heights"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use CardActionArea for clickable cards"
                          secondary="CDS focus ring applied automatically"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Button Components
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use variant + color props for styling"
                          secondary="Never override colors via sx"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="contained = primary, outlined = secondary, text = tertiary"
                          secondary="Clear visual hierarchy"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use color='error' for destructive actions"
                          secondary="Delete, remove, cancel subscription"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Form Components
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use TextField (never InputBase directly)"
                          secondary="CDS theme overrides apply to TextField"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use slotProps for adornments (not InputProps)"
                          secondary="MUI v7 recommended API"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use size='small' or 'medium' for sizing"
                          secondary="Never override height via sx"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      DataGrid Components
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use disableRowSelectionOnClick"
                          secondary="Prevents accidental selections"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Set reasonable pageSize (10-25)"
                          secondary="Balance UX and performance"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use Chip with color prop for status columns"
                          secondary="CDS semantic colors for status meaning"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Accessibility */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
              Accessibility Guidelines
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              All components should follow WCAG 2.1 AA standards. Material-UI provides excellent accessibility
              support out of the box, but you must use components correctly.
            </Alert>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" gutterBottom>
                    Keyboard Navigation
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • All interactive elements must be keyboard accessible
                    </Typography>
                    <Typography variant="body2">
                      • CDS 3px focus ring appears on :focus-visible automatically
                    </Typography>
                    <Typography variant="body2">
                      • Use proper tab order (top-to-bottom, left-to-right)
                    </Typography>
                    <Typography variant="body2">
                      • Never override the CDS focus ring with custom box-shadow
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" gutterBottom>
                    Screen Readers
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • Use semantic HTML (headings, lists, buttons)
                    </Typography>
                    <Typography variant="body2">
                      • Provide aria-label for icon-only buttons
                    </Typography>
                    <Typography variant="body2">
                      • Use FormControlLabel to pair labels with controls
                    </Typography>
                    <Typography variant="body2">
                      • Announce dynamic content changes
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" gutterBottom>
                    Color Contrast
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • CDS colors meet 4.5:1 contrast for normal text
                    </Typography>
                    <Typography variant="body2">
                      • Maintain 3:1 contrast for large text (18px+)
                    </Typography>
                    <Typography variant="body2">
                      • Don't rely on color alone for meaning — use icons or text
                    </Typography>
                    <Typography variant="body2">
                      • CDS is light mode only — no dark mode testing needed
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" gutterBottom>
                    Form Accessibility
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • Use TextField (never raw InputBase) for CDS theme integration
                    </Typography>
                    <Typography variant="body2">
                      • Use helperText for error messages, not custom text
                    </Typography>
                    <Typography variant="body2">
                      • Group related fields with fieldset
                    </Typography>
                    <Typography variant="body2">
                      • Use required prop — CDS adds asterisk automatically
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Quick Reference */}
          <Box>
            <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
              Quick Reference
            </Typography>

            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Use Case</strong></TableCell>
                    <TableCell><strong>Recommended Components</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Page Layout</TableCell>
                    <TableCell>Container, Box, Stack, Grid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Data Tables</TableCell>
                    <TableCell>DataGrid, Table, TableContainer</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Forms</TableCell>
                    <TableCell>TextField, Select, Checkbox, Radio, Switch</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Navigation</TableCell>
                    <TableCell>Tabs, Menu, Drawer, Breadcrumbs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Alert, Snackbar, Dialog, CircularProgress</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Content Display</TableCell>
                    <TableCell>Card, Paper, Accordion, List</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell>Button, IconButton, Fab, ButtonGroup</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status & Labels</TableCell>
                    <TableCell>Chip, Badge, Tooltip</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>
    </DocsLayout>
  );
}
