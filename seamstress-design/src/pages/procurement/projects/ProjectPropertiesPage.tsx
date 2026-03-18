/**
 * ProjectPropertiesPage Component
 *
 * Form for creating and editing procurement project properties
 *
 * Accessibility features:
 * - Proper form labeling and error announcements
 * - Keyboard navigation through form fields
 * - ARIA attributes for form validation
 * - Focus management on errors
 *
 * Mobile responsiveness:
 * - Stack form fields vertically on mobile
 * - Responsive button layouts
 * - Touch-friendly input sizes
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  useTheme,
  useMediaQuery,
  FormHelperText,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { pageStyles } from '../../../theme/pageStyles';
import type { Project, Department, Contact, Category, Template } from '../../../types/procurement';
import {
  MOCK_DEPARTMENTS,
  MOCK_CONTACTS,
  MOCK_CATEGORIES,
  MOCK_TEMPLATES,
  generateProject,
} from '../../../data/procurementProjectMockData';

// Use consistent naming
const mockDepartments = MOCK_DEPARTMENTS;
const mockContacts = MOCK_CONTACTS;
const mockCategories = MOCK_CATEGORIES;
const mockTemplates = MOCK_TEMPLATES;

// Form validation schema
const projectSchema = yup.object({
  title: yup.string().required('Project title is required'),
  departmentId: yup.string().required('Department is required'),
  projectContactId: yup.string().required('Project contact is required'),
  procurementContactId: yup.string().required('Procurement contact is required'),
  templateId: yup.string().required('Template is required'),
  isEmergency: yup.boolean().required(),
  projectId: yup.string().optional(),
  budgetAmount: yup.number().min(0, 'Budget must be positive').nullable(),
  budgetAccount: yup.string().nullable(),
  budgetDescription: yup.string().nullable(),
  categories: yup.array().of(yup.string()).min(0),
  // Timeline dates
  preProposalDate: yup.date().nullable(),
  releaseDate: yup.date().nullable(),
  qaSubmissionDeadline: yup.date().nullable(),
  qaResponseDeadline: yup.date().nullable(),
  responseSubmissionDeadline: yup.date().nullable(),
}).required();

type ProjectFormData = yup.InferType<typeof projectSchema>;

/**
 * Project Properties Form Page
 */
const ProjectPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const isEditMode = projectId && projectId !== 'new';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for focus management
  const formRef = useRef<HTMLFormElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const firstErrorFieldRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form setup with react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '',
      departmentId: '',
      projectContactId: '',
      procurementContactId: '',
      templateId: '',
      isEmergency: false,
      projectId: '',
      budgetAmount: null,
      budgetAccount: '',
      budgetDescription: '',
      categories: [],
      preProposalDate: null,
      releaseDate: null,
      qaSubmissionDeadline: null,
      qaResponseDeadline: null,
      responseSubmissionDeadline: null,
    },
  });

  const titleValue = watch('title');
  const projectIdValue = watch('projectId');

  // Auto-generate project ID from title if empty
  useEffect(() => {
    if (titleValue && !projectIdValue && !isEditMode) {
      const generatedId = `PRJ-${titleValue.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
      setValue('projectId', generatedId);
    }
  }, [titleValue, projectIdValue, isEditMode, setValue]);

  // Load existing project if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // Mock loading existing project
      setTimeout(() => {
        const mockProject = generateProject({ projectId });
        reset({
          title: mockProject.title,
          departmentId: mockProject.departmentId,
          projectContactId: mockProject.projectContactId,
          procurementContactId: mockProject.procurementContactId,
          templateId: mockProject.templateId,
          isEmergency: mockProject.isEmergency,
          projectId: mockProject.projectId,
          budgetAmount: mockProject.budget?.amount ?? null,
          budgetAccount: mockProject.budget?.account ?? '',
          budgetDescription: mockProject.budget?.description ?? '',
          categories: mockProject.categories.map(c => c.categoryId),
          preProposalDate: mockProject.timeline.preProposalDate ? dayjs(mockProject.timeline.preProposalDate) : null,
          releaseDate: mockProject.timeline.releaseDate ? dayjs(mockProject.timeline.releaseDate) : null,
          qaSubmissionDeadline: mockProject.timeline.qaSubmissionDeadline ? dayjs(mockProject.timeline.qaSubmissionDeadline) : null,
          qaResponseDeadline: mockProject.timeline.qaResponseDeadline ? dayjs(mockProject.timeline.qaResponseDeadline) : null,
          responseSubmissionDeadline: mockProject.timeline.responseSubmissionDeadline ? dayjs(mockProject.timeline.responseSubmissionDeadline) : null,
        });
        setLoading(false);
      }, 500);
    }
  }, [isEditMode, projectId, reset]);

  // Handle save
  const onSubmit = async (data: ProjectFormData, continueToManage: boolean = false) => {
    setSaving(true);
    setError(null);

    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Saving project:', data);

      if (continueToManage) {
        // Navigate to manage view
        const savedProjectId = isEditMode ? projectId : data.projectId || 'PRJ-NEW';
        navigate(`/procurement/projects/${savedProjectId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/procurement/projects');
  };

  // Focus first error field when form has errors
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorFieldRef.current) {
      firstErrorFieldRef.current.focus();
    }
  }, [errors]);

  // Focus error alert when it appears
  useEffect(() => {
    if (error && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [error]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
        role="status"
        aria-label="Loading project"
      >
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={pageStyles.formView.pageContainer}>
        {/* Page Header */}
        <Box
          component="header"
          role="banner"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              component="nav"
              aria-label="Breadcrumb"
            >
              Projects / {isEditMode ? 'Edit Project' : 'New Project'}
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'flex-start' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" gutterBottom component="h1">
                  {isEditMode ? 'Edit Project Properties' : 'New Project'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure project details, budget, timeline, and setup questions
                </Typography>
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ flexShrink: 0 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                  sx={{ order: { xs: 3, sm: 1 } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSubmit(data => onSubmit(data, false))}
                  disabled={saving || !isDirty}
                  sx={{ order: { xs: 2, sm: 2 } }}
                  aria-describedby={isDirty ? undefined : 'save-draft-hint'}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(data => onSubmit(data, true))}
                  disabled={saving}
                  sx={{ order: { xs: 1, sm: 3 } }}
                  aria-busy={saving}
                >
                  {saving ? 'Saving...' : 'Save & Continue'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          role="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {error && (
              <Alert
                ref={errorAlertRef}
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
                tabIndex={-1}
                role="alert"
              >
                {error}
              </Alert>
            )}

            <form
              ref={formRef}
              aria-label={isEditMode ? 'Edit project form' : 'New project form'}
              noValidate
            >
              <Stack spacing={{ xs: 3, sm: 4 }}>
                {/* Project Information Section */}
                <Box
                  component="fieldset"
                  sx={{
                    bgcolor: 'background.paper',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    m: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="legend"
                    sx={{ mb: 2, fontWeight: 600, px: 0 }}
                  >
                    Project Information
                  </Typography>
                  <Stack spacing={3}>
                    {/* Title */}
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Project Title"
                          required
                          fullWidth
                          error={!!errors.title}
                          helperText={errors.title?.message}
                          inputProps={{
                            'aria-required': true,
                            'aria-invalid': !!errors.title,
                            'aria-describedby': errors.title ? 'title-error' : undefined,
                          }}
                          FormHelperTextProps={{
                            id: errors.title ? 'title-error' : undefined,
                          }}
                        />
                      )}
                    />

                    {/* Project ID */}
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Project ID"
                          fullWidth
                          disabled={isEditMode}
                          helperText={isEditMode ? 'Project ID cannot be changed' : 'Auto-generated from title'}
                          inputProps={{
                            'aria-describedby': 'project-id-hint',
                          }}
                          FormHelperTextProps={{
                            id: 'project-id-hint',
                          }}
                        />
                      )}
                    />

                    {/* Department */}
                    <Controller
                      name="departmentId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth required error={!!errors.departmentId}>
                          <InputLabel>Department</InputLabel>
                          <Select {...field} label="Department">
                            {mockDepartments.map(dept => (
                              <MenuItem key={dept.departmentId} value={dept.departmentId}>
                                {dept.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.departmentId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {errors.departmentId.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />

                    {/* Template */}
                    <Controller
                      name="templateId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth required error={!!errors.templateId}>
                          <InputLabel>Template Type</InputLabel>
                          <Select {...field} label="Template Type">
                            {mockTemplates.map(template => (
                              <MenuItem key={template.templateId} value={template.templateId}>
                                {template.type} - {template.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.templateId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {errors.templateId.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />

                    {/* Categories */}
                    <Controller
                      name="categories"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={mockCategories}
                          getOptionLabel={(option) => {
                            const cat = typeof option === 'string'
                              ? mockCategories.find(c => c.categoryId === option)
                              : option;
                            return cat ? `${cat.code} - ${cat.name}` : '';
                          }}
                          value={mockCategories.filter(c => field.value?.includes(c.categoryId))}
                          onChange={(_, newValue) => {
                            field.onChange(newValue.map(v => v.categoryId));
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Categories" placeholder="Select categories" />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                label={`${option.code} - ${option.name}`}
                                {...getTagProps({ index })}
                                key={option.categoryId}
                              />
                            ))
                          }
                        />
                      )}
                    />

                    {/* Project Contact */}
                    <Controller
                      name="projectContactId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={mockContacts}
                          getOptionLabel={(option) => {
                            const contact = typeof option === 'string'
                              ? mockContacts.find(c => c.contactId === option)
                              : option;
                            return contact ? `${contact.firstName} ${contact.lastName}` : '';
                          }}
                          value={mockContacts.find(c => c.contactId === field.value) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.contactId || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Project Contact"
                              required
                              error={!!errors.projectContactId}
                              helperText={errors.projectContactId?.message}
                            />
                          )}
                        />
                      )}
                    />

                    {/* Procurement Contact */}
                    <Controller
                      name="procurementContactId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={mockContacts}
                          getOptionLabel={(option) => {
                            const contact = typeof option === 'string'
                              ? mockContacts.find(c => c.contactId === option)
                              : option;
                            return contact ? `${contact.firstName} ${contact.lastName}` : '';
                          }}
                          value={mockContacts.find(c => c.contactId === field.value) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.contactId || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Procurement Contact"
                              required
                              error={!!errors.procurementContactId}
                              helperText={errors.procurementContactId?.message}
                            />
                          )}
                        />
                      )}
                    />

                    {/* Emergency Flag */}
                    <Controller
                      name="isEmergency"
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Emergency Procurement</FormLabel>
                          <RadioGroup
                            {...field}
                            row
                            value={field.value ? 'yes' : 'no'}
                            onChange={(e) => field.onChange(e.target.value === 'yes')}
                          >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Stack>
                </Box>

                {/* Budget Section */}
                <Box
                  component="fieldset"
                  sx={{
                    bgcolor: 'background.paper',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    m: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="legend"
                    sx={{ mb: 2, fontWeight: 600, px: 0 }}
                  >
                    Budget (Internal Use Only)
                  </Typography>
                  <Stack spacing={3}>
                    <Controller
                      name="budgetAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Budget Amount"
                          type="number"
                          fullWidth
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            },
                          }}
                          error={!!errors.budgetAmount}
                          helperText={errors.budgetAmount?.message}
                        />
                      )}
                    />

                    <Controller
                      name="budgetAccount"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Account Number" fullWidth />
                      )}
                    />

                    <Controller
                      name="budgetDescription"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          fullWidth
                          multiline
                          rows={2}
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Timeline Section */}
                <Box
                  component="fieldset"
                  sx={{
                    bgcolor: 'background.paper',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    m: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="legend"
                    sx={{ mb: 2, fontWeight: 600, px: 0 }}
                  >
                    Timeline
                  </Typography>
                  <Stack spacing={3}>
                    <Controller
                      name="preProposalDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Pre-Proposal Date"
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="releaseDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Release Date"
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="qaSubmissionDeadline"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Q&A Submission Deadline"
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="qaResponseDeadline"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Q&A Response Deadline"
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="responseSubmissionDeadline"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Response Submission Deadline"
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Bottom Actions */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ pt: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ order: { xs: 3, sm: 1 } }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSubmit(data => onSubmit(data, false))}
                    disabled={saving || !isDirty}
                    sx={{ order: { xs: 2, sm: 2 } }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit(data => onSubmit(data, true))}
                    disabled={saving}
                    sx={{ order: { xs: 1, sm: 3 } }}
                    aria-busy={saving}
                  >
                    {saving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectPropertiesPage;
