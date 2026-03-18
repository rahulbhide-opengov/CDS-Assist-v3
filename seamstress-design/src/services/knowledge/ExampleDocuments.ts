/**
 * Example Knowledge Documents
 * Practical citizen-facing documents for government services
 */

import type { KnowledgeDocument } from './KnowledgeTypes';

export const exampleDocuments: Omit<KnowledgeDocument, 'id'>[] = [
  {
    title: 'Building Permit Application Guide',
    content: `# Building Permit Application Guide

## Overview
This comprehensive guide will help you navigate the building permit process for residential and commercial projects in our city. Use @agent/permit-assistant for personalized help or @tool/permit-calculator to estimate fees.

## When Do You Need a Building Permit?

### Permits Required
Building permits are **required** for:
- **New Construction**: Any new building or structure
- **Additions**: Room additions, decks, porches, garages
- **Major Renovations**: Kitchen/bathroom remodels over $5,000
- **Structural Changes**: Removing/adding walls, changing rooflines
- **Electrical Work**: New circuits, panel upgrades, rewiring
- **Plumbing Changes**: Moving fixtures, new water heaters
- **HVAC Systems**: New installations or replacements
- **Roofing**: Full replacement (repairs under 200 sq ft exempt)
- **Windows/Doors**: Adding new openings in walls

### Permits NOT Required
No permit needed for:
- **Cosmetic Updates**: Painting, flooring, countertops
- **Minor Repairs**: Fixing existing fixtures, patching drywall
- **Landscaping**: Gardens, walkways (non-structural)
- **Fences**: Under 6 feet (check @knowledge/fence-regulations)

## Application Process

### Step 1: Pre-Application Consultation
Schedule a free consultation with @agent/plan-reviewer to discuss:
- Project scope and requirements
- Zoning compliance check via @tool/zoning-lookup
- Estimated timeline and costs
- Required documentation

### Step 2: Document Preparation
Required documents vary by project type. Use @tool/document-checklist for a customized list.

#### Residential Projects
- **Site Plan**: Show property lines, existing structures, proposed work
- **Construction Plans**: Detailed drawings to scale (minimum 1/4" = 1')
- **Structural Calculations**: For load-bearing changes (see @skill/structural-review)
- **Energy Compliance**: Title 24 forms for California
- **Owner Authorization**: If applicant isn't property owner

#### Commercial Projects
All residential requirements plus:
- **Accessibility Compliance**: ADA requirements via @tool/ada-checker
- **Fire Department Approval**: For occupancy over 50
- **Environmental Review**: Check with @agent/environmental-reviewer
- **Business License**: Current and valid

### Step 3: Online Submission
Submit your application through our portal:
1. Create account at permits.cityname.gov
2. Select "New Application" → "Building Permit"
3. Upload all documents (PDF format, max 25MB each)
4. Pay application fee using @tool/payment-processor
5. Receive confirmation number for tracking

### Step 4: Plan Review Process
Your application enters review queue:
- **Initial Review**: 3-5 business days for completeness check
- **Technical Review**: 10-15 business days for residential, 15-25 for commercial
- **Review Departments**:
  - Building & Safety (always)
  - Planning/Zoning (if applicable)
  - Fire Department (commercial/multi-family)
  - Public Works (driveway/utilities)
  - Environmental (@agent/environmental-reviewer for sensitive areas)

Track status anytime using @tool/permit-tracker with your confirmation number.

### Step 5: Corrections and Resubmittal
If corrections are needed:
1. You'll receive detailed comments via email
2. Make required changes (consult @agent/plan-reviewer for help)
3. Resubmit through portal within 90 days
4. Recheck typically takes 5-7 business days

### Step 6: Permit Issuance
Once approved:
- Pay remaining fees through @tool/payment-processor
- Download and print permit documents
- Post permit card visibly at job site
- Schedule inspections using @tool/inspection-scheduler

## Fees and Costs

### Fee Structure
Fees are calculated based on project valuation. Use @tool/permit-calculator for estimates.

| Project Value | Plan Check Fee | Permit Fee | Total |
|--------------|---------------|------------|-------|
| $1 - $500 | $25 | $25 | $50 |
| $501 - $2,000 | $75 | $75 | $150 |
| $2,001 - $25,000 | $200 + 5% over $2,000 | $200 + 3% over $2,000 | Varies |
| $25,001 - $50,000 | $1,350 + 4% over $25,000 | $890 + 2.5% over $25,000 | Varies |
| Over $50,000 | $2,350 + 3% over $50,000 | $1,515 + 2% over $50,000 | Varies |

### Additional Fees
- **Express Review**: +50% for 5-day turnaround (see @skill/express-processing)
- **After-Hours Inspection**: $150 per visit
- **Re-inspection Fee**: $100 after second failed inspection
- **Plan Revision**: $75 per resubmittal after third submission

### Fee Waivers
Available for:
- Senior citizens (65+) for primary residence safety upgrades
- Low-income households (check @tool/income-qualifier)
- Nonprofit organizations
- Solar panel installations (see @knowledge/solar-incentives)

## Inspection Requirements

### Inspection Types
Schedule through @tool/inspection-scheduler or call (555) 123-4567:

1. **Foundation Inspection**: Before pouring concrete
2. **Framing Inspection**: After framing, before insulation
3. **Rough Electrical/Plumbing/Mechanical**: Before covering
4. **Insulation Inspection**: Before drywall
5. **Drywall Inspection**: After installation, before taping
6. **Final Inspection**: Project completion

### Inspection Preparation
Before inspector arrives:
- Ensure safe access to all work areas
- Have approved plans on-site
- Complete all work for inspection phase
- Address previous correction notices
- Clear access to electrical panel, water heater, HVAC

### Failed Inspections
If inspection fails:
- Review correction notice carefully
- Make required corrections
- Schedule re-inspection via @tool/inspection-scheduler
- Third failed inspection triggers $100 fee

## Special Circumstances

### Historic Districts
Properties in historic districts require additional review:
- Historic Preservation Commission approval
- Use @agent/historic-preservation for guidance
- Extended timeline: add 30-45 days
- See @knowledge/historic-guidelines for standards

### Coastal Zones
Within 1000 feet of coastline:
- Coastal Development Permit required
- Environmental review by @agent/coastal-reviewer
- Public hearing may be required
- See @knowledge/coastal-regulations

### Hillside Properties
Slopes greater than 15%:
- Geological report required
- Drainage plan mandatory
- Use @tool/slope-calculator to determine grade
- Consult @skill/geotechnical-review

### ADU (Accessory Dwelling Units)
Streamlined process for ADUs:
- Pre-approved plans available
- Reduced fees for units under 750 sq ft
- Use @tool/adu-wizard for quick approval
- See @knowledge/adu-regulations for details

## Common Mistakes to Avoid

### Application Errors
❌ **Incomplete applications** - Use @tool/application-validator before submitting
❌ **Wrong permit type** - Consult @agent/permit-assistant if unsure
❌ **Outdated forms** - Always download current forms from portal
❌ **Missing signatures** - All owners must sign

### Plan Issues
❌ **Inadequate detail** - Plans must show all dimensions
❌ **Not to scale** - Use proper architectural scale
❌ **Missing site plan** - Required for all projects
❌ **No north arrow** - Orientation must be indicated

### Process Mistakes
❌ **Starting work early** - Never begin before permit issuance
❌ **Skipping inspections** - All phases must be inspected
❌ **Covering work** - Don't cover before inspection
❌ **Permit expiration** - Renew if inactive for 180 days

## Resources and Support

### Online Tools
- @tool/permit-calculator - Estimate fees
- @tool/inspection-scheduler - Book inspections
- @tool/permit-tracker - Check application status
- @tool/zoning-lookup - Verify zoning requirements
- @tool/document-checklist - Get required documents list

### AI Assistants
- @agent/permit-assistant - General permit help
- @agent/plan-reviewer - Technical plan questions
- @agent/code-interpreter - Building code clarification
- @agent/fee-estimator - Detailed cost breakdowns

### Knowledge Base
- @knowledge/building-codes - Current adopted codes
- @knowledge/zoning-ordinance - Zoning regulations
- @knowledge/standard-details - Typical construction details
- @knowledge/green-building - Sustainable building incentives

### Contact Information
**Building Department**
📍 123 Main Street, City Hall, 2nd Floor
📞 (555) 123-4567
✉️ permits@cityname.gov
🕒 Monday-Friday: 8:00 AM - 5:00 PM
   Wednesday: 10:00 AM - 5:00 PM (delayed opening)

**After-Hours Emergency**
For urgent safety issues only: (555) 123-4911

## Frequently Asked Questions

**Q: How long does the permit process take?**
A: Simple residential: 10-15 business days. Complex/commercial: 20-30 days. Use @skill/timeline-estimator for specific projects.

**Q: Can I do the work myself?**
A: Yes, for your primary residence. You'll need to pass the Homeowner's Exam via @tool/homeowner-test.

**Q: What if I already started work?**
A: Stop immediately and apply for permit. Additional penalties apply. Consult @agent/compliance-officer.

**Q: How long is my permit valid?**
A: 180 days from issuance. One 180-day extension available through @tool/permit-extension.

**Q: Can I change contractors?**
A: Yes, file contractor change form through portal. New contractor must be licensed.

## Related Documents
- @knowledge/contractor-requirements
- @knowledge/inspection-checklist
- @knowledge/violation-process
- @knowledge/appeal-procedures`,
    type: 'markdown',
    metadata: {
      author: 'Building Department',
      created: new Date('2024-03-01'),
      modified: new Date('2024-03-15'),
      tags: ['permits', 'building', 'construction', 'residential', 'commercial', 'inspections'],
      references: [
        { type: 'agent', id: 'permit-assistant', path: '@agent/permit-assistant' },
        { type: 'agent', id: 'plan-reviewer', path: '@agent/plan-reviewer' },
        { type: 'tool', id: 'permit-calculator', path: '@tool/permit-calculator' },
        { type: 'tool', id: 'inspection-scheduler', path: '@tool/inspection-scheduler' },
        { type: 'tool', id: 'permit-tracker', path: '@tool/permit-tracker' }
      ],
      referencedBy: [],
      version: 2,
      size: 8500,
      summary: 'Complete guide to building permits including requirements, application process, fees, inspections, and common mistakes.'
    },
    permissions: {
      owner: 'building-department',
      public: true,
      sharedWith: [],
      canEdit: ['building-department'],
      canView: ['all'],
    },
    searchableContent: '',
    publishingStatus: 'published',
  },
  {
    title: 'Business License Registration Process',
    content: `# Business License Registration Process

## Quick Start Guide
Starting a business in our city? This guide covers everything from initial registration to annual renewal. Get personalized assistance from @agent/business-advisor or calculate fees with @tool/business-fee-calculator.

## Business License Requirements

### Who Needs a Business License?
**Everyone conducting business within city limits**, including:
- **Physical Locations**: Stores, restaurants, offices, warehouses
- **Home-Based Businesses**: Even if no customers visit
- **Mobile Services**: Contractors, delivery, rideshare drivers
- **Online Businesses**: If operated from city address
- **Temporary Vendors**: Pop-ups, farmers market vendors
- **Nonprofits**: Conducting commercial activities

### Exemptions
Limited exemptions apply to:
- Casual sales under $500/year (garage sales)
- Licensed real estate agents (broker must have license)
- Banks and credit unions (state regulated)
- Check with @agent/license-reviewer for specific situations

## Pre-Registration Steps

### 1. Business Structure Selection
Choose your business structure carefully - it affects taxes, liability, and licensing requirements.

#### Structure Types
| Structure | Pros | Cons | Best For |
|-----------|------|------|----------|
| **Sole Proprietorship** | Simple, low cost | Personal liability | Single-owner small business |
| **Partnership** | Shared resources | Shared liability | Multiple owners |
| **LLC** | Liability protection, tax flexibility | More paperwork | Most small businesses |
| **Corporation** | Maximum protection | Complex, expensive | Large/investor businesses |

Use @tool/structure-advisor for personalized recommendations.

### 2. Business Name Registration
Ensure your business name is available:
1. Check state database via @tool/name-checker
2. Verify domain availability
3. Search trademark database
4. Register DBA if needed ("Doing Business As")

**Naming Rules**:
- Cannot mislead about business nature
- Cannot imply government affiliation
- Must include entity identifier (LLC, Inc., etc.)
- Cannot infringe existing trademarks

### 3. Federal EIN (Employer ID Number)
Required if you have employees or are LLC/Corporation:
- Apply free at IRS.gov
- Instant online approval
- Keep secure - it's like a business SSN
- Use @skill/ein-application for guidance

### 4. State Registration
Register with state before city:
- Secretary of State filing
- State tax registration
- Professional licenses if applicable
- Use @agent/state-registration for help

## License Application Process

### Step 1: Determine License Type
Our city issues different license types based on business activity. Use @tool/license-finder to identify yours:

#### Standard Business License Types
- **General Business**: Retail, services, consulting
- **Professional**: Requires state professional license
- **Contractor**: Construction trades (see @knowledge/contractor-licensing)
- **Food Service**: Restaurants, caterers, food trucks
- **Alcohol Sales**: Beer, wine, spirits (see @knowledge/alcohol-permits)
- **Cannabis**: Retail, cultivation, manufacturing
- **Short-Term Rental**: Airbnb, VRBO (see @knowledge/str-regulations)
- **Special Events**: Temporary vendors, festivals

### Step 2: Zoning Verification
Confirm your business location is properly zoned:
1. Use @tool/zoning-lookup with your address
2. Review permitted uses for zone
3. Check if Conditional Use Permit needed
4. Verify parking requirements
5. Consult @agent/zoning-specialist for complex cases

#### Common Zoning Districts
- **C-1 (Neighborhood Commercial)**: Small retail, services
- **C-2 (General Commercial)**: Larger retail, restaurants
- **C-3 (Downtown Commercial)**: Mixed use, entertainment
- **M-1 (Light Industrial)**: Manufacturing, warehouses
- **M-2 (Heavy Industrial)**: Major manufacturing
- **R-Zones**: Home-based businesses only

### Step 3: Complete Application
Apply online at business.cityname.gov or visit City Hall:

#### Required Information
- **Business Details**:
  - Legal business name
  - DBA if different
  - Business structure type
  - Federal EIN
  - State registration number
  - NAICS code (use @tool/naics-finder)

- **Location Information**:
  - Physical address
  - Mailing address if different
  - Square footage
  - Lease or ownership proof
  - Landlord approval (if leasing)

- **Owner Information**:
  - Full legal name(s)
  - SSN or ITIN
  - Home address
  - Phone and email
  - Ownership percentages

- **Operations Details**:
  - Business description
  - Products/services offered
  - Number of employees
  - Hours of operation
  - Expected gross receipts

### Step 4: Additional Permits
Many businesses need additional permits. Check @tool/permit-requirement-checker:

#### Common Additional Permits
- **Health Permit**: Food service, personal care
- **Fire Permit**: Assembly occupancy, hazardous materials
- **Sign Permit**: Any exterior signage (see @knowledge/sign-regulations)
- **Alarm Permit**: Security systems
- **Sidewalk Use**: Outdoor dining, displays
- **Entertainment**: Live music, dancing
- **Waste Permit**: Special disposal needs

### Step 5: Inspections
Some businesses require pre-opening inspections:
- **Fire/Life Safety**: All commercial spaces
- **Health Department**: Food, personal care services
- **Building/Zoning**: New construction, change of use
- **ADA Compliance**: Public accommodations

Schedule via @tool/inspection-scheduler after application approval.

## Fees and Taxes

### Business License Fees
Annual fees based on business type and size. Calculate with @tool/business-fee-calculator:

#### Fee Structure
| Business Type | Employees | Annual Fee | Processing |
|--------------|-----------|------------|------------|
| **Home-Based** | 0 | $50 | $25 |
| **Retail** | 1-5 | $200 | $50 |
| **Retail** | 6-20 | $400 | $50 |
| **Retail** | 21+ | $800 | $50 |
| **Professional** | Any | $150 | $50 |
| **Contractor** | Any | $300 | $50 |
| **Restaurant** | 1-10 | $500 | $100 |
| **Restaurant** | 11+ | $1,000 | $100 |

#### Additional Fees
- **Late Renewal**: 50% penalty after due date
- **Reinstatement**: $200 after suspension
- **Duplicate License**: $25
- **Change of Location**: $100
- **Background Check**: $75 (certain businesses)

### Business Taxes
Separate from license fees:
- **Business Tax**: Based on gross receipts
- **Sales Tax**: Collect and remit if selling tangible goods
- **Transient Occupancy Tax**: Hotels, short-term rentals
- Use @tool/tax-calculator for estimates
- Consult @agent/tax-advisor for complex situations

### Payment Options
- **Online**: Portal accepts all major cards, e-check
- **In-Person**: Cash, check, card at City Hall
- **Mail**: Check only, allow 10 days processing
- **Payment Plans**: Available for fees over $1,000 via @tool/payment-plan

## Timeline and Processing

### Standard Processing Times
- **Simple Home-Based**: 5-7 business days
- **Retail/Office**: 10-15 business days
- **Restaurant/Bar**: 30-45 days
- **Cannabis**: 60-90 days
- **Express Service**: +50% fee for 48-hour processing

Track application status with @tool/application-tracker.

### Approval Process
1. **Application Review**: Completeness check
2. **Zoning Review**: Location compliance
3. **Department Reviews**: As needed (Fire, Health, Police)
4. **Tax Clearance**: No outstanding city taxes
5. **Final Approval**: License issued
6. **Inspection**: If required, before opening

## Special Business Types

### Home-Based Businesses
Special requirements apply:
- No customer visits without Special Use Permit
- No exterior evidence of business
- Maximum 25% of home square footage
- No employees outside household
- See @knowledge/home-business-rules for complete regulations

### Food Service Businesses
Additional requirements:
- Health permit from County Health
- Food handler certifications
- Grease trap permit if applicable
- Review @knowledge/food-safety-requirements
- Consult @agent/health-inspector

### Professional Services
If state-licensed profession:
- Provide state license number
- Maintain current state license
- Examples: Doctors, lawyers, accountants, real estate
- Use @tool/professional-verifier to confirm requirements

### Contractors
Special licensing for construction trades:
- State contractor license required
- City registration additional
- Workers' comp insurance proof
- Bond may be required
- See @knowledge/contractor-requirements

### Short-Term Rentals
Heavily regulated:
- Maximum days per year: 90
- Neighbor notification required
- Safety inspections mandatory
- TOT registration required
- Platform reporting required
- Review @knowledge/str-regulations

## Compliance and Renewal

### Annual Renewal
Licenses expire one year from issuance:
1. **Renewal Notice**: Sent 60 days before expiration
2. **Update Information**: Any changes to business
3. **Pay Renewal Fee**: Before expiration to avoid penalty
4. **Updated License**: Issued within 5 days

Use @tool/renewal-reminder for automatic notifications.

### Maintaining Compliance
Stay compliant to avoid penalties:
- Display license prominently
- Report changes within 30 days
- Maintain required insurance
- Keep current with all fees/taxes
- Allow compliance inspections

### Common Violations
Avoid these costly mistakes:
- ❌ Operating without license: $500-$1,000 fine
- ❌ Expired license: $250 fine + 50% penalty
- ❌ Unreported changes: $100 fine
- ❌ Zoning violations: $500/day
- ❌ Sign violations: $100/day

Use @agent/compliance-checker for regular audits.

## Resources and Support

### Online Tools
- @tool/business-fee-calculator - Calculate all fees
- @tool/license-finder - Determine license types needed
- @tool/zoning-lookup - Check zoning compliance
- @tool/name-checker - Verify name availability
- @tool/application-tracker - Monitor application status
- @tool/renewal-reminder - Renewal notifications
- @tool/tax-calculator - Estimate business taxes

### AI Assistants
- @agent/business-advisor - General business help
- @agent/license-reviewer - License requirements
- @agent/zoning-specialist - Zoning questions
- @agent/tax-advisor - Tax obligations
- @agent/compliance-checker - Compliance audits

### Educational Resources
- @knowledge/startup-checklist - Complete startup guide
- @knowledge/business-incentives - Available incentives
- @knowledge/procurement-opportunities - Sell to city
- @knowledge/workforce-development - Employee training programs
- @knowledge/small-business-resources - Grants and loans

### Business Support Organizations
**Small Business Development Center**
- Free consulting
- Business plan assistance
- Market research
- @skill/sbdc-scheduling for appointments

**Chamber of Commerce**
- Networking events
- Business advocacy
- Member benefits
- Contact: (555) 234-5678

**Economic Development Office**
- Incentive programs
- Site selection help
- Expansion assistance
- Email: econdev@cityname.gov

### Contact Information
**Business License Division**
📍 456 Commerce Street, Suite 100
📞 (555) 234-5678
✉️ businesslicense@cityname.gov
🕒 Monday-Friday: 8:00 AM - 5:00 PM

**Drop-in Hours** (No appointment needed)
Tuesday & Thursday: 1:00 PM - 4:00 PM

## Quick Reference Checklists

### New Business Checklist
- [ ] Choose business structure
- [ ] Register business name
- [ ] Obtain Federal EIN
- [ ] Register with state
- [ ] Verify zoning compliance
- [ ] Apply for business license
- [ ] Obtain additional permits
- [ ] Schedule inspections
- [ ] Register for taxes
- [ ] Set up compliance reminders

### Renewal Checklist
- [ ] Review renewal notice
- [ ] Update business information
- [ ] Confirm insurance current
- [ ] Pay renewal fee on time
- [ ] Update emergency contacts
- [ ] Review compliance status

### Change of Location Checklist
- [ ] Verify new location zoning
- [ ] Submit change application
- [ ] Update all permits
- [ ] Schedule new inspections
- [ ] Update tax registration
- [ ] Notify customers

## Related Documents
- @knowledge/zoning-ordinance
- @knowledge/sign-regulations
- @knowledge/contractor-licensing
- @knowledge/alcohol-permits
- @knowledge/cannabis-regulations`,
    type: 'markdown',
    metadata: {
      author: 'Business License Division',
      created: new Date('2024-02-15'),
      modified: new Date('2024-03-14'),
      tags: ['business', 'license', 'registration', 'permits', 'compliance', 'renewal'],
      references: [
        { type: 'agent', id: 'business-advisor', path: '@agent/business-advisor' },
        { type: 'tool', id: 'business-fee-calculator', path: '@tool/business-fee-calculator' },
        { type: 'tool', id: 'license-finder', path: '@tool/license-finder' },
        { type: 'tool', id: 'zoning-lookup', path: '@tool/zoning-lookup' },
        { type: 'knowledge', id: 'contractor-licensing', path: '@knowledge/contractor-licensing' }
      ],
      referencedBy: [],
      version: 3,
      size: 9200,
      summary: 'Step-by-step guide for business registration, licensing, permits, compliance, and renewal in the city.'
    },
    permissions: {
      owner: 'business-division',
      public: true,
      sharedWith: [],
      canEdit: ['business-division'],
      canView: ['all'],
    },
    searchableContent: '',
    publishingStatus: 'published',
  },
  {
    title: 'Property Tax Assessment and Appeals Guide',
    content: `# Property Tax Assessment and Appeals Guide

## Understanding Your Property Tax
This guide explains how property taxes are calculated, when they're due, and how to appeal if you disagree with your assessment. Get help from @agent/tax-assistant or calculate estimates with @tool/tax-calculator.

## Property Tax Basics

### How Property Tax Works
Property taxes fund essential services:
- **Schools**: 45% of tax revenue
- **Public Safety**: Police, fire (25%)
- **Infrastructure**: Roads, parks (15%)
- **City Services**: Libraries, health (10%)
- **Administration**: Government operations (5%)

### Tax Rate Components
Your total tax rate combines multiple jurisdictions:
| Jurisdiction | Rate per $1,000 | Example on $400K |
|-------------|----------------|------------------|
| **City General** | $4.25 | $1,700 |
| **School District** | $8.75 | $3,500 |
| **County** | $2.10 | $840 |
| **Special Districts** | $1.40 | $560 |
| **Total** | $16.50 | $6,600/year |

Use @tool/tax-calculator for personalized calculations.

## Assessment Process

### How Properties Are Assessed
The Assessor's Office determines property values using:

#### Assessment Methods
1. **Sales Comparison Approach**
   - Recent sales of similar properties
   - Adjustments for differences
   - Most weight for residential
   - Check comparables with @tool/property-comparables

2. **Cost Approach**
   - Land value plus improvements
   - Minus depreciation
   - Used for unique properties
   - Calculate with @tool/cost-estimator

3. **Income Approach**
   - Based on rental income potential
   - Applied to investment properties
   - Uses capitalization rate
   - Analyze with @skill/income-analysis

### Assessment Cycle
Properties are reassessed on a regular schedule:
- **Annual Adjustments**: Market value updates
- **Physical Inspection**: Every 4 years
- **Triggered Reassessment**: Major improvements, ownership change
- **Notification**: Mailed by March 1st annually

Track your assessment history via @tool/assessment-tracker.

### Understanding Your Assessment Notice
Your annual notice includes:
- **Parcel Number**: Unique property identifier
- **Legal Description**: Lot, block, subdivision
- **Property Classification**: Residential, commercial, etc.
- **Land Value**: Value of land only
- **Improvement Value**: Buildings and structures
- **Total Assessed Value**: Land + improvements
- **Exemptions Applied**: Any reductions
- **Taxable Value**: Amount subject to tax

## Property Classifications

### Residential Properties
Includes single-family homes, condos, townhomes:
- Assessed at 100% of market value
- Homestead exemption available
- Senior/disability exemptions possible
- Review @knowledge/residential-exemptions

### Commercial Properties
Office buildings, retail, industrial:
- Assessed at 100% of market value
- No homestead exemption
- Economic development incentives available
- See @knowledge/commercial-incentives

### Agricultural Land
Special assessment for active farming:
- Based on agricultural use value
- Must meet acreage requirements
- Annual application required
- Details in @knowledge/ag-assessment

### Vacant Land
Undeveloped property:
- Assessed at market value
- Higher tax rate in some zones
- Development incentives available
- Check @tool/vacant-land-programs

## Exemptions and Reductions

### Homestead Exemption
Primary residence exemption:
- **Benefit**: $50,000 reduction in assessed value
- **Savings**: Approximately $825/year
- **Eligibility**: Owner-occupied primary residence
- **Application**: One-time filing
- Apply through @tool/homestead-application

### Senior Citizen Exemption
Additional relief for seniors:
- **Age Requirement**: 65 or older
- **Income Limit**: $75,000/year
- **Benefit**: Additional $25,000 reduction
- **Renewal**: Annual income verification
- Check eligibility with @tool/senior-qualifier

### Disability Exemption
For permanently disabled residents:
- **Benefit**: $30,000 reduction
- **Proof Required**: SSA determination letter
- **Income Limit**: $60,000/year
- **Application**: @tool/disability-exemption

### Veterans Exemption
For qualifying veterans:
- **100% Disabled Veterans**: Full exemption
- **Partial Disability**: Proportional reduction
- **Surviving Spouses**: May continue exemption
- **Documentation**: DD-214, VA rating
- Apply via @agent/veterans-services

### Low-Income Programs
Income-based assistance:
- **Tax Deferral**: Pay when property sells
- **Payment Plans**: Spread payments monthly
- **Hardship Reduction**: Case-by-case review
- **Qualification**: @tool/income-verifier

## Payment Information

### Payment Schedule
Property taxes are paid in two installments:
- **First Installment**: Due April 10 (covers Jan-June)
- **Second Installment**: Due December 10 (covers July-Dec)
- **Grace Period**: 10 days without penalty
- **Full Payment Option**: 2% discount if paid by April 10

Set reminders with @tool/payment-reminder.

### Payment Methods
Multiple convenient payment options:

#### Online Payment
- Portal: taxes.cityname.gov
- Accepts: Credit/debit (2.3% fee), e-check (no fee)
- Features: AutoPay, payment history, receipts
- Support: @agent/payment-support

#### In-Person Payment
- Location: Tax Collector, 789 Revenue Rd
- Hours: M-F 8:00 AM - 5:00 PM
- Accepts: Cash, check, card, money order
- Service: Immediate receipt

#### Mail Payment
- Address: PO Box 12345, City, State ZIP
- Include: Parcel number, payment coupon
- Allow: 7 days for processing
- Certified mail recommended for large payments

#### Automatic Bank Draft
- Setup: Complete ACH authorization
- Benefits: Never miss payment, no fees
- Changes: 30-day notice required
- Enroll: @tool/autopay-enrollment

### Penalties and Interest
Late payments incur charges:
- **1-30 days late**: 10% penalty
- **31-60 days late**: 15% penalty + 1% monthly interest
- **61+ days late**: 18% penalty + 1.5% monthly interest
- **Tax Lien**: After 2 years delinquent
- **Tax Sale**: After 3 years delinquent

Calculate penalties with @tool/penalty-calculator.

## Appeals Process

### Grounds for Appeal
Valid reasons to appeal assessment:
- **Overvaluation**: Assessment exceeds market value
- **Unequal Treatment**: Similar properties assessed lower
- **Classification Error**: Wrong property type
- **Physical Errors**: Incorrect square footage, features
- **Exemption Denial**: Qualified but denied

### Informal Review
Start with informal review before formal appeal:
1. Contact Assessor's Office within 30 days
2. Schedule meeting with assessor
3. Present evidence of error
4. Receive written response
5. May resolve without formal appeal

Schedule via @tool/informal-review.

### Formal Appeal Process

#### Step 1: File Appeal
**Deadline**: May 1st (30 days after notice)
- Complete appeal form (download or online)
- State specific grounds for appeal
- Include supporting documentation
- Pay $25 filing fee (waived for hardship)
- File through @tool/appeal-filing

#### Step 2: Prepare Evidence
Gather supporting documentation:
- **Recent Appraisal**: Professional opinion of value
- **Comparable Sales**: Similar properties sold for less
- **Photos**: Condition issues, needed repairs
- **Contractor Estimates**: Cost of required repairs
- **Income Records**: For income-producing properties

Organize evidence with @skill/evidence-preparation.

#### Step 3: Board of Review Hearing
Present your case to the Board:
- **Notification**: Hearing date sent 14 days prior
- **Format**: Informal, 15-30 minutes
- **Presentation**: You, then Assessor's Office
- **Evidence**: Submit copies for Board members
- **Representation**: Can bring attorney/agent
- **Decision**: Mailed within 30 days

Practice with @agent/hearing-coach.

#### Step 4: State Board Appeal
If unsatisfied with local decision:
- **Deadline**: 30 days from local decision
- **Filing**: State Board of Equalization
- **Fee**: $175 (may be waived)
- **Process**: More formal, may need attorney
- **Timeline**: 6-12 months for decision

### Appeal Success Tips
Increase your chances of success:

#### DO:
✅ File on time - missed deadlines cannot be waived
✅ Be specific about errors
✅ Provide clear evidence
✅ Focus on facts, not emotions
✅ Consider professional help for large reductions
✅ Use @agent/appeal-assistant for guidance

#### DON'T:
❌ Argue about tax rate (only assessment)
❌ Compare to non-similar properties
❌ Submit outdated information
❌ Be confrontational
❌ Ignore deadlines

### Professional Help
When to hire professionals:
- **Property Tax Consultant**: Complex commercial properties
- **Real Estate Attorney**: Legal issues, large amounts
- **Appraiser**: Need professional valuation
- **CPA**: Income approach properties

Find professionals via @tool/professional-directory.

## Special Situations

### New Construction
Assessment of new buildings:
- Partial assessment during construction
- Full assessment upon completion
- Occupancy permit triggers reassessment
- Use @tool/construction-estimator for projections

### Property Damage
Reduction for damage:
- Natural disaster: Automatic review
- Other damage: Must request review
- Provide damage documentation
- May qualify for prorated reduction
- File claim with @agent/damage-assessor

### Property Split or Combination
Parcel changes:
- Notify Assessor before changes
- New parcel numbers assigned
- Separate assessments created
- May affect exemptions
- Process via @tool/parcel-modification

### Historic Properties
Special considerations:
- Restrictions may limit value
- Tax credits for restoration
- Façade easements reduce assessment
- See @knowledge/historic-tax-benefits

## Resources and Tools

### Online Tools
- @tool/tax-calculator - Estimate property taxes
- @tool/assessment-tracker - View assessment history
- @tool/property-comparables - Find similar properties
- @tool/payment-reminder - Set payment alerts
- @tool/appeal-filing - File assessment appeal
- @tool/exemption-checker - Find eligible exemptions

### AI Assistants
- @agent/tax-assistant - General tax questions
- @agent/assessment-reviewer - Assessment analysis
- @agent/appeal-assistant - Appeal guidance
- @agent/exemption-advisor - Exemption eligibility
- @agent/payment-support - Payment issues

### Educational Resources
- @knowledge/understanding-assessments - Assessment basics
- @knowledge/property-tax-timeline - Important dates
- @knowledge/appeal-strategies - Successful appeal tactics
- @knowledge/exemption-guide - All available exemptions
- @knowledge/tax-sale-process - Delinquency consequences

### Workshops and Classes
Free educational sessions:
- **Understanding Your Tax Bill**: First Tuesday monthly
- **Appeal Process Workshop**: March annually
- **Senior Exemptions**: Quarterly at senior center
- **Online Webinars**: Recorded and available
- Register via @skill/workshop-registration

### Contact Information

**Assessor's Office**
📍 100 Assessment Avenue
📞 (555) 345-6789
✉️ assessor@cityname.gov
🕒 Monday-Friday: 8:00 AM - 4:30 PM

**Tax Collector's Office**
📍 789 Revenue Road
📞 (555) 456-7890
✉️ taxcollector@cityname.gov
🕒 Monday-Friday: 8:00 AM - 5:00 PM
   Extended hours during payment periods

**Board of Review**
📍 200 Appeal Court
📞 (555) 567-8901
✉️ boardofreview@cityname.gov
🕒 Hearings by appointment only

## Quick Reference

### Important Dates
- **January 1**: Assessment date for tax year
- **March 1**: Assessment notices mailed
- **April 10**: First installment due
- **May 1**: Appeal deadline
- **June-July**: Appeal hearings
- **December 10**: Second installment due

### Tax Calculation Formula
\`\`\`
(Assessed Value - Exemptions) × Tax Rate ÷ 1000 = Annual Tax
Example: ($400,000 - $50,000) × $16.50 ÷ 1000 = $5,775
\`\`\`

### Common Exemption Amounts
- Homestead: $50,000
- Senior: $25,000 additional
- Disability: $30,000
- Veteran (100%): Full exemption
- Low-income: Varies by income

## Related Documents
- @knowledge/residential-exemptions
- @knowledge/commercial-assessments
- @knowledge/tax-payment-options
- @knowledge/appeal-evidence-guide
- @knowledge/tax-sale-process`,
    type: 'markdown',
    metadata: {
      author: 'Tax Assessment Office',
      created: new Date('2024-02-20'),
      modified: new Date('2024-03-16'),
      tags: ['property-tax', 'assessment', 'appeals', 'exemptions', 'payments', 'residential'],
      references: [
        { type: 'agent', id: 'tax-assistant', path: '@agent/tax-assistant' },
        { type: 'tool', id: 'tax-calculator', path: '@tool/tax-calculator' },
        { type: 'tool', id: 'assessment-tracker', path: '@tool/assessment-tracker' },
        { type: 'tool', id: 'appeal-filing', path: '@tool/appeal-filing' },
        { type: 'knowledge', id: 'residential-exemptions', path: '@knowledge/residential-exemptions' }
      ],
      referencedBy: [],
      version: 2,
      size: 10500,
      summary: 'Comprehensive guide to property tax assessment, payment options, exemptions, and the appeals process for property owners.'
    },
    permissions: {
      owner: 'tax-assessment',
      public: true,
      sharedWith: [],
      canEdit: ['tax-assessment', 'tax-collector'],
      canView: ['all'],
    },
    searchableContent: '',
    publishingStatus: 'published',
  }
];