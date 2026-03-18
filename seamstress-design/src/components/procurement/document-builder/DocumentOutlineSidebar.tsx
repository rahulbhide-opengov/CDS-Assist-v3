/**
 * Document Outline Sidebar
 * Tree view of document sections with drag-and-drop reordering
 *
 * Features:
 * - Section list with hierarchy
 * - Select section to edit
 * - Drag-and-drop to reorder
 * - Add/delete sections
 * - Collapse/expand sections
 */

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { DocumentSection } from '../../../types/procurement';
import { SectionHighlightWrapper } from './SectionHighlightWrapper';

interface DocumentOutlineSidebarProps {
  sections: DocumentSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onAddSection: (title: string, type: DocumentSection['type']) => void;
  onDeleteSection: (sectionId: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
}

export const DocumentOutlineSidebar: React.FC<DocumentOutlineSidebarProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onDeleteSection,
  onReorderSections,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [sectionMenuAnchor, setSectionMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuSectionId, setMenuSectionId] = useState<string | null>(null);

  // Dialog state for adding sections
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState<DocumentSection['type']>('text');

  // Dialog state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSections = [...sections];
      const [removed] = newSections.splice(draggedIndex, 1);
      newSections.splice(dragOverIndex, 0, removed);

      onReorderSections(newSections.map((s) => s.sectionId));
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchor(event.currentTarget);
  };

  const handleAddSectionMenuClick = (type: DocumentSection['type']) => {
    setNewSectionType(type);
    setNewSectionTitle('');
    setAddDialogOpen(true);
    setAddMenuAnchor(null);
  };

  const handleAddSectionConfirm = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim(), newSectionType);
    }
    setAddDialogOpen(false);
    setNewSectionTitle('');
  };

  const handleSectionMenuOpen = (event: React.MouseEvent<HTMLElement>, sectionId: string) => {
    event.stopPropagation();
    setSectionMenuAnchor(event.currentTarget);
    setMenuSectionId(sectionId);
  };

  const handleSectionMenuClose = () => {
    setSectionMenuAnchor(null);
    setMenuSectionId(null);
  };

  const handleDeleteClick = () => {
    if (menuSectionId) {
      setSectionToDelete(menuSectionId);
      setDeleteDialogOpen(true);
    }
    handleSectionMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      onDeleteSection(sectionToDelete);
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const getSectionTypeLabel = (type: DocumentSection['type']): string => {
    switch (type) {
      case 'text':
        return 'Text Section';
      case 'list':
        return 'List Section';
      case 'heading':
        return 'Heading';
      default:
        return 'Section';
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" fontSize="16px" fontWeight={600}>
          Document Outline
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ textTransform: 'none' }}
        >
          Add
        </Button>
      </Box>

      {/* Section List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {sections.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No sections yet. Click "Add" to create your first section.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sections.map((section, index) => {
              const isSelected = section.sectionId === selectedSectionId;
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <SectionHighlightWrapper key={section.sectionId} sectionId={section.sectionId}>
                  <ListItem
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    disablePadding
                    sx={{
                      opacity: isDragging ? 0.5 : 1,
                      borderTop: isDragOver ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleSectionMenuOpen(e, section.sectionId)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => onSelectSection(section.sectionId)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                          },
                        },
                      }}
                    >
                      <DragIndicatorIcon
                        fontSize="small"
                        sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }}
                      />
                      <ListItemText
                        primary={section.title}
                        secondary={`${section.type} section`}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                        secondaryTypographyProps={{
                          fontSize: '12px',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </SectionHighlightWrapper>
              );
            })}
          </List>
        )}
      </Box>

      {/* Add Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleAddSectionMenuClick('text')}>Text Section</MenuItem>
        <MenuItem onClick={() => handleAddSectionMenuClick('list')}>List Section</MenuItem>
        <MenuItem onClick={() => handleAddSectionMenuClick('heading')}>Heading</MenuItem>
        <Divider />
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <Typography variant="caption" color="text.secondary">
            Cancel
          </Typography>
        </MenuItem>
      </Menu>

      {/* Section Menu */}
      <Menu
        anchorEl={sectionMenuAnchor}
        open={Boolean(sectionMenuAnchor)}
        onClose={handleSectionMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Section
        </MenuItem>
      </Menu>

      {/* Add Section Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add {getSectionTypeLabel(newSectionType)}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newSectionTitle.trim()) {
                handleAddSectionConfirm();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSectionConfirm}
            disabled={!newSectionTitle.trim()}
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Section</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this section? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
