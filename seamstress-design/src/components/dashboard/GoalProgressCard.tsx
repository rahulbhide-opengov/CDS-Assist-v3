import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Stack,
  useTheme,
  Skeleton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Status types for goal progress
 */
export type GoalStatus = 'on-track' | 'at-risk' | 'behind' | 'completed';

/**
 * Props for the GoalProgressCard component
 */
export interface GoalProgressCardProps {
  /** Title/name of the goal */
  title: string;
  /** Current progress value */
  current: number;
  /** Target/goal value */
  target: number;
  /** Optional unit (e.g., "%", "tasks", "$") */
  unit?: string;
  /** Status of goal progress */
  status: GoalStatus;
  /** Optional time remaining indicator */
  timeRemaining?: string;
  /** Optional description or subtitle */
  description?: string;
  /** Loading state */
  loading?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * GoalProgressCard - Shows progress toward goals with status indicators
 *
 * Features:
 * - Visual progress bar
 * - Status indicators (on-track, at-risk, behind, completed)
 * - Current vs target values
 * - Time remaining display
 * - Color-coded status badges
 * - Responsive design
 *
 * @example
 * ```tsx
 * <GoalProgressCard
 *   title="Monthly Sales Target"
 *   current={8500}
 *   target={10000}
 *   unit="$"
 *   status="on-track"
 *   timeRemaining="12 days left"
 *   description="Q4 2024 goal"
 * />
 * ```
 */
const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  title,
  current,
  target,
  unit = '',
  status,
  timeRemaining,
  description,
  loading = false,
  onClick,
}) => {
  const theme = useTheme();

  const progress = Math.min((current / target) * 100, 100);

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          color: 'success.main',
          bgColor: 'rgba(46, 125, 50, 0.12)',
          label: 'Completed',
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        };
      case 'on-track':
        return {
          color: 'success.main',
          bgColor: 'rgba(46, 125, 50, 0.12)',
          label: 'On Track',
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        };
      case 'at-risk':
        return {
          color: 'warning.main',
          bgColor: 'rgba(237, 108, 2, 0.12)',
          label: 'At Risk',
          icon: <WarningIcon sx={{ fontSize: 16 }} />,
        };
      case 'behind':
        return {
          color: 'error.main',
          bgColor: 'rgba(211, 47, 47, 0.12)',
          label: 'Behind',
          icon: <ErrorIcon sx={{ fontSize: 16 }} />,
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (loading) {
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="40%" height={20} sx={{ my: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={8} sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="30%" height={24} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-2px)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Typography variant="h6" component="div" fontWeight={600}>
                {title}
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                size="small"
                sx={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.color,
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    color: statusConfig.color,
                  },
                }}
              />
            </Stack>
            {description && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {description}
              </Typography>
            )}
          </Box>

          {/* Progress Bar */}
          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: statusConfig.color,
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          {/* Values and Time Remaining */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="span" fontWeight={600}>
                {unit}
                {current.toLocaleString()}
              </Typography>
              <Typography variant="body2" component="span" color="text.secondary" ml={1}>
                / {unit}
                {target.toLocaleString()}
              </Typography>
            </Box>
            {timeRemaining && (
              <Typography variant="body2" color="text.secondary">
                {timeRemaining}
              </Typography>
            )}
          </Stack>

          {/* Progress Percentage */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {progress.toFixed(1)}% complete
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;
