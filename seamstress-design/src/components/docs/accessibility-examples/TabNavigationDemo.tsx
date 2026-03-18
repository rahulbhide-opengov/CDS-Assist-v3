import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Link, Stack, Typography, alpha, useTheme } from '@mui/material';

/**
 * TabNavigationDemo - Demonstrates Tab, Shift+Tab, Enter, and Space keyboard navigation
 *
 * Keyboard patterns:
 * - Tab: Move to next focusable element
 * - Shift+Tab: Move to previous focusable element
 * - Enter: Activate buttons and links
 * - Space: Toggle checkboxes, activate buttons
 */
export function TabNavigationDemo() {
  const theme = useTheme();
  const [checkboxes, setCheckboxes] = useState({ a: false, b: false, c: false });
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('No action yet');
  const startRef = useRef<HTMLButtonElement>(null);

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxes(prev => ({ ...prev, [name]: event.target.checked }));
    setLastAction(`Checkbox ${name.toUpperCase()} ${event.target.checked ? 'checked' : 'unchecked'}`);
  };

  const handleButtonClick = (buttonName: string) => () => {
    setClickCount(prev => prev + 1);
    setLastAction(`${buttonName} activated`);
  };

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Tab</strong> to move forward, <strong>Shift+Tab</strong> to move backward.
        Press <strong>Enter</strong> or <strong>Space</strong> on buttons, <strong>Space</strong> on checkboxes.
      </Typography>

      <Stack spacing={3}>
        {/* Row 1: Buttons */}
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button
            ref={startRef}
            variant="contained"
            onClick={handleButtonClick('Primary Button')}
            sx={focusIndicatorSx}
          >
            Primary Button
          </Button>
          <Button
            variant="outlined"
            onClick={handleButtonClick('Secondary Button')}
            sx={focusIndicatorSx}
          >
            Secondary Button
          </Button>
          <Button
            variant="text"
            onClick={handleButtonClick('Text Button')}
            sx={focusIndicatorSx}
          >
            Text Button
          </Button>
        </Stack>

        {/* Row 2: Checkboxes */}
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkboxes.a}
                onChange={handleCheckboxChange('a')}
                sx={focusIndicatorSx}
              />
            }
            label="Option A"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkboxes.b}
                onChange={handleCheckboxChange('b')}
                sx={focusIndicatorSx}
              />
            }
            label="Option B"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkboxes.c}
                onChange={handleCheckboxChange('c')}
                sx={focusIndicatorSx}
              />
            }
            label="Option C"
          />
        </Stack>

        {/* Row 3: Text field and link */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField
            label="Text Input"
            size="small"
            placeholder="Tab here to focus"
            sx={{ minWidth: 200, ...focusIndicatorSx }}
          />
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick('Link')();
            }}
            sx={{
              ...focusIndicatorSx,
              cursor: 'pointer',
            }}
          >
            Sample Link
          </Link>
        </Stack>

        {/* Status display */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          }}
          role="status"
          aria-live="polite"
        >
          <Typography variant="body2">
            <strong>Last action:</strong> {lastAction}
          </Typography>
          <Typography variant="body2">
            <strong>Button clicks:</strong> {clickCount}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default TabNavigationDemo;

export const tabNavigationCode = `// Tab Navigation Demo
// Tab: Move to next element | Shift+Tab: Move backward
// Enter/Space: Activate buttons | Space: Toggle checkboxes

<Stack spacing={3}>
  {/* Buttons - activate with Enter or Space */}
  <Stack direction="row" spacing={2}>
    <Button variant="contained" onClick={handleClick}>
      Primary Button
    </Button>
    <Button variant="outlined" onClick={handleClick}>
      Secondary Button
    </Button>
  </Stack>

  {/* Checkboxes - toggle with Space */}
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={handleChange} />}
    label="Option A"
  />

  {/* Text field - Tab to focus */}
  <TextField label="Text Input" />

  {/* Link - activate with Enter */}
  <Link href="#">Sample Link</Link>
</Stack>`;
