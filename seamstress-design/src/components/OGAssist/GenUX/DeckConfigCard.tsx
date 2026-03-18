/**
 * Generative UX Component: Deck Configuration Card
 * Interactive form for collecting deck project details
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HeightIcon from '@mui/icons-material/Height';

interface DeckConfigCardProps {
  onSubmit?: (config: DeckConfig) => void;
}

interface DeckConfig {
  width: number;
  length: number;
  attachment: 'attached' | 'freestanding';
  height: number;
}

export const DeckConfigCard: React.FC<DeckConfigCardProps> = ({ onSubmit }) => {
  const [width, setWidth] = useState(12);
  const [length, setLength] = useState(16);
  const [attachment, setAttachment] = useState<'attached' | 'freestanding'>('attached');
  const [height, setHeight] = useState(24);

  const squareFeet = width * length;

  const handleSubmit = () => {
    onSubmit?.({ width, length, attachment, height });
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              🏗️ Configure Your Deck Project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Let's gather some details about your planned deck to determine requirements
            </Typography>
          </Box>

          <Divider />

          {/* Dimensions */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SquareFootIcon fontSize="small" />
              Deck Dimensions
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Width (feet)"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: <Typography variant="caption" color="text.secondary">ft</Typography>
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Length (feet)"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Math.max(1, parseInt(e.target.value) || 1))}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: <Typography variant="caption" color="text.secondary">ft</Typography>
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2" color="primary.main" fontWeight={600}>
                Total Area: {squareFeet} square feet
              </Typography>
              {squareFeet >= 200 && (
                <Typography variant="caption" color="primary.dark">
                  ⚠️ Over 200 sq ft - permit likely required
                </Typography>
              )}
            </Box>
          </Box>

          {/* Attachment Type */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon fontSize="small" />
              Attachment to House
            </Typography>
            <ToggleButtonGroup
              value={attachment}
              exclusive
              onChange={(e, val) => val && setAttachment(val)}
              fullWidth
              size="small"
            >
              <ToggleButton value="attached">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="body2">Attached</Typography>
                  <Typography variant="caption" color="text.secondary">Connected to house</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="freestanding">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="body2">Freestanding</Typography>
                  <Typography variant="caption" color="text.secondary">Not connected</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Height */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HeightIcon fontSize="small" />
              Height Above Ground
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={height}
                onChange={(e, val) => setHeight(val as number)}
                min={0}
                max={60}
                step={6}
                marks={[
                  { value: 0, label: '0"' },
                  { value: 30, label: '30"' },
                  { value: 60, label: '60"' },
                ]}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}"`}
              />
            </Box>
            {height > 30 && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="caption" color="warning.dark">
                  ⚠️ Over 30 inches - railings required
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Summary */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Project Summary
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${width}' × ${length}' (${squareFeet} sq ft)`} size="small" />
              <Chip label={attachment === 'attached' ? 'Attached to house' : 'Freestanding'} size="small" />
              <Chip label={`${height}" above grade`} size="small" />
            </Stack>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            fullWidth
          >
            Check Requirements
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
