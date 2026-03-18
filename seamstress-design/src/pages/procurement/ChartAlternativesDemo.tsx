import React, { useState } from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

// CDS Design System color palette
const metabaseColors = {
  primary: colorTokens.primary.main,
  success: colorTokens.success.main,
  warning: colorTokens.warning.main,
  error: colorTokens.error.main,
  purple: colorTokens.primary[400],
  teal: colorTokens.secondary.main,
  navy: colorTokens.grey[900],
  text: colorTokens.grey[900],
  textLight: colorTokens.grey[700],
  border: colorTokens.grey[300],
  background: colorTokens.grey[50],
  cardBg: colorTokens.background.paper,
};

// Sequential blue palette for segments (CDS Primary scale)
const segmentColors = [
  colorTokens.primary[900],
  colorTokens.primary.main,
  colorTokens.primary[400],
  colorTokens.primary[200],
  colorTokens.primary[100],
];

// Data using Metabase colors
const renewalsData = [
  { color: segmentColors[0], count: 9, label: 'Ended', shortLabel: '9 Ended' },
  { color: segmentColors[1], count: 11, label: 'Under 3 Months', shortLabel: '11 < 3 Mo' },
  { color: segmentColors[2], count: 14, label: '3-6 Months', shortLabel: '14 3-6 Mo' },
  { color: segmentColors[3], count: 11, label: '6-9 Months', shortLabel: '11 6-9 Mo' },
  { color: segmentColors[4], count: 11, label: '9-12 Months', shortLabel: '11 9-12 Mo' },
];

const insuranceData = [
  { color: segmentColors[0], count: 3, label: 'Expired', shortLabel: '3 Expired' },
  { color: segmentColors[1], count: 3, label: '1-15 Days', shortLabel: '3 1-15 Days' },
  { color: segmentColors[2], count: 6, label: '16-30 Days', shortLabel: '6 16-30 Days' },
  { color: segmentColors[3], count: 5, label: '31-60 Days', shortLabel: '5 31-60 Days' },
];

// Metabase-style card wrapper
const MetabaseCard: React.FC<{ children: React.ReactNode; title: string; subtitle?: string; onReplay?: () => void }> = ({ 
  children, 
  title, 
  subtitle,
  onReplay 
}) => (
  <Card sx={{ 
    borderRadius: '4px', 
    border: `1px solid ${metabaseColors.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    bgcolor: metabaseColors.cardBg,
    overflow: 'visible'
  }}>
    <CardContent sx={{ p: '20px !important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1rem',
            color: metabaseColors.text,
            fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.01em'
          }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ 
              fontSize: '0.75rem', 
              color: metabaseColors.textLight,
              fontFamily: 'Lato, sans-serif',
              mt: 0.25
            }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {onReplay && (
          <Button 
            size="small" 
            startIcon={<Refresh sx={{ fontSize: '1rem' }} />} 
            onClick={onReplay}
            sx={{ 
              color: metabaseColors.primary,
              textTransform: 'none',
              fontFamily: 'Lato, sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
              '&:hover': { bgcolor: `${metabaseColors.primary}10` }
            }}
          >
            Replay
          </Button>
        )}
      </Box>
      {children}
    </CardContent>
  </Card>
);

// Metabase-style legend item
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    <Box sx={{ 
      width: 12, 
      height: 12, 
      borderRadius: '2px', 
      bgcolor: color 
    }} />
    <Typography sx={{ 
      fontSize: '0.75rem', 
      color: metabaseColors.text,
      fontFamily: 'Lato, sans-serif'
    }}>
      {label}
    </Typography>
  </Box>
);

const ChartAlternativesDemo: React.FC = () => {
  const [rowAnim, setRowAnim] = useState(0);
  const [progressAnim, setProgressAnim] = useState(0);
  const [funnelAnim, setFunnelAnim] = useState(0);
  const [gaugeAnim, setGaugeAnim] = useState(0);
  const [stackedAnim, setStackedAnim] = useState(0);

  const totalRenewals = renewalsData.reduce((sum, d) => sum + d.count, 0);
  const totalInsurance = insuranceData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: metabaseColors.background, 
      p: 4,
      fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header - Metabase style */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ 
          fontWeight: 600, 
          fontSize: '1.5rem',
          color: metabaseColors.text,
          fontFamily: 'Lato, sans-serif',
          letterSpacing: '-0.02em',
          mb: 0.5
        }}>
          Chart Alternatives Demo
        </Typography>
        <Typography sx={{ 
          color: metabaseColors.textLight, 
          fontSize: '0.875rem',
          fontFamily: 'Lato, sans-serif'
        }}>
          Metabase-style chart options for Contract Renewals & Insurance Expirations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ===== OPTION 1: ROW CHARTS (Horizontal Bars) - Metabase Style ===== */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1.125rem',
            color: metabaseColors.primary,
            fontFamily: 'Lato, sans-serif',
            mb: 2
          }}>
            Option 1: Row Charts (Horizontal Bars)
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Contracts Expiring Soon" 
            subtitle={`${totalRenewals} total contracts`}
            onReplay={() => setRowAnim(p => p + 1)}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {renewalsData.map((item, index) => (
                <Box key={`${rowAnim}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    minWidth: 90,
                    flexShrink: 0
                  }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ 
                    flex: 1,
                    height: 12, 
                    bgcolor: 'grey.100', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${(item.count / 15) * 100}%` }}
                      transition={{ 
                        delay: index * 0.08, 
                        duration: 0.35, 
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{ 
                        height: '100%', 
                        background: item.color, 
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    minWidth: 24,
                    textAlign: 'right'
                  }}>
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Insurance Expiring Soon" 
            subtitle={`${totalInsurance} total policies`}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {insuranceData.map((item, index) => (
                <Box key={`${rowAnim}-ins-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    minWidth: 70,
                    flexShrink: 0
                  }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ 
                    flex: 1,
                    height: 12, 
                    bgcolor: 'grey.100', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${(item.count / 7) * 100}%` }}
                      transition={{ 
                        delay: index * 0.08, 
                        duration: 0.35, 
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{ 
                        height: '100%', 
                        background: item.color, 
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    minWidth: 24,
                    textAlign: 'right'
                  }}>
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

        {/* ===== OPTION 2: STACKED BAR - Metabase Style ===== */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1.125rem',
            color: metabaseColors.primary,
            fontFamily: 'Lato, sans-serif',
            mb: 2,
            mt: 2
          }}>
            Option 2: Stacked Bar Chart
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Contracts Expiring Soon"
            onReplay={() => setStackedAnim(p => p + 1)}
          >
            {/* Big number - Metabase style */}
            <Typography sx={{ 
              fontSize: '2.5rem', 
              fontWeight: 600, 
              color: metabaseColors.text,
              fontFamily: 'Lato, sans-serif',
              lineHeight: 1,
              mb: 2
            }}>
              {totalRenewals}
            </Typography>
            
            {/* Stacked bar */}
            <Box sx={{ 
              display: 'flex', 
              height: 24, 
              borderRadius: '4px', 
              overflow: 'hidden', 
              mb: 2 
            }}>
              {renewalsData.map((item, index) => (
                <motion.div
                  key={`${stackedAnim}-${index}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / totalRenewals) * 100}%` }}
                  transition={{ delay: index * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{ 
                    height: '100%', 
                    background: item.color,
                  }}
                />
              ))}
            </Box>

            {/* Legend - Metabase style (horizontal) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {renewalsData.map((item, index) => (
                <LegendItem key={index} color={item.color} label={item.shortLabel} />
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard title="Insurance Expiring Soon">
            <Typography sx={{ 
              fontSize: '2.5rem', 
              fontWeight: 600, 
              color: metabaseColors.text,
              fontFamily: 'Lato, sans-serif',
              lineHeight: 1,
              mb: 2
            }}>
              {totalInsurance}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              height: 24, 
              borderRadius: '4px', 
              overflow: 'hidden', 
              mb: 2 
            }}>
              {insuranceData.map((item, index) => (
                <motion.div
                  key={`${stackedAnim}-ins-${index}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / totalInsurance) * 100}%` }}
                  transition={{ delay: index * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{ 
                    height: '100%', 
                    background: item.color,
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {insuranceData.map((item, index) => (
                <LegendItem key={index} color={item.color} label={item.shortLabel} />
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

        {/* ===== OPTION 3: FUNNEL - Metabase Style ===== */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1.125rem',
            color: metabaseColors.primary,
            fontFamily: 'Lato, sans-serif',
            mb: 2,
            mt: 2
          }}>
            Option 3: Funnel Chart
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Contracts by Urgency"
            subtitle="Most urgent at bottom"
            onReplay={() => setFunnelAnim(p => p + 1)}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {[...renewalsData].reverse().map((item, index) => {
                const widths = ['100%', '85%', '70%', '55%', '40%'];
                return (
                  <motion.div
                    key={`${funnelAnim}-${index}`}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: widths[index], opacity: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <Box sx={{ 
                      width: '100%',
                      py: 1.25,
                      px: 2,
                      borderRadius: '4px',
                      bgcolor: item.color,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography sx={{ 
                        fontSize: '0.8125rem', 
                        fontWeight: 600, 
                        color: index > 2 ? 'white' : metabaseColors.text,
                        fontFamily: 'Lato, sans-serif'
                      }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        color: index > 2 ? 'white' : metabaseColors.text,
                        fontFamily: 'Lato, sans-serif'
                      }}>
                        {item.count}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </MetabaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Insurance by Urgency"
            subtitle="Most urgent at bottom"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {[...insuranceData].reverse().map((item, index) => {
                const widths = ['100%', '80%', '60%', '40%'];
                return (
                  <motion.div
                    key={`${funnelAnim}-ins-${index}`}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: widths[index], opacity: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <Box sx={{ 
                      width: '100%',
                      py: 1.25,
                      px: 2,
                      borderRadius: '4px',
                      bgcolor: item.color,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography sx={{ 
                        fontSize: '0.8125rem', 
                        fontWeight: 600, 
                        color: index > 1 ? 'white' : metabaseColors.text,
                        fontFamily: 'Lato, sans-serif'
                      }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        color: index > 1 ? 'white' : metabaseColors.text,
                        fontFamily: 'Lato, sans-serif'
                      }}>
                        {item.count}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </MetabaseCard>
        </Grid>

        {/* ===== OPTION 4: DONUT/GAUGE - Metabase Style ===== */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1.125rem',
            color: metabaseColors.primary,
            fontFamily: 'Lato, sans-serif',
            mb: 2,
            mt: 2
          }}>
            Option 4: Donut Chart (Metabase Style)
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Contracts Expiring Soon"
            onReplay={() => setGaugeAnim(p => p + 1)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Donut chart */}
              <Box sx={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {renewalsData.map((item, index) => {
                    const total = renewalsData.reduce((sum, d) => sum + d.count, 0);
                    let startPercent = 0;
                    for (let i = 0; i < index; i++) {
                      startPercent += renewalsData[i].count / total;
                    }
                    const segmentPercent = item.count / total;
                    const circumference = 2 * Math.PI * 50;
                    
                    return (
                      <motion.circle
                        key={`${gaugeAnim}-${index}`}
                        cx="70"
                        cy="70"
                        r="50"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={`${segmentPercent * circumference} ${circumference}`}
                        strokeDashoffset={-startPercent * circumference}
                        transform="rotate(-90 70 70)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.35 }}
                      />
                    );
                  })}
                </svg>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    lineHeight: 1 
                  }}>
                    {totalRenewals}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.625rem', 
                    color: metabaseColors.textLight,
                    fontFamily: 'Lato, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Total
                  </Typography>
                </Box>
              </Box>

              {/* Legend - vertical, Metabase style */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {renewalsData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '2px', 
                      bgcolor: item.color,
                      flexShrink: 0
                    }} />
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: metabaseColors.text,
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 500
                    }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: metabaseColors.text,
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 600,
                      ml: 'auto'
                    }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </MetabaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard title="Insurance Expiring Soon">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {insuranceData.map((item, index) => {
                    const total = insuranceData.reduce((sum, d) => sum + d.count, 0);
                    let startPercent = 0;
                    for (let i = 0; i < index; i++) {
                      startPercent += insuranceData[i].count / total;
                    }
                    const segmentPercent = item.count / total;
                    const circumference = 2 * Math.PI * 50;
                    
                    return (
                      <motion.circle
                        key={`${gaugeAnim}-ins-${index}`}
                        cx="70"
                        cy="70"
                        r="50"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={`${segmentPercent * circumference} ${circumference}`}
                        strokeDashoffset={-startPercent * circumference}
                        transform="rotate(-90 70 70)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.35 }}
                      />
                    );
                  })}
                </svg>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 600, 
                    color: metabaseColors.text,
                    fontFamily: 'Lato, sans-serif',
                    lineHeight: 1 
                  }}>
                    {totalInsurance}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.625rem', 
                    color: metabaseColors.textLight,
                    fontFamily: 'Lato, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Total
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {insuranceData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '2px', 
                      bgcolor: item.color,
                      flexShrink: 0
                    }} />
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: metabaseColors.text,
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 500
                    }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: metabaseColors.text,
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 600,
                      ml: 'auto'
                    }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </MetabaseCard>
        </Grid>

        {/* ===== OPTION 5: VERTICAL BAR CHART - Metabase Style ===== */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '1.125rem',
            color: metabaseColors.primary,
            fontFamily: 'Lato, sans-serif',
            mb: 2,
            mt: 2
          }}>
            Option 5: Vertical Bar Chart
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Contracts Expiring Soon"
            subtitle={`${totalRenewals} total`}
            onReplay={() => setProgressAnim(p => p + 1)}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end', 
              height: 160, 
              mt: 2,
              pt: 2,
              borderBottom: `1px solid ${metabaseColors.border}`
            }}>
              {renewalsData.map((item, index) => (
                <Box key={`${progressAnim}-${index}`} sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  flex: 1
                }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / 15) * 120}px` }}
                    transition={{ delay: index * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ 
                      width: 32, 
                      background: item.color, 
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                </Box>
              ))}
            </Box>
            
            {/* X-axis labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {renewalsData.map((item, index) => (
                <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '0.625rem', 
                    color: metabaseColors.textLight,
                    fontFamily: 'Lato, sans-serif',
                    lineHeight: 1.2
                  }}>
                    {item.label.split(' ').map((word, i) => (
                      <span key={i}>{word}<br/></span>
                    ))}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetabaseCard 
            title="Insurance Expiring Soon"
            subtitle={`${totalInsurance} total`}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'flex-end', 
              height: 160, 
              mt: 2,
              pt: 2,
              borderBottom: `1px solid ${metabaseColors.border}`
            }}>
              {insuranceData.map((item, index) => (
                <Box key={`${progressAnim}-ins-${index}`} sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  flex: 1
                }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / 7) * 120}px` }}
                    transition={{ delay: index * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ 
                      width: 40, 
                      background: item.color, 
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              {insuranceData.map((item, index) => (
                <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    color: metabaseColors.textLight,
                    fontFamily: 'Lato, sans-serif'
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MetabaseCard>
        </Grid>

      </Grid>

      {/* Recommendation - Metabase style info box */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: '4px', 
        bgcolor: `${metabaseColors.primary}08`,
        border: `1px solid ${metabaseColors.primary}20`
      }}>
        <Typography sx={{ 
          fontWeight: 600, 
          fontSize: '1rem',
          color: metabaseColors.primary,
          fontFamily: 'Lato, sans-serif',
          mb: 1
        }}>
          💡 Recommendation
        </Typography>
        <Typography sx={{ 
          color: metabaseColors.text, 
          fontSize: '0.875rem',
          fontFamily: 'Lato, sans-serif',
          lineHeight: 1.6 
        }}>
          <strong>Option 1 (Row Charts)</strong> or <strong>Option 4 (Donut)</strong> are the most Metabase-like choices. 
          Row charts are excellent for comparing categories with clear labels. Donut charts with side legends 
          match Metabase's typical composition view. All options use Metabase's signature animation timing 
          (350ms, Material Standard easing).
        </Typography>
      </Box>
    </Box>
  );
};

export default ChartAlternativesDemo;
