import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  Button,
  IconButton,
  Collapse,
  Grid,
  Divider,
  Link,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { DailyInspectionSummary, InspectionEvent } from '../../types/inspection';

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface DailyInspectionSummaryProps {
  summary: DailyInspectionSummary;
  inspectionEvents: InspectionEvent[];
  onViewInspection?: (inspectionId: string) => void;
  onPrintReport?: () => void;
  onEmailReport?: () => void;
}

export const DailyInspectionSummaryComponent: React.FC<DailyInspectionSummaryProps> = ({
  summary,
  inspectionEvents,
  onViewInspection,
  onPrintReport,
  onEmailReport,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'pass':
        return <CheckCircleIcon color="success" />;
      case 'fail':
        return <ErrorIcon color="error" />;
      case 'cancelled':
        return <CancelIcon color="disabled" />;
      default:
        return <AssignmentIcon color="action" />;
    }
  };

  const getResultColor = (result?: string): any => {
    switch (result) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'warning';
    }
  };

  const passRate = summary.completed > 0
    ? Math.round((summary.passed / summary.completed) * 100)
    : 0;

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 2, border: 1, borderColor: 'divider' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{summary.inspectorName}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(summary.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={onPrintReport}>
            <PrintIcon />
          </IconButton>
          <IconButton size="small" onClick={onEmailReport}>
            <EmailIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Stack>
      </Stack>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'divider' }}>
            <Typography variant="h4" fontWeight="medium">
              {summary.totalInspections}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Scheduled
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'divider' }}>
            <Typography variant="h4" fontWeight="medium" color="success.main">
              {summary.passed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Passed
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'divider' }}>
            <Typography variant="h4" fontWeight="medium" color="error.main">
              {summary.failed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Failed
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: passRate >= 70 ? 'success.light' : 'warning.light',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h4" fontWeight="medium">
              {passRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pass Rate
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip
          icon={<AccessTimeIcon />}
          label={`Avg Duration: ${summary.averageDuration} min`}
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<LocationOnIcon />}
          label={`${summary.locations.length} Locations`}
          variant="outlined"
          size="small"
        />
        {summary.cancelled > 0 && (
          <Chip
            label={`${summary.cancelled} Cancelled`}
            color="warning"
            variant="outlined"
            size="small"
          />
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Detailed Timeline */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          Inspection Timeline
        </Typography>

        <Timeline position="alternate">
          {inspectionEvents
            .filter(event => event.inspectorId === summary.inspectorId)
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
            .map((event, index) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent color="text.secondary" variant="body2">
                  {event.scheduledTime}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={getResultColor(event.result)}>
                    {getResultIcon(event.result)}
                  </TimelineDot>
                  {index < inspectionEvents.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: 'background.default',
                      border: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight="medium">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Inspection
                        </Typography>
                        <Chip
                          label={event.result || 'Pending'}
                          color={getResultColor(event.result)}
                          size="small"
                        />
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnIcon fontSize="small" color="action" />
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => onViewInspection?.(event.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {event.address}
                        </Link>
                      </Stack>

                      {event.permitNumber && (
                        <Typography variant="caption" color="text.secondary">
                          Permit: {event.permitNumber}
                        </Typography>
                      )}

                      {event.notes && (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                          "{event.notes}"
                        </Typography>
                      )}

                      <Button
                        size="small"
                        variant="text"
                        onClick={() => onViewInspection?.(event.id)}
                      >
                        View Details →
                      </Button>
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>

        {/* Location Summary */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
            Locations Visited
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {summary.locations.map((location, idx) => (
              <Chip
                key={idx}
                label={location}
                size="small"
                icon={<LocationOnIcon />}
                sx={{ mb: 1 }}
                onClick={() => {
                  // Could open location in maps
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Performance Notes */}
        {(summary.failed > 0 || passRate < 70) && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'warning.light',
              border: 1,
              borderColor: 'warning.main',
              borderLeft: 4,
              borderLeftColor: 'warning.main'
            }}
          >
            <Typography variant="subtitle2" fontWeight="medium">
              Performance Alert
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {summary.failed > 2 &&
                `High failure rate detected (${summary.failed} failures). Consider reviewing inspection criteria or providing additional support.`
              }
              {passRate < 70 && passRate > 0 &&
                ` Pass rate is below target (${passRate}% vs 70% target).`
              }
            </Typography>
          </Paper>
        )}
      </Collapse>
    </Paper>
  );
};