import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Drawer from './Drawer';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  TextField,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A customizable drawer component based on OpenGov design patterns.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the drawer is open or closed',
    },
    title: {
      control: 'text',
      description: 'The main title displayed in the drawer header',
    },
    subtitle: {
      control: 'text',
      description: 'The subtitle displayed below the title',
    },
    anchor: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'The side from which the drawer will appear',
    },
    width: {
      control: { type: 'number', min: 200, max: 800, step: 10 },
      description: 'The width of the drawer in pixels',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'Whether to show a backdrop behind the drawer',
    },
    hideHeader: {
      control: 'boolean',
      description: 'Hide the drawer header section',
    },
    hideFooter: {
      control: 'boolean',
      description: 'Hide the drawer footer/actions section',
    },
    contentPadding: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Padding for the content area',
    },
    inPage: {
      control: 'boolean',
      description: 'Display as an in-page persistent drawer instead of overlay',
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with list content
export const Default: Story = {
  args: {
    open: true,
    title: 'Saved Views',
    subtitle: 'Manage your saved views and filters',
    width: 567,
    anchor: 'right',
    showBackdrop: true,
    hideHeader: false,
    hideFooter: false,
    contentPadding: 3,
    primaryAction: {
      label: 'Save',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => {},
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={2}>
            <Typography variant="h6">Saved Views</Typography>
            <List>
              {['My Tasks', 'Team Projects', 'Recent Documents', 'Archived Items'].map((text, index) => (
                <ListItem key={text} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    secondary={`${10 + index * 5} items`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              fullWidth
            >
              Save Current View
            </Button>
          </Stack>
        </Drawer>
      </>
    );
  },
};

// Drawer with tabs
export const WithTabs: Story = {
  args: {
    ...Default.args,
    title: 'Settings',
    subtitle: 'Configure your application settings',
    tabs: [
      { label: 'General', value: 'general' },
      { label: 'Notifications', value: 'notifications' },
      { label: 'Security', value: 'security' },
    ],
    activeTab: 'general',
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    const [activeTab, setActiveTab] = useState(args.activeTab);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    React.useEffect(() => {
      setActiveTab(args.activeTab);
    }, [args.activeTab]);

    const renderTabContent = () => {
      switch (activeTab) {
        case 'general':
          return (
            <Stack spacing={3}>
              <TextField label="Display Name" fullWidth defaultValue="John Doe" />
              <TextField label="Email" fullWidth defaultValue="john.doe@example.com" />
              <FormControl fullWidth>
                <FormLabel>Theme</FormLabel>
                <RadioGroup defaultValue="light">
                  <FormControlLabel value="light" control={<Radio />} label="Light" />
                  <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                  <FormControlLabel value="system" control={<Radio />} label="System" />
                </RadioGroup>
              </FormControl>
            </Stack>
          );
        case 'notifications':
          return (
            <Stack spacing={2}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Email notifications" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Push notifications" />
              <FormControlLabel control={<Checkbox />} label="SMS notifications" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="In-app notifications" />
            </Stack>
          );
        case 'security':
          return (
            <Stack spacing={3}>
              <Button variant="outlined" fullWidth>Change Password</Button>
              <Button variant="outlined" fullWidth>Enable Two-Factor Authentication</Button>
              <Button variant="outlined" fullWidth>Manage Sessions</Button>
              <Button variant="outlined" color="error" fullWidth>Delete Account</Button>
            </Stack>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Settings
        </Button>
        <Drawer
          {...args}
          open={open}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setOpen(false)}
          actions={
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          }
        >
          {renderTabContent()}
        </Drawer>
      </>
    );
  },
};

// Form drawer
export const FormDrawer: Story = {
  args: {
    ...Default.args,
    title: 'Create New Item',
    subtitle: 'Fill in the details below',
    primaryAction: {
      label: 'Create',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => {},
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Create New
        </Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={3}>
            <TextField label="Name" fullWidth required />
            <TextField label="Description" fullWidth multiline rows={4} />
            <FormControl fullWidth>
              <FormLabel>Category</FormLabel>
              <Select defaultValue="general">
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <RadioGroup defaultValue="medium">
                <FormControlLabel value="high" control={<Radio />} label="High" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="low" control={<Radio />} label="Low" />
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox />} label="Mark as important" />
          </Stack>
        </Drawer>
      </>
    );
  },
};

// With destructive action
export const WithDestructiveAction: Story = {
  args: {
    ...Default.args,
    title: 'Manage Items',
    subtitle: 'Select items to manage',
    primaryAction: {
      label: 'Save Changes',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => {},
    },
    destructiveAction: {
      label: 'Delete All',
      onClick: () => {},
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Manage Items
        </Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={2}>
            <Typography variant="body1">
              Select the items you want to manage. Use the destructive action button below to delete all selected items.
            </Typography>
            <List>
              {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((text) => (
                <ListItem key={text} sx={{ pl: 0 }}>
                  <Checkbox />
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Stack>
        </Drawer>
      </>
    );
  },
};

// No header/footer
export const Minimal: Story = {
  args: {
    ...Default.args,
    hideHeader: true,
    hideFooter: true,
    contentPadding: 0,
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Minimal Drawer
        </Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Custom Content</Typography>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Stack>
              <Typography variant="body1">
                This is a minimal drawer without header and footer. You have full control over the content.
              </Typography>
              <Box sx={{ height: 300, bgcolor: 'grey.100', borderRadius: 1, p: 2 }}>
                <Typography color="text.secondary">
                  Custom content area
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </>
    );
  },
};

// In-page drawer variant
export const InPageDrawer: Story = {
  args: {
    open: true,
    title: 'In-Page Drawer',
    subtitle: 'This drawer is embedded in the page layout',
    width: 420,
    inPage: true,
    primaryAction: {
      label: 'Save',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => {},
    },
    tabs: [
      { label: 'Details', value: 'details' },
      { label: 'History', value: 'history' },
      { label: 'Settings', value: 'settings' },
    ],
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    const [activeTab, setActiveTab] = useState('details');

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    const renderTabContent = () => {
      switch (activeTab) {
        case 'details':
          return (
            <Stack spacing={3}>
              <TextField label="Name" fullWidth defaultValue="Project Alpha" />
              <TextField label="Description" fullWidth multiline rows={3} defaultValue="Main project description" />
              <TextField label="Owner" fullWidth defaultValue="John Smith" />
              <FormControl fullWidth>
                <FormLabel>Status</FormLabel>
                <Select defaultValue="active">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          );
        case 'history':
          return (
            <List>
              {['Created on Jan 15, 2024', 'Modified on Jan 20, 2024', 'Last accessed on Jan 25, 2024'].map((text) => (
                <ListItem key={text} sx={{ pl: 0 }}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          );
        case 'settings':
          return (
            <Stack spacing={2}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Enable notifications" />
              <FormControlLabel control={<Checkbox />} label="Public access" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Auto-save" />
            </Stack>
          );
        default:
          return null;
      }
    };

    return (
      <Box sx={{ display: 'flex', gap: 3, height: 600, p: 3, bgcolor: 'grey.50' }}>
        <Box sx={{ flex: 1, bgcolor: 'background.paper', borderRadius: 1, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Main Content Area
          </Typography>
          <Typography variant="body1" paragraph>
            This demonstrates an in-page drawer that sits alongside the main content.
            The drawer is persistent and doesn't overlay the page.
          </Typography>
          <Button variant="contained" onClick={() => setOpen(!open)}>
            {open ? 'Hide' : 'Show'} Side Panel
          </Button>
        </Box>
        <Drawer
          {...args}
          open={open}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setOpen(false)}
        >
          {renderTabContent()}
        </Drawer>
      </Box>
    );
  },
};