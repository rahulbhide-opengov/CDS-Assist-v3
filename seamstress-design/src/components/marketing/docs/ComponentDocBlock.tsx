/**
 * ComponentDocBlock
 *
 * Wrapper for component documentation with live example,
 * props table, and code snippet.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Code as CodeIcon,
  CodeOff as CodeOffIcon,
} from '@mui/icons-material';
import { CodeBlock } from '../../docs';
import { PropsTable } from './PropsTable';
import type { PropDefinition } from '../../../data/marketingDocsData';

interface ComponentDocBlockProps {
  /** Component name */
  name: string;
  /** Brief description */
  description: string;
  /** Live example component(s) */
  children: React.ReactNode;
  /** Code snippet string */
  code: string;
  /** Props definitions */
  propsData: PropDefinition[];
  /** Whether to show code by default */
  defaultShowCode?: boolean;
}

export const ComponentDocBlock: React.FC<ComponentDocBlockProps> = ({
  name,
  description,
  children,
  code,
  propsData,
  defaultShowCode = false,
}) => {
  const [showCode, setShowCode] = useState(defaultShowCode);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontFamily: 'monospace',
              }}
            >
              {`<${name} />`}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.5 }}
            >
              {description}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={showCode ? <CodeOffIcon /> : <CodeIcon />}
            onClick={() => setShowCode(!showCode)}
            sx={{ flexShrink: 0 }}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>
        </Stack>
      </Box>

      {/* Live Example */}
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>

      {/* Tabs for Props and Code */}
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 0,
              textTransform: 'none',
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="Props" />
          <Tab label="Code" />
        </Tabs>

        {/* Props Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <PropsTable props={propsData} />
          </Box>
        )}

        {/* Code Tab */}
        {activeTab === 1 && (
          <Box>
            <CodeBlock>{code}</CodeBlock>
          </Box>
        )}
      </Box>

      {/* Inline Code Collapse (when toggled from header) */}
      <Collapse in={showCode && activeTab !== 1}>
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <CodeBlock>{code}</CodeBlock>
        </Box>
      </Collapse>
    </Box>
  );
};
