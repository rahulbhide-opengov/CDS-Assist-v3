/**
 * Payment View
 *
 * Step 2: Stripe-like payment experience
 * Card validation, brand detection, multi-stage processing
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Collapse,
  Grid,
  CircularProgress,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Lock,
  ArrowBack,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useCart } from './CartContext';

const colors = capitalDesignTokens.foundations.colors;

interface PaymentViewProps {
  onBack: () => void;
  onSuccess: (transactionId: string, paymentMethod: string) => void;
  setIsProcessing: (processing: boolean) => void;
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
type ProcessingStage = 'validating' | 'authorizing' | 'completing' | '';

export const PaymentView: React.FC<PaymentViewProps> = ({
  onBack,
  onSuccess,
  setIsProcessing,
}) => {
  const { items, subtotal, clearCart } = useCart();

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand>('unknown');

  // Validation state
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvvError, setCardCvvError] = useState('');
  const [cardNameError, setCardNameError] = useState('');

  // Bank form state
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');

  // Options
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [enableAutopay, setEnableAutopay] = useState(false);

  // Processing state
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('');

  // Calculate convenience fee (2.5% for card, 0 for bank)
  const convenienceFee = paymentMethod === 'card' ? subtotal * 0.025 : 0;
  const total = subtotal + convenienceFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Detect card brand from number
  const detectCardBrand = (number: string): CardBrand => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return 'unknown';
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Validate expiry date
  const validateExpiry = (expiry: string): boolean => {
    if (!expiry || expiry.length !== 5) return false;
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);

    if (monthNum < 1 || monthNum > 12) return false;

    const now = new Date();
    const expiryDate = new Date(yearNum, monthNum - 1);
    return expiryDate > now;
  };

  // Validate CVV
  const validateCvv = (cvv: string, brand: CardBrand): boolean => {
    if (brand === 'amex') {
      return cvv.length === 4;
    }
    return cvv.length === 3;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const brand = detectCardBrand(cleaned);
    setCardBrand(brand);

    // Amex format: 4-6-5
    if (brand === 'amex') {
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
    }
    // Standard format: 4-4-4-4
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  // Handle payment submission
  const handleSubmitPayment = async () => {
    // Validate card details if using card
    if (paymentMethod === 'card') {
      let hasErrors = false;

      if (!cardNumber || !validateCardNumber(cardNumber)) {
        setCardNumberError('Please enter a valid card number');
        hasErrors = true;
      } else {
        setCardNumberError('');
      }

      if (!cardExpiry || !validateExpiry(cardExpiry)) {
        setCardExpiryError('Invalid or expired date');
        hasErrors = true;
      } else {
        setCardExpiryError('');
      }

      if (!cardCvv || !validateCvv(cardCvv, cardBrand)) {
        setCardCvvError(cardBrand === 'amex' ? 'CVV must be 4 digits' : 'CVV must be 3 digits');
        hasErrors = true;
      } else {
        setCardCvvError('');
      }

      if (!cardName || cardName.trim().length < 3) {
        setCardNameError('Please enter the name on card');
        hasErrors = true;
      } else {
        setCardNameError('');
      }

      if (hasErrors) return;
    }

    setIsProcessingLocal(true);
    setIsProcessing(true);

    // Stage 1: Validating
    setProcessingStage('validating');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Stage 2: Authorizing
    setProcessingStage('authorizing');
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Stage 3: Completing
    setProcessingStage('completing');
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generate transaction ID
    const txId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Build payment method display string
    let paymentMethodDisplay = '';
    if (paymentMethod === 'card') {
      const brandDisplay = cardBrand !== 'unknown' ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : 'Card';
      paymentMethodDisplay = `${brandDisplay} •••• ${cardNumber.slice(-4) || '****'}`;
    } else {
      paymentMethodDisplay = `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} •••• ${accountNumber.slice(-4) || '****'}`;
    }

    setIsProcessingLocal(false);
    setIsProcessing(false);
    setProcessingStage('');

    // Clear cart and show success
    clearCart();
    onSuccess(txId, paymentMethodDisplay);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {/* Payment Method Selection */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
          How would you like to pay?
        </Typography>

        <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}>
          {/* Credit/Debit Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: '12px',
              border: '2px solid',
              borderColor: paymentMethod === 'card' ? colors.blurple500 : colors.gray200,
              bgcolor: paymentMethod === 'card' ? colors.blurple50 : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: colors.blurple500 },
            }}
            onClick={() => setPaymentMethod('card')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Radio value="card" sx={{ '&.Mui-checked': { color: colors.blurple500 } }} />
              <CreditCard sx={{ color: paymentMethod === 'card' ? colors.blurple500 : colors.gray400 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                  Credit or debit card
                </Typography>
                <Typography sx={{ color: colors.gray500, fontSize: '0.8125rem' }}>
                  2.5% convenience fee applies
                </Typography>
              </Box>
            </Box>

            <Collapse in={paymentMethod === 'card'}>
              <Box sx={{ pt: 3, pl: 7 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Card number"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(formatCardNumber(e.target.value));
                        setCardNumberError('');
                      }}
                      onBlur={() => {
                        if (cardNumber && !validateCardNumber(cardNumber)) {
                          setCardNumberError('Please enter a valid card number');
                        }
                      }}
                      error={!!cardNumberError}
                      helperText={cardNumberError}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                      slotProps={{
                        input: {
                          endAdornment: cardBrand !== 'unknown' && (
                            <Box sx={{
                              px: 1,
                              py: 0.5,
                              bgcolor: colors.gray100,
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: colors.gray600,
                              textTransform: 'uppercase',
                            }}>
                              {cardBrand}
                            </Box>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.blurple500,
                              borderWidth: '2px',
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Expiry"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(formatExpiry(e.target.value));
                        setCardExpiryError('');
                      }}
                      onBlur={() => {
                        if (cardExpiry && !validateExpiry(cardExpiry)) {
                          setCardExpiryError('Invalid or expired');
                        }
                      }}
                      error={!!cardExpiryError}
                      helperText={cardExpiryError}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.blurple500,
                              borderWidth: '2px',
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Security code"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setCardCvvError('');
                      }}
                      onBlur={() => {
                        if (cardCvv && !validateCvv(cardCvv, cardBrand)) {
                          setCardCvvError(cardBrand === 'amex' ? 'Must be 4 digits' : 'Must be 3 digits');
                        }
                      }}
                      error={!!cardCvvError}
                      helperText={cardCvvError}
                      placeholder="CVV"
                      type="password"
                      inputProps={{ maxLength: 4 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.blurple500,
                              borderWidth: '2px',
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Name on card"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        setCardNameError('');
                      }}
                      onBlur={() => {
                        if (cardName && cardName.trim().length < 3) {
                          setCardNameError('Please enter full name');
                        }
                      }}
                      error={!!cardNameError}
                      helperText={cardNameError}
                      placeholder="Jane Smith"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.blurple500,
                              borderWidth: '2px',
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>

          {/* Bank Account */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: '12px',
              border: '2px solid',
              borderColor: paymentMethod === 'bank' ? colors.blurple500 : colors.gray200,
              bgcolor: paymentMethod === 'bank' ? colors.blurple50 : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: colors.blurple500 },
            }}
            onClick={() => setPaymentMethod('bank')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Radio value="bank" sx={{ '&.Mui-checked': { color: colors.blurple500 } }} />
              <AccountBalance sx={{ color: paymentMethod === 'bank' ? colors.blurple500 : colors.gray400 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                  Bank account (ACH)
                </Typography>
                <Typography sx={{ color: colors.green600, fontSize: '0.8125rem', fontWeight: 500 }}>
                  No convenience fee
                </Typography>
              </Box>
            </Box>

            <Collapse in={paymentMethod === 'bank'}>
              <Box sx={{ pt: 3, pl: 7 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Routing number"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="123456789"
                      inputProps={{ maxLength: 9 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter your account number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <RadioGroup
                      row
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings')}
                    >
                      <FormControlLabel
                        value="checking"
                        control={<Radio sx={{ '&.Mui-checked': { color: colors.blurple500 } }} />}
                        label="Checking"
                      />
                      <FormControlLabel
                        value="savings"
                        control={<Radio sx={{ '&.Mui-checked': { color: colors.blurple500 } }} />}
                        label="Savings"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        {/* Save & Autopay Options */}
        <FormControlLabel
          control={
            <Checkbox
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e.target.checked)}
              sx={{ '&.Mui-checked': { color: colors.blurple500 } }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem', color: colors.gray700 }}>
              Save this payment method for next time
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={enableAutopay}
              onChange={(e) => setEnableAutopay(e.target.checked)}
              sx={{ '&.Mui-checked': { color: colors.blurple500 } }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem', color: colors.gray700 }}>
              Turn on autopay for recurring bills
            </Typography>
          }
        />
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
        {/* Total breakdown */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
              Subtotal
            </Typography>
            <Typography sx={{ color: colors.gray900, fontSize: '0.875rem' }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>
          {convenienceFee > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                Card fee (2.5%)
              </Typography>
              <Typography sx={{ color: colors.gray900, fontSize: '0.875rem' }}>
                {formatCurrency(convenienceFee)}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '1rem' }}>
              Total
            </Typography>
            <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1.25rem' }}>
              {formatCurrency(total)}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmitPayment}
            disabled={isProcessingLocal}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: isProcessingLocal ? colors.gray400 : colors.green600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: isProcessingLocal ? colors.gray400 : colors.green700,
                boxShadow: 'none',
              },
              '&:disabled': { bgcolor: colors.gray200 },
              transition: 'all 0.3s ease',
            }}
          >
            {isProcessingLocal ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>
                    {processingStage === 'validating' && 'Validating payment...'}
                    {processingStage === 'authorizing' && 'Authorizing transaction...'}
                    {processingStage === 'completing' && 'Completing payment...'}
                  </Typography>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      mt: 0.5,
                      height: 2,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                      },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Lock sx={{ fontSize: 18 }} />
                {`Pay ${formatCurrency(total)}`}
              </Box>
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
            disabled={isProcessingLocal}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: colors.gray300,
              color: colors.gray700,
              boxShadow: 'none',
              '&:hover': { bgcolor: colors.gray50, boxShadow: 'none' },
              '&:disabled': { borderColor: colors.gray200, color: colors.gray400 },
            }}
          >
            Back to cart
          </Button>
        </Box>

        {/* Security badge */}
        {!isProcessingLocal && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            pt: 2,
            borderTop: `1px solid ${colors.gray100}`,
            mt: 2,
          }}>
            <Lock sx={{ fontSize: 14, color: colors.gray400 }} />
            <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
              Secured by 256-bit encryption
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentView;
