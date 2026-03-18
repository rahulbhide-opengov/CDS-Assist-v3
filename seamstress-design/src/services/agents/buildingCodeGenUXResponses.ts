// Building Code Assistant Gen UX Responses
// Same content as text version but with component metadata for rendering

import type { BuildingCodeResponse } from './buildingCodeAgentResponses';

export interface GenUXResponse extends BuildingCodeResponse {
  uiComponents?: Array<{
    type: 'DeckConfigCard' | 'PermitStatusCard' | 'InspectionTimeline' | 'MaterialComparison' | 'ApprovalCheckpoint' | 'ApplicationSuccess' | 'ApplicationRequirements';
    props?: any;
  }>;
}

// Step 1: Initial deck question with interactive form
export const genUXStep1: GenUXResponse = {
  content: `## Configure Your Deck Project

I'll help you configure your deck project! Let me gather the details with an interactive form.

**After you configure your deck**, I'll instantly check the permit requirements and code compliance based on your specific measurements.`,
  followUpSuggestions: [
    "Yes, attached to house, about 2 feet high",
    "No, freestanding deck",
    "I'm not sure yet"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Building Code Lookup",
  uiComponents: [
    {
      type: 'DeckConfigCard',
      props: {}
    }
  ]
};

// Step 2: Permit determination with visual status card
export const genUXStep2: GenUXResponse = {
  content: `## Permit Requirements Analysis

Based on your configuration, here's your permit status with all the details:`,
  followUpSuggestions: [
    "Yes, help me start a permit application",
    "What information will I need?",
    "How long does the permit process take?"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Building Code Lookup",
  uiComponents: [
    {
      type: 'PermitStatusCard',
      props: {
        permitRequired: true,
        reason: 'Attached to primary structure',
        squareFeet: 192,
        height: 24,
        attachment: 'attached',
        codeSection: '4.2.2'
      }
    }
  ]
};

// Step 3: Application requirements with checklist
export const genUXStep3: GenUXResponse = {
  content: `## Permit Application Requirements

Here's everything you'll need for your permit application:`,
  followUpSuggestions: [
    "Yes, create a draft permit application",
    "What if I need help with the site plan?",
    "Can I do this as owner-builder?"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Permit Application Assistance",
  uiComponents: [
    {
      type: 'ApplicationRequirements',
      props: {
        timeline: '5-10 business days',
        estimatedFee: 210,
        requiredDocs: [
          { name: 'Site Plan', status: 'needed', description: 'Property boundaries and setbacks' },
          { name: 'Material Specs', status: 'needed', description: 'Decking and structural materials' },
          { name: 'Cost Estimate', status: 'needed', description: 'Materials and labor costs' },
          { name: 'Contractor Info', status: 'optional', description: 'If not owner-builder' }
        ]
      }
    }
  ]
};

// Step 4: Approval checkpoint (same as text version - uses ApprovalCheckpoint component)
export const genUXStep4: GenUXResponse = {
  content: `## Draft Application Review

I'd like to create a draft permit application for you. Please review the details below:`,
  followUpSuggestions: [
    "Yes, create the draft",
    "Let me modify the details first",
    "I want to add more information"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Permit Application Assistance",
  requiresApproval: true,
  approvalAction: "create_permit_draft",
  approvalData: {
    "Project Type": "Residential Deck Construction",
    "Dimensions": "12' x 16' (192 sq ft)",
    "Height": "24 inches above grade",
    "Attachment": "Connected to primary dwelling",
    "Location": "Rear yard"
  },
  uiComponents: [
    {
      type: 'ApprovalCheckpoint',
      props: {
        title: 'Agent Action Request',
        actionDescription: "I'd like to create a draft permit application with the following information:",
        actionDetails: {
          "Project Type": "Residential Deck Construction",
          "Dimensions": "12' x 16' (192 sq ft)",
          "Height": "24 inches above grade",
          "Attachment": "Connected to primary dwelling",
          "Location": "Rear yard"
        },
        warningMessage: "This is a DRAFT ONLY - not submitted to staff. You maintain full control over submission."
      }
    }
  ]
};

// Step 5: Application created with success card
export const genUXStep5: GenUXResponse = {
  content: `## Application Created Successfully

Your draft permit application has been successfully created!`,
  followUpSuggestions: [
    "Download the site plan template",
    "Show me approved deck materials",
    "Help me estimate project costs",
    "What if I have questions while completing it?"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Permit Application Assistance",
  uiComponents: [
    {
      type: 'ApplicationSuccess',
      props: {
        applicationId: '#2024-DECK-0123',
        status: 'Draft - Pending Completion',
        expiresIn: '30 days',
        completedItems: [
          'Project Information',
          'Applicant Information',
          'Required Inspections'
        ],
        pendingItems: [
          'Site Plan',
          'Material Specifications',
          'Cost Estimate',
          'Contractor Info (if applicable)'
        ],
        downloadableResources: [
          { name: 'Deck Construction Checklist', type: 'pdf' },
          { name: 'Site Plan Template', type: 'pdf' },
          { name: 'Material Specifications Guide', type: 'pdf' }
        ]
      }
    }
  ]
};

// Step 6: Materials guide with comparison table
export const genUXStep6: GenUXResponse = {
  content: `## Approved Deck Materials Comparison

Compare approved deck materials to find the best option for your project:`,
  followUpSuggestions: [
    "Add pressure-treated lumber to my application",
    "Add composite decking to my application",
    "Tell me more about composite vs. PVC",
    "Go back to my application summary"
  ],
  agentName: "Building Code Assistant - Gen UX",
  skillName: "Building Code Lookup",
  isFinalMessage: false,
  uiComponents: [
    {
      type: 'MaterialComparison',
      props: {
        deckSize: 192,
        materials: [
          {
            name: 'Pressure-Treated',
            icon: '🌲',
            costPerSqFt: '$2-4',
            totalMaterialCost: '$2,500-3,500',
            totalProjectCost: '$4,500-6,500',
            lifespan: '15-25 years',
            pros: ['Affordable', 'Widely available'],
            cons: ['Requires maintenance', 'Can warp'],
            codeCompliant: true,
            rating: 'Most Common'
          },
          {
            name: 'Composite',
            icon: '🏆',
            costPerSqFt: '$5-12',
            totalMaterialCost: '$4,000-6,000',
            totalProjectCost: '$6,500-9,500',
            lifespan: '30-50 years',
            pros: ['No maintenance', 'Won\'t rot or splinter'],
            cons: ['Higher upfront cost', 'Can get hot'],
            codeCompliant: true,
            rating: 'Low Maintenance'
          },
          {
            name: 'PVC',
            icon: '💎',
            costPerSqFt: '$10-15',
            totalMaterialCost: '$6,000-8,000',
            totalProjectCost: '$9,000-12,000',
            lifespan: '50+ years',
            pros: ['Waterproof', 'Stain-resistant', 'Fade-resistant'],
            cons: ['Highest cost', 'Can feel synthetic'],
            codeCompliant: true,
            rating: 'Premium'
          }
        ]
      }
    }
  ]
};

export const buildingCodeGenUXResponses = {
  step1: genUXStep1,
  step2: genUXStep2,
  step3: genUXStep3,
  step4: genUXStep4,
  step5: genUXStep5,
  step6: genUXStep6,
};
