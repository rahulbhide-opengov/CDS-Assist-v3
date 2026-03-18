/**
 * AIResponseTemplate - Template component for AI-generated responses
 * Displays agent info, skills used, response content, and feedback controls
 */

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { FeedbackControls } from './GenerativeUI/FeedbackControls';

interface AIResponseTemplateProps {
  responseId: string;
  agentName: string;
  skills: string[];
  title: string;
  content: string;
  onCopy?: () => void;
  onFeedback?: (type: 'up' | 'down', comment?: string, tags?: string[]) => void;
  showAcceptReject?: boolean;
  onAccept?: () => void;
  onReject?: (reason?: string) => void;
}

export const AIResponseTemplate: React.FC<AIResponseTemplateProps> = ({
  responseId,
  agentName,
  skills,
  title,
  content,
  onCopy,
  onFeedback,
  showAcceptReject = false,
  onAccept,
  onReject,
}) => {
  const visibleSkills = skills.slice(0, 3);
  const hiddenSkillsCount = skills.length - 3;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.secondary'
      }}
    >
      {/* Header with Agent name and Skills */}
      <Stack direction="row" spacing={.5} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={agentName}
          size="small"
          variant="outlined"
        />
        {visibleSkills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            size="small"
            variant="outlined"
          />
        ))}
        {hiddenSkillsCount > 0 && (
          <Chip
            label={`+${hiddenSkillsCount} more`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {/* Title */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>

      {/* Content with Markdown support */}
      <Box
        sx={{
          '& h1': {
            fontSize: '1.75rem',
            fontWeight: 600,
            mt: 3,
            mb: 2,
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 600,
            mt: 2.5,
            mb: 1.5,
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 600,
            mt: 2,
            mb: 1,
          },
          '& p': {
            mb: 2,
            lineHeight: 1.6,
          },
          '& ul, & ol': {
            pl: 3,
            mb: 2,
          },
          '& li': {
            mb: 0.5,
          },
          '& code': {
            bgcolor: 'action.hover',
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '0.875em',
          },
          '& pre': {
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            mb: 2,
          },
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>

      {/* Feedback Controls */}
      <FeedbackControls
        responseId={responseId}
        onCopy={onCopy}
        onFeedback={onFeedback}
        showAcceptReject={showAcceptReject}
        onAccept={onAccept}
        onReject={onReject}
      />
    </Box>
  );
};

export default AIResponseTemplate;
