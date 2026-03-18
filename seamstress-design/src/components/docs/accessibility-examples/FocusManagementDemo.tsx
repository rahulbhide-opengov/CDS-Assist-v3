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
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ListItem {
  id: number;
  name: string;
}

/**
 * FocusManagementDemo - Demonstrates focus restoration patterns
 *
 * Demonstrates:
 * - Focus returns to trigger after modal closes
 * - Focus moves to next item after deletion
 * - Initial focus placement in modals
 */
export function FocusManagementDemo() {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, name: 'First Item' },
    { id: 2, name: 'Second Item' },
    { id: 3, name: 'Third Item' },
    { id: 4, name: 'Fourth Item' },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [focusLog, setFocusLog] = useState<string[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const addFocusLog = (message: string) => {
    setFocusLog(prev => [...prev.slice(-4), message]);
  };

  // Focus first input when modal opens
  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        modalInputRef.current?.focus();
        addFocusLog('Modal opened: Focus moved to first input');
      }, 100);
    }
  }, [modalOpen]);

  const handleModalClose = () => {
    setModalOpen(false);
    addFocusLog('Modal closed: Focus returning to trigger button');
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const handleDeleteItem = (id: number, index: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    addFocusLog(`Item deleted: Focus moving to ${index < items.length - 1 ? 'next' : 'previous'} item`);

    // Focus next item, or previous if at end
    setTimeout(() => {
      const nextIndex = index < items.length - 1 ? index : Math.max(0, index - 1);
      const remainingItems = items.filter(item => item.id !== id);
      if (remainingItems.length > 0) {
        const targetId = remainingItems[nextIndex]?.id;
        if (targetId) {
          itemRefs.current.get(targetId)?.focus();
        }
      }
    }, 0);
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: `New Item ${items.length + 1}` };
    setItems(prev => [...prev, newItem]);
    addFocusLog('Item added: Focus will move to new item');
    setTimeout(() => {
      itemRefs.current.get(newItem.id)?.focus();
    }, 0);
  };

  const resetItems = () => {
    setItems([
      { id: 1, name: 'First Item' },
      { id: 2, name: 'Second Item' },
      { id: 3, name: 'Third Item' },
      { id: 4, name: 'Fourth Item' },
    ]);
    setFocusLog([]);
    addFocusLog('Items reset');
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
        This demo shows proper focus management: focus returns to trigger after modal closes,
        and focus moves appropriately after list item deletion.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Modal Focus Return Demo */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            1. Modal Focus Return
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            When the modal closes, focus returns to this button.
          </Typography>
          <Button
            ref={triggerRef}
            variant="contained"
            onClick={() => setModalOpen(true)}
            onFocus={() => addFocusLog('Trigger button focused')}
            sx={focusIndicatorSx}
          >
            Open Modal
          </Button>
        </Paper>

        {/* List Deletion Focus Demo */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            2. Deletion Focus Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Delete items to see focus move to the next item.
          </Typography>

          {items.length > 0 ? (
            <List dense sx={{ bgcolor: alpha(theme.palette.grey[500], 0.05), borderRadius: 1 }}>
              {items.map((item, index) => (
                <ListItem
                  key={item.id}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) itemRefs.current.set(item.id, el);
                  }}
                  tabIndex={0}
                  onFocus={() => {
                    setSelectedItemId(item.id);
                    addFocusLog(`${item.name} focused`);
                  }}
                  secondaryAction={
                    <IconButton
                      size="small"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => handleDeleteItem(item.id, index)}
                      tabIndex={-1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: index < items.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    '&:focus-visible': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: -2,
                    },
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No items. Click "Add Item" to add one.
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button size="small" variant="outlined" onClick={handleAddItem} sx={focusIndicatorSx}>
              Add Item
            </Button>
            <Button size="small" variant="text" onClick={resetItems} sx={focusIndicatorSx}>
              Reset
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Focus Log */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Focus Event Log
        </Typography>
        {focusLog.length > 0 ? (
          <Stack spacing={0.5}>
            {focusLog.map((log, index) => (
              <Typography key={index} variant="body2" fontFamily="monospace" fontSize="0.8rem">
                {index + 1}. {log}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Interact with the demos to see focus events logged here.
          </Typography>
        )}
      </Paper>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={modalOpen}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 350,
              maxWidth: '90vw',
              p: 0,
              borderRadius: 1,
              outline: 'none',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-modal-title"
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography id="focus-modal-title" variant="h6" fontWeight={600}>
                Focus Demo Modal
              </Typography>
              <IconButton onClick={handleModalClose} size="small" aria-label="Close" sx={focusIndicatorSx}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Focus was automatically placed on the input below. When you close this modal,
                focus will return to the "Open Modal" button.
              </Typography>
              <TextField
                inputRef={modalInputRef}
                label="First focusable element"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Another field"
                size="small"
                fullWidth
              />
            </Box>
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button variant="text" onClick={handleModalClose} sx={focusIndicatorSx}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleModalClose} sx={focusIndicatorSx}>
                Save
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
}

export default FocusManagementDemo;

export const focusManagementCode = `// Focus Management Patterns
// 1. Return focus to trigger after modal closes
// 2. Move focus to next item after deletion

// Modal: Focus return to trigger
const triggerRef = useRef<HTMLButtonElement>(null);
const modalInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (modalOpen) {
    // Focus first input when modal opens
    modalInputRef.current?.focus();
  }
}, [modalOpen]);

const handleModalClose = () => {
  setModalOpen(false);
  // Return focus to trigger
  triggerRef.current?.focus();
};

// List: Focus management on deletion
const handleDeleteItem = (id, index) => {
  setItems(prev => prev.filter(item => item.id !== id));

  // Focus next item, or previous if at end
  const nextIndex = index < items.length - 1 ? index : index - 1;
  setTimeout(() => {
    itemRefs.current.get(items[nextIndex]?.id)?.focus();
  }, 0);
};

// Initial focus in modal
<Modal open={modalOpen} onClose={handleModalClose}>
  <TextField inputRef={modalInputRef} autoFocus />
</Modal>

// List with focus refs
{items.map((item, index) => (
  <ListItem
    ref={(el) => itemRefs.current.set(item.id, el)}
    tabIndex={0}
  >
    {item.name}
    <IconButton onClick={() => handleDeleteItem(item.id, index)}>
      <DeleteIcon />
    </IconButton>
  </ListItem>
))}`;
