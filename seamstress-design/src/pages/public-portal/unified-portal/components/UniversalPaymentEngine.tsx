/**
 * Universal Payment Engine
 * 
 * Pay any government bill — fast, simple, and secure.
 * One place for all your payments.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  Paper,
  IconButton,
  Alert,
  Avatar,
  Collapse,
  CircularProgress,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import PortalNavigation from './PortalNavigation';

const colors = capitalDesignTokens.foundations.colors;
import {
  CreditCard,
  AccountBalance,
  Receipt,
  Payment,
  Schedule,
  Check,
  CheckCircle,
  Home,
  Business,
  Warning,
  CalendarToday,
  Lock,
  ArrowForward,
  ArrowBack,
  Delete,
  Add,
  Remove,
  Celebration,
  Download,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PayableItem, PaymentMethod as PaymentMethodType, PaymentPlan, Entity, BillCategory } from '../types';

// Mock payable items
const mockPayableItems: PayableItem[] = [
  {
    id: '1',
    entityId: '1',
    billType: 'property_tax',
    description: 'Property Tax - 2025 Q2',
    details: '123 Main Street',
    amount: 3245.00,
    dueDate: '2025-04-10',
    status: 'due',
    category: 'property_tax',
    metadata: { parcelId: 'ABC-123-456' },
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: '2',
    entityId: '1',
    billType: 'utility',
    description: 'Water Bill - March 2025',
    details: '123 Main Street',
    amount: 245.50,
    dueDate: '2025-04-16',
    status: 'due',
    category: 'utility',
    metadata: { accountNumber: 'WTR-001234' },
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
  },
  {
    id: '3',
    entityId: '1',
    billType: 'permit',
    description: 'Building Permit Fee',
    details: 'Permit #BP-2025-0342',
    amount: 200.00,
    dueDate: '2025-04-25',
    status: 'due',
    category: 'permit',
    metadata: { permitNumber: 'BP-2025-0342' },
    createdAt: '2025-03-10',
    updatedAt: '2025-03-10',
  },
  {
    id: '4',
    entityId: '2',
    billType: 'license',
    description: 'Business License Renewal',
    details: 'ABC Consulting LLC',
    amount: 175.00,
    dueDate: '2025-05-01',
    status: 'due',
    category: 'license',
    metadata: { licenseNumber: 'BL-2024-5678' },
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
  },
];

// Bill type icons and colors - simplified 3-shade palette (blurple, cerulean, slate)
const billTypeConfig: Record<BillCategory, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  property_tax: { icon: <Home />, color: colors.blurple500, bg: colors.blurple50, label: 'Property Tax' },
  business_tax: { icon: <Business />, color: colors.blurple500, bg: colors.blurple50, label: 'Business Tax' },
  utility: { icon: <Receipt />, color: colors.cerulean600, bg: colors.cerulean50, label: 'Utility Bill' },
  permit: { icon: <Receipt />, color: colors.blurple500, bg: colors.blurple50, label: 'Permit Fee' },
  license: { icon: <Business />, color: colors.blurple500, bg: colors.blurple50, label: 'License Fee' },
  citation: { icon: <Warning />, color: colors.gray600, bg: colors.gray100, label: 'Citation' },
  parks_and_rec: { icon: <Home />, color: colors.cerulean600, bg: colors.cerulean50, label: 'Parks & Rec' },
  other: { icon: <Receipt />, color: colors.gray500, bg: colors.gray100, label: 'Other' },
};

// Payment steps
const steps = ['Select bills', 'Payment method', 'Review & pay'];

const UniversalPaymentEngine: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'saved'>('card');
  const [savedPaymentId, setSavedPaymentId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [processingStage, setProcessingStage] = useState<'validating' | 'authorizing' | 'completing' | ''>('');
  const [transactionId, setTransactionId] = useState('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'>('unknown');

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

  // Animate content on mount
  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Pre-select item from URL
  useEffect(() => {
    const itemId = searchParams.get('item');
    const type = searchParams.get('type');
    if (itemId) {
      setSelectedItems([itemId]);
    } else if (type) {
      // Select all items of this type
      const matchingItems = mockPayableItems.filter(item => item.category === type);
      setSelectedItems(matchingItems.map(item => item.id));
    }
  }, [searchParams]);

  // Calculations
  const selectedBills = useMemo(() => 
    mockPayableItems.filter(item => selectedItems.includes(item.id)),
    [selectedItems]
  );
  
  const subtotal = useMemo(() => 
    selectedBills.reduce((sum, bill) => sum + bill.amount, 0),
    [selectedBills]
  );
  
  const convenienceFee = paymentMethod === 'card' ? subtotal * 0.025 : 0;
  const total = subtotal + convenienceFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const now = new Date();
    const due = new Date(dateString);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === mockPayableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockPayableItems.map(item => item.id));
    }
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  // Detect card brand from number
  const detectCardBrand = (number: string): typeof cardBrand => {
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
  const validateCvv = (cvv: string, brand: typeof cardBrand): boolean => {
    if (brand === 'amex') {
      return cvv.length === 4;
    }
    return cvv.length === 3;
  };

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
    setTransactionId(txId);

    setIsProcessing(false);
    setProcessingStage('');
    setPaymentComplete(true);
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

  // Card styling
  const cardStyle = {
    borderRadius: '12px',
    border: `1px solid ${colors.gray200}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };

  // Payment Complete State
  if (paymentComplete) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.green50} 0%, ${colors.green100} 100%)`,
        py: 4,
      }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{
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
            }}>
              <CheckCircle sx={{ color: 'white', fontSize: 48 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.gray900, mb: 1, letterSpacing: '-0.02em' }}>
              Payment successful!
            </Typography>
            <Typography sx={{ color: colors.gray500, fontSize: '1.125rem', mb: 4 }}>
              You've paid {formatCurrency(total)} for {selectedBills.length} bill{selectedBills.length > 1 ? 's' : ''}.
            </Typography>

            <Card elevation={0} sx={{ ...cardStyle, mb: 4, textAlign: 'left' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2, fontSize: '0.9375rem' }}>
                  Payment details
                </Typography>

                {/* Transaction ID */}
                <Box sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: colors.blurple50,
                  borderRadius: '8px',
                  border: `1px solid ${colors.blurple200}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, mb: 0.5 }}>
                        Transaction ID
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 400, color: colors.gray900, fontFamily: 'monospace' }}>
                        {transactionId}
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ color: colors.green600, fontSize: 24 }} />
                  </Box>
                </Box>

                {/* Payment Method */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: `1px solid ${colors.gray100}` }}>
                  {paymentMethod === 'card' ? (
                    <>
                      <CreditCard sx={{ color: colors.gray400, fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                          Payment method
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray900 }}>
                          {cardBrand !== 'unknown' && cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1)} •••• {cardNumber.slice(-4) || '****'}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <AccountBalance sx={{ color: colors.gray400, fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                          Payment method
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray900 }}>
                          {accountType.charAt(0).toUpperCase() + accountType.slice(1)} •••• {accountNumber.slice(-4) || '****'}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                {selectedBills.map((bill, index) => (
                  <Box key={bill.id} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderTop: index > 0 ? `1px solid ${colors.gray100}` : 'none',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        bgcolor: billTypeConfig[bill.category].bg,
                        color: billTypeConfig[bill.category].color,
                      }}>
                        {React.cloneElement(billTypeConfig[bill.category].icon, { sx: { fontSize: 16 } })}
                      </Avatar>
                      <Typography sx={{ color: colors.gray700, fontSize: '0.9375rem' }}>
                        {bill.description}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                      {formatCurrency(bill.amount)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                    Total paid
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: colors.green600, fontSize: '1.125rem' }}>
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: colors.gray300,
                  color: colors.gray700,
                  px: 3,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: colors.gray50, boxShadow: 'none' },
                }}
              >
                Download receipt
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/unified-portal')}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: colors.green600,
                  px: 3,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: colors.green700, boxShadow: 'none' },
                }}
              >
                Back to dashboard
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 4 }}>
              <Lock sx={{ fontSize: 14, color: colors.gray400 }} />
              <Typography sx={{ color: colors.gray400, fontSize: '0.75rem' }}>
                Payment secured • Processed on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="services" />

      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/unified-portal')}
            aria-label="Navigate back to dashboard"
            sx={{
              mb: 2,
              textTransform: 'none',
              color: colors.gray600,
              fontWeight: 500,
              borderRadius: '8px',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: colors.blurple50, color: colors.blurple500 },
            }}
          >
            Back to Dashboard
          </Button>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: colors.gray900,
              mb: 0.5,
            }}>
              Make a payment
            </Typography>
            <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
              Pay one bill or many — it's up to you.
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: activeStep === index ? 600 : 400,
                        color: activeStep >= index ? colors.gray900 : colors.gray400,
                      },
                      '& .MuiStepIcon-root': {
                        color: activeStep >= index ? colors.blurple500 : colors.gray200,
                        '&.Mui-active': { color: colors.blurple500 },
                        '&.Mui-completed': { color: colors.green500 },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Step 1: Select Bills */}
              {activeStep === 0 && (
                <Card elevation={0} sx={{ ...cardStyle, bgcolor: 'white' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900 }}>
                          Your bills
                        </Typography>
                        <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                          Select the bills you'd like to pay
                        </Typography>
                      </Box>
                      <Button
                        onClick={handleSelectAll}
                        sx={{ textTransform: 'none', fontWeight: 600, color: colors.blurple500, boxShadow: 'none', '&:hover': { bgcolor: colors.blurple50, boxShadow: 'none' } }}
                      >
                        {selectedItems.length === mockPayableItems.length ? 'Deselect all' : 'Select all'}
                      </Button>
                    </Box>
                    <Divider />
                    
                    {mockPayableItems.map((item, index) => {
                      const config = billTypeConfig[item.category];
                      const daysUntil = getDaysUntil(item.dueDate);
                      const isUrgent = daysUntil <= 7;
                      const isSelected = selectedItems.includes(item.id);

                      return (
                        <Box key={item.id}>
                          <Box
                            sx={{
                              p: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              cursor: 'pointer',
                              bgcolor: isSelected ? colors.blurple50 : 'transparent',
                              borderLeft: isSelected ? `3px solid ${colors.blurple500}` : '3px solid transparent',
                              transition: 'all 0.15s ease',
                              '&:hover': { bgcolor: isSelected ? colors.blurple50 : colors.gray50 },
                            }}
                            onClick={() => handleToggleItem(item.id)}
                          >
                            <Checkbox
                              checked={isSelected}
                              sx={{
                                color: colors.gray300,
                                '&.Mui-checked': { color: colors.blurple500 },
                              }}
                            />
                            <Avatar sx={{
                              width: 44,
                              height: 44,
                              bgcolor: config.bg,
                              color: config.color,
                            }}>
                              {config.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.9375rem' }}>
                                  {item.description}
                                </Typography>
                                <Chip
                                  label={config.label}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: '0.6875rem',
                                    fontWeight: 500,
                                    bgcolor: config.bg,
                                    color: config.color,
                                  }}
                                />
                              </Box>
                              <Typography sx={{ color: colors.gray500, fontSize: '0.8125rem' }}>
                                {item.details}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1.125rem' }}>
                                {formatCurrency(item.amount)}
                              </Typography>
                              <Typography sx={{
                                color: isUrgent ? colors.red600 : colors.gray500,
                                fontSize: '0.8125rem',
                                fontWeight: isUrgent ? 500 : 400,
                              }}>
                                Due {formatDate(item.dueDate)}
                                {isUrgent && daysUntil > 0 && ` (${daysUntil} days)`}
                                {daysUntil <= 0 && ' (Past due)'}
                              </Typography>
                            </Box>
                          </Box>
                          {index < mockPayableItems.length - 1 && <Divider />}
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 1 && (
                <Card elevation={0} sx={{ ...cardStyle, bgcolor: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                      How would you like to pay?
                    </Typography>
                    <Typography sx={{ color: colors.gray500, fontSize: '0.875rem', mb: 3 }}>
                      Choose your preferred payment method
                    </Typography>

                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank' | 'saved')}>
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
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review */}
              {activeStep === 2 && (
                <Card elevation={0} sx={{ ...cardStyle, bgcolor: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                      Review your payment
                    </Typography>
                    <Typography sx={{ color: colors.gray500, fontSize: '0.875rem', mb: 3 }}>
                      Make sure everything looks right
                    </Typography>

                    {/* Bills Summary */}
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2, fontSize: '0.875rem' }}>
                        Bills you're paying
                      </Typography>
                      {selectedBills.map((bill) => {
                        const config = billTypeConfig[bill.category];
                        return (
                          <Box
                            key={bill.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              py: 1.5,
                              borderBottom: `1px solid ${colors.gray100}`,
                            }}
                          >
                            <Avatar sx={{
                              width: 36,
                              height: 36,
                              bgcolor: config.bg,
                              color: config.color,
                            }}>
                              {React.cloneElement(config.icon, { sx: { fontSize: 18 } })}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 500, color: colors.gray900, fontSize: '0.9375rem' }}>
                                {bill.description}
                              </Typography>
                              <Typography sx={{ color: colors.gray500, fontSize: '0.8125rem' }}>
                                {bill.details}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                              {formatCurrency(bill.amount)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Payment Method Summary */}
                    <Box sx={{
                      p: 2.5,
                      bgcolor: colors.gray50,
                      borderRadius: '12px',
                      mb: 3,
                    }}>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 1, fontSize: '0.875rem' }}>
                        Payment method
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {paymentMethod === 'card' ? (
                          <>
                            <CreditCard sx={{ color: colors.blurple500 }} />
                            <Typography sx={{ color: colors.gray700 }}>
                              Card ending in {cardNumber.slice(-4) || '****'}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <AccountBalance sx={{ color: colors.blurple500 }} />
                            <Typography sx={{ color: colors.gray700 }}>
                              {accountType.charAt(0).toUpperCase() + accountType.slice(1)} account ending in {accountNumber.slice(-4) || '****'}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Security Note */}
                    <Alert
                      icon={<Lock sx={{ color: colors.blurple500 }} />}
                      severity="info"
                      sx={{
                        bgcolor: colors.blurple50,
                        color: colors.gray700,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': { color: colors.blurple500 },
                      }}
                    >
                      Your payment is secure and encrypted. We never store your full card number.
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Order Summary Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ ...cardStyle, bgcolor: 'white', position: 'sticky', top: 24 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                    Payment summary
                  </Typography>

                  {selectedBills.length > 0 ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        {selectedBills.map((bill) => (
                          <Box
                            key={bill.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              py: 1,
                              borderBottom: `1px dashed ${colors.gray200}`,
                            }}
                          >
                            <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>
                              {bill.description}
                            </Typography>
                            <Typography sx={{ color: colors.gray900, fontSize: '0.875rem', fontWeight: 500 }}>
                              {formatCurrency(bill.amount)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>Subtotal</Typography>
                          <Typography sx={{ color: colors.gray900, fontSize: '0.875rem' }}>{formatCurrency(subtotal)}</Typography>
                        </Box>
                        {convenienceFee > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ color: colors.gray500, fontSize: '0.875rem' }}>Card fee (2.5%)</Typography>
                            <Typography sx={{ color: colors.gray900, fontSize: '0.875rem' }}>{formatCurrency(convenienceFee)}</Typography>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '1rem' }}>Total</Typography>
                        <Typography sx={{ fontWeight: 700, color: colors.gray900, fontSize: '1.25rem' }}>{formatCurrency(total)}</Typography>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Receipt sx={{ fontSize: 48, color: colors.gray300, mb: 2 }} />
                      <Typography sx={{ color: colors.gray400 }}>
                        Select bills to pay
                      </Typography>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {activeStep === 2 ? (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmitPayment}
                        disabled={isProcessing || selectedItems.length === 0}
                        aria-label="Submit payment"
                        sx={{
                          py: 1.5,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          bgcolor: isProcessing ? colors.gray400 : colors.green600,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: isProcessing ? colors.gray400 : colors.green700,
                            boxShadow: 'none',
                          },
                          '&:disabled': { bgcolor: colors.gray200 },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isProcessing ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                            <Box sx={{ textAlign: 'left' }}>
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
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleNext}
                        disabled={selectedItems.length === 0}
                        endIcon={<ArrowForward />}
                        aria-label="Continue to next step"
                        sx={{
                          py: 1.5,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          bgcolor: colors.blurple500,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: colors.blurple600,
                            boxShadow: 'none',
                          },
                          '&:disabled': { bgcolor: colors.blurple200 },
                        }}
                      >
                        Continue
                      </Button>
                    )}

                    {activeStep > 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleBack}
                        startIcon={<ArrowBack />}
                        disabled={isProcessing}
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
                        Back
                      </Button>
                    )}

                    {/* Security Badge */}
                    {activeStep === 2 && !isProcessing && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        pt: 2,
                        borderTop: `1px solid ${colors.gray100}`,
                        mt: 1,
                      }}>
                        <Lock sx={{ fontSize: 14, color: colors.gray400 }} />
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                          Secured by 256-bit encryption
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UniversalPaymentEngine;
