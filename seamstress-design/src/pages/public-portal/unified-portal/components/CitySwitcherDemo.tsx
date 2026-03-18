/**
 * City Switcher Demo Page
 * 
 * Showcases the dropdown city switcher with different accounts per city.
 * 
 * Seamstress Design System
 */

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Paper,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grow,
} from '@mui/material';
import {
  Cloud,
  AccountBalance,
  Park,
  Business,
  KeyboardArrowDown,
  Check,
  SwapHoriz,
  OpenInNew,
} from '@mui/icons-material';
import { cdsColors } from '../../../../theme/cds';
import { radius, layout } from '../theme';

const colors = cdsColors;

// ============================================================================
// CITY DATA WITH ACCOUNTS
// ============================================================================

interface CityAccount {
  accountNumber: string;
  address: string;
  balance: number;
  lastPayment: string;
  propertyType: string;
}

interface City {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  account: CityAccount;
}

const cities: City[] = [
  {
    id: 'cloud-city',
    name: 'Cloud City',
    shortName: 'Cloud',
    tagline: 'Where the sky meets innovation',
    icon: <Cloud sx={{ fontSize: 20 }} />,
    color: colors.blurple600,
    bgColor: colors.blurple50,
    account: {
      accountNumber: 'CC-2024-78432',
      address: '1847 Skyline Boulevard, Cloud City, CA 94102',
      balance: 245.67,
      lastPayment: '2024-11-15',
      propertyType: 'Residential',
    },
  },
  {
    id: 'summit-springs',
    name: 'Summit Springs',
    shortName: 'Summit',
    tagline: 'Elevating community standards',
    icon: <AccountBalance sx={{ fontSize: 20 }} />,
    color: colors.blurple700,
    bgColor: colors.blurple100,
    account: {
      accountNumber: 'SS-2024-12098',
      address: '523 Mountain View Drive, Summit Springs, CA 94301',
      balance: 189.23,
      lastPayment: '2024-12-01',
      propertyType: 'Commercial',
    },
  },
  {
    id: 'riverside-city',
    name: 'Riverside Gardens',
    shortName: 'Riverside',
    tagline: 'Flow with progress',
    icon: <Park sx={{ fontSize: 20 }} />,
    color: colors.blurple400,
    bgColor: colors.blurple50,
    account: {
      accountNumber: 'RG-2024-45621',
      address: '2901 Riverbank Lane, Riverside Gardens, CA 94588',
      balance: 312.45,
      lastPayment: '2024-11-28',
      propertyType: 'Residential',
    },
  },
  {
    id: 'metro-central',
    name: 'Metro Central',
    shortName: 'Metro',
    tagline: 'The heart of municipal excellence',
    icon: <Business sx={{ fontSize: 20 }} />,
    color: colors.blurple500,
    bgColor: colors.blurple100,
    account: {
      accountNumber: 'MC-2024-89234',
      address: '450 Central Plaza, Suite 12B, Metro Central, CA 94110',
      balance: 567.89,
      lastPayment: '2024-12-05',
      propertyType: 'Mixed Use',
    },
  },
];

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const CitySwitcherDemo: React.FC = () => {
  const [activeCity, setActiveCity] = useState(cities[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredCity(null);
  };

  const handleCitySelect = (city: City) => {
    setActiveCity(city);
    handleClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.blurple700} 0%, ${colors.blurple600} 50%, ${colors.blurple500} 100%)`,
          color: colors.white,
          py: 0.75,
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'success.light',
              boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)',
            }}
          />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            Official Government Website
          </Typography>
        </Box>
      </Box>

      {/* Navigation Bar with City Logo + Dropdown Switcher */}
      <Box 
        sx={{ 
          bgcolor: colors.white, 
          borderBottom: `1px solid ${colors.gray200}`,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box 
          sx={{ 
            maxWidth: layout.maxWidth,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 }, 
            height: 64,
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* City Logo */}
          <Avatar
            sx={{ 
              width: 44, 
              height: 44, 
              bgcolor: activeCity.bgColor,
              color: activeCity.color,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
            }}
          >
            {activeCity.icon}
          </Avatar>
          
          {/* City Name */}
          <Typography 
            sx={{ 
              fontWeight: 700, 
              color: colors.gray900, 
              fontSize: '1.125rem',
            }}
          >
            {activeCity.name}
          </Typography>

          {/* DROPDOWN CITY SWITCHER - Right next to logo */}
          <Button
            onClick={handleClick}
            endIcon={
              <KeyboardArrowDown 
                sx={{ 
                  fontSize: 18, 
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }} 
              />
            }
            sx={{
              textTransform: 'none',
              color: colors.gray600,
              fontWeight: 600,
              fontSize: '0.8125rem',
              bgcolor: open ? colors.blurple50 : colors.gray100,
              borderRadius: radius.md,
              px: 1.5,
              py: 0.75,
              border: `1px solid ${open ? colors.blurple200 : 'transparent'}`,
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: colors.blurple50,
                borderColor: colors.blurple200,
              },
            }}
          >
            Change City
          </Button>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Grow}
            transitionDuration={200}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 380,
                maxWidth: 420,
                borderRadius: radius.lg,
                border: `1px solid ${colors.blurple100}`,
                boxShadow: `0 20px 60px ${colors.blurple500}26, 0 8px 24px rgba(0,0,0,0.08)`,
                overflow: 'hidden',
              },
            }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            {/* Current City Header */}
            <Box 
              sx={{ 
                px: 2.5, 
                py: 2, 
                background: `linear-gradient(135deg, ${colors.blurple50} 0%, ${colors.blurple100} 100%)`,
                borderBottom: `1px solid ${colors.blurple100}`,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.blurple600, 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.6875rem',
                }}
              >
                Current Location
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: colors.white,
                    color: activeCity.color,
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {activeCity.icon}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1rem' }}>
                    {activeCity.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.blurple600 }}>
                    {activeCity.account.address.split(',')[0]}
                  </Typography>
                </Box>
              </Box>
              
              {/* Account Info */}
              <Box 
                sx={{ 
                  mt: 1.5, 
                  p: 1.5, 
                  bgcolor: 'rgba(255,255,255,0.7)', 
                  borderRadius: radius.md,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, fontWeight: 600, textTransform: 'uppercase' }}>
                    Account
                  </Typography>
                  <Chip 
                    label={activeCity.account.propertyType} 
                    size="small"
                    sx={{ 
                      height: 20,
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      bgcolor: colors.blurple100,
                      color: colors.blurple700,
                    }}
                  />
                </Box>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: colors.gray800, fontSize: '0.8125rem', mt: 0.5 }}>
                  {activeCity.account.accountNumber}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.gray600, mt: 0.5 }}>
                  Balance: <strong style={{ color: colors.blurple600 }}>{formatCurrency(activeCity.account.balance)}</strong>
                </Typography>
              </Box>
            </Box>

            {/* Switch to Another City */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.gray100}` }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.gray500, 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.6875rem',
                }}
              >
                Switch to Another City
              </Typography>
            </Box>
            
            {cities.filter(c => c.id !== activeCity.id).map((city) => {
              const isHovered = hoveredCity === city.id;
              return (
                <MenuItem
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  onMouseEnter={() => setHoveredCity(city.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.15s ease',
                    bgcolor: isHovered ? colors.blurple50 : 'transparent',
                    '&:hover': {
                      bgcolor: colors.blurple50,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: city.bgColor,
                        color: city.color,
                        transition: 'all 0.2s ease',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: isHovered ? `0 4px 12px ${colors.blurple500}40` : 'none',
                      }}
                    >
                      {city.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={city.name}
                    secondary={
                      <Box component="span">
                        <Typography component="span" sx={{ fontSize: '0.75rem', color: colors.gray500, display: 'block' }}>
                          {city.tagline}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: '0.6875rem', color: colors.blurple500, fontFamily: 'monospace', mt: 0.25, display: 'block' }}>
                          {city.account.address.split(',').slice(0, 2).join(',')}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: colors.gray900,
                    }}
                  />
                  <Box 
                    sx={{ 
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      color: colors.blurple500,
                    }}
                  >
                    <SwapHoriz sx={{ fontSize: 16 }} />
                  </Box>
                </MenuItem>
              );
            })}
            
            <Divider sx={{ my: 0.5 }} />
            
            <MenuItem
              sx={{ 
                py: 1.5, 
                px: 2, 
                color: colors.blurple600,
                '&:hover': { bgcolor: colors.blurple50 },
              }}
              onClick={handleClose}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <OpenInNew sx={{ fontSize: 18, color: colors.blurple500 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Find another city portal"
                primaryTypographyProps={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          </Menu>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />
          
          {/* Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {['Services', 'Payments', 'Documents', 'Support'].map((item) => (
              <Typography 
                key={item}
                sx={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: colors.gray600,
                  cursor: 'pointer',
                  '&:hover': { color: colors.blurple600 },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          maxWidth: layout.maxWidth,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: colors.gray900,
              mb: 1,
            }}
          >
            Welcome to {activeCity.name}
          </Typography>
          <Typography sx={{ color: colors.gray600, fontSize: '1rem' }}>
            Manage your accounts, pay bills, and access city services all in one place.
          </Typography>
        </Box>

        {/* Account Card */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: radius.lg,
            border: `2px solid ${activeCity.color}20`,
            background: `linear-gradient(135deg, ${activeCity.bgColor} 0%, ${colors.white} 100%)`,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: colors.white,
                  color: activeCity.color,
                  boxShadow: `0 4px 16px ${colors.blurple500}33`,
                  '& svg': { fontSize: 28 },
                }}
              >
                {activeCity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.gray900 }}>
                  Your Account
                </Typography>
                <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                  {activeCity.account.propertyType} • {activeCity.name}
                </Typography>
              </Box>
              <Chip 
                label="Active"
                sx={{ 
                  bgcolor: colors.green50,
                  color: colors.green600,
                  fontWeight: 600,
                }}
              />
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: radius.md,
                bgcolor: 'rgba(255,255,255,0.8)',
                border: `1px solid ${colors.blurple100}`,
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                    Account Number
                  </Typography>
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: colors.gray900 }}>
                    {activeCity.account.accountNumber}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                    Balance Due
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: activeCity.color, fontSize: '1.25rem' }}>
                    {formatCurrency(activeCity.account.balance)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                    Last Payment
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.gray800 }}>
                    {new Date(activeCity.account.lastPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                    Property Type
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.gray800 }}>
                    {activeCity.account.propertyType}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                    Service Address
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.gray800 }}>
                    {activeCity.account.address}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Paper
          sx={{
            p: 3,
            borderRadius: radius.lg,
            bgcolor: colors.blurple50,
            border: `1px solid ${colors.blurple100}`,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: colors.blurple700, mb: 1 }}>
            💡 Try the City Switcher
          </Typography>
          <Typography sx={{ color: colors.blurple600, fontSize: '0.9375rem' }}>
            Click the <strong>"Change City"</strong> button in the navigation bar to switch between cities. 
            Each city has a different account with unique address, balance, and account number.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CitySwitcherDemo;
