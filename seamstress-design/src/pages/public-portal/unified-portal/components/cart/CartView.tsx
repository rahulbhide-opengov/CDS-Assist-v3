/**
 * Cart View
 *
 * Step 1: Review cart items
 * Shows list of items grouped by account, totals, and continue to payment button
 * Matches the homepage cart design with account grouping and checkboxes
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Divider,
  Card,
  CardContent,
  Checkbox,
  Chip,
} from '@mui/material';
import {
  Delete,
  ShoppingCart,
  Receipt,
  Home,
  Business,
  Description,
  Park,
  ArrowForward,
  Add,
  AccountBalance,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useCart } from './CartContext';
import type { CartItem } from './CartContext';

const colors = capitalDesignTokens.foundations.colors;

// Icon mapping for cart item types
const getItemIcon = (type: CartItem['type']) => {
  switch (type) {
    case 'tax':
      return <Home sx={{ fontSize: 20 }} />;
    case 'bill':
    case 'utility':
      return <Receipt sx={{ fontSize: 20 }} />;
    case 'permit':
    case 'license':
      return <Description sx={{ fontSize: 20 }} />;
    case 'park_pass':
    case 'facility_reservation':
      return <Park sx={{ fontSize: 20 }} />;
    case 'fee':
      return <Business sx={{ fontSize: 20 }} />;
    default:
      return <Receipt sx={{ fontSize: 20 }} />;
  }
};

// Color mapping for cart item types
const getItemColor = (type: CartItem['type']) => {
  switch (type) {
    case 'tax':
      return colors.yellow600;
    case 'bill':
    case 'utility':
      return colors.blurple500;
    case 'permit':
    case 'license':
      return colors.cerulean600;
    case 'park_pass':
    case 'facility_reservation':
      return colors.green600;
    case 'fee':
      return colors.gray600;
    default:
      return colors.gray600;
  }
};

// Account type detection from metadata or account ID
const getAccountType = (item: CartItem): 'household' | 'business' => {
  if (item.metadata?.accountType) {
    return item.metadata.accountType;
  }
  // Assume household by default, business if it's a business tax or has business in title
  if (item.type === 'tax' && item.metadata?.taxType === 'business') {
    return 'business';
  }
  if (item.title.toLowerCase().includes('business') || item.title.toLowerCase().includes('llc')) {
    return 'business';
  }
  return 'household';
};

// Get account name from item
const getAccountName = (item: CartItem): string => {
  if (item.metadata?.accountName) {
    return item.metadata.accountName;
  }
  return item.title; // Default to item title
};

interface CartViewProps {
  onContinue: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onContinue }) => {
  const { items, removeItem, clearCart, subtotal } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Group items by account ID (or account name if no ID)
  const itemsByAccount = useMemo(() => {
    const grouped: Record<string, CartItem[]> = {};
    items.forEach(item => {
      const accountKey = item.accountId || getAccountName(item);
      if (!grouped[accountKey]) {
        grouped[accountKey] = [];
      }
      grouped[accountKey].push(item);
    });

    // Sort items within each account by due date (soonest first)
    Object.keys(grouped).forEach(accountKey => {
      grouped[accountKey].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    });

    return grouped;
  }, [items]);

  // Calculate account totals
  const getAccountTotal = (accountItems: CartItem[]) => {
    return accountItems.reduce((sum, item) => sum + item.amount, 0);
  };

  // Calculate convenience fee (2.5%)
  const convenienceFee = subtotal * 0.025;
  const total = subtotal + convenienceFee;

  // Empty state
  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: colors.gray100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <ShoppingCart sx={{ fontSize: 40, color: colors.gray400 }} />
        </Box>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem', mb: 3 }}>
          Add items from any service page to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Items List */}
      <Box sx={{ flex: 1, p: 2.5, overflowY: 'auto' }}>
        {/* Clear all button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            size="small"
            onClick={clearCart}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: colors.gray600,
              '&:hover': { bgcolor: colors.gray50 },
            }}
          >
            Clear all
          </Button>
        </Box>

        {/* Items Grouped by Account */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(itemsByAccount).map(([accountKey, accountItems]) => {
            const firstItem = accountItems[0];
            const accountType = getAccountType(firstItem);
            const accountName = getAccountName(firstItem);
            const accountTotal = getAccountTotal(accountItems);

            return (
              <Box key={accountKey}>
                {/* Account Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, px: 1 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: accountType === 'business' ? colors.cerulean100 : colors.green100,
                      color: accountType === 'business' ? colors.cerulean600 : colors.green600
                    }}
                  >
                    {accountType === 'household' ? <Home sx={{ fontSize: 16 }} /> : <Business sx={{ fontSize: 16 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>
                      {accountName}
                    </Typography>
                    <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                      {accountItems.length} {accountItems.length === 1 ? 'item' : 'items'} · {formatCurrency(accountTotal)}
                    </Typography>
                  </Box>
                </Box>

                {/* Bills for this account */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {accountItems.map((item) => {
                    const itemColor = getItemColor(item.type);
                    const icon = getItemIcon(item.type);

                    return (
                      <Card
                        key={item.id}
                        elevation={0}
                        sx={{
                          borderRadius: '8px',
                          border: `1px solid ${colors.gray200}`,
                          bgcolor: colors.white,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: colors.gray300,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 2 } }}>
                          <Checkbox
                            checked
                            onChange={() => removeItem(item.id)}
                            sx={{
                              color: colors.blurple500,
                              p: 0,
                              '&.Mui-checked': { color: colors.blurple500 }
                            }}
                          />
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '8px',
                              bgcolor: `${itemColor}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: itemColor,
                              flexShrink: 0,
                            }}
                          >
                            {icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem', mb: 0.25 }}>
                              {item.title}
                            </Typography>
                            <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                              {item.description}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1rem' }}>
                              {formatCurrency(item.amount)}
                            </Typography>
                            {item.dueDate && (
                              <Typography sx={{ color: colors.gray500, fontSize: '0.6875rem', mt: 0.25 }}>
                                Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeItem(item.id)}
                            sx={{ color: colors.gray400, flexShrink: 0 }}
                            aria-label={`Remove ${item.title}`}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Footer with total and action */}
      <Box
        sx={{
          p: 2.5,
          borderTop: `1px solid ${colors.gray200}`,
          bgcolor: colors.white,
          position: 'sticky',
          bottom: 0,
        }}
      >
        {/* Account breakdown (if multiple accounts) */}
        {Object.keys(itemsByAccount).length > 1 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: colors.gray50, borderRadius: '8px' }}>
            <Typography sx={{ fontWeight: 600, color: colors.gray600, fontSize: '0.75rem', mb: 1 }}>
              Payment breakdown by account:
            </Typography>
            {Object.entries(itemsByAccount).map(([accountKey, accountItems]) => {
              const accountName = getAccountName(accountItems[0]);
              const accountTotal = getAccountTotal(accountItems);
              return (
                <Box key={accountKey} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                    {accountName}
                  </Typography>
                  <Typography sx={{ color: colors.gray700, fontSize: '0.75rem', fontWeight: 500 }}>
                    {formatCurrency(accountTotal)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Subtotal */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
              Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
            </Typography>
            <Typography sx={{ color: colors.gray700, fontSize: '0.875rem' }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
              Convenience Fee (2.5%)
            </Typography>
            <Typography sx={{ color: colors.gray700, fontSize: '0.875rem' }}>
              {formatCurrency(convenienceFee)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '1.125rem' }}>
            Total
          </Typography>
          <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1.25rem' }}>
            {formatCurrency(total)}
          </Typography>
        </Box>

        {/* Continue button */}
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={onContinue}
          sx={{
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            bgcolor: colors.blurple500,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: colors.blurple600,
              boxShadow: 'none',
            },
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default CartView;
