/**
 * Unified Account Management Component
 * Consolidates account management functionality for both unified portal and public portal
 * Supports Profile, Security, Billing, and All Accounts tabs
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Chip,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Menu,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Checkbox,
  InputLabel,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  MoreVert,
  Add,
  Email,
  Phone,
  East,
  Lock,
  Check,
  Warning,
  AutoMode,
  Home,
  Business,
  Construction,
  Receipt,
  Description,
  Park,
  Shield,
  Visibility,
  VisibilityOff,
  Search,
  Edit,
  Store,
  Gavel,
  AccountBalanceWallet,
  ChevronRight,
} from '@mui/icons-material';
import { cdsColors, cdsDesignTokens } from '../../theme/cds';
import { portalTheme, portalStyles } from '../../config/portalTheme';
import type {
  CityAccount,
  AccountFilterType,
  AccountStatusType,
  AccountOwnershipType,
  PaymentMethod,
  UserProfile,
} from '../../types/portal';

const colors = cdsColors;

// Mock user data
const mockUserData: UserProfile = {
  firstName: 'Paul',
  lastName: 'Atreides',
  email: 'paul.atreides@example.com',
  phone: '(555) 123-4567',
};

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4232', brand: 'Visa', expiry: '08/2026', isDefault: true },
  { id: '2', type: 'card', last4: '0029', brand: 'Mastercard', expiry: '02/2030', isDefault: false },
  { id: '3', type: 'bank', last4: '3269', bankName: 'Bank of America', isDefault: false },
];

// Mock all accounts data
const mockAllAccounts: CityAccount[] = [
  {
    id: '1',
    accountNumber: 'WTR-23-4957340',
    nickname: 'Home Water',
    type: 'utilities',
    ownership: 'individual',
    vendorPortalEnabled: false,
    address: '123 Main Street',
    status: 'active',
    balance: 0,
    lastActivity: '2024-03-15',
    primaryContact: {
      name: 'Paul Atreides',
      email: 'paul.atreides@example.com',
      phone: '(555) 123-4567',
    },
  },
  {
    id: '2',
    accountNumber: 'PT-40384-40-492',
    nickname: 'Property Tax - Main St',
    type: 'taxes',
    ownership: 'individual',
    vendorPortalEnabled: false,
    address: '123 Main Street',
    status: 'active',
    balance: 1250.00,
    lastActivity: '2024-03-10',
  },
  {
    id: '3',
    accountNumber: 'BL-2024-5678',
    nickname: 'ABC Consulting',
    type: 'licenses',
    ownership: 'business',
    vendorPortalEnabled: true,
    address: '456 Business Ave',
    status: 'active',
    balance: 0,
    lastActivity: '2024-03-20',
  },
  {
    id: '4',
    accountNumber: 'PKS-2025-001',
    type: 'parks',
    ownership: 'individual',
    vendorPortalEnabled: false,
    address: '123 Main Street',
    status: 'active',
    balance: 0,
    lastActivity: '2024-03-18',
  },
  {
    id: '5',
    accountNumber: 'RBP-2025-1234',
    type: 'permits',
    ownership: 'individual',
    vendorPortalEnabled: false,
    address: '123 Main Street',
    status: 'pending',
    balance: 500.00,
    lastActivity: '2024-03-22',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface UnifiedAccountPageProps {
  layout?: 'unified' | 'public';
}

const UnifiedAccountPage: React.FC<UnifiedAccountPageProps> = ({ layout = 'unified' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [accounts, setAccounts] = useState<CityAccount[]>(mockAllAccounts);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'bank'>('card');
  const [showPassword, setShowPassword] = useState(false);

  // All Accounts tab state
  const [accountFilter, setAccountFilter] = useState<AccountFilterType>('all');
  const [statusFilter, setStatusFilter] = useState<AccountStatusType>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<AccountOwnershipType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNickname, setEditingNickname] = useState<string | null>(null);
  const [nicknameValue, setNicknameValue] = useState('');

  // Form state
  const [profile, setProfile] = useState(mockUserData);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, methodId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMethodId(methodId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMethodId(null);
  };

  const handleSetDefault = () => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === selectedMethodId }))
    );
    handleMenuClose();
  };

  const handleDeleteMethod = () => {
    setPaymentMethods(methods => methods.filter(m => m.id !== selectedMethodId));
    handleMenuClose();
  };

  // All Accounts functionality
  const handleEditNickname = (accountId: string, currentNickname: string = '') => {
    setEditingNickname(accountId);
    setNicknameValue(currentNickname);
  };

  const handleSaveNickname = (accountId: string) => {
    setAccounts(accs =>
      accs.map(a => a.id === accountId ? { ...a, nickname: nicknameValue } : a)
    );
    setEditingNickname(null);
    setNicknameValue('');
  };

  const handleToggleVendorPortal = (accountId: string) => {
    setAccounts(accs =>
      accs.map(a => a.id === accountId ? { ...a, vendorPortalEnabled: !a.vendorPortalEnabled } : a)
    );
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesType = accountFilter === 'all' || account.type === accountFilter;
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      const matchesOwnership = ownershipFilter === 'all' || account.ownership === ownershipFilter;
      const matchesSearch =
        account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.address.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesStatus && matchesOwnership && matchesSearch;
    });
  }, [accounts, accountFilter, statusFilter, ownershipFilter, searchTerm]);

  // Get icon for account type
  const getAccountIcon = (type: CityAccount['type']) => {
    switch(type) {
      case 'utilities': return <Construction aria-hidden="true" sx={{ color: portalTheme.primary }} />;
      case 'permits': return <Description aria-hidden="true" sx={{ color: portalTheme.primary }} />;
      case 'licenses': return <Shield aria-hidden="true" sx={{ color: portalTheme.primary }} />;
      case 'taxes': return <Receipt aria-hidden="true" sx={{ color: portalTheme.primary }} />;
      case 'parks': return <Park aria-hidden="true" sx={{ color: portalTheme.primary }} />;
      default: return <AccountBalanceWallet aria-hidden="true" sx={{ color: portalTheme.primary }} />;
    }
  };

  // Common questions for FAQ
  const commonQuestions = [
    'How do I set up or change automatic payments (Auto Pay)?',
    'Can I set up a default payment method for my utility bills?',
    'What Payment Methods Are Supported?',
    'How do I update my account nickname?',
    'How can I enable vendor portal access?',
  ];

  // Handler for FAQ question click
  const handleQuestionClick = (question: string) => {
    // Navigate to FAQ or expand answer
    console.log('Question clicked:', question);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.gray50, overflowX: 'hidden' }}>
      <Box sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '1.75rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
            Account Management
          </Typography>
          <Typography variant="body1" sx={{ color: colors.gray500 }}>
            Manage your personal details, notification settings, billing preferences, and all city accounts.
          </Typography>
        </Box>
      </Box>

      {/* Main Content Grid - Matching History Page Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
        {/* Left Column - Tabs and Content */}
        <Box>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ borderBottom: `1px solid ${colors.gray200}` }}
            aria-label="Account management tabs"
          >
            <Tab label="Profile" id="account-tab-0" aria-controls="account-tabpanel-0" />
            <Tab label="Security" id="account-tab-1" aria-controls="account-tabpanel-1" />
            <Tab label="Billing" id="account-tab-2" aria-controls="account-tabpanel-2" />
            <Tab label="All Accounts" id="account-tab-3" aria-controls="account-tabpanel-3" />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Card elevation={0} sx={{ ...portalStyles.serviceCard, p: 3 }}>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Profile Information
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <TextField
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  fullWidth
                  size="small"
                />
              </Box>

              <TextField
                label="Email"
                value={profile.email}
                fullWidth
                size="small"
                disabled
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    startAdornment: <Email aria-hidden="true" sx={{ color: colors.gray400, mr: 1, fontSize: 20 }} />
                  },
                }}
              />

              <TextField
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    startAdornment: <Phone aria-hidden="true" sx={{ color: colors.gray400, mr: 1, fontSize: 20 }} />
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Card>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={1}>
            <Card elevation={0} sx={{ ...portalStyles.serviceCard, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                      Change Password
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.gray500 }}>
                      Last changed 3 months ago
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small">
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0} sx={portalStyles.serviceCard}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" id="two-factor-label" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.gray500 }}>
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                  <Switch
                    defaultChecked
                    inputProps={{ 'aria-labelledby': 'two-factor-label' }}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: portalTheme.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: portalTheme.primary,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Billing Tab */}
          <TabPanel value={activeTab} index={2}>
            {/* Payment Methods Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
                  Payment Methods
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add aria-hidden="true" />}
                  size="small"
                  onClick={() => setAddPaymentOpen(true)}
                >
                  Add Payment Method
                </Button>
              </Box>

              {paymentMethods.map((method) => (
                <Card key={method.id} elevation={0} sx={{ ...portalStyles.serviceCard, mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={portalStyles.iconContainer}>
                          {method.type === 'card' ? <CreditCard aria-hidden="true" /> : <AccountBalance aria-hidden="true" />}
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray900 }}>
                              {method.type === 'card'
                                ? `${method.brand} ****${method.last4}`
                                : `${method.bankName} ****${method.last4}`
                              }
                            </Typography>
                            {method.isDefault && (
                              <Chip label="Default" size="small" sx={{ bgcolor: portalTheme.primaryBg, color: portalTheme.primary }} />
                            )}
                          </Box>
                          {method.type === 'card' && (
                            <Typography variant="body2" sx={{ color: colors.gray500 }}>
                              Expires {method.expiry}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, method.id)}
                        aria-label={`Payment method options for ${method.type === 'card' ? `${method.brand} ending in ${method.last4}` : `${method.bankName} ending in ${method.last4}`}`}
                      >
                        <MoreVert aria-hidden="true" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* AutoPay Settings */}
            <Alert severity="info" sx={{ mb: 3 }}>
              AutoPay settings can be configured for each individual service account in the All Accounts tab.
            </Alert>
          </TabPanel>

          {/* All Accounts Tab */}
          <TabPanel value={activeTab} index={3}>
            {/* Search and Filters */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2, mb: 3, alignItems: 'end' }}>
              <TextField
                placeholder="Search accounts..."
                aria-label="Search accounts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: <Search aria-hidden="true" sx={{ color: colors.gray400, mr: 1 }} />
                  },
                }}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value as AccountFilterType)}
                  label="Account Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="permits">Permits</MenuItem>
                  <MenuItem value="licenses">Licenses</MenuItem>
                  <MenuItem value="taxes">Taxes</MenuItem>
                  <MenuItem value="parks">Parks & Rec</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AccountStatusType)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Ownership</InputLabel>
                <Select
                  value={ownershipFilter}
                  onChange={(e) => setOwnershipFilter(e.target.value as AccountOwnershipType)}
                  label="Ownership"
                >
                  <MenuItem value="all">All Ownership</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Accounts List */}
            <Box>
              {filteredAccounts.length === 0 ? (
                <Card elevation={0} sx={{ ...portalStyles.serviceCard, p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: colors.gray500 }}>
                    No accounts found matching your filters
                  </Typography>
                </Card>
              ) : (
                filteredAccounts.map((account) => (
                  <Card key={account.id} elevation={0} sx={{ ...portalStyles.serviceCard, mb: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {/* Icon */}
                        <Box sx={portalStyles.iconContainer}>
                          {getAccountIcon(account.type)}
                        </Box>

                        {/* Account Info */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray900 }}>
                              {account.accountNumber}
                            </Typography>
                            <Chip
                              label={account.type}
                              size="small"
                              sx={{
                                bgcolor: portalTheme.primaryBg,
                                color: portalTheme.primary,
                                textTransform: 'capitalize'
                              }}
                            />
                            <Chip
                              label={account.status}
                              size="small"
                              sx={
                                account.status === 'active'
                                  ? portalStyles.statusChip.active
                                  : account.status === 'pending'
                                  ? portalStyles.statusChip.pending
                                  : portalStyles.statusChip.inactive
                              }
                            />
                          </Box>

                          {/* Nickname editing */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {editingNickname === account.id ? (
                              <>
                                <TextField
                                  value={nicknameValue}
                                  onChange={(e) => setNicknameValue(e.target.value)}
                                  placeholder="Add nickname..."
                                  aria-label={`Nickname for account ${account.accountNumber}`}
                                  size="small"
                                  sx={{ width: 200 }}
                                  autoFocus
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleSaveNickname(account.id)}
                                  sx={{ color: portalTheme.primary }}
                                  aria-label={`Save nickname for account ${account.accountNumber}`}
                                >
                                  <Check aria-hidden="true" />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <Typography variant="body2" sx={{ color: colors.gray600 }}>
                                  {account.nickname || 'No nickname'}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditNickname(account.id, account.nickname)}
                                  sx={{ color: colors.gray400 }}
                                  aria-label={`Edit nickname for account ${account.accountNumber}`}
                                >
                                  <Edit aria-hidden="true" sx={{ fontSize: 16 }} />
                                </IconButton>
                              </>
                            )}
                          </Box>

                          <Typography variant="body2" sx={{ color: colors.gray500 }}>
                            {account.address}
                          </Typography>
                        </Box>

                        {/* Balance */}
                        <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                          <Typography variant="body2" sx={{ color: colors.gray500, mb: 0.5 }}>
                            Balance
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: account.balance > 0 ? colors.red600 : colors.green600 }}>
                            ${account.balance.toFixed(2)}
                          </Typography>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {account.ownership === 'business' && (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={account.vendorPortalEnabled}
                                  onChange={() => handleToggleVendorPortal(account.id)}
                                  inputProps={{ 'aria-label': `Enable vendor portal for account ${account.accountNumber}` }}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: portalTheme.primary,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: portalTheme.primary,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Store aria-hidden="true" sx={{ fontSize: 18, color: colors.gray600 }} />
                                  <Typography variant="body2" sx={{ color: colors.gray600 }}>
                                    Vendor Portal
                                  </Typography>
                                </Box>
                              }
                            />
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<East aria-hidden="true" />}
                          >
                            Manage
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </TabPanel>
        </Box>

        {/* Right Column - Support and FAQ */}
        <Box>
          {/* Support Available Section */}
          <Card elevation={0} sx={{ ...portalStyles.serviceCard, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Support Available
              </Typography>
              <Typography variant="body2" sx={{ color: colors.gray600, mb: 3 }}>
                Having trouble? We are here to help
              </Typography>

              {/* Email Support */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: portalTheme.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Email aria-hidden="true" sx={{ color: portalTheme.primary, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900 }}>
                    support@cityportal.com
                  </Typography>
                </Box>
              </Box>

              {/* Phone Support */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: portalTheme.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone aria-hidden="true" sx={{ color: portalTheme.primary, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900 }}>
                    (555) 123-4567
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Common Questions Section */}
          <Card elevation={0} sx={{ ...portalStyles.serviceCard }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                Common questions
              </Typography>

              {commonQuestions.map((question, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1.5,
                    borderBottom: index < commonQuestions.length - 1 ? `1px solid ${colors.gray200}` : 'none',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleQuestionClick(question)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleQuestionClick(question);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View answer for: ${question}`}
                  >
                    <ChevronRight aria-hidden="true" sx={{ mr: 1, color: colors.gray400, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: colors.gray700 }}>
                      {question}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Typography
                component="a"
                href="#"
                sx={{
                  display: 'block',
                  mt: 3,
                  color: portalTheme.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Have more questions? Go to the FAQ
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Payment Method Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSetDefault}>
          <Check aria-hidden="true" sx={{ fontSize: 20, mr: 1 }} />
          Set as Default
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteMethod} sx={{ color: colors.red600 }}>
          <Warning aria-hidden="true" sx={{ fontSize: 20, mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Add Payment Dialog */}
      <Dialog
        open={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-payment-dialog-title"
      >
        <DialogTitle id="add-payment-dialog-title">Add Payment Method</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as 'card' | 'bank')}
            sx={{ mb: 3 }}
            aria-label="Payment method type"
          >
            <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="bank" control={<Radio />} label="Bank Account" />
          </RadioGroup>

          {paymentType === 'card' ? (
            <Box>
              <TextField
                label="Cardholder Name"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Card Number"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="CVV"
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <TextField
                label="Account Holder Name"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Routing Number"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Account Number"
                fullWidth
                size="small"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPaymentOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default UnifiedAccountPage;
