/**
 * City Switcher Component
 * Allows users to switch between different city portals
 * 
 * Seamstress Design System
 * 
 * Available variants:
 * - dropdown: Menu-style dropdown (default)
 * - toggle: Pill toggle buttons
 * - compact: Small chip with swap action
 * - banner: Full-width utility banner
 */

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  Chip,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Fade,
  Grow,
} from '@mui/material';
import {
  KeyboardArrowDown,
  Check,
  LocationCity,
  SwapHoriz,
  Cloud,
  Brightness5,
  Water,
  OpenInNew,
  AccountBalance,
  Park,
  Business,
  Apartment,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const colors = capitalDesignTokens.foundations.colors;
const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
};

// ============================================================================
// TYPES
// ============================================================================

// User account data per city
export interface CityAccount {
  accountNumber: string;
  address: string;
  balance?: number;
  lastPayment?: string;
  propertyType?: string;
}

// City interface
interface ICity {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  portalUrl?: string;
  // New: city-specific account data
  account: CityAccount;
}

// Export as type alias (better Vite/esbuild compatibility)
export type City = ICity;
export type CitySwitcherVariant = 'dropdown' | 'toggle' | 'compact' | 'banner';

interface CitySwitcherProps {
  activeCity: City;
  cities: City[];
  onCityChange: (city: City) => void;
  variant?: CitySwitcherVariant;
  showTagline?: boolean;
  showAccount?: boolean; // New: show account info in dropdown
  label?: string; // Custom label for the button (e.g., "Change City")
  hasMultipleAccounts?: boolean; // New: if false, show account as chip instead of full section
}

// ============================================================================
// DEFAULT CITIES DATA - All Blurple Shades
// ============================================================================

export const defaultCities: City[] = [
  {
    id: 'cloud-city',
    name: 'Cloud City',
    shortName: 'Cloud',
    tagline: 'Where the sky meets innovation',
    icon: <Apartment sx={{ fontSize: 20 }} />,
    color: colors.blurple600,
    bgColor: colors.blurple50,
    portalUrl: '/unified-portal',
    account: {
      accountNumber: 'UTL-23-4957340',
      address: '123 Main Street, Cloud City, ST 12345',
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
    portalUrl: '/unified-portal?city=summit',
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
    portalUrl: '/unified-portal?city=riverside',
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
    portalUrl: '/unified-portal?city=metro',
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
// COMPONENT
// ============================================================================

export const CitySwitcher: React.FC<CitySwitcherProps> = ({
  activeCity,
  cities = defaultCities,
  onCityChange,
  variant = 'dropdown',
  showTagline = true,
  showAccount = true,
  label,
  hasMultipleAccounts = true,
}) => {
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
    onCityChange(city);
    handleClose();
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // =========================================================================
  // VARIANT: DROPDOWN (Default) - Enhanced Best-in-Class Navigation
  // =========================================================================
  if (variant === 'dropdown') {
    return (
      <>
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
            color: colors.gray700,
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: open ? colors.blurple50 : colors.gray100,
            borderRadius: radius.md,
            px: 1.5,
            py: 0.75,
            gap: 0.75,
            border: `1px solid ${open ? colors.blurple200 : 'transparent'}`,
            transition: 'all 0.2s ease',
            '&:hover': { 
              bgcolor: colors.blurple50,
              borderColor: colors.blurple200,
            },
          }}
        >
          {!label && (
            <Avatar
              sx={{ 
                width: 26, 
                height: 26, 
                bgcolor: activeCity.bgColor,
                color: activeCity.color,
                transition: 'transform 0.2s ease',
                ...(open && { transform: 'scale(1.05)' }),
              }}
            >
              {activeCity.icon}
            </Avatar>
          )}
          {label || activeCity.shortName}
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Grow}
          transitionDuration={200}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 360,
              maxWidth: 420,
              borderRadius: radius.lg,
              border: `1px solid ${colors.blurple100}`,
              boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 24px rgba(0,0,0,0.08)',
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
            {showAccount && hasMultipleAccounts && (
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
            )}
            {showAccount && !hasMultipleAccounts && (
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={activeCity.account.propertyType}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    bgcolor: colors.blurple100,
                    color: colors.blurple700,
                  }}
                />
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: colors.gray800, fontSize: '0.8125rem' }}>
                  {activeCity.account.accountNumber}
                </Typography>
              </Box>
            )}
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
          
          {cities.filter(c => c.id !== activeCity.id).map((city, index) => {
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
                <ListItemIcon sx={{ minWidth: 44, mr: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: city.bgColor,
                      color: city.color,
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isHovered ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
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
                      {showAccount && (
                        <Typography component="span" sx={{ fontSize: '0.6875rem', color: colors.blurple500, fontFamily: 'monospace', mt: 0.25, display: 'block' }}>
                          {city.account.address.split(',').slice(0, 2).join(',')}
                        </Typography>
                      )}
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
                    gap: 0.5,
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
      </>
    );
  }

  // =========================================================================
  // VARIANT: TOGGLE
  // =========================================================================
  if (variant === 'toggle') {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          p: 0.5,
          bgcolor: colors.gray100,
          borderRadius: radius.lg,
          gap: 0.5,
        }}
      >
        {cities.map((city) => {
          const isActive = city.id === activeCity.id;
          return (
            <Button
              key={city.id}
              onClick={() => onCityChange(city)}
              startIcon={city.icon}
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                minWidth: 'auto',
                bgcolor: isActive ? colors.white : 'transparent',
                color: isActive ? city.color : colors.gray600,
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  bgcolor: isActive ? colors.white : colors.gray200,
                },
                '& .MuiButton-startIcon': {
                  color: isActive ? city.color : colors.gray500,
                },
              }}
            >
              {city.shortName}
            </Button>
          );
        })}
      </Box>
    );
  }

  // =========================================================================
  // VARIANT: COMPACT (Mobile-friendly minimal button)
  // =========================================================================
  if (variant === 'compact') {
    return (
      <>
        <Button
          onClick={handleClick}
          aria-label="Change city"
          sx={{
            minWidth: 'auto',
            px: 1,
            py: 0.5,
            ml: 0.5,
            color: colors.gray500,
            borderRadius: radius.md,
            '&:hover': {
              bgcolor: colors.gray100,
              color: colors.gray700,
            },
          }}
        >
          <KeyboardArrowDown 
            sx={{ 
              fontSize: 20, 
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }} 
          />
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 260,
              borderRadius: radius.lg,
              border: `1px solid ${colors.gray200}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.gray100}` }}>
            <Typography variant="caption" sx={{ color: colors.gray500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Switch City
            </Typography>
          </Box>
          
          {cities.map((city) => {
            const isActive = city.id === activeCity.id;
            return (
              <MenuItem
                key={city.id}
                onClick={() => handleCitySelect(city)}
                selected={isActive}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  bgcolor: isActive ? city.bgColor : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? city.bgColor : colors.gray50,
                  },
                  '&.Mui-selected': {
                    bgcolor: city.bgColor,
                    '&:hover': { bgcolor: city.bgColor },
                  },
                }}
              >
                <Avatar
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: city.bgColor,
                    color: city.color,
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {city.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.9375rem' }}>
                    {city.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.gray500 }}>
                    {city.tagline}
                  </Typography>
                </Box>
                {isActive && (
                  <Check sx={{ color: city.color, fontSize: 20 }} />
                )}
              </MenuItem>
            );
          })}
        </Menu>
      </>
    );
  }

  // =========================================================================
  // VARIANT: BANNER (Seamstress Style)
  // =========================================================================
  if (variant === 'banner') {
    return (
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.blurple700} 0%, ${colors.blurple600} 50%, ${colors.cerulean700} 100%)`,
          color: colors.white,
          py: 0.625,
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
          fontSize: '0.8125rem',
        }}
      >
        {/* Left: Official badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: colors.green400,
              boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)',
            }}
          />
          <Typography 
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              opacity: 0.95,
            }}
          >
            Official Government Website
          </Typography>
        </Box>

        {/* Center: City name with icon */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            px: 2,
            py: 0.375,
            bgcolor: 'rgba(255,255,255,0.12)',
            borderRadius: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'rgba(255,255,255,0.9)',
            '& svg': { fontSize: 16 },
          }}>
            {activeCity.icon}
          </Box>
          <Typography 
            sx={{ 
              fontWeight: 600,
              fontSize: '0.8125rem',
              letterSpacing: '0.01em',
            }}
          >
            {activeCity.name}
          </Typography>
        </Box>
        
        {/* Right: Change Location */}
        <Button
          size="small"
          onClick={handleClick}
          endIcon={
            <KeyboardArrowDown 
              sx={{ 
                fontSize: 16,
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }} 
            />
          }
          sx={{
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            px: 1.5,
            py: 0.375,
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          Change Location
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 280,
              borderRadius: radius.lg,
              border: `1px solid ${colors.gray200}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            },
          }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          {/* Menu header */}
          <Box 
            sx={{ 
              px: 2, 
              py: 1.5, 
              background: `linear-gradient(135deg, ${colors.blurple50} 0%, ${colors.cerulean50} 100%)`,
              borderBottom: `1px solid ${colors.gray200}`,
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '0.6875rem', 
                fontWeight: 600, 
                color: colors.blurple600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Select Your City
            </Typography>
          </Box>
          
          {cities.map((city) => (
            <MenuItem
              key={city.id}
              onClick={() => handleCitySelect(city)}
              selected={city.id === activeCity.id}
              sx={{ 
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: city.bgColor,
                  '&:hover': { bgcolor: city.bgColor },
                },
                '&:hover': {
                  bgcolor: colors.gray50,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: city.bgColor,
                    color: city.color,
                    '& svg': { fontSize: 18 },
                  }}
                >
                  {city.icon}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={city.name}
                secondary={city.tagline}
                primaryTypographyProps={{
                  fontWeight: city.id === activeCity.id ? 600 : 500,
                  fontSize: '0.875rem',
                  color: colors.gray900,
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: colors.gray500,
                }}
              />
              {city.id === activeCity.id && (
                <Check sx={{ fontSize: 18, color: city.color, ml: 1 }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Fallback to dropdown
  return null;
};

export default CitySwitcher;
