/**
 * Account Selector Component
 *
 * Unified component to display and switch between user accounts
 * Shows all accounts (household and business) with visual indicators
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Home,
  Business,
  ExpandMore,
  CheckCircle,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const colors = capitalDesignTokens.foundations.colors;

// ============================================================================
// TYPES
// ============================================================================

export interface Account {
  id: string;
  type: 'household' | 'business';
  name: string;
  role?: string;
  address?: string;
}

export interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  variant?: 'dropdown' | 'tabs';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccountId,
  onAccountChange,
  variant = 'dropdown',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (accountId: string) => {
    onAccountChange(accountId);
    handleClose();
  };

  const getAccountIcon = (type: 'household' | 'business') => {
    return type === 'household' ? <Home sx={{ fontSize: 18 }} /> : <Business sx={{ fontSize: 18 }} />;
  };

  const getAccountColor = (type: 'household' | 'business') => {
    return type === 'household' ? {
      bg: colors.green50,
      text: colors.green700,
      border: colors.green200,
    } : {
      bg: colors.cerulean50,
      text: colors.cerulean700,
      border: colors.cerulean200,
    };
  };

  if (variant === 'tabs') {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {accounts.map((account) => {
          const isSelected = account.id === selectedAccountId;
          const accountColors = getAccountColor(account.type);

          return (
            <Button
              key={account.id}
              onClick={() => onAccountChange(account.id)}
              startIcon={getAccountIcon(account.type)}
              variant={isSelected ? 'outlined' : 'text'}
              color={isSelected ? (account.type === 'household' ? 'success' : 'info') : 'inherit'}
              sx={{
                px: 2.5,
                py: 1,
                fontWeight: isSelected ? 600 : 500,
                fontSize: '0.875rem',
              }}
            >
              {account.name}
            </Button>
          );
        })}
      </Box>
    );
  }

  // Default: dropdown variant
  if (!selectedAccount) return null;

  const selectedColors = getAccountColor(selectedAccount.type);

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<ExpandMore />}
        startIcon={getAccountIcon(selectedAccount.type)}
        sx={{
          textTransform: 'none',
          px: 2.5,
          py: 1.25,
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: selectedColors.text,
          bgcolor: selectedColors.bg,
          border: `1px solid ${selectedColors.border}`,
          '&:hover': {
            bgcolor: selectedAccount.type === 'household' ? colors.green100 : colors.cerulean100,
          },
        }}
      >
        <Box sx={{ textAlign: 'left', mr: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.2 }}>
            {selectedAccount.name}
          </Typography>
          {selectedAccount.role && (
            <Typography sx={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.2 }}>
              {selectedAccount.role}
            </Typography>
          )}
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 280,
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.gray200}` }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, textTransform: 'uppercase' }}>
            Switch Account
          </Typography>
        </Box>
        {accounts.map((account) => {
          const isSelected = account.id === selectedAccountId;
          const accountColors = getAccountColor(account.type);

          return (
            <MenuItem
              key={account.id}
              onClick={() => handleSelect(account.id)}
              sx={{
                py: 1.5,
                px: 2,
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                bgcolor: isSelected ? accountColors.bg : 'transparent',
                '&:hover': {
                  bgcolor: isSelected ? accountColors.bg : colors.gray50,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: colors.gray100,
                  color: colors.gray600,
                }}
              >
                {getAccountIcon(account.type)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.gray900 }}>
                  {account.name}
                </Typography>
                {account.role && (
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    {account.role}
                  </Typography>
                )}
                {account.address && (
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray400 }}>
                    {account.address}
                  </Typography>
                )}
                <Chip
                  label={account.type === 'household' ? 'Household' : 'Business'}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    bgcolor: accountColors.bg,
                    color: accountColors.text,
                  }}
                />
              </Box>
              {isSelected && (
                <CheckCircle sx={{ fontSize: 20, color: colors.green600 }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default AccountSelector;
export type { Account, AccountSelectorProps };
