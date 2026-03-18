/**
 * Type Definitions for Agent Studio Observability Dashboard
 */

export interface GoalMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface HeroKPI {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  icon?: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AgentPerformance {
  id: string;
  name: string;
  description: string;
  tasksCount: number;
  messagesCount: number;
  satisfactionRate: number; // 0-100
  successRate: number; // 0-100
  avgResponseTime: number; // seconds
  avgStreamTime: number; // seconds
  status: 'active' | 'inactive' | 'maintenance';
  lastActive: string;
  category: string;
  tags: string[];
  timeSeriesData: TimeSeriesDataPoint[]; // daily usage over last 30 days
}

export interface SkillUsage {
  id: string;
  name: string;
  description: string;
  category: string;
  executionsCount: number;
  avgExecutionTime: number; // seconds
  successRate: number; // 0-100
  errorRate: number; // 0-100
  lastUsed: string;
  timesReferenced: number; // how many times LLM referenced this skill
  toolCallsCount: number; // number of tool calls made by this skill
  agentIds: string[]; // which agents use this skill
}

export interface ToolCallStats {
  id: string;
  name: string;
  type: 'api' | 'database' | 'mcp_server' | 'file_system' | 'integration' | 'utility';
  callCount: number;
  avgLatency: number; // milliseconds
  errorRate: number; // 0-100
  successRate: number; // 0-100
  lastCalled: string;
  mcpServer?: string; // if type is mcp_server
  skillIds: string[]; // which skills use this tool
}

export interface UserActivity {
  id: string;
  name: string;
  email: string;
  role?: string;
  tasksCount: number;
  messagesCount: number;
  avgSessionDuration: number; // minutes
  lastActive: string;
  satisfactionGiven: number; // number of feedback entries provided
  firstSeen: string;
  agentInteractions: { agentId: string; count: number }[];
}

export interface FeedbackEntry {
  id: string;
  taskId: string;
  messageId: string;
  userId: string;
  agentId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  sentiment?: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  category?: 'accuracy' | 'helpfulness' | 'speed' | 'clarity' | 'completeness' | 'other';
  timestamp: string;
  resolved: boolean;
  resolutionNotes?: string;
}

export interface GuardrailViolation {
  id: string;
  type: 'user_message' | 'agent_message';
  violationType: 'inappropriate_content' | 'pii_exposure' | 'sensitive_data' | 'policy_violation' | 'bias_detected' | 'harmful_content';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  agentId: string;
  taskId: string;
  userId?: string;
  description: string;
  action: 'blocked' | 'flagged' | 'redacted' | 'warned';
  resolved: boolean;
}

export interface ModelProviderStats {
  provider: 'anthropic' | 'openai' | 'cohere' | 'huggingface' | 'google' | 'local';
  model: string;
  callCount: number;
  tokenCount: {
    input: number;
    output: number;
    total: number;
  };
  cost: number; // USD
  avgLatency: number; // milliseconds
  errorRate: number; // 0-100
  timeSeriesData: TimeSeriesDataPoint[]; // hourly over last 24 hours
}

export interface FeedbackFlywheel {
  feedbackQueue: {
    pending: number;
    processing: number;
    avgWaitTime: number; // hours
  };
  assessments: {
    pending: number;
    completed: number;
    avgCompletionTime: number; // hours
  };
  suggestedChanges: {
    pendingOGReview: number;
    approved: number;
    rejected: number;
  };
  implementation: {
    changesImplemented: number;
    avgImplementationTime: number; // days
    successRate: number; // 0-100
  };
}

export interface DashboardData {
  goalMetrics: GoalMetric[];
  heroKPIs: {
    totalTasks: HeroKPI;
    activeAgents: HeroKPI;
    satisfactionRate: HeroKPI;
    activeUsers: HeroKPI;
    successRate: HeroKPI;
    totalMessages: HeroKPI;
    avgResponseTime: HeroKPI;
  };
  agentPerformance: AgentPerformance[];
  skillUsage: SkillUsage[];
  toolCallStats: ToolCallStats[];
  userActivity: UserActivity[];
  feedbackData: FeedbackEntry[];
  guardrailViolations: GuardrailViolation[];
  modelProviderStats: ModelProviderStats[];
  timeSeriesData: {
    dailyTaskVolume: TimeSeriesDataPoint[]; // last 30 days
    hourlyActivity: TimeSeriesDataPoint[]; // last 24 hours
    weeklyGrowth: TimeSeriesDataPoint[]; // last 12 weeks
  };
  feedbackFlywheel: FeedbackFlywheel;
}
