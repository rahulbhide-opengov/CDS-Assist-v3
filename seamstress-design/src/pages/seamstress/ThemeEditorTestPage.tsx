/**
 * Theme Editor Test Page
 *
 * Direct access page to test and use the theme editor
 */

import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';
import { ThemeEditorDrawer } from '../../components/theme-editor/ThemeEditorDrawer';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function ThemeEditorTestPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const { currentCustomTheme, activeCustomThemeId } = useThemeMode();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PaletteIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            Theme Editor
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create and manage custom color themes for Seamstress
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PaletteIcon />}
            onClick={() => setEditorOpen(true)}
          >
            Open Theme Editor
          </Button>

          {activeCustomThemeId && currentCustomTheme && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Active Theme
              </Typography>
              <Typography variant="h6">{currentCustomTheme.name}</Typography>
              {currentCustomTheme.description && (
                <Typography variant="body2" color="text.secondary">
                  {currentCustomTheme.description}
                </Typography>
              )}
            </Paper>
          )}

          {!activeCustomThemeId && (
            <Typography variant="body2" color="text.secondary">
              No custom theme active (using default Seamstress theme)
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <ul>
            <li>Create custom color themes</li>
            <li>Select colors from Capital Design System tokens</li>
            <li>Edit all theme color properties</li>
            <li>Save, load, and delete themes</li>
            <li>Import and export themes as JSON</li>
            <li>Apply themes with live preview</li>
          </ul>
        </Box>
      </Paper>

      <ThemeEditorDrawer open={editorOpen} onClose={() => setEditorOpen(false)} />
    </Container>
  );
}
