import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { MapWidget as MapWidgetType } from '../../types/dashboard.types';

interface MapWidgetProps {
  widget: MapWidgetType;
  isAgentGenerated?: boolean;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ widget, isAgentGenerated }) => {
  const theme = useTheme();
  const { title, markers, center, zoom = 12 } = widget;

  // Simple map visualization (in a real app, this would use Leaflet or Mapbox)
  // For now, we'll show a placeholder with marker list

  const getPriorityColor = (priority?: string) => {
    const colorMap: Record<string, string> = {
      low: theme.palette.text.secondary,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      urgent: theme.palette.error.dark
    };
    return colorMap[priority || 'low'] || theme.palette.text.secondary;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">
            {title}
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
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'grey.200',
            borderRadius: 1,
            position: 'relative',
            overflow: 'auto',
            p: 2
          }}
        >
          {/* Placeholder map background */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {markers.length} locations
            </Typography>
            {markers.slice(0, 8).map((marker) => (
              <Box
                key={marker.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  bgcolor: 'white',
                  borderRadius: 1,
                  fontSize: '12px'
                }}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: 16,
                    color: getPriorityColor(marker.priority)
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" fontWeight={600} display="block">
                    {marker.name}
                  </Typography>
                  {marker.description && (
                    <Typography variant="caption" color="text.secondary" fontSize="10px">
                      {marker.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            {markers.length > 8 && (
              <Typography variant="caption" color="text.secondary" align="center">
                +{markers.length - 8} more locations
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
