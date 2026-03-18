/**
 * Enhanced Knowledge Page
 * Comprehensive knowledge management with @ mentions and document viewer
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Alert,
  LinearProgress,
  Checkbox,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { FilePreviewCard } from '@opengov/components-file-management';
import Drawer from '../../components/Drawer/Drawer';
import KnowledgeViewer from '../../components/knowledge/KnowledgeViewer';
import KnowledgeEditor from '../../components/knowledge/KnowledgeEditor';
import { knowledgeService } from '../../services/knowledge/KnowledgeService';
import { fileUploadService } from '../../services/knowledge/FileUploadService';
import type {
  KnowledgeDocument,
  DocumentType,
} from '../../services/knowledge/KnowledgeTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { knowledgeColumns, columnVisibilityModel } from '../../config/columns/knowledgeColumns';

import {
  Magnify as SearchIcon,
  ViewGrid as GridViewIcon,
  ViewList as TableRowsIcon,
  FileDocumentOutline as DescriptionIcon,
  FilePdfBox as PictureAsPdfIcon,
  Table as TableChartIcon,
  Delete as DeleteIcon,
  Plus as AddIcon,
} from '@opengov/react-capital-assets';
import FilterListIcon from '@mui/icons-material/FilterList';

const getFileIcon = (type: DocumentType) => {
  const iconProps = { sx: { fontSize: 48 } };
  switch (type) {
    case 'pdf':
      return <PictureAsPdfIcon {...iconProps} />;
    case 'csv':
    case 'excel':
      return <TableChartIcon {...iconProps} />;
    case 'txt':
      return <DescriptionIcon {...iconProps} />;
    case 'markdown':
      return <DescriptionIcon {...iconProps} />;
    case 'word':
      return <DescriptionIcon {...iconProps} />;
    default:
      return <DescriptionIcon {...iconProps} />;
  }
};

const KnowledgePageEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { documentId: urlDocumentId } = useParams<{ documentId?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDocumentId, setViewerDocumentId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploading files state
  const [uploadingFiles, setUploadingFiles] = useState<Array<{
    id: string;
    name: string;
    progress: number;
    status: string;
  }>>([]);

  // Load documents and folders on mount
  useEffect(() => {
    loadData();
  }, []);

  // Open viewer when navigating to a specific document
  useEffect(() => {
    if (urlDocumentId) {
      setViewerDocumentId(urlDocumentId);
      setViewerOpen(true);
    }
  }, [urlDocumentId]);

  const loadData = async () => {
    setError(null);
    try {
      const docs = await knowledgeService.getAllDocuments();
      setDocuments(docs);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading data:', err);
    }
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'table' | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFileSelect = (documentId: string) => {
    setSelectedFiles(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleDocumentClick = (documentId: string) => {
    navigate(`/agent-studio/knowledge/${documentId}`);
  };


  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const simulateFileUpload = async (file: File) => {
    const fileId = `upload-${Date.now()}-${Math.random()}`;

    // Add file to uploading state
    setUploadingFiles(prev => [...prev, {
      id: fileId,
      name: file.name,
      progress: 0,
      status: 'Converting Document...'
    }]);

    // Upload progress: 0-100% over 3 seconds
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setUploadingFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, progress: i } : f)
      );
    }

    // Upload actual file
    const document = await knowledgeService.uploadFile(file);

    // Remove from uploading and add to documents
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    setDocuments(prev => [...prev, document]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setError(null);
      for (const file of Array.from(files)) {
        const validation = fileUploadService.validateFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid file');
          continue;
        }

        // Don't await - allow parallel uploads
        simulateFileUpload(file).catch(err => {
          setError('Failed to upload files');
          console.error('Upload error:', err);
        });
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) return;

    setError(null);
    try {
      const document = await knowledgeService.createDocument(
        newDocTitle,
        newDocContent,
        'markdown',
        []
      );
      setDocuments(prev => [...prev, document]);
      setCreateDialogOpen(false);
      setNewDocTitle('');
      setNewDocContent('');

      // Navigate to the new document
      navigate(`/agent-studio/knowledge/${document.id}`);
    } catch (err) {
      setError('Failed to create document');
      console.error('Create error:', err);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setError(null);
      try {
        await knowledgeService.deleteDocument(documentId);
        setDocuments(prev => prev.filter(d => d.id !== documentId));
      } catch (err) {
        setError('Failed to delete document');
        console.error('Delete error:', err);
      }
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setSelectedFiles(prev => prev.filter(id => id !== documentId));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRowSelection = (selectionModel: any) => {
    setSelectedFiles(selectionModel);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setError(null);
    try {
      await Promise.all(selectedFiles.map(id => knowledgeService.deleteDocument(id)));
      setDocuments(prev => prev.filter(d => !selectedFiles.includes(d.id)));
      setSelectedFiles([]);
      setBulkDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete documents');
      console.error('Bulk delete error:', err);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  // Get all unique tags from documents
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(doc => {
      doc.metadata.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [documents]);

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc => {
        const matchesSearch =
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          filterStatus === 'all' ||
          (filterStatus === 'published' && doc.publishingStatus === 'published') ||
          (filterStatus === 'draft' && doc.publishingStatus === 'draft');

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some(tag => doc.metadata.tags.includes(tag));

        return matchesSearch && matchesStatus && matchesTags;
      })
      .sort((a, b) => {
        // Sort by created date, newest first
        return new Date(b.metadata.created).getTime() - new Date(a.metadata.created).getTime();
      });
  }, [documents, searchQuery, filterStatus, selectedTags]);


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      {/* Page Header */}
      <Box sx={{
        backgroundColor: 'background.secondary',
        '& > div': {
          px: 3,
          py: 2
        }
      }}>
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Box key="stats" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2">
                  {documents.length} documents
                </Typography>
              </Box>
            ]}
          >
            <PageHeaderComposable.Title>
              Knowledge Management
            </PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Main Content Container */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: 'background.default',
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%'
        }}
      >
        {/* Left Sidebar Drawer - Desktop (in-page) */}
        {!isMobile && (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Organize"
            subtitle="Manage your documents and folders"
            width={320}
            inPage={true}
            hideFooter={true}
          >
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Document
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleFileUpload}
              >
                Upload Files
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.csv,.txt,.md,.doc,.docx,.xls,.xlsx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <Divider />

              <Typography variant="subtitle2">
                Filter by Status
              </Typography>

              <ToggleButtonGroup
                value={filterStatus}
                exclusive
                onChange={(e, v) => v && setFilterStatus(v)}
                fullWidth
                size={isMobile ? "large" : "medium"}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="published">Published</ToggleButton>
                <ToggleButton value="draft">Draft</ToggleButton>
              </ToggleButtonGroup>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  Filter by Tags
                </Typography>
                {selectedTags.length > 0 && (
                  <Button
                    size="small"
                    onClick={() => setSelectedTags([])}
                    sx={{ fontSize: '12px', minWidth: 'auto', p: 0.5 }}
                  >
                    Clear
                  </Button>
                )}
              </Box>

              {allTags.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {allTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagToggle(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  No tags available
                </Typography>
              )}


            </Stack>
          </Drawer>
        )}

        {/* Left Sidebar Drawer - Mobile (overlay) */}
        {isMobile && (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Organize"
            subtitle="Manage your documents and folders"
            anchor="left"
            inPage={false}
            hideFooter={true}
            width="100%"
          >
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setCreateDialogOpen(true);
                  setDrawerOpen(false);
                }}
              >
                Create Document
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  handleFileUpload();
                  setDrawerOpen(false);
                }}
              >
                Upload Files
              </Button>

              <Divider />

              <Typography variant="subtitle2">
                Filter by Status
              </Typography>

              <ToggleButtonGroup
                value={filterStatus}
                exclusive
                onChange={(e, v) => v && setFilterStatus(v)}
                fullWidth
                size={isMobile ? "large" : "medium"}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="published">Published</ToggleButton>
                <ToggleButton value="draft">Draft</ToggleButton>
              </ToggleButtonGroup>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  Filter by Tags
                </Typography>
                {selectedTags.length > 0 && (
                  <Button
                    size="small"
                    onClick={() => setSelectedTags([])}
                    sx={{ fontSize: '12px', minWidth: 'auto', p: 0.5 }}
                  >
                    Clear
                  </Button>
                )}
              </Box>

              {allTags.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {allTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagToggle(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  No tags available
                </Typography>
              )}
            </Stack>
          </Drawer>
        )}

        {/* Main Content Column */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: drawerOpen && !isMobile ? 'calc(100% - 336px)' : '100%'
        }}>
          {/* Toolbar */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 2 }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              mb: 2
            }}
          >
            {/* Filters Button */}
            {(isMobile || !drawerOpen) && (
              <Button
                variant="outlined"
                onClick={() => setDrawerOpen(true)}
                size={isMobile ? "large" : "medium"}
                startIcon={<FilterListIcon />}
                sx={{ flexShrink: 0 }}
              >
                Filters
              </Button>
            )}

            {/* Search and View Toggle - same row */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                flex: 1,
                width: '100%',
              }}
            >
              <TextField
                placeholder="Search documents..."
                size={isMobile ? "large" : "medium"}
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: { xs: 'none', sm: 320 },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size={isMobile ? "large" : "medium"}
                sx={{ flexShrink: 0 }}
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="table">
                  <TableRowsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {/* Bulk Actions - shown when items are selected */}
            {selectedFiles.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setSelectedFiles([])}
                >
                  Clear selection
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size={isMobile ? "large" : "medium"}
                  onClick={handleBulkDeleteClick}
                  startIcon={<DeleteIcon />}
                >
                  Delete ({selectedFiles.length})
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Content Area */}
          {viewMode === 'grid' ? (
            <Box sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'auto',
              p: 2
            }}>
              <Grid container spacing={3}>
                {/* Uploading files */}
                {uploadingFiles.map(file => (
                  <Grid size={12} key={file.id}>
                    <FilePreviewCard
                      name={file.name}
                      description={file.status}
                      previewIcon={<DescriptionIcon sx={{ fontSize: 48 }} />}
                      isSelected={false}
                      layout="vertical"
                      progress={file.progress}
                    />
                  </Grid>
                ))}
                {/* Existing documents */}
                {filteredDocuments.map(doc => (
                  <Grid
                    size={12}
                    key={doc.id}
                  >
                    {/* Selection Checkbox - shown when items are selected or on hover */}
                    <Box
                      className="checkbox-overlay"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        opacity: selectedFiles.length > 0 || selectedFiles.includes(doc.id) ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect(doc.id);
                      }}
                    >
                      <Checkbox
                        checked={selectedFiles.includes(doc.id)}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'grey.100',
                          },
                        }}
                      />
                    </Box>

                    <FilePreviewCard
                      name={doc.title}
                      description={
                        doc.originalFileName
                          ? `Converted from ${doc.originalFileName.split('.').pop()?.toUpperCase()} • ${new Date(doc.metadata.created).toLocaleDateString()}`
                          : new Date(doc.metadata.created).toLocaleDateString()
                      }
                      previewIcon={getFileIcon(doc.type)}
                      isSelected={selectedFiles.includes(doc.id)}
                      layout="vertical"
                      progress={undefined}
                      onClick={() => {
                        // If items are selected, clicking selects/deselects
                        if (selectedFiles.length > 0) {
                          handleFileSelect(doc.id);
                        } else {
                          // Otherwise open the document
                          handleDocumentClick(doc.id);
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              {/* Show uploading files banner */}
              {uploadingFiles.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {uploadingFiles.map(file => (
                    <Alert
                      key={file.id}
                      severity="info"
                      icon={false}
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {file.name} - {file.status}
                        </Typography>
                        <Box sx={{ width: 200 }}>
                          <LinearProgress
                            variant="determinate"
                            value={file.progress}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {file.progress}%
                        </Typography>
                      </Stack>
                    </Alert>
                  ))}
                </Box>
              )}

              <DataGrid
                rows={filteredDocuments}
                columns={knowledgeColumns}
                columnVisibilityModel={columnVisibilityModel}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                  // MUI X DataGrid v8 returns {type: 'include', ids: Set}
                  const ids = Array.from(newSelection.ids || []);
                  setSelectedFiles(ids.map(id => String(id)));
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25, page: 0 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                onRowClick={(params) => handleDocumentClick(params.row.id)}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* FAB for Create on Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Document Viewer */}
      <KnowledgeViewer
        documentId={viewerDocumentId}
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerDocumentId(null);
          // Navigate back to knowledge list if we're on a document-specific URL
          if (urlDocumentId) {
            navigate('/agent-studio/knowledge');
          }
        }}
        onSave={(doc) => {
          setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
        }}
        onDelete={(docId) => {
          setDocuments(prev => prev.filter(d => d.id !== docId));
          setViewerOpen(false);
        }}
      />

      {/* Create Document Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Document Title"
              fullWidth
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
            />
            <KnowledgeEditor
              value={newDocContent}
              onChange={setNewDocContent}
              placeholder="Start writing your document... Use @ to mention other documents, agents, skills, or tools"
              minHeight={300}
              showToolbar={true}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateDocument}
            disabled={!newDocTitle.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={handleBulkDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Documents</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedFiles.length} document{selectedFiles.length !== 1 ? 's' : ''}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteCancel}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDeleteConfirm}
          >
            Delete {selectedFiles.length} document{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgePageEnhanced;