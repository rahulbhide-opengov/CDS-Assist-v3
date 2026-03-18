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
import { Keyboard as KeyboardIcon } from '@mui/icons-material';
import { DocsLayout } from '../../../components/DocsLayout';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import KeyboardAccessibilityContent from './KeyboardAccessibilityContent';

export default function KeyboardAccessibilityPage() {
  const theme = useTheme();

  useDocumentTitle('Keyboard Accessibility');

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <KeyboardIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              <Typography variant="h1" component="h1">
                Keyboard Accessibility
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 700 }}>
              Comprehensive keyboard navigation patterns for building inclusive interfaces.
              These patterns ensure all users can navigate and interact with components
              using only a keyboard, essential for users with motor impairments or those
              who prefer keyboard navigation.
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
              <Chip label="Screen Reader Compatible" color="primary" />
              <Chip label="Focus Management" color="info" />
              <Chip label="Arrow Key Navigation" />
            </Stack>
          </Container>
        </Box>

        {/* Content */}
        <KeyboardAccessibilityContent />
      </Box>
    </DocsLayout>
  );
}
