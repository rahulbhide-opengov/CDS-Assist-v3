import React from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

/**
 * Feedback item structure
 */
export interface FeedbackItem {
  /** Unique identifier */
  id: string;
  /** Rating value (1-5) */
  rating: number;
  /** Comment/feedback text */
  comment: string;
  /** User name */
  userName: string;
  /** Optional user avatar URL */
  userAvatar?: string;
  /** Agent name */
  agentName: string;
  /** Optional agent avatar URL */
  agentAvatar?: string;
  /** Timestamp of the feedback */
  timestamp: string;
  /** Optional category/tags */
  category?: string;
}

/**
 * Props for the FeedbackTimelineCard component
 */
export interface FeedbackTimelineCardProps {
  /** Title of the card */
  title?: string;
  /** Array of feedback items */
  feedbackItems: FeedbackItem[];
  /** Maximum height for scrollable area */
  maxHeight?: number;
  /** Maximum characters to show in comment excerpt */
  maxCommentLength?: number;
  /** Loading state */
  loading?: boolean;
  /** Optional click handler for individual feedback items */
  onFeedbackClick?: (feedback: FeedbackItem) => void;
  /** Optional empty state message */
  emptyMessage?: string;
}

/**
 * FeedbackTimelineCard - Shows recent feedback in a scrollable timeline
 *
 * Features:
 * - Scrollable list of feedback items
 * - Rating badges with stars
 * - Comment excerpts with expand option
 * - Agent and user information with avatars
 * - Timestamps
 * - Category tags
 * - Responsive design
 * - Empty state handling
 *
 * @example
 * ```tsx
 * <FeedbackTimelineCard
 *   title="Recent Feedback"
 *   feedbackItems={[
 *     {
 *       id: '1',
 *       rating: 5,
 *       comment: 'Great response time!',
 *       userName: 'John Doe',
 *       agentName: 'Research Agent',
 *       timestamp: '2 hours ago',
 *       category: 'Quality'
 *     }
 *   ]}
 *   onFeedbackClick={(item) => console.log(item)}
 * />
 * ```
 */
const FeedbackTimelineCard: React.FC<FeedbackTimelineCardProps> = ({
  title = 'Recent Feedback',
  feedbackItems,
  maxHeight = 600,
  maxCommentLength = 150,
  loading = false,
  onFeedbackClick,
  emptyMessage = 'No feedback available',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const truncateComment = (comment: string) => {
    if (comment.length <= maxCommentLength) return comment;
    return `${comment.substring(0, maxCommentLength)}...`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return colorTokens.success.main;
    if (rating >= 3) return colorTokens.warning.main;
    return colorTokens.error.main;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h3' gutterBottom>
          {title}
        </Typography>

        {feedbackItems.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <List
            sx={{
              maxHeight,
              overflow: 'auto',
              '& .MuiListItem-root': {
                px: 0,
                py: 2,
              },
            }}
          >
            {feedbackItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: onFeedbackClick ? 'pointer' : 'default',
                    borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': onFeedbackClick
                      ? {
                        bgcolor: 'action.hover',
                      }
                      : {},
                  }}
                  onClick={() => onFeedbackClick?.(item)}
                >
                  <ListItemText
                    primary={
                      <Stack spacing={1}>
                        {/* Header with user, rating, and timestamp */}
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={1}
                          mb={1}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            <Typography variant="body2">
                              {item.userName}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: `${getRatingColor(item.rating)}20`,
                              }}
                            >
                              <Rating
                                value={item.rating}
                                readOnly
                                size="small"
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: getRatingColor(item.rating),
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                fontWeight={600}
                                ml={0.5}
                                color={getRatingColor(item.rating)}
                              >
                                {item.rating}/5
                              </Typography>
                            </Box>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
                            {item.timestamp}
                          </Typography>
                        </Stack>

                        {/* Comment */}
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          "{truncateComment(item.comment)}"
                        </Typography>

                        {/* Category */}
                        {item.category && (
                          <Box>
                            <Chip
                              label={item.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
                {index < feedbackItems.length - 1 && (
                  <Divider
                    component="li"
                    sx={{ borderColor: 'divider' }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Summary stats */}
        {feedbackItems.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-around" flexWrap="wrap" spacing={2}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {feedbackItems.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {(
                    feedbackItems.reduce((sum, item) => sum + item.rating, 0) /
                    feedbackItems.length
                  ).toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Rating
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {feedbackItems.filter((item) => item.rating >= 4).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Positive
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackTimelineCard;
