/**
 * PRCommentsFAB
 *
 * Floating action button for PR comments with badge showing comment count.
 * Positioned in the bottom-right corner.
 */

import React from 'react';
import { Fab, Badge, Tooltip, useTheme } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';

interface PRCommentsFABProps {
  commentCount: number;
  onClick: () => void;
  isOpen?: boolean;
}

export const PRCommentsFAB: React.FC<PRCommentsFABProps> = ({
  commentCount,
  onClick,
  isOpen,
}) => {
  const theme = useTheme();

  return (
    <Tooltip title={isOpen ? 'Close PR comments' : 'View PR comments'} placement="left">
      <Fab
        color="secondary"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: theme.zIndex.speedDial,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Badge
          badgeContent={commentCount}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              right: -4,
              top: -4,
            },
          }}
        >
          <GitHubIcon />
        </Badge>
      </Fab>
    </Tooltip>
  );
};
