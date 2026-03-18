/**
 * Unified Dashboard
 * Clean, focused government services portal using Capital Design System
 * With shopping cart and pay all accounts functionality
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
  Drawer,
  IconButton,
  Checkbox,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home,
  Business,
  ExpandMore,
  Warning,
  CheckCircle,
  East,
  DescriptionOutlined,
  SupportAgentOutlined,
  TrendingUp,
  AccountBalance,
  Park,
  Gavel,
  Receipt,
  ShoppingCart,
  Close,
  Delete,
  Add,
  AutoMode,
  Settings,
  CardGiftcard,
  ReportProblem,
  Payment,
  History,
  Refresh,
  PersonAdd,
  WaterDrop,
  Phone,
  Chat,
  Campaign,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';
import PortalNavigation from './PortalNavigation';
import { useCart } from './cart/CartContext';
import { useCity } from './CityContext';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = cdsColors;

// Account type
interface Account {
  id: string;
  type: 'household' | 'business';
  name: string;
  role: string;
  address?: string;
  cityId: string; // Link account to specific city
}

// Bill type - now linked to accounts
interface Bill {
  id: string;
  accountId: string;
  title: string;
  description: string;
  amount: number;
  type: 'bill' | 'tax' | 'fee' | 'permit';
  accountNumber: string;
  dueDate: string;
  isPastDue?: boolean;
  utilities?: ('water' | 'sewer' | 'trash' | 'recycling')[]; // For combined utility bills
}

// Accounts data - mapped to different cities
const allAccounts: Account[] = [
  // Cloud City - 3 accounts
  { id: 'cc-1', type: 'household', name: '123 Main Street', role: 'Owner', address: '123 Main Street, Cloud City, ST 12345', cityId: 'cloud-city' },
  { id: 'cc-2', type: 'business', name: 'ABC Consulting LLC', role: 'Owner', address: '456 Business Ave, Cloud City, ST 12345', cityId: 'cloud-city' },
  { id: 'cc-3', type: 'household', name: '789 Oak Avenue', role: 'Owner', address: '789 Oak Avenue, Cloud City, ST 12345', cityId: 'cloud-city' },

  // Summit Springs - 2 accounts
  { id: 'ss-1', type: 'household', name: '523 Mountain View Drive', role: 'Owner', address: '523 Mountain View Drive, Summit Springs, CA 94301', cityId: 'summit-springs' },
  { id: 'ss-2', type: 'business', name: 'Peak Performance Gym', role: 'Owner', address: '125 Summit Plaza, Summit Springs, CA 94301', cityId: 'summit-springs' },

  // Riverside Gardens - 2 accounts
  { id: 'rg-1', type: 'household', name: '2901 Riverbank Lane', role: 'Owner', address: '2901 Riverbank Lane, Riverside Gardens, CA 94588', cityId: 'riverside-city' },
  { id: 'rg-2', type: 'household', name: '1450 Willow Creek Dr', role: 'Owner', address: '1450 Willow Creek Dr, Riverside Gardens, CA 94588', cityId: 'riverside-city' },

  // Metro Central - 1 account only
  { id: 'mc-1', type: 'business', name: 'Metro Central Ventures', role: 'Owner', address: '450 Central Plaza, Suite 12B, Metro Central, CA 94110', cityId: 'metro-central' },
];

// Bills data - ordered by due date (past due first, then soonest due date)
// Utilities (water, sewer, trash, recycling) are combined into single bills per account
const allBills: Bill[] = [
  // ===== CLOUD CITY BILLS =====
  // Account cc-1 (123 Main Street) - DEFAULT ACCOUNT WITH ALL SERVICES
  // 1. Past Due - Combined Utilities for 123 Main Street
  { id: 'cc-1', accountId: 'cc-1', title: 'Utilities', description: 'March 2025', amount: 133.00, type: 'bill', accountNumber: 'UTL-23-4957340', dueDate: '2025-01-15', isPastDue: true, utilities: ['water', 'sewer', 'trash', 'recycling'] },
  // 2. Building Permit for 123 Main Street
  { id: 'cc-2', accountId: 'cc-1', title: 'Building Permit', description: 'Home Renovation', amount: 425.00, type: 'permit', accountNumber: 'BP-2025-0189', dueDate: '2025-04-18' },
  // 3. Pet License for 123 Main Street
  { id: 'cc-10', accountId: 'cc-1', title: 'Pet License', description: 'Annual Dog License (2 pets)', amount: 45.00, type: 'fee', accountNumber: 'PL-2025-1234', dueDate: '2025-05-10' },
  // 4. Property Tax for 123 Main Street
  { id: 'cc-8', accountId: 'cc-1', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 1240.50, type: 'tax', accountNumber: 'PT-40384-40-492', dueDate: '2025-09-30' },

  // Other Cloud City Accounts
  // 5. April 10 - Combined Utilities for 789 Oak Avenue
  { id: 'cc-3', accountId: 'cc-3', title: 'Utilities', description: 'March 2025', amount: 98.75, type: 'bill', accountNumber: 'UTL-78-9012345', dueDate: '2025-04-10', utilities: ['water', 'sewer', 'trash', 'recycling'] },
  // 6. April 15 - Commercial Utilities for ABC Consulting LLC
  { id: 'cc-4', accountId: 'cc-2', title: 'Commercial Utilities', description: 'March 2025', amount: 89.25, type: 'bill', accountNumber: 'UTL-COM-88291', dueDate: '2025-04-15', utilities: ['water', 'sewer'] },
  // 7. April 20 - Permit
  { id: 'cc-5', accountId: 'cc-2', title: 'Signage Permit', description: 'Storefront Sign Permit', amount: 125.00, type: 'permit', accountNumber: 'SP-2025-0042', dueDate: '2025-04-20' },
  // 8. April 25 - Permit
  { id: 'cc-6', accountId: 'cc-3', title: 'Building Permit', description: 'Deck Construction', amount: 350.00, type: 'permit', accountNumber: 'BP-2025-0342', dueDate: '2025-04-25' },
  // 9. May 1 - Business License
  { id: 'cc-7', accountId: 'cc-2', title: 'Business License', description: 'Annual Renewal 2025', amount: 175.00, type: 'fee', accountNumber: 'BL-2024-5678', dueDate: '2025-05-01' },
  // 10. September 30 - Property taxes
  { id: 'cc-9', accountId: 'cc-3', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 892.00, type: 'tax', accountNumber: 'PT-78901-20-100', dueDate: '2025-09-30' },

  // ===== SUMMIT SPRINGS BILLS =====
  // 1. Utilities for 523 Mountain View Drive
  { id: 'ss-1', accountId: 'ss-1', title: 'Utilities', description: 'March 2025', amount: 156.80, type: 'bill', accountNumber: 'UTL-SS-34821', dueDate: '2025-04-05', utilities: ['water', 'sewer', 'trash', 'recycling'] },
  // 2. Commercial Utilities for Peak Performance Gym
  { id: 'ss-2', accountId: 'ss-2', title: 'Commercial Utilities', description: 'March 2025', amount: 278.90, type: 'bill', accountNumber: 'UTL-SS-COM-98234', dueDate: '2025-04-08', utilities: ['water', 'sewer'] },
  // 3. Business License
  { id: 'ss-3', accountId: 'ss-2', title: 'Business License', description: 'Fitness Center License', amount: 325.00, type: 'fee', accountNumber: 'BL-SS-2025-1122', dueDate: '2025-05-15' },
  // 4. Property Tax
  { id: 'ss-4', accountId: 'ss-1', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 1895.00, type: 'tax', accountNumber: 'PT-SS-52301', dueDate: '2025-09-30' },

  // ===== RIVERSIDE GARDENS BILLS (Only Utilities and Taxes) =====
  // 1. Utilities for 2901 Riverbank Lane
  { id: 'rg-1', accountId: 'rg-1', title: 'Utilities', description: 'March 2025', amount: 112.45, type: 'bill', accountNumber: 'UTL-RG-45621', dueDate: '2025-04-12', utilities: ['water', 'sewer', 'trash', 'recycling'] },
  // 2. Utilities for 1450 Willow Creek Dr
  { id: 'rg-2', accountId: 'rg-2', title: 'Utilities', description: 'March 2025', amount: 98.30, type: 'bill', accountNumber: 'UTL-RG-78934', dueDate: '2025-04-12', utilities: ['water', 'sewer', 'trash', 'recycling'] },
  // 3. Property Tax for 2901 Riverbank Lane
  { id: 'rg-3', accountId: 'rg-1', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 1456.75, type: 'tax', accountNumber: 'PT-RG-45621', dueDate: '2025-09-30' },
  // 4. Property Tax for 1450 Willow Creek Dr
  { id: 'rg-4', accountId: 'rg-2', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 1123.50, type: 'tax', accountNumber: 'PT-RG-78934', dueDate: '2025-09-30' },

  // ===== METRO CENTRAL BILLS (Single Account) =====
  // 1. Commercial Utilities
  { id: 'mc-1', accountId: 'mc-1', title: 'Commercial Utilities', description: 'March 2025', amount: 445.60, type: 'bill', accountNumber: 'UTL-MC-89234', dueDate: '2025-04-10', utilities: ['water', 'sewer'] },
  // 2. Business License
  { id: 'mc-2', accountId: 'mc-1', title: 'Business License', description: 'Commercial Enterprise', amount: 580.00, type: 'fee', accountNumber: 'BL-MC-2025-8923', dueDate: '2025-05-01' },
  // 3. Building Permit
  { id: 'mc-3', accountId: 'mc-1', title: 'Building Permit', description: 'Office Renovation', amount: 1250.00, type: 'permit', accountNumber: 'BP-MC-2025-4421', dueDate: '2025-04-28' },
  // 4. Property Tax
  { id: 'mc-4', accountId: 'mc-1', title: 'Property Tax', description: '2025 Q2 Assessment', amount: 3240.80, type: 'tax', accountNumber: 'PT-MC-89234', dueDate: '2025-09-30' },
];

const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, addItem, removeItem, openCart, isInCart } = useCart();
  const { currentCity } = useCity();
  const [viewAllAccounts, setViewAllAccounts] = useState(false); // Default to single account view
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

  // Filter accounts for current city
  const accounts = useMemo(() => {
    return allAccounts.filter(acc => acc.cityId === currentCity.id);
  }, [currentCity.id]);

  // Filter bills for current city accounts
  const cityBills = useMemo(() => {
    const cityAccountIds = accounts.map(a => a.id);
    return allBills.filter(bill => cityAccountIds.includes(bill.accountId));
  }, [accounts]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');

  // Update selected account when city changes
  React.useEffect(() => {
    if (accounts.length > 0 && !accounts.find(a => a.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
      setViewAllAccounts(false);
    }
  }, [currentCity.id, accounts, selectedAccountId]);

  // Get selected account object
  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  // Filter bills based on view mode
  const visibleBills = useMemo(() => {
    if (viewAllAccounts) {
      return cityBills;
    }
    return cityBills.filter(bill => bill.accountId === selectedAccountId);
  }, [viewAllAccounts, selectedAccountId, cityBills]);

  // Count bills per account for stats
  const billsPerAccount = useMemo(() => {
    const counts: Record<string, { count: number; total: number; pastDue: number }> = {};
    cityBills.forEach(bill => {
      if (!counts[bill.accountId]) {
        counts[bill.accountId] = { count: 0, total: 0, pastDue: 0 };
      }
      counts[bill.accountId].count++;
      counts[bill.accountId].total += bill.amount;
      if (bill.isPastDue) counts[bill.accountId].pastDue++;
    });
    return counts;
  }, [cityBills]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleToggleInCart = (bill: Bill) => {
    if (isInCart(bill.accountId, bill.type as any)) {
      // Remove from cart - find the item by accountId and type
      const itemToRemove = cartItems.find(item => item.accountId === bill.accountId && item.type === bill.type);
      if (itemToRemove) {
        removeItem(itemToRemove.id);
      }
    } else {
      // Add to cart
      const account = accounts.find(a => a.id === bill.accountId);
      addItem({
        id: `${bill.type}-${bill.accountId}-${Date.now()}`,
        type: bill.type as any,
        title: bill.title,
        description: bill.description,
        amount: bill.amount,
        accountId: bill.accountId,
        accountNumber: bill.accountNumber,
        dueDate: bill.dueDate,
        metadata: {
          accountName: account?.name || bill.title,
          accountType: account?.type || 'household',
          utilities: bill.utilities,
          isPastDue: bill.isPastDue,
        },
      });
    }
  };

  const handleAddAllToCart = () => {
    // Add all visible bills to cart that aren't already in cart
    visibleBills.forEach(bill => {
      if (!isInCart(bill.accountId, bill.type as any)) {
        const account = accounts.find(a => a.id === bill.accountId);
        addItem({
          id: `${bill.type}-${bill.accountId}-${Date.now()}`,
          type: bill.type as any,
          title: bill.title,
          description: bill.description,
          amount: bill.amount,
          accountId: bill.accountId,
          accountNumber: bill.accountNumber,
          dueDate: bill.dueDate,
          metadata: {
            accountName: account?.name || bill.title,
            accountType: account?.type || 'household',
            utilities: bill.utilities,
            isPastDue: bill.isPastDue,
          },
        });
      }
    });
    openCart();
  };

  const getAccountById = (accountId: string) => accounts.find(a => a.id === accountId);

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'bill': return <Receipt aria-hidden="true" />;
      case 'tax': return <AccountBalance aria-hidden="true" />;
      case 'fee': return <Gavel aria-hidden="true" />;
      case 'permit': return <DescriptionOutlined aria-hidden="true" />;
      default: return <Receipt aria-hidden="true" />;
    }
  };

  const getBillColor = (type: string) => {
    // Using consistent blurple500 for all bill types
    return colors.blurple500;
  };

  const totalBalance = visibleBills.reduce((sum, b) => sum + b.amount, 0);
  const pastDueCount = visibleBills.filter(b => b.isPastDue).length;

  // Helper function for keyboard navigation on clickable elements
  const handleKeyDown = (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Skip to main content link - Section 508 compliance */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          '&:focus': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'auto',
            height: 'auto',
            padding: 2,
            bgcolor: colors.blurple500,
            color: colors.white,
            zIndex: 9999,
            textDecoration: 'none',
            fontWeight: 600,
          },
        }}
      >
        Skip to main content
      </Box>

      {/* Navigation Header */}
      <PortalNavigation activeTab="dashboard" />

      {/* Main Content - landmark: main */}
      <Box
        component="main"
        id="main-content"
        role="main"
        aria-label="Dashboard main content"
        sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3, md: 4 } }}
      >
        {/* Welcome Section - Clean Header */}
        <Box component="section" role="region" aria-labelledby="welcome-heading" sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography id="welcome-heading" variant="h1" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
              Welcome to {currentCity.name}, Paul
            </Typography>
            <Typography variant="body1" sx={{ color: colors.gray500 }}>
              Manage your accounts easily and securely
            </Typography>
          </Box>

          {/* Account Dropdown */}
          <Button
            onClick={(e) => setAccountMenuAnchor(e.currentTarget)}
            endIcon={<ExpandMore aria-hidden="true" />}
            aria-haspopup="true"
            aria-expanded={Boolean(accountMenuAnchor)}
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
                borderRadius: '4px',
                bgcolor: colors.blurple100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Receipt aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500 }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                  {viewAllAccounts ? 'Viewing Dashboard' : selectedAccount.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                  {accounts.length} connected accounts
                </Typography>
              </Box>
            </Box>
          </Button>

          {/* Account Selection Menu */}
          <Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={() => setAccountMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: '4px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: 280,
              }
            }}
          >
            <MenuItem
              onClick={() => { setViewAllAccounts(true); setAccountMenuAnchor(null); }}
              selected={viewAllAccounts}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  bgcolor: viewAllAccounts ? colors.blurple500 : colors.blurple100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Receipt aria-hidden="true" sx={{ fontSize: 18, color: viewAllAccounts ? colors.white : colors.blurple500 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>All Accounts</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{cityBills.length} bills · {formatCurrency(cityBills.reduce((s, b) => s + b.amount, 0))}</Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            {accounts.map((acc) => {
              const stats = billsPerAccount[acc.id] || { count: 0, total: 0, pastDue: 0 };
              const isSelected = !viewAllAccounts && selectedAccountId === acc.id;
              return (
                <MenuItem
                  key={acc.id}
                  onClick={() => { setViewAllAccounts(false); setSelectedAccountId(acc.id); setAccountMenuAnchor(null); }}
                  selected={isSelected}
                  sx={{ py: 1.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                        ? <Home aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500 }} />
                        : <Business aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500 }} />
                      }
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>{acc.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{stats.count} bills · {formatCurrency(stats.total)}</Typography>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => { navigate('/unified-portal/add-account'); setAccountMenuAnchor(null); }}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  border: `1px dashed ${colors.gray300}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Add aria-hidden="true" sx={{ fontSize: 18, color: colors.gray400 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray600 }}>Add Account/PIDN</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray400 }}>Connect or claim record</Typography>
                </Box>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* Empty State Callout - show when no accounts */}
        {accounts.length === 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: '8px',
              border: `1px solid ${colors.blurple200}`,
              bgcolor: colors.blurple50,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '4px',
                bgcolor: colors.blurple100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                <PersonAdd aria-hidden="true" sx={{ fontSize: 28, color: colors.blurple500 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.blurple700, mb: 0.5 }}>
                  Welcome to Cloud City! Let's get you set up.
                      </Typography>
                <Typography variant="body2" sx={{ color: colors.blurple600, mb: 1.5 }}>
                  Connect your utility accounts, property tax records, or register for permits and services to manage everything in one place.
                      </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add aria-hidden="true" />}
                    onClick={() => navigate('/unified-portal/add-account')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                      bgcolor: colors.blurple500,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    Add Your First Account
              </Button>
                  <Button
                    variant="outlined"
              size="small"
                    onClick={() => navigate('/unified-portal/permits/lookup')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
                      color: colors.blurple500,
                      borderColor: colors.blurple300,
              borderRadius: '8px',
                      '&:hover': { bgcolor: colors.blurple100, borderColor: colors.blurple500 },
                    }}
                  >
                    Look Up Property Records
          </Button>
        </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards - Responsive grid */}
        <Box
          component="section"
          role="region"
          aria-labelledby="summary-cards-heading"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 3 },
            mb: 4
          }}
        >
          <Typography id="summary-cards-heading" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Account Summary
          </Typography>
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: colors.gray500, mb: 1 }}>
                {viewAllAccounts ? 'Total Balance (All Accounts)' : 'Balance Due'}
            </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>{formatCurrency(totalBalance)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Receipt aria-hidden="true" sx={{ fontSize: 16, color: colors.gray400 }} />
                  <Typography variant="caption" sx={{ color: colors.gray500 }}>{visibleBills.length} bills due</Typography>
          </Box>
                {pastDueCount > 0 && (
                  <Chip label={`${pastDueCount} Past Due`} size="small" icon={<Warning aria-hidden="true" sx={{ fontSize: 12 }} />} sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.red100, color: colors.red700, '& .MuiChip-icon': { color: colors.red700 } }} />
                )}
              </Box>
          <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddAllToCart}
                sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px', mb: 1.5 }}
              >
                <Payment aria-hidden="true" sx={{ fontSize: 18, mr: 1 }} /> Pay {viewAllAccounts ? 'All Accounts' : 'All'} ({formatCurrency(totalBalance)})
          </Button>
                <Button
                  fullWidth
                variant="text"
                size="small"
                onClick={() => navigate('/unified-portal/assistance')}
                  sx={{
                    textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  color: colors.blurple500,
                  '&:hover': { bgcolor: colors.blurple50 },
                }}
              >
                View payment plans & assistance →
                </Button>
              </CardContent>
            </Card>

          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: colors.gray500, mb: 1 }}>
                {viewAllAccounts ? 'Connected Accounts' : 'Account Status'}
                  </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                {viewAllAccounts ? accounts.length : 'Active'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <Gavel aria-hidden="true" sx={{ fontSize: 16, color: colors.gray400 }} />
                <Typography variant="caption" sx={{ color: colors.gray500 }}>
                  {viewAllAccounts ? 'All services active' : selectedAccount.address}
                  </Typography>
                </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircle aria-hidden="true" sx={{ fontSize: 16, color: colors.green600 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.green600 }}>Good standing</Typography>
                  </Box>
              </CardContent>
            </Card>

            {/* Autopay Card */}
            <Card
            elevation={0}
                  sx={{
                    borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                background: `linear-gradient(135deg, ${colors.blurple50} 0%, ${colors.white} 100%)`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
            borderRadius: '4px',
                      bgcolor: colors.blurple100,
            display: 'flex',
            alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AutoMode aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
        </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900 }}>
                        AutoPay
                  </Typography>
                      <Typography variant="caption" sx={{ color: colors.gray500 }}>
                        Never miss a payment
                </Typography>
                  </Box>
                </Box>
                  <IconButton
                    size="small"
                    sx={{ color: colors.gray400 }}
                    aria-label="AutoPay settings"
                  >
                    <Settings aria-hidden="true" sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircle aria-hidden="true" sx={{ fontSize: 14, color: colors.green600 }} />
                    <Typography variant="caption" sx={{ color: colors.gray600 }}>
                      Utilities (Water, Trash)
                </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${colors.gray300}` }} aria-hidden="true" />
                    <Typography variant="caption" sx={{ color: colors.gray400 }}>
                      Property Tax
                  </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/unified-portal/account')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: colors.blurple500,
                    borderColor: colors.blurple300,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: colors.blurple50, borderColor: colors.blurple500 },
                  }}
                >
                  Manage AutoPay
                </Button>
              </CardContent>
            </Card>
                  </Box>

        {/* Outstanding Balance by Service */}
        <Box component="section" role="region" aria-labelledby="outstanding-balance-heading" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
            <Typography id="outstanding-balance-heading" variant="h2" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
              Outstanding Balance by Service
            </Typography>
            <Button
              onClick={() => navigate('/unified-portal/history')}
              sx={{ textTransform: 'none', fontWeight: 600, color: colors.blurple500, flexShrink: 0 }}
            >
              View All Bills
            </Button>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 3 }
          }}>
            {/* Utilities Card */}
            {(() => {
              const utilityBills = visibleBills.filter(b => b.type === 'bill');
              const totalAmount = utilityBills.reduce((sum, b) => sum + b.amount, 0);
              const nextDue = utilityBills.filter(b => !b.isPastDue).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
              const pastDueCount = utilityBills.filter(b => b.isPastDue).length;
              // Get all unique utilities across bills
              const allUtilities = [...new Set(utilityBills.flatMap(b => b.utilities || []))];
              if (utilityBills.length === 0) return null;
              return (
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '4px',
                    border: `1px solid ${colors.gray200}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: colors.blurple300, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '4px', bgcolor: `${colors.blurple500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <WaterDrop aria-hidden="true" sx={{ fontSize: 22, color: colors.blurple500 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>Utilities</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{utilityBills.length} bill{utilityBills.length !== 1 ? 's' : ''}</Typography>
                      </Box>
                    </Box>
                    {/* Utility type chips */}
                    {allUtilities.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                        {allUtilities.map((utility) => (
                          <Chip
                            key={utility}
                            label={utility.charAt(0).toUpperCase() + utility.slice(1)}
                            size="small"
                            sx={{ height: 18, fontSize: '0.625rem', bgcolor: colors.gray100, color: colors.gray600, '& .MuiChip-label': { px: 0.75 } }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>{formatCurrency(totalAmount)}</Typography>
                    {pastDueCount > 0 ? (
                      <Chip label={`${pastDueCount} past due`} size="small" icon={<Warning aria-hidden="true" sx={{ fontSize: 12 }} />} sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.red100, color: colors.red700, '& .MuiChip-icon': { color: colors.red700 } }} />
                    ) : nextDue ? (
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Next due {nextDue.dueDate}</Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${colors.gray100}` }}>
                      <Button
                        variant="text"
                        onClick={() => navigate('/unified-portal/utilities')}
                        endIcon={<East aria-hidden="true" />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          color: colors.blurple500,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Add aria-hidden="true" sx={{ fontSize: 14 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          utilityBills.forEach(b => {
                            if (!isInCart(b.accountId, b.type as any)) {
                              handleToggleInCart(b);
                            }
                          });
                        }}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500, bgcolor: 'transparent' } }}
                      >
                        Add to cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Taxes Card */}
            {(() => {
              const taxBills = visibleBills.filter(b => b.type === 'tax');
              const totalAmount = taxBills.reduce((sum, b) => sum + b.amount, 0);
              const nextDue = taxBills.filter(b => !b.isPastDue).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
              const pastDueCount = taxBills.filter(b => b.isPastDue).length;
              if (taxBills.length === 0) return null;
              return (
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '4px',
                    border: `1px solid ${colors.gray200}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: colors.blurple300, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '4px', bgcolor: `${colors.blurple500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AccountBalance aria-hidden="true" sx={{ fontSize: 22, color: colors.blurple500 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>Taxes</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{taxBills.length} assessment{taxBills.length !== 1 ? 's' : ''}</Typography>
                      </Box>
                    </Box>
                    {/* Tax type chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      <Chip label="Property" size="small" sx={{ height: 18, fontSize: '0.625rem', bgcolor: colors.gray100, color: colors.gray600, '& .MuiChip-label': { px: 0.75 } }} />
                    </Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>{formatCurrency(totalAmount)}</Typography>
                    {pastDueCount > 0 ? (
                      <Chip label={`${pastDueCount} past due`} size="small" icon={<Warning aria-hidden="true" sx={{ fontSize: 12 }} />} sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.red100, color: colors.red700, '& .MuiChip-icon': { color: colors.red700 } }} />
                    ) : nextDue ? (
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Due {nextDue.dueDate}</Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${colors.gray100}` }}>
                      <Button
                        variant="text"
                        onClick={() => navigate('/unified-portal/taxes')}
                        endIcon={<East aria-hidden="true" />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          color: colors.blurple500,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Add aria-hidden="true" sx={{ fontSize: 14 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          taxBills.forEach(b => {
                            if (!isInCart(b.accountId, b.type as any)) {
                              handleToggleInCart(b);
                            }
                          });
                        }}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500, bgcolor: 'transparent' } }}
                      >
                        Add to cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Permits Card */}
            {(() => {
              const permitBills = visibleBills.filter(b => b.type === 'permit');
              const totalAmount = permitBills.reduce((sum, b) => sum + b.amount, 0);
              const nextDue = permitBills.filter(b => !b.isPastDue).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
              if (permitBills.length === 0) return null;
              // Get permit types from titles
              const permitTypes = [...new Set(permitBills.map(b => b.title.replace(' Permit', '')))];
              return (
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '4px',
                    border: `1px solid ${colors.gray200}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: colors.blurple300, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '4px', bgcolor: `${colors.blurple500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DescriptionOutlined aria-hidden="true" sx={{ fontSize: 22, color: colors.blurple500 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>Permits</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{permitBills.length} permit{permitBills.length !== 1 ? 's' : ''}</Typography>
                      </Box>
                    </Box>
                    {/* Permit type chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {permitTypes.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{ height: 18, fontSize: '0.625rem', bgcolor: colors.gray100, color: colors.gray600, '& .MuiChip-label': { px: 0.75 } }}
                        />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>{formatCurrency(totalAmount)}</Typography>
                    {nextDue ? (
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Next due {nextDue.dueDate}</Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${colors.gray100}` }}>
                      <Button
                        variant="text"
                        onClick={() => navigate('/unified-portal/permits')}
                        endIcon={<East aria-hidden="true" />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          color: colors.blurple500,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Add aria-hidden="true" sx={{ fontSize: 14 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          permitBills.forEach(b => {
                            if (!isInCart(b.accountId, b.type as any)) {
                              handleToggleInCart(b);
                            }
                          });
                        }}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500, bgcolor: 'transparent' } }}
                      >
                        Add to cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Licenses Card */}
            {(() => {
              const feeBills = visibleBills.filter(b => b.type === 'fee');
              const totalAmount = feeBills.reduce((sum, b) => sum + b.amount, 0);
              const nextDue = feeBills.filter(b => !b.isPastDue).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
              if (feeBills.length === 0) return null;
              return (
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '4px',
                    border: `1px solid ${colors.gray200}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: colors.blurple300, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '4px', bgcolor: `${colors.blurple500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Gavel aria-hidden="true" sx={{ fontSize: 22, color: colors.blurple500 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>Licenses</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{feeBills.length} license{feeBills.length !== 1 ? 's' : ''}</Typography>
                      </Box>
                    </Box>
                    {/* License type chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      <Chip label="Business" size="small" sx={{ height: 18, fontSize: '0.625rem', bgcolor: colors.gray100, color: colors.gray600, '& .MuiChip-label': { px: 0.75 } }} />
                    </Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>{formatCurrency(totalAmount)}</Typography>
                    {nextDue ? (
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Renewal due {nextDue.dueDate}</Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${colors.gray100}` }}>
                      <Button
                        variant="text"
                        onClick={() => navigate('/unified-portal/licenses')}
                        endIcon={<East aria-hidden="true" />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          color: colors.blurple500,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Add aria-hidden="true" sx={{ fontSize: 14 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          feeBills.forEach(b => {
                            if (!isInCart(b.accountId, b.type as any)) {
                              handleToggleInCart(b);
                            }
                          });
                        }}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500, bgcolor: 'transparent' } }}
                      >
                        Add to cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })()}
          </Box>
        </Box>

        {/* Notifications & Payment History - Responsive */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: { xs: 2, md: 3 },
          mb: 4
        }}>
          {/* Notifications - Clean Design */}
          <Card component="section" role="region" aria-labelledby="notifications-heading" elevation={0} sx={{ borderRadius: '4px', border: `1px solid ${colors.gray200}`, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ color: colors.gray500 }} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                  </svg>
                </Box>
                <Typography id="notifications-heading" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>Notifications</Typography>
              </Box>
              <Chip
                label="2 new"
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  bgcolor: colors.blurple100,
                  color: colors.blurple600,
                  borderRadius: '4px',
                }}
              />
            </Box>

            {/* Notification Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} role="list" aria-label="Recent notifications">
              {/* Rate Change Notice */}
              <Box
                role="listitem"
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 2,
                  bgcolor: colors.blurple50,
                  borderRadius: '8px',
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: colors.blurple500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <Typography sx={{ color: colors.white, fontSize: '0.75rem', fontWeight: 700 }}>i</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>Rate change notice</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray600 }}>Water rates updated effective Jan 1, 2025</Typography>
                </Box>
              </Box>

              {/* Payment Received */}
              <Box
                role="listitem"
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 2,
                  borderRadius: '8px',
                }}
              >
                <CheckCircle aria-hidden="true" sx={{ fontSize: 24, color: colors.green500, flexShrink: 0, mt: 0.25 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>Payment received</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray600 }}>$89.50 for water service · Dec 1</Typography>
                </Box>
              </Box>
            </Box>

            {/* View All Link */}
            <Button
              fullWidth
              onClick={() => navigate('/unified-portal/history')}
              sx={{
                mt: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: colors.blurple500,
                '&:hover': { bgcolor: colors.blurple50 },
              }}
            >
              View All Notifications
            </Button>
          </Card>

          {/* Payment History */}
          <Card component="section" role="region" aria-labelledby="payment-history-heading" elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Box sx={{ p: 2.5, borderBottom: `1px solid ${colors.gray100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography id="payment-history-heading" variant="h3" component="h3" sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>Payment History</Typography>
                <Typography variant="caption" sx={{ color: colors.gray500 }}>Past 12 months · All accounts</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: colors.green50, px: 1.5, py: 0.5, borderRadius: '6px' }}>
                <TrendingUp aria-hidden="true" sx={{ fontSize: 14, color: colors.green600 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.green600, fontSize: '0.8125rem' }}>12% less</Typography>
                <Typography variant="caption" sx={{ color: colors.green600 }}>vs last year</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {/* Chart with Y-axis labels */}
              <Box sx={{ display: 'flex', gap: 1 }} role="img" aria-label="Bar chart showing payment history over the past 12 months. December shows highest spending at $478.">
                {/* Y-axis labels */}
                <Box aria-hidden="true" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 140, pr: 1, borderRight: `1px solid ${colors.gray200}` }}>
                  {['$600', '$450', '$300', '$150', '$0'].map((label) => (
                    <Typography key={label} variant="caption" sx={{ color: colors.gray400, fontSize: '0.625rem', textAlign: 'right', minWidth: 32 }}>{label}</Typography>
                  ))}
                </Box>

                {/* Bars */}
                <Box sx={{ flex: 1 }} aria-hidden="true">
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 0.5, borderBottom: `1px solid ${colors.gray200}`, pb: 0.5 }}>
                    {[
                      { month: 'Jan', amount: 285, utilities: 145, taxes: 0, permits: 140, parks: 0 },
                      { month: 'Feb', amount: 312, utilities: 152, taxes: 0, permits: 0, parks: 160 },
                      { month: 'Mar', amount: 198, utilities: 148, taxes: 0, permits: 50, parks: 0 },
                      { month: 'Apr', amount: 425, utilities: 155, taxes: 270, permits: 0, parks: 0 },
                      { month: 'May', amount: 267, utilities: 142, taxes: 0, permits: 125, parks: 0 },
                      { month: 'Jun', amount: 534, utilities: 164, taxes: 0, permits: 0, parks: 370 },
                      { month: 'Jul', amount: 389, utilities: 169, taxes: 0, permits: 220, parks: 0 },
                      { month: 'Aug', amount: 298, utilities: 158, taxes: 0, permits: 0, parks: 140 },
                      { month: 'Sep', amount: 412, utilities: 152, taxes: 260, permits: 0, parks: 0 },
                      { month: 'Oct', amount: 276, utilities: 146, taxes: 0, permits: 130, parks: 0 },
                      { month: 'Nov', amount: 345, utilities: 155, taxes: 0, permits: 0, parks: 190 },
                      { month: 'Dec', amount: 478, utilities: 168, taxes: 0, permits: 310, parks: 0 },
                    ].map((data, i) => {
                      const maxAmount = 600;
                      const barHeight = (data.amount / maxAmount) * 130;
                      const isCurrentMonth = i === 11; // December - most recent month
                      return (
                        <Box
                          key={i}
                          sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            '&:hover .tooltip': { opacity: 1, visibility: 'visible' },
                          }}
                        >
                          {/* Tooltip */}
                          <Box
                            className="tooltip"
                            sx={{
                              position: 'absolute',
                              bottom: barHeight + 8,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              bgcolor: colors.gray900,
                              color: colors.white,
                              px: 1.5,
                              py: 1,
                              borderRadius: '4px',
                              opacity: 0,
                              visibility: 'hidden',
                              transition: 'all 0.2s ease',
                              zIndex: 10,
                              minWidth: 120,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                          >
                            <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>{data.month} 2024</Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 0.5 }}>${data.amount.toLocaleString()}</Typography>
                            <Box sx={{ fontSize: '0.625rem', color: colors.gray300 }}>
                              {data.utilities > 0 && <Box>Utilities: ${data.utilities}</Box>}
                              {data.taxes > 0 && <Box>Taxes: ${data.taxes}</Box>}
                              {data.permits > 0 && <Box>Permits: ${data.permits}</Box>}
                              {data.parks > 0 && <Box>Parks: ${data.parks}</Box>}
                            </Box>
                          </Box>

                          {/* Bar */}
                          <Box
                            sx={{
                              width: '100%',
                              maxWidth: 32,
                              height: `${barHeight}px`,
                              bgcolor: isCurrentMonth ? colors.blurple500 : colors.blurple200,
                              borderRadius: '3px 3px 0 0',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': { bgcolor: colors.blurple400 },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  {/* X-axis labels */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          flex: 1,
                          textAlign: 'center',
                          color: i === 11 ? colors.blurple500 : colors.gray400,
                          fontSize: '0.625rem',
                          fontWeight: i === 11 ? 700 : 400,
                        }}
                      >
                        {month}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Legend */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, pt: 2, borderTop: `1px solid ${colors.gray100}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box aria-hidden="true" sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: colors.blurple500 }} />
                  <Typography variant="caption" sx={{ color: colors.gray500, fontSize: '0.6875rem' }}>Current month</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box aria-hidden="true" sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: colors.blurple200 }} />
                  <Typography variant="caption" sx={{ color: colors.gray500, fontSize: '0.6875rem' }}>Previous months</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: colors.gray400, fontSize: '0.6875rem' }}>Hover bars for details</Typography>
              </Box>
            </Box>
          </Card>
                  </Box>

{/* Explore Services */}
        <Box component="section" role="region" aria-labelledby="explore-services-heading" sx={{ mb: 4 }}>
          <Typography id="explore-services-heading" variant="h2" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>Explore Services</Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: 2
          }}>
            {/* Utilities */}
            <Card
              elevation={0}
              onClick={() => navigate('/unified-portal/utilities')}
              onKeyDown={handleKeyDown(() => navigate('/unified-portal/utilities'))}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Utilities - Water, trash and sewer services"
              sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                bgcolor: colors.white,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: colors.blurple300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: 2,
                }
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: `${colors.blurple500}15`,
            display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <WaterDrop aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                </Box>
            <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>Utilities</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, lineHeight: 1.3, fontSize: '0.6875rem' }}>Water, trash & sewer</Typography>
            </Box>
              </CardContent>
            </Card>

            {/* Taxes */}
            <Card
                  elevation={0}
              onClick={() => navigate('/unified-portal/taxes')}
              onKeyDown={handleKeyDown(() => navigate('/unified-portal/taxes'))}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Taxes - Property and business taxes"
                  sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                bgcolor: colors.white,
                    cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: colors.blurple300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: 2,
                }
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                  width: 40,
                  height: 40,
                    borderRadius: '4px',
                  bgcolor: `${colors.blurple500}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  flexShrink: 0,
                  }}>
                  <Receipt aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                  </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>Taxes</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, lineHeight: 1.3, fontSize: '0.6875rem' }}>Property & business</Typography>
        </Box>
              </CardContent>
            </Card>

            {/* Permits & Licensing */}
            <Card
              elevation={0}
              onClick={() => navigate('/unified-portal/permits')}
              onKeyDown={handleKeyDown(() => navigate('/unified-portal/permits'))}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Permits and Licensing - Building, business, and event permits"
              sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                bgcolor: colors.white,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: colors.blurple300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: 2,
                }
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: `${colors.blurple500}15`,
            display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <DescriptionOutlined aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                </Box>
            <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>Permits & Licensing</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, lineHeight: 1.3, fontSize: '0.6875rem' }}>Building, business, events</Typography>
            </Box>
                  </CardContent>
                </Card>

            {/* Parks & Recreation */}
            <Card
                  elevation={0}
              onClick={() => navigate('/unified-portal/parks')}
              onKeyDown={handleKeyDown(() => navigate('/unified-portal/parks'))}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Parks and Recreation - Passes and rentals"
                  sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                bgcolor: colors.white,
                    cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: colors.blurple300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: 2,
                }
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                  width: 40,
                  height: 40,
                    borderRadius: '4px',
                  bgcolor: `${colors.blurple500}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  flexShrink: 0,
                  }}>
                  <Park aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                  </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>Parks & Recreation</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, lineHeight: 1.3, fontSize: '0.6875rem' }}>Passes & rentals</Typography>
        </Box>
              </CardContent>
            </Card>

            {/* Grants & Funding */}
        <Card
          elevation={0}
              onClick={() => navigate('/unified-portal/grants')}
              onKeyDown={handleKeyDown(() => navigate('/unified-portal/grants'))}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Grants and Funding - For nonprofits, schools, and businesses"
          sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.gray200}`,
                bgcolor: colors.white,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: colors.blurple300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.blurple500}`,
                  outlineOffset: 2,
                }
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: `${colors.blurple500}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                  <CardGiftcard aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                  </Box>
                  <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>Grants & Funding</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, lineHeight: 1.3, fontSize: '0.6875rem' }}>Nonprofits, schools & businesses</Typography>
                  </Box>
              </CardContent>
            </Card>
                </Box>

          {/* Announcement Banner - Easy to update content */}
          {(() => {
            // Configure announcement here - change text without touching styles
            const announcement = {
              message: "Nonprofits, schools, and businesses can apply for Grants & Funding under Services.",
              linkText: "Grants & Funding",
              linkPath: "/unified-portal/grants",
            };

            return (
              <Box
                role="status"
                aria-live="polite"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mt: 2,
                  p: 1.5,
                  bgcolor: `${colors.blurple500}10`,
                  borderRadius: '8px',
                  border: `1px solid ${colors.blurple200}`,
                }}
              >
                <Campaign aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500, flexShrink: 0 }} />
                <Typography sx={{ color: colors.gray700, fontSize: '0.8125rem' }}>
                  {announcement.message}
                </Typography>
              </Box>
            );
          })()}
                  </Box>

        {/* Quick Actions - 5 columns */}
        <Box component="section" role="region" aria-labelledby="quick-actions-heading" sx={{ mb: 4 }}>
          <Typography id="quick-actions-heading" variant="h2" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>Quick Actions</Typography>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2
          }}>
            {[
              { icon: <Payment aria-hidden="true" />, title: 'Make a Payment', desc: 'Pay bills now', path: '/unified-portal/pay' },
              { icon: <AutoMode aria-hidden="true" />, title: 'Set Up AutoPay', desc: 'Never miss a due date', path: '/unified-portal/account' },
              { icon: <History aria-hidden="true" />, title: 'View Bills & History', desc: 'All transactions', path: '/unified-portal/history' },
              { icon: <ReportProblem aria-hidden="true" />, title: 'Report an Issue', desc: 'Potholes, lights & more', path: '/unified-portal/311' },
              { icon: <Refresh aria-hidden="true" />, title: 'Renew Permit or License', desc: 'Quick renewals', path: '/unified-portal/permits' },
            ].map((action, i) => (
              <Card
                key={i}
                elevation={0}
                onClick={() => navigate(action.path)}
                onKeyDown={handleKeyDown(() => navigate(action.path))}
                role="button"
                tabIndex={0}
                aria-label={`${action.title} - ${action.desc}`}
                sx={{
                  flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(33.333% - 11px)', lg: '1 1 0' },
                  minWidth: { xs: 'calc(50% - 8px)', sm: 'auto', lg: 0 },
                  borderRadius: '8px',
                  border: `1px solid ${colors.gray200}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: colors.blurple300,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.blurple500}`,
                    outlineOffset: 2,
                  }
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '4px', bgcolor: `${colors.blurple500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, color: colors.blurple500 }}>{action.icon}</Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.25, fontSize: '0.8125rem' }}>{action.title}</Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500, fontSize: '0.6875rem' }}>{action.desc}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box component="section" role="region" aria-labelledby="faq-heading" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="faq-heading" variant="h2" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>Frequently Asked Questions</Typography>
            <Button
              onClick={() => navigate('/unified-portal/support')}
              sx={{ textTransform: 'none', fontWeight: 600, color: colors.blurple500 }}
            >
              View All Questions
            </Button>
          </Box>
          <Box>
            {[
              { q: 'How do I read my water meter?', a: 'Your water meter is typically located near the street or sidewalk. Lift the cover and read the numbers from left to right. Contact us if you need help locating your meter.' },
              { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards (Visa, Mastercard, Discover, American Express), ACH bank transfers, and in-person payments at City Hall.' },
              { q: 'How can I report a water leak?', a: 'Use our 311 service to report water leaks. For emergencies, call 1-800-123-4567 immediately.' },
              { q: 'Where can I pay my bills?', a: 'Pay online through this portal, by phone, by mail, or in person at City Hall during business hours.' },
            ].map((item, i, arr) => {
              const isFirst = i === 0;
              const isLast = i === arr.length - 1;
              return (
                <Accordion
                  key={i}
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
                    expandIcon={<ExpandMore aria-hidden="true" sx={{ color: colors.gray500 }} />}
                    sx={{
                      px: 2.5,
                      py: 0.5,
                      '&:hover': { bgcolor: colors.gray50 },
                      '& .MuiAccordionSummary-content': { my: 1.5 },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: colors.gray700, fontWeight: 500 }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                    <Typography variant="body2" sx={{ color: colors.gray600, lineHeight: 1.6 }}>
                      {item.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>

        {/* Help Card */}
        <Card component="section" role="region" aria-labelledby="help-heading" elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`, mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <CardContent sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 2, md: 0 },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
              <Box sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                borderRadius: '8px',
                bgcolor: colors.blurple100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <SupportAgentOutlined aria-hidden="true" sx={{ fontSize: { xs: 24, md: 28 }, color: colors.blurple500 }} />
              </Box>
              <Box>
                <Typography id="help-heading" variant="h6" sx={{ fontWeight: 600, color: colors.gray900, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                  Need help? We're here for you
                </Typography>
                <Typography variant="body2" sx={{ color: colors.gray500 }}>
                  Get answers fast — chat, email, or call us
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                startIcon={<Phone aria-hidden="true" sx={{ fontSize: 18 }} />}
                onClick={() => window.open('tel:+15551234567')}
                sx={{ textTransform: 'none', fontWeight: 600, px: 3, py: 1.25, borderRadius: '8px', whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                (555) 123-4567
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Chat aria-hidden="true" sx={{ fontSize: 18 }} />}
                onClick={() => navigate('/unified-portal/support')}
                sx={{ textTransform: 'none', fontWeight: 600, px: 3, py: 1.25, borderRadius: '8px', whiteSpace: 'nowrap' }}
              >
                Start a chat
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box
          component="footer"
          role="contentinfo"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            pt: 3,
            borderTop: `1px solid ${colors.gray200}`
          }}
        >
          <Box component="nav" aria-label="Footer navigation" sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              onClick={() => window.open('/terms', '_blank')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Terms of Service
            </Button>
            <Button
              onClick={() => window.open('/privacy', '_blank')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Privacy Policy
            </Button>
            <Button
              onClick={() => navigate('/unified-portal/support')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Help Center
            </Button>
            <Button
              onClick={() => navigate('/unified-portal/sitemap')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Site Map & Rationale
            </Button>
            <Button
              onClick={() => navigate('/unified-portal/account')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Accessibility
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: colors.gray400 }}>© 2025 Cloud City customer portal. All rights reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UnifiedDashboard;
