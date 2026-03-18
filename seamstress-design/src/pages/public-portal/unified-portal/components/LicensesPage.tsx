/**
 * Licenses Page
 *
 * Manage your licenses — business, professional, and pet.
 * Stay compliant without the hassle.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Search,
  Add,
  Business,
  Pets,
  LocalHospital,
  Restaurant,
  Construction,
  DirectionsCar,
  Badge,
  ArrowForward,
  CheckCircle,
  Schedule,
  Warning,
  Autorenew,
  Receipt,
  Print,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';
import PortalNavigation from './PortalNavigation';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = cdsColors;

// License types
interface License {
  id: string;
  type: 'business' | 'professional' | 'pet' | 'vehicle' | 'food' | 'contractor';
  name: string;
  licenseNumber: string;
  issuedDate: string;
  expiresDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal' | 'suspended';
  renewalFee?: number;
  entityName?: string;
  details?: Record<string, string>;
}

// Type configurations - using consistent blurple500
const typeConfig: Record<string, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  business: { icon: <Business aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Business License' },
  professional: { icon: <Badge aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Professional License' },
  pet: { icon: <Pets aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Pet License' },
  vehicle: { icon: <DirectionsCar aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Vehicle License' },
  food: { icon: <Restaurant aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Food Service' },
  contractor: { icon: <Construction aria-hidden="true" />, color: colors.blurple500, bg: colors.blurple50, label: 'Contractor' },
};

// Status configurations
const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: colors.green600, bg: colors.green50, label: 'Active' },
  expiring_soon: { color: colors.yellow600, bg: colors.yellow50, label: 'Expiring Soon' },
  expired: { color: colors.red600, bg: colors.red50, label: 'Expired' },
  pending_renewal: { color: colors.blurple500, bg: colors.blurple50, label: 'Renewal Pending' },
  suspended: { color: colors.gray600, bg: colors.gray100, label: 'Suspended' },
};

// Mock license data
const mockLicenses: License[] = [
  {
    id: '1',
    type: 'business',
    name: 'General Business License',
    licenseNumber: 'BL-2024-5678',
    issuedDate: '2024-01-15',
    expiresDate: '2024-12-31',
    status: 'expired',
    renewalFee: 175.00,
    entityName: 'ABC Consulting LLC',
    details: { businessType: 'Professional Services', employees: '1-5' },
  },
  {
    id: '2',
    type: 'pet',
    name: 'Dog License',
    licenseNumber: 'PL-2025-1234',
    issuedDate: '2025-01-10',
    expiresDate: '2026-01-09',
    status: 'active',
    renewalFee: 25.00,
    details: { petName: 'Max', breed: 'Golden Retriever', rabiesExp: '2026-03-15' },
  },
  {
    id: '3',
    type: 'pet',
    name: 'Cat License',
    licenseNumber: 'PL-2025-1235',
    issuedDate: '2025-02-01',
    expiresDate: '2026-01-31',
    status: 'active',
    renewalFee: 20.00,
    details: { petName: 'Whiskers', breed: 'Domestic Shorthair' },
  },
  {
    id: '4',
    type: 'contractor',
    name: 'General Contractor License',
    licenseNumber: 'CL-2025-8901',
    issuedDate: '2025-03-01',
    expiresDate: '2025-05-15',
    status: 'expiring_soon',
    renewalFee: 350.00,
    entityName: 'ABC Consulting LLC',
    details: { classification: 'Class B', bondAmount: '$50,000' },
  },
];

const LicensesPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter licenses
  const filteredLicenses = mockLicenses.filter(license => {
    const matchesSearch =
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.entityName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 0) return matchesSearch; // All
    if (activeTab === 1) return matchesSearch && license.status === 'active';
    if (activeTab === 2) return matchesSearch && ['expiring_soon', 'expired'].includes(license.status);
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const now = new Date();
    const expiry = new Date(dateString);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Card styling - aligned with seamstress patterns
  const cardStyle = {
    borderRadius: '8px',
    border: `1px solid ${colors.gray200}`,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: colors.blurple300,
      bgcolor: `${colors.blurple500}08`,
    },
  };

  // Count licenses needing renewal
  const renewalCount = mockLicenses.filter(l => ['expiring_soon', 'expired'].includes(l.status)).length;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="services" />

      <Box sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
              Licenses
            </Typography>
            <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
              Manage all your licenses in one place
            </Typography>

            {/* Renewal Alert */}
            {renewalCount > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.blurple50} 0%, ${colors.blurple100} 100%)`,
                  border: `1px solid ${colors.blurple200}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar sx={{ bgcolor: colors.blurple500, width: 40, height: 40 }}>
                  <Autorenew aria-hidden="true" sx={{ color: 'white' }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                    {renewalCount} license{renewalCount > 1 ? 's need' : ' needs'} renewal
                  </Typography>
                  <Typography sx={{ color: colors.gray600, fontSize: '0.875rem' }}>
                    Renew now to stay compliant and avoid late fees.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    ...portalStyles.primaryButton,
                    borderRadius: '4px',
                  }}
                  onClick={() => setActiveTab(2)}
                >
                  View Renewals
                </Button>
              </Paper>
            )}
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.blurple500 }}>
                  {mockLicenses.filter(l => l.status === 'active').length}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Active Licenses</Typography>
              </CardContent>
            </Card>
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.yellow600 }}>
                  {mockLicenses.filter(l => l.status === 'expiring_soon').length}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Expiring Soon</Typography>
              </CardContent>
            </Card>
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.red700 }}>
                  {mockLicenses.filter(l => l.status === 'expired').length}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Needs Renewal</Typography>
              </CardContent>
            </Card>
            <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray600 }}>
                  {mockLicenses.length}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Total Licenses</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Tabs and Search */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="License filter tabs"
            >
              <Tab label={`All (${mockLicenses.length})`} />
              <Tab label={`Active (${mockLicenses.filter(l => l.status === 'active').length})`} />
              <Tab label={`Needs renewal (${renewalCount})`} />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search licenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search licenses"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search aria-hidden="true" sx={{ color: colors.gray400, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: 260,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  bgcolor: 'white',
                },
              }}
            />
          </Box>

          {/* Licenses Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
            {filteredLicenses.map((license, index) => {
              const config = typeConfig[license.type];
              const status = statusConfig[license.status];
              const daysUntilExpiry = getDaysUntilExpiry(license.expiresDate);
              const isExpired = daysUntilExpiry < 0;

              return (
                <Card
                  key={license.id}
                  elevation={0}
                  sx={cardStyle}
                >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                          width: 48,
                          height: 48,
                          bgcolor: config.bg,
                          color: config.color,
                        }}>
                          {config.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, color: colors.gray900, fontSize: '1rem' }}>
                              {license.name}
                            </Typography>
                          </Box>
                          {license.entityName && (
                            <Typography sx={{ color: colors.gray600, fontSize: '0.8125rem' }}>
                              {license.entityName}
                            </Typography>
                          )}
                          <Typography sx={{ color: colors.gray500, fontSize: '0.8125rem' }}>
                            #{license.licenseNumber}
                          </Typography>
                        </Box>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            bgcolor: status.bg,
                            color: status.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>

                      {/* Details */}
                      {license.details && Object.keys(license.details).length > 0 && (
                        <Box sx={{
                          p: 2,
                          bgcolor: colors.gray50,
                          borderRadius: '4px',
                          mb: 2,
                        }}>
                          <Grid container spacing={1}>
                            {Object.entries(license.details).slice(0, 3).map(([key, value]) => (
                              <Grid size={{ xs: 6 }} key={key}>
                                <Typography sx={{ color: colors.gray500, fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                                <Typography sx={{ color: colors.gray700, fontSize: '0.875rem', fontWeight: 500 }}>
                                  {value}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Dates and Actions */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography sx={{ color: colors.gray500, fontSize: '0.75rem' }}>
                            {isExpired ? 'Expired' : 'Expires'}
                          </Typography>
                          <Typography sx={{
                            color: isExpired ? colors.red600 : daysUntilExpiry <= 60 ? colors.yellow600 : colors.gray700,
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                          }}>
                            {formatDate(license.expiresDate)}
                            {!isExpired && daysUntilExpiry <= 60 && ` (${daysUntilExpiry} days)`}
                          </Typography>
                        </Box>
                        {(license.status === 'expired' || license.status === 'expiring_soon') && license.renewalFee ? (
                          <Button
                            variant="contained"
                            startIcon={<Autorenew aria-hidden="true" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/unified-portal/licenses/${license.id}/renew`);
                            }}
                            sx={{
                              borderRadius: '4px',
                              textTransform: 'none',
                              fontWeight: 600,
                              bgcolor: license.status === 'expired' ? colors.red600 : colors.yellow600,
                              '&:hover': {
                                bgcolor: license.status === 'expired' ? colors.red700 : colors.yellow700,
                              },
                            }}
                          >
                            Renew ({formatCurrency(license.renewalFee)})
                          </Button>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              aria-label={`Download ${license.name}`}
                              sx={{ color: colors.gray400, '&:hover': { color: colors.blurple500 } }}
                            >
                              <Download aria-hidden="true" sx={{ fontSize: 20 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label={`Print ${license.name}`}
                              sx={{ color: colors.gray400, '&:hover': { color: colors.blurple500 } }}
                            >
                              <Print aria-hidden="true" sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
              );
            })}
          </Box>

          {/* Empty State */}
          {filteredLicenses.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Badge aria-hidden="true" sx={{ fontSize: 64, color: colors.gray300, mb: 2 }} />
                  <Typography sx={{ color: colors.gray600, fontSize: '1.125rem', mb: 1 }}>
                    No licenses found
                  </Typography>
                  <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem', mb: 3 }}>
                    {searchQuery ? 'Try a different search' : 'Apply for a license to get started'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add aria-hidden="true" />}
                    onClick={() => navigate('/unified-portal/licenses/new')}
                    sx={{
                      ...portalStyles.primaryButton,
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    Apply for License
                  </Button>
                </Box>
            )}

          {/* Help */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: colors.gray600, fontSize: '0.9375rem' }}>
              Not sure which license you need?{' '}
              <Button
                sx={{ textTransform: 'none', fontWeight: 600, color: colors.blurple500, p: 0, minWidth: 'auto' }}
                onClick={() => navigate('/unified-portal/support')}
              >
                Check our guide
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LicensesPage;
