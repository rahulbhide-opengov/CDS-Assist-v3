/**
 * Workspace Layout
 * 3-column responsive layout for Agent Studio Workspace
 */

import React from 'react';
import { Box } from '@mui/material';

interface WorkspaceLayoutProps {
  chatColumn: React.ReactNode;
  contextColumn: React.ReactNode;
  insightsColumn: React.ReactNode;
  outputArea?: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  chatColumn,
  contextColumn,
  insightsColumn,
  outputArea,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 3-Column Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          p: 3,
        }}
      >
        {/* Column 1: Chat */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {chatColumn}
        </Box>

        {/* Column 2: Context & Activity */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {contextColumn}
        </Box>

        {/* Column 3: Insights & Actions */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {insightsColumn}
        </Box>
      </Box>

      {/* Output Area (appears below columns) */}
      {outputArea && (
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          {outputArea}
        </Box>
      )}
    </Box>
  );
};
