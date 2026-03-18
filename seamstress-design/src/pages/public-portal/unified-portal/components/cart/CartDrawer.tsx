/**
 * Cart Drawer
 *
 * Unified cart drawer with three-step flow:
 * 1. Cart view - Review items
 * 2. Payment view - Stripe-like payment
 * 3. Success view - Confirmation
 */

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { Close, ShoppingCart } from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useCart } from './CartContext';
import { CartView } from './CartView';
import { PaymentView } from './PaymentView';
import { SuccessView } from './SuccessView';

const colors = capitalDesignTokens.foundations.colors;

type DrawerStep = 'cart' | 'payment' | 'success';

export const CartDrawer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isOpen, closeCart, itemCount } = useCart();
  const [currentStep, setCurrentStep] = useState<DrawerStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethodDisplay, setPaymentMethodDisplay] = useState<string>('');

  // Reset to cart view when drawer closes
  const handleClose = () => {
    if (!isProcessing) {
      closeCart();
      // Delay reset to allow drawer animation to complete
      setTimeout(() => {
        setCurrentStep('cart');
        setTransactionId('');
        setPaymentMethodDisplay('');
      }, 300);
    }
  };

  // Navigate to payment view
  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  // Navigate back to cart view
  const handleBackToCart = () => {
    setCurrentStep('cart');
  };

  // Handle successful payment
  const handlePaymentSuccess = (txId: string, paymentMethod: string) => {
    setTransactionId(txId);
    setPaymentMethodDisplay(paymentMethod);
    setCurrentStep('success');
  };

  // Drawer width
  const drawerWidth = isMobile ? '100%' : 480;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          maxWidth: '100%',
          bgcolor: colors.white,
        },
      }}
      ModalProps={{
        keepMounted: false, // Better performance on mobile
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: `1px solid ${colors.gray200}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: colors.white,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          {currentStep === 'cart' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShoppingCart sx={{ color: colors.blurple500, fontSize: 24 }} />
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.gray900 }}>
                Payment Cart
              </Typography>
              {itemCount > 0 && (
                <Chip
                  label={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
                  size="small"
                  sx={{
                    bgcolor: colors.blurple100,
                    color: colors.blurple500,
                    fontWeight: 600,
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
          ) : (
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.gray900 }}>
              {currentStep === 'payment' && 'Payment'}
              {currentStep === 'success' && 'Success'}
            </Typography>
          )}
          <IconButton
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Close cart"
            sx={{
              color: colors.gray500,
              '&:hover': { bgcolor: colors.gray100 },
              '&:disabled': { color: colors.gray300 },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {currentStep === 'cart' && (
            <CartView onContinue={handleContinueToPayment} />
          )}
          {currentStep === 'payment' && (
            <PaymentView
              onBack={handleBackToCart}
              onSuccess={handlePaymentSuccess}
              setIsProcessing={setIsProcessing}
            />
          )}
          {currentStep === 'success' && (
            <SuccessView
              transactionId={transactionId}
              paymentMethod={paymentMethodDisplay}
              onClose={handleClose}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
