/**
 * Gen UX Component: Application Success
 * Shows success message with completed/pending items and downloadable resources
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';

interface DownloadableResource {
  name: string;
  type: string;
}

interface ApplicationSuccessProps {
  applicationId?: string;
  status?: string;
  expiresIn?: string;
  completedItems?: string[];
  pendingItems?: string[];
  downloadableResources?: DownloadableResource[];
}

export const ApplicationSuccess: React.FC<ApplicationSuccessProps> = ({
  applicationId = '#2024-DECK-0123',
  status = 'Draft - Pending Completion',
  expiresIn = '30 days',
  completedItems = [],
  pendingItems = [],
  downloadableResources = [],
}) => {
  const handleDownload = (resourceName: string) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', resourceName);
  };

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'success.light',
        borderRadius: 1,
        boxShadow: 'none',
        bgcolor: 'success.lighter',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Success Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 600, mb: 0.5 }}>
              Draft Application Created!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Application ID: <strong>{applicationId}</strong>
            </Typography>
          </Box>
        </Stack>

        {/* Status and Expiration */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            label={status}
            sx={{
              bgcolor: 'warning.lighter',
              color: 'warning.dark',
              fontWeight: 600,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Expires in <strong>{expiresIn}</strong>
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Progress Sections */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'success.dark' }}>
            ✓ Completed Items
          </Typography>
          <Stack spacing={1}>
            {completedItems.map((item, index) => (
              <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'warning.dark' }}>
            ○ Pending Items
          </Typography>
          <Stack spacing={1}>
            {pendingItems.map((item, index) => (
              <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Downloadable Resources */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            📥 Helpful Resources
          </Typography>
          <Stack spacing={1}>
            {downloadableResources.map((resource, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                startIcon={<ArticleIcon />}
                endIcon={<DownloadIcon />}
                onClick={() => handleDownload(resource.name)}
                sx={{
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {resource.name}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Next Steps */}
        <Box
          sx={{
            mt: 3,
            p: 1.5,
            bgcolor: 'white',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '13px', color: 'text.secondary' }}>
            <strong>Next Steps:</strong> Complete the pending items above and submit your
            application when ready. You can access your draft anytime from your dashboard.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
