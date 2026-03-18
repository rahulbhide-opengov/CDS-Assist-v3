/**
 * ProjectsListPage Component
 *
 * Main list view for procurement projects with search, filtering, and card-based layout
 *
 * Accessibility features:
 * - Proper heading hierarchy (h1 for page title, h2 for sections)
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Screen reader announcements for filter changes
 * - Focus management
 *
 * Mobile responsiveness:
 * - Responsive grid layout
 * - Collapsible filter drawer
 * - Touch-friendly button sizes
 * - Responsive search field
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import { Toolbar } from '../../../components/Toolbar';

import Drawer from '../../../components/Drawer/Drawer';
import { ProjectCard } from '../../../components/procurement/project/ProjectCard';
import { ProjectFilters } from '../../../components/procurement/project/ProjectFilters';
import type { ProjectFiltersState } from '../../../types/procurement';
import { mockProjects, filterProjects } from '../../../data/procurementProjectMockData';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

/**
 * Projects List Page with search, filters, and card layout
 */
const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsAnnouncerRef = useRef<HTMLDivElement>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectFiltersState>({
    status: [],
    departments: [],
    templates: [],
  });

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return filterProjects(mockProjects, {
      status: filters.status,
      departments: filters.departments,
      templates: filters.templates,
      searchQuery,
    });
  }, [filters, searchQuery]);

  // Handle actions
  const handleNewProject = () => {
    navigate('/procurement/projects/new');
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting projects...');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.departments.length > 0 ||
    filters.templates.length > 0;

  const activeFilterCount =
    filters.status.length +
    filters.departments.length +
    filters.templates.length;

  // Announce results count changes to screen readers
  const announceResults = useCallback((count: number) => {
    if (resultsAnnouncerRef.current) {
      resultsAnnouncerRef.current.textContent = `${count} ${count === 1 ? 'project' : 'projects'} found`;
    }
  }, []);

  // Update announcer when results change
  useEffect(() => {
    announceResults(filteredProjects.length);
  }, [filteredProjects.length, announceResults]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Focus search on Ctrl/Cmd + K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  }, []);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader announcements */}
      <Box
        ref={resultsAnnouncerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />

      {/* Page Header */}
      <Box component="header" role="banner">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>Projects</PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content Area with Drawer */}
      <Box
        component="main"
        role="main"
        id="main-content"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          px: { xs: 2, sm: 3 },
          overflow: 'hidden',
        }}
      >
        {/* In-Page Drawer (Left Side) - Hidden on mobile when closed */}
        <Box
          sx={{
            mt: 1,
            mr: filtersOpen ? 2 : 0,
            display: { xs: filtersOpen ? 'block' : 'none', md: 'block' },
          }}
        >
          <Drawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            title="Filters"
            subtitle="Filter projects by status, department, and template"
            hideFooter
            inPage={!isMobile}
            width={isMobile ? '100%' : 280}
            anchor={isMobile ? 'left' : 'right'}
            aria-label="Project filters"
          >
            <ProjectFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </Drawer>
        </Box>

        {/* Toolbar + Main Content */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <Toolbar
            level="level1"
            sx={{
              px: 0,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 },
            }}
            role="toolbar"
            aria-label="Project list actions"
          >
            <Toolbar.Section spacing={1} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant={filtersOpen ? 'contained' : 'outlined'}
                size="medium"
                startIcon={<FilterListIcon aria-hidden="true" />}
                onClick={() => setFiltersOpen(!filtersOpen)}
                color={filtersOpen ? 'primary' : 'inherit'}
                aria-expanded={filtersOpen}
                aria-controls="filter-drawer"
                aria-label={`${filtersOpen ? 'Hide' : 'Show'} filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
                sx={{ minWidth: 44 }}
              >
                {!isMobile && 'Filters'}
                {activeFilterCount > 0 && ` (${activeFilterCount})`}
              </Button>
              <TextField
                inputRef={searchInputRef}
                size="medium"
                placeholder="Search by title, project ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: 300 },
                  flex: { xs: 1, sm: 'none' },
                }}
                inputProps={{
                  'aria-label': 'Search projects',
                  'aria-describedby': 'search-hint',
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" aria-hidden="true" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="medium"
                          onClick={handleClearSearch}
                          edge="end"
                          aria-label="Clear search"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography
                id="search-hint"
                sx={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                Press Ctrl+K to focus search
              </Typography>
            </Toolbar.Section>

            <Toolbar.Section grow sx={{ display: { xs: 'none', sm: 'flex' } }} />

            <Toolbar.Section sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<FileDownloadIcon aria-hidden="true" />}
                onClick={handleExport}
                aria-label="Export projects to file"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                size="medium"
                startIcon={<AddIcon aria-hidden="true" />}
                onClick={handleNewProject}
                aria-label="Create new project"
              >
                {isMobile ? 'New' : 'New Project'}
              </Button>
            </Toolbar.Section>
          </Toolbar>

          {/* Main Content */}
          <Box
            component="section"
            aria-labelledby="projects-results-heading"
            sx={{ flex: 1, overflow: 'auto', py: 2 }}
          >
            <Stack spacing={2} sx={{ mb: 3 }}>
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                  role="list"
                  aria-label="Active filters"
                >
                  {filters.status.map(status => (
                    <Chip
                      key={status}
                      label={status}
                      size="small"
                      onDelete={() => {
                        setFilters({
                          ...filters,
                          status: filters.status.filter(s => s !== status),
                        });
                      }}
                      deleteIcon={<ClearIcon aria-hidden="true" />}
                      aria-label={`Remove ${status} filter`}
                      sx={{ '& .MuiChip-deleteIcon': { minWidth: 24, minHeight: 24 } }}
                    />
                  ))}
                  {filters.departments.map(dept => (
                    <Chip
                      key={dept}
                      label={dept}
                      size="small"
                      onDelete={() => {
                        setFilters({
                          ...filters,
                          departments: filters.departments.filter(d => d !== dept),
                        });
                      }}
                      deleteIcon={<ClearIcon aria-hidden="true" />}
                      aria-label={`Remove ${dept} filter`}
                      sx={{ '& .MuiChip-deleteIcon': { minWidth: 24, minHeight: 24 } }}
                    />
                  ))}
                  {filters.templates.map(template => (
                    <Chip
                      key={template}
                      label={template}
                      size="small"
                      onDelete={() => {
                        setFilters({
                          ...filters,
                          templates: filters.templates.filter(t => t !== template),
                        });
                      }}
                      deleteIcon={<ClearIcon aria-hidden="true" />}
                      aria-label={`Remove ${template} filter`}
                      sx={{ '& .MuiChip-deleteIcon': { minWidth: 24, minHeight: 24 } }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: { xs: 4, sm: 8 },
                  px: 2,
                  textAlign: 'center',
                }}
                role="status"
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  component="h3"
                >
                  No projects found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchQuery || hasActiveFilters
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first project'}
                </Typography>
                {!searchQuery && !hasActiveFilters && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon aria-hidden="true" />}
                    onClick={handleNewProject}
                    sx={{ minWidth: 120 }}
                  >
                    New Project
                  </Button>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: filtersOpen ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                    lg: filtersOpen ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                  },
                  gap: { xs: 2, sm: 3 },
                }}
                role="list"
                aria-label="Projects list"
              >
                {filteredProjects.map(project => (
                  <Box key={project.projectId} role="listitem">
                    <ProjectCard project={project} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsListPage;
