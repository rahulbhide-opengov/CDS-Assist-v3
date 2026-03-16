# OpenGov ERP Platform — Product Reference

Read this file for context on the overall OpenGov platform when designing cross-suite experiences, platform-level dashboards, or navigation that spans multiple products.

**Trigger keywords:** OpenGov, ERP, platform, public service platform, suite, cross-suite, government ERP, fund accounting

---

## What It Is

OpenGov provides a modern cloud ERP platform built specifically for U.S. local and state governments. Unlike private-sector ERP adapted for government, OpenGov is architected around fund accounting, permitting, public asset management, procurement compliance, and citizen service delivery.

## Platform Suites

| Suite | Abbreviation | Core responsibility |
|-------|-------------|-------------------|
| Financial Management | FIN | Government accounting — GL, AP, AR, Cash Receipts, Fixed Assets, Bank Reconciliation, Purchase Cards |
| Budgeting & Performance | B&P | Budget development, planning, and performance management |
| Procurement & Contract Management | PRO / PCM | Sourcing, solicitations, contracts, and purchasing workflows |
| Permitting & Licensing | PLC | Permits, licenses, inspections, code enforcement, citizen portals |
| Enterprise Asset Management | EAM | Infrastructure, work orders, GIS-centric maintenance, capital planning |
| Tax & Revenue Collection | T&R | Tax billing, filing, collection, and public self-service payments |
| Utility Billing | UB | Recurring service billing for water, sewer, trash, stormwater |
| Payroll | Payroll | Government-specific payroll, deductions, retirement reporting |

## Core Government ERP Principles

These principles should shape every design decision across the platform:

1. **Fund accounting, not profit/loss.** Government money lives in restricted funds (public safety fund, water fund, etc.). The General Ledger must support multi-fund structures and enforce budget compliance.
2. **Compliance and transparency.** Standardized reports for auditors, regulators, and citizens. Immutable audit trails. Public transparency portals.
3. **Multi-department operations.** Cities operate planning, utilities, finance, public works, parks, etc. simultaneously. ERP must coordinate workflows while maintaining centralized financial records.
4. **Citizen interaction.** Many workflows extend to residents — submitting permits, paying taxes, tracking applications, paying utility bills. Portals are not secondary; they're core.
5. **Auditability.** Every action must be traceable. This is not optional or "nice to have" — it is a legal requirement.
6. **Configurability.** Workflows must adapt to local regulations without custom development. Every jurisdiction has slightly different rules.

## Source-to-Pay Flow (Government Spend Management)

Government purchasing follows strict compliance and approval rules:

1. **Procurement** — sourcing vendors and evaluating bids
2. **Requisitions** — departments request permission to spend funds
3. **Purchase Orders** — official authorization to purchase
4. **Invoice Approval** — verification and payment authorization
5. **Bank Reconciliation** — validation of financial records against bank activity

Complete audit trail at every step.

## Design Implications for CDS-Assist

When designing for OpenGov products:

- **Government staff are not always technical users.** Clarity over complexity.
- **Auditability is a feature.** Show who did what, when, in every relevant view.
- **Integration is expected.** Screens often need to show data from multiple suites (e.g., procurement data alongside financial data).
- **Legacy coexistence.** Many customers are migrating from paper, spreadsheets, or older systems. Designs must support gradual adoption.
- **Reporting is first-class.** Dashboards and reports are operational tools, not afterthoughts. They must support drill-down from aggregate metrics to individual records.
- **Public-facing != internal.** Citizen portals have different constraints (trust, plain language, mobile-first) than staff-facing tools (speed, bulk operations, power-user patterns).

## Common UX Anti-Patterns to Avoid

- Departments operating in silos with separate disconnected views
- Reporting that requires exporting and reformatting data
- Paper-based approval metaphors that slow down digital processes
- Confusing or outdated citizen-facing portals
- Hiding audit information behind extra clicks
