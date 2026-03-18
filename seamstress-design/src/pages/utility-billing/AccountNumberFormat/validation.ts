import type { BaseSegment, FormatConfig } from './types';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const validateFormatConfig = <T extends BaseSegment>(
  config: FormatConfig<T>,
  formatName: string
): string[] => {
  const errors: string[] = [];

  // Check if all segments have required fields
  config.segments.forEach((segment, index) => {
    if (!segment.type) {
      errors.push(`${formatName} - Segment ${index + 1}: Type must be selected`);
    }
    if (!segment.name.trim()) {
      errors.push(`${formatName} - Segment ${index + 1}: Name is required`);
    }
    if (!segment.code.trim()) {
      errors.push(`${formatName} - Segment ${index + 1}: Code is required`);
    }
  });

  return errors;
};

// Deep equality check helper
export const isDeepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
