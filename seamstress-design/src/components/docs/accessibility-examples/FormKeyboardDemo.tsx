import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Stack,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  getAccessibleFieldProps,
  AccessibleFormError,
} from '../../forms/FormFieldHelper';

/**
 * FormKeyboardDemo - Demonstrates form navigation patterns
 *
 * Keyboard patterns:
 * - Tab: Move between fields
 * - Shift+Tab: Move backward
 * - Space: Toggle checkboxes
 * - Arrow Up/Down: Navigate radio group
 * - Enter: Submit form (in single-line inputs)
 */
export function FormKeyboardDemo() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscribe: false,
    notifications: false,
    contactMethod: 'email',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const [lastAction, setLastAction] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // Validation functions
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return undefined;
  };

  const handleBlur = (field: 'name' | 'email') => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field];
    const error = field === 'name' ? validateName(value) : validateEmail(value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setLastAction(`Updated ${field}`);
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
    setLastAction(`${e.target.checked ? 'Checked' : 'Unchecked'} ${field}`);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, contactMethod: e.target.value }));
    setLastAction(`Selected ${e.target.value} contact method`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const newErrors = { name: nameError, email: emailError };

    setErrors(newErrors);
    setTouched({ name: true, email: true });

    // Only submit if no errors
    if (!nameError && !emailError) {
      setSubmitted(true);
      setLastAction('Form submitted successfully!');
      setTimeout(() => setSubmitted(false), 2000);
    } else {
      setLastAction('Validation failed - please fix errors');
    }
  };

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Tab</strong> to move between fields, <strong>Space</strong> to toggle checkboxes,{' '}
        <strong>Arrow keys</strong> to navigate radio options, <strong>Enter</strong> to submit.
      </Typography>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        <Stack spacing={3}>
          {/* Text inputs with accessible validation */}
          <Box>
            <TextField
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleTextChange('name')}
              onBlur={handleBlur('name')}
              fullWidth
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              {...getAccessibleFieldProps('name', touched.name ? errors.name : undefined)}
            />
            <AccessibleFormError
              fieldName="name"
              error={touched.name ? errors.name : undefined}
              helperText="Tab to move to next field"
            />
          </Box>

          <Box>
            <TextField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleTextChange('email')}
              onBlur={handleBlur('email')}
              fullWidth
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              {...getAccessibleFieldProps('email', touched.email ? errors.email : undefined)}
            />
            <AccessibleFormError
              fieldName="email"
              error={touched.email ? errors.email : undefined}
              helperText="Press Enter to submit from this field"
            />
          </Box>

          {/* Checkboxes */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preferences (Space to toggle)
            </Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.subscribe}
                    onChange={handleCheckboxChange('subscribe')}
                    sx={focusIndicatorSx}
                  />
                }
                label="Subscribe to newsletter"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notifications}
                    onChange={handleCheckboxChange('notifications')}
                    sx={focusIndicatorSx}
                  />
                }
                label="Enable notifications"
              />
            </Stack>
          </Box>

          {/* Radio group */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Preferred Contact Method (Arrow keys to navigate)
            </FormLabel>
            <RadioGroup
              value={formData.contactMethod}
              onChange={handleRadioChange}
              aria-label="contact method"
            >
              <FormControlLabel
                value="email"
                control={<Radio sx={focusIndicatorSx} />}
                label="Email"
              />
              <FormControlLabel
                value="phone"
                control={<Radio sx={focusIndicatorSx} />}
                label="Phone"
              />
              <FormControlLabel
                value="mail"
                control={<Radio sx={focusIndicatorSx} />}
                label="Postal Mail"
              />
            </RadioGroup>
          </FormControl>

          {/* Submit buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              sx={focusIndicatorSx}
            >
              Submit Form
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  subscribe: false,
                  notifications: false,
                  contactMethod: 'email',
                });
                setErrors({});
                setTouched({});
                setLastAction('Form reset');
              }}
              sx={focusIndicatorSx}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Success message */}
      {submitted && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
            borderRadius: 1,
          }}
          role="alert"
        >
          <Typography variant="body2" color="success.main" fontWeight={500}>
            Form submitted successfully!
          </Typography>
        </Paper>
      )}

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Form data:</strong>{' '}
          {formData.name || '(no name)'}, {formData.email || '(no email)'},{' '}
          {formData.contactMethod}, subscribe: {formData.subscribe ? 'yes' : 'no'}
          {lastAction && (
            <>
              {' | '}
              <strong>Last action:</strong> {lastAction}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default FormKeyboardDemo;

export const formKeyboardCode = `// Form Keyboard Navigation
// Tab: Move between fields | Shift+Tab: Move backward
// Space: Toggle checkboxes | Arrows: Navigate radio group
// Enter: Submit form (single-line inputs)

<form onSubmit={handleSubmit}>
  {/* Tab to move between inputs */}
  <TextField
    label="Full Name"
    value={name}
    onChange={handleChange}
  />

  <TextField
    label="Email"
    type="email"
    // Enter submits from single-line inputs
  />

  {/* Space to toggle checkboxes */}
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={handleCheck} />}
    label="Subscribe"
  />

  {/* Arrow keys navigate radio group */}
  <RadioGroup value={value} onChange={handleRadio}>
    <FormControlLabel value="email" control={<Radio />} label="Email" />
    <FormControlLabel value="phone" control={<Radio />} label="Phone" />
  </RadioGroup>

  {/* Enter or Space activates buttons */}
  <Button type="submit" variant="contained">
    Submit
  </Button>
</form>`;
