/**
 * Workflow Engine
 * 
 * A state machine-based workflow engine for managing government processes:
 * - Permit applications
 * - License applications
 * - Grant applications
 * - Vendor procurement
 * - Any multi-step approval process
 * 
 * Features:
 * - Configurable workflow definitions
 * - State transitions with guards
 * - Task assignment and routing
 * - SLA tracking
 * - Automatic notifications
 * - Audit trail
 */

import type { Application, ApplicationStatus, WorkflowTask, TaskStatus } from '../../types';

// ============================================
// WORKFLOW TYPES
// ============================================

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  initialState: string;
  finalStates: string[];
}

export interface WorkflowState {
  id: string;
  name: string;
  type: 'initial' | 'intermediate' | 'final';
  description?: string;
  tasks?: TaskDefinition[];
  slaHours?: number;
  onEnter?: WorkflowAction[];
  onExit?: WorkflowAction[];
}

export interface TaskDefinition {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'inspection' | 'document_upload' | 'payment' | 'notification' | 'custom';
  assignTo: 'applicant' | 'reviewer' | 'inspector' | 'manager' | 'system';
  required: boolean;
  slaHours?: number;
  instructions?: string;
  formFields?: TaskFormField[];
}

export interface TaskFormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'file';
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: Record<string, unknown>;
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  trigger: 'auto' | 'manual' | 'task_complete' | 'approval' | 'rejection' | 'payment' | 'expiry';
  guard?: TransitionGuard;
  actions?: WorkflowAction[];
}

export interface TransitionGuard {
  type: 'all_tasks_complete' | 'payment_received' | 'documents_verified' | 'custom';
  condition?: string;
}

export interface WorkflowAction {
  type: 'send_notification' | 'create_task' | 'update_status' | 'schedule_inspection' | 'generate_document' | 'call_webhook';
  config: Record<string, unknown>;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  applicationId: string;
  currentState: string;
  stateHistory: StateHistoryEntry[];
  tasks: WorkflowTaskInstance[];
  metadata: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
}

export interface StateHistoryEntry {
  state: string;
  enteredAt: string;
  exitedAt?: string;
  transitionId?: string;
  triggeredBy?: string;
  notes?: string;
}

export interface WorkflowTaskInstance extends WorkflowTask {
  workflowInstanceId: string;
  taskDefinitionId: string;
  formData?: Record<string, unknown>;
}

// ============================================
// PREDEFINED WORKFLOWS
// ============================================

export const PERMIT_WORKFLOW: WorkflowDefinition = {
  id: 'permit-standard',
  name: 'Standard Permit Application',
  description: 'Standard workflow for building, electrical, plumbing, and mechanical permits',
  version: '1.0.0',
  initialState: 'draft',
  finalStates: ['approved', 'denied', 'withdrawn', 'expired'],
  states: [
    {
      id: 'draft',
      name: 'Draft',
      type: 'initial',
      description: 'Application is being prepared by the applicant',
      tasks: [
        {
          id: 'complete-application',
          name: 'Complete Application Form',
          type: 'custom',
          assignTo: 'applicant',
          required: true,
          instructions: 'Fill out all required fields in the application form',
        },
        {
          id: 'upload-documents',
          name: 'Upload Required Documents',
          type: 'document_upload',
          assignTo: 'applicant',
          required: true,
          instructions: 'Upload all required documents including plans and specifications',
        },
      ],
    },
    {
      id: 'submitted',
      name: 'Submitted',
      type: 'intermediate',
      description: 'Application has been submitted and is awaiting initial review',
      slaHours: 48,
      onEnter: [
        {
          type: 'send_notification',
          config: {
            template: 'application_submitted',
            to: 'applicant',
          },
        },
        {
          type: 'create_task',
          config: {
            taskId: 'initial-review',
            assignTo: 'reviewer',
          },
        },
      ],
      tasks: [
        {
          id: 'initial-review',
          name: 'Initial Review',
          type: 'review',
          assignTo: 'reviewer',
          required: true,
          slaHours: 48,
          instructions: 'Review application for completeness and initial compliance',
          formFields: [
            {
              name: 'isComplete',
              label: 'Application is complete',
              type: 'checkbox',
              required: true,
            },
            {
              name: 'notes',
              label: 'Review Notes',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'under_review',
      name: 'Under Review',
      type: 'intermediate',
      description: 'Application is being reviewed by the appropriate department',
      slaHours: 120,
      tasks: [
        {
          id: 'technical-review',
          name: 'Technical Review',
          type: 'review',
          assignTo: 'reviewer',
          required: true,
          slaHours: 80,
          instructions: 'Review technical aspects of the application and plans',
        },
        {
          id: 'zoning-check',
          name: 'Zoning Compliance Check',
          type: 'review',
          assignTo: 'reviewer',
          required: true,
          slaHours: 40,
          instructions: 'Verify zoning compliance for the proposed work',
        },
      ],
    },
    {
      id: 'pending_info',
      name: 'Pending Information',
      type: 'intermediate',
      description: 'Additional information is required from the applicant',
      slaHours: 240,
      onEnter: [
        {
          type: 'send_notification',
          config: {
            template: 'info_requested',
            to: 'applicant',
          },
        },
      ],
      tasks: [
        {
          id: 'provide-info',
          name: 'Provide Requested Information',
          type: 'custom',
          assignTo: 'applicant',
          required: true,
          slaHours: 240,
          instructions: 'Please provide the additional information requested',
        },
      ],
    },
    {
      id: 'pending_payment',
      name: 'Pending Payment',
      type: 'intermediate',
      description: 'Application fee payment is required',
      slaHours: 168,
      onEnter: [
        {
          type: 'send_notification',
          config: {
            template: 'payment_required',
            to: 'applicant',
          },
        },
      ],
      tasks: [
        {
          id: 'pay-fee',
          name: 'Pay Application Fee',
          type: 'payment',
          assignTo: 'applicant',
          required: true,
          slaHours: 168,
          instructions: 'Pay the required application fee to proceed',
        },
      ],
    },
    {
      id: 'pending_inspection',
      name: 'Pending Inspection',
      type: 'intermediate',
      description: 'Inspection is scheduled or pending',
      slaHours: 336,
      tasks: [
        {
          id: 'site-inspection',
          name: 'Site Inspection',
          type: 'inspection',
          assignTo: 'inspector',
          required: true,
          slaHours: 336,
          instructions: 'Conduct on-site inspection',
          formFields: [
            {
              name: 'inspectionDate',
              label: 'Inspection Date',
              type: 'date',
              required: true,
            },
            {
              name: 'result',
              label: 'Inspection Result',
              type: 'select',
              required: true,
              options: [
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
                { value: 'conditional', label: 'Conditional Pass' },
              ],
            },
            {
              name: 'findings',
              label: 'Inspection Findings',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'pending_approval',
      name: 'Pending Final Approval',
      type: 'intermediate',
      description: 'Application is awaiting final approval',
      slaHours: 48,
      tasks: [
        {
          id: 'final-approval',
          name: 'Final Approval',
          type: 'approval',
          assignTo: 'manager',
          required: true,
          slaHours: 48,
          instructions: 'Review and provide final approval or denial',
          formFields: [
            {
              name: 'decision',
              label: 'Decision',
              type: 'select',
              required: true,
              options: [
                { value: 'approve', label: 'Approve' },
                { value: 'deny', label: 'Deny' },
              ],
            },
            {
              name: 'conditions',
              label: 'Conditions (if any)',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'approved',
      name: 'Approved',
      type: 'final',
      description: 'Application has been approved',
      onEnter: [
        {
          type: 'send_notification',
          config: {
            template: 'application_approved',
            to: 'applicant',
          },
        },
        {
          type: 'generate_document',
          config: {
            template: 'permit_certificate',
          },
        },
      ],
    },
    {
      id: 'denied',
      name: 'Denied',
      type: 'final',
      description: 'Application has been denied',
      onEnter: [
        {
          type: 'send_notification',
          config: {
            template: 'application_denied',
            to: 'applicant',
          },
        },
      ],
    },
    {
      id: 'withdrawn',
      name: 'Withdrawn',
      type: 'final',
      description: 'Application has been withdrawn by the applicant',
    },
    {
      id: 'expired',
      name: 'Expired',
      type: 'final',
      description: 'Application has expired due to inactivity',
    },
  ],
  transitions: [
    { id: 't1', from: 'draft', to: 'submitted', trigger: 'manual' },
    { id: 't2', from: 'submitted', to: 'under_review', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't3', from: 'submitted', to: 'pending_info', trigger: 'manual' },
    { id: 't4', from: 'under_review', to: 'pending_info', trigger: 'manual' },
    { id: 't5', from: 'under_review', to: 'pending_payment', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't6', from: 'pending_info', to: 'under_review', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't7', from: 'pending_info', to: 'expired', trigger: 'expiry' },
    { id: 't8', from: 'pending_payment', to: 'pending_inspection', trigger: 'payment', guard: { type: 'payment_received' } },
    { id: 't9', from: 'pending_payment', to: 'expired', trigger: 'expiry' },
    { id: 't10', from: 'pending_inspection', to: 'pending_approval', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't11', from: 'pending_inspection', to: 'pending_info', trigger: 'manual' },
    { id: 't12', from: 'pending_approval', to: 'approved', trigger: 'approval' },
    { id: 't13', from: 'pending_approval', to: 'denied', trigger: 'rejection' },
    { id: 't14', from: 'draft', to: 'withdrawn', trigger: 'manual' },
    { id: 't15', from: 'submitted', to: 'withdrawn', trigger: 'manual' },
    { id: 't16', from: 'under_review', to: 'withdrawn', trigger: 'manual' },
    { id: 't17', from: 'pending_info', to: 'withdrawn', trigger: 'manual' },
  ],
};

export const LICENSE_WORKFLOW: WorkflowDefinition = {
  id: 'license-standard',
  name: 'Standard License Application',
  description: 'Standard workflow for business licenses, professional licenses, and renewals',
  version: '1.0.0',
  initialState: 'draft',
  finalStates: ['approved', 'denied', 'withdrawn', 'expired'],
  states: [
    {
      id: 'draft',
      name: 'Draft',
      type: 'initial',
      description: 'Application is being prepared',
      tasks: [
        {
          id: 'complete-application',
          name: 'Complete Application',
          type: 'custom',
          assignTo: 'applicant',
          required: true,
        },
      ],
    },
    {
      id: 'submitted',
      name: 'Submitted',
      type: 'intermediate',
      slaHours: 24,
      onEnter: [
        { type: 'send_notification', config: { template: 'license_submitted', to: 'applicant' } },
      ],
    },
    {
      id: 'under_review',
      name: 'Under Review',
      type: 'intermediate',
      slaHours: 72,
      tasks: [
        {
          id: 'background-check',
          name: 'Background Check',
          type: 'review',
          assignTo: 'system',
          required: true,
        },
        {
          id: 'license-review',
          name: 'License Review',
          type: 'review',
          assignTo: 'reviewer',
          required: true,
          slaHours: 72,
        },
      ],
    },
    {
      id: 'pending_payment',
      name: 'Pending Payment',
      type: 'intermediate',
      slaHours: 168,
      tasks: [
        {
          id: 'pay-license-fee',
          name: 'Pay License Fee',
          type: 'payment',
          assignTo: 'applicant',
          required: true,
        },
      ],
    },
    {
      id: 'approved',
      name: 'Approved',
      type: 'final',
      onEnter: [
        { type: 'send_notification', config: { template: 'license_approved', to: 'applicant' } },
        { type: 'generate_document', config: { template: 'license_certificate' } },
      ],
    },
    {
      id: 'denied',
      name: 'Denied',
      type: 'final',
      onEnter: [
        { type: 'send_notification', config: { template: 'license_denied', to: 'applicant' } },
      ],
    },
    {
      id: 'withdrawn',
      name: 'Withdrawn',
      type: 'final',
    },
    {
      id: 'expired',
      name: 'Expired',
      type: 'final',
    },
  ],
  transitions: [
    { id: 't1', from: 'draft', to: 'submitted', trigger: 'manual' },
    { id: 't2', from: 'submitted', to: 'under_review', trigger: 'auto' },
    { id: 't3', from: 'under_review', to: 'pending_payment', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't4', from: 'under_review', to: 'denied', trigger: 'rejection' },
    { id: 't5', from: 'pending_payment', to: 'approved', trigger: 'payment', guard: { type: 'payment_received' } },
    { id: 't6', from: 'pending_payment', to: 'expired', trigger: 'expiry' },
    { id: 't7', from: 'draft', to: 'withdrawn', trigger: 'manual' },
    { id: 't8', from: 'submitted', to: 'withdrawn', trigger: 'manual' },
  ],
};

export const GRANT_WORKFLOW: WorkflowDefinition = {
  id: 'grant-application',
  name: 'Grant Application',
  description: 'Workflow for grant applications (nonprofit, community, economic development)',
  version: '1.0.0',
  initialState: 'draft',
  finalStates: ['awarded', 'not_awarded', 'withdrawn'],
  states: [
    {
      id: 'draft',
      name: 'Draft',
      type: 'initial',
      tasks: [
        { id: 'complete-application', name: 'Complete Application', type: 'custom', assignTo: 'applicant', required: true },
        { id: 'upload-budget', name: 'Upload Project Budget', type: 'document_upload', assignTo: 'applicant', required: true },
        { id: 'upload-narrative', name: 'Upload Project Narrative', type: 'document_upload', assignTo: 'applicant', required: true },
      ],
    },
    {
      id: 'submitted',
      name: 'Submitted',
      type: 'intermediate',
      slaHours: 48,
    },
    {
      id: 'eligibility_review',
      name: 'Eligibility Review',
      type: 'intermediate',
      slaHours: 120,
      tasks: [
        { id: 'check-eligibility', name: 'Check Eligibility', type: 'review', assignTo: 'reviewer', required: true },
      ],
    },
    {
      id: 'scoring',
      name: 'Scoring',
      type: 'intermediate',
      slaHours: 240,
      tasks: [
        { id: 'score-application', name: 'Score Application', type: 'review', assignTo: 'reviewer', required: true },
      ],
    },
    {
      id: 'committee_review',
      name: 'Committee Review',
      type: 'intermediate',
      slaHours: 168,
      tasks: [
        { id: 'committee-decision', name: 'Committee Decision', type: 'approval', assignTo: 'manager', required: true },
      ],
    },
    {
      id: 'awarded',
      name: 'Awarded',
      type: 'final',
      onEnter: [
        { type: 'send_notification', config: { template: 'grant_awarded', to: 'applicant' } },
        { type: 'generate_document', config: { template: 'grant_agreement' } },
      ],
    },
    {
      id: 'not_awarded',
      name: 'Not Awarded',
      type: 'final',
      onEnter: [
        { type: 'send_notification', config: { template: 'grant_not_awarded', to: 'applicant' } },
      ],
    },
    {
      id: 'withdrawn',
      name: 'Withdrawn',
      type: 'final',
    },
  ],
  transitions: [
    { id: 't1', from: 'draft', to: 'submitted', trigger: 'manual' },
    { id: 't2', from: 'submitted', to: 'eligibility_review', trigger: 'auto' },
    { id: 't3', from: 'eligibility_review', to: 'scoring', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't4', from: 'eligibility_review', to: 'not_awarded', trigger: 'rejection' },
    { id: 't5', from: 'scoring', to: 'committee_review', trigger: 'task_complete', guard: { type: 'all_tasks_complete' } },
    { id: 't6', from: 'committee_review', to: 'awarded', trigger: 'approval' },
    { id: 't7', from: 'committee_review', to: 'not_awarded', trigger: 'rejection' },
    { id: 't8', from: 'draft', to: 'withdrawn', trigger: 'manual' },
    { id: 't9', from: 'submitted', to: 'withdrawn', trigger: 'manual' },
  ],
};

// ============================================
// WORKFLOW ENGINE CLASS
// ============================================

export class WorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  constructor() {
    // Register default workflows
    this.registerWorkflow(PERMIT_WORKFLOW);
    this.registerWorkflow(LICENSE_WORKFLOW);
    this.registerWorkflow(GRANT_WORKFLOW);
  }

  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  getState(workflowId: string, stateId: string): WorkflowState | undefined {
    const workflow = this.getWorkflow(workflowId);
    return workflow?.states.find(s => s.id === stateId);
  }

  getAvailableTransitions(workflowId: string, currentState: string): WorkflowTransition[] {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return [];
    return workflow.transitions.filter(t => t.from === currentState);
  }

  canTransition(
    workflowId: string,
    currentState: string,
    targetState: string,
    context: { tasks?: WorkflowTaskInstance[]; paymentReceived?: boolean; documentsVerified?: boolean }
  ): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;

    const transition = workflow.transitions.find(
      t => t.from === currentState && t.to === targetState
    );
    if (!transition) return false;

    // Check guard conditions
    if (transition.guard) {
      switch (transition.guard.type) {
        case 'all_tasks_complete':
          return context.tasks?.every(t => t.status === 'completed') ?? false;
        case 'payment_received':
          return context.paymentReceived ?? false;
        case 'documents_verified':
          return context.documentsVerified ?? false;
        default:
          return true;
      }
    }

    return true;
  }

  getStatusFromState(stateId: string): ApplicationStatus {
    const statusMap: Record<string, ApplicationStatus> = {
      draft: 'draft',
      submitted: 'submitted',
      under_review: 'under_review',
      eligibility_review: 'under_review',
      scoring: 'under_review',
      committee_review: 'under_review',
      pending_info: 'pending_info',
      pending_payment: 'pending_payment',
      pending_inspection: 'pending_inspection',
      pending_approval: 'under_review',
      approved: 'approved',
      awarded: 'approved',
      denied: 'denied',
      not_awarded: 'denied',
      withdrawn: 'withdrawn',
      expired: 'expired',
    };
    return statusMap[stateId] || 'draft';
  }

  calculateSLA(workflowId: string, stateId: string): Date | null {
    const state = this.getState(workflowId, stateId);
    if (!state?.slaHours) return null;
    
    const slaDate = new Date();
    slaDate.setHours(slaDate.getHours() + state.slaHours);
    return slaDate;
  }
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine();

export default workflowEngine;

