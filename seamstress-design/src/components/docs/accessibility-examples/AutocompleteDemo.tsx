import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Autocomplete,
  Stack,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';

interface Option {
  label: string;
  category: string;
}

const options: Option[] = [
  { label: 'Alabama', category: 'South' },
  { label: 'Alaska', category: 'West' },
  { label: 'Arizona', category: 'West' },
  { label: 'California', category: 'West' },
  { label: 'Colorado', category: 'West' },
  { label: 'Florida', category: 'South' },
  { label: 'Georgia', category: 'South' },
  { label: 'Illinois', category: 'Midwest' },
  { label: 'Massachusetts', category: 'Northeast' },
  { label: 'Michigan', category: 'Midwest' },
  { label: 'New York', category: 'Northeast' },
  { label: 'Ohio', category: 'Midwest' },
  { label: 'Pennsylvania', category: 'Northeast' },
  { label: 'Texas', category: 'South' },
  { label: 'Washington', category: 'West' },
];

/**
 * AutocompleteDemo - Demonstrates dropdown/autocomplete keyboard patterns
 *
 * Keyboard patterns:
 * - Type: Filter options (typeahead)
 * - Arrow Down/Up: Navigate options
 * - Enter: Select highlighted option
 * - Esc: Close dropdown
 * - Home/End: Jump to first/last option
 */
export function AutocompleteDemo() {
  const theme = useTheme();
  const [singleValue, setSingleValue] = useState<Option | null>(null);
  const [multiValue, setMultiValue] = useState<Option[]>([]);
  const [lastAction, setLastAction] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        <strong>Type</strong> to filter options. Use <strong>Up/Down</strong> arrows to navigate,{' '}
        <strong>Enter</strong> to select, <strong>Esc</strong> to close, <strong>Home/End</strong> for first/last.
      </Typography>

      <Stack spacing={4}>
        {/* Single-select autocomplete */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Single Selection Autocomplete
          </Typography>
          <Autocomplete
            value={singleValue}
            onChange={(_, newValue) => {
              setSingleValue(newValue);
              setLastAction(newValue ? `Selected "${newValue.label}"` : 'Cleared selection');
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue) {
                setLastAction(`Typing: "${newInputValue}"`);
              }
            }}
            options={options}
            getOptionLabel={(option) => option.label}
            groupBy={(option) => option.category}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a state"
                placeholder="Type to search..."
                helperText="Type to filter, arrows to navigate, Enter to select"
              />
            )}
            renderOption={(props, option, { selected }) => (
              <Box
                component="li"
                {...props}
                sx={{
                  '&.Mui-focused': {
                    bgcolor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
                  },
                }}
              >
                {option.label}
              </Box>
            )}
            isOptionEqualToValue={(option, value) => option.label === value.label}
          />
        </Box>

        {/* Multi-select autocomplete */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Multi-Selection Autocomplete
          </Typography>
          <Autocomplete
            multiple
            value={multiValue}
            onChange={(_, newValue) => {
              setMultiValue(newValue);
              setLastAction(`Selected ${newValue.length} items`);
            }}
            options={options}
            getOptionLabel={(option) => option.label}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select states"
                placeholder="Type to search..."
                helperText="Space to toggle, Backspace to remove last tag"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  {...getTagProps({ index })}
                  size="small"
                  key={option.label}
                />
              ))
            }
            renderOption={(props, option, { selected }) => (
              <Box
                component="li"
                {...props}
                sx={{
                  '&.Mui-focused': {
                    bgcolor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
                      borderRadius: 0.5,
                      bgcolor: selected ? theme.palette.primary.main : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    {selected && '✓'}
                  </Box>
                  {option.label}
                </Box>
              </Box>
            )}
            isOptionEqualToValue={(option, value) => option.label === value.label}
          />
        </Box>

        {/* Keyboard shortcut reference */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.grey[500], 0.05),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Keyboard Shortcuts
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2">
              <strong>↑ / ↓</strong> - Navigate options
            </Typography>
            <Typography variant="body2">
              <strong>Enter</strong> - Select highlighted option
            </Typography>
            <Typography variant="body2">
              <strong>Escape</strong> - Close dropdown
            </Typography>
            <Typography variant="body2">
              <strong>Home / End</strong> - Jump to first/last option
            </Typography>
            <Typography variant="body2">
              <strong>Type</strong> - Filter options (typeahead)
            </Typography>
            <Typography variant="body2">
              <strong>Backspace</strong> - Remove last selected (multi-select)
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Single:</strong> {singleValue?.label || 'None'}
          {' | '}
          <strong>Multi:</strong> {multiValue.length > 0 ? multiValue.map(v => v.label).join(', ') : 'None'}
          {lastAction && (
            <>
              {' | '}
              <strong>Action:</strong> {lastAction}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default AutocompleteDemo;

export const autocompleteCode = `// Autocomplete Keyboard Navigation
// Type: Filter | Up/Down: Navigate | Enter: Select
// Esc: Close | Home/End: First/Last | Backspace: Remove

<Autocomplete
  value={value}
  onChange={(_, newValue) => setValue(newValue)}
  options={options}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField {...params} label="Select option" />
  )}
/>

// Multi-select with tags
<Autocomplete
  multiple
  value={values}
  onChange={(_, newValues) => setValues(newValues)}
  options={options}
  disableCloseOnSelect // Keep open for multi-select
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        label={option.label}
        {...getTagProps({ index })}
      />
    ))
  }
  renderInput={(params) => (
    <TextField {...params} label="Select options" />
  )}
/>`;
