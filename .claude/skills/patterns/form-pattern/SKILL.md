---
name: Form Pattern
description: Full production-ready scaffold for CDS form pages with react-hook-form, yup validation, and unsaved changes handling.
---

# Form Pattern

**Keywords:** form, create, edit, save, new, input, validation

Use this skill when generating create/edit form pages with validation, unsaved changes handling, and responsive layouts.

---

## Scaffold Structure

### PageHeaderComposable
- Title: "New [Resource]" or "Edit [Resource]"
- Actions: Cancel (outlined) + Save (contained) buttons

### Form Setup
- react-hook-form with yup validation schema
- `useForm` with `resolver: yupResolver(schema)`

### Form Fields
- TextField, Select, Autocomplete, DatePicker
- Checkbox/Radio with FormControlLabel
- Field layout: Stack with maxWidth 800px

### Validation States
- pristine, dirty, validating, invalid, valid
- Error display: `helperText` on fields, Alert for form-level errors

### Unsaved Changes
- `beforeunload` event listener when form is dirty
- Optional: Block navigation with `Blocker` from react-router-dom

### Edit vs Create Mode
- Edit: Load existing entity from route params (`useParams`)
- Create: Empty form with default values

### Save Flow
- validate → submit → navigate on success
- Loading state on Save button (use `formState.isSubmitting`)

### Responsive
- Full-width fields on mobile
- maxWidth 800px for form container

### Optional Enhancements
- TipTap rich text editor for description/notes
- File upload patterns (FileUpload component)

---

## Complete Code Example

```tsx
import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';

const schema = yup.object({
  name: yup.string().required('Name is required').max(100, 'Name must be 100 characters or less'),
  description: yup.string().max(500, 'Description must be 500 characters or less'),
  category: yup.string().required('Category is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  active: yup.boolean().default(true),
});

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  name: '',
  description: '',
  category: '',
  priority: 'medium',
  active: true,
};

const ItemFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditMode && id) {
      // Simulate loading existing entity
      const mockItem: FormData = {
        name: 'Existing Item',
        description: 'Loaded from API',
        category: 'Category A',
        priority: 'high',
        active: true,
      };
      reset(mockItem);
    }
  }, [isEditMode, id, reset]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(`/suite/items${isEditMode ? `/${id}` : ''}`);
      } catch {
        setError('root', { message: 'Failed to save. Please try again.' });
      }
    },
    [navigate, isEditMode, id, setError]
  );

  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [isDirty, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Button key="cancel" variant="outlined" color="inherit" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>,
              <Button
                key="save"
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>,
            ]}
          >
            <PageHeaderComposable.Title>
              {isEditMode ? 'Edit Item' : 'New Item'}
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              {isEditMode ? 'Update the item details below.' : 'Fill in the details to create a new item.'}
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      <Box
        component="main"
        sx={{
          maxWidth: 800,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.root.message}
            </Alert>
          )}

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      required
                      fullWidth
                      size="medium"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      size="medium"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category} size="medium">
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Category A">Category A</MenuItem>
                        <MenuItem value="Category B">Category B</MenuItem>
                      </Select>
                      <FormHelperText>{errors.category?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.priority} size="medium">
                      <InputLabel>Priority</InputLabel>
                      <Select {...field} label="Priority">
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                      <FormHelperText>{errors.priority?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Active"
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default ItemFormPage;
```

---

## Dependencies

```json
{
  "dependencies": {
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "yup": "^1.x"
  }
}
```

---

## Validation Schema Patterns

```ts
// Required string
yup.string().required('Field is required')

// Optional with max length
yup.string().max(500, 'Must be 500 characters or less')

// Email
yup.string().email('Invalid email').required('Email is required')

// Select/Enum
yup.string().oneOf(['option1', 'option2']).required('Please select')

// Number range
yup.number().min(0, 'Must be positive').max(100, 'Must be 100 or less')

// Date
yup.date().required('Date is required')
```
