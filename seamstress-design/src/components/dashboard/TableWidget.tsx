import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import type { TableWidget as TableWidgetType } from '../../types/dashboard.types';

interface TableWidgetProps {
  widget: TableWidgetType;
  isAgentGenerated?: boolean;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ widget, isAgentGenerated }) => {
  const { title, columns, data, rowsPerPage = 10 } = widget;
  const [page, setPage] = useState(0);

  const displayData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const renderCellValue = (row: any, column: any) => {
    const value = row[column.key];

    // Custom rendering for specific columns
    if (column.render) {
      return column.render(value, row);
    }

    // Special handling for status
    if (column.key === 'status') {
      const colorMap: Record<string, string> = {
        open: 'info',
        scheduled: 'default',
        in_progress: 'warning',
        completed: 'success'
      };
      return (
        <Chip
          label={value.replace('_', ' ')}
          size="small"
          color={colorMap[value] as any || 'default'}
        />
      );
    }

    // Special handling for priority
    if (column.key === 'priority') {
      const colorMap: Record<string, string> = {
        low: 'default',
        medium: 'warning',
        high: 'error',
        urgent: 'error'
      };
      return (
        <Chip
          label={value}
          size="small"
          color={colorMap[value] as any || 'default'}
        />
      );
    }

    return value;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">
            {title}
          </Typography>
          {isAgentGenerated && (
            <Box
              component="span"
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '10px',
                fontWeight: 600
              }}
            >
              AI Generated
            </Box>
          )}
        </Box>
        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      fontSize: '12px',
                      width: column.width
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {columns.map((column) => (
                    <TableCell key={column.key} sx={{ fontSize: '12px' }}>
                      {renderCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
