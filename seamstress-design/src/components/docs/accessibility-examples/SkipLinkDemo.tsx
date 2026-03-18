import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Stack, Paper, alpha, useTheme } from '@mui/material';

/**
 * SkipLinkDemo - Demonstrates skip link pattern
 *
 * Keyboard patterns:
 * - Tab: Reveals skip link (first focusable element)
 * - Enter: Activates skip link to jump to main content
 */
export function SkipLinkDemo() {
  const theme = useTheme();
  const [skipLinkUsed, setSkipLinkUsed] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string>('');
  const mainContentRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const handleSkipLink = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setSkipLinkUsed(true);
    mainContentRef.current?.focus();
  };

  const resetDemo = () => {
    setSkipLinkUsed(false);
    setFocusedElement('');
    startButtonRef.current?.focus();
  };

  const handleFocus = (elementName: string) => () => {
    setFocusedElement(elementName);
  };

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  };

  // Skip link styles - visible only on focus
  const skipLinkSx = {
    position: 'absolute',
    left: '-9999px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    zIndex: 100,
    '&:focus': {
      position: 'static',
      left: 'auto',
      width: 'auto',
      height: 'auto',
      overflow: 'visible',
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click "Start Demo" then press <strong>Tab</strong> to reveal the skip link.
        Press <strong>Enter</strong> on the skip link to jump past the navigation.
      </Typography>

      {/* Demo container with simulated page structure */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Skip Link - hidden until focused */}
        <Box
          component="a"
          href="#main-content-demo"
          onClick={handleSkipLink}
          onKeyDown={(e) => e.key === 'Enter' && handleSkipLink(e)}
          onFocus={handleFocus('Skip Link')}
          tabIndex={0}
          sx={{
            ...skipLinkSx,
            display: 'block',
            p: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Skip to main content
        </Box>

        {/* Simulated Header/Nav */}
        <Box
          sx={{
            bgcolor: alpha(theme.palette.grey[500], 0.1),
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            SIMULATED NAVIGATION
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              ref={startButtonRef}
              size="small"
              variant="outlined"
              onClick={resetDemo}
              onFocus={handleFocus('Start Demo')}
              sx={focusIndicatorSx}
            >
              Start Demo
            </Button>
            <Button
              size="small"
              variant="text"
              onFocus={handleFocus('Nav Item 1')}
              sx={focusIndicatorSx}
            >
              Nav Item 1
            </Button>
            <Button
              size="small"
              variant="text"
              onFocus={handleFocus('Nav Item 2')}
              sx={focusIndicatorSx}
            >
              Nav Item 2
            </Button>
            <Button
              size="small"
              variant="text"
              onFocus={handleFocus('Nav Item 3')}
              sx={focusIndicatorSx}
            >
              Nav Item 3
            </Button>
            <Button
              size="small"
              variant="text"
              onFocus={handleFocus('Nav Item 4')}
              sx={focusIndicatorSx}
            >
              Nav Item 4
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box
          ref={mainContentRef}
          id="main-content-demo"
          tabIndex={-1}
          onFocus={handleFocus('Main Content')}
          sx={{
            p: 3,
            minHeight: 120,
            ...focusIndicatorSx,
          }}
          role="main"
          aria-label="Main content area"
        >
          <Typography variant="h6" gutterBottom>
            Main Content Area
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {skipLinkUsed
              ? 'You used the skip link to jump directly here, bypassing the navigation!'
              : 'Tab through the navigation items, or use the skip link to jump directly here.'}
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2, ...focusIndicatorSx }}
            onFocus={handleFocus('Main Action Button')}
          >
            Main Action Button
          </Button>
        </Box>

        {/* Status */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
          role="status"
          aria-live="polite"
        >
          <Typography variant="body2">
            <strong>Currently focused:</strong> {focusedElement || 'None'}
          </Typography>
          {skipLinkUsed && (
            <Typography variant="body2" color="success.main">
              Skip link used successfully!
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default SkipLinkDemo;

export const skipLinkCode = `// Skip Link Pattern
// First focusable element on page, hidden until focused

// CSS to hide skip link until focused
const skipLinkSx = {
  position: 'absolute',
  left: '-9999px',
  '&:focus': {
    position: 'static',
    left: 'auto',
  },
};

// Skip link component
<a
  href="#main-content"
  onClick={(e) => {
    e.preventDefault();
    mainContentRef.current?.focus();
  }}
  sx={skipLinkSx}
>
  Skip to main content
</a>

// Navigation items...
<nav>...</nav>

// Main content with tabIndex for focus target
<main
  ref={mainContentRef}
  id="main-content"
  tabIndex={-1} // Allows programmatic focus
>
  Main content here
</main>`;
