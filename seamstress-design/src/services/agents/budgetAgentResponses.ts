// Linear demo scenario: Budget Variance Analysis
// Takes user through a 5-step journey to identify and resolve budget issues

export interface BudgetResponse {
  content: string;
  followUpSuggestions?: string[];
  agentName?: string;
  skillName?: string;
  isFinalMessage?: boolean;
}

// Step 1: Initial variance overview
export const step1VarianceOverview: BudgetResponse = {
  content: `I've analyzed your Q4 budget performance and identified significant variances that need attention.

## Executive Summary
- **Total Budget Variance**: -$247,000 (12% over budget)
- **Critical Areas**: Marketing and IT departments showing concerning trends
- **Time Period**: October - December 2024

## Top 3 Variances by Impact
1. **Marketing Department**: $142,000 over budget (28% variance)
   - Digital advertising campaigns exceeded planned spend
   - Unbudgeted trade show participation

2. **IT Infrastructure**: $87,000 over budget (15% variance)
   - Emergency server replacements
   - Unexpected cloud storage scaling

3. **Facilities**: $18,000 over budget (9% variance)
   - HVAC system repairs
   - Increased utility costs`,
  followUpSuggestions: [
    "Show me the detailed breakdown for Marketing overspend"
  ],
  agentName: "Budget & Planning Agent",
  skillName: "Variance Analysis"
};

// Step 2: Marketing department deep dive
export const step2MarketingDetail: BudgetResponse = {
  content: `## Marketing Department Detailed Analysis

### Digital Advertising Breakdown
**Planned Budget**: $320,000 | **Actual Spend**: $412,000 | **Variance**: -$92,000

| Channel | Budgeted | Actual | Variance | Notes |
|---------|----------|--------|----------|-------|
| Google Ads | $120,000 | $178,000 | -$58,000 | CPC increased 40% in competitive season |
| Social Media | $80,000 | $95,000 | -$15,000 | Added TikTok campaigns mid-quarter |
| Display Network | $60,000 | $71,000 | -$11,000 | Extended retargeting campaigns |
| Email Platform | $60,000 | $68,000 | -$8,000 | Upgraded to enterprise tier |

### Trade Show Participation
**Unbudgeted Expense**: $50,000
- Last-minute opportunity at industry's premier event
- ROI projected at 3.2x based on lead generation

### Key Finding
The majority of overspend (65%) comes from Google Ads due to increased competition during Q4 shopping season.`,
  followUpSuggestions: [
    "What optimization strategies do you recommend for Google Ads?"
  ],
  agentName: "Budget & Planning Agent",
  skillName: "Department Analysis"
};

// Step 3: Optimization recommendations
export const step3Recommendations: BudgetResponse = {
  content: `## Google Ads Optimization Strategy

### Immediate Actions (This Week)
1. **Dayparting Optimization**
   - Pause ads during low-conversion hours (2 AM - 6 AM)
   - Estimated savings: $12,000/month

2. **Negative Keywords Audit**
   - Add 150+ identified irrelevant search terms
   - Estimated savings: $8,000/month

3. **Quality Score Improvements**
   - Optimize landing pages for top 20 keywords
   - Expected CPC reduction: 15-20%

### Next 30 Days
1. **Campaign Restructuring**
   - Separate brand vs non-brand campaigns
   - Implement SKAG (Single Keyword Ad Groups) for top performers
   - Projected efficiency gain: 25%

2. **Budget Reallocation**
   - Shift 30% budget from Display to Search
   - Focus on high-intent keywords only

### Expected Results
- **Monthly savings**: $28,000-$35,000
- **Conversion rate improvement**: 18-22%
- **Overall ROAS increase**: 35%`,
  followUpSuggestions: [
    "How should we reallocate the saved budget?"
  ],
  agentName: "Budget & Planning Agent",
  skillName: "Optimization Planning"
};

// Step 4: Budget reallocation plan
export const step4Reallocation: BudgetResponse = {
  content: `## Strategic Budget Reallocation Plan

### Recommended Reallocation of $35,000 Monthly Savings

#### 1. Performance Marketing Reserve (40% - $14,000)
- Create buffer for Q1 2025 campaigns
- Test emerging channels (Connected TV, Podcast ads)
- A/B testing budget for creative optimization

#### 2. Marketing Analytics Tools (30% - $10,500)
- Implement attribution modeling platform
- Advanced competitor intelligence tools
- Real-time dashboard for spend monitoring

#### 3. Content Creation (20% - $7,000)
- Hire freelance video editors for social content
- Increase blog posting frequency
- Develop case study library

#### 4. Training & Development (10% - $3,500)
- Google Ads certification for team
- Conference attendance budget
- Online course subscriptions

### Implementation Timeline
- **Week 1**: Set up reserve accounts and approval workflows
- **Week 2**: Vendor selection for analytics tools
- **Week 3**: Begin content creator recruitment
- **Week 4**: Launch training program enrollment`,
  followUpSuggestions: [
    "Create an action plan with specific deadlines and owners"
  ],
  agentName: "Budget & Planning Agent",
  skillName: "Resource Planning"
};

// Step 5: Final action plan and conclusion
export const step5ActionPlan: BudgetResponse = {
  content: `## Executive Action Plan - Budget Optimization Initiative

### Week 1 (Starting Monday)
**Owner: Sarah Chen (Marketing Director)**
- [ ] Implement Google Ads dayparting rules
- [ ] Complete negative keywords audit
- [ ] Set up daily spend alerts at 90% threshold

### Week 2
**Owner: Mike Rodriguez (Digital Marketing Manager)**
- [ ] Launch landing page optimization for top 20 keywords
- [ ] Restructure campaigns (brand/non-brand separation)
- [ ] Configure attribution modeling platform

### Week 3
**Owner: Lisa Park (Marketing Operations)**
- [ ] Establish reserve fund accounting structure
- [ ] Post freelance content creator requisitions
- [ ] Schedule team training sessions

### Week 4
**Owner: Sarah Chen (Marketing Director)**
- [ ] Review optimization results
- [ ] Adjust Q1 2025 budget projections
- [ ] Present findings to executive team

### Success Metrics
- 📊 Reduce marketing overspend by 75% within 30 days
- 📈 Improve ROAS from 2.8x to 3.8x
- 💰 Achieve $105,000 in quarterly savings

### Next Review
Schedule follow-up on January 15, 2025 to assess Q1 performance against these targets.`,
  agentName: "Budget & Planning Agent",
  skillName: "Action Planning",
  isFinalMessage: true
};

// Map common queries to responses for the linear flow
export const budgetAgentResponses: Record<string, BudgetResponse> = {
  // Initial triggers
  "analyze my budget": step1VarianceOverview,
  "show budget variances": step1VarianceOverview,
  "budget analysis": step1VarianceOverview,
  "help with budget planning": step1VarianceOverview,

  // Step progressions
  "show me the detailed breakdown for marketing overspend": step2MarketingDetail,
  "marketing details": step2MarketingDetail,
  "tell me more about marketing": step2MarketingDetail,

  "what optimization strategies do you recommend for google ads?": step3Recommendations,
  "optimization strategies": step3Recommendations,
  "how to reduce costs": step3Recommendations,

  "how should we reallocate the saved budget?": step4Reallocation,
  "budget reallocation": step4Reallocation,
  "reallocate savings": step4Reallocation,

  "create an action plan with specific deadlines and owners": step5ActionPlan,
  "action plan": step5ActionPlan,
  "next steps": step5ActionPlan,

  // Default to step 1
  "default": step1VarianceOverview
};