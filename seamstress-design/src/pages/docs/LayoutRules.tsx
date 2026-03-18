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
  Alert,
  Button,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Switch,
  FormControlLabel,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  ViewQuilt as GridIcon,
  ViewColumn as ColumnIcon,
  ViewModule as ModuleIcon,
  Devices as ResponsiveIcon,
  Architecture as StructureIcon,
  TabletMac as TabletIcon,
  PhoneIphone as PhoneIcon,
  Computer as DesktopIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Straighten as StraightenIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  FormatListBulleted as ListIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Attachment as AttachmentIcon,
  Draw as SignatureIcon,
  Checklist as ChecklistIcon,
  Article as ArticleIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { PageAnatomyPreview } from '../../components/docs/PageAnatomyPreview';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { NavBar } from '@opengov/components-nav-bar';
import Toolbar from '../../components/Toolbar/Toolbar';
import type { INavBarOptions, IMenuOption } from '../../config/navBarTypes';
import { DocsLayout } from '../../components/DocsLayout';
import { dataVizPalette } from '../../constants/dataVizColors';

// High-contrast colors for Page Anatomy sections (from dataViz palette)
const anatomyColors = {
  platformNav: dataVizPalette[2].value,  // Purple
  navBar: dataVizPalette[0].value,       // Blurple
  pageHeader: dataVizPalette[3].value,   // Turquoise
  toolbar: dataVizPalette[5].value,      // Blue
  content: dataVizPalette[1].value,      // Terracotta
  drawer: dataVizPalette[4].value,       // Magenta
  form: dataVizPalette[8].value,         // Green (forms)
  chart: dataVizPalette[7].value,        // Violet (charts)
  kpi: dataVizPalette[6].value,          // Yellow (KPI cards)
  table: dataVizPalette[9].value,        // Teal (tables)
  sidebar: dataVizPalette[10].value,     // Pink (sidebars)
};

// TabPanel component (following DocumentBuilderPage pattern)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`layout-tabpanel-${index}`}
    aria-labelledby={`layout-tab-${index}`}
  >
    {value === index && children}
  </Box>
);

function a11yProps(index: number) {
  return {
    id: `layout-tab-${index}`,
    'aria-controls': `layout-tabpanel-${index}`,
  };
}
import { PlatformNavigation } from '../../components/PlatformNavigation';
import Drawer from '../../components/Drawer/Drawer';

export default function LayoutRules() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [inspectSpacing, setInspectSpacing] = useState(false);

  useDocumentTitle('Layout Rules');

  // Sample data for the data grid
  const tableData = [
    { id: 1, name: 'Item Alpha', desc: 'Primary item with extended configuration options...', status: 'Active', author: 'J. Smith', date: 'Jan 15, 2024' },
    { id: 2, name: 'Item Beta', desc: 'Secondary item for processing workflows...', status: 'Active', author: 'A. Jones', date: 'Jan 14, 2024' },
    { id: 3, name: 'Item Gamma', desc: 'Archived item from previous quarter...', status: 'Inactive', author: 'M. Chen', date: 'Jan 10, 2024' },
    { id: 4, name: 'Item Delta', desc: 'New item pending review and approval...', status: 'Active', author: 'S. Wilson', date: 'Jan 8, 2024' },
    { id: 5, name: 'Item Epsilon', desc: 'Legacy item maintained for compatibility...', status: 'Inactive', author: 'R. Taylor', date: 'Jan 5, 2024' },
    { id: 6, name: 'Item Zeta', desc: 'Recently updated with new features...', status: 'Active', author: 'J. Smith', date: 'Jan 3, 2024' },
    { id: 7, name: 'Item Eta', desc: 'Scheduled for deprecation next release...', status: 'Inactive', author: 'A. Jones', date: 'Dec 28, 2023' },
    { id: 8, name: 'Item Theta', desc: 'Core system item with dependencies...', status: 'Active', author: 'M. Chen', date: 'Dec 20, 2023' },
  ];

  // Column definitions for the DataGrid
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 0.15,
    },
    {
      field: 'desc',
      headerName: 'Description',
      minWidth: 200,
      flex: 0.35,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip
            label={params.value}
            size="small"
            color={params.value === 'Active' ? 'success' : 'default'}
            variant={params.value === 'Active' ? 'filled' : 'outlined'}
          />
        </Box>
      ),
    },
    {
      field: 'author',
      headerName: 'Created By',
      minWidth: 140,
      flex: 0.15,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main', color: 'white' }}>
            {params.value?.[0]}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'date',
      headerName: 'Last Modified',
      minWidth: 120,
      flex: 0.15,
    },
  ];

  // NavBar configuration for the example
  const exampleMenuOptions: IMenuOption[] = [
    { id: 'dashboard', label: 'Dashboard', url: '#', isActive: false, shouldFetchNestedMenuItems: false },
    { id: 'items', label: 'Items', url: '#', isActive: true, shouldFetchNestedMenuItems: false },
    { id: 'reports', label: 'Reports', url: '#', isActive: false, shouldFetchNestedMenuItems: false },
    { id: 'settings', label: 'Settings', url: '#', isActive: false, shouldFetchNestedMenuItems: false },
  ];

  const exampleNavBarOptions: INavBarOptions = {
    appName: 'Suite Name',
    openGovLogoUrl: undefined,
    openGovLogoLinkComponent: () => null,
    menuOptions: exampleMenuOptions,
    favorites: [],
    utilityTrayOptions: {
      profileSettingsOptions: {
        placeHolderInitials: 'JD',
      },
    },
    showOfflineIndicator: false,
    autoDismissToasts: true,
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

  // Visual spacing helper
  const SpacingBox = ({ spacing, label }: { spacing: number; label: string }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: spacing * 8,
          height: spacing * 8,
          bgcolor: alpha(theme.palette.primary.main, 0.2),
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          {spacing}
        </Typography>
      </Box>
      <Typography variant="caption" display="block" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
        {spacing * 8}px
      </Typography>
    </Box>
  );

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
            >
              Layout Rules
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              Visual guide to page structure, grid systems, spacing, and responsive design patterns
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Chip label="MUI Grid System" color="info" />
              <Chip label="Flexbox Patterns" color="success" />
              <Chip label="Mobile First" />
            </Stack>

            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="Layout example tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mt: 4 }}
            >
              <Tab
                iconPosition="start"
                label="Page Anatomy"
                {...a11yProps(0)}
              />
              <Tab
                iconPosition="start"
                label="Dashboards"
                {...a11yProps(1)}
              />
              <Tab
                iconPosition="start"
                label="Complex Forms"
                {...a11yProps(2)}
              />
              <Tab
                iconPosition="start"
                label="Documents"
                {...a11yProps(3)}
              />
              <Tab
                iconPosition="start"
                label="List Views"
                {...a11yProps(4)}
              />
            </Tabs>
          </Container>
        </Box>

        {/* Tab Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Tab 0: Page Anatomy (existing content) */}
          <TabPanel value={activeTab} index={0}>
            <Stack spacing={10}>
              {/* Page Anatomy */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h2">Page Anatomy</Typography>
                </Stack>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 6 }}>
                  Every page follows a consistent layered structure. Here's an example showing the key components: PlatformNavigation, NavBar, PageHeaderComposable, Toolbar, and content area.
                </Typography>

                {/* Spacing Inspector Toggle Control */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={inspectSpacing}
                          onChange={(e) => setInspectSpacing(e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <StraightenIcon fontSize="small" />
                          <Typography variant="body2">Inspect Spacing</Typography>
                        </Stack>
                      }
                    />
                    {inspectSpacing && (
                      <Typography variant="caption" color="text.secondary">
                        Hover over elements in the preview below to see their padding, margin, and gap values
                      </Typography>
                    )}
                  </Stack>
                </Paper>

                {/* Live Example with Real Components */}
                <Box sx={{ mb: 6 }}>
                  <PageAnatomyPreview
                    title="Items"
                    breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Suite Name' }, { title: 'Items' }]}
                    status={{ label: 'Active', color: 'success' }}
                    showToolbar
                    showDrawer
                    drawerOpen={drawerOpen}
                    onDrawerOpenChange={setDrawerOpen}
                    drawerTitle="Filters"
                    drawerSubtitle="Filter and organize items"
                    inspectSpacing={inspectSpacing}
                    toolbarContent={
                      <Toolbar level="level1" sx={{ px: 0 }}>
                        <Toolbar.Section spacing={1}>
                          <Button
                            variant={drawerOpen ? 'contained' : 'outlined'}
                            size="small"
                            startIcon={<FilterListIcon />}
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            color={drawerOpen ? 'primary' : 'inherit'}
                          >
                            Filters
                          </Button>
                          <TextField
                            size="small"
                            placeholder="Search items..."
                            sx={{ width: 200 }}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                          <ToggleButtonGroup size="small" value="all" exclusive>
                            <ToggleButton value="all" sx={{ px: 1.5, py: 0.5 }}>All (8)</ToggleButton>
                            <ToggleButton value="active" sx={{ px: 1.5, py: 0.5 }}>Active (5)</ToggleButton>
                            <ToggleButton value="inactive" sx={{ px: 1.5, py: 0.5 }}>Inactive (3)</ToggleButton>
                          </ToggleButtonGroup>
                        </Toolbar.Section>
                        <Toolbar.Section grow />
                        <Toolbar.Section>
                          <ToggleButtonGroup
                            size="small"
                            value={viewMode}
                            exclusive
                            onChange={(_, value) => value && setViewMode(value)}
                          >
                            <ToggleButton value="table" sx={{ px: 1 }}>
                              <ViewListIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value="cards" sx={{ px: 1 }}>
                              <ViewModuleIcon fontSize="small" />
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Toolbar.Section>
                      </Toolbar>
                    }
                    drawerContent={
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            Status
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip label="Active" size="small" color="success" />
                            <Chip label="Inactive" size="small" variant="outlined" />
                          </Stack>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            Created By
                          </Typography>
                          <TextField size="small" placeholder="Filter by author..." fullWidth />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            Date Range
                          </Typography>
                          <Stack spacing={1}>
                            <TextField size="small" type="date" fullWidth />
                            <TextField size="small" type="date" fullWidth />
                          </Stack>
                        </Box>
                        <Divider />
                        <Button variant="outlined" size="small" fullWidth>
                          Clear Filters
                        </Button>
                      </Stack>
                    }
                  >
                    {viewMode === 'table' ? (
                      <DataGrid
                        rows={tableData}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                          },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        autoHeight
                        sx={{
                          border: `1px solid`,
                          borderColor: 'divider',
                          borderRadius: 1,
                          '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box>
                        <Grid container spacing={2}>
                          {tableData.slice(0, 8).map((row, i) => (
                            <Grid key={i} sx={{ flex: '1 1 200px', minWidth: '180px', maxWidth: '250px' }}>
                              <Card
                                elevation={0}
                                sx={{
                                  height: '100%',
                                  border: `1px solid ${theme.palette.divider}`,
                                  cursor: 'pointer',
                                  '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) },
                                }}
                              >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                      {row.name}
                                    </Typography>
                                    <Chip
                                      label={row.status}
                                      size="small"
                                      sx={{
                                        bgcolor: row.status === 'Active' ? 'success.main' : 'default',
                                        color: row.status === 'Active' ? 'white' : 'text.primary',
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                        height: 20,
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, minHeight: 32 }}>
                                    {row.desc}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Avatar sx={{ width: 18, height: 18, fontSize: '0.6rem', bgcolor: 'secondary.main', color: 'white' }}>
                                        {row.author[0]}
                                      </Avatar>
                                      <Typography variant="caption" color="text.secondary">{row.author}</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">{row.date}</Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">Showing 8 of 8 items</Typography>
                        </Box>
                      </Box>
                    )}
                  </PageAnatomyPreview>
                </Box>
              </Box>

              {/* Container Widths - Visual */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <ModuleIcon color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="h2">Container Widths</Typography>
                </Stack>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Containers constrain content width for readability. Here's how each size looks:
                </Typography>

                <Stack spacing={3}>
                  {[
                    { size: 'xxs', width: 320, label: 'Extra Extra Small', color: theme.palette.grey[500], use: 'Compact mobile views' },
                    { size: 'xs', width: 420, label: 'Extra Small', color: theme.palette.info.main, use: 'Narrow forms, mobile dialogs' },
                    { size: 'sm', width: 600, label: 'Small', color: theme.palette.success.main, use: 'Simple pages, small content' },
                    { size: 'md', width: 900, label: 'Medium', color: theme.palette.warning.main, use: 'Standard content width' },
                    { size: 'lg', width: 1280, label: 'Large', color: theme.palette.primary.main, use: 'Default for most pages ✓' },
                    { size: 'xl', width: 1440, label: 'Extra Large', color: theme.palette.secondary.main, use: 'Wide dashboards, data tables' },
                    { size: 'xxl', width: 1920, label: 'Extra Extra Large', color: theme.palette.error.main, use: 'Full-width displays' },
                  ].map((container) => (
                    <Box key={container.size}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Chip
                          label={container.size}
                          size="small"
                          sx={{
                            bgcolor: alpha(container.color, 0.1),
                            color: container.color,
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                          }}
                        />
                        <Typography variant="h6">{container.label}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {container.width}px max
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          height: 60,
                          maxWidth: container.width,
                          bgcolor: alpha(container.color, 0.15),
                          border: `2px solid ${container.color}`,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" fontWeight="medium">
                          {container.use}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Alert severity="info" sx={{ mt: 4 }}>
                  <strong>Pro Tip:</strong> Use <code>maxWidth="lg"</code> (1280px) as your default. It provides
                  excellent readability while accommodating most content needs.
                </Alert>
              </Box>

              {/* Spacing System - Comprehensive */}
              <Box>
                <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
                  Spacing System
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  MUI uses an 8px base unit. All spacing is calculated as multiples of 8. Consistent spacing creates visual rhythm and hierarchy throughout the application.
                </Typography>

                {/* Visual Scale */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    Visual Scale
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Each spacing unit equals 8px. Use these multiples consistently throughout the application.
                  </Typography>
                  <Grid container spacing={4} justifyContent="center">
                    {[
                      { spacing: 0.5, label: 'Tiny' },
                      { spacing: 1, label: 'Small' },
                      { spacing: 2, label: 'Medium' },
                      { spacing: 3, label: 'Large' },
                      { spacing: 4, label: 'XL' },
                      { spacing: 6, label: 'XXL' },
                      { spacing: 8, label: 'Huge' },
                      { spacing: 10, label: 'Major' },
                    ].map((item) => (
                      <Grid key={item.spacing} sx={{ flex: '0 0 auto' }}>
                        <SpacingBox spacing={item.spacing} label={item.label} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                {/* Master Spacing Reference Table */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    Master Spacing Reference
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Quick reference for common spacing values by context. Use these consistently across all pages.
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box
                      component="table"
                      sx={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        '& th, & td': {
                          border: `1px solid ${theme.palette.divider}`,
                          p: 2,
                          textAlign: 'left',
                        },
                        '& th': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          fontWeight: 600,
                        },
                      }}
                    >
                      <thead>
                        <tr>
                          <Box component="th">Context</Box>
                          <Box component="th">Value</Box>
                          <Box component="th">Pixels</Box>
                          <Box component="th">Use Case</Box>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { context: 'Tab panel sections', value: 'spacing={10}', pixels: '80px', use: 'Major section separation within tabs' },
                          { context: 'Page sections', value: 'spacing={6}', pixels: '48px', use: 'Between content blocks on pages' },
                          { context: 'Form fields', value: 'spacing={3}', pixels: '24px', use: 'Between stacked form fields' },
                          { context: 'Card grid gaps', value: 'spacing={2} or {3}', pixels: '16-24px', use: 'Grid container spacing for cards' },
                          { context: 'Action buttons', value: 'spacing={2}', pixels: '16px', use: 'Between horizontal action buttons' },
                          { context: 'Button groups/chips', value: 'spacing={1}', pixels: '8px', use: 'Compact inline elements' },
                          { context: 'Container padding', value: 'p={3} or p={4}', pixels: '24-32px', use: 'Paper/Card content padding' },
                          { context: 'Heading margin-bottom', value: 'mb: 4', pixels: '32px', use: 'After h2/major headings' },
                          { context: 'Subheading margin', value: 'mb: 2 or mb: 3', pixels: '16-24px', use: 'After h5/h6 subheadings' },
                          { context: 'Inline icon gap', value: 'gap: 1', pixels: '8px', use: 'Icon + text alignment' },
                        ].map((row, index) => (
                          <tr key={index}>
                            <td>{row.context}</td>
                            <td><code style={{ fontSize: '0.875rem' }}>{row.value}</code></td>
                            <td><strong>{row.pixels}</strong></td>
                            <td><Typography variant="body2" color="text.secondary">{row.use}</Typography></td>
                          </tr>
                        ))}
                      </tbody>
                    </Box>
                  </Box>
                </Paper>

                {/* Page & Section Spacing */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    1. Page & Section Spacing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Use <code>spacing={'{6}'}</code> (48px) between major page sections. Within tab panels, use <code>spacing={'{10}'}</code> (80px) for clear visual separation.
                  </Typography>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Rule:</strong> Tab panel content uses <code>Stack spacing={'{10}'}</code> for major sections.
                    Regular page content uses <code>Stack spacing={'{6}'}</code> between blocks.
                  </Alert>

                  {/* Visual Example */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Visual Example:</Typography>
                    <PageAnatomyPreview
                      title="Page Sections"
                      breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Module' }, { title: 'Page Sections' }]}
                      showToolbar
                      inspectSpacing={inspectSpacing}
                    >
                      <Stack spacing={6} sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            p: 3,
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">Section 1: Overview Cards</Typography>
                          <Typography variant="caption" color="text.secondary">KPI metrics, summary stats</Typography>
                        </Box>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            border: `2px solid ${theme.palette.success.main}`,
                            borderRadius: 1,
                            p: 3,
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">Section 2: Main Content</Typography>
                          <Typography variant="caption" color="text.secondary">Data table, charts, or form</Typography>
                        </Box>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            border: `2px solid ${theme.palette.info.main}`,
                            borderRadius: 1,
                            p: 3,
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">Section 3: Actions / Footer</Typography>
                          <Typography variant="caption" color="text.secondary">Save, cancel, navigation</Typography>
                        </Box>
                      </Stack>
                    </PageAnatomyPreview>
                  </Box>

                  <CodeBlock>{`{/* Page sections with 48px spacing */}
<Stack spacing={6}>
  <Box>{/* Section 1: Header/Hero */}</Box>
  <Box>{/* Section 2: Main Content */}</Box>
  <Box>{/* Section 3: Footer */}</Box>
</Stack>

{/* Tab panel sections with 80px spacing */}
<TabPanel value={activeTab} index={0}>
  <Stack spacing={10}>
    <Box>{/* Major section 1 */}</Box>
    <Box>{/* Major section 2 */}</Box>
  </Stack>
</TabPanel>`}</CodeBlock>
                </Paper>

                {/* Form Spacing */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="success.main">
                    2. Form Spacing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Forms follow strict spacing rules for readability and usability. Use <code>spacing={'{3}'}</code> (24px) between fields,
                    <code>spacing={'{2}'}</code> (16px) between action buttons, and <code>p={'{4}'}</code> (32px) for container padding.
                  </Typography>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Form Rules:</strong> maxWidth: 600px for single-column forms • spacing={'{3}'} between fields •
                    spacing={'{2}'} between buttons • p={'{4}'} container padding
                  </Alert>

                  {/* Visual Form Example */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Visual Example:</Typography>
                    <PageAnatomyPreview
                      title="Create Request"
                      breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Requests' }, { title: 'Create Request' }]}
                      headerActions={[{ label: 'Save Draft', variant: 'outlined' }, { label: 'Submit', variant: 'contained' }]}
                      inspectSpacing={inspectSpacing}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 4,
                            border: `1px solid ${theme.palette.divider}`,
                            maxWidth: 600,
                            width: '100%',
                          }}
                        >
                          <Typography variant="h6" gutterBottom>Request Details</Typography>
                          <Stack spacing={3}>
                            <TextField label="Title" required fullWidth size="small" placeholder="Enter request title" />
                            <TextField label="Description" required fullWidth size="small" multiline rows={2} placeholder="Describe your request" />
                            <TextField label="Notes" fullWidth size="small" placeholder="Optional notes" />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              <Button variant="outlined" size="small">Cancel</Button>
                              <Button variant="contained" size="small">Submit</Button>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Box>
                    </PageAnatomyPreview>
                  </Box>

                  <CodeBlock>{`{/* Standard form layout */}
<Paper sx={{ p: 4, maxWidth: 600 }}>
  <Typography variant="h6" gutterBottom>Form Title</Typography>
  <Stack spacing={3}>
    <TextField label="Field 1" required fullWidth />
    <TextField label="Field 2" required fullWidth />
    <TextField label="Field 3" fullWidth multiline rows={3} />
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained">Submit</Button>
    </Stack>
  </Stack>
</Paper>`}</CodeBlock>
                </Paper>

                {/* Card & Grid Spacing */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="info.main">
                    3. Card & Grid Spacing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Card grids use <code>spacing={'{2}'}</code> or <code>spacing={'{3}'}</code> for gaps between cards.
                    Cards themselves use <code>p={'{2}'}</code> or <code>p={'{3}'}</code> for internal padding.
                    Use <code>flex: '1 1 200px'</code> pattern for responsive card widths.
                  </Typography>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Grid Rules:</strong> spacing={'{2}'} for compact grids • spacing={'{3}'} for spacious grids •
                    p={'{2}'} for compact cards • p={'{3}'} for standard cards
                  </Alert>

                  {/* Visual Card Grid Example */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Visual Example (spacing={'{2}'} grid gap, p={'{3}'} card padding):</Typography>
                    <PageAnatomyPreview
                      title="Projects"
                      breadcrumbs={[{ path: '#', title: 'Home' }, { title: 'Projects' }]}
                      status={{ label: 'Active', color: 'success' }}
                      showToolbar
                      inspectSpacing={inspectSpacing}
                    >
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          {[
                            { name: 'Infrastructure Upgrade', status: 'In Progress' },
                            { name: 'Budget Review', status: 'Pending' },
                            { name: 'Q4 Planning', status: 'Complete' },
                            { name: 'Vendor Assessment', status: 'In Progress' },
                          ].map((project, num) => (
                            <Grid key={num} sx={{ flex: '1 1 200px', minWidth: '180px' }}>
                              <Card
                                elevation={0}
                                sx={{
                                  height: '100%',
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Typography variant="subtitle2" gutterBottom>{project.name}</Typography>
                                  <Chip label={project.status} size="small" color={project.status === 'Complete' ? 'success' : project.status === 'Pending' ? 'warning' : 'info'} />
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </PageAnatomyPreview>
                  </Box>

                  <CodeBlock>{`{/* Responsive card grid */}
<Grid container spacing={2}>
  {cards.map((card) => (
    <Grid key={card.id} sx={{ flex: '1 1 200px', minWidth: '180px' }}>
      <Card elevation={0} sx={{ height: '100%', border: '1px solid divider' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Card content */}
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>`}</CodeBlock>
                </Paper>

                {/* Button & Action Spacing */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="warning.main">
                    4. Button & Action Spacing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Action buttons use <code>spacing={'{2}'}</code> (16px) for standard spacing.
                    Compact elements like chips and icon buttons use <code>spacing={'{1}'}</code> (8px).
                    Toolbar buttons typically use <code>spacing={'{1}'}</code> for compact grouping.
                  </Typography>

                  <Grid container spacing={4}>
                    {/* Button Groups */}
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" gutterBottom>Action Buttons (spacing={'{2}'})</Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                          border: `1px dashed ${theme.palette.divider}`,
                        }}
                      >
                        <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
                          <Button variant="outlined">Cancel</Button>
                          <Button variant="contained">Save</Button>
                          <Button variant="contained" color="success">Submit</Button>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Chip Groups */}
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" gutterBottom>Chips/Tags (spacing={'{1}'})</Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                          border: `1px dashed ${theme.palette.divider}`,
                        }}
                      >
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip label="Active" color="success" size="small" />
                          <Chip label="Pending" color="warning" size="small" />
                          <Chip label="Draft" variant="outlined" size="small" />
                          <Chip label="Archived" size="small" />
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <CodeBlock>{`{/* Action buttons */}
<Stack direction="row" spacing={2} justifyContent="flex-end">
  <Button variant="outlined">Cancel</Button>
  <Button variant="contained">Save</Button>
</Stack>

{/* Chips/tags */}
<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  <Chip label="Tag 1" size="small" />
  <Chip label="Tag 2" size="small" />
</Stack>

{/* Toolbar buttons */}
<Stack direction="row" spacing={1}>
  <IconButton size="small"><EditIcon /></IconButton>
  <IconButton size="small"><DeleteIcon /></IconButton>
</Stack>`}</CodeBlock>
                  </Box>
                </Paper>

                {/* Typography Spacing */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="secondary.main">
                    5. Typography Spacing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Typography spacing creates hierarchy and readability. Use <code>gutterBottom</code> for quick spacing,
                    <code>mb: 4</code> after major headings, and <code>paragraph</code> prop for body text.
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                      <Typography variant="subtitle2" gutterBottom>Heading Hierarchy:</Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                          border: `1px dashed ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="h4" sx={{ mb: 4 }}>
                          Major Heading (h4)
                        </Typography>
                        <Typography variant="body1" paragraph>
                          First paragraph of content following the heading. Uses paragraph prop for spacing.
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          Subheading (h6)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Secondary content with body2 variant.
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                      <Typography variant="subtitle2" gutterBottom>Common Patterns:</Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2"><code>gutterBottom</code></Typography>
                          <Typography variant="caption" color="text.secondary">Quick 0.35em bottom margin</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2"><code>paragraph</code></Typography>
                          <Typography variant="caption" color="text.secondary">16px bottom margin for body text</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2"><code>sx={'{{'} mb: 4 {'}}'}</code></Typography>
                          <Typography variant="caption" color="text.secondary">32px after major headings (h2, h3)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2"><code>sx={'{{'} mb: 2 {'}}'}</code></Typography>
                          <Typography variant="caption" color="text.secondary">16px after subheadings (h5, h6)</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <CodeBlock>{`{/* Major section heading */}
<Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
  Section Title
</Typography>

{/* Body text with paragraph spacing */}
<Typography variant="body1" color="text.secondary" paragraph>
  Introductory paragraph text...
</Typography>

{/* Subheading with gutterBottom */}
<Typography variant="h6" gutterBottom>
  Subsection Title
</Typography>`}</CodeBlock>
                  </Box>
                </Paper>

                {/* Do/Don't Comparison */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    Spacing Best Practices
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                      <Card elevation={0} sx={{ height: '100%', border: `2px solid ${theme.palette.success.main}` }}>
                        <CardContent>
                          <Typography variant="h6" color="success.main" gutterBottom>
                            Do
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Use consistent spacing multiples
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                <code>spacing={'{1}'}, {'{2}'}, {'{3}'}, {'{4}'}, {'{6}'}, {'{8}'}, {'{10}'}</code>
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                spacing={'{3}'} between form fields
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                24px provides comfortable touch targets and readability
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                spacing={'{2}'} for card grids
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                16px gap keeps cards visually grouped
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                spacing={'{10}'} for tab panel sections
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                80px creates clear visual separation
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Use theme.spacing() in sx props
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                <code>mb: 4</code> instead of <code>marginBottom: '32px'</code>
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                      <Card elevation={0} sx={{ height: '100%', border: `2px solid ${theme.palette.error.main}` }}>
                        <CardContent>
                          <Typography variant="h6" color="error.main" gutterBottom>
                            Don't
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                spacing={'{1}'} between form fields
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                8px is too tight, hurts readability and touch targets
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Mix different spacing values in same grid
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Creates visual inconsistency and chaos
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Use pixel values directly
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                <code>margin: '17px'</code> breaks the 8px grid system
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Use spacing={'{5}'} or spacing={'{7}'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Prefer standard values: 1, 2, 3, 4, 6, 8, 10
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                Inconsistent padding within similar components
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                All cards on a page should use same padding value
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                {/* Common Patterns Quick Reference */}
                <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h5" gutterBottom>
                    Quick Reference: Common Patterns
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>Page Structure</Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          <code>Container maxWidth="lg"</code> → 1280px max
                        </Typography>
                        <Typography variant="body2">
                          <code>Stack spacing={'{10}'}</code> → Tab sections
                        </Typography>
                        <Typography variant="body2">
                          <code>Stack spacing={'{6}'}</code> → Page sections
                        </Typography>
                        <Typography variant="body2">
                          <code>py={'{4}'}</code> → Container vertical padding
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>Forms</Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          <code>Stack spacing={'{3}'}</code> → Field spacing
                        </Typography>
                        <Typography variant="body2">
                          <code>Stack spacing={'{2}'}</code> → Button spacing
                        </Typography>
                        <Typography variant="body2">
                          <code>p={'{4}'}</code> → Form container padding
                        </Typography>
                        <Typography variant="body2">
                          <code>maxWidth: 600</code> → Single-column forms
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" color="info.main" gutterBottom>Cards & Grids</Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          <code>Grid spacing={'{2}'}</code> → Card grid gaps
                        </Typography>
                        <Typography variant="body2">
                          <code>p={'{3}'}</code> → CardContent padding
                        </Typography>
                        <Typography variant="body2">
                          <code>flex: '1 1 200px'</code> → Responsive cards
                        </Typography>
                        <Typography variant="body2">
                          <code>height: '100%'</code> → Equal height cards
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid sx={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom>Typography</Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          <code>mb: 4</code> → After major headings
                        </Typography>
                        <Typography variant="body2">
                          <code>gutterBottom</code> → Quick heading margin
                        </Typography>
                        <Typography variant="body2">
                          <code>paragraph</code> → Body text spacing
                        </Typography>
                        <Typography variant="body2">
                          <code>gap: 1</code> → Icon + text alignment
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Grid Systems - Visual Comparison */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <GridIcon color="info" sx={{ fontSize: 40 }} />
                  <Typography variant="h2">Grid Systems</Typography>
                </Stack>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  We use two grid approaches. Here's when to use each:
                </Typography>

                <Grid container spacing={4}>
                  {/* Breakpoint Grid */}
                  <Grid sx={{ flex: '1 1 500px', minWidth: '300px' }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        border: `2px solid ${theme.palette.info.main}`,
                        bgcolor: alpha(theme.palette.info.main, 0.03),
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" color="info.main" gutterBottom>
                          1. Breakpoint Grid
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          For forms and structured content with specific layouts at different screen sizes.
                        </Typography>

                        {/* Visual Example */}
                        <Box sx={{ my: 3 }}>
                          <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                            Visual Example (3 columns → 2 → 1):
                          </Typography>
                          <Grid container spacing={1}>
                            {[1, 2, 3].map((n) => (
                              <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box
                                  sx={{
                                    bgcolor: alpha(theme.palette.info.main, 0.2),
                                    border: `1px solid ${theme.palette.info.main}`,
                                    borderRadius: 1,
                                    p: 2,
                                    textAlign: 'center',
                                  }}
                                >
                                  <Typography variant="caption">{n}</Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>

                        <CodeBlock>{`<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card>Card 1</Card>
  </Grid>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card>Card 2</Card>
  </Grid>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card>Card 3</Card>
  </Grid>
</Grid>`}</CodeBlock>

                        <Alert severity="info" sx={{ mt: 2 }} icon={<CheckIcon />}>
                          <Typography variant="caption">
                            <strong>Best for:</strong> Forms, structured layouts, precise column control
                          </Typography>
                        </Alert>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Flexbox Grid */}
                  <Grid sx={{ flex: '1 1 500px', minWidth: '300px' }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        border: `2px solid ${theme.palette.success.main}`,
                        bgcolor: alpha(theme.palette.success.main, 0.03),
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" color="success.main" gutterBottom>
                          2. Flexbox Grid ⭐
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          For card galleries and dashboards. Cards automatically wrap and stay equal width.
                        </Typography>

                        {/* Visual Example */}
                        <Box sx={{ my: 3 }}>
                          <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                            Visual Example (auto-wrapping cards):
                          </Typography>
                          <Grid container spacing={1}>
                            {[1, 2, 3, 4].map((n) => (
                              <Grid key={n} sx={{ flex: '1 1 150px', minWidth: '100px' }}>
                                <Box
                                  sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.2),
                                    border: `1px solid ${theme.palette.success.main}`,
                                    borderRadius: 1,
                                    p: 2,
                                    textAlign: 'center',
                                    height: '100%',
                                  }}
                                >
                                  <Typography variant="caption">{n}</Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>

                        <CodeBlock>{`<Grid container spacing={2}>
  <Grid sx={{
    flex: '1 1 400px',
    minWidth: '300px'
  }}>
    <Card sx={{ height: '100%' }}>
      Card 1
    </Card>
  </Grid>
  {/* More cards... */}
</Grid>`}</CodeBlock>

                        <Alert severity="success" sx={{ mt: 2 }} icon={<CheckIcon />}>
                          <Typography variant="caption">
                            <strong>Best for:</strong> Dashboards, card galleries, homepage sections
                          </Typography>
                        </Alert>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Responsive Breakpoints - Visual */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <ResponsiveIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h2">Responsive Breakpoints</Typography>
                </Stack>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Design mobile-first, then enhance for larger screens. Here are our breakpoint ranges:
                </Typography>

                <Grid container spacing={3}>
                  {[
                    { name: 'xxs', range: '0px+', icon: <PhoneIcon />, color: theme.palette.grey[500], device: 'Compact Mobile' },
                    { name: 'xs', range: '320px+', icon: <PhoneIcon />, color: theme.palette.info.main, device: 'Mobile Portrait' },
                    { name: 'sm', range: '420px+', icon: <PhoneIcon />, color: theme.palette.success.main, device: 'Mobile Landscape' },
                    { name: 'md', range: '600px+', icon: <TabletIcon />, color: theme.palette.warning.main, device: 'Tablet' },
                    { name: 'lg', range: '900px+', icon: <DesktopIcon />, color: theme.palette.primary.main, device: 'Desktop' },
                    { name: 'xl', range: '1280px+', icon: <DesktopIcon />, color: theme.palette.secondary.main, device: 'Large Desktop' },
                    { name: 'xxl', range: '1440px+', icon: <DesktopIcon />, color: theme.palette.error.main, device: 'Extra Large Desktop' },
                  ].map((bp) => (
                    <Grid key={bp.name} sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          border: `2px solid ${bp.color}`,
                          bgcolor: alpha(bp.color, 0.05),
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2} alignItems="center">
                            <Box sx={{ color: bp.color }}>
                              {bp.icon}
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Chip
                                label={bp.name}
                                size="small"
                                sx={{
                                  bgcolor: bp.color,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  mb: 1,
                                }}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {bp.range}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {bp.device}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Alert severity="info" sx={{ mt: 4 }}>
                  <Typography variant="body2">
                    <strong>Mobile-First Approach:</strong> Start with mobile styles (no breakpoint), then use{' '}
                    <code>sm:</code>, <code>md:</code>, <code>lg:</code> to enhance for larger screens.
                  </Typography>
                </Alert>
              </Box>

              {/* Common Patterns - Visual Examples */}
              <Box>
                <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
                  Common Layout Patterns
                </Typography>

                <Stack spacing={6}>
                  {/* Dashboard Pattern */}
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Dashboard Layout
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Metric cards in auto-wrapping grid. Cards maintain equal width and automatically adjust columns.
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.divider}` }}>
                      <Grid container spacing={2}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <Grid key={n} sx={{ flex: '1 1 180px', minWidth: '150px' }}>
                            <Card sx={{ height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.main">
                                  {n * 123}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Metric {n}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                    <CodeBlock>{`<Grid container spacing={2}>
  <Grid sx={{ flex: '1 1 200px', minWidth: '180px' }}>
    <MetricCard />
  </Grid>
  {/* More cards... */}
</Grid>`}</CodeBlock>
                  </Box>

                  {/* Two-Column Pattern */}
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Two-Column Layout (Main + Sidebar)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Main content area with sidebar. Stacks on mobile, side-by-side on desktop.
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, border: `2px solid ${theme.palette.divider}` }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 8 }}>
                          <Box
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              border: `2px dashed ${theme.palette.success.main}`,
                              borderRadius: 1,
                              p: 3,
                              minHeight: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="h6" color="success.main">
                              Main Content (8/12 = 66%)
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Box
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              border: `2px dashed ${theme.palette.info.main}`,
                              borderRadius: 1,
                              p: 3,
                              minHeight: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="h6" color="info.main">
                              Sidebar (4/12 = 33%)
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                    <CodeBlock>{`<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 8 }}>
    <Paper>Main Content</Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <Paper>Sidebar</Paper>
  </Grid>
</Grid>`}</CodeBlock>
                  </Box>

                  {/* Form Layouts Section */}
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Form Layouts
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Forms follow strict spacing and validation rules. Use <code>Stack spacing={'{3}'}</code> (24px) between fields,
                      mark required fields with the <code>required</code> prop, and always show validation errors with <code>helperText</code>.
                    </Typography>

                    <Alert severity="info" sx={{ mb: 4 }}>
                      <Typography variant="body2">
                        <strong>Form Rules:</strong> All fields use <code>fullWidth</code>, required fields show asterisk (*),
                        errors display below fields, Cancel is <code>outlined</code>, Submit is <code>contained</code>.
                      </Typography>
                    </Alert>

                    <Stack spacing={6}>
                      {/* Standard Single-Column Form */}
                      <Box>
                        <Typography variant="h6" gutterBottom color="primary">
                          1. Standard Form (Single Column)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Use <code>maxWidth: 600</code> for standard forms. Fields stack vertically with <code>spacing={'{3}'}</code>.
                          Try submitting empty to see validation.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 4,
                              border: `1px solid ${theme.palette.divider}`,
                              maxWidth: 600,
                              width: '100%',
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Create New Request
                            </Typography>
                            <Stack spacing={3} sx={{ width: '100%', alignItems: 'stretch' }}>
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
                                placeholder="Describe your request"
                                sx={{
                                  width: '100%',
                                  '& .MuiInputBase-root': { width: '100%' },
                                  '& textarea': { width: '100%' },
                                }}
                              />
                              <TextField
                                label="Email"
                                type="email"
                                required
                                fullWidth
                                placeholder="your.email@example.com"
                              />
                              <TextField
                                label="Notes"
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Optional additional notes"
                                helperText="Optional"
                                sx={{
                                  width: '100%',
                                  '& .MuiInputBase-root': { width: '100%' },
                                  '& textarea': { width: '100%' },
                                }}
                              />
                              <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="outlined">Cancel</Button>
                                <Button variant="contained">Submit Request</Button>
                              </Stack>
                            </Stack>
                          </Paper>
                        </Box>

                        <CodeBlock>{`{/* Standard Form - maxWidth: 600px */}
<Paper sx={{ p: 4, maxWidth: 600 }}>
  <Typography variant="h6" gutterBottom>Create New Request</Typography>
  <Stack spacing={3}>
    <TextField label="Title" required fullWidth />
    <TextField label="Description" required fullWidth multiline rows={3} />
    <TextField label="Email" type="email" required fullWidth />
    <TextField label="Notes" fullWidth multiline rows={2} helperText="Optional" />
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained">Submit Request</Button>
    </Stack>
  </Stack>
</Paper>`}</CodeBlock>
                      </Box>

                      {/* Two-Column Form with Validation */}
                      <Box>
                        <Typography variant="h6" gutterBottom color="success.main">
                          2. Two-Column Form with Validation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Use <code>Grid</code> with <code>xs={'{12}'} sm={'{6}'}</code> for side-by-side fields on larger screens.
                          Form shows error states with red borders and helper text.
                        </Typography>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 4,
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 3,
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            Budget Request Form
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Fields marked with * are required
                          </Typography>

                          <Stack spacing={3} sx={{ alignItems: 'stretch' }}>
                            {/* Row 1: Title spans full width */}
                            <TextField
                              label="Request Title"
                              required
                              fullWidth
                              placeholder="FY2025 Infrastructure Budget"
                            />

                            {/* Row 2: Two columns using CSS Grid */}
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                              }}
                            >
                              <TextField
                                label="Department"
                                required
                                fullWidth
                                select
                                defaultValue=""
                              >
                                <MenuItem value="" disabled>Select department</MenuItem>
                                <MenuItem value="public-works">Public Works</MenuItem>
                                <MenuItem value="parks">Parks & Recreation</MenuItem>
                                <MenuItem value="utilities">Utilities</MenuItem>
                                <MenuItem value="facilities">Facilities</MenuItem>
                              </TextField>
                              <TextField
                                label="Category"
                                required
                                fullWidth
                                select
                                defaultValue=""
                              >
                                <MenuItem value="" disabled>Select category</MenuItem>
                                <MenuItem value="capital">Capital Improvement</MenuItem>
                                <MenuItem value="maintenance">Maintenance</MenuItem>
                                <MenuItem value="equipment">Equipment</MenuItem>
                              </TextField>
                            </Box>

                            {/* Row 3: Two columns with validation error example */}
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                              }}
                            >
                              <TextField
                                label="Requested Amount"
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
                              <TextField
                                label="Fiscal Year"
                                required
                                fullWidth
                                select
                                defaultValue="2025"
                              >
                                <MenuItem value="2025">FY 2025</MenuItem>
                                <MenuItem value="2026">FY 2026</MenuItem>
                                <MenuItem value="2027">FY 2027</MenuItem>
                              </TextField>
                            </Box>

                            {/* Row 4: Two columns */}
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                              }}
                            >
                              <TextField
                                label="Priority"
                                fullWidth
                                select
                                defaultValue="medium"
                              >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                              </TextField>
                              <TextField
                                label="Due Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>

                            {/* Row 5: Full width textarea */}
                            <TextField
                              label="Justification"
                              required
                              fullWidth
                              multiline
                              rows={4}
                              placeholder="Explain why this budget request is needed..."
                              error
                              helperText="Justification must be at least 50 characters"
                              sx={{
                                width: '100%',
                                '& .MuiInputBase-root': { width: '100%' },
                                '& textarea': { width: '100%' },
                              }}
                            />

                            {/* Row 6: Full width optional field */}
                            <TextField
                              label="Additional Notes"
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Any additional information"
                              helperText="Optional"
                              sx={{
                                width: '100%',
                                '& .MuiInputBase-root': { width: '100%' },
                                '& textarea': { width: '100%' },
                              }}
                            />

                            {/* Action Buttons */}
                            <Divider />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              <Button variant="outlined">Cancel</Button>
                              <Button variant="outlined" color="secondary">Save as Draft</Button>
                              <Button variant="contained" disabled>
                                Submit for Approval
                              </Button>
                            </Stack>

                            <Alert severity="warning" sx={{ mt: 1 }}>
                              <Typography variant="caption">
                                Submit button is disabled because required fields have errors
                              </Typography>
                            </Alert>
                          </Stack>
                        </Paper>

                        <CodeBlock>{`{/* Two-Column Form with Validation */}
<Paper sx={{ p: 4 }}>
  <Typography variant="h6" gutterBottom>Budget Request Form</Typography>
  <Stack spacing={3}>
    {/* Full width field */}
    <TextField label="Request Title" required fullWidth />

    {/* Two-column row using CSS Grid */}
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
    }}>
      <TextField label="Department" required fullWidth select>
        <MenuItem value="">Select department</MenuItem>
      </TextField>
      <TextField label="Category" required fullWidth select />
    </Box>

    {/* Field with validation error */}
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

    {/* Multiline field */}
    <TextField
      label="Justification"
      required
      fullWidth
      multiline
      rows={4}
      error={Boolean(errors.justification)}
      helperText={errors.justification}
    />

    {/* Action buttons - right aligned */}
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained" disabled={!isValid || loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </Stack>
  </Stack>
</Paper>`}</CodeBlock>
                      </Box>
                    </Stack>

                    {/* Form Layout Rules Summary */}
                    <Paper elevation={0} sx={{ p: 3, mt: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                      <Typography variant="h6" gutterBottom color="info.main">
                        Form Layout Rules Summary
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" gutterBottom>Spacing</Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">• <code>spacing={'{3}'}</code> (24px) between fields</Typography>
                            <Typography variant="body2">• <code>spacing={'{2}'}</code> (16px) between action buttons</Typography>
                            <Typography variant="body2">• <code>p={'{4}'}</code> (32px) for form container padding</Typography>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" gutterBottom>Widths</Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">• Standard form: <code>maxWidth: 600</code></Typography>
                            <Typography variant="body2">• Wide form: <code>maxWidth: 800</code></Typography>
                            <Typography variant="body2">• All fields: <code>fullWidth</code></Typography>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" gutterBottom>Validation</Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">• <code>required</code> prop for mandatory fields</Typography>
                            <Typography variant="body2">• <code>error</code> prop for invalid state</Typography>
                            <Typography variant="body2">• <code>helperText</code> for error messages</Typography>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" gutterBottom>Buttons</Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">• Cancel: <code>variant="outlined"</code></Typography>
                            <Typography variant="body2">• Submit: <code>variant="contained"</code></Typography>
                            <Typography variant="body2">• Align right: <code>justifyContent="flex-end"</code></Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </Stack>
              </Box>

              {/* Quick Reference */}
              <Box>
                <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
                  Quick Reference
                </Typography>

                <Grid container spacing={3}>
                  <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.success.main}` }}>
                      <CardContent>
                        <Typography variant="h6" color="success.main" gutterBottom>
                          ✓ Do
                        </Typography>
                        <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
                          <Typography variant="body2" component="li">
                            Use flexbox grid for card galleries
                          </Typography>
                          <Typography variant="body2" component="li">
                            Set <code>height: '100%'</code> on cards for even rows
                          </Typography>
                          <Typography variant="body2" component="li">
                            Use Container maxWidth="lg" as default
                          </Typography>
                          <Typography variant="body2" component="li">
                            Test mobile-first, then enhance
                          </Typography>
                          <Typography variant="body2" component="li">
                            Use spacing multiples of 8px (2, 3, 4, 6, 8)
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.error.main}` }}>
                      <CardContent>
                        <Typography variant="h6" color="error.main" gutterBottom>
                          ✗ Don't
                        </Typography>
                        <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
                          <Typography variant="body2" component="li">
                            Mix breakpoint and flexbox in same grid
                          </Typography>
                          <Typography variant="body2" component="li">
                            Create more than 4 columns on desktop
                          </Typography>
                          <Typography variant="body2" component="li">
                            Use fixed pixel widths instead of responsive units
                          </Typography>
                          <Typography variant="body2" component="li">
                            Forget to test on mobile devices
                          </Typography>
                          <Typography variant="body2" component="li">
                            Use inconsistent spacing between sections
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </TabPanel>

          {/* Tab 1: Dashboards */}
          <TabPanel value={activeTab} index={1}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h2" gutterBottom>
                  Dashboard Layouts
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Dashboards display KPIs, charts, and data tables. They use flexible grids that adapt to screen size while maintaining visual hierarchy.
                </Typography>
              </Box>

              {/* Example 1: Analytics Dashboard */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 1: Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Standard dashboard with KPI cards, charts, and data table. Uses <code>flex: '1 1 200px'</code> for metric cards.
                </Typography>

                <PageAnatomyPreview
                  title="Work Orders Overview"
                  suiteName="Asset Management"
                  activeMenuItem="dashboard"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Asset Management' }, { title: 'Dashboard' }]}
                  showToolbar
                  toolbarContent={
                    <Toolbar level="level1" sx={{ px: 0 }}>
                      <Toolbar.Section spacing={1}>
                        <TextField size="small" select defaultValue="90" sx={{ width: 120 }}>
                          <MenuItem value="30">Last 30 days</MenuItem>
                          <MenuItem value="90">Last 90 days</MenuItem>
                          <MenuItem value="365">This year</MenuItem>
                        </TextField>
                      </Toolbar.Section>
                      <Toolbar.Section grow />
                      <Toolbar.Section>
                        <Button variant="outlined" size="small">Export</Button>
                      </Toolbar.Section>
                    </Toolbar>
                  }
                >
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* KPI Cards Row */}
                    <Grid container spacing={2}>
                      {[
                        { label: 'Work Orders Created', value: '1,247', icon: <TrendingUpIcon />, color: 'primary' },
                        { label: 'Completion Rate', value: '87.3%', icon: <CheckIcon />, color: 'success' },
                        { label: 'Avg Duration', value: '4.2 hrs', icon: <ScheduleIcon />, color: 'warning' },
                        { label: 'Preventive Ratio', value: '62%', icon: <MoneyIcon />, color: 'info' },
                      ].map((kpi, i) => (
                        <Grid key={i} sx={{ flex: '1 1 200px', minWidth: '180px' }}>
                          <Card
                            elevation={0}
                            sx={{
                              height: '100%',
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: alpha(theme.palette[kpi.color as 'primary' | 'success' | 'warning' | 'info'].main, 0.05),
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                              <Box sx={{ color: `${kpi.color}.main`, mb: 1 }}>{kpi.icon}</Box>
                              <Typography variant="h4" color={`${kpi.color}.main`}>
                                {kpi.value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {kpi.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Charts Row */}
                    <Grid container spacing={2}>
                      <Grid sx={{ flex: '1 1 400px', minWidth: '300px' }}>
                        <Card elevation={0} sx={{ height: 200, border: `1px solid ${theme.palette.divider}` }}>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>Work Orders Over Time</Typography>
                            <Box sx={{ height: 140, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" color="text.secondary">[Time Series Chart]</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid sx={{ flex: '1 1 400px', minWidth: '300px' }}>
                        <Card elevation={0} sx={{ height: 200, border: `1px solid ${theme.palette.divider}` }}>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>By Asset Type</Typography>
                            <Box sx={{ height: 140, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" color="text.secondary">[Bar Chart]</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Data Table */}
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                          <Typography variant="subtitle2">Recent Work Orders</Typography>
                        </Box>
                        <Box sx={{ px: 2, py: 1 }}>
                          {[
                            { id: 'WO-1001', status: 'Completed', asset: 'HVAC Unit #3', crew: 'Maintenance A' },
                            { id: 'WO-1002', status: 'In Progress', asset: 'Water Pump #7', crew: 'Utilities' },
                            { id: 'WO-1003', status: 'Scheduled', asset: 'Generator #1', crew: 'Electrical' },
                          ].map((row, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: '100px 100px 1fr 120px',
                                gap: 2,
                                py: 1,
                                borderBottom: i < 2 ? `1px solid ${theme.palette.divider}` : 'none',
                              }}
                            >
                              <Typography variant="body2">{row.id}</Typography>
                              <Chip label={row.status} size="small" color={row.status === 'Completed' ? 'success' : row.status === 'In Progress' ? 'warning' : 'default'} />
                              <Typography variant="body2">{row.asset}</Typography>
                              <Typography variant="body2" color="text.secondary">{row.crew}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Stack>
                </PageAnatomyPreview>
              </Box>

              {/* Example 2: Executive Dashboard */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 2: Executive Summary Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  High-level metrics with progress indicators and summary cards. Uses a simplified layout for quick scanning.
                </Typography>

                <PageAnatomyPreview
                  title="Executive Summary"
                  suiteName="Budget & Planning"
                  activeMenuItem="dashboard"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { title: 'Executive Summary' }]}
                  headerActions={[{ label: 'Export Report', variant: 'outlined' }]}
                >
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Large KPI Cards */}
                    {[
                      { label: 'Total Budget', value: '$2.4M', progress: 68, status: 'On Track' },
                      { label: 'Active Projects', value: '24', progress: 85, status: 'Good' },
                      { label: 'Pending Approvals', value: '7', progress: 30, status: 'Attention' },
                    ].map((item, i) => (
                      <Grid key={i} sx={{ flex: '1 1 280px', minWidth: '250px' }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                          <CardContent>
                            <Typography variant="overline" color="text.secondary">
                              {item.label}
                            </Typography>
                            <Typography variant="h3" sx={{ my: 1 }}>
                              {item.value}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={item.progress}
                              sx={{ mb: 1, height: 8, borderRadius: 1 }}
                              color={item.progress > 70 ? 'success' : item.progress > 40 ? 'warning' : 'error'}
                            />
                            <Chip
                              label={item.status}
                              size="small"
                              color={item.progress > 70 ? 'success' : item.progress > 40 ? 'warning' : 'error'}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </PageAnatomyPreview>
              </Box>

              {/* Example 3: Filter-Heavy Dashboard */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 3: Filter-Heavy Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Dashboard with toolbar containing multiple filter controls. Uses <code>Toolbar</code> component for consistent layout.
                </Typography>

                <PageAnatomyPreview
                  title="Performance Analytics"
                  suiteName="Analytics"
                  activeMenuItem="reports"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Analytics' }, { title: 'Performance' }]}
                  showToolbar
                  showDrawer
                  drawerTitle="Filters"
                  drawerSubtitle="Refine your results"
                  drawerContent={
                    <Stack spacing={2}>
                      <TextField size="small" select label="Department" defaultValue="all" fullWidth>
                        <MenuItem value="all">All Departments</MenuItem>
                        <MenuItem value="finance">Finance</MenuItem>
                        <MenuItem value="ops">Operations</MenuItem>
                      </TextField>
                      <TextField size="small" select label="Status" defaultValue="all" fullWidth>
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </TextField>
                      <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} fullWidth />
                      <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} fullWidth />
                      <Divider />
                      <Button variant="outlined" size="small" fullWidth>Clear Filters</Button>
                      <Button variant="contained" size="small" fullWidth>Apply</Button>
                    </Stack>
                  }
                >
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Grid key={i} sx={{ flex: '1 1 200px', minWidth: '180px' }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, textAlign: 'center', py: 2 }}>
                          <Typography variant="h5" color="primary">{i * 123}</Typography>
                          <Typography variant="caption" color="text.secondary">Metric {i}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </PageAnatomyPreview>
              </Box>

              {/* Code Pattern */}
              <Box>
                <Typography variant="h5" gutterBottom>Dashboard Layout Pattern</Typography>
                <CodeBlock>{`// Dashboard with KPI cards, charts, and table
<Box sx={{ p: 3 }}>
  {/* KPI Cards - flexible grid */}
  <Grid container spacing={2}>
    <Grid sx={{ flex: '1 1 200px', minWidth: '180px' }}>
      <MetricCard label="Total" value="1,234" />
    </Grid>
    {/* More cards... */}
  </Grid>

  {/* Charts - two column */}
  <Grid container spacing={2} sx={{ mt: 3 }}>
    <Grid sx={{ flex: '1 1 400px', minWidth: '300px' }}>
      <TimeSeriesChart data={timeData} />
    </Grid>
    <Grid sx={{ flex: '1 1 400px', minWidth: '300px' }}>
      <BarChart data={categoryData} />
    </Grid>
  </Grid>

  {/* Data Table - full width */}
  <Box sx={{ mt: 3 }}>
    <PerformanceTable rows={rows} columns={columns} />
  </Box>
</Box>`}</CodeBlock>
              </Box>
            </Stack>
          </TabPanel>

          {/* Tab 2: Complex Forms */}
          <TabPanel value={activeTab} index={2}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h2" gutterBottom>
                  Complex Form Layouts
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Forms with drawers, multi-column fields, and action bars. These patterns handle editing, validation, and save states.
                </Typography>
              </Box>

              {/* Example 1: Edit Form with Drawer */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 1: Edit Form with Side Drawer
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Form with PageHeader, Toolbar, content area, and collapsible side drawer (like AgentEditPage).
                </Typography>

                <PageAnatomyPreview
                  title="OG Helper"
                  suiteName="Agent Studio"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Agent Studio' }, { path: '#', title: 'Agents' }, { title: 'OG Helper' }]}
                  status={{ label: 'Draft', color: 'warning' }}
                  headerActions={[{ label: 'Save Changes', variant: 'contained' }]}
                  showToolbar
                  showDrawer
                  drawerOpen
                  drawerTitle="Skills"
                  drawerSubtitle="Add skills to extend capabilities"
                  drawerContent={
                    <Stack spacing={2}>
                      <TextField size="small" fullWidth placeholder="Search skills..." />
                      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, p: 1.5 }}>
                        <Typography variant="body2" fontWeight={600}>OG Knowledge Base</Typography>
                        <Typography variant="caption" color="text.secondary">Search internal documentation</Typography>
                      </Card>
                      <Button variant="outlined" size="small" fullWidth>Add Skill</Button>
                    </Stack>
                  }
                >
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField label="Agent Name" fullWidth defaultValue="OG Helper" />
                    <TextField
                      label="Persona / Description"
                      fullWidth
                      multiline
                      rows={4}
                      defaultValue="OG Helper is an internal AI-powered assistant..."
                    />
                    {/* Action Bar */}
                    <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between' }}>
                      <Button color="error" size="small">Delete Agent</Button>
                      <Stack direction="row" spacing={2}>
                        <ToggleButtonGroup size="small" value="draft" exclusive>
                          <ToggleButton value="draft">Draft</ToggleButton>
                          <ToggleButton value="published">Published</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>
                    </Box>
                  </Stack>
                </PageAnatomyPreview>
              </Box>

              {/* Example 2: Multi-Field Form */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 2: Multi-Column Form Grid
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Two-column form using CSS Grid. Fields stack on mobile, display side-by-side on desktop.
                </Typography>

                <PageAnatomyPreview
                  title="New Project"
                  suiteName="Budget & Planning"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Projects' }, { title: 'New Project' }]}
                  headerActions={[{ label: 'Cancel', variant: 'outlined' }, { label: 'Save Project', variant: 'contained' }]}
                >
                  <Paper elevation={0} sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h6" gutterBottom>Project Properties</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Configure the project settings and metadata
                    </Typography>

                    <Stack spacing={3}>
                      {/* Full width field */}
                      <TextField label="Project Title" required fullWidth defaultValue="FY2025 Infrastructure Budget" />

                      {/* Two-column row */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField label="Department" required fullWidth select defaultValue="public-works">
                          <MenuItem value="public-works">Public Works</MenuItem>
                          <MenuItem value="parks">Parks & Recreation</MenuItem>
                        </TextField>
                        <TextField label="Fiscal Year" required fullWidth select defaultValue="2025">
                          <MenuItem value="2025">FY 2025</MenuItem>
                          <MenuItem value="2026">FY 2026</MenuItem>
                        </TextField>
                      </Box>

                      {/* Another two-column row */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                          label="Budget Amount"
                          required
                          fullWidth
                          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                        />
                        <TextField label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                      </Box>

                      {/* Full width textarea */}
                      <TextField label="Description" fullWidth multiline rows={2} placeholder="Describe the project scope..." />
                    </Stack>
                  </Paper>
                </PageAnatomyPreview>
              </Box>

              {/* Example 3: View/Edit Mode Form */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 3: View/Edit Mode Toggle
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Form that toggles between read-only view mode and editable edit mode.
                </Typography>

                <PageAnatomyPreview
                  title="Acme Corporation"
                  suiteName="Vendor Management"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Vendors' }, { title: 'Acme Corporation' }]}
                  status={{ label: 'Active', color: 'success' }}
                  showToolbar
                  toolbarContent={
                    <Toolbar level="level1" sx={{ px: 0 }}>
                      <Toolbar.Section spacing={1}>
                        <ToggleButtonGroup size="small" value="view" exclusive>
                          <ToggleButton value="view">View</ToggleButton>
                          <ToggleButton value="edit">Edit</ToggleButton>
                        </ToggleButtonGroup>
                      </Toolbar.Section>
                      <Toolbar.Section grow />
                      <Toolbar.Section>
                        <Button variant="outlined" size="small">Contact Vendor</Button>
                      </Toolbar.Section>
                    </Toolbar>
                  }
                >
                  <Paper elevation={0} sx={{ p: 3, mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h6" gutterBottom>Vendor Details</Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Vendor Name</Typography>
                        <Typography variant="body1">Acme Corporation</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Contact Email</Typography>
                        <Typography variant="body1">contact@acme.com</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Box><Chip label="Active" color="success" size="small" /></Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Registration Date</Typography>
                        <Typography variant="body1">January 15, 2024</Typography>
                      </Grid>
                      <Grid size={12}>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body1">123 Business Ave, Suite 100, San Francisco, CA 94102</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </PageAnatomyPreview>
              </Box>

              {/* Code Pattern */}
              <Box>
                <Typography variant="h5" gutterBottom>Form Layout Pattern</Typography>
                <CodeBlock>{`// Two-column form with CSS Grid
<Paper sx={{ p: 4, maxWidth: 800 }}>
  <Stack spacing={3}>
    {/* Full width field */}
    <TextField label="Title" required fullWidth />

    {/* Two-column row */}
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
    }}>
      <TextField label="Field 1" required fullWidth />
      <TextField label="Field 2" required fullWidth />
    </Box>

    {/* Action buttons - right aligned */}
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained">Save</Button>
    </Stack>
  </Stack>
</Paper>`}</CodeBlock>
              </Box>
            </Stack>
          </TabPanel>

          {/* Tab 3: Documents */}
          <TabPanel value={activeTab} index={3}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h2" gutterBottom>
                  Document Layouts
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Document editing interfaces with nested tabs, sidebars, and preview modes. These patterns handle complex content editing workflows.
                </Typography>
              </Box>

              {/* Example 1: Multi-Tab Document Editor */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 1: Multi-Tab Document Editor
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Document builder with nested tabs for different sections (Editor, Attachments, Signatures, Review).
                </Typography>

                <PageAnatomyPreview
                  title="Standard Services Agreement"
                  suiteName="Procurement"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Projects' }, { path: '#', title: 'PRJ-2024-001' }, { title: 'Document' }]}
                  status={{ label: 'Draft', color: 'warning' }}
                  headerActions={[{ label: 'Preview', variant: 'outlined' }, { label: 'Save Draft', variant: 'contained' }]}
                >
                  {/* Nested Tabs */}
                  <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mt: 1 }}>
                    <Tabs value={0}>
                      <Tab icon={<ArticleIcon />} iconPosition="start" label="Document" />
                      <Tab icon={<AttachmentIcon />} iconPosition="start" label="Attachments" />
                      <Tab icon={<SignatureIcon />} iconPosition="start" label="Signatures" />
                      <Tab icon={<ChecklistIcon />} iconPosition="start" label="Review" />
                    </Tabs>
                  </Box>

                  {/* Document Editor Content */}
                  <Box sx={{ display: 'flex', minHeight: 300, mt: 2 }}>
                    {/* Sidebar (fixed width) */}
                    <Box sx={{ width: 220, borderRight: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Document Outline</Typography>
                        <List dense>
                          {['1. Introduction', '2. Scope of Work', '3. Terms', '4. Pricing'].map((section, i) => (
                            <ListItem
                              key={i}
                              sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: i === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                              }}
                            >
                              <ListItemText primary={section} primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                          ))}
                        </List>
                        <Button size="small" startIcon={<AddIcon />} fullWidth sx={{ mt: 1 }}>
                          Add Section
                        </Button>
                      </Box>
                    </Box>

                    {/* Editor Area (flexible) */}
                    <Box sx={{ flex: 1, p: 3 }}>
                      <Typography variant="h6" gutterBottom>1. Introduction</Typography>
                      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 2, minHeight: 180, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" color="text.secondary">
                          This Agreement is entered into between the City of Example ("Client") and [Vendor Name] ("Contractor")...
                        </Typography>
                        <Box sx={{ mt: 2, p: 2, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">[Rich Text Editor]</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </PageAnatomyPreview>
              </Box>

              {/* Example 2: Document Preview Layout */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 2: Document Preview Layout
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Side-by-side editor and preview layout for real-time document preview.
                </Typography>

                <PageAnatomyPreview
                  title="Letter Template"
                  suiteName="Templates"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Templates' }, { title: 'Letter Template' }]}
                  showToolbar
                  toolbarContent={
                    <Toolbar level="level1" sx={{ px: 0 }}>
                      <Toolbar.Section spacing={1}>
                        <ToggleButtonGroup size="small" value="split" exclusive>
                          <ToggleButton value="editor">Editor</ToggleButton>
                          <ToggleButton value="split">Split</ToggleButton>
                          <ToggleButton value="preview">Preview</ToggleButton>
                        </ToggleButtonGroup>
                      </Toolbar.Section>
                      <Toolbar.Section grow />
                      <Toolbar.Section>
                        <Button variant="contained" size="small">Save Template</Button>
                      </Toolbar.Section>
                    </Toolbar>
                  }
                >
                  {/* Split View */}
                  <Box sx={{ display: 'flex', minHeight: 250, mt: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
                    {/* Editor Panel */}
                    <Box sx={{ flex: 1, p: 2, borderRight: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="subtitle2" gutterBottom>Editor</Typography>
                      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 2, minHeight: 160, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {'Dear {{recipient_name}},\n\nWe are pleased to inform you...'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Preview Panel */}
                    <Box sx={{ flex: 1, p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                      <Typography variant="subtitle2" gutterBottom>Preview</Typography>
                      <Paper elevation={1} sx={{ p: 2, minHeight: 160, bgcolor: 'white' }}>
                        <Typography variant="body2">Dear John Smith,</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>We are pleased to inform you...</Typography>
                      </Paper>
                    </Box>
                  </Box>
                </PageAnatomyPreview>
              </Box>

              {/* Code Pattern */}
              <Box>
                <Typography variant="h5" gutterBottom>Document Layout Pattern</Typography>
                <CodeBlock>{`// Document editor with fixed sidebar
<Box sx={{ display: 'flex', minHeight: '100%' }}>
  {/* Fixed sidebar */}
  <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider' }}>
    <DocumentOutline sections={sections} />
  </Box>

  {/* Flexible editor area */}
  <Box sx={{ flex: 1, p: 3, minWidth: 0 }}>
    <SectionEditor section={selectedSection} />
  </Box>
</Box>`}</CodeBlock>
              </Box>
            </Stack>
          </TabPanel>

          {/* Tab 4: List Views */}
          <TabPanel value={activeTab} index={4}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h2" gutterBottom>
                  List View Layouts
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  List views display collections of items with search, filters, and multiple view modes (table/cards).
                </Typography>
              </Box>

              {/* Example 1: DataGrid List */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 1: DataGrid List View
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Standard list with toolbar, search, filters, and DataGrid table.
                </Typography>

                <PageAnatomyPreview
                  title="Items"
                  suiteName="Inventory"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { path: '#', title: 'Inventory' }, { title: 'Items' }]}
                  headerActions={[{ label: 'Create Item', variant: 'contained' }]}
                  showToolbar
                  showDrawer
                  drawerTitle="Filters"
                  toolbarContent={
                    <Toolbar level="level1" sx={{ px: 0 }}>
                      <Toolbar.Section spacing={1}>
                        <TextField
                          size="small"
                          placeholder="Search items..."
                          sx={{ width: 180 }}
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                            },
                          }}
                        />
                        <ToggleButtonGroup size="small" value="all" exclusive>
                          <ToggleButton value="all" sx={{ px: 1.5 }}>All (8)</ToggleButton>
                          <ToggleButton value="active" sx={{ px: 1.5 }}>Active</ToggleButton>
                        </ToggleButtonGroup>
                      </Toolbar.Section>
                      <Toolbar.Section grow />
                      <Toolbar.Section>
                        <ToggleButtonGroup size="small" value="table" exclusive>
                          <ToggleButton value="table"><ViewListIcon fontSize="small" /></ToggleButton>
                          <ToggleButton value="cards"><ViewModuleIcon fontSize="small" /></ToggleButton>
                        </ToggleButtonGroup>
                      </Toolbar.Section>
                    </Toolbar>
                  }
                >
                  <Box sx={{ mt: 2 }}>
                    <DataGrid
                      rows={tableData.slice(0, 4)}
                      columns={columns}
                      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                      pageSizeOptions={[5, 10]}
                      disableRowSelectionOnClick
                      autoHeight
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } },
                      }}
                    />
                  </Box>
                </PageAnatomyPreview>
              </Box>

              {/* Example 2: Card Grid List */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 2: Responsive Card Grid
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Card-based list using CSS Grid with responsive columns: 1 → 2 → 3 → 4 columns.
                </Typography>

                <PageAnatomyPreview
                  title="Projects"
                  suiteName="Budget & Planning"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { title: 'Projects' }]}
                  headerActions={[{ label: 'New Project', variant: 'contained' }]}
                  showToolbar
                >
                  {/* Card Grid */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>6 projects</Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: 2,
                      }}
                    >
                      {[
                        { title: 'Road Maintenance', status: 'In Progress', dept: 'Public Works', budget: '$450K' },
                        { title: 'Park Renovation', status: 'Planning', dept: 'Parks & Rec', budget: '$280K' },
                        { title: 'IT Upgrade', status: 'Review', dept: 'IT Services', budget: '$890K' },
                        { title: 'Fleet Procurement', status: 'Draft', dept: 'Fleet Mgmt', budget: '$1.2M' },
                        { title: 'Water Expansion', status: 'In Progress', dept: 'Utilities', budget: '$3.5M' },
                        { title: 'Emergency Equipment', status: 'Approved', dept: 'Fire Dept', budget: '$560K' },
                      ].map((project, i) => (
                        <Card
                          key={i}
                          elevation={0}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) },
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight={600}>{project.title}</Typography>
                              <Chip
                                label={project.status}
                                size="small"
                                color={project.status === 'In Progress' ? 'warning' : project.status === 'Approved' ? 'success' : 'default'}
                              />
                            </Stack>
                            <Typography variant="caption" color="text.secondary" display="block">{project.dept}</Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>{project.budget}</Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </PageAnatomyPreview>
              </Box>

              {/* Example 3: Searchable List with Selection */}
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  Example 3: Selectable List with Bulk Actions
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  List with checkbox selection and bulk action bar that appears when items are selected.
                </Typography>

                <PageAnatomyPreview
                  title="Documents"
                  suiteName="Document Management"
                  activeMenuItem="items"
                  breadcrumbs={[{ path: '#', title: 'Home' }, { title: 'Documents' }]}
                  showToolbar
                >
                  <Box sx={{ mt: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
                    {/* Selection Bar (shown when items selected) */}
                    <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" fontWeight={500}>3 items selected</Typography>
                      <Box sx={{ flex: 1 }} />
                      <Button size="small" variant="outlined">Archive</Button>
                      <Button size="small" variant="outlined" color="error">Delete</Button>
                      <Button size="small">Clear</Button>
                    </Box>

                    {/* List Items */}
                    <List sx={{ py: 0 }}>
                      {[
                        { name: 'Budget Report Q1', type: 'Document', date: 'Jan 15', selected: true },
                        { name: 'Vendor Contract', type: 'Contract', date: 'Jan 14', selected: true },
                        { name: 'Meeting Notes', type: 'Document', date: 'Jan 12', selected: true },
                        { name: 'Expense Summary', type: 'Report', date: 'Jan 10', selected: false },
                      ].map((item, i) => (
                        <ListItem
                          key={i}
                          sx={{
                            borderBottom: i < 3 ? `1px solid ${theme.palette.divider}` : 'none',
                            bgcolor: item.selected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Checkbox checked={item.selected} size="small" />
                          </ListItemIcon>
                          <ListItemText primary={item.name} secondary={item.type} />
                          <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </PageAnatomyPreview>
              </Box>

              {/* Code Pattern */}
              <Box>
                <Typography variant="h5" gutterBottom>List View Pattern</Typography>
                <CodeBlock>{`// Responsive card grid using CSS Grid
<Box sx={{
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',           // 1 column on mobile
    sm: 'repeat(2, 1fr)', // 2 columns on tablet
    md: 'repeat(3, 1fr)', // 3 columns on desktop
    lg: 'repeat(4, 1fr)', // 4 columns on large screens
  },
  gap: 3,
}}>
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</Box>`}</CodeBlock>
              </Box>
            </Stack>
          </TabPanel>
        </Container>
      </Box>
    </DocsLayout>
  );
}
