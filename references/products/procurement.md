# OpenGov Procurement Suite (PRO) — Product Reference

Read this file when designing screens for the Procurement suite: intake, solicitations, evaluations, contracts, vendor management, or request management.

**Trigger keywords:** procurement, PRO, solicitation, RFP, bid, contract, vendor, intake, evaluation, award, contract management, supplier, requisition, purchase request

---

## Product Identity

OpenGov Procurement (PRO) is an end-to-end public procurement and contract lifecycle suite for cities, counties, state agencies, special districts, and school districts. Positioned as automation and compliance "from request through contract" — emphasizing public-sector transparency, collaboration, and supplier accessibility.

**Core differentiator**: The industry's only automated RFP and bid assembly tool using shared scope libraries, agency-specific boilerplates, and guided policy questions that automatically write the right instructions, terms, and forms into the draft.

## End-to-End Lifecycle

```
Intake/Request → Solicitation Development → Vendor Engagement → 
Evaluation & Award → Contract Management → Post-Award Operations
```

### 1. Intake & Request Management

Internal users submit purchasing requests with guided self-service, shared scope library access, and clause-level collaboration.

- Intake can route to: Create Solicitation, Create Contract, Close Request, or Incomplete
- Request management includes: line items, vendor selection, attachments, approval sequences, optional budget checks (when integrated with Financials)
- Ad hoc mid-request reviewer insertion and triage-based routing available
- Embedded Pavilion search for cooperative contracts in vendor selection

### 2. Solicitation Development

Signature capability — guided assembly, not static document authoring:

- Buyers answer policy/setup questions → content auto-inserted into draft
- Admin building blocks: Templates, Shared Sections, Shared Questions, Export Document Templates
- Shared sections support check-out/check-in and change broadcasting
- Conditional questions enable branching in setup flows and vendor questionnaires
- Export templates are DOCX-driven with title page, TOC, formatting variable control

### 3. Supplier Engagement

Built around reducing supplier friction and increasing transparency:

- One-time vendor registration across all OpenGov governmental customers
- No vendor fees for registration or premium alerts
- Bid details publicly accessible without login
- Public Q&A, live chat, addenda, reminders
- Notification: subscribed vendors, pre-invite lists, search by location (200 vendor cap), manual email, vendor lists, share links

### 4. Evaluation & Awards

- Low-price line-item and multi-stage best-value evaluations
- Ranked scoring, proposal comparison, phased technical/pricing reveal
- Evaluators access through "My Evaluations"
- Public transparency: selected vendor, pricing, questionnaire responses, consensus scorecard

### 5. Contract Management

Not just a repository — operational governance:

- Contract records + packet assembly (template or external agreement)
- Exhibits, wet/electronic signatures, checklist-based bilateral onboarding
- Document/public controls, immutable audit history, retention policies
- E-signature is an **add-on** (white-labeled DocuSign), not default
- Bulk download: 500MB per zip, 100MB per file

### 6. Vendor Management & Public Portal

- Agency-side: vendor/subscriber management, certifications, vendor lists, internal-only fields (EIN, UEI, DUNS)
- Public vendor portal: support-enabled, read-only, subscriber-driven
- Vendor presence depends on subscriber status to that agency

## Key Data Objects

Use these precise terms when designing:

| Object | What it is |
|--------|-----------|
| Intake Request | Early-stage purchase request |
| Requisition | Purchase request with approvals, line items, budget checks |
| Solicitation Project | The sourcing project lifecycle object |
| Template | Solicitation or contract template |
| Shared Section / Shared Question | Reusable admin-managed building blocks |
| Vendor Questionnaire | Structured vendor response experience |
| Pricing Table | Structured pricing capture |
| Evaluation Phase / Criteria | Structured scoring model |
| Addendum / Notice | Published change during open solicitation |
| Contract Record | Container for contract metadata |
| Contract Packet | Assembled contract content + exhibits + signatures |
| Associated Files | Non-packet files linked to contract records |
| Checklist | Bilateral onboarding/compliance workflow |
| Audit History | Immutable record of changes |
| Retention Policy | Admin-defined deletion/aging policy |

## Non-Obvious Product Constraints

1. **E-signature is not universal** — it's an add-on, not default
2. **Advanced contract formatting** requires backend enablement by OpenGov staff
3. **Signature page layout** is max two columns, no full-bleed blocks, limited automation below page/header/block level
4. **Public vendor portal** is support-enabled and read-only
5. **Pavilion sync** requires both contract record AND documents to be public
6. **Search by Location** caps at 200 vendors
7. **Two DocuSign stories** — solicitation-side PowerForms (customer's DocuSign) vs contract-side embedded e-signature (OpenGov add-on). Never conflate these.
8. **AI features must be enabled** in Site Settings
9. **Bulk download** has file-size limits (500MB zip, 100MB file)

## Design Rules

- The suite is **workflow-centric and compliance-centric** — not a simple bid board or document repository
- Don't reduce solicitation development to "upload a Word doc." The value is governed composition.
- Always distinguish which lifecycle stage a screen belongs to
- Mention when a capability is add-on/config-dependent
- Separate current behavior from roadmap/prototype behavior
- Don't collapse vendor, subscriber, and vendor contact into one concept
- Public-sector fairness and auditability drive design — broadcast communication, public visibility, traceable notifications

## Design Strengths

- Strong governed-authoring model for solicitations (reusable, policy-driven building blocks)
- End-to-end data continuity from request through contract
- Public-sector-native transparency patterns (public Q&A, addenda, audit history)
- Template governance maturity (check-in/check-out, change broadcasting)
- Supplier accessibility is first-class (free, public, guided)
- Contract operations depth (checklists, audit history, retention)

## Design Tensions

- Power vs flexibility: governed structure can feel less free-form than raw editors
- Signature page flexibility is deliberately bounded
- Admin complexity rises with capability (templates, conditional logic, routing)
- The 2025 Contracts Landing Page refresh explicitly acknowledges prior UX friction (hidden filters, overwhelming views, rigid columns)
