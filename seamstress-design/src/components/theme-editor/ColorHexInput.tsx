/**
 * Color Hex Input Component
 *
 * Input field for entering custom hex colors with validation and preview
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { isValidHex, normalizeHex, getWCAGLevel, getColorContrastRatio } from './colorUtils';
import { cdsColors } from '../../theme/cds';

interface ColorHexInputProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  backgroundColor?: string;  // For contrast checking
  helperText?: string;
  error?: boolean;
}

export function ColorHexInput({
  label,
  value,
  onChange,
  backgroundColor = cdsColors.white,
  helperText,
  error: externalError,
}: ColorHexInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [internalError, setInternalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update input when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Validate hex
    if (newValue && !isValidHex(newValue)) {
      setInternalError(true);
      setErrorMessage('Invalid hex format (e.g., #1976D2 or #19D)');
      return;
    }

    setInternalError(false);
    setErrorMessage('');

    if (newValue && isValidHex(newValue)) {
      const normalized = normalizeHex(newValue);
      onChange(normalized);
    }
  };

  const handleBlur = () => {
    if (inputValue && isValidHex(inputValue)) {
      const normalized = normalizeHex(inputValue);
      setInputValue(normalized);
      onChange(normalized);
    }
  };

  // Calculate contrast ratio if we have a valid color
  const contrastRatio = inputValue && isValidHex(inputValue)
    ? getColorContrastRatio(inputValue, backgroundColor)
    : null;

  const wcagLevel = contrastRatio ? getWCAGLevel(contrastRatio) : null;

  const showError = externalError || internalError;
  const displayHelperText = errorMessage || helperText;

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={showError}
        helperText={displayHelperText}
        placeholder={cdsColors.blue600}
        slotProps={{
          input: {
            startAdornment: inputValue && isValidHex(inputValue) && (
              <InputAdornment position="start">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    backgroundColor: inputValue,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Contrast ratio display */}
      {contrastRatio && wcagLevel && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Contrast ratio: {contrastRatio.toFixed(2)}:1
          </Typography>
          <Chip
            label={wcagLevel.level}
            size="small"
            color={wcagLevel.passes ? 'success' : 'error'}
            variant="outlined"
          />
        </Stack>
      )}
    </Box>
  );
}
