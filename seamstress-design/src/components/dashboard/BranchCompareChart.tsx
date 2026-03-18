/**
 * BranchCompareChart Component
 *
 * Visualizes branches relative to main branch, showing commits ahead and behind
 * using a horizontal bar chart style visualization.
 */

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Tooltip,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import type { BranchInfo } from './GitStatusCard';

export interface BranchCompareChartProps {
  /** List of branches to visualize */
  branches: BranchInfo[];
  /** Maximum commits to scale the chart (auto-calculated if not provided) */
  maxCommits?: number;
  /** Height of each branch bar */
  barHeight?: number;
  /** Show only branches with ahead/behind data */
  showOnlyDiverged?: boolean;
  /** Maximum branches to display */
  maxBranches?: number;
  /** Click handler for branch */
  onBranchClick?: (branch: BranchInfo) => void;
}

/**
 * BranchCompareChart - Visual representation of branch positions relative to main
 *
 * Shows a horizontal visualization where:
 * - Center line represents main branch
 * - Bars extending right show commits ahead (to be merged into main)
 * - Bars extending left show commits behind (main has moved ahead)
 * - Diverged branches show both directions
 */
const BranchCompareChart: React.FC<BranchCompareChartProps> = ({
  branches,
  maxCommits: maxCommitsProp,
  barHeight = 32,
  showOnlyDiverged = false,
  maxBranches = 10,
  onBranchClick,
}) => {
  const theme = useTheme();

  // Filter branches based on showOnlyDiverged
  const filteredBranches = React.useMemo(() => {
    let result = branches.filter((b) => !b.isDefault); // Exclude main/default branch

    if (showOnlyDiverged) {
      result = result.filter((b) => b.aheadBy || b.behindBy);
    }

    // Sort by total divergence (ahead + behind), descending
    result.sort((a, b) => {
      const totalA = (a.aheadBy || 0) + (a.behindBy || 0);
      const totalB = (b.aheadBy || 0) + (b.behindBy || 0);
      return totalB - totalA;
    });

    return result.slice(0, maxBranches);
  }, [branches, showOnlyDiverged, maxBranches]);

  // Calculate max commits for scaling
  const maxCommits = React.useMemo(() => {
    if (maxCommitsProp) return maxCommitsProp;

    let max = 1;
    filteredBranches.forEach((branch) => {
      if (branch.aheadBy && branch.aheadBy > max) max = branch.aheadBy;
      if (branch.behindBy && branch.behindBy > max) max = branch.behindBy;
    });

    // Round up to nearest nice number for better visualization
    if (max <= 5) return 5;
    if (max <= 10) return 10;
    if (max <= 25) return 25;
    if (max <= 50) return 50;
    return Math.ceil(max / 10) * 10;
  }, [filteredBranches, maxCommitsProp]);

  // Calculate bar width percentage
  const getBarWidth = (commits: number) => {
    return (commits / maxCommits) * 100;
  };

  if (filteredBranches.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          All branches are up to date with main
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Branch Comparison
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 0.5,
                bgcolor: 'info.main',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Ahead
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 0.5,
                bgcolor: 'warning.main',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Behind
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Scale indicator */}
      <Box sx={{ mb: 2, px: 1 }}>
        <Stack direction="row" alignItems="center" sx={{ height: 20 }}>
          {/* Left scale label */}
          <Box sx={{ width: 120, flexShrink: 0 }} />

          {/* Scale bar */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative' }}>
              <Typography variant="caption" color="text.secondary" position="absolute" left={0}>
                -{maxCommits}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                position="absolute"
                left="50%"
                style={{ transform: 'translateX(-50%)' }}
              >
                main
              </Typography>
              <Typography variant="caption" color="text.secondary" position="absolute" right={0}>
                +{maxCommits}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Branch bars */}
      <Stack spacing={1}>
        {filteredBranches.map((branch) => {
          const aheadWidth = getBarWidth(branch.aheadBy || 0);
          const behindWidth = getBarWidth(branch.behindBy || 0);
          const isDiverged = branch.aheadBy && branch.behindBy;

          return (
            <Box
              key={branch.name}
              onClick={() => onBranchClick?.(branch)}
              sx={{
                cursor: onBranchClick ? 'pointer' : 'default',
                '&:hover': onBranchClick
                  ? {
                      '& .branch-name': {
                        color: 'primary.main',
                      },
                    }
                  : {},
              }}
            >
              <Stack direction="row" alignItems="center" sx={{ height: barHeight }}>
                {/* Branch name */}
                <Tooltip title={branch.name}>
                  <Box sx={{ width: 120, flexShrink: 0, pr: 1 }}>
                    <Typography
                      className="branch-name"
                      variant="body2"
                      fontFamily="monospace"
                      fontSize="0.75rem"
                      fontWeight={branch.isCurrent ? 600 : 400}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      style={{ transition: 'color 0.2s ease' }}
                    >
                      {branch.name}
                    </Typography>
                  </Box>
                </Tooltip>

                {/* Bar visualization */}
                <Box
                  sx={{
                    flex: 1,
                    height: barHeight - 8,
                    position: 'relative',
                    bgcolor: alpha(theme.palette.divider, 0.3),
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {/* Center line (main) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: theme.palette.text.secondary,
                      zIndex: 2,
                    }}
                  />

                  {/* Behind bar (extends left from center) */}
                  {branch.behindBy && branch.behindBy > 0 && (
                    <Tooltip title={`${branch.behindBy} commits behind main`}>
                      <Box
                        sx={{
                          position: 'absolute',
                          right: '50%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '70%',
                          width: `${behindWidth / 2}%`,
                          bgcolor: 'warning.main',
                          borderRadius: '4px 0 0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          pl: behindWidth > 15 ? 0.5 : 0,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'warning.dark',
                            height: '85%',
                          },
                        }}
                      >
                        {behindWidth > 15 && (
                          <Typography
                            variant="caption"
                            color="white"
                            fontWeight={600}
                            fontSize="0.65rem"
                          >
                            -{branch.behindBy}
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  )}

                  {/* Ahead bar (extends right from center) */}
                  {branch.aheadBy && branch.aheadBy > 0 && (
                    <Tooltip title={`${branch.aheadBy} commits ahead of main`}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '70%',
                          width: `${aheadWidth / 2}%`,
                          bgcolor: 'info.main',
                          borderRadius: '0 4px 4px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          pr: aheadWidth > 15 ? 0.5 : 0,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'info.dark',
                            height: '85%',
                          },
                        }}
                      >
                        {aheadWidth > 15 && (
                          <Typography
                            variant="caption"
                            color="white"
                            fontWeight={600}
                            fontSize="0.65rem"
                          >
                            +{branch.aheadBy}
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  )}

                  {/* Current branch indicator */}
                  {branch.isCurrent && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        border: `2px solid white`,
                        zIndex: 3,
                      }}
                    />
                  )}
                </Box>

                {/* Commit counts */}
                <Box sx={{ width: 80, flexShrink: 0, pl: 1 }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    {branch.behindBy ? (
                      <Chip
                        size="small"
                        label={`-${branch.behindBy}`}
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.dark',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    ) : null}
                    {branch.aheadBy ? (
                      <Chip
                        size="small"
                        label={`+${branch.aheadBy}`}
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: 'info.dark',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    ) : null}
                    {!branch.aheadBy && !branch.behindBy && (
                      <Typography variant="caption" color="text.secondary">
                        up to date
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* Summary footer */}
      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ArrowForwardIcon sx={{ fontSize: 14, color: 'info.main' }} />
            <Typography variant="caption" color="text.secondary">
              {filteredBranches.reduce((sum, b) => sum + (b.aheadBy || 0), 0)} total commits ahead
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ArrowBackIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            <Typography variant="caption" color="text.secondary">
              {filteredBranches.reduce((sum, b) => sum + (b.behindBy || 0), 0)} total commits behind
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default BranchCompareChart;
