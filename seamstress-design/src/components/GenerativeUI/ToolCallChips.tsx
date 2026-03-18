import React from 'react';
import { Stack, Chip } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';

interface ToolCallChipsProps {
  tools: string[];
}

export const ToolCallChips: React.FC<ToolCallChipsProps> = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
      {tools.map((tool, index) => (
        <Chip
          key={index}
          icon={<BuildIcon />}
          label={tool}
          size="small"
          variant="outlined"
        />
      ))}
    </Stack>
  );
};