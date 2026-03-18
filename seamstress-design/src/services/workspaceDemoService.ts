/**
 * Workspace Demo Service
 * Orchestrates the infrastructure bond program demo with scripted responses and timing
 */

import type { Message } from '@opengov/components-ai-patterns';
import type {
  StagedMutation,
  WorkspaceAgent,
  AgentActivity,
  WorkspaceDocument,
  GeneratedDocument,
  DataSource,
  ApplyResult,
  RevertResult,
} from '../types/workspace';
import {
  mockInfrastructureBondMutations,
  mockWorkspaceAgents,
  mockPriorityActions,
  mockRiskAssessment,
  mockTimelineProjection,
  mockAIInsights,
} from '../data/mockInfrastructureBond';

// ============================================================================
// Demo Script
// ============================================================================

const THINKING_MESSAGES = [
  'Analyzing infrastructure needs...',
  'Querying asset database...',
  'Evaluating budget constraints...',
  'Planning procurement strategy...',
  'Coordinating with specialist agents...',
  'Creating cross-suite linkages...',
  'Finalizing recommendations...',
];

const DEMO_RESPONSES: Record<string, Message> = {
  intro: {
    id: 'msg_intro',
    role: 'assistant',
    content: `## Welcome to Infrastructure Program Coordinator

I help you plan and execute complex infrastructure programs across multiple OpenGov suites.

I can:
• Coordinate work across EAM, B&P, PRO, FIN, and R&T suites
• Orchestrate multiple specialist agents
• Create budgets, work orders, solicitations, and reports
• Generate presentations and documentation
• Ensure compliance and audit trails

**Try this demo**: Type "Help me plan the FY2026 infrastructure bond program. We have $15M approved for roads, bridges, and water infrastructure."`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Introduction',
    },
  },

  step1_upload: {
    id: 'msg_step1',
    role: 'assistant',
    content: `## Starting Infrastructure Bond Program Planning

I'll help you create a comprehensive $15M infrastructure bond program plan.

First, let me process the documents you've uploaded:
• Infrastructure Needs Assessment (47 assets identified)
• Bridge Inspection Reports (condition scores)
• Pavement Condition Index data

**Next step**: Tell me "Begin asset analysis"`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Document Processing',
    },
  },

  step2_asset_analysis: {
    id: 'msg_step2',
    role: 'assistant',
    content: `## Asset Analysis Underway

Activating **Asset Assessment Agent** to analyze infrastructure conditions.

The agent will:
• Query 47 infrastructure assets from EAM and GIS
• Score condition and criticality using assessment models
• Prioritize projects based on public safety impact
• Generate initial project recommendations

Watch the Context panel to see the agent's progress...`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Asset Analysis',
    },
  },

  step4_budget_planning: {
    id: 'msg_step4',
    role: 'assistant',
    content: `## Budget Planning & Resource Allocation

Excellent! Based on the asset analysis, I'm now activating **Budget Planner Agent** and **Finance Agent** to coordinate funding strategy.

These agents will:
• Create budget allocations across 3 funding categories
• Set up GL accounts and fund tracking in Finance suite
• Link budget lines to identified infrastructure needs
• Analyze historical cost data and identify risks

Watch the Context panel as both agents work together...`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Budget Planning',
    },
  },

  step6_procurement: {
    id: 'msg_step6',
    role: 'assistant',
    content: `## Procurement Strategy Development

Perfect! Now activating **Procurement Strategist Agent** to plan vendor engagement.

The agent will:
• Analyze vendor capacity in the market
• Create solicitation strategy (RFPs and IFBs)
• Plan staggered release schedule
• Identify competitive bidding opportunities

Watch the Context panel for procurement analysis...`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Procurement Planning',
    },
  },

  planning: {
    id: 'msg_planning',
    role: 'assistant',
    content: `## Final Coordination & Synthesis

Great! Now activating **Compliance Agent** and **Public Works Agent** for final coordination.

These agents will:
• Create accountability reporting framework and dashboards
• Generate public communication materials
• Establish work order templates and schedules
• Synthesize all recommendations into comprehensive plan

Watch the Context panel as we complete the program plan...`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Program Synthesis',
    },
  },

  analysis_complete: {
    id: 'msg_analysis',
    role: 'assistant',
    content: `## Analysis Complete

All specialist agents have completed their analysis. Here's what we've prepared:

### Program Summary
• **Total Budget**: $15.0M (98.7% allocated, 1.3% contingency)
• **Projects**: 30 infrastructure projects across 3 categories
• **Timeline**: 24 months (Q1 2026 - Q4 2027)
• **Departments**: 3 departments coordinated

### What's Been Created
• 12 Work Orders in EAM ($14.8M total)
• 15 Budget Lines in B&P (3 funding categories)
• 5 Solicitations in PRO (staggered Q1-Q3 2026)
• 8 GL Accounts in FIN (full fund tracking)
• 3 Compliance Reports in R&T (quarterly + annual)
• 9 Documents & Knowledge Articles (presentations, plans, dashboards, strategic docs)
• 1 New Agent Skill (reusable for future programs)

### Ready for Your Review
**65 platform changes** staged across 6 suites. These include:
• **CREATE** operations: New work orders, budgets, solicitations, reports, knowledge documents
• **UPDATE** operations: Modified asset statuses, budget allocations, account settings
• **DELETE** operations: Removal of superseded or obsolete records

⚠️ **4 changes require user action** before they can be applied. These are clearly marked with "Action Required" badges.

📚 **9 knowledge documents** created to explain the program strategy, implementation plan, and facilitate stakeholder communication.

Click the **"Review All Changes"** button in the Insights panel to see exactly what will be created, updated, or deleted before applying any changes.

All changes are reversible - you can revert individual items or entire suites at any time.`,
    timestamp: new Date().toISOString(),
    metadata: {
      agentName: 'Infrastructure Program Coordinator',
      skillName: 'Program Analysis',
      isFinalMessage: false,
    },
  },
};

// ============================================================================
// Mock Context Data
// ============================================================================

const mockUploadedDocuments: WorkspaceDocument[] = [
  {
    id: 'doc_upload_001',
    name: 'infrastructure-needs-assessment.pdf',
    type: 'pdf',
    size: 2458000,
    status: 'indexed',
    uploadedAt: new Date(Date.now() - 120000),
    purpose: 'reference',
    summary: 'Comprehensive assessment of city infrastructure condition, identifying 47 assets requiring repair or replacement',
    embeddings: 142,
    citations: 8,
  },
  {
    id: 'doc_upload_002',
    name: 'bridge-inspection-reports-2024.pdf',
    type: 'pdf',
    size: 1823000,
    status: 'indexed',
    uploadedAt: new Date(Date.now() - 100000),
    purpose: 'reference',
    summary: 'Annual bridge inspection reports showing condition scores and recommended repairs',
    embeddings: 89,
    citations: 3,
  },
  {
    id: 'doc_upload_003',
    name: 'pavement-condition-index.xlsx',
    type: 'excel',
    size: 456000,
    status: 'indexed',
    uploadedAt: new Date(Date.now() - 90000),
    purpose: 'reference',
    summary: 'PCI scores for all city roads with prioritization recommendations',
    embeddings: 34,
    citations: 5,
  },
];

const mockGeneratedDocuments: GeneratedDocument[] = [
  {
    id: 'kb_doc_001',
    type: 'plan',
    name: 'FY2026 Infrastructure Bond Program - Executive Summary',
    format: 'Markdown',
    generatedBy: 'Infrastructure Coordinator Agent',
    generatedAt: new Date(),
    description: 'Executive summary for City Council and stakeholders covering program overview, budget allocation, and expected outcomes',
  },
  {
    id: 'kb_doc_002',
    type: 'plan',
    name: 'Infrastructure Asset Prioritization Methodology',
    format: 'Markdown',
    generatedBy: 'Asset Assessment Agent',
    generatedAt: new Date(),
    description: 'Detailed methodology for scoring and prioritizing infrastructure projects based on condition, criticality, and public impact',
  },
  {
    id: 'kb_doc_003',
    type: 'plan',
    name: 'Budget Allocation Strategy & Risk Management',
    format: 'Markdown',
    generatedBy: 'Budget Planner Agent',
    generatedAt: new Date(),
    description: 'Budget allocation framework, contingency planning, and financial risk mitigation strategies',
  },
  {
    id: 'kb_doc_004',
    type: 'plan',
    name: 'Procurement Strategy & Vendor Engagement',
    format: 'Markdown',
    generatedBy: 'Procurement Strategist Agent',
    generatedAt: new Date(),
    description: 'Comprehensive strategy for vendor outreach, competitive bidding process, and contract management',
  },
  {
    id: 'kb_doc_005',
    type: 'plan',
    name: 'Implementation Timeline & Coordination Plan',
    format: 'Markdown',
    generatedBy: 'Infrastructure Coordinator Agent',
    generatedAt: new Date(),
    description: 'Phased implementation approach with milestone tracking and cross-department coordination',
  },
  {
    id: 'kb_insight_001',
    type: 'report',
    name: 'Asset Assessment Analysis Report',
    format: 'Markdown',
    generatedBy: 'Asset Assessment Agent',
    generatedAt: new Date(),
    description: 'Critical infrastructure assessment findings and prioritized recommendations',
  },
  {
    id: 'kb_insight_002',
    type: 'report',
    name: 'Budget & Finance Risk Analysis',
    format: 'Markdown',
    generatedBy: 'Budget Planner Agent',
    generatedAt: new Date(),
    description: 'Financial risk assessment and contingency recommendations',
  },
  {
    id: 'kb_insight_003',
    type: 'report',
    name: 'Procurement Market Analysis',
    format: 'Markdown',
    generatedBy: 'Procurement Strategist Agent',
    generatedAt: new Date(),
    description: 'Market capacity analysis and competitive bidding optimization strategies',
  },
];

const mockDataSources: DataSource[] = [
  {
    id: 'ds_eam_asset',
    suite: 'EAM',
    name: 'Asset Database',
    table: 'asset',
    recordsQueried: 47,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_bp_budget',
    suite: 'B&P',
    name: 'Budget System',
    table: 'budget_version, budget_line',
    recordsQueried: 15,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_pro_vendor',
    suite: 'PRO',
    name: 'Vendor Registry',
    table: 'vendor, solicitation',
    recordsQueried: 85,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_fin_gl',
    suite: 'FIN',
    name: 'General Ledger',
    table: 'gl_account, journal_entry',
    recordsQueried: 8,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_rt_compliance',
    suite: 'R&T',
    name: 'Compliance Reporting',
    table: 'compliance_report, report',
    recordsQueried: 3,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_platform_user',
    suite: 'B&P',
    name: 'Platform Users',
    table: 'user_account, department',
    recordsQueried: 12,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_gis',
    suite: 'EAM',
    name: 'GIS Infrastructure Data',
    table: 'location',
    recordsQueried: 30,
    lastQueried: new Date(),
    status: 'connected',
  },
  {
    id: 'ds_documents',
    suite: 'DOCUMENT',
    name: 'Document Repository',
    table: 'document, attachment',
    recordsQueried: 18,
    lastQueried: new Date(),
    status: 'connected',
  },
];

const mockActivityLog: AgentActivity[] = [
  {
    id: 'activity_001',
    timestamp: new Date(Date.now() - 50000),
    agentName: 'Asset Assessment Agent',
    action: 'query_database',
    details: 'Found 47 assets with condition score < 60',
    toolCalls: ['query_asset_condition', 'calculate_priority_score'],
    status: 'success',
  },
  {
    id: 'activity_002',
    timestamp: new Date(Date.now() - 45000),
    agentName: 'Budget Planner Agent',
    action: 'create_budget_version',
    details: 'Created budget version FY2026-INF-BOND',
    toolCalls: ['create_budget_version', 'allocate_funds'],
    status: 'success',
  },
  {
    id: 'activity_003',
    timestamp: new Date(Date.now() - 40000),
    agentName: 'Procurement Strategist Agent',
    action: 'draft_solicitations',
    details: 'Created 5 RFP/IFB drafts, total estimated value $14.2M',
    toolCalls: ['create_solicitation_draft', 'set_bid_schedule'],
    status: 'success',
  },
  {
    id: 'activity_004',
    timestamp: new Date(Date.now() - 35000),
    agentName: 'Finance Agent',
    action: 'create_gl_accounts',
    details: 'Set up 8 GL accounts in Fund 4500',
    toolCalls: ['create_gl_account', 'link_budget_lines'],
    status: 'success',
  },
  {
    id: 'activity_005',
    timestamp: new Date(Date.now() - 30000),
    agentName: 'Compliance Agent',
    action: 'generate_compliance_reports',
    details: 'Created accountability reporting framework and public dashboard',
    toolCalls: ['generate_report_template', 'create_dashboard'],
    status: 'success',
  },
  {
    id: 'activity_006',
    timestamp: new Date(Date.now() - 25000),
    agentName: 'Infrastructure Coordinator',
    action: 'cross_suite_linking',
    details: 'Created 142 cross-suite references between work orders, budgets, and solicitations',
    toolCalls: ['link_entities', 'validate_references'],
    status: 'success',
  },
];

// ============================================================================
// Service Class
// ============================================================================

class WorkspaceDemoService {
  private currentStep = 0;

  async processMessage(message: string): Promise<Message> {
    // Simulate API call delay
    await this.delay(2000);

    const lowerMsg = message.toLowerCase();

    // Step 0 → 1: Initial planning request
    if (this.currentStep === 0) {
      if (lowerMsg.includes('infrastructure') || lowerMsg.includes('bond') || lowerMsg.includes('15m')) {
        this.currentStep = 1;
        return DEMO_RESPONSES.step1_upload;
      }
    }

    // Step 1 → 2: Begin asset analysis (agent starts working)
    if (this.currentStep === 1) {
      this.currentStep = 2;
      return DEMO_RESPONSES.step2_asset_analysis;
    }

    // Step 2 → 4: Continue with budget planning (agents start working)
    if (this.currentStep === 2) {
      this.currentStep = 4;
      return DEMO_RESPONSES.step4_budget_planning;
    }

    // Step 4 → 6: Plan procurement strategy (agent starts working)
    if (this.currentStep === 4) {
      this.currentStep = 6;
      return DEMO_RESPONSES.step6_procurement;
    }

    // Step 6 → 8: Finalize - final coordination (agents start working)
    if (this.currentStep === 6) {
      this.currentStep = 8;
      return DEMO_RESPONSES.planning;
    }

    // Step 8 → 9: Show final analysis
    if (this.currentStep === 8) {
      this.currentStep = 9;
      return DEMO_RESPONSES.analysis_complete;
    }

    // Already at step 9, stay there
    if (this.currentStep === 9) {
      return DEMO_RESPONSES.analysis_complete;
    }

    // Fallback - reset to intro
    this.currentStep = 0;
    return DEMO_RESPONSES.intro;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  resetStep(): void {
    this.currentStep = 0;
  }

  getThinkingMessages(): string[] {
    return THINKING_MESSAGES;
  }

  async getStagedMutations(): Promise<StagedMutation[]> {
    await this.delay(1000);
    return mockInfrastructureBondMutations;
  }

  getWorkspaceAgents(): WorkspaceAgent[] {
    return mockWorkspaceAgents;
  }

  getUploadedDocuments(): WorkspaceDocument[] {
    return mockUploadedDocuments;
  }

  getGeneratedDocuments(): GeneratedDocument[] {
    return mockGeneratedDocuments;
  }

  getDocumentMarkdown(docId: string): string {
    const markdownContent: Record<string, string> = {
      kb_doc_001: `# FY2026 Infrastructure Bond Program - Executive Summary

## Program Overview

The FY2026 Infrastructure Bond Program represents a comprehensive $15M investment in critical infrastructure across the City of Springfield. This program addresses decades of deferred maintenance while positioning the city for sustainable growth through 2030.

## Key Highlights

- **Total Investment**: $15.0M (State Infrastructure Bond)
- **Project Count**: 30 infrastructure projects
- **Timeline**: 24 months (Q1 2026 - Q4 2027)
- **Categories**: Bridges (3), Roads (15), Water Systems (12)

## Budget Allocation

| Category | Amount | % of Total | Project Count |
|----------|--------|------------|---------------|
| Bridge Infrastructure | $4.2M | 28% | 3 |
| Road Infrastructure | $7.1M | 47% | 15 |
| Water Systems | $3.5M | 23% | 12 |
| Contingency Reserve | $0.2M | 1% | - |

## Critical Projects

### Highland Bridge Rehabilitation - $2.3M
Current condition score of 42 requires immediate comprehensive rehabilitation. Project includes deck replacement, structural beam repair, and modern safety barriers.

### Oak Street Water Main Replacement - $1.2M
78-year-old water main with documented leak history. Replacement will serve 12,000 residents and reduce emergency repair costs.

## Expected Outcomes

- **Public Safety**: Address 8 critical infrastructure deficiencies
- **Reliability**: Reduce emergency repairs by 65%
- **Economic Impact**: Create 180 jobs during construction
- **Sustainability**: All projects include green infrastructure components

## Next Steps

1. City Council approval - March 2026
2. Procurement process - April-June 2026
3. Construction Phase 1 - July 2026
4. Public reporting quarterly

---

*Document generated by Infrastructure Coordinator Agent*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_doc_002: `# Infrastructure Asset Prioritization Methodology

## Overview

This methodology provides a systematic, data-driven approach to prioritizing infrastructure investments. Used by the Asset Assessment Agent, it ensures transparent, defensible project selection.

## Scoring Framework

### 1. Condition Score (40% weight)
- Physical condition assessment
- Age relative to expected lifespan
- Inspection ratings and deficiency reports

### 2. Criticality Score (30% weight)
- Public safety impact
- Number of citizens affected
- Redundancy and backup systems
- Essential services dependency

### 3. Cost-Benefit Analysis (20% weight)
- Repair vs. replace economics
- Lifecycle cost projections
- Grant match opportunities
- Deferred maintenance multipliers

### 4. Strategic Alignment (10% weight)
- Comprehensive plan goals
- Climate action commitments
- Economic development priorities

## Calculation Example

**Highland Bridge Assessment:**
- Condition: 42/100 × 0.40 = 16.8
- Criticality: 85/100 × 0.30 = 25.5
- Cost-Benefit: 78/100 × 0.20 = 15.6
- Strategic: 90/100 × 0.10 = 9.0
- **Total Priority Score: 66.9**

## Priority Thresholds

- **Critical (>65)**: Immediate action required
- **High (50-65)**: Address within 12 months
- **Medium (35-50)**: Include in 3-year CIP
- **Low (<35)**: Monitor and defer

## Data Sources

The methodology integrates data from:
- EAM condition assessments
- GIS spatial analysis
- Historical maintenance records
- Public works incident reports
- Engineering inspection reports

## Validation

Priority scores are validated through:
- Department subject matter expert review
- Public stakeholder input
- Engineering feasibility analysis
- Financial capacity assessment

---

*Document generated by Asset Assessment Agent*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_doc_003: `# Budget Allocation Strategy & Risk Management

## Budget Framework

### Total Program Budget: $15.0M

The budget allocation strategy balances immediate needs with financial prudence and risk management.

## Allocation Breakdown

### Bridge Projects - $4.2M (28%)
- Highland Bridge Rehabilitation: $2.3M
- River Road Bridge Repairs: $1.2M
- Central Avenue Bridge Inspection & Maintenance: $0.7M

### Road Infrastructure - $7.1M (47%)
- Arterial resurfacing (8 segments): $4.2M
- Collector street rehabilitation (7 segments): $2.3M
- Associated drainage improvements: $0.6M

### Water Systems - $3.5M (23%)
- Main line replacements (3 projects): $2.4M
- Valve and hydrant upgrades: $0.8M
- Water quality infrastructure: $0.3M

### Contingency Reserve - $0.2M (1.3%)

## Risk Management

### Historical Cost Overrun Analysis

Historical data shows infrastructure project cost overruns:
- Bridge projects: 8% average overrun
- Road projects: 6% average overrun
- Water projects: **15% average overrun**

### Recommended Adjustment

**Increase contingency from $200K to $400K**
- Reallocate $200K from Road category (lowest risk)
- Addresses water infrastructure overrun risk
- Maintains overall program budget

### Risk Mitigation Strategies

1. **Phased procurement**: Stagger projects to avoid market saturation
2. **Performance-based contracts**: Incentivize on-time, on-budget delivery
3. **Value engineering**: Required for all projects >$1M
4. **Quarterly reviews**: Monitor spending and adjust as needed

## Funding Sources & Compliance

### Primary Source
- State Infrastructure Bond: $15.0M
- Terms: 20-year bond, 3.2% interest
- Compliance: Quarterly reporting required

### Grant Opportunities
- State Infrastructure Matching Grant: 3 projects qualify
- Potential additional funding: $800K
- Application deadline: April 1, 2026

## Budget Controls

- Project managers assigned to each major project
- Monthly financial reporting to City Manager
- Quarterly public dashboard updates
- Annual independent audit

---

*Document generated by Budget Planner Agent*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_doc_004: `# Procurement Strategy & Vendor Engagement

## Strategic Approach

The procurement strategy optimizes competitive bidding while ensuring adequate vendor participation and quality outcomes.

## Solicitation Plan

### Bridge Projects - RFP Approach
**SOL-2026-BR-01: Bridge Rehabilitation Services**
- Type: Request for Proposals (RFP)
- Estimated Value: $3.1M (adjusted from initial $2.8M estimate)
- Release Date: March 15, 2026
- Proposal Due: April 15, 2026
- Award Target: May 15, 2026

*Rationale*: Complex bridge work requires evaluation of qualifications, approach, and experience beyond just price.

### Road Projects - IFB Approach
**SOL-2026-RD-01: Road Construction & Paving**
- Type: Invitation for Bids (IFB)
- Estimated Value: $5.2M
- Release Date: April 15, 2026 (staggered from bridge)
- Bid Due: May 15, 2026
- Award Target: June 1, 2026

*Rationale*: Standardized road construction allows low-bid selection. Staggered release avoids market saturation.

### Water Infrastructure - RFP Approach
**SOL-2026-WTR-01: Water Main Replacement**
- Type: Request for Proposals (RFP)
- Estimated Value: $3.5M
- Release Date: May 1, 2026
- Proposal Due: June 1, 2026
- Award Target: June 30, 2026

## Market Capacity Analysis

### Key Finding: Vendor Capacity Constraints

Regional analysis indicates:
- 12 qualified bridge contractors within 100 miles
- Only 4 have capacity for projects >$2M
- **Risk**: Simultaneous bridge projects may reduce competition

### Recommended Mitigation
**Stagger bridge projects by 3-6 months**
- Primary bridge project: Q2 2026 start
- Secondary projects: Q4 2026 start
- Improves competitive bidding
- Allows contractors to sequence crews

## Vendor Outreach

### Pre-Solicitation Activities
1. Industry notification (60 days before release)
2. Pre-bid conferences (mandatory for RFPs)
3. Site visits scheduled
4. Questions & answers published

### Targeted Outreach Lists
- Bridge contractors: 12 firms
- Road contractors: 28 firms
- Engineering consultants: 8 firms
- Water contractors: 15 firms
- Specialty subcontractors: 20 firms

### MWBE Goals
- Overall program goal: 15% participation
- Good faith efforts documented
- MWBE directory provided to all bidders

## Evaluation Criteria

### RFP Evaluation (Bridge & Water)
- Technical approach: 40%
- Qualifications & experience: 30%
- Price: 25%
- MWBE participation: 5%

### IFB Evaluation (Roads)
- Low responsive bid
- Responsibility determination
- Reference checks

## Contract Management

### Performance Requirements
- Payment & performance bonds: 100% of contract value
- Insurance: $5M general liability, workers comp, auto
- Schedule liquidated damages: $1,000/day
- Quality assurance/quality control plans required

### Progress Payments
- Monthly progress payments
- 10% retainage until substantial completion
- Final payment upon completion & acceptance

---

*Document generated by Procurement Strategist Agent*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_doc_005: `# Implementation Timeline & Coordination Plan

## Program Timeline Overview

**Total Duration**: 24 months (Q1 2026 - Q4 2027)

## Phase 1: Planning & Procurement (Months 1-6)

### Q1 2026 - Program Launch
- **January**: City Council presentation and approval
- **February**: Detailed engineering kickoff
- **March**:
  - Bridge RFP release (SOL-2026-BR-01)
  - Environmental reviews initiated
  - Public communication campaign launch

### Q2 2026 - Vendor Selection
- **April**:
  - Road IFB release (SOL-2026-RD-01)
  - Bridge proposals due
  - Pre-construction meetings
- **May**:
  - Water RFP release (SOL-2026-WTR-01)
  - Bridge contract award
  - Engineering services contracts
- **June**:
  - Road contract award
  - Mobilization preparations
  - Permit acquisition

## Phase 2: Construction Phase 1 (Months 7-15)

### Q3 2026 - Initial Construction
- **July**: Highland Bridge project mobilization
- **August**: Road projects begin (first 5 segments)
- **September**: Water main projects begin

### Q4 2026 - Ramp Up
- **October**: Peak construction period begins
- **November**: Additional road segments
- **December**: Bridge project 50% complete

### Q1 2027 - Continued Construction
- **January**: Water projects 40% complete
- **February**: Road projects 60% complete
- **March**: Secondary bridge projects begin

## Phase 3: Construction Phase 2 (Months 16-22)

### Q2 2027 - Completion Push
- **April**: Highland Bridge substantial completion
- **May**: First road segments complete
- **June**: Water projects 80% complete

### Q3 2027 - Closeout Preparation
- **July**: Final paving season work
- **August**: Punch list items addressed
- **September**: Final inspections begin

## Phase 4: Completion & Closeout (Months 23-24)

### Q4 2027 - Project Closeout
- **October**: All substantial completions achieved
- **November**: Final payments processed
- **December**: Program closeout report, lessons learned

## Resource Coordination

### Staffing Plan
- **Program Manager**: Full-time, 24 months
- **Project Engineers**: 3 FTE, staggered assignments
- **Inspectors**: 4-6 depending on active projects
- **Administrative Support**: 1 FTE

### Peak Resource Period
**Q4 2026**: 12 active projects requiring:
- 6 full-time inspectors
- Daily coordination meetings
- Enhanced public communication

### Recommended Action
Hire temporary Project Coordinator (12 months) to support peak period.

## Interdepartmental Coordination

### Weekly Coordination Meetings
- Public Works (lead)
- Finance (budget tracking)
- Procurement (contract compliance)
- Communications (public affairs)
- City Attorney (legal review)

### Monthly Reporting
- City Manager briefing
- City Council update
- Public dashboard refresh
- Financial status report

## Public Communication

### Communication Channels
- Dedicated program website
- Interactive project map
- Email notification system
- Social media updates
- Quarterly community meetings

### Key Messages
- Project schedules and impacts
- Traffic detours and advisories
- Milestone achievements
- Budget status and transparency

## Risk Management

### Critical Path Items
1. Bridge RFP vendor selection (Month 4)
2. Environmental permits (Months 2-5)
3. Weather delays (seasonal risk)
4. Market conditions (material costs)

### Contingency Plans
- Alternative procurement strategies
- Accelerated schedules if needed
- Flexible project sequencing
- Budget reserve utilization protocols

## Success Metrics

### On-Time Performance
- Target: 90% of projects complete within 30 days of schedule
- Monthly tracking and corrective action

### Budget Performance
- Target: 95% of projects complete within 5% of budget
- Quarterly variance analysis

### Quality Standards
- Zero major defects at substantial completion
- 95% pass rate on final inspections
- One-year warranty compliance >98%

### Safety
- Zero lost-time accidents
- Weekly safety meetings
- Third-party safety audits

---

*Document generated by Infrastructure Coordinator Agent*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_insight_001: `# Asset Assessment Analysis Report

## Executive Summary

The Asset Assessment Agent has completed a comprehensive analysis of 47 infrastructure assets across the city using advanced condition scoring models and criticality assessment frameworks.

## Assessment Statistics

| Metric | Value |
|--------|-------|
| Total Assets Analyzed | 47 |
| Assets Requiring Immediate Action | 8 |
| Assets in Poor Condition (Score < 50) | 12 |
| Assets in Fair Condition (Score 50-70) | 23 |
| Assets in Good Condition (Score > 70) | 12 |
| Estimated Total Cost | $14.8M |

## Data Sources

- **EAM Asset Database**: 47 records queried
- **GIS Infrastructure Layer**: 30 location records analyzed
- **Inspection Reports**: 156 historical inspections reviewed
- **Maintenance History**: 324 work orders analyzed

## Critical Finding: Highland Bridge

### Condition Analysis
- **Current Condition Score**: 42/100
- **Criticality Rating**: High (85/100)
- **Public Safety Impact**: Serves 12,000 daily vehicles
- **Age**: 68 years (exceeds 50-year design life)
- **Last Major Repair**: 1998 (26 years ago)

### Structural Deficiencies
1. **Deck Surface**: Extensive cracking and spalling
2. **Support Beams**: Corrosion at 3 primary support points
3. **Safety Barriers**: Below current AASHTO standards
4. **Drainage**: Inadequate system causing accelerated deterioration

### Risk Assessment
- **Failure Risk**: Medium-High (closure within 6-12 months likely without intervention)
- **Economic Impact**: $45K/day if detour required
- **Emergency Response**: Fire/EMS response times +8 minutes on detour routes

### Recommendation
**Immediate comprehensive rehabilitation required**
- Estimated Cost: $2.3M
- Timeline: 180 days
- Priority: Critical (Score 66.9)

## Additional High-Priority Assets

### 2. Oak Street Water Main
- **Age**: 78 years
- **Condition Score**: 38/100
- **Issue**: 3 major leaks in past 18 months, serving 12,000 residents
- **Estimated Cost**: $1.2M
- **Recommendation**: Full replacement (Mile 1st-8th Ave)

### 3. Main Street Arterial
- **PCI Score**: 58/100
- **Condition**: Fair, deteriorating rapidly
- **Traffic Volume**: 18,000 AADT
- **Estimated Cost**: $450K
- **Recommendation**: Complete resurfacing (Mile 0-2.3)

## Recommended Platform Changes

The Asset Assessment Agent recommends creating the following work orders in EAM:

### Immediate Action (Q2 2026)
1. **WO-2026-001**: Highland Bridge Rehabilitation - $2.3M
2. **WO-2026-003**: Oak Street Water Main Replacement - $1.2M
3. **WO-2026-002**: Main Street Resurfacing - $450K

### Phase 1 Projects (Q3-Q4 2026)
4. Additional 9 work orders for roads, bridges, and water infrastructure totaling $12.3M

### Asset Status Updates
- Update BRG-045 status → "Scheduled for Repair"
- Update WTR-089 criticality → "High"
- Update RD-128 status → "Scheduled for Maintenance"

## Methodology

This assessment utilized the Infrastructure Priority Scoring Framework:
- **Condition Score** (40%): Physical assessment, age, inspection ratings
- **Criticality Score** (30%): Public safety, population served, redundancy
- **Cost-Benefit** (20%): Repair vs. replace, lifecycle costs, grant opportunities
- **Strategic Alignment** (10%): Comprehensive plan, climate goals, economic development

## Next Steps

1. **Budget Planning**: Coordinate with Budget Planner Agent for fund allocation
2. **Procurement**: Engage Procurement Strategist for vendor capacity analysis
3. **Public Communication**: Prepare stakeholder briefings on critical findings
4. **Environmental Review**: Initiate NEPA compliance for 3 major projects

---

*Analysis generated by Asset Assessment Agent*
*Data sources: EAM, GIS, Inspection Reports*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_insight_002: `# Budget & Finance Risk Analysis

## Executive Summary

The Budget Planner Agent and Finance Agent have identified a significant financial risk requiring immediate attention: historical cost overrun patterns for water infrastructure projects necessitate increased contingency reserves.

## Risk Analysis Statistics

| Category | Historical Overrun | Current Allocation | Recommended Change |
|----------|-------------------|-------------------|-------------------|
| Bridge Projects | 8% average | $4.2M | ✓ Adequate |
| Road Projects | 6% average | $7.1M | ✓ Adequate |
| Water Infrastructure | **15% average** | $3.5M | ⚠️ Increase Reserve |
| Contingency Reserve | N/A | $200K (1.3%) | ⚠️ Increase to $400K |

## Historical Data Analysis

### Water Infrastructure Cost Overruns (Past 5 Years)

| Project | Original Budget | Final Cost | Overrun % | Primary Cause |
|---------|----------------|------------|-----------|---------------|
| Maple Ave Water Main (2021) | $850K | $1.02M | 20% | Unforeseen underground utilities |
| West Side Pump Station (2022) | $1.2M | $1.35M | 13% | Environmental compliance upgrades |
| Downtown Water Main (2023) | $680K | $780K | 15% | Contaminated soil remediation |
| River Road Water Line (2024) | $920K | $1.05M | 14% | Extended construction timeline |

**Average Overrun: 15.5%**

## Risk Assessment

### Current Program Risk Exposure

With $3.5M allocated for water infrastructure projects:
- **Expected Overrun**: $525K (15% × $3.5M)
- **Current Contingency**: $200K
- **Shortfall Risk**: $325K

### Probability Analysis
- **High Probability (70%)**: At least one water project exceeds budget by 10%+
- **Medium Probability (45%)**: Multiple projects require contingency funds
- **Low Probability (15%)**: All water projects complete within 5% of budget

## Recommended Changes

### 1. Increase Contingency Reserve
**Change**: Increase from $200K to $400K (+$200K)

**Rationale**:
- Addresses water infrastructure risk exposure
- Brings total contingency to 2.7% of program budget
- Comparable to peer cities (average 2.5-3.0% for infrastructure bonds)

**Source of Funds**: Reallocate $200K from Road Infrastructure category
- Roads have lowest historical overrun risk (6%)
- Road projects can be phased or reduced in scope if needed
- Maintains overall $15M program budget

### 2. Enhanced Project Monitoring

Implement enhanced cost tracking for water infrastructure:
- **Monthly variance reporting** (vs. quarterly for other projects)
- **Early warning triggers** at 5% variance (vs. 10% for others)
- **Value engineering reviews** required for any project trending >8% over budget

### 3. Risk Mitigation Strategies

#### Performance-Based Contracting
- Include cost certainty provisions in water infrastructure RFPs
- Evaluate proposals on risk assumption, not just price
- Consider fixed-price contracts with clear scope definitions

#### Phased Procurement
- Stagger water projects to avoid simultaneous exposures
- Learn from early projects to adjust later contracts
- Build contingency drawdown rights into project sequencing

#### Pre-Construction Investigation
- Allocate $50K for subsurface investigation on Oak Street Water Main
- Identify underground utilities, contamination, or obstacles before bidding
- Reduce likelihood of change orders during construction

## Platform Changes Required

### Budget & Performance Suite
1. **CREATE**: Budget Line 14 - Contingency Reserve ($400K)
2. **UPDATE**: Budget Line 7 - Road Infrastructure (-$200K adjustment)
3. **UPDATE**: Budget Version - Add risk management notes

### Finance Suite
1. **UPDATE**: GL Account 4500.500 - Increase limit to $400K
2. **CREATE**: Monthly variance reporting template for water projects
3. **UPDATE**: GL Account 4500.200 description - note reallocation

## Approval Required

⚠️ **City Manager Approval Needed**

This recommendation requires approval from the City Manager because:
- Reallocates $200K between major program categories
- Changes contingency strategy from original bond program plan
- May impact project phasing and timeline

**Recommended Action**: Present analysis to City Manager with:
- Historical overrun data
- Risk probability assessment
- Peer city benchmarking
- Mitigation strategy overview

## Alternative Scenarios

### If Reallocation Not Approved

**Option A**: Accept risk exposure
- Proceed with $200K contingency
- Plan to seek additional appropriation if overruns occur
- Risk: May delay project completion or require scope reductions

**Option B**: Reduce water infrastructure scope
- Defer 1-2 smaller water projects to future CIP
- Reduces exposure but delays needed infrastructure improvements
- Estimated scope reduction: $500K-$800K

**Option C**: Pursue additional grant funding
- Accelerate applications for state matching grants
- Potential to offset overrun risk with additional revenue
- Timeline: Grants may not be awarded until FY2027

## Recommendation Summary

The combined Budget Planner Agent and Finance Agent analysis strongly recommends:

1. ✅ **Increase contingency reserve to $400K** via reallocation from road projects
2. ✅ **Implement enhanced monitoring** for water infrastructure projects
3. ✅ **Adopt risk mitigation strategies** in procurement and contracting
4. ⚠️ **Seek City Manager approval** before proceeding with budget modifications

This prudent financial management approach protects the $15M infrastructure bond program from likely cost pressures while maintaining programmatic goals.

---

*Analysis generated by Budget Planner Agent & Finance Agent*
*Data sources: B&P, FIN, Historical project records*
*Last updated: ${new Date().toLocaleDateString()}*`,

      kb_insight_003: `# Procurement Market Analysis

## Executive Summary

The Procurement Strategist Agent has completed a comprehensive market capacity analysis revealing critical findings that will optimize competitive bidding and potentially unlock $800K in additional state grant funding.

## Market Capacity Analysis

### Bridge Construction Market

| Metric | Finding |
|--------|---------|
| Qualified Contractors (100-mile radius) | 12 firms |
| Capacity for Projects > $2M | 4 firms |
| **Risk Identified** | ⚠️ Limited capacity for simultaneous large bridge projects |

#### Detailed Capacity Assessment

**Tier 1 Contractors** (Can handle $2M+ bridge projects):
- Morrison Bridge & Structures (Capacity: $3.5M, Current backlog: 2 months)
- Riverside Infrastructure Group (Capacity: $4M, Current backlog: 1 month)
- Central Valley Bridge Builders (Capacity: $2.8M, Current backlog: 4 months)
- Statewide Heavy Construction (Capacity: $5M, Current backlog: 3 months)

**Market Constraint**: Only 2 firms (Morrison, Riverside) have immediate capacity and low backlog for Q2 2026 start.

#### Competitive Bidding Risk

If all bridge projects are bid simultaneously:
- **Expected bidders per project**: 2-3 (vs. optimal 4-5)
- **Price premium risk**: 8-15% above market
- **Estimated cost impact**: +$250K-$400K

### Recommended Strategy

**Stagger Bridge Projects by 3-6 Months**

**Phase 1 (Q2 2026)**:
- Highland Bridge Rehabilitation ($2.3M)
- Expected bidders: 4 firms
- Competitive pressure: High

**Phase 2 (Q4 2026)**:
- River Road Bridge Repairs ($1.2M)
- Central Avenue Bridge Maintenance ($700K)
- Expected bidders: 3-4 firms per project
- Phase 1 contractor available for Phase 2

**Benefits**:
- Increases competition by 40%
- Reduces pricing premium risk
- Allows contractors to sequence crews efficiently
- Estimated savings: $180K-$320K

## Road Construction Market

### Market Conditions
- **Qualified Contractors**: 28 firms (excellent capacity)
- **Market Competition**: High (5-7 bidders expected per solicitation)
- **Pricing Environment**: Favorable (slight downward pressure)

### Recommendation
- Proceed with consolidated road construction IFB ($5.2M)
- Release April 15, 2026 (staggered from bridge RFP)
- No capacity concerns

## State Infrastructure Matching Grant Opportunity

### Critical Finding: $800K Additional Funding Available

The Procurement Strategist Agent identified **3 projects that qualify for State Infrastructure Matching Grant Program**:

| Project | Grant Match % | Estimated Award | Requirements |
|---------|--------------|-----------------|--------------|
| Highland Bridge Rehabilitation | 25% | $575K | MWBE participation, state steel |
| Oak Street Water Main | 15% | $180K | Environmental benefit documentation |
| Arterial Road Network (5 segments) | 10% | $45K | Congestion mitigation plan |
| **TOTAL** | - | **$800K** | - |

### Application Requirements

**Deadline**: April 1, 2026 (60 days from program launch)

**Documentation Needed**:
1. Engineering assessments (in progress)
2. MWBE participation plans (to be created)
3. Environmental benefit statements (coordinate with Compliance Agent)
4. Public benefit quantification (economic analysis)
5. Project delivery timeline

**Success Probability**:
- Highland Bridge: 85% (strong public safety case)
- Oak Street Water Main: 70% (environmental benefits clear)
- Arterial Roads: 60% (competitive category)

**Recommended Action**:
- Prioritize Highland Bridge application
- Allocate staff time to prepare comprehensive application package
- Coordinate with state infrastructure finance authority

## Solicitation Strategy

### Recommended Release Schedule

| Solicitation | Type | Est. Value | Release Date | Close Date | Award Date |
|--------------|------|-----------|--------------|------------|------------|
| SOL-2026-BR-01 | RFP | $3.1M | March 15 | April 15 | May 15 |
| SOL-2026-RD-01 | IFB | $5.2M | **April 15** | May 15 | June 1 |
| SOL-2026-WTR-01 | RFP | $3.5M | May 1 | June 1 | June 30 |
| SOL-2026-ENG-01 | RFP | $800K | March 1 | April 1 | May 1 |
| SOL-2026-SRV-01 | RFP | $400K | April 1 | May 1 | June 1 |

### Key Schedule Adjustment

⚠️ **SOL-2026-RD-01 Delayed by 2 Weeks**

**Original**: April 1 release
**Recommended**: April 15 release

**Rationale**:
- Avoid overlap with bridge RFP bidder preparation period
- Market capacity analysis suggests staged approach improves competition
- 2-week delay has minimal impact on overall program timeline
- Allows same contractors to bid both projects if desired

**Impact**:
- Overall program timeline: +2 weeks (within acceptable variance)
- First road projects still start Q2 2026 as planned
- Improves competitive dynamics for both solicitations

## Platform Changes Required

### Procurement Suite

**Create**:
1. SOL-2026-BR-01: Bridge Rehabilitation Services RFP
2. SOL-2026-RD-01: Road Construction & Paving IFB
3. SOL-2026-WTR-01: Water Infrastructure RFP
4. SOL-2026-ENG-01: Engineering Services RFP
5. SOL-2026-SRV-01: Survey Services RFP
6. 3 Vendor outreach lists (Bridge, Road, Engineering contractors)

**Update**:
1. SOL-2026-RD-01 opening date → April 15 (requires approval)
2. SOL-2026-BR-01 estimated value → $3.1M (from $2.8M engineering reassessment)

**Action Required**:
⚠️ **Schedule change requires approval** - 2-week delay in road solicitation to optimize competitive bidding

## Vendor Engagement Plan

### Pre-Solicitation Outreach

**Timeline**: 60 days before each RFP release

**Activities**:
- Industry notification letters (targeting 83 firms total)
- Pre-bid conferences (mandatory for RFPs)
- Site visits and technical Q&A sessions
- One-on-one meetings with top-tier contractors

### MWBE Participation Goals

- **Program-wide goal**: 15% MWBE participation
- **Highland Bridge (for grant)**: 20% MWBE participation required
- **Outreach**: Partner with State MWBE Office for contractor lists

## Risk Mitigation Summary

### Risks Identified
1. ⚠️ Limited bridge contractor capacity → **Mitigated** via project staggering
2. ⚠️ Simultaneous bid risk → **Mitigated** via 2-week road solicitation delay
3. ⚠️ Grant opportunity deadline → **Mitigated** via immediate application prioritization

### Opportunities Identified
1. ✅ $800K additional grant funding available
2. ✅ Favorable road construction market → Potential cost savings
3. ✅ Strong vendor interest → 83 firms identified for outreach

## Recommended Actions

1. **Approve schedule adjustment**: Delay SOL-2026-RD-01 by 2 weeks to April 15
2. **Prioritize grant applications**: Allocate resources for April 1 deadline
3. **Adopt staggered bridge strategy**: Phase 1 (Q2) and Phase 2 (Q4)
4. **Enhance MWBE outreach**: Target 20% participation for Highland Bridge
5. **Execute vendor engagement plan**: Begin outreach 60 days pre-solicitation

These strategic procurement decisions will optimize competitive bidding, reduce cost risk, and unlock significant additional funding—maximizing the impact of the $15M infrastructure bond program.

---

*Analysis generated by Procurement Strategist Agent*
*Data sources: PRO, Vendor Registry, Market Research*
*Last updated: ${new Date().toLocaleDateString()}*`
    };

    return markdownContent[docId] || '# Document Not Found\n\nThe requested document could not be loaded.';
  }

  getDataSources(): DataSource[] {
    return mockDataSources;
  }

  getActivityLog(): AgentActivity[] {
    return mockActivityLog;
  }

  getPriorityActions() {
    return mockPriorityActions;
  }

  getRiskAssessment() {
    return mockRiskAssessment;
  }

  getTimelineProjection() {
    return mockTimelineProjection;
  }

  getAIInsights() {
    return mockAIInsights;
  }

  getAnalysisCompleteMessage(): Message {
    return DEMO_RESPONSES.analysis_complete;
  }

  async applyMutations(mutationIds?: string[]): Promise<ApplyResult> {
    // Simulate applying changes with progress
    await this.delay(5000);

    const mutations = mutationIds
      ? mockInfrastructureBondMutations.filter((m) => mutationIds.includes(m.id))
      : mockInfrastructureBondMutations;

    return {
      success: true,
      applied: mutations.length,
      failed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  async revertMutation(mutationId: string): Promise<RevertResult> {
    await this.delay(1000);

    return {
      success: true,
      reverted: 1,
      failed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  async revertSuite(suite: string): Promise<RevertResult> {
    await this.delay(2000);

    const suiteMutations = mockInfrastructureBondMutations.filter((m) => m.suite === suite);

    return {
      success: true,
      reverted: suiteMutations.length,
      failed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const workspaceDemoService = new WorkspaceDemoService();
