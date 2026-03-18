// React imports
import React, { useState, useEffect } from 'react';

// OpenGov component imports
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  Refresh,
  Delete,
  Plus,
} from '@opengov/react-capital-assets';

// MUI imports
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  IconButton,
} from '@mui/material';

// Local imports
import { pageStyles } from '../../theme/pageStyles';

// ============================================================================
// CONSTANTS
// ============================================================================

const FIELD_CONSTRAINTS = {
  SEGMENT_NAME_MAX: 25,
  SEGMENT_CODE_MAX: 4,
  SERVICE_ADDRESS_CHAR_LIMIT: 20,
  ACCOUNT_CHAR_LIMIT: 25,
  CUSTOMER_CHAR_LIMIT: 20,
  VALUE_LIST_CHAR_LIMIT: 10,
  SEQUENTIAL_ID_CHAR_LIMIT: 10,
  SEQUENTIAL_ID_CUSTOMER_CHAR_LIMIT: 20,
  RESIDENT_NUMBER_CHAR_LIMIT: 4,
  MAX_SERVICE_ADDRESS_SEGMENTS: 3,
  MAX_ACCOUNT_SEGMENTS: 4,
  MAX_CUSTOMER_SEGMENTS: 3,
} as const;

const TYPOGRAPHY_SIZES = {
  LABEL: '0.875rem',
  DESCRIPTION: '0.75rem',
  HEADER: '1.25rem',
  CAPTION: '0.75rem',
  BUTTON: '0.8125rem',
} as const;

// Reusable input field styles
const inputFieldStyles = {
  '& .MuiInputBase-root': {
    fontSize: TYPOGRAPHY_SIZES.LABEL,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: '2px',
    },
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px',
    },
  },
};

// Reusable select field styles
const selectFieldStyles = {
  fontSize: TYPOGRAPHY_SIZES.LABEL,
  borderRadius: '4px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
    borderWidth: '2px',
  },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
  },
};

// Segment type descriptions for tooltips
const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  billing_cycle: 'This segment will display the billing cycle associated with the account',
  route: 'This segment will display the route number associated with the account',
  value_list: 'This segment will display a value from your predefined list',
  sequential_id: 'This segment will display a sequential identifier',
  service_address: 'This segment will display the service address number',
  resident_number: 'This segment will display the resident number',
};

// ============================================================================
// TYPES
// ============================================================================

type DelimiterType = 'none' | 'dash' | 'period';

type ServiceAddressSegmentType = 'billing_cycle' | 'route' | 'value_list' | 'sequential_id';
type AccountSegmentType = ServiceAddressSegmentType | 'service_address' | 'resident_number';
type CustomerSegmentType = ServiceAddressSegmentType;

interface BaseSegment {
  id: string;
  name: string;
  code: string;
  type: string;
  characterLimit?: number;
  valueList?: string[];
}

interface ServiceAddressSegment extends BaseSegment {
  type: ServiceAddressSegmentType;
}

interface AccountSegment extends BaseSegment {
  type: AccountSegmentType;
}

interface CustomerSegment extends BaseSegment {
  type: CustomerSegmentType;
}

interface FormatConfig<T extends BaseSegment> {
  characterLimit: number;
  delimiter: DelimiterType;
  segments: T[];
}

// ============================================================================
// TAB PANEL COMPONENT
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`format-tabpanel-${index}`}
      aria-labelledby={`format-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ backgroundColor: 'grey.50', minHeight: '100%', height: '100%' }}>
          <Box sx={{ px: 3, pt: 3, pb: 4 }}>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `format-tab-${index}`,
    'aria-controls': `format-tabpanel-${index}`,
  };
}

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

function SegmentEditor<T extends string>({
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
    onUpdate({ ...segment, valueList: [...valueList, ''] });
  };

  const handleValueChange = (valueIndex: number, value: string) => {
    const valueList = [...(segment.valueList || [])];
    valueList[valueIndex] = value;
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
        display: 'flex',
        gap: 2,
        mb: 3,
        alignItems: 'flex-start',
      }}
    >
      {/* Number Badge */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: 0.5,
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
          {index + 1}
        </Typography>
      </Box>

      {/* Segment Content */}
      <Box sx={{ flex: 1 }}>

      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
          {segment.name || `Segment ${index + 1}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="text"
            onClick={onClear}
            startIcon={<Refresh sx={{ fontSize: '16px' }} />}
            aria-label={`Clear segment ${index + 1}`}
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.8125rem',
              color: 'text.secondary',
              textTransform: 'none',
              px: 1,
              py: 0.5,
            }}
          >
            Clear
          </Button>
          {canRemove && (
            <Button
              size="small"
              variant="text"
              onClick={onRemove}
              startIcon={<Delete sx={{ fontSize: '16px' }} />}
              aria-label={`Remove segment ${index + 1}`}
              sx={{ 
                minWidth: 'auto',
                fontSize: '0.8125rem',
                color: 'error.main',
                textTransform: 'none',
                px: 1,
                py: 0.5,
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
              mb: 0.5, 
              fontWeight: 600, 
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
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
          <Typography 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600, 
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
            }}
          >
            Segment Name *
          </Typography>
          <Typography 
            sx={{ 
              color: 'text.secondary', 
              mb: 1,
              display: 'block', 
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
            }}
          >
            Enter a name for this segment ({segment.name.length}/{FIELD_CONSTRAINTS.SEGMENT_NAME_MAX})
          </Typography>
          <TextField
            value={segment.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Enter segment name"
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
          <Typography 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600, 
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
            }}
          >
            Segment Code *
          </Typography>
          <Typography 
            sx={{ 
              color: 'text.secondary', 
              mb: 1,
              display: 'block', 
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
            }}
          >
            Enter a code sample ({segment.code.length}/{FIELD_CONSTRAINTS.SEGMENT_CODE_MAX})
          </Typography>
          <TextField
            value={segment.code}
            onChange={(e) => handleFieldChange('code', e.target.value)}
            placeholder="Enter code"
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
                <Box key={valueIndex} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={value}
                    onChange={(e) => handleValueChange(valueIndex, e.target.value)}
                    placeholder="Enter value"
                    size="small"
                    fullWidth
                    inputProps={{ 
                      maxLength: segment.characterLimit || FIELD_CONSTRAINTS.VALUE_LIST_CHAR_LIMIT,
                      'aria-label': `Segment ${index + 1} value ${valueIndex + 1}`
                    }}
                    sx={inputFieldStyles}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveValue(valueIndex)}
                    aria-label={`Remove value ${valueIndex + 1} from segment ${index + 1}`}
                    sx={{ minWidth: 40 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ============================================================================
// FORMAT SECTION COMPONENT
// ============================================================================

// ============================================================================
// VIEW FORMAT SECTION (Read-only saved state)
// ============================================================================

interface ViewFormatSectionProps<T extends BaseSegment> {
  title: string;
  subtitle: string;
  previewTitle: string;
  config: FormatConfig<T>;
  onEdit: () => void;
}

function ViewFormatSection<T extends BaseSegment>({
  title,
  subtitle,
  previewTitle,
  config,
  onEdit,
}: ViewFormatSectionProps<T>) {
  // Generate realistic preview like the formatting screen
  const generatePreview = (): string => {
    const validSegments = config.segments.filter(s => s.type && s.code && s.name);
    
    if (validSegments.length === 0) return 'No preview available';

    const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';
    const segmentPreviews = validSegments.map((segment) => {
      if (segment.type === 'billing_cycle') return '1';
      if (segment.type === 'route') return '05';
      if (segment.type === 'service_address') return '12345678';
      if (segment.type === 'value_list' && segment.valueList?.length) return segment.valueList[0];
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

  const preview = generatePreview();

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
        {/* Header with Edit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h2" sx={{ mb: 0.5, fontSize: '1.5rem', fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
                lineHeight: '20px',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Edit Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={onEdit}
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
            Edit
          </Button>
        </Box>

        {/* Top Row: Number Limit + Delimiter + Preview */}
        <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
          {/* Left Side: Number Limit, Delimiter */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Number Character Limit and Delimiter - Side by Side */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <Box sx={{ width: '272px' }}>
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
                  Number Character Limit
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary' }}>
                    {config.characterLimit}
                  </Typography>
                </Box>
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
                  Delimiter
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary' }}>
                    {config.delimiter === 'none' ? 'None' : 
                     config.delimiter === 'dash' ? 'Dash (-)' : 'Period (.)'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side: Preview Panel */}
          <Box sx={{ width: '800px', flexShrink: 0 }}>
            <Box
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  fontSize: '1.125rem', 
                  color: 'text.primary',
                  lineHeight: 1.5,
                }}
              >
                {previewTitle}
              </Typography>
              <TextField
                value={preview || 'No preview available'}
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

        {/* Segments */}
        <Box>
          <Typography variant="h3" sx={{ mb: 2, fontSize: '1.125rem', fontWeight: 600 }}>
            Segments ({config.segments.length})
          </Typography>
          <Stack spacing={2}>
            {config.segments.map((segment, index) => (
              <Paper
                key={segment.id}
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h4" sx={{ mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>
                  Segment {index + 1}{segment.name ? ` - ${segment.name}` : ''}
                </Typography>
                {segment.type && SEGMENT_DESCRIPTIONS[segment.type] && (
                  <Typography 
                    sx={{ 
                      fontSize: TYPOGRAPHY_SIZES.DESCRIPTION, 
                      color: 'text.secondary',
                      mb: 1.5,
                      lineHeight: '16px',
                    }}
                  >
                    {SEGMENT_DESCRIPTIONS[segment.type]}
                  </Typography>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 3 }}>
                  {/* Type */}
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: TYPOGRAPHY_SIZES.DESCRIPTION, color: 'text.secondary', mb: 0.5 }}>
                      Type
                    </Typography>
                    <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary' }}>
                      {segment.type ? segment.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}
                    </Typography>
                  </Box>

                  {/* Code */}
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: TYPOGRAPHY_SIZES.DESCRIPTION, color: 'text.secondary', mb: 0.5 }}>
                      Code
                    </Typography>
                    <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary', fontFamily: 'monospace' }}>
                      {segment.code || '—'}
                    </Typography>
                  </Box>

                  {/* Character Limit */}
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: TYPOGRAPHY_SIZES.DESCRIPTION, color: 'text.secondary', mb: 0.5 }}>
                      Character Limit
                    </Typography>
                    <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary' }}>
                      {segment.characterLimit || '—'}
                    </Typography>
                  </Box>

                  {/* Allowed Values */}
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: TYPOGRAPHY_SIZES.DESCRIPTION, color: 'text.secondary', mb: 0.5 }}>
                      Allowed Values
                    </Typography>
                    <Typography sx={{ fontSize: TYPOGRAPHY_SIZES.LABEL, color: 'text.primary' }}>
                      {segment.valueList && segment.valueList.length > 0 ? segment.valueList.join(', ') : '—'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
      </Stack>
        </Box>
    </Paper>
    </Box>
  );
}

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
  formatType?: 'account' | 'customer' | 'serviceAddress';
}

function FormatSection<T extends BaseSegment>({
  title: _title,
  subtitle,
  previewTitle,
  config,
  onUpdate,
  maxCharacterLimit,
  maxSegments,
  segmentOptions,
  maxSegmentCharLimit,
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
      if (segment.type === 'value_list' && segment.valueList?.length) return segment.valueList[0];
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
      {/* Description */}
      <Typography 
        sx={{ 
          color: 'text.secondary', 
          fontSize: '0.875rem',
          mb: 3,
        }}
      >
        {subtitle}
      </Typography>

      {/* Preview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          sx={{ 
            mb: 0.5, 
            fontWeight: 600, 
            fontSize: TYPOGRAPHY_SIZES.LABEL,
            color: 'text.primary',
          }}
        >
          {previewTitle} *
        </Typography>
        <Typography 
          sx={{ 
            color: 'text.secondary', 
            mb: 1.5,
            display: 'block', 
            fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
          }}
        >
          This is a preview of how the number will appear
        </Typography>
        <TextField
          value={generatePreview()}
          fullWidth
          size="medium"
          placeholder="Configure segments to see a preview"
          slotProps={{
            input: {
              readOnly: true,
              sx: {
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'text.primary',
              }
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
            },
          }}
        />
        {currentCharCount > config.characterLimit && (
          <Alert
            severity="error"
            sx={{
              mt: 1.5,
              fontSize: '0.8125rem',
            }}
          >
            Character limit exceeded by {currentCharCount - config.characterLimit} character{currentCharCount - config.characterLimit === 1 ? '' : 's'}
          </Alert>
        )}
      </Box>

      {/* Configuration Row: Number Limit + Delimiter */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600, 
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
            }}
          >
            Number Character Limit *
          </Typography>
          <Typography 
            sx={{ 
              color: 'text.secondary', 
              mb: 1.5, 
              display: 'block', 
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
            }}
          >
            Maximum {maxCharacterLimit} characters ({currentCharCount}/{config.characterLimit})
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
            sx={inputFieldStyles}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600, 
              fontSize: TYPOGRAPHY_SIZES.LABEL,
              color: 'text.primary',
            }}
          >
            Delimiter *
          </Typography>
          <Typography 
            sx={{ 
              color: 'text.secondary', 
              mb: 1.5, 
              display: 'block', 
              fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
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

      {/* Segments Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          sx={{ 
            mb: 0.5, 
            fontWeight: 600, 
            fontSize: '0.875rem', 
            color: 'text.primary',
          }}
        >
          Segment Code Selection
        </Typography>
        <Typography 
          sx={{ 
            color: 'text.secondary', 
            mb: 3, 
            display: 'block', 
            fontSize: TYPOGRAPHY_SIZES.DESCRIPTION,
          }}
        >
          Select segment codes by searching for the code or by description. Add up to {maxSegments} segments to configure the format.
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
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleAddSegment}
            startIcon={<Plus />}
            aria-label="Add another segment to the format"
            sx={{ 
              mt: 2,
              fontSize: '0.8125rem',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Add Another Segment
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const validateFormatConfig = <T extends BaseSegment>(
  config: FormatConfig<T>,
  formatName: string
): string[] => {
  const errors: string[] = [];

  // Check if all segments have required fields
  config.segments.forEach((segment, index) => {
    if (!segment.type) {
      errors.push(`${formatName} - Segment ${index + 1}: Type must be selected`);
    }
    if (!segment.name.trim()) {
      errors.push(`${formatName} - Segment ${index + 1}: Name is required`);
    }
    if (!segment.code.trim()) {
      errors.push(`${formatName} - Segment ${index + 1}: Code is required`);
    }
  });

  return errors;
};

// Deep equality check helper
const isDeepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const AccountNumberFormatPageV2: React.FC = () => {

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Track changes per format
  const [serviceAddressHasChanges, setServiceAddressHasChanges] = useState(false);
  const [accountHasChanges, setAccountHasChanges] = useState(false);
  const [customerHasChanges, setCustomerHasChanges] = useState(false);
  
  // Track edit/view mode per format (true = view mode, false = edit mode)
  const [accountInViewMode, setAccountInViewMode] = useState(false);
  const [customerInViewMode, setCustomerInViewMode] = useState(false);
  const [serviceAddressInViewMode, setServiceAddressInViewMode] = useState(false);
  
  // Tab state - Account is first (index 0)
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Improve keyboard accessibility by focusing main content after tab change
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }, 100);
  };

  // Service Address Number Format
  const [serviceAddressConfig, setServiceAddressConfig] = useState<FormatConfig<ServiceAddressSegment>>({
    characterLimit: 20,
    delimiter: 'none',
    segments: [
      {
        id: 'sa_segment_1',
        name: '',
        code: '',
        type: 'route',
      },
    ],
  });

  // Account Number Format
  const [accountConfig, setAccountConfig] = useState<FormatConfig<AccountSegment>>({
    characterLimit: 25,
    delimiter: 'none',
    segments: [
      {
        id: 'ac_segment_1',
        name: '',
        code: '',
        type: 'service_address',
      },
    ],
  });

  // Customer Number Format
  const [customerConfig, setCustomerConfig] = useState<FormatConfig<CustomerSegment>>({
    characterLimit: 20,
    delimiter: 'none',
    segments: [
      {
        id: 'cu_segment_1',
        name: '',
        code: '',
        type: 'sequential_id',
      },
    ],
  });

  const [originalConfigs, setOriginalConfigs] = useState({
    serviceAddress: serviceAddressConfig,
    account: accountConfig,
    customer: customerConfig,
  });

  // Segment options
  const serviceAddressOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
  ];

  const accountOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
    { value: 'service_address', label: 'Service Address Number' },
    { value: 'resident_number', label: 'Resident Number' },
  ];

  const customerOptions = [
    { value: 'billing_cycle', label: 'Billing Cycle' },
    { value: 'route', label: 'Route' },
    { value: 'value_list', label: 'Value List' },
    { value: 'sequential_id', label: 'New Sequential ID' },
  ];

  // Simulate loading existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOriginalConfigs({
          serviceAddress: serviceAddressConfig,
          account: accountConfig,
          customer: customerConfig,
        });
      } catch (err) {
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // Track changes per format
  useEffect(() => {
    setServiceAddressHasChanges(!isDeepEqual(serviceAddressConfig, originalConfigs.serviceAddress));
  }, [serviceAddressConfig, originalConfigs.serviceAddress]);

  useEffect(() => {
    setAccountHasChanges(!isDeepEqual(accountConfig, originalConfigs.account));
  }, [accountConfig, originalConfigs.account]);

  useEffect(() => {
    setCustomerHasChanges(!isDeepEqual(customerConfig, originalConfigs.customer));
  }, [customerConfig, originalConfigs.customer]);

  const handleSave = async (tabIndex: number) => {
    setSavingTab(tabIndex);
    setError(null);

    try {
      let validationErrors: string[] = [];
      let formatName = '';
      let config: any = null;
      let configKey: 'serviceAddress' | 'account' | 'customer' = 'account';

      // Determine which format to save
      if (tabIndex === 0) {
        formatName = 'Account Number';
        config = accountConfig;
        configKey = 'account';
        validationErrors = validateFormatConfig(accountConfig, formatName);
      } else if (tabIndex === 1) {
        formatName = 'Service Address';
        config = serviceAddressConfig;
        configKey = 'serviceAddress';
        validationErrors = validateFormatConfig(serviceAddressConfig, formatName);
      } else if (tabIndex === 2) {
        formatName = 'Customer Number';
        config = customerConfig;
        configKey = 'customer';
        validationErrors = validateFormatConfig(customerConfig, formatName);
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Saving ${formatName} configuration:`, config);

      // Update only the saved format's original config
      setOriginalConfigs(prev => ({
        ...prev,
        [configKey]: config,
      }));

      // Reset the change flag for this format and switch to view mode
      if (tabIndex === 0) {
        setAccountHasChanges(false);
        setAccountInViewMode(true);
      } else if (tabIndex === 1) {
        setServiceAddressHasChanges(false);
        setCustomerInViewMode(true);
      } else if (tabIndex === 2) {
        setCustomerHasChanges(false);
        setServiceAddressInViewMode(true);
      }

      // Set success message
      setSuccessMessage(`${formatName} format saved successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSavingTab(null);
    }
  };

  const handleCancel = (tabIndex: number) => {
    let hasChanges = false;
    let config: any = null;
    let setConfig: any = null;
    let setHasChangesFlag: any = null;

    // Determine which format to cancel
    if (tabIndex === 0) {
      hasChanges = accountHasChanges;
      config = originalConfigs.account;
      setConfig = setAccountConfig;
      setHasChangesFlag = setAccountHasChanges;
    } else if (tabIndex === 1) {
      hasChanges = serviceAddressHasChanges;
      config = originalConfigs.serviceAddress;
      setConfig = setServiceAddressConfig;
      setHasChangesFlag = setServiceAddressHasChanges;
    } else if (tabIndex === 2) {
      hasChanges = customerHasChanges;
      config = originalConfigs.customer;
      setConfig = setCustomerConfig;
      setHasChangesFlag = setCustomerHasChanges;
    }

    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmed) return;
      
      // Revert to original config
      setConfig(config);
      setHasChangesFlag(false);
    }
  };

  // Handle edit mode toggle
  const handleEdit = (tabIndex: number) => {
    if (tabIndex === 0) {
      setAccountInViewMode(false);
    } else if (tabIndex === 1) {
      setCustomerInViewMode(false);
    } else if (tabIndex === 2) {
      setServiceAddressInViewMode(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasChanges = activeTab === 0 ? accountHasChanges : 
                         activeTab === 1 ? serviceAddressHasChanges : 
                         customerHasChanges;
      const isSaving = savingTab !== null;

      // Cmd/Ctrl + S to save current tab
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (hasChanges && !isSaving) {
          handleSave(activeTab);
        }
      }
      // Escape to cancel current tab
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel(activeTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, accountHasChanges, serviceAddressHasChanges, customerHasChanges, savingTab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={pageStyles.formView.pageContainer}>
      {/* Skip to main content link for keyboard users */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1rem',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          '&:focus': {
            left: '1rem',
            top: '1rem',
          },
        }}
      >
        Skip to main content
      </Box>

      {/* Page Header */}
      <PageHeaderComposable sx={{ pb: 0, mb: 0 }}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="cancel"
              variant="outlined"
              color="secondary"
              onClick={() => handleCancel(activeTab)}
              disabled={savingTab !== null}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              variant="contained"
              color="primary"
              onClick={() => handleSave(activeTab)}
              disabled={
                (activeTab === 0 && !accountHasChanges) ||
                (activeTab === 1 && !customerHasChanges) ||
                (activeTab === 2 && !serviceAddressHasChanges) ||
                savingTab !== null
              }
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {savingTab === activeTab ? 'Saving...' : 'Save'}
            </Button>,
          ]}
        >
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              {
                path: '/billing/dashboard',
                title: 'Billing',
              },
              {
                path: '/billing/admin',
                title: 'Administration',
              },
              { title: 'Account Number Format V2' },
            ]}
          />
          <Typography variant="h1" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 0.5 }}>
            Number Format Builder
          </Typography>
        </PageHeaderComposable.Header>
        
        {/* Tabs in Header */}
        <Box sx={{ 
          backgroundColor: 'grey.50', 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          mb: 0, 
          pb: 0,
          mx: -3,
        }}>
            <Box sx={{ px: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="number format tabs">
                <Tab 
                  label="Account" 
                  {...a11yProps(0)} 
                  sx={{ textTransform: 'none', fontWeight: 600 }} 
                />
                <Tab 
                  label="Customer" 
                  {...a11yProps(1)} 
                  sx={{ textTransform: 'none', fontWeight: 600 }} 
                />
                <Tab 
                  label="Service Address" 
                  {...a11yProps(2)} 
                  sx={{ textTransform: 'none', fontWeight: 600 }} 
                />
              </Tabs>
            </Box>
          </Box>
      </PageHeaderComposable>

      {/* Main Content */}
      <Box 
        component="main" 
        id="main-content"
        tabIndex={-1}
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          backgroundColor: 'grey.50', 
          mt: 0,
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          {/* Error Alert */}
          {error && (
            <Box sx={{ px: 3, pt: 3 }} role="alert" aria-live="assertive">
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}
          
          {/* Success Alert */}
          {successMessage && (
            <Box sx={{ px: 3, pt: error ? 2 : 3 }} role="status" aria-live="polite">
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            </Box>
          )}

          {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
            {accountInViewMode ? (
              <ViewFormatSection
                title="Account Number Format"
                subtitle="View the configured format for account numbers"
                previewTitle="Account Number"
                config={accountConfig}
                onEdit={() => handleEdit(0)}
              />
            ) : (
              <FormatSection
                title="Account Number Format"
                subtitle="Configure the format for account numbers"
                previewTitle="Account Number"
                config={accountConfig}
                onUpdate={setAccountConfig}
                maxCharacterLimit={25}
                maxSegments={4}
                segmentOptions={accountOptions}
                maxSegmentCharLimit={25}
                formatType="account"
              />
            )}
            </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {customerInViewMode ? (
              <ViewFormatSection
                title="Customer Number Format"
                subtitle="View the configured format for customer numbers"
                previewTitle="Customer Number"
                config={customerConfig}
                onEdit={() => handleEdit(1)}
              />
            ) : (
              <FormatSection
                title="Customer Number Format"
                subtitle="Configure the format for customer numbers"
                previewTitle="Customer Number"
                config={customerConfig}
                onUpdate={setCustomerConfig}
                maxCharacterLimit={20}
                maxSegments={3}
                segmentOptions={customerOptions}
                maxSegmentCharLimit={20}
                formatType="customer"
              />
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {serviceAddressInViewMode ? (
              <ViewFormatSection
                title="Service Address Number Format"
                subtitle="View the configured format for service address numbers"
                previewTitle="Service Address Number"
                config={serviceAddressConfig}
                onEdit={() => handleEdit(2)}
              />
            ) : (
              <FormatSection
                title="Service Address Number Format"
                subtitle="Configure the format for service address numbers"
                previewTitle="Service Address Number"
                config={serviceAddressConfig}
                onUpdate={setServiceAddressConfig}
                maxCharacterLimit={20}
                maxSegments={3}
                segmentOptions={serviceAddressOptions}
                maxSegmentCharLimit={10}
                formatType="serviceAddress"
              />
            )}
            </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountNumberFormatPageV2;

