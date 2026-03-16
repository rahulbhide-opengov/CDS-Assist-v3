# OpenGov Permitting & Licensing (PLC) — Product Reference

Read this file when designing screens for permits, licenses, inspections, plan review, code enforcement, citizen application portals, or government regulatory workflows.

**Trigger keywords:** permitting, licensing, PLC, permit, license, inspection, plan review, code enforcement, applicant, public portal, workflow, record type, renewal, zoning

---

## Product Identity

OpenGov Permitting & Licensing (PLC) is a configurable transactional system for government permitting, licensing, inspections, reviews, payments, documents, and renewals. Combines an internal employee app with a Public Portal for applicant self-service.

**Mental model**: A workflow-centric record processing platform. A **Record** is the durable business object, a **Record Type** defines structure and rules, the **Workflow** determines operational progress.

## Core Object Model

| Object | What it is |
|--------|-----------|
| **Record** | Anything entered: permits, licenses, complaints, projects, case objects |
| **Record Type** | Template defining form, access, attachments, fees, workflow, documents, renewal, location/applicant requirements |
| **Workflow** | Ordered operational steps: Approval, Document, Inspection, Payment |
| **Form Section** | Container within application form (single-entry or multi-entry) |
| **Form Field** | Input controls: short text, long text, number, checkbox, dropdown, date, help text, SSN, EIN, digital signature, file upload |
| **Applicant** | Primary external user attached to a record — receives notifications, takes public-side actions |
| **Guest** | Additional external users — can pay, request inspections, comment; cannot submit on behalf of applicant |
| **Location** | Address/geography connected to record — may come from Master Address Table (MAT) or manual entry |
| **Document** | Issued output: permit, license, certificate, notice |
| **Inspection Type** | Reusable inspection template/checklist |
| **Group** | User grouping for access and auto-assignment |
| **Department Form Field** | Reporting construct grouping like fields across record types |

## Primary User Groups

| User | What they do |
|------|-------------|
| **System admins** | Configure departments, users, groups, record types, forms, workflows, payments, inspections, portal |
| **Employee users** | Create/review records, process workflow steps, edit submissions, schedule inspections, run reports |
| **Applicants** | Submit records via Public Portal, manage drafts, pay, request inspections, respond to change requests, handle renewals |
| **Guests** | Participate on submitted records with limited actions (pay, inspect, comment — but not submit or invite others) |

## Record Lifecycle

1. Record creation in employee app or Public Portal
2. Link to applicant and/or location (configurable requirements)
3. Applicant completes form, uploads attachments, submits
4. Record progresses through workflow steps (Approval → Inspection → Payment → Document)
5. Employees review Details, Attachments, Applicant, Location, Activity Feed, Timeline
6. Employees can edit, request changes from applicant, add ad hoc steps, alter assignments
7. **Applicants cannot edit post-submission** unless record is returned for changes
8. Completion when workflow reaches terminal state and final documents are issued

## Configuration Model

Most product behavior is configuration-driven — customer differences come from settings, not different codebases.

**Record type design is the real implementation surface** — form design, workflow sequencing, access control, attachments, and payment logic shape the actual experience.

### Form Design Principles
- Single-entry sections for one-time data; multi-entry for repeated entities (contractors, fixtures)
- **Conditions are central** — show fields/sections only when number/checkbox/dropdown conditions are met
- Hidden/internal-only fields for staff operations (notes, hearing dates, review data)
- Searchable short-text fields available in global search
- Calculated number fields with cross-field/cross-section formulas (limitations exist)
- Deleting a field has reporting consequences (stays on older records, disappears from reporting)
- Digital signatures are immutable after submission and don't carry into renewals

### Workflow Design Principles
- Auto-assignment to users or groups (workload-aware, not naive rotation)
- Inspection steps can allow public requests
- **On Hold** is a key operating state for revision cycles and inbox management
- Ad hoc steps are powerful but risk naming inconsistency
- Due dates are both operational and automational

## Public Portal

The applicant-facing experience — constrained and optimized for self-service, NOT a skin over the employee app.

- Login required for creating/viewing records; public search can be enabled without login
- Dashboard includes Actions Required (payments, inspections, renewals)
- After submission, applicants cannot freely edit — only through staff-initiated request changes
- Guests added after submission
- Public search configurable by record type (records and locations)
- Project templates guide applicants through multi-record projects

## Inspections & Mobile

### Inspections
- Centrally configured Inspection Types with checklists and reference codes
- Pre-loaded into workflow inspection steps
- Applicants/guests can request inspections where enabled (type, preferred date, AM/PM, contacts, notes)
- Employees manage schedules, drag-and-drop untimed appointments, route optimization
- Tied to primary location only (not additional locations)

### Mobile App
- Staff-only, primarily inspector-focused
- **Offline mode**: scheduled inspections available offline with record details, applicant info, location, attachments
- **Form is read-only** in mobile app — cannot edit record forms
- Approval steps can be updated; document/payment steps are read-only
- Sync status matters (syncing, synced, not downloaded)
- Requires internet to sign in; cached data cleared on manual sign-out

## Payments

- Payment steps live in workflows (default at record type level or ad hoc per record)
- Fee labels can be conditional and calculated from form data
- Payment methods: online (credit card, e-check) + offline (cash/check by staff)
- Employees cannot make e-check payments on behalf of applicants (sensitive credentials)
- **Stripe** is the payment processor for electronic payments
- Refunds go back to original payment method; Stripe-side refunds won't reflect in product
- Waiving payments is a meaningful workflow action
- **Date Paid ≠ Payout Date** — matters for finance reporting
- Ledger report is central for account-level reconciliation

## Renewals

- Campaign-driven, especially for license-style records
- Record type settings determine locked fields and renewal workflow
- Campaign selects records by type + expiration date range
- Defines renewal window (how early/late relative to expiration)
- Campaign statuses: Open, Renewal Submitted, Lapsed, Pending
- Guests don't carry into renewal records automatically

## Reporting (Explore)

Standard report families: Records, Approvals, Payments, Documents, Inspections, Projects.

| Report family | Use for |
|---------------|---------|
| Records | Broad operational views, record type filtering |
| Approvals | Assignment and active work visibility |
| Payments Due | Active balances |
| Payments | Transaction history including refunds |
| Ledger | Fee-label-level finance analysis |
| Inspection Results | What inspections were conducted on a date |
| Documents | Issuance date tracking |

**Key nuance**: Report grain matters. Payments Due vs Payments vs Ledger answer different questions. Multi-entry export produces multiple CSV files.

## Design Rules

- **Record type configuration IS the implementation** — small design choices have large downstream effects
- Distinguish employee app vs Public Portal vs mobile app experiences
- Applicants cannot edit after submission (except via request changes) — design for this constraint
- Conditions create invisible complexity — troubleshooting requires cross-checking multiple settings
- Mobile app has sharp capability boundaries — don't promise form editing or full workflow management
- Payment edge cases are complex (reactivation, proceed logic, refunds vs voids, Stripe-side actions)
- Location issues are often MAT/GIS/address-governance issues, not workflow issues

## Design Strengths

- Highly flexible configuration platform supports many use cases through record types
- Strong record-centric hub (Details, Attachments, Activity, Applicant, Location, Timeline)
- Conditions simplify applications dramatically when done well
- Explore reporting is powerful with multiple families
- Inspector-focused mobile app with offline support

## Design Tensions

- Admin power outruns discoverability — many workflows require learned mental models
- "Known workaround" patterns exist for complex scenarios (escrow, rolling expirations, multi-phase inspections)
- Permissions distributed across system-level roles AND record-type-level access
- Nightly MAT sync and address governance can be hard to explain
- Mobile/web capability split is sharp — user expectations may exceed app scope
