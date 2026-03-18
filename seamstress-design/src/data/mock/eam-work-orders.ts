// Mock work order data for EAM Dashboard Demo
// 47 realistic work orders with variety in status, priority, location

export interface WorkOrder {
  id: string;
  description: string;
  status: 'open' | 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  asset_type: 'HVAC' | 'Electrical' | 'Plumbing' | 'Grounds' | 'Structural' | 'Parking' | 'Lighting';
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  assigned_to: string;
  created_at: string;
  due_date: string;
  completed_at?: string;
  is_overdue: boolean;
}

// Helper to calculate dates
const today = new Date('2025-10-20');
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const daysFromNow = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockWorkOrders: WorkOrder[] = [
  // 3 OVERDUE HIGH-PRIORITY (for demo step 4)
  {
    id: 'WO-2001',
    description: 'HVAC Repair - City Hall',
    status: 'open',
    priority: 'high',
    asset_type: 'HVAC',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(12),
    due_date: daysAgo(5),
    is_overdue: true
  },
  {
    id: 'WO-2002',
    description: 'Streetlight Outage - Main St & Oak Ave',
    status: 'open',
    priority: 'high',
    asset_type: 'Lighting',
    location: { name: 'Main St & Oak Ave', lat: 42.3615, lng: -71.0600 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(5),
    due_date: daysAgo(2),
    is_overdue: true
  },
  {
    id: 'WO-2003',
    description: 'Water Leak - Community Center Pool',
    status: 'open',
    priority: 'high',
    asset_type: 'Plumbing',
    location: { name: 'Community Center', lat: 42.3590, lng: -71.0575 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(4),
    due_date: daysAgo(1),
    is_overdue: true
  },

  // 9 MORE OPEN (total 12 open)
  {
    id: 'WO-2004',
    description: 'Playground Equipment Inspection',
    status: 'open',
    priority: 'medium',
    asset_type: 'Grounds',
    location: { name: 'Riverside Park', lat: 42.3580, lng: -71.0620 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(3),
    due_date: daysFromNow(7),
    is_overdue: false
  },
  {
    id: 'WO-2005',
    description: 'Fire Alarm System Testing',
    status: 'open',
    priority: 'high',
    asset_type: 'Electrical',
    location: { name: 'Public Library', lat: 42.3595, lng: -71.0610 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(2),
    due_date: daysFromNow(5),
    is_overdue: false
  },
  {
    id: 'WO-2006',
    description: 'Roof Leak Investigation',
    status: 'open',
    priority: 'medium',
    asset_type: 'Structural',
    location: { name: 'Fire Station #3', lat: 42.3625, lng: -71.0580 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(1),
    due_date: daysFromNow(10),
    is_overdue: false
  },
  {
    id: 'WO-2007',
    description: 'Parking Lot Pothole Repair',
    status: 'open',
    priority: 'low',
    asset_type: 'Parking',
    location: { name: 'Municipal Parking Lot A', lat: 42.3605, lng: -71.0595 },
    assigned_to: 'David Lee',
    created_at: daysAgo(7),
    due_date: daysFromNow(14),
    is_overdue: false
  },
  {
    id: 'WO-2008',
    description: 'Landscaping - Trim Overgrown Trees',
    status: 'open',
    priority: 'low',
    asset_type: 'Grounds',
    location: { name: 'Veterans Memorial', lat: 42.3570, lng: -71.0615 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(5),
    due_date: daysFromNow(12),
    is_overdue: false
  },
  {
    id: 'WO-2009',
    description: 'Electrical Panel Upgrade',
    status: 'open',
    priority: 'medium',
    asset_type: 'Electrical',
    location: { name: 'Senior Center', lat: 42.3585, lng: -71.0625 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(4),
    due_date: daysFromNow(8),
    is_overdue: false
  },
  {
    id: 'WO-2010',
    description: 'Restroom Plumbing Maintenance',
    status: 'open',
    priority: 'medium',
    asset_type: 'Plumbing',
    location: { name: 'Sports Complex', lat: 42.3575, lng: -71.0605 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(6),
    due_date: daysFromNow(6),
    is_overdue: false
  },
  {
    id: 'WO-2011',
    description: 'Security Lighting Installation',
    status: 'open',
    priority: 'medium',
    asset_type: 'Lighting',
    location: { name: 'Parking Garage B', lat: 42.3610, lng: -71.0585 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(8),
    due_date: daysFromNow(9),
    is_overdue: false
  },
  {
    id: 'WO-2012',
    description: 'Door Lock Replacement',
    status: 'open',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Recreation Center', lat: 42.3565, lng: -71.0595 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(9),
    due_date: daysFromNow(15),
    is_overdue: false
  },

  // 8 SCHEDULED
  {
    id: 'WO-2013',
    description: 'Monthly HVAC Filter Replacement',
    status: 'scheduled',
    priority: 'medium',
    asset_type: 'HVAC',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(10),
    due_date: daysFromNow(2),
    is_overdue: false
  },
  {
    id: 'WO-2014',
    description: 'Elevator Annual Inspection',
    status: 'scheduled',
    priority: 'high',
    asset_type: 'Structural',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(15),
    due_date: daysFromNow(3),
    is_overdue: false
  },
  {
    id: 'WO-2015',
    description: 'Generator Load Testing',
    status: 'scheduled',
    priority: 'medium',
    asset_type: 'Electrical',
    location: { name: 'Emergency Operations Center', lat: 42.3620, lng: -71.0570 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(12),
    due_date: daysFromNow(4),
    is_overdue: false
  },
  {
    id: 'WO-2016',
    description: 'Sprinkler System Seasonal Maintenance',
    status: 'scheduled',
    priority: 'low',
    asset_type: 'Plumbing',
    location: { name: 'Town Square', lat: 42.3600, lng: -71.0590 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(11),
    due_date: daysFromNow(5),
    is_overdue: false
  },
  {
    id: 'WO-2017',
    description: 'Parking Lot Line Repainting',
    status: 'scheduled',
    priority: 'low',
    asset_type: 'Parking',
    location: { name: 'Municipal Parking Lot B', lat: 42.3615, lng: -71.0605 },
    assigned_to: 'David Lee',
    created_at: daysAgo(14),
    due_date: daysFromNow(6),
    is_overdue: false
  },
  {
    id: 'WO-2018',
    description: 'Traffic Signal Maintenance',
    status: 'scheduled',
    priority: 'medium',
    asset_type: 'Electrical',
    location: { name: 'Main St & Elm St', lat: 42.3595, lng: -71.0585 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(13),
    due_date: daysFromNow(7),
    is_overdue: false
  },
  {
    id: 'WO-2019',
    description: 'Sidewalk Crack Repair',
    status: 'scheduled',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Historic District', lat: 42.3608, lng: -71.0598 },
    assigned_to: 'David Lee',
    created_at: daysAgo(16),
    due_date: daysFromNow(8),
    is_overdue: false
  },
  {
    id: 'WO-2020',
    description: 'Window Washing - City Hall',
    status: 'scheduled',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(17),
    due_date: daysFromNow(10),
    is_overdue: false
  },

  // 15 IN PROGRESS
  {
    id: 'WO-2021',
    description: 'Boiler Maintenance',
    status: 'in_progress',
    priority: 'high',
    asset_type: 'HVAC',
    location: { name: 'Police Station', lat: 42.3612, lng: -71.0578 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(5),
    due_date: daysFromNow(2),
    is_overdue: false
  },
  {
    id: 'WO-2022',
    description: 'Ceiling Tile Replacement',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'Structural',
    location: { name: 'Public Library', lat: 42.3595, lng: -71.0610 },
    assigned_to: 'David Lee',
    created_at: daysAgo(3),
    due_date: daysFromNow(4),
    is_overdue: false
  },
  {
    id: 'WO-2023',
    description: 'Drinking Fountain Repair',
    status: 'in_progress',
    priority: 'low',
    asset_type: 'Plumbing',
    location: { name: 'Central Park', lat: 42.3592, lng: -71.0608 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(2),
    due_date: daysFromNow(5),
    is_overdue: false
  },
  {
    id: 'WO-2024',
    description: 'LED Light Upgrade',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'Lighting',
    location: { name: 'Community Center', lat: 42.3590, lng: -71.0575 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(4),
    due_date: daysFromNow(6),
    is_overdue: false
  },
  {
    id: 'WO-2025',
    description: 'Fence Repair',
    status: 'in_progress',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Dog Park', lat: 42.3578, lng: -71.0622 },
    assigned_to: 'David Lee',
    created_at: daysAgo(6),
    due_date: daysFromNow(7),
    is_overdue: false
  },
  {
    id: 'WO-2026',
    description: 'Air Filter Replacement',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'HVAC',
    location: { name: 'Senior Center', lat: 42.3585, lng: -71.0625 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(1),
    due_date: daysFromNow(3),
    is_overdue: false
  },
  {
    id: 'WO-2027',
    description: 'Outlet Installation',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'Electrical',
    location: { name: 'Recreation Center', lat: 42.3565, lng: -71.0595 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(3),
    due_date: daysFromNow(4),
    is_overdue: false
  },
  {
    id: 'WO-2028',
    description: 'Storm Drain Cleaning',
    status: 'in_progress',
    priority: 'high',
    asset_type: 'Plumbing',
    location: { name: 'Riverside Dr', lat: 42.3588, lng: -71.0618 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(2),
    due_date: daysFromNow(3),
    is_overdue: false
  },
  {
    id: 'WO-2029',
    description: 'Paint Touch-up',
    status: 'in_progress',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Fire Station #2', lat: 42.3602, lng: -71.0612 },
    assigned_to: 'David Lee',
    created_at: daysAgo(5),
    due_date: daysFromNow(8),
    is_overdue: false
  },
  {
    id: 'WO-2030',
    description: 'Bench Replacement',
    status: 'in_progress',
    priority: 'low',
    asset_type: 'Grounds',
    location: { name: 'Waterfront Park', lat: 42.3572, lng: -71.0628 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(7),
    due_date: daysFromNow(9),
    is_overdue: false
  },
  {
    id: 'WO-2031',
    description: 'Emergency Exit Sign Replacement',
    status: 'in_progress',
    priority: 'high',
    asset_type: 'Lighting',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(4),
    due_date: daysFromNow(2),
    is_overdue: false
  },
  {
    id: 'WO-2032',
    description: 'Door Closer Adjustment',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'Structural',
    location: { name: 'Public Library', lat: 42.3595, lng: -71.0610 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(3),
    due_date: daysFromNow(5),
    is_overdue: false
  },
  {
    id: 'WO-2033',
    description: 'Irrigation System Repair',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'Plumbing',
    location: { name: 'Town Square', lat: 42.3600, lng: -71.0590 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(6),
    due_date: daysFromNow(6),
    is_overdue: false
  },
  {
    id: 'WO-2034',
    description: 'Mailbox Post Repair',
    status: 'in_progress',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Municipal Complex', lat: 42.3598, lng: -71.0592 },
    assigned_to: 'David Lee',
    created_at: daysAgo(8),
    due_date: daysFromNow(10),
    is_overdue: false
  },
  {
    id: 'WO-2035',
    description: 'Thermostat Calibration',
    status: 'in_progress',
    priority: 'medium',
    asset_type: 'HVAC',
    location: { name: 'Sports Complex', lat: 42.3575, lng: -71.0605 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(2),
    due_date: daysFromNow(4),
    is_overdue: false
  },

  // 12 COMPLETED (this week)
  {
    id: 'WO-2036',
    description: 'Light Bulb Replacement',
    status: 'completed',
    priority: 'low',
    asset_type: 'Lighting',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(8),
    due_date: daysAgo(1),
    completed_at: daysAgo(1),
    is_overdue: false
  },
  {
    id: 'WO-2037',
    description: 'Trash Can Replacement',
    status: 'completed',
    priority: 'low',
    asset_type: 'Grounds',
    location: { name: 'Central Park', lat: 42.3592, lng: -71.0608 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(7),
    due_date: daysAgo(2),
    completed_at: daysAgo(2),
    is_overdue: false
  },
  {
    id: 'WO-2038',
    description: 'Graffiti Removal',
    status: 'completed',
    priority: 'medium',
    asset_type: 'Structural',
    location: { name: 'Underpass - Oak St', lat: 42.3582, lng: -71.0615 },
    assigned_to: 'David Lee',
    created_at: daysAgo(6),
    due_date: daysAgo(3),
    completed_at: daysAgo(3),
    is_overdue: false
  },
  {
    id: 'WO-2039',
    description: 'Water Heater Inspection',
    status: 'completed',
    priority: 'medium',
    asset_type: 'Plumbing',
    location: { name: 'Fire Station #3', lat: 42.3625, lng: -71.0580 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(9),
    due_date: daysAgo(2),
    completed_at: daysAgo(2),
    is_overdue: false
  },
  {
    id: 'WO-2040',
    description: 'Circuit Breaker Replacement',
    status: 'completed',
    priority: 'high',
    asset_type: 'Electrical',
    location: { name: 'Community Center', lat: 42.3590, lng: -71.0575 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(10),
    due_date: daysAgo(4),
    completed_at: daysAgo(4),
    is_overdue: false
  },
  {
    id: 'WO-2041',
    description: 'Snow Removal Equipment Prep',
    status: 'completed',
    priority: 'medium',
    asset_type: 'Structural',
    location: { name: 'Public Works Yard', lat: 42.3618, lng: -71.0572 },
    assigned_to: 'David Lee',
    created_at: daysAgo(11),
    due_date: daysAgo(5),
    completed_at: daysAgo(5),
    is_overdue: false
  },
  {
    id: 'WO-2042',
    description: 'Lawn Mowing',
    status: 'completed',
    priority: 'low',
    asset_type: 'Grounds',
    location: { name: 'Veterans Memorial', lat: 42.3570, lng: -71.0615 },
    assigned_to: 'Lisa Park',
    created_at: daysAgo(12),
    due_date: daysAgo(6),
    completed_at: daysAgo(6),
    is_overdue: false
  },
  {
    id: 'WO-2043',
    description: 'Lock Lubrication',
    status: 'completed',
    priority: 'low',
    asset_type: 'Structural',
    location: { name: 'Police Station', lat: 42.3612, lng: -71.0578 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(13),
    due_date: daysAgo(6),
    completed_at: daysAgo(6),
    is_overdue: false
  },
  {
    id: 'WO-2044',
    description: 'Smoke Detector Battery Replacement',
    status: 'completed',
    priority: 'high',
    asset_type: 'Electrical',
    location: { name: 'Senior Center', lat: 42.3585, lng: -71.0625 },
    assigned_to: 'Sarah Chen',
    created_at: daysAgo(14),
    due_date: daysAgo(7),
    completed_at: daysAgo(7),
    is_overdue: false
  },
  {
    id: 'WO-2045',
    description: 'Faucet Washer Replacement',
    status: 'completed',
    priority: 'low',
    asset_type: 'Plumbing',
    location: { name: 'Recreation Center', lat: 42.3565, lng: -71.0595 },
    assigned_to: 'Tom Wilson',
    created_at: daysAgo(15),
    due_date: daysAgo(7),
    completed_at: daysAgo(7),
    is_overdue: false
  },
  {
    id: 'WO-2046',
    description: 'Heating System Seasonal Startup',
    status: 'completed',
    priority: 'high',
    asset_type: 'HVAC',
    location: { name: 'City Hall', lat: 42.3601, lng: -71.0589 },
    assigned_to: 'Mike Rodriguez',
    created_at: daysAgo(16),
    due_date: daysAgo(8),
    completed_at: daysAgo(8),
    is_overdue: false
  },
  {
    id: 'WO-2047',
    description: 'Parking Meter Repair',
    status: 'completed',
    priority: 'medium',
    asset_type: 'Parking',
    location: { name: 'Main St - Downtown', lat: 42.3605, lng: -71.0595 },
    assigned_to: 'David Lee',
    created_at: daysAgo(17),
    due_date: daysAgo(9),
    completed_at: daysAgo(9),
    is_overdue: false
  }
];

// Helper functions for dashboard queries
export const getWorkOrdersByStatus = () => {
  const statusCounts = mockWorkOrders.reduce((acc, wo) => {
    acc[wo.status] = (acc[wo.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Open', value: statusCounts.open || 0, fill: '#0288d1' },
    { name: 'Scheduled', value: statusCounts.scheduled || 0, fill: '#4b3fff' },
    { name: 'In Progress', value: statusCounts.in_progress || 0, fill: '#4b3fff' },
    { name: 'Completed', value: statusCounts.completed || 0, fill: '#2e7d32' }
  ];
};

export const getWorkOrdersByPriority = () => {
  const priorityCounts = mockWorkOrders.reduce((acc, wo) => {
    acc[wo.priority] = (acc[wo.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Low', value: priorityCounts.low || 0, fill: '#616161' },
    { name: 'Medium', value: priorityCounts.medium || 0, fill: '#ed6c02' },
    { name: 'High', value: priorityCounts.high || 0, fill: '#d32f2f' },
    { name: 'Urgent', value: priorityCounts.urgent || 0, fill: '#d32f2f' }
  ];
};

export const getOverdueWorkOrders = () => {
  return mockWorkOrders
    .filter(wo => wo.is_overdue)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
};

export const getCompletionTrends = () => {
  // Mock 6-month trend data
  return [
    { month: 'May', completions: 45 },
    { month: 'Jun', completions: 52 },
    { month: 'Jul', completions: 58 },
    { month: 'Aug', completions: 62 },
    { month: 'Sep', completions: 49 },
    { month: 'Oct', completions: 48 }
  ];
};

export const getOpenWorkOrderLocations = () => {
  return mockWorkOrders
    .filter(wo => wo.status === 'open' || wo.status === 'scheduled' || wo.status === 'in_progress')
    .map(wo => ({
      ...wo.location,
      id: wo.id,
      description: wo.description,
      priority: wo.priority,
      status: wo.status
    }));
};
