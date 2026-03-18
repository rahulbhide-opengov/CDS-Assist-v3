/**
 * GlobalNavSection Component
 *
 * The global navigation section containing:
 * - Menu Icon (opens Platform Switcher)
 * - OpenGov Logo
 * - Platform Switcher
 * - Git Context (branch, PR status, ahead/behind)
 * - Search
 * - AI Assistants (with beacon animation)
 * - Theme Editor
 * - User Avatar/Menu
 *
 * This component uses horizontal scrolling on smaller screens
 * instead of hiding elements. All elements are always visible.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountTree as BranchIcon,
  MergeType as PRIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { OpenGovLogo } from '@opengov/react-capital-assets';
import { AiOgAssist } from '@opengov/react-capital-assets/icons';
import { PlatformSwitcherMenu } from '../PlatformSwitcherMenu';
import { useLocalGitInfo } from '../../hooks/useLocalGit';
import { useGitHubBranches, useGitHubPullRequests, useIsGitHubConfigured } from '../../hooks/useGitHub';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, LayoutGroup } from 'framer-motion';
import {
  getGlobalNavVariants,
  getGlobalNavTransition,
} from './animations';
import { durations } from '../../theme/transitions';
import {
  BEACON_CONFIG,
  BEACON_LOOP_DURATION,
  BEACON_PAUSE_DURATION,
} from '../ai/AIScanHighlight';
import type { GlobalNavSectionProps } from './types';

type AnimationState = 'idle' | 'in' | 'loop' | 'out';

export function GlobalNavSection({
  isVisible,
  onThemeEditorOpen,
  hideOpenGovLogo = false,
  centeredBranding = false,
}: GlobalNavSectionProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [platformSwitcherOpen, setPlatformSwitcherOpen] = useState(false);
  const [entityMenuAnchor, setEntityMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEntity, setSelectedEntity] = useState('City of Atlanta');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [branchCopied, setBranchCopied] = useState(false);

  // Logo fade-in animation when transitioning to/from centered branding (Command Center)
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [logoTransitionEnabled, setLogoTransitionEnabled] = useState(true);
  const prevCenteredBrandingRef = useRef(centeredBranding);

  useEffect(() => {
    // Animate when centeredBranding changes in either direction
    if (centeredBranding !== prevCenteredBrandingRef.current) {
      // Immediately hide logo with no transition
      setLogoTransitionEnabled(false);
      setLogoOpacity(0);

      // After layout transition completes, fade in with transition enabled
      const fadeInDelay = prefersReducedMotion ? 0 : durations.standard;
      const timer = setTimeout(() => {
        setLogoTransitionEnabled(true);
        setLogoOpacity(1);
      }, fadeInDelay);

      prevCenteredBrandingRef.current = centeredBranding;
      return () => clearTimeout(timer);
    }
  }, [centeredBranding, prefersReducedMotion]);

  // Git context data
  const isGitHubConfigured = useIsGitHubConfigured();
  const { data: localGitInfo } = useLocalGitInfo();
  const { data: githubBranches } = useGitHubBranches({ enabled: isGitHubConfigured });
  const { data: githubPRs } = useGitHubPullRequests('open', { enabled: isGitHubConfigured });

  // Get current branch data
  const currentBranchData = githubBranches?.find(
    (b) => b.name === localGitInfo?.currentBranch
  );

  // Find PR for current branch
  const currentBranchPR = githubPRs?.find(
    (pr) => pr.sourceBranch === localGitInfo?.currentBranch
  );

  // Handle copy branch name
  const handleCopyBranch = () => {
    if (localGitInfo?.currentBranch) {
      navigator.clipboard.writeText(localGitInfo.currentBranch);
      setBranchCopied(true);
      setTimeout(() => setBranchCopied(false), 2000);
    }
  };

  // AI Scan animation state
  const [assistantsScanState, setAssistantsScanState] = useState<AnimationState>('idle');
  const assistantsButtonRef = useRef<HTMLButtonElement>(null);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 });

  // Measure button dimensions
  useEffect(() => {
    if (assistantsButtonRef.current) {
      const { offsetWidth, offsetHeight } = assistantsButtonRef.current;
      setButtonDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  // Calculate SVG stroke properties
  const borderRadius = 4;
  const offset = 4;
  const svgWidth = buttonDimensions.width + offset * 2;
  const svgHeight = buttonDimensions.height + offset * 2;
  const perimeter = 2 * (svgWidth + svgHeight) - 8 * borderRadius + 2 * Math.PI * borderRadius;

  const getStrokeDashoffset = () => {
    if (assistantsScanState === 'idle') return perimeter;
    if (assistantsScanState === 'in' || assistantsScanState === 'loop') return 0;
    if (assistantsScanState === 'out') return perimeter;
    return perimeter;
  };

  // Run full animation cycle using beacon mode timing
  const runScanCycle = useCallback(() => {
    const inMs = BEACON_CONFIG.sweepIn * 1000;
    const loopMs = BEACON_LOOP_DURATION * 1000;
    const outMs = BEACON_CONFIG.sweepOut * 1000;

    setAssistantsScanState('in');
    setTimeout(() => setAssistantsScanState('loop'), inMs);
    setTimeout(() => setAssistantsScanState('out'), inMs + loopMs);
    setTimeout(() => setAssistantsScanState('idle'), inMs + loopMs + outMs + 100);
  }, []);

  useEffect(() => {
    const inMs = BEACON_CONFIG.sweepIn * 1000;
    const loopMs = BEACON_LOOP_DURATION * 1000;
    const outMs = BEACON_CONFIG.sweepOut * 1000;
    const pauseMs = BEACON_PAUSE_DURATION * 1000;
    const cycleDuration = inMs + loopMs + outMs + 100 + pauseMs;

    const initialTimeout = setTimeout(runScanCycle, 1500);
    const interval = setInterval(runScanCycle, cycleDuration);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [runScanCycle]);

  const handlePlatformSwitcherClick = () => {
    setPlatformSwitcherOpen(true);
  };

  const handleClosePlatformSwitcher = () => {
    setPlatformSwitcherOpen(false);
  };

  const handleEntityMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setEntityMenuAnchor(event.currentTarget);
  };

  const handleCloseEntityMenu = () => {
    setEntityMenuAnchor(null);
  };

  const handleEntitySelect = (entity: string) => {
    setSelectedEntity(entity);
    setEntityMenuAnchor(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenUnifiedChat = () => {
    const defaultAgent = (window as any).defaultChatAgent;
    if (defaultAgent && (window as any).openUnifiedChatWithAgent) {
      (window as any).openUnifiedChatWithAgent(defaultAgent);
    } else if ((window as any).openUnifiedChat) {
      (window as any).openUnifiedChat();
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Animation variants and transition
  const variants = getGlobalNavVariants(prefersReducedMotion);
  const transition = getGlobalNavTransition(isVisible, prefersReducedMotion);

  // Layout transition duration
  const layoutTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: durations.standard / 1000, ease: [0.4, 0, 0.2, 1] };

  return (
    <>
      <motion.div
        initial={false}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
        style={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        aria-hidden={!isVisible}
      >
        {/* Global nav bar - width auto, doesn't shrink */}
        <LayoutGroup>
          <Box
            component={motion.nav}
            layout="position"
            transition={layoutTransition}
            aria-label="Global navigation"
            sx={{
              width: 'auto',
              minWidth: 'fit-content',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              minHeight: 48,
              pl: 1,
              pr: 2,
              gap: centeredBranding ? 0 : 2,
              bgcolor: 'background.paper',
              whiteSpace: 'nowrap',
            }}
          >
            {/* === LEFT SECTION === */}
            <Box
              component={motion.div}
              layout="position"
              transition={layoutTransition}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: centeredBranding ? 1 : 'none',
              }}
            >
              {/* Platform Menu Button */}
              <motion.div layout="position" transition={layoutTransition}>
                <IconButton
                  onClick={handlePlatformSwitcherClick}
                  sx={{ color: 'text.primary', p: 1 }}
                  aria-label="Open platform navigation"
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            </Box>

            {/* === BRANDING SECTION (Logo + Entity) - Always visible, position animates === */}
            {!hideOpenGovLogo && (
              <motion.div
                layout="position"
                transition={layoutTransition}
                style={{
                  display: 'flex',
                  flexDirection: centeredBranding ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: centeredBranding ? 4 : 8,
                  padding: centeredBranding ? 16 : 0,
                  flex: centeredBranding ? 1 : 'none',
                  opacity: logoOpacity,
                  transition: (!logoTransitionEnabled || prefersReducedMotion) ? 'none' : `opacity ${durations.standard * 2}ms ease-out`,
                }}
              >
                {/* OpenGov Logo */}
                <Box
                  component={motion.div}
                  layout="position"
                  transition={layoutTransition}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: centeredBranding ? 24 : 22,
                    // Calculate width from aspect ratio of OpenGov logo (viewBox: 196.68 119.33 972.64 186.65)
                    // aspect ratio ~= 972.64 / 186.65 ~= 5.21
                    width: centeredBranding ? 125 : 115,
                    '& svg': { width: '100%', height: '100%' },
                  }}
                >
                  <OpenGovLogo />
                </Box>

                {/* Entity name */}
                <motion.div layout="position" transition={layoutTransition}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEntity}
                  </Typography>
                </motion.div>
              </motion.div>
            )}

            {/* Spacer to push content - only when NOT centered branding */}
            <motion.div
              layout="position"
              transition={layoutTransition}
              style={{
                flex: centeredBranding ? 0 : 1,
                minWidth: centeredBranding ? 0 : 8,
              }}
            />

            {/* === CENTER SECTION - Git Context (hidden below md, also hidden in centered branding mode) === */}
            <Box
              component={motion.div}
              layout="position"
              transition={layoutTransition}
              sx={{ display: centeredBranding ? 'none' : { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}
            >
              {/* Current Branch */}
              {localGitInfo?.currentBranch && (
                <Tooltip title={branchCopied ? 'Copied!' : 'Click to copy branch name'}>
                  <Chip
                    icon={<BranchIcon sx={{ fontSize: 16 }} />}
                    label={localGitInfo.currentBranch}
                    size="small"
                    onClick={handleCopyBranch}
                    onDelete={handleCopyBranch}
                    deleteIcon={branchCopied ? <CheckIcon sx={{ fontSize: 14 }} /> : <CopyIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      maxWidth: 200,
                      cursor: 'pointer',
                      '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                      '& .MuiChip-deleteIcon': { color: branchCopied ? 'success.main' : 'inherit' },
                    }}
                    color={
                      currentBranchData?.status === 'ahead' ? 'info' :
                        currentBranchData?.status === 'behind' ? 'warning' :
                          currentBranchData?.status === 'diverged' ? 'error' :
                            'default'
                    }
                    variant="outlined"
                  />
                </Tooltip>
              )}

              {/* PR Status */}
              {currentBranchPR ? (
                <Tooltip title={`PR #${currentBranchPR.number}: ${currentBranchPR.title}`}>
                  <Chip
                    icon={<PRIcon sx={{ fontSize: 16 }} />}
                    label={`PR #${currentBranchPR.number}`}
                    size="small"
                    color={
                      currentBranchPR.reviewStatus === 'approved' ? 'success' :
                        currentBranchPR.reviewStatus === 'changes_requested' ? 'warning' :
                          'info'
                    }
                    onClick={() => handleNavigate('/repo/pull-requests')}
                    sx={{ fontWeight: 500, cursor: 'pointer' }}
                  />
                </Tooltip>
              ) : localGitInfo?.currentBranch && localGitInfo.currentBranch !== 'main' && (
                <Tooltip title="No open PR for this branch">
                  <Chip
                    icon={<PRIcon sx={{ fontSize: 16 }} />}
                    label="No PR"
                    size="small"
                    variant="outlined"
                    onClick={() => handleNavigate('/repo/pull-requests')}
                    sx={{
                      fontWeight: 500,
                      cursor: 'pointer',
                      opacity: 0.7,
                      '&:hover': { opacity: 1, bgcolor: 'action.hover' },
                    }}
                  />
                </Tooltip>
              )}

              {/* Ahead/Behind indicator */}
              {currentBranchData && (currentBranchData.aheadBy || currentBranchData.behindBy) && (
                <Tooltip title={`${currentBranchData.aheadBy || 0} ahead, ${currentBranchData.behindBy || 0} behind main`}>
                  <Chip
                    label={
                      currentBranchData.aheadBy && currentBranchData.behindBy
                        ? `+${currentBranchData.aheadBy}/-${currentBranchData.behindBy}`
                        : currentBranchData.aheadBy
                          ? `+${currentBranchData.aheadBy} ahead`
                          : `-${currentBranchData.behindBy} behind`
                    }
                    size="small"
                    color={
                      currentBranchData.aheadBy && currentBranchData.behindBy ? 'error' :
                        currentBranchData.aheadBy ? 'info' : 'warning'
                    }
                    variant="outlined"
                    onClick={() => handleNavigate('/repo/branches')}
                    sx={{ fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
            </Box>

            {/* Spacer to push right section to the end */}
            <motion.div
              layout="position"
              transition={layoutTransition}
              style={{
                flex: centeredBranding ? 0 : 1,
                minWidth: centeredBranding ? 0 : 8,
              }}
            />

            {/* === RIGHT SIDE WRAPPER (flex: 1 when centered branding to balance left side) === */}
            <Box
              component={motion.div}
              layout="position"
              transition={layoutTransition}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: centeredBranding ? 1 : 0,
                flex: centeredBranding ? 1 : 'none',
                justifyContent: centeredBranding ? 'flex-end' : 'flex-start',
              }}
            >

              {/* === ASSISTANTS BUTTON (visible on all screen sizes) === */}
              {/* Assistants Button with AI Scan Animation */}
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Button
                  ref={assistantsButtonRef}
                  startIcon={<AiOgAssist />}
                  onClick={handleOpenUnifiedChat}
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontSize: 14,
                    minWidth: 'auto',
                    px: 1.5,
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxShadow: assistantsScanState !== 'idle'
                      ? (theme) => `0 0 12px 2px ${theme.palette.primary.main}40`
                      : 'none',
                    transition: assistantsScanState === 'out'
                      ? `box-shadow ${BEACON_CONFIG.outlineOut}s ease-out`
                      : `box-shadow ${BEACON_CONFIG.outlineIn}s ease-out`,
                    '@keyframes assistantsSweepIn': {
                      '0%': { transform: 'translateX(-100%)', opacity: 1 },
                      '100%': { transform: 'translateX(100%)', opacity: 1 },
                    },
                    '@keyframes assistantsSweepLoop': {
                      '0%': { transform: 'translateX(-100%)', opacity: 1 },
                      '100%': { transform: 'translateX(100%)', opacity: 1 },
                    },
                    '@keyframes assistantsSweepOut': {
                      '0%': { transform: 'translateX(-100%)', opacity: 1 },
                      '100%': { transform: 'translateX(100%)', opacity: 0 },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: (theme) =>
                        `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}40 50%, transparent 100%)`,
                      opacity: assistantsScanState !== 'idle' ? 1 : 0,
                      pointerEvents: 'none',
                      zIndex: 1,
                      animation: assistantsScanState === 'in'
                        ? `assistantsSweepIn ${BEACON_CONFIG.sweepIn}s ease-out forwards`
                        : assistantsScanState === 'loop'
                          ? `assistantsSweepLoop ${BEACON_LOOP_DURATION}s ease-in-out infinite`
                          : assistantsScanState === 'out'
                            ? `assistantsSweepOut ${BEACON_CONFIG.sweepOut}s ease-out forwards`
                            : 'none',
                    },
                    '& .MuiButton-startIcon': { position: 'relative', zIndex: 2 },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  OG Assist
                </Button>

                {/* SVG outline animation */}
                {buttonDimensions.width > 0 && (
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
                        transition: assistantsScanState === 'out'
                          ? `stroke-dashoffset ${BEACON_CONFIG.outlineOut}s ease-out`
                          : assistantsScanState === 'in'
                            ? `stroke-dashoffset ${BEACON_CONFIG.outlineIn}s ease-out`
                            : 'none',
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* === RIGHT SECTION - Utilities (hidden on mobile - shown in platform menu) === */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                {/* Search Button */}
                <Button
                  startIcon={<SearchIcon />}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  Search
                </Button>

                {/* Theme Editor Button */}
                <IconButton
                  size="small"
                  onClick={onThemeEditorOpen}
                  sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}
                  aria-label="Open theme editor"
                >
                  <PaletteIcon />
                </IconButton>

                {/* User Avatar Button */}
                <IconButton
                  onClick={handleUserMenuClick}
                  size="small"
                  sx={{ ml: 0.5, p: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
                  aria-label="Open user menu"
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: 'primary.main',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    JD
                  </Avatar>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </LayoutGroup>

        {/* Entity Switcher Menu */}
        <Menu
          anchorEl={entityMenuAnchor}
          open={Boolean(entityMenuAnchor)}
          onClose={handleCloseEntityMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ mt: 1 }}
        >
          <MenuItem
            onClick={() => handleEntitySelect('City of Atlanta')}
            selected={selectedEntity === 'City of Atlanta'}
          >
            City of Atlanta
          </MenuItem>
          <MenuItem
            onClick={() => handleEntitySelect('State of Georgia')}
            selected={selectedEntity === 'State of Georgia'}
          >
            State of Georgia
          </MenuItem>
          <MenuItem
            onClick={() => handleEntitySelect('County Services')}
            selected={selectedEntity === 'County Services'}
          >
            County Services
          </MenuItem>
        </Menu>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleCloseUserMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <HelpIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Help
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Platform Switcher Menu */}
        <PlatformSwitcherMenu
          open={platformSwitcherOpen}
          onClose={handleClosePlatformSwitcher}
          gitInfo={{
            currentBranch: localGitInfo?.currentBranch,
            branchStatus: currentBranchData?.status,
            aheadBy: currentBranchData?.aheadBy,
            behindBy: currentBranchData?.behindBy,
            prNumber: currentBranchPR?.number,
            prTitle: currentBranchPR?.title,
            prReviewStatus: currentBranchPR?.reviewStatus,
          }}
          onCopyBranch={handleCopyBranch}
          branchCopied={branchCopied}
        />
      </motion.div>

      {/* ARIA live region for screen readers */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {isVisible ? 'Global navigation expanded' : 'Global navigation collapsed'}
      </Box>
    </>
  );
}

export default GlobalNavSection;
