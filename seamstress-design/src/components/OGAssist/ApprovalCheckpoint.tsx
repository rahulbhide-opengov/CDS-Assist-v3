/**
 * Approval Checkpoint Component
 * Human-in-the-Loop component for requesting user approval before agent actions
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

export interface ApprovalCheckpointProps {
  title: string;
  description?: string;
  actionDescription: string;
  actionDetails?: Record<string, any>;
  warningMessage?: string;
  onApprove: () => void;
  onReject: () => void;
  onModify?: () => void;
  approveButtonText?: string;
  rejectButtonText?: string;
  modifyButtonText?: string;
  variant?: 'default' | 'warning' | 'info';
}

export const ApprovalCheckpoint: React.FC<ApprovalCheckpointProps> = ({
  title,
  description,
  actionDescription,
  actionDetails,
  warningMessage,
  onApprove,
  onReject,
  onModify,
  approveButtonText = 'Approve & Continue',
  rejectButtonText = 'Cancel',
  modifyButtonText = 'Modify Details',
  variant = 'default',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    onReject();
  };

  const handleModify = () => {
    onModify?.();
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      default:
        return 'primary.main';
    }
  };

  const getVariantBgColor = () => {
    switch (variant) {
      case 'warning':
        return 'warning.light';
      case 'info':
        return 'info.light';
      default:
        return 'primary.light';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '2px solid',
        borderColor: getVariantColor(),
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Chip
              icon={<InfoOutlinedIcon />}
              label="Action Approval Required"
              size="small"
              sx={{
                backgroundColor: getVariantBgColor(),
                color: getVariantColor(),
                fontWeight: 600,
              }}
            />
          </Stack>
          <Typography variant="h6" fontWeight={600}>
            🤖 {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {description}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Action Description */}
        <Box>
          <Typography variant="body1" fontWeight={500} mb={1}>
            {actionDescription}
          </Typography>

          {/* Action Details */}
          {actionDetails && Object.keys(actionDetails).length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <List dense disablePadding>
                {Object.entries(actionDetails).map(([key, value]) => (
                  <ListItem key={key} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlineIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{key}:</strong> {String(value)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Warning Message */}
        {warningMessage && (
          <Alert severity="warning" sx={{ borderRadius: 1 }}>
            <Typography variant="body2">{warningMessage}</Typography>
          </Alert>
        )}

        {/* Information Alert */}
        <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ borderRadius: 1 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            What happens next:
          </Typography>
          <Typography variant="caption" component="div">
            • This action requires your explicit approval
          </Typography>
          <Typography variant="caption" component="div">
            • You can review and modify details before approving
          </Typography>
          <Typography variant="caption" component="div">
            • You maintain full control over the process
          </Typography>
        </Alert>

        <Divider />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={handleReject}
            disabled={isProcessing}
            startIcon={<CancelOutlinedIcon />}
          >
            {rejectButtonText}
          </Button>

          {onModify && (
            <Button
              variant="outlined"
              onClick={handleModify}
              disabled={isProcessing}
              startIcon={<EditOutlinedIcon />}
            >
              {modifyButtonText}
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={isProcessing}
            startIcon={<CheckCircleOutlineIcon />}
          >
            {isProcessing ? 'Processing...' : approveButtonText}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ApprovalCheckpoint;
