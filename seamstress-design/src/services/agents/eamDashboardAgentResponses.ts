// EAM Dashboard Assistant Demo Scenario
// Linear demo: Facilities manager adds custom visualizations through conversation

export interface EAMDashboardResponse {
  content: string;
  followUpSuggestions?: string[];
  agentName?: string;
  skillName?: string;
  isFinalMessage?: boolean;
  suggestedWidget?: {
    spec: any; // Widget specification for dashboard
    buttonText: string; // Text for the action button
    description: string; // Description of what will be added
    visualizationData?: { // Data for rendering in chat (generative UI)
      type: 'chart' | 'table' | 'map';
      title: string;
      data: any[];
      chartType?: 'pie' | 'line' | 'bar' | 'donut';
      chartConfig?: any;
      columns?: any[];
    };
  };
}

// Step 1: Initial work order overview with suggestion to add breakdown
export const step1WorkOrderOverview: EAMDashboardResponse = {
  content: `I can see you have **47 active work orders** across your facilities. Let me give you a quick overview:

## Current Status
- **Open**: 12 work orders
- **Scheduled**: 8 work orders
- **In Progress**: 15 work orders
- **Completed (this week)**: 12 work orders

## Priority Breakdown
- **Urgent**: 3 items (including **3 overdue**)
- **High**: 10 items
- **Medium**: 16 items
- **Low**: 18 items

Your dashboard already shows key metrics, but I can add more detailed visualizations to help you understand the situation better.

Here's a visual breakdown of your work orders by status:`,
  followUpSuggestions: [
    "Yes, add this to my dashboard",
    "Show me completion trends over time"
  ],
  agentName: "EAM Dashboard Assistant",
  skillName: "Work Order Analysis",
  suggestedWidget: {
    spec: {
      type: 'chart',
      chartType: 'pie',
      title: 'Work Orders by Status',
      dataQuery: {
        entity: 'work_order',
        groupBy: 'status'
      }
    },
    buttonText: 'Add to Dashboard',
    description: 'Shows work order distribution by status as a pie chart',
    visualizationData: {
      type: 'chart',
      chartType: 'pie',
      title: 'Work Orders by Status',
      data: [
        { name: 'Open', value: 12, fill: '#0288d1' },
        { name: 'Scheduled', value: 8, fill: '#4b3fff' },
        { name: 'In Progress', value: 15, fill: '#ed6c02' },
        { name: 'Completed', value: 12, fill: '#2e7d32' }
      ],
      chartConfig: { showLegend: true }
    }
  }
};

// Step 2: Suggest completion trends
export const step2StatusBreakdown: EAMDashboardResponse = {
  content: `Great! Looking at your work orders, I can also help you understand completion patterns over time.

Tracking completion trends helps you:
- Forecast capacity and resource needs
- Identify seasonal patterns
- Monitor team performance
- Plan for busy periods

Here's your completion trend over the last 6 months:`,
  followUpSuggestions: [
    "Add this to my dashboard",
    "Show me overdue work orders"
  ],
  agentName: "EAM Dashboard Assistant",
  skillName: "Trend Analysis",
  suggestedWidget: {
    spec: {
      type: 'chart',
      chartType: 'line',
      title: 'Completion Trends (6 Months)',
      dataQuery: {
        entity: 'work_order',
        groupBy: 'month',
        filters: { status: ['completed'] }
      }
    },
    buttonText: 'Add to Dashboard',
    description: 'Shows work order completions over the last 6 months',
    visualizationData: {
      type: 'chart',
      chartType: 'line',
      title: 'Completion Trends (6 Months)',
      data: [
        { month: 'Apr', completions: 45 },
        { month: 'May', completions: 52 },
        { month: 'Jun', completions: 48 },
        { month: 'Jul', completions: 61 },
        { month: 'Aug', completions: 55 },
        { month: 'Sep', completions: 58 }
      ],
      chartConfig: {
        xField: 'month',
        yField: 'completions',
        showGrid: true,
        showLegend: false
      }
    }
  }
};

// Step 3: Suggest overdue items table
export const step3CompletionTrends: EAMDashboardResponse = {
  content: `Perfect! Now, let me help you identify items that need immediate attention.

⚠️ I've detected **3 high-priority work orders that are currently overdue**:

1. **WO-2001**: HVAC Repair - City Hall (overdue by 5 days)
2. **WO-2002**: Streetlight Outage - Main St intersection (overdue by 2 days)
3. **WO-2003**: Water Leak - Community Center Pool (overdue by 1 day)

These require immediate attention to avoid service disruptions.

Here's a detailed view of all overdue work orders:`,
  followUpSuggestions: [
    "Add this to my dashboard",
    "Show me work orders on a map"
  ],
  agentName: "EAM Dashboard Assistant",
  skillName: "Priority Analysis",
  suggestedWidget: {
    spec: {
      type: 'table',
      title: 'Urgent Overdue Work Orders',
      dataQuery: {
        entity: 'work_order',
        filters: { overdue: true, priority: ['high', 'urgent'] }
      }
    },
    buttonText: 'Add to Dashboard',
    description: 'Shows high-priority work orders that are past due',
    visualizationData: {
      type: 'table',
      title: 'Urgent Overdue Work Orders',
      data: [
        { id: 'WO-2001', description: 'HVAC Repair - City Hall', priority: 'Urgent', assigned_to: 'Mike Chen', due_date: '5 days overdue' },
        { id: 'WO-2002', description: 'Streetlight Outage - Main St', priority: 'High', assigned_to: 'Sarah Johnson', due_date: '2 days overdue' },
        { id: 'WO-2003', description: 'Water Leak - Community Center', priority: 'Urgent', assigned_to: 'Tom Martinez', due_date: '1 day overdue' }
      ],
      columns: [
        { key: 'id', label: 'WO #', width: '100px' },
        { key: 'description', label: 'Description' },
        { key: 'priority', label: 'Priority', width: '100px' },
        { key: 'assigned_to', label: 'Assigned To', width: '140px' },
        { key: 'due_date', label: 'Due Date', width: '140px' }
      ]
    }
  }
};

// Step 4: Suggest geographic map
export const step4OverdueItems: EAMDashboardResponse = {
  content: `Good! Now let me help you visualize where your work orders are distributed across your facilities.

Understanding geographic patterns helps you:
- Optimize crew routing and reduce travel time
- Identify asset clusters that need attention
- Plan preventive maintenance by area
- Spot potential regional issues

Here's a geographic view of all open work orders with priority color-coding:`,
  followUpSuggestions: [
    "Add this map to my dashboard",
    "That's all I need for now"
  ],
  agentName: "EAM Dashboard Assistant",
  skillName: "Geographic Analysis",
  suggestedWidget: {
    spec: {
      type: 'map',
      title: 'Open Work Orders by Location',
      dataQuery: {
        entity: 'work_order',
        filters: {
          status: ['open', 'scheduled', 'in_progress']
        }
      }
    },
    buttonText: 'Add to Dashboard',
    description: 'Shows open work orders plotted on a map by location',
    visualizationData: {
      type: 'map',
      title: 'Open Work Orders by Location',
      data: [
        { id: 'WO-2001', lat: 42.3601, lng: -71.0589, priority: 'urgent', description: 'City Hall HVAC Repair' },
        { id: 'WO-2002', lat: 42.3605, lng: -71.0578, priority: 'high', description: 'Main St Streetlight' },
        { id: 'WO-2003', lat: 42.3590, lng: -71.0595, priority: 'urgent', description: 'Community Center Leak' },
        { id: 'WO-2004', lat: 42.3615, lng: -71.0570, priority: 'medium', description: 'Park Bench Repair' },
        { id: 'WO-2005', lat: 42.3580, lng: -71.0600, priority: 'low', description: 'Library AC Maintenance' }
      ]
    }
  }
};

// Step 5: Conclusion
export const step5GeographicMap: EAMDashboardResponse = {
  content: `Perfect! You now have a comprehensive operations dashboard tailored to your needs. 🎉

## What We Added

You can now see:
1. ✅ **Status Breakdown** - Visual distribution of work order statuses
2. ✅ **Completion Trends** - Performance tracking over 6 months
3. ✅ **Overdue Items** - High-priority items needing attention
4. ✅ **Geographic Map** - Spatial view of open work orders

## Quick Tips

- Each visualization updates in real-time with your data
- Click the "AI Generated" badges to see insights about each chart
- You can reset the dashboard anytime using the Reset button in the header
- Start a new conversation anytime to add more custom visualizations

Is there anything else you'd like to add or analyze?`,
  followUpSuggestions: [
    "No, this is perfect!",
    "Can you show me asset type breakdown?"
  ],
  agentName: "EAM Dashboard Assistant",
  skillName: "Dashboard Orchestration",
  isFinalMessage: false
};

// Response map for demo routing
export const eamDashboardResponses = {
  step1: step1WorkOrderOverview,
  step2: step2StatusBreakdown,
  step3: step3CompletionTrends,
  step4: step4OverdueItems,
  step5: step5GeographicMap
};
