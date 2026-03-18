/**
 * FormFieldHelper - Accessible form field utilities
 *
 * Provides helper functions and components for creating accessible form fields
 * with proper ARIA attributes, error states, and screen reader announcements.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Get accessible props for form fields
 *
 * Returns ARIA attributes for proper screen reader announcement of errors
 * and invalid states.
 *
 * @param fieldName - Unique identifier for the field (used for aria-describedby)
 * @param error - Error message string (if field has an error)
 * @returns Object with aria-invalid, aria-describedby, and error props
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   {...getAccessibleFieldProps('email', errors.email)}
 * />
 * ```
 */
export const getAccessibleFieldProps = (
  fieldName: string,
  error?: string
): {
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
  error: boolean;
} => ({
  'aria-invalid': Boolean(error),
  'aria-describedby': error ? `${fieldName}-error` : undefined,
  error: Boolean(error),
});

/**
 * Props for AccessibleFormError component
 */
interface AccessibleFormErrorProps {
  /** Unique field name for the error ID */
  fieldName: string;
  /** Error message to display */
  error?: string;
  /** Optional helper text shown when there's no error */
  helperText?: string;
}

/**
 * AccessibleFormError - Error message component with screen reader support
 *
 * Displays error messages with:
 * - Error icon for visual indication
 * - "Error:" prefix for screen readers
 * - Proper ID for aria-describedby linking
 * - role="alert" for immediate announcement
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Username"
 *   {...getAccessibleFieldProps('username', errors.username)}
 * />
 * <AccessibleFormError fieldName="username" error={errors.username} />
 * ```
 */
export function AccessibleFormError({
  fieldName,
  error,
  helperText,
}: AccessibleFormErrorProps) {
  if (!error && !helperText) {
    return null;
  }

  if (error) {
    return (
      <Box
        id={`${fieldName}-error`}
        role="alert"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.5,
          mt: 0.5,
        }}
      >
        <ErrorOutlineIcon
          color="error"
          sx={{ fontSize: 16, mt: '2px', flexShrink: 0 }}
          aria-hidden="true"
        />
        <Typography
          variant="caption"
          color="error"
          component="span"
        >
          {/* Screen reader prefix */}
          <Box component="span" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
            Error:
          </Box>
          {error}
        </Typography>
      </Box>
    );
  }

  // Show helper text when no error
  return (
    <Typography
      id={`${fieldName}-helper`}
      variant="caption"
      color="text.secondary"
      sx={{ mt: 0.5, display: 'block' }}
    >
      {helperText}
    </Typography>
  );
}

/**
 * Utility to generate a unique field ID
 * Useful when dynamically generating form fields
 */
export const generateFieldId = (prefix: string, index?: number): string => {
  const baseId = prefix.toLowerCase().replace(/\s+/g, '-');
  return index !== undefined ? `${baseId}-${index}` : baseId;
};

export default {
  getAccessibleFieldProps,
  AccessibleFormError,
  generateFieldId,
};
