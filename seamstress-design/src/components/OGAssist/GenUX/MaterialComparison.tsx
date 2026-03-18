/**
 * Gen UX Component: Material Comparison
 * Shows comparison cards for deck materials with costs, pros/cons, and ratings
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

interface Material {
  name: string;
  icon: string;
  costPerSqFt: string;
  totalMaterialCost: string;
  totalProjectCost: string;
  lifespan: string;
  pros: string[];
  cons: string[];
  codeCompliant: boolean;
  rating: string;
}

interface MaterialComparisonProps {
  deckSize?: number;
  materials?: Material[];
  onSelectMaterial?: (materialName: string) => void;
}

export const MaterialComparison: React.FC<MaterialComparisonProps> = ({
  deckSize = 192,
  materials = [],
  onSelectMaterial,
}) => {
  // Rating colors
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Most Common':
        return { bg: 'info.lighter', text: 'info.dark' };
      case 'Low Maintenance':
        return { bg: 'success.lighter', text: 'success.dark' };
      case 'Premium':
        return { bg: 'warning.lighter', text: 'warning.dark' };
      default:
        return { bg: 'grey.100', text: 'text.secondary' };
    }
  };

  return (
    <Box>
      {/* Deck Size Context */}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <SquareFootIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cost estimates for your <strong>{deckSize} sq ft</strong> deck project
        </Typography>
      </Box>

      {/* Material Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 2,
        }}
      >
        {materials.map((material, index) => {
          const ratingColor = getRatingColor(material.rating);
          return (
            <Card
              key={index}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Header with Icon and Name */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '32px' }}>{material.icon}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600, mb: 0.5 }}>
                      {material.name}
                    </Typography>
                    <Chip
                      label={material.rating}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '11px',
                        bgcolor: ratingColor.bg,
                        color: ratingColor.text,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  {material.codeCompliant && (
                    <CheckCircleIcon sx={{ fontSize: 24, color: 'success.main' }} />
                  )}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* Cost Information */}
                <Box sx={{ mb: 2 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                        Per sq ft:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                        {material.costPerSqFt}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                        Material cost:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                        {material.totalMaterialCost}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pt: 0.5,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                        Total project:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, fontSize: '14px', color: 'primary.main' }}
                      >
                        {material.totalProjectCost}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Lifespan */}
                <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    <strong>Lifespan:</strong> {material.lifespan}
                  </Typography>
                </Box>

                {/* Pros */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.dark', mb: 0.5, display: 'block' }}>
                    ✓ Advantages
                  </Typography>
                  <Stack spacing={0.5}>
                    {material.pros.map((pro, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', pl: 1.5 }}>
                        • {pro}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                {/* Cons */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.dark', mb: 0.5, display: 'block' }}>
                    ⚠ Considerations
                  </Typography>
                  <Stack spacing={0.5}>
                    {material.cons.map((con, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', pl: 1.5 }}>
                        • {con}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                {/* Action Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => onSelectMaterial?.(material.name)}
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Select {material.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Code Compliance Note */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          bgcolor: 'info.lighter',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'info.light',
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '13px', color: 'info.dark' }}>
          <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} />
          <strong>All materials shown are code-compliant</strong> according to @knowledge/residential-building-code Section 4.2.3
        </Typography>
      </Box>
    </Box>
  );
};
