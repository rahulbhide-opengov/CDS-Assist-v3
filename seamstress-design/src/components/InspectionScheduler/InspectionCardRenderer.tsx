import React from 'react';
import { Box, Typography, Alert, CircularProgress, Stack } from '@mui/material';
import { InspectorAvailability } from './InspectorAvailability';
import { InspectorCapacity } from './InspectorCapacity';
import { DailyInspectionSummaryComponent } from './DailyInspectionSummary';
import { ChecklistStatusReview } from './ChecklistStatusReview';
import { CommunityMetrics } from './CommunityMetrics';

interface InspectionCardRendererProps {
  data: any;
  componentType?: string;
  isLoading?: boolean;
  error?: string;
}

export const InspectionCardRenderer: React.FC<InspectionCardRendererProps> = ({
  data,
  componentType,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No data available. Please try a different query.
      </Alert>
    );
  }

  // Handle text responses
  if (data.message) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {data.message}
        </Typography>
        {data.suggestions && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Try asking:
            </Typography>
            <Stack spacing={1}>
              {data.suggestions.map((suggestion: string, index: number) => (
                <Typography key={index} variant="body2" sx={{ pl: 2 }}>
                  • {suggestion}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    );
  }

  // Render based on component type
  switch (componentType) {
    case 'InspectorAvailability':
      return (
        <InspectorAvailability
          inspectors={data.inspectors || []}
          availableSlots={data.availableSlots || []}
          onSchedule={() => {}}
          onViewCalendar={() => {}}
        />
      );

    case 'InspectorCapacity':
      return (
        <InspectorCapacity
          capacityData={data}
          onAssignInspection={() => {}}
          onViewDetails={() => {}}
        />
      );

    case 'DailyInspectionSummary':
      return (
        <DailyInspectionSummaryComponent
          summary={data.summary}
          inspectionEvents={data.events || []}
          onViewInspection={() => {}}
          onPrintReport={() => {}}
          onEmailReport={() => {}}
        />
      );

    case 'ChecklistStatusReview':
      return (
        <ChecklistStatusReview
          inspectionId="inspection_123"
          checklistItems={data.items || []}
          summary={data.summary}
          inspectionAddress="123 Main St"
          inspectionType="Final"
          onPrintChecklist={() => {}}
          onShareReport={() => {}}
        />
      );

    case 'CommunityMetrics':
      return (
        <CommunityMetrics
          metrics={data}
          onViewDetails={() => {}}
          onExportData={() => {}}
        />
      );

    default:
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unable to render this response type. Raw data:
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Alert>
      );
  }
};