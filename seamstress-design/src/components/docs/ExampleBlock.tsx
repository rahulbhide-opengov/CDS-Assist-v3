import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  Stack,
  useTheme,
} from '@mui/material';
import { Code as CodeIcon, CodeOff as CodeOffIcon } from '@mui/icons-material';
import { CodeBlock } from './CodeBlock';

interface ExampleBlockProps {
  /** Optional title for the example */
  title?: string;
  /** Optional description text */
  description?: string;
  /** The code string to display in the collapsible section */
  code: string;
  /** The rendered example component(s) */
  children: React.ReactNode;
  /** Whether to show code by default (can be controlled externally) */
  defaultShowCode?: boolean;
  /** External control for showing code (overrides internal state when provided) */
  showCode?: boolean;
}

/**
 * ExampleBlock displays a rendered UI example with toggleable code view.
 * Used in documentation pages to show both visual output and source code.
 */
export function ExampleBlock({
  title,
  description,
  code,
  children,
  defaultShowCode = false,
  showCode: externalShowCode,
}: ExampleBlockProps) {
  const theme = useTheme();
  const [internalShowCode, setInternalShowCode] = useState(defaultShowCode);

  // Use external control if provided, otherwise use internal state
  const isControlled = externalShowCode !== undefined;
  const showCode = isControlled ? externalShowCode : internalShowCode;

  // Update internal state when defaultShowCode changes (for page-level toggle)
  useEffect(() => {
    if (!isControlled) {
      setInternalShowCode(defaultShowCode);
    }
  }, [defaultShowCode, isControlled]);

  const handleToggle = () => {
    if (!isControlled) {
      setInternalShowCode(!internalShowCode);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        mb: 3,
      }}
    >
      {/* Header with title, description, and toggle */}
      {(title || description) && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography variant="subtitle2" fontWeight={600}>
                  {title}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {description}
                </Typography>
              )}
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={showCode ? <CodeOffIcon /> : <CodeIcon />}
              onClick={handleToggle}
              sx={{ flexShrink: 0 }}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </Button>
          </Stack>
        </Box>
      )}

      {/* Header without title/description - just toggle button */}
      {!title && !description && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={showCode ? <CodeOffIcon /> : <CodeIcon />}
            onClick={handleToggle}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>
        </Box>
      )}

      {/* Rendered example - always visible */}
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
        }}
      >
        {children}
      </Box>

      {/* Collapsible code section */}
      <Collapse in={showCode}>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CodeBlock>{code}</CodeBlock>
        </Box>
      </Collapse>
    </Box>
  );
}

export default ExampleBlock;
