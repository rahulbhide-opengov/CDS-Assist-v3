import React from 'react';
import {
  Box,
  Button,
  Chip,
  Drawer,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  IconButton,
  Select,
  FormControl,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Home as HomeIcon,
  Notifications as BellIcon,
  Dashboard as GridIcon,
  Assessment as ClipboardIcon,
  Build as WrenchIcon,
  AccountTree as FlowIcon,
  Psychology as AgentIcon,
  Article as ListIcon,
  Schedule as TimerIcon,
  Star as StarIcon,
  OpenInNew as ExternalLinkIcon,
  Search as SearchIcon,
  AccountTree as BranchIcon,
  MergeType as PRIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { OpenGovLogo, ProductBp } from '@opengov/react-capital-assets';

interface GitInfo {
  currentBranch?: string;
  branchStatus?: 'ahead' | 'behind' | 'diverged' | 'up-to-date';
  aheadBy?: number;
  behindBy?: number;
  prNumber?: number;
  prTitle?: string;
  prReviewStatus?: 'approved' | 'changes_requested' | 'pending';
}

interface PlatformSwitcherMenuProps {
  open: boolean;
  onClose: () => void;
  currentEntity?: string;
  onSearchClick?: () => void;
  gitInfo?: GitInfo;
  onCopyBranch?: () => void;
  branchCopied?: boolean;
}

interface MenuItemData {
  id: string;
  label: string;
  icon: React.ReactElement;
  route?: string;
  externalUrl?: string;
  isSelected?: boolean;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItemData[];
}

export function PlatformSwitcherMenu({
  open,
  onClose,
  currentEntity = 'City of Atlanta',
  onSearchClick,
  gitInfo,
  onCopyBranch,
  branchCopied,
}: PlatformSwitcherMenuProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedEntity, setSelectedEntity] = React.useState(currentEntity);
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    'capabilities',
    'action-hubs',
    'modules',
  ]);

  // Define menu sections
  const capabilities: MenuSection = {
    id: 'capabilities',
    title: 'Capabilities',
    items: [
      {
        id: 'agent-studio',
        label: 'Agent Studio',
        icon: <AgentIcon sx={{ fontSize: 20 }} />,
        route: '/agent-studio/dashboard',
      },
      {
        id: 'app-builder',
        label: 'App Builder',
        icon: <WrenchIcon sx={{ fontSize: 20 }} />,
        route: '/app-builder',
      },
      {
        id: 'workflow-builder',
        label: 'Workflow Builder',
        icon: <FlowIcon sx={{ fontSize: 20 }} />,
        route: '/workflow-builder',
      },
    ],
  };

  const actionHubs: MenuSection = {
    id: 'action-hubs',
    title: 'Action Hubs',
    items: [
      {
        id: 'command-center',
        label: 'Command Center',
        icon: <HomeIcon sx={{ fontSize: 20 }} />,
        route: '/command-center',
        isSelected: true,
      },
      {
        id: 'tasks-notifications',
        label: 'Tasks & Notifications',
        icon: <BellIcon sx={{ fontSize: 20 }} />,
        route: '/tasks',
      },
      {
        id: 'programs-projects',
        label: 'Programs & Projects',
        icon: <GridIcon sx={{ fontSize: 20 }} />,
        route: '/programs',
      },
      {
        id: 'reports-dashboards',
        label: 'Reports & Dashboards',
        icon: <ClipboardIcon sx={{ fontSize: 20 }} />,
        route: '/reports',
      },
    ],
  };

  const modules: MenuSection = {
    id: 'modules',
    title: 'Modules',
    items: [
      {
        id: 'budgeting-performance',
        label: 'Budgeting & Performance',
        icon: <ProductBp style={{ width: 20, height: 20 }} />,
        route: '/budgeting',
      },
      {
        id: 'asset-management',
        label: 'Enterprise Asset Management',
        icon: <WrenchIcon sx={{ fontSize: 20 }} />,
        route: '/eam/dashboard',
      },
      {
        id: 'financials',
        label: 'Financials',
        icon: <TimerIcon sx={{ fontSize: 20 }} />,
        route: '/financials',
      },
      {
        id: 'grants-management',
        label: 'Grants Management',
        icon: <GridIcon sx={{ fontSize: 20 }} />,
        externalUrl: 'https://grants.opengov.com',
      },
      {
        id: 'permitting-licensing',
        label: 'Permitting & Licensing',
        icon: <StarIcon sx={{ fontSize: 20 }} />,
        route: '/permitting',
      },
      {
        id: 'procurement',
        label: 'Procurement & Contract Management',
        icon: <StarIcon sx={{ fontSize: 20 }} />,
        route: '/procurement/projects',
      },
      {
        id: 'utility-billing',
        label: 'Utility Billing',
        icon: <StarIcon sx={{ fontSize: 20 }} />,
        route: '/utility-billing/home',
      },
    ],
  };

  const sections = [capabilities, actionHubs, modules];

  const handleAccordionChange = (sectionId: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedSections((prev) =>
      isExpanded
        ? [...prev, sectionId]
        : prev.filter((id) => id !== sectionId)
    );
  };

  const handleItemClick = (item: MenuItemData) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.route) {
      navigate(item.route);
      onClose();
    }
  };

  const handleEntityChange = (event: any) => {
    setSelectedEntity(event.target.value);
    // In a real app, this would trigger entity switching logic
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 340 },
            boxShadow: (theme) => theme.shadows[16],
          },
        },
      }}
    >
      {/* Mobile Header with Close Button */}
      {isMobile && (
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
          <Typography variant="h6" fontWeight={600}>
            Navigation
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Entity Dropdown */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            mb: 1,
          }}
        >
          Entity
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedEntity}
            onChange={handleEntityChange}
            IconComponent={ChevronDownIcon}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '& .MuiSelect-select': {
                py: 1,
                fontSize: '14px',
                fontWeight: 400,
              },
            }}
          >
            <MenuItem value="City of Atlanta">City of Atlanta</MenuItem>
            <MenuItem value="State of Georgia">State of Georgia</MenuItem>
            <MenuItem value="County Services">County Services</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />

      {/* Mobile Actions - Search */}
      {isMobile && onSearchClick && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => {
              onSearchClick();
              onClose();
            }}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1.5,
            }}
          >
            Search
          </Button>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Collapsible Sections */}
      <Box
        component="nav"
        aria-label="Platform navigation"
        sx={{ flex: 1, overflow: 'auto', p: 2 }}
      >
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSections.includes(section.id)}
            onChange={handleAccordionChange(section.id)}
            disableGutters
            elevation={0}
            aria-labelledby={`${section.id}-header`}
            sx={{
              '&:before': {
                display: 'none',
              },
              '&.MuiAccordion-root': {
                bgcolor: 'transparent',
                border: 'none',
              },
              '&.Mui-expanded': {
                border: 'none',
              },
              mb: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
              id={`${section.id}-header`}
              aria-controls={`${section.id}-content`}
              sx={{
                px: 2,
                py: 0.5,
                minHeight: 40,
                '&.Mui-expanded': {
                  minHeight: 40,
                },
                '& .MuiAccordionSummary-content': {
                  my: 0.5,
                },
                '& .MuiAccordionSummary-content.Mui-expanded': {
                  my: 0.5,
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={`${section.id}-content`} sx={{ p: 0, display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column' }}>
              {section.items.map((item) => (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  onClick={() => handleItemClick(item)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                  aria-label={item.externalUrl ? `${item.label} (opens in new tab)` : item.label}
                  aria-current={item.isSelected ? 'page' : undefined}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    bgcolor: item.isSelected ? 'action.selected' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    '&:hover': {
                      bgcolor: item.isSelected ? 'action.selected' : 'action.hover',
                    },
                    '&:focus': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: -2,
                    },
                    '&:focus:not(:focus-visible)': {
                      outline: 'none',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: -2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '20px',
                      color: 'text.primary',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'text.primary',
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.externalUrl && (
                    <ExternalLinkIcon
                      sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }}
                      aria-hidden="true"
                    />
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Git Info Section - shown below md breakpoint */}
      {gitInfo?.currentBranch && (
        <Box
          component="section"
          aria-labelledby="git-info-heading"
          sx={{
            display: { xs: 'block', md: 'none' },
            px: 2,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            id="git-info-heading"
            variant="caption"
            sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
          >
            Repository
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Current Branch */}
            <Tooltip title={branchCopied ? 'Copied!' : 'Click to copy branch name'}>
              <Chip
                icon={<BranchIcon sx={{ fontSize: 16 }} />}
                label={gitInfo.currentBranch}
                size="small"
                onClick={onCopyBranch}
                onDelete={onCopyBranch}
                deleteIcon={branchCopied ? <CheckIcon sx={{ fontSize: 14 }} /> : <CopyIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontWeight: 500,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxWidth: '100%',
                  cursor: 'pointer',
                  '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                  '& .MuiChip-deleteIcon': { color: branchCopied ? 'success.main' : 'inherit' },
                }}
                color={
                  gitInfo.branchStatus === 'ahead' ? 'info' :
                  gitInfo.branchStatus === 'behind' ? 'warning' :
                  gitInfo.branchStatus === 'diverged' ? 'error' :
                  'default'
                }
                variant="outlined"
              />
            </Tooltip>

            {/* PR Status */}
            {gitInfo.prNumber ? (
              <Tooltip title={`PR #${gitInfo.prNumber}: ${gitInfo.prTitle}`}>
                <Chip
                  icon={<PRIcon sx={{ fontSize: 16 }} />}
                  label={`PR #${gitInfo.prNumber}`}
                  size="small"
                  color={
                    gitInfo.prReviewStatus === 'approved' ? 'success' :
                    gitInfo.prReviewStatus === 'changes_requested' ? 'warning' :
                    'info'
                  }
                  onClick={() => {
                    navigate('/repo/pull-requests');
                    onClose();
                  }}
                  sx={{ fontWeight: 500, cursor: 'pointer' }}
                />
              </Tooltip>
            ) : gitInfo.currentBranch !== 'main' && (
              <Tooltip title="No open PR for this branch">
                <Chip
                  icon={<PRIcon sx={{ fontSize: 16 }} />}
                  label="No PR"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    navigate('/repo/pull-requests');
                    onClose();
                  }}
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
            {(gitInfo.aheadBy || gitInfo.behindBy) && (
              <Tooltip title={`${gitInfo.aheadBy || 0} ahead, ${gitInfo.behindBy || 0} behind main`}>
                <Chip
                  label={
                    gitInfo.aheadBy && gitInfo.behindBy
                      ? `+${gitInfo.aheadBy}/-${gitInfo.behindBy}`
                      : gitInfo.aheadBy
                      ? `+${gitInfo.aheadBy} ahead`
                      : `-${gitInfo.behindBy} behind`
                  }
                  size="small"
                  color={
                    gitInfo.aheadBy && gitInfo.behindBy ? 'error' :
                    gitInfo.aheadBy ? 'info' : 'warning'
                  }
                  variant="outlined"
                  onClick={() => {
                    navigate('/repo/branches');
                    onClose();
                  }}
                  sx={{ fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      )}

      {/* OpenGov Logo at bottom */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          '& svg': {
            height: 24,
            width: 'auto',
            opacity: 0.6,
          },
        }}
      >
        <OpenGovLogo />
      </Box>
    </Drawer>
  );
}
