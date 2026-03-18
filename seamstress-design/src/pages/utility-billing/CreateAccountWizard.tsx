/**
 * Create New Account Wizard with Validation
 * 5-step process: Enter Address → Add Customer → Configure Account → Assign Services → Review
 *
 * Features:
 * - Real-time address and customer validation
 * - Duplicate service conflict detection
 * - Vertical stepper navigation with progress tracking
 * - Warning system for active accounts at selected address
 *
 * Capital Design System Compliance:
 * - Typography: 1.75rem headers, 1.25rem sections, 0.875rem body
 * - Spacing: 8px grid (MUI spacing units)
 * - Colors: capitalDesignTokens.foundations.colors
 * - Border Radius: 8px inputs, 12px cards, 16px dialogs
 * - Buttons: fontWeight 600, consistent hover states
 *
 * Updated: 2026-01-12
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Switch,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Search,
  PersonAdd,
  Home,
  CheckCircle,
  Warning,
  Block,
  Add,
  Delete,
  InfoOutlined,
  ExpandMore,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useNavigate } from 'react-router-dom';
import type {
  Account,
  Customer,
  ServiceAddress,
  Service,
  CreateAccountFormData,
} from '../../types/utility-billing/ValidationTypes';
import {
  AccountStatus,
  ServiceStatus,
  getAccountStatusColor,
  getServiceStatusColor,
  requiresWarning,
} from '../../types/utility-billing/ValidationTypes';
import {
  mockCustomers,
  mockAccounts,
  searchCustomers,
  searchServiceAddresses,
  validateCustomer,
  validateServiceAddress,
  mockAvailableServices,
} from '../../data/utility-billing/mockValidationData';
import {
  generateServiceAddressNumber,
  generateAccountNumber,
  generateCustomerNumber,
} from '../../utils/numberFormatGenerator';

const colors = capitalDesignTokens.foundations.colors;

const steps = [
  'Enter Address',
  'Add Customer',
  'Configure Account',
  'Assign Services',
  'Review Account',
];

const CreateAccountWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Form data
  const [formData, setFormData] = useState<CreateAccountFormData>({
    accountNumber: '',
    startDate: '',
    accountClass: 'Residential',
    customerId: '',
    customerName: '',
    serviceAddressId: '',
    serviceAddress: '',
    services: [],
    acknowledgedWarnings: false,
  });

  // Account preferences
  const [accountPreferences, setAccountPreferences] = useState({
    noCutoff: false,
    noPenalty: false,
    noPortalAccess: false,
    oneTimeNoBill: false,
  });

  // Bill delivery
  const [billDelivery, setBillDelivery] = useState({
    paperlessAndPrint: false,
    printOnly: false,
    paperlessOnly: false,
  });

  // Search states
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [addressSearchResults, setAddressSearchResults] = useState<ServiceAddress[]>([]);

  // Validation states
  const [customerAccounts, setCustomerAccounts] = useState<Account[]>([]);
  const [addressAccounts, setAddressAccounts] = useState<Account[]>([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Service states
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [expandedService, setExpandedService] = useState<number | null>(0);

  // Dialog states for creating new customer/address
  const [showCreateCustomerDialog, setShowCreateCustomerDialog] = useState(false);
  const [showCreateAddressDialog, setShowCreateAddressDialog] = useState(false);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    customerNumber: generateCustomerNumber('individual'),
    customerType: 'individual' as 'individual' | 'business',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneType: 'mobile',
    phoneNumber: '',
  });

  // New service address form state
  const [newAddress, setNewAddress] = useState({
    serviceAddressNumber: generateServiceAddressNumber(),
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'DE',
    zipCode: '',
    assignLandlord: false,
    landlordCustomerId: '',
    billingCycle: '',
    route: '',
  });

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Clear search results when navigating away from steps
  useEffect(() => {
    if (activeStep !== 0) {
      setAddressSearchResults([]);
      setAddressSearchQuery('');
    }
    if (activeStep !== 1) {
      setCustomerSearchResults([]);
      setCustomerSearchQuery('');
    }
  }, [activeStep]);

  // Auto-generate account number when reaching Configure Account step
  useEffect(() => {
    if (activeStep === 2 && !formData.accountNumber && formData.serviceAddressId) {
      const generatedAccountNumber = generateAccountNumber(
        formData.serviceAddressId,
        '1', // Default billing cycle
        1 // Default resident number
      );
      setFormData(prev => ({ ...prev, accountNumber: generatedAccountNumber }));
    }
  }, [activeStep, formData.serviceAddressId, formData.accountNumber]);

  const handleNext = () => {
    // Step 0: Enter Address
    if (activeStep === 0) {
      if (!formData.serviceAddressId) {
        alert('Please select a service address');
        return;
      }
      // Check if warning is needed before moving to step 1
      const needsWarning = addressAccounts.some(acc => requiresWarning(acc.status));
      if (needsWarning && !formData.acknowledgedWarnings) {
        setShowWarningDialog(true);
        return;
      }
    }

    // Step 1: Add Customer
    if (activeStep === 1) {
      if (!formData.customerId) {
        alert('Please select a customer');
        return;
      }
    }

    // Step 2: Configure Account
    if (activeStep === 2) {
      if (!formData.accountNumber || !formData.startDate) {
        alert('Please fill in all required fields');
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCancel = () => {
    navigate('/billing');
  };

  // Customer search
  const handleCustomerSearch = () => {
    const results = searchCustomers(customerSearchQuery);
    setCustomerSearchResults(results);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customerName: customer.name,
    });
    // Validate customer - show existing accounts
    const accounts = validateCustomer(customer.name);
    setCustomerAccounts(accounts);
    setCustomerSearchResults([]);
    setCustomerSearchQuery('');
  };

  // Service address search
  const handleAddressSearch = () => {
    const results = searchServiceAddresses(addressSearchQuery);
    setAddressSearchResults(results);
  };

  const handleAddressSelect = (address: ServiceAddress) => {
    setFormData({
      ...formData,
      serviceAddressId: address.id,
      serviceAddress: address.address,
    });
    // Validate address - show existing accounts
    const accounts = validateServiceAddress(address.id);
    setAddressAccounts(accounts);
    setAddressSearchResults([]);
    setAddressSearchQuery('');
  };

  // Handle warning acknowledgment
  const handleAcknowledge = () => {
    setFormData({ ...formData, acknowledgedWarnings: true });
    setShowWarningDialog(false);
    setActiveStep(1); // Move to Add Customer step
  };

  // Service assignment
  const handleAddService = () => {
    const newService: Service = {
      id: `temp-${Date.now()}`,
      serviceCode: '',
      serviceName: '',
      rateCode: '',
      rateName: '',
      status: ServiceStatus.New,
      startDate: formData.startDate || '',
      endDate: null,
      meterNumber: '',
      serialNumber: '',
      numberOfUnits: 100,
    };
    setSelectedServices([...selectedServices, newService]);
    setExpandedService(selectedServices.length); // Expand the newly added service
  };

  const handleUpdateService = (index: number, updatedService: Partial<Service>) => {
    const updated = selectedServices.map((s, i) =>
      i === index ? { ...s, ...updatedService } : s
    );
    setSelectedServices(updated);
    setFormData({
      ...formData,
      services: updated,
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
    setFormData({
      ...formData,
      services: formData.services.filter(s => s.id !== serviceId),
    });
  };

  // Handle opening create customer dialog - regenerate customer number
  const handleOpenCreateCustomerDialog = () => {
    setNewCustomer({
      customerNumber: generateCustomerNumber('individual'),
      customerType: 'individual',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phoneType: 'mobile',
      phoneNumber: '',
    });
    setShowCreateCustomerDialog(true);
  };

  // Handle customer type change - regenerate customer number
  const handleCustomerTypeChange = (type: 'individual' | 'business') => {
    setNewCustomer({
      ...newCustomer,
      customerType: type,
      customerNumber: generateCustomerNumber(type),
    });
  };

  // Handle opening create address dialog - regenerate service address number
  const handleOpenCreateAddressDialog = () => {
    setNewAddress({
      serviceAddressNumber: generateServiceAddressNumber(),
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'DE',
      zipCode: '',
      assignLandlord: false,
      landlordCustomerId: '',
      billingCycle: '',
      route: '',
    });
    setShowCreateAddressDialog(true);
  };


  // Check for service conflicts
  const getServiceConflicts = (serviceCode: string, rateCode: string) => {
    const conflicts: Account[] = [];

    for (const account of addressAccounts) {
      for (const service of account.services) {
        if (
          service.serviceCode === serviceCode &&
          service.rateCode === rateCode &&
          (service.status === ServiceStatus.Active || service.status === ServiceStatus.New)
        ) {
          conflicts.push(account);
        }
      }
    }

    return conflicts;
  };

  const isServiceBlocked = (serviceCode: string, rateCode: string): boolean => {
    return getServiceConflicts(serviceCode, rateCode).length > 0;
  };

  // Create account
  const handleCreate = () => {
    alert('Account created successfully!\n\n' + JSON.stringify(formData, null, 2));
    navigate('/billing');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.white, borderBottom: `1px solid ${colors.gray200}`, py: 3, px: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{
              textTransform: 'none',
              color: colors.gray600,
              fontWeight: 500,
              mb: 2,
              '&:hover': { bgcolor: colors.gray50 },
            }}
          >
            Back to Account Manager
          </Button>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900 }}>
            Create New Account
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Vertical Stepper - Left Side */}
          <Box sx={{ width: 280, flexShrink: 0 }}>
            <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 3 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            '&.Mui-active': { color: colors.blurple500 },
                            '&.Mui-completed': { color: colors.green500 },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: activeStep === index ? 600 : 500,
                            color: activeStep === index ? colors.gray900 : colors.gray500,
                            fontSize: '0.875rem',
                          }}
                        >
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Box>

          {/* Step Content - Right Side */}
          <Box sx={{ flex: 1 }}>
            <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Step 0: Enter Service Address */}
                {activeStep === 0 && (
              <Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                  Search for Service Address
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                  Enter address or service address number
                </Typography>

                {/* Address Search */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search by address, and service address number"
                    value={addressSearchQuery}
                    onChange={(e) => {
                      const query = e.target.value;
                      setAddressSearchQuery(query);
                      // Live search as user types
                      const results = searchServiceAddresses(query);
                      setAddressSearchResults(results);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: colors.gray400 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleAddressSearch}
                    sx={{
                      mt: 2,
                      bgcolor: colors.blurple500,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    Search
                  </Button>
                </Box>

                {/* Search Results */}
                {addressSearchResults.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray700 }}>
                        {addressSearchResults.length} {addressSearchResults.length === 1 ? 'Result' : 'Results'} Found
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleOpenCreateAddressDialog}
                        size="small"
                        sx={{
                          textTransform: 'none',
                          borderColor: colors.gray300,
                          color: colors.gray700,
                          borderRadius: '8px',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: colors.blurple500,
                            color: colors.blurple600,
                            bgcolor: colors.blurple50,
                          },
                        }}
                      >
                        New Address
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {addressSearchResults.map((address) => (
                        <Card
                          key={address.id}
                          elevation={0}
                          sx={{
                            border: `2px solid ${colors.gray200}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: colors.blurple500,
                              bgcolor: colors.blurple50,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${colors.blurple500}20`,
                            },
                          }}
                          onClick={() => handleAddressSelect(address)}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '12px',
                                  bgcolor: colors.blurple100,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Home sx={{ color: colors.blurple600, fontSize: 24 }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                                  {address.address}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, fontWeight: 500 }}>
                                      Service Address No.:
                                    </Typography>
                                    <Chip
                                      label={`#${address.serviceAddressNumber}`}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        bgcolor: colors.gray100,
                                        color: colors.gray700,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        '& .MuiChip-label': { px: 1 },
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, fontWeight: 500 }}>
                                      Billing Cycle:
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray700, fontWeight: 600 }}>
                                      {address.billingCycle}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, fontWeight: 500 }}>
                                      Route:
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray700, fontWeight: 600 }}>
                                      {address.route}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <ArrowForward sx={{ color: colors.gray400, fontSize: 20, flexShrink: 0 }} />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Selected Address with Validation */}
                {formData.serviceAddressId && (
                  <Box>
                    {/* Selected Address Card */}
                    <Card
                      elevation={0}
                      sx={{
                        border: `2px solid ${colors.green500}`,
                        borderRadius: '12px',
                        bgcolor: colors.green50,
                        mb: 3,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              bgcolor: colors.green500,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CheckCircle sx={{ color: colors.white, fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.green700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Selected Service Address
                            </Typography>
                            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900 }}>
                              {formData.serviceAddress}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setFormData({ ...formData, serviceAddressId: '', serviceAddress: '' });
                              setAddressAccounts([]);
                            }}
                            sx={{
                              textTransform: 'none',
                              borderColor: colors.gray300,
                              color: colors.gray700,
                              borderRadius: '8px',
                              fontWeight: 500,
                              fontSize: '0.8125rem',
                              '&:hover': {
                                borderColor: colors.gray400,
                                bgcolor: colors.white,
                              },
                            }}
                          >
                            Change
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>

                    {addressAccounts.length > 0 && (
                      <Box>
                        {addressAccounts.some(acc => requiresWarning(acc.status)) && (
                          <Card
                            elevation={0}
                            sx={{
                              border: `2px solid ${colors.orange500}`,
                              borderRadius: '12px',
                              bgcolor: colors.orange50,
                              mb: 3,
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '8px',
                                    bgcolor: colors.orange500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <Warning sx={{ color: colors.white, fontSize: 24 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                                    Active accounts exist at this address
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                                    Ensure services are not duplicated across accounts when creating a new one.
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        )}

                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray700, mb: 2 }}>
                          Existing Accounts at Service Address
                        </Typography>

                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: colors.gray50 }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Account Number
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Customer Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Service Address
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Account Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Services
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {addressAccounts.map((account) => (
                                <TableRow key={account.id} sx={{ '&:hover': { bgcolor: colors.gray50 } }}>
                                  <TableCell sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>
                                    {account.accountNumber}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                                    {account.customerName}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                                    {account.serviceAddress}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={account.status}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getAccountStatusColor(account.status)}20`,
                                        color: getAccountStatusColor(account.status),
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        borderRadius: '6px',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {account.services.map((s, idx) => (
                                      <Chip
                                        key={idx}
                                        label={`${s.serviceName} (${s.status})`}
                                        size="small"
                                        sx={{
                                          mr: 0.5,
                                          mb: 0.5,
                                          bgcolor: `${getServiceStatusColor(s.status)}20`,
                                          color: getServiceStatusColor(s.status),
                                          fontSize: '0.7rem',
                                          fontWeight: 500,
                                          borderRadius: '6px',
                                        }}
                                      />
                                    ))}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Step 1: Add Customer */}
            {activeStep === 1 && (
              <Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                  Search for Customer
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                  Enter customer name or mailing address
                </Typography>

                {/* Customer Search */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search by customer name, and mailing address"
                    value={customerSearchQuery}
                    onChange={(e) => {
                      const query = e.target.value;
                      setCustomerSearchQuery(query);
                      // Live search as user types
                      const results = searchCustomers(query);
                      setCustomerSearchResults(results);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomerSearch()}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: colors.gray400 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleCustomerSearch}
                      sx={{
                        bgcolor: colors.blurple500,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: colors.blurple600 },
                      }}
                    >
                      Search
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      onClick={handleOpenCreateCustomerDialog}
                      sx={{
                        textTransform: 'none',
                        borderColor: colors.blurple500,
                        color: colors.blurple500,
                        borderRadius: '8px',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: colors.blurple600,
                          bgcolor: colors.blurple50,
                        },
                      }}
                    >
                      Create New Customer
                    </Button>
                  </Box>
                </Box>

                {/* Search Results */}
                {customerSearchResults.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray700, mb: 3 }}>
                      {customerSearchResults.length} {customerSearchResults.length === 1 ? 'Result' : 'Results'} Found
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {customerSearchResults.map((customer) => (
                        <Card
                          key={customer.id}
                          elevation={0}
                          sx={{
                            border: `2px solid ${colors.gray200}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: colors.blurple500,
                              bgcolor: colors.blurple50,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${colors.blurple500}20`,
                            },
                          }}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: customer.customerType === 'business' ? colors.cerulean100 : colors.blurple100,
                                  color: customer.customerType === 'business' ? colors.cerulean600 : colors.blurple600,
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                }}
                              >
                                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900 }}>
                                    {customer.name}
                                  </Typography>
                                  <Chip
                                    label={customer.customerType === 'business' ? 'Business' : 'Individual'}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      bgcolor: customer.customerType === 'business' ? colors.cerulean100 : colors.blurple100,
                                      color: customer.customerType === 'business' ? colors.cerulean700 : colors.blurple700,
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      '& .MuiChip-label': { px: 1 },
                                    }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray500, fontWeight: 500 }}>
                                      Customer No.:
                                    </Typography>
                                    <Chip
                                      label={customer.customerNumber}
                                      size="small"
                                      sx={{
                                        height: 18,
                                        bgcolor: colors.gray100,
                                        color: colors.gray700,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        '& .MuiChip-label': { px: 1 },
                                      }}
                                    />
                                  </Box>
                                  {customer.mailingAddress && (
                                    <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>
                                      {customer.mailingAddress}
                                    </Typography>
                                  )}
                                  {customer.email && (
                                    <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>
                                      {customer.email}
                                    </Typography>
                                  )}
                                  {customer.attributes && customer.attributes.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                      {customer.attributes.map((attr, idx) => (
                                        <Chip
                                          key={idx}
                                          label={attr}
                                          size="small"
                                          sx={{
                                            height: 18,
                                            bgcolor: colors.green100,
                                            color: colors.green700,
                                            fontSize: '0.7rem',
                                            fontWeight: 500,
                                            '& .MuiChip-label': { px: 1 },
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              <ArrowForward sx={{ color: colors.gray400, fontSize: 20, flexShrink: 0 }} />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* No Results */}
                {customerSearchQuery && customerSearchResults.length === 0 && !formData.customerId && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      px: 4,
                      bgcolor: colors.gray50,
                      borderRadius: '12px',
                      border: `1px solid ${colors.gray200}`,
                    }}
                  >
                    <Search sx={{ fontSize: 64, color: colors.gray300, mb: 2 }} />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray700, mb: 1 }}>
                      No Results Found
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                      Please try entering a different search term or create a new customer
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={handleOpenCreateCustomerDialog}
                      sx={{
                        bgcolor: colors.blurple500,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 3,
                        py: 1,
                        '&:hover': { bgcolor: colors.blurple600 },
                      }}
                    >
                      Create New Customer
                    </Button>
                  </Box>
                )}

                {/* Selected Customer with Validation Results */}
                {formData.customerId && (
                  <Box>
                    {/* Selected Customer Card */}
                    <Card
                      elevation={0}
                      sx={{
                        border: `2px solid ${colors.green500}`,
                        borderRadius: '12px',
                        bgcolor: colors.green50,
                        mb: 3,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              bgcolor: colors.green500,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CheckCircle sx={{ color: colors.white, fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.green700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Selected Customer
                            </Typography>
                            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900 }}>
                              {formData.customerName}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setFormData({ ...formData, customerId: '', customerName: '' });
                              setCustomerAccounts([]);
                            }}
                            sx={{
                              textTransform: 'none',
                              borderColor: colors.gray300,
                              color: colors.gray700,
                              borderRadius: '8px',
                              fontWeight: 500,
                              fontSize: '0.8125rem',
                              '&:hover': {
                                borderColor: colors.gray400,
                                bgcolor: colors.white,
                              },
                            }}
                          >
                            Change
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>

                    {customerAccounts.length > 0 && (
                      <Box>
                        <Card
                          elevation={0}
                          sx={{
                            border: `2px solid ${colors.cerulean500}`,
                            borderRadius: '12px',
                            bgcolor: colors.cerulean50,
                            mb: 3,
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '8px',
                                  bgcolor: colors.cerulean500,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <InfoOutlined sx={{ color: colors.white, fontSize: 24 }} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                                  This customer has {customerAccounts.length} existing account{customerAccounts.length > 1 ? 's' : ''}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray700 }}>
                                  Review to ensure no duplicate services are being created.
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>

                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: colors.gray50 }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Account Number
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Customer Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Service Address
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Account Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray700, py: 1.5 }}>
                                  Account Balance
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {customerAccounts.map((account) => (
                                <TableRow key={account.id} sx={{ '&:hover': { bgcolor: colors.gray50 } }}>
                                  <TableCell sx={{ fontWeight: 600, color: colors.gray900, fontSize: '0.875rem' }}>
                                    {account.accountNumber}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                                    {account.customerName}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                                    {account.serviceAddress}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={account.status}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getAccountStatusColor(account.status)}20`,
                                        color: getAccountStatusColor(account.status),
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        borderRadius: '6px',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.gray900 }}>
                                    {formatCurrency(account.balance)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Step 2: Configure Account */}
            {activeStep === 2 && (
              <Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                  Configure Account
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                  All fields with an * are required
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                  <TextField
                    label="Account Number *"
                    placeholder="Ea. 1234567"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true,
                        sx: { bgcolor: colors.gray50 }
                      },
                    }}
                    helperText="Auto-generated from service address"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />

                  <TextField
                    label="Start Date *"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>

                {/* Account Preferences */}
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                    Account Preferences
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accountPreferences.noCutoff}
                          onChange={(e) => setAccountPreferences({ ...accountPreferences, noCutoff: e.target.checked })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="No Cutoff"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accountPreferences.noPenalty}
                          onChange={(e) => setAccountPreferences({ ...accountPreferences, noPenalty: e.target.checked })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="No Penalty"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accountPreferences.noPortalAccess}
                          onChange={(e) => setAccountPreferences({ ...accountPreferences, noPortalAccess: e.target.checked })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="No Portal Access"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accountPreferences.oneTimeNoBill}
                          onChange={(e) => setAccountPreferences({ ...accountPreferences, oneTimeNoBill: e.target.checked })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="One time no bill"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                  </Box>
                </Box>

                {/* Bill Delivery */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                    Bill Delivery
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={billDelivery.paperlessAndPrint}
                          onChange={(e) => setBillDelivery({ paperlessAndPrint: e.target.checked, printOnly: false, paperlessOnly: false })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="Paperless and Print"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={billDelivery.printOnly}
                          onChange={(e) => setBillDelivery({ paperlessAndPrint: false, printOnly: e.target.checked, paperlessOnly: false })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="Print Only"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={billDelivery.paperlessOnly}
                          onChange={(e) => setBillDelivery({ paperlessAndPrint: false, printOnly: false, paperlessOnly: e.target.checked })}
                          sx={{
                            color: colors.gray400,
                            '&.Mui-checked': { color: colors.blurple500 },
                          }}
                        />
                      }
                      label="Paperless Only"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Step 3: Assign Services */}
            {activeStep === 3 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                      Assign Services
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                      All fields with an * are required
                    </Typography>
                  </Box>
                  {selectedServices.length > 0 && (
                    <Button
                      variant="text"
                      onClick={() => setSelectedServices([])}
                      sx={{
                        textTransform: 'none',
                        color: colors.blurple600,
                        fontSize: '0.875rem',
                      }}
                    >
                      Skip Services →
                    </Button>
                  )}
                </Box>

                {/* Services List */}
                {selectedServices.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      border: `2px dashed ${colors.gray300}`,
                      borderRadius: '12px',
                      mb: 3,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 2 }}>
                      No services added yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddService}
                      sx={{
                        bgcolor: colors.blurple500,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: colors.blurple600 },
                      }}
                    >
                      Add Service
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    {/* Service Accordions */}
                    {selectedServices.map((service, index) => {
                      const isMetered = service.serviceCode === 'WATER' || service.serviceCode === 'SEWER';

                      return (
                        <Accordion
                          key={service.id}
                          expanded={expandedService === index}
                          onChange={(_, isExpanded) => setExpandedService(isExpanded ? index : null)}
                          elevation={0}
                          sx={{
                            border: `1px solid ${colors.gray200}`,
                            borderRadius: '8px !important',
                            mb: 2,
                            '&:before': { display: 'none' },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{
                              '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
                            }}
                          >
                            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900 }}>
                              Service {index + 1}
                            </Typography>
                            {service.serviceName && (
                              <Chip
                                label={service.serviceName}
                                size="small"
                                sx={{
                                  bgcolor: colors.blurple100,
                                  color: colors.blurple700,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box>
                              {/* Header with Remove Button */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography sx={{ fontSize: '0.875rem', color: colors.gray600 }}>
                                  Add a service to the account
                                </Typography>
                                <Button
                                  startIcon={<Delete />}
                                  onClick={() => handleRemoveService(service.id)}
                                  sx={{
                                    textTransform: 'none',
                                    color: colors.red500,
                                    fontSize: '0.875rem',
                                    '&:hover': { bgcolor: colors.red50 },
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>

                              {/* Service and Rate Code Row */}
                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <FormControl fullWidth size="small">
                                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray900, mb: 1 }}>
                                    Service *
                                  </Typography>
                                  <Select
                                    value={service.serviceCode}
                                    onChange={(e) => {
                                      const selectedService = mockAvailableServices.find(s => s.serviceCode === e.target.value);
                                      if (selectedService) {
                                        handleUpdateService(index, {
                                          serviceCode: selectedService.serviceCode,
                                          serviceName: selectedService.serviceName,
                                          rateCode: selectedService.rateCode,
                                          rateName: selectedService.rateName,
                                        });
                                      }
                                    }}
                                    displayEmpty
                                    sx={{ borderRadius: '8px' }}
                                  >
                                    <MenuItem value="">Select a service</MenuItem>
                                    {mockAvailableServices.map((s) => (
                                      <MenuItem key={s.serviceCode} value={s.serviceCode}>
                                        {s.serviceName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray900, mb: 1 }}>
                                    Rate Code *
                                  </Typography>
                                  <Select
                                    value={service.rateCode}
                                    onChange={(e) => handleUpdateService(index, { rateCode: e.target.value, rateName: e.target.value === 'RES' ? 'Residential' : 'Commercial' })}
                                    displayEmpty
                                    sx={{ borderRadius: '8px' }}
                                  >
                                    <MenuItem value="">Select a rate code</MenuItem>
                                    <MenuItem value="RES">Residential</MenuItem>
                                    <MenuItem value="COM">Commercial</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>

                              {/* Start Date and End Date Toggle */}
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
                                <TextField
                                  label="Start Date *"
                                  type="date"
                                  size="small"
                                  value={service.startDate || ''}
                                  onChange={(e) => handleUpdateService(index, { startDate: e.target.value })}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={!!service.endDate}
                                      onChange={(e) => handleUpdateService(index, { endDate: e.target.checked ? '' : null })}
                                      sx={{
                                        color: colors.gray400,
                                        '&.Mui-checked': { color: colors.blurple500 },
                                      }}
                                    />
                                  }
                                  label="Add End Date"
                                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: colors.gray700 } }}
                                />
                              </Box>

                              {/* Number of Units */}
                              <TextField
                                label="Number of Units *"
                                type="number"
                                size="small"
                                value={service.numberOfUnits || 100}
                                onChange={(e) => handleUpdateService(index, { numberOfUnits: parseInt(e.target.value) || 0 })}
                                fullWidth
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                              />

                              {/* Fixed Amount and Tax Exempt % */}
                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <TextField
                                  label="Fixed Amount"
                                  placeholder="Enter amount"
                                  size="small"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                                <TextField
                                  label="Tax Exempt %"
                                  placeholder="0.00"
                                  size="small"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                              </Box>

                              {/* Meter Information - Only for Water/Sewer */}
                              {isMetered && (
                                <Box>
                                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                                    Meter Information
                                  </Typography>
                                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                    <FormControl fullWidth size="small">
                                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray900, mb: 1 }}>
                                        Meter Number *
                                      </Typography>
                                      <Select
                                        value={service.meterNumber || ''}
                                        onChange={(e) => handleUpdateService(index, { meterNumber: e.target.value })}
                                        displayEmpty
                                        sx={{ borderRadius: '8px' }}
                                      >
                                        <MenuItem value="">Select a Meter</MenuItem>
                                        <MenuItem value="MTR-001">MTR-001</MenuItem>
                                        <MenuItem value="MTR-002">MTR-002</MenuItem>
                                        <MenuItem value="MTR-003">MTR-003</MenuItem>
                                      </Select>
                                    </FormControl>

                                    <TextField
                                      label="Serial Number"
                                      placeholder="Enter serial number"
                                      size="small"
                                      value={service.serialNumber || ''}
                                      onChange={(e) => handleUpdateService(index, { serialNumber: e.target.value })}
                                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}

                    {/* Add Another Service Button */}
                    <Button
                      variant="text"
                      startIcon={<Add />}
                      onClick={handleAddService}
                      sx={{
                        color: colors.blurple600,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        mt: 2,
                      }}
                    >
                      Add Another Service
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Step 5: Review Account */}
            {activeStep === 4 && (
              <Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                  Review Account
                </Typography>

                {/* Account Information */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                      Account Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                          Account Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                          {formData.accountNumber}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                          Start Date
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                          {formatDate(formData.startDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.gray500, mb: 0.5 }}>
                          Account Class
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                          {formData.accountClass}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Customer */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                      Customer
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                      {formData.customerName}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Service Address */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                      Service Address
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                      {formData.serviceAddress}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                      Services ({formData.services.length})
                    </Typography>
                    {formData.services.map((service, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 1.5,
                          borderBottom: idx < formData.services.length - 1 ? `1px solid ${colors.gray200}` : 'none',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                          {service.serviceName} - {service.rateName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.gray600 }}>
                          Start: {service.startDate ? formatDate(service.startDate) : 'Not set'}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              textTransform: 'none',
              borderColor: colors.gray300,
              color: colors.gray700,
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{
                  textTransform: 'none',
                  borderColor: colors.gray300,
                  color: colors.gray700,
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !formData.serviceAddressId) ||
                  (activeStep === 1 && !formData.customerId) ||
                  (activeStep === 2 && (!formData.accountNumber || !formData.startDate))
                }
                sx={{
                  textTransform: 'none',
                  bgcolor: colors.blurple500,
                  borderRadius: '8px',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': { bgcolor: colors.blurple600 },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleCreate}
                sx={{
                  textTransform: 'none',
                  bgcolor: colors.green500,
                  borderRadius: '8px',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': { bgcolor: colors.green600 },
                }}
              >
                Create Account
              </Button>
            )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Warning Dialog */}
      <Dialog
        open={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ fontSize: 32, color: colors.orange500 }} />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Duplicate Service Warning
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              borderRadius: '8px',
              '& .MuiAlert-message': { fontSize: '0.875rem' },
            }}
          >
            An active account exists at this service address. The same service/rate cannot
            be billed to 2 different accounts at the same service address.
          </Alert>
          <Typography sx={{ mb: 2, fontSize: '0.875rem', color: colors.gray700 }}>
            Please review the existing accounts and services carefully before proceeding.
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray700, mb: 1 }}>
            Existing accounts at this address:
          </Typography>
          <List dense>
            {addressAccounts
              .filter(acc => requiresWarning(acc.status))
              .map((acc) => (
                <ListItem key={acc.id}>
                  <ListItemText
                    primary={`Account ${acc.accountNumber} - ${acc.customerName}`}
                    secondary={`Status: ${acc.status} | Services: ${acc.services.map(s => s.serviceName).join(', ')}`}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.gray900,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.8125rem',
                      color: colors.gray600,
                    }}
                  />
                </ListItem>
              ))}
          </List>
          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
              />
            }
            label="I understand and acknowledge this warning"
            sx={{
              mt: 2,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                color: colors.gray700,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setShowWarningDialog(false);
              setAcknowledged(false);
            }}
            sx={{ textTransform: 'none', color: colors.gray600 }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleAcknowledge}
            disabled={!acknowledged}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: colors.orange500,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.orange600 },
            }}
          >
            Continue Anyway
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog
        open={showCreateCustomerDialog}
        onClose={() => setShowCreateCustomerDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Add A Customer
            </Typography>
            <IconButton onClick={() => setShowCreateCustomerDialog(false)} size="small">
              <Delete sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Customer Information */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
              Customer Information
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
              All fields with an * are required
            </Typography>

            <TextField
              label="Customer Number *"
              placeholder="XX-XXXX-XXXX"
              value={newCustomer.customerNumber}
              onChange={(e) => setNewCustomer({ ...newCustomer, customerNumber: e.target.value })}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { bgcolor: colors.gray50 }
                },
              }}
              helperText="Auto-generated based on customer type"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Customer Type
              </FormLabel>
              <RadioGroup
                row
                value={newCustomer.customerType}
                onChange={(e) => handleCustomerTypeChange(e.target.value as 'individual' | 'business')}
              >
                <FormControlLabel
                  value="individual"
                  control={<Radio />}
                  label="Individual"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                <FormControlLabel
                  value="business"
                  control={<Radio />}
                  label="Business"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
              <TextField
                label="First Name *"
                placeholder="Enter first name"
                value={newCustomer.firstName}
                onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField
                label="Last Name *"
                placeholder="Enter last name"
                value={newCustomer.lastName}
                onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <TextField
              label="Date of Birth"
              type="date"
              value={newCustomer.dateOfBirth}
              onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          {/* Contact Information */}
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
              Contact Information
            </Typography>

            <TextField
              label="Email"
              placeholder="Enter email"
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700, mb: 1 }}>
                  Phone Type
                </Typography>
                <Select
                  value={newCustomer.phoneType}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phoneType: e.target.value })}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Phone Number"
                placeholder="Enter phone number"
                value={newCustomer.phoneNumber}
                onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowCreateCustomerDialog(false)}
            sx={{ textTransform: 'none', color: colors.gray600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Create new customer logic here
              alert('Customer created: ' + newCustomer.firstName + ' ' + newCustomer.lastName);
              setShowCreateCustomerDialog(false);
            }}
            sx={{
              textTransform: 'none',
              bgcolor: colors.blurple500,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.blurple600 },
            }}
          >
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Service Address Dialog */}
      <Dialog
        open={showCreateAddressDialog}
        onClose={() => setShowCreateAddressDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Create Service Address
          </Typography>
        </DialogTitle>
        <DialogContent>
          {/* Address Section */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
              Address
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
              All fields with an * are required
            </Typography>

            <TextField
              label="Service Address Number *"
              placeholder="123456"
              value={newAddress.serviceAddressNumber}
              onChange={(e) => setNewAddress({ ...newAddress, serviceAddressNumber: e.target.value })}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { bgcolor: colors.gray50 }
                },
              }}
              helperText="Auto-generated sequential number"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <TextField
              label="Address Line 1 *"
              placeholder="896 Main Street"
              value={newAddress.addressLine1}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <TextField
              label="Address Line 2"
              placeholder="Enter address"
              value={newAddress.addressLine2}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2, mb: 3 }}>
              <TextField
                label="City *"
                placeholder="Newark"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700, mb: 1 }}>
                  State *
                </Typography>
                <Select
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="DE">DE - Delaware</MenuItem>
                  <MenuItem value="MD">MD - Maryland</MenuItem>
                  <MenuItem value="PA">PA - Pennsylvania</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Zip Code *"
                placeholder="19713"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={newAddress.assignLandlord}
                  onChange={(e) => setNewAddress({ ...newAddress, assignLandlord: e.target.checked })}
                />
              }
              label="Assign Landlord"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
          </Box>

          {/* Landlord Section (conditional) */}
          {newAddress.assignLandlord && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Landlord
              </Typography>
              <TextField
                label="Customer Name"
                placeholder="Austin Brown"
                value={newAddress.landlordCustomerId}
                onChange={(e) => setNewAddress({ ...newAddress, landlordCustomerId: e.target.value })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                helperText="Mailing Address: 896 Main St, Newark, DE"
              />
            </Box>
          )}

          {/* Billing Information */}
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
              Billing Information
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
              All fields with an * are required
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700, mb: 1 }}>
                  Billing Cycle *
                </Typography>
                <Select
                  value={newAddress.billingCycle}
                  onChange={(e) => setNewAddress({ ...newAddress, billingCycle: e.target.value })}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="">Select a cycle</MenuItem>
                  <MenuItem value="Cycle 1">Cycle 1</MenuItem>
                  <MenuItem value="Cycle 2">Cycle 2</MenuItem>
                  <MenuItem value="Cycle 3">Cycle 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700, mb: 1 }}>
                  Route *
                </Typography>
                <Select
                  value={newAddress.route}
                  onChange={(e) => setNewAddress({ ...newAddress, route: e.target.value })}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="">Select a route</MenuItem>
                  <MenuItem value="Route 1">Route 1</MenuItem>
                  <MenuItem value="Route 2">Route 2</MenuItem>
                  <MenuItem value="Route 3">Route 3</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowCreateAddressDialog(false)}
            sx={{ textTransform: 'none', color: colors.gray600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Create new address logic here
              alert('Address created: ' + newAddress.addressLine1 + ', ' + newAddress.city);
              setShowCreateAddressDialog(false);
            }}
            sx={{
              textTransform: 'none',
              bgcolor: colors.blurple500,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.blurple600 },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateAccountWizard;
