/**
 * ProjectFilters Component
 *
 * Filter form for projects list with status, department, and template filters
 *
 * Accessibility features:
 * - Proper form labeling with fieldsets and legends
 * - Keyboard navigation through checkboxes
 * - Screen reader announcements for filter changes
 * - Focus management
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Box,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { ProjectStatus, TemplateType, ProjectFiltersState } from '../../../types/procurement';
import { MOCK_DEPARTMENTS } from '../../../data/procurementProjectMockData';

export interface ProjectFiltersProps {
  filters: ProjectFiltersState;
  onFiltersChange: (filters: ProjectFiltersState) => void;
}

const PROJECT_STATUSES: ProjectStatus[] = [
  'Draft',
  'Review',
  'Final',
  'Post Pending',
  'Open',
  'Pending',
  'Evaluation',
  'Award Pending',
  'Closed',
];

const TEMPLATE_TYPES: TemplateType[] = ['RFP', 'RFQ', 'IFB', 'RFI', 'Bid', 'Quote', 'Evaluation'];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  // Ref for screen reader announcements
  const announcerRef = useRef<HTMLDivElement>(null);

  const announceChange = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, []);

  const handleStatusChange = (status: ProjectStatus, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
    announceChange(`${status} filter ${checked ? 'selected' : 'removed'}`);
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    const newDepartments = checked
      ? [...filters.departments, department]
      : filters.departments.filter(d => d !== department);
    onFiltersChange({ ...filters, departments: newDepartments });
    announceChange(`${department} filter ${checked ? 'selected' : 'removed'}`);
  };

  const handleTemplateChange = (template: TemplateType, checked: boolean) => {
    const newTemplates = checked
      ? [...filters.templates, template]
      : filters.templates.filter(t => t !== template);
    onFiltersChange({ ...filters, templates: newTemplates });
    announceChange(`${template} filter ${checked ? 'selected' : 'removed'}`);
  };

  const handleClearAll = () => {
    onFiltersChange({
      status: [],
      departments: [],
      templates: [],
    });
    announceChange('All filters cleared');
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.departments.length > 0 ||
    filters.templates.length > 0;

  const totalActiveFilters =
    filters.status.length +
    filters.departments.length +
    filters.templates.length;

  return (
    <Stack
      spacing={3}
      component="form"
      role="search"
      aria-label="Filter projects"
    >
      {/* Screen reader announcements */}
      <Box
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          startIcon={<ClearIcon aria-hidden="true" />}
          onClick={handleClearAll}
          size="medium"
          sx={{ alignSelf: 'flex-start', minHeight: 36 }}
          aria-label={`Clear all ${totalActiveFilters} filters`}
        >
          Clear All Filters
        </Button>
      )}

      {/* Status Filter */}
      <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          component="legend"
          id="status-filter-label"
          sx={{ mb: 1.5 }}
        >
          Status
          {filters.status.length > 0 && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({filters.status.length} selected)
            </Typography>
          )}
        </Typography>
        <FormGroup aria-labelledby="status-filter-label">
          {PROJECT_STATUSES.map(status => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={filters.status.includes(status)}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                  size="small"
                  inputProps={{
                    'aria-label': `Filter by ${status} status`,
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                    p: 1,
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  {status}
                </Typography>
              }
              sx={{
                ml: 0,
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1,
                minHeight: 40,
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider />

      {/* Department Filter */}
      <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          component="legend"
          id="department-filter-label"
          sx={{ mb: 1.5 }}
        >
          Department
          {filters.departments.length > 0 && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({filters.departments.length} selected)
            </Typography>
          )}
        </Typography>
        <FormGroup aria-labelledby="department-filter-label">
          {MOCK_DEPARTMENTS.map(dept => (
            <FormControlLabel
              key={dept.departmentId}
              control={
                <Checkbox
                  checked={filters.departments.includes(dept.name)}
                  onChange={(e) => handleDepartmentChange(dept.name, e.target.checked)}
                  size="small"
                  inputProps={{
                    'aria-label': `Filter by ${dept.name} department`,
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                    p: 1,
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  {dept.name}
                </Typography>
              }
              sx={{
                ml: 0,
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1,
                minHeight: 40,
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider />

      {/* Template Type Filter */}
      <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          component="legend"
          id="template-filter-label"
          sx={{ mb: 1.5 }}
        >
          Template Type
          {filters.templates.length > 0 && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({filters.templates.length} selected)
            </Typography>
          )}
        </Typography>
        <FormGroup aria-labelledby="template-filter-label">
          {TEMPLATE_TYPES.map(template => (
            <FormControlLabel
              key={template}
              control={
                <Checkbox
                  checked={filters.templates.includes(template)}
                  onChange={(e) => handleTemplateChange(template, e.target.checked)}
                  size="small"
                  inputProps={{
                    'aria-label': `Filter by ${template} template type`,
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                    p: 1,
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  {template}
                </Typography>
              }
              sx={{
                ml: 0,
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1,
                minHeight: 40,
              }}
            />
          ))}
        </FormGroup>
      </Box>
    </Stack>
  );
};
