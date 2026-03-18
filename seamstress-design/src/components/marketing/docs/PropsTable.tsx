/**
 * PropsTable
 *
 * Displays TypeScript props in a formatted table.
 * Used in component documentation blocks.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import type { PropDefinition } from '../../../data/marketingDocsData';

interface PropsTableProps {
  props: PropDefinition[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ props }) => {
  return (
    <TableContainer
      sx={{
        bgcolor: 'action.hover',
        borderRadius: '8px',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: '20%' }}>
              Prop
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: '25%' }}>
              Type
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: '15%' }}>
              Default
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: '40%' }}>
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="code"
                    sx={{
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    {prop.name}
                  </Typography>
                  {prop.required && (
                    <Chip
                      label="required"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.625rem',
                        bgcolor: 'error.light',
                        color: 'error.dark',
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  component="code"
                  sx={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'text.secondary',
                    bgcolor: 'action.selected',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {prop.type}
                </Typography>
              </TableCell>
              <TableCell>
                {prop.default ? (
                  <Typography
                    component="code"
                    sx={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'text.disabled',
                    }}
                  >
                    {prop.default}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.disabled',
                      fontStyle: 'italic',
                    }}
                  >
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  {prop.description}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
