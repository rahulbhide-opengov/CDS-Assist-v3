// React imports
import React, { useState } from 'react';

// MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Download,
  Payment,
  Receipt,
  Description,
  Help,
  Person,
  CalendarMonth,
  ExpandMore,
  Phone,
} from '@mui/icons-material';
import { cdsDesignTokens } from '../../theme/cds';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CustomerPortalPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'grey.50',
      }}
    >
      {/* Header Navigation */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '4px',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>CC</Typography>
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Cloud City
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" underline="none" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
              Dashboard
            </Link>
            <Link href="#" underline="none" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
              History
            </Link>
            <Link href="#" underline="none" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
              Support
            </Link>
            <Link href="#" underline="none" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
              Account
            </Link>
            <Link href="#" underline="none" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
              Logout
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', p: 4 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={600} sx={{ mb: 0.5 }}>
            Hello, Paul Atreides!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account easy and securely
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <CalendarMonth sx={{ fontSize: '1rem' }} />
            Utility
          </Typography>
        </Box>

        {/* Current Balance and Account Status Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Current Balance Card */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Current Balance
                </Typography>
                <Chip
                  label="Billing Frequency: Quarterly"
                  size="small"
                  sx={{
                    backgroundColor: 'warning.light',
                    color: 'warning.main',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Typography variant="h3" fontWeight={600} sx={{ mb: 2 }}>
                $221.43
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CalendarMonth sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Due on Apr 22, 2025
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Payment />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '4px',
                }}
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Account Status
                </Typography>
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    backgroundColor: 'success.light',
                    color: 'success.main',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                Account #23434565
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" component="span">
                  📍
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  8234 Bespin st, Cloud city, CC 12345
                </Typography>
              </Box>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Manage Account →
              </Link>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Bills Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Recent Bills
            </Typography>
            <Link href="#" underline="none" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}>
              View All
            </Link>
          </Box>

          <Stack spacing={2}>
            {/* Bill 1 */}
            <Card sx={{ borderRadius: '4px' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '4px',
                        backgroundColor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Receipt sx={{ color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        March 2025
                      </Typography>
                      <Chip label="Due in 7 days" size="small" sx={{ mt: 0.5, backgroundColor: 'warning.light', color: 'warning.main', fontSize: '0.75rem', height: '20px' }} />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight={600}>
                      $221.43
                    </Typography>
                    <Link href="#" underline="none" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem', mt: 0.5, display: 'block' }}>
                      Download Bill
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Bill 2 */}
            <Card sx={{ borderRadius: '4px' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '4px',
                        backgroundColor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Receipt sx={{ color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        February 2025
                      </Typography>
                      <Chip label="Paid" size="small" sx={{ mt: 0.5, backgroundColor: 'success.light', color: 'success.main', fontSize: '0.75rem', height: '20px' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Paid Mar 12, 2025
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight={600}>
                      $183.75
                    </Typography>
                    <Link href="#" underline="none" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem', mt: 0.5, display: 'block' }}>
                      Download Bill
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Need Special Pick-up Service */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: 'grey.100',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: 'divider',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              Need Special Pick-up Service
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: '1rem', color: 'primary.main' }} />
              <Link href="tel:650-123-2254" underline="none" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Call to Schedule
              </Link>
              <Typography variant="body2" color="text.secondary">
                Phone: 650-123-2254
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {/* Action Card 1 */}
            <Card
              sx={{
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Payment sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  Add/Update Payment Method
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quick & Secure
                </Typography>
              </CardContent>
            </Card>

            {/* Action Card 2 */}
            <Card
              sx={{
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'info.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Description sx={{ color: 'info.main' }} />
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  View Bills
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Bill History
                </Typography>
              </CardContent>
            </Card>

            {/* Action Card 3 */}
            <Card
              sx={{
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Person sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  Update Profile
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Manage Your Account
                </Typography>
              </CardContent>
            </Card>

            {/* Action Card 4 */}
            <Card
              sx={{
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'warning.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Help sx={{ color: 'warning.main' }} />
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  Get Support
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  24/7 Help
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Frequently Asked Questions */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Frequently Asked Questions
            </Typography>
            <Link href="#" underline="none" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}>
              View All Questions
            </Link>
          </Box>

          <Stack spacing={1}>
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleAccordionChange('panel1')}
              sx={{ borderRadius: '8px !important', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1" fontWeight={600}>
                  Where can I pay my bills?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  You can pay your bills online through this portal, by phone at 650-123-2254, by mail, or in person at
                  City Hall during business hours.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleAccordionChange('panel2')}
              sx={{ borderRadius: '8px !important', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1" fontWeight={600}>
                  What payment methods do you accept?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  We accept credit cards, debit cards, ACH bank transfers, e-checks, and cash payments in person.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleAccordionChange('panel3')}
              sx={{ borderRadius: '8px !important', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1" fontWeight={600}>
                  Need a Special Pick-up?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  For special pick-ups or bulk item removal, please call our scheduling line at 650-123-2254 or submit a
                  request through the support section.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerPortalPage;
