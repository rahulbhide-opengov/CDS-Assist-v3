/**
 * AIActionsPanel
 *
 * Gen UX Audit workspace for viewing and managing AI actions.
 * Replaces the mock tasks table with real action tracking.
 *
 * Features:
 * - Pending Section: Actions awaiting approval
 * - History Section: Grouped by relationship or time
 * - Dual view modes: Grouped list and visual timeline
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Typography,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { AIActionLog, ActionRelationshipGroup, ActionFilterOptions } from '../../types/aiActions';
import { ActionCard } from './ActionCard';
import { ActionRelationshipViews } from './ActionRelationshipViews';

interface AIActionsPanelProps {
  /** All actions (pending + history) */
  actions: AIActionLog[];
  /** Action groups for relationship visualization */
  actionGroups: ActionRelationshipGroup[];
  /** Callback to approve an action */
  onApprove?: (actionId: string) => void;
  /** Callback to reject an action */
  onReject?: (actionId: string) => void;
  /** Callback to undo an approved action */
  onUndo?: (actionId: string) => void;
  /** Callback to approve all pending actions */
  onApproveAll?: () => void;
}

type TabValue = 'pending' | 'history';

export const AIActionsPanel: React.FC<AIActionsPanelProps> = ({
  actions,
  actionGroups,
  onApprove,
  onReject,
  onUndo,
  onApproveAll,
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ActionFilterOptions>({});

  // Separate pending and completed actions
  const pendingActions = useMemo(
    () => actions.filter((a) => a.status === 'pending'),
    [actions]
  );

  const historyActions = useMemo(
    () => actions.filter((a) => a.status !== 'pending'),
    [actions]
  );

  // Filter actions based on search query
  const filterActions = (actionList: AIActionLog[]): AIActionLog[] => {
    if (!searchQuery.trim()) return actionList;

    const query = searchQuery.toLowerCase();
    return actionList.filter(
      (action) =>
        action.target.sectionTitle?.toLowerCase().includes(query) ||
        action.metadata.agentName.toLowerCase().includes(query) ||
        action.type.toLowerCase().includes(query)
    );
  };

  // Group history actions by relationship or time
  const historyGroups = useMemo((): ActionRelationshipGroup[] => {
    if (actionGroups.length > 0) {
      // Use existing groups if available
      return actionGroups.map((group) => ({
        ...group,
        actions: filterActions(group.actions.filter((a) => a.status !== 'pending')),
      })).filter(g => g.actions.length > 0);
    }

    // Fallback: Group by time
    const filteredHistory = filterActions(historyActions);
    if (filteredHistory.length === 0) return [];

    return [{
      groupId: 'all',
      groupName: 'All Actions',
      timestamp: filteredHistory[0]?.timestamp || new Date().toISOString(),
      actions: filteredHistory,
    }];
  }, [actionGroups, historyActions, searchQuery]);

  const filteredPending = filterActions(pendingActions);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          AI Actions
        </Typography>

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 1,
            },
          }}
        >
          <Tab
            value="pending"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <PendingActionsIcon fontSize="small" />
                <span>Pending</span>
                {pendingActions.length > 0 && (
                  <Badge
                    badgeContent={pendingActions.length}
                    color="warning"
                    sx={{ ml: 1 }}
                  />
                )}
              </Stack>
            }
          />
          <Tab
            value="history"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <HistoryIcon fontSize="small" />
                <span>History</span>
                {historyActions.length > 0 && (
                  <Chip
                    label={historyActions.length}
                    size="small"
                    sx={{ height: 20, fontSize: '11px' }}
                  />
                )}
              </Stack>
            }
          />
        </Tabs>
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {activeTab === 'pending' ? (
          // Pending Actions Tab
          <Box>
            {filteredPending.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  color: 'text.secondary',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">No pending actions</Typography>
                <Typography variant="body2" color="text.disabled">
                  All actions have been reviewed
                </Typography>
              </Box>
            ) : (
              <>
                {/* Approve All Button */}
                {onApproveAll && filteredPending.length > 1 && (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={onApproveAll}
                    fullWidth
                    sx={{ mb: 2, textTransform: 'none' }}
                  >
                    Approve All ({filteredPending.length})
                  </Button>
                )}

                {/* Pending Action Cards */}
                <Stack spacing={1}>
                  {filteredPending.map((action) => (
                    <ActionCard
                      key={action.actionId}
                      action={action}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Box>
        ) : (
          // History Tab with Relationship Views
          <ActionRelationshipViews
            groups={historyGroups}
            onUndo={onUndo}
          />
        )}
      </Box>

      {/* Footer Stats */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {actions.length} total action{actions.length !== 1 ? 's' : ''}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {actions.filter((a) => a.status === 'approved').length} approved
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {pendingActions.length} pending
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AIActionsPanel;
