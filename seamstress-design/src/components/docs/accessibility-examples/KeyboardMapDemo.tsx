import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Stack, Tooltip, alpha, useTheme } from '@mui/material';
import {
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
  Place as MarkerIcon,
  MyLocation as CenterIcon,
} from '@mui/icons-material';

/**
 * KeyboardMapDemo - Demonstrates map navigation with keyboard
 *
 * Keyboard patterns:
 * - Arrow keys: Pan map
 * - +/-: Zoom in/out
 * - Tab: Navigate between markers
 * - Enter: Open marker popup
 * - Esc: Close popup
 */
export function KeyboardMapDemo() {
  const theme = useTheme();
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Center of viewbox
  const [zoom, setZoom] = useState(1);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [focusedMarker, setFocusedMarker] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const markers = [
    { id: 1, x: 30, y: 30, label: 'City Hall', info: 'Main government building' },
    { id: 2, x: 70, y: 25, label: 'Central Park', info: 'Large urban park' },
    { id: 3, x: 50, y: 60, label: 'Library', info: 'Public library branch' },
    { id: 4, x: 20, y: 70, label: 'Hospital', info: 'Regional medical center' },
  ];

  const PAN_STEP = 10;
  const ZOOM_STEP = 0.2;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2;

  const handleMapKeyDown = useCallback((e: React.KeyboardEvent) => {
    let handled = true;

    switch (e.key) {
      case 'ArrowUp':
        setPosition(p => ({ ...p, y: Math.max(0, p.y - PAN_STEP) }));
        setLastAction('Panned up');
        break;
      case 'ArrowDown':
        setPosition(p => ({ ...p, y: Math.min(100, p.y + PAN_STEP) }));
        setLastAction('Panned down');
        break;
      case 'ArrowLeft':
        setPosition(p => ({ ...p, x: Math.max(0, p.x - PAN_STEP) }));
        setLastAction('Panned left');
        break;
      case 'ArrowRight':
        setPosition(p => ({ ...p, x: Math.min(100, p.x + PAN_STEP) }));
        setLastAction('Panned right');
        break;
      case '+':
      case '=':
        setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
        setLastAction('Zoomed in');
        break;
      case '-':
      case '_':
        setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP));
        setLastAction('Zoomed out');
        break;
      case 'Escape':
        setSelectedMarker(null);
        setLastAction('Closed popup');
        mapRef.current?.focus();
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  }, []);

  const handleMarkerKeyDown = (e: React.KeyboardEvent, markerId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedMarker(selectedMarker === markerId ? null : markerId);
      setLastAction(`${selectedMarker === markerId ? 'Closed' : 'Opened'} marker popup`);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSelectedMarker(null);
      setLastAction('Closed popup');
    }
  };

  const handleZoomIn = () => {
    setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
    setLastAction('Zoomed in');
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP));
    setLastAction('Zoomed out');
  };

  const handleCenter = () => {
    setPosition({ x: 50, y: 50 });
    setZoom(1);
    setLastAction('Centered map');
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
        Focus the map and use <strong>Arrow keys</strong> to pan, <strong>+/-</strong> to zoom.
        <strong>Tab</strong> to markers, <strong>Enter</strong> to open popup, <strong>Esc</strong> to close.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Map container */}
        <Box
          ref={mapRef}
          tabIndex={0}
          onKeyDown={handleMapKeyDown}
          role="application"
          aria-label="Interactive map. Use arrow keys to pan, plus and minus to zoom."
          sx={{
            flex: 1,
            height: 300,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `2px solid ${theme.palette.divider}`,
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'move',
            ...focusIndicatorSx,
          }}
        >
          {/* Map content layer */}
          <Box
            sx={{
              position: 'absolute',
              width: '200%',
              height: '200%',
              left: `${50 - position.x}%`,
              top: `${50 - position.y}%`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.1s, left 0.1s, top 0.1s',
            }}
          >
            {/* Grid lines for visual reference */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(${alpha(theme.palette.divider, 0.3)} 1px, transparent 1px),
                  linear-gradient(90deg, ${alpha(theme.palette.divider, 0.3)} 1px, transparent 1px)
                `,
                backgroundSize: '10% 10%',
              }}
            />

            {/* Markers */}
            {markers.map(marker => (
              <Tooltip
                key={marker.id}
                title={selectedMarker === marker.id ? '' : marker.label}
                placement="top"
              >
                <IconButton
                  ref={(el: HTMLButtonElement | null) => {
                    if (el) markerRefs.current.set(marker.id, el);
                  }}
                  onKeyDown={(e) => handleMarkerKeyDown(e, marker.id)}
                  onFocus={() => setFocusedMarker(marker.id)}
                  onBlur={() => setFocusedMarker(null)}
                  onClick={() => {
                    setSelectedMarker(selectedMarker === marker.id ? null : marker.id);
                    setLastAction(`${selectedMarker === marker.id ? 'Closed' : 'Opened'} ${marker.label}`);
                  }}
                  aria-label={marker.label}
                  aria-expanded={selectedMarker === marker.id}
                  sx={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -50%)',
                    color: selectedMarker === marker.id ? 'primary.main' : 'error.main',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'background.paper',
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    },
                    ...focusIndicatorSx,
                  }}
                >
                  <MarkerIcon />
                </IconButton>
              </Tooltip>
            ))}

            {/* Popup for selected marker */}
            {selectedMarker && (() => {
              const marker = markers.find(m => m.id === selectedMarker);
              if (!marker) return null;
              return (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: `${marker.y - 8}%`,
                    transform: 'translate(-50%, -100%)',
                    p: 1.5,
                    minWidth: 150,
                    zIndex: 10,
                  }}
                  role="dialog"
                  aria-label={`${marker.label} details`}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {marker.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {marker.info}
                  </Typography>
                </Paper>
              );
            })()}
          </Box>

          {/* Zoom level indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              fontSize: '0.75rem',
            }}
          >
            Zoom: {Math.round(zoom * 100)}%
          </Box>
        </Box>

        {/* Controls */}
        <Stack spacing={1} sx={{ alignSelf: 'flex-start' }}>
          <IconButton
            onClick={handleZoomIn}
            aria-label="Zoom in"
            sx={{ border: `1px solid ${theme.palette.divider}`, ...focusIndicatorSx }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            aria-label="Zoom out"
            sx={{ border: `1px solid ${theme.palette.divider}`, ...focusIndicatorSx }}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            onClick={handleCenter}
            aria-label="Center map"
            sx={{ border: `1px solid ${theme.palette.divider}`, ...focusIndicatorSx }}
          >
            <CenterIcon />
          </IconButton>
        </Stack>
      </Box>

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
          <strong>Position:</strong> ({Math.round(position.x)}, {Math.round(position.y)})
          {' | '}
          <strong>Zoom:</strong> {Math.round(zoom * 100)}%
          {focusedMarker && (
            <>
              {' | '}
              <strong>Focused marker:</strong> {markers.find(m => m.id === focusedMarker)?.label}
            </>
          )}
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

export default KeyboardMapDemo;

export const keyboardMapCode = `// Map Navigation with Keyboard
// Arrow keys: Pan | +/-: Zoom | Tab: Navigate markers
// Enter: Open popup | Esc: Close popup

const handleMapKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      setPosition(p => ({ ...p, y: p.y - PAN_STEP }));
      break;
    case 'ArrowDown':
      setPosition(p => ({ ...p, y: p.y + PAN_STEP }));
      break;
    case 'ArrowLeft':
      setPosition(p => ({ ...p, x: p.x - PAN_STEP }));
      break;
    case 'ArrowRight':
      setPosition(p => ({ ...p, x: p.x + PAN_STEP }));
      break;
    case '+':
      setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
      break;
    case '-':
      setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP));
      break;
    case 'Escape':
      setSelectedMarker(null);
      break;
  }
  e.preventDefault();
};

<Box
  role="application"
  tabIndex={0}
  onKeyDown={handleMapKeyDown}
  aria-label="Interactive map. Use arrow keys to pan."
>
  {markers.map(marker => (
    <IconButton
      key={marker.id}
      onKeyDown={(e) => handleMarkerKeyDown(e, marker.id)}
      aria-label={marker.label}
      aria-expanded={selectedMarker === marker.id}
    >
      <MarkerIcon />
    </IconButton>
  ))}
</Box>`;
