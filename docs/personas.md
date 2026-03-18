# Government User Personas

OpenGov product design implications by user role and tech fluency. Use when designing screens, flows, and copy for CDS-Assist outputs.

---

## Persona Matrix

| Role | Tech Fluency | Primary Goals | Frustrations |
|------|-------------|---------------|--------------|
| **Budget Director** | Mid-Tech | Strategy, cross-department coordination, scenario modeling | Excel bloat, manual rollups, disconnected data |
| **Maintenance Worker** | Low-Tech | Get tasks, close them on mobile, minimal data entry | Paper work orders, poor mobile UIs, complex forms |
| **Permit Reviewer** | Mid-Tech | Queue management, compliance, fast decisions | Cluttered UIs, slow search, unclear status |
| **Procurement Agent** | High-Tech | Speed + compliance, vendor outreach, RFP automation | Manual RFPs, low bid turnout, approval bottlenecks |
| **City Manager** | Mid-Tech | Oversight, public transparency, dashboards | Data silos, slow insights, no single pane |
| **IT Director** | High-Tech | Integration, security, uptime, SSO | Shadow IT, sprawl, legacy lock-in |

---

## Design Implications by Tech Fluency

### Low-Tech (e.g., Maintenance Worker)

- **UI**: Large touch targets, minimal steps, clear primary action
- **Copy**: Plain language, no jargon, short labels
- **Forms**: Pre-filled where possible, optional fields hidden or collapsed
- **Mobile**: Primary use case — design mobile-first
- **Feedback**: Obvious success/error states, confirmation before destructive actions

### Mid-Tech (e.g., Budget Director, Permit Reviewer, City Manager)

- **UI**: Balanced density, familiar patterns (tables, filters, dashboards)
- **Copy**: Domain terms OK, but explain on first use
- **Forms**: Guided flows where helpful, bulk actions for power use
- **Reports**: Drill-down from summary to detail

### High-Tech (e.g., Procurement Agent, IT Director)

- **UI**: Dense, keyboard shortcuts, advanced filters
- **Copy**: Technical terms acceptable
- **Integration**: API-first, exportable data, configurable workflows

---

## Suite-to-Role Mapping

| Suite | Primary Users | Secondary |
|-------|---------------|-----------|
| **B&P** (Budgeting & Planning) | Budget Director, City Manager | Finance staff |
| **EAM** (Asset Management) | Maintenance Worker, IT Director | Supervisors, Asset managers |
| **PLC** (Permitting & Licensing) | Permit Reviewer | Applicants, Inspectors |
| **PRO** (Procurement) | Procurement Agent | Budget Director, City Manager |
| **FIN** (Financials) | Budget Director, City Manager | AP/AR clerks |

---

## Use in CDS-Assist

When generating designs or code:

1. **Infer persona** from the prompt (e.g., "maintenance dashboard" → Maintenance Worker)
2. **Apply fluency rules** for that persona
3. **Map to suite** to choose the right product patterns and terminology
