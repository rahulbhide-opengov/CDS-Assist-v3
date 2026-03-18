/**
 * SuggestedActionsBar
 *
 * Renders follow-up suggestions as clickable chips below assistant messages.
 * Clicking a chip triggers sendMessage() with the suggestion text.
 * Includes fade-in animation after message completes.
 */

import React from 'react';
import { Box, Chip, Fade, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SuggestedActionsBarProps {
  /** Array of suggestion strings to display as chips */
  suggestions: string[];
  /** Callback when a suggestion is clicked */
  onSuggestionClick: (suggestion: string) => void;
  /** Whether to show the suggestions (controls fade-in) */
  visible: boolean;
  /** Whether the suggestions are disabled (e.g., while loading) */
  disabled?: boolean;
  /** Optional label text above suggestions */
  label?: string;
}

export const SuggestedActionsBar: React.FC<SuggestedActionsBarProps> = ({
  suggestions,
  onSuggestionClick,
  visible,
  disabled = false,
  label = 'Suggested next steps',
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Fade in={visible} timeout={500}>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <AutoAwesomeIcon
            sx={{
              fontSize: 14,
              color: 'primary.main',
              opacity: 0.8,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '11px',
            }}
          >
            {label}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <Fade
              key={`${suggestion}-${index}`}
              in={visible}
              timeout={300}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Chip
                label={suggestion}
                onClick={() => !disabled && onSuggestionClick(suggestion)}
                disabled={disabled}
                variant="outlined"
                size="small"
                sx={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'transparent',
                  fontSize: '13px',
                  height: '32px',
                  px: 0.5,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: disabled ? 'transparent' : 'primary.main',
                    color: disabled ? 'primary.main' : 'primary.contrastText',
                    borderColor: 'primary.main',
                    transform: disabled ? 'none' : 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: disabled ? 'none' : 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    borderColor: 'divider',
                    color: 'text.disabled',
                  },
                }}
              />
            </Fade>
          ))}
        </Stack>
      </Box>
    </Fade>
  );
};

export default SuggestedActionsBar;
