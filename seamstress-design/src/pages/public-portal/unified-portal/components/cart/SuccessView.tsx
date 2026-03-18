/**
 * Success View
 *
 * Step 3: Payment confirmation
 * Shows transaction details and success state
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  CreditCard,
  AccountBalance,
  Lock,
  Download,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useCart } from './CartContext';

const colors = capitalDesignTokens.foundations.colors;

interface SuccessViewProps {
  transactionId: string;
  paymentMethod: string;
  onClose: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  transactionId,
  paymentMethod,
  onClose,
}) => {
  const { subtotal } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        textAlign: 'center',
      }}
    >
      {/* Success Animation */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: colors.green600,
          mb: 3,
          boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
        }}
      >
        <CheckCircle sx={{ color: 'white', fontSize: 48 }} />
      </Box>

      {/* Success Message */}
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: colors.gray900,
          mb: 1,
          letterSpacing: '-0.02em',
        }}
      >
        Payment successful!
      </Typography>
      <Typography sx={{ color: colors.gray500, fontSize: '1rem', mb: 4 }}>
        Your payment has been processed
      </Typography>

      {/* Payment Details Card */}
      <Box
        sx={{
          width: '100%',
          p: 3,
          borderRadius: '12px',
          border: `1px solid ${colors.gray200}`,
          bgcolor: colors.white,
          textAlign: 'left',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: colors.gray900,
            mb: 2,
            fontSize: '0.9375rem',
          }}
        >
          Payment details
        </Typography>

        {/* Transaction ID */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            bgcolor: colors.blurple50,
            borderRadius: '8px',
            border: `1px solid ${colors.blurple200}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: colors.gray500,
                  mb: 0.5,
                }}
              >
                Transaction ID
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.gray900,
                  fontFamily: 'monospace',
                }}
              >
                {transactionId}
              </Typography>
            </Box>
            <CheckCircle sx={{ color: colors.green600, fontSize: 24 }} />
          </Box>
        </Box>

        {/* Payment Method */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${colors.gray100}`,
          }}
        >
          {paymentMethod.includes('Card') || paymentMethod.includes('Visa') || paymentMethod.includes('Mastercard') || paymentMethod.includes('Amex') || paymentMethod.includes('Discover') ? (
            <CreditCard sx={{ color: colors.gray400, fontSize: 20 }} />
          ) : (
            <AccountBalance sx={{ color: colors.gray400, fontSize: 20 }} />
          )}
          <Box>
            <Typography
              sx={{ fontSize: '0.75rem', color: colors.gray500 }}
            >
              Payment method
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: colors.gray900,
              }}
            >
              {paymentMethod}
            </Typography>
          </Box>
        </Box>

        {/* Total Paid */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
            Total paid
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: colors.green600,
              fontSize: '1.25rem',
            }}
          >
            {formatCurrency(subtotal)}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          width: '100%',
          flexDirection: 'column',
          mb: 3,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Download />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: colors.gray300,
            color: colors.gray700,
            py: 1.5,
            boxShadow: 'none',
            '&:hover': { bgcolor: colors.gray50, boxShadow: 'none' },
          }}
        >
          Download receipt
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: colors.green600,
            py: 1.5,
            boxShadow: 'none',
            '&:hover': { bgcolor: colors.green700, boxShadow: 'none' },
          }}
        >
          Close
        </Button>
      </Box>

      {/* Security Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          pt: 2,
          borderTop: `1px solid ${colors.gray100}`,
        }}
      >
        <Lock sx={{ fontSize: 14, color: colors.gray400 }} />
        <Typography sx={{ color: colors.gray400, fontSize: '0.75rem' }}>
          Payment secured • Processed on {formatDate(new Date())}
        </Typography>
      </Box>
    </Box>
  );
};

export default SuccessView;
