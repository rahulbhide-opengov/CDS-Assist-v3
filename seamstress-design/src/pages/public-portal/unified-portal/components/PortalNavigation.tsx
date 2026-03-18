/**
 * Portal Navigation Component
 * Seamstress-styled navigation for the unified portal
 */

import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Button, Chip, Avatar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, Badge } from '@mui/material';
import {
  KeyboardArrowDown,
  Construction,
  Receipt,
  Description,
  Park,
  East,
  Home,
  Bookmark,
  Visibility,
  ReportProblem,
  CardGiftcard,
  HelpOutline,
  Menu as MenuIcon,
  Close,
  History,
  SupportAgent,
  Person,
  Storefront,
  ShoppingCart,
  AccountBalance,
  Business,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';
import { useCart } from './cart/CartContext';

const colors = cdsColors;
import { CartDrawer } from './cart/CartDrawer';
import { CitySwitcher, defaultCities } from './CitySwitcher';
import { useCity } from './CityContext';

type TabId = 'dashboard' | 'services' | 'cityhelp' | 'history' | 'support' | 'account';

interface NavTab {
  id: TabId;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
}

const navTabs: NavTab[] = [
  { id: 'dashboard', label: 'Home', path: '/unified-portal' },
  { id: 'services', label: 'Services', hasSubmenu: true },
  { id: 'cityhelp', label: 'City Help & 311', hasSubmenu: true },
  { id: 'history', label: 'History', path: '/unified-portal/history' },
  { id: 'support', label: 'Support', path: '/unified-portal/support' },
  { id: 'account', label: 'Account', path: '/unified-portal/account' },
];

const serviceItems = [
  {
    id: 'utilities',
    label: 'Utilities',
    desc: 'Water, trash & sewer',
    icon: Construction,
    path: '/unified-portal/utilities',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'taxes',
    label: 'Taxes',
    desc: 'Property & business',
    icon: Receipt,
    path: '/unified-portal/taxes',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'permits',
    label: 'Permits & Licensing',
    desc: 'Building, business, events',
    icon: Description,
    path: '/unified-portal/permits',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'parks',
    label: 'Parks & Recreation',
    desc: 'Passes & rentals',
    icon: Park,
    path: '/unified-portal/parks',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'grants',
    label: 'Grants & Funding',
    desc: 'Nonprofits, schools & businesses',
    icon: CardGiftcard,
    path: '/unified-portal/grants',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
];

const cityHelpItems = [
  {
    id: '311',
    label: 'Report an Issue (311)',
    desc: 'Potholes, streetlights, graffiti & more',
    icon: ReportProblem,
    path: '/unified-portal/311',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'transparency',
    label: 'Transparency & Open Data',
    desc: 'Budgets, reports & public records',
    icon: Visibility,
    path: '/unified-portal/transparency',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks & Saved Items',
    desc: 'Your saved stories & updates',
    icon: Bookmark,
    path: '/unified-portal/engagement/bookmarks',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
  {
    id: 'helpcenter',
    label: 'Help Center & FAQs',
    desc: 'Answers to common questions',
    icon: HelpOutline,
    path: '/unified-portal/support',
    color: colors.blurple500,
    bgColor: colors.blurple50,
  },
];

// Mock user data
const currentUser = {
  name: 'Paul Atreides',
  initials: 'PA',
  email: 'paul@example.com',
  hasVendorAccount: true,
  vendorName: 'ABC Consulting LLC',
};

interface PortalNavigationProps {
  activeTab?: TabId;
}

const PortalNavigation: React.FC<PortalNavigationProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [servicesAnchor, setServicesAnchor] = useState<null | HTMLElement>(null);
  const [cityHelpAnchor, setCityHelpAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { currentCity, setCurrentCity, availableServices } = useCity();

  // Filter services based on current city
  const filteredServiceItems = serviceItems.filter(item => availableServices.includes(item.id));
  
  // Determine active tab from path
  const isServicesPath = serviceItems.some(s => location.pathname.startsWith(s.path));
  const isCityHelpPath = cityHelpItems.some(s => location.pathname.startsWith(s.path)) || 
    location.pathname.includes('/engagement') || 
    location.pathname.includes('/transparency') ||
    location.pathname.includes('/311');
  const currentTab = activeTab || 
    (isServicesPath ? 'services' : 
    isCityHelpPath ? 'cityhelp' : 
    navTabs.find(tab => location.pathname === tab.path)?.id) || 'dashboard';

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const handleServicesClick = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchor(event.currentTarget);
  };

  const handleServicesClose = () => {
    setServicesAnchor(null);
  };

  const handleServiceItemClick = (path: string) => {
    navigate(path);
    handleServicesClose();
  };

  const handleCityHelpClick = (event: React.MouseEvent<HTMLElement>) => {
    setCityHelpAnchor(event.currentTarget);
  };

  const handleCityHelpClose = () => {
    setCityHelpAnchor(null);
  };

  const handleCityHelpItemClick = (path: string) => {
    navigate(path);
    handleCityHelpClose();
  };

  return (
    <Box 
      component="header"
      sx={{ 
        bgcolor: colors.white, 
        borderBottom: `1px solid ${colors.gray200}`,
        boxShadow: '1px 2px 7px rgba(19, 21, 23, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box
        sx={{
          maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          height: 56,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton 
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ mr: 1, color: colors.gray700 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Left section - Logo and City Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Logo - Dynamic based on current city */}
          <Box
            component="a"
            href="/unified-portal"
            role="link"
            aria-label={`${currentCity.name} - Go to home page`}
            tabIndex={0}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/unified-portal'); }}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); navigate('/unified-portal'); }}}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flex: isMobile ? 1 : 'none',
              textDecoration: 'none',
              '&:focus': {
                outline: `3px solid ${colors.blurple500}`,
                outlineOffset: 2,
                borderRadius: '4px',
              },
            }}
          >
            {/* Render city-specific logo */}
            {currentCity.id === 'cloud-city' ? (
              <svg
                width="138"
                height="24"
                viewBox="0 0 138 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 2V4.26L12 5.59V4H22V19H17V21H24V2H10ZM7.5 5L0 10V21H15V10L7.5 5ZM14 6V6.93L15.61 8H16V6H14ZM18 6V8H20V6H18ZM7.5 7.5L13 11V19H10V13H5V19H2V11L7.5 7.5ZM18 10V12H20V10H18ZM18 14V16H20V14H18Z" fill="#4B3FFF"/>
                <path d="M43.64 19.24C42.2533 19.24 41.0533 18.94 40.04 18.34C39.04 17.7267 38.2667 16.88 37.72 15.8C37.1867 14.7067 36.92 13.4467 36.92 12.02C36.92 10.58 37.1867 9.32 37.72 8.24C38.2667 7.14667 39.04 6.29333 40.04 5.68C41.0533 5.06667 42.2533 4.76 43.64 4.76C45.3067 4.76 46.6667 5.17333 47.72 6C48.7733 6.81333 49.44 7.96667 49.72 9.46H47.08C46.8933 8.67333 46.5133 8.05333 45.94 7.6C45.3667 7.14667 44.5933 6.92 43.62 6.92C42.74 6.92 41.98 7.12667 41.34 7.54C40.7133 7.94 40.2267 8.52667 39.88 9.3C39.5467 10.06 39.38 10.9667 39.38 12.02C39.38 13.0733 39.5467 13.98 39.88 14.74C40.2267 15.4867 40.7133 16.0667 41.34 16.48C41.98 16.88 42.74 17.08 43.62 17.08C44.5933 17.08 45.3667 16.8733 45.94 16.46C46.5133 16.0333 46.8933 15.4467 47.08 14.7H49.72C49.4533 16.1133 48.7867 17.2267 47.72 18.04C46.6667 18.84 45.3067 19.24 43.64 19.24ZM51.9884 19V4.6H54.3884V19H51.9884ZM61.7666 19.24C60.8066 19.24 59.9399 19.02 59.1666 18.58C58.4066 18.1267 57.8066 17.5067 57.3666 16.72C56.9399 15.92 56.7266 15.0067 56.7266 13.98C56.7266 12.9267 56.9466 12.0067 57.3866 11.22C57.8266 10.42 58.4266 9.8 59.1866 9.36C59.9599 8.90667 60.8266 8.68 61.7866 8.68C62.7466 8.68 63.6066 8.90667 64.3666 9.36C65.1399 9.8 65.7399 10.4133 66.1666 11.2C66.6066 11.9867 66.8266 12.9067 66.8266 13.96C66.8266 15.0133 66.6066 15.9333 66.1666 16.72C65.7266 17.5067 65.1199 18.1267 64.3466 18.58C63.5866 19.02 62.7266 19.24 61.7666 19.24ZM61.7666 17.18C62.2466 17.18 62.6799 17.06 63.0666 16.82C63.4666 16.58 63.7866 16.22 64.0266 15.74C64.2666 15.26 64.3866 14.6667 64.3866 13.96C64.3866 13.2533 64.2666 12.6667 64.0266 12.2C63.7999 11.72 63.4866 11.36 63.0866 11.12C62.6999 10.88 62.2666 10.76 61.7866 10.76C61.3199 10.76 60.8866 10.88 60.4866 11.12C60.0866 11.36 59.7666 11.72 59.5266 12.2C59.2866 12.6667 59.1666 13.2533 59.1666 13.96C59.1666 14.6667 59.2866 15.26 59.5266 15.74C59.7666 16.22 60.0799 16.58 60.4666 16.82C60.8666 17.06 61.2999 17.18 61.7666 17.18ZM72.9159 19.24C72.1026 19.24 71.4026 19.08 70.8159 18.76C70.2426 18.4267 69.8026 17.9333 69.4959 17.28C69.1893 16.6133 69.0359 15.7933 69.0359 14.82V8.92H71.4359V14.58C71.4359 15.4467 71.6159 16.1067 71.9759 16.56C72.3493 17 72.9093 17.22 73.6559 17.22C74.1359 17.22 74.5626 17.1067 74.9359 16.88C75.3226 16.6533 75.6226 16.3267 75.8359 15.9C76.0626 15.46 76.1759 14.9267 76.1759 14.3V8.92H78.5759V19H76.4559L76.2759 17.32C75.9693 17.9067 75.5226 18.3733 74.9359 18.72C74.3626 19.0667 73.6893 19.24 72.9159 19.24ZM85.7263 19.24C84.7929 19.24 83.9596 19.0133 83.2263 18.56C82.4929 18.1067 81.9196 17.48 81.5063 16.68C81.1063 15.88 80.9063 14.9733 80.9063 13.96C80.9063 12.9467 81.1129 12.0467 81.5263 11.26C81.9396 10.46 82.5129 9.83333 83.2463 9.38C83.9929 8.91333 84.8329 8.68 85.7663 8.68C86.5263 8.68 87.1863 8.82667 87.7463 9.12C88.3196 9.4 88.7729 9.8 89.1063 10.32V4.6H91.5063V19H89.3463L89.1063 17.54C88.8929 17.8333 88.6329 18.1133 88.3263 18.38C88.0196 18.6333 87.6529 18.84 87.2263 19C86.7996 19.16 86.2996 19.24 85.7263 19.24ZM86.2263 17.16C86.7996 17.16 87.3063 17.0267 87.7463 16.76C88.1863 16.48 88.5263 16.1 88.7663 15.62C89.0063 15.14 89.1263 14.5867 89.1263 13.96C89.1263 13.3333 89.0063 12.78 88.7663 12.3C88.5263 11.82 88.1863 11.4467 87.7463 11.18C87.3063 10.9133 86.7996 10.78 86.2263 10.78C85.6796 10.78 85.1863 10.9133 84.7463 11.18C84.3063 11.4467 83.9596 11.82 83.7063 12.3C83.4663 12.78 83.3463 13.3333 83.3463 13.96C83.3463 14.5867 83.4663 15.14 83.7063 15.62C83.9596 16.1 84.3063 16.48 84.7463 16.76C85.1863 17.0267 85.6796 17.16 86.2263 17.16ZM105.359 19.24C103.972 19.24 102.772 18.94 101.759 18.34C100.759 17.7267 99.9854 16.88 99.4388 15.8C98.9054 14.7067 98.6388 13.4467 98.6388 12.02C98.6388 10.58 98.9054 9.32 99.4388 8.24C99.9854 7.14667 100.759 6.29333 101.759 5.68C102.772 5.06667 103.972 4.76 105.359 4.76C107.025 4.76 108.385 5.17333 109.439 6C110.492 6.81333 111.159 7.96667 111.439 9.46H108.799C108.612 8.67333 108.232 8.05333 107.659 7.6C107.085 7.14667 106.312 6.92 105.339 6.92C104.459 6.92 103.699 7.12667 103.059 7.54C102.432 7.94 101.945 8.52667 101.599 9.3C101.265 10.06 101.099 10.9667 101.099 12.02C101.099 13.0733 101.265 13.98 101.599 14.74C101.945 15.4867 102.432 16.0667 103.059 16.48C103.699 16.88 104.459 17.08 105.339 17.08C106.312 17.08 107.085 16.8733 107.659 16.46C108.232 16.0333 108.612 15.4467 108.799 14.7H111.439C111.172 16.1133 110.505 17.2267 109.439 18.04C108.385 18.84 107.025 19.24 105.359 19.24ZM113.807 19V8.92H116.207V19H113.807ZM115.007 7.32C114.567 7.32 114.201 7.18667 113.907 6.92C113.627 6.64 113.487 6.3 113.487 5.9C113.487 5.48667 113.627 5.15333 113.907 4.9C114.201 4.63333 114.567 4.5 115.007 4.5C115.447 4.5 115.807 4.63333 116.087 4.9C116.381 5.15333 116.527 5.48667 116.527 5.9C116.527 6.3 116.381 6.64 116.087 6.92C115.807 7.18667 115.447 7.32 115.007 7.32ZM123.361 19C122.681 19 122.087 18.8933 121.581 18.68C121.087 18.4667 120.701 18.1133 120.421 17.62C120.141 17.1267 120.001 16.46 120.001 15.62V10.94H118.281V8.92H120.001L120.281 6.26H122.401V8.92H125.141V10.94H122.401V15.62C122.401 16.1267 122.507 16.48 122.721 16.68C122.947 16.8667 123.321 16.96 123.841 16.96H125.081V19H123.361ZM128.619 23.4L131.079 17.88H130.479L126.459 8.92H129.079L132.079 15.76L134.919 8.92H137.459L131.159 23.4H128.619Z" fill="#4B3FFF"/>
              </svg>
            ) : currentCity.id === 'summit-springs' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '4px', bgcolor: colors.blurple100 }}>
                  <AccountBalance sx={{ fontSize: 16, color: colors.blurple700 }} />
                </Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.blurple700, letterSpacing: '-0.02em' }}>Summit Springs</Typography>
              </Box>
            ) : currentCity.id === 'riverside-city' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '4px', bgcolor: colors.blurple100 }}>
                  <Park sx={{ fontSize: 16, color: colors.blurple400 }} />
                </Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.blurple400, letterSpacing: '-0.02em' }}>Riverside Gardens</Typography>
              </Box>
            ) : currentCity.id === 'metro-central' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '4px', bgcolor: colors.blurple100 }}>
                  <Business sx={{ fontSize: 16, color: colors.blurple500 }} />
                </Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.blurple500, letterSpacing: '-0.02em' }}>Metro Central</Typography>
              </Box>
            ) : null}
          </Box>

          {/* City Switcher - Desktop only */}
          {!isMobile && (
            <CitySwitcher
              activeCity={currentCity}
              cities={defaultCities}
              onCityChange={setCurrentCity}
              variant="dropdown"
              showAccount={true}
              label="Change Location"
              hasMultipleAccounts={currentCity.id !== 'metro-central'}
            />
          )}
        </Box>

        {/* Navigation Tabs - Desktop only */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', height: '100%' }}>
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            
            // Tabs with dropdown (Services and City Help)
            if (tab.hasSubmenu) {
              const isServicesTab = tab.id === 'services';
              const isCityHelpTab = tab.id === 'cityhelp';
              const handleClick = isServicesTab ? handleServicesClick : isCityHelpTab ? handleCityHelpClick : undefined;
              const anchorEl = isServicesTab ? servicesAnchor : isCityHelpTab ? cityHelpAnchor : null;
              
              return (
                <Box
                  key={tab.id}
                  onClick={handleClick}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2.5,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: isActive ? 'transparent' : colors.gray50,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                      color: isActive ? colors.blurple500 : colors.gray900,
                      transition: 'color 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                    <KeyboardArrowDown 
                      sx={{ 
                        fontSize: 18, 
                        transition: 'transform 0.2s',
                        transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
                      }} 
                    />
                  </Typography>
                  {/* Active indicator */}
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
            }

            // Regular tabs
            return (
              <Box
                key={tab.id}
                onClick={() => tab.path && navigate(tab.path)}
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2.5,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isActive ? 'transparent' : colors.gray50,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isActive ? colors.blurple500 : colors.gray900,
                    transition: 'color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </Typography>
                {/* Active indicator - bottom border */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            {/* Cart Icon with Badge */}
            <IconButton
              onClick={openCart}
              aria-label={`View cart (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
              sx={{
                color: colors.gray700,
                '&:hover': { bgcolor: colors.gray50 },
              }}
            >
              <Badge
                badgeContent={itemCount}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: colors.blurple500,
                    color: colors.white,
                    fontWeight: 600,
                    fontSize: '0.6875rem',
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            {/* User Avatar & Menu */}
            <Box
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                py: 0.5,
                px: 1.5,
                borderRadius: '4px',
                border: `1px solid ${colors.gray200}`,
                '&:hover': { bgcolor: colors.gray50, borderColor: colors.gray300 },
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
              <KeyboardArrowDown sx={{ fontSize: 16, color: colors.gray400 }} />
            </Box>
          </Box>
        </Box>

        {/* Mobile: Cart Icon */}
        {isMobile && (
          <IconButton
            onClick={openCart}
            aria-label={`View cart (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
            sx={{
              color: colors.gray700,
              mr: 1,
            }}
          >
            <Badge
              badgeContent={itemCount}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: colors.blurple500,
                  color: colors.white,
                  fontWeight: 600,
                  fontSize: '0.6875rem',
                },
              }}
            >
              <ShoppingCart sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        )}
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
            borderRadius: '4px',
            minWidth: 280,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.gray100}`,
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray100}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 44, 
                height: 44, 
                bgcolor: colors.blurple500, 
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {currentUser.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.9375rem' }}>
                {currentUser.name}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={() => { navigate('/unified-portal/account'); setUserMenuAnchor(null); }}
          sx={{ py: 1.5 }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.gray700 }}>Account Settings</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => { navigate('/unified-portal/history'); setUserMenuAnchor(null); }}
          sx={{ py: 1.5 }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.gray700 }}>Payment History</Typography>
        </MenuItem>
        
        {/* Vendor Portal Option */}
        {currentUser.hasVendorAccount && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={() => { window.location.href = '/vendor-portal'; setUserMenuAnchor(null); }}
              sx={{ py: 1.5 }}
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
                  <Storefront sx={{ fontSize: 18, color: colors.blurple500 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>Vendor Portal</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500 }}>{currentUser.vendorName}</Typography>
                </Box>
              </Box>
            </MenuItem>
          </>
        )}
        
        <MenuItem 
          sx={{ py: 1.5, borderTop: `1px solid ${colors.gray100}` }}
          onClick={() => console.log('Logout')}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.red500 }}>Sign Out</Typography>
        </MenuItem>
      </Menu>

      {/* Services Flyout Menu */}
      <Menu
        anchorEl={servicesAnchor}
        open={Boolean(servicesAnchor)}
        onClose={handleServicesClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: '4px',
            minWidth: 320,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.gray100}`,
            overflow: 'hidden',
          },
        }}
        MenuListProps={{ sx: { p: 0 } }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray100}` }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Government Services
          </Typography>
        </Box>
        
        {filteredServiceItems.map((item, index) => {
          const Icon = item.icon;
          const isCurrentPath = location.pathname.startsWith(item.path);
          return (
            <MenuItem
              key={item.id}
              onClick={() => handleServiceItemClick(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: index < serviceItems.length - 1 ? `1px solid ${colors.gray50}` : 'none',
                bgcolor: isCurrentPath ? colors.blurple50 : 'transparent',
                '&:hover': { bgcolor: isCurrentPath ? colors.blurple50 : colors.gray50 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '4px', 
                    bgcolor: item.bgColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: item.color }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    {item.desc}
                  </Typography>
                </Box>
                <East sx={{ fontSize: 16, color: colors.gray300 }} />
              </Box>
            </MenuItem>
          );
        })}

        <Box sx={{ p: 2, bgcolor: colors.gray50, borderTop: `1px solid ${colors.gray100}` }}>
          <Typography 
            onClick={() => { navigate('/unified-portal'); handleServicesClose(); }}
            sx={{ 
              fontSize: '0.8125rem', 
              fontWeight: 600, 
              color: colors.blurple500, 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View all services →
          </Typography>
        </Box>
      </Menu>

      {/* City Help & 311 Flyout Menu */}
      <Menu
        anchorEl={cityHelpAnchor}
        open={Boolean(cityHelpAnchor)}
        onClose={handleCityHelpClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: '4px',
            minWidth: 340,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.gray100}`,
            overflow: 'hidden',
          },
        }}
        MenuListProps={{ sx: { p: 0 } }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray100}` }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Get Help & Stay Informed
          </Typography>
        </Box>
        
        {cityHelpItems.map((item, index) => {
          const Icon = item.icon;
          const isCurrentPath = location.pathname.startsWith(item.path);
          return (
            <MenuItem
              key={item.id}
              onClick={() => handleCityHelpItemClick(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: index < cityHelpItems.length - 1 ? `1px solid ${colors.gray50}` : 'none',
                bgcolor: isCurrentPath ? item.bgColor : 'transparent',
                '&:hover': { bgcolor: isCurrentPath ? item.bgColor : colors.gray50 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '4px', 
                    bgcolor: item.bgColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: item.color }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    {item.desc}
                  </Typography>
                </Box>
                <East sx={{ fontSize: 16, color: colors.gray300 }} />
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: colors.white,
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.gray100}` }}>
          <svg 
            width="120" 
            height="21" 
            viewBox="0 0 138 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Cloud City"
          >
            <path d="M10 2V4.26L12 5.59V4H22V19H17V21H24V2H10ZM7.5 5L0 10V21H15V10L7.5 5ZM14 6V6.93L15.61 8H16V6H14ZM18 6V8H20V6H18ZM7.5 7.5L13 11V19H10V13H5V19H2V11L7.5 7.5ZM18 10V12H20V10H18ZM18 14V16H20V14H18Z" fill="#4B3FFF"/>
            <path d="M43.64 19.24C42.2533 19.24 41.0533 18.94 40.04 18.34C39.04 17.7267 38.2667 16.88 37.72 15.8C37.1867 14.7067 36.92 13.4467 36.92 12.02C36.92 10.58 37.1867 9.32 37.72 8.24C38.2667 7.14667 39.04 6.29333 40.04 5.68C41.0533 5.06667 42.2533 4.76 43.64 4.76C45.3067 4.76 46.6667 5.17333 47.72 6C48.7733 6.81333 49.44 7.96667 49.72 9.46H47.08C46.8933 8.67333 46.5133 8.05333 45.94 7.6C45.3667 7.14667 44.5933 6.92 43.62 6.92C42.74 6.92 41.98 7.12667 41.34 7.54C40.7133 7.94 40.2267 8.52667 39.88 9.3C39.5467 10.06 39.38 10.9667 39.38 12.02C39.38 13.0733 39.5467 13.98 39.88 14.74C40.2267 15.4867 40.7133 16.0667 41.34 16.48C41.98 16.88 42.74 17.08 43.62 17.08C44.5933 17.08 45.3667 16.8733 45.94 16.46C46.5133 16.0333 46.8933 15.4467 47.08 14.7H49.72C49.4533 16.1133 48.7867 17.2267 47.72 18.04C46.6667 18.84 45.3067 19.24 43.64 19.24ZM51.9884 19V4.6H54.3884V19H51.9884ZM61.7666 19.24C60.8066 19.24 59.9399 19.02 59.1666 18.58C58.4066 18.1267 57.8066 17.5067 57.3666 16.72C56.9399 15.92 56.7266 15.0067 56.7266 13.98C56.7266 12.9267 56.9466 12.0067 57.3866 11.22C57.8266 10.42 58.4266 9.8 59.1866 9.36C59.9599 8.90667 60.8266 8.68 61.7866 8.68C62.7466 8.68 63.6066 8.90667 64.3666 9.36C65.1399 9.8 65.7399 10.4133 66.1666 11.2C66.6066 11.9867 66.8266 12.9067 66.8266 13.96C66.8266 15.0133 66.6066 15.9333 66.1666 16.72C65.7266 17.5067 65.1199 18.1267 64.3466 18.58C63.5866 19.02 62.7266 19.24 61.7666 19.24ZM61.7666 17.18C62.2466 17.18 62.6799 17.06 63.0666 16.82C63.4666 16.58 63.7866 16.22 64.0266 15.74C64.2666 15.26 64.3866 14.6667 64.3866 13.96C64.3866 13.2533 64.2666 12.6667 64.0266 12.2C63.7999 11.72 63.4866 11.36 63.0866 11.12C62.6999 10.88 62.2666 10.76 61.7866 10.76C61.3199 10.76 60.8866 10.88 60.4866 11.12C60.0866 11.36 59.7666 11.72 59.5266 12.2C59.2866 12.6667 59.1666 13.2533 59.1666 13.96C59.1666 14.6667 59.2866 15.26 59.5266 15.74C59.7666 16.22 60.0799 16.58 60.4666 16.82C60.8666 17.06 61.2999 17.18 61.7666 17.18ZM72.9159 19.24C72.1026 19.24 71.4026 19.08 70.8159 18.76C70.2426 18.4267 69.8026 17.9333 69.4959 17.28C69.1893 16.6133 69.0359 15.7933 69.0359 14.82V8.92H71.4359V14.58C71.4359 15.4467 71.6159 16.1067 71.9759 16.56C72.3493 17 72.9093 17.22 73.6559 17.22C74.1359 17.22 74.5626 17.1067 74.9359 16.88C75.3226 16.6533 75.6226 16.3267 75.8359 15.9C76.0626 15.46 76.1759 14.9267 76.1759 14.3V8.92H78.5759V19H76.4559L76.2759 17.32C75.9693 17.9067 75.5226 18.3733 74.9359 18.72C74.3626 19.0667 73.6893 19.24 72.9159 19.24ZM85.7263 19.24C84.7929 19.24 83.9596 19.0133 83.2263 18.56C82.4929 18.1067 81.9196 17.48 81.5063 16.68C81.1063 15.88 80.9063 14.9733 80.9063 13.96C80.9063 12.9467 81.1129 12.0467 81.5263 11.26C81.9396 10.46 82.5129 9.83333 83.2463 9.38C83.9929 8.91333 84.8329 8.68 85.7663 8.68C86.5263 8.68 87.1863 8.82667 87.7463 9.12C88.3196 9.4 88.7729 9.8 89.1063 10.32V4.6H91.5063V19H89.3463L89.1063 17.54C88.8929 17.8333 88.6329 18.1133 88.3263 18.38C88.0196 18.6333 87.6529 18.84 87.2263 19C86.7996 19.16 86.2996 19.24 85.7263 19.24ZM86.2263 17.16C86.7996 17.16 87.3063 17.0267 87.7463 16.76C88.1863 16.48 88.5263 16.1 88.7663 15.62C89.0063 15.14 89.1263 14.5867 89.1263 13.96C89.1263 13.3333 89.0063 12.78 88.7663 12.3C88.5263 11.82 88.1863 11.4467 87.7463 11.18C87.3063 10.9133 86.7996 10.78 86.2263 10.78C85.6796 10.78 85.1863 10.9133 84.7463 11.18C84.3063 11.4467 83.9596 11.82 83.7063 12.3C83.4663 12.78 83.3463 13.3333 83.3463 13.96C83.3463 14.5867 83.4663 15.14 83.7063 15.62C83.9596 16.1 84.3063 16.48 84.7463 16.76C85.1863 17.0267 85.6796 17.16 86.2263 17.16ZM105.359 19.24C103.972 19.24 102.772 18.94 101.759 18.34C100.759 17.7267 99.9854 16.88 99.4388 15.8C98.9054 14.7067 98.6388 13.4467 98.6388 12.02C98.6388 10.58 98.9054 9.32 99.4388 8.24C99.9854 7.14667 100.759 6.29333 101.759 5.68C102.772 5.06667 103.972 4.76 105.359 4.76C107.025 4.76 108.385 5.17333 109.439 6C110.492 6.81333 111.159 7.96667 111.439 9.46H108.799C108.612 8.67333 108.232 8.05333 107.659 7.6C107.085 7.14667 106.312 6.92 105.339 6.92C104.459 6.92 103.699 7.12667 103.059 7.54C102.432 7.94 101.945 8.52667 101.599 9.3C101.265 10.06 101.099 10.9667 101.099 12.02C101.099 13.0733 101.265 13.98 101.599 14.74C101.945 15.4867 102.432 16.0667 103.059 16.48C103.699 16.88 104.459 17.08 105.339 17.08C106.312 17.08 107.085 16.8733 107.659 16.46C108.232 16.0333 108.612 15.4467 108.799 14.7H111.439C111.172 16.1133 110.505 17.2267 109.439 18.04C108.385 18.84 107.025 19.24 105.359 19.24ZM113.807 19V8.92H116.207V19H113.807ZM115.007 7.32C114.567 7.32 114.201 7.18667 113.907 6.92C113.627 6.64 113.487 6.3 113.487 5.9C113.487 5.48667 113.627 5.15333 113.907 4.9C114.201 4.63333 114.567 4.5 115.007 4.5C115.447 4.5 115.807 4.63333 116.087 4.9C116.381 5.15333 116.527 5.48667 116.527 5.9C116.527 6.3 116.381 6.64 116.087 6.92C115.807 7.18667 115.447 7.32 115.007 7.32ZM123.361 19C122.681 19 122.087 18.8933 121.581 18.68C121.087 18.4667 120.701 18.1133 120.421 17.62C120.141 17.1267 120.001 16.46 120.001 15.62V10.94H118.281V8.92H120.001L120.281 6.26H122.401V8.92H125.141V10.94H122.401V15.62C122.401 16.1267 122.507 16.48 122.721 16.68C122.947 16.8667 123.321 16.96 123.841 16.96H125.081V19H123.361ZM128.619 23.4L131.079 17.88H130.479L126.459 8.92H129.079L132.079 15.76L134.919 8.92H137.459L131.159 23.4H128.619Z" fill="#4B3FFF"/>
          </svg>
          <IconButton 
            onClick={() => setMobileDrawerOpen(false)} 
            aria-label="Close navigation menu"
            sx={{ color: colors.gray500 }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ p: 2, bgcolor: colors.gray50, borderBottom: `1px solid ${colors.gray100}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: colors.blurple500, fontSize: '0.875rem', fontWeight: 600 }}>
              {currentUser.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>{currentUser.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{currentUser.email}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Navigation */}
        <List sx={{ py: 1 }}>
          <ListItem 
            onClick={() => handleMobileNavClick('/unified-portal')}
            sx={{ py: 1.5, cursor: 'pointer', bgcolor: currentTab === 'dashboard' ? colors.blurple50 : 'transparent', '&:hover': { bgcolor: colors.gray50 } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Home sx={{ color: currentTab === 'dashboard' ? colors.blurple500 : colors.gray500 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ fontWeight: currentTab === 'dashboard' ? 600 : 500, color: currentTab === 'dashboard' ? colors.blurple500 : colors.gray700 }}
            />
          </ListItem>

          <ListItem 
            onClick={() => handleMobileNavClick('/unified-portal/history')}
            sx={{ py: 1.5, cursor: 'pointer', bgcolor: currentTab === 'history' ? colors.blurple50 : 'transparent', '&:hover': { bgcolor: colors.gray50 } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <History sx={{ color: currentTab === 'history' ? colors.blurple500 : colors.gray500 }} />
            </ListItemIcon>
            <ListItemText 
              primary="History" 
              primaryTypographyProps={{ fontWeight: currentTab === 'history' ? 600 : 500, color: currentTab === 'history' ? colors.blurple500 : colors.gray700 }}
            />
          </ListItem>

          <ListItem 
            onClick={() => handleMobileNavClick('/unified-portal/support')}
            sx={{ py: 1.5, cursor: 'pointer', bgcolor: currentTab === 'support' ? colors.blurple50 : 'transparent', '&:hover': { bgcolor: colors.gray50 } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SupportAgent sx={{ color: currentTab === 'support' ? colors.blurple500 : colors.gray500 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Support" 
              primaryTypographyProps={{ fontWeight: currentTab === 'support' ? 600 : 500, color: currentTab === 'support' ? colors.blurple500 : colors.gray700 }}
            />
          </ListItem>

          <ListItem 
            onClick={() => handleMobileNavClick('/unified-portal/account')}
            sx={{ py: 1.5, cursor: 'pointer', bgcolor: currentTab === 'account' ? colors.blurple50 : 'transparent', '&:hover': { bgcolor: colors.gray50 } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Person sx={{ color: currentTab === 'account' ? colors.blurple500 : colors.gray500 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Account" 
              primaryTypographyProps={{ fontWeight: currentTab === 'account' ? 600 : 500, color: currentTab === 'account' ? colors.blurple500 : colors.gray700 }}
            />
          </ListItem>
        </List>

        <Divider />

        {/* Services Section */}
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
            Services
          </Typography>
          {filteredServiceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.id}
                onClick={() => handleMobileNavClick(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  px: 1,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: colors.gray50 },
                }}
              >
                <Box sx={{ width: 32, height: 32, borderRadius: '4px', bgcolor: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ fontSize: 16, color: item.color }} />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700 }}>{item.label}</Typography>
              </Box>
            );
          })}
        </Box>

        <Divider />

        {/* City Help Section */}
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
            City Help & 311
          </Typography>
          {cityHelpItems.map((item) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.id}
                onClick={() => handleMobileNavClick(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  px: 1,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: colors.gray50 },
                }}
              >
                <Box sx={{ width: 32, height: 32, borderRadius: '4px', bgcolor: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ fontSize: 16, color: item.color }} />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700 }}>{item.label}</Typography>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Cart Drawer - available on all pages */}
      <CartDrawer />
    </Box>
  );
};

export default PortalNavigation;
