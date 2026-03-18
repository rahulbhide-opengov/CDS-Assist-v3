import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import type { MetricWidget as MetricWidgetType } from '../../types/dashboard.types';

interface MetricWidgetProps {
  widget: MetricWidgetType;
  isAgentGenerated?: boolean;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ widget, isAgentGenerated }) => {
  const theme = useTheme();

  // Map widget colors to theme colors
  const getColor = () => {
    switch (widget.color) {
      case 'blue': return theme.palette.primary.main;
      case 'green': return theme.palette.success.main;
      case 'orange': return theme.palette.warning.main;
      case 'red': return theme.palette.error.main;
      case 'purple': return theme.palette.secondary.main;
      case 'gray': return theme.palette.text.secondary;
      default: return theme.palette.primary.main;
    }
  };

  const getTrendIcon = () => {
    if (widget.trend === 'up') return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />;
    if (widget.trend === 'down') return <TrendingDownIcon sx={{ color: 'success.main', fontSize: 20 }} />;
    if (widget.trend === 'alert') return <WarningIcon sx={{ color: 'error.main', fontSize: 20 }} />;
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 0
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontSize="12px" fontWeight={500}>
            {widget.title}
          </Typography>
          {isAgentGenerated && (
            <Box
              component="span"
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '10px',
                fontWeight: 600
              }}
            >
              AI Generated
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
          <Typography
            variant="h3"
            fontSize="32px"
            fontWeight={700}
            color={getColor()}
            lineHeight={1}
          >
            {widget.value}
          </Typography>
          {getTrendIcon()}
        </Box>
        {widget.change && (
          <Typography variant="body2" color="text.secondary" fontSize="11px">
            {widget.change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
