import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { PhoneAndroid as PhoneAndroidIcon } from '@mui/icons-material';
import { DocsLayout } from '../../../components/DocsLayout';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import MobileAccessibilityContent from './MobileAccessibilityContent';

export default function MobileAccessibilityPage() {
  const theme = useTheme();

  useDocumentTitle('Mobile Accessibility');

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PhoneAndroidIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
              <Typography variant="h1" component="h1">
                Mobile Accessibility
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 700 }}>
              Guidelines for building accessible mobile experiences. These patterns ensure
              touch interfaces work for all users, including those using screen readers,
              voice control, or with motor impairments that affect touch accuracy.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 4,
                flexWrap: 'wrap',
                gap: 1.5,
                '& .MuiChip-root': {
                  height: 36,
                  fontSize: '0.875rem',
                },
              }}
            >
              <Chip label="WCAG 2.1 AA" color="success" />
              <Chip label="Touch Optimized" color="secondary" />
              <Chip label="44px Touch Targets" color="info" />
              <Chip label="Screen Reader Support" />
            </Stack>
          </Container>
        </Box>

        {/* Content */}
        <MobileAccessibilityContent />
      </Box>
    </DocsLayout>
  );
}
