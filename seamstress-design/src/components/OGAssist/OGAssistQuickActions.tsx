import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface OGAssistQuickActionsProps {
  onActionClick: (action: string) => void;
}

export const OGAssistQuickActions: React.FC<OGAssistQuickActionsProps> = ({ onActionClick }) => {
  const quickAction = {
    id: 'budget-analysis',
    label: 'Start Budget Analysis',
    icon: <TrendingUpIcon />,
    message: 'Analyze my budget variances',
    description: 'Begin a step-by-step budget variance analysis',
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', mx: 'auto' }}>
      <Typography
        variant="h5"
        sx={{
          fontSize: '22px',
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Budget & Planning Agent Demo
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 4,
          textAlign: 'center',
          fontSize: '14px',
        }}
      >
        Experience how AI can transform your budget analysis workflow
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => onActionClick(quickAction.message)}
          startIcon={quickAction.icon}
          sx={{
            py: 2,
            px: 3,
            bgcolor: 'primary.main',
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: '0px 4px 12px rgba(75, 63, 255, 0.25)',
            },
          }}
        >
          {quickAction.label}
        </Button>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mt: 2,
            display: 'block',
            fontSize: '12px',
          }}
        >
          This interactive demo will guide you through 5 steps to identify and resolve budget issues
        </Typography>
      </Stack>
    </Box>
  );
};