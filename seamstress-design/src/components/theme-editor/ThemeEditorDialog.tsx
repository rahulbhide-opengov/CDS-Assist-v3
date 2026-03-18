/**
 * Theme Editor Dialog
 *
 * Main component for creating and editing custom color themes
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
  Chip,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useThemeEditor } from '../../hooks/useThemeEditor';
import { ColorTokenPicker } from './ColorTokenPicker';
import {
  COLOR_CATEGORIES,
  COLOR_KEYS_BY_CATEGORY,
  type ThemeColorKey,
  type ColorMapping,
  type SavedTheme,
} from './types';
import { cdsColors } from '../../theme/cds';

interface ThemeEditorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ThemeEditorDialog({ open, onClose }: ThemeEditorDialogProps) {
  const {
    savedThemes,
    currentTheme,
    activeThemeId,
    createNewTheme,
    updateThemeColor,
    saveTheme,
    deleteTheme,
    applyTheme,
    exportTheme,
    importTheme,
    loadTheme,
    setCurrentTheme,
    getActiveTheme,
  } = useThemeEditor();

  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [editingColorKey, setEditingColorKey] = useState<ThemeColorKey | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load active theme when dialog opens
  useEffect(() => {
    if (open && !currentTheme && activeThemeId) {
      loadTheme(activeThemeId);
    }
  }, [open, activeThemeId, currentTheme, loadTheme]);

  // Update local state when currentTheme changes
  useEffect(() => {
    if (currentTheme) {
      setThemeName(currentTheme.name);
      setThemeDescription(currentTheme.description || '');
      setThemeMode(currentTheme.mode);
      setSelectedThemeId(currentTheme.id);
    }
  }, [currentTheme]);

  const handleCreateNew = () => {
    const name = themeName.trim() || 'New Theme';
    const theme = createNewTheme(name, themeMode, themeDescription);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleColorClick = (colorKey: ThemeColorKey) => {
    if (!currentTheme) {
      alert('Please create or select a theme first');
      return;
    }
    setEditingColorKey(colorKey);
    setPickerOpen(true);
  };

  const handleColorSelect = (mapping: ColorMapping) => {
    if (editingColorKey) {
      updateThemeColor(editingColorKey, mapping);
    }
  };

  const handleSave = () => {
    if (currentTheme) {
      const updated = {
        ...currentTheme,
        name: themeName,
        description: themeDescription,
      };
      saveTheme(updated);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDeleteClick = () => {
    if (currentTheme) {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (currentTheme) {
      deleteTheme(currentTheme.id);
      setCurrentTheme(null);
      setThemeName('');
      setThemeDescription('');
      setSelectedThemeId('');
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleApply = () => {
    if (currentTheme) {
      applyTheme(currentTheme.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // Theme will be applied automatically by ThemeContext
    }
  };

  const handleExport = () => {
    if (currentTheme) {
      exportTheme(currentTheme);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonString = event.target?.result as string;
          const imported = importTheme(jsonString);
          if (imported) {
            setCurrentTheme(imported);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          } else {
            alert('Failed to import theme. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedThemeId(themeId);
    if (themeId) {
      loadTheme(themeId);
    } else {
      // Clear selection - prepare for new theme
      setCurrentTheme(null);
      setThemeName('');
      setThemeDescription('');
      setThemeMode('light');
    }
  };

  const getColorValue = (colorKey: ThemeColorKey): string | undefined => {
    return currentTheme?.colors[colorKey]?.tokenValue;
  };

  const getColorPath = (colorKey: ThemeColorKey): string | undefined => {
    return currentTheme?.colors[colorKey]?.tokenPath;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '1200px',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PaletteIcon />
            <Typography variant="h6">Theme Editor</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
              Theme saved successfully!
            </Alert>
          )}

          {/* Theme Selection and Management */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Theme Management
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Theme</InputLabel>
                  <Select
                    value={selectedThemeId}
                    onChange={(e) => handleThemeSelect(e.target.value)}
                    label="Select Theme"
                  >
                    <MenuItem value="">
                      <em>Create New Theme</em>
                    </MenuItem>
                    {savedThemes.map((theme) => (
                      <MenuItem key={theme.id} value={theme.id}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>{theme.name}</Typography>
                          <Chip label={theme.mode} size="small" variant="outlined" />
                          {activeThemeId === theme.id && (
                            <Chip label="Active" size="small" color="primary" />
                          )}
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<ImportIcon />}
                    onClick={handleImport}
                    size="small"
                  >
                    Import
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ExportIcon />}
                    onClick={handleExport}
                    disabled={!currentTheme}
                    size="small"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    disabled={!currentTheme}
                    size="small"
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Theme Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Theme Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Theme Name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  size="small"
                  disabled={!!currentTheme}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  size="small"
                />
              </Grid>
              {!currentTheme && (
                <Grid size={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Base Theme Mode</FormLabel>
                    <RadioGroup
                      row
                      value={themeMode}
                      onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark')}
                    >
                      <FormControlLabel value="light" control={<Radio />} label="Light Mode" />
                      <FormControlLabel value="dark" control={<Radio />} label="Dark Mode" />
                    </RadioGroup>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Your theme will start with all default {themeMode} mode colors. You can then override individual colors.
                    </Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            {!currentTheme && (
              <Button
                variant="contained"
                onClick={handleCreateNew}
                disabled={!themeName.trim()}
                sx={{ mt: 2 }}
              >
                Create New Theme
              </Button>
            )}
            {currentTheme && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Base Mode: <strong>{currentTheme.mode}</strong> • Colors shown are your customizations or defaults from {currentTheme.mode} mode
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Color Configuration */}
          {currentTheme && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color Configuration
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Click on any color to select a design token
              </Typography>

              {Object.entries(COLOR_CATEGORIES).map(([key, categoryName]) => {
                const colorKeys = COLOR_KEYS_BY_CATEGORY[categoryName];
                return (
                  <Accordion key={key} defaultExpanded={key === 'PRIMARY'}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{categoryName}</Typography>
                      <Chip
                        label={`${colorKeys.filter((k) => currentTheme.colors[k]).length}/${colorKeys.length}`}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {colorKeys.map((colorKey) => {
                          const value = getColorValue(colorKey);
                          const path = getColorPath(colorKey);
                          const label = colorKey.split('.')[1] || colorKey;
                          const isDefault = path === 'default';
                          const isCustomized = path && path !== 'default';

                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={colorKey}>
                              <Tooltip title={isDefault ? 'Default color (click to customize)' : (path || 'Click to select color')}>
                                <Box
                                  onClick={() => handleColorClick(colorKey)}
                                  sx={{
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: isCustomized ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                    p: 1.5,
                                    position: 'relative',
                                    '&:hover': {
                                      borderColor: 'primary.main',
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  {isCustomized && (
                                    <Chip
                                      label="Custom"
                                      size="small"
                                      color="primary"
                                      sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        height: 18,
                                        fontSize: '0.65rem',
                                      }}
                                    />
                                  )}
                                  <Box
                                    sx={{
                                      width: '100%',
                                      height: 48,
                                      backgroundColor: value || cdsColors.gray300,
                                      borderRadius: 1,
                                      mb: 1,
                                      border: '1px solid',
                                      borderColor: 'divider',
                                    }}
                                  />
                                  <Typography variant="caption" fontWeight="medium" display="block">
                                    {label}
                                  </Typography>
                                  {value && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                                      display="block"
                                    >
                                      {value}
                                    </Typography>
                                  )}
                                  {!value && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Not set
                                    </Typography>
                                  )}
                                </Box>
                              </Tooltip>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={handleApply}
            disabled={!currentTheme}
          >
            Apply Theme
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!currentTheme || !themeName.trim()}
          >
            Save Theme
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Token Picker Dialog */}
      {editingColorKey && (
        <ColorTokenPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleColorSelect}
          currentValue={getColorValue(editingColorKey)}
          colorKey={editingColorKey}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Theme
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete "{currentTheme?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
