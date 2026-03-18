/**
 * ActionCard
 *
 * Individual action card for the AIActionsPanel.
 * Displays action type, section title, timestamp, status, and approve/reject buttons.
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import PendingIcon from '@mui/icons-material/Pending';
import UndoIcon from '@mui/icons-material/Undo';
import type { AIActionLog, AIActionStatus, AIActionType } from '../../types/aiActions';

interface ActionCardProps {
  action: AIActionLog;
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
  onUndo?: (actionId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showPreview?: boolean;
}

/**
 * Get the icon for an action type
 */
function getActionTypeIcon(type: AIActionType): React.ReactNode {
  switch (type) {
    case 'add_section':
      return <AddCircleOutlineIcon sx={{ color: 'success.main' }} />;
    case 'update_section':
      return <EditIcon sx={{ color: 'info.main' }} />;
    case 'delete_section':
      return <DeleteOutlineIcon sx={{ color: 'error.main' }} />;
    case 'navigate':
      return <NavigateNextIcon sx={{ color: 'primary.main' }} />;
    default:
      return <EditIcon />;
  }
}

/**
 * Get the status chip configuration
 */
function getStatusConfig(status: AIActionStatus): {
  label: string;
  color: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon: React.ReactNode;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        color: 'warning',
        icon: <PendingIcon sx={{ fontSize: 14 }} />,
      };
    case 'approved':
      return {
        label: 'Approved',
        color: 'success',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'error',
        icon: <CancelIcon sx={{ fontSize: 14 }} />,
      };
    case 'auto_applied':
      return {
        label: 'Auto-Applied',
        color: 'info',
        icon: <AutoModeIcon sx={{ fontSize: 14 }} />,
      };
    default:
      return {
        label: 'Unknown',
        color: 'default',
        icon: null,
      };
  }
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  onApprove,
  onReject,
  onUndo,
  isExpanded = false,
  onToggleExpand,
  showPreview = true,
}) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const expanded = onToggleExpand ? isExpanded : localExpanded;

  const statusConfig = getStatusConfig(action.status);
  const isPending = action.status === 'pending';
  const isApproved = action.status === 'approved';
  const hasPreview = action.payload.previewContent && showPreview;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        borderColor: isPending ? 'warning.main' : 'divider',
        borderWidth: isPending ? 2 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: isPending ? 'warning.dark' : 'primary.main',
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        {/* Header Row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Action Type Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getActionTypeIcon(action.type)}
            </Box>

            {/* Section Title */}
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {action.target.sectionTitle || 'Unknown Section'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(action.timestamp)}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Status Chip */}
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              icon={statusConfig.icon as React.ReactElement}
              sx={{
                fontSize: '11px',
                height: '24px',
                '& .MuiChip-icon': {
                  fontSize: '14px',
                  ml: 0.5,
                },
              }}
            />

            {/* Expand Button (only if has preview) */}
            {hasPreview && (
              <IconButton size="small" onClick={handleToggle}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Preview Content (Collapsible) */}
        {hasPreview && (
          <Collapse in={expanded}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {action.payload.previewContent?.title}
              </Typography>
              <Box
                sx={{
                  fontSize: '13px',
                  lineHeight: 1.5,
                  '& h3': { fontSize: '14px', fontWeight: 600, mt: 1, mb: 0.5 },
                  '& ul': { pl: 2, my: 0.5 },
                  '& li': { mb: 0.25 },
                  '& p': { my: 0.5 },
                }}
                dangerouslySetInnerHTML={{
                  __html: action.payload.previewContent?.body || '',
                }}
              />
            </Box>
          </Collapse>
        )}

        {/* Action Buttons */}
        {isPending && (onApprove || onReject) && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {onApprove && (
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => onApprove(action.actionId)}
                sx={{ flex: 1, textTransform: 'none' }}
              >
                Approve
              </Button>
            )}
            {onReject && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => onReject(action.actionId)}
                sx={{ flex: 1, textTransform: 'none' }}
              >
                Reject
              </Button>
            )}
          </Stack>
        )}

        {/* Undo Button (for approved actions) */}
        {isApproved && onUndo && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UndoIcon />}
              onClick={() => onUndo(action.actionId)}
              sx={{ textTransform: 'none' }}
            >
              Undo
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionCard;
