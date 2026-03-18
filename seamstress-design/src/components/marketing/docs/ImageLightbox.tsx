/**
 * ImageLightbox
 *
 * Full-screen modal for viewing images with
 * Prev/Next navigation, Escape to close, and Copy path button.
 */

import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Typography,
  Stack,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { cdsColors } from '../../../theme/cds';
import type { ImageAsset } from '../../../data/marketingDocsData';

const colors = cdsColors;

interface ImageLightboxProps {
  open: boolean;
  image: ImageAsset | null;
  images: ImageAsset[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onCopy: (path: string) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  open,
  image,
  images,
  onClose,
  onPrev,
  onNext,
  onCopy,
}) => {
  const currentIndex = image ? images.findIndex((img) => img.id === image.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    },
    [open, hasPrev, hasNext, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!image) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.95)',
          outline: 'none',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              sx={{
                color: colors.white,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {image.filename}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.75rem',
              }}
            >
              {currentIndex + 1} / {images.length}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Copy path">
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => onCopy(image.path)}
                sx={{
                  color: colors.white,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: colors.white,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                variant="outlined"
              >
                Copy Path
              </Button>
            </Tooltip>
            <IconButton
              onClick={onClose}
              sx={{
                color: colors.white,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Navigation Arrows */}
        {hasPrev && (
          <IconButton
            onClick={onPrev}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.white,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              zIndex: 10,
            }}
          >
            <PrevIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
        {hasNext && (
          <IconButton
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.white,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              zIndex: 10,
            }}
          >
            <NextIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 8 },
            pt: { xs: 10, md: 12 },
          }}
        >
          <Box
            component="img"
            src={image.path}
            alt={image.filename}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
          />
        </Box>

        {/* Bottom Info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Typography
            component="code"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              px: 2,
              py: 0.5,
              borderRadius: '4px',
            }}
          >
            {image.path}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
