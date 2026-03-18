/**
 * @ Mention Demo Component
 * Demonstrates the @ mention functionality in various input types
 */

import React, { useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  Chip,
  Stack,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useMentionInput } from '../../hooks/useMentionInput';
import type { MentionSuggestion } from '../../services/knowledge/KnowledgeTypes';

const MentionDemo: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [mentions, setMentions] = useState<MentionSuggestion[]>([]);
  const [output, setOutput] = useState('');

  const textFieldRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Enable @ mentions for text field
  useMentionInput(textFieldRef, {
    onMention: (suggestion) => {
      setMentions(prev => [...prev, suggestion]);
      // The mention will be automatically inserted by the hook
    },
  });

  // Enable @ mentions for textarea
  useMentionInput(textareaRef, {
    onMention: (suggestion) => {
      setMentions(prev => [...prev, suggestion]);
      // The mention will be automatically inserted by the hook
    },
  });

  const handleProcess = () => {
    const combined = `TextField: ${textValue}\n\nTextArea: ${textareaValue}`;
    setOutput(combined);
  };

  const handleClear = () => {
    setTextValue('');
    setTextareaValue('');
    setMentions([]);
    setOutput('');
  };

  const removeMention = (index: number) => {
    setMentions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        @ Mention System Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Type @ in any input field below to open the mention menu. You can reference:
        <ul style={{ marginTop: 8, marginBottom: 0 }}>
          <li><strong>@agent/</strong> - AI Agents</li>
          <li><strong>@skill/</strong> - Skills and capabilities</li>
          <li><strong>@tool/</strong> - Tools and utilities</li>
          <li><strong>@knowledge/</strong> - Knowledge base documents</li>
          <li><strong>@seamstress/</strong> - System commands and contexts</li>
        </ul>
      </Alert>

      <Stack spacing={3}>
        {/* Text Field Example */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Single Line Input
            </Typography>
            <TextField
              ref={textFieldRef}
              fullWidth
              label="Type @ to mention"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Try typing @ to reference an agent, skill, or document..."
              variant="outlined"
            />
          </CardContent>
        </Card>

        {/* Textarea Example */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Multi-line Text Area
            </Typography>
            <Box
              component={TextareaAutosize}
              ref={textareaRef}
              minRows={6}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder="Write a longer message and use @ to reference multiple items..."
              sx={{
                width: '100%',
                p: 2,
                fontSize: '16px',
                fontFamily: 'inherit',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:focus': {
                  outline: 'none',
                  borderColor: 'primary.main',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Referenced Items */}
        {mentions.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referenced Items
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {mentions.map((mention, index) => (
                  <Chip
                    key={index}
                    label={mention.label}
                    color={
                      mention.type === 'agent' ? 'primary' :
                      mention.type === 'skill' ? 'success' :
                      mention.type === 'tool' ? 'warning' :
                      'default'
                    }
                    onDelete={() => removeMention(index)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleProcess}
            disabled={!textValue && !textareaValue}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Process with Mentions
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
          >
            Clear All
          </Button>
        </Stack>

        {/* Output */}
        {output && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processed Output
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'grey.50',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                }}
              >
                {output}
              </Paper>

              {mentions.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Resolved Mentions:
                  </Typography>
                  <Stack spacing={1}>
                    {mentions.map((mention, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {mention.path}:
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {mention.description}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default MentionDemo;