/**
 * Gen UX Component: Application Requirements
 * Shows permit timeline, fees, and required documents checklist
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
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DescriptionIcon from '@mui/icons-material/Description';

interface RequiredDoc {
  name: string;
  status: 'needed' | 'optional';
  description: string;
}

interface ApplicationRequirementsProps {
  timeline?: string;
  estimatedFee?: number;
  requiredDocs?: RequiredDoc[];
}

export const ApplicationRequirements: React.FC<ApplicationRequirementsProps> = ({
  timeline = '5-10 business days',
  estimatedFee = 210,
  requiredDocs = [],
}) => {
  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600, mb: 2 }}>
          📋 Application Overview
        </Typography>

        {/* Timeline and Fee Grid */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Processing Time
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 500 }}>
              {timeline}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <AttachMoneyIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Estimated Fee
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 500 }}>
              ${estimatedFee}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Required Documents */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Required Documents
        </Typography>

        <Stack spacing={2}>
          {requiredDocs.map((doc, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                bgcolor: doc.status === 'needed' ? 'warning.lighter' : 'grey.50',
                border: '1px solid',
                borderColor: doc.status === 'needed' ? 'warning.light' : 'divider',
              }}
            >
              {/* Status Icon */}
              {doc.status === 'needed' ? (
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 20, color: 'warning.main', mt: 0.25 }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 20, color: 'success.main', mt: 0.25 }}
                />
              )}

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <DescriptionIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {doc.name}
                  </Typography>
                  {doc.status === 'optional' && (
                    <Chip
                      label="Optional"
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '11px',
                        bgcolor: 'success.lighter',
                        color: 'success.dark',
                      }}
                    />
                  )}
                  {doc.status === 'needed' && (
                    <Chip
                      label="Required"
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '11px',
                        bgcolor: 'warning.lighter',
                        color: 'warning.dark',
                      }}
                    />
                  )}
                </Stack>
                <Typography variant="body2" sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  {doc.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Help Text */}
        <Box
          sx={{
            mt: 3,
            p: 1.5,
            bgcolor: 'info.lighter',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'info.light',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '13px', color: 'info.dark' }}>
            💡 <strong>Tip:</strong> You can save your application as a draft and complete it later.
            Drafts are automatically saved for 30 days.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
