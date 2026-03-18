# OpenGov Suite Scope

Suite definitions and cross-suite integration points for CDS-Assist design and code generation.

---

## Suite Definitions

### B&P — Budgeting & Planning

- Budgets, proposals, publications
- Scenario modeling, fund allocation
- Performance management and reporting

### EAM — Enterprise Asset Management

- Work orders, inspections, asset inventory
- GIS-centric maintenance, capital planning
- Requests/311, field worker workflows

### PLC — Permitting & Licensing

- Permits, licenses, reviews, payments, inspections
- Record types, workflows, forms
- Public applicant portal

### PRO — Procurement

- Solicitations (RFPs, RFQs), vendors, contracts
- Intake, evaluation, award
- Vendor management, public portal

### FIN — Financials

- General Ledger, AP, AR, Payroll, Purchasing
- Bank reconciliation, fixed assets, purchase cards
- Fund accounting, journal entries

---

## Cross-Suite Integration Points

| From | To | Integration |
|------|----|-------------|
| PRO | FIN | Requisitions → POs, contract spend → GL |
| B&P | FIN | Budget proposals → fund allocation |
| EAM | FIN | Work order costs, asset depreciation |
| PLC | FIN | Permit fees, license payments |
| FIN | All | Central accounting, audit trail |

---

## Use in CDS-Assist

When designing screens that span suites (e.g., procurement + financials):

1. Identify primary suite for the screen
2. Check integration points for linked data
3. Use consistent terminology across suite boundaries
