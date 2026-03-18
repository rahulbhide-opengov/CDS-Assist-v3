/**
 * DocumentActionCard Component
 *
 * Renders action buttons and content previews in chat messages
 * for the Document Builder Assistant.
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';

// =============================================================================
// Types
// =============================================================================

export interface DocumentAction {
  type: 'add_section' | 'update_section' | 'navigate';
  sectionTitle?: string;
  sectionType?: 'text' | 'list' | 'heading';
  content?: string;
  variables?: string[];
}

export interface PreviewContent {
  title: string;
  body: string;
  variables?: string[];
}

interface DocumentActionCardProps {
  /** The action to execute when the button is clicked */
  action: DocumentAction;
  /** Preview content to display */
  previewContent?: PreviewContent;
  /** Callback when action is executed */
  onExecute: (action: DocumentAction) => void;
  /** Whether the action has been executed */
  isExecuted?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export const DocumentActionCard: React.FC<DocumentActionCardProps> = ({
  action,
  previewContent,
  onExecute,
  isExecuted = false,
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    // Merge preview content body into the action
    const actionWithContent: DocumentAction = {
      ...action,
      content: previewContent?.body || action.content,
    };

    onExecute(actionWithContent);
    setExecuting(false);
  };

  const getActionLabel = () => {
    switch (action.type) {
      case 'add_section':
        return `Add ${action.sectionTitle || 'Section'}`;
      case 'update_section':
        return `Update ${action.sectionTitle || 'Section'}`;
      case 'navigate':
        return 'Go to Section';
      default:
        return 'Execute';
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 2,
        mb: 1,
        borderColor: isExecuted ? 'success.main' : 'primary.main',
        borderWidth: isExecuted ? 1 : 2,
        bgcolor: (theme) => isExecuted
          ? alpha(theme.palette.success.main, 0.04)
          : alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isExecuted ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <AddIcon color="primary" fontSize="small" />
            )}
            <Typography variant="subtitle2" fontWeight={600}>
              {action.sectionTitle || 'Document Action'}
            </Typography>
            <Chip
              label={action.sectionType || 'text'}
              size="small"
              variant="outlined"
              sx={{ fontSize: '10px', height: '20px' }}
            />
          </Stack>

          {previewContent && (
            <Button
              size="small"
              onClick={() => setShowPreview(!showPreview)}
              endIcon={showPreview ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: 'none' }}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          )}
        </Stack>

        {/* Preview Content */}
        {previewContent && (
          <Collapse in={showPreview}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                mb: 2,
                maxHeight: 300,
                overflow: 'auto',
                '& h3': {
                  fontSize: '14px',
                  fontWeight: 600,
                  mt: 2,
                  mb: 1,
                  '&:first-of-type': { mt: 0 },
                },
                '& p': {
                  fontSize: '13px',
                  lineHeight: 1.6,
                  my: 1,
                },
                '& ul, & ol': {
                  pl: 3,
                  my: 1,
                },
                '& li': {
                  fontSize: '13px',
                  lineHeight: 1.5,
                  my: 0.5,
                },
                '& table': {
                  fontSize: '12px',
                  width: '100%',
                  borderCollapse: 'collapse',
                  my: 1,
                },
                '& th, & td': {
                  padding: '6px 8px',
                  border: '1px solid',
                  borderColor: 'divider',
                },
                '& th': {
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                },
              }}
              dangerouslySetInnerHTML={{ __html: previewContent.body }}
            />

            {/* Variables */}
            {previewContent.variables && previewContent.variables.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                  <CodeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Variables ({previewContent.variables.length})
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {previewContent.variables.map((variable) => (
                    <Chip
                      key={variable}
                      label={`{{${variable}}}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '11px',
                        height: '22px',
                        fontFamily: 'monospace',
                        bgcolor: 'action.hover',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Collapse>
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Action Button */}
        <Stack direction="row" justifyContent="flex-end">
          {isExecuted ? (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon />}
              disabled
              sx={{ textTransform: 'none' }}
            >
              Added to Document
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleExecute}
              disabled={executing}
              sx={{ textTransform: 'none' }}
            >
              {executing ? 'Adding...' : getActionLabel()}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DocumentActionCard;
