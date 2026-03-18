import React from 'react';
import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { SEGMENT_DESCRIPTIONS, type BaseSegment, type FormatConfig } from './types';

// ============================================================================
// VIEW FORMAT SECTION (Read-only saved state)
// ============================================================================

interface ViewFormatSectionProps<T extends BaseSegment> {
  title: string;
  subtitle: string;
  config: FormatConfig<T>;
  onEdit: () => void;
}

export function ViewFormatSection<T extends BaseSegment>({
  title,
  subtitle,
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
      if (segment.type === 'value_list' && segment.valueList?.length) return segment.valueList[0].code || segment.code;
      if (segment.type === 'value_list') return segment.code;
      if (segment.type === 'sequential_id') {
        const length = segment.characterLimit || 10;
        return '0'.repeat(length);
      }
      if (segment.type === 'resident_number') return '1';
      return segment.code;
    });

    return segmentPreviews.join(delimiter);
  };

  const preview = generatePreview();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
      }}
    >
      {/* Header with Title and Edit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5, fontSize: '1.25rem', fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={onEdit}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '4px',
            px: 3,
          }}
        >
          Edit
        </Button>
      </Box>

      {/* Format Overview and Configuration Card */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          bgcolor: 'background.paper',
        }}
      >
        {/* Format Overview Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Format Overview
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'divider',
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', color: 'text.primary', fontFamily: 'monospace' }}>
              {preview || 'No preview available'}
            </Typography>
          </Box>
          {config.segments.length > 0 && config.segments.some(s => s.name) && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              Segments Description:{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontSize: '0.75rem',
                }}
              >
                {config.segments
                  .filter(s => s.name)
                  .map(s => s.name)
                  .join(' - ')}
              </Typography>
            </Typography>
          )}
        </Box>

        {/* Format Configuration Section */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Format Configuration
          </Typography>
          <Box sx={{ display: 'flex', gap: 8 }}>
            <Box sx={{ width: '140px' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                Character Limit
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                {config.characterLimit}
              </Typography>
            </Box>
            <Box sx={{ width: '140px' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                Delimiter
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                {config.delimiter === 'none' ? 'None' :
                 config.delimiter === 'dash' ? 'Dash(-)' : 'Period(.)'}
              </Typography>
            </Box>
            <Box sx={{ width: '140px' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                Segments
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                {config.segments.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Segments Section */}
      <Box>
        <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Segments
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            mb: 2,
          }}
        >
          View the Configured Segments
        </Typography>
        <Stack spacing={2}>
          {config.segments.map((segment, index) => (
            <Box
              key={segment.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h4" sx={{ mb: 0.5, fontSize: '0.9375rem', fontWeight: 600 }}>
                Segment {index + 1} - {segment.name || 'Untitled'}
              </Typography>
              {segment.type && SEGMENT_DESCRIPTIONS[segment.type] && (
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  {SEGMENT_DESCRIPTIONS[segment.type]}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 8 }}>
                <Box sx={{ width: '140px' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                    Type
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                    {segment.type ? segment.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}
                  </Typography>
                </Box>
                <Box sx={{ width: '140px' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                    Name
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                    {segment.name || '—'}
                  </Typography>
                </Box>
                <Box sx={{ width: '140px' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                    Code
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', fontFamily: 'monospace' }}>
                    {segment.code || '—'}
                  </Typography>
                </Box>
                {segment.valueList && segment.valueList.length > 0 && (
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.5 }}>
                      Values
                    </Typography>
                    <Stack spacing={1}>
                      {segment.valueList.map((value, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ width: '140px' }}>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
                              Name
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                              {value.name || '—'}
                            </Typography>
                          </Box>
                          <Box sx={{ width: '140px' }}>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
                              Code
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', fontFamily: 'monospace' }}>
                              {value.code || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
