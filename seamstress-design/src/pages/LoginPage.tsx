import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { OpenGovLogoBlurple, OpenGovLogoWhite } from '../assets/opengov-logos';
import type { InferType } from 'yup';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: yup.boolean().default(false),
});

type LoginFormValues = InferType<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Feature bullet for branding panel
// ---------------------------------------------------------------------------

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  const featureTheme = useTheme();
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(featureTheme.palette.common.white, 0.15),
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha(featureTheme.palette.common.white, 0.7) }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// LoginPage
// ---------------------------------------------------------------------------

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigate('/');
    } catch {
      setFormError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ================================================================ */}
      {/* LEFT PANEL — Branding (desktop only)                             */}
      {/* ================================================================ */}
      {isDesktop && (
        <Box
          sx={{
            width: 480,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(160deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark ?? theme.palette.primary.main} 100%)`,
            px: 6,
            py: 6,
          }}
        >
          <Box>
            <Box sx={{ mb: 8 }}>
              <OpenGovLogoWhite width={160} height={40} />
            </Box>

            <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Power your government with modern tools
            </Typography>
            <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8), mb: 6 }}>
              Streamline operations, improve transparency, and deliver better outcomes for your community.
            </Typography>

            <Stack spacing={3}>
              <Feature
                icon={<SpeedIcon fontSize="small" />}
                title="Real-Time Dashboards"
                description="Monitor permits, budgets, and assets with live KPIs and analytics."
              />
              <Feature
                icon={<ShieldIcon fontSize="small" />}
                title="Enterprise Security"
                description="SSO, role-based access, and audit trails built for government compliance."
              />
              <Feature
                icon={<GroupsIcon fontSize="small" />}
                title="Cross-Department Collaboration"
                description="Unified platform connecting finance, permitting, procurement, and more."
              />
            </Stack>
          </Box>

          <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.5) }}>
            © {new Date().getFullYear()} OpenGov, Inc. All rights reserved.
          </Typography>
        </Box>
      )}

      {/* ================================================================ */}
      {/* RIGHT PANEL — Form                                               */}
      {/* ================================================================ */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        {/* Top bar — mobile/tablet logo */}
        {!isDesktop && (
          <Box
            sx={{
              py: 2,
              px: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OpenGovLogoBlurple width={120} height={30} />
          </Box>
        )}

        {/* Centered form area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 6 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {/* Logo on desktop (inside form area for alignment) */}
            {isDesktop && (
              <Box sx={{ mb: 5 }}>
                <OpenGovLogoBlurple width={140} height={35} />
              </Box>
            )}

            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Sign in to your OpenGov account
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email')}
                label="Email Address"
                type="email"
                fullWidth
                size="medium"
                autoComplete="email"
                autoFocus={!isMobile}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                size="medium"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 1.5 }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register('rememberMe')}
                      color="primary"
                      size="small"
                      disabled={isSubmitting}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="primary"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                startIcon={<ShieldIcon />}
              >
                Sign in with SSO
              </Button>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ display: 'block', mt: 4 }}
            >
              Don't have an account?{' '}
              <Link variant="caption" color="primary" underline="hover" href="#">
                Contact your administrator
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Bottom bar */}
        {!isDesktop && (
          <Box sx={{ py: 2, px: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} OpenGov, Inc. All rights reserved.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
