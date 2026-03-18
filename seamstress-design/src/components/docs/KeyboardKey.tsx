import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';

export interface KeyboardKeyProps {
  /** The key label to display */
  children: React.ReactNode;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether this is a modifier key (Ctrl, Alt, Shift, Cmd) */
  isModifier?: boolean;
}

/**
 * KeyboardKey - Styled <kbd> component for displaying keyboard keys visually
 *
 * @example
 * <KeyboardKey>Tab</KeyboardKey>
 * <KeyboardKey size="small">Esc</KeyboardKey>
 * <KeyboardKey isModifier>Ctrl</KeyboardKey>
 */
export function KeyboardKey({
  children,
  size = 'medium',
  isModifier = false,
}: KeyboardKeyProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Touch target sizes for WCAG 2.5.5 compliance
  // Small: 32px minimum for inline use
  // Medium: 36px for standard keyboard keys
  // Large: 44px for prominent/standalone keys
  const sizeStyles = {
    small: {
      px: 1,
      py: 0.5,
      fontSize: '0.75rem',
      minWidth: 32,
      minHeight: 32,
      borderRadius: 0.5,
    },
    medium: {
      px: 1.25,
      py: 0.75,
      fontSize: '0.8rem',
      minWidth: 36,
      minHeight: 36,
      borderRadius: 0.75,
    },
    large: {
      px: 1.5,
      py: 1,
      fontSize: '0.9rem',
      minWidth: 44,
      minHeight: 44,
      borderRadius: 1,
    },
  };

  const currentSize = sizeStyles[size];

  // Special styling for arrow keys
  const isArrowKey = ['↑', '↓', '←', '→'].includes(String(children));

  return (
    <Box
      component="kbd"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: isArrowKey
          ? 'system-ui, -apple-system, sans-serif'
          : '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        ...currentSize,
        // Colors - subtle 3D effect
        bgcolor: isDark
          ? alpha(theme.palette.common.white, 0.08)
          : alpha(theme.palette.common.black, 0.04),
        color: isDark
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        // Border with depth effect
        border: `1px solid ${isDark
          ? alpha(theme.palette.common.white, 0.15)
          : alpha(theme.palette.common.black, 0.15)}`,
        borderBottomWidth: 2,
        borderBottomColor: isDark
          ? alpha(theme.palette.common.white, 0.1)
          : alpha(theme.palette.common.black, 0.2),
        // Subtle shadow for 3D effect
        boxShadow: isDark
          ? `0 1px 1px ${alpha(theme.palette.common.black, 0.3)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.05)}`
          : `0 1px 1px ${alpha(theme.palette.common.black, 0.1)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.8)}`,
        // Modifier keys get slightly different styling
        ...(isModifier && {
          bgcolor: isDark
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.primary.main, 0.08),
          borderColor: isDark
            ? alpha(theme.palette.primary.main, 0.3)
            : alpha(theme.palette.primary.main, 0.25),
        }),
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Helper component to display a keyboard shortcut combination
 *
 * @example
 * <KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />
 */
export interface KeyboardShortcutProps {
  keys: string[];
  size?: 'small' | 'medium' | 'large';
  separator?: string;
}

const MODIFIER_KEYS = ['Ctrl', 'Alt', 'Shift', 'Cmd', 'Meta', 'Option', 'Control'];

export function KeyboardShortcut({
  keys,
  size = 'medium',
  separator = '+',
}: KeyboardShortcutProps) {
  const theme = useTheme();

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        flexWrap: 'wrap',
      }}
    >
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <KeyboardKey
            size={size}
            isModifier={MODIFIER_KEYS.includes(key)}
          >
            {key}
          </KeyboardKey>
          {index < keys.length - 1 && (
            <Box
              component="span"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: size === 'small' ? '0.65rem' : size === 'large' ? '0.85rem' : '0.75rem',
                mx: 0.25,
              }}
            >
              {separator}
            </Box>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default KeyboardKey;
