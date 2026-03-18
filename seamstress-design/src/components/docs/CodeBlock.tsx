import React from 'react';
import { Paper, useTheme, alpha } from '@mui/material';

interface CodeBlockProps {
  children: string;
}

/**
 * Shared code block component for documentation pages.
 * Displays code with monospace font in a styled container.
 * Mobile-optimized with horizontal scroll and visual indicators.
 */
export function CodeBlock({ children }: CodeBlockProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        overflowX: 'auto',
        maxWidth: '100%',
        // Scrollbar styling for better visibility
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: alpha(theme.palette.common.black, 0.05),
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.common.black, 0.2),
          borderRadius: 4,
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.3),
          },
        },
        '& pre': {
          margin: 0,
          whiteSpace: 'pre',
          wordBreak: 'normal',
          overflowWrap: 'normal',
        },
      }}
    >
      <pre>{children}</pre>
    </Paper>
  );
}

export default CodeBlock;
