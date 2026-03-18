/**
 * Gen UX Message Renderer
 * Renders interactive UI components in agent messages
 */

import React from 'react';
import { Box } from '@mui/material';
import type { Message } from '@opengov/components-ai-patterns';
import { DeckConfigCard } from './GenUX/DeckConfigCard';
import { ApplicationRequirements } from './GenUX/ApplicationRequirements';
import { ApplicationSuccess } from './GenUX/ApplicationSuccess';
import { MaterialComparison } from './GenUX/MaterialComparison';
import { ApprovalCheckpoint } from './ApprovalCheckpoint';

interface GenUXMessageRendererProps {
  message: Message;
  onComponentAction?: (action: string, data?: any) => void;
}

export const GenUXMessageRenderer: React.FC<GenUXMessageRendererProps> = ({
  message,
  onComponentAction
}) => {
  const uiComponents = (message as any).metadata?.uiComponents;

  if (!uiComponents || !Array.isArray(uiComponents) || uiComponents.length === 0) {
    return null;
  }

  const handleSubmit = (data: any) => {
    onComponentAction?.('submit', data);
  };

  const handleApprove = () => {
    onComponentAction?.('approve', (message as any).metadata?.approvalData);
  };

  const handleReject = () => {
    onComponentAction?.('reject');
  };

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      {uiComponents.map((component, index) => {
        switch (component.type) {
          case 'DeckConfigCard':
            return (
              <DeckConfigCard
                key={index}
                onSubmit={handleSubmit}
                {...component.props}
              />
            );

          case 'ApprovalCheckpoint':
            return (
              <ApprovalCheckpoint
                key={index}
                title={component.props?.title || 'Approval Required'}
                actionDescription={component.props?.actionDescription || ''}
                actionDetails={component.props?.actionDetails}
                warningMessage={component.props?.warningMessage}
                onApprove={handleApprove}
                onReject={handleReject}
                {...component.props}
              />
            );

          case 'PermitStatusCard':
            return (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: component.props?.permitRequired ? 'warning.light' : 'success.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      {component.props?.permitRequired ? '📋' : '✅'}
                    </Box>
                    <Box>
                      <Box sx={{ fontSize: '20px', fontWeight: 600 }}>
                        {component.props?.permitRequired ? 'Permit Required' : 'No Permit Needed'}
                      </Box>
                      <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>
                        {component.props?.reason}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box>
                    <Box sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>Size</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 500 }}>{component.props?.squareFeet} sq ft</Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>Height</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 500 }}>{component.props?.height}"</Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>Attachment</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 500 }}>{component.props?.attachment}</Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>Code Section</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 500 }}>{component.props?.codeSection}</Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'info.light',
                    borderRadius: 1,
                    fontSize: '12px',
                    color: 'info.dark',
                  }}
                >
                  📖 Source: @knowledge/residential-building-code - Section {component.props?.codeSection}
                </Box>
              </Box>
            );

          case 'ApplicationRequirements':
            return (
              <ApplicationRequirements
                key={index}
                {...component.props}
              />
            );

          case 'ApplicationSuccess':
            return (
              <ApplicationSuccess
                key={index}
                {...component.props}
              />
            );

          case 'MaterialComparison':
            return (
              <MaterialComparison
                key={index}
                onSelectMaterial={(materialName) =>
                  handleSubmit({ material: materialName })
                }
                {...component.props}
              />
            );

          default:
            return (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  fontSize: '14px',
                }}
              >
                Component type "{component.type}" not yet implemented
              </Box>
            );
        }
      })}
    </Box>
  );
};
