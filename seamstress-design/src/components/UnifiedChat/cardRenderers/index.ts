/**
 * Card Renderer Registry
 *
 * Maps agent types to their specialized card rendering components.
 * This enables agent-specific UI rendering within the unified chat experience.
 */

import React from 'react';
import type { Message } from '@opengov/components-ai-patterns';
import { EAMCardRenderer } from '../../OGAssist/EAMCardRenderer';
import { InspectionCardRenderer } from '../../InspectionScheduler';
import { GenUXMessageRenderer } from '../../OGAssist/GenUXMessageRenderer';
import { ChatVisualization } from '../../OGAssist/ChatVisualization';

// Agent-specific card renderer type
export interface CardRendererProps {
  message: Message;
  metadata: Record<string, any>;
  onAction?: (action: string, data?: any) => void;
}

// Registry of card renderers by agent type
export const cardRenderers: Record<string, React.ComponentType<any>> = {
  eamScheduler: EAMCardRenderer,
  inspection: InspectionCardRenderer,
  buildingCodeGenUX: GenUXMessageRenderer,
  eamDashboard: ChatVisualization,
};

/**
 * Get the appropriate card renderer for an agent type
 */
export function getCardRenderer(agentType: string): React.ComponentType<any> | null {
  return cardRenderers[agentType] || null;
}

/**
 * Check if an agent has a specialized card renderer
 */
export function hasCardRenderer(agentType: string): boolean {
  return agentType in cardRenderers;
}

/**
 * Render cards based on message metadata
 * This is a helper function to determine which renderer to use based on message content
 */
export function shouldRenderCard(message: Message): boolean {
  const metadata = (message as any).metadata;
  if (!metadata) return false;

  // Check for various card types
  return !!(
    metadata.cardType ||
    metadata.componentType ||
    metadata.uiComponents ||
    metadata.suggestedWidget?.visualizationData
  );
}
