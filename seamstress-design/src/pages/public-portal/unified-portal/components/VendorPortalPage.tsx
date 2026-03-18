/**
 * Vendor Portal Page
 * Procurement opportunities for vendors - uses portal navigation style
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Menu,
  IconButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  KeyboardArrowDown,
  Business,
  Home,
  SwapHoriz,
  Storefront,
  Description,
  Gavel,
  Assignment,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;
const theme = {
  primary: colors.blurple500,
  primaryLight: colors.blurple50,
  secondary: colors.blurple500,
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

// Mock user data
const currentUser = {
  name: 'Paul Atreides',
  initials: 'PA',
  vendorName: 'ABC Consulting LLC',
  vendorId: 'V-2024-00892',
};

// Vendor nav tabs
const vendorNavTabs = [
  { id: 'opportunities', label: 'Opportunities', path: '/vendor-portal' },
  { id: 'responses', label: 'Responses', path: '/vendor-portal/responses' },
  { id: 'awards', label: 'Awards', path: '/vendor-portal/awards' },
  { id: 'checklists', label: 'Checklists', path: '/vendor-portal/checklists' },
  { id: 'subscriptions', label: 'Subscriptions', path: '/vendor-portal/subscriptions' },
];

// Mock opportunities data
const opportunities = [
  {
    id: '1',
    title: 'Mount Pleasant - Kinney Elementary - Midyear Social Sciences Blue Books',
    organization: 'Showville',
    state: 'CA',
    status: 'Open',
    releaseDate: '12/15/2025',
    dueDate: '1/19/2026',
  },
  {
    id: '2',
    title: 'ERP Software Project-5K',
    organization: 'Showville',
    state: 'CA',
    status: 'Open',
    releaseDate: '11/15/2025',
    dueDate: '12/30/2025',
  },
  {
    id: '3',
    title: 'Parish of Jefferson Street Resurfacing - 2025',
    organization: 'Cloud City',
    state: 'KY',
    status: 'Open',
    releaseDate: '9/11/2025',
    dueDate: '12/19/2025',
  },
  {
    id: '4',
    title: 'Bathroom Remodel at Mercer Island High School (Vendor Perspective of Surety2000)',
    organization: 'Cloud City',
    state: 'KY',
    status: 'Open',
    releaseDate: '4/22/2025',
    dueDate: '1/23/2028',
  },
  {
    id: '5',
    title: 'Airside Cooling Tower Refurbishment',
    organization: 'City of Lugones',
    state: 'GA',
    status: 'Open',
    releaseDate: '12/9/2024',
    dueDate: '12/1/2027',
  },
  {
    id: '6',
    title: 'Financial Auditing Services - City of Syracuse - Open Solicitation',
    organization: 'Sunny Beach',
    state: 'FL',
    status: 'Open',
    releaseDate: '5/8/2024',
    dueDate: '6/5/2099',
  },
  {
    id: '7',
    title: 'EEO Program Application for First-Time Applicants and Re-Certifications',
    organization: 'Sunny Beach',
    state: 'FL',
    status: 'Open',
    releaseDate: '12/5/2023',
    dueDate: '12/31/2033',
  },
];

const categories = [
  'All Categories',
  'Construction',
  'Professional Services',
  'Information Technology',
  'Facilities & Maintenance',
  'Transportation',
];

const states = [
  'All States',
  'CA', 'FL', 'GA', 'KY', 'NY', 'TX',
];

const VendorPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryCode, setCategoryCode] = useState('NIGP');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwitchToPublic = () => {
    navigate('/unified-portal');
  };

  const handleRowClick = (oppId: string) => {
    // Navigate to opportunity detail or handle row click
    console.log('Navigate to opportunity:', oppId);
  };

  const handleViewAllCategories = () => {
    // Handle view all categories action
    console.log('View all categories');
  };

  const handleSearchByOrganization = () => {
    // Handle search by organization action
    console.log('Search by organization');
  };

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    setUserMenuAnchor(e.currentTarget);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Vendor Portal Header */}
      <Box
        component="header"
        sx={{
          bgcolor: colors.white,
          borderBottom: `1px solid ${colors.gray200}`,
          boxShadow: '1px 2px 7px rgba(19, 21, 23, 0.1)',
        }}
      >
        <Box
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: 4,
            height: 56,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/vendor-portal')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/vendor-portal');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Go to vendor portal home"
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: colors.blurple500,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              OpenGov
            </Typography>
          </Box>

          {/* Navigation Tabs */}
          <Box
            component="nav"
            role="tablist"
            aria-label="Vendor portal navigation"
            sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            {vendorNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Box
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }
                  }}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: isActive ? 'transparent' : colors.gray50,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${colors.blurple500}`,
                      outlineOffset: -2,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                      color: isActive ? colors.blurple500 : colors.gray700,
                    }}
                  >
                    {tab.label}
                  </Typography>
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: colors.blurple500,
                        borderRadius: '2px 2px 0 0',
                      }}
                    />
                  )}
                </Box>
              );
            })}

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
              {/* Switch to Public Portal */}
              <Button
                variant="outlined"
                onClick={handleSwitchToPublic}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: colors.blurple500,
                  borderColor: colors.blurple300,
                  borderRadius: '8px',
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    bgcolor: colors.blurple50,
                    borderColor: colors.blurple500,
                  },
                }}
              >
                Resident Portal
              </Button>

              {/* Settings */}
              <IconButton
                sx={{ color: colors.gray500 }}
                aria-label="Settings"
              >
                <Settings sx={{ fontSize: 20 }} aria-hidden="true" />
              </IconButton>

              {/* User Avatar */}
              <Box
                onClick={handleUserMenuOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUserMenuOpen(e);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`User menu for ${currentUser.name}`}
                aria-haspopup="menu"
                aria-expanded={Boolean(userMenuAnchor)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  py: 0.5,
                  px: 1.5,
                  borderRadius: '8px',
                  border: `1px solid ${colors.gray200}`,
                  '&:hover': { bgcolor: colors.gray50, borderColor: colors.gray300 },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.blurple500}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: colors.blurple500,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  {currentUser.initials}
                </Avatar>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.gray700 }}>
                  {currentUser.name.split(' ')[0]}
                </Typography>
                <KeyboardArrowDown sx={{ fontSize: 16, color: colors.gray400 }} aria-hidden="true" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Subheader */}
      <Box sx={{ bgcolor: colors.white, borderBottom: `1px solid ${colors.gray200}`, py: 1, px: 4 }}>
        <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Typography
            onClick={handleSearchByOrganization}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSearchByOrganization();
              }
            }}
            role="button"
            tabIndex={0}
            sx={{
              fontSize: '0.8125rem',
              color: colors.blurple500,
              cursor: 'pointer',
              '&:focus-visible': {
                outline: `2px solid ${colors.blurple500}`,
                outlineOffset: 2,
              },
            }}
          >
            Search by Organization [Internal Only]
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', p: 4, display: 'flex', gap: 4 }}>
        {/* Left Sidebar - Filters */}
        <Card
          component="aside"
          elevation={0}
          sx={{ width: 300, borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0, alignSelf: 'flex-start' }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: colors.blurple500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gavel sx={{ fontSize: 22, color: colors.white }} aria-hidden="true" />
                </Box>
              </Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
                Procurement Portal
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500, lineHeight: 1.4 }}>
                List of open opportunities on the OpenGov Procurement Platform
              </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                id="category-code-label"
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray700, mb: 1, display: 'block' }}
              >
                Choose a Type of Category Code
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                  aria-labelledby="category-code-label"
                >
                  <MenuItem value="NIGP">NIGP</MenuItem>
                  <MenuItem value="UNSPSC">UNSPSC</MenuItem>
                  <MenuItem value="NAICS">NAICS</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                id="category-label"
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray700, mb: 1, display: 'block' }}
              >
                Search by Category
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                  aria-labelledby="category-label"
                >
                  <MenuItem value="">Select...</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                onClick={handleViewAllCategories}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewAllCategories();
                  }
                }}
                role="button"
                tabIndex={0}
                sx={{
                  fontSize: '0.75rem',
                  color: colors.blurple500,
                  mt: 1,
                  cursor: 'pointer',
                  textAlign: 'right',
                  '&:focus-visible': {
                    outline: `2px solid ${colors.blurple500}`,
                    outlineOffset: 2,
                  },
                }}
              >
                View All Categories
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                id="state-label"
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray700, mb: 1, display: 'block' }}
              >
                Search by State
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                  aria-labelledby="state-label"
                >
                  <MenuItem value="">Select...</MenuItem>
                  {states.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Search sx={{ fontSize: 18 }} aria-hidden="true" />}
              aria-label="Search opportunities"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: colors.blurple500,
                borderRadius: '8px',
                py: 1.25,
                mb: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: colors.blurple600,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                },
              }}
            >
              Search
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                color: colors.gray600,
                borderColor: colors.gray300,
                borderRadius: '8px',
                py: 1,
                '&:hover': { bgcolor: colors.gray50 },
              }}
            >
              Clear Filter
            </Button>
          </CardContent>
        </Card>

        {/* Right Content - Opportunities Table */}
        <Box sx={{ flex: 1 }}>
          <Typography
            component="h1"
            sx={{ fontSize: '1.5rem', fontWeight: 700, color: colors.gray900, mb: 3, textAlign: 'center' }}
          >
            OpenGov Current Opportunities
          </Typography>

          <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${colors.gray200}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <TableContainer>
              <Table aria-label="Current procurement opportunities">
                <TableHead>
                  <TableRow sx={{ bgcolor: colors.gray50 }}>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>Project Title</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>Organization</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>State</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>Release Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: colors.gray700, fontSize: '0.8125rem' }}>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow
                      key={opp.id}
                      onClick={() => handleRowClick(opp.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRowClick(opp.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View opportunity: ${opp.title}`}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: colors.gray50 },
                        '&:focus-visible': {
                          outline: `2px solid ${colors.blurple500}`,
                          outlineOffset: -2,
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '6px',
                            bgcolor: colors.gray100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Business sx={{ fontSize: 18, color: colors.gray500 }} aria-hidden="true" />
                          </Box>
                          <Typography sx={{ fontSize: '0.8125rem', color: colors.gray900 }}>
                            {opp.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                          {opp.organization}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                          {opp.state}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.blurple500, fontWeight: 500 }}>
                          {opp.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                          {opp.releaseDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                          {opp.dueDate}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            minWidth: 280,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.gray100}`,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray100}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 44, height: 44, bgcolor: colors.blurple500, fontSize: '1rem', fontWeight: 600 }}>
              {currentUser.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.9375rem' }}>
                {currentUser.name}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                {currentUser.vendorName}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Switch to Resident Portal */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray100}`, bgcolor: colors.blurple50 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: colors.blurple100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home sx={{ fontSize: 18, color: colors.blurple500 }} aria-hidden="true" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.gray900 }}>
                Resident Account
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500 }}>
                Pay bills, manage permits
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSwitchToPublic}
            startIcon={<SwapHoriz sx={{ fontSize: 16 }} aria-hidden="true" />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: colors.white,
              bgcolor: colors.blurple500,
              borderRadius: '8px',
              py: 1,
              boxShadow: 'none',
              '&:hover': { bgcolor: colors.blurple600, boxShadow: 'none' },
            }}
          >
            Switch to Resident Portal
          </Button>
        </Box>

        <MenuItem onClick={() => setUserMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.gray700 }}>Account Settings</Typography>
        </MenuItem>
        <MenuItem sx={{ py: 1.5, borderTop: `1px solid ${colors.gray100}` }}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.red500 }}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default VendorPortalPage;
