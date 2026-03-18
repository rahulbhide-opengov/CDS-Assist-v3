/**
 * MarketingFooter
 *
 * Footer component for marketing pages.
 * Theme-aware with light/dark mode support.
 */

import React from 'react';
import { Box, Typography, Button, Grid, Container, Divider } from '@mui/material';
import { cdsColors } from '../../theme/cds';
import { footerColumns, footerLegalLinks } from '../../config/marketingNavConfig';
import { useMarketingTheme } from '../../contexts/MarketingThemeContext';
import { ThemedLogo } from './primitives';

const MarketingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { marketingColors, isDark } = useMarketingTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? marketingColors.surface : cdsColors.gray50,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Top Section - Logo, Tagline, CTAs */}
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Logo and Tagline */}
          <Box>
            <ThemedLogo height={28} sx={{ mb: 1.5 }} />
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: marketingColors.muted,
              }}
            >
              Powering more effective and accountable government.
            </Typography>
          </Box>

          {/* CTAs */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: marketingColors.accent,
                color: cdsColors.white,
                px: 3,
                py: 1.25,
                borderRadius: '4px',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: cdsColors.blurple800,
                  boxShadow: 'none',
                },
              }}
            >
              Request a Demo
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: marketingColors.border,
                color: marketingColors.foreground,
                px: 3,
                py: 1.25,
                borderRadius: '4px',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9375rem',
                '&:hover': {
                  borderColor: marketingColors.muted,
                  bgcolor: marketingColors.hoverBg,
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: marketingColors.border }} />

        {/* Link Columns */}
        <Box sx={{ py: 5 }}>
          <Grid container spacing={16}>
            {footerColumns.map((column) => (
              <Grid size={{ xs: 6, sm: 3 }} key={column.title}>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: marketingColors.foreground,
                    mb: 2,
                  }}
                >
                  {column.title}
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {column.links.map((link) => (
                    <Box component="li" key={link.href}>
                      <Typography
                        component="a"
                        href={link.href}
                        target={link.isExternal ? '_blank' : undefined}
                        rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        sx={{
                          fontSize: '0.9375rem',
                          color: marketingColors.muted,
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          '&:hover': {
                            color: marketingColors.foreground,
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: marketingColors.border }} />

        {/* Bottom Bar - Copyright and Legal */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: marketingColors.muted,
            }}
          >
            &copy; {currentYear} OpenGov, Inc. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            {footerLegalLinks.map((link) => (
              <Typography
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  fontSize: '0.875rem',
                  color: marketingColors.muted,
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: marketingColors.foreground,
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketingFooter;
