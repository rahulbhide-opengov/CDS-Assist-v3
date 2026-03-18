/**
 * Section Library Mock Data
 * 30 reusable document sections organized by category
 *
 * Categories:
 * - Terms & Conditions
 * - Insurance Requirements
 * - Compliance
 * - Evaluation Criteria
 * - Pricing
 * - Timelines
 */

import type { SharedSection } from '../../types/procurement';

export const MOCK_SHARED_SECTIONS: SharedSection[] = [
  // ============================================================================
  // Terms & Conditions (6 sections)
  // ============================================================================
  {
    sectionId: 'section-001',
    title: 'Standard Terms and Conditions',
    content: `<p>The following terms and conditions apply to this procurement:</p>
<ul>
  <li>All proposals must be submitted by the deadline specified</li>
  <li>The {{agency.name}} reserves the right to reject any or all proposals</li>
  <li>Proposers are responsible for all costs incurred in preparing and submitting proposals</li>
  <li>This solicitation does not commit the {{agency.name}} to award a contract</li>
  <li>The {{agency.name}} reserves the right to request clarifications or additional information</li>
</ul>`,
    category: 'Terms & Conditions',
    tags: ['standard', 'legal', 'requirements'],
    variables: ['agency.name'],
    usageCount: 145,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
  },
  {
    sectionId: 'section-002',
    title: 'Payment Terms - Net 30',
    content: `<p><strong>Payment Terms:</strong> Payment will be made within thirty (30) days of receipt of a proper invoice and acceptance of goods or services.</p>
<p>Invoices must include:</p>
<ul>
  <li>Purchase order or contract number</li>
  <li>Detailed description of goods/services provided</li>
  <li>Itemized pricing</li>
  <li>Vendor's tax ID number</li>
</ul>
<p>Payment will be made via ACH transfer unless otherwise specified.</p>`,
    category: 'Terms & Conditions',
    tags: ['payment', 'financial', 'invoicing'],
    variables: [],
    usageCount: 98,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-12-15T16:45:00Z',
  },
  {
    sectionId: 'section-003',
    title: 'Indemnification Clause',
    content: `<p><strong>Indemnification:</strong> The Contractor agrees to indemnify, defend, and hold harmless {{agency.name}}, its officers, employees, and agents from and against any and all claims, damages, losses, and expenses, including attorney's fees, arising out of or resulting from the performance of the work, provided that such claim, damage, loss, or expense is attributable to bodily injury, sickness, disease, or death, or to injury to or destruction of tangible property, including loss of use resulting therefrom, but only to the extent caused by the negligent acts or omissions of the Contractor, its employees, subcontractors, or anyone for whose acts the Contractor may be liable.</p>`,
    category: 'Terms & Conditions',
    tags: ['legal', 'liability', 'protection'],
    variables: ['agency.name'],
    usageCount: 112,
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
  },
  {
    sectionId: 'section-004',
    title: 'Termination for Convenience',
    content: `<p><strong>Termination for Convenience:</strong> {{agency.name}} may terminate this contract in whole or in part at any time by written notice to the Contractor. Upon receipt of such notice, the Contractor shall:</p>
<ol>
  <li>Stop work under the contract on the date specified in the notice</li>
  <li>Place no further orders or subcontracts for materials, services, or facilities</li>
  <li>Terminate all orders and subcontracts to the extent they relate to the terminated work</li>
  <li>Take such action as may be necessary for the protection and preservation of property</li>
</ol>
<p>The Contractor shall be paid for all work performed prior to termination.</p>`,
    category: 'Terms & Conditions',
    tags: ['termination', 'contract management', 'legal'],
    variables: ['agency.name'],
    usageCount: 76,
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2024-11-20T10:30:00Z',
  },
  {
    sectionId: 'section-005',
    title: 'Warranty Requirements',
    content: `<p><strong>Warranty:</strong> The Contractor warrants that all goods and services provided under this contract shall:</p>
<ul>
  <li>Be free from defects in materials and workmanship</li>
  <li>Conform to the specifications and requirements of this contract</li>
  <li>Be fit for their intended purpose</li>
  <li>Comply with all applicable federal, state, and local laws and regulations</li>
</ul>
<p>Warranty Period: {{warranty.period}} from date of acceptance.</p>
<p>During the warranty period, the Contractor shall repair or replace any defective goods or services at no additional cost to {{agency.name}}.</p>`,
    category: 'Terms & Conditions',
    tags: ['warranty', 'quality', 'defects'],
    variables: ['warranty.period', 'agency.name'],
    usageCount: 89,
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-12-28T11:00:00Z',
  },
  {
    sectionId: 'section-006',
    title: 'Intellectual Property Rights',
    content: `<p><strong>Intellectual Property:</strong> All deliverables, including but not limited to documents, reports, software, designs, and other work products created under this contract, shall become the exclusive property of {{agency.name}}.</p>
<p>The Contractor hereby assigns to {{agency.name}} all right, title, and interest in and to such deliverables, including all copyrights, patents, trademarks, and other intellectual property rights.</p>
<p>The Contractor warrants that all deliverables are original works and do not infringe upon the intellectual property rights of any third party.</p>`,
    category: 'Terms & Conditions',
    tags: ['intellectual property', 'copyright', 'ownership'],
    variables: ['agency.name'],
    usageCount: 54,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-10-15T15:30:00Z',
  },

  // ============================================================================
  // Insurance Requirements (5 sections)
  // ============================================================================
  {
    sectionId: 'section-007',
    title: 'General Liability Insurance - $1M/$2M',
    content: `<p><strong>Commercial General Liability Insurance:</strong> The Contractor shall maintain commercial general liability insurance with minimum limits of:</p>
<ul>
  <li>$1,000,000 per occurrence</li>
  <li>$2,000,000 general aggregate</li>
  <li>$2,000,000 products and completed operations aggregate</li>
</ul>
<p>Coverage shall include bodily injury, property damage, personal injury, and advertising injury.</p>
<p>{{agency.name}} shall be named as an additional insured on this policy.</p>`,
    category: 'Insurance Requirements',
    tags: ['insurance', 'liability', 'coverage'],
    variables: ['agency.name'],
    usageCount: 134,
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2025-01-12T10:00:00Z',
  },
  {
    sectionId: 'section-008',
    title: 'Workers Compensation Insurance',
    content: `<p><strong>Workers' Compensation Insurance:</strong> The Contractor shall maintain workers' compensation insurance as required by state law, providing coverage for all employees engaged in work under this contract.</p>
<p>Minimum coverage limits:</p>
<ul>
  <li>Statutory limits for workers' compensation</li>
  <li>$1,000,000 Employer's Liability - each accident</li>
  <li>$1,000,000 Employer's Liability - disease, each employee</li>
  <li>$1,000,000 Employer's Liability - disease, policy limit</li>
</ul>
<p>A waiver of subrogation in favor of {{agency.name}} is required.</p>`,
    category: 'Insurance Requirements',
    tags: ['insurance', 'workers compensation', 'employees'],
    variables: ['agency.name'],
    usageCount: 121,
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-12-20T14:15:00Z',
  },
  {
    sectionId: 'section-009',
    title: 'Professional Liability Insurance (E&O)',
    content: `<p><strong>Professional Liability Insurance (Errors & Omissions):</strong> The Contractor shall maintain professional liability insurance covering errors, omissions, and negligent acts arising from professional services provided under this contract.</p>
<p>Minimum coverage: $2,000,000 per claim and in the aggregate.</p>
<p>Coverage must be maintained for a minimum of three (3) years following completion of services.</p>
<p>If coverage is on a claims-made basis, the Contractor shall maintain an extended reporting period (tail coverage) for three years after contract completion.</p>`,
    category: 'Insurance Requirements',
    tags: ['insurance', 'professional liability', 'errors and omissions'],
    variables: [],
    usageCount: 67,
    createdAt: '2024-02-05T10:30:00Z',
    updatedAt: '2024-11-30T09:00:00Z',
  },
  {
    sectionId: 'section-010',
    title: 'Auto Insurance Requirements',
    content: `<p><strong>Automobile Liability Insurance:</strong> The Contractor shall maintain automobile liability insurance covering all owned, hired, and non-owned vehicles used in connection with this contract.</p>
<p>Minimum limits:</p>
<ul>
  <li>$1,000,000 combined single limit per accident</li>
  <li>Coverage for bodily injury and property damage</li>
</ul>
<p>{{agency.name}} shall be named as an additional insured on this policy.</p>`,
    category: 'Insurance Requirements',
    tags: ['insurance', 'auto', 'vehicles'],
    variables: ['agency.name'],
    usageCount: 92,
    createdAt: '2024-02-12T13:30:00Z',
    updatedAt: '2024-12-10T16:00:00Z',
  },
  {
    sectionId: 'section-011',
    title: 'Cyber Liability Insurance',
    content: `<p><strong>Cyber Liability Insurance:</strong> For contracts involving the handling, storage, or transmission of sensitive data, the Contractor shall maintain cyber liability insurance.</p>
<p>Minimum coverage: $2,000,000 per occurrence and in the aggregate.</p>
<p>Coverage shall include:</p>
<ul>
  <li>Data breach response costs</li>
  <li>Notification expenses</li>
  <li>Credit monitoring services</li>
  <li>Legal defense and liability</li>
  <li>Business interruption</li>
  <li>Cyber extortion</li>
</ul>`,
    category: 'Insurance Requirements',
    tags: ['insurance', 'cyber', 'data security'],
    variables: [],
    usageCount: 43,
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-09-20T11:30:00Z',
  },

  // ============================================================================
  // Compliance (6 sections)
  // ============================================================================
  {
    sectionId: 'section-012',
    title: 'Equal Opportunity Employment',
    content: `<p><strong>Equal Employment Opportunity:</strong> The Contractor shall comply with all applicable federal, state, and local laws prohibiting discrimination in employment.</p>
<p>The Contractor shall not discriminate against any employee or applicant for employment because of race, color, religion, sex, national origin, age, disability, or veteran status.</p>
<p>The Contractor shall take affirmative action to ensure that applicants are employed and employees are treated during employment without regard to protected characteristics.</p>`,
    category: 'Compliance',
    tags: ['equal opportunity', 'civil rights', 'employment'],
    variables: [],
    usageCount: 156,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2025-01-08T15:00:00Z',
  },
  {
    sectionId: 'section-013',
    title: 'DBE Requirements - 15% Goal',
    content: `<p><strong>Disadvantaged Business Enterprise (DBE) Requirements:</strong> This contract has a DBE participation goal of {{dbe.goal}}%.</p>
<p>The Contractor shall make good faith efforts to meet this goal by:</p>
<ul>
  <li>Soliciting DBE firms through outreach activities</li>
  <li>Dividing contract work into smaller portions to facilitate DBE participation</li>
  <li>Providing technical assistance and bonding support where appropriate</li>
  <li>Negotiating in good faith with interested DBE firms</li>
</ul>
<p>The Contractor must submit DBE utilization reports monthly throughout the contract period.</p>`,
    category: 'Compliance',
    tags: ['DBE', 'diversity', 'small business'],
    variables: ['dbe.goal'],
    usageCount: 78,
    createdAt: '2024-02-08T11:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
  },
  {
    sectionId: 'section-014',
    title: 'Prevailing Wage Requirements',
    content: `<p><strong>Prevailing Wage:</strong> This project is subject to prevailing wage requirements under federal and/or state law.</p>
<p>The Contractor shall:</p>
<ul>
  <li>Pay all laborers and mechanics employed on the project no less than the prevailing wage rates</li>
  <li>Post prevailing wage rate schedules at the job site</li>
  <li>Submit certified payroll reports weekly</li>
  <li>Maintain accurate time and pay records for all workers</li>
  <li>Provide apprenticeship training programs where required</li>
</ul>
<p>Failure to comply with prevailing wage requirements may result in contract termination and withholding of payment.</p>`,
    category: 'Compliance',
    tags: ['prevailing wage', 'labor', 'payroll'],
    variables: [],
    usageCount: 65,
    createdAt: '2024-02-20T09:30:00Z',
    updatedAt: '2024-11-25T14:00:00Z',
  },
  {
    sectionId: 'section-015',
    title: 'Background Check Requirements',
    content: `<p><strong>Background Checks:</strong> All Contractor personnel who will have access to {{agency.name}} facilities, systems, or sensitive information must undergo a background check prior to starting work.</p>
<p>Background checks shall include:</p>
<ul>
  <li>Criminal history check (federal and state)</li>
  <li>Employment verification</li>
  <li>Education verification (if applicable)</li>
  <li>Professional license verification (if applicable)</li>
</ul>
<p>The Contractor is responsible for all costs associated with background checks.</p>
<p>{{agency.name}} reserves the right to deny access to any individual who does not pass the background check.</p>`,
    category: 'Compliance',
    tags: ['background check', 'security', 'screening'],
    variables: ['agency.name'],
    usageCount: 87,
    createdAt: '2024-03-05T10:30:00Z',
    updatedAt: '2024-10-20T16:15:00Z',
  },
  {
    sectionId: 'section-016',
    title: 'Conflict of Interest Policy',
    content: `<p><strong>Conflict of Interest:</strong> The Contractor warrants that, to the best of its knowledge, there are no relevant facts or circumstances that could give rise to a conflict of interest.</p>
<p>The Contractor shall:</p>
<ul>
  <li>Disclose any actual or potential conflicts of interest immediately upon discovery</li>
  <li>Not engage in any activity that conflicts with the Contractor's obligations under this contract</li>
  <li>Not accept or solicit any gift, gratuity, or favor from any party with business before {{agency.name}}</li>
  <li>Maintain the confidentiality of all proprietary information</li>
</ul>
<p>Failure to disclose conflicts of interest may result in contract termination.</p>`,
    category: 'Compliance',
    tags: ['conflict of interest', 'ethics', 'disclosure'],
    variables: ['agency.name'],
    usageCount: 71,
    createdAt: '2024-03-12T11:30:00Z',
    updatedAt: '2024-09-15T13:45:00Z',
  },
  {
    sectionId: 'section-017',
    title: 'Confidentiality and Data Security',
    content: `<p><strong>Confidentiality:</strong> The Contractor acknowledges that it may have access to confidential information and sensitive data belonging to {{agency.name}}.</p>
<p>The Contractor agrees to:</p>
<ul>
  <li>Maintain the confidentiality of all proprietary information</li>
  <li>Implement appropriate security measures to protect data</li>
  <li>Comply with all applicable privacy laws and regulations</li>
  <li>Not disclose or use confidential information except as necessary to perform under this contract</li>
  <li>Return or destroy all confidential information upon contract termination</li>
</ul>
<p>The Contractor shall immediately notify {{agency.name}} of any unauthorized access or data breach.</p>`,
    category: 'Compliance',
    tags: ['confidentiality', 'data security', 'privacy'],
    variables: ['agency.name'],
    usageCount: 103,
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-12-05T09:30:00Z',
  },

  // ============================================================================
  // Evaluation Criteria (5 sections)
  // ============================================================================
  {
    sectionId: 'section-018',
    title: 'Technical Evaluation Criteria',
    content: `<p><strong>Technical Evaluation:</strong> Technical proposals will be evaluated based on the following criteria:</p>
<ol>
  <li><strong>Understanding of Requirements (25 points):</strong> Demonstrated comprehension of project scope and objectives</li>
  <li><strong>Technical Approach (30 points):</strong> Quality and feasibility of proposed methodology</li>
  <li><strong>Qualifications and Experience (25 points):</strong> Relevant experience and expertise of proposed team</li>
  <li><strong>Past Performance (20 points):</strong> References and track record on similar projects</li>
</ol>
<p><strong>Total Technical Points: 100</strong></p>
<p>Proposers must score a minimum of 70 points to be considered for award.</p>`,
    category: 'Evaluation Criteria',
    tags: ['evaluation', 'scoring', 'technical'],
    variables: [],
    usageCount: 142,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  },
  {
    sectionId: 'section-019',
    title: 'Price Evaluation Method',
    content: `<p><strong>Price Evaluation:</strong> Price proposals will be evaluated using the following method:</p>
<p>Price Score = (Lowest Responsive Price / Proposer's Price) × Maximum Price Points</p>
<p>Where Maximum Price Points = {{price.maxPoints}}</p>
<p>Example: If the lowest responsive price is $100,000, a proposer's price is $120,000, and maximum price points is 40:</p>
<p>Price Score = ($100,000 / $120,000) × 40 = 33.33 points</p>
<p>The lowest priced responsive and responsible proposer will receive the maximum price points.</p>`,
    category: 'Evaluation Criteria',
    tags: ['evaluation', 'pricing', 'cost'],
    variables: ['price.maxPoints'],
    usageCount: 95,
    createdAt: '2024-02-03T11:30:00Z',
    updatedAt: '2024-12-12T15:00:00Z',
  },
  {
    sectionId: 'section-020',
    title: 'Best Value Selection',
    content: `<p><strong>Best Value Award:</strong> This contract will be awarded based on best value, considering both technical merit and price.</p>
<p>Evaluation Weights:</p>
<ul>
  <li>Technical Score: 60%</li>
  <li>Price Score: 40%</li>
</ul>
<p>The proposal receiving the highest combined score will be recommended for award, provided the proposer is responsive and responsible.</p>
<p>{{agency.name}} reserves the right to conduct interviews or request presentations from top-ranked proposers before making a final selection.</p>`,
    category: 'Evaluation Criteria',
    tags: ['evaluation', 'best value', 'award'],
    variables: ['agency.name'],
    usageCount: 118,
    createdAt: '2024-02-16T09:00:00Z',
    updatedAt: '2024-11-18T10:30:00Z',
  },
  {
    sectionId: 'section-021',
    title: 'Local Preference Policy',
    content: `<p><strong>Local Preference:</strong> {{agency.name}} provides a preference to local businesses in the evaluation of proposals.</p>
<p>A proposer qualifies as a local business if:</p>
<ul>
  <li>The business has a physical office within {{jurisdiction.name}}</li>
  <li>The business has been operating in {{jurisdiction.name}} for at least one year</li>
  <li>The business has a valid {{jurisdiction.name}} business license</li>
</ul>
<p>Local businesses will receive a {{local.bonus}}% price preference. For example, a local business's price of $105,000 will be evaluated as $100,000 ($105,000 × 0.95).</p>`,
    category: 'Evaluation Criteria',
    tags: ['local preference', 'evaluation', 'scoring'],
    variables: ['agency.name', 'jurisdiction.name', 'local.bonus'],
    usageCount: 52,
    createdAt: '2024-03-08T10:30:00Z',
    updatedAt: '2024-09-25T14:15:00Z',
  },
  {
    sectionId: 'section-022',
    title: 'References and Past Performance',
    content: `<p><strong>References:</strong> Proposers must provide a minimum of three (3) references for similar projects completed within the past five (5) years.</p>
<p>For each reference, provide:</p>
<ul>
  <li>Client name and contact information</li>
  <li>Project description and scope</li>
  <li>Contract value</li>
  <li>Project dates (start and completion)</li>
  <li>Brief description of services provided</li>
</ul>
<p>{{agency.name}} reserves the right to contact references and consider their feedback in the evaluation process. Poor past performance may result in proposal rejection.</p>`,
    category: 'Evaluation Criteria',
    tags: ['references', 'past performance', 'evaluation'],
    variables: ['agency.name'],
    usageCount: 109,
    createdAt: '2024-03-18T11:00:00Z',
    updatedAt: '2024-10-10T16:30:00Z',
  },

  // ============================================================================
  // Pricing (4 sections)
  // ============================================================================
  {
    sectionId: 'section-023',
    title: 'Fixed Price Structure',
    content: `<p><strong>Fixed Price:</strong> This contract is a fixed-price agreement. The Contractor agrees to provide all goods and services specified in the scope of work for the total contract price of {{contract.value}}.</p>
<p>The fixed price includes all costs associated with performance, including but not limited to:</p>
<ul>
  <li>Labor and materials</li>
  <li>Equipment and tools</li>
  <li>Transportation and shipping</li>
  <li>Overhead and profit</li>
  <li>Taxes and fees</li>
</ul>
<p>No price adjustments will be permitted except as authorized by formal contract amendment.</p>`,
    category: 'Pricing',
    tags: ['pricing', 'fixed price', 'cost'],
    variables: ['contract.value'],
    usageCount: 124,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-12-22T11:30:00Z',
  },
  {
    sectionId: 'section-024',
    title: 'Time and Materials Pricing',
    content: `<p><strong>Time and Materials:</strong> This contract will be paid on a time and materials basis, subject to a not-to-exceed amount of {{contract.maxValue}}.</p>
<p>Hourly rates by labor category:</p>
<table>
  <tr><th>Labor Category</th><th>Hourly Rate</th></tr>
  <tr><td>Senior Consultant</td><td>$[Rate]</td></tr>
  <tr><td>Consultant</td><td>$[Rate]</td></tr>
  <tr><td>Junior Consultant</td><td>$[Rate]</td></tr>
  <tr><td>Administrative Support</td><td>$[Rate]</td></tr>
</table>
<p>Materials will be billed at cost plus {{markup.percentage}}% markup.</p>
<p>Contractor must obtain prior written approval before exceeding the not-to-exceed amount.</p>`,
    category: 'Pricing',
    tags: ['pricing', 'time and materials', 'hourly rates'],
    variables: ['contract.maxValue', 'markup.percentage'],
    usageCount: 81,
    createdAt: '2024-02-25T11:00:00Z',
    updatedAt: '2024-11-30T15:00:00Z',
  },
  {
    sectionId: 'section-025',
    title: 'Unit Price Schedule',
    content: `<p><strong>Unit Pricing:</strong> Pricing shall be based on the following unit price schedule. Payment will be made for actual quantities delivered and accepted.</p>
<table>
  <tr><th>Item</th><th>Unit</th><th>Unit Price</th><th>Estimated Quantity</th></tr>
  <tr><td>Item 1 Description</td><td>Each</td><td>$[Price]</td><td>[Qty]</td></tr>
  <tr><td>Item 2 Description</td><td>Each</td><td>$[Price]</td><td>[Qty]</td></tr>
  <tr><td>Item 3 Description</td><td>Hour</td><td>$[Price]</td><td>[Qty]</td></tr>
</table>
<p>Estimated quantities are provided for reference only. Actual quantities may vary based on {{agency.name}}'s needs.</p>
<p>Unit prices shall remain firm for the duration of the contract period.</p>`,
    category: 'Pricing',
    tags: ['pricing', 'unit price', 'schedule'],
    variables: ['agency.name'],
    usageCount: 93,
    createdAt: '2024-03-10T10:30:00Z',
    updatedAt: '2024-10-15T14:00:00Z',
  },
  {
    sectionId: 'section-026',
    title: 'Price Escalation Clause',
    content: `<p><strong>Price Escalation:</strong> For multi-year contracts, prices may be adjusted annually based on the Consumer Price Index (CPI).</p>
<p>Price adjustment calculation:</p>
<p>New Price = Current Price × (New CPI / Base CPI)</p>
<p>Where:</p>
<ul>
  <li>Base CPI is the index value at contract execution</li>
  <li>New CPI is the index value at the time of adjustment</li>
</ul>
<p>Price adjustments are capped at {{escalation.cap}}% per year.</p>
<p>The Contractor must provide 60 days' advance notice of any price increase request, along with supporting documentation.</p>`,
    category: 'Pricing',
    tags: ['pricing', 'escalation', 'CPI'],
    variables: ['escalation.cap'],
    usageCount: 47,
    createdAt: '2024-03-25T11:30:00Z',
    updatedAt: '2024-09-10T16:00:00Z',
  },

  // ============================================================================
  // Timelines (4 sections)
  // ============================================================================
  {
    sectionId: 'section-027',
    title: 'Project Schedule and Milestones',
    content: `<p><strong>Project Timeline:</strong> The project shall be completed in accordance with the following schedule:</p>
<ul>
  <li><strong>Project Start Date:</strong> {{contract.startDate}}</li>
  <li><strong>Kickoff Meeting:</strong> Within 10 business days of contract execution</li>
  <li><strong>Phase 1 Completion:</strong> [Date]</li>
  <li><strong>Phase 2 Completion:</strong> [Date]</li>
  <li><strong>Final Deliverable:</strong> {{contract.endDate}}</li>
</ul>
<p>Time is of the essence. Failure to meet schedule milestones may result in liquidated damages or contract termination.</p>`,
    category: 'Timelines',
    tags: ['schedule', 'milestones', 'deadlines'],
    variables: ['contract.startDate', 'contract.endDate'],
    usageCount: 167,
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2025-01-14T10:30:00Z',
  },
  {
    sectionId: 'section-028',
    title: 'Delivery Schedule Requirements',
    content: `<p><strong>Delivery Schedule:</strong> Goods must be delivered in accordance with the following schedule:</p>
<ul>
  <li>Initial shipment: Within {{delivery.initial}} days of purchase order</li>
  <li>Subsequent shipments: As specified in individual purchase orders</li>
  <li>Final delivery: No later than {{delivery.final}}</li>
</ul>
<p>Delivery location: {{delivery.location}}</p>
<p>Delivery hours: Monday-Friday, 8:00 AM - 4:00 PM (excluding holidays)</p>
<p>The Contractor must provide 48 hours advance notice of all deliveries.</p>
<p>Partial shipments are [permitted/not permitted] unless otherwise specified.</p>`,
    category: 'Timelines',
    tags: ['delivery', 'schedule', 'logistics'],
    variables: ['delivery.initial', 'delivery.final', 'delivery.location'],
    usageCount: 88,
    createdAt: '2024-02-18T11:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z',
  },
  {
    sectionId: 'section-029',
    title: 'Liquidated Damages',
    content: `<p><strong>Liquidated Damages:</strong> Time is of the essence in this contract. If the Contractor fails to complete the work by the specified completion date, {{agency.name}} may assess liquidated damages.</p>
<p>Liquidated damages will be assessed at the rate of \${{damages.rate}} per calendar day for each day of delay beyond the completion date.</p>
<p>These liquidated damages are not a penalty but represent a reasonable estimate of the actual damages that {{agency.name}} will incur due to delayed completion.</p>
<p>Assessment of liquidated damages does not waive {{agency.name}}'s right to terminate the contract for default.</p>`,
    category: 'Timelines',
    tags: ['liquidated damages', 'delays', 'penalties'],
    variables: ['agency.name', 'damages.rate'],
    usageCount: 72,
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-10-05T14:00:00Z',
  },
  {
    sectionId: 'section-030',
    title: 'Time Extensions and Changes',
    content: `<p><strong>Time Extensions:</strong> The Contractor may request a time extension if delays are caused by:</p>
<ul>
  <li>Acts of God or force majeure events</li>
  <li>Changes ordered by {{agency.name}}</li>
  <li>Delays caused by {{agency.name}} or its other contractors</li>
  <li>Unusually severe weather conditions</li>
</ul>
<p>Extension requests must be submitted in writing within 10 days of the cause of delay, with supporting documentation.</p>
<p>{{agency.name}} will review and approve or deny extension requests within 15 business days.</p>
<p>Approved extensions will be documented through a formal contract amendment.</p>`,
    category: 'Timelines',
    tags: ['time extensions', 'delays', 'change orders'],
    variables: ['agency.name'],
    usageCount: 64,
    createdAt: '2024-03-28T11:00:00Z',
    updatedAt: '2024-09-18T16:30:00Z',
  },
];

/**
 * Get sections by category
 */
export function getSectionsByCategory(category: string): SharedSection[] {
  return MOCK_SHARED_SECTIONS.filter((s) => s.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(MOCK_SHARED_SECTIONS.map((s) => s.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export function getTags(): string[] {
  const tags = new Set<string>();
  MOCK_SHARED_SECTIONS.forEach((s) => s.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get section by ID
 */
export function getSectionById(sectionId: string): SharedSection | undefined {
  return MOCK_SHARED_SECTIONS.find((s) => s.sectionId === sectionId);
}
