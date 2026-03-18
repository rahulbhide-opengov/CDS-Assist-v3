/**
 * Taxes Page
 *
 * View and pay your taxes — property, business, and more.
 * Aligned with homepage design language.
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home,
  Business,
  AccountBalance,
  CheckCircle,
  Schedule,
  Warning,
  Add,
  ArrowBack,
  Notifications,
  InfoOutlined,
  East,
  Payment,
  Receipt,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import AccountSelector from './AccountSelector';
import type { Account } from './AccountSelector';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useCart } from './cart/CartContext';
import { useCity } from './CityContext';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;
const theme = {
  primary: colors.blurple500,
  secondary: colors.blurple500,
  success: colors.green600,
  warning: colors.yellow600,
  error: colors.red700,
  gray50: colors.gray50,
  gray100: colors.gray100,
  gray200: colors.gray200,
  gray300: colors.gray300,
  gray400: colors.gray400,
  gray500: colors.gray500,
  gray600: colors.gray600,
  gray700: colors.gray700,
  gray900: colors.gray900,
  white: colors.white,
};

// Tax account types
interface TaxAccount {
  id: string;
  type: 'property' | 'business' | 'other';
  name: string;
  address?: string;
  accountNumber: string;
  currentDue: number;
  nextDueDate: string;
  assessedValue?: number;
  taxRate?: number;
  status: 'current' | 'due' | 'past_due' | 'payment_plan';
  installments?: {
    period: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'due' | 'past_due';
    paidDate?: string;
  }[];
}

// City-specific tax accounts
const cityTaxData: Record<string, TaxAccount[]> = {
  'cloud-city': [
    {
      id: 'cc-1',
      type: 'property',
      name: '123 Main Street',
      address: '123 Main Street, Cloud City, ST 12345',
      accountNumber: 'PT-40384-40-492',
      currentDue: 1240.50,
      nextDueDate: '2025-09-30',
      assessedValue: 425000,
      taxRate: 0.0152,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 620.25, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-25' },
        { period: 'Q2 2025', amount: 620.25, dueDate: '2025-09-30', status: 'due' },
      ],
    },
    {
      id: 'cc-3',
      type: 'property',
      name: '789 Oak Avenue',
      address: '789 Oak Avenue, Cloud City, ST 12345',
      accountNumber: 'PT-78901-20-100',
      currentDue: 892.00,
      nextDueDate: '2025-09-30',
      assessedValue: 285000,
      taxRate: 0.0152,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 446.00, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-28' },
        { period: 'Q2 2025', amount: 446.00, dueDate: '2025-09-30', status: 'due' },
      ],
    },
  ],
  'summit-springs': [
    {
      id: 'ss-1',
      type: 'property',
      name: '523 Mountain View Drive',
      address: '523 Mountain View Drive, Summit Springs, CA 94301',
      accountNumber: 'PT-SS-52301',
      currentDue: 1895.00,
      nextDueDate: '2025-09-30',
      assessedValue: 585000,
      taxRate: 0.0162,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 947.50, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-20' },
        { period: 'Q2 2025', amount: 947.50, dueDate: '2025-09-30', status: 'due' },
      ],
    },
  ],
  'riverside-city': [
    {
      id: 'rg-1',
      type: 'property',
      name: '2901 Riverbank Lane',
      address: '2901 Riverbank Lane, Riverside Gardens, CA 94588',
      accountNumber: 'PT-RG-45621',
      currentDue: 1456.75,
      nextDueDate: '2025-09-30',
      assessedValue: 465000,
      taxRate: 0.0157,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 728.38, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-22' },
        { period: 'Q2 2025', amount: 728.37, dueDate: '2025-09-30', status: 'due' },
      ],
    },
    {
      id: 'rg-2',
      type: 'property',
      name: '1450 Willow Creek Dr',
      address: '1450 Willow Creek Dr, Riverside Gardens, CA 94588',
      accountNumber: 'PT-RG-78934',
      currentDue: 1123.50,
      nextDueDate: '2025-09-30',
      assessedValue: 358000,
      taxRate: 0.0157,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 561.75, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-26' },
        { period: 'Q2 2025', amount: 561.75, dueDate: '2025-09-30', status: 'due' },
      ],
    },
  ],
  'metro-central': [
    {
      id: 'mc-1',
      type: 'property',
      name: 'Metro Central Ventures',
      address: '450 Central Plaza, Suite 12B, Metro Central, CA 94110',
      accountNumber: 'PT-MC-89234',
      currentDue: 3240.80,
      nextDueDate: '2025-09-30',
      assessedValue: 985000,
      taxRate: 0.0165,
      status: 'due',
      installments: [
        { period: 'Q1 2025', amount: 1620.40, dueDate: '2025-03-31', status: 'paid', paidDate: '2025-03-18' },
        { period: 'Q2 2025', amount: 1620.40, dueDate: '2025-09-30', status: 'due' },
      ],
    },
  ],
};

// Notice types
interface Notice {
  id: string;
  accountId: string;
  propertyAddress: string;
  title: string;
  date: string;
  isUnread: boolean;
  type: 'assessment' | 'payment' | 'statement' | 'delinquency';
}

// Activity types
interface Activity {
  id: string;
  accountId: string;
  type: 'payment_received' | 'payment_due' | 'payment_overdue' | 'notice_received';
  title: string;
  details: string;
  date: string;
}

// Mock notices
const mockNotices: Notice[] = [
  {
    id: '1',
    accountId: '1',
    propertyAddress: '123 Main Street',
    title: 'Tax Assessment Notice',
    date: '2025-03-15',
    isUnread: true,
    type: 'assessment'
  },
  {
    id: '2',
    accountId: '1',
    propertyAddress: '123 Main Street',
    title: 'Annual Tax Statement',
    date: '2025-01-01',
    isUnread: false,
    type: 'statement'
  },
  {
    id: '3',
    accountId: '2',
    propertyAddress: 'ABC Consulting LLC',
    title: 'Business Tax Filing Reminder',
    date: '2025-03-01',
    isUnread: true,
    type: 'statement'
  },
];

// Mock activities
const mockActivities: Activity[] = [
  {
    id: '1',
    accountId: '1',
    type: 'payment_received',
    title: 'Payment Received',
    details: '$1,622.50 • Q1 2025 • 123 Main Street',
    date: '2025-01-10'
  },
  {
    id: '2',
    accountId: '1',
    type: 'payment_due',
    title: 'Payment Due Soon',
    details: '$1,622.50 • Q2 2025 • 123 Main Street',
    date: '2025-04-10'
  },
  {
    id: '3',
    accountId: '3',
    type: 'payment_received',
    title: 'Payment Received',
    details: '$1,083.75 • Q2 2025 • 789 Oak Avenue',
    date: '2025-04-05'
  },
  {
    id: '4',
    accountId: '1',
    type: 'notice_received',
    title: 'Tax Assessment Notice',
    details: '2025 Property Assessment • 123 Main Street',
    date: '2025-03-15'
  },
];

// City-specific user accounts
const cityUserAccounts: Record<string, Account[]> = {
  'cloud-city': [
    { id: 'cc-1', type: 'household', name: '123 Main Street', role: 'Owner', address: '123 Main Street, Cloud City, ST 12345' },
    { id: 'cc-2', type: 'business', name: 'ABC Consulting LLC', role: 'Owner', address: '456 Business Ave, Cloud City, ST 12345' },
    { id: 'cc-3', type: 'household', name: '789 Oak Avenue', role: 'Owner', address: '789 Oak Avenue, Cloud City, ST 12345' },
  ],
  'summit-springs': [
    { id: 'ss-1', type: 'household', name: '523 Mountain View Drive', role: 'Owner', address: '523 Mountain View Drive, Summit Springs, CA 94301' },
    { id: 'ss-2', type: 'business', name: 'Peak Performance Gym', role: 'Owner', address: '125 Summit Plaza, Summit Springs, CA 94301' },
  ],
  'riverside-city': [
    { id: 'rg-1', type: 'household', name: '2901 Riverbank Lane', role: 'Owner', address: '2901 Riverbank Lane, Riverside Gardens, CA 94588' },
    { id: 'rg-2', type: 'household', name: '1450 Willow Creek Dr', role: 'Owner', address: '1450 Willow Creek Dr, Riverside Gardens, CA 94588' },
  ],
  'metro-central': [
    { id: 'mc-1', type: 'business', name: 'Metro Central Ventures', role: 'Owner', address: '450 Central Plaza, Suite 12B, Metro Central, CA 94110' },
  ],
};

const TaxesPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, openCart, isInCart } = useCart();
  const { currentCity } = useCity();

  // Get city-specific accounts and tax data
  const userAccounts = useMemo(() => {
    return cityUserAccounts[currentCity.id] || cityUserAccounts['cloud-city'];
  }, [currentCity.id]);

  const mockTaxAccounts = useMemo(() => {
    return cityTaxData[currentCity.id] || cityTaxData['cloud-city'];
  }, [currentCity.id]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(userAccounts[0]?.id || '');
  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Update selected account when city changes
  React.useEffect(() => {
    if (userAccounts.length > 0 && !userAccounts.find(a => a.id === selectedAccountId)) {
      setSelectedAccountId(userAccounts[0].id);
      setViewAllAccounts(false);
    }
  }, [currentCity.id, userAccounts, selectedAccountId]);

  // Get selected account
  const selectedAccount = userAccounts.find(a => a.id === selectedAccountId);

  // Filter tax accounts based on view mode
  const visibleTaxAccounts = useMemo(() => {
    if (viewAllAccounts) {
      return mockTaxAccounts;
    }
    return mockTaxAccounts.filter(tax => {
      if (selectedAccount?.type === 'household') {
        return tax.type === 'property' && tax.address === selectedAccount.address;
      } else if (selectedAccount?.type === 'business') {
        return tax.type === 'property' && tax.name === selectedAccount.name;
      }
      return false;
    });
  }, [viewAllAccounts, selectedAccountId, mockTaxAccounts, selectedAccount]);

  // Filter notices and activities by selected account
  const accountNotices = mockNotices.filter(n => n.accountId === selectedAccountId);
  const accountActivities = mockActivities.filter(a => a.accountId === selectedAccountId);

  // Calculate totals
  const totalDue = visibleTaxAccounts.reduce((sum, acc) => sum + acc.currentDue, 0);
  const pastDueCount = visibleTaxAccounts.filter(a => a.status === 'past_due').length;
  const propertyCount = mockTaxAccounts.filter(a => a.type === 'property').length;
  const businessCount = mockTaxAccounts.filter(a => a.type === 'business').length;
  const unreadNoticesCount = accountNotices.filter(n => n.isUnread).length;
  const propertiesWithBalance = visibleTaxAccounts.filter(a => a.currentDue > 0).length;
  const isOverdue = visibleTaxAccounts.some(a => a.status === 'past_due');

  // Get next due date
  const nextDueDates = visibleTaxAccounts
    .filter(a => a.currentDue > 0)
    .map(a => new Date(a.nextDueDate))
    .sort((a, b) => a.getTime() - b.getTime());
  const nextDueDate = nextDueDates.length > 0 ? nextDueDates[0] : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const now = new Date();
    const due = new Date(dateString);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Handler for notice click
  const handleNoticeClick = (noticeId: string) => {
    navigate(`/unified-portal/taxes/notices/${noticeId}`);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="services" />

      <Box
        component="main"
        sx={{
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        {/* Header with Account Selector - Matching UnifiedDashboard */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900 }}>
                Taxes
              </Typography>
              <Chip
                icon={viewAllAccounts ? <AccountBalance sx={{ fontSize: 16 }} aria-hidden="true" /> : (selectedAccount?.type === 'household' ? <Home sx={{ fontSize: 16 }} aria-hidden="true" /> : <Business sx={{ fontSize: 16 }} aria-hidden="true" />)}
                label={viewAllAccounts ? `Viewing All Accounts (${userAccounts.length})` : `Viewing: ${selectedAccount?.name}`}
                sx={{
                  height: 28,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  bgcolor: colors.yellow50,
                  color: colors.yellow800,
                  border: `1px solid ${colors.yellow200}`,
                  '& .MuiChip-icon': { color: colors.yellow800 },
                }}
              />
            </Box>
            <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
              View and pay your property and business taxes
            </Typography>
          </Box>

          {/* Account Selector */}
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<ExpandMore aria-hidden="true" />}
            sx={{
              textTransform: 'none',
              border: `1px solid ${colors.gray200}`,
              borderRadius: '8px',
              px: 2,
              py: 1,
              bgcolor: colors.white,
              '&:hover': { bgcolor: colors.gray50, borderColor: colors.gray300 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                bgcolor: colors.yellow100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccountBalance sx={{ fontSize: 18, color: colors.yellow700 }} aria-hidden="true" />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                  {viewAllAccounts ? 'Viewing All Accounts' : selectedAccount?.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                  {userAccounts.length} {userAccounts.length === 1 ? 'account' : 'accounts'} with taxes
                </Typography>
              </Box>
            </Box>
          </Button>

          {/* Account Selection Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: 320,
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.gray100}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Switch Tax Account
              </Typography>
            </Box>

            <MenuItem
              onClick={() => { setViewAllAccounts(true); setAnchorEl(null); }}
              selected={viewAllAccounts}
              sx={{ py: 1.5, px: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  bgcolor: viewAllAccounts ? colors.yellow700 : colors.yellow100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AccountBalance sx={{ fontSize: 18, color: viewAllAccounts ? colors.white : colors.yellow700 }} aria-hidden="true" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>All Accounts</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    {mockTaxAccounts.length} {mockTaxAccounts.length === 1 ? 'property' : 'properties'} · {formatCurrency(mockTaxAccounts.reduce((s, b) => s + b.currentDue, 0))}
                  </Typography>
                </Box>
                {viewAllAccounts && <CheckCircle sx={{ fontSize: 20, color: colors.green600 }} aria-hidden="true" />}
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {userAccounts.map((acc) => {
              const isSelected = !viewAllAccounts && selectedAccountId === acc.id;
              const accountTaxes = mockTaxAccounts.filter(tax =>
                (acc.type === 'household' && tax.address === acc.address) ||
                (acc.type === 'business' && tax.name === acc.name)
              );
              const totalDue = accountTaxes.reduce((sum, tax) => sum + tax.currentDue, 0);

              return (
                <MenuItem
                  key={acc.id}
                  onClick={() => { setViewAllAccounts(false); setSelectedAccountId(acc.id); setAnchorEl(null); }}
                  selected={isSelected}
                  sx={{ py: 1.5, px: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Box sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      bgcolor: acc.type === 'business' ? colors.cerulean100 : colors.green100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {acc.type === 'household'
                        ? <Home sx={{ fontSize: 18, color: colors.green600 }} aria-hidden="true" />
                        : <Business sx={{ fontSize: 18, color: colors.cerulean600 }} aria-hidden="true" />
                      }
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>{acc.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                        {accountTaxes.length} {accountTaxes.length === 1 ? 'bill' : 'bills'} · {formatCurrency(totalDue)}
                      </Typography>
                    </Box>
                    {isSelected && <CheckCircle sx={{ fontSize: 20, color: colors.green600 }} aria-hidden="true" />}
                  </Box>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>

        {/* Summary Cards - Same as UnifiedDashboard */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
          mb: 4
        }}>
          {/* Balance Due Card */}
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: colors.gray500, mb: 1 }}>
                {viewAllAccounts ? 'Total Balance (All Accounts)' : 'Balance Due'}
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>{formatCurrency(totalDue)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Receipt sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
                  <Typography variant="caption" sx={{ color: colors.gray500 }}>{visibleTaxAccounts.length} tax {visibleTaxAccounts.length === 1 ? 'bill' : 'bills'} due</Typography>
                </Box>
                {pastDueCount > 0 && (
                  <Chip label={`${pastDueCount} Past Due`} size="small" icon={<Warning sx={{ fontSize: 12 }} aria-hidden="true" />} sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.red100, color: colors.red700, '& .MuiChip-icon': { color: colors.red700 } }} />
                )}
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  visibleTaxAccounts
                    .filter(tax => tax.currentDue > 0)
                    .forEach(tax => {
                      if (!isInCart(tax.id, 'tax')) {
                        addItem({
                          id: `tax-${tax.id}-${Date.now()}`,
                          type: 'tax',
                          title: tax.name,
                          description: `Property Tax - Due ${formatDate(tax.nextDueDate)}`,
                          amount: tax.currentDue,
                          accountId: tax.id,
                          accountNumber: tax.accountNumber,
                          dueDate: tax.nextDueDate,
                          metadata: {
                            accountName: tax.name,
                            accountType: 'household',
                            taxType: tax.type,
                            address: tax.address,
                            assessedValue: tax.assessedValue,
                            taxRate: tax.taxRate,
                          },
                        });
                      }
                    });
                  openCart();
                }}
                sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px', mb: 1.5 }}
              >
                <Payment sx={{ fontSize: 18, mr: 1 }} aria-hidden="true" /> Pay {viewAllAccounts ? 'All Accounts' : 'All'} ({formatCurrency(totalDue)})
              </Button>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: colors.gray500, mb: 1 }}>
                {viewAllAccounts ? 'Connected Accounts' : 'Account Status'}
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>
                {viewAllAccounts ? userAccounts.length : 'Active'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <AccountBalance sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
                <Typography variant="caption" sx={{ color: colors.gray500 }}>
                  {viewAllAccounts ? 'All properties' : selectedAccount?.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircle sx={{ fontSize: 16, color: colors.green600 }} aria-hidden="true" />
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.green600 }}>Good standing</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Tax Info Card */}
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: colors.gray500, mb: 1 }}>
                Next Payment Due
              </Typography>
              {nextDueDate ? (
                <>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>
                    {formatDate(nextDueDate.toISOString())}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <Schedule sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
                    <Typography variant="caption" sx={{ color: colors.gray500 }}>
                      {getDaysUntil(nextDueDate.toISOString())} days away
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.green600, mb: 1 }}>
                    --
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500 }}>No payments due</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Tax Bills Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
              Outstanding Tax Bills
            </Typography>
            <Button
              onClick={() => navigate('/unified-portal/history')}
              sx={{ textTransform: 'none', fontWeight: 600, color: colors.blurple500, flexShrink: 0 }}
            >
              View All Bills
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          {visibleTaxAccounts.map((tax) => (
            <Card
              key={tax.id}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: `1px solid ${colors.gray200}`,
                transition: 'all 0.2s',
                '&:hover': { borderColor: colors.gray300, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                  {/* Icon */}
                  <Avatar sx={{ width: 48, height: 48, bgcolor: colors.yellow50, color: colors.yellow700 }}>
                    <AccountBalance sx={{ fontSize: 24 }} aria-hidden="true" />
                  </Avatar>

                  {/* Tax Info */}
                  <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '1.125rem' }}>
                        {tax.name}
                      </Typography>
                      <Chip
                        label="Property Tax"
                        size="small"
                        sx={{ height: 20, fontSize: '0.6875rem', bgcolor: colors.gray100, color: colors.gray600 }}
                      />
                    </Box>
                    <Typography sx={{ color: colors.gray500, fontSize: '0.875rem', mb: 1.5 }}>
                      {tax.address}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography sx={{ color: colors.gray400, fontSize: '0.75rem' }}>Account #</Typography>
                        <Typography sx={{ color: colors.gray700, fontSize: '0.875rem', fontWeight: 500 }}>{tax.accountNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: colors.gray400, fontSize: '0.75rem' }}>Assessed Value</Typography>
                        <Typography sx={{ color: colors.gray700, fontSize: '0.875rem', fontWeight: 500 }}>{formatCurrency(tax.assessedValue!)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: colors.gray400, fontSize: '0.75rem' }}>Tax Rate</Typography>
                        <Typography sx={{ color: colors.gray700, fontSize: '0.875rem', fontWeight: 500 }}>{(tax.taxRate! * 100).toFixed(2)}%</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Amount and Action */}
                  <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
                      {formatCurrency(tax.currentDue)}
                    </Typography>
                    <Typography sx={{ color: colors.gray500, fontSize: '0.8125rem', mb: 1.5 }}>
                      Due {formatDate(tax.nextDueDate)}
                    </Typography>
                    {isInCart(tax.id, 'tax') ? (
                      <Chip
                        label="In Cart"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: 14 }} aria-hidden="true" />}
                        onClick={openCart}
                        sx={{
                          bgcolor: colors.blurple100,
                          color: colors.blurple600,
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: colors.blurple200 },
                          '& .MuiChip-icon': { color: colors.blurple600 },
                        }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          addItem({
                            id: `tax-${tax.id}-${Date.now()}`,
                            type: 'tax',
                            title: tax.name,
                            description: `Property Tax - Due ${formatDate(tax.nextDueDate)}`,
                            amount: tax.currentDue,
                            accountId: tax.id,
                            accountNumber: tax.accountNumber,
                            dueDate: tax.nextDueDate,
                            metadata: {
                              accountName: tax.name,
                              accountType: 'household',
                              taxType: tax.type,
                              address: tax.address,
                              assessedValue: tax.assessedValue,
                              taxRate: tax.taxRate,
                            },
                          });
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          bgcolor: colors.blurple500,
                          boxShadow: 'none',
                          '&:hover': { bgcolor: colors.blurple600, boxShadow: 'none' },
                        }}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Payment Schedule */}
                {tax.installments && tax.installments.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem', mb: 1.5 }}>
                        Payment Schedule
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {tax.installments.map((inst, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1.5,
                              minWidth: 120,
                              borderRadius: '8px',
                              bgcolor: inst.status === 'paid' ? colors.green50 : colors.white,
                              border: `1px solid ${inst.status === 'paid' ? colors.green200 : colors.gray200}`,
                            }}
                          >
                            <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.75rem', mb: 0.5 }}>
                              {inst.period}
                            </Typography>
                            <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '0.875rem', mb: 0.5 }}>
                              {formatCurrency(inst.amount)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {inst.status === 'paid' ? (
                                <>
                                  <CheckCircle sx={{ fontSize: 12, color: colors.green600 }} aria-hidden="true" />
                                  <Typography sx={{ fontSize: '0.6875rem', color: colors.green600 }}>
                                    Paid
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <Schedule sx={{ fontSize: 12, color: colors.gray500 }} aria-hidden="true" />
                                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500 }}>
                                    Due {formatDate(inst.dueDate)}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Recent Notices & Activity Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          {/* Recent Notices */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
                  Recent Notices
                </Typography>
                <Button
                  endIcon={<East sx={{ fontSize: 16 }} aria-hidden="true" />}
                  onClick={() => navigate('/unified-portal/taxes/notices')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: colors.blurple500,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  View All
                </Button>
              </Box>

              {accountNotices.length > 0 ? (
                <>
                  {accountNotices.slice(0, 3).map((notice) => (
                    <Box
                      key={notice.id}
                      onClick={() => handleNoticeClick(notice.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNoticeClick(notice.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View notice: ${notice.title} for ${notice.propertyAddress}, dated ${formatDate(notice.date)}${notice.isUnread ? ', unread' : ''}`}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: colors.gray50 },
                        '&:focus': {
                          outline: `2px solid ${colors.blurple500}`,
                          outlineOffset: '2px',
                        },
                        '&:last-child': { mb: 0 }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: colors.gray900, flex: 1 }}>
                          {notice.title}
                        </Typography>
                        {notice.isUnread && (
                          <Chip
                            label="NEW"
                            size="small"
                            sx={{
                              height: 20,
                              bgcolor: colors.red100,
                              color: colors.red700,
                              fontSize: '0.6875rem',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                        {notice.propertyAddress} • {formatDate(notice.date)}
                      </Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Notifications sx={{ fontSize: 48, color: colors.gray300, mb: 1 }} aria-hidden="true" />
                  <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                    No notices yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
                  Recent Activity
                </Typography>
                <Button
                  endIcon={<East sx={{ fontSize: 16 }} aria-hidden="true" />}
                  onClick={() => navigate('/unified-portal/history')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: colors.blurple500,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  View Full History
                </Button>
              </Box>

              {accountActivities.length > 0 ? (
                <>
                  {accountActivities.slice(0, 5).map((activity) => {
                    const getActivityStyle = (type: Activity['type']) => {
                      switch (type) {
                        case 'payment_received':
                          return { icon: <CheckCircle sx={{ fontSize: 18 }} aria-hidden="true" />, bg: colors.green50, color: colors.green600 };
                        case 'payment_due':
                          return { icon: <Schedule sx={{ fontSize: 18 }} aria-hidden="true" />, bg: colors.yellow50, color: colors.yellow600 };
                        case 'payment_overdue':
                          return { icon: <Warning sx={{ fontSize: 18 }} aria-hidden="true" />, bg: colors.red50, color: colors.red600 };
                        case 'notice_received':
                          return { icon: <Notifications sx={{ fontSize: 18 }} aria-hidden="true" />, bg: colors.blurple50, color: colors.blurple500 };
                        default:
                          return { icon: <Payment sx={{ fontSize: 18 }} aria-hidden="true" />, bg: colors.gray100, color: colors.gray600 };
                      }
                    };

                    const style = getActivityStyle(activity.type);

                    return (
                      <Box key={activity.id} sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'flex-start', '&:last-child': { mb: 0 } }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: style.bg }}>
                          {React.cloneElement(style.icon, { sx: { color: style.color, fontSize: 18 } })}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: colors.gray900 }}>
                            {activity.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>
                            {activity.details}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, mt: 0.5 }}>
                            {formatDate(activity.date)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: colors.gray300, mb: 1 }} aria-hidden="true" />
                  <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                    No activity yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Help Section */}
        <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, mt: 4, p: 3, textAlign: 'center' }}>
          <Typography sx={{ color: colors.gray600, fontSize: '0.9375rem' }}>
            Have questions about your taxes?{' '}
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: colors.blurple500,
                p: 0,
                minWidth: 'auto',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
              onClick={() => navigate('/unified-portal/support')}
            >
              Get help
            </Button>
            {' '}or call us at (555) 123-4567
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default TaxesPage;
