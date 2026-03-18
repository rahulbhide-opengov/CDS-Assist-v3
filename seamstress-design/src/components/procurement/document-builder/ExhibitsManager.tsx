/**
 * ExhibitsManager Component
 * Manage document exhibits with drag-and-drop upload
 *
 * Features:
 * - Drag-and-drop file upload
 * - File list with reordering
 * - Internal vs external classification
 * - Download and delete operations
 * - Loading states
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useExhibits } from '../../../hooks/procurement/useExhibits';

interface ExhibitsManagerProps {
  documentId: string;
  readOnly?: boolean;
}

export const ExhibitsManager: React.FC<ExhibitsManagerProps> = ({ documentId, readOnly = false }) => {
  const {
    externalExhibits,
    internalExhibits,
    isLoading,
    isUploading,
    error,
    totalFileSize,
    uploadMultiple,
    deleteExhibit,
    downloadExhibit,
    formatFileSize,
    clearError,
  } = useExhibits({ documentId });

  const [dragOverExternal, setDragOverExternal] = useState(false);
  const [dragOverInternal, setDragOverInternal] = useState(false);
  const externalFileInputRef = useRef<HTMLInputElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // Upload Handlers
  // ============================================================================

  const handleFilesSelected = async (files: FileList | null, isInternal: boolean) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    await uploadMultiple(fileArray, isInternal);

    // Reset file inputs
    if (externalFileInputRef.current) externalFileInputRef.current.value = '';
    if (internalFileInputRef.current) internalFileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent, isInternal: boolean) => {
    e.preventDefault();
    setDragOverExternal(false);
    setDragOverInternal(false);

    if (readOnly) return;

    const files = e.dataTransfer.files;
    await handleFilesSelected(files, isInternal);
  };

  const handleDragOver = (e: React.DragEvent, isInternal: boolean) => {
    e.preventDefault();
    if (isInternal) {
      setDragOverInternal(true);
    } else {
      setDragOverExternal(true);
    }
  };

  const handleDragLeave = (isInternal: boolean) => {
    if (isInternal) {
      setDragOverInternal(false);
    } else {
      setDragOverExternal(false);
    }
  };

  // ============================================================================
  // Delete Handler
  // ============================================================================

  const handleDelete = async (exhibitId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    await deleteExhibit(exhibitId);
  };

  // ============================================================================
  // Render Exhibit List
  // ============================================================================

  const renderExhibitList = (exhibits: typeof externalExhibits) => {
    if (exhibits.length === 0) {
      return null;
    }

    return (
      <Stack spacing={1}>
        {exhibits.map((exhibit) => (
          <Paper
            key={exhibit.attachmentId}
            elevation={0}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            {/* Drag Handle */}
            {!readOnly && (
              <DragIndicatorIcon sx={{ color: 'text.secondary', cursor: 'grab' }} fontSize="small" />
            )}

            {/* File Icon */}
            <InsertDriveFileIcon sx={{ color: 'text.secondary' }} />

            {/* File Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {exhibit.fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(exhibit.fileSize)} • Uploaded{' '}
                {new Date(exhibit.uploadedAt).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => downloadExhibit(exhibit)} title="Download">
                <DownloadIcon fontSize="small" />
              </IconButton>
              {!readOnly && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(exhibit.attachmentId, exhibit.fileName)}
                  title="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  };

  // ============================================================================
  // Render Upload Zone
  // ============================================================================

  const renderUploadZone = (isInternal: boolean) => {
    const isDragOver = isInternal ? dragOverInternal : dragOverExternal;
    const fileInputRef = isInternal ? internalFileInputRef : externalFileInputRef;

    return (
      <Paper
        elevation={0}
        onDrop={(e) => handleDrop(e, isInternal)}
        onDragOver={(e) => handleDragOver(e, isInternal)}
        onDragLeave={() => handleDragLeave(isInternal)}
        sx={{
          p: 4,
          border: 2,
          borderStyle: 'dashed',
          borderColor: isDragOver ? 'primary.main' : 'divider',
          bgcolor: isDragOver ? 'action.hover' : 'transparent',
          textAlign: 'center',
          cursor: readOnly ? 'default' : 'pointer',
          transition: 'all 0.2s',
          '&:hover': readOnly
            ? {}
            : {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
        }}
        onClick={() => !readOnly && fileInputRef.current?.click()}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {readOnly ? 'No files uploaded' : 'Drag & drop files here or click to browse'}
        </Typography>
        {!readOnly && (
          <Typography variant="caption" color="text.secondary">
            Maximum file size: 100MB
          </Typography>
        )}

        {/* Hidden file input */}
        {!readOnly && (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFilesSelected(e.target.files, isInternal)}
          />
        )}
      </Paper>
    );
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
    <Stack spacing={4}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Uploading Indicator */}
      {isUploading && (
        <Alert severity="info" icon={<CircularProgress size={20} />}>
          Uploading files...
        </Alert>
      )}

      {/* Summary */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${externalExhibits.length + internalExhibits.length} file${
              externalExhibits.length + internalExhibits.length !== 1 ? 's' : ''
            }`}
            size="small"
          />
          <Chip label={`Total: ${formatFileSize(totalFileSize)}`} size="small" variant="outlined" />
        </Stack>
      </Box>

      <Divider />

      {/* External Exhibits */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Supporting Attachments</Typography>
            <Typography variant="body2" color="text.secondary">
              These files will be included in the public document
            </Typography>
          </Box>
          {!readOnly && externalExhibits.length > 0 && (
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => externalFileInputRef.current?.click()}
            >
              Add Files
            </Button>
          )}
        </Stack>

        {externalExhibits.length > 0 ? renderExhibitList(externalExhibits) : renderUploadZone(false)}
      </Box>

      <Divider />

      {/* Internal Exhibits */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Internal Documents</Typography>
            <Typography variant="body2" color="text.secondary">
              These files are internal only. The vendor will not see them.
            </Typography>
          </Box>
          {!readOnly && internalExhibits.length > 0 && (
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => internalFileInputRef.current?.click()}
            >
              Add Files
            </Button>
          )}
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          Internal documents may be used in the Legal Request but will not be visible to vendors.
        </Alert>

        {internalExhibits.length > 0 ? renderExhibitList(internalExhibits) : renderUploadZone(true)}
      </Box>
    </Stack>
  );
};
