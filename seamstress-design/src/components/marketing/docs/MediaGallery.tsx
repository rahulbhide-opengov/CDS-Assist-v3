/**
 * MediaGallery
 *
 * Image browser with folder filtering, size filtering,
 * and copy-path functionality for marketing photography assets.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ImageCard } from './ImageCard';
import { ImageLightbox } from './ImageLightbox';
import {
  imageManifest,
  IMAGE_FOLDERS,
  type ImageAsset,
  type ImageFolder,
} from '../../../data/marketingDocsData';

type FolderFilter = 'all' | ImageFolder;
type SizeFilter = 'all' | 800 | 1200 | 1920;
type FormatFilter = 'all' | 'webp' | 'jpg' | 'png';

const FOLDER_LABELS: Record<FolderFilter, string> = {
  all: 'All',
  'agent-studio': 'Agent Studio',
  'eufaula-alabama': 'Eufaula, AL',
  'starkville-mississippi': 'Starkville, MS',
  'taylor-county-west-virginia': 'Taylor County, WV',
};

export const MediaGallery: React.FC = () => {
  const [folderFilter, setFolderFilter] = useState<FolderFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [lightboxImage, setLightboxImage] = useState<ImageAsset | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Filter images
  const filteredImages = useMemo(() => {
    return imageManifest.filter((img) => {
      // Folder filter
      if (folderFilter !== 'all' && img.folder !== folderFilter) return false;
      // Size filter (skip for images without size variants)
      if (sizeFilter !== 'all' && img.size !== null && img.size !== sizeFilter)
        return false;
      // Format filter
      if (formatFilter !== 'all' && img.format !== formatFilter) return false;
      return true;
    });
  }, [folderFilter, sizeFilter, formatFilter]);

  // Get unique images (by base name, prefer webp)
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>();
    return filteredImages.filter((img) => {
      // Create a base key without format
      const baseKey = img.folder === 'agent-studio'
        ? img.id
        : `${img.folder}-${img.filename.replace(/-\d+\.(webp|jpg)$/, '')}`;
      if (seen.has(baseKey)) return false;
      seen.add(baseKey);
      return true;
    });
  }, [filteredImages]);

  // Copy path handler
  const handleCopy = useCallback(async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Lightbox handlers
  const handleView = useCallback((image: ImageAsset) => {
    setLightboxImage(image);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === lightboxImage.id);
    if (currentIndex > 0) {
      setLightboxImage(filteredImages[currentIndex - 1]);
    }
  }, [lightboxImage, filteredImages]);

  const handleNext = useCallback(() => {
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === lightboxImage.id);
    if (currentIndex < filteredImages.length - 1) {
      setLightboxImage(filteredImages[currentIndex + 1]);
    }
  }, [lightboxImage, filteredImages]);

  return (
    <Box>
      {/* Stats */}
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        {imageManifest.length} total files across {IMAGE_FOLDERS.length} folders.
        Select filters to browse the photography library.
      </Typography>

      {/* Filters */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        {/* Folder Filter */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Folder
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(['all', ...IMAGE_FOLDERS] as FolderFilter[]).map((folder) => (
              <Chip
                key={folder}
                label={FOLDER_LABELS[folder]}
                onClick={() => setFolderFilter(folder)}
                variant={folderFilter === folder ? 'filled' : 'outlined'}
                color={folderFilter === folder ? 'primary' : 'default'}
                sx={{
                  borderRadius: '6px',
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Size and Format Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          {/* Size Filter */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
              }}
            >
              Size
            </Typography>
            <ToggleButtonGroup
              value={sizeFilter}
              exclusive
              onChange={(_, value) => value && setSizeFilter(value)}
              size="small"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value={800}>800px</ToggleButton>
              <ToggleButton value={1200}>1200px</ToggleButton>
              <ToggleButton value={1920}>1920px</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Format Filter */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
              }}
            >
              Format
            </Typography>
            <ToggleButtonGroup
              value={formatFilter}
              exclusive
              onChange={(_, value) => value && setFormatFilter(value)}
              size="small"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="webp">WebP</ToggleButton>
              <ToggleButton value="jpg">JPG</ToggleButton>
              <ToggleButton value="png">PNG</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Stack>

      {/* Results count */}
      <Typography
        sx={{
          fontSize: '0.875rem',
          color: 'text.disabled',
          mb: 2,
        }}
      >
        Showing {filteredImages.length} images
      </Typography>

      {/* Image Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {filteredImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onView={handleView}
            onCopy={handleCopy}
          />
        ))}
      </Box>

      {/* Empty state */}
      {filteredImages.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'action.hover',
            borderRadius: '8px',
          }}
        >
          <Typography sx={{ color: 'text.disabled' }}>
            No images match the selected filters.
          </Typography>
        </Box>
      )}

      {/* Lightbox */}
      <ImageLightbox
        open={!!lightboxImage}
        image={lightboxImage}
        images={filteredImages}
        onClose={handleCloseLightbox}
        onPrev={handlePrev}
        onNext={handleNext}
        onCopy={handleCopy}
      />

      {/* Copy Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Path copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
};
