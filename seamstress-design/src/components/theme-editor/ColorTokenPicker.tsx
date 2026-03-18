/**
 * Color Token Picker Component
 *
 * Searchable color token selector with preview
 */

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import type { ColorToken, ColorMapping } from './types';
import { extractColorTokens, groupTokensByCategory, filterTokens } from './tokenUtils';

interface ColorTokenPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mapping: ColorMapping) => void;
  currentValue?: string;
  colorKey: string;
}

export function ColorTokenPicker({
  open,
  onClose,
  onSelect,
  currentValue,
  colorKey,
}: ColorTokenPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all color tokens
  const allTokens = useMemo(() => extractColorTokens(), []);

  // Filter tokens based on search
  const filteredTokens = useMemo(
    () => filterTokens(allTokens, searchQuery),
    [allTokens, searchQuery]
  );

  // Group filtered tokens by category
  const groupedTokens = useMemo(
    () => groupTokensByCategory(filteredTokens),
    [filteredTokens]
  );

  const handleSelect = (token: ColorToken) => {
    const mapping: ColorMapping = {
      tokenPath: token.path,
      tokenValue: token.value,
      category: token.category,
      subcategory: token.subcategory,
    };
    onSelect(mapping);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
        },
      }}
    >
      <DialogTitle>
        <Box>
          <Typography variant="h6">Select Color Token</Typography>
          <Typography variant="body2" color="text.secondary">
            {colorKey}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 200px)' }}>
          {Object.entries(groupedTokens).map(([category, subcategories]) => (
            <Accordion key={category} defaultExpanded={searchQuery.length > 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {category}
                </Typography>
                <Chip
                  label={Object.values(subcategories).flat().length}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                {Object.entries(subcategories).map(([subcategory, tokens]) => (
                  <Box key={subcategory}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ px: 2, py: 1, display: 'block' }}
                    >
                      {subcategory}
                    </Typography>
                    <List dense disablePadding>
                      {tokens.map((token) => (
                        <ListItem key={token.path} disablePadding>
                          <ListItemButton
                            onClick={() => handleSelect(token)}
                            selected={currentValue === token.value}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                backgroundColor: token.value,
                                border: '1px solid',
                                borderColor: 'divider',
                                mr: 2,
                                flexShrink: 0,
                              }}
                            />
                            <ListItemText
                              primary={token.displayName}
                              secondary={
                                <Box component="span">
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {token.path}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{
                                      fontFamily: 'monospace',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {token.value}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          {filteredTokens.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">No tokens found matching "{searchQuery}"</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
