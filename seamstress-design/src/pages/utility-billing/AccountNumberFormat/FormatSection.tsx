import React from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Alert,
  Tooltip,
  Paper,
} from '@mui/material';

import { SegmentEditor } from './SegmentEditor';
import {
  type BaseSegment,
  type FormatConfig,
  TYPOGRAPHY_SIZES,
  inputFieldStyles,
  selectFieldStyles,
} from './types';

// ============================================================================
// EDIT FORMAT SECTION
// ============================================================================

interface FormatSectionProps<T extends BaseSegment> {
  title: string;
  subtitle: string;
  previewTitle: string;
  config: FormatConfig<T>;
  onUpdate: (config: FormatConfig<T>) => void;
  maxCharacterLimit: number;
  maxSegments: number;
  segmentOptions: Array<{ value: string; label: string }>;
  maxSegmentCharLimit: number;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  formatType?: 'account' | 'customer' | 'serviceAddress';
}

export function FormatSection<T extends BaseSegment>({
  title,
  subtitle,
  previewTitle,
  config,
  onUpdate,
  maxCharacterLimit,
  maxSegments,
  segmentOptions,
  maxSegmentCharLimit,
  hasChanges,
  isSaving,
  onSave,
  onCancel,
  formatType,
}: FormatSectionProps<T>) {
  const handleConfigChange = (field: keyof FormatConfig<T>, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const handleAddSegment = () => {
    const newSegment = {
      id: `segment_${Date.now()}`,
      name: '',
      code: '',
      type: '',
    } as T;

    onUpdate({
      ...config,
      segments: [...config.segments, newSegment],
    });
  };

  const handleUpdateSegment = (index: number, updatedSegment: T) => {
    const segments = [...config.segments];
    segments[index] = updatedSegment;
    onUpdate({ ...config, segments });
  };

  const handleRemoveSegment = (index: number) => {
    const segments = [...config.segments];
    segments.splice(index, 1);
    onUpdate({ ...config, segments });
  };

  const handleClearSegment = (index: number) => {
    const segments = [...config.segments];
    segments[index] = {
      ...segments[index],
      name: '',
      code: '',
      characterLimit: undefined,
      valueList: [],
    };
    onUpdate({ ...config, segments });
  };

  // Get used segment types
  const usedTypes = new Set(config.segments.map((s) => s.type));

  // Calculate current character count (sum of all segment character limits)
  const calculateCharacterCount = (): number => {
    return config.segments.reduce((total, segment) => {
      if (segment.characterLimit) {
        return total + segment.characterLimit;
      }
      // For segments without explicit limits, use their code length as estimate
      if (segment.code) {
        return total + segment.code.length;
      }
      return total;
    }, 0);
  };

  const currentCharCount = calculateCharacterCount();

  // Generate preview
  const generatePreview = (): string => {
    const validSegments = config.segments.filter(s => s.type && s.code && s.name);

    if (validSegments.length === 0) return 'Configure segments to see a preview';

    const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';
    const segmentPreviews = validSegments.map((segment) => {
      if (segment.type === 'billing_cycle') return '1';
      if (segment.type === 'route') return '05';
      if (segment.type === 'service_address') return '12345678';
      if (segment.type === 'value_list' && segment.valueList?.length) return segment.valueList[0].code || segment.code;
      if (segment.type === 'value_list') return segment.code;
      if (segment.type === 'sequential_id') {
        const length = segment.characterLimit || 3;
        return '1'.padStart(length, '0');
      }
      if (segment.type === 'resident_number') return '01';
      return segment.code;
    });

    return segmentPreviews.join(delimiter);
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
        }}
      >
        {/* Header with Save/Cancel Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography
              variant="h2"
              sx={{
                mb: 0.5,
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.3,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Save/Cancel Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Press Esc to cancel" placement="bottom">
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                disabled={isSaving}
            sx={{
                  textTransform: 'none',
                  fontSize: TYPOGRAPHY_SIZES.LABEL,
                  fontWeight: 500,
                  borderRadius: '4px',
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Cancel
              </Button>
            </Tooltip>
            <Tooltip title={hasChanges ? 'Press Cmd/Ctrl+S to save' : 'No changes to save'} placement="bottom">
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSave}
                  disabled={!hasChanges || isSaving}
              sx={{
                    textTransform: 'none',
                    fontSize: TYPOGRAPHY_SIZES.LABEL,
                    fontWeight: 500,
                    borderRadius: '4px',
                    '&:focus-visible': {
                      outline: '3px solid',
                      outlineColor: 'primary.light',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </span>
            </Tooltip>
          </Box>
          </Box>

        {/* Top Row: Number Limit + Delimiter + Preview */}
      <Box sx={{ display: 'flex', gap: 4, mb: 3, alignItems: 'flex-start', position: 'relative' }}>
        {/* Left Side: Number Limit, Delimiter */}
        <Box sx={{ flex: 1, minWidth: 0 }}>

          {/* Number Character Limit and Delimiter - Side by Side */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <Box sx={{ width: '272px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.primary',
                    lineHeight: 1.5,
                  }}
                >
                  Number Character Limit *
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: currentCharCount > config.characterLimit ? 'error.main' : 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {currentCharCount}/{config.characterLimit}
                </Typography>
            </Box>
              <Typography
                variant="caption"
        sx={{
                  color: 'text.secondary',
                  mb: 1.5,
                  display: 'block',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                Limited up to {maxCharacterLimit} characters
            </Typography>
              <TextField
                type="number"
                value={config.characterLimit}
                onChange={(e) => handleConfigChange('characterLimit', parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
                inputProps={{
                  min: 1,
                  max: maxCharacterLimit,
                  'aria-label': 'Number character limit'
                }}
                slotProps={{
                  input: {
                    sx: { fontSize: TYPOGRAPHY_SIZES.LABEL }
                  },
                }}
                sx={inputFieldStyles}
              />
            </Box>

            <Box sx={{ width: '365px' }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  lineHeight: 1.5,
                }}
              >
                Delimiter *
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mb: 1.5,
                  display: 'block',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                Delimiters do not contribute to the character count
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={config.delimiter}
                  onChange={(e) => handleConfigChange('delimiter', e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Delimiter' }}
                  sx={selectFieldStyles}
                >
                  <MenuItem value="dash" sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL }}>Dashes (-)</MenuItem>
                  <MenuItem value="period" sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL }}>Periods (.)</MenuItem>
                  <MenuItem value="none" sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL }}>None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            </Box>
          </Box>

        {/* Right Side: Preview Panel */}
        <Box sx={{ width: '800px', flexShrink: 0 }}>
          <Box
            sx={{
              position: 'sticky',
              top: 120,
              p: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: currentCharCount > config.characterLimit ? 1 : 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: 'text.primary',
                    lineHeight: 1.5,
                  }}
                >
                  {previewTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: currentCharCount > config.characterLimit ? 'error.main' :
                           currentCharCount > config.characterLimit * 0.9 ? 'warning.main' :
                           'text.secondary',
                    fontWeight: currentCharCount > config.characterLimit ? 600 : 400,
                  }}
                >
                  {currentCharCount}/{config.characterLimit} Characters
                </Typography>
              </Box>
              {currentCharCount > config.characterLimit && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 1,
                    py: 0,
                    '& .MuiAlert-message': {
                      fontSize: '0.75rem',
                      lineHeight: 1,
                      py: 0.5,
                    },
                    '& .MuiAlert-icon': {
                      fontSize: '16px',
                      py: 0.5,
                    }
                  }}
                >
                  Character limit exceeded by {currentCharCount - config.characterLimit} character{currentCharCount - config.characterLimit === 1 ? '' : 's'}
                </Alert>
              )}
            </Box>
            <TextField
              value={generatePreview()}
              fullWidth
              size="small"
              placeholder="Configure segments to see a preview"
              slotProps={{
                input: {
                  readOnly: true,
                  sx: {
                    fontFamily: 'DM Sans, sans-serif',
                    color: 'text.secondary',
                    fontSize: '0.9375rem',
                    backgroundColor: 'grey.50',
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'grey.50',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'divider',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                }
              }}
            />
            {config.segments.length > 0 && config.segments.some(s => s.name) && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    lineHeight: 1.66,
                  }}
                >
                  Segments Description:{' '}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    lineHeight: 1.66,
                  }}
                >
                  {config.segments
                    .filter(s => s.name)
                    .map(s => s.name)
                    .join(' - ')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Segments Section - Full Width */}
      <Box>
        <Typography
          variant="h3"
          sx={{
            mb: 0.5,
            fontWeight: 600,
            fontSize: '1.125rem',
            color: 'text.primary',
            lineHeight: 1.4,
          }}
        >
          Segments *
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mb: 2,
            display: 'block',
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          Add up to {maxSegments} segments to configure {title.toLowerCase()}
        </Typography>

              {config.segments.map((segment, index) => (
                <SegmentEditor
                  key={segment.id}
                  segment={segment}
                  index={index}
                  availableOptions={segmentOptions}
                  usedTypes={usedTypes}
                  onUpdate={(updated) => handleUpdateSegment(index, updated as T)}
                  onRemove={() => handleRemoveSegment(index)}
            onClear={() => handleClearSegment(index)}
                  canRemove={config.segments.length > 1}
                  maxSegmentCharLimit={maxSegmentCharLimit}
            formatType={formatType}
                />
              ))}

        {config.segments.length < maxSegments && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, borderTop: '1px solid', borderColor: 'divider' }} />
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={handleAddSegment}
              aria-label="Add another segment to the format"
              sx={{
                fontSize: '0.8125rem',
                textTransform: 'none',
                fontWeight: 500,
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              Add Another Segment
            </Button>
            <Box sx={{ flex: 1, borderTop: '1px solid', borderColor: 'divider' }} />
          </Box>
        )}
      </Box>
      </Paper>
    </Box>
  );
}
