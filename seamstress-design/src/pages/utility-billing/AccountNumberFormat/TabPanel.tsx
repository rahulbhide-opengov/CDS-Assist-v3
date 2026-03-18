import React from 'react';
import { Box } from '@mui/material';
import type { TabPanelProps } from './types';

// ============================================================================
// TAB PANEL COMPONENT
// ============================================================================

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`format-tabpanel-${index}`}
      aria-labelledby={`format-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ backgroundColor: 'grey.50', minHeight: '100%', height: '100%' }}>
          <Box sx={{ px: 3, pt: 3, pb: 4 }}>{children}</Box>
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `format-tab-${index}`,
    'aria-controls': `format-tabpanel-${index}`,
  };
}
