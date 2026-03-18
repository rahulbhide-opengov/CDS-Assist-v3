/* eslint-disable react-refresh/only-export-components */
/**
 * SectionHighlightWrapper Component
 *
 * Wraps section items in DocumentOutlineSidebar with AI scan highlight animation.
 * Reads highlight state from DocumentBuilderAssistantContext.
 */

import React from 'react';
import { AIScanHighlight, DEFAULT_SCAN_CONFIG } from '../../ai/AIScanHighlight';
import type { AnimationState } from '../../ai/AIScanHighlight';
import { useDocumentBuilderAssistantSafe } from '../../../contexts/DocumentBuilderAssistantContext';

// =============================================================================
// Types
// =============================================================================

interface SectionHighlightWrapperProps {
  /** The section ID to check for highlight state */
  sectionId: string;
  /** Child content to wrap */
  children: React.ReactNode;
  /** Whether to use full width display */
  fullWidth?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export const SectionHighlightWrapper: React.FC<SectionHighlightWrapperProps> = ({
  sectionId,
  children,
  fullWidth = true,
}) => {
  const context = useDocumentBuilderAssistantSafe();

  // If context is not available, just render children without highlight
  if (!context) {
    return <>{children}</>;
  }

  const { highlights } = context;
  const highlightState: AnimationState = highlights[sectionId] || 'idle';

  // If idle, just render children without the highlight wrapper overhead
  if (highlightState === 'idle') {
    return <>{children}</>;
  }

  return (
    <AIScanHighlight
      state={highlightState}
      config={DEFAULT_SCAN_CONFIG}
      fullWidth={fullWidth}
    >
      {children}
    </AIScanHighlight>
  );
};

/**
 * Hook to manually trigger highlight on a section.
 * Returns null if context is not available.
 */
export const useSectionHighlight = () => {
  const context = useDocumentBuilderAssistantSafe();

  if (!context) {
    return null;
  }

  return {
    triggerHighlight: context.triggerHighlightSequence,
    setHighlight: context.setHighlight,
    clearHighlight: context.clearHighlight,
    clearAllHighlights: context.clearAllHighlights,
  };
};

export default SectionHighlightWrapper;
