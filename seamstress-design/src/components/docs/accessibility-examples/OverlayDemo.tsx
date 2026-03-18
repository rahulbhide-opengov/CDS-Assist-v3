import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  IconButton,
  alpha,
  useTheme,
  Modal,
  Fade,
  Backdrop,
  Drawer,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * OverlayDemo - Demonstrates modal and drawer keyboard patterns
 *
 * Keyboard patterns:
 * - Tab: Navigate within overlay (focus trapped)
 * - Shift+Tab: Navigate backward (focus trapped)
 * - Esc: Close overlay
 * - Focus returns to trigger on close
 */
export function OverlayDemo() {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const modalFirstFocusRef = useRef<HTMLInputElement>(null);
  const drawerFirstFocusRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => modalFirstFocusRef.current?.focus(), 100);
      setLastAction('Modal opened - focus moved to first input');
    }
  }, [modalOpen]);

  // Focus first input when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => drawerFirstFocusRef.current?.focus(), 100);
      setLastAction('Drawer opened - focus moved to first input');
    }
  }, [drawerOpen]);

  const handleModalClose = () => {
    setModalOpen(false);
    setLastAction('Modal closed - focus returned to trigger');
    // Focus returns to trigger automatically by MUI
    setTimeout(() => modalTriggerRef.current?.focus(), 0);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setLastAction('Drawer closed - focus returned to trigger');
    setTimeout(() => drawerTriggerRef.current?.focus(), 0);
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
        Click buttons to open overlays. <strong>Tab</strong> is trapped within the overlay.{' '}
        <strong>Esc</strong> closes. Focus returns to the trigger button on close.
      </Typography>

      {/* Trigger buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          ref={modalTriggerRef}
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={focusIndicatorSx}
        >
          Open Modal
        </Button>
        <Button
          ref={drawerTriggerRef}
          variant="outlined"
          onClick={() => setDrawerOpen(true)}
          sx={focusIndicatorSx}
        >
          Open Drawer
        </Button>
      </Stack>

      {/* Focus trap explanation */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Focus Trapping
        </Typography>
        <Typography variant="body2">
          When a modal or drawer is open, pressing Tab will cycle through only the elements
          inside the overlay. This prevents keyboard users from accidentally interacting
          with content behind the overlay, which they cannot see.
        </Typography>
      </Paper>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={modalOpen}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              maxWidth: '90vw',
              p: 0,
              borderRadius: 1,
              outline: 'none',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography id="modal-title" variant="h6" fontWeight={600}>
                Modal Dialog
              </Typography>
              <IconButton
                onClick={handleModalClose}
                size="small"
                aria-label="Close modal"
                sx={focusIndicatorSx}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Press Tab to navigate within this modal. Focus is trapped here.
                Press Escape to close.
              </Typography>
              <Stack spacing={2}>
                <TextField
                  inputRef={modalFirstFocusRef}
                  label="First Name"
                  size="small"
                  fullWidth
                  autoFocus
                />
                <TextField
                  label="Last Name"
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Email"
                  size="small"
                  fullWidth
                />
              </Stack>
            </Box>

            {/* Modal Footer */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                variant="text"
                onClick={handleModalClose}
                sx={focusIndicatorSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleModalClose}
                sx={focusIndicatorSx}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <Box
          sx={{
            width: 350,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          {/* Drawer Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="drawer-title" variant="h6" fontWeight={600}>
              Drawer Panel
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              size="small"
              aria-label="Close drawer"
              sx={focusIndicatorSx}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Press Tab to navigate within this drawer. Focus is trapped here.
              Press Escape to close.
            </Typography>
            <Stack spacing={2}>
              <TextField
                inputRef={drawerFirstFocusRef}
                label="Search"
                size="small"
                fullWidth
              />
              <Button variant="outlined" fullWidth sx={focusIndicatorSx}>
                Option 1
              </Button>
              <Button variant="outlined" fullWidth sx={focusIndicatorSx}>
                Option 2
              </Button>
              <Button variant="outlined" fullWidth sx={focusIndicatorSx}>
                Option 3
              </Button>
            </Stack>
          </Box>

          {/* Drawer Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant="text"
              onClick={handleDrawerClose}
              sx={focusIndicatorSx}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleDrawerClose}
              sx={focusIndicatorSx}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Modal:</strong> {modalOpen ? 'Open' : 'Closed'}
          {' | '}
          <strong>Drawer:</strong> {drawerOpen ? 'Open' : 'Closed'}
          {lastAction && (
            <>
              {' | '}
              <strong>Action:</strong> {lastAction}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default OverlayDemo;

export const overlayDemoCode = `// Modal/Drawer Keyboard Patterns
// Tab: Navigate within (trapped) | Esc: Close
// Focus returns to trigger on close

const modalTriggerRef = useRef<HTMLButtonElement>(null);
const firstInputRef = useRef<HTMLInputElement>(null);

// Focus first input when modal opens
useEffect(() => {
  if (open) {
    firstInputRef.current?.focus();
  }
}, [open]);

// Return focus to trigger on close
const handleClose = () => {
  setOpen(false);
  modalTriggerRef.current?.focus();
};

<Button ref={modalTriggerRef} onClick={() => setOpen(true)}>
  Open Modal
</Button>

<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-title"
>
  <Paper role="dialog" aria-modal="true">
    <TextField inputRef={firstInputRef} autoFocus />
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleClose}>Save</Button>
  </Paper>
</Modal>`;
