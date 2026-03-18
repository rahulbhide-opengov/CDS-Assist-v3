import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { ToolCallChips } from './ToolCallChips';
import { FeedbackControls } from './FeedbackControls';
import type { EAMAgentResponse } from '../../types/opengov/eam';

interface GenerativeResponseProps {
  response: EAMAgentResponse;
  children: React.ReactNode;
  onFeedback?: (responseId: string, type: 'up' | 'down', comment?: string) => void;
  onAccept?: (responseId: string) => void;
  onReject?: (responseId: string, reason?: string) => void;
  showFeedback?: boolean;
}

export const GenerativeResponse: React.FC<GenerativeResponseProps> = ({
  response,
  children,
  onFeedback,
  onAccept,
  onReject,
  showFeedback = true
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 1,
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: 'primary.main',
          borderRadius: '4px 0 0 4px'
        }
      }}
    >
      {response.toolCalls && response.toolCalls.length > 0 && (
        <ToolCallChips tools={response.toolCalls} />
      )}

      <Typography variant="h5" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
        {response.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {response.body}
      </Typography>

      <Box sx={{ mt: 3 }}>
        {children}
      </Box>

      {showFeedback && (
        <FeedbackControls
          responseId={response.id}
          onCopy={() => {}}
          onFeedback={(type, comment, tags) => {
            onFeedback?.(response.id, type, comment);
          }}
          onAccept={() => {
            onAccept?.(response.id);
          }}
          onReject={(reason) => {
            onReject?.(response.id, reason);
          }}
          showAcceptReject={response.step === 'schedule'}
        />
      )}
    </Paper>
  );
};