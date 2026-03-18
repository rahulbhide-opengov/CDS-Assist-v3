import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

/**
 * LiveRegionDemo - Demonstrates ARIA live region announcements
 *
 * Demonstrates:
 * - aria-live="polite" for non-urgent updates
 * - aria-live="assertive" for urgent interruptions
 * - role="alert" for error messages
 * - role="status" for status updates
 */
export function LiveRegionDemo() {
  const theme = useTheme();
  const [politeMessage, setPoliteMessage] = useState<string>('');
  const [assertiveMessage, setAssertiveMessage] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [counter, setCounter] = useState(0);
  const [announcementLog, setAnnouncementLog] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLog = (type: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAnnouncementLog(prev => [...prev.slice(-7), `[${timestamp}] ${type}: "${message}"`]);
  };

  // Polite announcement - waits for screen reader to finish current speech
  const announcePolite = () => {
    const message = `Item ${counter + 1} added to your cart`;
    setPoliteMessage(message);
    setCounter(c => c + 1);
    addLog('POLITE', message);
    setTimeout(() => setPoliteMessage(''), 5000);
  };

  // Assertive announcement - interrupts current speech
  const announceAssertive = () => {
    const message = 'Your session will expire in 2 minutes';
    setAssertiveMessage(message);
    addLog('ASSERTIVE', message);
    setTimeout(() => setAssertiveMessage(''), 5000);
  };

  // Alert role - implicitly assertive
  const triggerAlert = () => {
    const message = 'Error: Invalid email address format';
    setAlertMessage(message);
    addLog('ALERT (role)', message);
    setTimeout(() => setAlertMessage(''), 5000);
  };

  // Status role - implicitly polite
  const updateStatus = () => {
    const message = 'Changes saved successfully';
    setStatusMessage(message);
    addLog('STATUS (role)', message);
    setTimeout(() => setStatusMessage(''), 5000);
  };

  const clearAll = () => {
    setPoliteMessage('');
    setAssertiveMessage('');
    setAlertMessage('');
    setStatusMessage('');
    setAnnouncementLog([]);
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
        Live regions announce dynamic content changes to screen readers. Use <strong>polite</strong>{' '}
        for non-urgent updates, <strong>assertive</strong> for urgent interruptions.
      </Typography>

      {/* Trigger buttons */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Trigger Announcements
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            onClick={announcePolite}
            sx={focusIndicatorSx}
          >
            Polite (Add to Cart)
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={announceAssertive}
            sx={focusIndicatorSx}
          >
            Assertive (Session Warning)
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={triggerAlert}
            sx={focusIndicatorSx}
          >
            Alert (Error Message)
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={updateStatus}
            sx={focusIndicatorSx}
          >
            Status (Save Success)
          </Button>
          <Button
            variant="text"
            onClick={clearAll}
            sx={focusIndicatorSx}
          >
            Clear All
          </Button>
        </Stack>
      </Paper>

      {/* Live Region Explanations and Displays */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Polite Region */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <InfoIcon color="info" fontSize="small" />
            <Typography variant="subtitle2">
              aria-live="polite"
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Waits for the screen reader to finish before announcing. Use for status updates,
            cart additions, or any non-urgent information.
          </Typography>
          <Box
            aria-live="polite"
            aria-atomic="true"
            sx={{
              p: 1.5,
              bgcolor: politeMessage
                ? alpha(theme.palette.info.main, 0.1)
                : alpha(theme.palette.grey[500], 0.05),
              borderRadius: 1,
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.3s',
            }}
          >
            <Typography variant="body2" fontFamily="monospace">
              {politeMessage || '(polite announcements appear here)'}
            </Typography>
          </Box>
        </Paper>

        {/* Assertive Region */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ErrorIcon color="warning" fontSize="small" />
            <Typography variant="subtitle2">
              aria-live="assertive"
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Interrupts the screen reader immediately. Use sparingly for urgent information
            like session timeouts or critical errors.
          </Typography>
          <Box
            aria-live="assertive"
            aria-atomic="true"
            sx={{
              p: 1.5,
              bgcolor: assertiveMessage
                ? alpha(theme.palette.warning.main, 0.1)
                : alpha(theme.palette.grey[500], 0.05),
              borderRadius: 1,
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.3s',
            }}
          >
            <Typography variant="body2" fontFamily="monospace">
              {assertiveMessage || '(assertive announcements appear here)'}
            </Typography>
          </Box>
        </Paper>

        {/* Alert Role */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ErrorIcon color="error" fontSize="small" />
            <Typography variant="subtitle2">
              role="alert"
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Implicitly assertive. The browser automatically announces content when it appears.
            Use for error messages that need immediate attention.
          </Typography>
          {alertMessage ? (
            <Alert severity="error" role="alert">
              {alertMessage}
            </Alert>
          ) : (
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.grey[500], 0.05),
                borderRadius: 1,
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                (alert messages appear here)
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Status Role */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <SuccessIcon color="success" fontSize="small" />
            <Typography variant="subtitle2">
              role="status"
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Implicitly polite. Used for status messages that don't require immediate attention,
            like save confirmations or progress updates.
          </Typography>
          {statusMessage ? (
            <Alert severity="success" role="status">
              {statusMessage}
            </Alert>
          ) : (
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.grey[500], 0.05),
                borderRadius: 1,
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                (status messages appear here)
              </Typography>
            </Box>
          )}
        </Paper>
      </Stack>

      {/* Announcement Log */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Announcement Log
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          When using a screen reader, these messages would be announced.
        </Typography>
        {announcementLog.length > 0 ? (
          <Stack spacing={0.5}>
            {announcementLog.map((log, index) => (
              <Typography key={index} variant="body2" fontFamily="monospace" fontSize="0.8rem">
                {log}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" fontFamily="monospace" color="text.secondary">
            Click buttons above to trigger announcements
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default LiveRegionDemo;

export const liveRegionCode = `// ARIA Live Region Patterns
// Polite: Waits for screen reader | Assertive: Interrupts
// role="alert": Implicitly assertive | role="status": Implicitly polite

// Polite region - for non-urgent updates
<Box
  aria-live="polite"
  aria-atomic="true" // Announce entire region content
>
  {message}
</Box>

// Assertive region - for urgent interruptions
<Box
  aria-live="assertive"
  aria-atomic="true"
>
  Session expires in 2 minutes
</Box>

// Alert role - for errors (implicitly assertive)
{hasError && (
  <Alert role="alert" severity="error">
    {errorMessage}
  </Alert>
)}

// Status role - for status updates (implicitly polite)
{saved && (
  <Alert role="status" severity="success">
    Changes saved successfully
  </Alert>
)}

// Usage example: Cart addition
const addToCart = () => {
  // Update cart state
  addItem(item);
  // This will be announced politely
  setCartMessage(\`\${item.name} added to cart\`);
};

// Usage example: Form error
const handleSubmit = () => {
  if (!isValid) {
    // This will interrupt and announce immediately
    setError('Please fix the errors above');
  }
};`;
