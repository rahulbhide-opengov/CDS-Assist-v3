import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BaseLayout } from './BaseLayout';
import { procurementLayoutConfig } from '../config/procurementNavBarConfig';
import { useDataSeeding } from '../hooks/procurement/useDataSeeding';

interface ProcurementLayoutProps {
  children: React.ReactNode;
}

export function ProcurementLayout({ children }: ProcurementLayoutProps) {
  // Initialize procurement data seeding when the layout mounts
  const { isSeeding, isSeeded, error } = useDataSeeding(true);

  // Show loading state while seeding data
  if (isSeeding && !isSeeded) {
    return (
      <BaseLayout config={procurementLayoutConfig}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Initializing procurement data...
          </Typography>
        </Box>
      </BaseLayout>
    );
  }

  // Show error state if seeding failed
  if (error) {
    return (
      <BaseLayout config={procurementLayoutConfig}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Failed to initialize data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      </BaseLayout>
    );
  }

  return <BaseLayout config={procurementLayoutConfig}>{children}</BaseLayout>;
}
