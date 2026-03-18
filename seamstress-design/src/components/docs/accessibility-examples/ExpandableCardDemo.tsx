import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface Card {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
}

/**
 * ExpandableCardDemo - Demonstrates Enter/Esc pattern for navigating into/out of containers
 *
 * Keyboard patterns:
 * - Tab: Move between cards
 * - Enter: Enter card to access internal actions
 * - Tab (inside): Navigate within card
 * - Esc: Exit card and return focus to card container
 */
export function ExpandableCardDemo() {
  const theme = useTheme();
  const [cards, setCards] = useState<Card[]>([
    { id: 1, title: 'Project Alpha', description: 'Web application redesign', expanded: false },
    { id: 2, title: 'Project Beta', description: 'Mobile app development', expanded: false },
    { id: 3, title: 'Project Gamma', description: 'API integration project', expanded: false },
  ]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [focusedCardId, setFocusedCardId] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>('');
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const firstActionRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const enterCard = useCallback((cardId: number) => {
    setActiveCardId(cardId);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, expanded: true } : c));
    // Focus first action button
    setTimeout(() => {
      firstActionRefs.current.get(cardId)?.focus();
    }, 0);
    setLastAction(`Entered ${cards.find(c => c.id === cardId)?.title}`);
  }, [cards]);

  const exitCard = useCallback((cardId: number) => {
    setActiveCardId(null);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, expanded: false } : c));
    // Return focus to card
    cardRefs.current.get(cardId)?.focus();
    setLastAction(`Exited ${cards.find(c => c.id === cardId)?.title}`);
  }, [cards]);

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent, card: Card) => {
    if (activeCardId === card.id) {
      // Inside card - Esc exits
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        exitCard(card.id);
      }
    } else {
      // On card container
      if (e.key === 'Enter') {
        e.preventDefault();
        enterCard(card.id);
      }
    }
  }, [activeCardId, enterCard, exitCard]);

  const handleActionClick = (cardId: number, action: string) => {
    const card = cards.find(c => c.id === cardId);
    setLastAction(`${action} on ${card?.title}`);
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
        Use <strong>Tab</strong> to move between cards. Press <strong>Enter</strong> to expand and access
        card actions. <strong>Tab</strong> within to navigate actions. <strong>Esc</strong> to collapse and exit.
      </Typography>

      <Stack spacing={2}>
        {cards.map((card) => {
          const isActive = activeCardId === card.id;
          const isFocused = focusedCardId === card.id;

          return (
            <Paper
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardRefs.current.set(card.id, el);
              }}
              elevation={0}
              tabIndex={isActive ? -1 : 0}
              onKeyDown={(e) => handleCardKeyDown(e, card)}
              onFocus={() => !isActive && setFocusedCardId(card.id)}
              onBlur={() => setFocusedCardId(null)}
              role="region"
              aria-label={card.title}
              aria-expanded={card.expanded}
              sx={{
                border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isActive ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
                ...(!isActive && focusIndicatorSx),
              }}
            >
              {/* Card Header - always visible */}
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'transparent',
                  cursor: isActive ? 'default' : 'pointer',
                }}
                onClick={() => !isActive && enterCard(card.id)}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </Box>
                <ExpandIcon
                  sx={{
                    transform: card.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: 'text.secondary',
                  }}
                />
              </Box>

              {/* Card Actions - visible when expanded */}
              {card.expanded && (
                <Box
                  sx={{
                    p: 2,
                    pt: 0,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      exitCard(card.id);
                    }
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, mt: 1 }}>
                    Card Actions (press Esc to exit)
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      ref={(el: HTMLButtonElement | null) => {
                        if (el) firstActionRefs.current.set(card.id, el);
                      }}
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleActionClick(card.id, 'Edit')}
                      sx={focusIndicatorSx}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => handleActionClick(card.id, 'Share')}
                      sx={focusIndicatorSx}
                    >
                      Share
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleActionClick(card.id, 'Delete')}
                      sx={focusIndicatorSx}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          );
        })}
      </Stack>

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Active card:</strong> {activeCardId ? cards.find(c => c.id === activeCardId)?.title : 'None'}
          {' | '}
          <strong>Mode:</strong> {activeCardId ? 'Inside card (Tab to actions, Esc to exit)' : 'Card navigation (Enter to expand)'}
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

export default ExpandableCardDemo;

export const expandableCardCode = `// Expandable Card with Enter/Exit Pattern
// Enter: Expand and enter card | Tab: Navigate actions
// Esc: Collapse and exit card

const enterCard = (cardId) => {
  setActiveCardId(cardId);
  setExpanded(true);
  // Focus first action button
  firstActionRef.current?.focus();
};

const exitCard = (cardId) => {
  setActiveCardId(null);
  setExpanded(false);
  // Return focus to card container
  cardRef.current?.focus();
};

const handleCardKeyDown = (e, card) => {
  if (activeCardId === card.id) {
    // Inside card - Esc exits
    if (e.key === 'Escape') {
      exitCard(card.id);
    }
  } else {
    // On card container - Enter enters
    if (e.key === 'Enter') {
      enterCard(card.id);
    }
  }
};

<Paper
  ref={cardRef}
  tabIndex={isActive ? -1 : 0}
  onKeyDown={(e) => handleCardKeyDown(e, card)}
  aria-expanded={expanded}
>
  <CardHeader />
  {expanded && (
    <CardActions onKeyDown={(e) => e.key === 'Escape' && exitCard()}>
      <Button ref={firstActionRef}>Edit</Button>
      <Button>Share</Button>
    </CardActions>
  )}
</Paper>`;
