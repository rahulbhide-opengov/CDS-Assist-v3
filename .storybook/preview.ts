import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// CDS theme: import { theme } from '../src/theme';
// Fallback for projects without src/theme
const theme = createTheme();


const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'CDS is light mode only; dark mode for contrast testing.',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeMode = context.globals.theme ?? 'light';
      const currentTheme =
        themeMode === 'dark'
          ? createTheme({ ...theme, palette: { ...theme.palette, mode: 'dark' } })
          : theme;

      return (
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
