/**
 * UB Account Validation Page
 * Utility Billing account validation and verification interface
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Warning,
  AccountBalance,
  Home,
  Business,
  Person,
  Email,
  Phone,
  LocationOn,
  Description,
  ArrowForward,
  ArrowBack,
  Verified,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const colors = capitalDesignTokens.foundations.colors;

const steps = ['Search Account', 'Verify Information', 'Validation Complete'];

interface AccountData {
  accountNumber: string;
  accountType: 'residential' | 'commercial';
  name: string;
  address: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  balance: number;
  lastPayment: string;
}

const mockAccountData: AccountData = {
  accountNumber: 'UTL-23-4957340',
  accountType: 'residential',
  name: 'Paul Atreides',
  address: '123 Main Street, Cloud City, ST 12345',
  email: 'paul.atreides@example.com',
  phone: '(555) 123-4567',
  status: 'active',
  balance: 133.00,
  lastPayment: '2025-03-15',
};

const AccountValidationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'account' | 'address' | 'name'>('account');
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [validationMethod, setValidationMethod] = useState<'email' | 'phone' | 'document'>('email');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setAccountData(mockAccountData);
      setIsSearching(false);
      setActiveStep(1);
    }, 1500);
  };

  const handleVerify = () => {
    // Simulate verification
    setTimeout(() => {
      setActiveStep(2);
    }, 1000);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSearchValue('');
    setAccountData(null);
    setVerificationCode('');
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.white, borderBottom: `1px solid ${colors.gray200}`, py: 3, px: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
            Account Validation
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: colors.gray500 }}>
            Verify and validate utility billing accounts
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 4 }}>
        {/* Stepper */}
        <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step 1: Search Account */}
        {activeStep === 0 && (
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: colors.blurple100, color: colors.blurple600, width: 48, height: 48 }}>
                  <Search sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900 }}>
                    Search for Account
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                    Enter account number, address, or customer name
                  </Typography>
                </Box>
              </Box>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray700, mb: 1 }}>
                  Search By
                </FormLabel>
                <RadioGroup
                  row
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'account' | 'address' | 'name')}
                >
                  <FormControlLabel
                    value="account"
                    control={<Radio />}
                    label="Account Number"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                  <FormControlLabel
                    value="address"
                    control={<Radio />}
                    label="Service Address"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                  <FormControlLabel
                    value="name"
                    control={<Radio />}
                    label="Customer Name"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                placeholder={
                  searchType === 'account'
                    ? 'Enter account number (e.g., UTL-23-4957340)'
                    : searchType === 'address'
                      ? 'Enter service address'
                      : 'Enter customer name'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              {isSearching && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress sx={{ borderRadius: 2 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mt: 1, textAlign: 'center' }}>
                    Searching for account...
                  </Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={!searchValue.trim() || isSearching}
                sx={{
                  bgcolor: colors.blurple500,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  py: 1.5,
                  '&:hover': { bgcolor: colors.blurple600 },
                }}
              >
                Search Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verify Information */}
        {activeStep === 1 && accountData && (
          <Box sx={{ display: 'grid', gap: 3 }}>
            {/* Account Information Card */}
            <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: colors.green100, color: colors.green600, width: 48, height: 48 }}>
                    <CheckCircle sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900 }}>
                      Account Found
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                      Verify the information below
                    </Typography>
                  </Box>
                  <Chip
                    icon={accountData.accountType === 'residential' ? <Home sx={{ fontSize: 16 }} /> : <Business sx={{ fontSize: 16 }} />}
                    label={accountData.accountType === 'residential' ? 'Residential' : 'Commercial'}
                    sx={{
                      bgcolor: colors.cerulean50,
                      color: colors.cerulean700,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      ACCOUNT NUMBER
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>
                      {accountData.accountNumber}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      ACCOUNT STATUS
                    </Typography>
                    <Chip
                      label={accountData.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: accountData.status === 'active' ? colors.green500 : colors.gray400,
                        color: colors.white,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      CUSTOMER NAME
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: colors.gray400 }} />
                      <Typography sx={{ fontSize: '1rem', color: colors.gray900 }}>
                        {accountData.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      CURRENT BALANCE
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>
                      {formatCurrency(accountData.balance)}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      SERVICE ADDRESS
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 18, color: colors.gray400 }} />
                      <Typography sx={{ fontSize: '1rem', color: colors.gray900 }}>
                        {accountData.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      EMAIL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 18, color: colors.gray400 }} />
                      <Typography sx={{ fontSize: '1rem', color: colors.gray900 }}>
                        {accountData.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                      PHONE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ fontSize: 18, color: colors.gray400 }} />
                      <Typography sx={{ fontSize: '1rem', color: colors.gray900 }}>
                        {accountData.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Verification Method Card */}
            <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                  Choose Verification Method
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <RadioGroup
                    value={validationMethod}
                    onChange={(e) => setValidationMethod(e.target.value as 'email' | 'phone' | 'document')}
                  >
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 20, color: colors.gray500 }} />
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: colors.gray900 }}>
                              Email Verification
                            </Typography>
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                              Send verification code to {accountData.email}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ p: 2, border: `1px solid ${colors.gray200}`, borderRadius: '8px', mb: 2, '&:hover': { bgcolor: colors.gray50 } }}
                    />
                    <FormControlLabel
                      value="phone"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 20, color: colors.gray500 }} />
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: colors.gray900 }}>
                              SMS Verification
                            </Typography>
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                              Send verification code to {accountData.phone}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ p: 2, border: `1px solid ${colors.gray200}`, borderRadius: '8px', mb: 2, '&:hover': { bgcolor: colors.gray50 } }}
                    />
                    <FormControlLabel
                      value="document"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Description sx={{ fontSize: 20, color: colors.gray500 }} />
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: colors.gray900 }}>
                              Document Verification
                            </Typography>
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                              Upload proof of account ownership
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ p: 2, border: `1px solid ${colors.gray200}`, borderRadius: '8px', '&:hover': { bgcolor: colors.gray50 } }}
                    />
                  </RadioGroup>
                </FormControl>

                {validationMethod !== 'document' && (
                  <TextField
                    fullWidth
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setActiveStep(0)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '8px',
                      borderColor: colors.gray300,
                      color: colors.gray700,
                      '&:hover': { bgcolor: colors.gray50 },
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleVerify}
                    disabled={validationMethod !== 'document' && verificationCode.length !== 6}
                    sx={{
                      bgcolor: colors.blurple500,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '8px',
                      py: 1.5,
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    Verify Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Step 3: Validation Complete */}
        {activeStep === 2 && accountData && (
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: colors.green500, width: 80, height: 80, mx: 'auto', mb: 3 }}>
                <Verified sx={{ fontSize: 48, color: colors.white }} />
              </Avatar>

              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>
                Account Validated Successfully
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: colors.gray500, mb: 4 }}>
                Account {accountData.accountNumber} has been verified and validated
              </Typography>

              <Alert severity="success" sx={{ mb: 4, borderRadius: '8px' }}>
                The account is now verified and ready for use. All account information has been confirmed.
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    borderColor: colors.gray300,
                    color: colors.gray700,
                    '&:hover': { bgcolor: colors.gray50 },
                  }}
                >
                  Validate Another Account
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: colors.blurple500,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: colors.blurple600 },
                  }}
                >
                  View Account Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AccountValidationPage;
