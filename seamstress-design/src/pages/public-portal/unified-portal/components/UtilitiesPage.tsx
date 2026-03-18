/**
 * Utilities Page
 * Modern utility dashboard with usage trends, bills, and quick actions
 */

import React, { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  WaterDrop,
  CalendarToday,
  Download,
  Payment,
  Receipt,
  Person,
  HelpOutline,
  ExpandMore,
  LocationOn,
  TrendingUp,
  ChevronRight,
  Home,
  Business,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;

// Typography helper styles
const typography = {
  small: { fontSize: '0.875rem', lineHeight: 1.5 },
  body: { fontSize: '1rem', lineHeight: 1.5 },
  h1: { fontSize: '2rem', lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: '1.5rem', lineHeight: 1.3, fontWeight: 600 },
};

import { useCity } from './CityContext';

// City-specific utility data
const cityUtilityData: Record<string, any> = {
  'cloud-city': {
    userName: 'Paul Atreides',
    currentBalance: 133.00,
    dueDate: 'Jun 9, 2025',
    daysUntilDue: 7,
    accountNumber: 'UTL-23-4957340',
    address: '123 Main Street, Cloud City, ST 12345',
    status: 'Active',
    waterUsage: {
      current: 6855,
      previous: 5759,
      percentChange: 19,
      hasMultipleMeters: true,
    },
    monthlyUsage: [
      { month: 'May', year: '24', water: 1200, irrigation: 4559 },
      { month: 'Jun', year: '24', water: 2100, irrigation: 5200 },
      { month: 'Jul', year: '24', water: 3200, irrigation: 4800 },
      { month: 'Aug', year: '24', water: 7200, irrigation: 5100 },
      { month: 'Sep', year: '24', water: 7800, irrigation: 5400 },
      { month: 'Oct', year: '24', water: 7600, irrigation: 5200 },
      { month: 'Nov', year: '24', water: 7400, irrigation: 5000 },
      { month: 'Dec', year: '24', water: 7200, irrigation: 4800 },
      { month: 'Jan', year: '25', water: 7000, irrigation: 4600 },
      { month: 'Feb', year: '25', water: 7300, irrigation: 4900 },
      { month: 'Mar', year: '25', water: 7800, irrigation: 5200 },
      { month: 'Apr', year: '25', water: 4500, irrigation: 4200 },
    ],
    averageMonthlyUsage: 5220,
    recentBills: [
      { id: '1', month: 'March 2025', dueDate: 'Apr 15, 2025', amount: 133.00, daysUntilDue: 7, status: 'due' },
      { id: '2', month: 'February 2025', dueDate: 'Mar 15, 2025', amount: 127.50, status: 'paid' },
    ],
  },
  'summit-springs': {
    userName: 'Paul Atreides',
    currentBalance: 156.80,
    dueDate: 'Apr 5, 2025',
    daysUntilDue: -5,
    accountNumber: 'UTL-SS-34821',
    address: '523 Mountain View Drive, Summit Springs, CA 94301',
    status: 'Active',
    waterUsage: {
      current: 7200,
      previous: 6100,
      percentChange: 18,
      hasMultipleMeters: false,
    },
    monthlyUsage: [
      { month: 'May', year: '24', water: 1400, irrigation: 4800 },
      { month: 'Jun', year: '24', water: 2300, irrigation: 5500 },
      { month: 'Jul', year: '24', water: 3500, irrigation: 5100 },
      { month: 'Aug', year: '24', water: 7500, irrigation: 5400 },
      { month: 'Sep', year: '24', water: 8100, irrigation: 5700 },
      { month: 'Oct', year: '24', water: 7900, irrigation: 5500 },
      { month: 'Nov', year: '24', water: 7700, irrigation: 5300 },
      { month: 'Dec', year: '24', water: 7500, irrigation: 5100 },
      { month: 'Jan', year: '25', water: 7300, irrigation: 4900 },
      { month: 'Feb', year: '25', water: 7600, irrigation: 5200 },
      { month: 'Mar', year: '25', water: 8100, irrigation: 5500 },
      { month: 'Apr', year: '25', water: 4800, irrigation: 4500 },
    ],
    averageMonthlyUsage: 5650,
    recentBills: [
      { id: '1', month: 'March 2025', dueDate: 'Apr 5, 2025', amount: 156.80, daysUntilDue: -5, status: 'overdue' },
      { id: '2', month: 'February 2025', dueDate: 'Mar 5, 2025', amount: 142.30, status: 'paid' },
    ],
  },
  'riverside-city': {
    userName: 'Paul Atreides',
    currentBalance: 112.45,
    dueDate: 'Apr 12, 2025',
    daysUntilDue: 2,
    accountNumber: 'UTL-RG-45621',
    address: '2901 Riverbank Lane, Riverside Gardens, CA 94588',
    status: 'Active',
    waterUsage: {
      current: 5900,
      previous: 5200,
      percentChange: 13,
      hasMultipleMeters: false,
    },
    monthlyUsage: [
      { month: 'May', year: '24', water: 1100, irrigation: 4200 },
      { month: 'Jun', year: '24', water: 1900, irrigation: 4800 },
      { month: 'Jul', year: '24', water: 2900, irrigation: 4400 },
      { month: 'Aug', year: '24', water: 6500, irrigation: 4700 },
      { month: 'Sep', year: '24', water: 7100, irrigation: 5000 },
      { month: 'Oct', year: '24', water: 6900, irrigation: 4800 },
      { month: 'Nov', year: '24', water: 6700, irrigation: 4600 },
      { month: 'Dec', year: '24', water: 6500, irrigation: 4400 },
      { month: 'Jan', year: '25', water: 6300, irrigation: 4200 },
      { month: 'Feb', year: '25', water: 6600, irrigation: 4500 },
      { month: 'Mar', year: '25', water: 7100, irrigation: 4800 },
      { month: 'Apr', year: '25', water: 4100, irrigation: 3900 },
    ],
    averageMonthlyUsage: 4850,
    recentBills: [
      { id: '1', month: 'March 2025', dueDate: 'Apr 12, 2025', amount: 112.45, daysUntilDue: 2, status: 'due' },
      { id: '2', month: 'February 2025', dueDate: 'Mar 12, 2025', amount: 108.90, status: 'paid' },
    ],
  },
  'metro-central': {
    userName: 'Paul Atreides',
    currentBalance: 445.60,
    dueDate: 'Apr 10, 2025',
    daysUntilDue: 0,
    accountNumber: 'UTL-MC-89234',
    address: '450 Central Plaza, Suite 12B, Metro Central, CA 94110',
    status: 'Active',
    waterUsage: {
      current: 12500,
      previous: 11200,
      percentChange: 12,
      hasMultipleMeters: true,
    },
    monthlyUsage: [
      { month: 'May', year: '24', water: 2200, irrigation: 0 },
      { month: 'Jun', year: '24', water: 2500, irrigation: 0 },
      { month: 'Jul', year: '24', water: 2800, irrigation: 0 },
      { month: 'Aug', year: '24', water: 3100, irrigation: 0 },
      { month: 'Sep', year: '24', water: 3300, irrigation: 0 },
      { month: 'Oct', year: '24', water: 3200, irrigation: 0 },
      { month: 'Nov', year: '24', water: 3000, irrigation: 0 },
      { month: 'Dec', year: '24', water: 2900, irrigation: 0 },
      { month: 'Jan', year: '25', water: 2800, irrigation: 0 },
      { month: 'Feb', year: '25', water: 2900, irrigation: 0 },
      { month: 'Mar', year: '25', water: 3200, irrigation: 0 },
      { month: 'Apr', year: '25', water: 2700, irrigation: 0 },
    ],
    averageMonthlyUsage: 2950,
    recentBills: [
      { id: '1', month: 'March 2025', dueDate: 'Apr 10, 2025', amount: 445.60, daysUntilDue: 0, status: 'due' },
      { id: '2', month: 'February 2025', dueDate: 'Mar 10, 2025', amount: 432.80, status: 'paid' },
    ],
  },
};

// Account type
interface Account {
  id: string;
  type: 'household' | 'business';
  name: string;
  role: string;
  address: string;
}

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

const quickActions = [
  { id: 'payment', icon: <Payment aria-hidden="true" />, title: 'Add/Update Payment Method', subtitle: 'Quick & Secure', color: colors.blurple500 },
  { id: 'bills', icon: <Receipt aria-hidden="true" />, title: 'View Bills', subtitle: 'Bill History', color: colors.gray400 },
  { id: 'profile', icon: <Person aria-hidden="true" />, title: 'Update Profile', subtitle: 'Manage Your Account', color: colors.gray400 },
  { id: 'support', icon: <HelpOutline aria-hidden="true" />, title: 'Get Support', subtitle: '24/7 Help', color: colors.gray400 },
];

const faqs = [
  { question: 'How do I read my water meter?', answer: 'Your water meter displays usage in gallons. The black numbers show total usage, while the red numbers show partial gallons.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, bank transfers (ACH), and you can also pay in person at City Hall.' },
  { question: 'How can I report a water leak?', answer: 'You can report a water leak by calling our 24/7 emergency line at (555) 123-4567 or through the Support section of this portal.' },
  { question: 'Where can I pay my bills?', answer: 'You can pay your bills online through this portal, by mail, or in person at City Hall during business hours.' },
];

const UtilitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity } = useCity();
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get city-specific accounts
  const userAccounts = useMemo(() => {
    return cityUserAccounts[currentCity.id] || cityUserAccounts['cloud-city'];
  }, [currentCity.id]);

  // Get all utility data for the city (mapped by account ID for easy lookup)
  const allUtilityData = useMemo(() => {
    const data: Record<string, any> = {};
    Object.keys(cityUtilityData).forEach(cityId => {
      if (cityId === currentCity.id) {
        // Map utility data to account IDs based on address matching
        const utilData = cityUtilityData[cityId];
        const matchingAccount = userAccounts.find(acc => acc.address === utilData.address);
        if (matchingAccount) {
          data[matchingAccount.id] = utilData;
        }
      }
    });
    return data;
  }, [currentCity.id, userAccounts]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(userAccounts[0]?.id || '');
  const [viewAllAccounts, setViewAllAccounts] = useState(false);

  // Update selected account when city changes
  React.useEffect(() => {
    if (userAccounts.length > 0 && !userAccounts.find(a => a.id === selectedAccountId)) {
      setSelectedAccountId(userAccounts[0].id);
      setViewAllAccounts(false);
    }
  }, [currentCity.id, userAccounts, selectedAccountId]);

  // Get selected account
  const selectedAccount = userAccounts.find(a => a.id === selectedAccountId);

  // Get account data - for now showing the city's main utility data
  // In a real app, this would be filtered by selectedAccountId
  const accountData = useMemo(() => {
    return cityUtilityData[currentCity.id] || cityUtilityData['cloud-city'];
  }, [currentCity.id]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Handler for quick action clicks
  const handleQuickActionClick = (actionId: string) => {
    // Navigate or perform action based on actionId
    switch (actionId) {
      case 'payment':
        // Navigate to payment method page
        break;
      case 'bills':
        // Navigate to bills page
        break;
      case 'profile':
        // Navigate to profile page
        break;
      case 'support':
        // Navigate to support page
        break;
    }
  };

  // Generate chart description for accessibility
  const chartDescription = useMemo(() => {
    const latestMonth = accountData.monthlyUsage[accountData.monthlyUsage.length - 1];
    const maxWater = Math.max(...accountData.monthlyUsage.map(d => d.water));
    const minWater = Math.min(...accountData.monthlyUsage.map(d => d.water));
    return `Water usage trends chart showing monthly water and irrigation meter readings from ${accountData.monthlyUsage[0].month} ${accountData.monthlyUsage[0].year} to ${latestMonth.month} ${latestMonth.year}. Water meter usage ranges from ${minWater.toLocaleString()} to ${maxWater.toLocaleString()} gallons. Current month shows ${latestMonth.water.toLocaleString()} gallons water and ${latestMonth.irrigation.toLocaleString()} gallons irrigation. Average monthly usage is ${accountData.averageMonthlyUsage.toLocaleString()} gallons.`;
  }, [accountData.monthlyUsage, accountData.averageMonthlyUsage]);

  // Highcharts configuration for water usage trends
  const chartOptions = useMemo(() => ({
    chart: {
      type: 'line',
      height: 220,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: accountData.monthlyUsage.map(d => `${d.month} '${d.year}`),
      labels: {
        style: {
          fontSize: '10px',
          color: colors.gray400
        }
      },
      gridLineWidth: 0,
      lineColor: colors.gray200
    },
    yAxis: {
      title: {
        text: 'Gallons',
        style: {
          fontSize: '11px',
          color: colors.gray400
        }
      },
      labels: {
        style: {
          fontSize: '10px',
          color: colors.gray400
        }
      },
      gridLineColor: colors.gray200,
      gridLineDashStyle: 'Dash'
    },
    legend: {
      align: 'left',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        fontSize: '12px',
        color: colors.gray500,
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: colors.gray700
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        marker: {
          enabled: true,
          radius: 4
        }
      }
    },
    series: [{
      name: 'Water meter',
      data: accountData.monthlyUsage.map(d => d.water),
      color: colors.blurple500,
      lineWidth: 2
    }, {
      name: 'Irrigation meter',
      data: accountData.monthlyUsage.map(d => d.irrigation),
      color: colors.blurple600,
      lineWidth: 2
    }],
    tooltip: {
      shared: true,
      valueDecimals: 0,
      valueSuffix: ' Gal',
      backgroundColor: colors.white,
      borderColor: colors.gray200,
      borderRadius: 8,
      style: {
        fontSize: '12px'
      }
    },
    accessibility: {
      enabled: true,
      description: chartDescription
    }
  }), [accountData.monthlyUsage, colors, chartDescription]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="dashboard" />

      {/* Main Content */}
      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {/* Header with Account Selector - Matching UnifiedDashboard */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900 }}>
                Utilities
              </Typography>
              <Chip
                icon={viewAllAccounts ? <WaterDrop sx={{ fontSize: 16 }} aria-hidden="true" /> : (selectedAccount?.type === 'household' ? <Home sx={{ fontSize: 16 }} aria-hidden="true" /> : <Business sx={{ fontSize: 16 }} aria-hidden="true" />)}
                label={viewAllAccounts ? `Viewing All Accounts (${userAccounts.length})` : `Viewing: ${selectedAccount?.name}`}
                sx={{
                  height: 28,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  bgcolor: `${colors.blurple500}15`,
                  color: colors.blurple700,
                  border: `1px solid ${colors.blurple200}`,
                  '& .MuiChip-icon': { color: colors.blurple700 },
                }}
              />
            </Box>
            <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
              Manage your water, sewer, and trash services
            </Typography>
          </Box>

          {/* Account Selector */}
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<ExpandMore aria-hidden="true" />}
            aria-haspopup="listbox"
            aria-expanded={Boolean(anchorEl)}
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
                bgcolor: `${colors.blurple500}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WaterDrop sx={{ fontSize: 18, color: colors.blurple500 }} aria-hidden="true" />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                  {viewAllAccounts ? 'Viewing All Accounts' : selectedAccount?.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                  {userAccounts.length} {userAccounts.length === 1 ? 'account' : 'accounts'} with utilities
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
                Switch Utility Account
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
                  bgcolor: viewAllAccounts ? colors.blurple500 : `${colors.blurple500}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WaterDrop sx={{ fontSize: 18, color: viewAllAccounts ? colors.white : colors.blurple500 }} aria-hidden="true" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>All Accounts</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    {userAccounts.length} {userAccounts.length === 1 ? 'property' : 'properties'} · {formatCurrency(accountData.currentBalance)}
                  </Typography>
                </Box>
                {viewAllAccounts && <CheckCircle sx={{ fontSize: 20, color: colors.green600 }} aria-hidden="true" />}
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {userAccounts.map((acc) => {
              const isSelected = !viewAllAccounts && selectedAccountId === acc.id;

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
                      bgcolor: `${colors.blurple500}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {acc.type === 'household'
                        ? <Home sx={{ fontSize: 18, color: colors.blurple500 }} aria-hidden="true" />
                        : <Business sx={{ fontSize: 18, color: colors.blurple500 }} aria-hidden="true" />
                      }
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>{acc.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                        {acc.address.split(',')[0]}
                      </Typography>
                    </Box>
                    {isSelected && <CheckCircle sx={{ fontSize: 20, color: colors.green600 }} aria-hidden="true" />}
                  </Box>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>

        {/* Top Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {/* Current Balance Card */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray700 }}>Current Balance</Typography>
                <Chip
                  label={`Due in ${accountData.daysUntilDue} days`}
                  size="small"
                  sx={{ bgcolor: colors.blurple100, color: colors.blurple700, fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Box>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>
                {formatCurrency(accountData.currentBalance)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CalendarToday sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
                <Typography sx={{ ...typography.small, color: colors.gray500 }}>
                  Due on {accountData.dueDate}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Payment aria-hidden="true" />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  py: 1.25,
                }}
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>

          {/* Water Usage Card */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray700 }}>Water Usage</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray400 }}>• Multiple Meters</Typography>
                </Box>
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 14 }} aria-hidden="true" />}
                  label={`${accountData.waterUsage.percentChange}% vs Last Year`}
                  size="small"
                  sx={{ bgcolor: colors.red100, color: colors.red600, fontWeight: 500, fontSize: '0.7rem', '& .MuiChip-icon': { color: colors.red600 } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: colors.gray900 }}>
                  {accountData.waterUsage.current.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: colors.gray900 }}>Gallons</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.gray400 }}>(Current)</Typography>
              </Box>

              {/* Usage Comparison Bars */}
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>2025 May</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{accountData.waterUsage.current.toLocaleString()} Gal</Typography>
                </Box>
                <Box
                  sx={{ height: 8, bgcolor: colors.gray100, borderRadius: 4, overflow: 'hidden' }}
                  role="progressbar"
                  aria-valuenow={100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`2025 May water usage: ${accountData.waterUsage.current.toLocaleString()} gallons`}
                >
                  <Box sx={{ height: '100%', width: '100%', bgcolor: colors.blurple500, borderRadius: 4 }} />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>2024 May</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{accountData.waterUsage.previous.toLocaleString()} Gal</Typography>
                </Box>
                <Box
                  sx={{ height: 8, bgcolor: colors.gray100, borderRadius: 4, overflow: 'hidden' }}
                  role="progressbar"
                  aria-valuenow={Math.round((accountData.waterUsage.previous / accountData.waterUsage.current) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`2024 May water usage: ${accountData.waterUsage.previous.toLocaleString()} gallons`}
                >
                  <Box sx={{ height: '100%', width: `${(accountData.waterUsage.previous / accountData.waterUsage.current) * 100}%`, bgcolor: colors.gray400, borderRadius: 4 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray700 }}>Account Status</Typography>
                <Chip
                  label={accountData.status}
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                {accountData.accountNumber}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <LocationOn sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
                <Typography sx={{ ...typography.small, color: colors.gray500 }}>
                  {accountData.address}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Manage Account
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Middle Section - Chart and Bills */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 3, mb: 4 }}>
          {/* Water Usage Trends */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>Water Usage Trends</Typography>
                <Chip
                  label={`Average monthly usage: ${accountData.averageMonthlyUsage.toLocaleString()} Gallons`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: colors.gray300, color: colors.gray600, fontSize: '0.75rem' }}
                />
              </Box>

              {/* Highcharts Line Chart with Accessibility Wrapper */}
              <Box
                role="img"
                aria-label={chartDescription}
              >
                <Box aria-hidden="true">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Bills */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>Recent Bills</Typography>
                <Button variant="text" size="small" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', p: 0 }}>
                  View All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {accountData.recentBills.map((bill) => (
                  <Card key={bill.id} elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: colors.gray100, color: colors.gray500 }}>
                            <CalendarToday sx={{ fontSize: 20 }} aria-hidden="true" />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>{bill.month}</Typography>
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                              Due {bill.dueDate}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, color: colors.gray900 }}>{formatCurrency(bill.amount)}</Typography>
                          {bill.status === 'due' ? (
                            <Chip label={`Due in ${bill.daysUntilDue} days`} size="small" sx={{ bgcolor: colors.blurple500, color: colors.white, fontWeight: 600, fontSize: '0.6875rem', mt: 0.5 }} />
                          ) : (
                            <Chip label="Paid" size="small" color="success" sx={{ fontWeight: 600, fontSize: '0.6875rem', mt: 0.5 }} />
                          )}
                        </Box>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', p: 0 }}
                        startIcon={<Download sx={{ fontSize: 16 }} aria-hidden="true" />}
                      >
                        Download Bill
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2 }}>Quick Actions</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          {quickActions.map((action) => (
            <Card
              key={action.id}
              elevation={0}
              onClick={() => handleQuickActionClick(action.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleQuickActionClick(action.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${action.title}: ${action.subtitle}`}
              sx={{
                borderRadius: '12px',
                border: `1px solid ${colors.gray200}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: colors.blurple300, transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                '&:focus': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: '2px',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: '2px',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: action.id === 'payment' ? colors.blurple500 : colors.gray100,
                    color: action.id === 'payment' ? colors.white : colors.gray500,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5 }}>{action.title}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>{action.subtitle}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* FAQ Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>Frequently Asked Questions</Typography>
          <Button variant="text" size="small" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', p: 0 }}>
            View All Questions
          </Button>
        </Box>
        <Box>
          {faqs.map((faq, index) => {
            const isFirst = index === 0;
            const isLast = index === faqs.length - 1;
            return (
              <Accordion
                key={index}
                expanded={expandedFaq === `faq-${index}`}
                onChange={(_, isExpanded) => setExpandedFaq(isExpanded ? `faq-${index}` : false)}
                elevation={0}
                disableGutters
                sx={{
                  '&:before': { display: 'none' },
                  border: `1px solid ${colors.gray200}`,
                  borderTop: isFirst ? `1px solid ${colors.gray200}` : 'none',
                  borderRadius: isFirst
                    ? '8px 8px 0 0'
                    : isLast
                      ? '0 0 8px 8px'
                      : 0,
                  bgcolor: colors.white,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: colors.gray500 }} aria-hidden="true" />}
                  sx={{
                    px: 2.5,
                    py: 0.5,
                    '&:hover': { bgcolor: colors.gray50 },
                    '& .MuiAccordionSummary-content': { my: 1.5 },
                  }}
                >
                  <Typography variant="body1" sx={{ color: colors.gray700, fontWeight: 500 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                  <Typography variant="body2" sx={{ color: colors.gray600, lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default UtilitiesPage;
