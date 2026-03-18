/**
 * Realistic Section Content Templates for Procurement Documents
 *
 * Contains pre-written, realistic content for various procurement document sections.
 * This content simulates what actual government procurement documents would contain.
 */

import { faker } from '@faker-js/faker';

// ============================================================================
// Section Content Templates by Title
// ============================================================================

export const SECTION_CONTENT_TEMPLATES: Record<string, () => string> = {
  'Scope of Work': () => `
<h2>1. Overview</h2>
<p>The {{department.name}} is seeking qualified vendors to provide {{project.title}} services. This solicitation outlines the requirements, deliverables, and evaluation criteria for the proposed engagement.</p>

<h2>2. Background</h2>
<p>The City of {{city.name}} requires professional services to support ongoing operations and initiatives. The selected vendor will work closely with city staff to ensure successful project delivery within established timelines and budget constraints.</p>

<h2>3. Scope of Services</h2>
<p>The selected vendor shall provide the following services:</p>
<ul>
  <li>Conduct comprehensive needs assessment and analysis</li>
  <li>Develop detailed project implementation plan</li>
  <li>Provide ongoing technical support and consultation</li>
  <li>Deliver training sessions for city personnel</li>
  <li>Submit regular progress reports and documentation</li>
</ul>

<h2>4. Deliverables</h2>
<p>The vendor shall deliver the following items:</p>
<ol>
  <li>Project kickoff meeting and documentation within 10 business days of contract execution</li>
  <li>Detailed project plan with milestones and timelines</li>
  <li>Monthly progress reports throughout the contract period</li>
  <li>Final project documentation and knowledge transfer materials</li>
  <li>Post-implementation support for a minimum of 90 days</li>
</ol>

<h2>5. Performance Standards</h2>
<p>The vendor shall maintain the following performance standards:</p>
<ul>
  <li>Response to inquiries within 24 business hours</li>
  <li>On-site presence as required by project manager</li>
  <li>Compliance with all applicable local, state, and federal regulations</li>
  <li>Adherence to city security and privacy policies</li>
</ul>
`.trim(),

  'Introduction': () => `
<h2>Purpose</h2>
<p>This document serves as the official solicitation for {{project.title}}. The {{department.name}} invites qualified vendors to submit proposals in accordance with the requirements outlined herein.</p>

<h2>Issuing Office</h2>
<p>This Request for Proposal (RFP) is issued by:</p>
<p><strong>{{department.name}}</strong><br/>
{{city.name}}<br/>
Contact: {{contact.name}}<br/>
Email: {{contact.email}}<br/>
Phone: {{contact.phone}}</p>

<h2>Schedule of Events</h2>
<table>
  <tr><th>Event</th><th>Date</th></tr>
  <tr><td>RFP Release Date</td><td>{{timeline.releaseDate}}</td></tr>
  <tr><td>Pre-Proposal Conference</td><td>{{timeline.preProposalDate}}</td></tr>
  <tr><td>Questions Deadline</td><td>{{timeline.qaDeadline}}</td></tr>
  <tr><td>Proposal Submission Deadline</td><td>{{timeline.submissionDeadline}}</td></tr>
  <tr><td>Anticipated Award Date</td><td>{{timeline.awardDate}}</td></tr>
</table>

<h2>Communication</h2>
<p>All inquiries regarding this RFP must be submitted in writing via email to the designated procurement officer. Verbal communications will not be binding. Questions and responses will be posted as addenda to this solicitation.</p>
`.trim(),

  'Requirements': () => `
<h2>Mandatory Requirements</h2>
<p>Vendors must meet all of the following mandatory requirements to be considered for award:</p>

<h3>1. Business Requirements</h3>
<ul>
  <li>Registered to do business in the State of {{state.name}}</li>
  <li>Valid business license in the city or county of operation</li>
  <li>Minimum of ${faker.number.int({ min: 3, max: 10 })} years of experience in the required service area</li>
  <li>No debarment or suspension from government contracts</li>
</ul>

<h3>2. Insurance Requirements</h3>
<ul>
  <li>Commercial General Liability: $${faker.number.int({ min: 1, max: 5 })},000,000 per occurrence</li>
  <li>Professional Liability/Errors & Omissions: $${faker.number.int({ min: 1, max: 3 })},000,000 per claim</li>
  <li>Workers' Compensation: Statutory limits as required by law</li>
  <li>Automobile Liability: $1,000,000 combined single limit</li>
</ul>

<h3>3. Technical Requirements</h3>
<ul>
  <li>Demonstrated capability to perform all services described in the Scope of Work</li>
  <li>Availability of qualified personnel with relevant certifications</li>
  <li>Access to necessary equipment, tools, and technology</li>
  <li>Established quality assurance procedures</li>
</ul>

<h3>4. Financial Requirements</h3>
<ul>
  <li>Financial stability demonstrated through audited financial statements</li>
  <li>Sufficient bonding capacity if applicable</li>
  <li>No outstanding tax liens or judgments</li>
</ul>
`.trim(),

  'Terms and Conditions': () => `
<h2>General Terms and Conditions</h2>

<h3>1. Contract Term</h3>
<p>The initial contract term shall be ${faker.number.int({ min: 1, max: 3 })} year(s) from the date of execution, with the option to renew for up to ${faker.number.int({ min: 2, max: 4 })} additional one-year periods upon mutual agreement.</p>

<h3>2. Payment Terms</h3>
<p>Payment shall be made within ${faker.helpers.arrayElement([30, 45, 60])} days of receipt of a valid invoice. Invoices must include:</p>
<ul>
  <li>Purchase order number</li>
  <li>Detailed description of services rendered</li>
  <li>Period of performance</li>
  <li>Supporting documentation as required</li>
</ul>

<h3>3. Termination</h3>
<p>Either party may terminate this agreement with ${faker.helpers.arrayElement([30, 60, 90])} days written notice. The City reserves the right to terminate immediately for cause, including but not limited to:</p>
<ul>
  <li>Failure to perform services as specified</li>
  <li>Violation of applicable laws or regulations</li>
  <li>Breach of confidentiality requirements</li>
  <li>Fraud or misrepresentation</li>
</ul>

<h3>4. Indemnification</h3>
<p>The Contractor shall indemnify, defend, and hold harmless the City, its officers, employees, and agents from any claims, damages, or liability arising from the Contractor's performance under this agreement.</p>

<h3>5. Confidentiality</h3>
<p>The Contractor shall maintain strict confidentiality of all proprietary and sensitive information obtained during the course of this engagement. This obligation shall survive the termination of the contract.</p>

<h3>6. Governing Law</h3>
<p>This agreement shall be governed by the laws of the State of {{state.name}}. Any disputes shall be resolved in the courts of {{county.name}} County.</p>
`.trim(),

  'Evaluation Criteria': () => {
    const technicalWeight = faker.number.int({ min: 30, max: 50 });
    const experienceWeight = faker.number.int({ min: 15, max: 25 });
    const priceWeight = faker.number.int({ min: 20, max: 35 });
    const remaining = 100 - technicalWeight - experienceWeight - priceWeight;

    return `
<h2>Proposal Evaluation</h2>
<p>Proposals will be evaluated based on the following criteria. The City reserves the right to award to the vendor whose proposal provides the best overall value.</p>

<h3>Evaluation Criteria and Weights</h3>
<table>
  <tr><th>Criteria</th><th>Weight</th><th>Maximum Points</th></tr>
  <tr><td>Technical Approach</td><td>${technicalWeight}%</td><td>${technicalWeight}</td></tr>
  <tr><td>Experience and Qualifications</td><td>${experienceWeight}%</td><td>${experienceWeight}</td></tr>
  <tr><td>Price</td><td>${priceWeight}%</td><td>${priceWeight}</td></tr>
  <tr><td>References and Past Performance</td><td>${remaining}%</td><td>${remaining}</td></tr>
  <tr><td><strong>Total</strong></td><td><strong>100%</strong></td><td><strong>100</strong></td></tr>
</table>

<h3>Technical Approach (${technicalWeight}%)</h3>
<p>Evaluation factors include:</p>
<ul>
  <li>Understanding of project requirements and objectives</li>
  <li>Proposed methodology and implementation plan</li>
  <li>Innovation and value-added services</li>
  <li>Risk mitigation strategies</li>
</ul>

<h3>Experience and Qualifications (${experienceWeight}%)</h3>
<p>Evaluation factors include:</p>
<ul>
  <li>Relevant experience with similar projects</li>
  <li>Qualifications of proposed project team</li>
  <li>Professional certifications and training</li>
  <li>Organizational capabilities and resources</li>
</ul>

<h3>Price (${priceWeight}%)</h3>
<p>Price proposals will be evaluated based on:</p>
<ul>
  <li>Competitiveness of proposed pricing</li>
  <li>Completeness and clarity of cost breakdown</li>
  <li>Reasonableness of rates and fees</li>
</ul>

<h3>References and Past Performance (${remaining}%)</h3>
<p>The City will contact references provided by vendors and may consider:</p>
<ul>
  <li>Quality of work performed</li>
  <li>Timeliness of delivery</li>
  <li>Communication and responsiveness</li>
  <li>Overall client satisfaction</li>
</ul>
`.trim();
  },

  'Security Compliance Requirements': () => `
<h2>Information Security Requirements</h2>

<h3>1. Data Protection</h3>
<p>The Contractor shall implement and maintain appropriate security measures to protect City data, including:</p>
<ul>
  <li>Encryption of data at rest and in transit using industry-standard protocols</li>
  <li>Access controls limiting data access to authorized personnel only</li>
  <li>Regular security assessments and vulnerability scanning</li>
  <li>Incident response procedures with ${faker.number.int({ min: 24, max: 72 })}-hour notification requirement</li>
</ul>

<h3>2. Compliance Standards</h3>
<p>The Contractor must demonstrate compliance with applicable standards including:</p>
<ul>
  <li>SOC 2 Type II certification (if handling sensitive data)</li>
  <li>NIST Cybersecurity Framework alignment</li>
  <li>State and federal privacy regulations</li>
  <li>PCI DSS compliance (if processing payment card data)</li>
</ul>

<h3>3. Background Checks</h3>
<p>All Contractor personnel with access to City systems or facilities must pass background checks including:</p>
<ul>
  <li>Criminal history check</li>
  <li>Employment verification</li>
  <li>Education verification</li>
  <li>Reference checks</li>
</ul>

<h3>4. Physical Security</h3>
<p>When working on-site, Contractor personnel must:</p>
<ul>
  <li>Display City-issued identification badges at all times</li>
  <li>Follow all building access and security procedures</li>
  <li>Report security incidents immediately to City security personnel</li>
  <li>Return all access credentials upon contract completion</li>
</ul>

<h3>5. Data Retention and Disposal</h3>
<p>Upon contract termination, the Contractor shall:</p>
<ul>
  <li>Return all City data in a format specified by the City</li>
  <li>Securely destroy all copies of City data within ${faker.number.int({ min: 30, max: 90 })} days</li>
  <li>Provide written certification of data destruction</li>
</ul>
`.trim(),

  'Pricing Table': () => `
<h2>Pricing Instructions</h2>

<h3>1. Cost Proposal Format</h3>
<p>Vendors shall submit pricing in the following format:</p>

<h4>Labor Rates</h4>
<table>
  <tr>
    <th>Position/Role</th>
    <th>Hourly Rate</th>
    <th>Estimated Hours</th>
    <th>Extended Cost</th>
  </tr>
  <tr>
    <td>Project Manager</td>
    <td>$____/hour</td>
    <td>____</td>
    <td>$____</td>
  </tr>
  <tr>
    <td>Senior Consultant</td>
    <td>$____/hour</td>
    <td>____</td>
    <td>$____</td>
  </tr>
  <tr>
    <td>Technical Specialist</td>
    <td>$____/hour</td>
    <td>____</td>
    <td>$____</td>
  </tr>
  <tr>
    <td>Support Staff</td>
    <td>$____/hour</td>
    <td>____</td>
    <td>$____</td>
  </tr>
</table>

<h4>Fixed Price Items (if applicable)</h4>
<table>
  <tr>
    <th>Item Description</th>
    <th>Quantity</th>
    <th>Unit Price</th>
    <th>Extended Price</th>
  </tr>
  <tr>
    <td>[Describe item]</td>
    <td>____</td>
    <td>$____</td>
    <td>$____</td>
  </tr>
</table>

<h3>2. Additional Costs</h3>
<p>Identify any additional costs that may apply:</p>
<ul>
  <li>Travel expenses (if not included in hourly rates)</li>
  <li>Materials and supplies</li>
  <li>Subcontractor costs</li>
  <li>Optional services or add-ons</li>
</ul>

<h3>3. Price Validity</h3>
<p>Proposed prices shall remain valid for a minimum of ${faker.helpers.arrayElement([90, 120, 180])} days from the proposal submission deadline.</p>

<h3>4. Payment Schedule</h3>
<p>Indicate preferred payment schedule:</p>
<ul>
  <li>☐ Monthly invoicing for services rendered</li>
  <li>☐ Milestone-based payments</li>
  <li>☐ Other (describe): _______________</li>
</ul>
`.trim(),

  'Vendor Questionnaire': () => `
<h2>Vendor Information Questionnaire</h2>

<h3>Section A: Company Information</h3>
<ol>
  <li>
    <p><strong>Legal Business Name:</strong></p>
    <p>_________________________________________________</p>
  </li>
  <li>
    <p><strong>DBA (if applicable):</strong></p>
    <p>_________________________________________________</p>
  </li>
  <li>
    <p><strong>Business Address:</strong></p>
    <p>_________________________________________________</p>
  </li>
  <li>
    <p><strong>Year Established:</strong> _________</p>
  </li>
  <li>
    <p><strong>Business Type:</strong></p>
    <p>☐ Corporation &nbsp; ☐ LLC &nbsp; ☐ Partnership &nbsp; ☐ Sole Proprietorship &nbsp; ☐ Other</p>
  </li>
  <li>
    <p><strong>Federal Tax ID Number:</strong> _________________</p>
  </li>
</ol>

<h3>Section B: Certifications and Registrations</h3>
<ol start="7">
  <li>
    <p><strong>State Business License Number:</strong> _________________</p>
  </li>
  <li>
    <p><strong>Applicable Professional Licenses:</strong></p>
    <p>_________________________________________________</p>
  </li>
  <li>
    <p><strong>Diversity Certifications (check all that apply):</strong></p>
    <p>☐ MBE &nbsp; ☐ WBE &nbsp; ☐ DBE &nbsp; ☐ SDVOB &nbsp; ☐ HUBZone &nbsp; ☐ 8(a)</p>
  </li>
</ol>

<h3>Section C: Experience and Qualifications</h3>
<ol start="10">
  <li>
    <p><strong>Number of years providing services similar to those requested:</strong> _____</p>
  </li>
  <li>
    <p><strong>Number of full-time employees:</strong> _____</p>
  </li>
  <li>
    <p><strong>List three (3) similar projects completed in the last five years:</strong></p>
    <p>1. _________________________________________________</p>
    <p>2. _________________________________________________</p>
    <p>3. _________________________________________________</p>
  </li>
</ol>

<h3>Section D: Compliance Questions</h3>
<ol start="13">
  <li>
    <p><strong>Has your company ever been debarred or suspended from government contracting?</strong></p>
    <p>☐ Yes &nbsp; ☐ No &nbsp; (If yes, provide details)</p>
  </li>
  <li>
    <p><strong>Has your company been involved in any litigation in the past 5 years?</strong></p>
    <p>☐ Yes &nbsp; ☐ No &nbsp; (If yes, provide details)</p>
  </li>
  <li>
    <p><strong>Does your company carry all required insurance coverages?</strong></p>
    <p>☐ Yes &nbsp; ☐ No</p>
  </li>
</ol>
`.trim(),

  'Project Timeline': () => `
<h2>Project Timeline and Milestones</h2>

<h3>Phase 1: Project Initiation (Weeks 1-2)</h3>
<ul>
  <li>Contract execution and project kickoff meeting</li>
  <li>Initial stakeholder interviews and requirements gathering</li>
  <li>Project plan development and approval</li>
  <li>Resource allocation and team onboarding</li>
</ul>

<h3>Phase 2: Analysis and Planning (Weeks 3-6)</h3>
<ul>
  <li>Current state assessment and gap analysis</li>
  <li>Requirements documentation and validation</li>
  <li>Solution design and approach refinement</li>
  <li>Risk assessment and mitigation planning</li>
</ul>

<h3>Phase 3: Implementation (Weeks 7-${faker.number.int({ min: 12, max: 20 })})</h3>
<ul>
  <li>Solution development/configuration</li>
  <li>Integration with existing systems</li>
  <li>User acceptance testing (UAT)</li>
  <li>Defect resolution and refinement</li>
</ul>

<h3>Phase 4: Deployment and Training (Weeks ${faker.number.int({ min: 13, max: 21 })}-${faker.number.int({ min: 16, max: 24 })})</h3>
<ul>
  <li>Production deployment and go-live</li>
  <li>End-user training sessions</li>
  <li>Administrator training and documentation</li>
  <li>Knowledge transfer to City staff</li>
</ul>

<h3>Phase 5: Post-Implementation Support (Ongoing)</h3>
<ul>
  <li>Hypercare period (first 30 days post-go-live)</li>
  <li>Issue resolution and optimization</li>
  <li>Performance monitoring and reporting</li>
  <li>Transition to standard support model</li>
</ul>

<h3>Key Milestones</h3>
<table>
  <tr><th>Milestone</th><th>Target Date</th><th>Deliverable</th></tr>
  <tr><td>Project Kickoff</td><td>Week 1</td><td>Kickoff Meeting Minutes</td></tr>
  <tr><td>Requirements Approved</td><td>Week 4</td><td>Requirements Document</td></tr>
  <tr><td>Design Complete</td><td>Week 6</td><td>Solution Design Document</td></tr>
  <tr><td>UAT Complete</td><td>Week 10</td><td>UAT Sign-off</td></tr>
  <tr><td>Go-Live</td><td>Week 12</td><td>Production Deployment</td></tr>
  <tr><td>Project Close</td><td>Week 16</td><td>Final Report & Lessons Learned</td></tr>
</table>
`.trim(),

  'Insurance Requirements': () => `
<h2>Insurance Requirements</h2>

<h3>1. Required Coverage Types and Limits</h3>
<p>The selected vendor shall maintain the following insurance coverage throughout the contract term:</p>

<h4>Commercial General Liability</h4>
<ul>
  <li>Each Occurrence: $${faker.number.int({ min: 1, max: 2 })},000,000</li>
  <li>General Aggregate: $${faker.number.int({ min: 2, max: 4 })},000,000</li>
  <li>Products/Completed Operations: $${faker.number.int({ min: 1, max: 2 })},000,000</li>
  <li>Personal and Advertising Injury: $1,000,000</li>
</ul>

<h4>Professional Liability / Errors & Omissions</h4>
<ul>
  <li>Each Claim: $${faker.number.int({ min: 1, max: 3 })},000,000</li>
  <li>Annual Aggregate: $${faker.number.int({ min: 2, max: 5 })},000,000</li>
  <li>Retroactive Date: Prior to contract start date</li>
  <li>Extended Reporting Period: ${faker.number.int({ min: 2, max: 5 })} years after contract completion</li>
</ul>

<h4>Workers' Compensation and Employer's Liability</h4>
<ul>
  <li>Workers' Compensation: Statutory limits</li>
  <li>Employer's Liability: $${faker.helpers.arrayElement([500, 1000])},000 each accident</li>
  <li>Disease Policy Limit: $${faker.helpers.arrayElement([500, 1000])},000</li>
  <li>Disease Each Employee: $${faker.helpers.arrayElement([500, 1000])},000</li>
</ul>

<h4>Automobile Liability</h4>
<ul>
  <li>Combined Single Limit: $1,000,000</li>
  <li>Coverage: Owned, hired, and non-owned vehicles</li>
</ul>

<h4>Cyber Liability (if handling sensitive data)</h4>
<ul>
  <li>Each Occurrence: $${faker.number.int({ min: 1, max: 5 })},000,000</li>
  <li>Coverage: Data breach, network security, privacy liability</li>
</ul>

<h3>2. Certificate of Insurance Requirements</h3>
<p>Prior to contract execution, the vendor shall provide:</p>
<ul>
  <li>Certificate of Insurance naming the City as Additional Insured</li>
  <li>30-day notice of cancellation or material change</li>
  <li>Waiver of subrogation in favor of the City</li>
  <li>Primary and non-contributory coverage</li>
</ul>

<h3>3. Insurance Company Requirements</h3>
<ul>
  <li>A.M. Best rating of A- (VII) or better</li>
  <li>Licensed to do business in the State</li>
</ul>
`.trim(),

  'Delivery Schedule': () => `
<h2>Delivery Schedule and Requirements</h2>

<h3>1. Delivery Location</h3>
<p>All deliverables shall be provided to:</p>
<p>{{department.name}}<br/>
{{city.address}}<br/>
Attention: {{contact.name}}</p>

<h3>2. Delivery Methods</h3>
<ul>
  <li><strong>Physical Deliverables:</strong> Delivered to the address above during business hours (8:00 AM - 5:00 PM, Monday - Friday)</li>
  <li><strong>Electronic Deliverables:</strong> Submitted via secure file transfer or email to {{contact.email}}</li>
  <li><strong>Documentation:</strong> Both electronic and hard copies may be required</li>
</ul>

<h3>3. Delivery Timeline</h3>
<table>
  <tr><th>Deliverable</th><th>Due Date</th><th>Format</th></tr>
  <tr><td>Project Plan</td><td>Week 1</td><td>Electronic (PDF/Word)</td></tr>
  <tr><td>Progress Reports</td><td>Monthly</td><td>Electronic (PDF)</td></tr>
  <tr><td>Draft Documents</td><td>Per Schedule</td><td>Electronic (Word/PDF)</td></tr>
  <tr><td>Final Deliverables</td><td>Per Schedule</td><td>Electronic + Hard Copy</td></tr>
  <tr><td>Training Materials</td><td>Prior to Training</td><td>Electronic + Hard Copy</td></tr>
</table>

<h3>4. Acceptance Criteria</h3>
<p>Deliverables will be reviewed and accepted based on:</p>
<ul>
  <li>Compliance with specifications and requirements</li>
  <li>Quality and completeness of content</li>
  <li>Timeliness of delivery</li>
  <li>Correction of any identified deficiencies within ${faker.number.int({ min: 5, max: 15 })} business days</li>
</ul>

<h3>5. Inspection and Testing</h3>
<p>The City reserves the right to:</p>
<ul>
  <li>Inspect all deliverables upon receipt</li>
  <li>Reject deliverables that do not meet specifications</li>
  <li>Require correction or replacement at no additional cost</li>
  <li>Withhold payment until acceptable delivery is confirmed</li>
</ul>
`.trim(),

  'Attachments': () => `
<h2>Attachments and Exhibits</h2>

<p>The following attachments are included as part of this solicitation:</p>

<h3>Required Forms</h3>
<ul>
  <li><strong>Attachment A:</strong> Vendor Information Form</li>
  <li><strong>Attachment B:</strong> Price Proposal Form</li>
  <li><strong>Attachment C:</strong> Non-Collusion Affidavit</li>
  <li><strong>Attachment D:</strong> References Form</li>
</ul>

<h3>Contract Documents</h3>
<ul>
  <li><strong>Exhibit 1:</strong> Sample Contract Agreement</li>
  <li><strong>Exhibit 2:</strong> General Terms and Conditions</li>
  <li><strong>Exhibit 3:</strong> Insurance Requirements</li>
</ul>

<h3>Technical Specifications</h3>
<ul>
  <li><strong>Appendix A:</strong> Technical Requirements Document</li>
  <li><strong>Appendix B:</strong> System Architecture Diagram</li>
  <li><strong>Appendix C:</strong> Data Standards and Formats</li>
</ul>

<h3>Reference Materials</h3>
<ul>
  <li><strong>Reference 1:</strong> Current System Overview</li>
  <li><strong>Reference 2:</strong> Organizational Chart</li>
  <li><strong>Reference 3:</strong> Related Policies and Procedures</li>
</ul>

<p><em>Note: Vendors must complete and submit all required forms with their proposal. Failure to include required attachments may result in proposal rejection.</em></p>
`.trim(),
};

// ============================================================================
// Project-Specific Content Generators
// ============================================================================

/**
 * Generate IT project content
 */
export function generateITProjectContent(): Record<string, string> {
  return {
    'Scope of Work': `
<h2>1. Project Overview</h2>
<p>The City of Riverside seeks to modernize its enterprise technology infrastructure through the implementation of a comprehensive ${faker.helpers.arrayElement(['cloud migration', 'ERP system upgrade', 'cybersecurity enhancement', 'digital transformation'])} initiative.</p>

<h2>2. Technical Requirements</h2>
<h3>2.1 System Architecture</h3>
<ul>
  <li>Cloud-based deployment (${faker.helpers.arrayElement(['AWS', 'Azure', 'Google Cloud'])} preferred)</li>
  <li>High availability architecture with ${faker.number.int({ min: 99, max: 99 })}.${faker.number.int({ min: 9, max: 99 })}% uptime SLA</li>
  <li>Scalable infrastructure supporting ${faker.number.int({ min: 100, max: 1000 })}+ concurrent users</li>
  <li>Integration with existing ${faker.helpers.arrayElement(['Active Directory', 'LDAP', 'SSO'])} for authentication</li>
</ul>

<h3>2.2 Security Requirements</h3>
<ul>
  <li>SOC 2 Type II compliance</li>
  <li>End-to-end encryption (AES-256)</li>
  <li>Multi-factor authentication (MFA)</li>
  <li>Regular penetration testing and vulnerability assessments</li>
</ul>

<h3>2.3 Integration Points</h3>
<ul>
  <li>Financial management system (Tyler Munis)</li>
  <li>Human resources information system</li>
  <li>Geographic information system (GIS)</li>
  <li>Customer relationship management (CRM)</li>
</ul>

<h2>3. Implementation Approach</h2>
<p>The vendor shall employ an Agile methodology with ${faker.number.int({ min: 2, max: 4 })}-week sprints, including:</p>
<ul>
  <li>Daily stand-up meetings</li>
  <li>Sprint planning and retrospectives</li>
  <li>Continuous integration/continuous deployment (CI/CD)</li>
  <li>Automated testing framework</li>
</ul>
`.trim(),
  };
}

/**
 * Generate construction project content
 */
export function generateConstructionProjectContent(): Record<string, string> {
  return {
    'Scope of Work': `
<h2>1. Project Description</h2>
<p>The City is soliciting proposals for the ${faker.helpers.arrayElement(['renovation', 'construction', 'rehabilitation', 'expansion'])} of the ${faker.helpers.arrayElement(['City Hall', 'Public Library', 'Community Center', 'Fire Station', 'Police Headquarters'])} facility located at ${faker.location.streetAddress()}.</p>

<h2>2. Work Specifications</h2>
<h3>2.1 General Construction</h3>
<ul>
  <li>Total square footage: ${faker.number.int({ min: 10000, max: 100000 }).toLocaleString()} SF</li>
  <li>Number of floors: ${faker.number.int({ min: 1, max: 5 })}</li>
  <li>Parking spaces: ${faker.number.int({ min: 50, max: 500 })}</li>
  <li>ADA compliance throughout</li>
</ul>

<h3>2.2 Site Work</h3>
<ul>
  <li>Demolition of existing structures</li>
  <li>Grading and site preparation</li>
  <li>Utilities installation (water, sewer, electrical)</li>
  <li>Landscaping and irrigation</li>
  <li>Stormwater management systems</li>
</ul>

<h3>2.3 Building Systems</h3>
<ul>
  <li>HVAC: ${faker.helpers.arrayElement(['Variable Refrigerant Flow (VRF)', 'Rooftop units with VAV', 'Geothermal heat pump'])}</li>
  <li>Electrical: ${faker.number.int({ min: 400, max: 2000 })} amp service</li>
  <li>Fire suppression: Fully sprinklered per NFPA 13</li>
  <li>Building automation system (BAS)</li>
  <li>Security system with access control</li>
</ul>

<h2>3. Sustainability Requirements</h2>
<p>The project shall target ${faker.helpers.arrayElement(['LEED Silver', 'LEED Gold', 'LEED Platinum'])} certification, including:</p>
<ul>
  <li>Energy efficiency ${faker.number.int({ min: 20, max: 40 })}% above code baseline</li>
  <li>Water use reduction of ${faker.number.int({ min: 30, max: 50 })}%</li>
  <li>Construction waste diversion of ${faker.number.int({ min: 75, max: 95 })}%</li>
  <li>Use of regional and recycled materials</li>
</ul>

<h2>4. Project Schedule</h2>
<ul>
  <li>Design Phase: ${faker.number.int({ min: 4, max: 8 })} months</li>
  <li>Permitting: ${faker.number.int({ min: 2, max: 4 })} months</li>
  <li>Construction: ${faker.number.int({ min: 12, max: 24 })} months</li>
  <li>Substantial Completion: ${faker.date.future({ years: 2 }).toLocaleDateString()}</li>
</ul>
`.trim(),
  };
}

/**
 * Generate professional services content
 */
export function generateProfessionalServicesContent(): Record<string, string> {
  const serviceType = faker.helpers.arrayElement([
    'Legal Services',
    'Financial Auditing',
    'Management Consulting',
    'Strategic Planning',
    'Human Resources Consulting',
  ]);

  return {
    'Scope of Work': `
<h2>1. Service Overview</h2>
<p>The City of ${faker.location.city()} is seeking qualified firms to provide ${serviceType} on an as-needed basis. The selected firm(s) will support the City's ${faker.helpers.arrayElement(['operations', 'strategic initiatives', 'compliance requirements', 'organizational development'])}.</p>

<h2>2. Service Categories</h2>
<h3>2.1 Core Services</h3>
<ul>
  <li>Initial assessment and needs analysis</li>
  <li>Strategy development and recommendations</li>
  <li>Implementation support and guidance</li>
  <li>Ongoing consultation and advisory services</li>
</ul>

<h3>2.2 Specialized Services</h3>
<ul>
  <li>Policy development and review</li>
  <li>Compliance assessment and remediation</li>
  <li>Training and capacity building</li>
  <li>Performance monitoring and reporting</li>
</ul>

<h2>3. Engagement Model</h2>
<p>Services will be provided on a task-order basis with:</p>
<ul>
  <li>Annual contract value not to exceed $${faker.number.int({ min: 100, max: 500 })},000</li>
  <li>Individual task orders ranging from $${faker.number.int({ min: 5, max: 25 })},000 to $${faker.number.int({ min: 50, max: 150 })},000</li>
  <li>Response time for urgent requests: ${faker.number.int({ min: 24, max: 72 })} hours</li>
</ul>

<h2>4. Qualifications</h2>
<p>The successful firm must demonstrate:</p>
<ul>
  <li>Minimum ${faker.number.int({ min: 5, max: 15 })} years experience serving government clients</li>
  <li>Professional certifications and licenses as applicable</li>
  <li>Understanding of public sector requirements and constraints</li>
  <li>Diverse and experienced team with relevant expertise</li>
</ul>
`.trim(),
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get content for a section by title
 */
export function getSectionContent(title: string): string {
  const generator = SECTION_CONTENT_TEMPLATES[title];
  if (generator) {
    return generator();
  }

  // Default content for unrecognized sections
  return `
<h2>${title}</h2>
<p>${faker.lorem.paragraphs(3, '</p><p>')}</p>
<ul>
  <li>${faker.lorem.sentence()}</li>
  <li>${faker.lorem.sentence()}</li>
  <li>${faker.lorem.sentence()}</li>
</ul>
`.trim();
}

/**
 * Generate a complete set of sections with realistic content
 */
export function generateRealisticSections(sectionTitles: string[]): Array<{
  title: string;
  content: string;
  type: 'text' | 'list' | 'heading';
}> {
  return sectionTitles.map((title) => ({
    title,
    content: getSectionContent(title),
    type: title === 'Attachments' ? 'list' as const : 'text' as const,
  }));
}

export default {
  SECTION_CONTENT_TEMPLATES,
  getSectionContent,
  generateRealisticSections,
  generateITProjectContent,
  generateConstructionProjectContent,
  generateProfessionalServicesContent,
};
