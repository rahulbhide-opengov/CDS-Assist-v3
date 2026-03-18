import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Avatar,
  Chip,
  Divider,
  Alert,
  Stack,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`}>
      {children}
    </Box>
  );
}

const mockUser = {
  firstName: 'Sarah',
  lastName: 'Mitchell',
  email: 'sarah.mitchell@cityofspringfield.gov',
  phone: '(555) 234-8901',
  title: 'Senior Permit Analyst',
  department: 'Community Development',
  employeeId: 'EMP-2847',
  office: 'City Hall — Room 204',
  address: '123 Main Street, Springfield, IL 62701',
  role: 'Admin',
  lastLogin: '2026-03-12T09:15:00',
  memberSince: '2023-06-15',
  avatarInitials: 'SM',
};

const UserProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
    title: mockUser.title,
    department: mockUser.department,
    office: mockUser.office,
    address: mockUser.address,
  });

  const [notifications, setNotifications] = useState({
    emailPermitUpdates: true,
    emailInspectionReminders: true,
    emailViolationAlerts: false,
    smsInspectionReminders: true,
    smsUrgentAlerts: true,
    inAppAll: true,
  });

  const handleFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      title: mockUser.title,
      department: mockUser.department,
      office: mockUser.office,
      address: mockUser.address,
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={
              editing
                ? [
                    <Button key="cancel" variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
                      Cancel
                    </Button>,
                    <Button key="save" variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
                      Save Changes
                    </Button>,
                  ]
                : [
                    <Button key="edit" variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>,
                  ]
            }
          >
            <PageHeaderComposable.Title>User Profile</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Manage your account information, security settings, and notification preferences
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      <Box
        component="main"
        sx={{
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
        }}
      >
        {saved && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSaved(false)}>
            Profile updated successfully.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile summary card */}
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      bgcolor: 'primary.main',
                      fontSize: 32,
                    }}
                  >
                    {mockUser.avatarInitials}
                  </Avatar>
                  {editing && (
                    <IconButton
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h5" color="text.primary" sx={{ textAlign: 'center' }}>
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                  {formData.title}
                </Typography>
                <Chip label={mockUser.role} color="primary" size="small" sx={{ mb: 3 }} />
                <Divider sx={{ width: '100%', mb: 2 }} />
                <Stack spacing={1.5} sx={{ width: '100%', px: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <BadgeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{mockUser.employeeId}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {formData.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{formData.phone}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{mockUser.office}</Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ width: '100%', my: 2 }} />
                <Stack spacing={0.5} sx={{ width: '100%', px: 1 }}>
                  <Typography variant="caption" color="text.hint">
                    Member since {new Date(mockUser.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                  <Typography variant="caption" color="text.hint">
                    Last login: {new Date(mockUser.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs content */}
          <Grid item xs={12} md={8} lg={9}>
            <Card>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  aria-label="Profile sections"
                  variant={isMobile ? 'fullWidth' : 'standard'}
                >
                  <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
                  <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
                  <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                {/* Personal Info Tab */}
                <TabPanel value={activeTab} index={0}>
                  <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      label="First Name"
                      size="small"
                      fullWidth
                      value={formData.firstName}
                      onChange={handleFormChange('firstName')}
                      disabled={!editing}
                    />
                    <TextField
                      label="Last Name"
                      size="small"
                      fullWidth
                      value={formData.lastName}
                      onChange={handleFormChange('lastName')}
                      disabled={!editing}
                    />
                  </Box>
                  <TextField
                    label="Email Address"
                    size="small"
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange('email')}
                    disabled={!editing}
                    sx={{ mb: 3 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" aria-hidden="true" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    label="Phone Number"
                    size="small"
                    fullWidth
                    value={formData.phone}
                    onChange={handleFormChange('phone')}
                    disabled={!editing}
                    sx={{ mb: 3 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" aria-hidden="true" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Typography variant="h6" color="text.primary" sx={{ mt: 4, mb: 3 }}>
                    Organization
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      label="Job Title"
                      size="small"
                      fullWidth
                      value={formData.title}
                      onChange={handleFormChange('title')}
                      disabled={!editing}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon fontSize="small" aria-hidden="true" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <FormControl fullWidth size="small" disabled={!editing}>
                      <InputLabel>Department</InputLabel>
                      <Select
                        label="Department"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      >
                        <MenuItem value="Community Development">Community Development</MenuItem>
                        <MenuItem value="Building & Safety">Building & Safety</MenuItem>
                        <MenuItem value="Planning">Planning</MenuItem>
                        <MenuItem value="Public Works">Public Works</MenuItem>
                        <MenuItem value="Code Enforcement">Code Enforcement</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      label="Office Location"
                      size="small"
                      fullWidth
                      value={formData.office}
                      onChange={handleFormChange('office')}
                      disabled={!editing}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon fontSize="small" aria-hidden="true" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      label="Employee ID"
                      size="small"
                      fullWidth
                      value={mockUser.employeeId}
                      disabled
                      helperText="Contact HR to update"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" aria-hidden="true" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <TextField
                    label="Mailing Address"
                    size="small"
                    fullWidth
                    value={formData.address}
                    onChange={handleFormChange('address')}
                    disabled={!editing}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon fontSize="small" aria-hidden="true" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </TabPanel>

                {/* Security Tab */}
                <TabPanel value={activeTab} index={1}>
                  <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                    Security Settings
                  </Typography>

                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.primary">Password</Typography>
                          <Typography variant="body2" color="text.secondary">Last changed 45 days ago</Typography>
                        </Box>
                        <Button variant="outlined" size="medium">Change Password</Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" color="text.primary">Two-Factor Authentication</Typography>
                            <Chip label="Enabled" color="success" size="small" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Authenticator app configured
                          </Typography>
                        </Box>
                        <Button variant="outlined" size="medium">Manage</Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.primary">Active Sessions</Typography>
                          <Typography variant="body2" color="text.secondary">
                            2 devices currently signed in
                          </Typography>
                        </Box>
                        <Button variant="outlined" color="error" size="medium">Sign Out All</Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Typography variant="h6" color="text.primary" sx={{ mt: 5, mb: 3 }}>
                    Permissions
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body1" color="text.primary">Create & manage permits</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body1" color="text.primary">Schedule & conduct inspections</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body1" color="text.primary">Issue code violations</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body1" color="text.primary">View reports & analytics</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body1" color="text.primary">Admin: manage users & settings</Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="caption" color="text.hint" sx={{ mt: 2, display: 'block' }}>
                        Role: Admin — Contact your system administrator to modify permissions
                      </Typography>
                    </CardContent>
                  </Card>
                </TabPanel>

                {/* Notifications Tab */}
                <TabPanel value={activeTab} index={2}>
                  <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                    Email Notifications
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 4 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.emailPermitUpdates}
                              onChange={(e) => setNotifications(prev => ({ ...prev, emailPermitUpdates: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" color="text.primary">Permit status updates</Typography>
                              <Typography variant="body2" color="text.secondary">Get notified when permits change status</Typography>
                            </Box>
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.emailInspectionReminders}
                              onChange={(e) => setNotifications(prev => ({ ...prev, emailInspectionReminders: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" color="text.primary">Inspection reminders</Typography>
                              <Typography variant="body2" color="text.secondary">Daily digest of upcoming inspections</Typography>
                            </Box>
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.emailViolationAlerts}
                              onChange={(e) => setNotifications(prev => ({ ...prev, emailViolationAlerts: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" color="text.primary">Violation alerts</Typography>
                              <Typography variant="body2" color="text.secondary">Immediate alerts for new code violations</Typography>
                            </Box>
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                    SMS Notifications
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 4 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.smsInspectionReminders}
                              onChange={(e) => setNotifications(prev => ({ ...prev, smsInspectionReminders: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" color="text.primary">Inspection reminders</Typography>
                              <Typography variant="body2" color="text.secondary">Text 1 hour before scheduled inspections</Typography>
                            </Box>
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.smsUrgentAlerts}
                              onChange={(e) => setNotifications(prev => ({ ...prev, smsUrgentAlerts: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" color="text.primary">Urgent alerts</Typography>
                              <Typography variant="body2" color="text.secondary">Critical permit or inspection issues requiring immediate attention</Typography>
                            </Box>
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                    In-App Notifications
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.inAppAll}
                            onChange={(e) => setNotifications(prev => ({ ...prev, inAppAll: e.target.checked }))}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" color="text.primary">All in-app notifications</Typography>
                            <Typography variant="body2" color="text.secondary">Show notification badges and alerts within the application</Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
