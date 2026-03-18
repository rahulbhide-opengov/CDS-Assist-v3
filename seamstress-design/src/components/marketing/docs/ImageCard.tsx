/**
 * ImageCard
 *
 * Thumbnail card for the media gallery with filename, size badge,
 * and hover actions (View, Copy Path).
 */

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { cdsColors } from '../../../theme/cds';
import type { ImageAsset } from '../../../data/marketingDocsData';

const colors = cdsColors;

interface ImageCardProps {
  image: ImageAsset;
  onView: (image: ImageAsset) => void;
  onCopy: (path: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onView,
  onCopy,
}) => {
  return (
    <Box
      sx={{
        border: `1px solid ${colors.gray200}`,
        borderRadius: '4px',
        overflow: 'hidden',
        bgcolor: colors.white,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: colors.blurple300,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          '& .image-actions': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          bgcolor: colors.gray100,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={image.path}
          alt={image.filename}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Hover Actions Overlay */}
        <Box
          className="image-actions"
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Tooltip title="View full size">
            <IconButton
              onClick={() => onView(image)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: colors.white },
              }}
            >
              <ViewIcon sx={{ color: colors.gray700 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy path">
            <IconButton
              onClick={() => onCopy(image.path)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: colors.white },
              }}
            >
              <CopyIcon sx={{ color: colors.gray700 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ p: 1.5 }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: colors.gray700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {image.filename}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          {image.size && (
            <Chip
              label={`${image.size}px`}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.625rem',
                bgcolor: colors.blurple100,
                color: colors.blurple600,
              }}
            />
          )}
          <Chip
            label={image.format.toUpperCase()}
            size="small"
            sx={{
              height: 18,
              fontSize: '0.625rem',
              bgcolor: colors.gray100,
              color: colors.gray600,
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
