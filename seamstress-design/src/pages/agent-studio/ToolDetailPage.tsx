/**
 * Tool Detail Page
 * Displays detailed information about a specific tool
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ApiIcon from '@mui/icons-material/Api';
import ExtensionIcon from '@mui/icons-material/Extension';

// Mock toolkit data with tools - matching the schema structure
interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  returns: {
    type: string;
    description: string;
  };
  toolkit?: string;
  toolkitType?: 'mcp' | 'api' | 'custom';
  examples?: { input: string; output: string }[];
  usage?: number;
}

const mockTools: Record<string, Tool> = {
  'search-documents': {
    id: 'search-documents',
    name: 'Search Documents',
    description: 'Search through government documents and records using natural language queries',
    toolkit: 'OpenGov BNP Toolkit',
    toolkitType: 'mcp',
    usage: 342,
    parameters: [
      { name: 'query', type: 'string', description: 'Search query in natural language', required: true },
      { name: 'filters', type: 'object', description: 'Optional filters for date range, department, document type', required: false },
      { name: 'limit', type: 'number', description: 'Maximum number of results to return (default: 10)', required: false }
    ],
    returns: {
      type: 'array',
      description: 'Array of document objects with title, excerpt, relevance score, and metadata'
    },
    examples: [
      { input: '{"query": "budget reports 2024"}', output: '[{"title": "Q1 2024 Budget Report", "score": 0.95}]' },
      { input: '{"query": "public meeting minutes", "filters": {"department": "City Council"}}', output: '[{"title": "Council Meeting - March 2024", "score": 0.89}]' }
    ]
  },
  'create-report': {
    id: 'create-report',
    name: 'Create Report',
    description: 'Generate formatted reports from data with customizable templates',
    toolkit: 'Reporting Tools',
    toolkitType: 'api',
    usage: 178,
    parameters: [
      { name: 'data', type: 'object', description: 'Data to include in the report', required: true },
      { name: 'template', type: 'string', description: 'Report template ID or custom template', required: true },
      { name: 'format', type: 'string', description: 'Output format (pdf, docx, html)', required: false },
      { name: 'metadata', type: 'object', description: 'Additional metadata like author, department', required: false }
    ],
    returns: {
      type: 'object',
      description: 'Generated report with download URL and preview'
    },
    examples: [
      { input: '{"data": {"revenue": 50000}, "template": "quarterly-financial"}', output: '{"url": "reports/Q1-2024.pdf", "pages": 12}' },
      { input: '{"data": {"incidents": 23}, "template": "safety-report", "format": "html"}', output: '{"url": "reports/safety-march.html"}' }
    ]
  },
  'query-database': {
    id: 'query-database',
    name: 'Query Database',
    description: 'Execute SQL queries against authorized government databases',
    toolkit: 'Data Analysis Suite',
    toolkitType: 'custom',
    usage: 421,
    parameters: [
      { name: 'query', type: 'string', description: 'SQL query to execute', required: true },
      { name: 'database', type: 'string', description: 'Target database name', required: true },
      { name: 'timeout', type: 'number', description: 'Query timeout in seconds', required: false }
    ],
    returns: {
      type: 'object',
      description: 'Query results with rows, columns, and execution metadata'
    },
    examples: [
      { input: '{"query": "SELECT * FROM permits WHERE status = \'pending\'", "database": "permits_db"}', output: '{"rows": 45, "data": [...]}' }
    ]
  },
  'send-email': {
    id: 'send-email',
    name: 'Send Email',
    description: 'Send emails with templates and attachments through the government email system',
    toolkit: 'Communication Tools',
    toolkitType: 'api',
    usage: 892,
    parameters: [
      { name: 'to', type: 'string[]', description: 'Recipient email addresses', required: true },
      { name: 'subject', type: 'string', description: 'Email subject line', required: true },
      { name: 'body', type: 'string', description: 'Email body (HTML or plain text)', required: true },
      { name: 'cc', type: 'string[]', description: 'CC recipients', required: false },
      { name: 'attachments', type: 'object[]', description: 'File attachments', required: false },
      { name: 'template', type: 'string', description: 'Email template ID to use', required: false }
    ],
    returns: {
      type: 'object',
      description: 'Email status with message ID and delivery confirmation'
    },
    examples: [
      { input: '{"to": ["citizen@example.com"], "subject": "Permit Approved", "body": "Your permit has been approved."}', output: '{"messageId": "msg-123", "status": "sent"}' }
    ]
  },
  'calculate-metrics': {
    id: 'calculate-metrics',
    name: 'Calculate Metrics',
    description: 'Calculate KPIs and metrics from government operational data',
    toolkit: 'Data Analysis Suite',
    toolkitType: 'custom',
    usage: 156,
    parameters: [
      { name: 'metric', type: 'string', description: 'Metric type to calculate', required: true },
      { name: 'data', type: 'object', description: 'Input data for calculation', required: true },
      { name: 'period', type: 'string', description: 'Time period for calculation', required: false },
      { name: 'aggregation', type: 'string', description: 'Aggregation method (sum, avg, min, max)', required: false }
    ],
    returns: {
      type: 'object',
      description: 'Calculated metrics with values, trends, and comparisons'
    },
    examples: [
      { input: '{"metric": "response_time", "data": {"tickets": [...]}, "period": "monthly"}', output: '{"value": 2.3, "unit": "days", "trend": "improving"}' }
    ]
  }
};

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const tool = id ? mockTools[id as keyof typeof mockTools] : null;

  if (!tool) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Tool not found</Typography>
        <Button onClick={() => navigate('/agent-studio/tools')} sx={{ mt: 2 }}>
          Back to Tools
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/agent-studio/tools')}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {tool.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/tools/${id}/edit`)}
        >
          Edit Tool
        </Button>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          sx={{
            backgroundColor: 'warning.main',
            '&:hover': {
              backgroundColor: 'warning.dark',
            },
          }}
        >
          Test Tool
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {tool.description}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Chip
                label={tool.toolkit}
                icon={tool.toolkitType === 'mcp' ? <ExtensionIcon /> : <ApiIcon />}
                color="primary"
              />
              <Chip
                label={tool.toolkitType?.toUpperCase()}
                variant="outlined"
                size="small"
              />
              {tool.usage && (
                <Typography variant="body2" color="text.secondary">
                  Used {tool.usage} times
                </Typography>
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Toolkit Information
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              This tool is part of the <strong>{tool.toolkit}</strong> which is a{' '}
              {tool.toolkitType === 'mcp' && 'Model Context Protocol (MCP) based toolkit for LLM integration.'}
              {tool.toolkitType === 'api' && 'REST API based toolkit for external service integration.'}
              {tool.toolkitType === 'custom' && 'custom implementation toolkit specific to this system.'}
            </Typography>
          </Paper>

          {/* Parameters & Returns */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Specification
            </Typography>

            {/* Parameters Table */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
              Parameters
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tool.parameters.map((param, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {param.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={param.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={param.required ? 'Required' : 'Optional'}
                          size="small"
                          color={param.required ? 'error' : 'default'}
                          variant={param.required ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {param.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Returns */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
              Returns
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Type:</Typography>
                  <Chip label={tool.returns.type} size="small" color="primary" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {tool.returns.description}
                </Typography>
              </CardContent>
            </Card>
          </Paper>

          {/* Examples */}
          {tool.examples && tool.examples.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Usage Examples
              </Typography>
              <Stack spacing={2}>
                {tool.examples.map((example, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="caption" color="text.secondary">
                            Input JSON
                          </Typography>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: 'background.paper',
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              overflowX: 'auto',
                            }}
                          >
                            <pre style={{ margin: 0 }}>{example.input}</pre>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="caption" color="text.secondary">
                            Output
                          </Typography>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: 'action.hover',
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              overflowX: 'auto',
                            }}
                          >
                            <pre style={{ margin: 0 }}>{example.output}</pre>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tool Metadata
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tool ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {tool.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Toolkit
                  </Typography>
                  <Typography variant="body2">{tool.toolkit}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2">
                    {tool.toolkitType === 'mcp' && 'MCP (Model Context Protocol)'}
                    {tool.toolkitType === 'api' && 'REST API'}
                    {tool.toolkitType === 'custom' && 'Custom Implementation'}
                  </Typography>
                </Box>
                {tool.usage && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Usage
                    </Typography>
                    <Typography variant="body2">{tool.usage} invocations</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ApiIcon />}
                  onClick={() => navigate(`/tools/${id}/api`)}
                >
                  View API Documentation
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BuildIcon />}
                  onClick={() => navigate(`/tools/${id}/test`)}
                >
                  Test in Playground
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  onClick={() => navigate(`/toolkits`)}
                >
                  View Parent Toolkit
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToolDetailPage;