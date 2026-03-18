import React, { useState, useEffect, useMemo } from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Badge,
  Avatar,
  Drawer,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { getPeriwinkleChartColors, getBlueScale } from '../../utils/chartColors';
import { 
  Schedule, 
  Notifications, 
  Search, 
  Menu, 
  Tune, 
  HelpOutline, 
  Logout as LogoutIcon, 
  Add, 
  Settings,
  ShowChart,
  AccountBalance,
  Payment,
  Build,
  ShoppingCart,
  Phone,
  CardGiftcard,
  Layers,
  ChevronRight,
  Close,
  Home,
  AutoAwesome,
  Construction,
  TrendingUp,
  AttachMoney,
  Description,
  Speed,
  Person,
  KeyboardArrowDown,
  DragIndicator,
  Undo,
  Redo,
  Delete,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cdsDesignTokens } from '../../theme/cds';

// Chart data factory functions - take theme colors for consistency
const createRenewalsChartData = (colors: string[]) => [
  { name: 'Public Works', value: 6, color: colors[4] },
  { name: 'Parks & Rec', value: 12, color: colors[1] },
  { name: 'Dont Know', value: 6, color: colors[5] },
  { name: 'Finance', value: 5, color: colors[0] },
  { name: 'HR', value: 7, color: colors[3] },
  { name: 'Other', value: 15, color: colors[6] },
];

const createVendorData = (colors: string[]) => [
  { name: 'Followers - 32%', value: 32, color: colors[1] },
  { name: 'Downloaders - 15%', value: 15, color: colors[5] },
  { name: 'Applicants - 15%', value: 15, color: colors[7] },
  { name: 'No Bids - 10%', value: 10, color: colors[0] },
  { name: 'Submissions - 10%', value: 10, color: colors[0] },
];

const createDiversityData = (colors: string[]) => [
  { name: 'Certified Small Business - 32%', value: 32, color: colors[0] },
  { name: 'Veteran Owned - 15%', value: 15, color: colors[1] },
  { name: 'Minority Business Enterprise - 15%', value: 15, color: colors[4] },
  { name: 'LGBTQ+ Owned - 10%', value: 10, color: colors[5] },
  { name: 'Woman Business Enterprise - 10%', value: 10, color: colors[6] },
  { name: 'Disabled Veteran Business Enterprise - 8%', value: 8, color: colors[7] },
  { name: 'Micro Business - 7%', value: 7, color: colors[8] },
  { name: 'Native American Owned - 7%', value: 7, color: colors[9] },
  { name: 'US DOT Certified DBE - 5%', value: 5, color: colors[3] },
];

// Animated Number Component
const AnimatedNumber: React.FC<{ value: number; decimals?: number; duration?: number }> = ({ 
  value, 
  decimals = 0, 
  duration = 2000 
}) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic for smoother deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * easeOut);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <>{decimals ? display.toFixed(decimals) : Math.floor(display).toLocaleString()}</>;
};

// Gauge Chart - Semicircle with segments
const GaugeChart: React.FC<{
  value: number;
  segments: Array<{ color: string; count: number; label: string }>;
}> = ({ value, segments }) => {
  const theme = useTheme();
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  let currentAngle = -180; // Start at left (-180 degrees)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {/* Gauge Chart with KPI */}
      <Box sx={{ position: 'relative', width: 232, height: 116, flexShrink: 0 }}>
        <svg viewBox="0 0 232 116" style={{ width: '100%', height: '100%' }}>
          {/* Segments */}
          {segments.map((seg, i) => {
            const percentage = seg.count / total;
            const sweepAngle = percentage * 180;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sweepAngle;
            currentAngle = endAngle;

            const centerX = 116;
            const centerY = 116;
            const innerRadius = 64;
            const outerRadius = 98;
            const strokeWidth = 1;

            // Convert angles to radians
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate arc points
            const x1 = centerX + innerRadius * Math.cos(startRad);
            const y1 = centerY + innerRadius * Math.sin(startRad);
            const x2 = centerX + outerRadius * Math.cos(startRad);
            const y2 = centerY + outerRadius * Math.sin(startRad);
            const x3 = centerX + outerRadius * Math.cos(endRad);
            const y3 = centerY + outerRadius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(endRad);
            const y4 = centerY + innerRadius * Math.sin(endRad);

            const largeArcFlag = sweepAngle > 180 ? 1 : 0;

            // Simple path for segment
            const pathData = [
              `M ${x1} ${y1}`,
              `L ${x2} ${y2}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
              `L ${x4} ${y4}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
              'Z',
            ].join(' ');

            return (
              <g key={i}>
                {/* Main segment */}
                <path
                  d={pathData}
                  fill={seg.color}
                  stroke="white"
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  style={{
                    paintOrder: 'fill stroke',
                  }}
                />
              </g>
            );
          })}

          {/* Rounded end caps for the two legs */}
          {(() => {
            const centerX = 116;
            const centerY = 116;
            const innerRadius = 64;
            const outerRadius = 98;
            const arcWidth = outerRadius - innerRadius; // 34px
            const midRadius = (innerRadius + outerRadius) / 2; // Middle of the arc

            // Left leg (at -180 degrees)
            const leftRad = (-180 * Math.PI) / 180;
            const leftX = centerX + midRadius * Math.cos(leftRad);
            const leftY = centerY + midRadius * Math.sin(leftRad);

            // Right leg (at 0 degrees)
            const rightRad = (0 * Math.PI) / 180;
            const rightX = centerX + midRadius * Math.cos(rightRad);
            const rightY = centerY + midRadius * Math.sin(rightRad);

            return (
              <>
                {/* Left cap - circle at the end */}
                <circle
                  cx={leftX}
                  cy={leftY}
                  r={arcWidth / 2}
                  fill={segments[0].color}
                />

                {/* Right cap - circle at the end */}
                <circle
                  cx={rightX}
                  cy={rightY}
                  r={arcWidth / 2}
                  fill={segments[segments.length - 1].color}
                />
              </>
            );
          })()}
        </svg>

        {/* KPI centered and aligned to bottom of gauge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1, color: theme.palette.text.primary }}>{value}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>Total</Typography>
        </Box>
      </Box>

      {/* Legend - Vertical List on Right */}
      <Box sx={{ flex: 1 }}>
        {segments.map((seg, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: seg.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.8125rem', color: theme.palette.text.primary, fontWeight: 400 }}>{seg.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Donut Chart - Metabase-style with legend
const DonutChart: React.FC<{
  segments: Array<{ color: string; count: number; label: string }>;
  animate?: boolean;
}> = ({ segments, animate = true }) => {
  const theme = useTheme();
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const circumference = 2 * Math.PI * 50;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%' }}>
      {/* Donut chart */}
      <Box sx={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {segments.map((item, index) => {
            let startPercent = 0;
            for (let i = 0; i < index; i++) {
              startPercent += segments[i].count / total;
            }
            const segmentPercent = item.count / total;

            return (
              <motion.circle
                key={index}
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeDasharray={`${segmentPercent * circumference} ${circumference}`}
                strokeDashoffset={-startPercent * circumference}
                transform="rotate(-90 60 60)"
                initial={animate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.35 }}
              />
            );
          })}
        </svg>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <Typography sx={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1
          }}>
            {total}
          </Typography>
          <Typography sx={{
            fontSize: '0.625rem',
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            Total
          </Typography>
        </Box>
      </Box>

      {/* Legend - vertical */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        {segments.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 10,
              height: 10,
              borderRadius: '2px',
              bgcolor: item.color,
              flexShrink: 0
            }} />
            <Typography sx={{
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              flex: 1
            }}>
              {item.label.replace(/^\d+\s*/, '')}
            </Typography>
            <Typography sx={{
              fontSize: '0.75rem',
              color: theme.palette.text.primary,
              fontWeight: 600
            }}>
              {item.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Draggable Dashboard Card - with custom drag handle (DhiWise pattern)
interface DashboardCardData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'donut' | 'kpi' | 'chart' | 'funnel' | 'progress' | 'section-header';
  size?: 'small' | 'full'; // KPI size: small=144px (1 row), full=304px (2 rows)
  content: React.ReactNode;
  gridColumn?: number; // 1-12 (span)
  gridColumnStart?: number; // explicit start column (1-12)
  gridRow?: number;    // 1-2 (span)
  section?: string;    // group identifier
  isVisible?: boolean;
}

const DraggableDashboardCard: React.FC<{
  card: DashboardCardData;
  index: number;
  provided: any;
  isDragging: boolean;
  isEditMode: boolean;
  onTitleChange?: (id: string, newTitle: string) => void;
  onRemove?: (id: string) => void;
  onSizeToggle?: (id: string) => void;
}> = ({ card, index, provided, isDragging, isEditMode, onTitleChange, onRemove, onSizeToggle }) => {
  const theme = useTheme();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);

  const handleTitleClick = () => {
    if (isEditMode && card.type !== 'section-header') {
      setIsEditingTitle(true);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle !== card.title && onTitleChange) {
      onTitleChange(card.id, editedTitle);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(card.title);
      setIsEditingTitle(false);
    }
  };

  // Section header - 64px (8×8), full width, spans 1 grid row
  const SECTION_HEADER_HEIGHT = 64; // 8 × 8 = 1 grid row
  
  if (card.type === 'section-header') {
    return (
      <motion.div
        ref={provided.innerRef}
        {...provided.draggableProps}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: index * 0.03 }}
        style={{
          ...provided.draggableProps.style,
          gridColumn: '1 / -1', // Full width (all 12 columns)
          gridRow: 'span 1', // Section headers span exactly 1 row (64px)
          height: SECTION_HEADER_HEIGHT,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', // Center vertically
          justifyContent: 'flex-start',
          gap: 1,
          height: SECTION_HEADER_HEIGHT,
          borderRadius: isEditMode ? '8px' : 0,
          border: isEditMode ? `0.8px dashed ${theme.palette.primary.main}` : 'none',
          px: isEditMode ? 2 : 0,
          bgcolor: isEditMode ? `${theme.palette.primary.main}14` : 'transparent',
        }}>
          {isEditMode && (
            <Box {...provided.dragHandleProps} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', '&:active': { cursor: 'grabbing' } }}>
              <DragIndicator sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            </Box>
          )}
          {card.content}
        </Box>
      </motion.div>
    );
  }

  // Grid system based on 64px base row (8×8), with 16px gap
  // Section headers: 1 row (64px)
  // KPI small/Progress: 2 rows (64 + 16 + 64 = 144px)
  // KPI full/Charts/Donuts/Funnel: 4 rows (64×4 + 16×3 = 304px)
  const BASE_ROW = 64; // 8 × 8
  const GRID_GAP = 16; // 2 × 8
  const SMALL_HEIGHT = (2 * BASE_ROW) + GRID_GAP; // 144px (2 rows)
  const FULL_HEIGHT = (4 * BASE_ROW) + (3 * GRID_GAP); // 304px (4 rows)
  
  // Calculate row span based on card type and size
  // KPI small/progress = 2 rows (144px), KPI full/charts/donuts/funnel = 4 rows (304px)
  const rowSpan = (card.type === 'kpi' && card.size !== 'full') || card.type === 'progress' ? 2 : 4;
  
  // Calculate actual height
  const cardHeight = rowSpan === 2 ? SMALL_HEIGHT : FULL_HEIGHT;

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging
          ? `0 20px 40px ${theme.palette.action.hover}`
          : `0px 1px 8px 0px ${theme.palette.grey[100]}`
      }}
      transition={{ 
        duration: 0.35, 
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.05
      }}
      style={{
        ...provided.draggableProps.style,
        gridColumn: card.gridColumnStart 
          ? `${card.gridColumnStart} / span ${card.gridColumn || 4}` 
          : card.gridColumn ? `span ${Math.min(card.gridColumn, 12)}` : 'span 4',
        gridRow: `span ${rowSpan}`,
      }}
    >
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: '4px', 
          height: cardHeight, 
          bgcolor: 'white', 
          border: isDragging ? `0.8px solid ${theme.palette.primary.main}` : isEditMode ? `0.8px dashed ${theme.palette.primary.main}` : `0.8px solid ${theme.palette.divider}`,
          transition: 'border 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          overflow: 'visible',
          '&:hover .drag-handle, &:hover .remove-btn': {
            opacity: isEditMode ? 1 : 0,
          }
        }}
      >
        {/* Drag Handle - top left */}
        {isEditMode && (
          <Box
            {...provided.dragHandleProps}
            className="drag-handle"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              px: 1,
              py: 0.5,
              borderRadius: '4px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: `${theme.palette.primary.main}1A`,
              border: `1px solid ${theme.palette.primary.main}33`,
              zIndex: 10,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}26`,
                borderColor: `${theme.palette.primary.main}4D`,
              },
              '&:active': {
                cursor: 'grabbing',
                bgcolor: `${theme.palette.primary.main}33`,
              },
            }}
          >
            <DragIndicator sx={{ fontSize: 14, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 500, color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Drag
            </Typography>
          </Box>
        )}

        {/* Edit mode controls - top right */}
        {isEditMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              p: 0.5,
              zIndex: 10,
            }}
          >
            {/* Size Toggle Button - only for KPI cards */}
            {card.type === 'kpi' && (
              <IconButton
                onClick={() => onSizeToggle?.(card.id)}
                size="small"
                title={card.size === 'full' ? 'Switch to small' : 'Switch to full height'}
                sx={{
                  p: 0.75,
                  borderRadius: '4px',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: theme.palette.grey[100],
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: 1 }}>
                  {card.size === 'full' ? 'S' : 'L'}
                </Typography>
              </IconButton>
            )}

            {/* Delete Button - Trash icon */}
            <IconButton
              className="remove-btn"
              onClick={() => onRemove?.(card.id)}
              size="small"
              title="Remove card"
              sx={{
                p: 0.75,
                borderRadius: '4px',
                color: theme.palette.text.secondary,
                '&:hover': {
                  bgcolor: theme.palette.error.light,
                  color: theme.palette.error.main,
                },
              }}
            >
              <Delete sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', '&:last-child': { pb: 3 } }}>
          {/* Editable Title */}
          {isEditingTitle ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              variant="standard"
              sx={{
                mb: 0.5,
                '& .MuiInput-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: theme.palette.primary.main,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: theme.palette.primary.main,
                },
              }}
            />
          ) : (
            <Typography
              onClick={handleTitleClick}
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                mb: 0.5,
                color: theme.palette.text.primary,
                pr: isEditMode ? 6 : 0,
                cursor: isEditMode ? 'text' : 'default',
                borderRadius: '4px',
                px: isEditMode ? 0.5 : 0,
                mx: isEditMode ? -0.5 : 0,
                '&:hover': isEditMode ? {
                  bgcolor: `${theme.palette.primary.main}14`,
                } : {},
              }}
            >
              {card.title}
            </Typography>
          )}
          {card.subtitle && (
            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mb: 2 }}>
              {card.subtitle}
            </Typography>
          )}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {card.content}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Custom Bar Component with Sleek Animation (Metabase-style)
const CustomBar: React.FC<any> = (props: any) => {
  const { fill, x, y, width, height, index } = props;
  const [isHovered, setIsHovered] = React.useState(false);
  const [animatedHeight, setAnimatedHeight] = React.useState(0);
  const bottomY = y + height; // Base position at bottom of bar
  
  // Sleek animation: grow from bottom with staggered delay
  React.useEffect(() => {
    // Stagger delay: 80ms per bar for sleek feel
    const delay = (index || 0) * 80;
    const timer = setTimeout(() => {
      // Use requestAnimationFrame for smooth animation
      let start: number | null = null;
      const duration = 350; // 0.35s for sleek
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        // Sleek easing: cubic-bezier(0.4, 0, 0.2, 1) approximation
        const progress = Math.min(elapsed / duration, 1);
        // Material Standard easing approximation
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        setAnimatedHeight(height * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [height, index]);
  
  // Darken color on hover by reducing brightness
  const darkenColor = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const darkenFactor = 0.85;
    const newR = Math.floor(r * darkenFactor);
    const newG = Math.floor(g * darkenFactor);
    const newB = Math.floor(b * darkenFactor);
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  const radius = 4; // Slightly more rounded for Metabase look
  const currentY = bottomY - animatedHeight;

  return (
    <path
      d={`
        M ${x},${currentY + radius}
        Q ${x},${currentY} ${x + radius},${currentY}
        L ${x + width - radius},${currentY}
        Q ${x + width},${currentY} ${x + width},${currentY + radius}
        L ${x + width},${bottomY}
        L ${x},${bottomY}
        Z
      `}
      fill={isHovered ? darkenColor(fill) : fill}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'fill 0.2s ease',
      }}
    />
  );
};

const CommandCenterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);
  const [showWandIntro, setShowWandIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(-1);
  const [showFloatingWands, setShowFloatingWands] = useState(false);
  const [donutChartsVisible, setDonutChartsVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [customizeDrawerOpen, setCustomizeDrawerOpen] = useState(false);
  const [customizeTab, setCustomizeTab] = useState(0);
  const [dashboardCards, setDashboardCards] = useState<DashboardCardData[]>([]);
  const [history, setHistory] = useState<DashboardCardData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const donutChartsRef = React.useRef<HTMLDivElement>(null);
  
  // Undo/Redo functions
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  const saveToHistory = (cards: DashboardCardData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cards);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDashboardCards(history[newIndex]);
    }
  };
  
  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDashboardCards(history[newIndex]);
    }
  };
  
  // Wrapper to update cards and save to history
  const updateDashboardCards = (newCards: DashboardCardData[]) => {
    setDashboardCards(newCards);
    saveToHistory(newCards);
  };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme-derived chart colors
  const chartColors = useMemo(() => ({
    periwinkle: getPeriwinkleChartColors(theme),
    blue: getBlueScale(theme),
    // UI colors derived from theme
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    primaryMain: theme.palette.primary.main,
    primaryLight: theme.palette.primary.light,
    divider: theme.palette.divider,
    backgroundPaper: theme.palette.background.paper,
    backgroundSecondary: theme.palette.background.secondary || theme.palette.grey[50],
    errorMain: theme.palette.error.main,
    errorLight: theme.palette.error.light,
    successMain: theme.palette.success.main,
    successLight: theme.palette.success.light,
    warningMain: theme.palette.warning.main,
    infoMain: theme.palette.info.main,
    grey: theme.palette.grey,
  }), [theme]);

  const loadingTexts = [
    "Loading clarity and confidence...",
    "Powering your Command Center...",
    "Bringing insight online...",
    "Preparing data for action...",
    "Building better government...",
  ];

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 || hour < 5) return 'Good evening'; // 5PM to midnight (and midnight to 5AM)
    return 'Welcome';
  };

  const greeting = `${getGreeting()}, Gaby, here's what needs your attention`;

  // Cycle through loading texts with appear/disappear effect
  useEffect(() => {
    if (showWandIntro) {
      // Fade in
      setTextVisible(true);
      
      // Fade out after 2.2 seconds
      const fadeOutTimer = setTimeout(() => {
        setTextVisible(false);
      }, 2200);
      
      // Change to next text after fade out completes + small gap
      const nextTextTimer = setTimeout(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 3000); // 2.2s display + 700ms fade out + 100ms gap
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(nextTextTimer);
      };
    }
  }, [showWandIntro, loadingTextIndex, loadingTexts.length]);

  // Intersection Observer for donut charts scroll animation
  useEffect(() => {
    if (prefersReducedMotion) {
      setDonutChartsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !donutChartsVisible) {
            setDonutChartsVisible(true);
            // Announce to screen readers that content has loaded
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = 'Additional charts loaded';
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% visible (earlier for better UX)
        rootMargin: '0px 0px -50px 0px', // Reduced offset for smoother trigger
      }
    );

    if (donutChartsRef.current) {
      observer.observe(donutChartsRef.current);
    }

    return () => {
      if (donutChartsRef.current) {
        observer.unobserve(donutChartsRef.current);
      }
    };
  }, [donutChartsVisible, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      setShowWandIntro(false);
      setContentVisible(true);
      setAnimate(true);
      setSectionIndex(10); // Show all sections immediately
      setShowFloatingWands(true);
    } else {
      // Wand intro for 2.8 seconds (extended to make a statement)
      const wandTimer = setTimeout(() => {
        setShowWandIntro(false);
        setContentVisible(true);
      }, 2800);

      // Progressive section reveal starts after wand
      const sectionTimers: NodeJS.Timeout[] = [];
      for (let i = 0; i <= 6; i++) {
        sectionTimers.push(
          setTimeout(() => {
            setSectionIndex(i);
          }, 2800 + i * 100) // Start at 2.8s, stagger by 100ms
        );
      }

      // Start chart animations
      const animateTimer = setTimeout(() => {
        setAnimate(true);
      }, 3100);

      // Show floating wands at the very end
      const floatingWandsTimer = setTimeout(() => {
        setShowFloatingWands(true);
      }, 3600);

      return () => {
        clearTimeout(wandTimer);
        clearTimeout(animateTimer);
        clearTimeout(floatingWandsTimer);
        sectionTimers.forEach(clearTimeout);
      };
    }
  }, [prefersReducedMotion]);

  const renewalsSegments = useMemo(() => [
    { color: chartColors.blue[0], count: 9, label: '9 Ended' },
    { color: chartColors.blue[1], count: 11, label: '11 Under 3 Months' },
    { color: chartColors.blue[2], count: 14, label: '14 3-6 Months' },
    { color: chartColors.blue[3], count: 11, label: '11 6-9 Months' },
    { color: chartColors.blue[4], count: 11, label: '11 9-12 Months' },
  ], [chartColors.blue]);

  const insuranceSegments = useMemo(() => [
    { color: chartColors.blue[0], count: 3, label: '3 Expired' },
    { color: chartColors.blue[1], count: 3, label: '3 1-15 Days' },
    { color: chartColors.blue[2], count: 6, label: '6 16-30 Days' },
    { color: chartColors.blue[3], count: 5, label: '5 31-60 Days' },
  ], [chartColors.blue]);

  // Theme-derived chart data
  const renewalsChartData = useMemo(() => createRenewalsChartData(chartColors.periwinkle), [chartColors.periwinkle]);
  const vendorData = useMemo(() => createVendorData(chartColors.periwinkle), [chartColors.periwinkle]);
  const diversityData = useMemo(() => createDiversityData(chartColors.periwinkle), [chartColors.periwinkle]);

  // KPI Card Component for normalized data
  const KpiCard: React.FC<{ value: string | number; prefix?: string }> = ({ value, prefix }) => (
    <Typography sx={{ fontSize: '2.25rem', fontWeight: 500, color: chartColors.primaryMain, lineHeight: 1 }}>
      {prefix}{value}
    </Typography>
  );

  // Section Header Component
  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: chartColors.textPrimary }}>
      {title}
    </Typography>
  );

  // Progress Bar Component for Cycle Time - compact version (uses success/teal colors from theme)
  const CycleTimeBar: React.FC = () => {
    const segments = [
      { label: 'Draft', days: 9, color: chartColors.grey[300] },
      { label: 'Review', days: 4, color: chartColors.grey[400] },
      { label: 'Post Pending', days: 2, color: chartColors.successLight },
      { label: 'Open', days: 60, color: chartColors.successMain },
      { label: 'Reverse Auction', days: 2, color: chartColors.infoMain },
      { label: 'Pending', days: 10, color: chartColors.primaryLight },
      { label: 'Evaluation', days: 25, color: chartColors.primaryMain },
      { label: 'Award Pending', days: 16, color: theme.palette.primary.dark },
    ];

    return (
      <Box sx={{ width: '100%' }}>
        {/* Progress bar with white dividers */}
        <Box sx={{ height: 20, display: 'flex', borderRadius: '4px', overflow: 'hidden', mb: 1 }}>
          {segments.map((item, i) => (
            <Box
              key={i}
              sx={{
                flex: item.days,
                bgcolor: item.color,
                borderRight: i < segments.length - 1 ? '0.8px solid white' : 'none',
              }}
            />
          ))}
        </Box>
        {/* Labels spanning full width, matching segment proportions */}
        <Box sx={{ display: 'flex', width: '100%' }}>
          {segments.map((item, i) => (
            <Box
              key={i}
              sx={{
                flex: item.days,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 0, // Allow shrinking
                overflow: 'hidden',
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '1px', bgcolor: item.color, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: '0.5625rem',
                  color: chartColors.textSecondary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label} · {item.days}d
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // Initialize ALL dashboard cards for drag and drop (normalized)
  // Grid: 12 columns, row height 144px, gap 16px
  // KPI small: 1 row (144px) | KPI full/Charts: 2 rows (304px)
  const initialDashboardCards: DashboardCardData[] = [
    // === TOP ROW: "Procurement Director's Attention Needed" ===
    // 2 donuts (4 cols each) + 2 stacked KPIs (4 cols)
    {
      id: 'contracts-expiring',
      title: 'Contracts Expiring Soon',
      subtitle: 'Active contracts by expiration timeline',
      type: 'donut',
      content: <DonutChart segments={renewalsSegments} animate={donutChartsVisible} />,
      gridColumn: 4,
      section: 'top',
    },
    {
      id: 'insurance-expiring',
      title: 'Insurance Expiring Soon',
      subtitle: 'From active contracts by expiration timeline',
      type: 'donut',
      content: <DonutChart segments={insuranceSegments} animate={donutChartsVisible} />,
      gridColumn: 4,
      section: 'top',
    },
    {
      id: 'unresolved-questions',
      title: 'Unresolved Questions',
      subtitle: '',
      type: 'kpi',
      content: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <KpiCard value={2} />
          <Chip icon={<Schedule sx={{ fontSize: 14 }} />} label="36 hours old" size="small"
            sx={{ backgroundColor: 'rgba(211, 47, 47, 0.12)', color: 'error.main', fontSize: '0.75rem', height: 24, '& .MuiChip-icon': { color: 'error.main' } }} />
        </Box>
      ),
      gridColumn: 4,
      section: 'top',
    },
    {
      id: 'unreleased-addenda',
      title: 'Unreleased Addenda & Notices',
      subtitle: '',
      type: 'kpi',
      content: <KpiCard value={1} />,
      gridColumn: 4,
      section: 'top',
    },
    // === CONTRACT MANAGEMENT ===
    {
      id: 'contract-management-header',
      title: 'Contract Management',
      type: 'section-header',
      content: <SectionHeader title="Contract Management" />,
      gridColumn: 12,
      section: 'contracts',
    },
    {
      id: 'total-contracts',
      title: 'Total Number of Contracts',
      subtitle: 'Currently Active',
      type: 'kpi',
      content: <KpiCard value={140} />,
      gridColumn: 4,
      gridColumnStart: 1, // Start at column 1
      section: 'contracts',
    },
    {
      id: 'total-contract-amount',
      title: 'Total Contract Amount',
      subtitle: 'Currently Active',
      type: 'kpi',
      content: <KpiCard value="240,382.01" prefix="$" />,
      gridColumn: 4,
      gridColumnStart: 1, // Start at column 1 (stacks under above)
      section: 'contracts',
    },
    {
      id: 'contract-by-dept',
      title: 'Total Contract Amount by Department',
      subtitle: 'Currently Active Contracts',
      type: 'chart',
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={renewalsChartData} barSize={44} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#f2f2f2" strokeOpacity={1} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: colorTokens.grey[700], fontWeight: 500 }} axisLine={{ stroke: colorTokens.grey[300] }} tickLine={false} />
            <YAxis domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} tick={{ fontSize: 11, fill: colorTokens.grey[700] }} axisLine={false} tickLine={false} />
            <RechartsTooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={0} shape={(props: any) => <CustomBar {...props} index={props.index} />}>
              {renewalsChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
      gridColumn: 8,
      gridColumnStart: 5, // Start at column 5 (right side)
      section: 'contracts',
    },
    // === STRATEGIC SOURCING ===
    {
      id: 'strategic-sourcing-header',
      title: 'Strategic Sourcing',
      type: 'section-header',
      content: <SectionHeader title="Strategic Sourcing" />,
      gridColumn: 12,
      section: 'sourcing',
    },
    {
      id: 'avg-cycle-time',
      title: 'Average Sourcing Cycle Time',
      subtitle: 'Total: 145 Days',
      type: 'progress',
      content: <CycleTimeBar />,
      gridColumn: 12,
      section: 'sourcing',
    },
    {
      id: 'total-solicitations',
      title: 'Total Number of Solicitations',
      subtitle: 'From Draft to Award Pending',
      type: 'kpi',
      size: 'full', // Tall KPI spanning 2 rows
      content: <KpiCard value="10,293" />,
      gridColumn: 4,
      section: 'sourcing',
    },
    {
      id: 'vendors-notified',
      title: 'Total Number of Vendors Notified',
      subtitle: '',
      type: 'kpi',
      content: <KpiCard value={140} />,
      gridColumn: 4,
      section: 'sourcing',
    },
    {
      id: 'total-responses',
      title: 'Total Number of Responses',
      subtitle: '',
      type: 'kpi',
      content: <KpiCard value="31,696" />,
      gridColumn: 4,
      section: 'sourcing',
    },
    {
      id: 'vendors-per-solicitation',
      title: 'Vendors Notified Per Solicitation',
      subtitle: '',
      type: 'kpi',
      content: <KpiCard value="941.8" />,
      gridColumn: 4,
      section: 'sourcing',
    },
    {
      id: 'avg-response-per-solicitation',
      title: 'Average Response Per Solicitation',
      subtitle: '',
      type: 'kpi',
      content: <KpiCard value="11.6" />,
      gridColumn: 4,
      section: 'sourcing',
    },
    // === VENDOR ANALYTICS ===
    {
      id: 'vendor-engagement',
      title: 'Vendor Engagement Rate',
      subtitle: 'Response Rate Over the last 60 days',
      type: 'funnel',
      content: (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%', 
          height: '100%',
        }}>
          {[
            { label: 'Followers', value: 32, width: '100%', color: colorTokens.primary.main },
            { label: 'Downloaders', value: 15, width: '80%', color: colorTokens.primary[400] },
            { label: 'Applicants', value: 15, width: '62%', color: colorTokens.primary[400] },
            { label: 'No Bids', value: 10, width: '46%', color: colorTokens.primary[200] },
            { label: 'Submissions', value: 10, width: '32%', color: colorTokens.primary.dark },
          ].map((stage, index) => (
            <Box
              key={index}
              sx={{
                width: stage.width,
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ 
                width: '100%',
                py: 1,
                px: 1.5,
                borderRadius: '4px',
                bgcolor: stage.color,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {stage.label}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {stage.value}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ),
      gridColumn: 6,
      section: 'vendor',
    },
    {
      id: 'vendor-certification',
      title: 'Vendors by Certification Type',
      subtitle: 'Breakdown of all subscribers by DBE',
      type: 'chart',
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={diversityData} cx="35%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" animationDuration={600} animationEasing="ease-out" animationBegin={200} strokeWidth={2} stroke="#fff">
              {diversityData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
            </Pie>
            <RechartsTooltip 
              formatter={(v: number) => `${v}%`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={({ payload }: any) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {payload?.map((entry: any, index: number) => (
                    <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, bgcolor: entry.color, borderRadius: '2px', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{entry.value}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
      gridColumn: 6,
      section: 'vendor',
    },
  ];

  // Handle drag end - reorder cards (DhiWise pattern)
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(dashboardCards.length ? dashboardCards : initialDashboardCards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    updateDashboardCards(items);
  };

  // Handle card title change
  const handleTitleChange = (id: string, newTitle: string) => {
    const items = Array.from(dashboardCards.length ? dashboardCards : initialDashboardCards);
    const updatedItems = items.map(card => 
      card.id === id ? { ...card, title: newTitle } : card
    );
    updateDashboardCards(updatedItems);
  };

  // Handle card removal
  const handleRemoveCard = (id: string) => {
    const items = Array.from(dashboardCards.length ? dashboardCards : initialDashboardCards);
    const updatedItems = items.filter(card => card.id !== id);
    updateDashboardCards(updatedItems);
  };

  // Handle KPI size toggle (small ↔ full)
  const handleSizeToggle = (id: string) => {
    const items = Array.from(dashboardCards.length ? dashboardCards : initialDashboardCards);
    const updatedItems = items.map(card => 
      card.id === id ? { ...card, size: card.size === 'full' ? 'small' : 'full' as 'small' | 'full' } : card
    );
    updateDashboardCards(updatedItems);
  };

  // Get current cards (use state if modified, otherwise initial)
  const currentCards = dashboardCards.length ? dashboardCards : initialDashboardCards;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Skip to main content link for keyboard users */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          top: -100,
          left: 0,
          zIndex: 10000,
          bgcolor: 'primary.main',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: '0 0 4px 0',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          '&:focus': {
            top: 0,
            outline: '3px solid #7C73E6',
            outlineOffset: 2,
          },
        }}
      >
        Skip to main content
      </Box>

      {/* Wand Intro Animation - Full screen centered */}
      {showWandIntro && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #F8FAFC 0%, rgba(203, 213, 225, 0.48) 100%)',
            pointerEvents: 'none',
            animation: 'fadeOut 0.8s ease-out 2s forwards',
            '@keyframes fadeOut': {
              '0%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading Cloud City Command Center"
        >
          {/* Glowing pattern background */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(91, 82, 214, 0.08) 0%, rgba(75, 63, 255, 0.05) 20%, rgba(124, 115, 230, 0.03) 35%, rgba(147, 137, 240, 0.015) 50%, transparent 65%)',
              filter: 'blur(40px)',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
              '@keyframes pulseGlow': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
                '50%': { transform: 'scale(1.15)', opacity: 0.7 },
              },
            }}
          />
          
          {/* Small wands scattered around - organic positions */}
          {(() => {
            // Scattered positions around the center - more organic
            const scatteredPositions = [
              { angle: 15, distance: 140, rotation: 25 },
              { angle: 75, distance: 180, rotation: -15 },
              { angle: 120, distance: 160, rotation: 40 },
              { angle: 165, distance: 190, rotation: -20 },
              { angle: 205, distance: 150, rotation: 10 },
              { angle: 250, distance: 175, rotation: -30 },
              { angle: 290, distance: 165, rotation: 35 },
              { angle: 330, distance: 155, rotation: -10 },
              { angle: 45, distance: 200, rotation: 15 },
              { angle: 135, distance: 145, rotation: -25 },
              { angle: 225, distance: 185, rotation: 20 },
              { angle: 315, distance: 170, rotation: -5 },
            ];
            
            return scatteredPositions.map((pos, i) => {
              const angleRad = (pos.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * pos.distance;
              const y = Math.sin(angleRad) * pos.distance;
              const finalX = x * 1.4;
              const finalY = y * 1.4;
              
              return (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    animation: `scatter${i} 2.8s ease-out infinite`,
                    transformOrigin: '0 0',
                    [`@keyframes scatter${i}`]: {
                      '0%': { 
                        transform: `translate(-50%, -50%) translate(0px, 0px) rotate(${pos.rotation * 0.3}deg) scale(0.3)`,
                        opacity: 0,
                        filter: 'brightness(1.2)',
                      },
                      '15%': { 
                        opacity: 1,
                      },
                      '45%': {
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${pos.rotation}deg) scale(1)`,
                        filter: 'brightness(1.4)',
                      },
                      '70%': {
                        opacity: 1,
                      },
                      '100%': { 
                        transform: `translate(-50%, -50%) translate(${finalX}px, ${finalY}px) rotate(${pos.rotation * 1.2}deg) scale(0.8)`,
                        opacity: 0,
                        filter: 'brightness(0.9)',
                      },
                    },
                  }}
                >
                  <svg width="18" height="17" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id={`wandGlow${i}`}>
                        <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <path 
                      d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" 
                      fill={`hsl(${245 + i * 6}, 72%, ${63 + i * 2}%)`}
                      filter={`url(#wandGlow${i})`}
                    />
                  </svg>
                </Box>
              );
            });
          })()}

          {/* Flying wand - sleek and confident motion */}
          <Box
            sx={{
              animation: 'wandFlyIn 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
              '@keyframes wandFlyIn': {
                '0%': {
                  transform: 'translate(-250px, 250px) rotate(-30deg) scale(0.15)',
                  opacity: 0,
                  filter: 'brightness(1.5)',
                },
                '35%': {
                  opacity: 1,
                  transform: 'translate(0, 0) rotate(0deg) scale(1.38)',
                  filter: 'brightness(1.3)',
                },
                '50%': {
                  transform: 'translate(0, 0) rotate(0deg) scale(1.42)',
                  opacity: 1,
                  filter: 'brightness(1.35)',
                },
                '65%': {
                  transform: 'translate(0, 0) rotate(0deg) scale(1.38)',
                  opacity: 1,
                  filter: 'brightness(1.3)',
                },
                '100%': {
                  transform: 'translate(250px, -250px) rotate(30deg) scale(0.15)',
                  opacity: 0,
                  filter: 'brightness(1.5)',
                },
              },
            }}
          >
            <svg width="110" height="101" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 20px rgba(75, 63, 255, 0.6)) drop-shadow(0 0 40px rgba(91, 82, 214, 0.4)) drop-shadow(0 0 60px rgba(124, 115, 230, 0.2))' }}>
              <defs>
                <linearGradient id="wandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4B3FFF" />
                  <stop offset="50%" stopColor="#5B52D6" />
                  <stop offset="100%" stopColor="#7C73E6" />
                </linearGradient>
              </defs>
              <path 
                d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" 
                fill="url(#wandGradient)"
              />
            </svg>
          </Box>
          
          {/* Animated Loading Text with Appear/Disappear Effect */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '25%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '100%',
              maxWidth: 600,
            }}
          >
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: textVisible ? 'text.primary' : 'text.secondary',
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              {loadingTexts[loadingTextIndex]}
            </Typography>
          </Box>
          
          {/* Screen reader announcement */}
          <Typography sx={{ position: 'absolute', left: -10000, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
            Loading Cloud City Command Center
          </Typography>
        </Box>
      )}

      {/* OpenGov Masthead */}
      <Box
        sx={{
          height: 56,
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 0.6s ease-in',
        }}
      >
        {/* Left Side - Logo and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            size="small" 
            sx={{ color: 'primary.main', p: 0.5 }}
            onClick={() => setNavOpen(!navOpen)}
            aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={navOpen}
          >
            <Menu sx={{ fontSize: 20 }} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgB7ZThDYAgDIRbncARHMERHMERHMER/E8SEhPBQqX+8V4CJHz0SqGMMcZUQDnnRCkl7L0/SimxXdfQWgtijKG1FkIIb621EEJ4a62FEEK01loIIYS01loIIYS01loIIYS01loIIYS01loIIYQx5hc+AT6pDUXqG7sAAAAASUVORK5CYII="
              alt="OpenGov Logo"
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  OpenGov
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="18" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" 
                      fill="#4353FF"
                    />
                  </svg>
                </Box>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Public Service Platform
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Icons and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: 'text.secondary', p: 1 }}>
            <Badge 
              badgeContent={3} 
              color="error" 
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '0.625rem', 
                  height: 18, 
                  minWidth: 18,
                  fontWeight: 600,
                  top: 2,
                  right: 2,
                } 
              }}
            >
              <Notifications sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary', p: 1 }}>
            <Search sx={{ fontSize: 20 }} />
          </IconButton>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            GC
          </Avatar>
        </Box>
      </Box>

      {/* Navigation Drawer */}
      {navOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 56,
            left: 0,
            bottom: 0,
            width: navCollapsed ? 80 : 260,
            bgcolor: 'white',
            borderRight: '1px solid #e0e0e0',
            zIndex: 1050,
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.06), 2px 0 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Entity Dropdown */}
          {!navCollapsed && (
            <Box sx={{ 
              p: 2.5, 
              borderBottom: '1px solid #f2f2f2',
            }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.75 }}>
                Entity
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1.5,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'divider',
                    bgcolor: 'grey.50',
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', fontWeight: 500 }}>
                  Cloud City
                </Typography>
                <KeyboardArrowDown sx={{ fontSize: 20, color: 'text.secondary' }} />
              </Box>
            </Box>
          )}

          {/* Action Hubs Section */}
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
            {!navCollapsed && (
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Action Hubs
              </Typography>
            )}
            
            {/* Command Center */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              py: 1,
              px: 1,
              borderRadius: '4px', 
              bgcolor: 'grey.100', 
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}>
              <Home sx={{ fontSize: 20, color: 'text.secondary' }} />
              {!navCollapsed && (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', fontWeight: 500 }}>
                  Command Center
                </Typography>
              )}
            </Box>
          </Box>

          {/* Capabilities Section */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1, borderTop: '1px solid #f2f2f2' }}>
            {!navCollapsed && (
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Capabilities
              </Typography>
            )}
            
            {/* Agent Studio */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              py: 1,
              px: 1,
              borderRadius: '4px', 
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                bgcolor: 'grey.50',
              },
            }}>
              <AutoAwesome sx={{ fontSize: 20, color: 'text.secondary' }} />
              {!navCollapsed && (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  Agent Studio
                </Typography>
              )}
            </Box>
          </Box>

          {/* Modules Section */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1, borderTop: '1px solid #f2f2f2' }}>
            {!navCollapsed && (
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Modules
              </Typography>
            )}

            {[
              { icon: Construction, label: 'Asset Management' },
              { icon: TrendingUp, label: 'Budgeting & Performance' },
              { icon: AttachMoney, label: 'Financials' },
              { icon: Description, label: 'Permitting & Licensing' },
              { icon: ShoppingCart, label: 'Procurement' },
              { icon: Speed, label: 'Utility Billing' },
            ].map((item, i) => (
              <Box 
                key={i}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  py: 1,
                  px: 1,
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: 'grey.50',
                  },
                  justifyContent: navCollapsed ? 'center' : 'flex-start',
                }}
              >
                <item.icon sx={{ fontSize: 20, color: 'text.secondary' }} />
                {!navCollapsed && (
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Preferences Section */}
          <Box sx={{ px: 2.5, pt: 2, pb: 2, borderTop: '1px solid #f2f2f2' }}>
            {!navCollapsed && (
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Preferences
              </Typography>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              py: 1,
              px: 1,
              borderRadius: '4px', 
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                bgcolor: 'grey.50',
              },
            }}>
              <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
              {!navCollapsed && (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  Admin settings
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        background: customizeDrawerOpen 
          ? 'rgba(219, 217, 250, 0.2)' // Blurple 50 at 20% opacity in edit mode
          : `linear-gradient(180deg, #F8FAFC 0%, rgba(203, 213, 225, 0.48) 100%), 
                     radial-gradient(circle at 50% 50%, rgba(219, 217, 250, 0.28) 0%, transparent 60%)`,
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pt: 4,
        px: 3,
        pb: 3,
        overflow: 'hidden',
      }}>
        {/* Scattered Floating OpenGov Wands - Appear at the end */}
        {showFloatingWands && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: 400,
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
            opacity: customizeDrawerOpen ? 0 : 1,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Floating wand 1 - Small */}
          <Box sx={{ 
            position: 'absolute', 
            top: 60, 
            right: 150,
            animation: 'float1 28s ease-in-out infinite',
            '@keyframes float1': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-15px) rotate(3deg)' },
            },
          }}>
            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.25">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#4B3FFF"/>
            </svg>
          </Box>

          {/* Floating wand 2 - Medium */}
          <Box sx={{ 
            position: 'absolute', 
            top: 120, 
            right: 350,
            animation: 'float2 35s ease-in-out infinite',
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-12px) rotate(-5deg)' },
            },
          }}>
            <svg width="36" height="33" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.22">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#5B5FC7"/>
            </svg>
          </Box>

          {/* Floating wand 3 - Large */}
          <Box sx={{ 
            position: 'absolute', 
            top: 40, 
            right: 550,
            animation: 'float3 32s ease-in-out infinite',
            '@keyframes float3': {
              '0%, 100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
              '50%': { transform: 'translateY(-18px) scale(1.03) rotate(6deg)' },
            },
          }}>
            <svg width="48" height="44" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.24">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#6B61DC"/>
            </svg>
          </Box>

          {/* Floating wand 4 - Medium Small */}
          <Box sx={{ 
            position: 'absolute', 
            top: 140, 
            right: 80,
            animation: 'float4 26s ease-in-out infinite',
            '@keyframes float4': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-14px) rotate(-3deg)' },
            },
          }}>
            <svg width="30" height="28" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.20">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#7C73E6"/>
            </svg>
          </Box>

          {/* Floating wand 5 - Large */}
          <Box sx={{ 
            position: 'absolute', 
            top: 170, 
            right: 280,
            animation: 'float5 38s ease-in-out infinite',
            '@keyframes float5': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-16px) rotate(7deg)' },
            },
          }}>
            <svg width="42" height="39" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.23">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#8F88EA"/>
            </svg>
          </Box>

          {/* Floating wand 6 - Small */}
          <Box sx={{ 
            position: 'absolute', 
            top: 50, 
            right: 750,
            animation: 'float6 33s ease-in-out infinite',
            '@keyframes float6': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-13px) rotate(-6deg)' },
            },
          }}>
            <svg width="28" height="26" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.21">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#A29DEE"/>
            </svg>
          </Box>

          {/* Floating wand 7 - Tiny */}
          <Box sx={{ 
            position: 'absolute', 
            top: 100, 
            right: 480,
            animation: 'float7 30s ease-in-out infinite',
            '@keyframes float7': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-10px) rotate(5deg)' },
            },
          }}>
            <svg width="20" height="18" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.18">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#B5B1F2"/>
            </svg>
          </Box>

          {/* Floating wand 8 - Tiny */}
          <Box sx={{ 
            position: 'absolute', 
            top: 200, 
            right: 180,
            animation: 'float8 29s ease-in-out infinite',
            '@keyframes float8': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-11px) rotate(-4deg)' },
            },
          }}>
            <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.17">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#6B61DC"/>
            </svg>
          </Box>

          {/* Floating wand 9 - Tiny */}
          <Box sx={{ 
            position: 'absolute', 
            top: 80, 
            right: 650,
            animation: 'float9 36s ease-in-out infinite',
            '@keyframes float9': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-9px) rotate(4deg)' },
            },
          }}>
            <svg width="18" height="17" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.19">
              <path d="M23.0155 0H0.984773C-0.020997 0 -0.377873 1.33621 0.493168 1.84083L11.0168 7.93741V20.1318C11.0168 21.1411 12.3484 21.4992 12.8513 20.6251L23.8668 1.47958C24.2453 0.821849 23.7722 0 23.0155 0Z" fill="#C8C6F6"/>
            </svg>
          </Box>
        </Box>
        )}
      <Box 
        id="main-content"
        component="main"
        role="main"
        aria-label="Command Center Dashboard"
        sx={{
          maxWidth: customizeDrawerOpen
            ? `calc(100vw - 432px - max((100vw - ${cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}px) / 2, 0px))`
            : cdsDesignTokens.foundations.layout.breakpoints.desktop.wide,
          ml: customizeDrawerOpen
            ? `max(calc((100vw - ${cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}px) / 2), 0px)`
            : 'auto',
          mr: customizeDrawerOpen ? '432px' : 'auto',
          position: 'relative', 
          zIndex: 1,
          pointerEvents: 'auto',
          transition: 'max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1), margin-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        opacity: contentVisible && sectionIndex >= 0 ? 1 : 0,
        transform: contentVisible && sectionIndex >= 0 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        position: 'relative',
      }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Typography 
            component="span"
            sx={{ 
              fontSize: '2rem', 
              fontWeight: 400, 
              color: 'text.primary',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {greeting.split('').map((char, i) => {
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              const totalChars = greeting.length;
              const delay = i * 0.012; // 12ms between each character (slower wave)
              const duration = 1.4; // Each character glows for 1400ms (slower, more gentle)
              
              return (
                <Box
                  key={i}
                  component="span"
                  sx={{
                    display: 'inline-block',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                    animation: !prefersReducedMotion && contentVisible && sectionIndex >= 0 
                      ? `letterGlow ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s forwards` 
                      : 'none',
                    '@keyframes letterGlow': {
                      '0%': {
                        textShadow: '0 0 0px rgba(75, 63, 255, 0)',
                        color: 'text.primary',
                        filter: 'brightness(1)',
                      },
                      '15%': {
                        textShadow: `
                          0 0 2px rgba(75, 63, 255, 0.18),
                          0 0 5px rgba(91, 82, 214, 0.1)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.03)',
                      },
                      '30%': {
                        textShadow: `
                          0 0 3px rgba(75, 63, 255, 0.28),
                          0 0 6px rgba(91, 82, 214, 0.16),
                          0 0 10px rgba(124, 115, 230, 0.08)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.06)',
                      },
                      '45%': {
                        textShadow: `
                          0 0 3px rgba(75, 63, 255, 0.25),
                          0 0 6px rgba(91, 82, 214, 0.14)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.05)',
                      },
                      '60%': {
                        textShadow: `
                          0 0 2px rgba(75, 63, 255, 0.22),
                          0 0 5px rgba(91, 82, 214, 0.12)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.04)',
                      },
                      '75%': {
                        textShadow: `
                          0 0 2px rgba(75, 63, 255, 0.15),
                          0 0 4px rgba(91, 82, 214, 0.08)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.02)',
                      },
                      '90%': {
                        textShadow: `
                          0 0 1px rgba(75, 63, 255, 0.08)
                        `,
                        color: 'text.primary',
                        filter: 'brightness(1.01)',
                      },
                      '100%': {
                        textShadow: '0 0 0px rgba(75, 63, 255, 0)',
                        color: 'text.primary',
                        filter: 'brightness(1)',
                      },
                    },
                  }}
                >
                  {char}
                </Box>
              );
            })}
          </Typography>
        </Box>
        {customizeDrawerOpen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={undo}
              disabled={!canUndo}
              size="small"
              sx={{
                color: canUndo ? 'primary.main' : 'text.disabled',
                '&:hover': { bgcolor: 'rgba(91, 82, 214, 0.08)' },
              }}
            >
              <Undo sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={redo}
              disabled={!canRedo}
              size="small"
              sx={{
                color: canRedo ? 'primary.main' : 'text.disabled',
                '&:hover': { bgcolor: 'rgba(91, 82, 214, 0.08)' },
              }}
            >
              <Redo sx={{ fontSize: 20 }} />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCustomizeDrawerOpen(false)}
            >
              Save Home
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Tune sx={{ fontSize: 16 }} />}
            onClick={() => setCustomizeDrawerOpen(true)}
            sx={{
              textTransform: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              borderColor: 'divider',
              color: 'text.primary',
              px: 2,
              py: 0.75,
            }}
          >
            Customize
          </Button>
        )}
      </Box>

      {/* UNIFIED DASHBOARD GRID - All cards are draggable */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-cards" direction="vertical">
          {(provided, snapshot) => (
            <Box 
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(12, 1fr)', 
                gridAutoRows: '64px', // Base row: 64px (8×8) - titles get 1 row, cards span multiple
                gridAutoFlow: 'row dense', // Dense packing for KPI stacking
                gap: 2, // 16px (2×8)
                mb: 3,
                opacity: contentVisible && sectionIndex >= 1 ? 1 : 0,
                transform: contentVisible && sectionIndex >= 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease-out 0.15s, transform 0.5s ease-out 0.15s',
                bgcolor: snapshot.isDraggingOver ? 'rgba(91, 82, 214, 0.06)' : 'transparent',
                borderRadius: '4px',
                p: snapshot.isDraggingOver ? 2 : 0,
              }}
            >
              {/* All cards from normalized data - fully draggable */}
              {currentCards.map((card, index) => (
                <Draggable 
                  key={card.id} 
                  draggableId={card.id} 
                  index={index}
                  isDragDisabled={!customizeDrawerOpen}
                >
                  {(provided, snapshot) => (
                    <DraggableDashboardCard
                      card={card}
                      index={index}
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      isEditMode={customizeDrawerOpen}
                      onTitleChange={handleTitleChange}
                      onRemove={handleRemoveCard}
                      onSizeToggle={handleSizeToggle}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* All sections are now rendered through the unified grid above */}
      </Box>
      {/* End Main Content */}
      </Box>

      {/* Customize Command Center Drawer */}
      <Drawer
        anchor="right"
        open={customizeDrawerOpen}
        onClose={() => setCustomizeDrawerOpen(false)}
        hideBackdrop
        disablePortal
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          style: { pointerEvents: 'none' },
        }}
        PaperProps={{
          style: { pointerEvents: 'auto' },
        }}
        sx={{
          pointerEvents: 'none',
          zIndex: 1200,
          '& .MuiDrawer-paper': {
            width: 400,
            top: 56,
            height: 'calc(100vh - 56px)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: 'none',
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
            pointerEvents: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: -32,
              width: 32,
              height: '100%',
              background: 'linear-gradient(to left, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.04), transparent)',
              pointerEvents: 'none',
            },
            animation: customizeDrawerOpen ? 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ px: 3, pt: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'text.primary' }}>
                Customize Command Center
              </Typography>
              <IconButton
                size="small"
                onClick={() => setCustomizeDrawerOpen(false)}
                sx={{ color: 'text.secondary' }}
              >
                <ChevronRight sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
            
            {/* Tabs */}
            <Tabs
              value={customizeTab}
              onChange={(_, newValue) => setCustomizeTab(newValue)}
              sx={{
                minHeight: 40,
                borderBottom: '1px solid #e0e0e0',
                mx: -3,
                px: 3,
                '& .MuiTab-root': {
                  minHeight: 40,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  px: 0,
                  mr: 3,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              <Tab label="Explore by Widget" />
              <Tab label="Explore by Layout" />
            </Tabs>
          </Box>

          {/* Search */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              placeholder="Search"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Widget List */}
          {customizeTab === 0 && (
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {[
                { icon: <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />, title: 'Aging Report - Active Requests', id: 'aging-report' },
                { icon: <ShowChart sx={{ fontSize: 20, color: 'text.secondary' }} />, title: 'Budget vs Variance Analysis', id: 'budget-variance' },
                { icon: <Add sx={{ fontSize: 20, color: 'text.secondary' }} />, title: 'Contracts Nearing 90% Spend Limit', id: 'contracts-90' },
                { icon: <Payment sx={{ fontSize: 20, color: 'text.secondary' }} />, title: 'Total Billed by Service', id: 'total-billed' },
                { icon: <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />, title: 'Receipts by Payment Method', id: 'receipts-payment' },
              ].map((widget, index) => (
                <Box
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('widget', JSON.stringify({ id: widget.id, title: widget.title }));
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'grab',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'grey.50',
                      boxShadow: '0 2px 8px rgba(67, 83, 255, 0.15)',
                    },
                    '&:active': {
                      cursor: 'grabbing',
                      opacity: 0.8,
                    },
                  }}
                >
                  {/* Drag Handle */}
                  <DragIndicator sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
                  
                  {/* Widget Icon */}
                  <Box sx={{ flexShrink: 0 }}>
                    {widget.icon}
                  </Box>
                  
                  {/* Widget Title */}
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'text.primary', flex: 1 }}>
                    {widget.title}
                  </Typography>
                  
                  {/* Add Button */}
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add widget to dashboard
                      const newCard: DashboardCardData = {
                        id: `${widget.id}-${Date.now()}`,
                        title: widget.title,
                        type: 'kpi',
                        content: <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: 'primary.main' }}>--</Typography>,
                        gridColumn: 4,
                        section: 'custom',
                      };
                      updateDashboardCards([...(dashboardCards.length ? dashboardCards : initialDashboardCards), newCard]);
                    }}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      fontWeight: 600,
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(67, 83, 255, 0.08)',
                      },
                    }}
                  >
                    + Add
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {customizeTab === 1 && (
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 4 }}>
                Layout customization options coming soon
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default CommandCenterPage;
