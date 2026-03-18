import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  Box,
  Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';

interface ScheduleActionsProps {
  onAccept: () => void;
  onReject: (reason?: string) => void;
  onModify?: () => void;
  isProcessing?: boolean;
}

export const ScheduleActions: React.FC<ScheduleActionsProps> = ({
  onAccept,
  onReject,
  onModify,
  isProcessing = false,
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedAction, setSelectedAction] = useState<'accepted' | 'rejected' | 'modified' | null>(null);

  const handleAccept = () => {
    setSelectedAction('accepted');
    onAccept();
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    setSelectedAction('rejected');
    onReject(rejectReason);
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const cancelReject = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  };

  return (
    <>
      <Card
        sx={{
          mt: 3,
          maxWidth: 'sm',
          mx: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          bgcolor: 'background.primary',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
            Review Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please review the proposed schedule above. You can accept it as is, request modifications, or reject it with feedback.
          </Typography>

          {/* Show selected action chip */}
          {selectedAction && (
            <Fade in={true} timeout={300}>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={
                    selectedAction === 'accepted' ? '✓ Schedule Accepted' :
                    selectedAction === 'rejected' ? '✗ Schedule Rejected' :
                    '✎ Modifications Requested'
                  }
                  color={
                    selectedAction === 'accepted' ? 'success' :
                    selectedAction === 'rejected' ? 'error' :
                    'primary'
                  }
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                />
              </Box>
            </Fade>
          )}
        </CardContent>
        {!selectedAction && (
          <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleAccept}
            disabled={isProcessing}
            sx={{
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark',
              },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Accept Schedule
          </Button>

          {onModify && (
            <Button
              variant="outlined"
              startIcon={<EditNoteIcon />}
              onClick={() => {
                setSelectedAction('modified');
                onModify();
              }}
              disabled={isProcessing}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(75, 63, 255, 0.04)',
                },
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Request Changes
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleReject}
            disabled={isProcessing}
            sx={{
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'rgba(211, 47, 47, 0.04)',
              },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Reject
          </Button>
          </CardActions>
        )}
      </Card>

      {/* Reject Reason Dialog */}
      <Dialog open={showRejectDialog} onClose={cancelReject} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Schedule</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this schedule (optional):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., Need to prioritize different tasks, crew availability concerns, etc."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelReject} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            sx={{
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Alternative inline version for simpler use cases
export const ScheduleActionsInline: React.FC<{
  onAccept: () => void;
  onReject: () => void;
}> = ({ onAccept, onReject }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        mt: 3,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        justifyContent: 'center',
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<CheckCircleIcon />}
        onClick={onAccept}
        sx={{
          bgcolor: 'success.main',
          '&:hover': {
            bgcolor: 'success.dark',
          },
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 160,
          py: 1.5,
        }}
      >
        Accept & Publish
      </Button>
      <Button
        variant="outlined"
        size="large"
        startIcon={<CancelIcon />}
        onClick={onReject}
        sx={{
          borderColor: 'error.main',
          color: 'error.main',
          '&:hover': {
            borderColor: 'error.main',
            bgcolor: 'rgba(211, 47, 47, 0.04)',
          },
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 160,
          py: 1.5,
        }}
      >
        Reject & Modify
      </Button>
    </Stack>
  );
};