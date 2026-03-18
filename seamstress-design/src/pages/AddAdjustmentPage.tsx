import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  ThemeProvider
} from '@mui/material';
import { AccessibleBreadcrumbs } from '../components/AccessibleBreadcrumbs';
import { ChevronDown } from '@opengov/react-capital-assets';
import { capitalMuiTheme } from '@opengov/capital-mui-theme';

interface ServiceCharge {
  id: string;
  rule: string;
  billDescription: string;
  glPostingCode: string;
  originalCharge: number;
  adjustment: number;
  override: boolean;
}

interface AdjustmentService {
  id: string;
  name: string;
  description: string;
  units: number;
  unitAdjustment: number;
  rateCode: string;
  rateDescription: string;
  charges: ServiceCharge[];
}

const mockServices: AdjustmentService[] = [
  {
    id: '1',
    name: 'RF - Garbage',
    description: 'Number of Units: 1',
    units: 1,
    unitAdjustment: 0,
    rateCode: 'GRES - Residential Garbage',
    rateDescription: 'Residential Garbage',
    charges: [
      {
        id: '1-1',
        rule: 'Solid Waste',
        billDescription: 'Residential Garbage',
        glPostingCode: 'Solid Waste',
        originalCharge: 109.34,
        adjustment: 0.00,
        override: false
      }
    ]
  },
  {
    id: '2',
    name: 'WS - Water Service',
    description: 'Number of Units: 1',
    units: 1,
    unitAdjustment: 0,
    rateCode: 'WRES - Residential Water',
    rateDescription: 'Residential Water Service',
    charges: [
      {
        id: '2-1',
        rule: 'Water Base',
        billDescription: 'Residential Water Base',
        glPostingCode: 'Water Service',
        originalCharge: 32.50,
        adjustment: 0.00,
        override: false
      },
      {
        id: '2-2',
        rule: 'Water Usage',
        billDescription: 'Water Consumption',
        glPostingCode: 'Water Usage',
        originalCharge: 13.25,
        adjustment: 0.00,
        override: false
      }
    ]
  }
];

export default function AddAdjustmentPage() {
  const [services, setServices] = useState<AdjustmentService[]>(mockServices);
  const [expandedService, setExpandedService] = useState<string>('1');
  const [adjustmentDate, setAdjustmentDate] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  // Calculate totals
  const financialSummary = useMemo(() => {
    const originalTotal = services.reduce((total, service) =>
      total + service.charges.reduce((chargeTotal, charge) => chargeTotal + charge.originalCharge, 0), 0
    );

    const adjustmentTotal = services.reduce((total, service) =>
      total + service.charges.reduce((chargeTotal, charge) => chargeTotal + charge.adjustment, 0), 0
    );

    const newTotal = originalTotal + adjustmentTotal;

    return {
      originalTotal,
      adjustmentTotal,
      newTotal
    };
  }, [services]);

  const handleServiceExpand = (serviceId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedService(isExpanded ? serviceId : '');
  };

  const handleUnitAdjustmentChange = (serviceId: string, value: number) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, unitAdjustment: value } : service
    ));
  };

  const handleChargeAdjustmentChange = (serviceId: string, chargeId: string, value: number) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId ? {
        ...service,
        charges: service.charges.map(charge =>
          charge.id === chargeId ? { ...charge, adjustment: value } : charge
        )
      } : service
    ));
  };

  const handleOverrideChange = (serviceId: string, chargeId: string, checked: boolean) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId ? {
        ...service,
        charges: service.charges.map(charge =>
          charge.id === chargeId ? { ...charge, override: checked } : charge
        )
      } : service
    ));
  };

  const handleSubmit = () => {
    console.log('Submitting adjustments:', {
      services,
      financialSummary,
      adjustmentDate,
      adjustmentReason
    });
  };

  const handleCancel = () => {
    console.log('Cancelling adjustment');
  };

  return (
    <ThemeProvider theme={capitalMuiTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Custom Header */}
        <Box sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: 3,
          py: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Box sx={{ mb: 1 }}>
                <AccessibleBreadcrumbs
                  items={[
                    { label: 'Management Center', href: '#' },
                    { label: 'Accounts', href: '#' },
                    { label: '123-546-221' },
                  ]}
                />
              </Box>
              <Typography variant="h1">
                Add Adjustment
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Adjustment
              </Button>
            </Box>
          </Box>
        </Box>

      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Financial Impact Summary */}
            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">
                  Financial Impact Summary
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    Adjustment Information
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid size={12}>
                      <Typography variant="body2">
                        Adjustment Type
                      </Typography>
                      <Typography variant="body2">
                        Bill Adjustment
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2">
                        Billing Period
                      </Typography>
                      <Typography variant="body2">
                        11/21/2025 - 12/21/2025
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ minWidth: 200, borderLeft: '1px solid', borderColor: 'divider', pl: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Original Total</Typography>
                    <Typography variant="body2">
                      ${financialSummary.originalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Amount Adjustment</Typography>
                    <Typography variant="body2">
                      ${financialSummary.adjustmentTotal >= 0 ? '+' : ''}${financialSummary.adjustmentTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">New Total</Typography>
                    <Typography variant="body2">
                      ${financialSummary.newTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Adjustment Details */}
            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">
                  Adjustment Details
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Provide the reason and date for this adjustment
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ minWidth: 200 }}>
                  <TextField
                    label="Adjustment Date *"
                    type="date"
                    value={adjustmentDate}
                    onChange={(e) => setAdjustmentDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="MM/DD/YYYY"
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Adjustment Reason *"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Enter Adjustment Reason"
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 50 }}
                    helperText={`${adjustmentReason.length}/50`}
                  />
                </Box>
              </Box>
            </Card>

            {/* Adjustment Information */}
            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">
                  Adjustment Information
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={4}>
                  <Grid size={12}>
                    <Typography variant="body2">
                      Adjustment Type
                    </Typography>
                    <Typography variant="body2">
                      Bill Adjustment
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2">
                      Billing Period
                    </Typography>
                    <Typography variant="body2">
                      11/21/2025 - 12/21/2025
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Services Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">
                Services
              </Typography>
              <Typography variant="body2">
                Select and adjust individual services for this account
              </Typography>

              {services.map((service) => (
                <Card key={service.id} sx={{ mb: 2, p: 2}}>
                  <Accordion
                    expanded={expandedService === service.id}
                    onChange={handleServiceExpand(service.id)}
                    sx={{ boxShadow: 'none',  border: '1px solid', borderColor: 'divider' }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown />}
                      sx={{
                        backgroundColor: 'background.paper',
                        border: 'none',
                        borderColor: 'divider'
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {service.name}
                        </Typography>
                        <Typography variant="body2">
                          {service.description}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                      {/* Units Adjustment Section */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2">
                          Units Adjustment
                        </Typography>

                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'semibold', width: 100 }}>Unit</TableCell>
                                <TableCell sx={{ fontWeight: 'semibold' }}>Unit Adjustment</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{service.units}</TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={service.unitAdjustment.toFixed(2)}
                                    onChange={(e) => handleUnitAdjustmentChange(service.id, parseFloat(e.target.value) || 0)}
                                    sx={{ width: 96 }}
                                    inputProps={{ step: 0.01 }}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Rate Code Section */}
                      <Box>
                        <Typography variant="subtitle2">
                          Rate Code: {service.rateCode}
                        </Typography>

                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ background: 'none', width: 100 }}>Rule</TableCell>
                                <TableCell sx={{ background: 'none', width: 241 }}>Bill Description</TableCell>
                                <TableCell sx={{ background: 'none', width: 140 }}>GL Posting Code</TableCell>
                                <TableCell sx={{ background: 'none', width: 138 }}>Original Charge</TableCell>
                                <TableCell sx={{ background: 'none' }}>Chg. Adjustment</TableCell>
                                <TableCell sx={{ background: 'none', width: 71 }}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {service.charges.map((charge) => (
                                <TableRow key={charge.id}>
                                  <TableCell>{charge.rule}</TableCell>
                                  <TableCell>{charge.billDescription}</TableCell>
                                  <TableCell>{charge.glPostingCode}</TableCell>
                                  <TableCell>${charge.originalCharge.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={charge.adjustment.toFixed(2)}
                                      onChange={(e) => handleChargeAdjustmentChange(service.id, charge.id, parseFloat(e.target.value) || 0)}
                                      sx={{ width: 96, backgroundColor: 'grey.50' }}
                                      inputProps={{ step: 0.01 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          size="small"
                                          checked={charge.override}
                                          onChange={(e) => handleOverrideChange(service.id, charge.id, e.target.checked)}
                                        />
                                      }
                                      label="Override"
                                      sx={{ fontSize: 14 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              ))}
            </Box>

          </Box>

          {/* Account Information Panel */}
          <Box sx={{ width: 340, flexShrink: 0 }}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">
                  Account Information
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Service Address Number
                  </Typography>
                  <Typography variant="body1">
                    123456
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    📍 896 Main St, Newark, DE 19711
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box>
                  <Typography variant="subtitle2">
                    Customer Information
                  </Typography>
                  <Box>
                    <Typography variant="body2">
                      Customer Name
                    </Typography>
                    <Typography variant="body2">
                      Austin Brown
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
      </Box>
    </ThemeProvider>
  );
}