/**
 * BulletedListSection
 *
 * Multi-column layout with labeled arrow-bulleted lists.
 * Based on OpenGov brand guidelines - uses arrows instead of dots.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { East } from '@mui/icons-material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface ListColumn {
  /** Label above the list */
  label: string;
  /** List items */
  items: string[];
}

export interface BulletedListSectionProps {
  /** Array of columns with labels and items */
  columns: ListColumn[];
  /** Number of columns (1-4, defaults to columns.length) */
  columnCount?: 1 | 2 | 3 | 4;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

export const BulletedListSection: React.FC<BulletedListSectionProps> = ({
  columns,
  columnCount,
  sx,
}) => {
  const { marketingColors } = useMarketingTheme();
  const cols = columnCount || Math.min(columns.length, 4) as 1 | 2 | 3 | 4;

  const gridCols = {
    1: '1fr',
    2: { xs: '1fr', md: 'repeat(2, 1fr)' },
    3: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
    4: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
  };

  return (
    <Box sx={sx}>
      {/* Column labels with divider */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: gridCols[cols],
          gap: { xs: 3, md: 6 },
          borderBottom: `1px solid ${marketingColors.border}`,
          pb: 1.5,
          mb: 3,
        }}
      >
        {columns.map((column, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              color: marketingColors.accent,
              fontWeight: 400,
            }}
          >
            {column.label}
          </Typography>
        ))}
      </Box>

      {/* Lists */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: gridCols[cols],
          gap: { xs: 3, md: 6 },
        }}
      >
        {columns.map((column, colIndex) => (
          <Box key={colIndex} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {column.items.map((item, itemIndex) => (
              <Box
                key={itemIndex}
                component="li"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <East
                  sx={{
                    fontSize: 18,
                    color: marketingColors.accent,
                    mt: 0.3,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: marketingColors.foreground,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BulletedListSection;
