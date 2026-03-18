import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

export interface SkillCardProps {
  name: string;
  category: 'core' | 'domain' | 'patterns';
  description: string;
  keywords: string[];
  useCases: string[];
  relatedSkills: string[];
}

const getCategoryColor = (category: 'core' | 'domain' | 'patterns') => {
  switch (category) {
    case 'core':
      return 'primary';
    case 'domain':
      return 'secondary';
    case 'patterns':
      return 'success';
    default:
      return 'default';
  }
};

const getCategoryLabel = (category: 'core' | 'domain' | 'patterns') => {
  switch (category) {
    case 'core':
      return 'Core';
    case 'domain':
      return 'Domain';
    case 'patterns':
      return 'Pattern';
    default:
      return category;
  }
};

export const SkillCard: React.FC<SkillCardProps> = ({
  name,
  category,
  description,
  keywords,
  useCases,
  relatedSkills,
}) => {
  const theme = useTheme();
  const categoryColor = getCategoryColor(category);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `2px solid ${theme.palette[categoryColor].main}`,
        bgcolor: alpha(theme.palette[categoryColor].main, 0.03),
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette[categoryColor].dark,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            label={getCategoryLabel(category)}
            color={categoryColor}
            size="small"
          />
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: theme.palette[categoryColor].main,
            }}
          >
            {name}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Keywords:
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}
        >
          {keywords.map((kw) => (
            <Chip
              key={kw}
              label={kw}
              size="small"
              variant="outlined"
              sx={{ borderColor: theme.palette[categoryColor].main }}
            />
          ))}
        </Stack>

        <Typography variant="subtitle2" gutterBottom>
          Example Uses:
        </Typography>
        <List dense sx={{ mb: 2, flex: 1 }}>
          {useCases.map((useCase, i) => (
            <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary={`• ${useCase}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          <strong>Related:</strong> {relatedSkills.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};
