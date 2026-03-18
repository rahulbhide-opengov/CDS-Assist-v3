import React, { useState } from 'react';
import { Stack, IconButton, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface FeedbackControlsProps {
  responseId: string;
  onCopy?: () => void;
  onFeedback?: (type: 'up' | 'down', comment?: string, tags?: string[]) => void;
  onAccept?: () => void;
  onReject?: (reason?: string) => void;
  showAcceptReject?: boolean;
}

export const FeedbackControls: React.FC<FeedbackControlsProps> = ({
  responseId,
  onCopy,
  onFeedback,
  onAccept,
  onReject,
  showAcceptReject = true
}) => {
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedbackTags = ['Clarity', 'Usefulness', 'Accuracy', 'Other'];

  const handleCopy = () => {
    setCopied(true);
    onCopy?.();
    navigator.clipboard.writeText(`Response ${responseId}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    setThumbsUp(!thumbsUp);
    setThumbsDown(false);
    if (!thumbsUp) {
      setFeedbackType('up');
      setFeedbackDialogOpen(true);
    } else {
      onFeedback?.('up');
    }
  };

  const handleThumbsDown = () => {
    setThumbsDown(!thumbsDown);
    setThumbsUp(false);
    if (!thumbsDown) {
      setFeedbackType('down');
      setFeedbackDialogOpen(true);
    } else {
      onFeedback?.('down');
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackType) {
      onFeedback?.(feedbackType, feedbackComment, selectedTags);
    }
    setFeedbackDialogOpen(false);
    setFeedbackComment('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title={copied ? 'Copied!' : 'Copy response'}>
            <IconButton onClick={handleCopy} size="small">
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Helpful">
            <IconButton onClick={handleThumbsUp} size="small" color={thumbsUp ? 'primary' : 'default'}>
              {thumbsUp ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Not helpful">
            <IconButton onClick={handleThumbsDown} size="small" color={thumbsDown ? 'error' : 'default'}>
              {thumbsDown ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>

        {showAcceptReject && (
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CheckIcon />}
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseIcon />}
              onClick={() => onReject?.()}
            >
              Reject
            </Button>
          </Stack>
        )}
      </Stack>

      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {feedbackType === 'up' ? 'What was helpful?' : 'What could be improved?'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {feedbackTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => toggleTag(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>

            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Additional comments (optional)"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFeedbackSubmit} variant="contained">Submit Feedback</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};