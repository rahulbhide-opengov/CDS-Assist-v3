import React, { ReactNode, useRef, useEffect } from 'react';
import {
  Modal as MuiModal,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Paper,
  Divider,
  Fade,
  Backdrop,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { transitions } from '../../theme';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  destructiveAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  hideCloseButton?: boolean;
  disableBackdropClick?: boolean;
  contentPadding?: number | string;
  drawer?: ReactNode;
  drawerWidth?: number | string;
  splitView?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title = 'Modal Title',
  subtitle,
  children,
  size = 'small',
  primaryAction,
  secondaryAction,
  destructiveAction,
  hideCloseButton = false,
  disableBackdropClick = false,
  contentPadding = 2,
  drawer,
  drawerWidth = 240,
  splitView = false,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const titleId = ariaLabelledBy || 'modal-title';
  const descriptionId = ariaDescribedBy || 'modal-description';
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open && onClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  // Focus management - move focus to first focusable element when modal opens
  // and return focus to trigger element when modal closes
  useEffect(() => {
    if (open) {
      // Store the element that triggered the modal
      triggerRef.current = document.activeElement as HTMLElement;

      const timeoutId = setTimeout(() => {
        const focusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (focusable as HTMLElement)?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      // Return focus to the trigger element when modal closes
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        // Small delay to ensure modal is fully closed
        setTimeout(() => {
          triggerRef.current?.focus();
          triggerRef.current = null;
        }, 0);
      }
    }
  }, [open]);

  const handleClose = (_event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const getModalWidth = () => {
    switch (size) {
      case 'small':
        return 600;
      case 'medium':
        return 900;
      case 'large':
        return 1200;
      case 'fullscreen':
        return '100vw';
      default:
        return 600;
    }
  };

  const getModalHeight = () => {
    if (size === 'fullscreen') {
      return '100vh';
    }
    return 'auto';
  };

  const modalContent = (
    <Paper
      ref={modalRef}
      elevation={0}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: getModalWidth(),
        maxWidth: '90vw',
        height: getModalHeight(),
        maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
        minHeight: size === 'fullscreen' ? '100vh' : 570,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: size === 'fullscreen' ? 0 : 1,
        border: '1px solid',
        borderColor: 'rgba(224, 224, 224, 1)',
        overflow: 'hidden',
        outline: 0,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={subtitle ? descriptionId : undefined}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography
            id={titleId}
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              id={descriptionId}
              variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '14px',
                lineHeight: 1.43,
                letterSpacing: '0.17px',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
        {!hideCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="close"
            sx={{
              border: '1px solid',
              borderColor: 'rgba(84, 101, 116, 1)',
              borderRadius: 1,
              width: 32,
              height: 32,
              ml: 2,
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Left Content (or Main Content if no drawer) */}
        <Box
          sx={{
            flex: drawer && splitView ? '0 0 50%' : 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          {/* Content */}
          <Box
            sx={{
              flex: 1,
              p: contentPadding,
              backgroundColor: 'background.paper',
              overflowY: 'auto',
              '& .MuiInputBase-multiline': {
                width: '100%',
              },
            }}
          >
            {children}
          </Box>

          {/* Footer Actions - only show if no drawer */}
          {(primaryAction || secondaryAction || destructiveAction) && !drawer && (
            <>
              <Divider />
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  {destructiveAction && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={destructiveAction.onClick}
                      startIcon={destructiveAction.icon}
                    >
                      {destructiveAction.label}
                    </Button>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  {secondaryAction && (
                    <Button
                      variant="text"
                      onClick={secondaryAction.onClick}
                    >
                      {secondaryAction.label}
                    </Button>
                  )}
                  {primaryAction && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.disabled}
                    >
                      {primaryAction.label}
                    </Button>
                  )}
                </Stack>
              </Box>
            </>
          )}
        </Box>

        {/* Drawer/Split View */}
        {drawer && (
          <>
            <Divider orientation="vertical" />
            <Box
              sx={{
                width: splitView ? '50%' : drawerWidth,
                flexShrink: 0,
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: 1,
                borderColor: 'divider',
              }}
            >
              {/* Drawer Content */}
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: 'auto',
                }}
              >
                {drawer}
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Footer Actions - show at bottom when drawer is present */}
      {(primaryAction || secondaryAction || destructiveAction) && drawer && (
        <>
          <Divider />
          <Box
            sx={{
              backgroundColor: 'background.paper',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              {destructiveAction && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={destructiveAction.onClick}
                  startIcon={destructiveAction.icon}
                >
                  {destructiveAction.label}
                </Button>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              {secondaryAction && (
                <Button
                  variant="text"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </Button>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: transitions.components.modal.backdrop.timeout,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      <Fade in={open} timeout={transitions.getDuration(transitions.components.modal.content.timeout)}>
        {modalContent}
      </Fade>
    </MuiModal>
  );
};

export default Modal;