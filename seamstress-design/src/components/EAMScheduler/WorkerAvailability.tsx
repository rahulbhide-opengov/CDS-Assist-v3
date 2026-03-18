import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Box,
  Typography,
  Switch,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { EAMCrew } from '../../types/opengov/eam';

interface WorkerAvailabilityProps {
  crews: EAMCrew[];
  onExclusionChange?: (crewId: string, excluded: boolean) => void;
  onExcludeAll?: () => void;
  onIncludeAll?: () => void;
}

export const WorkerAvailability: React.FC<WorkerAvailabilityProps> = ({
  crews,
  onExclusionChange,
  onExcludeAll,
  onIncludeAll
}) => {
  const [excludedCrews, setExcludedCrews] = useState<Set<string>>(new Set());

  const handleExclusionToggle = (crewId: string) => {
    const newExcluded = new Set(excludedCrews);
    if (newExcluded.has(crewId)) {
      newExcluded.delete(crewId);
      onExclusionChange?.(crewId, false);
    } else {
      newExcluded.add(crewId);
      onExclusionChange?.(crewId, true);
    }
    setExcludedCrews(newExcluded);
  };

  const handleExcludeAll = () => {
    const allCrewIds = new Set(crews.map(c => c.id));
    setExcludedCrews(allCrewIds);
    onExcludeAll?.();
  };

  const handleIncludeAll = () => {
    setExcludedCrews(new Set());
    onIncludeAll?.();
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return 'error';
    if (capacity >= 60) return 'warning';
    if (capacity >= 40) return 'info';
    return 'success';
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      available: 'success',
      busy: 'warning',
      unavailable: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2">
          <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Worker Availability
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<BlockIcon />}
            onClick={handleExcludeAll}
          >
            Exclude All
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={handleIncludeAll}
          >
            Include All
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Crew Name</TableCell>
              <TableCell>
                Capacity
                <Tooltip title="Current utilization percentage">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>Available Hours</TableCell>
              <TableCell>Current Assignments</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell align="center">Include</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crews.map((crew) => {
              const isExcluded = excludedCrews.has(crew.id);
              const capacityPercentage = Math.round((crew.currentCapacity / crew.maxCapacity) * 100);

              return (
                <TableRow
                  key={crew.id}
                  sx={{
                    opacity: isExcluded ? 0.6 : 1,
                    backgroundColor: isExcluded ? 'action.disabledBackground' : 'transparent'
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={500}>
                        {crew.name}
                      </Typography>
                      <Chip
                        label={crew.status}
                        size="small"
                        color={getStatusColor(crew.status)}
                        variant="outlined"
                        sx={{ height: 20 }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Box sx={{ width: '100%' }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {crew.currentCapacity}h / {crew.maxCapacity}h
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          color={`${getCapacityColor(capacityPercentage)}.main`}
                        >
                          {capacityPercentage}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={capacityPercentage}
                        color={getCapacityColor(capacityPercentage)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {crew.availableHours}h
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {crew.currentAssignments.length > 0 ? (
                      <Stack direction="row" spacing={0.5}>
                        {crew.currentAssignments.map(assignment => (
                          <Chip
                            key={assignment}
                            label={assignment}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                      {crew.skills.slice(0, 3).map(skill => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      ))}
                      {crew.skills.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{crew.skills.length - 3}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {crew.zone || 'All'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={!isExcluded}
                      onChange={() => handleExclusionToggle(crew.id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
        <Typography variant="body2" color="info.main">
          <strong>Tip:</strong> Excluding crews will prevent them from being assigned new tasks.
          Currently included: {crews.length - excludedCrews.size} of {crews.length} crews
        </Typography>
      </Box>
    </Box>
  );
};