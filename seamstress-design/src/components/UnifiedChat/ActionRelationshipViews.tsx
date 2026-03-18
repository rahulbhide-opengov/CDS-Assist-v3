/**
 * ActionRelationshipViews
 *
 * Toggle between two visualization modes for AI actions:
 * - Grouped List: Actions grouped by relationship/time
 * - Visual Timeline: Horizontal timeline with connected nodes
 */

import React, { useState } from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import type { AIActionLog, ActionRelationshipGroup, ActionViewMode } from '../../types/aiActions';
import { ActionCard } from './ActionCard';

interface ActionRelationshipViewsProps {
  groups: ActionRelationshipGroup[];
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
  onUndo?: (actionId: string) => void;
  defaultViewMode?: ActionViewMode;
}

/**
 * Get status icon for timeline node
 */
function getStatusIcon(status: string, size: number = 24) {
  const iconSx = { fontSize: size };
  switch (status) {
    case 'approved':
      return <CheckCircleIcon sx={{ ...iconSx, color: 'success.main' }} />;
    case 'pending':
      return <PendingIcon sx={{ ...iconSx, color: 'warning.main' }} />;
    case 'rejected':
      return <CancelIcon sx={{ ...iconSx, color: 'error.main' }} />;
    case 'auto_applied':
      return <AutoModeIcon sx={{ ...iconSx, color: 'info.main' }} />;
    default:
      return <PendingIcon sx={{ ...iconSx, color: 'text.disabled' }} />;
  }
}

/**
 * Get status color for timeline node
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
      return colorTokens.success.main;
    case 'pending':
      return colorTokens.warning.main;
    case 'rejected':
      return colorTokens.error.main;
    case 'auto_applied':
      return colorTokens.info.main;
    default:
      return colorTokens.grey[700];
  }
}

/**
 * Grouped List View Component
 */
const GroupedListView: React.FC<{
  groups: ActionRelationshipGroup[];
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
  onUndo?: (actionId: string) => void;
}> = ({ groups, onApprove, onReject, onUndo }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.map(g => g.groupId)));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  if (groups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="body2">No actions yet</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.groupId);
        const pendingCount = group.actions.filter(a => a.status === 'pending').length;
        const approvedCount = group.actions.filter(a => a.status === 'approved').length;

        return (
          <Box key={group.groupId}>
            {/* Group Header */}
            <Box
              onClick={() => toggleGroup(group.groupId)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                px: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton size="small" sx={{ p: 0 }}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography variant="subtitle2" fontWeight={600}>
                  {group.groupName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {group.actions.length} action{group.actions.length !== 1 ? 's' : ''}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5}>
                {pendingCount > 0 && (
                  <Tooltip title={`${pendingCount} pending`}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                      }}
                    />
                  </Tooltip>
                )}
                {approvedCount > 0 && (
                  <Tooltip title={`${approvedCount} approved`}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </Box>

            {/* Group Actions */}
            <Collapse in={isExpanded}>
              <Box sx={{ pl: 2, pt: 1 }}>
                {/* Tree lines */}
                <Box sx={{ position: 'relative' }}>
                  {group.actions.map((action, index) => (
                    <Box
                      key={action.actionId}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        position: 'relative',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          left: -12,
                          top: 0,
                          bottom: index === group.actions.length - 1 ? '50%' : 0,
                          width: 1,
                          bgcolor: 'divider',
                        },
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          left: -12,
                          top: '50%',
                          width: 12,
                          height: 1,
                          bgcolor: 'divider',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          left: -16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                        }}
                      >
                        {getStatusIcon(action.status, 16)}
                      </Box>
                      <Box sx={{ flex: 1, ml: 1 }}>
                        <ActionCard
                          action={action}
                          onApprove={onApprove}
                          onReject={onReject}
                          onUndo={onUndo}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
};

/**
 * Visual Timeline View Component
 */
const VisualTimelineView: React.FC<{
  groups: ActionRelationshipGroup[];
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
  onUndo?: (actionId: string) => void;
}> = ({ groups, onApprove, onReject, onUndo }) => {
  const [selectedAction, setSelectedAction] = useState<AIActionLog | null>(null);

  // Flatten all actions for timeline
  const allActions = groups.flatMap(g => g.actions);

  if (allActions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="body2">No actions yet</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Timeline */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          py: 3,
          px: 2,
          overflowX: 'auto',
        }}
      >
        {/* Timeline Line */}
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            right: 24,
            height: 2,
            bgcolor: 'divider',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Timeline Nodes */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {allActions.map((action, index) => {
            const isSelected = selectedAction?.actionId === action.actionId;
            const statusColor = getStatusColor(action.status);

            return (
              <Tooltip
                key={action.actionId}
                title={`${action.target.sectionTitle || 'Action'} - ${action.status}`}
              >
                <Box
                  onClick={() => setSelectedAction(isSelected ? null : action)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {/* Node */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      border: 3,
                      borderColor: statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? 3 : 1,
                    }}
                  >
                    {getStatusIcon(action.status, 18)}
                  </Box>

                  {/* Label */}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      maxWidth: 80,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {action.target.sectionTitle?.split(' ')[0] || 'Action'}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      </Box>

      {/* Selected Action Details */}
      <Collapse in={!!selectedAction}>
        {selectedAction && (
          <Box sx={{ mt: 2 }}>
            <ActionCard
              action={selectedAction}
              onApprove={onApprove}
              onReject={onReject}
              onUndo={onUndo}
            />
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

/**
 * Main ActionRelationshipViews Component
 */
export const ActionRelationshipViews: React.FC<ActionRelationshipViewsProps> = ({
  groups,
  onApprove,
  onReject,
  onUndo,
  defaultViewMode = 'grouped',
}) => {
  const [viewMode, setViewMode] = useState<ActionViewMode>(defaultViewMode);

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ActionViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box>
      {/* View Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="grouped" aria-label="grouped list view">
            <Tooltip title="Grouped List">
              <ViewListIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="timeline" aria-label="timeline view">
            <Tooltip title="Visual Timeline">
              <TimelineIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* View Content */}
      {viewMode === 'grouped' ? (
        <GroupedListView
          groups={groups}
          onApprove={onApprove}
          onReject={onReject}
          onUndo={onUndo}
        />
      ) : (
        <VisualTimelineView
          groups={groups}
          onApprove={onApprove}
          onReject={onReject}
          onUndo={onUndo}
        />
      )}
    </Box>
  );
};

export default ActionRelationshipViews;
