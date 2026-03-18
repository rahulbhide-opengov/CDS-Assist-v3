/**
 * SignatureBlockEditor Component
 * Configure signature blocks for document signing
 *
 * Features:
 * - Add/remove signers
 * - Set signature type (wet/electronic)
 * - Reorder signers
 * - Progress tracking
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import { useSignatures } from '../../../hooks/procurement/useSignatures';

interface SignatureBlockEditorProps {
  documentId: string;
  readOnly?: boolean;
}

export const SignatureBlockEditor: React.FC<SignatureBlockEditorProps> = ({
  documentId,
  readOnly = false,
}) => {
  const {
    signatures,
    isLoading,
    error,
    progress,
    addSignature,
    deleteSignature,
    updateSignature,
    clearError,
  } = useSignatures({ documentId });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSigner, setNewSigner] = useState({
    signerName: '',
    signerTitle: '',
    signerEmail: '',
    signatureType: 'electronic' as 'wet' | 'electronic',
    isRequired: true,
  });

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleAddSigner = async () => {
    if (!newSigner.signerName.trim() || !newSigner.signerTitle.trim()) {
      return;
    }

    await addSignature(newSigner);

    // Reset form
    setNewSigner({
      signerName: '',
      signerTitle: '',
      signerEmail: '',
      signatureType: 'electronic',
      isRequired: true,
    });
    setDialogOpen(false);
  };

  const handleDeleteSigner = async (signatureId: string, signerName: string) => {
    if (!confirm(`Remove ${signerName} from signature block?`)) return;
    await deleteSignature(signatureId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircleIcon fontSize="small" />;
      case 'declined':
        return <ErrorIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Signature Block</Typography>
            <Typography variant="body2" color="text.secondary">
              Configure who needs to sign this document and in what order
            </Typography>
          </Box>
          {!readOnly && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Add Signer
            </Button>
          )}
        </Stack>
      </Box>

      {/* Progress */}
      {signatures.length > 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Signature Progress
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {progress.signed} of {progress.total} signed ({progress.percentage}%)
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress.percentage}
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Chip label={`${progress.signed} Signed`} size="small" color="success" />
            <Chip label={`${progress.pending} Pending`} size="small" />
            {progress.declined > 0 && (
              <Chip label={`${progress.declined} Declined`} size="small" color="error" />
            )}
          </Stack>
        </Box>
      )}

      {/* Signature List */}
      {signatures.length > 0 ? (
        <Stack spacing={2}>
          {signatures.map((signature, index) => (
            <Paper
              key={signature.signatureId}
              elevation={0}
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Order */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </Box>

              {/* Drag Handle */}
              {!readOnly && (
                <DragIndicatorIcon sx={{ color: 'text.secondary', cursor: 'grab' }} fontSize="small" />
              )}

              {/* Icon */}
              <PersonIcon sx={{ color: 'text.secondary' }} />

              {/* Signer Info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {signature.signerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {signature.signerTitle}
                  {signature.signerEmail && ` • ${signature.signerEmail}`}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={signature.signatureType === 'wet' ? 'Wet Signature' : 'Electronic'}
                    size="small"
                    variant="outlined"
                  />
                  {signature.isRequired && (
                    <Chip label="Required" size="small" color="primary" variant="outlined" />
                  )}
                </Stack>
              </Box>

              {/* Status */}
              <Chip
                icon={getStatusIcon(signature.status)}
                label={signature.status.charAt(0).toUpperCase() + signature.status.slice(1)}
                size="small"
                color={getStatusColor(signature.status)}
              />

              {/* Actions */}
              {!readOnly && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteSigner(signature.signatureId, signature.signerName)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            No signers added yet
          </Typography>
          {!readOnly && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Add First Signer
            </Button>
          )}
        </Paper>
      )}

      {/* Add Signer Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Signer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Signer Name"
              value={newSigner.signerName}
              onChange={(e) => setNewSigner({ ...newSigner, signerName: e.target.value })}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Title"
              value={newSigner.signerTitle}
              onChange={(e) => setNewSigner({ ...newSigner, signerTitle: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newSigner.signerEmail}
              onChange={(e) => setNewSigner({ ...newSigner, signerEmail: e.target.value })}
              fullWidth
              helperText="Optional - for electronic signatures"
            />
            <FormControl fullWidth>
              <InputLabel>Signature Type</InputLabel>
              <Select
                value={newSigner.signatureType}
                label="Signature Type"
                onChange={(e) =>
                  setNewSigner({
                    ...newSigner,
                    signatureType: e.target.value as 'wet' | 'electronic',
                  })
                }
              >
                <MenuItem value="electronic">Electronic Signature</MenuItem>
                <MenuItem value="wet">Wet Signature (Physical)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSigner}
            disabled={!newSigner.signerName.trim() || !newSigner.signerTitle.trim()}
          >
            Add Signer
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
