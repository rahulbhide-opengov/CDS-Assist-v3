/**
 * Template Manager
 * Main interface for browsing, creating, editing, and deleting document templates
 *
 * Features:
 * - Template list with search and filtering
 * - Create new templates
 * - Edit/delete/duplicate templates
 * - Usage statistics
 * - Template type filtering
 *
 * Accessibility features:
 * - Proper heading hierarchy
 * - ARIA labels for interactive elements
 * - Keyboard navigation for cards and menus
 * - Focus management for dialogs
 * - Screen reader announcements
 *
 * Mobile responsiveness:
 * - Responsive card grid
 * - Touch-friendly buttons
 * - Full-width search on mobile
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  alpha,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTemplates } from '../../../hooks/procurement/useTemplates';
import type { Template, TemplateType } from '../../../types/procurement';

interface TemplateManagerProps {
  onEditTemplate?: (templateId: string) => void;
  onCreateTemplate?: () => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  onEditTemplate,
  onCreateTemplate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsAnnouncerRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const {
    templates,
    isLoading,
    error,
    deleteTemplate,
    duplicateTemplate,
    searchTemplates,
  } = useTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TemplateType | 'All'>('All');
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; template: Template } | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

  // Announce results to screen readers
  const announceResults = useCallback((count: number, type: string) => {
    if (resultsAnnouncerRef.current) {
      const typeText = type === 'All' ? '' : `${type} `;
      resultsAnnouncerRef.current.textContent = `${count} ${typeText}${count === 1 ? 'template' : 'templates'} found`;
    }
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      );
    }

    // Sort by usage count (most used first)
    return filtered.sort((a, b) => b.usageCount - a.usageCount);
  }, [templates, selectedType, searchQuery]);

  // Announce when results change
  useEffect(() => {
    if (!isLoading) {
      announceResults(filteredTemplates.length, selectedType);
    }
  }, [filteredTemplates.length, selectedType, isLoading, announceResults]);

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, template: Template) => {
    event.stopPropagation();
    setMenuAnchor({ element: event.currentTarget, template });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Handle edit
  const handleEdit = (template: Template) => {
    handleMenuClose();
    onEditTemplate?.(template.templateId);
  };

  // Handle duplicate
  const handleDuplicate = async (template: Template) => {
    handleMenuClose();
    const newName = prompt('Enter name for the duplicated template:', `${template.name} (Copy)`);
    if (newName) {
      await duplicateTemplate(template.templateId, newName);
    }
  };

  // Handle delete
  const handleDeleteClick = (template: Template) => {
    handleMenuClose();
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete.templateId);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  // Type badge colors - derived from theme palette
  const getTypeColor = (type: TemplateType): string => {
    const colors: Record<TemplateType, string> = {
      Solicitation: theme.palette.info.main,
      Contract: theme.palette.success.main,
      Intake: theme.palette.warning.main,
    };
    return colors[type];
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
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

      {/* Header */}
      <Box
        component="header"
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom component="h1">
            Document Templates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage reusable document templates for projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon aria-hidden="true" />}
          onClick={onCreateTemplate}
          size="large"
          sx={{
            textTransform: 'none',
            minHeight: 44,
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
          }}
          aria-label="Create new template"
        >
          Create Template
        </Button>
      </Box>

      {/* Error message */}
      {error && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Search and filters */}
      <Box component="section" sx={{ mb: 3 }} aria-label="Search and filter templates">
        <TextField
          inputRef={searchInputRef}
          fullWidth
          placeholder="Search templates by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{
            'aria-label': 'Search templates',
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon aria-hidden="true" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        <Tabs
          value={selectedType}
          onChange={(_, newValue) => setSelectedType(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
          aria-label="Filter templates by type"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
        >
          <Tab label="All Templates" value="All" id="template-tab-all" aria-controls="template-panel" />
          <Tab label="Solicitation" value="Solicitation" id="template-tab-solicitation" aria-controls="template-panel" />
          <Tab label="Contract" value="Contract" id="template-tab-contract" aria-controls="template-panel" />
          <Tab label="Intake" value="Intake" id="template-tab-intake" aria-controls="template-panel" />
        </Tabs>
      </Box>

      {/* Template cards */}
      <Box
        id="template-panel"
        role="region"
        aria-label={`${selectedType === 'All' ? 'All' : selectedType} templates`}
      >
        {isLoading ? (
          <Grid container spacing={3} role="list" aria-label="Loading templates">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i} role="listitem">
                <Card aria-hidden="true">
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                    <Skeleton variant="text" width="80%" sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredTemplates.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, sm: 8 },
              px: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
            }}
            role="status"
          >
            <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} aria-hidden="true" />
            <Typography variant="h6" color="text.secondary" gutterBottom component="h2">
              {searchQuery
                ? 'No templates found'
                : selectedType === 'All'
                ? 'No templates yet'
                : `No ${selectedType} templates`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first template to get started'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon aria-hidden="true" />}
                onClick={onCreateTemplate}
                sx={{ textTransform: 'none', minHeight: 44 }}
              >
                Create Template
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }} role="list" aria-label="Templates">
            {filteredTemplates.map((template) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={template.templateId} role="listitem">
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    '&:hover, &:focus-within': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleEdit(template)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target === e.currentTarget) {
                      handleEdit(template);
                    }
                  }}
                  tabIndex={0}
                  role="article"
                  aria-label={`${template.name}, ${template.type} template, used ${template.usageCount} times`}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom component="h3">
                          {template.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, template)}
                        sx={{ ml: 1, minWidth: 40, minHeight: 40 }}
                        aria-label={`More options for ${template.name}`}
                        aria-haspopup="menu"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Chip
                      label={template.type}
                      size="small"
                      sx={{
                        bgcolor: alpha(getTypeColor(template.type), 0.1),
                        color: getTypeColor(template.type),
                        fontWeight: 600,
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {template.description}
                    </Typography>

                    <Box
                      sx={{ display: 'flex', gap: 2, mt: 'auto', flexWrap: 'wrap' }}
                      aria-label="Template statistics"
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary" component="dt">
                          Sections
                        </Typography>
                        <Typography variant="body2" fontWeight={600} component="dd">
                          {template.sections.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" component="dt">
                          Variables
                        </Typography>
                        <Typography variant="body2" fontWeight={600} component="dd">
                          {template.variables.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" component="dt">
                          Used
                        </Typography>
                        <Typography variant="body2" fontWeight={600} component="dd">
                          {template.usageCount}x
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2,
                      pb: 2,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<EditIcon aria-hidden="true" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(template);
                      }}
                      sx={{ textTransform: 'none', minHeight: 36 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<FileCopyIcon aria-hidden="true" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(template);
                      }}
                      sx={{ textTransform: 'none', minHeight: 36 }}
                    >
                      Duplicate
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        aria-label={menuAnchor ? `Options for ${menuAnchor.template.name}` : 'Template options'}
      >
        <MenuItem
          onClick={() => menuAnchor && handleEdit(menuAnchor.template)}
          sx={{ minHeight: 44 }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} aria-hidden="true" />
          Edit Template
        </MenuItem>
        <MenuItem
          onClick={() => menuAnchor && handleDuplicate(menuAnchor.template)}
          sx={{ minHeight: 44 }}
        >
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} aria-hidden="true" />
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => menuAnchor && handleDeleteClick(menuAnchor.template)}
          sx={{ color: 'error.main', minHeight: 44 }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} aria-hidden="true" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Template?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be
            undone. All projects using this template will not be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ textTransform: 'none', minHeight: 44 }}
          >
            Cancel
          </Button>
          <Button
            ref={deleteButtonRef}
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', minHeight: 44 }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
