# OpenGov Tax & Revenue Suite — Product Reference

Read this file when designing screens for tax billing, revenue collection, public payment portals, property tax, business licensing, citations, utility billing, or miscellaneous revenue types.

**Trigger keywords:** tax, revenue, property tax, business tax, license, citation, utility billing, billing, collection, receipting, payment portal, delinquency, filing, assessment

---

## Product Identity

OpenGov Tax & Revenue Collection is a configurable local-government revenue operations platform — not merely a payment portal. It spans filing, billing, collection, receipting, reconciliation, delinquency follow-up, communications, and reporting. Adjacent to broader OpenGov ERP capabilities.

## The Five Application Families

Always anchor on these five categories:

### 1. Property

Administration of property-linked billing and collection: real estate, personal property, vehicle taxes, excise, boats, add-on charges (trash, sewer, stormwater).

**Key entities**: parcel/property ID, owner, situs/mailing address, property class, assessment import, levy/rate, statement/installment, balance, penalties, interest, adjustments, delinquency, receipt history.

**Design priorities**: fast retrieval by parcel/owner/address, persistent context between search → account → bill → payment, clear distinction between current-year charges, arrears, penalties, special assessments, explainable calculations.

### 2. License

Business tax and license administration: registrations, renewals, ordinance-driven fees, filing/payment obligations, specialized categories (alcohol, business tax).

**Key entities**: business account, owner, license type, filing period, tax basis (gross receipts, flat fee, classification), required documents, application status, issuance, expiration, suspension.

**Design priorities**: adaptive forms per license type, clear lifecycle timeline (application → renewal), visible required documents, batch renewals and review queues.

### 3. Utility

Billing and payment management for recurring municipal services: water, sewer, stormwater, trash. Note: utility-like charges may appear as standalone billing OR as attached charges in property billing.

**Key entities**: service account, service location, billing cycle, usage/meter inputs, recurring charges, penalties, credits, statement, payment plan.

**Design priorities**: repetitive payment optimization, highly legible balances/due dates, autopay clarity, exception handling for disputed usage.

### 4. Citation

Ticket/violation-based financial obligations: parking citations, code fines, municipal enforcement charges.

**Key entities**: citation number, cited party/vehicle/property, violation type, due date, penalty schedule, evidence, dispute/adjudication status, payment status.

**Design priorities**: fast lookup by citation number/plate/party, immediately understandable amount + deadlines, visible dispute vs payment options, mobile-friendly payment, staff tools for high volume.

### 5. Miscellaneous

Catch-all but strategically important: rental fees, stormwater charges, parking permits, one-off invoices, custom fees. Many governments have revenue streams that don't fit standard tax/utility models.

**Key entities**: custom fee type, payer, billable event, one-time or recurring schedule, custom forms, ad hoc invoice.

**Design priorities**: templates and opinionated starting points, guardrails against malformed configs, reusable patterns, reporting normalization across custom categories.

## Cross-Cutting Revenue Patterns

Every revenue stream follows:

1. **Intake / registration** — identify obligated party, capture minimum data
2. **Rule application** — fee schedules, rates, penalties, discounts, due dates, filing requirements
3. **Notification** — statements, reminders, confirmations, delinquency notices
4. **Payment and receipting** — online and office-based collection, balance updates
5. **Exception handling** — corrections, refunds, appeals, invalid imports, duplicates, partial payments
6. **Reporting and oversight** — dashboards for missed filings, delinquencies, revenue trends, audit

## Public Portal Principles

The public self-service portal should enable:
- Account lookup, bill/balance viewing, filing/renewal actions, online payment, receipt access, document upload, account history

**Portal design rules**:
- Prioritize clarity over internal terminology
- Always show: current amount due, what it includes, what happens next
- Support repeat and first-time users equally
- Design for stressful contexts (delinquency, citations)

**Portal anti-patterns**:
- Forcing users to know internal identifiers without fallback search
- Splitting lookup, payment, and receipt into disconnected journeys
- Displaying balances without breakdowns
- Hiding deadlines and penalties until late in the flow

## Staff Experience Priorities

- Speed for repeat tasks
- Visibility across the account lifecycle (single record story)
- Bulk operations with guardrails and preview
- Clear exception queues
- Defensible audit trails
- Fewer spreadsheets and manual reconciliations
- Exportable, presentation-ready reporting

**Staff anti-patterns**: over-optimizing aesthetics while slowing transactional work, burying balance-impacting actions, weak bulk-action previews, inconsistent status naming.

## Dashboard Design

Dashboards are operational tools, not decorative analytics:

**Good patterns**: aging/delinquency snapshots, filings due/missing/corrected, payment volume + channel mix, revenue trends by type/period, top exception categories, staff work queues tied to outcomes.

**Anti-patterns**: vanity charts with no drill-down, mixing policy KPIs with action queues, hiding definitions behind jargon, requiring exports for routine follow-up.

## Design Rules

- **Clarity over cleverness** — money owed, status, due dates, and next steps must always be obvious
- **Throughput matters** — staff need speed, bulk tools, and error recovery more than ornamental UI
- **One record story** — account, obligations, payments, notices, adjustments should feel connected
- **Configurability with guardrails** — flexibility is valuable only when it doesn't fragment UX or reporting
- **Trust is a feature** — receipts, explanations, accessible language, visible timelines affect adoption
- **Exception handling is core UX** — disputes, corrections, delinquency, partial payments are first-class
- **Dashboards must drive action** — operational follow-up beats decorative analytics

## Confidence Boundaries

**High confidence**: centralized multi-revenue-type management, public self-service portal, calculations/billing/payments/receipting/reporting, flexible/custom revenue types, dashboard real-time reporting.

**Likely but unverified**: exact field names, exact roles/permissions model, exact API surface, exact integration list, exact adjudication depth for citations.
