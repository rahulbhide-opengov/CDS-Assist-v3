// Dashboard widget type definitions for EAM Dashboard

export interface GridPosition {
  x: number;  // column position (0-11 for 12-column grid)
  y: number;  // row position
  w: number;  // width (1-12)
  h: number;  // height (grid units)
}

export interface BaseWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map';
  title: string;
  source: 'default' | 'agent-generated';
  conversationId?: string;
  createdAt: Date;
  gridPosition: GridPosition;
}

export interface MetricWidget extends BaseWidget {
  type: 'metric';
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | 'alert';
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
}

export interface ChartWidget extends BaseWidget {
  type: 'chart';
  chartType: 'pie' | 'donut' | 'line' | 'bar' | 'area';
  data: any[];
  chartConfig?: ChartOptions;
}

export interface ChartOptions {
  xField?: string;
  yField?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export interface TableWidget extends BaseWidget {
  type: 'table';
  columns: ColumnDef[];
  data: any[];
  rowsPerPage?: number;
}

export interface ColumnDef {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface MapWidget extends BaseWidget {
  type: 'map';
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
  color?: string;
}

export type Widget = MetricWidget | ChartWidget | TableWidget | MapWidget;

export interface DashboardState {
  widgets: Widget[];
  layout: GridPosition[];
  selectedWidget: string | null;
}

export interface DashboardActions {
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  updateLayout: (layout: GridPosition[]) => void;
  selectWidget: (widgetId: string | null) => void;
  resetToDefaults: () => void;
}
