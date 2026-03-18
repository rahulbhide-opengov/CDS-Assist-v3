import React from 'react';
import { colorTokens } from '../theme/cds/tokens';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import { cdsDesignTokens } from '../theme/cds';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, changeType = 'positive' }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return colorTokens.success.main;
      case 'negative':
        return colorTokens.error.main;
      default:
        return colorTokens.grey[700];
    }
  };

  return (
    <Card sx={{ height: '100%', p: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h1" component="div">
          {value}
        </Typography>
        {change && (
          <Chip
            label={change}
            size="small"
            sx={{
              backgroundColor: `${getChangeColor()}20`,
              color: getChangeColor(),
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface UsageData {
  name: string;
  value: number;
  color: string;
}

interface TableData {
  head: string[];
  rows: string[][];
}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Sample data for pie charts
  const userMessageBreakdown: UsageData[] = [
    { name: 'API', value: 45, color: colorTokens.primary.main },
    { name: 'Web', value: 30, color: colorTokens.secondary.main },
    { name: 'Mobile', value: 15, color: colorTokens.info.main },
    { name: 'CLI', value: 10, color: colorTokens.primary[400] },
  ];

  const agentUsageData: UsageData[] = [
    { name: 'Research', value: 35, color: colorTokens.primary.main },
    { name: 'Writing', value: 25, color: colorTokens.secondary.main },
    { name: 'Analysis', value: 20, color: colorTokens.info.main },
    { name: 'Support', value: 15, color: colorTokens.warning.main },
    { name: 'Other', value: 5, color: colorTokens.primary[400] },
  ];

  // Knowledge base data
  const knowledgeTypeBreakdown: UsageData[] = [
    { name: 'Markdown', value: 142, color: colorTokens.primary.main },
    { name: 'PDF', value: 89, color: colorTokens.secondary.main },
    { name: 'CSV/Excel', value: 56, color: colorTokens.info.main },
    { name: 'Word', value: 34, color: colorTokens.success.main },
    { name: 'Text', value: 28, color: colorTokens.warning.main },
  ];

  const skillUsageData: UsageData[] = [
    { name: 'Data Processing', value: 40, color: colorTokens.primary.main },
    { name: 'Content Generation', value: 25, color: colorTokens.secondary.main },
    { name: 'Code Review', value: 20, color: colorTokens.info.main },
    { name: 'Translation', value: 10, color: colorTokens.warning.main },
    { name: 'Other', value: 5, color: colorTokens.primary[400] },
  ];

  const toolUsageData: UsageData[] = [
    { name: 'Search', value: 30, color: colorTokens.primary.main },
    { name: 'Database', value: 25, color: colorTokens.secondary.main },
    { name: 'API', value: 20, color: colorTokens.info.main },
    { name: 'File System', value: 15, color: colorTokens.warning.main },
    { name: 'Other', value: 10, color: colorTokens.primary[400] },
  ];

  // Sample table data with 5 columns
  const userTableData: TableData = {
    head: ['User', 'Messages', 'Tasks', 'Avg Response', 'Last Active'],
    rows: [
      ['John Doe', '142', '38', '1.2s', '2 hours ago'],
      ['Jane Smith', '98', '25', '0.9s', '5 hours ago'],
      ['Bob Johnson', '76', '19', '1.5s', '1 day ago'],
      ['Alice Brown', '65', '22', '1.1s', '1 day ago'],
      ['Chris Wilson', '54', '15', '0.8s', '2 days ago'],
      ['Emma Davis', '43', '12', '1.3s', '3 days ago'],
    ],
  };

  const agentTableData: TableData = {
    head: ['Agent', 'Usage Count', 'Success Rate', 'Avg Duration', 'Status'],
    rows: [
      ['Research Agent', '234', '94%', '3.2s', 'Active'],
      ['Writing Agent', '189', '91%', '4.5s', 'Active'],
      ['Analysis Agent', '156', '88%', '2.8s', 'Active'],
      ['Support Agent', '98', '92%', '1.9s', 'Active'],
      ['Translation Agent', '67', '95%', '2.1s', 'Active'],
      ['Code Agent', '45', '87%', '5.3s', 'Active'],
    ],
  };

  const skillTableData: TableData = {
    head: ['Skill', 'Executions', 'Avg Time', 'Success Rate', 'Last Used'],
    rows: [
      ['Data Processing', '456', '2.3s', '96%', '1 hour ago'],
      ['Content Gen', '342', '4.1s', '92%', '2 hours ago'],
      ['Code Review', '234', '3.5s', '89%', '3 hours ago'],
      ['Translation', '123', '1.8s', '94%', '5 hours ago'],
      ['Summarization', '89', '2.1s', '91%', '1 day ago'],
      ['Classification', '67', '0.9s', '93%', '1 day ago'],
    ],
  };

  const toolTableData: TableData = {
    head: ['Tool', 'Calls', 'Status', 'Latency', 'Error Rate'],
    rows: [
      ['Search API', '567', 'Active', '120ms', '0.2%'],
      ['Database', '432', 'Active', '45ms', '0.1%'],
      ['External API', '321', 'Active', '250ms', '0.5%'],
      ['File System', '234', 'Active', '10ms', '0.0%'],
      ['Cache', '189', 'Active', '5ms', '0.0%'],
      ['Queue', '145', 'Active', '30ms', '0.1%'],
    ],
  };

  const knowledgeTableData: TableData = {
    head: ['Document', 'Type', 'Size', 'Status', 'Last Modified'],
    rows: [
      ['API Documentation v2.4', 'Markdown', '142 KB', 'Published', '2 hours ago'],
      ['User Guide 2024', 'PDF', '3.2 MB', 'Published', '1 day ago'],
      ['Financial Report Q4', 'Excel', '1.8 MB', 'Draft', '3 days ago'],
      ['Technical Specs', 'Markdown', '89 KB', 'Published', '5 days ago'],
      ['Meeting Notes', 'Text', '12 KB', 'Draft', '1 week ago'],
      ['Product Roadmap', 'PDF', '5.1 MB', 'Published', '2 weeks ago'],
      ['Code Guidelines', 'Markdown', '67 KB', 'Published', '3 weeks ago'],
      ['Training Materials', 'Word', '2.4 MB', 'Draft', '1 month ago'],
    ],
  };

  const renderPieChart = (data: UsageData[], chartLabel: string) => (
    <Box sx={{ width: 200, height: 200, mx: 'auto' }} role="img" aria-label={chartLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderTable = (data: TableData, tableLabel: string) => (
    <TableContainer
      sx={{
        maxHeight: 400,
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '4px',
        '& .MuiTable-root': {
          fontSize: '0.875rem',
        },
      }}
    >
      <Table size="medium" aria-label={tableLabel}>
        <TableHead>
          <TableRow>
            {data.head.map((head, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  padding: '12px 16px',
                  bgcolor: 'grey.50',
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  sx={{
                    fontSize: '0.875rem',
                    padding: '12px 16px',
                    borderBottom: rowIndex < data.rows.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderLegend = (data: UsageData[]) => (
    <Box sx={{
      display: 'flex',
      gap: 2,
      mt: 2,
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      {data.map((item) => (
        <Box
          key={item.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: item.color,
              borderRadius: '50%',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
            }}
          >
            {item.name}: <Box component="strong" sx={{ color: 'text.primary' }}>{item.value}%</Box>
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      backgroundColor: 'background.default',
      overflow: 'hidden'
    }}>
      {/* Page Header */}
      <Box
        component="header"
        sx={{
          '& > div': {
            px: 3,
            py: 2.5
          },
          '& > div > div': {
            px: 0
          }
        }}
      >
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>
              Dashboard
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Assistant activity at a glance
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: 'background.secondary',
          overflow: 'auto',
          padding: 3,
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%'
        }}
      >
        <Stack spacing={3}>
        {/* Metrics Cards */}
        <Box component="section" role="region" aria-labelledby="metrics-section-heading">
          <Typography variant="srOnly" component="h2" id="metrics-section-heading">
            Key Metrics
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing={3}>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Messages" value="5322" change="+86" changeType="positive" />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Tasks Completed" value="542" change="-36" changeType="negative" />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Tool Usage" value="820" change="+46" changeType="positive" />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Skills Published" value="230" change="30" changeType="neutral" />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Agents Published" value="6" change="-1" changeType="negative" />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard label="Knowledge Docs" value="349" change="+24" changeType="positive" />
            </Box>
          </Stack>
        </Box>

        {/* Knowledge Base */}
        <Box component="section" role="region" aria-labelledby="knowledge-base-heading">
          <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} component="h2" id="knowledge-base-heading">
                Knowledge Base
              </Typography>
              <Stack pb={2} direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                <Chip
                  label="349 Documents"
                  size="small"
                  sx={{
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                  }}
                />
                <Chip
                  label="218 Published"
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Button
                  size="small"
                  variant="text"
                  sx={{ minWidth: 'auto', p: '2px 8px' }}
                  onClick={() => navigate('/agent-studio/knowledge')}
                >
                  View Knowledge
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack sx={{ width: { xs: '100%', md: '420px' }, flexShrink: 0 }} alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight="medium" gutterBottom>
                  Document Types
                </Typography>
                {renderPieChart(knowledgeTypeBreakdown, 'Document types distribution: Markdown 142, PDF 89, CSV/Excel 56, Word 34, Text 28')}
                {renderLegend(knowledgeTypeBreakdown)}
                <Box sx={{ mt: 2, px: 2 }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="caption" color="text.secondary">Storage Used</Typography>
                    <Typography variant="caption" color="text.primary" fontWeight="medium">
                      8.4 GB / 50 GB
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={16.8}
                    aria-label="Storage usage: 8.4 GB of 50 GB used (16.8%)"
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  />
                </Box>
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {renderTable(knowledgeTableData, 'Knowledge base documents')}
                <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <ArticleIcon color="primary" aria-hidden="true" />
                    <Typography variant="caption" color="text.secondary">
                      142 Markdown
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PictureAsPdfIcon color="error" aria-hidden="true" />
                    <Typography variant="caption" color="text.secondary">
                      89 PDFs
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TableChartIcon color="success" aria-hidden="true" />
                    <Typography variant="caption" color="text.secondary">
                      56 Spreadsheets
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <DescriptionIcon color="warning" aria-hidden="true" />
                    <Typography variant="caption" color="text.secondary">
                      62 Others
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>

        {/* User/Messages Breakdown */}
        <Box component="section" role="region" aria-labelledby="user-messages-heading">
          <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2 }}
              spacing={1}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} component="h2" id="user-messages-heading">
                User/Messages Breakdown
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack sx={{ width: { xs: '100%', md: '420px' }, flexShrink: 0 }} alignItems="center">
                {renderPieChart(userMessageBreakdown, 'User message breakdown: API 45%, Web 30%, Mobile 15%, CLI 10%')}
                {renderLegend(userMessageBreakdown)}
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {renderTable(userTableData, 'User activity and message statistics')}
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>

        {/* Agent Usage */}
        <Box component="section" role="region" aria-labelledby="agent-usage-heading">
          <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2 }}
              spacing={1}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} component="h2" id="agent-usage-heading">
                Agent Usage
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Button
                  size="small"
                  variant="text"
                  sx={{ minWidth: 'auto', p: '2px 8px' }}
                  onClick={() => navigate('/agents')}
                >
                  View Agents
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack sx={{ width: { xs: '100%', md: '420px' }, flexShrink: 0 }} alignItems="center">
                {renderPieChart(agentUsageData, 'Agent usage distribution: Research 35%, Writing 25%, Analysis 20%, Support 15%, Other 5%')}
                {renderLegend(agentUsageData)}
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {renderTable(agentTableData, 'Agent usage statistics')}
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>

        {/* Skill Usage */}
        <Box component="section" role="region" aria-labelledby="skill-usage-heading">
          <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2 }}
              spacing={1}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} component="h2" id="skill-usage-heading">
                Skill Usage
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Button
                  size="small"
                  variant="text"
                  sx={{ minWidth: 'auto', p: '2px 8px' }}
                  onClick={() => navigate('/skills')}
                >
                  View Skills
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack sx={{ width: { xs: '100%', md: '420px' }, flexShrink: 0 }} alignItems="center">
                {renderPieChart(skillUsageData, 'Skill usage distribution: Data Processing 40%, Content Generation 25%, Code Review 20%, Translation 10%, Other 5%')}
                {renderLegend(skillUsageData)}
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {renderTable(skillTableData, 'Skill execution statistics')}
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>

        {/* Tool Usage */}
        <Box component="section" role="region" aria-labelledby="tool-usage-heading">
          <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2 }}
              spacing={1}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} component="h2" id="tool-usage-heading">
                Tool Usage
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Button
                  size="small"
                  variant="text"
                  sx={{ minWidth: 'auto', p: '2px 8px' }}
                  onClick={() => navigate('/tools')}
                >
                  View Tools
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack sx={{ width: { xs: '100%', md: '420px' }, flexShrink: 0 }} alignItems="center">
                {renderPieChart(toolUsageData, 'Tool usage distribution: Search 30%, Database 25%, API 20%, File System 15%, Other 10%')}
                {renderLegend(toolUsageData)}
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {renderTable(toolTableData, 'Tool usage statistics')}
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>
      </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPage;
