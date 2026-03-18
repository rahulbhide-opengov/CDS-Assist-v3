/**
 * PRCommentItem
 *
 * Displays a single PR comment with avatar, author, timestamp, body, and delete button.
 */

import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Link,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { PRComment } from '../../services/github';

interface PRCommentItemProps {
  comment: PRComment;
  onDelete?: (commentId: number) => void;
  isDeleting?: boolean;
}

/**
 * Renders comment body with clickable links for paths starting with /
 */
const renderBodyWithLinks = (body: string) => {
  const lines = body.split('\n');
  return lines.map((line, index) => {
    const isLast = index === lines.length - 1;
    // Check if line is a path (starts with /)
    if (line.match(/^\/[\w\-\/?.#=&]*$/)) {
      return (
        <React.Fragment key={index}>
          <Link href={line} sx={{ color: 'primary.main' }}>
            {line}
          </Link>
          {!isLast && '\n'}
        </React.Fragment>
      );
    }
    return isLast ? line : line + '\n';
  });
};

export const PRCommentItem: React.FC<PRCommentItemProps> = ({
  comment,
  onDelete,
  isDeleting,
}) => {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 2,
        '&:hover .delete-button': {
          opacity: 1,
        },
      }}
    >
      <Avatar
        src={comment.user.avatar_url}
        alt={comment.user.login}
        sx={{ width: 32, height: 32 }}
      >
        {comment.user.login.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {comment.user.login}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo}
          </Typography>
          {comment.html_url && comment.html_url !== '#' && (
            <Tooltip title="View on GitHub">
              <Link
                href={comment.html_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
            </Tooltip>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {renderBodyWithLinks(comment.body)}
        </Typography>
      </Box>

      {onDelete && (
        <Tooltip title="Delete comment">
          <IconButton
            className="delete-button"
            size="small"
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            sx={{
              opacity: 0.5,
              transition: 'opacity 0.2s',
              alignSelf: 'flex-start',
              color: 'text.secondary',
              '&:hover': { opacity: 1, color: 'error.main' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
