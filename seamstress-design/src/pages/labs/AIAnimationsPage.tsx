import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Slider,
  Chip,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  LightbulbOutlined as RecommendedIcon,
  Science as LabIcon,
} from '@mui/icons-material';
import { AiOgAssist } from '@opengov/react-capital-assets/icons';
import { BaseLayout } from '../../components/BaseLayout';
import { labsLayoutConfig } from '../../config/labsNavConfig';

// =============================================================================
// TYPES
// =============================================================================

type AnimationState = 'idle' | 'in' | 'loop' | 'out';

interface ScanConfig {
  sweepIn: number;      // seconds - sweep animation in
  sweepOut: number;     // seconds - sweep animation out
  outlineIn: number;    // seconds - outline/glow fade in
  outlineOut: number;   // seconds - outline/glow fade out
}

interface AIScanProps {
  state: AnimationState;
  config: ScanConfig;
  children: React.ReactNode;
}

// =============================================================================
// AI SCAN HIGHLIGHT COMPONENT
// =============================================================================

const AIScanHighlight: React.FC<AIScanProps> = ({ state, config, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isActive = state !== 'idle';

  // Measure the container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  // Calculate perimeter for stroke-dasharray (accounting for border-radius)
  const borderRadius = 4; // matches borderRadius: 1 in MUI (8px * 0.5)
  const offset = 4; // offset from content (like outlineOffset)
  const svgWidth = dimensions.width + offset * 2;
  const svgHeight = dimensions.height + offset * 2;
  const perimeter = 2 * (svgWidth + svgHeight) - 8 * borderRadius + 2 * Math.PI * borderRadius;

  // Determine the target stroke-dashoffset based on state
  const getStrokeDashoffset = () => {
    if (state === 'idle') return perimeter;
    if (state === 'in' || state === 'loop') return 0;
    if (state === 'out') return perimeter;
    return perimeter;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 10,
        display: 'inline-block',
      }}
    >
      {/* Inner container for content and sweep effect */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          boxShadow: isActive ? (theme) => `0 0 12px 2px ${theme.palette.primary.main}40` : 'none',
          transition: state === 'out'
            ? `box-shadow ${config.outlineOut}s ease-out`
            : `box-shadow ${config.outlineIn}s ease-out`,

          // Keyframes for sweep
          '@keyframes sweepIn': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes sweepLoop': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes sweepOut': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 0 },
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: (theme) => `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}30 50%, transparent 100%)`,
            opacity: isActive ? 1 : 0,
            pointerEvents: 'none',
            zIndex: 1,
            animation: state === 'in'
              ? `sweepIn ${config.sweepIn}s ease-out forwards`
              : state === 'loop'
              ? `sweepLoop 1.5s ease-in-out infinite`
              : state === 'out'
              ? `sweepOut ${config.sweepOut}s ease-out forwards`
              : 'none',
          },
        }}
      >
        {children}
      </Box>

      {/* SVG outline that draws in/out - positioned outside overflow:hidden container */}
      {dimensions.width > 0 && (
        <Box
          component="svg"
          sx={{
            position: 'absolute',
            top: -offset,
            left: -offset,
            width: svgWidth,
            height: svgHeight,
            pointerEvents: 'none',
            zIndex: 2,
            overflow: 'visible',
          }}
        >
          <Box
            component="rect"
            x={1}
            y={1}
            width={svgWidth - 2}
            height={svgHeight - 2}
            rx={borderRadius}
            ry={borderRadius}
            sx={{
              fill: 'none',
              stroke: (theme) => theme.palette.primary.main,
              strokeWidth: 2,
              strokeDasharray: perimeter,
              strokeDashoffset: getStrokeDashoffset(),
              transition: state === 'out'
                ? `stroke-dashoffset ${config.outlineOut}s ease-out`
                : state === 'in'
                ? `stroke-dashoffset ${config.outlineIn}s ease-out`
                : 'none',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// =============================================================================
// AI BUTTON WITH SCAN ANIMATION
// =============================================================================

interface AIButtonProps {
  state: AnimationState;
  config: ScanConfig;
  variant?: 'text' | 'contained' | 'outlined';
  children: React.ReactNode;
  onClick?: () => void;
}

const AIButton: React.FC<AIButtonProps> = ({
  state,
  config,
  variant = 'text',
  children,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isActive = state !== 'idle';
  const isContained = variant === 'contained';

  // Measure the button dimensions
  useEffect(() => {
    if (buttonRef.current) {
      const { offsetWidth, offsetHeight } = buttonRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  // Calculate perimeter for stroke-dasharray
  const borderRadius = 4;
  const offset = 4;
  const svgWidth = dimensions.width + offset * 2;
  const svgHeight = dimensions.height + offset * 2;
  const perimeter = 2 * (svgWidth + svgHeight) - 8 * borderRadius + 2 * Math.PI * borderRadius;

  const getStrokeDashoffset = () => {
    if (state === 'idle') return perimeter;
    if (state === 'in' || state === 'loop') return 0;
    if (state === 'out') return perimeter;
    return perimeter;
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button
        ref={buttonRef}
        variant={variant}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          boxShadow: isActive && !isContained
            ? (theme) => `0 0 12px 2px ${theme.palette.primary.main}40`
            : isActive && isContained
            ? '0 0 12px 2px rgba(255,255,255,0.3)'
            : 'none',
          transition: state === 'out'
            ? `box-shadow ${config.outlineOut}s ease-out`
            : `box-shadow ${config.outlineIn}s ease-out`,

          '@keyframes buttonSweepIn': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes buttonSweepLoop': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes buttonSweepOut': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 0 },
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: isContained
              ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)'
              : (theme) => `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}40 50%, transparent 100%)`,
            opacity: isActive ? 1 : 0,
            pointerEvents: 'none',
            zIndex: 1,
            animation: state === 'in'
              ? `buttonSweepIn ${config.sweepIn}s ease-out forwards`
              : state === 'loop'
              ? `buttonSweepLoop 1.5s ease-in-out infinite`
              : state === 'out'
              ? `buttonSweepOut ${config.sweepOut}s ease-out forwards`
              : 'none',
          },
        }}
      >
        {children}
      </Button>

      {/* SVG outline that draws in/out */}
      {dimensions.width > 0 && !isContained && (
        <Box
          component="svg"
          sx={{
            position: 'absolute',
            top: -offset,
            left: -offset,
            width: svgWidth,
            height: svgHeight,
            pointerEvents: 'none',
            zIndex: 2,
            overflow: 'visible',
          }}
        >
          <Box
            component="rect"
            x={1}
            y={1}
            width={svgWidth - 2}
            height={svgHeight - 2}
            rx={borderRadius}
            ry={borderRadius}
            sx={{
              fill: 'none',
              stroke: (theme) => theme.palette.primary.main,
              strokeWidth: 2,
              strokeDasharray: perimeter,
              strokeDashoffset: getStrokeDashoffset(),
              transition: state === 'out'
                ? `stroke-dashoffset ${config.outlineOut}s ease-out`
                : state === 'in'
                ? `stroke-dashoffset ${config.outlineIn}s ease-out`
                : 'none',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// =============================================================================
// AI TEXT HIGHLIGHT
// =============================================================================

interface AITextHighlightProps {
  state: AnimationState;
  config: ScanConfig;
  children: React.ReactNode;
}

const AITextHighlight: React.FC<AITextHighlightProps> = ({ state, config, children }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });
  const isActive = state !== 'idle';

  // Measure the text dimensions using getBoundingClientRect for accuracy
  useEffect(() => {
    if (textRef.current) {
      const bounds = textRef.current.getBoundingClientRect();
      setRect({ width: bounds.width, height: bounds.height });
    }
  }, [children]);

  // Calculate perimeter for stroke-dasharray
  const borderRadius = 2;
  const offset = 2;
  const svgWidth = rect.width + offset * 2;
  const svgHeight = rect.height + offset * 2;
  const perimeter = 2 * (svgWidth + svgHeight) - 8 * borderRadius + 2 * Math.PI * borderRadius;

  const getStrokeDashoffset = () => {
    if (state === 'idle') return perimeter;
    if (state === 'in' || state === 'loop') return 0;
    if (state === 'out') return perimeter;
    return perimeter;
  };

  return (
    <Box
      component="span"
      ref={textRef}
      sx={{
        position: 'relative',
        borderRadius: '2px',
        px: 0.25,
        boxShadow: isActive ? (theme) => `0 0 8px 1px ${theme.palette.primary.main}40` : 'none',
        transition: state === 'out'
          ? `box-shadow ${config.outlineOut}s ease-out`
          : `box-shadow ${config.outlineIn}s ease-out`,

        // Use background with gradient and animate position
        backgroundImage: (theme) =>
          `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}25 50%, transparent 100%)`,
        backgroundSize: '200% 100%',
        backgroundPosition: state === 'idle' ? '-100% 0' : state === 'out' ? '200% 0' : '100% 0',
        backgroundRepeat: 'no-repeat',

        '@keyframes textSweepIn': {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '100% 0' },
        },
        '@keyframes textSweepLoop': {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        '@keyframes textSweepOut': {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },

        animation: state === 'in'
          ? `textSweepIn ${config.sweepIn}s ease-out forwards`
          : state === 'loop'
          ? `textSweepLoop 1.5s ease-in-out infinite`
          : state === 'out'
          ? `textSweepOut ${config.sweepOut}s ease-out forwards`
          : 'none',
      }}
    >
      {children}

      {/* SVG outline that draws in/out */}
      {rect.width > 0 && (
        <Box
          component="svg"
          sx={{
            position: 'absolute',
            top: -offset,
            left: -offset,
            width: svgWidth,
            height: svgHeight,
            pointerEvents: 'none',
            zIndex: 2,
            overflow: 'visible',
          }}
        >
          <Box
            component="rect"
            x={1}
            y={1}
            width={svgWidth - 2}
            height={svgHeight - 2}
            rx={borderRadius}
            ry={borderRadius}
            sx={{
              fill: 'none',
              stroke: (theme) => theme.palette.primary.main,
              strokeWidth: 2,
              strokeDasharray: perimeter,
              strokeDashoffset: getStrokeDashoffset(),
              transition: state === 'out'
                ? `stroke-dashoffset ${config.outlineOut}s ease-out`
                : state === 'in'
                ? `stroke-dashoffset ${config.outlineIn}s ease-out`
                : 'none',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

const DemoCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <Card variant="outlined" sx={{ minWidth: 180 }}>
    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Typography variant="caption" color="text.secondary">{title}</Typography>
      <Typography variant="body1" fontWeight={600} fontSize="1.25rem" color="primary.main">{value}</Typography>
    </CardContent>
  </Card>
);

const DemoTable: React.FC = () => (
  <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 350 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="right">Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow><TableCell>Work Orders</TableCell><TableCell align="right">142</TableCell></TableRow>
        <TableRow><TableCell>Pending</TableCell><TableCell align="right">23</TableCell></TableRow>
        <TableRow><TableCell>Completed</TableCell><TableCell align="right">119</TableCell></TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

// =============================================================================
// STATE INDICATOR
// =============================================================================

const StateIndicator: React.FC<{ state: AnimationState }> = ({ state }) => {
  const colors: Record<AnimationState, string> = {
    idle: 'default',
    in: 'info',
    loop: 'success',
    out: 'warning',
  };

  return (
    <Chip
      label={state.toUpperCase()}
      color={colors[state] as any}
      size="small"
      sx={{ minWidth: 60, fontWeight: 600 }}
    />
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AIAnimationsPage: React.FC = () => {
  const [config, setConfig] = useState<ScanConfig>({
    sweepIn: 1.1,
    sweepOut: 1.1,
    outlineIn: 1.1,
    outlineOut: 1.1,
  });

  // Loop duration for full cycle (in seconds)
  const [loopDuration, setLoopDuration] = useState(3);

  // Pause between loops (in seconds)
  const [pauseBetweenLoops, setPauseBetweenLoops] = useState(5);

  // Continuous looping state
  const [isLooping, setIsLooping] = useState(false);
  const loopingRef = useRef(false);

  // Demo states
  const [buttonState, setButtonState] = useState<AnimationState>('idle');
  const [cardState, setCardState] = useState<AnimationState>('idle');
  const [tableState, setTableState] = useState<AnimationState>('idle');
  const [textState, setTextState] = useState<AnimationState>('idle');

  // State transition helper
  const triggerState = useCallback((
    setter: React.Dispatch<React.SetStateAction<AnimationState>>,
    targetState: AnimationState
  ) => {
    setter(targetState);

    // Auto-transition to idle after 'out' completes
    if (targetState === 'out') {
      const outDuration = Math.max(config.sweepOut, config.outlineOut);
      setTimeout(() => setter('idle'), outDuration * 1000 + 100);
    }
  }, [config.sweepOut, config.outlineOut]);

  // Full cycle demo: in -> loop -> out -> idle
  const runFullCycle = useCallback((setter: React.Dispatch<React.SetStateAction<AnimationState>>) => {
    const inDuration = Math.max(config.sweepIn, config.outlineIn);
    const outDuration = Math.max(config.sweepOut, config.outlineOut);
    const loopMs = loopDuration * 1000;
    setter('in');
    setTimeout(() => setter('loop'), inDuration * 1000);
    setTimeout(() => setter('out'), inDuration * 1000 + loopMs);
    setTimeout(() => setter('idle'), inDuration * 1000 + loopMs + outDuration * 1000 + 100);

    // Return total cycle duration for continuous looping
    return inDuration * 1000 + loopMs + outDuration * 1000 + 100;
  }, [config, loopDuration]);

  // Continuous looping effect
  useEffect(() => {
    loopingRef.current = isLooping;

    if (!isLooping) return;

    let timeoutId: NodeJS.Timeout;

    const runContinuousLoop = () => {
      if (!loopingRef.current) return;

      const cycleDuration = runFullCycle(setButtonState);
      runFullCycle(setCardState);
      runFullCycle(setTextState);

      // Schedule next cycle after current cycle + pause
      timeoutId = setTimeout(() => {
        if (loopingRef.current) {
          runContinuousLoop();
        }
      }, cycleDuration + pauseBetweenLoops * 1000);
    };

    runContinuousLoop();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLooping, runFullCycle, pauseBetweenLoops]);

  // Stop looping handler
  const toggleLooping = useCallback(() => {
    if (isLooping) {
      setIsLooping(false);
      // Reset all states to idle
      setButtonState('idle');
      setCardState('idle');
      setTextState('idle');
    } else {
      setIsLooping(true);
    }
  }, [isLooping]);

  return (
    <BaseLayout config={labsLayoutConfig}>
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2, flexShrink: 0 }}>
          <AIIcon sx={{ fontSize: 40, color: 'primary.main', mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={600}>AI Scan Animation</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Simple state-based animation: idle → in → loop → out → idle
            </Typography>
          </Box>
          <Chip icon={<LabIcon />} label="Experiment" color="primary" variant="outlined" />
        </Box>

        {/* Concept */}
        <Alert severity="info" icon={<RecommendedIcon />} sx={{ mb: 4, borderRadius: 2, flexShrink: 0 }}>
          <Typography variant="subtitle2" fontWeight={600}>Three Animation States</Typography>
          <Typography variant="body2">
            <strong>In:</strong> Sweep enters and highlight appears •
            <strong> Loop:</strong> Continuous sweep while AI is "thinking" •
            <strong> Out:</strong> Sweep exits and highlight fades
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 4, flex: 1, minHeight: 0 }}>
          {/* Controls */}
          <Paper sx={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 3, overflow: 'auto', flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Sweep Timing
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Sweep In: {config.sweepIn}s
              </Typography>
              <Slider
                value={config.sweepIn}
                onChange={(_, v) => setConfig(c => ({ ...c, sweepIn: v as number }))}
                min={0.5}
                max={2}
                step={0.2}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Sweep Out: {config.sweepOut}s
              </Typography>
              <Slider
                value={config.sweepOut}
                onChange={(_, v) => setConfig(c => ({ ...c, sweepOut: v as number }))}
                min={0.5}
                max={2}
                step={0.2}
                size="small"
              />
            </Box>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Outline Timing
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Outline In: {config.outlineIn}s
              </Typography>
              <Slider
                value={config.outlineIn}
                onChange={(_, v) => setConfig(c => ({ ...c, outlineIn: v as number }))}
                min={0.5}
                max={2}
                step={0.2}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Outline Out: {config.outlineOut}s
              </Typography>
              <Slider
                value={config.outlineOut}
                onChange={(_, v) => setConfig(c => ({ ...c, outlineOut: v as number }))}
                min={0.5}
                max={2}
                step={0.2}
                size="small"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Beacon Mode
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Continuous animation cycle to draw user attention
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Loop Duration: {loopDuration}s
              </Typography>
              <Slider
                value={loopDuration}
                onChange={(_, v) => setLoopDuration(v as number)}
                min={1}
                max={10}
                step={0.5}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Pause Between Cycles: {pauseBetweenLoops}s
              </Typography>
              <Slider
                value={pauseBetweenLoops}
                onChange={(_, v) => setPauseBetweenLoops(v as number)}
                min={1}
                max={10}
                step={0.5}
                size="small"
              />
            </Box>

            <Button
              fullWidth
              variant={isLooping ? 'contained' : 'outlined'}
              color={isLooping ? 'error' : 'primary'}
              onClick={toggleLooping}
              sx={{ mb: 1 }}
            >
              {isLooping ? 'Stop Beacon' : 'Start Beacon Mode'}
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Button Demo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">State:</Typography>
              <StateIndicator state={buttonState} />
            </Box>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Button size="small" variant="outlined" onClick={() => triggerState(setButtonState, 'in')}>
                Animate In
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setButtonState, 'loop')}>
                Start Loop
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setButtonState, 'out')}>
                Animate Out
              </Button>
              <Button size="small" variant="contained" onClick={() => runFullCycle(setButtonState)}>
                Run Full Cycle
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Card Demo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">State:</Typography>
              <StateIndicator state={cardState} />
            </Box>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Button size="small" variant="outlined" onClick={() => triggerState(setCardState, 'in')}>
                Animate In
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setCardState, 'loop')}>
                Start Loop
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setCardState, 'out')}>
                Animate Out
              </Button>
              <Button size="small" variant="contained" onClick={() => runFullCycle(setCardState)}>
                Run Full Cycle
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Text Demo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">State:</Typography>
              <StateIndicator state={textState} />
            </Box>
            <Stack spacing={1}>
              <Button size="small" variant="outlined" onClick={() => triggerState(setTextState, 'in')}>
                Animate In
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setTextState, 'loop')}>
                Start Loop
              </Button>
              <Button size="small" variant="outlined" onClick={() => triggerState(setTextState, 'out')}>
                Animate Out
              </Button>
              <Button size="small" variant="contained" onClick={() => runFullCycle(setTextState)}>
                Run Full Cycle
              </Button>
            </Stack>
            </Box>
          </Paper>

          {/* Preview */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {/* Buttons */}
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
                AI Button Animations
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <AIButton state={buttonState} config={config} variant="text">
                  <AiOgAssist style={{ marginRight: 8 }} />
                  Assistants
                </AIButton>
                <AIButton state={buttonState} config={config} variant="contained">
                  <AiOgAssist style={{ marginRight: 8 }} />
                  AI Analysis
                </AIButton>
                <AIButton state={buttonState} config={config} variant="outlined">
                  Generate Report
                </AIButton>
              </Box>
            </Paper>

            {/* Cards & Table */}
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
                Page Content Highlights
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <AIScanHighlight state={cardState} config={config}>
                  <DemoCard title="Total Work Orders" value="142" />
                </AIScanHighlight>
                <AIScanHighlight state={cardState} config={config}>
                  <DemoCard title="Completion Rate" value="84%" />
                </AIScanHighlight>
              </Box>
              <AIScanHighlight state={tableState} config={config}>
                <DemoTable />
              </AIScanHighlight>
              <Box sx={{ mt: 2 }}>
                <Button size="small" variant="outlined" onClick={() => runFullCycle(setTableState)}>
                  Highlight Table
                </Button>
              </Box>
            </Paper>

            {/* Text */}
            <Paper sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
                Inline Text Highlighting
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  The city's <AITextHighlight state={textState} config={config}>infrastructure budget</AITextHighlight> for
                  Q4 shows a significant increase in maintenance costs compared
                  to the previous quarter. The Public Works Department has
                  identified several aging assets that require immediate attention.
                </Typography>
              </Paper>
            </Paper>

            {/* Usage */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Usage
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace', fontSize: 13 }}>
                <pre style={{ margin: 0 }}>{`import {
  AIScanHighlight,
  BEACON_CONFIG,
  BEACON_LOOP_DURATION,
  BEACON_PAUSE_DURATION,
} from '@/components/ai/AIScanHighlight';

// State: 'idle' | 'in' | 'loop' | 'out'
const [state, setState] = useState<AnimationState>('idle');

// Single highlight cycle
setState('in');    // Animate in (1.1s)
setState('loop');  // Start looping (1.5s per sweep)
setState('out');   // Animate out (1.1s)

// Beacon Mode - continuous cycle to draw attention
// Timing: 1.1s in → 3s loop → 1.1s out → 5s pause → repeat
<AIScanHighlight
  state={state}
  config={BEACON_CONFIG}  // 1.1s transitions
>
  <YourContent />
</AIScanHighlight>`}</pre>
              </Paper>
            </Paper>
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
};

export default AIAnimationsPage;
