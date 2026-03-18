/**
 * ThemeManagerSection
 *
 * Interactive theme editor for marketing pages.
 * Allows users to:
 * - View and modify current theme colors
 * - Create custom theme palettes
 * - Preview changes in real-time
 * - Export theme code
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ContentCopy,
  Refresh,
  LightMode,
  DarkMode,
  Check,
  Download,
  Palette,
} from '@mui/icons-material';
import { CodeBlock } from '../../docs';
import {
  FOUNDATION,
  MIDNIGHT,
  type MarketingColorPalette,
} from '../../../theme/marketing-palette';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

// Token metadata for the editor
const tokenMetadata: Record<keyof MarketingColorPalette, { label: string; description: string }> = {
  background: { label: 'Background', description: 'Page/section background' },
  surface: { label: 'Surface', description: 'Card/panel surface color' },
  surfaceDark: { label: 'Surface Dark', description: 'Dark sections (stats bar)' },
  foreground: { label: 'Foreground', description: 'Primary text color' },
  muted: { label: 'Muted', description: 'Secondary/muted text' },
  accent: { label: 'Accent', description: 'Links, buttons, highlights' },
  accentMuted: { label: 'Accent Muted', description: 'Decorative elements' },
  accentBgLight: { label: 'Accent BG Light', description: 'Selected state backgrounds' },
  accentBg: { label: 'Accent BG', description: 'Accent section backgrounds' },
  accentBgMedium: { label: 'Accent BG Medium', description: 'Icon badge backgrounds' },
  accentBorder: { label: 'Accent Border', description: 'Selected state borders' },
  border: { label: 'Border', description: 'Card/divider borders' },
  hoverBg: { label: 'Hover BG', description: 'Interactive hover states' },
  iconBg: { label: 'Icon BG', description: 'Icon badge backgrounds' },
  successBg: { label: 'Success BG', description: 'Success badge background' },
  successText: { label: 'Success Text', description: 'Success badge text' },
  logoFill: { label: 'Logo Fill', description: 'Logo SVG fill color' },
  invertedText: { label: 'Inverted Text', description: 'White text on dark/accent backgrounds' },
  invertedTextMuted: { label: 'Inverted Muted', description: 'Semi-transparent white text' },
};

// Color categories for better organization
const colorCategories = {
  'Core Colors': ['background', 'surface', 'surfaceDark', 'foreground', 'muted'],
  'Accent Colors': ['accent', 'accentMuted', 'accentBgLight', 'accentBg', 'accentBgMedium', 'accentBorder'],
  'UI Colors': ['border', 'hoverBg', 'iconBg'],
  'Status Colors': ['successBg', 'successText', 'logoFill'],
  'Inverted Colors': ['invertedText', 'invertedTextMuted'],
} as const;

interface ColorSwatchProps {
  token: keyof MarketingColorPalette;
  value: string;
  onChange: (token: keyof MarketingColorPalette, value: string) => void;
  isModified: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ token, value, onChange, isModified }) => {
  const meta = tokenMetadata[token];
  const [inputValue, setInputValue] = useState(value);

  // Sync input when value changes externally
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    onChange(token, inputValue);
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(token, newValue);
  };

  // Check if the value is a valid color for the color picker
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);

  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: isModified ? 'primary.main' : 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      {isModified && (
        <Chip
          label="Modified"
          size="small"
          color="primary"
          sx={{ position: 'absolute', top: 8, right: 8, height: 20, fontSize: '0.625rem' }}
        />
      )}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: value,
              border: 1,
              borderColor: 'divider',
              cursor: 'pointer',
            }}
          />
          {isValidHex && (
            <input
              type="color"
              value={value}
              onChange={handleColorPickerChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 48,
                height: 48,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
            {meta.label}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
            {meta.description}
          </Typography>
          <TextField
            size="small"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                py: 0.5,
              },
            }}
            fullWidth
          />
        </Box>
      </Stack>
    </Box>
  );
};

// Preview component showing how the theme looks
const ThemePreview: React.FC<{ palette: MarketingColorPalette; mode: 'light' | 'dark' }> = ({ palette, mode }) => {
  return (
    <Box
      sx={{
        bgcolor: palette.background,
        p: 3,
        borderRadius: 1,
        border: 1,
        borderColor: palette.border,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: palette.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          mb: 1,
        }}
      >
        Preview: {mode.toUpperCase()}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: palette.foreground,
          mb: 1,
        }}
      >
        Heading Text
      </Typography>
      <Typography sx={{ color: palette.muted, mb: 2, fontSize: '0.875rem' }}>
        This is secondary text showing the muted color.
      </Typography>
      <Box
        sx={{
          bgcolor: palette.surface,
          p: 2,
          borderRadius: 1,
          border: 1,
          borderColor: palette.border,
          mb: 2,
        }}
      >
        <Typography sx={{ color: palette.foreground, fontSize: '0.875rem', fontWeight: 600 }}>
          Card Surface
        </Typography>
        <Typography sx={{ color: palette.muted, fontSize: '0.75rem' }}>
          Content on a surface background
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Box
          sx={{
            bgcolor: palette.accent,
            color: palette.invertedText,
            px: 2,
            py: 0.75,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Primary Button
        </Box>
        <Box
          sx={{
            border: 1,
            borderColor: palette.border,
            color: palette.foreground,
            px: 2,
            py: 0.75,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Secondary
        </Box>
      </Stack>
    </Box>
  );
};

export const ThemeManagerSection: React.FC = () => {
  const { marketingMode, toggleMarketingTheme } = useMarketingTheme();
  const [editMode, setEditMode] = useState<'light' | 'dark'>('light');
  const [lightPalette, setLightPalette] = useState<MarketingColorPalette>({ ...FOUNDATION });
  const [darkPalette, setDarkPalette] = useState<MarketingColorPalette>({ ...MIDNIGHT });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const currentPalette = editMode === 'light' ? lightPalette : darkPalette;
  const basePalette = editMode === 'light' ? FOUNDATION : MIDNIGHT;

  // Check which tokens have been modified
  const modifiedTokens = useMemo(() => {
    const modified = new Set<keyof MarketingColorPalette>();
    (Object.keys(currentPalette) as Array<keyof MarketingColorPalette>).forEach((key) => {
      if (currentPalette[key] !== basePalette[key]) {
        modified.add(key);
      }
    });
    return modified;
  }, [currentPalette, basePalette]);

  const handleColorChange = useCallback((token: keyof MarketingColorPalette, value: string) => {
    if (editMode === 'light') {
      setLightPalette((prev) => ({ ...prev, [token]: value }));
    } else {
      setDarkPalette((prev) => ({ ...prev, [token]: value }));
    }
  }, [editMode]);

  const handleReset = useCallback(() => {
    if (editMode === 'light') {
      setLightPalette({ ...FOUNDATION });
    } else {
      setDarkPalette({ ...MIDNIGHT });
    }
    setSnackbarMessage(`${editMode === 'light' ? 'FOUNDATION' : 'MIDNIGHT'} palette reset to defaults`);
    setSnackbarOpen(true);
  }, [editMode]);

  const handleResetAll = useCallback(() => {
    setLightPalette({ ...FOUNDATION });
    setDarkPalette({ ...MIDNIGHT });
    setSnackbarMessage('Both palettes reset to defaults');
    setSnackbarOpen(true);
  }, []);

  // Generate exportable code
  const generateCode = useCallback(() => {
    const formatPalette = (name: string, palette: MarketingColorPalette, base: MarketingColorPalette) => {
      const lines: string[] = [];
      lines.push(`export const ${name}: MarketingColorPalette = {`);
      (Object.keys(palette) as Array<keyof MarketingColorPalette>).forEach((key) => {
        const value = palette[key];
        const baseValue = base[key];
        const isModified = value !== baseValue;
        const comment = isModified ? ' // Modified' : '';
        lines.push(`  ${key}: '${value}',${comment}`);
      });
      lines.push('};');
      return lines.join('\n');
    };

    const lightCode = formatPalette('CUSTOM_FOUNDATION', lightPalette, FOUNDATION);
    const darkCode = formatPalette('CUSTOM_MIDNIGHT', darkPalette, MIDNIGHT);

    return `/**
 * Custom Marketing Color Palettes
 * Generated from Theme Manager
 */

import type { MarketingColorPalette } from './marketing-palette';

${lightCode}

${darkCode}
`;
  }, [lightPalette, darkPalette]);

  const handleCopyCode = useCallback(async () => {
    const code = generateCode();
    try {
      await navigator.clipboard.writeText(code);
      setSnackbarMessage('Theme code copied to clipboard');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('Failed to copy to clipboard');
      setSnackbarOpen(true);
    }
  }, [generateCode]);

  const handleDownload = useCallback(() => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-marketing-palette.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSnackbarMessage('Theme file downloaded');
    setSnackbarOpen(true);
  }, [generateCode]);

  const totalModifications = useMemo(() => {
    let count = 0;
    (Object.keys(lightPalette) as Array<keyof MarketingColorPalette>).forEach((key) => {
      if (lightPalette[key] !== FOUNDATION[key]) count++;
    });
    (Object.keys(darkPalette) as Array<keyof MarketingColorPalette>).forEach((key) => {
      if (darkPalette[key] !== MIDNIGHT[key]) count++;
    });
    return count;
  }, [lightPalette, darkPalette]);

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Theme Manager
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Create and customize marketing theme palettes. Changes preview in real-time.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {totalModifications > 0 && (
            <Chip
              icon={<Palette />}
              label={`${totalModifications} modification${totalModifications > 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </Stack>

      {/* Mode Tabs and Actions */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Tabs value={editMode} onChange={(_, v) => setEditMode(v)}>
            <Tab
              value="light"
              label="FOUNDATION (Light)"
              icon={<LightMode sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
            <Tab
              value="dark"
              label="MIDNIGHT (Dark)"
              icon={<DarkMode sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
          </Tabs>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Reset current palette">
              <Button size="small" startIcon={<Refresh />} onClick={handleReset}>
                Reset
              </Button>
            </Tooltip>
            <Tooltip title="Reset both palettes">
              <Button size="small" onClick={handleResetAll} color="warning">
                Reset All
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Color Editor */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {Object.entries(colorCategories).map(([category, tokens]) => (
                <Box key={category} sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {tokens.map((token) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={token}>
                        <ColorSwatch
                          token={token as keyof MarketingColorPalette}
                          value={currentPalette[token as keyof MarketingColorPalette]}
                          onChange={handleColorChange}
                          isModified={modifiedTokens.has(token as keyof MarketingColorPalette)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Grid>

            {/* Preview Panel */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Live Preview
                </Typography>
                <ThemePreview palette={currentPalette} mode={editMode} />

                <Divider sx={{ my: 3 }} />

                <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Current App Theme
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={marketingMode === 'light' ? 'FOUNDATION' : 'MIDNIGHT'}
                    color={marketingMode === 'light' ? 'default' : 'primary'}
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={toggleMarketingTheme}
                    startIcon={marketingMode === 'light' ? <DarkMode /> : <LightMode />}
                  >
                    Switch to {marketingMode === 'light' ? 'Dark' : 'Light'}
                  </Button>
                </Stack>
                <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
                  Toggle the app theme above to see how your edits look in both modes.
                </Alert>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Export Section */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
            Export Theme
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyCode}
            >
              Copy Code
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download .ts
            </Button>
          </Stack>
        </Stack>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
          Export your customized palettes as a TypeScript file. Replace the values in{' '}
          <code>src/theme/marketing-palette.ts</code> to apply your theme.
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <CodeBlock>{generateCode()}</CodeBlock>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ThemeManagerSection;
