/**
 * Identity & Login Component
 * 
 * Welcome to your government services portal.
 * Simple, secure access to everything you need.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  TextField,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Avatar,
  Checkbox,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Home,
  Business,
  School,
  Store,
  Groups,
  ArrowForward,
  CheckCircle,
  Shield,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { EntityWithRole, EntityType } from '../types';

// Entity type icons
const entityIcons: Record<EntityType, React.ReactElement> = {
  household: <Home />,
  business: <Business />,
  organization: <Groups />,
  school: <School />,
  vendor: <Store />,
};

// Mock user entities for demo
const mockUserEntities: EntityWithRole[] = [
  {
    id: '1',
    entityType: 'household',
    displayName: '123 Main Street',
    status: 'active',
    metadata: { address: '123 Main Street, Anytown, ST 12345' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    role: {
      id: '1',
      userId: '1',
      entityId: '1',
      roleType: 'owner',
      permissions: [],
      validFrom: '2024-01-01',
      createdAt: '2024-01-01',
    },
  },
  {
    id: '2',
    entityType: 'business',
    displayName: 'ABC Consulting LLC',
    status: 'active',
    metadata: { ein: '12-3456789' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    role: {
      id: '2',
      userId: '1',
      entityId: '2',
      roleType: 'owner',
      permissions: [],
      validFrom: '2024-01-01',
      createdAt: '2024-01-01',
    },
  },
];

type LoginStep = 'login' | 'mfa' | 'entity-select';

const IdentityLogin: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Form state
  const [step, setStep] = useState<LoginStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  // Animate content on mount
  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Demo: any email/password works
    if (email && password) {
      // If MFA is enabled (demo: skip for now)
      // setStep('mfa');
      
      // Go to entity selection if multiple entities
      if (mockUserEntities.length > 1) {
        setStep('entity-select');
      } else {
        navigate('/unified-portal');
      }
    } else {
      setError('Please enter your email and password.');
    }
    
    setIsLoading(false);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (mfaCode === '123456' || mfaCode.length === 6) {
      if (mockUserEntities.length > 1) {
        setStep('entity-select');
      } else {
        navigate('/unified-portal');
      }
    } else {
      setError('That code didn\'t work. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleEntitySelect = (entityId: string) => {
    setSelectedEntity(entityId);
  };

  const handleEntityContinue = () => {
    if (selectedEntity) {
      navigate('/unified-portal');
    }
  };

  // Theme-derived colors
  const primaryColor = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const textDisabled = theme.palette.text.disabled;
  const borderColor = theme.palette.divider;
  const backgroundDefault = theme.palette.background.default;
  const backgroundPaper = theme.palette.background.paper;
  const hoverBg = theme.palette.action.hover;

  // Card styling
  const cardStyle = {
    borderRadius: '24px',
    border: 'none',
    boxShadow: `0 4px 24px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}, 0 12px 48px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)'}`,
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.mode === 'dark'
        ? theme.palette.background.default
        : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${primaryLight} 50%, ${theme.palette.success.light} 100%)`,
      position: 'relative',
      overflow: 'hidden',
      py: 4,
    }}>
      {/* Background decorations */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '50%',
        height: '60%',
        background: `radial-gradient(circle, ${theme.palette.primary.main}14 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '40%',
        height: '50%',
        background: `radial-gradient(circle, ${theme.palette.success.main}0F 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${theme.palette.secondary.main} 100%)`,
              mb: 3,
              boxShadow: `0 8px 24px ${primaryColor}4D`,
            }}>
              <Shield sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: textPrimary,
                fontSize: '1.75rem',
                letterSpacing: '-0.02em',
                mb: 1,
              }}
            >
              {step === 'login' && 'Welcome back'}
              {step === 'mfa' && 'One more step'}
              {step === 'entity-select' && 'Choose an account'}
            </Typography>
            <Typography sx={{ color: textSecondary, fontSize: '1rem' }}>
              {step === 'login' && 'Sign in to access your government services'}
              {step === 'mfa' && 'Enter the code from your authenticator app'}
              {step === 'entity-select' && 'Select which account you want to manage'}
            </Typography>
          </Box>

          {/* Login Form */}
          {step === 'login' && (
            <Card elevation={0} sx={cardStyle}>
              <CardContent sx={{ p: 4 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: '12px',
                      '& .MuiAlert-icon': { alignItems: 'center' },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: textDisabled }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontSize: '1rem',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: textDisabled }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: textDisabled }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontSize: '1rem',
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: borderColor,
                            '&.Mui-checked': { color: primaryColor },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: '0.875rem', color: textSecondary }}>
                          Keep me signed in
                        </Typography>
                      }
                    />
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); }}
                      sx={{
                        fontSize: '0.875rem',
                        color: primaryColor,
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: primaryColor,
                      boxShadow: `0 4px 12px ${primaryColor}4D`,
                      '&:hover': {
                        bgcolor: primaryDark,
                        boxShadow: `0 6px 16px ${primaryColor}66`,
                      },
                      '&:disabled': {
                        bgcolor: primaryLight,
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography sx={{ color: textDisabled, fontSize: '0.8125rem' }}>
                    or
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderColor: borderColor,
                    color: textPrimary,
                    '&:hover': {
                      borderColor: theme.palette.grey[400],
                      bgcolor: hoverBg,
                    },
                  }}
                >
                  Sign in with Gov ID
                </Button>
              </CardContent>
            </Card>
          )}

          {/* MFA Step */}
          {step === 'mfa' && (
            <Card elevation={0} sx={cardStyle}>
              <CardContent sx={{ p: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleMfaSubmit}>
                  <TextField
                    fullWidth
                    label="Verification code"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    inputProps={{
                      maxLength: 6,
                      style: {
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                      },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isLoading || mfaCode.length !== 6}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: primaryColor,
                      '&:hover': { bgcolor: primaryDark },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Verify'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => setStep('login')}
                    sx={{
                      mt: 2,
                      py: 1,
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      color: textSecondary,
                    }}
                  >
                    Back to sign in
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Entity Selection */}
          {step === 'entity-select' && (
            <Card elevation={0} sx={cardStyle}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {mockUserEntities.map((entity) => (
                    <Paper
                      key={entity.id}
                      elevation={0}
                      onClick={() => handleEntitySelect(entity.id)}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        border: '2px solid',
                        borderColor: selectedEntity === entity.id ? primaryColor : borderColor,
                        bgcolor: selectedEntity === entity.id ? primaryLight : backgroundPaper,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: primaryColor,
                          bgcolor: selectedEntity === entity.id ? primaryLight : hoverBg,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: selectedEntity === entity.id ? primaryColor : theme.palette.grey[100],
                          color: selectedEntity === entity.id ? 'white' : textSecondary,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {entityIcons[entity.entityType]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: textPrimary, fontSize: '1rem' }}>
                          {entity.displayName}
                        </Typography>
                        <Typography sx={{ color: textSecondary, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                          {entity.entityType.replace('_', ' ')} • {entity.role.roleType}
                        </Typography>
                      </Box>
                      {selectedEntity === entity.id && (
                        <CheckCircle sx={{ color: primaryColor, fontSize: 24 }} />
                      )}
                    </Paper>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={!selectedEntity}
                  onClick={handleEntityContinue}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: primaryColor,
                    '&:hover': { bgcolor: primaryDark },
                    '&:disabled': { bgcolor: primaryLight },
                  }}
                >
                  Continue
                </Button>

                <Button
                  fullWidth
                  onClick={() => setStep('login')}
                  sx={{
                    mt: 2,
                    py: 1,
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    color: textSecondary,
                  }}
                >
                  Sign in with a different account
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {step === 'login' && (
              <Typography sx={{ color: textSecondary, fontSize: '0.9375rem' }}>
                New here?{' '}
                <Link
                  href="#"
                  onClick={(e) => { e.preventDefault(); }}
                  sx={{
                    color: primaryColor,
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            )}
            <Typography sx={{ color: textDisabled, fontSize: '0.8125rem', mt: 2 }}>
              Your information is secure and encrypted
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default IdentityLogin;
