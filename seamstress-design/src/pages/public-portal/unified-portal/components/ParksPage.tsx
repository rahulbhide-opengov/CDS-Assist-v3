/**
 * Parks & Recreation Page
 * Dedicated page for parks, passes, and facility reservations
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  Park,
  Pool,
  SportsTennis,
  SportsBaseball,
  MeetingRoom,
  TheaterComedy,
  CheckCircle,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;
const theme = {
  primary: colors.blurple500,
  secondary: colors.blurple500,
  warning: colors.yellow600,
  success: colors.green600,
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
  secondaryLight: `${colors.blurple500}15`,
};

const parkPasses = [
  { id: 'annual', title: 'Annual Park Pass', description: 'Unlimited access to all city parks', price: '$75', period: '/year', features: ['All 12 city parks', 'Trail access', 'Parking included'], popular: true, color: colors.blurple500 },
  { id: 'seasonal', title: 'Seasonal Pass', description: 'Parks and pools for summer', price: '$45', period: '/season', features: ['All city parks', 'Pool access', 'May - September'], popular: false, color: colors.blurple500 },
  { id: 'day', title: 'Day Pass', description: 'Single day access', price: '$5', period: '/day', features: ['Any park', 'Pool access'], popular: false, color: colors.blurple500 },
  { id: 'senior', title: 'Senior Pass (65+)', description: 'Discounted annual pass', price: '$40', period: '/year', features: ['All parks & trails', 'Pool access'], popular: false, color: colors.blurple500 },
];

const facilities = [
  { id: 'pavilion', title: 'Pavilion', desc: 'Outdoor parties & gatherings', icon: <Park aria-hidden="true" />, rate: 'From $50/day', avail: '12 available' },
  { id: 'sports-field', title: 'Sports Field', desc: 'Soccer, baseball & more', icon: <SportsBaseball aria-hidden="true" />, rate: 'From $25/hr', avail: '8 available' },
  { id: 'community-room', title: 'Community Room', desc: 'Meetings & private events', icon: <MeetingRoom aria-hidden="true" />, rate: 'From $75/day', avail: '4 available' },
  { id: 'pool', title: 'Pool', desc: 'Private pool parties', icon: <Pool aria-hidden="true" />, rate: 'From $150/event', avail: 'Weekends only' },
  { id: 'tennis', title: 'Tennis Courts', desc: 'Court reservations', icon: <SportsTennis aria-hidden="true" />, rate: '$10/hr', avail: '16 courts' },
  { id: 'amphitheater', title: 'Amphitheater', desc: 'Performances & concerts', icon: <TheaterComedy aria-hidden="true" />, rate: 'From $500', avail: 'By request' },
];

const myReservations = [
  { id: 'RES-001', facility: 'Central Park Pavilion', date: 'Apr 15, 2025', time: '10:00 AM - 4:00 PM', status: 'Confirmed', amount: '$75.00' },
  { id: 'RES-002', facility: 'Tennis Court #3', date: 'Apr 8, 2025', time: '2:00 PM - 4:00 PM', status: 'Confirmed', amount: '$20.00' },
];

const ParksPage: React.FC = () => {
  const navigate = useNavigate();

  const handleFacilityClick = (facilityId: string) => {
    // Navigate to facility reservation page
    navigate(`/portal/parks/facilities/${facilityId}`);
  };

  const handleReservationClick = (reservationId: string) => {
    // Navigate to reservation details page
    navigate(`/portal/parks/reservations/${reservationId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.gray50 }}>
      <PortalNavigation activeTab="services" />

      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: theme.gray900, mb: 0.5 }}>
            Parks & Recreation
          </Typography>
          <Typography sx={{ color: theme.gray500, fontSize: '0.9375rem' }}>
            Buy passes, reserve facilities, and explore city parks
          </Typography>
        </Box>
        {/* Park Passes */}
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.gray900, mb: 2 }}>
          Park Passes
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 5 }}>
          {parkPasses.map((pass) => (
            <Card
              key={pass.id}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: pass.popular ? `2px solid ${pass.color}` : `1px solid ${theme.gray200}`,
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {pass.popular && (
                <Chip
                  label="Popular"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: 20,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    bgcolor: pass.color,
                    color: theme.white,
                    borderRadius: '4px',
                  }}
                />
              )}
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme.gray900, mb: 0.5 }}>{pass.title}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500, mb: 2, minHeight: 40 }}>{pass.description}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: pass.color }}>{pass.price}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: theme.gray500, ml: 0.5 }}>{pass.period}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  {pass.features.map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircle aria-hidden="true" sx={{ fontSize: 14, color: theme.success }} />
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray600 }}>{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  sx={{
                    bgcolor: pass.popular ? pass.color : theme.white,
                    color: pass.popular ? theme.white : pass.color,
                    border: pass.popular ? 'none' : `1px solid ${pass.color}`,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.25,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: pass.color, color: theme.white },
                  }}
                >
                  Buy Pass
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Facility Reservations */}
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.gray900, mb: 2 }}>
          Reserve a Facility
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, mb: 5 }}>
          {facilities.map((facility) => (
            <Paper
              key={facility.id}
              elevation={0}
              onClick={() => handleFacilityClick(facility.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFacilityClick(facility.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Reserve ${facility.title}. ${facility.desc}. ${facility.rate}. ${facility.avail}`}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: `1px solid ${theme.gray200}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: theme.secondary, bgcolor: theme.secondaryLight },
                '&:focus': {
                  outline: `2px solid ${theme.primary}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: theme.secondaryLight, color: theme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                {facility.icon}
              </Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: theme.gray900, mb: 0.25 }}>{facility.title}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 1 }}>{facility.desc}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: theme.gray400 }}>{facility.rate}</Typography>
              <Typography sx={{ fontSize: '0.625rem', color: theme.secondary, fontWeight: 500 }}>{facility.avail}</Typography>
            </Paper>
          ))}
        </Box>

        {/* My Reservations */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.gray900 }}>
            My Reservations
          </Typography>
          <Button sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', color: theme.primary }}>
            View All
          </Button>
        </Box>
        <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${theme.gray200}` }}>
          {myReservations.map((res, i) => (
            <Box
              key={res.id}
              onClick={() => handleReservationClick(res.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleReservationClick(res.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View reservation ${res.id} for ${res.facility} on ${res.date} at ${res.time}. Status: ${res.status}. Amount: ${res.amount}`}
              sx={{
                p: 3,
                borderBottom: i < myReservations.length - 1 ? `1px solid ${theme.gray100}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.gray50 },
                '&:focus': {
                  outline: `2px solid ${theme.primary}`,
                  outlineOffset: -2,
                  bgcolor: theme.gray50,
                },
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: theme.secondaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarToday aria-hidden="true" sx={{ color: theme.secondary }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: theme.gray900, mb: 0.25 }}>{res.facility}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>{res.date} · {res.time}</Typography>
              </Box>
              <Chip label={res.status} size="small" sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, bgcolor: theme.successLight, color: theme.success }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme.gray900 }}>{res.amount}</Typography>
            </Box>
          ))}
        </Card>
      </Box>
    </Box>
  );
};

export default ParksPage;
