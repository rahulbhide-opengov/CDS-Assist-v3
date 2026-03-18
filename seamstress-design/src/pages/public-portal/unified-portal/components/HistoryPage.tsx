/**
 * History Page
 * View bills, payments, and account activity across all accounts
 * Filterable by property and service category (utilities, taxes, permits, parks)
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  Download,
  Visibility,
  Description,
  Payment,
  Warning,
  Email,
  Phone,
  ChevronRight,
  Home,
  Business,
  Receipt,
  Park,
  Construction,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import AccountSelector from './AccountSelector';
import type { Account } from './AccountSelector';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;

type ItemType = 'bill' | 'payment' | 'penalty';
type ItemStatus = 'due' | 'paid' | 'completed' | 'pending';
type ServiceCategory = 'utilities' | 'taxes' | 'permits' | 'parks';

interface HistoryItem {
  id: string;
  accountId: string;
  accountName: string;
  accountType: 'household' | 'business';
  type: ItemType;
  title: string;
  date: string;
  dueDate?: string;
  amount: number;
  status: ItemStatus;
  serviceType: string;
  category: ServiceCategory;
}

// Mock accounts (properties) - using Account type from AccountSelector
const accounts: Account[] = [
  { id: '1', type: 'household', name: '123 Main Street', address: '123 Main Street, Cloud City, ST 12345', role: 'Owner' },
  { id: '2', type: 'business', name: 'ABC Consulting LLC', address: '456 Business Ave, Cloud City, ST 12345', role: 'Owner' },
  { id: '3', type: 'household', name: '789 Oak Avenue', address: '789 Oak Avenue, Cloud City, ST 12345', role: 'Owner' },
];

// Service categories - using consistent blurple500
const serviceCategories = [
  { id: 'utilities', label: 'Utilities', icon: Construction, color: colors.blurple500, bgColor: `${colors.blurple500}15` },
  { id: 'taxes', label: 'Taxes', icon: Receipt, color: colors.blurple500, bgColor: `${colors.blurple500}15` },
  { id: 'permits', label: 'Permits', icon: Description, color: colors.blurple500, bgColor: `${colors.blurple500}15` },
  { id: 'parks', label: 'Parks', icon: Park, color: colors.blurple500, bgColor: `${colors.blurple500}15` },
];

// Mock history data with categories - 123 Main Street has all services
const historyData: HistoryItem[] = [
  // === UTILITIES === (123 Main Street has comprehensive utility services)
  // Current bills
  { id: '1', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Utilities - March 2025', date: 'Mar 2025', dueDate: 'Jan 15, 2025', amount: 133.00, status: 'due', serviceType: 'Water/Sewer/Trash/Recycling', category: 'utilities' },

  // Historical utilities for 123 Main Street
  { id: '2', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Utilities - February 2025', date: 'Feb 2025', dueDate: 'Dec 15, 2024', amount: 128.75, status: 'paid', serviceType: 'Water/Sewer/Trash/Recycling', category: 'utilities' },
  { id: '3', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'payment', title: 'Payment - Utilities', date: 'Dec 10, 2024', amount: 128.75, status: 'completed', serviceType: 'Water/Sewer/Trash/Recycling', category: 'utilities' },
  { id: '4', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Utilities - January 2025', date: 'Jan 2025', dueDate: 'Nov 15, 2024', amount: 135.42, status: 'paid', serviceType: 'Water/Sewer/Trash/Recycling', category: 'utilities' },

  // Other accounts utilities
  { id: '5', accountId: '2', accountName: 'ABC Consulting LLC', accountType: 'business', type: 'bill', title: 'Commercial Utilities - March 2025', date: 'Mar 2025', dueDate: 'Apr 15, 2025', amount: 89.25, status: 'due', serviceType: 'Commercial Water/Sewer', category: 'utilities' },
  { id: '7', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'bill', title: 'Utilities - March 2025', date: 'Mar 2025', dueDate: 'Apr 10, 2025', amount: 98.75, status: 'due', serviceType: 'Water/Sewer/Trash/Recycling', category: 'utilities' },

  // === PERMITS & LICENSES === (123 Main Street has building permit and pet license)
  { id: '15', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Building Permit - Home Renovation', date: 'Mar 2025', dueDate: 'Apr 18, 2025', amount: 425.00, status: 'due', serviceType: 'Building Permit', category: 'permits' },
  { id: '16', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Pet License - Annual (2 pets)', date: 'Mar 2025', dueDate: 'May 10, 2025', amount: 45.00, status: 'due', serviceType: 'Pet License', category: 'permits' },

  // Historical permits for 123 Main Street
  { id: '17', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Fence Permit', date: 'Sep 2024', dueDate: 'Oct 1, 2024', amount: 175.00, status: 'paid', serviceType: 'Building Permit', category: 'permits' },
  { id: '18', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'payment', title: 'Payment - Fence Permit', date: 'Sep 28, 2024', amount: 175.00, status: 'completed', serviceType: 'Building Permit', category: 'permits' },

  // Other accounts permits
  { id: '19', accountId: '2', accountName: 'ABC Consulting LLC', accountType: 'business', type: 'bill', title: 'Signage Permit', date: 'Mar 2025', dueDate: 'Apr 20, 2025', amount: 125.00, status: 'due', serviceType: 'Signage Permit', category: 'permits' },
  { id: '20', accountId: '2', accountName: 'ABC Consulting LLC', accountType: 'business', type: 'bill', title: 'Business License - Annual Renewal', date: 'Mar 2025', dueDate: 'May 1, 2025', amount: 175.00, status: 'due', serviceType: 'Business License', category: 'permits' },
  { id: '21', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'bill', title: 'Building Permit - Deck Construction', date: 'Mar 2025', dueDate: 'Apr 25, 2025', amount: 350.00, status: 'due', serviceType: 'Building Permit', category: 'permits' },

  // === TAXES === (123 Main Street has property tax)
  { id: '10', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Property Tax - Q2 2025', date: 'Mar 2025', dueDate: 'Sep 30, 2025', amount: 1240.50, status: 'due', serviceType: 'Property Tax', category: 'taxes' },
  { id: '11', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'bill', title: 'Property Tax - Q2 2025', date: 'Mar 2025', dueDate: 'Sep 30, 2025', amount: 892.00, status: 'due', serviceType: 'Property Tax', category: 'taxes' },
  { id: '12', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'payment', title: 'Payment - Property Tax Q1', date: 'Mar 15, 2024', amount: 1240.50, status: 'completed', serviceType: 'Property Tax', category: 'taxes' },
  { id: '14', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'payment', title: 'Payment - Property Tax Q1', date: 'Mar 20, 2024', amount: 892.00, status: 'completed', serviceType: 'Property Tax', category: 'taxes' },

  // === PARKS === (123 Main Street also uses park services)
  { id: '22', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'bill', title: 'Annual Park Pass - Family', date: 'Jan 2025', dueDate: 'Jan 31, 2025', amount: 75.00, status: 'paid', serviceType: 'Park Pass', category: 'parks' },
  { id: '23', accountId: '1', accountName: '123 Main Street', accountType: 'household', type: 'payment', title: 'Payment - Park Pass', date: 'Jan 15, 2025', amount: 75.00, status: 'completed', serviceType: 'Park Pass', category: 'parks' },
  { id: '24', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'bill', title: 'Pool Season Pass', date: 'May 2024', dueDate: 'Jun 1, 2024', amount: 120.00, status: 'paid', serviceType: 'Pool Pass', category: 'parks' },
  { id: '25', accountId: '3', accountName: '789 Oak Avenue', accountType: 'household', type: 'payment', title: 'Payment - Pool Pass', date: 'May 28, 2024', amount: 120.00, status: 'completed', serviceType: 'Pool Pass', category: 'parks' },
];

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [typeFilter, setTypeFilter] = useState<'all' | ItemType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [accountFilter, setAccountFilter] = useState<string>('1'); // Default to first account

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Filter and search
  const filteredItems = useMemo(() => {
    return historyData.filter(item => {
      // Type filter (bill/payment/penalty)
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Category filter (utilities/taxes/permits/parks)
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Account/Property filter
      if (item.accountId !== accountFilter) return false;

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.date.toLowerCase().includes(query) ||
          item.accountName.toLowerCase().includes(query) ||
          item.serviceType.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [typeFilter, categoryFilter, accountFilter, searchQuery]);

  const paginatedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Get counts for category badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: historyData.length };
    historyData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(paginatedItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDownload = () => {
    console.log('Downloading items:', selectedItems);
    alert(`Downloading ${selectedItems.length} items...`);
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'bill': return <Description aria-hidden="true" sx={{ fontSize: 18, color: colors.gray400 }} />;
      case 'payment': return <Payment aria-hidden="true" sx={{ fontSize: 18, color: colors.green600 }} />;
      case 'penalty': return <Warning aria-hidden="true" sx={{ fontSize: 18, color: colors.red500 }} />;
    }
  };

  const getCategoryStyle = (category: ServiceCategory) => {
    const cat = serviceCategories.find(c => c.id === category);
    return { color: cat?.color || colors.gray600, bgColor: cat?.bgColor || colors.gray100 };
  };

  const getStatusChip = (status: ItemStatus) => {
    switch (status) {
      case 'paid':
        return <Chip label="Paid" size="small" sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.green100, color: colors.green700 }} />;
      case 'completed':
        return <Chip label="Completed" size="small" sx={{ height: 22, fontSize: '0.6875rem', bgcolor: colors.green100, color: colors.green700 }} />;
      case 'due':
        return null;
      default:
        return null;
    }
  };

  const handleFaqClick = (question: string) => {
    console.log('FAQ clicked:', question);
  };

  const handleFaqKeyDown = (event: React.KeyboardEvent, question: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFaqClick(question);
    }
  };

  const handleGoToFaq = () => {
    console.log('Navigate to FAQ');
  };

  const handleGoToFaqKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleGoToFaq();
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Navigation Header */}
      <PortalNavigation activeTab="history" />

      {/* Main Content */}
      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {/* Header - Matching UnifiedDashboard */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
              Account History
            </Typography>
            <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
              View your bills, payments and account activity across all services
            </Typography>
          </Box>

          {/* Account Switcher */}
          <AccountSelector
            accounts={accounts}
            selectedAccountId={accountFilter}
            onAccountChange={setAccountFilter}
            variant="dropdown"
          />
        </Box>

        {/* Service Category Filter - Minimal */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
          <Button
            onClick={() => setCategoryFilter('all')}
            variant={categoryFilter === 'all' ? 'contained' : 'text'}
            color="primary"
            size="small"
            sx={{ minWidth: 'auto' }}
          >
            All Services
            <Chip label={categoryCounts.all} size="small" sx={{ ml: 1, height: 18, fontSize: '0.625rem', bgcolor: categoryFilter === 'all' ? 'rgba(255,255,255,0.3)' : colors.gray200, color: categoryFilter === 'all' ? colors.white : colors.gray600 }} />
          </Button>
          {serviceCategories.map(cat => {
            const Icon = cat.icon;
            const isSelected = categoryFilter === cat.id;
            return (
              <Button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as ServiceCategory)}
                startIcon={<Icon aria-hidden="true" sx={{ fontSize: 16 }} />}
                variant="text"
                size="small"
                sx={{
                  minWidth: 'auto',
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                {cat.label}
                <Chip
                  label={categoryCounts[cat.id] || 0}
                  size="small"
                  sx={{ ml: 1, height: 18, fontSize: '0.625rem' }}
                />
              </Button>
            );
          })}
        </Box>

        {/* Content Area - Mobile first approach */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
          {/* Main Content */}
          <Box>
            {/* Type Filter and Search */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              {/* Type Tabs */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {(['all', 'bill', 'payment', 'penalty'] as const).map((f) => (
                  <Button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    variant="text"
                    size="small"
                    color={typeFilter === f ? 'primary' : 'inherit'}
                    sx={{
                      minWidth: 'auto',
                      fontWeight: typeFilter === f ? 600 : 400,
                    }}
                  >
                    {f === 'all' ? 'All' : f === 'bill' ? 'Bills' : f === 'payment' ? 'Payments' : 'Penalties'}
                  </Button>
                ))}
              </Box>

              {/* Search */}
              <TextField
                size="small"
                placeholder="Search history..."
                aria-label="Search history"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Search aria-hidden="true" sx={{ fontSize: 18, color: colors.gray400 }} /></InputAdornment>,
                  },
                }}
                sx={{ minWidth: 220 }}
              />
            </Box>

            {/* Bulk Actions - Minimal */}
            {selectedItems.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, py: 1.5, borderBottom: `2px solid ${colors.blurple500}` }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.gray700, fontSize: '0.875rem' }}>
                  {selectedItems.length} selected
                </Typography>
                <Button
                  startIcon={<Download aria-hidden="true" sx={{ fontSize: 16 }} />}
                  onClick={handleBulkDownload}
                  size="small"
                  color="primary"
                >
                  Download
                </Button>
                <Button
                  onClick={() => setSelectedItems([])}
                  size="small"
                >
                  Clear
                </Button>
              </Box>
            )}

            {/* Table for Desktop / Cards for Mobile */}
            {isMobile ? (
              // Mobile Card View
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paginatedItems.map((item) => {
                  const catStyle = getCategoryStyle(item.category);
                  return (
                    <Card
                      key={item.id}
                      elevation={0}
                      sx={{
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray200}`,
                        bgcolor: selectedItems.includes(item.id) ? colors.blurple50 : 'white',
                        '&:hover': { borderColor: colors.gray300 }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        {/* Header with checkbox and actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              inputProps={{ 'aria-label': `Select ${item.title}` }}
                              sx={{ p: 0, color: colors.gray400, '&.Mui-checked': { color: colors.blurple500 } }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                {getTypeIcon(item.type)}
                                <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.9375rem' }}>
                                  {item.title}
                                </Typography>
                              </Box>
                              <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                                {item.dueDate ? `Due on ${item.dueDate}` : item.date}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {item.category === 'permits' && (
                              <IconButton
                                size="small"
                                onClick={() => navigate('/unified-portal/permits')}
                                aria-label={`View permit details for ${item.title}`}
                                sx={{ color: colors.blurple500 }}
                              >
                                <Visibility aria-hidden="true" sx={{ fontSize: 18 }} />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              aria-label={item.type === 'payment' ? `View receipt for ${item.title}` : `Download ${item.title}`}
                              sx={{ color: colors.gray400 }}
                            >
                              {item.type === 'payment' ? (
                                <Visibility aria-hidden="true" sx={{ fontSize: 18 }} />
                              ) : (
                                <Download aria-hidden="true" sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Property and Category */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            icon={item.accountType === 'household' ?
                              <Home aria-hidden="true" sx={{ fontSize: 14 }} /> :
                              <Business aria-hidden="true" sx={{ fontSize: 14 }} />
                            }
                            label={item.accountName}
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                          <Chip
                            label={item.serviceType}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              bgcolor: catStyle.bgColor,
                              color: catStyle.color,
                              fontWeight: 500,
                            }}
                          />
                        </Box>

                        {/* Amount and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1.125rem' }}>
                            {formatCurrency(item.amount)}
                          </Typography>
                          {getStatusChip(item.status)}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Mobile Pagination */}
                <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                  <TablePagination
                    component="div"
                    count={filteredItems.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                  />
                </Card>
              </Box>
            ) : (
              // Desktop Table View
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <TableContainer>
                  <Table aria-label="Account history showing bills, payments, and penalties">
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.gray50 }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedItems.length}
                          checked={paginatedItems.length > 0 && selectedItems.length === paginatedItems.length}
                          onChange={handleSelectAll}
                          inputProps={{ 'aria-label': 'Select all items on this page' }}
                          sx={{ color: colors.gray400, '&.Mui-checked': { color: colors.blurple500 } }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem' }}>Property</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem', textAlign: 'right' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.875rem' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((item) => {
                      const catStyle = getCategoryStyle(item.category);
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            '&:hover': { bgcolor: colors.gray50 },
                            bgcolor: selectedItems.includes(item.id) ? colors.blurple50 : 'transparent',
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              inputProps={{ 'aria-label': `Select ${item.title}` }}
                              sx={{ color: colors.gray400, '&.Mui-checked': { color: colors.blurple500 } }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              {getTypeIcon(item.type)}
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.gray900, fontSize: '0.875rem' }}>{item.title}</Typography>
                                <Typography variant="caption" sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                                  {item.dueDate ? `Due on ${item.dueDate}` : item.date}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.accountType === 'household' ? (
                                <Home aria-hidden="true" sx={{ fontSize: 16, color: colors.green600 }} />
                              ) : (
                                <Business aria-hidden="true" sx={{ fontSize: 16, color: colors.cerulean600 }} />
                              )}
                              <Typography variant="caption" sx={{ color: colors.gray700, fontWeight: 500, fontSize: '0.8125rem' }}>{item.accountName}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.serviceType}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: '0.6875rem',
                                bgcolor: catStyle.bgColor,
                                color: catStyle.color,
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5, fontSize: '0.875rem' }}>{formatCurrency(item.amount)}</Typography>
                            {getStatusChip(item.status)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              {item.category === 'permits' && (
                                <Button
                                  size="small"
                                  onClick={() => navigate('/unified-portal/permits')}
                                  color="primary"
                                  sx={{ fontSize: '0.6875rem', p: 0.5, minWidth: 'auto' }}
                                >
                                  View
                                </Button>
                              )}
                              {item.type === 'payment' ? (
                                <IconButton
                                  size="small"
                                  aria-label={`View receipt for ${item.title}`}
                                  sx={{ color: colors.gray400 }}
                                >
                                  <Visibility aria-hidden="true" sx={{ fontSize: 18 }} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  aria-label={`Download ${item.title}`}
                                  sx={{ color: colors.gray400 }}
                                >
                                  <Download aria-hidden="true" sx={{ fontSize: 18 }} />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredItems.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                  rowsPerPageOptions={[10, 25, 50]}
                  sx={{ borderTop: `1px solid ${colors.gray100}` }}
                />
              </Card>
            )}
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Actions - Minimal */}
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<Download aria-hidden="true" sx={{ fontSize: 16 }} />}
                    sx={{ justifyContent: 'flex-start', fontSize: '0.875rem' }}
                  >
                    Download Latest Bill
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<Download aria-hidden="true" sx={{ fontSize: 16 }} />}
                    onClick={() => setSelectedItems(filteredItems.map(i => i.id))}
                    sx={{ justifyContent: 'flex-start', fontSize: '0.875rem' }}
                  >
                    Select All for Download
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Support Available */}
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>Support Available</Typography>
                <Typography sx={{ color: colors.gray500, fontSize: '0.875rem', mb: 3 }}>Having trouble? We are here to help</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: colors.blurple50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Email aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>Email Support</Typography>
                      <Typography sx={{ color: colors.blurple500, fontSize: '0.75rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>support@cloudcity.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: colors.green50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone aria-hidden="true" sx={{ fontSize: 18, color: colors.green600 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>Phone Support</Typography>
                      <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>Mon - Fri (9am - 4pm)  1-800-123-4567</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Common Questions */}
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>Common questions</Typography>

                {[
                  'How do I set up or change automatic payments (Auto Pay)?',
                  'Can I set up a default payment method for my utility bills?',
                  'What Payment Methods Are Supported?',
                ].map((question, i) => (
                  <Box
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleFaqClick(question)}
                    onKeyDown={(e) => handleFaqKeyDown(e, question)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1.5,
                      borderBottom: i < 2 ? `1px solid ${colors.gray100}` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { '& .MuiTypography-root': { color: colors.blurple500 }, '& .MuiSvgIcon-root': { color: colors.blurple500 } },
                      '&:focus': { outline: `2px solid ${colors.blurple500}`, outlineOffset: 2 },
                    }}
                  >
                    <ChevronRight aria-hidden="true" sx={{ fontSize: 18, color: colors.gray400, transition: 'color 0.2s' }} />
                    <Typography sx={{ color: colors.gray700, fontSize: '0.875rem', transition: 'color 0.2s' }}>{question}</Typography>
                  </Box>
                ))}

                <Typography sx={{ color: colors.gray500, fontSize: '0.75rem', display: 'block', mt: 2 }}>
                  Have more questions?{' '}
                  <Typography
                    component="span"
                    role="button"
                    tabIndex={0}
                    onClick={handleGoToFaq}
                    onKeyDown={handleGoToFaqKeyDown}
                    sx={{
                      color: colors.blurple500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                      '&:focus': { outline: `2px solid ${colors.blurple500}`, outlineOffset: 2 }
                    }}
                  >
                    Go to the FAQ
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HistoryPage;
