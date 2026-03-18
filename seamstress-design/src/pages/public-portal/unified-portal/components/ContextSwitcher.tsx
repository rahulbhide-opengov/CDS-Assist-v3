/**
 * Context Switcher Component
 * Allows hybrid users to switch between personal and business views
 */

import React from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import { Home, Business, SwapHoriz } from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const colors = capitalDesignTokens.foundations.colors;

// ============================================================================
// TYPES
// ============================================================================

export type ViewContext = 'personal' | 'business';

interface ContextSwitcherProps {
  activeContext: ViewContext;
  onContextChange: (context: ViewContext) => void;
  personalLabel?: string;
  businessLabel?: string;
  personalSubtitle?: string;
  businessSubtitle?: string;
  variant?: 'toggle' | 'buttons' | 'compact';
  showLabels?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ContextSwitcher: React.FC<ContextSwitcherProps> = ({
  activeContext,
  onContextChange,
  personalLabel = 'Personal',
  businessLabel = 'Business',
  personalSubtitle,
  businessSubtitle,
  variant = 'toggle',
  showLabels = true,
}) => {
  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={activeContext === 'personal' ? <Home sx={{ fontSize: 16 }} /> : <Business sx={{ fontSize: 16 }} />}
          label={activeContext === 'personal' ? personalLabel : businessLabel}
          onClick={() => onContextChange(activeContext === 'personal' ? 'business' : 'personal')}
          deleteIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
          onDelete={() => onContextChange(activeContext === 'personal' ? 'business' : 'personal')}
          sx={{
            bgcolor: activeContext === 'personal' ? colors.green50 : colors.cerulean50,
            color: activeContext === 'personal' ? colors.green700 : colors.cerulean700,
            borderColor: activeContext === 'personal' ? colors.green200 : colors.cerulean200,
            border: '1px solid',
            fontWeight: 600,
            '& .MuiChip-deleteIcon': {
              color: 'inherit',
            },
            '&:hover': {
              bgcolor: activeContext === 'personal' ? colors.green100 : colors.cerulean100,
            },
          }}
        />
      </Box>
    );
  }

  if (variant === 'buttons') {
    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={activeContext === 'personal' ? 'contained' : 'outlined'}
          startIcon={<Home />}
          onClick={() => onContextChange('personal')}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: activeContext === 'personal' ? colors.green600 : 'transparent',
            borderColor: activeContext === 'personal' ? colors.green600 : colors.gray300,
            color: activeContext === 'personal' ? colors.white : colors.gray700,
            '&:hover': {
              bgcolor: activeContext === 'personal' ? colors.green700 : colors.gray100,
            },
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {personalLabel}
            </Typography>
            {showLabels && personalSubtitle && (
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {personalSubtitle}
              </Typography>
            )}
          </Box>
        </Button>
        
        <Button
          variant={activeContext === 'business' ? 'contained' : 'outlined'}
          startIcon={<Business />}
          onClick={() => onContextChange('business')}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: activeContext === 'business' ? colors.cerulean600 : 'transparent',
            borderColor: activeContext === 'business' ? colors.cerulean600 : colors.gray300,
            color: activeContext === 'business' ? colors.white : colors.gray700,
            '&:hover': {
              bgcolor: activeContext === 'business' ? colors.cerulean700 : colors.gray100,
            },
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {businessLabel}
            </Typography>
            {showLabels && businessSubtitle && (
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {businessSubtitle}
              </Typography>
            )}
          </Box>
        </Button>
      </Box>
    );
  }

  // Default: toggle variant
  return (
    <Box
      sx={{
        display: 'inline-flex',
        p: 0.5,
        bgcolor: colors.gray100,
        borderRadius: '12px',
        gap: 0.5,
      }}
    >
      <Button
        onClick={() => onContextChange('personal')}
        startIcon={<Home sx={{ fontSize: 18 }} />}
        sx={{
          px: 2,
          py: 1,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minWidth: 'auto',
          bgcolor: activeContext === 'personal' ? colors.white : 'transparent',
          color: activeContext === 'personal' ? colors.green700 : colors.gray600,
          boxShadow: activeContext === 'personal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          '&:hover': {
            bgcolor: activeContext === 'personal' ? colors.white : colors.gray200,
          },
        }}
      >
        {personalLabel}
      </Button>
      
      <Button
        onClick={() => onContextChange('business')}
        startIcon={<Business sx={{ fontSize: 18 }} />}
        sx={{
          px: 2,
          py: 1,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minWidth: 'auto',
          bgcolor: activeContext === 'business' ? colors.white : 'transparent',
          color: activeContext === 'business' ? colors.cerulean700 : colors.gray600,
          boxShadow: activeContext === 'business' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          '&:hover': {
            bgcolor: activeContext === 'business' ? colors.white : colors.gray200,
          },
        }}
      >
        {businessLabel}
      </Button>
    </Box>
  );
};

export default ContextSwitcher;

