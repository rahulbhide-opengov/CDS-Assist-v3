import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FeedbackCardProps {
  feedbackType: 'positive' | 'negative';
  onSubmit: (feedback: string, tags: string[]) => void;
  onClose: () => void;
}

const POSITIVE_TAGS = [
  'Accurate',
  'Helpful',
  'Clear',
  'Fast',
  'Relevant',
];

const NEGATIVE_TAGS = [
  'Inaccurate',
  'Unhelpful',
  'Confusing',
  'Slow',
  'Irrelevant',
];

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedbackType,
  onSubmit,
  onClose,
}) => {
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = feedbackType === 'positive' ? POSITIVE_TAGS : NEGATIVE_TAGS;
  const title = feedbackType === 'positive'
    ? 'Thanks for the positive feedback!'
    : 'Thanks for letting us know!';
  const subtitle = feedbackType === 'positive'
    ? 'What did you like about this response?'
    : 'What could be improved?';

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit(feedback, selectedTags);
    // Reset form
    setFeedback('');
    setSelectedTags([]);
  };

  const isValid = feedback.trim().length > 0 || selectedTags.length > 0;

  return (
    <Card
      sx={{
        maxWidth: 500,
        my: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <CardContent sx={{ pt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        {/* Tag Selection */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                size="small"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: selectedTags.includes(tag)
                      ? 'primary.dark'
                      : 'action.hover',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Feedback Text */}
        <TextField
          fullWidth
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Additional comments (optional)"
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              width: '100%',
            },
            '& .MuiInputBase-input': {
              width: '100%',
            }
          }}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="text"
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid}
            sx={{
              textTransform: 'none',
              bgcolor: feedbackType === 'positive' ? 'success.main' : 'warning.main',
              '&:hover': {
                bgcolor: feedbackType === 'positive' ? 'success.dark' : 'warning.dark',
              },
            }}
          >
            Submit Feedback
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};