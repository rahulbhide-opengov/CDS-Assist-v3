/**
 * ComparisonTable
 *
 * Feature comparison table with check/x/warning indicators.
 * Supports hatched background highlighting for specific columns.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { Check, Close, Warning } from '@mui/icons-material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

type CellValue = 'check' | 'x' | 'warning' | string | number;

export interface ComparisonTableProps {
  /** Column headers (first is usually "Features") */
  columns: string[];
  /** Row data - first item is the feature name, rest are values per column */
  rows: Array<{
    feature: string;
    values: CellValue[];
  }>;
  /** Indices of columns to highlight with hatched background (0-indexed) */
  highlightColumns?: number[];
  /** Additional styles */
  sx?: SxProps<Theme>;
}

const CellIcon: React.FC<{ value: CellValue; accentColor: string }> = ({ value, accentColor }) => {
  if (value === 'check') {
    return <Check sx={{ fontSize: 28, color: accentColor }} />;
  }
  if (value === 'x') {
    return <Close sx={{ fontSize: 28, color: accentColor }} />;
  }
  if (value === 'warning') {
    return <Warning sx={{ fontSize: 28, color: accentColor }} />;
  }
  return (
    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }}>
      {value}
    </Typography>
  );
};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  columns,
  rows,
  highlightColumns = [],
  sx,
}) => {
  const { marketingColors } = useMarketingTheme();

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* Column Headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `2fr repeat(${columns.length - 1}, 1fr)`,
          gap: 0,
          mb: 0,
        }}
      >
        {columns.map((col, colIndex) => (
          <Box
            key={colIndex}
            sx={{
              py: 2,
              px: 2,
              textAlign: colIndex === 0 ? 'left' : 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: marketingColors.accent,
                fontWeight: 400,
              }}
            >
              {col}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Table Rows */}
      {rows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `2fr repeat(${columns.length - 1}, 1fr)`,
            gap: 0,
            borderTop: `1px solid ${marketingColors.accent}`,
            borderBottom: rowIndex === rows.length - 1 ? `1px solid ${marketingColors.accent}` : 'none',
          }}
        >
          {/* Feature name cell */}
          <Box
            sx={{
              py: 2.5,
              px: 2,
              borderLeft: `1px solid ${marketingColors.accent}`,
              borderRight: `1px solid ${marketingColors.accent}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: marketingColors.accent,
              }}
            >
              {row.feature}
            </Typography>
          </Box>

          {/* Value cells */}
          {row.values.map((value, valueIndex) => {
            const isHighlighted = highlightColumns.includes(valueIndex + 1);
            return (
              <Box
                key={valueIndex}
                sx={{
                  py: 2.5,
                  px: 2,
                  borderRight: `1px solid ${marketingColors.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: marketingColors.muted,
                  ...(isHighlighted && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8L8 0' stroke='${marketingColors.accent.replace('#', '%23')}' stroke-width='1' stroke-opacity='0.3'/%3E%3C/svg%3E")`,
                      backgroundSize: '8px 8px',
                    },
                  }),
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <CellIcon value={value} accentColor={marketingColors.accent} />
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default ComparisonTable;
