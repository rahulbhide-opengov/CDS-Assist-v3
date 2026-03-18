/**
 * Persona Switcher Component
 * UI for switching between personas in dev/staging mode
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Person,
  Business,
  Apartment,
  School,
  VolunteerActivism,
  LocalShipping,
  ExpandMore,
  ExpandLess,
  Check,
  AutoMode,
  Tune,
  Close,
  Psychology,
  Accessibility,
  Payment,
  Home,
  Construction,
  Groups,
  Storefront,
  AccountBalance,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { usePersona, mockUserProfiles } from './PersonaContext';
import type { PersonaId, PersonaCategory, Persona } from './types';

const colors = capitalDesignTokens.foundations.colors;

// ============================================================================
// CATEGORY ICONS & COLORS
// ============================================================================

const categoryConfig: Record<PersonaCategory, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  resident: { icon: <Home />, color: colors.green600, bgColor: colors.green50, label: 'Residents' },
  business: { icon: <Business />, color: colors.cerulean600, bgColor: colors.cerulean50, label: 'Businesses' },
  organization: { icon: <Groups />, color: colors.orange500, bgColor: colors.orange50, label: 'Organizations' },
  vendor: { icon: <LocalShipping />, color: colors.blurple500, bgColor: colors.blurple50, label: 'Vendors' },
  institution: { icon: <School />, color: colors.yellow600, bgColor: colors.yellow50, label: 'Institutions' },
};

// Persona-specific icons
const personaIcons: Record<PersonaId, React.ReactNode> = {
  maria: <Payment />,
  devin: <Storefront />,
  charles: <Accessibility />,
  jasmine: <VolunteerActivism />,
  taylor: <Person />,
  sandra: <Apartment />,
  priya: <Business />,
  danny: <Construction />,
  landlord: <Apartment />,
  alicia: <VolunteerActivism />,
  marco: <Groups />,
  jordan: <LocalShipping />,
  samuel: <AccountBalance />,
  school_admin: <School />,
};

// ============================================================================
// PERSONA SWITCHER COMPONENT
// ============================================================================

interface PersonaSwitcherProps {
  variant?: 'dropdown' | 'drawer' | 'fab';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showCategories?: boolean;
  compact?: boolean;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  variant = 'drawer',
  position = 'bottom-right',
  showCategories = true,
  compact = false,
}) => {
  const {
    activePersona,
    availablePersonas,
    mode,
    isOverrideActive,
    personaSwitcherEnabled,
    isDevMode,
    setPersonaOverride,
    clearOverride,
    setMode,
    updateUserProfile,
  } = usePersona();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<PersonaCategory[]>(['resident', 'business']);
  
  // Don't render if not enabled
  if (!personaSwitcherEnabled) {
    return null;
  }
  
  // Group personas by category
  const personasByCategory = availablePersonas.reduce((acc, persona) => {
    if (!acc[persona.category]) {
      acc[persona.category] = [];
    }
    acc[persona.category].push(persona);
    return acc;
  }, {} as Record<PersonaCategory, Persona[]>);
  
  const toggleCategory = (category: PersonaCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handlePersonaSelect = (personaId: PersonaId) => {
    setPersonaOverride(personaId);
    setDrawerOpen(false);
    setAnchorEl(null);
  };
  
  const handleLoadMockProfile = (profileKey: string) => {
    const profile = mockUserProfiles[profileKey];
    if (profile) {
      updateUserProfile(profile);
    }
  };
  
  // FAB/Button trigger
  const trigger = (
    <Tooltip title="Persona Switcher (Dev Mode)" arrow>
      <Box
        sx={{
          position: 'fixed',
          [position.includes('bottom') ? 'bottom' : 'top']: 16,
          [position.includes('right') ? 'right' : 'left']: 16,
          zIndex: 1200,
        }}
      >
        <Badge
          badgeContent={isOverrideActive ? '!' : null}
          color="warning"
          overlap="circular"
        >
          <Button
            variant="contained"
            onClick={(e) => variant === 'dropdown' ? setAnchorEl(e.currentTarget) : setDrawerOpen(true)}
            sx={{
              minWidth: compact ? 48 : 'auto',
              width: compact ? 48 : 'auto',
              height: 48,
              borderRadius: compact ? '50%' : '24px',
              bgcolor: colors.gray900,
              color: colors.white,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: colors.gray800 },
              px: compact ? 0 : 2,
            }}
          >
            <Psychology sx={{ fontSize: 24 }} />
            {!compact && (
              <Typography sx={{ ml: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                {activePersona.name}
              </Typography>
            )}
          </Button>
        </Badge>
      </Box>
    </Tooltip>
  );
  
  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray200}`, bgcolor: colors.gray900, color: colors.white }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Persona Switcher
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: colors.white }}>
            <Close />
          </IconButton>
        </Box>
        <Chip
          size="small"
          label={isDevMode ? 'Development Mode' : 'Staging Mode'}
          sx={{ bgcolor: colors.yellow500, color: colors.gray900, fontWeight: 600, fontSize: '0.6875rem' }}
        />
      </Box>
      
      {/* Mode Toggle */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray200}`, bgcolor: colors.gray50 }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'automatic'}
              onChange={(e) => setMode(e.target.checked ? 'automatic' : 'manual')}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: colors.green600 },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: colors.green600 },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoMode sx={{ fontSize: 18, color: mode === 'automatic' ? colors.green600 : colors.gray400 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Auto-detect persona
              </Typography>
            </Box>
          }
        />
        {mode === 'automatic' && (
          <Typography variant="caption" sx={{ color: colors.gray500, display: 'block', mt: 0.5, ml: 5 }}>
            Persona is inferred from user roles & linked accounts
          </Typography>
        )}
      </Box>
      
      {/* Current Persona */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray200}` }}>
        <Typography variant="overline" sx={{ color: colors.gray500, fontWeight: 600, fontSize: '0.625rem', letterSpacing: 1 }}>
          Active Persona
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, p: 1.5, bgcolor: colors.blurple50, borderRadius: '8px', border: `2px solid ${colors.blurple500}` }}>
          <Avatar sx={{ bgcolor: categoryConfig[activePersona.category].color, width: 44, height: 44 }}>
            {personaIcons[activePersona.id]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
              {activePersona.name}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.gray500 }}>
              {activePersona.description}
            </Typography>
          </Box>
          {isOverrideActive && (
            <Chip size="small" label="Override" sx={{ bgcolor: colors.yellow100, color: colors.yellow700, fontSize: '0.625rem' }} />
          )}
        </Box>
        {isOverrideActive && (
          <Button
            size="small"
            onClick={clearOverride}
            sx={{ mt: 1, textTransform: 'none', color: colors.red600, fontWeight: 600 }}
          >
            Clear Override
          </Button>
        )}
      </Box>
      
      {/* Persona List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Typography variant="overline" sx={{ color: colors.gray500, fontWeight: 600, fontSize: '0.625rem', letterSpacing: 1, px: 2, pt: 2, display: 'block' }}>
          Switch To
        </Typography>
        
        <List dense sx={{ py: 0 }}>
          {showCategories ? (
            // Grouped by category
            Object.entries(personasByCategory).map(([category, categoryPersonas]) => {
              const config = categoryConfig[category as PersonaCategory];
              const isExpanded = expandedCategories.includes(category as PersonaCategory);
              
              return (
                <Box key={category}>
                  <ListItemButton onClick={() => toggleCategory(category as PersonaCategory)} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: config.bgColor, color: config.color }}>
                        {config.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={config.label}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                    />
                    <Chip
                      size="small"
                      label={categoryPersonas.length}
                      sx={{ bgcolor: colors.gray100, fontSize: '0.6875rem', height: 20 }}
                    />
                    {isExpanded ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />}
                  </ListItemButton>
                  
                  <Collapse in={isExpanded}>
                    <List dense disablePadding>
                      {categoryPersonas.map(persona => (
                        <ListItemButton
                          key={persona.id}
                          onClick={() => handlePersonaSelect(persona.id)}
                          selected={persona.id === activePersona.id}
                          sx={{
                            pl: 4,
                            py: 1,
                            '&.Mui-selected': {
                              bgcolor: colors.blurple50,
                              '&:hover': { bgcolor: colors.blurple100 },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: config.bgColor, color: config.color, fontSize: '0.75rem' }}>
                              {personaIcons[persona.id]}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={persona.name}
                            secondary={persona.description}
                            primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: persona.id === activePersona.id ? 600 : 400 }}
                            secondaryTypographyProps={{ fontSize: '0.6875rem', noWrap: true }}
                          />
                          {persona.id === activePersona.id && (
                            <Check sx={{ fontSize: 18, color: colors.blurple500 }} />
                          )}
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            })
          ) : (
            // Flat list
            availablePersonas.map(persona => (
              <ListItemButton
                key={persona.id}
                onClick={() => handlePersonaSelect(persona.id)}
                selected={persona.id === activePersona.id}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: colors.blurple50,
                    '&:hover': { bgcolor: colors.blurple100 },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: categoryConfig[persona.category].bgColor, color: categoryConfig[persona.category].color }}>
                    {personaIcons[persona.id]}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={persona.name}
                  secondary={persona.description}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: persona.id === activePersona.id ? 600 : 400 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
                {persona.id === activePersona.id && (
                  <Check sx={{ fontSize: 20, color: colors.blurple500 }} />
                )}
              </ListItemButton>
            ))
          )}
        </List>
      </Box>
      
      {/* Mock Profile Loader (Dev only) */}
      {isDevMode && (
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.gray200}`, bgcolor: colors.gray50 }}>
          <Typography variant="overline" sx={{ color: colors.gray500, fontWeight: 600, fontSize: '0.625rem', letterSpacing: 1 }}>
            Load Mock Profile
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {Object.keys(mockUserProfiles).map(key => (
              <Chip
                key={key}
                label={mockUserProfiles[key].name.split(' ')[0]}
                size="small"
                onClick={() => handleLoadMockProfile(key)}
                sx={{
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: colors.blurple100 },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${colors.gray200}`, bgcolor: colors.gray100 }}>
        <Typography variant="caption" sx={{ color: colors.gray500, display: 'block', textAlign: 'center' }}>
          Persona state is stored in localStorage
        </Typography>
      </Box>
    </Box>
  );
  
  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <>
        {trigger}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { width: 300, maxHeight: 400 },
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${colors.gray200}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Active: {activePersona.name}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.gray500 }}>
              {activePersona.description}
            </Typography>
          </Box>
          <Divider />
          {availablePersonas.map(persona => (
            <MenuItem
              key={persona.id}
              onClick={() => handlePersonaSelect(persona.id)}
              selected={persona.id === activePersona.id}
              sx={{ py: 1.5 }}
            >
              <Avatar sx={{ width: 28, height: 28, mr: 1.5, bgcolor: categoryConfig[persona.category].bgColor, color: categoryConfig[persona.category].color }}>
                {personaIcons[persona.id]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{persona.name}</Typography>
                <Typography variant="caption" sx={{ color: colors.gray500 }}>{persona.category}</Typography>
              </Box>
              {persona.id === activePersona.id && <Check sx={{ fontSize: 18, color: colors.blurple500 }} />}
            </MenuItem>
          ))}
          {isOverrideActive && (
            <>
              <Divider />
              <MenuItem onClick={clearOverride} sx={{ color: colors.red600 }}>
                Clear Override
              </MenuItem>
            </>
          )}
        </Menu>
      </>
    );
  }
  
  // Drawer variant (default)
  return (
    <>
      {trigger}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: colors.white } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

// ============================================================================
// PERSONA GATE COMPONENT
// ============================================================================

interface PersonaGateProps {
  requires?: (keyof import('./types').PersonaCapabilities)[];
  requiresAny?: boolean;
  invert?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders children based on persona capabilities
 */
export const PersonaGate: React.FC<PersonaGateProps> = ({
  requires = [],
  requiresAny = false,
  invert = false,
  fallback = null,
  children,
}) => {
  const { capabilities } = usePersona();
  
  let shouldRender: boolean;
  
  if (requires.length === 0) {
    shouldRender = true;
  } else if (requiresAny) {
    shouldRender = requires.some(cap => capabilities[cap]);
  } else {
    shouldRender = requires.every(cap => capabilities[cap]);
  }
  
  if (invert) {
    shouldRender = !shouldRender;
  }
  
  return <>{shouldRender ? children : fallback}</>;
};

export default PersonaSwitcher;

