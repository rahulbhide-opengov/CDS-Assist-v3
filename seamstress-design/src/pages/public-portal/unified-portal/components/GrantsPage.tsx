/**
 * Grants Page
 *
 * Find funding opportunities for your projects.
 * We're here to help you succeed.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
} from '@mui/material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import {
  Search,
  School,
  Business,
  Park,
  LocalHospital,
  Groups,
  Home,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;
const theme = {
  primary: colors.blurple500,
  secondary: colors.cerulean600,
  success: colors.green600,
  warning: colors.yellow600,
  gray50: colors.gray50,
  gray100: colors.gray100,
  gray200: colors.gray200,
  gray300: colors.gray300,
  gray400: colors.gray400,
  gray500: colors.gray500,
  gray600: colors.gray600,
  gray700: colors.gray700,
  gray900: colors.gray900,
  white: colors.white,
};

// Grant types
interface Grant {
  id: string;
  name: string;
  description: string;
  category: 'community' | 'business' | 'education' | 'health' | 'environment' | 'housing';
  fundingAmount: { min: number; max: number };
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed' | 'applied' | 'awarded' | 'denied';
  eligibility: string[];
  totalFunding: number;
  applicationsReceived: number;
  requirements?: string[];
  matchRequired?: number;
  isSaved?: boolean;
}

// Category configurations - using consistent blurple500
const categoryConfig: Record<string, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  community: { icon: <Groups aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Community' },
  business: { icon: <Business aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Business' },
  education: { icon: <School aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Education' },
  health: { icon: <LocalHospital aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Health' },
  environment: { icon: <Park aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Environment' },
  housing: { icon: <Home aria-hidden="true" />, color: colors.blurple500, bg: `${colors.blurple500}15`, label: 'Housing' },
};

// Status configurations
const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  open: { color: colors.green600, bg: colors.green50, label: 'Open' },
  closing_soon: { color: colors.yellow600, bg: colors.yellow50, label: 'Closing Soon' },
  closed: { color: colors.gray600, bg: colors.gray100, label: 'Closed' },
  applied: { color: colors.blurple500, bg: colors.blurple50, label: 'Applied' },
  awarded: { color: colors.green600, bg: colors.green50, label: 'Awarded' },
  denied: { color: colors.red700, bg: colors.red100, label: 'Denied' },
};

// Mock grants data
const mockGrants: Grant[] = [
  {
    id: '1',
    name: 'Small Business Recovery Grant',
    description: 'Support for small businesses recovering from economic challenges. Covers operational costs, equipment, and staffing.',
    category: 'business',
    fundingAmount: { min: 5000, max: 50000 },
    deadline: '2025-05-15',
    status: 'open',
    eligibility: ['Small businesses with 1-50 employees', 'Operating for at least 2 years', 'Located within city limits'],
    totalFunding: 2000000,
    applicationsReceived: 145,
    requirements: ['Business license', 'Tax returns (2 years)', 'Financial statements'],
    matchRequired: 0.1,
  },
  {
    id: '2',
    name: 'Community Garden Initiative',
    description: 'Funding for neighborhood community gardens and urban farming projects that promote food security.',
    category: 'environment',
    fundingAmount: { min: 2500, max: 15000 },
    deadline: '2025-04-30',
    status: 'closing_soon',
    eligibility: ['Nonprofit organizations', 'Community groups', 'Neighborhood associations'],
    totalFunding: 500000,
    applicationsReceived: 89,
    requirements: ['Project plan', 'Budget breakdown', 'Community support letters'],
  },
  {
    id: '3',
    name: 'Youth STEM Education Grant',
    description: 'Supporting programs that provide STEM education opportunities for underserved youth.',
    category: 'education',
    fundingAmount: { min: 10000, max: 75000 },
    deadline: '2025-06-01',
    status: 'open',
    eligibility: ['Schools (K-12)', 'Nonprofits serving youth', 'Community centers'],
    totalFunding: 1500000,
    applicationsReceived: 67,
    requirements: ['Program curriculum', 'Student impact metrics', 'Budget proposal'],
    matchRequired: 0.25,
  },
  {
    id: '4',
    name: 'Affordable Housing Development',
    description: 'Grants for developing new affordable housing units or rehabilitating existing properties.',
    category: 'housing',
    fundingAmount: { min: 50000, max: 500000 },
    deadline: '2025-07-31',
    status: 'open',
    eligibility: ['Nonprofit housing developers', 'Community development corporations', 'Housing authorities'],
    totalFunding: 10000000,
    applicationsReceived: 23,
    requirements: ['Development plans', 'Financial pro forma', 'Community impact assessment'],
    matchRequired: 0.5,
  },
  {
    id: '5',
    name: 'Senior Wellness Program Grant',
    description: 'Funding for programs that promote health and wellness among senior citizens.',
    category: 'health',
    fundingAmount: { min: 5000, max: 25000 },
    deadline: '2025-03-31',
    status: 'applied',
    eligibility: ['Healthcare providers', 'Senior centers', 'Community organizations'],
    totalFunding: 750000,
    applicationsReceived: 112,
    isSaved: true,
  },
  {
    id: '6',
    name: 'Neighborhood Improvement Grant',
    description: 'Support for community-led projects that improve neighborhood safety, appearance, and connectivity.',
    category: 'community',
    fundingAmount: { min: 1000, max: 10000 },
    deadline: '2025-08-15',
    status: 'open',
    eligibility: ['Neighborhood associations', 'Civic groups', 'Resident coalitions'],
    totalFunding: 300000,
    applicationsReceived: 45,
    requirements: ['Project description', 'Community support petition', 'Implementation timeline'],
  },
];

const GrantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter grants
  const filteredGrants = mockGrants.filter(grant => {
    const matchesSearch =
      grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || grant.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && ['open', 'closing_soon'].includes(grant.status)) ||
      (statusFilter === 'applied' && ['applied', 'awarded', 'denied'].includes(grant.status));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return '$' + (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return '$' + (amount / 1000).toFixed(0) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilDeadline = (dateString: string) => {
    const now = new Date();
    const deadline = new Date(dateString);
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="services" />

      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
            Grants & Funding
          </Typography>
          <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
            Find and apply for grants that match your goals
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.blurple500 }}>
                {mockGrants.filter(g => ['open', 'closing_soon'].includes(g.status)).length}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                Open Grants
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.orange600 }}>
                {mockGrants.filter(g => g.status === 'closing_soon').length}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                Closing Soon
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.green600 }}>
                {mockGrants.filter(g => g.status === 'applied').length}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                Applications Submitted
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray600 }}>
                {formatCurrency(mockGrants.reduce((total, g) => total + (g.totalFunding || 0), 0) / 1000000)}M
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                Total Funding
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Search and Filters - Sleek Design */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'end' }}>
            <TextField
              size="small"
              placeholder="Search by grant name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search grants by name or description"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.gray400 }} aria-hidden="true" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: { xs: '100%', sm: 320 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.white,
                  '&:hover fieldset': {
                    borderColor: colors.blurple500,
                  },
                },
              }}
            />
            <FormControl size="small" sx={{ width: { xs: '100%', sm: 160 } }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ bgcolor: colors.white }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: { xs: '100%', sm: 160 } }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ bgcolor: colors.white }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ mb: 3 }} />

        {/* Available Grants */}
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
          {filteredGrants.length} Grant{filteredGrants.length !== 1 ? 's' : ''} Found
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3
        }}>
          {filteredGrants.map((grant) => {
            const config = categoryConfig[grant.category];
            const status = statusConfig[grant.status];

              return (
                <Card key={grant.id} elevation={0} sx={{ ...portalStyles.serviceCard }}>
                  <CardContent sx={{ p: 2.5 }}>
                      {/* Header with Title and Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1, pr: 2 }}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                            {grant.name}
                          </Typography>
                          {/* Status Chips */}
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Chip
                              label={config.label}
                              size="small"
                              sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                bgcolor: grant.status === 'open' ? colors.green50 : colors.gray100,
                                color: grant.status === 'open' ? colors.green700 : colors.gray700
                              }}
                            />
                          </Box>
                        </Box>
                        {/* Action Button */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(
                            ['open', 'closing_soon'].includes(grant.status)
                              ? `/unified-portal/grants/${grant.id}/apply`
                              : `/unified-portal/grants/${grant.id}`
                          )}
                          sx={{ minWidth: 80, fontSize: '0.75rem' }}
                        >
                          {['open', 'closing_soon'].includes(grant.status) ? 'Apply' : 'View'}
                        </Button>
                      </Box>

                      {/* Description - Full Text */}
                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.gray600, lineHeight: 1.5 }}>
                          {grant.description}
                        </Typography>
                      </Box>

                      {/* Funding and Deadline on Same Line */}
                      <Box sx={{ pt: 2, borderTop: `1px solid ${colors.gray200}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.gray500, mb: 0.25 }}>
                              Funding Range
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>
                              {formatCurrency(grant.fundingAmount.min)} - {formatCurrency(grant.fundingAmount.max)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.gray500, mb: 0.25 }}>
                              Deadline
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray700 }}>
                              {formatDate(grant.deadline)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
              );
            })}

          {/* Empty State */}
          {filteredGrants.length === 0 && (
              <Card elevation={0} sx={{ ...portalStyles.serviceCard, gridColumn: '1 / -1' }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                    No grants found
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                    {searchQuery ? 'Try adjusting your search criteria' : 'Check back soon for new opportunities'}
                  </Typography>
                </CardContent>
              </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GrantsPage;
