/**
 * Document Builder Simple Agent Responses
 *
 * Simplified responses that return plain formatted text for copy/paste workflow.
 * No GenUX components, action cards, or follow-up suggestion buttons.
 * Users copy content via chat copy button and manually paste into document sections.
 */

// =============================================================================
// Types
// =============================================================================

export interface DocumentBuilderSimpleResponse {
  content: string;
  agentName?: string;
  skillName?: string;
  isFinalMessage?: boolean;
}

// =============================================================================
// Demo Responses
// =============================================================================

export const documentBuilderSimpleResponses: Record<string, DocumentBuilderSimpleResponse> = {
  // -------------------------------------------------------------------------
  // Step 1: Quick Analysis - Missing Scope of Work
  // -------------------------------------------------------------------------
  step1: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Analysis',
    content: `## Document Analysis Complete

I've scanned your RFP document and found a critical gap:

**Your document is missing a Scope of Work section.**

This is essential for any RFP - it defines what vendors are expected to deliver. Without it, you'll receive inconsistent proposals that are difficult to compare.

I can generate a Scope of Work based on your project details for the Fleet Maintenance Services procurement.

**To continue:** Type anything or ask me to generate the Scope of Work.`,
  },

  // -------------------------------------------------------------------------
  // Step 2: Scope of Work - Plain Text Content
  // -------------------------------------------------------------------------
  step2: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Scope of Work

Here's the Scope of Work section for your Fleet Maintenance Services RFP.

**Copy the content below and paste into your document:**

---

### 1. Service Requirements

The Contractor shall provide comprehensive fleet maintenance services for the City of Atlanta's vehicle fleet, including:

- Scheduled preventive maintenance per manufacturer specifications
- Diagnostic services and mechanical repairs
- Emergency roadside assistance (24/7)
- Annual safety inspections and emissions testing
- Tire services including rotation, balancing, and replacement

### 2. Fleet Coverage

Services shall cover approximately 450 vehicles including:

- Light-duty vehicles (sedans, SUVs): ~200 units
- Medium-duty trucks: ~150 units
- Heavy-duty vehicles and equipment: ~100 units

### 3. Response Time Requirements

- Emergency repairs: 2-hour response time
- Standard repairs: Service initiated within 24 hours
- Scheduled maintenance: Completed within 48 hours of drop-off

### 4. Reporting Requirements

The Contractor shall provide monthly reports including:

- Work orders completed by vehicle and service type
- Parts and labor costs
- Fleet availability metrics
- Warranty recovery tracking

---

**To add this to your document:**
1. Click the copy button on this message
2. Add a new section in the outline called "Scope of Work"
3. Paste the content into the editor

**Type anything to continue** and I'll generate the next section.`,
  },

  // -------------------------------------------------------------------------
  // Step 3: Scope Added Confirmation
  // -------------------------------------------------------------------------
  step3: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Update',
    content: `## Great Progress!

Your RFP is taking shape. To complete it, you should also add:

- **Evaluation Criteria** - How proposals will be scored
- **Insurance Requirements** - Contractor liability coverage

I'll generate the Evaluation Criteria next.

**Type anything to continue.**`,
  },

  // -------------------------------------------------------------------------
  // Step 4: Evaluation Criteria - Plain Text Content
  // -------------------------------------------------------------------------
  step4: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Evaluation Criteria

Here's a scoring methodology tailored for fleet maintenance services.

**Copy the content below and paste into your document:**

---

### Scoring Criteria

Proposals will be evaluated using a 100-point scale:

| Criterion | Points |
|:----------|-------:|
| Technical Approach & Service Plan | 35 |
| Fleet Maintenance Experience | 25 |
| Staffing & Response Capability | 20 |
| References | 10 |
| Price | 10 |

**Technical Approach & Service Plan (35 points)**
Quality of maintenance program, diagnostic capabilities, preventive maintenance schedules

**Fleet Maintenance Experience (25 points)**
Prior experience with municipal fleets, similar contract size and scope

**Staffing & Response Capability (20 points)**
Technician certifications, facility locations, emergency response capacity

**References (10 points)**
Performance on similar contracts, client satisfaction

**Price (10 points)**
Competitiveness of labor rates and markup on parts

### Evaluation Process

An evaluation committee will independently score each proposal. The highest-scoring responsive and responsible vendor will be recommended for contract award.

---

**To add this to your document:**
1. Click the copy button on this message
2. Add a new section in the outline called "Evaluation Criteria"
3. Paste the content into the editor

**Type anything to continue** and I'll generate the Insurance Requirements.`,
  },

  // -------------------------------------------------------------------------
  // Step 5: Insurance Requirements - Plain Text Content
  // -------------------------------------------------------------------------
  step5: {
    agentName: 'Document Builder Assistant',
    skillName: 'Content Generation',
    content: `## Insurance Requirements

Here are the insurance requirements for fleet maintenance contractors.

**Copy the content below and paste into your document:**

---

### Required Coverage

The Contractor shall maintain the following insurance throughout the contract term:

| Coverage Type | Minimum Amount |
|:--------------|---------------:|
| Commercial General Liability | $1,000,000 per occurrence / $2,000,000 aggregate |
| Automobile Liability | $1,000,000 combined single limit |
| Workers' Compensation | Statutory limits |
| Garage Keepers Liability | $500,000 (for vehicles in Contractor's care) |

### Certificate Requirements

Prior to contract execution, Contractor shall provide:

- Certificate of Insurance naming City of Atlanta as additional insured
- 30 days written notice of cancellation or material change
- Coverage from insurer rated A- or better by A.M. Best

---

**To add this to your document:**
1. Click the copy button on this message
2. Add a new section in the outline called "Insurance Requirements"
3. Paste the content into the editor

**Type anything to see the completion summary.**`,
  },

  // -------------------------------------------------------------------------
  // Step 6: Completion Summary
  // -------------------------------------------------------------------------
  step6: {
    agentName: 'Document Builder Assistant',
    skillName: 'Document Review',
    content: `## RFP Sections Complete

I've helped you generate 3 key sections for your Fleet Maintenance Services RFP:

| Section | Status |
|:--------|:-------|
| Scope of Work | Ready to paste |
| Evaluation Criteria | Ready to paste |
| Insurance Requirements | Ready to paste |

### Recommended Document Structure

Your complete RFP should include:

1. Introduction (Original)
2. Terms & Conditions (Original)
3. Submission Requirements (Original)
4. **Scope of Work** (Generated)
5. **Evaluation Criteria** (Generated)
6. **Insurance Requirements** (Generated)

### Next Steps

1. Review each generated section in the chat history above
2. Copy and paste content into your document outline
3. Customize any details specific to your procurement
4. Review the Final Review tab for validation

**Need anything else?** Type "restart" to generate new content or ask me a question.`,
    isFinalMessage: true,
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

export type DocumentBuilderSimpleStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'complete';

export function getSimpleResponseForStep(step: DocumentBuilderSimpleStep): DocumentBuilderSimpleResponse {
  if (step === 'intro') {
    return documentBuilderSimpleResponses.step1;
  }
  if (step === 'complete') {
    return {
      ...documentBuilderSimpleResponses.step6,
      isFinalMessage: true,
    };
  }
  return documentBuilderSimpleResponses[step] || documentBuilderSimpleResponses.step1;
}

export function getSimpleNextStep(currentStep: DocumentBuilderSimpleStep): DocumentBuilderSimpleStep {
  const stepOrder: DocumentBuilderSimpleStep[] = [
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
