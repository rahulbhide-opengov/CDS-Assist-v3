import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Stack, useTheme, alpha } from '@mui/material';

export interface SpacingMeasurements {
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  gap: { row: number; column: number } | null;
  width: number;
  height: number;
}

interface SpacingInspectorProps {
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement>;
  onElementSelected?: (element: HTMLElement, measurements: SpacingMeasurements) => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getMeasurements(element: HTMLElement): SpacingMeasurements {
  const computedStyle = window.getComputedStyle(element);

  const padding = {
    top: parseFloat(computedStyle.paddingTop) || 0,
    right: parseFloat(computedStyle.paddingRight) || 0,
    bottom: parseFloat(computedStyle.paddingBottom) || 0,
    left: parseFloat(computedStyle.paddingLeft) || 0,
  };

  const margin = {
    top: parseFloat(computedStyle.marginTop) || 0,
    right: parseFloat(computedStyle.marginRight) || 0,
    bottom: parseFloat(computedStyle.marginBottom) || 0,
    left: parseFloat(computedStyle.marginLeft) || 0,
  };

  // Check for gap (flex/grid)
  const rowGap = parseFloat(computedStyle.rowGap) || 0;
  const columnGap = parseFloat(computedStyle.columnGap) || 0;
  const hasGap = rowGap > 0 || columnGap > 0;
  const gap = hasGap ? { row: rowGap, column: columnGap } : null;

  const rect = element.getBoundingClientRect();

  return {
    padding,
    margin,
    gap,
    width: rect.width,
    height: rect.height,
  };
}

// MUI default spacing unit is 8px
const SPACING_UNIT = 8;

function pxToThemeSpacing(px: number): number | null {
  if (px === 0) return 0;
  const spacing = px / SPACING_UNIT;
  // Only return if it's a clean multiple of the spacing unit
  if (Number.isInteger(spacing) || Math.abs(spacing - Math.round(spacing)) < 0.01) {
    return Math.round(spacing);
  }
  return null;
}

interface FormattedSpacing {
  themeValue: string | null;  // e.g., "p={3}" or "spacing={2}"
  pixelValue: string;         // e.g., "24px" or "16px 24px"
}

function formatSpacingWithTheme(
  values: { top: number; right: number; bottom: number; left: number },
  propPrefix: string = ''
): FormattedSpacing {
  const { top, right, bottom, left } = values;

  // Check if all values are zero
  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return { themeValue: null, pixelValue: '0' };
  }

  // Convert to theme spacing
  const topSpacing = pxToThemeSpacing(top);
  const rightSpacing = pxToThemeSpacing(right);
  const bottomSpacing = pxToThemeSpacing(bottom);
  const leftSpacing = pxToThemeSpacing(left);

  let themeValue: string | null = null;
  let pixelValue: string;

  // All same
  if (top === right && right === bottom && bottom === left) {
    pixelValue = `${top}px`;
    if (topSpacing !== null) {
      themeValue = propPrefix ? `${propPrefix}={${topSpacing}}` : `${topSpacing}`;
    }
  }
  // Vertical/horizontal same (py, px pattern)
  else if (top === bottom && left === right) {
    pixelValue = `${top}px ${right}px`;
    if (topSpacing !== null && rightSpacing !== null) {
      if (propPrefix) {
        themeValue = `${propPrefix}y={${topSpacing}} ${propPrefix}x={${rightSpacing}}`;
      } else {
        themeValue = `${topSpacing} ${rightSpacing}`;
      }
    }
  }
  // Left/right same
  else if (left === right) {
    pixelValue = `${top}px ${right}px ${bottom}px`;
    if (topSpacing !== null && rightSpacing !== null && bottomSpacing !== null) {
      themeValue = `${topSpacing} ${rightSpacing} ${bottomSpacing}`;
    }
  }
  // All different
  else {
    pixelValue = `${top}px ${right}px ${bottom}px ${left}px`;
    if (topSpacing !== null && rightSpacing !== null && bottomSpacing !== null && leftSpacing !== null) {
      themeValue = `${topSpacing} ${rightSpacing} ${bottomSpacing} ${leftSpacing}`;
    }
  }

  return { themeValue, pixelValue };
}

function formatGapWithTheme(gap: { row: number; column: number }): FormattedSpacing {
  const rowSpacing = pxToThemeSpacing(gap.row);
  const colSpacing = pxToThemeSpacing(gap.column);

  if (gap.row === gap.column) {
    const pixelValue = `${gap.row}px`;
    const themeValue = rowSpacing !== null ? `spacing={${rowSpacing}}` : null;
    return { themeValue, pixelValue };
  }

  const pixelValue = `${gap.row}px ${gap.column}px`;
  const themeValue = rowSpacing !== null && colSpacing !== null
    ? `rowGap={${rowSpacing}} columnGap={${colSpacing}}`
    : null;
  return { themeValue, pixelValue };
}

function hasNonZeroSpacing(values: { top: number; right: number; bottom: number; left: number }): boolean {
  return values.top > 0 || values.right > 0 || values.bottom > 0 || values.left > 0;
}

export function SpacingInspector({
  enabled,
  containerRef,
  onElementSelected,
}: SpacingInspectorProps) {
  const theme = useTheme();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [elementRect, setElementRect] = useState<ElementRect | null>(null);
  const [measurements, setMeasurements] = useState<SpacingMeasurements | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Colors for different spacing types
  const colors = {
    padding: theme.palette.success.main,    // Green - inner spacing
    margin: theme.palette.warning.main,     // Orange - outer spacing
    gap: theme.palette.info.main,           // Blue - flex/grid gap
    content: theme.palette.primary.main,    // Primary - content outline
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled || !containerRef.current) return;

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      // Get the element at the mouse position
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;

      if (!target || !container.contains(target)) {
        setHoveredElement(null);
        setElementRect(null);
        setMeasurements(null);
        setTooltipPosition(null);
        return;
      }

      // Skip if it's the container itself or a spacing overlay
      if (target === container || target.dataset.spacingOverlay) {
        return;
      }

      // Get measurements
      const newMeasurements = getMeasurements(target);
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Position relative to container
      const relativeRect: ElementRect = {
        top: targetRect.top - containerRect.top,
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
        height: targetRect.height,
      };

      // Calculate tooltip position (prefer top-right of element)
      const tooltipPos = {
        top: relativeRect.top - 10,
        left: relativeRect.left + relativeRect.width + 10,
      };

      // If tooltip would go off right edge, put it on the left
      if (tooltipPos.left + 180 > containerRect.width) {
        tooltipPos.left = relativeRect.left - 190;
      }

      // If tooltip would go above container, put it below element
      if (tooltipPos.top < 0) {
        tooltipPos.top = relativeRect.top + relativeRect.height + 10;
      }

      setHoveredElement(target);
      setElementRect(relativeRect);
      setMeasurements(newMeasurements);
      setTooltipPosition(tooltipPos);

      if (onElementSelected) {
        onElementSelected(target, newMeasurements);
      }
    });
  }, [enabled, containerRef, onElementSelected]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setHoveredElement(null);
    setElementRect(null);
    setMeasurements(null);
    setTooltipPosition(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, containerRef, handleMouseMove, handleMouseLeave]);

  if (!enabled || !elementRect || !measurements) {
    return null;
  }

  const { padding, margin } = measurements;

  return (
    <>
      {/* Margin overlay (orange) - outermost */}
      {hasNonZeroSpacing(margin) && (
        <Box
          data-spacing-overlay="true"
          sx={{
            position: 'absolute',
            top: elementRect.top - margin.top,
            left: elementRect.left - margin.left,
            width: elementRect.width + margin.left + margin.right,
            height: elementRect.height + margin.top + margin.bottom,
            bgcolor: alpha(colors.margin, 0.15),
            border: `2px dashed ${alpha(colors.margin, 0.6)}`,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}

      {/* Padding overlay (green) - inside element */}
      {hasNonZeroSpacing(padding) && (
        <Box
          data-spacing-overlay="true"
          sx={{
            position: 'absolute',
            top: elementRect.top,
            left: elementRect.left,
            width: elementRect.width,
            height: elementRect.height,
            pointerEvents: 'none',
            zIndex: 1001,
            // Create padding visualization with border-like effect
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderTop: padding.top > 0 ? `${padding.top}px solid ${alpha(colors.padding, 0.25)}` : 'none',
              borderRight: padding.right > 0 ? `${padding.right}px solid ${alpha(colors.padding, 0.25)}` : 'none',
              borderBottom: padding.bottom > 0 ? `${padding.bottom}px solid ${alpha(colors.padding, 0.25)}` : 'none',
              borderLeft: padding.left > 0 ? `${padding.left}px solid ${alpha(colors.padding, 0.25)}` : 'none',
            },
          }}
        />
      )}

      {/* Content outline (primary) */}
      <Box
        data-spacing-overlay="true"
        sx={{
          position: 'absolute',
          top: elementRect.top + padding.top,
          left: elementRect.left + padding.left,
          width: elementRect.width - padding.left - padding.right,
          height: elementRect.height - padding.top - padding.bottom,
          border: `2px solid ${colors.content}`,
          pointerEvents: 'none',
          zIndex: 1002,
        }}
      />

      {/* Floating tooltip */}
      {tooltipPosition && (() => {
        const paddingFormatted = formatSpacingWithTheme(padding, 'p');
        const marginFormatted = formatSpacingWithTheme(margin, 'm');
        const gapFormatted = measurements.gap ? formatGapWithTheme(measurements.gap) : null;

        return (
          <Paper
            data-spacing-overlay="true"
            elevation={8}
            sx={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              p: 1.5,
              minWidth: 180,
              maxWidth: 240,
              zIndex: 1100,
              pointerEvents: 'none',
              bgcolor: alpha(theme.palette.background.paper, 0.98),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={1}>
              {/* Element tag name */}
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'lowercase',
                }}
              >
                &lt;{hoveredElement?.tagName.toLowerCase()}&gt;
              </Typography>

              {/* Dimensions */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  size
                </Typography>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, fontSize: '0.8rem' }}>
                  {Math.round(measurements.width)} × {Math.round(measurements.height)}
                </Typography>
              </Box>

              {/* Padding */}
              {hasNonZeroSpacing(padding) && (
                <Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 8, height: 8, bgcolor: colors.padding, borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      padding
                    </Typography>
                  </Stack>
                  {paddingFormatted.themeValue && (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: colors.padding,
                      }}
                    >
                      {paddingFormatted.themeValue}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      fontSize: paddingFormatted.themeValue ? '0.7rem' : '0.8rem',
                      fontWeight: paddingFormatted.themeValue ? 400 : 600,
                    }}
                  >
                    {paddingFormatted.pixelValue}
                  </Typography>
                </Box>
              )}

              {/* Margin */}
              {hasNonZeroSpacing(margin) && (
                <Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 8, height: 8, bgcolor: colors.margin, borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      margin
                    </Typography>
                  </Stack>
                  {marginFormatted.themeValue && (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: colors.margin,
                      }}
                    >
                      {marginFormatted.themeValue}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      fontSize: marginFormatted.themeValue ? '0.7rem' : '0.8rem',
                      fontWeight: marginFormatted.themeValue ? 400 : 600,
                    }}
                  >
                    {marginFormatted.pixelValue}
                  </Typography>
                </Box>
              )}

              {/* Gap */}
              {gapFormatted && (
                <Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 8, height: 8, bgcolor: colors.gap, borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      gap
                    </Typography>
                  </Stack>
                  {gapFormatted.themeValue && (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: colors.gap,
                      }}
                    >
                      {gapFormatted.themeValue}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      fontSize: gapFormatted.themeValue ? '0.7rem' : '0.8rem',
                      fontWeight: gapFormatted.themeValue ? 400 : 600,
                    }}
                  >
                    {gapFormatted.pixelValue}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        );
      })()}
    </>
  );
}

export default SpacingInspector;
