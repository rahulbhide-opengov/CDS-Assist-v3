/**
 * Document Builder Agent Responses
 *
 * Scripted responses for the 6-step Document Builder Assistant demo flow.
 * Each step provides structured content with document actions and highlight targets.
 */

// =============================================================================
// Types
// =============================================================================

export interface DocumentAction {
  type: 'add_section' | 'update_section' | 'navigate';
  sectionTitle?: string;
  sectionType?: 'text' | 'list' | 'heading';
  content?: string;
  variables?: string[];
}

export interface HighlightTarget {
  type: 'outline' | 'section' | 'editor';
  sectionId?: string;
}

export interface DocumentBuilderResponse {
  content: string;
  followUpSuggestions?: string[];
  agentName?: string;
  skillName?: string;
  isFinalMessage?: boolean;
  /** Document-specific metadata */
  documentAction?: DocumentAction;
  /** Sections to highlight in the UI */
  highlightTargets?: HighlightTarget[];
  /** Preview content to show before adding */
  previewContent?: {
    title: string;
    body: string;
    variables?: string[];
  };
  /** Whether this action requires explicit approval (true by default for content changes) */
  requiresApproval?: boolean;
  /** Relationship metadata for action grouping */
  actionRelationship?: {
    groupName: string;
    stepName: string;
    relatedTo?: string[];
  };
}

// =============================================================================
// Demo Responses
// =============================================================================

export const documentBuilderResponses: Record<string, DocumentBuilderResponse> = {
  // -------------------------------------------------------------------------
  // Step 1: Quick Analysis - Missing Scope of Work
  // -------------------------------------------------------------------------
  step1: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Analysis',
    content: `## Missing Required Section

I've scanned your RFP document and found a critical gap:

**Your document is missing a Scope of Work section.**

This is essential for any RFP - it defines what vendors are expected to deliver. Without it, you'll receive inconsistent proposals that are difficult to compare.

I can generate a Scope of Work based on your project details for the Fleet Maintenance Services procurement.`,
    followUpSuggestions: [
      'Generate Scope of Work',
      'What else is missing?',
      'Show me the current sections',
    ],
    highlightTargets: [
      { type: 'outline' },
    ],
  },

  // -------------------------------------------------------------------------
  // Step 2: Scope of Work Preview
  // -------------------------------------------------------------------------
  step2: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Scope of Work - Fleet Maintenance Services

Here's a draft Scope of Work tailored for your fleet maintenance procurement. It covers:

- **Service Requirements** - Preventive maintenance, repairs, inspections
- **Fleet Coverage** - Vehicle types and estimated quantities
- **Response Times** - Service level requirements
- **Reporting** - Monthly performance metrics

Review the preview and click **Add Section** to insert it.`,
    followUpSuggestions: [
      'Add this section',
      'Modify the service requirements',
      'What else should I add?',
    ],
    previewContent: {
      title: 'Scope of Work',
      body: `<h3>1. Service Requirements</h3>
<p>The Contractor shall provide comprehensive fleet maintenance services for the City of Atlanta's vehicle fleet, including:</p>
<ul>
  <li>Scheduled preventive maintenance per manufacturer specifications</li>
  <li>Diagnostic services and mechanical repairs</li>
  <li>Emergency roadside assistance (24/7)</li>
  <li>Annual safety inspections and emissions testing</li>
  <li>Tire services including rotation, balancing, and replacement</li>
</ul>

<h3>2. Fleet Coverage</h3>
<p>Services shall cover approximately 450 vehicles including:</p>
<ul>
  <li>Light-duty vehicles (sedans, SUVs): ~200 units</li>
  <li>Medium-duty trucks: ~150 units</li>
  <li>Heavy-duty vehicles and equipment: ~100 units</li>
</ul>

<h3>3. Response Time Requirements</h3>
<ul>
  <li>Emergency repairs: 2-hour response time</li>
  <li>Standard repairs: Service initiated within 24 hours</li>
  <li>Scheduled maintenance: Completed within 48 hours of drop-off</li>
</ul>

<h3>4. Reporting Requirements</h3>
<p>The Contractor shall provide monthly reports including:</p>
<ul>
  <li>Work orders completed by vehicle and service type</li>
  <li>Parts and labor costs</li>
  <li>Fleet availability metrics</li>
  <li>Warranty recovery tracking</li>
</ul>`,
      variables: [],
    },
    documentAction: {
      type: 'add_section',
      sectionTitle: 'Scope of Work',
      sectionType: 'text',
    },
    requiresApproval: true,
    actionRelationship: {
      groupName: 'RFP Completion',
      stepName: 'Add Scope of Work',
      relatedTo: [],
    },
  },

  // -------------------------------------------------------------------------
  // Step 3: Scope Added Confirmation
  // -------------------------------------------------------------------------
  step3: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Update',
    content: `## Scope of Work Added

The section has been added to your document. You can see it highlighted in the outline.

**Your RFP now has 4 sections.** To complete it, you should also add:

- **Evaluation Criteria** - How proposals will be scored
- **Insurance Requirements** - Contractor liability coverage

Want me to generate the Evaluation Criteria next?`,
    followUpSuggestions: [
      'Yes, add Evaluation Criteria',
      'Show me Insurance Requirements instead',
      'I\'m done for now',
    ],
    highlightTargets: [
      { type: 'section', sectionId: 'scope-of-work' },
    ],
  },

  // -------------------------------------------------------------------------
  // Step 4: Evaluation Criteria Preview
  // -------------------------------------------------------------------------
  step4: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Evaluation Criteria

Here's a scoring methodology tailored for fleet maintenance services:

| Criterion | Points |
|:----------|-------:|
| Technical Approach & Service Plan | 35 |
| Fleet Maintenance Experience | 25 |
| Staffing & Response Capability | 20 |
| References | 10 |
| Price | 10 |

Click **Add Section** to insert.`,
    followUpSuggestions: [
      'Add this section',
      'Adjust the weights',
      'What about Insurance Requirements?',
    ],
    previewContent: {
      title: 'Evaluation Criteria',
      body: `<h3>Scoring Criteria</h3>
<p>Proposals will be evaluated using a 100-point scale:</p>
<ul>
  <li><strong>Technical Approach & Service Plan (35 points)</strong> - Quality of maintenance program, diagnostic capabilities, preventive maintenance schedules</li>
  <li><strong>Fleet Maintenance Experience (25 points)</strong> - Prior experience with municipal fleets, similar contract size and scope</li>
  <li><strong>Staffing & Response Capability (20 points)</strong> - Technician certifications, facility locations, emergency response capacity</li>
  <li><strong>References (10 points)</strong> - Performance on similar contracts, client satisfaction</li>
  <li><strong>Price (10 points)</strong> - Competitiveness of labor rates and markup on parts</li>
</ul>

<h3>Evaluation Process</h3>
<p>An evaluation committee will independently score each proposal. The highest-scoring responsive and responsible vendor will be recommended for contract award.</p>`,
      variables: [],
    },
    documentAction: {
      type: 'add_section',
      sectionTitle: 'Evaluation Criteria',
      sectionType: 'text',
    },
    requiresApproval: true,
    actionRelationship: {
      groupName: 'RFP Completion',
      stepName: 'Add Evaluation Criteria',
      relatedTo: ['Scope of Work'],
    },
  },

  // -------------------------------------------------------------------------
  // Step 5: Insurance Requirements Preview
  // -------------------------------------------------------------------------
  step5: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Insurance Requirements

For fleet maintenance services, contractors typically need:

| Coverage | Minimum |
|:---------|--------:|
| General Liability | $1,000,000 |
| Auto Liability | $1,000,000 |
| Workers' Comp | Statutory |
| Garage Keepers | $500,000 |

Click **Add Section** to insert.`,
    followUpSuggestions: [
      'Add this section',
      'Increase the coverage amounts',
      'What else is needed to complete my document?',
    ],
    previewContent: {
      title: 'Insurance Requirements',
      body: `<h3>Required Coverage</h3>
<p>The Contractor shall maintain the following insurance throughout the contract term:</p>
<ul>
  <li><strong>Commercial General Liability:</strong> $1,000,000 per occurrence / $2,000,000 aggregate</li>
  <li><strong>Automobile Liability:</strong> $1,000,000 combined single limit</li>
  <li><strong>Workers' Compensation:</strong> Statutory limits</li>
  <li><strong>Garage Keepers Liability:</strong> $500,000 (for vehicles in Contractor's care)</li>
</ul>

<h3>Certificate Requirements</h3>
<p>Prior to contract execution, Contractor shall provide:</p>
<ul>
  <li>Certificate of Insurance naming City of Atlanta as additional insured</li>
  <li>30 days written notice of cancellation or material change</li>
  <li>Coverage from insurer rated A- or better by A.M. Best</li>
</ul>`,
      variables: [],
    },
    documentAction: {
      type: 'add_section',
      sectionTitle: 'Insurance Requirements',
      sectionType: 'text',
    },
    requiresApproval: true,
    actionRelationship: {
      groupName: 'RFP Completion',
      stepName: 'Add Insurance Requirements',
      relatedTo: ['Scope of Work', 'Evaluation Criteria'],
    },
  },

  // -------------------------------------------------------------------------
  // Step 6: Completion Summary
  // -------------------------------------------------------------------------
  step6: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Review',
    content: `## RFP Complete

Your Fleet Maintenance Services RFP now has **6 sections**:

| Section | Status |
|:--------|:-------|
| Introduction | ✓ Original |
| Terms & Conditions | ✓ Original |
| Submission Requirements | ✓ Original |
| Scope of Work | ✓ Added |
| Evaluation Criteria | ✓ Added |
| Insurance Requirements | ✓ Added |

**Next steps:** Review each section, then publish when ready.`,
    isFinalMessage: true,
    highlightTargets: [
      { type: 'outline' },
    ],
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

export type DocumentBuilderStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'complete';

export function getResponseForStep(step: DocumentBuilderStep): DocumentBuilderResponse {
  if (step === 'intro') {
    return documentBuilderResponses.step1;
  }
  if (step === 'complete') {
    return {
      ...documentBuilderResponses.step6,
      isFinalMessage: true,
    };
  }
  return documentBuilderResponses[step] || documentBuilderResponses.step1;
}

export function getNextStep(currentStep: DocumentBuilderStep): DocumentBuilderStep {
  const stepOrder: DocumentBuilderStep[] = [
    'intro',
    'step1',
    'step2',
    'step3',
    'step4',
    'step5',
    'step6',
    'complete',
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex < stepOrder.length - 1) {
    return stepOrder[currentIndex + 1];
  }
  return 'complete';
}
