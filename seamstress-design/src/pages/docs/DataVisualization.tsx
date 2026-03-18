import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  useTheme,
  alpha,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  Palette as PaletteIcon,
  Accessibility as AccessibilityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../components/DocsLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  dataVizPalette,
  getSequentialColors,
  getCategoricalColors,
  getColorByIndex,
  getAllColors,
  SERIES_DESCRIPTIONS,
  statusColors,
  type DataVizColor,
} from '../../constants/dataVizColors';
import {
  DataVizPatternDefs,
  getFillWithPattern,
  getSequentialFills,
} from '../../constants/dataVizPatterns';

// Sample data for charts
const monthlyData = [
  { month: 'Jan', utilities: 45000, permits: 32000, procurement: 28000, finance: 18000, eam: 22000, hr: 15000, it: 19000, facilities: 12000 },
  { month: 'Feb', utilities: 52000, permits: 35000, procurement: 31000, finance: 21000, eam: 25000, hr: 17000, it: 21000, facilities: 14000 },
  { month: 'Mar', utilities: 48000, permits: 34000, procurement: 29000, finance: 19000, eam: 23000, hr: 16000, it: 20000, facilities: 13000 },
  { month: 'Apr', utilities: 61000, permits: 38000, procurement: 34000, finance: 24000, eam: 28000, hr: 19000, it: 23000, facilities: 16000 },
  { month: 'May', utilities: 55000, permits: 36000, procurement: 32000, finance: 22000, eam: 26000, hr: 18000, it: 22000, facilities: 15000 },
  { month: 'Jun', utilities: 67000, permits: 40000, procurement: 36000, finance: 26000, eam: 30000, hr: 20000, it: 25000, facilities: 18000 },
];

const categoryData = [
  { name: 'Utilities', value: 156 },
  { name: 'Permits', value: 234 },
  { name: 'Procurement', value: 189 },
  { name: 'Finance', value: 98 },
  { name: 'EAM', value: 143 },
  { name: 'HR', value: 167 },
  { name: 'IT', value: 201 },
  { name: 'Facilities', value: 124 },
];

export default function DataVisualization() {
  const theme = useTheme();
  const [selectedSeries, setSelectedSeries] = React.useState<number>(1);

  useDocumentTitle('Data Visualization');

  // Get all colors for pattern definitions
  const allColors = getAllColors();

  const ColorSwatch = ({ color, index }: { color: DataVizColor; index: number }) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: '100%',
            height: 80,
            borderRadius: 2,
            bgcolor: color.value,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: (theme: any) => alpha(theme.palette.common.black, 0.6),
              color: 'common.white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {index + 1}
          </Box>
        </Box>
        <Typography variant="h6" gutterBottom>
          {color.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            display: 'block',
            bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
            p: 0.5,
            borderRadius: 0.5,
            mb: 1,
            fontSize: '0.7rem',
          }}
        >
          {color.token}
        </Typography>
        <Chip
          label={color.category || 'general'}
          size="small"
          sx={{ fontSize: '0.65rem', height: 20, mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary" display="block">
          {color.usage}
        </Typography>
      </CardContent>
    </Card>
  );

  const CodeBlock = ({ children }: { children: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        overflow: 'auto',
      }}
    >
      <pre style={{ margin: 0 }}>{children}</pre>
    </Paper>
  );

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(dataVizPalette[0].value, 0.1)} 0%, ${alpha(dataVizPalette[3].value, 0.1)} 50%, ${alpha(dataVizPalette[8].value, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PaletteIcon sx={{ fontSize: 48, color: dataVizPalette[0].value }} />
              <Typography variant="h1" component="h1">
                Data Visualization Palette
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              A comprehensive 20-color palette with 5 pattern series for accessible, print-friendly data visualizations
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: 'wrap', gap: 1 }}>
              <Chip label="20 Colors" color="primary" />
              <Chip label="5 Pattern Series" color="secondary" />
              <Chip label="Print-Friendly" color="info" />
              <Chip label="WCAG AA Compliant" color="success" />
              <Chip label="Colorblind-Friendly" />
            </Stack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack spacing={10}>
            {/* When to Use Patterns */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <LayersIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h2">Solid Colors vs Patterns</Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph>
                Use solid colors (Series 1) as your default. Use patterns strategically for emphasis or specific output requirements.
              </Typography>

              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid sx={{ flex: '1 1 350px', minWidth: '350px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `2px solid ${theme.palette.success.main}`, bgcolor: alpha(theme.palette.success.main, 0.03) }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
                        Solid Colors (Default)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Use for 90% of visualizations:
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">• Digital dashboards & screens</Typography>
                        <Typography variant="body2">• Interactive visualizations</Typography>
                        <Typography variant="body2">• Real-time data displays</Typography>
                        <Typography variant="body2">• Up to 6-8 data series</Typography>
                      </Stack>
                      <svg width="100%" height="50" style={{ marginTop: '16px' }}>
                        <DataVizPatternDefs colors={allColors} />
                        {[0, 1, 2, 3, 4].map(idx => (
                          <rect
                            key={idx}
                            x={`${idx * 20}%`}
                            y="0"
                            width="20%"
                            height="50"
                            fill={getFillWithPattern(idx, 1, allColors)}
                            stroke={theme.palette.divider}
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid sx={{ flex: '1 1 350px', minWidth: '350px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `2px solid ${theme.palette.primary.main}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
                        Patterns (Strategic Use)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Use patterns when you need to:
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2"><strong>Highlight outliers</strong> — pattern breaks visual uniformity</Typography>
                        <Typography variant="body2"><strong>Show targets/thresholds</strong> — distinguish goal from actual</Typography>
                        <Typography variant="body2"><strong>Print or PDF export</strong> — ensures grayscale readability</Typography>
                        <Typography variant="body2"><strong>8+ series</strong> — when colors alone aren't enough</Typography>
                      </Stack>
                      <svg width="100%" height="50" style={{ marginTop: '16px' }}>
                        <DataVizPatternDefs colors={allColors} />
                        {[0, 1, 2, 3, 4].map(idx => (
                          <rect
                            key={idx}
                            x={`${idx * 20}%`}
                            y="0"
                            width="20%"
                            height="50"
                            fill={getFillWithPattern(idx, idx === 2 ? 3 : 1, allColors)}
                            stroke={theme.palette.divider}
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Middle bar uses dot pattern to draw attention
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Pattern Reference */}
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Available Patterns
              </Typography>
              <Grid container spacing={2}>
                {[
                  { series: 1, name: 'Solid', desc: 'Default for all data' },
                  { series: 2, name: 'Diagonal ///', desc: 'Good for print, targets' },
                  { series: 3, name: 'Dots', desc: 'Best for outliers, emphasis' },
                  { series: 4, name: 'Diagonal \\\\\\', desc: 'Secondary comparison' },
                  { series: 5, name: 'Horizontal', desc: 'Baseline/threshold lines' },
                ].map(({ series, name, desc }) => (
                  <Grid key={series} sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${selectedSeries === series ? theme.palette.primary.main : theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.primary.main, selectedSeries === series ? 0.05 : 0),
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedSeries(series)}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <svg width="100%" height="30">
                          <DataVizPatternDefs colors={allColors} />
                          <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="30"
                            fill={getFillWithPattern(0, series, allColors)}
                            stroke={theme.palette.divider}
                            strokeWidth="1"
                          />
                        </svg>
                        <Typography variant="caption" fontWeight="bold" display="block" sx={{ mt: 1 }}>
                          {name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Full Color Palette Grid */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Complete Palette (Series {selectedSeries})
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Our 20-color system provides extensive variety for complex visualizations while maintaining
                visual harmony and accessibility.
              </Typography>
              <Grid container spacing={3}>
                {dataVizPalette.map((color, index) => (
                  <Grid key={color.token} sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '250px' }}>
                    <ColorSwatch color={color} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Visual Series Comparison */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Series Comparison
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Visual comparison showing all 5 pattern series with the first 10 colors. Notice how patterns provide
                additional visual distinction beyond color alone.
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
                }}
              >
                <Stack spacing={2}>
                  {[1, 2, 3, 4, 5].map(series => (
                    <Box key={series}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ minWidth: 120, fontFamily: 'monospace' }}
                        >
                          SERIES {series}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {SERIES_DESCRIPTIONS[series]}
                        </Typography>
                      </Stack>
                      <svg width="100%" height={series === 1 ? 60 : 50}>
                        <DataVizPatternDefs colors={allColors} />
                        {[...Array(10)].map((_, idx) => (
                          <g key={idx}>
                            <rect
                              x={`${idx * 10}%`}
                              y="0"
                              width="10%"
                              height={series === 1 ? 60 : 50}
                              fill={getFillWithPattern(idx, series, allColors)}
                              stroke={theme.palette.divider}
                              strokeWidth="1"
                            />
                            {series === 1 && (
                              <title>{dataVizPalette[idx].name}</title>
                            )}
                          </g>
                        ))}
                      </svg>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>

            {/* Usage Guidelines */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Usage Guidelines
              </Typography>
              <Grid container spacing={4}>
                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <BarChartIcon color="primary" fontSize="large" />
                        <Typography variant="h5">Sequential Data</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Use colors in order (0-19) for time series, trends, and ordered data. Use Series 1 (solid) for most charts.
                        Use Series 2-5 (patterns) when printing or for additional accessibility.
                      </Typography>
                      <CodeBlock>{`// Solid colors (Series 1)
const colors = getSequentialColors(3);
// ['#7939FF', '#F3072B', '#A527FF']

// With patterns (Series 2-5)
const fills = getSequentialFills(3, 2, allColors);
// Returns pattern URLs for Recharts`}</CodeBlock>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Best for: Line charts, area charts, stacked bars
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <PieChartIcon color="secondary" fontSize="large" />
                        <Typography variant="h5">Categorical Data</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Use evenly-spaced colors for maximum differentiation. Add patterns for accessibility.
                      </Typography>
                      <CodeBlock>{`// Solid colors
const colors = getCategoricalColors(5);

// With patterns
const fills = getCategoricalFills(5, 3, allColors);
// Dot pattern fills for pie charts`}</CodeBlock>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Best for: Pie charts, bar charts, grouped data
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <LineChartIcon color="success" fontSize="large" />
                        <Typography variant="h5">Status Indicators</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Use specific colors to communicate status, health, and sentiment.
                      </Typography>
                      <Stack spacing={1} sx={{ my: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: statusColors.success,
                              borderRadius: 1,
                            }}
                          />
                          <Typography variant="caption">Green: Success, positive</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: statusColors.warning,
                              borderRadius: 1,
                            }}
                          />
                          <Typography variant="caption">Yellow: Warning, caution</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 24, height: 24, bgcolor: statusColors.error, borderRadius: 1 }} />
                          <Typography variant="caption">Red: Error, negative</Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Best for: Gauges, KPIs, health metrics
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Pattern Use Cases */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Pattern Use Cases
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Practical examples showing when and how to use patterns effectively.
              </Typography>

              {/* Outlier Highlighting Example */}
              <Card elevation={0} sx={{ border: `2px solid ${theme.palette.warning.main}`, mb: 4 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip label="Recommended" color="warning" size="small" />
                    <Typography variant="h5">
                      Highlighting Outliers
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Use a pattern on a single data point to draw attention to an outlier or anomaly.
                    The pattern breaks visual uniformity, making it impossible to miss.
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <DataVizPatternDefs colors={allColors} />
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="name" stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      />
                      <Bar dataKey="value" name="Count">
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.name === 'Permits'
                              ? getFillWithPattern(1, 3, allColors)  // Outlier gets dot pattern
                              : allColors[0]  // Others are solid
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <Alert severity="info" sx={{ mt: 2 }} icon={false}>
                    <strong>Pattern as emphasis:</strong> "Permits" stands out immediately because it's the only bar with a pattern.
                    This technique works for outliers, warnings, or any data point needing attention.
                  </Alert>
                </CardContent>
              </Card>

              {/* Target vs Actual Example */}
              <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Target vs Actual
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Distinguish targets/goals from actual values using patterns. Solid = actual data, Pattern = target/goal.
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <DataVizPatternDefs colors={allColors} />
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="utilities" fill={allColors[0]} name="Actual Revenue" />
                      <Bar dataKey="permits" fill={getFillWithPattern(0, 2, allColors)} name="Target Revenue" />
                    </BarChart>
                  </ResponsiveContainer>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                    Same color, different fill treatment — instantly distinguishes actual from target without needing a second color.
                  </Typography>
                </CardContent>
              </Card>

              {/* Print-Ready Example */}
              <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Print-Ready Charts
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    When exporting to PDF or printing, use patterns so data remains distinguishable in grayscale.
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <DataVizPatternDefs colors={allColors} />
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="utilities" fill={getFillWithPattern(0, 1, allColors)} name="Utilities" />
                      <Bar dataKey="permits" fill={getFillWithPattern(1, 2, allColors)} name="Permits" />
                      <Bar dataKey="procurement" fill={getFillWithPattern(2, 3, allColors)} name="Procurement" />
                      <Bar dataKey="finance" fill={getFillWithPattern(3, 5, allColors)} name="Finance" />
                    </BarChart>
                  </ResponsiveContainer>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                    Each series uses a different pattern — readable even when printed in black & white.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Palette Applied to Different Chart Types */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Palette Across Chart Types
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                See how the 20-color palette works across different visualization types. All examples use
                Series 1 (solid colors) which is the default for digital displays.
              </Typography>

              <Grid container spacing={4}>
                {/* Bar Chart */}
                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Multi-Series Bar Chart
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Perfect for comparing quantities across categories
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                          <DataVizPatternDefs colors={allColors} />
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                          <Bar dataKey="utilities" fill={allColors[0]} name="Utilities" />
                          <Bar dataKey="permits" fill={allColors[1]} name="Permits" />
                          <Bar dataKey="procurement" fill={allColors[2]} name="Procurement" />
                          <Bar dataKey="finance" fill={allColors[3]} name="Finance" />
                          <Bar dataKey="eam" fill={allColors[4]} name="EAM" />
                          <Bar dataKey="hr" fill={allColors[5]} name="HR" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Pie Chart */}
                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Categorical Pie Chart
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Uses evenly-spaced colors for maximum distinction
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <DataVizPatternDefs colors={allColors} />
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getCategoricalColors(categoryData.length)[index]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Line Chart */}
                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Time Series Line Chart
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Sequential colors for temporal data visualization
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                          <DataVizPatternDefs colors={allColors} />
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                          <Line type="monotone" dataKey="utilities" stroke={allColors[0]} strokeWidth={2} name="Utilities" />
                          <Line type="monotone" dataKey="permits" stroke={allColors[1]} strokeWidth={2} name="Permits" />
                          <Line type="monotone" dataKey="procurement" stroke={allColors[2]} strokeWidth={2} name="Procurement" />
                          <Line type="monotone" dataKey="finance" stroke={allColors[3]} strokeWidth={2} name="Finance" />
                          <Line type="monotone" dataKey="eam" stroke={allColors[4]} strokeWidth={2} name="EAM" />
                          <Line type="monotone" dataKey="hr" stroke={allColors[5]} strokeWidth={2} name="HR" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Area Chart */}
                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Stacked Area Chart
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Shows cumulative totals over time with filled areas
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={monthlyData}>
                          <DataVizPatternDefs colors={allColors} />
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                          <Area type="monotone" dataKey="facilities" stackId="1" stroke={allColors[7]} fill={allColors[7]} fillOpacity={0.7} name="Facilities" />
                          <Area type="monotone" dataKey="hr" stackId="1" stroke={allColors[5]} fill={allColors[5]} fillOpacity={0.7} name="HR" />
                          <Area type="monotone" dataKey="finance" stackId="1" stroke={allColors[3]} fill={allColors[3]} fillOpacity={0.7} name="Finance" />
                          <Area type="monotone" dataKey="procurement" stackId="1" stroke={allColors[2]} fill={allColors[2]} fillOpacity={0.7} name="Procurement" />
                          <Area type="monotone" dataKey="permits" stackId="1" stroke={allColors[1]} fill={allColors[1]} fillOpacity={0.7} name="Permits" />
                          <Area type="monotone" dataKey="utilities" stackId="1" stroke={allColors[0]} fill={allColors[0]} fillOpacity={0.7} name="Utilities" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 4 }}>
                <strong>Design Principle:</strong> Use Series 1 (solid colors) as your default for all digital
                dashboards and interactive visualizations. Add patterns (Series 2-5) only when you specifically
                need print compatibility or enhanced accessibility.
              </Alert>
            </Box>


            {/* Implementation Code */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Implementation
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Import and use the data visualization utilities in your components.
              </Typography>
              <CodeBlock>
                {`import {
  getSequentialColors,
  getCategoricalColors,
  getAllColors,
  statusColors,
} from '@/constants/dataVizColors';
import {
  DataVizPatternDefs,
  getFillWithPattern,
  getCategoricalFills,
} from '@/constants/dataVizPatterns';

// Get colors
const allColors = getAllColors();
const colors = getSequentialColors(3);

// Use in Recharts with patterns
<ResponsiveContainer>
  <BarChart data={data}>
    {/* Include pattern definitions */}
    <DataVizPatternDefs colors={allColors} />

    {/* Solid colors (Series 1) */}
    <Bar dataKey="value" fill={colors[0]} />

    {/* With patterns (Series 2-5) */}
    <Bar
      dataKey="value2"
      fill={getFillWithPattern(1, 2, allColors)}
    />
  </BarChart>
</ResponsiveContainer>

// Status colors for metrics
<Box sx={{ color: statusColors.success }}>
  +12.5% Growth
</Box>`}
              </CodeBlock>
            </Box>

            {/* Accessibility */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <AccessibilityIcon color="success" fontSize="large" />
                <Typography variant="h2">Accessibility Considerations</Typography>
              </Stack>

              <Grid container spacing={4}>
                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Contrast Ratios
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        All colors meet WCAG AA standards for contrast when used on white or dark backgrounds.
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Light mode: AA compliant</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Dark mode: AA compliant</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Color Blindness
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        The palette is designed to be distinguishable for users with common types of color
                        blindness.
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Deuteranopia friendly</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Protanopia friendly</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Additional Cues
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Never rely on color alone. Always provide additional visual cues.
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Use labels on charts</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Add patterns or textures</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckIcon color="success" fontSize="small" />
                          <Typography variant="body2">Include legends</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Best Practices */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Best Practices
              </Typography>

              <Grid container spacing={4}>
                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: `1px solid ${theme.palette.success.main}`,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <CheckIcon color="success" />
                      <Typography variant="h6" color="success.main">
                        Do
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        ✓ <strong>Default to solid colors</strong> for all digital dashboards
                      </Typography>
                      <Typography variant="body2">
                        ✓ <strong>Use patterns for emphasis</strong> — highlight outliers, targets, anomalies
                      </Typography>
                      <Typography variant="body2">
                        ✓ <strong>Use patterns for print</strong> — ensures grayscale readability
                      </Typography>
                      <Typography variant="body2">
                        ✓ Use sequential colors (0-19) for ordered/time-series data
                      </Typography>
                      <Typography variant="body2">
                        ✓ Use categorical colors for unrelated categories
                      </Typography>
                      <Typography variant="body2">
                        ✓ Include DataVizPatternDefs when using any patterns
                      </Typography>
                      <Typography variant="body2">
                        ✓ Provide legends and labels on all charts
                      </Typography>
                      <Typography variant="body2">
                        ✓ Test visualizations in both light and dark modes
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: `1px solid ${theme.palette.error.main}`,
                      bgcolor: alpha(theme.palette.error.main, 0.05),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <CancelIcon color="error" />
                      <Typography variant="h6" color="error.main">
                        Don't
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        ✗ <strong>Use patterns everywhere</strong> — they add visual noise
                      </Typography>
                      <Typography variant="body2">
                        ✗ <strong>Use patterns "just in case"</strong> — be intentional
                      </Typography>
                      <Typography variant="body2">
                        ✗ Mix more than 8 colors in a single chart without patterns
                      </Typography>
                      <Typography variant="body2">
                        ✗ Use hard-coded hex values instead of palette utilities
                      </Typography>
                      <Typography variant="body2">
                        ✗ Rely on color alone for critical information
                      </Typography>
                      <Typography variant="body2">
                        ✗ Use adjacent palette colors for unrelated categories
                      </Typography>
                      <Typography variant="body2">
                        ✗ Forget DataVizPatternDefs when using patterns
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Token Reference Table */}
            <Box>
              <Typography variant="h2" gutterBottom>
                Complete Color Reference
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                All 20 colors with their properties and recommended use cases.
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}
                    >
                      <TableCell>
                        <strong>#</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Color</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Token</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Hex Value</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Primary Use Case</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataVizPalette.map((color, index) => (
                      <TableRow key={color.token}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: color.value,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            />
                            <Typography variant="body2">{color.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {color.token}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {color.value}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={color.category || 'general'} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{color.usage}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </Container>
      </Box>
    </DocsLayout>
  );
}
