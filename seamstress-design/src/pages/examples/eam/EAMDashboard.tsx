import React, { useCallback } from 'react';
import { Box, Button, IconButton, Fab } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Refresh, AiOgAssist } from '@opengov/react-capital-assets';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { MetricWidget } from '../../../components/dashboard/MetricWidget';
import { ChartWidget } from '../../../components/dashboard/ChartWidget';
import { TableWidget } from '../../../components/dashboard/TableWidget';
import { MapWidget } from '../../../components/dashboard/MapWidget';
import type { Widget } from '../../../types/dashboard.types';

/**
 * EAM Operations Dashboard
 *
 * AI-powered dashboard for Enterprise Asset Management with dynamic
 * visualization generation through natural conversation.
 *
 * Features:
 * - Default operational widgets (metrics, charts, tables)
 * - AI Assistant for custom visualization generation (via Unified Chat)
 * - Real-time work order data and insights
 * - Interactive widget management
 */
export const EAMDashboard: React.FC = () => {
  const { widgets, resetToDefaults } = useDashboardStore();

  // Open the unified chat with eamDashboard agent
  const openAssistant = useCallback(() => {
    if ((window as any).openUnifiedChat) {
      (window as any).openUnifiedChat();
    }
  }, []);

  const renderWidget = (widget: Widget) => {
    const isAgentGenerated = widget.source === 'agent-generated';

    switch (widget.type) {
      case 'metric':
        return <MetricWidget widget={widget} isAgentGenerated={isAgentGenerated} />;
      case 'chart':
        return <ChartWidget widget={widget} isAgentGenerated={isAgentGenerated} />;
      case 'table':
        return <TableWidget widget={widget} isAgentGenerated={isAgentGenerated} />;
      case 'map':
        return <MapWidget widget={widget} isAgentGenerated={isAgentGenerated} />;
      default:
        return null;
    }
  };

  // Separate default widgets from AI-generated widgets
  const defaultWidgets = widgets.filter(w => w.source === 'default');
  const aiGeneratedWidgets = widgets.filter(w => w.source === 'agent-generated');

  // Render stat cards (metrics)
  const renderStatCards = () => {
    const metricWidgets = defaultWidgets.filter(w => w.type === 'metric');

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3
        }}
      >
        {metricWidgets.map(widget => (
          <Box key={widget.id}>
            {renderWidget(widget)}
          </Box>
        ))}
      </Box>
    );
  };

  // Render default charts and tables
  const renderDefaultCharts = () => {
    const chartAndTableWidgets = defaultWidgets.filter(w => w.type !== 'metric');

    // Group by row
    const rows: Record<number, Widget[]> = {};
    chartAndTableWidgets.forEach(widget => {
      const y = widget.gridPosition.y;
      if (!rows[y]) rows[y] = [];
      rows[y].push(widget);
    });

    return Object.keys(rows).sort((a, b) => Number(a) - Number(b)).map(rowKey => {
      const rowWidgets = rows[Number(rowKey)].sort((a, b) => a.gridPosition.x - b.gridPosition.x);
      const maxHeight = Math.max(...rowWidgets.map(w => w.gridPosition.h));

      return (
        <Box
          key={`row-${rowKey}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 2,
            mb: 2,
            minHeight: `${maxHeight * 100}px`
          }}
        >
          {rowWidgets.map(widget => (
            <Box
              key={widget.id}
              sx={{
                gridColumn: `span ${widget.gridPosition.w}`,
                height: '100%'
              }}
            >
              {renderWidget(widget)}
            </Box>
          ))}
        </Box>
      );
    });
  };

  // Render AI-generated cards with consistent sizing
  // 1 card = 100% width, 2+ cards = 2-column grid
  const renderAICards = () => {
    if (aiGeneratedWidgets.length === 0) return null;

    const gridColumns = aiGeneratedWidgets.length === 1 ? '1fr' : 'repeat(2, 1fr)';

    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: 2
          }}
        >
          {aiGeneratedWidgets.map(widget => (
            <Box
              key={widget.id}
              sx={{
                height: '400px' // Consistent height for all AI cards
              }}
            >
              {renderWidget(widget)}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page Header - Required by Seamstress pattern */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="reset"
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetToDefaults}
              size="small"
            >
              Reset
            </Button>,
            <Button
              key="assistant"
              variant="contained"
              startIcon={<AiOgAssist />}
              onClick={openAssistant}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Assistant
            </Button>
          ]}
        >
          <PageHeaderComposable.Title>Operations Dashboard</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Enterprise Asset Management
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Dashboard Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          bgcolor: 'background.default'
        }}
      >
        {/* Stat Cards */}
        {renderStatCards()}

        {/* AI-Generated Cards */}
        {renderAICards()}

        {/* Default Charts and Tables */}
        {renderDefaultCharts()}
      </Box>

      {/* Floating Assistant Button (mobile) */}
      <Fab
        color="primary"
        aria-label="assistant"
        onClick={openAssistant}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' } // Only show on mobile
        }}
      >
        <AiOgAssist />
      </Fab>
    </Box>
  );
};

export default EAMDashboard;
