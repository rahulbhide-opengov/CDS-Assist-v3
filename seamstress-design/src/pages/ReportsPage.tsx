import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Paper,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Schedule as ScheduleIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FileDownload as DownloadIcon,
  InsertChart as ChartIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { generateFolders, generateReports, getReportTypeInfo, getReportCategoryLabel } from '../data/reportsMockData';
import type { Folder, Report, ReportCategory } from '../types/reports';
import Drawer from '../components/Drawer/Drawer';
import Toolbar from '../components/Toolbar/Toolbar';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

export const ReportsPage: React.FC = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; reportId: string } | null>(null);

  // Generate mock data
  const folders: Folder[] = useMemo(() => generateFolders(10), []);
  const allReports: Report[] = useMemo(() => generateReports(25), []);

  // Filter reports based on selected category, folder, and search
  const filteredReports = useMemo(() => {
    let reports = allReports;

    // Filter by category
    if (selectedCategory !== 'all') {
      reports = reports.filter((r) => r.category === selectedCategory);
    }

    // Filter by folder
    if (selectedFolder === 'starred') {
      reports = reports.filter((r) => r.isStarred);
    } else if (selectedFolder === 'recent') {
      reports = reports.filter((r) => r.lastViewedAt);
      reports.sort((a, b) => {
        const dateA = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
        const dateB = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    // Filter by search query
    if (searchQuery) {
      reports = reports.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return reports;
  }, [allReports, selectedCategory, selectedFolder, searchQuery]);

  const handleCategoryClick = (category: ReportCategory | 'all') => {
    setSelectedCategory(category);
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleStarToggle = (reportId: string) => {
    // In a real app, this would update the backend
    console.log('Toggle star for report:', reportId);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setMenuAnchor({ element: event.currentTarget, reportId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action, 'for report:', menuAnchor?.reportId);
    handleMenuClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Report type CTAs
  const reportTypeCTAs = [
    {
      id: 'standard',
      title: 'Standard Report',
      description: 'Create a report from pre-built templates',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
    },
    {
      id: 'custom',
      title: 'Custom Dashboard',
      description: 'Build a personalized analytics dashboard',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      color: 'secondary.main',
    },
    {
      id: 'analytics',
      title: 'Analytics Report',
      description: 'Advanced data analysis and insights',
      icon: <ChartIcon sx={{ fontSize: 40 }} />,
      color: 'success.main',
    },
    {
      id: 'scheduled',
      title: 'Scheduled Report',
      description: 'Automate report generation and distribution',
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      color: 'warning.main',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button key="create" variant="contained" size="medium" startIcon={<AddIcon />}>
              Create Report
            </Button>,
          ]}
        >
          <PageHeaderComposable.Title>Reports & Dashboards</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Create, view, and share reports and analytics dashboards
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area with Drawer */}
      <Box sx={{ flex: 1, display: 'flex', px: 3, overflow: 'hidden' }}>
        {/* In-Page Drawer (Left Side) */}
        <Box sx={{ mt: 2, mr: filtersOpen ? 2 : 0 }}>
          <Drawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            title="Filters"
            subtitle="Filter by report type and folder"
            hideFooter
            inPage
            width={280}
          >
            {/* Report Types */}
            <Typography variant="h4" sx={{ mb: 1 }}>
              Report Types
            </Typography>
            <List disablePadding sx={{ mb: 3 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'all'}
                  onClick={() => handleCategoryClick('all')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Types" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'financial-statements'}
                  onClick={() => handleCategoryClick('financial-statements')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Financial Statements" />
                  <Chip label={allReports.filter((r) => r.category === 'financial-statements').length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'inspections'}
                  onClick={() => handleCategoryClick('inspections')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lists of Inspections" />
                  <Chip label={allReports.filter((r) => r.category === 'inspections').length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'payroll'}
                  onClick={() => handleCategoryClick('payroll')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Payroll Reports" />
                  <Chip label={allReports.filter((r) => r.category === 'payroll').length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'asset-management-audits'}
                  onClick={() => handleCategoryClick('asset-management-audits')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Asset Management Audits" />
                  <Chip label={allReports.filter((r) => r.category === 'asset-management-audits').length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'checks'}
                  onClick={() => handleCategoryClick('checks')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Checks" />
                  <Chip label={allReports.filter((r) => r.category === 'checks').length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === 'other'}
                  onClick={() => handleCategoryClick('other')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Other Reports" />
                  <Chip label={allReports.filter((r) => r.category === 'other').length} size="small" />
                </ListItemButton>
              </ListItem>
            </List>

            <Divider sx={{ mb: 2 }} />

            {/* Folders */}
            <Typography variant="h4" sx={{ px: 2, display: 'block', mb: 1 }}>
              Folders
            </Typography>
            <List disablePadding>
              {/* Special folders */}
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFolder === 'all'}
                  onClick={() => handleFolderClick('all')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Reports" />
                  <Chip label={allReports.length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFolder === 'starred'}
                  onClick={() => handleFolderClick('starred')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                  <Chip label={allReports.filter((r) => r.isStarred).length} size="small" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFolder === 'recent'}
                  onClick={() => handleFolderClick('recent')}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Recent" />
                  <Chip label={allReports.filter((r) => r.lastViewedAt).length} size="small" />
                </ListItemButton>
              </ListItem>

              <Divider sx={{ my: 2 }} />

              {/* Custom folders */}
              {folders.slice(5).map((folder) => (
                <ListItem key={folder.id} disablePadding>
                  <ListItemButton
                    selected={selectedFolder === folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FolderOpenIcon />
                    </ListItemIcon>
                    <ListItemText primary={folder.name} />
                    <Chip label={folder.reportCount} size="small" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Box>

        {/* Toolbar + Main Content */}
        <Box sx={{ flex: 1, mt: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <Toolbar level="level1" sx={{ px: 0 }}>
            <Toolbar.Section spacing={1}>
              <Button
                variant={filtersOpen ? 'contained' : 'outlined'}
                size="medium"
                startIcon={<FilterListIcon />}
                onClick={() => setFiltersOpen(!filtersOpen)}
                color={filtersOpen ? 'primary' : 'inherit'}
              >
                Filters
              </Button>
              <TextField
                size="medium"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 400 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="medium"
                          onClick={handleClearSearch}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Toolbar.Section>

            <Toolbar.Section grow />

            <Toolbar.Section>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="medium"
              >
                <ToggleButton value="card" aria-label="card view">
                  <ViewModuleIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="table" aria-label="table view">
                  <ViewListIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Toolbar.Section>
          </Toolbar>

          {/* Main Content */}
          <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              {reportTypeCTAs.map((cta) => (
                <Card
                  key={cta.id}
                  sx={{
                    cursor: 'pointer',
                    transition: theme.transitions.create(['transform', 'border-color', 'box-shadow'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: cta.color,
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3, px: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                        color: cta.color,
                      }}
                    >
                      {cta.icon}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                      {cta.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cta.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Reports List Header */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4">
                {selectedFolder === 'all'
                  ? 'All Reports'
                  : selectedFolder === 'starred'
                    ? 'Starred Reports'
                    : selectedFolder === 'recent'
                      ? 'Recent Reports'
                      : 'Reports'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {viewMode === 'card' ? (
              <Stack spacing={2}>
                {filteredReports.map((report) => {
                  const typeInfo = getReportTypeInfo(report.type);
                  return (
                    <Card
                      key={report.id}
                      sx={{
                        cursor: 'pointer',
                        transition: theme.transitions.create(['box-shadow', 'border-color'], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        '&:hover': {
                          boxShadow: theme.shadows[1],
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                          {/* Report Icon */}
                          <Avatar
                            sx={{
                              bgcolor: 'action.hover',
                              color: typeInfo.color,
                              width: 56,
                              height: 56,
                            }}
                          >
                            <AssessmentIcon />
                          </Avatar>

                          {/* Report Info */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {report.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {report.description}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStarToggle(report.id);
                                  }}
                                  sx={{
                                    color: report.isStarred ? 'warning.main' : 'action.active',
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                    },
                                  }}
                                >
                                  {report.isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMenuOpen(e, report.id);
                                  }}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                    },
                                  }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                              <Chip
                                label={typeInfo.label}
                                size="small"
                                variant="strong"
                                color={typeInfo.color.split('.')[0] as any}
                              />
                              <Chip label={report.status} size="small" variant="outlined" />
                              {report.tags?.slice(0, 2).map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                              ))}
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                Created by {report.createdBy}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(report.updatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {report.viewCount} views
                              </Typography>
                              {report.shareCount > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {report.shareCount} shares
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="40"></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Report Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Last Updated</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Views</TableCell>
                      <TableCell width="100" align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const typeInfo = getReportTypeInfo(report.type);
                      return (
                        <TableRow
                          key={report.id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleStarToggle(report.id)}
                              sx={{ color: report.isStarred ? 'warning.main' : 'text.secondary' }}
                            >
                              {report.isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {report.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={typeInfo.label}
                              size="small"
                              variant="strong"
                              color={typeInfo.color.split('.')[0] as any}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={report.status} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{report.createdBy}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {new Date(report.updatedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{report.viewCount}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, report.id)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {filteredReports.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No reports found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {searchQuery ? 'Try adjusting your search' : 'Create your first report to get started'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Report
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('share')}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('download')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReportsPage;
