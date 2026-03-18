import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import type { Inspector, InspectionScheduleSlot } from '../../types/inspection';

interface InspectorAvailabilityProps {
  inspectors: Inspector[];
  availableSlots: InspectionScheduleSlot[];
  inspectionType?: string;
  dateRange?: { start: string; end: string };
  onSchedule?: (inspectorId: string, slot: InspectionScheduleSlot) => void;
  onViewCalendar?: (inspectorId: string) => void;
}

export const InspectorAvailability: React.FC<InspectorAvailabilityProps> = ({
  inspectors,
  availableSlots,
  inspectionType,
  dateRange,
  onSchedule,
  onViewCalendar,
}) => {
  const getInspectorSlots = (inspectorId: string) =>
    availableSlots.filter(slot => slot.inspectorId === inspectorId && slot.isAvailable);

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'success';
    if (utilization < 80) return 'warning';
    return 'error';
  };

  const formatTimeSlot = (slot: InspectionScheduleSlot) => {
    const date = new Date(slot.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${slot.time}`;
  };

  const availableInspectors = inspectors.filter(i => i.status === 'available');

  if (availableInspectors.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No inspectors are currently available for {inspectionType || 'inspections'} during this time period.
        Please try expanding your date range or contact scheduling.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'background.default', border: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <EventAvailableIcon color="primary" />
          <Typography variant="h6">Inspector Availability</Typography>
          {inspectionType && (
            <Chip label={inspectionType} size="small" color="primary" variant="outlined" />
          )}
        </Stack>

        {dateRange && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing availability from {new Date(dateRange.start).toLocaleDateString()} to{' '}
            {new Date(dateRange.end).toLocaleDateString()}
          </Typography>
        )}

        <List>
          {availableInspectors.map((inspector) => {
            const slots = getInspectorSlots(inspector.id);
            const utilization = (inspector.currentLoad / inspector.weeklyCapacity) * 100;

            return (
              <ListItem
                key={inspector.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={inspector.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {inspector.name}
                      </Typography>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Available"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Stack spacing={1}>
                        {/* Capacity Bar */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Capacity: {inspector.currentLoad}h / {inspector.weeklyCapacity}h
                            </Typography>
                            <Typography
                              variant="caption"
                              color={getUtilizationColor(utilization)}
                              fontWeight="medium"
                            >
                              {Math.round(utilization)}% utilized
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={utilization}
                            color={getUtilizationColor(utilization)}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>

                        {/* Available Time Slots */}
                        {slots.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Available slots:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                              {slots.slice(0, 5).map((slot, idx) => (
                                <Chip
                                  key={idx}
                                  label={formatTimeSlot(slot)}
                                  size="small"
                                  icon={<AccessTimeIcon />}
                                  onClick={() => onSchedule?.(inspector.id, slot)}
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                              {slots.length > 5 && (
                                <Chip
                                  label={`+${slots.length - 5} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}

                        {/* Certifications */}
                        <Stack direction="row" spacing={0.5}>
                          {inspector.certifications.slice(0, 3).map((cert) => (
                            <Chip
                              key={cert}
                              label={cert}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          ))}
                          {inspector.certifications.length > 3 && (
                            <Chip
                              label={`+${inspector.certifications.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  }
                />
                <Box sx={{ ml: 2 }}>
                  <Button
                    startIcon={<CalendarTodayIcon />}
                    onClick={() => onViewCalendar?.(inspector.id)}
                    size="small"
                  >
                    View Calendar
                  </Button>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};