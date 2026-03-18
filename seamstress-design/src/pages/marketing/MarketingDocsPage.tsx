/**
 * MarketingDocsPage
 *
 * Documentation page showcasing the marketing design system,
 * including design tokens, component primitives, and a media gallery.
 *
 * Route: /marketing/docs
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Chip,
} from '@mui/material';
import {
  DesignTokensSection,
  ComponentsShowcase,
  MediaGallery,
  ThemeManagerSection,
} from '../../components/marketing/docs';
import { useMarketingTheme } from '../../contexts/MarketingThemeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`docs-tabpanel-${index}`}
    aria-labelledby={`docs-tab-${index}`}
  >
    {value === index && children}
  </Box>
);

function a11yProps(index: number) {
  return {
    id: `docs-tab-${index}`,
    'aria-controls': `docs-tabpanel-${index}`,
  };
}

const tabs = [
  { label: 'Design Tokens', hash: '#tokens' },
  { label: 'Components', hash: '#components' },
  { label: 'Media Gallery', hash: '#media' },
  { label: 'Theme Manager', hash: '#themes' },
];

export default function MarketingDocsPage() {
  const { marketingColors } = useMarketingTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Sync with URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const tabIndex = tabs.findIndex((t) => t.hash === hash);
    if (tabIndex >= 0) {
      setActiveTab(tabIndex);
    }
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    window.history.replaceState(null, '', tabs[newValue].hash);
  };

  return (
    <Box sx={{ bgcolor: marketingColors.background, transition: 'background-color 0.3s ease' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: marketingColors.surface,
          borderBottom: `1px solid ${marketingColors.border}`,
          pt: 8,
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, color: marketingColors.foreground }}
          >
            Marketing Design System
          </Typography>
          <Typography variant="h5" paragraph sx={{ maxWidth: 800, color: marketingColors.muted }}>
            Design tokens, primitives, and media assets for building consistent OpenGov marketing pages
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Chip label="12 Components" color="primary" />
            <Chip label="146 Images" color="info" />
            <Chip label="TypeScript" />
          </Stack>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Documentation sections"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mt: 4 }}
          >
            <Tab
              iconPosition="start"
              label="Design Tokens"
              {...a11yProps(0)}
            />
            <Tab
              iconPosition="start"
              label="Components"
              {...a11yProps(1)}
            />
            <Tab
              iconPosition="start"
              label="Media Gallery"
              {...a11yProps(2)}
            />
            <Tab
              iconPosition="start"
              label="Theme Manager"
              {...a11yProps(3)}
            />
          </Tabs>
        </Container>
      </Box>

      {/* Tab Content */}
      <Container maxWidth="lg" sx={{ py: 6, color: marketingColors.foreground }}>
        <TabPanel value={activeTab} index={0}>
          <DesignTokensSection />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ComponentsShowcase />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <MediaGallery />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <ThemeManagerSection />
        </TabPanel>
      </Container>
    </Box>
  );
}
