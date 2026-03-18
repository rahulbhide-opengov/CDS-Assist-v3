/**
 * Variable Inserter Component
 * Dropdown button to browse and insert variables into the editor
 *
 * Features:
 * - Categorized variable list
 * - Search/filter variables
 * - Click to insert at cursor
 * - Shows current values
 */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListSubheader,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { variableService } from '../../../services/procurement/VariableService';
import type { Variable, VariableSource } from '../../../services/procurement/ProcurementTypes';

interface VariableInserterProps {
  documentId: string;
  onInsert: (variableName: string) => void;
}

export const VariableInserter: React.FC<VariableInserterProps> = ({ documentId, onInsert }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const open = Boolean(anchorEl);

  // Load variables when menu opens
  useEffect(() => {
    if (open && documentId) {
      variableService
        .getVariablesWithValues(documentId)
        .then(setVariables)
        .catch((error) => {
          console.error('Error loading variables:', error);
          setVariables([]);
        });
    }
  }, [open, documentId]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleInsert = (variableName: string) => {
    onInsert(variableName);
    handleClose();
  };

  // Filter variables based on search
  const filteredVariables = searchQuery
    ? variables.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.label && v.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : variables;

  // Group variables by source
  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    const source = variable.source;
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(variable);
    return acc;
  }, {} as Record<VariableSource, Variable[]>);

  const sourceLabels: Record<VariableSource, string> = {
    project: 'Project Information',
    contract: 'Contract & Timeline',
    question: 'Question Answers',
    custom: 'Custom Variables',
  };

  const sourceColors: Record<VariableSource, string> = {
    project: theme.palette.success.main,
    contract: theme.palette.warning.main,
    question: theme.palette.secondary.main,
    custom: theme.palette.grey[600],
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{ textTransform: 'none' }}
      >
        Insert Variable
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 500,
            width: 400,
          },
        }}
      >
        {/* Search Box */}
        <Box sx={{ p: 2, pb: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            autoFocus
          />
        </Box>

        <Divider />

        {/* Variable List */}
        {Object.keys(groupedVariables).length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No variables found' : 'Loading variables...'}
            </Typography>
          </MenuItem>
        ) : (
          Object.entries(groupedVariables).map(([source, vars]) => [
            <ListSubheader key={`header-${source}`} sx={{ lineHeight: '32px', fontWeight: 600 }}>
              {sourceLabels[source as VariableSource] || source}
            </ListSubheader>,
            ...vars.map((variable) => (
              <MenuItem
                key={variable.name}
                onClick={() => handleInsert(variable.name)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 1.5,
                  px: 2,
                  whiteSpace: 'normal',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', color: 'primary.main', flex: 1 }}
                  >
                    {`{{${variable.name}}}`}
                  </Typography>
                  <Chip
                    label={source}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '10px',
                      backgroundColor: `${sourceColors[source as VariableSource]}20`,
                      color: sourceColors[source as VariableSource],
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {variable.label && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {variable.label}
                  </Typography>
                )}

                {variable.description && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: '11px', lineHeight: 1.3 }}
                  >
                    {variable.description}
                  </Typography>
                )}

                {variable.value && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: 'success.main',
                      fontStyle: 'italic',
                      fontSize: '11px',
                    }}
                  >
                    Current: {String(variable.value)}
                  </Typography>
                )}
              </MenuItem>
            )),
          ])
        )}
      </Menu>
    </>
  );
};
