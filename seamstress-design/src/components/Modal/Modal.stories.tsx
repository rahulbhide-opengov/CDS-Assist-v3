import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Modal from './Modal';
import {
  Button,
  Typography,
  TextField,
  Stack,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component with multiple size variants and action configurations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed',
    },
    title: {
      control: 'text',
      description: 'The main title displayed in the modal header',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle displayed below the title',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Size variant of the modal',
    },
    hideCloseButton: {
      control: 'boolean',
      description: 'Hide the close button in the header',
    },
    disableBackdropClick: {
      control: 'boolean',
      description: 'Disable closing the modal by clicking the backdrop',
    },
    contentPadding: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Padding for the content area',
    },
    drawerWidth: {
      control: { type: 'number', min: 200, max: 500, step: 10 },
      description: 'Width of the drawer panel',
    },
    splitView: {
      control: 'boolean',
      description: 'Enable split view mode (50/50 layout)',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic modal
export const Default: Story = {
  args: {
    open: true,
    title: 'Modal Title',
    subtitle: 'This is a subtitle that provides additional context',
    size: 'small',
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
          Open Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={2}>
            <Typography variant="body1">
              This is the modal content. You can put any content here including forms, text, or other components.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The modal automatically handles scrolling when content exceeds the viewport height.
            </Typography>
          </Stack>
        </Modal>
      </>
    );
  },
};

// Form modal
export const FormModal: Story = {
  args: {
    open: true,
    title: 'Create New Item',
    subtitle: 'Fill in the details below to create a new item',
    size: 'small',
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
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Form Modal
        </Button>
        <Modal
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
            <FormControlLabel control={<Checkbox />} label="Send notification" />
          </Stack>
        </Modal>
      </>
    );
  },
};


// Medium size modal
export const MediumModal: Story = {
  args: {
    open: true,
    title: 'Data Overview',
    subtitle: 'Comprehensive view of your data',
    size: 'medium',
    primaryAction: {
      label: 'Export',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Close',
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
          Open Medium Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Analytics Dashboard</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Total Users</Typography>
                <Typography variant="h3">1,234</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Active Sessions</Typography>
                <Typography variant="h3">89</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Revenue</Typography>
                <Typography variant="h3">$45.2K</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Growth</Typography>
                <Typography variant="h3" color="success.main">+12%</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Data updated 5 minutes ago. Click Export to download the full report.
            </Typography>
          </Stack>
        </Modal>
      </>
    );
  },
};

// Large size modal
export const LargeModal: Story = {
  args: {
    open: true,
    title: 'Project Details',
    subtitle: 'Complete project information and activity',
    size: 'large',
    primaryAction: {
      label: 'Save Changes',
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
          Open Large Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Project Information</Typography>
              <TextField label="Project Name" fullWidth defaultValue="Website Redesign" />
              <TextField label="Description" fullWidth multiline rows={4} defaultValue="Complete overhaul of the company website with new branding and improved user experience." />
              <TextField label="Start Date" type="date" fullWidth defaultValue="2024-01-15" InputLabelProps={{ shrink: true }} />
              <TextField label="End Date" type="date" fullWidth defaultValue="2024-06-30" InputLabelProps={{ shrink: true }} />
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">Team Members</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="John Smith" secondary="Project Manager" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sarah Johnson" secondary="Lead Designer" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Mike Chen" secondary="Frontend Developer" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Emily Davis" secondary="Backend Developer" />
                </ListItem>
              </List>
              <Button variant="outlined" fullWidth>Add Team Member</Button>
            </Stack>
          </Box>
        </Modal>
      </>
    );
  },
};

// Fullscreen modal
export const FullscreenModal: Story = {
  args: {
    open: true,
    title: 'Document Editor',
    subtitle: 'Edit your document in fullscreen mode',
    size: 'fullscreen',
    primaryAction: {
      label: 'Save Document',
      onClick: () => {},
    },
    secondaryAction: {
      label: 'Exit Fullscreen',
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
          Open Fullscreen Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField
              fullWidth
              multiline
              rows={20}
              defaultValue="Start typing your document here..."
              sx={{ flex: 1 }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Word count: 0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Characters: 0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last saved: Never
              </Typography>
            </Box>
          </Box>
        </Modal>
      </>
    );
  },
};

// No actions modal
export const NoActionsModal: Story = {
  args: {
    open: true,
    title: 'Information',
    subtitle: 'This modal has no action buttons',
    size: 'small',
    hideCloseButton: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);

    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Info Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Stack spacing={2}>
            <Typography variant="body1">
              This modal doesn't have any action buttons in the footer.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can close it using the X button in the header or by pressing the Escape key.
            </Typography>
            <Box sx={{ p: 3, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="info.main">
                💡 Tip: Modals without actions are useful for displaying read-only information.
              </Typography>
            </Box>
          </Stack>
        </Modal>
      </>
    );
  },
};

// Modal with Drawer
export const ModalWithDrawer: Story = {
  args: {
    open: true,
    title: 'Edit Profile',
    subtitle: 'Update your profile information',
    size: 'medium',
    drawerWidth: 300,
    primaryAction: {
      label: 'Save Changes',
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

    const drawerContent = (
      <Stack spacing={2}>
        <Typography variant="h6">Quick Actions</Typography>
        <Button variant="outlined" fullWidth>Upload Photo</Button>
        <Button variant="outlined" fullWidth>Change Password</Button>
        <Button variant="outlined" fullWidth>Privacy Settings</Button>
        <Divider />
        <Typography variant="subtitle2" color="text.secondary">
          Recent Activity
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Profile updated"
              secondary="2 hours ago"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Password changed"
              secondary="3 days ago"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email verified"
              secondary="1 week ago"
            />
          </ListItem>
        </List>
      </Stack>
    );

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Modal with Drawer
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          drawer={drawerContent}
        >
          <Stack spacing={3}>
            <TextField label="First Name" fullWidth defaultValue="John" />
            <TextField label="Last Name" fullWidth defaultValue="Doe" />
            <TextField label="Email" fullWidth defaultValue="john.doe@example.com" />
            <TextField label="Phone" fullWidth defaultValue="+1 234 567 8900" />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={4}
              defaultValue="Software developer with 10+ years of experience..."
            />
            <FormControl fullWidth>
              <FormLabel>Country</FormLabel>
              <Select defaultValue="us">
                <MenuItem value="us">United States</MenuItem>
                <MenuItem value="uk">United Kingdom</MenuItem>
                <MenuItem value="ca">Canada</MenuItem>
                <MenuItem value="au">Australia</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Modal>
      </>
    );
  },
};

// Modal with Split View
export const ModalWithSplitView: Story = {
  args: {
    open: true,
    title: 'Compare Documents',
    subtitle: 'View documents side by side',
    size: 'large',
    splitView: true,
    primaryAction: {
      label: 'Merge',
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

    const rightPanelContent = (
      <Stack spacing={2}>
        <Typography variant="h6">Document B - Version 2.0</Typography>
        <Typography variant="body2" color="text.secondary">
          Last modified: January 20, 2024
        </Typography>
        <Divider />
        <Typography variant="body1" paragraph>
          This is the updated version of the document with the following changes:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="• Updated introduction section" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Added new requirements" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Fixed typos and grammar" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Revised conclusion" />
          </ListItem>
        </List>
        <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="success.main">
            + 15 additions
          </Typography>
        </Box>
      </Stack>
    );

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Split View Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          drawer={rightPanelContent}
        >
          <Stack spacing={2}>
            <Typography variant="h6">Document A - Version 1.0</Typography>
            <Typography variant="body2" color="text.secondary">
              Last modified: January 15, 2024
            </Typography>
            <Divider />
            <Typography variant="body1" paragraph>
              This is the original version of the document. It contains the initial draft with basic structure and content.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• Original introduction" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Basic requirements" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Initial draft content" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• First version conclusion" />
              </ListItem>
            </List>
            <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="error.main">
                - 8 deletions
              </Typography>
            </Box>
          </Stack>
        </Modal>
      </>
    );
  },
};