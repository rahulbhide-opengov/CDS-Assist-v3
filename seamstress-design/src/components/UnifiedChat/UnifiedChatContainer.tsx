/**
 * UnifiedChatContainer
 *
 * Combined modal/docked/fullscreen container for the unified chat experience.
 * Merges functionality from WorkspaceChatModal and DockedWorkspaceChat.
 *
 * Features:
 * - Modal mode: Draggable, resizable with snap-to-edge indicators
 * - Docked mode: Fixed right sidebar with left-edge resize handle
 * - Fullscreen mode: Full viewport coverage
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Drawer, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { useUnifiedChat } from '../../contexts/UnifiedChatContext';
import UnifiedChatInterface from './UnifiedChatInterface';
import 'react-resizable/css/styles.css';

// Panel width constraints
const WORKSPACES_MIN = 300;
const WORKSPACES_MAX = 600;
const TASKS_MIN = 420;
const TASKS_MAX = 800;
const CHAT_MIN_WIDTH = 420;
const DIVIDER_WIDTH = 8;
const DOCKED_MIN = 600;

export const UnifiedChatContainer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isOpen,
    isDocked,
    isFullscreen,
    dockedWidth,
    showWorkspaces,
    showTasks,
    workspacesWidth,
    tasksWidth,
    closeChat,
    toggleDock,
    toggleFullscreen,
    setDockedWidth,
    toggleWorkspaces,
    toggleTasks,
    setWorkspacesWidth,
    setTasksWidth,
  } = useUnifiedChat();

  // Local state for dragging/resizing
  const [size, setSize] = useState({ width: CHAT_MIN_WIDTH, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [snapPosition, setSnapPosition] = useState<'none' | 'left' | 'right'>('none');
  const [dragDistance, setDragDistance] = useState({ left: 0, right: 0 });
  const [isResizing, setIsResizing] = useState<'workspaces' | 'tasks' | 'docked' | null>(null);

  // Animation state for smooth open/close transitions
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs
  const draggableNodeRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Handle open/close animation
  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;

    if (isOpen && isDocked) {
      // Opening: render at width 0, then after a tick animate to full width
      setIsVisible(true);
      setIsAnimating(false); // Ensure we start at width 0
      // Use setTimeout to ensure the browser has painted at width 0
      openTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 20);
    } else if (!isOpen && isDocked) {
      // Closing: animate to width 0, then remove from DOM
      setIsAnimating(false);
      closeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 350); // Match transition duration
    } else if (!isDocked) {
      // Non-docked mode: no animation needed
      setIsVisible(isOpen);
      setIsAnimating(isOpen);
    }

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, isDocked]);

  // Calculate modal width based on visible panels
  const calculateModalWidth = (workspaces: boolean, tasks: boolean) => {
    let width = CHAT_MIN_WIDTH;
    if (workspaces) width += workspacesWidth + DIVIDER_WIDTH;
    if (tasks) width += tasksWidth + DIVIDER_WIDTH;
    return width;
  };

  // Calculate docked max width
  const DOCKED_MAX = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200;

  // Handle resize start for internal panels
  const handleResizeStart = (panel: 'workspaces' | 'tasks' | 'docked', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(panel);
    resizeStartX.current = e.clientX;
    if (panel === 'docked') {
      resizeStartWidth.current = dockedWidth;
    } else {
      resizeStartWidth.current = panel === 'workspaces' ? workspacesWidth : tasksWidth;
    }
  };

  // Handle resize move
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;

      if (isResizing === 'docked') {
        // Resizing docked container from left edge - negative delta increases width
        const newWidth = Math.max(DOCKED_MIN, Math.min(DOCKED_MAX, resizeStartWidth.current - delta));
        setDockedWidth(newWidth);
      } else if (isResizing === 'workspaces') {
        // Resizing workspaces panel - grows to the right
        const newWidth = Math.max(WORKSPACES_MIN, Math.min(WORKSPACES_MAX, resizeStartWidth.current + delta));
        setWorkspacesWidth(newWidth);
      } else if (isResizing === 'tasks') {
        // Resizing tasks panel - grows to the left
        const newWidth = Math.max(TASKS_MIN, Math.min(TASKS_MAX, resizeStartWidth.current - delta));
        setTasksWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setDockedWidth, setWorkspacesWidth, setTasksWidth]);

  // Update modal size when panels are toggled (not when resizing)
  useEffect(() => {
    if (isFullscreen || snapPosition !== 'none' || isResizing || isDocked) return;

    const newWidth = calculateModalWidth(showWorkspaces, showTasks);
    const widthDiff = newWidth - size.width;

    setSize(prev => ({ ...prev, width: newWidth }));

    // Adjust position to keep modal centered when width changes
    setPosition(prev => ({
      x: prev.x - widthDiff / 2,
      y: prev.y,
    }));
  }, [showWorkspaces, showTasks]);

  // Center modal when first opening
  useEffect(() => {
    if (isOpen && !isDocked && !isFullscreen) {
      const initialWidth = CHAT_MIN_WIDTH;
      const centerX = window.innerWidth / 2 - initialWidth / 2;
      const centerY = window.innerHeight / 2 - 300;
      setPosition({ x: centerX, y: centerY });
      setSize({ width: initialWidth, height: 600 });
      setSnapPosition('none');
    }
  }, [isOpen, isDocked, isFullscreen]);

  // Handle fullscreen size
  useEffect(() => {
    if (isFullscreen) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setSnapPosition('none');
    }
  }, [isFullscreen]);

  // Drag handlers
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_e: any, data: any) => {
    const SHADOW_START_DISTANCE = 200;

    const leftDistance = data.x;
    const rightDistance = window.innerWidth - (data.x + size.width);

    // Calculate shadow intensity (0 to 1)
    const leftIntensity = Math.max(0, Math.min(1, (SHADOW_START_DISTANCE - leftDistance) / SHADOW_START_DISTANCE));
    const rightIntensity = Math.max(0, Math.min(1, (SHADOW_START_DISTANCE - rightDistance) / SHADOW_START_DISTANCE));

    setDragDistance({ left: leftIntensity, right: rightIntensity });
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: any, data: any) => {
    setIsDragging(false);
    setDragDistance({ left: 0, right: 0 });

    const SNAP_THRESHOLD = 100;
    const leftDistance = data.x;
    const rightDistance = window.innerWidth - (data.x + size.width);

    // Snap to left
    if (leftDistance < SNAP_THRESHOLD) {
      setSnapPosition('left');
      setPosition({ x: 0, y: data.y });
    }
    // Snap to right
    else if (rightDistance < SNAP_THRESHOLD) {
      setSnapPosition('right');
      setPosition({ x: window.innerWidth - size.width, y: data.y });
    }
    // No snap
    else {
      setSnapPosition('none');
      setPosition({ x: data.x, y: data.y });
    }
  };

  // Handle outer modal resize
  const handleResize = (_event: any, { size: newSize }: any) => {
    setSize({ width: newSize.width, height: newSize.height });
  };

  // Handle toggle dock - exits modal mode, enters docked mode
  const handleToggleDock = () => {
    toggleDock();
    if (!isDocked) {
      // Entering docked mode
      setSnapPosition('none');
    } else {
      // Exiting docked mode - return to center
      const centerX = window.innerWidth / 2 - 300;
      const centerY = window.innerHeight / 2 - 300;
      setPosition({ x: centerX, y: centerY });
      setSize({ width: 600, height: 600 });
    }
  };

  // Handle toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      toggleFullscreen();
    } else {
      // Exit fullscreen - return to center
      toggleFullscreen();
      const centerX = window.innerWidth / 2 - 300;
      const centerY = window.innerHeight / 2 - 300;
      setPosition({ x: centerX, y: centerY });
      setSize({ width: 600, height: 600 });
    }
  };

  // For non-docked modes, use simple visibility check
  if (!isDocked && !isOpen) return null;

  // For docked mode, use animation-aware visibility
  if (isDocked && !isVisible) return null;

  // =========================================================================
  // Mobile Mode (Full-screen overlay drawer)
  // =========================================================================
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeChat}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              bgcolor: 'background.secondary',
            },
          },
        }}
      >
        {/* Chat Interface - No header on mobile */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <UnifiedChatInterface
            onClose={closeChat}
            onToggleDock={undefined}
            onToggleFullscreen={undefined}
            isDocked={false}
            isFullscreen={false}
            showWorkspaces={false}
            showTasks={false}
            onWorkspacesChange={toggleWorkspaces}
            onTasksChange={toggleTasks}
            workspacesWidth={workspacesWidth}
            tasksWidth={tasksWidth}
            onResizeStart={() => {}}
            isMobile={true}
          />
        </Box>
      </Drawer>
    );
  }

  // =========================================================================
  // Docked Mode (Sidebar - part of flex layout, not overlay)
  // =========================================================================
  if (isDocked) {
    return (
      <Box
        sx={{
          width: isAnimating ? `${dockedWidth}px` : '0px',
          flexShrink: 0,
          borderLeft: isAnimating ? 1 : 0,
          borderColor: 'divider',
          bgcolor: 'background.secondary',
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
          transition: isResizing ? 'none' : 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Docked Container Resize Handle */}
        <Box
          onMouseDown={(e) => handleResizeStart('docked', e)}
          sx={{
            width: '8px',
            cursor: 'col-resize',
            bgcolor: 'divider',
            '&:hover': {
              bgcolor: 'rgb(100, 116, 139)',
            },
            transition: 'background-color 0.2s',
            flexShrink: 0,
            zIndex: 10,
          }}
        />

        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: isAnimating ? '0.05s' : '0s',
        }}>
          <UnifiedChatInterface
            onClose={closeChat}
            onToggleDock={handleToggleDock}
            onToggleFullscreen={handleToggleFullscreen}
            isDocked={isDocked}
            isFullscreen={isFullscreen}
            showWorkspaces={showWorkspaces}
            showTasks={showTasks}
            onWorkspacesChange={toggleWorkspaces}
            onTasksChange={toggleTasks}
            workspacesWidth={workspacesWidth}
            tasksWidth={tasksWidth}
            onResizeStart={handleResizeStart}
          />
        </Box>
      </Box>
    );
  }

  // =========================================================================
  // Modal Mode (including Fullscreen)
  // =========================================================================
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        pointerEvents: 'none',
      }}
    >
      {/* Left snap indicator */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: `${position.y}px`,
          height: `${size.height}px`,
          width: '80px',
          bgcolor: 'rgb(100, 116, 139)',
          opacity: dragDistance.left * 0.5,
          filter: 'blur(20px)',
          transition: isDragging ? 'none' : 'opacity 0.2s, top 0.1s, height 0.1s',
          pointerEvents: 'none',
        }}
      />

      {/* Right snap indicator */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: `${position.y}px`,
          height: `${size.height}px`,
          width: '80px',
          bgcolor: 'rgb(100, 116, 139)',
          opacity: dragDistance.right * 0.5,
          filter: 'blur(20px)',
          transition: isDragging ? 'none' : 'opacity 0.2s, top 0.1s, height 0.1s',
          pointerEvents: 'none',
        }}
      />

      <Draggable
        handle="#chat-drag-handle"
        bounds="parent"
        position={position}
        onStart={handleDragStart}
        onDrag={handleDrag}
        onStop={handleDragStop}
        nodeRef={draggableNodeRef}
        disabled={isFullscreen}
      >
        <Box ref={draggableNodeRef} sx={{ position: 'absolute', pointerEvents: 'all' }}>
          <Resizable
            width={size.width}
            height={size.height}
            onResize={handleResize}
            minConstraints={[400, 400]}
            maxConstraints={[1600, 1000]}
            resizeHandles={isFullscreen ? [] : ['se', 'sw', 's', 'e', 'w']}
          >
            <Box
              sx={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                borderRadius: isFullscreen
                  ? 0
                  : snapPosition === 'left'
                    ? '0 24px 24px 0'
                    : snapPosition === 'right'
                      ? '24px 0 0 24px'
                      : '24px',
                boxShadow: isDragging ? 3 : isFullscreen ? 0 : 24,
                bgcolor: 'background.secondary',
                border: isFullscreen ? 0 : 1,
                borderColor: 'divider',
                overflow: 'hidden',
                transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s, border-radius 0.3s',
                '& .react-resizable-handle': {
                  position: 'absolute',
                  zIndex: 10,
                  opacity: 0,
                },
                '& .react-resizable-handle-se': {
                  bottom: 0,
                  right: 0,
                  cursor: 'se-resize',
                  width: '20px',
                  height: '20px',
                },
                '& .react-resizable-handle-sw': {
                  bottom: 0,
                  left: 0,
                  cursor: 'sw-resize',
                  width: '20px',
                  height: '20px',
                },
                '& .react-resizable-handle-s': {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  cursor: 's-resize',
                  height: '10px',
                },
                '& .react-resizable-handle-e': {
                  right: 0,
                  top: 0,
                  bottom: 0,
                  cursor: 'e-resize',
                  width: '10px',
                },
                '& .react-resizable-handle-w': {
                  left: 0,
                  top: 0,
                  bottom: 0,
                  cursor: 'w-resize',
                  width: '10px',
                },
              }}
            >
              <UnifiedChatInterface
                onClose={closeChat}
                onToggleDock={handleToggleDock}
                onToggleFullscreen={handleToggleFullscreen}
                isDocked={isDocked}
                isFullscreen={isFullscreen}
                showWorkspaces={showWorkspaces}
                showTasks={showTasks}
                onWorkspacesChange={toggleWorkspaces}
                onTasksChange={toggleTasks}
                workspacesWidth={workspacesWidth}
                tasksWidth={tasksWidth}
                onResizeStart={handleResizeStart}
              />
            </Box>
          </Resizable>
        </Box>
      </Draggable>
    </Box>
  );
};

export default UnifiedChatContainer;
