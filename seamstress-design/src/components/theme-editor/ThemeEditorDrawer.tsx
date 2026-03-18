/**
 * Theme Editor Drawer
 *
 * Persistent drawer for creating and editing custom color themes
 */

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  AppBar,
  Toolbar,
  Slider,
} from '@mui/material';
import {
  Close as CloseIcon,
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
import { ColorHexInput } from './ColorHexInput';
import {
  COLOR_CATEGORIES,
  COLOR_KEYS_BY_CATEGORY,
  type ThemeColorKey,
  type ColorMapping,
  type SavedTheme,
} from './types';
import { cdsColors } from '../../theme/cds';

interface ThemeEditorDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 720;

export function ThemeEditorDrawer({ open, onClose }: ThemeEditorDrawerProps) {
  const {
    savedThemes,
    currentTheme,
    activeThemeId,
    createNewTheme,
    updateThemeColor,
    updateThemeBorderRadius,
    setCustomPrimaryColor,
    saveTheme,
    deleteTheme,
    applyTheme,
    exportTheme,
    importTheme,
    loadTheme,
    setCurrentTheme,
  } = useThemeEditor();

  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [editingColorKey, setEditingColorKey] = useState<ThemeColorKey | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Update local state when currentTheme changes
  useEffect(() => {
    if (currentTheme) {
      setThemeName(currentTheme.name);
      setThemeDescription(currentTheme.description || '');
      setThemeMode(currentTheme.mode);
      setSelectedThemeId(currentTheme.id);
    }
  }, [currentTheme]);

  // Helper to show success message
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateNew = () => {
    const name = themeName.trim() || 'New Theme';
    const theme = createNewTheme(name, themeMode, themeDescription);
    showSuccessMessage(`Theme "${theme.name}" created successfully!`);
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
      // Show subtle feedback for color updates
      const colorName = editingColorKey.split('.')[1] || editingColorKey;
      showSuccessMessage(`Updated ${colorName} color`);
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
      showSuccessMessage(`Theme "${themeName}" saved successfully!`);
    }
  };

  const handleDelete = () => {
    if (currentTheme && confirm(`Delete theme "${currentTheme.name}"?`)) {
      const name = currentTheme.name;
      deleteTheme(currentTheme.id);
      setCurrentTheme(null);
      setThemeName('');
      setThemeDescription('');
      setSelectedThemeId('');
      showSuccessMessage(`Theme "${name}" deleted`);
    }
  };

  const handleApply = () => {
    if (currentTheme) {
      applyTheme(currentTheme.id);
      showSuccessMessage(`Theme "${currentTheme.name}" applied! Changes are live.`);
    }
  };

  const handleExport = () => {
    if (currentTheme) {
      exportTheme(currentTheme);
      showSuccessMessage(`Theme "${currentTheme.name}" exported`);
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
            showSuccessMessage(`Theme "${imported.name}" imported successfully!`);
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
      setCurrentTheme(null);
      setThemeName('');
      setThemeDescription('');
      setThemeMode('light');
    }
  };

  const getColorValue = (colorKey: ThemeColorKey): string | undefined => {
    const mapping = currentTheme?.colors[colorKey];
    if (!mapping) return undefined;
    return mapping.source === 'custom' ? mapping.customHex : mapping.tokenValue;
  };

  const getColorPath = (colorKey: ThemeColorKey): string | undefined => {
    return currentTheme?.colors[colorKey]?.tokenPath;
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        variant="persistent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Header */}
        <AppBar position="static" sx={{ border: 'none' }} color="default" elevation={0}>
          <Toolbar>
            <PaletteIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Theme Editor
            </Typography>
            <IconButton edge="end" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ overflow: 'auto', height: '100%', p: 3 }}>
          {showSuccess && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              icon={<CheckCircleIcon />}
              onClose={() => setShowSuccess(false)}
            >
              {successMessage}
            </Alert>
          )}

          {/* Theme Selection and Management */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
              Theme Management
            </Typography>
            <Stack spacing={2}>
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

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<ImportIcon />}
                  onClick={handleImport}
                  size="small"
                  fullWidth
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExport}
                  disabled={!currentTheme}
                  size="small"
                  fullWidth
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={!currentTheme}
                  size="small"
                  fullWidth
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Theme Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
              Theme Details
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Theme Name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                size="small"
                disabled={!!currentTheme}
              />
              <TextField
                fullWidth
                label="Description"
                value={themeDescription}
                onChange={(e) => setThemeDescription(e.target.value)}
                size="small"
              />
              {!currentTheme && (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Base Theme Mode</FormLabel>
                  <RadioGroup
                    row
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark')}
                  >
                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                  </RadioGroup>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Your theme starts with all default {themeMode} mode colors
                  </Typography>
                </FormControl>
              )}
              {!currentTheme && (
                <Button
                  variant="contained"
                  onClick={handleCreateNew}
                  disabled={!themeName.trim()}
                  fullWidth
                >
                  Create New Theme
                </Button>
              )}
              {currentTheme && (
                <Alert severity="info">
                  Base: <strong>{currentTheme.mode}</strong> mode
                </Alert>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Border Radius Configuration */}
          {currentTheme && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                Border Radius
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Applies to buttons, inputs, cards, papers, accordions, and other rectangular components
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Slider
                    value={currentTheme.borderRadius ?? 4}
                    onChange={(_, value) => updateThemeBorderRadius(value as number)}
                    min={0}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={currentTheme.borderRadius ?? 4}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 0 && value <= 24) {
                        updateThemeBorderRadius(value);
                      }
                    }}
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 24 }}
                    sx={{ width: 80 }}
                    label="px"
                  />
                </Stack>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Color Configuration */}
          {currentTheme && (
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                Color Configuration
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Click any color to customize it from design tokens
              </Typography>

              {Object.entries(COLOR_CATEGORIES).map(([key, categoryName]) => {
                const colorKeys = COLOR_KEYS_BY_CATEGORY[categoryName];
                const customizedCount = colorKeys.filter(
                  (k) => currentTheme.colors[k] && currentTheme.colors[k].tokenPath !== 'default'
                ).length;

                return (
                  <Accordion key={key} defaultExpanded={key === 'PRIMARY'}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">{categoryName}</Typography>
                        <Chip
                          label={`${customizedCount}/${colorKeys.length}`}
                          size="small"
                          color={customizedCount > 0 ? 'primary' : 'default'}
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* Custom Hex Input - Only show for Primary category */}
                      {key === 'PRIMARY' && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Quick Custom Color
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                            Enter a hex color to auto-generate all primary variants (main, light, dark, contrast)
                          </Typography>
                          <ColorHexInput
                            label="Primary Color"
                            value={currentTheme?.colors['primary.main']?.customHex || ''}
                            onChange={(hex) => setCustomPrimaryColor(hex)}
                            backgroundColor={currentTheme?.colors['background.default']?.tokenValue || cdsColors.white}
                            helperText="Auto-generates light, dark, and contrast variants"
                          />
                          {currentTheme?.colors['primary.main']?.source === 'custom' && (
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                              <Chip
                                label={`Light: ${currentTheme?.colors['primary.light']?.customHex}`}
                                size="small"
                                sx={{ bgcolor: currentTheme?.colors['primary.light']?.customHex }}
                              />
                              <Chip
                                label={`Main: ${currentTheme?.colors['primary.main']?.customHex}`}
                                size="small"
                                sx={{ bgcolor: currentTheme?.colors['primary.main']?.customHex, color: currentTheme?.colors['primary.contrastText']?.customHex }}
                              />
                              <Chip
                                label={`Dark: ${currentTheme?.colors['primary.dark']?.customHex}`}
                                size="small"
                                sx={{ bgcolor: currentTheme?.colors['primary.dark']?.customHex }}
                              />
                            </Stack>
                          )}
                        </Box>
                      )}

                      <Grid container spacing={2}>
                        {colorKeys.map((colorKey) => {
                          const value = getColorValue(colorKey);
                          const path = getColorPath(colorKey);
                          const label = colorKey.split('.')[1] || colorKey;
                          const isDefault = path === 'default';
                          const isCustomized = path && path !== 'default';

                          return (
                            <Grid size={{ xs: 6 }} key={colorKey}>
                              <Tooltip
                                title={
                                  isDefault
                                    ? 'Default color (click to customize)'
                                    : path || 'Click to select color'
                                }
                              >
                                <Box
                                  onClick={() => handleColorClick(colorKey)}
                                  sx={{
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: isCustomized ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                    p: 1,
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
                                        top: 2,
                                        right: 2,
                                        height: 16,
                                        fontSize: '0.6rem',
                                      }}
                                    />
                                  )}
                                  <Box
                                    sx={{
                                      width: '100%',
                                      height: 36,
                                      backgroundColor: value || cdsColors.gray300,
                                      borderRadius: 1,
                                      mb: 0.5,
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
                                      sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
                                      display="block"
                                      noWrap
                                    >
                                      {value}
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
        </Box>

        {/* Footer Actions */}
        {currentTheme && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!themeName.trim()}
                fullWidth
              >
                Save Theme
              </Button>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={handleApply}
                fullWidth
              >
                Apply Theme
              </Button>
            </Stack>
          </Box>
        )}
      </Drawer>

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
    </>
  );
}
