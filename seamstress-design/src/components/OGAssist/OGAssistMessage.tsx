import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface OGAssistMessageProps {
  content: string;
}

export const OGAssistMessage: React.FC<OGAssistMessageProps> = ({ content }) => {
  return (
    <Box
      sx={{
        '& p': {
          margin: '0 0 1em 0',
          lineHeight: 1.6,
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          marginTop: '1.5em',
          marginBottom: '0.5em',
          fontWeight: 600,
        },
        '& h3': {
          fontSize: '1.125rem',
        },
        '& ul, & ol': {
          marginBottom: '1em',
          paddingLeft: '1.5em',
        },
        '& li': {
          marginBottom: '0.25em',
        },
        '& code': {
          backgroundColor: 'grey.100',
          padding: '0.125em 0.25em',
          borderRadius: '0.25em',
          fontSize: '0.875em',
          fontFamily: 'monospace',
        },
        '& pre': {
          backgroundColor: 'grey.100',
          padding: '1em',
          borderRadius: '0.5em',
          overflowX: 'auto',
          marginBottom: '1em',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
            fontSize: '0.875rem',
          },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1em',
        },
        '& th, & td': {
          padding: '0.5em',
          borderBottom: '1px solid',
          borderColor: 'divider',
          textAlign: 'left',
        },
        '& th': {
          fontWeight: 600,
          backgroundColor: 'grey.50',
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          paddingLeft: '1em',
          marginLeft: 0,
          marginBottom: '1em',
          color: 'text.secondary',
        },
        '& strong': {
          fontWeight: 600,
        },
        '& em': {
          fontStyle: 'italic',
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};