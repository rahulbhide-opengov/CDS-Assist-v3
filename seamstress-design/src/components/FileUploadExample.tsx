import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import { FilePreviewCard } from '@opengov/components-file-management';
import { Result } from '@opengov/components-result';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDocumentOutline from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { generateFileId } from '../utils/id';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadProgress?: number;
}

export const FileUploadExample: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const uploadedFile: UploadedFile = {
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        uploadProgress: 0
      };

      // Simulate upload progress
      setFiles(prev => [...prev, uploadedFile]);

      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles(prev => prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, uploadProgress: progress }
            : f
        ));

        if (progress >= 100) {
          clearInterval(interval);
          // Remove progress after completion
          setTimeout(() => {
            setFiles(prev => prev.map(f =>
              f.id === uploadedFile.id
                ? { ...f, uploadProgress: undefined }
                : f
            ));
          }, 500);
        }
      }, 200);
    });
  };

  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile === fileId) {
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return undefined; // Use preview
    return <FileDocumentOutline />;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        File Management Example
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Upload Files</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Choose Files
              <input
                type="file"
                hidden
                multiple
                accept="image/*,application/pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Accepted formats: Images, PDF, Word documents (Max 10MB)
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {files.length > 0 ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Uploaded Files ({files.length})
          </Typography>

          <Stack spacing={2}>
            {files.map(file => (
              <FilePreviewCard
                key={file.id}
                name={file.name}
                description={`Size: ${formatFileSize(file.size)}`}
                previewImgSrc={file.type.startsWith('image/') ? file.url : undefined}
                previewIcon={getFileIcon(file.type)}
                actionIcon={<DownloadIcon />}
                progress={file.uploadProgress}
                isSelected={selectedFile === file.id}
                layout="horizontal"
                onClick={() => setSelectedFile(file.id)}
                onActionClick={() => {
                  // Handle download
                  const a = document.createElement('a');
                  a.href = file.url;
                  a.download = file.name;
                  a.click();
                }}
                onClose={() => handleFileRemove(file.id)}
              />
            ))}
          </Stack>

          {selectedFile && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Selected File Details
                </Typography>
                {(() => {
                  const file = files.find(f => f.id === selectedFile);
                  if (!file) return null;
                  return (
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        Name: {file.name}
                      </Typography>
                      <Typography variant="body2">
                        Size: {formatFileSize(file.size)}
                      </Typography>
                      <Typography variant="body2">
                        Type: {file.type}
                      </Typography>
                      <Typography variant="body2">
                        Uploaded: {file.uploadedAt.toLocaleString()}
                      </Typography>
                    </Stack>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </Box>
      ) : (
        <Result
          status="empty"
          title="No files uploaded"
          description="Choose files to upload them here"
        />
      )}
    </Box>
  );
};

export default FileUploadExample;