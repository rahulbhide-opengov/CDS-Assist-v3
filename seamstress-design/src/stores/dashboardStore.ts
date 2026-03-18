import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Widget, GridPosition } from '../types/dashboard.types';
import { getWorkOrdersByStatus, getWorkOrdersByPriority, mockWorkOrders } from '../data/mock/eam-work-orders';

// Default widgets for EAM Dashboard
const createDefaultWidgets = (): Widget[] => [
  // Row 1: Key Metrics (4 cards)
  {
    id: 'metric-active',
    type: 'metric',
    title: 'Active Work Orders',
    source: 'default',
    value: 35,
    change: '+3 from last week',
    trend: 'up',
    color: 'blue',
    createdAt: new Date(),
    gridPosition: { x: 0, y: 0, w: 3, h: 2 }
  },
  {
    id: 'metric-overdue',
    type: 'metric',
    title: 'Overdue',
    source: 'default',
    value: 3,
    trend: 'alert',
    color: 'red',
    createdAt: new Date(),
    gridPosition: { x: 3, y: 0, w: 3, h: 2 }
  },
  {
    id: 'metric-completion',
    type: 'metric',
    title: 'Avg Completion Time',
    source: 'default',
    value: '4.2 days',
    change: '↓ 0.8 days',
    trend: 'down',
    color: 'green',
    createdAt: new Date(),
    gridPosition: { x: 6, y: 0, w: 3, h: 2 }
  },
  {
    id: 'metric-maintenance',
    type: 'metric',
    title: 'Assets Due for Maintenance',
    source: 'default',
    value: 12,
    change: 'Next 30 days',
    color: 'orange',
    createdAt: new Date(),
    gridPosition: { x: 9, y: 0, w: 3, h: 2 }
  },

  // Row 2: Core Charts (2 columns)
  {
    id: 'chart-status',
    type: 'chart',
    chartType: 'bar',
    title: 'Work Orders by Status',
    source: 'default',
    data: getWorkOrdersByStatus(),
    chartConfig: {
      xField: 'name',
      yField: 'value',
      showLegend: false,
      showGrid: true
    },
    createdAt: new Date(),
    gridPosition: { x: 0, y: 2, w: 6, h: 4 }
  },
  {
    id: 'chart-priority',
    type: 'chart',
    chartType: 'donut',
    title: 'Priority Distribution',
    source: 'default',
    data: getWorkOrdersByPriority(),
    chartConfig: {
      showLegend: true
    },
    createdAt: new Date(),
    gridPosition: { x: 6, y: 2, w: 6, h: 4 }
  },

  // Row 3: Recent Activity (Full width)
  {
    id: 'table-recent',
    type: 'table',
    title: 'Recent Work Orders',
    source: 'default',
    columns: [
      { key: 'id', label: 'WO #', width: '100px', sortable: true },
      { key: 'description', label: 'Description', sortable: true },
      { key: 'status', label: 'Status', width: '120px', sortable: true },
      { key: 'priority', label: 'Priority', width: '100px', sortable: true },
      { key: 'assigned_to', label: 'Assignee', width: '140px', sortable: true },
      { key: 'due_date', label: 'Due Date', width: '120px', sortable: true }
    ],
    data: mockWorkOrders.slice(0, 10),
    rowsPerPage: 10,
    createdAt: new Date(),
    gridPosition: { x: 0, y: 6, w: 12, h: 4 }
  }
];

interface DashboardStore {
  widgets: Widget[];
  selectedWidget: string | null;

  // Actions
  addWidget: (widget: Omit<Widget, 'id' | 'createdAt'>) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  updateLayout: (widgetId: string, position: GridPosition) => void;
  selectWidget: (widgetId: string | null) => void;
  resetToDefaults: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      widgets: createDefaultWidgets(),
      selectedWidget: null,

      addWidget: (widgetData) => {
        const newWidget: Widget = {
          ...widgetData,
          id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date()
        } as Widget;

        // Calculate position for new widget (add to bottom)
        const currentWidgets = get().widgets;
        const maxY = Math.max(...currentWidgets.map(w => w.gridPosition.y + w.gridPosition.h), 0);
        newWidget.gridPosition = {
          x: 0,
          y: maxY,
          w: newWidget.gridPosition?.w || 6,
          h: newWidget.gridPosition?.h || 4
        };

        set({ widgets: [...currentWidgets, newWidget] });
      },

      removeWidget: (widgetId) => {
        set({ widgets: get().widgets.filter(w => w.id !== widgetId) });
      },

      updateWidget: (widgetId, updates) => {
        set({
          widgets: get().widgets.map(w =>
            w.id === widgetId ? { ...w, ...updates } as Widget : w
          )
        });
      },

      updateLayout: (widgetId, position) => {
        set({
          widgets: get().widgets.map(w =>
            w.id === widgetId ? { ...w, gridPosition: position } : w
          )
        });
      },

      selectWidget: (widgetId) => {
        set({ selectedWidget: widgetId });
      },

      resetToDefaults: () => {
        set({ widgets: createDefaultWidgets(), selectedWidget: null });
      }
    }),
    {
      name: 'eam-dashboard-storage',
      version: 1
    }
  )
);
