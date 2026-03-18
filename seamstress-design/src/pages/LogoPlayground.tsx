import { useState, useEffect, useRef } from 'react';
import { colorTokens } from '../theme/cds/tokens';
import { motion, useAnimation } from 'framer-motion';
import {
  Box,
  Stack,
  Typography,
  Select,
  MenuItem,
  Slider,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  ContentCopy,
  RestartAlt,
} from '@mui/icons-material';

type AnimationAlgorithm =
  | 'kaleidoscope'
  | 'threading'
  | 'deconstruction'
  | 'breathing'
  | 'morph'
  | 'stitch'
  | 'flashingFills';

type EasingFunction = 'linear' | 'easeInOut' | 'sine' | 'cubic';

interface AnimationState {
  algorithm: AnimationAlgorithm;
  speed: number;
  easing: EasingFunction;
  isPlaying: boolean;
  progress: number;
}

const LOGO_PATHS = {
  triangle: 'M0.5 150L75.5 0.727539V150',
  zigzag: 'M20.6 150H150.5L0.5 75.3501H150.5L0.5 150H130.41',
  border: 'M150.5 0.709961H0.5V150.01H150.5V0.709961Z',
  radial:
    'M0.5 75.35L150.5 0.709961M150.5 0.709961L75.4999 150M150.5 0.709961H75.5M0.5 0.709961L150.5 75.35M0.5 0.709961L75.4999 150M0.5 0.709961H75.5M75.4999 150L75.5 0.709961M75.5 0.709961L150.5 150',
};

// Define regions for flashing fills - CDS Design System palette
const FILL_REGIONS = [
  { d: 'M0.5 0.709961 L75.5 0.727539 L0.5 75.35 Z', color: colorTokens.success.main },
  { d: 'M75.5 0.709961 L150.5 0.709961 L150.5 75.35 Z', color: colorTokens.error.main },
  { d: 'M0.5 75.35 L37.5 37.5 L75.5 75.35 L37.5 113 Z', color: colorTokens.info.main },
  { d: 'M75.5 75.35 L113 37.5 L150.5 75.35 L113 113 Z', color: colorTokens.warning.main },
  { d: 'M0.5 75.35 L0.5 150 L75.5 75.35 Z', color: colorTokens.primary[400] },
  { d: 'M75.5 75.35 L150.5 75.35 L150.5 150 Z', color: colorTokens.secondary.main },
  { d: 'M0.5 150 L75.5 0.727539 L75.5 150 Z', color: colorTokens.primary.main },
  { d: 'M75.5 0.709961 L150.5 150 L75.5 150 Z', color: colorTokens.primary[400] },
  { d: 'M37.5 37.5 L75.5 0.727539 L113 37.5 Z', color: colorTokens.primary[200] },
  { d: 'M37.5 113 L75.5 150 L113 113 L75.5 75.35 Z', color: colorTokens.primary.dark },
  { d: 'M0.5 75.35 L20.6 75.35 L10.5 100 Z', color: colorTokens.primary.main },
  { d: 'M130.41 75.35 L150.5 75.35 L140 100 Z', color: colorTokens.warning.main },
];

const CENTER = { x: 75.5, y: 75.5 };

const ALGORITHMS = [
  { value: 'kaleidoscope', label: 'Kaleidoscope Rotation' },
  { value: 'threading', label: 'Threading/Sewing' },
  { value: 'deconstruction', label: 'Geometric Deconstruction' },
  { value: 'breathing', label: 'Breathing/Pulsing' },
  { value: 'morph', label: 'Path Morph' },
  { value: 'stitch', label: 'Stitch Pattern' },
  { value: 'flashingFills', label: 'Flashing Fills' },
] as const;

const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  sine: (t: number) => (1 - Math.cos(2 * Math.PI * t)) / 2,
  cubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export default function LogoPlayground() {
  const [state, setState] = useState<AnimationState>({
    algorithm: 'kaleidoscope',
    speed: 1,
    easing: 'sine',
    isPlaying: true,
    progress: 0,
  });

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!state.isPlaying) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 4000 / state.speed; // 4 seconds base duration
      const rawProgress = (elapsed % duration) / duration;
      const easedProgress = EASING_FUNCTIONS[state.easing](rawProgress);

      setState((prev) => ({ ...prev, progress: easedProgress }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.speed, state.easing]);

  const getPathAnimation = (pathKey: keyof typeof LOGO_PATHS) => {
    const t = state.progress;

    switch (state.algorithm) {
      case 'kaleidoscope': {
        const speeds = { triangle: 1, zigzag: 1.5, border: 0.5, radial: 2 };
        const rotation = 360 * t * speeds[pathKey];
        return {
          transform: `rotate(${rotation} ${CENTER.x} ${CENTER.y})`,
          strokeDasharray: undefined,
          strokeDashoffset: undefined,
          opacity: 1,
        };
      }

      case 'threading': {
        if (pathKey === 'zigzag' || pathKey === 'border') {
          const pathLength = pathKey === 'zigzag' ? 550 : 600;
          const offset = pathLength * (1 - t * 2);
          return {
            transform: undefined,
            strokeDasharray: '2 2',
            strokeDashoffset: offset,
            opacity: 1,
          };
        }
        return {
          transform: undefined,
          strokeDasharray: undefined,
          strokeDashoffset: undefined,
          opacity: 1,
        };
      }

      case 'deconstruction': {
        const phase = t < 0.25 ? t * 4 : t < 0.5 ? 1 : t < 0.75 ? (0.75 - t) * 4 : 0;
        const distance = 50 * Math.sin(Math.PI * phase);
        const rotations = { triangle: 180, zigzag: 90, border: 45, radial: 270 };
        const rotation = rotations[pathKey] * phase;

        const offsets = {
          triangle: { x: -1, y: 0 },
          zigzag: { x: 0, y: 1 },
          border: { x: 1, y: 1 },
          radial: { x: 0, y: -1 },
        };

        const tx = offsets[pathKey].x * distance;
        const ty = offsets[pathKey].y * distance;

        return {
          transform: `translate(${tx} ${ty}) rotate(${rotation} ${CENTER.x} ${CENTER.y})`,
          strokeDasharray: pathKey === 'zigzag' || pathKey === 'border' ? '2 2' : undefined,
          strokeDashoffset: undefined,
          opacity: 1,
        };
      }

      case 'breathing': {
        const phases = { triangle: 0, zigzag: Math.PI / 2, border: Math.PI, radial: (3 * Math.PI) / 2 };
        const scale = 1 + 0.15 * Math.sin(2 * Math.PI * t + phases[pathKey]);
        return {
          transform: `translate(${CENTER.x} ${CENTER.y}) scale(${scale}) translate(${-CENTER.x} ${-CENTER.y})`,
          strokeDasharray: pathKey === 'zigzag' || pathKey === 'border' ? '2 2' : undefined,
          strokeDashoffset: undefined,
          opacity: 1,
        };
      }

      case 'morph': {
        const phase = Math.floor(t * 4);
        const targetPhase = { triangle: 0, zigzag: 1, border: 2, radial: 3 }[pathKey];
        const opacity = phase === targetPhase ? 1 : 0.3;
        return {
          transform: undefined,
          strokeDasharray: pathKey === 'zigzag' || pathKey === 'border' ? '2 2' : undefined,
          strokeDashoffset: undefined,
          opacity,
        };
      }

      case 'stitch': {
        const totalSegments = 8;
        const visibleSegments = Math.floor(t * totalSegments * 2) % totalSegments;
        const segmentLength = 150;
        const dashArray = `${segmentLength} ${segmentLength}`;
        const dashOffset = -(visibleSegments * segmentLength);
        return {
          transform: undefined,
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          opacity: 1,
        };
      }

      default:
        return {
          transform: undefined,
          strokeDasharray: pathKey === 'zigzag' || pathKey === 'border' ? '2 2' : undefined,
          strokeDashoffset: undefined,
          opacity: 1,
        };
    }
  };

  const handlePlayPause = () => {
    if (!state.isPlaying) {
      startTimeRef.current = Date.now() - state.progress * (4000 / state.speed);
    }
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleReset = () => {
    startTimeRef.current = Date.now();
    setState((prev) => ({ ...prev, progress: 0 }));
  };

  const exportAnimation = () => {
    const code = `/* ${ALGORITHMS.find((a) => a.value === state.algorithm)?.label} */
animation: logo-${state.algorithm} ${4 / state.speed}s ${state.easing} infinite;

@keyframes logo-${state.algorithm} {
  0%, 100% { transform: /* initial state */; }
  50% { transform: /* transformed state */; }
}`;
    navigator.clipboard.writeText(code);
  };

  const renderEasingVisualization = () => {
    const points = Array.from({ length: 50 }, (_, i) => {
      const x = i / 49;
      const y = EASING_FUNCTIONS[state.easing](x);
      return { x: x * 200, y: 100 - y * 80 };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg width="200" height="100" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <path d={pathData} stroke="#4b3fff" strokeWidth="2" fill="none" />
        <circle
          cx={state.progress * 200}
          cy={100 - EASING_FUNCTIONS[state.easing](state.progress) * 80}
          r="4"
          fill="#4b3fff"
        />
      </svg>
    );
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom>
        Seamstress Logo Animation Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Explore cyclic transformation algorithms with seamless looping
      </Typography>

      <Grid container spacing={4}>
        {/* Main Animation Display */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 500,
            }}
          >
            <svg
              width="300"
              height="300"
              viewBox="0 0 151 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {state.algorithm === 'flashingFills' ? (
                <>
                  {/* Static base paths */}
                  {(Object.keys(LOGO_PATHS) as Array<keyof typeof LOGO_PATHS>).map((key) => (
                    <path
                      key={key}
                      d={LOGO_PATHS[key]}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={key === 'zigzag' || key === 'border' ? '2 2' : undefined}
                      fill="none"
                    />
                  ))}

                  {/* Flashing fill regions */}
                  {FILL_REGIONS.map((region, i) => {
                    // Each region flashes in succession with a quick fade
                    const totalRegions = FILL_REGIONS.length;
                    const regionDuration = 1 / totalRegions; // Each region gets equal time slice
                    const regionStart = i * regionDuration;
                    const regionEnd = (i + 1) * regionDuration;

                    // Current progress in the cycle
                    const t = state.progress;

                    // Calculate opacity for this region
                    let opacity = 0;
                    if (t >= regionStart && t < regionEnd) {
                      // Flash in quickly (30% of region time) then fade out (70% of region time)
                      const localProgress = (t - regionStart) / regionDuration;
                      if (localProgress < 0.3) {
                        // Flash in
                        opacity = localProgress / 0.3;
                      } else {
                        // Fade out
                        opacity = 1 - ((localProgress - 0.3) / 0.7);
                      }
                      // Apply easing for smoother animation
                      opacity = Math.pow(opacity, 2) * 0.7; // Max 70% opacity
                    }

                    return (
                      <motion.path
                        key={i}
                        d={region.d}
                        fill={region.color}
                        stroke="none"
                        opacity={opacity}
                        initial={false}
                      />
                    );
                  })}
                </>
              ) : state.algorithm === 'kaleidoscope' ? (
                <>
                  {/* Triangle group - rotates clockwise slowly with pulsing fills */}
                  <motion.g
                    animate={{ rotate: 360 * state.progress * 0.5 }}
                    transition={{ duration: 0 }}
                    style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                  >
                    {/* Base triangle */}
                    <path
                      d={LOGO_PATHS.triangle}
                      stroke="#4b3fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Flashing fill layers */}
                    {[0, 1, 2].map((i) => {
                      const phase = (state.progress * 3 + i / 3) % 1;
                      const fillOpacity = Math.sin(phase * Math.PI) * 0.4;
                      return (
                        <path
                          key={i}
                          d={LOGO_PATHS.triangle}
                          stroke="none"
                          fill={[colorTokens.primary.main, colorTokens.info.main, colorTokens.warning.main][i]}
                          opacity={fillOpacity}
                        />
                      );
                    })}
                  </motion.g>

                  {/* Zigzag group - rotates counter-clockwise fast with wave fills */}
                  <motion.g
                    animate={{ rotate: -360 * state.progress * 1.5 }}
                    transition={{ duration: 0 }}
                    style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                  >
                    <path
                      d={LOGO_PATHS.zigzag}
                      stroke="#d32f2f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 2"
                      fill="none"
                    />
                    {[0, 1, 2, 3].map((i) => {
                      const phase = (state.progress * 4 + i / 4) % 1;
                      const fillOpacity = phase < 0.5 ? phase * 0.6 : (1 - phase) * 0.6;
                      return (
                        <path
                          key={i}
                          d={LOGO_PATHS.zigzag}
                          stroke="none"
                          fill={[colorTokens.primary.main, colorTokens.primary[400], colorTokens.error.main, colorTokens.secondary.main][i]}
                          opacity={fillOpacity}
                        />
                      );
                    })}
                  </motion.g>

                  {/* Border group - rotates clockwise very slowly with corner flashes */}
                  <motion.g
                    animate={{ rotate: 360 * state.progress * 0.25 }}
                    transition={{ duration: 0 }}
                    style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                  >
                    <path
                      d={LOGO_PATHS.border}
                      stroke="#0288d1"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 2"
                      fill="none"
                    />
                    {[0, 1, 2].map((i) => {
                      const phase = (state.progress * 2 + i / 3) % 1;
                      const fillOpacity = Math.max(0, Math.sin(phase * Math.PI * 2) * 0.3);
                      return (
                        <path
                          key={i}
                          d={LOGO_PATHS.border}
                          stroke="none"
                          fill={[colorTokens.info.main, colorTokens.primary.main, colorTokens.secondary.main][i]}
                          opacity={fillOpacity}
                        />
                      );
                    })}
                  </motion.g>

                  {/* Radial group - rotates counter-clockwise fastest */}
                  <motion.g
                    animate={{ rotate: -360 * state.progress * 2 }}
                    transition={{ duration: 0 }}
                    style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => {
                      const phase = (state.progress * 5 + i / 5) % 1;
                      const strokeOpacity = Math.sin(phase * Math.PI) * 0.8 + 0.2;
                      return (
                        <path
                          key={i}
                          d={LOGO_PATHS.radial}
                          stroke={[colorTokens.primary.main, colorTokens.primary[400], colorTokens.primary[200], colorTokens.warning.main, colorTokens.secondary.main][i]}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          opacity={strokeOpacity}
                        />
                      );
                    })}
                  </motion.g>
                </>
              ) : (
                (Object.keys(LOGO_PATHS) as Array<keyof typeof LOGO_PATHS>).map((key) => {
                  const anim = getPathAnimation(key);
                  return (
                    <motion.path
                      key={key}
                      d={LOGO_PATHS[key]}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={anim.strokeDasharray}
                      strokeDashoffset={anim.strokeDashoffset}
                      opacity={anim.opacity}
                      transform={anim.transform}
                      initial={false}
                      animate={{
                        transform: anim.transform,
                        strokeDashoffset: anim.strokeDashoffset,
                        opacity: anim.opacity,
                      }}
                      transition={{ duration: 0 }}
                    />
                  );
                })
              )}
            </svg>
          </Paper>

          {/* Timeline */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Progress: {(state.progress * 100).toFixed(1)}%
            </Typography>
            <Box
              sx={{
                height: 4,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                mt: 1,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${state.progress * 100}%`,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  transition: 'width 0.05s linear',
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Controls */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Controls
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Algorithm</InputLabel>
                  <Select
                    value={state.algorithm}
                    label="Algorithm"
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        algorithm: e.target.value as AnimationAlgorithm,
                      }))
                    }
                  >
                    {ALGORITHMS.map((algo) => (
                      <MenuItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Easing</InputLabel>
                  <Select
                    value={state.easing}
                    label="Easing"
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, easing: e.target.value as EasingFunction }))
                    }
                  >
                    <MenuItem value="linear">Linear</MenuItem>
                    <MenuItem value="easeInOut">Ease In-Out</MenuItem>
                    <MenuItem value="sine">Sine</MenuItem>
                    <MenuItem value="cubic">Cubic</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="caption" gutterBottom>
                    Speed: {state.speed.toFixed(1)}x
                  </Typography>
                  <Slider
                    value={state.speed}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={(_, value) => setState((prev) => ({ ...prev, speed: value as number }))}
                  />
                </Box>

                <Stack direction="row" spacing={1}>
                  <IconButton onClick={handlePlayPause} color="primary">
                    {state.isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <IconButton onClick={handleReset}>
                    <RestartAlt />
                  </IconButton>
                  <Button
                    startIcon={<ContentCopy />}
                    onClick={exportAnimation}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 'auto' }}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Easing Visualization
              </Typography>
              {renderEasingVisualization()}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Shows f(t) curve with current position
              </Typography>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Algorithm Info
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {state.algorithm === 'kaleidoscope' &&
                  'Rotates paths at different speeds around center point (75.5, 75.5)'}
                {state.algorithm === 'threading' &&
                  'Animates stroke-dashoffset on dashed paths creating a sewing effect'}
                {state.algorithm === 'deconstruction' &&
                  'Expands paths outward, rotates them, then contracts back'}
                {state.algorithm === 'breathing' &&
                  'Scale animation with phase-offset sine waves per path'}
                {state.algorithm === 'morph' &&
                  'Transitions between different geometric states'}
                {state.algorithm === 'stitch' &&
                  'Sequential line segment reveal/hide pattern'}
                {state.algorithm === 'flashingFills' &&
                  'Sequentially flashes colored fills in whitespace regions, each quickly fading out'}
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
