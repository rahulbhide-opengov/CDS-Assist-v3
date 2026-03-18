import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { ChartWidget as ChartWidgetType } from '../../types/dashboard.types';

interface ChartWidgetProps {
  widget: ChartWidgetType;
  isAgentGenerated?: boolean;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ widget, isAgentGenerated }) => {
  const theme = useTheme();

  const renderChart = () => {
    const { chartType, data, chartConfig = {} } = widget;

    switch (chartType) {
      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? '60%' : 0}
                outerRadius="80%"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || theme.palette.primary.main} />
                ))}
              </Pie>
              {chartConfig.showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xField || 'name'} />
              <YAxis />
              <Tooltip />
              {chartConfig.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={chartConfig.yField || 'value'}
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.primary.main, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xField || 'name'} />
              <YAxis />
              <Tooltip />
              {chartConfig.showLegend && <Legend />}
              <Bar
                dataKey={chartConfig.yField || 'value'}
                fill={theme.palette.primary.main}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || theme.palette.primary.main} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xField || 'name'} />
              <YAxis />
              <Tooltip />
              {chartConfig.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={chartConfig.yField || 'value'}
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.main}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <Box>Unsupported chart type</Box>;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 0
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">
            {widget.title}
          </Typography>
          {isAgentGenerated && (
            <Box
              component="span"
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '10px',
                fontWeight: 600
              }}
            >
              AI Generated
            </Box>
          )}
        </Box>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          {renderChart()}
        </Box>
      </CardContent>
    </Card>
  );
};
