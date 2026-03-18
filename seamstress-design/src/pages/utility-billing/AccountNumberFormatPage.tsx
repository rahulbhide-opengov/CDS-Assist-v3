// React imports
import React, { useState, useEffect } from 'react';

// OpenGov component imports
import { PageHeaderComposable } from '@opengov/components-page-header';

// MUI imports
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  HelpOutline as HelpCircle,
} from '@mui/icons-material';

// Local imports
import { pageStyles } from '../../theme/pageStyles';
import { TabPanel, a11yProps } from './AccountNumberFormat/TabPanel';
import { ViewFormatSection } from './AccountNumberFormat/ViewFormatSection';
import { FormatSection } from './AccountNumberFormat/FormatSection';
import { validateFormatConfig, isDeepEqual } from './AccountNumberFormat/validation';
import {
  ServiceAddressSegment,
  AccountSegment,
  CustomerSegment,
  FormatConfig,
  FIELD_CONSTRAINTS,
} from './AccountNumberFormat/types';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const AccountNumberFormatPage: React.FC = () => {

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Track changes per format
  const [serviceAddressHasChanges, setServiceAddressHasChanges] = useState(false);
  const [accountHasChanges, setAccountHasChanges] = useState(false);
  const [customerHasChanges, setCustomerHasChanges] = useState(false);

  // Track edit/view mode per format (true = view mode, false = edit mode)
  const [accountInViewMode, setAccountInViewMode] = useState(false);
  const [customerInViewMode, setCustomerInViewMode] = useState(false);
  const [serviceAddressInViewMode, setServiceAddressInViewMode] = useState(false);

  // Tab state - Account is first (index 0)
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Improve keyboard accessibility by focusing main content after tab change
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }, 100);
  };

  // Service Address Number Format
  const [serviceAddressConfig, setServiceAddressConfig] = useState<FormatConfig<ServiceAddressSegment>>({
    characterLimit: FIELD_CONSTRAINTS.SERVICE_ADDRESS_CHAR_LIMIT,
    delimiter: 'none',
    segments: [
      {
        id: 'sa_segment_1',
        name: '',
        code: '',
        type: 'route',
      },
    ],
  });

  // Account Number Format
  const [accountConfig, setAccountConfig] = useState<FormatConfig<AccountSegment>>({
    characterLimit: FIELD_CONSTRAINTS.ACCOUNT_CHAR_LIMIT,
    delimiter: 'none',
    segments: [
      {
        id: 'ac_segment_1',
        name: '',
        code: '',
        type: 'service_address',
      },
    ],
  });

  // Customer Number Format
  const [customerConfig, setCustomerConfig] = useState<FormatConfig<CustomerSegment>>({
    characterLimit: FIELD_CONSTRAINTS.CUSTOMER_CHAR_LIMIT,
    delimiter: 'none',
    segments: [
      {
        id: 'cu_segment_1',
        name: '',
        code: '',
        type: 'sequential_id',
      },
    ],
  });

  const [originalConfigs, setOriginalConfigs] = useState({
    serviceAddress: serviceAddressConfig,
    account: accountConfig,
    customer: customerConfig,
  });

  // Segment options
  const serviceAddressOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
  ];

  const accountOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
    { value: 'service_address', label: 'Service Address Number' },
    { value: 'resident_number', label: 'Resident Number' },
  ];

  const customerOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
  ];

  // Simulate loading existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOriginalConfigs({
          serviceAddress: serviceAddressConfig,
          account: accountConfig,
          customer: customerConfig,
        });
      } catch (err) {
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // Track changes per format
  useEffect(() => {
    setServiceAddressHasChanges(!isDeepEqual(serviceAddressConfig, originalConfigs.serviceAddress));
  }, [serviceAddressConfig, originalConfigs.serviceAddress]);

  useEffect(() => {
    setAccountHasChanges(!isDeepEqual(accountConfig, originalConfigs.account));
  }, [accountConfig, originalConfigs.account]);

  useEffect(() => {
    setCustomerHasChanges(!isDeepEqual(customerConfig, originalConfigs.customer));
  }, [customerConfig, originalConfigs.customer]);

  const handleSave = async (tabIndex: number) => {
    setSavingTab(tabIndex);
    setError(null);

    try {
      let validationErrors: string[] = [];
      let formatName = '';
      let config: FormatConfig<AccountSegment> | FormatConfig<CustomerSegment> | FormatConfig<ServiceAddressSegment> | null = null;
      let configKey: 'serviceAddress' | 'account' | 'customer' = 'account';

      // Determine which format to save
      if (tabIndex === 0) {
        formatName = 'Account Number';
        config = accountConfig;
        configKey = 'account';
        validationErrors = validateFormatConfig(accountConfig, formatName);
      } else if (tabIndex === 1) {
        formatName = 'Customer Number';
        config = customerConfig;
        configKey = 'customer';
        validationErrors = validateFormatConfig(customerConfig, formatName);
      } else if (tabIndex === 2) {
        formatName = 'Service Address';
        config = serviceAddressConfig;
        configKey = 'serviceAddress';
        validationErrors = validateFormatConfig(serviceAddressConfig, formatName);
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update only the saved format's original config
      setOriginalConfigs(prev => ({
        ...prev,
        [configKey]: config,
      }));

      // Reset the change flag for this format and switch to view mode
      if (tabIndex === 0) {
        setAccountHasChanges(false);
        setAccountInViewMode(true);
      } else if (tabIndex === 1) {
        setCustomerHasChanges(false);
        setCustomerInViewMode(true);
      } else if (tabIndex === 2) {
        setServiceAddressHasChanges(false);
        setServiceAddressInViewMode(true);
      }

      // Set success message
      setSuccessMessage(`Your ${formatName.toLowerCase()} number format has been saved`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
    } finally {
      setSavingTab(null);
    }
  };

  const handleCancel = (tabIndex: number) => {
    let hasChanges = false;
    let config: FormatConfig<AccountSegment> | FormatConfig<CustomerSegment> | FormatConfig<ServiceAddressSegment> | null = null;
    let setConfig: React.Dispatch<React.SetStateAction<FormatConfig<AccountSegment>>> | React.Dispatch<React.SetStateAction<FormatConfig<CustomerSegment>>> | React.Dispatch<React.SetStateAction<FormatConfig<ServiceAddressSegment>>> | null = null;
    let setHasChangesFlag: React.Dispatch<React.SetStateAction<boolean>> | null = null;

    // Determine which format to cancel
    if (tabIndex === 0) {
      hasChanges = accountHasChanges;
      config = originalConfigs.account;
      setConfig = setAccountConfig;
      setHasChangesFlag = setAccountHasChanges;
    } else if (tabIndex === 1) {
      hasChanges = customerHasChanges;
      config = originalConfigs.customer;
      setConfig = setCustomerConfig;
      setHasChangesFlag = setCustomerHasChanges;
    } else if (tabIndex === 2) {
      hasChanges = serviceAddressHasChanges;
      config = originalConfigs.serviceAddress;
      setConfig = setServiceAddressConfig;
      setHasChangesFlag = setServiceAddressHasChanges;
    }

    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmed) return;

      // Revert to original config
      setConfig(config);
      setHasChangesFlag(false);
    }
  };

  // Handle edit mode toggle
  const handleEdit = (tabIndex: number) => {
    if (tabIndex === 0) {
      setAccountInViewMode(false);
    } else if (tabIndex === 1) {
      setCustomerInViewMode(false);
    } else if (tabIndex === 2) {
      setServiceAddressInViewMode(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasChanges = activeTab === 0 ? accountHasChanges :
                         activeTab === 1 ? customerHasChanges :
                         serviceAddressHasChanges;
      const isSaving = savingTab !== null;

      // Cmd/Ctrl + S to save current tab
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (hasChanges && !isSaving) {
          handleSave(activeTab);
        }
      }
      // Escape to cancel current tab
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel(activeTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, accountHasChanges, customerHasChanges, serviceAddressHasChanges, savingTab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={pageStyles.formView.pageContainer}>
      {/* Skip to main content link for keyboard users */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1rem',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          '&:focus': {
            left: '1rem',
            top: '1rem',
          },
        }}
      >
        Skip to main content
      </Box>

      {/* Page Header */}
      <PageHeaderComposable sx={{ pb: 0, mb: 0 }}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              {
                path: '/billing/dashboard',
                title: 'Billing',
              },
              {
                path: '/billing/admin',
                title: 'Administration',
              },
              { title: 'Account Number Format' },
            ]}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 700 }}>
              Number Format Builder
            </Typography>
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Keyboard Shortcuts
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
                    <li>
                      <Typography variant="caption">
                        <strong>Tab</strong> - Navigate between fields
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="caption">
                        <strong>Shift + Tab</strong> - Navigate backwards
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="caption">
                        <strong>Arrow Keys</strong> - Navigate between tabs
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="caption">
                        <strong>Cmd/Ctrl + S</strong> - Save changes
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="caption">
                        <strong>Esc</strong> - Cancel changes
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="caption">
                        <strong>Enter/Space</strong> - Activate buttons
                      </Typography>
                    </li>
                  </Box>
                </Box>
              }
              placement="right"
              arrow
            >
              <IconButton
                size="small"
                aria-label="View keyboard shortcuts"
                sx={{
                  color: 'text.secondary',
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                <HelpCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <PageHeaderComposable.Description>
            Configure format settings for service address numbers, account numbers, and customer numbers
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>

        {/* Tabs in Header */}
        <Box sx={{
          backgroundColor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 0,
          pb: 0,
          mx: -3,
        }}>
            <Box sx={{ px: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="number format tabs">
                <Tab
                  label="Account"
                  {...a11yProps(0)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab
                  label="Customer"
                  {...a11yProps(1)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab
                  label="Service Address"
                  {...a11yProps(2)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              </Tabs>
            </Box>
          </Box>
      </PageHeaderComposable>

      {/* Main Content */}
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'grey.50',
          mt: 0,
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          {/* Error Alert */}
          {error && (
            <Box sx={{ px: 3, pt: 3 }} role="alert" aria-live="assertive">
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Success Snackbar */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ bottom: { xs: 90, sm: 24 } }}
          >
            <Alert
              onClose={() => setSuccessMessage(null)}
              severity="success"
              variant="filled"
              icon={<CheckCircle fontSize="small" />}
              sx={{
                minWidth: '300px',
                maxWidth: '400px',
                py: 1,
                px: 2,
                '& .MuiAlert-message': {
                  py: 0,
                },
                '& .MuiAlert-icon': {
                  py: 0,
                  mr: 1.5,
                },
              }}
            >
              {successMessage}
            </Alert>
          </Snackbar>

          {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
            {accountInViewMode ? (
              <ViewFormatSection
                title="Account Number Format"
                subtitle="Configure the format for account numbers"
                config={accountConfig}
                onEdit={() => handleEdit(0)}
              />
            ) : (
              <FormatSection
                title="Account Number Format"
                subtitle="Configure the format for account numbers"
                previewTitle="Account Number Preview"
                config={accountConfig}
                onUpdate={setAccountConfig}
                maxCharacterLimit={FIELD_CONSTRAINTS.ACCOUNT_CHAR_LIMIT}
                maxSegments={FIELD_CONSTRAINTS.MAX_ACCOUNT_SEGMENTS}
                segmentOptions={accountOptions}
                maxSegmentCharLimit={FIELD_CONSTRAINTS.ACCOUNT_CHAR_LIMIT}
                hasChanges={accountHasChanges}
                isSaving={savingTab === 0}
                onSave={() => handleSave(0)}
                onCancel={() => handleCancel(0)}
                formatType="account"
              />
            )}
            </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {customerInViewMode ? (
              <ViewFormatSection
                title="Customer Number Format"
                subtitle="Configure the format for customer numbers"
                config={customerConfig}
                onEdit={() => handleEdit(1)}
              />
            ) : (
              <FormatSection
                title="Customer Number Format"
                subtitle="Configure the format for customer numbers"
                previewTitle="Customer Number Preview"
                config={customerConfig}
                onUpdate={setCustomerConfig}
                maxCharacterLimit={FIELD_CONSTRAINTS.CUSTOMER_CHAR_LIMIT}
                maxSegments={FIELD_CONSTRAINTS.MAX_CUSTOMER_SEGMENTS}
                segmentOptions={customerOptions}
                maxSegmentCharLimit={FIELD_CONSTRAINTS.CUSTOMER_CHAR_LIMIT}
                hasChanges={customerHasChanges}
                isSaving={savingTab === 1}
                onSave={() => handleSave(1)}
                onCancel={() => handleCancel(1)}
                formatType="customer"
              />
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {serviceAddressInViewMode ? (
              <ViewFormatSection
                title="Service Address Number Format"
                subtitle="Configure the format for service address numbers"
                config={serviceAddressConfig}
                onEdit={() => handleEdit(2)}
              />
            ) : (
              <FormatSection
                title="Service Address Number Format"
                subtitle="Configure the format for service address numbers"
                previewTitle="Service Address Number Preview"
                config={serviceAddressConfig}
                onUpdate={setServiceAddressConfig}
                maxCharacterLimit={FIELD_CONSTRAINTS.SERVICE_ADDRESS_CHAR_LIMIT}
                maxSegments={FIELD_CONSTRAINTS.MAX_SERVICE_ADDRESS_SEGMENTS}
                segmentOptions={serviceAddressOptions}
                maxSegmentCharLimit={10}
                hasChanges={serviceAddressHasChanges}
                isSaving={savingTab === 2}
                onSave={() => handleSave(2)}
                onCancel={() => handleCancel(2)}
                formatType="serviceAddress"
              />
            )}
            </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountNumberFormatPage;
