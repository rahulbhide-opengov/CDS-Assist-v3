/**
 * MarketingLayout
 *
 * Layout wrapper for marketing pages.
 * Includes MarketingNavigation and MarketingFooter.
 * Does NOT use BaseLayout (marketing has a different nav paradigm).
 */

import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import MarketingNavigation from './MarketingNavigation';
import MarketingFooter from './MarketingFooter';
import PageTransition from '../PageTransition';
import { MarketingThemeProvider } from '../../contexts/MarketingThemeContext';

/**
 * Inner layout that uses the marketing theme context
 */
const MarketingLayoutContent: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      <MarketingNavigation />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Box>
      <MarketingFooter />
    </Box>
  );
};

/**
 * Marketing layout wrapped with theme provider
 */
const MarketingLayout: React.FC = () => {
  return (
    <MarketingThemeProvider>
      <MarketingLayoutContent />
    </MarketingThemeProvider>
  );
};

export default MarketingLayout;
