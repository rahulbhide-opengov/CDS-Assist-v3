import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Stack,
  Button,
  Chip
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Result } from '@opengov/components-result';
import { Plus } from '@opengov/react-capital-assets';
import AIChat from '../components/AIChat';
import FileUploadExample from '../components/FileUploadExample';
import PaginationExample from '../components/PaginationExample';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
};

const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Page Header using OpenGov component */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button key="docs" variant="outlined" size="medium">
              View Docs
            </Button>
          ]}
        >
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              { path: '/', title: 'Home' },
              { path: '/dashboard', title: 'Dashboard' },
              { title: 'Component Showcase' }
            ]}
          />
          <PageHeaderComposable.Title
            status={<Chip label="OpenGov v37" color="primary" size="small" />}
          >
            OpenGov Component Showcase
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Demonstration of all OpenGov packages integrated with Seamstress
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ px: 3, pb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Page Headers" />
            <Tab label="Empty States" />
            <Tab label="AI Components" />
            <Tab label="File Management" />
            <Tab label="Pagination" />
            <Tab label="Icons" />
          </Tabs>

          {/* Page Headers Tab */}
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h5" gutterBottom>
              Page Header Component
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/components-page-header
            </Typography>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                The PageHeaderComposable component provides:
              </Typography>
              <ul>
                <li>Breadcrumb navigation</li>
                <li>Title with optional status chip</li>
                <li>Description text</li>
                <li>Action buttons placement</li>
                <li>Responsive layout</li>
              </ul>
              <Typography variant="body2" color="text.secondary">
                See the header at the top of this page for a live example.
              </Typography>
            </Paper>
          </TabPanel>

          {/* Empty States Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h5" gutterBottom>
              Result Component (Empty/Error States)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/components-result
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Result
                  status="empty"
                  title="No data available"
                  description="This is an example of an empty state using the Result component"
                  actions={[
                    <Button key="add" variant="contained" startIcon={<Plus />}>
                      Add First Item
                    </Button>
                  ]}
                />
              </Paper>

              <Paper variant="outlined" sx={{ p: 3 }}>
                <Result
                  status="error"
                  title="Something went wrong"
                  description="This is an example of an error state"
                  actions={[
                    <Button key="retry" variant="outlined">
                      Retry
                    </Button>,
                    <Button key="support" variant="text">
                      Contact Support
                    </Button>
                  ]}
                />
              </Paper>

              <Paper variant="outlined" sx={{ p: 3 }}>
                <Result
                  status="success"
                  title="Operation successful"
                  description="Your changes have been saved"
                />
              </Paper>
            </Stack>
          </TabPanel>

          {/* AI Components Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h5" gutterBottom>
              AI Components
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/components-ai-patterns
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, height: 500 }}>
              <AIChat />
            </Paper>
          </TabPanel>

          {/* File Management Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h5" gutterBottom>
              File Management
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/components-file-management
            </Typography>

            <FileUploadExample />
          </TabPanel>

          {/* Pagination Tab */}
          <TabPanel value={activeTab} index={4}>
            <Typography variant="h5" gutterBottom>
              Pagination
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/components-pagination
            </Typography>

            <PaginationExample />
          </TabPanel>

          {/* Icons Tab */}
          <TabPanel value={activeTab} index={5}>
            <Typography variant="h5" gutterBottom>
              Capital Icons
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              From: @opengov/react-capital-assets
            </Typography>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                OpenGov provides a comprehensive icon library through @opengov/react-capital-assets.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" startIcon={<Plus />}>
                  Add Item (Plus icon)
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Import icons as: {`import { Plus, Pencil, Trash } from '@opengov/react-capital-assets'`}
              </Typography>
            </Paper>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default ComponentShowcase;