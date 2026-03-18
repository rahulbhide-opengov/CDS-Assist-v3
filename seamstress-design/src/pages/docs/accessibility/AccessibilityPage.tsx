import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Keyboard as KeyboardIcon,
  PhoneAndroid as PhoneAndroidIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { DocsLayout } from '../../../components/DocsLayout';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

// Import the content components
import KeyboardAccessibilityContent from './KeyboardAccessibilityContent';
import MobileAccessibilityContent from './MobileAccessibilityContent';

interface TopLevelTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TopLevelTabPanel({ children, value, index, ...other }: TopLevelTabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`accessibility-tabpanel-${index}`}
      aria-labelledby={`accessibility-tab-${index}`}
      tabIndex={-1}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `accessibility-tab-${index}`,
    'aria-controls': `accessibility-tabpanel-${index}`,
  };
}

// Map hash values to tab indices
const hashToTabIndex: Record<string, number> = {
  '#keyboard': 0,
  '#mobile': 1,
};

// Map tab indices to hash values
const tabIndexToHash: Record<number, string> = {
  0: '#keyboard',
  1: '#mobile',
};

function getInitialTabFromHash(): number {
  if (typeof window === 'undefined') return 0;
  const hash = window.location.hash;
  return hashToTabIndex[hash] ?? 0;
}

export default function AccessibilityPage() {
  const theme = useTheme();
  const location = useLocation();
  const [topLevelTab, setTopLevelTab] = useState(getInitialTabFromHash);

  useDocumentTitle('Accessibility Guidelines');

  // Sync tab state with URL hash when location changes (React Router navigation)
  useEffect(() => {
    const hash = location.hash;
    const newTab = hashToTabIndex[hash] ?? 0;
    setTopLevelTab(newTab);
  }, [location.hash]);

  // Also handle native hashchange events (browser back/forward, direct hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getInitialTabFromHash();
      setTopLevelTab(newTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTopLevelTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTopLevelTab(newValue);
    // Update URL hash without triggering a full navigation
    const newHash = tabIndexToHash[newValue] || '';
    if (newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, []);

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 50%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <AccessibilityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              <Typography variant="h1" component="h1">
                Accessibility Guidelines
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 700 }}>
              Comprehensive accessibility guidelines for designing inclusive interfaces.
              These patterns ensure all users can navigate and interact with our components,
              whether using keyboards, screen readers, or mobile devices.
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
              <Chip label="Touch Optimized" color="secondary" />
              <Chip label="Keyboard Accessible" />
            </Stack>

            {/* Top-Level Tab Navigation */}
            <Tabs
              value={topLevelTab}
              onChange={handleTopLevelTabChange}
              aria-label="Accessibility sections"
              sx={{
                mt: 4,
                '& .MuiTab-root': {
                  minHeight: 56,
                  minWidth: { xs: 120, sm: 160 },
                  px: { xs: 2, sm: 4 },
                  fontSize: '1rem',
                  fontWeight: 600,
                },
              }}
            >
              <Tab
                icon={<KeyboardIcon />}
                iconPosition="start"
                label="Keyboard"
                {...a11yProps(0)}
              />
              <Tab
                icon={<PhoneAndroidIcon />}
                iconPosition="start"
                label="Mobile"
                {...a11yProps(1)}
              />
            </Tabs>
          </Container>
        </Box>

        {/* Tab Content */}
        <TopLevelTabPanel value={topLevelTab} index={0}>
          <KeyboardAccessibilityContent />
        </TopLevelTabPanel>

        <TopLevelTabPanel value={topLevelTab} index={1}>
          <MobileAccessibilityContent />
        </TopLevelTabPanel>
      </Box>
    </DocsLayout>
  );
}
