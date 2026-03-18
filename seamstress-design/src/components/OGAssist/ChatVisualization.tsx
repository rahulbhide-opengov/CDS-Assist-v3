import React from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import { Box, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChatVisualizationProps {
  type: 'chart' | 'table' | 'map';
  title: string;
  data: any[];
  chartType?: 'pie' | 'line' | 'bar' | 'donut';
  chartConfig?: any;
  columns?: any[];
  onAddToDashboard?: () => void;
  buttonText?: string;
}

export const ChatVisualization: React.FC<ChatVisualizationProps> = ({
  type,
  title,
  data,
  chartType,
  chartConfig = {},
  columns,
  onAddToDashboard,
  buttonText = 'Add to Dashboard'
}) => {
  const theme = useTheme();

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? '60%' : 0}
                outerRadius="70%"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || colorTokens.primary.main} />
                ))}
              </Pie>
              {chartConfig.showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xField || 'name'} style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              {chartConfig.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={chartConfig.yField || 'value'}
                stroke="#4b3fff"
                strokeWidth={2}
                dot={{ fill: colorTokens.primary.main, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xField || 'name'} style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              {chartConfig.showLegend && <Legend />}
              <Bar dataKey={chartConfig.yField || 'value'} fill="#4b3fff">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || colorTokens.primary.main} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <Box>Unsupported chart type</Box>;
    }
  };

  const renderTable = () => {
    if (!columns || !data) return null;

    return (
      <Box sx={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.secondary || theme.palette.grey[50],
                    position: 'sticky',
                    top: 0
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row: any, rowIndex: number) => (
              <tr key={rowIndex} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                {columns.map((col: any) => (
                  <td key={col.key} style={{ padding: '8px' }}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 5 && (
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
            +{data.length - 5} more rows
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        mt: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 0,
        bgcolor: 'background.paper'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600 }}>
            {title}
          </Typography>
          {onAddToDashboard && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddToDashboard}
              sx={{
                fontSize: '12px',
                textTransform: 'none',
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
                  borderColor: 'secondary.dark',
                  bgcolor: 'secondary.light'
                }
              }}
            >
              {buttonText}
            </Button>
          )}
        </Box>
        {type === 'chart' && renderChart()}
        {type === 'table' && renderTable()}
        {type === 'map' && (
          <Box sx={{ height: 250, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Map visualization ({data.length} locations)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
