import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Button,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotesIcon from '@mui/icons-material/Notes';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import type { ChecklistItem, ChecklistSummary } from '../../types/inspection';

interface ChecklistStatusReviewProps {
  inspectionId: string;
  checklistItems: ChecklistItem[];
  summary: ChecklistSummary;
  inspectionAddress?: string;
  inspectionType?: string;
  onUpdateItem?: (itemId: string, result: string) => void;
  onPrintChecklist?: () => void;
  onShareReport?: () => void;
}

export const ChecklistStatusReview: React.FC<ChecklistStatusReviewProps> = ({
  inspectionId,
  checklistItems,
  summary,
  inspectionAddress,
  inspectionType,
  onUpdateItem,
  onPrintChecklist,
  onShareReport,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group items by category
  const itemsByCategory = checklistItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const getItemIcon = (result: string) => {
    switch (result) {
      case 'Pass':
        return <CheckCircleIcon color="success" />;
      case 'Fail':
        return <ErrorIcon color="error" />;
      case 'Not Started':
        return <PendingIcon color="action" />;
      case 'N/A':
        return <DoNotDisturbIcon color="disabled" />;
      default:
        return <PendingIcon color="action" />;
    }
  };

  const getItemChipColor = (result: string): any => {
    switch (result) {
      case 'Pass':
        return 'success';
      case 'Fail':
        return 'error';
      case 'Not Started':
        return 'warning';
      case 'N/A':
        return 'default';
      default:
        return 'default';
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const criticalFailures = checklistItems.filter(
    item => item.isCritical && item.result === 'Fail'
  );

  const completionColor = summary.completionPercentage >= 100
    ? 'success'
    : summary.completionPercentage >= 75
    ? 'warning'
    : 'error';

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2, border: 1, borderColor: 'divider' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Checklist Status Review
            </Typography>
            {inspectionAddress && (
              <Typography variant="body2" color="text.secondary">
                {inspectionAddress}
                {inspectionType && ` • ${inspectionType} Inspection`}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={onPrintChecklist} size="small">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={onShareReport} size="small">
              <ShareIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Overall Progress */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'background.default', border: 1, borderColor: 'divider' }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="medium">
                Overall Completion
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={`${completionColor}.main`}>
                {Math.round(summary.completionPercentage)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={summary.completionPercentage}
              color={completionColor as any}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Stack>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: 'success.light',
                border: 1,
                borderColor: 'success.main'
              }}
            >
              <CheckCircleIcon color="success" sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                {summary.passed}
              </Typography>
              <Typography variant="caption">Passed</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: summary.failed > 0 ? 'error.light' : 'background.default',
                border: 1,
                borderColor: summary.failed > 0 ? 'error.main' : 'divider'
              }}
            >
              <ErrorIcon color={summary.failed > 0 ? 'error' : 'action'} sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                {summary.failed}
              </Typography>
              <Typography variant="caption">Failed</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: summary.notStarted > 0 ? 'warning.light' : 'background.default',
                border: 1,
                borderColor: summary.notStarted > 0 ? 'warning.main' : 'divider'
              }}
            >
              <PendingIcon color={summary.notStarted > 0 ? 'warning' : 'action'} sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                {summary.notStarted}
              </Typography>
              <Typography variant="caption">Not Started</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <AssessmentIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                {summary.totalItems}
              </Typography>
              <Typography variant="caption">Total Items</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Critical Failures Alert */}
        {criticalFailures.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Critical Failures Detected</AlertTitle>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {criticalFailures.map(item => (
                <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                  <WarningAmberIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>{item.itemText}</strong>
                    {item.notes && `: ${item.notes}`}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Alert>
        )}

        {/* Detailed Checklist by Category */}
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          Detailed Checklist
        </Typography>

        {Object.entries(itemsByCategory).map(([category, items]) => {
          const categoryPassed = items.filter(i => i.result === 'Pass').length;
          const categoryTotal = items.filter(i => i.result !== 'N/A').length;
          const categoryCompletion = categoryTotal > 0 ? (categoryPassed / categoryTotal) * 100 : 0;

          return (
            <Accordion
              key={category}
              expanded={expandedCategories.has(category)}
              onChange={() => toggleCategory(category)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: '100%', pr: 2 }}
                >
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ flexGrow: 1 }}>
                    {category}
                  </Typography>
                  <Chip
                    label={`${categoryPassed}/${categoryTotal}`}
                    size="small"
                    color={categoryCompletion === 100 ? 'success' : 'default'}
                  />
                  <Box sx={{ width: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={categoryCompletion}
                      color={categoryCompletion === 100 ? 'success' : 'primary'}
                      sx={{ height: 4 }}
                    />
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {items.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        backgroundColor:
                          item.result === 'Fail' && item.isCritical
                            ? 'error.light'
                            : 'background.default',
                      }}
                    >
                      <ListItemIcon>{getItemIcon(item.result)}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{item.itemText}</Typography>
                            {item.isCritical && (
                              <Chip
                                label="Critical"
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          item.notes && (
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                              <NotesIcon fontSize="small" color="action" />
                              <Typography variant="caption">{item.notes}</Typography>
                            </Stack>
                          )
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={item.result}
                          size="small"
                          color={getItemChipColor(item.result)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            disabled={summary.completionPercentage < 100}
            onClick={() => {
              // Handle submission
            }}
          >
            Submit Inspection
          </Button>
          <Button variant="outlined" onClick={onPrintChecklist}>
            Export Report
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};