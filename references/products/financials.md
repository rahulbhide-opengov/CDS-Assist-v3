# OpenGov Financials Suite — Product Reference

Read this file when designing screens for the Financials suite: General Ledger, Accounts Payable, AR, Cash Receipts, Fixed Assets, Purchase Cards, Requisitions/POs, Utility Billing, Bank Reconciliation, or Flexible Inquiry.

**Trigger keywords:** financials, general ledger, GL, accounts payable, AP, accounts receivable, AR, cash receipts, fixed assets, purchase cards, requisitions, purchase orders, PO, utility billing, bank reconciliation, flexible inquiry, invoice capture, journal entry

---

## Product Identity

OpenGov Financials is part of OpenGov ERP — a cloud-based ERP for local government with connected financial and operational workflows. General Ledger is the accounting backbone; other modules feed transactional activity into GL.

## Module Map

### Accounting Core

| Module | Role | Key patterns |
|--------|------|-------------|
| **General Ledger** | Central accounting record and destination for all sub-ledger activity | Journal entries, ledger views, fund-based accounting, audit reporting |
| **Bank Reconciliation** | Reconcile bank activity against GL | Rule-based auto-match, approval-required matching, manual matching, dashboard |

### Operational / Transactional Modules

| Module | Role | Status |
|--------|------|--------|
| **Accounts Payable** | Invoice processing, approvals, payments | Mature; includes Invoice Capture (AI OCR, add-on per tenant) |
| **Requisitions & POs** | Purchasing approval workflows | Available; future positioning toward Procurement suite Requests |
| **Purchase Cards** | Import-based card transaction coding and accounting | Available and actively enhanced |
| **Fixed Assets** | Asset lifecycle, depreciation, disposal tracking | Available; downstream from AP/purchasing |
| **Accounts Receivable** | Receivables and billing | Operational but roadmap-sensitive (Enhanced AR from T&R future) |
| **Cash Receipts** | Cashier control, receipt workflows, supervisory balancing | Operational but roadmap-sensitive |
| **Utility Billing** | Service-account billing for water/sewer/trash/stormwater | Operational; future-state rewrite in development |

### Modernization Layers

| Capability | What it does |
|-----------|-------------|
| **Flexible Inquiry** | Self-service configurable data views for AP and GL research |
| **Invoice Capture** | AI-powered OCR in AP — enabled per tenant, not default |
| **Global Navigation** | Unified navigation bar, redesigned home, centralized Flexible Inquiry |
| **Application Switcher** | Cross-suite movement within the OpenGov platform |

## Architecture: Sub-Ledger Operating Pattern

Most non-GL modules follow this flow:

1. Users enter transactional activity in a module
2. Module applies validation, workflow, and business rules
3. System creates accounting entries or journal impacts
4. Final accounting effect is reflected in General Ledger

When a user asks "where does this transaction ultimately post?" — General Ledger is the answer.

## Bank Reconciliation (Modernized Module)

Key capabilities:
- Bank account → GL account mapping
- Statement upload
- Custom + standard reconciliation rules
- Auto-match workflows (rules are manually created, NOT AI-generated)
- Approval-required matching (holds matches until user approves)
- Manual matching, sub-transaction reconciliation
- Dashboard visibility + audit-ready review flows

**Critical rule**: Auto-matching rules are NOT AI-generated. They are manually created by users.

## Invoice Capture

- Built into AP at no additional cost, but must be enabled per tenant
- Configured via "Allow Invoice OCR" in AP settings
- Surfaced through "Try AI" flow in invoice entry
- OCR failures fall back to manual entry
- Requires tenant enablement AND appropriate user permissions

## Navigation Model

The UX is hybrid: classic ERP workflow depth (menu-driven, queue/list screens, background processing) plus newer cross-suite navigation improvements (Global Nav, App Switcher, centralized Flexible Inquiry).

## Security Model

Access is layered — do not reduce to a single yes/no model:
1. **System-level access** — broad module access
2. **Program/screen access** — specific functional areas
3. **Tenant enablement** — features like Invoice Capture require backend activation
4. **Role-driven operational rights** — determines what a user can do within a screen

## Design Rules for Financials

- **GL is always the final destination.** Show the accounting trail clearly.
- **Distinguish current ops from future-state.** Module manuals describe current behavior; ERP technical resources may describe roadmap. Never merge these.
- **Invoice Capture is not universally visible.** Don't show it in designs unless the context assumes it's enabled.
- **Bank Reconciliation rules are manual.** Never claim AI-based matching.
- **Integrations require setup.** Don't imply plug-and-play. Permitting fees flowing into Financials as journal entries, budget relationships with B&P — all require implementation.
- **Classic ERP depth is real.** The product has deep workflow specificity; don't oversimplify for aesthetics.
- **Reporting has multiple layers.** Operational reports (tied to module workflows), inquiry screens (record-level), Flexible Inquiry (configurable), and dashboards/analytics.

## Design Critique Strengths

- Strong accounting-centered architecture with GL as backbone
- Deep operational specificity for real public-sector workflows
- Bank Reconciliation is a modern, well-designed module
- Good balance of automation (auto-match) and control (approval-required)

## Design Critique Weaknesses

- Mixed legacy and modern UX patterns (hybrid product)
- Discoverability burden from layered permissions and module-specific navigation
- Terminology drift risk between current operational names and future-state names
- Not all integrations are plug-and-play despite marketing language
