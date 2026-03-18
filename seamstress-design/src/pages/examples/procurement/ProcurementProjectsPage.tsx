import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import BusinessIcon from '@mui/icons-material/Business';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WarningIcon from '@mui/icons-material/Warning';
import LaunchIcon from '@mui/icons-material/Launch';
import TourIcon from '@mui/icons-material/Tour';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BookIcon from '@mui/icons-material/Book';
import Drawer from '../../../components/Drawer/Drawer';
import { Toolbar as CustomToolbar } from '../../../components/Toolbar';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

interface Solicitation {
  id: string;
  title: string;
  status: 'draft' | 'evaluation' | 'open' | 'closed' | 'awarded' | 'cancelled';
  process: string;
  department: string;
  kickoffDate?: string;
  releaseDate?: string;
  proposalsDue?: string;
  createdAt: string;
  hasComments: boolean;
}

const ProcurementProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [projects, setProjects] = useState<Solicitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchLineItems, setSearchLineItems] = useState(false);
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all-projects');
  const [drawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const mockProjects: Solicitation[] = [
        {
          id: '1',
          title: 'Untitled',
          status: 'evaluation',
          process: 'EVAL',
          department: 'Procurement',
          kickoffDate: '5/09/05 11:00pm',
          releaseDate: 'TBD',
          proposalsDue: 'TBD',
          createdAt: '5 months ago',
          hasComments: false,
        },
        {
          id: '2',
          title: 'Agricultural Supplies',
          status: 'open',
          process: 'BID',
          department: 'Parks Department',
          kickoffDate: '1/15/24 9:00am',
          releaseDate: '2/01/24',
          proposalsDue: '3/15/24 5:00pm',
          createdAt: '3 months ago',
          hasComments: true,
        },
        {
          id: '3',
          title: 'Office Furniture Procurement',
          status: 'draft',
          process: 'RFP',
          department: 'General Services',
          kickoffDate: 'TBD',
          releaseDate: 'TBD',
          proposalsDue: 'TBD',
          createdAt: '2 weeks ago',
          hasComments: false,
        },
        {
          id: '4',
          title: 'IT Infrastructure Upgrade',
          status: 'awarded',
          process: 'RFP',
          department: 'Information Technology',
          kickoffDate: '8/01/24 10:00am',
          releaseDate: '8/15/24',
          proposalsDue: '9/30/24 5:00pm',
          createdAt: '6 months ago',
          hasComments: true,
        },
        {
          id: '5',
          title: 'Fleet Maintenance Services',
          status: 'open',
          process: 'RFQ',
          department: 'Public Works',
          kickoffDate: '10/01/24 9:00am',
          releaseDate: '10/15/24',
          proposalsDue: '11/20/24 5:00pm',
          createdAt: '1 month ago',
          hasComments: false,
        },
        {
          id: '6',
          title: 'Janitorial Services Contract',
          status: 'closed',
          process: 'BID',
          department: 'Facilities Management',
          kickoffDate: '3/01/24 8:00am',
          releaseDate: '3/10/24',
          proposalsDue: '4/15/24 3:00pm',
          createdAt: '7 months ago',
          hasComments: true,
        },
        {
          id: '7',
          title: 'Public Safety Equipment',
          status: 'evaluation',
          process: 'BID',
          department: 'Police Department',
          kickoffDate: '9/15/24 1:00pm',
          releaseDate: '9/20/24',
          proposalsDue: '10/25/24 5:00pm',
          createdAt: '2 months ago',
          hasComments: true,
        },
        {
          id: '8',
          title: 'Legal Services Retainer',
          status: 'draft',
          process: 'RFP',
          department: 'City Attorney',
          kickoffDate: 'TBD',
          releaseDate: 'TBD',
          proposalsDue: 'TBD',
          createdAt: '1 week ago',
          hasComments: false,
        },
        {
          id: '9',
          title: 'Road Resurfacing Project',
          status: 'awarded',
          process: 'BID',
          department: 'Public Works',
          kickoffDate: '5/01/24 7:00am',
          releaseDate: '5/10/24',
          proposalsDue: '6/20/24 2:00pm',
          createdAt: '8 months ago',
          hasComments: true,
        },
        {
          id: '10',
          title: 'Parks and Recreation Equipment',
          status: 'open',
          process: 'RFQ',
          department: 'Parks Department',
          kickoffDate: '10/10/24 10:00am',
          releaseDate: '10/20/24',
          proposalsDue: '11/30/24 5:00pm',
          createdAt: '3 weeks ago',
          hasComments: false,
        },
        {
          id: '11',
          title: 'Emergency Response Vehicles',
          status: 'cancelled',
          process: 'BID',
          department: 'Fire Department',
          kickoffDate: '7/01/24 9:00am',
          releaseDate: '7/15/24',
          proposalsDue: '8/30/24 5:00pm',
          createdAt: '4 months ago',
          hasComments: true,
        },
        {
          id: '12',
          title: 'Environmental Consulting Services',
          status: 'evaluation',
          process: 'RFP',
          department: 'Environmental Services',
          kickoffDate: '9/01/24 11:00am',
          releaseDate: '9/10/24',
          proposalsDue: '10/15/24 4:00pm',
          createdAt: '2 months ago',
          hasComments: false,
        },
        {
          id: '13',
          title: 'Water Treatment Chemicals',
          status: 'open',
          process: 'BID',
          department: 'Water Utilities',
          kickoffDate: '10/05/24 8:00am',
          releaseDate: '10/12/24',
          proposalsDue: '11/25/24 3:00pm',
          createdAt: '1 month ago',
          hasComments: true,
        },
        {
          id: '14',
          title: 'HR Management System',
          status: 'draft',
          process: 'RFP',
          department: 'Human Resources',
          kickoffDate: 'TBD',
          releaseDate: 'TBD',
          proposalsDue: 'TBD',
          createdAt: '5 days ago',
          hasComments: false,
        },
        {
          id: '15',
          title: 'Building Security Services',
          status: 'awarded',
          process: 'RFP',
          department: 'General Services',
          kickoffDate: '6/01/24 9:00am',
          releaseDate: '6/10/24',
          proposalsDue: '7/20/24 5:00pm',
          createdAt: '6 months ago',
          hasComments: true,
        },
        {
          id: '16',
          title: 'Telecommunications Infrastructure',
          status: 'closed',
          process: 'RFP',
          department: 'Information Technology',
          kickoffDate: '2/01/24 10:00am',
          releaseDate: '2/15/24',
          proposalsDue: '3/30/24 5:00pm',
          createdAt: '9 months ago',
          hasComments: false,
        },
        {
          id: '17',
          title: 'Medical Supplies and Equipment',
          status: 'open',
          process: 'BID',
          department: 'Fire Department',
          kickoffDate: '10/15/24 9:00am',
          releaseDate: '10/22/24',
          proposalsDue: '12/01/24 4:00pm',
          createdAt: '2 weeks ago',
          hasComments: true,
        },
        {
          id: '18',
          title: 'Waste Management Services',
          status: 'evaluation',
          process: 'RFP',
          department: 'Environmental Services',
          kickoffDate: '8/20/24 8:00am',
          releaseDate: '9/01/24',
          proposalsDue: '10/10/24 5:00pm',
          createdAt: '3 months ago',
          hasComments: true,
        },
        {
          id: '19',
          title: 'Community Center Renovations',
          status: 'draft',
          process: 'BID',
          department: 'Parks Department',
          kickoffDate: 'TBD',
          releaseDate: 'TBD',
          proposalsDue: 'TBD',
          createdAt: '3 days ago',
          hasComments: false,
        },
        {
          id: '20',
          title: 'Financial Audit Services',
          status: 'awarded',
          process: 'RFP',
          department: 'Finance',
          kickoffDate: '4/01/24 10:00am',
          releaseDate: '4/10/24',
          proposalsDue: '5/15/24 5:00pm',
          createdAt: '9 months ago',
          hasComments: true,
        },
      ];

      setProjects(mockProjects);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      evaluation: { color: 'primary' as const, label: 'EVALUATION', icon: <StarIcon fontSize="small" /> },
      open: { color: 'success' as const, label: 'OPEN', icon: null },
      closed: { color: 'default' as const, label: 'CLOSED', icon: null },
      draft: { color: 'default' as const, label: 'DRAFT', icon: null },
      awarded: { color: 'indigo' as const, label: 'AWARDED', icon: null },
      cancelled: { color: 'error' as const, label: 'CANCELLED', icon: null },
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  const handleProjectClick = (project: Solicitation) => {
    // Navigate to the detail page
    if (project.title === 'Agricultural Supplies' || project.id === '2') {
      navigate('/procurement/projects/agricultural-supplies');
    } else {
      navigate(`/procurement/projects/${project.id}`);
    }
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setSearchLineItems(false);
    setSortBy('createdDate');
    setSortOrder('desc');
    setStatusFilter('all');
  };

  // Filter sidebar items
  const filterItems = [
    { id: 'my-projects', label: 'My Projects', icon: <EditIcon /> },
    { id: 'my-reviews', label: 'My Reviews', icon: <SearchOutlinedIcon /> },
    { id: 'my-comments', label: 'My Comments', icon: <CommentIcon /> },
    { id: 'my-evaluations', label: 'My Evaluations', icon: <StarIcon /> },
    { id: 'following', label: 'Following', icon: <RssFeedIcon /> },
    { id: 'departmental', label: 'Departmental Projects', icon: <BusinessIcon /> },
    { id: 'all-projects', label: 'All Projects', icon: <UnfoldMoreIcon /> },
  ];

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchValue ||
      project.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.department.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Projects</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', mx: 3, bgcolor: 'background.default' }}>
        {/* Left Sidebar - Drawer */}
        <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Find Projects"
        subtitle="Filter and organize projects"
        width={320}
        inPage={true}
        hideFooter={true}
      >
        {/* Agency Logo Card */}
        <Box sx={{ mb: 2 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BusinessIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  CITY
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Find Projects Section */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List disablePadding>
            {filterItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedFilter === item.id}
                  onClick={() => setSelectedFilter(item.id)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
            <Link href="#" underline="hover" color="primary" variant="body2">
              Add Filter
            </Link>
            <Box sx={{ flex: 1 }} />
            <Link href="#" underline="hover" color="primary" variant="body2">
              Save Filter
            </Link>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto' }}>
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate('/procurement/projects/new')}
            >
              New Project
            </Button>
            <Button variant="outlined" fullWidth startIcon={<LibraryBooksIcon />}>
              Browse Library
            </Button>
            <Button variant="outlined" fullWidth endIcon={<LaunchIcon />}>
              Go To Public Portal
            </Button>
            <Button variant="outlined" fullWidth startIcon={<WarningIcon />}>
              Emergency Portal
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
        {/* Search and Filters Toolbar */}
        <CustomToolbar sx={{ px: 0, pt: 0 }} level="level1">
          <CustomToolbar.Section grow spacing={2}>
            {/* Menu Button - shows when drawer is closed */}
            {!drawerOpen && (
              <IconButton
                edge="start"
                onClick={() => setDrawerOpen(true)}
                aria-label="open drawer"
              >
                <BookIcon />
              </IconButton>
            )}

            {/* Search Input */}
            <TextField
              size="medium"
              placeholder="Search by title, project ID or contract ID"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ width: 350 }}
            />

            {/* Search Line Items Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchLineItems}
                  onChange={(e) => setSearchLineItems(e.target.checked)}
                  size="medium"
                />
              }
              label={<Typography variant="body2">Search line items</Typography>}
            />

            {/* Sort By Dropdown */}
            <Select
              size="medium"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 150 }}
              startAdornment={
                <InputAdornment position="start">
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Sort By
                  </Typography>
                </InputAdornment>
              }
            >
              <MenuItem value="createdDate">Created Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="department">Department</MenuItem>
            </Select>

            {/* Sort Order Toggle */}
            <IconButton size="small" onClick={handleSortOrderToggle}>
              <SwapVertIcon />
            </IconButton>

            {/* Status Filter */}
            <Select
              size="medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="evaluation">Evaluation</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="awarded">Awarded</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>

            {/* Reset Button */}
            <Button
              variant="outlined"
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
            >
              Reset All Filters
            </Button>
          </CustomToolbar.Section>

          <CustomToolbar.Section spacing={1}>
            {/* Tour Dashboard Link */}
            <Link
              href="#"
              underline="hover"
              color="primary"
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <TourIcon fontSize="small" />
              Tour Dashboard
            </Link>

            {/* Export Button */}
            <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />}>
              Export
            </Button>
          </CustomToolbar.Section>
        </CustomToolbar>

        {/* Project Cards List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {filteredProjects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredProjects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                return (
                  <Card
                    key={project.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover, &:focus': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      '&:focus': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: 2,
                      },
                    }}
                    onClick={() => handleProjectClick(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleProjectClick(project);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${project.title}, ${project.status} status, ${project.department} department. Press Enter to view details.`}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={3}>
                        {/* Left Section */}
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                            <Chip
                              icon={statusConfig.icon || undefined}
                              label={statusConfig.label}
                              color={statusConfig.color}
                              variant="strong"
                              size="small"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: 'italic' }}
                            >
                              {project.createdAt}
                            </Typography>
                          </Stack>
                          <Typography variant="h6" gutterBottom>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Process: {project.process}
                          </Typography>
                          {project.hasComments && (
                            <Box sx={{ mt: 1 }}>
                              <IconButton size="small">
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        {/* Right Section - Metadata */}
                        <Box sx={{ minWidth: 250 }}>
                          <Stack spacing={0.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <BusinessIcon fontSize="small" color="action" />
                              <Typography variant="body2">{project.department}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Kickoff:</strong> {project.kickoffDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Release Date:</strong> {project.releaseDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Proposals Due:</strong> {project.proposalsDue}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default ProcurementProjectsPage;
