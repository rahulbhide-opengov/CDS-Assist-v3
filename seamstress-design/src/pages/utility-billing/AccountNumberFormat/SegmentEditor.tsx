import React from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  InfoOutlined,
  Refresh,
  Delete,
  Add as Plus,
} from '@mui/icons-material';

import {
  type BaseSegment,
  FIELD_CONSTRAINTS,
  TYPOGRAPHY_SIZES,
  SEGMENT_DESCRIPTIONS,
  inputFieldStyles,
  selectFieldStyles,
} from './types';

// ============================================================================
// SEGMENT EDITOR COMPONENT
// ============================================================================

interface SegmentEditorProps<T extends string> {
  segment: BaseSegment & { type: T };
  index: number;
  availableOptions: Array<{ value: T; label: string }>;
  usedTypes: Set<T>;
  onUpdate: (segment: BaseSegment & { type: T }) => void;
  onRemove: () => void;
  onClear: () => void;
  canRemove: boolean;
  maxSegmentCharLimit: number;
  formatType?: 'account' | 'customer' | 'serviceAddress';
}

export function SegmentEditor<T extends string>({
  segment,
  index,
  availableOptions,
  usedTypes,
  onUpdate,
  onRemove,
  onClear,
  canRemove,
  maxSegmentCharLimit,
  formatType,
}: SegmentEditorProps<T>) {
  const handleFieldChange = (field: keyof BaseSegment, value: any) => {
    onUpdate({ ...segment, [field]: value });
  };

  const handleAddValue = () => {
    const valueList = segment.valueList || [];
    onUpdate({ ...segment, valueList: [...valueList, { name: '', code: '' }] });
  };

  const handleValueChange = (valueIndex: number, field: 'name' | 'code', value: string) => {
    const valueList = [...(segment.valueList || [])];
    valueList[valueIndex] = { ...valueList[valueIndex], [field]: value };
    onUpdate({ ...segment, valueList });
  };

  const handleRemoveValue = (valueIndex: number) => {
    const valueList = [...(segment.valueList || [])];
    valueList.splice(valueIndex, 1);
    onUpdate({ ...segment, valueList });
  };

  const requiresCharacterLimit = segment.type === 'value_list' ||
                                 segment.type === 'sequential_id' ||
                                 segment.type === 'resident_number';

  // Determine max character limit based on segment type
  const getMaxCharLimit = (): number => {
    if (segment.type === 'value_list') {
      return FIELD_CONSTRAINTS.VALUE_LIST_CHAR_LIMIT; // 10
    }
    if (segment.type === 'sequential_id') {
      // Customer format has a higher limit for sequential_id
      return formatType === 'customer'
        ? FIELD_CONSTRAINTS.SEQUENTIAL_ID_CUSTOMER_CHAR_LIMIT // 20
        : FIELD_CONSTRAINTS.SEQUENTIAL_ID_CHAR_LIMIT; // 10
    }
    if (segment.type === 'resident_number') {
      return FIELD_CONSTRAINTS.RESIDENT_NUMBER_CHAR_LIMIT; // 4
    }
    return maxSegmentCharLimit; // fallback
  };

  const segmentCharLimit = getMaxCharLimit();

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        borderRadius: '4px',
        mb: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.5,
              color: 'text.primary',
            }}
          >
            Segment {index + 1}{segment.name ? ` - ${segment.name}` : ''}
          </Typography>
          {segment.type && segment.type !== '' && (
            <Tooltip title={SEGMENT_DESCRIPTIONS[segment.type] || 'Segment information'}>
              <InfoOutlined sx={{ fontSize: '18px', color: 'action.active' }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0 }}>
          <Button
            variant="text"
            onClick={onClear}
            startIcon={<Refresh sx={{ fontSize: '18px' }} />}
            aria-label={`Clear segment ${index + 1}`}
            sx={{
              minWidth: 'auto',
              fontSize: TYPOGRAPHY_SIZES.BUTTON,
              color: 'text.secondary',
              textTransform: 'none',
              px: 1,
              py: 0.5,
              fontWeight: 400,
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            Clear
          </Button>
          {canRemove && (
            <Button
              variant="text"
              onClick={onRemove}
              startIcon={<Delete sx={{ fontSize: '18px' }} />}
              aria-label={`Remove segment ${index + 1}`}
              sx={{
                minWidth: 'auto',
                fontSize: TYPOGRAPHY_SIZES.BUTTON,
                color: 'text.secondary',
                textTransform: 'none',
                px: 1,
                py: 0.5,
                fontWeight: 400,
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              Remove
            </Button>
          )}
        </Box>
        </Box>

      {/* Main Fields Row */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {/* Segment Type */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              mb: 0.25,
              fontWeight: 600,
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
              lineHeight: '20px',
            }}
          >
            Segment Type *
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 1,
              display: 'block',
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
              lineHeight: '16px',
            }}
          >
            Select a source type for the value of this segment
          </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={segment.type}
            onChange={(e) => handleFieldChange('type', e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': `Segment ${index + 1} type` }}
              sx={selectFieldStyles}
          >
            <MenuItem value="" disabled sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.secondary' }}>
              Select a segment type
            </MenuItem>
            {availableOptions.map((option) => {
              const isUsed = usedTypes.has(option.value) && segment.type !== option.value;
              return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={isUsed}
                  sx={{
                    fontSize: TYPOGRAPHY_SIZES.LABEL,
                    ...(isUsed && {
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      }
                    })
                  }}
                >
                  {option.label}{isUsed && ' (Already used)'}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        </Box>

        {/* Name */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: TYPOGRAPHY_SIZES.LABEL,
                color: 'text.primary',
                lineHeight: '20px',
              }}
            >
              Name *
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
                lineHeight: '16px',
              }}
            >
              {segment.name.length}/{FIELD_CONSTRAINTS.SEGMENT_NAME_MAX}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 1,
              display: 'block',
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
              lineHeight: '16px',
            }}
          >
            Enter a name for this segment
          </Typography>
          <TextField
            value={segment.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder=""
            size="small"
            fullWidth
            inputProps={{
              maxLength: FIELD_CONSTRAINTS.SEGMENT_NAME_MAX,
              'aria-label': `Segment ${index + 1} name`
            }}
            sx={inputFieldStyles}
          />
        </Box>

        {/* Segment Code */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: TYPOGRAPHY_SIZES.LABEL,
                color: 'text.primary',
                lineHeight: '20px',
              }}
            >
              Segment Code *
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
                lineHeight: '16px',
              }}
            >
              {segment.code.length}/{FIELD_CONSTRAINTS.SEGMENT_CODE_MAX}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 1,
              display: 'block',
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
              lineHeight: '16px',
            }}
          >
            Enter a Code Sample
          </Typography>
          <TextField
            value={segment.code}
            onChange={(e) => handleFieldChange('code', e.target.value)}
            placeholder=""
            size="small"
            fullWidth
            inputProps={{
              maxLength: FIELD_CONSTRAINTS.SEGMENT_CODE_MAX,
              'aria-label': `Segment ${index + 1} code`
            }}
            sx={inputFieldStyles}
          />
        </Box>
      </Box>

      {/* Conditional Fields */}
        {requiresCharacterLimit && (
        <Box sx={{ mt: 2.5 }}>
          <TextField
            label="Character Limit"
            type="number"
            value={segment.characterLimit || ''}
            onChange={(e) => handleFieldChange('characterLimit', parseInt(e.target.value) || 0)}
            placeholder={`Max ${segmentCharLimit}`}
            size="small"
            error={segment.characterLimit !== undefined && segment.characterLimit > segmentCharLimit}
            sx={{
              maxWidth: 200,
              ...inputFieldStyles,
            }}
            inputProps={{
              min: 1,
              max: segmentCharLimit,
              'aria-label': `Segment ${index + 1} character limit`
            }}
            helperText={
              segment.characterLimit !== undefined && segment.characterLimit > segmentCharLimit
                ? `⚠️ Exceeds maximum of ${segmentCharLimit} characters`
                : segment.characterLimit === segmentCharLimit
                ? `At maximum limit (${segmentCharLimit} characters)`
                : `Maximum ${segmentCharLimit} characters`
            }
          />
        </Box>
        )}

        {segment.type === 'value_list' && (
        <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: TYPOGRAPHY_SIZES.LABEL }}>
                Allowed Values
              </Typography>
              <Button
                size="small"
                variant="text"
                onClick={handleAddValue}
                startIcon={<Plus />}
                aria-label={`Add value to segment ${index + 1}`}
                sx={{ minWidth: 'auto', fontSize: TYPOGRAPHY_SIZES.BUTTON }}
              >
                Add Value
              </Button>
            </Box>
            <Stack spacing={1}>
              {(segment.valueList || []).map((value, valueIndex) => (
                <Box key={valueIndex} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                    <TextField
                      value={value.name}
                      onChange={(e) => handleValueChange(valueIndex, 'name', e.target.value)}
                      placeholder="Name"
                      label="Name"
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: 50,
                        'aria-label': `Segment ${index + 1} value ${valueIndex + 1} name`
                      }}
                      sx={inputFieldStyles}
                    />
                    <TextField
                      value={value.code}
                      onChange={(e) => handleValueChange(valueIndex, 'code', e.target.value)}
                      placeholder="Code"
                      label="Code"
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: segment.characterLimit || FIELD_CONSTRAINTS.VALUE_LIST_CHAR_LIMIT,
                        'aria-label': `Segment ${index + 1} value ${valueIndex + 1} code`
                      }}
                      sx={inputFieldStyles}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveValue(valueIndex)}
                    aria-label={`Remove value ${valueIndex + 1} from segment ${index + 1}`}
                    sx={{ minWidth: 40, mt: 0.5 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
    </Box>
  );
}
