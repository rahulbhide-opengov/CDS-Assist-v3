import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Chip,
  Rating,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import StarIcon from '@mui/icons-material/Star';

export type FeedbackType = 'positive' | 'negative';

export interface FeedbackData {
  type: FeedbackType;
  rating?: number;
  comment: string;
  categories: string[];
  wouldRecommend?: boolean;
}

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  feedbackType: FeedbackType;
  onSubmit: (feedback: FeedbackData) => void;
  messageContent?: string;
}

const positiveFeedbackCategories = [
  'Accurate',
  'Helpful',
  'Clear',
  'Complete',
  'Fast',
  'Well-organized',
];

const negativeFeedbackCategories = [
  'Inaccurate',
  'Not helpful',
  'Confusing',
  'Incomplete',
  'Too slow',
  'Poorly organized',
  'Wrong context',
  'Outdated',
];

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onClose,
  feedbackType,
  onSubmit,
  messageContent,
}) => {
  const [rating, setRating] = useState<number | null>(feedbackType === 'positive' ? 5 : 2);
  const [comment, setComment] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wouldRecommend, setWouldRecommend] = useState(feedbackType === 'positive');

  const categories = feedbackType === 'positive' ? positiveFeedbackCategories : negativeFeedbackCategories;
  const Icon = feedbackType === 'positive' ? ThumbUpIcon : ThumbDownIcon;
  const iconColor = feedbackType === 'positive' ? 'success.main' : 'error.main';
  const dialogTitle = feedbackType === 'positive' ? 'Thanks for your feedback!' : 'Help us improve';

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating: rating || undefined,
      comment,
      categories: selectedCategories,
      wouldRecommend,
    };
    onSubmit(feedbackData);
    handleClose();
  };

  const handleClose = () => {
    // Reset state
    setRating(feedbackType === 'positive' ? 5 : 2);
    setComment('');
    setSelectedCategories([]);
    setWouldRecommend(feedbackType === 'positive');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon sx={{ fontSize: 28, color: iconColor }} />
          <Typography variant="h6">{dialogTitle}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Rating */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              How would you rate this response?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: feedbackType === 'positive' ? 'success.main' : 'warning.main',
                },
              }}
            />
          </Box>

          {/* Categories */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              {feedbackType === 'positive'
                ? 'What did you like about this response?'
                : 'What could be improved?'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: selectedCategories.includes(category) ? iconColor : 'divider',
                    bgcolor: selectedCategories.includes(category) ? `${iconColor}15` : 'transparent',
                    color: selectedCategories.includes(category) ? iconColor : 'text.primary',
                    '&:hover': {
                      bgcolor: `${iconColor}20`,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Comment */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Additional comments (optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                feedbackType === 'positive'
                  ? 'Tell us more about what worked well...'
                  : 'Tell us how we can improve...'
              }
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                },
              }}
            />
          </Box>

          {/* Would recommend */}
          <FormControlLabel
            control={
              <Checkbox
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                sx={{
                  color: iconColor,
                  '&.Mui-checked': {
                    color: iconColor,
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                I would recommend this AI assistant to others
              </Typography>
            }
          />

          {/* Message preview */}
          {messageContent && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Response you're rating:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  fontSize: '13px',
                }}
              >
                {messageContent}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!rating}
          sx={{
            bgcolor: iconColor,
            '&:hover': {
              bgcolor: feedbackType === 'positive' ? 'success.dark' : 'error.dark',
            },
          }}
        >
          Submit Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Simple feedback toast for quick confirmation
export const FeedbackToast: React.FC<{
  type: FeedbackType;
  onClose: () => void;
}> = ({ type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 1,
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 9999,
        border: '1px solid',
        borderColor: type === 'positive' ? 'success.main' : 'error.main',
      }}
    >
      {type === 'positive' ? (
        <ThumbUpIcon sx={{ color: 'success.main' }} />
      ) : (
        <ThumbDownIcon sx={{ color: 'error.main' }} />
      )}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Thanks for your feedback!
      </Typography>
    </Box>
  );
};