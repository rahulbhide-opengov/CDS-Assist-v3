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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Typography,
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
  Close as CloseIcon,
} from '@mui/icons-material';
import { OpenGovLogo } from '@opengov/react-capital-assets';
import { AiOgAssist } from '@opengov/react-capital-assets/icons';
import { PlatformSwitcherMenu } from './PlatformSwitcherMenu';
import { useLocalGitInfo } from '../hooks/useLocalGit';
import { useGitHubBranches, useGitHubPullRequests, useIsGitHubConfigured } from '../hooks/useGitHub';
import { useNavigate } from 'react-router-dom';

interface PlatformNavigationProps {
  onThemeEditorOpen?: () => void;
  hideOpenGovLogo?: boolean;
}

// AI Scan Animation types and beacon config
import {
  BEACON_CONFIG,
  BEACON_LOOP_DURATION,
  BEACON_PAUSE_DURATION,
} from './ai/AIScanHighlight';

type AnimationState = 'idle' | 'in' | 'loop' | 'out';

export function PlatformNavigation({
  onThemeEditorOpen,
  hideOpenGovLogo = false,
}: PlatformNavigationProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openGovMenuAnchor, setOpenGovMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [platformSwitcherOpen, setPlatformSwitcherOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [branchCopied, setBranchCopied] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

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
  // Timing: 1.1s in → 3s loop → 1.1s out → 5s pause → repeat
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
    // Calculate total cycle duration + pause
    const inMs = BEACON_CONFIG.sweepIn * 1000;
    const loopMs = BEACON_LOOP_DURATION * 1000;
    const outMs = BEACON_CONFIG.sweepOut * 1000;
    const pauseMs = BEACON_PAUSE_DURATION * 1000;
    const cycleDuration = inMs + loopMs + outMs + 100 + pauseMs;

    // Initial run after a short delay
    const initialTimeout = setTimeout(runScanCycle, 1500);

    // Then run continuously with beacon timing
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

  const handleCloseMenus = () => {
    setOpenGovMenuAnchor(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenUnifiedChat = () => {
    // Check if a page has set a default agent (e.g., DocumentBuilderPage sets 'documentBuilderSimple')
    const defaultAgent = (window as any).defaultChatAgent;
    if (defaultAgent && (window as any).openUnifiedChatWithAgent) {
      (window as any).openUnifiedChatWithAgent(defaultAgent);
    } else if ((window as any).openUnifiedChat) {
      (window as any).openUnifiedChat();
    }
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  const handleMobileNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Git context section - reusable between desktop and mobile
  const GitContextSection = ({ vertical = false }: { vertical?: boolean }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'stretch' : 'center',
        gap: vertical ? 1 : 1.5,
        width: vertical ? '100%' : 'auto',
      }}
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
              maxWidth: vertical ? '100%' : 200,
              cursor: 'pointer',
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              '& .MuiChip-deleteIcon': {
                color: branchCopied ? 'success.main' : 'inherit',
              },
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

      {/* PR Status for current branch */}
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
            onClick={() => handleMobileNavigate('/repo/pull-requests')}
            sx={{
              fontWeight: 500,
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      ) : localGitInfo?.currentBranch && localGitInfo.currentBranch !== 'main' && (
        <Tooltip title="No open PR for this branch">
          <Chip
            icon={<PRIcon sx={{ fontSize: 16 }} />}
            label="No PR"
            size="small"
            variant="outlined"
            onClick={() => handleMobileNavigate('/repo/pull-requests')}
            sx={{
              fontWeight: 500,
              cursor: 'pointer',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: 'action.hover',
              },
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
            onClick={() => handleMobileNavigate('/repo/branches')}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      )}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: { xs: '56px', md: '48px' },
          px: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{
                color: 'text.primary',
                p: 1,
              }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* OpenGov Logo */}
          {!hideOpenGovLogo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '24px',
                  '& svg': {
                    height: '100%',
                    width: 'auto',
                  },
                }}
              >
                <OpenGovLogo />
              </Box>
            </Box>
          )}
          <Menu
            anchorEl={openGovMenuAnchor}
            open={Boolean(openGovMenuAnchor)}
            onClose={handleCloseMenus}
          >
            <MenuItem onClick={handleCloseMenus}>Switch Organization</MenuItem>
            <MenuItem onClick={handleCloseMenus}>Platform Settings</MenuItem>
          </Menu>

          {/* Platform Switcher Dropdown - hidden on smallest screens */}
          <Button
            onClick={handlePlatformSwitcherClick}
            endIcon={<ArrowDownIcon />}
            sx={{
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '14px',
              minWidth: 'auto',
              px: 1,
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            City of Atlanta
          </Button>
          <PlatformSwitcherMenu
            open={platformSwitcherOpen}
            onClose={handleClosePlatformSwitcher}
          />
        </Box>

        {/* Center Section - Git Context Indicators (desktop only) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center' }}>
            <GitContextSection />
          </Box>
        )}

        {/* Right Section - Utilities */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
          {/* Search - icon only on mobile */}
          {isMobile ? (
            <IconButton
              onClick={handleMobileSearchToggle}
              sx={{
                color: 'text.primary',
                p: 1,
              }}
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <Button
              startIcon={<SearchIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '14px',
                minWidth: 'auto',
                px: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              Search
            </Button>
          )}

          {/* Assistants - Opens Unified Chat with AI Scan Animation */}
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            {isMobile ? (
              <IconButton
                onClick={handleOpenUnifiedChat}
                sx={{
                  color: 'text.primary',
                  p: 1,
                }}
                aria-label="Open AI Assistants"
              >
                <AiOgAssist />
              </IconButton>
            ) : (
              <>
                <Button
                  ref={assistantsButtonRef}
                  startIcon={<AiOgAssist />}
                  onClick={handleOpenUnifiedChat}
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontSize: '14px',
                    minWidth: 'auto',
                    px: 1.5,
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: assistantsScanState !== 'idle'
                      ? (theme) => `0 0 12px 2px ${theme.palette.primary.main}40`
                      : 'none',
                    transition: assistantsScanState === 'out'
                      ? `box-shadow ${BEACON_CONFIG.outlineOut}s ease-out`
                      : `box-shadow ${BEACON_CONFIG.outlineIn}s ease-out`,
                    // Sweep keyframes
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
                    '& .MuiButton-startIcon': {
                      position: 'relative',
                      zIndex: 2,
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Assistants
                </Button>

                {/* SVG outline that draws in/out */}
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
              </>
            )}
          </Box>

          {/* Theme Editor - desktop only */}
          {!isMobile && (
            <IconButton
              size="small"
              onClick={onThemeEditorOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <PaletteIcon />
            </IconButton>
          )}

          {/* User Avatar */}
          <IconButton
            onClick={handleUserMenuClick}
            size="small"
            sx={{
              ml: 0.5,
              p: { xs: 1, md: 0.5 },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 28, md: 24 },
                height: { xs: 28, md: 24 },
                bgcolor: 'primary.main',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              JD
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 1,
            }}
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
        </Box>
      </Box>

      {/* Mobile Search Bar - slides down when search is active */}
      {isMobile && mobileSearchOpen && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search..."
            size="small"
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleMobileSearchToggle}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              },
            }}
          />
        </Box>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: 320,
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '24px',
                '& svg': {
                  height: '100%',
                  width: 'auto',
                },
              }}
            >
              <OpenGovLogo />
            </Box>
          </Box>
          <IconButton onClick={handleMobileMenuToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Organization Selector */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Button
            fullWidth
            onClick={() => {
              handlePlatformSwitcherClick();
              setMobileMenuOpen(false);
            }}
            endIcon={<ArrowDownIcon />}
            sx={{
              justifyContent: 'space-between',
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              px: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
            }}
          >
            City of Atlanta
          </Button>
        </Box>

        {/* Git Context Section */}
        {localGitInfo?.currentBranch && (
          <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Repository
            </Typography>
            <GitContextSection vertical />
          </Box>
        )}

        {/* Main Actions */}
        <List sx={{ px: 1, py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleOpenUnifiedChat}
              sx={{ borderRadius: 1, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AiOgAssist />
              </ListItemIcon>
              <ListItemText primary="AI Assistants" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleMobileSearchToggle();
                setMobileMenuOpen(false);
              }}
              sx={{ borderRadius: 1, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onThemeEditorOpen?.();
                setMobileMenuOpen(false);
              }}
              sx={{ borderRadius: 1, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText primary="Theme Editor" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        {/* User Section */}
        <List sx={{ px: 1, py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1.5, color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
