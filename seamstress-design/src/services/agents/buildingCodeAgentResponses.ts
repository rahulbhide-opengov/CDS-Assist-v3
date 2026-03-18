// Building Code Assistant Demo Scenario
// Guides citizen through deck construction requirements with human-in-the-loop approval

export interface BuildingCodeResponse {
  content: string;
  followUpSuggestions?: string[];
  agentName?: string;
  skillName?: string;
  isFinalMessage?: boolean;
  requiresApproval?: boolean;
  approvalAction?: string;
  approvalData?: any;
}

// Step 1: Initial deck question
export const step1InitialQuestion: BuildingCodeResponse = {
  content: `## Deck Project Requirements

I'll help you understand the requirements for your deck project!

Based on the **Residential Construction Requirements** knowledge document, here's what you need to know:

## 📏 Deck Size
Your 12x16 deck = **192 square feet**

## ✅ Permit Status
Your deck is just under the 200 sq ft threshold, **BUT** you'll still need a permit if:
- It's attached to your house, **OR**
- It's more than 30 inches off the ground

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.2 (Permit Requirements)

## 📍 Setback Requirements
All residential decks must maintain minimum distances from property lines:
- **Rear yard**: 10 feet from property line
- **Side yards**: 5 feet from property line
- **Exception**: If deck is under 30" high, can be within 5' of rear line

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.1 (Setback Requirements)

## ❓ Quick Questions
To determine your exact requirements, I need to know:

1. **Will this deck be attached to your house?**
2. **How high off the ground will it be?**

These answers will help me determine if you need a permit and what requirements apply.`,
  followUpSuggestions: [
    "Yes, attached to house, about 2 feet high",
    "No, freestanding deck",
    "I'm not sure yet"
  ],
  agentName: "Building Code Assistant",
  skillName: "Building Code Lookup"
};

// Step 2: Permit determination
export const step2PermitRequired: BuildingCodeResponse = {
  content: `## ✅ Permit Required

Based on your information (attached, 24" high), **you DO need a building permit**.

### Why?
According to the building code, a permit is required for:
- ✓ All decks attached to primary structure (regardless of size)
- All decks over 200 sq ft
- All decks over 30" above grade

Your deck meets the first criteria - it's attached to your house.

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.2 (Permit Requirements)

## 📋 Required Inspections

Your deck will need **3 inspections**:

1. **Footing Inspection**
   - Schedule: Before concrete is poured
   - Inspector verifies: Depth (36" frost line), diameter (12" min)

2. **Framing Inspection**
   - Schedule: After framing complete, before decking installed
   - Inspector verifies: Structural connections, joist spacing, beam sizing

3. **Final Inspection**
   - Schedule: After complete with railings
   - Inspector verifies: Railing height (36-42"), baluster spacing (max 4")

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.4 (Inspection Schedule)

## 📐 Approved Materials

**Decking materials:**
- Pressure-treated lumber (ground contact rated, .40 CCA retention)
- Cedar or redwood (heartwood only)
- Composite with 25-year manufacturer warranty
- PVC decking meeting ASTM D6662

**Structural support:**
- Posts: 4x4 minimum pressure-treated
- Footings: 12" diameter, 36" deep (below frost line)

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.3 (Approved Materials)

## 💡 Next Steps

Would you like me to help you get started with a permit application? I can pre-fill the basic information based on what you've told me.`,
  followUpSuggestions: [
    "Yes, help me start a permit application",
    "What information will I need?",
    "How long does the permit process take?"
  ],
  agentName: "Building Code Assistant",
  skillName: "Building Code Lookup"
};

// Step 3: Application requirements
export const step3ApplicationInfo: BuildingCodeResponse = {
  content: `## 📝 Permit Application Requirements

To complete your permit application, you'll need the following information and documents:

### Required Information
✓ **Property address** - I have this from your account
✓ **Project description** - 12x16 deck, 24" height, attached
✓ **Owner information** - I have this from your account

### Still Needed
📋 **Site Plan** showing:
  - Property boundaries with dimensions
  - Location of house
  - Location of proposed deck
  - Setback measurements from property lines

📋 **Construction Details**:
  - Material selections (pressure-treated, cedar, or composite?)
  - Foundation plan (footing locations)
  - Framing plan (joist layout, beam sizes)

📋 **Cost Estimate**:
  - Materials cost
  - Labor cost (if hiring contractor)
  - Total project cost

📋 **Contractor Information** (if applicable):
  - Contractor name and license number
  - OR indication if owner-builder

> 📖 **Source**: @knowledge/residential-building-code - Section 3.1 (Application Requirements)

## 📅 Timeline
- **Initial Review**: 5-10 business days after submission
- **Permit Validity**: 12 months from issue date
- **Typical Total Time**: 2-3 weeks including any revisions

> 📖 **Source**: @knowledge/residential-building-code - Section 3.2 (Review Process)

## 💰 Estimated Fees
Based on typical deck costs:
- Base permit fee: **$150**
- Cost-based fee: ~**$60** (assuming $4,000 project at $15 per $1,000)
- **Total estimated**: **$210**

(Inspection fees are included in permit fee)

> 📖 **Source**: @knowledge/residential-building-code - Section 3.3 (Fees)

## 🚀 Ready to Start?

I can create a **draft application** with the information I have. You'll be able to review and add the remaining details before submission.`,
  followUpSuggestions: [
    "Yes, create a draft permit application",
    "What if I need help with the site plan?",
    "Can I do this as owner-builder?"
  ],
  agentName: "Building Code Assistant",
  skillName: "Permit Application Assistance"
};

// Step 4: Pre-approval checkpoint (HITL)
export const step4ApprovalRequest: BuildingCodeResponse = {
  content: `## 🤖 Agent Action Request

I'd like to create a **draft permit application** with the following information:

### Application Details
- **Project Type**: Residential Deck Construction
- **Dimensions**: 12 feet x 16 feet (192 sq ft)
- **Height**: 24 inches above grade
- **Attachment**: Connected to primary dwelling
- **Location**: Rear yard
- **Property**: [Your address from account]
- **Applicant**: [Your name from account]

### What Happens Next?
1. ✅ **Draft saved to your account** - No submission yet
2. 📝 **You complete remaining details**:
   - Upload site plan
   - Specify materials
   - Add contractor info (if applicable)
   - Provide cost estimate
3. 👀 **You review and approve** before final submission
4. 📤 **You submit** when ready

### ⚠️ Important
- This is a **DRAFT ONLY** - not submitted to staff
- You maintain full control over submission
- You can modify or delete at any time
- Staff will not see this until you explicitly submit

## Would you like me to proceed?`,
  followUpSuggestions: [
    "Yes, create the draft",
    "Let me modify the details first",
    "I want to add more information"
  ],
  agentName: "Building Code Assistant",
  skillName: "Permit Application Assistance",
  requiresApproval: true,
  approvalAction: "create_permit_draft",
  approvalData: {
    projectType: "Residential Deck Construction",
    dimensions: "12' x 16' (192 sq ft)",
    height: "24 inches above grade",
    attachment: "Connected to primary dwelling",
    location: "Rear yard"
  }
};

// Step 5: Application created
export const step5ApplicationCreated: BuildingCodeResponse = {
  content: `## ✅ Draft Application Created!

I've successfully created your draft permit application.

### What I've Filled In
✅ **Project Information**
- Type: Residential Deck Construction
- Dimensions: 12' x 16' (192 sq ft)
- Height: 24" above grade
- Attachment: Connected to primary dwelling
- Location: Rear yard

✅ **Applicant Information**
- Name and contact from your account
- Property address

✅ **Required Inspections** (Pre-populated)
- Footing inspection
- Framing inspection
- Final inspection

### 📝 Still Needed From You

To complete your application, please provide:

1. **Site Plan**
   - Can be hand-drawn with measurements
   - Must show property lines and setbacks
   - Template available in application

2. **Material Specifications**
   - Select decking type (from approved list in §4.2.3)
   - Structural lumber specifications
   - Railing materials

3. **Cost Estimate**
   - Materials: $___
   - Labor: $___ (or indicate owner-builder)
   - **Total project cost**: $___

4. **Contractor Info** (if not owner-builder)
   - Name and license number
   - Proof of insurance

### 📥 Download Helpful Resources

**Deck Construction Checklist** - Complete guide to deck building requirements

**Site Plan Template** - Fill-in-the-blank template for your property

**Material Specifications Guide** - List of all approved materials with code references

### 🎯 Next Steps

Your draft is saved and ready for you to complete. You can:
- Add remaining information at your own pace
- Save progress and return later
- Submit when all information is complete

**Application ID**: #2024-DECK-0123
**Status**: Draft - Pending Completion
**Expires**: 30 days from today

Would you like help with any of these remaining items?`,
  followUpSuggestions: [
    "Download the site plan template",
    "Show me approved deck materials",
    "Help me estimate project costs",
    "What if I have questions while completing it?"
  ],
  agentName: "Building Code Assistant",
  skillName: "Permit Application Assistance"
};

// Step 6: Additional help - materials
export const step6MaterialsGuide: BuildingCodeResponse = {
  content: `## 🔨 Approved Deck Materials

Here's a complete guide to approved materials for your deck project:

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.3 (Approved Materials)

### Decking Surface Materials

**1. Pressure-Treated Lumber** ⭐ Most Common
- Rating: Ground contact (.40 CCA retention minimum)
- Typical cost: $2-4 per sq ft
- Lifespan: 15-25 years with proper maintenance
- **Pros**: Affordable, widely available
- **Cons**: Requires annual maintenance, can warp

**2. Cedar or Redwood** 🌲 Natural Beauty
- Grade: Heartwood only
- Typical cost: $4-8 per sq ft
- Lifespan: 20-30 years
- **Pros**: Natural rot resistance, beautiful appearance
- **Cons**: Higher cost, fades without treatment

**3. Composite Decking** 🏆 Low Maintenance
- Requirements: 25-year manufacturer warranty minimum
- Typical cost: $5-12 per sq ft
- Lifespan: 30-50 years
- **Pros**: No maintenance, won't rot or splinter
- **Cons**: Higher upfront cost, can get hot in sun

**4. PVC Decking** 💎 Premium Option
- Standard: ASTM D6662 compliant
- Typical cost: $10-15 per sq ft
- Lifespan: 50+ years
- **Pros**: Waterproof, stain-resistant, fade-resistant
- **Cons**: Highest cost, can feel synthetic

### Structural Support (Required)

**Posts**: Minimum 4x4 pressure-treated lumber
- Cost: ~$12-15 per 8' post
- Quantity needed: ~6-8 posts for your deck

**Beams**: Sized per IRC Table R507.5
- For 12' span: Typically 2x10 or double 2x8
- Cost: ~$8-12 per linear foot

**Joists**: 2x6 (up to 8' span) or 2x8 (8-10' span)
- Spacing: 16" on center typical
- Cost: ~$5-8 per joist

**Footings**:
- Size: 12" diameter minimum
- Depth: 36" (below frost line in Springfield)
- Concrete: 3,000 PSI minimum
- Cost: ~$30-40 per footing (8 needed)

### 💰 Cost Estimate for Your 192 sq ft Deck

**Budget Option** (Pressure-treated):
- Materials: $2,500 - $3,500
- Labor (if hired): $2,000 - $3,000
- **Total**: $4,500 - $6,500

**Mid-Range** (Composite):
- Materials: $4,000 - $6,000
- Labor (if hired): $2,500 - $3,500
- **Total**: $6,500 - $9,500

**Premium** (PVC):
- Materials: $6,000 - $8,000
- Labor (if hired): $3,000 - $4,000
- **Total**: $9,000 - $12,000

### 📋 Material Selection Tips

1. **Climate Consideration**: Composite and PVC perform best in wet climates
2. **Maintenance Preference**: If you want low maintenance, avoid wood
3. **Budget**: Pressure-treated is most economical
4. **Resale Value**: Composite/PVC adds more to home value

> 📖 **All specifications referenced from**: @knowledge/residential-building-code - Chapter 4 (Accessory Structures) & Chapter 6 (Approved Materials)

Would you like me to add a specific material selection to your permit application?`,
  followUpSuggestions: [
    "Add pressure-treated lumber to my application",
    "Add composite decking to my application",
    "Tell me more about composite vs. PVC",
    "Go back to my application summary"
  ],
  agentName: "Building Code Assistant",
  skillName: "Building Code Lookup",
  isFinalMessage: false
};

// Alternative flow: No permit needed
export const alternativeNoPermitNeeded: BuildingCodeResponse = {
  content: `## ✅ Good News - No Permit Required!

Based on your information (freestanding, under 200 sq ft, under 30" high), **you do NOT need a building permit** for this deck.

### Why No Permit Needed?

Your deck meets the exemption criteria:
- ✓ Under 200 square feet (you have 192 sq ft)
- ✓ Freestanding (not attached to house)
- ✓ Under 30 inches above grade

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.2 (Permit Requirements - Exemptions)

### ⚠️ Important - You Still Must Follow Code

Even though no permit is required, you still need to follow:

**Setback Requirements**:
- 5 feet from side property lines
- 5 feet from rear property line (exception applies since under 30")
- Cannot be in front setback area

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.1 (Setback Requirements)

**Approved Materials**:
- Pressure-treated lumber rated for ground contact
- Cedar/redwood heartwood
- Composite with 25-year warranty
- PVC meeting ASTM D6662

> 📖 **Source**: @knowledge/residential-building-code - Section 4.2.3 (Approved Materials)

**Safety Requirements**:
- Proper footing depth (36" if using footings)
- Appropriate joist/beam sizing
- If you add railings, must meet 36-42" height requirement

### 🎉 You Can Start Building!

Since no permit is required, you can begin construction when ready. However, I recommend:

1. **Verify setbacks** - Measure from your property lines to ensure compliance
2. **Use quality materials** - Choose from approved materials list
3. **Build to code** - Follow structural requirements even without inspection
4. **Keep records** - Document your construction for future reference/resale

### 📚 Helpful Resources

Would you like me to provide:
- Construction best practices guide
- Material selection recommendations
- Footing depth and sizing guide
- Step-by-step building checklist`,
  followUpSuggestions: [
    "Show me approved materials",
    "What about setback measurements?",
    "Give me construction tips",
    "I might want to make it bigger instead"
  ],
  agentName: "Building Code Assistant",
  skillName: "Building Code Lookup"
};

// Response map for demo routing
export const buildingCodeResponses = {
  step1: step1InitialQuestion,
  step2: step2PermitRequired,
  step3: step3ApplicationInfo,
  step4: step4ApprovalRequest,
  step5: step5ApplicationCreated,
  step6: step6MaterialsGuide,
  alternative: alternativeNoPermitNeeded
};

// Simple pattern matching for demo
export function getBuildingCodeResponse(userMessage: string): BuildingCodeResponse {
  const message = userMessage.toLowerCase();

  // Step 1 responses
  if (message.includes('deck') && message.includes('12') && message.includes('16')) {
    return step1InitialQuestion;
  }

  // Step 2 - attached and height specified
  if (message.includes('attached') || (message.includes('yes') && message.includes('feet'))) {
    return step2PermitRequired;
  }

  // Alternative - freestanding
  if (message.includes('freestanding') || message.includes('not attached')) {
    return alternativeNoPermitNeeded;
  }

  // Step 3 - application info request
  if (message.includes('start') && message.includes('application')) {
    return step3ApplicationInfo;
  }
  if (message.includes('information') && message.includes('need')) {
    return step3ApplicationInfo;
  }

  // Step 4 - approval request
  if (message.includes('yes') && message.includes('draft')) {
    return step4ApprovalRequest;
  }
  if (message.includes('create') && message.includes('draft')) {
    return step4ApprovalRequest;
  }

  // Step 5 - after approval (handled by approval system)
  // This will be triggered by the approval action

  // Step 6 - materials guide
  if (message.includes('material') || message.includes('approved deck')) {
    return step6MaterialsGuide;
  }

  // Default to step 1
  return step1InitialQuestion;
}
