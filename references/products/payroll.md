# OpenGov Payroll V2 — Product Reference

Read this file when designing screens for payroll processing, employee pay, deductions, benefits, timesheets, retirement reporting, or payroll accounting.

**Trigger keywords:** payroll, pay, earnings, deductions, benefits, timesheet, overtime, comp time, retirement, W-2, payroll run, gross pay, net pay, wage group, shift group

---

## Product Identity

OpenGov Payroll V2 is an embedded payroll architecture for U.S. local government. It is a **split-brain payroll system** with a deliberate division of labor:

| Responsibility | OpenGov owns | Check (partner) owns |
|---------------|-------------|---------------------|
| Domain configuration | Government-specific payroll config, pay rules, positions | Entity onboarding data for servicing |
| Employee master | Employee roster, payroll-facing records | Mirrored employee representation |
| Time & attendance | Timesheets, overtime/comp-time, shift-group logic | Not primary owner |
| Gross pay | Gross earnings generation, public-sector pay rules, longevity, step-up | Consumes post-gross events |
| Net pay & taxes | Not final authority | Net pay, withholdings, filings, remittances |
| Deductions | Definitions, rate groups, wage interactions, accounting | Operational calculation after mapped sync |
| Disbursement | Accounting aftermath + reporting | Employee payment delivery, tax transfers |
| GL/AP posting | Posts with OpenGov accounting logic using partner data | Supplies transaction outputs + metadata |
| Retirement reporting | State-specific retirement + audit reports | Not stated as owner |

**Key insight**: OpenGov is the **policy-and-accounting brain**; Check is the **payroll-service execution engine**. CDC (Change Data Capture) keeps them synchronized.

## End-to-End Payroll Flow

1. Payroll configuration defines pay types, frequencies, shift groups, wage groups, grades, positions, deductions, benefits
2. Employee administration maintains payroll-facing employee roster
3. CDC synchronizes employer, employee, benefit, deduction representations to Check
4. Timesheets, leave usage, comp time, overtime tracked in OpenGov
5. Admin initiates a payroll run
6. OpenGov calculates gross pay → publishes post-gross events + deductions to Check with GL metadata
7. Check computes net pay and deductions → prepares draft payroll
8. Admin reviews draft → accepts/finalizes or cancels
9. Check pays employees and transfers tax withholdings
10. OpenGov pulls transaction data back from Check
11. OpenGov posts GL/AP transactions with payroll accounting structures
12. OpenGov produces audit + state retirement reports; Check handles year-end tax filings

## The Core Calculation Grammar

The heart of the suite is four interacting concepts:

| Concept | What it determines |
|---------|-------------------|
| **Pay Frequency** | How often payroll occurs (weekly, bi-weekly, semi-monthly, annual) |
| **Shift Group** | What labor pattern applies (fire shift, police shift, part-time library) |
| **Pay Type** | What kind of earning/benefit event (Regular, Overtime, Holiday, Longevity, Comp Taken) |
| **Wage Group** | How that event participates in taxable/reportable wage bases and deduction calculations |

This grammar enables public-sector payroll complexity. When a bug involves wrong tax treatment, wrong overtime, wrong benefit, or wrong accounting line — inspect the relevant pay type → wage group → rate group → frequency/shift mapping before assuming the engine is wrong.

## Government-Specific Complexity

The suite handles:
- Irregular public safety schedules and FLSA work-period rules (fire, law enforcement)
- Comp time accrual vs payout with thresholds and overtime allocation methods
- Longevity programs with flat or tiered tenure logic
- Split-funding and interfund payroll accounting (funds, departments, programs, due-to/due-from)
- Mid-period rate changes (step plans, step-up, out-of-class, automatic time-based promotions)
- Large catalogs of special earnings (certification pay, car allowances, reimbursements, taxable life insurance, military leave, retro pay)
- State-specific retirement reporting (OpenGov differentiator and remaining expansion burden)

## Key Domain Objects

### Pay-Structure Objects
- Pay Frequencies, Shift Groups, Frequency/Shift Group mappings
- Pay Types, Wage Groups, Pay Types/Wage Groups mapping
- Pay Grades, Grade Levels, Positions (step plans, open ranges)
- Longevity Groups and Longevity Tenures

### Benefit Objects
- Benefit Rate Groups, Benefit Types, Benefit Tenures
- Accrual rates, ceilings, startup hours, year-end carryover
- Benefit Employees and Benefit Years

### Deduction Objects
- Deduction Classes, Deduction Types (employee/employer portions, accounting, reporting lines)
- Deduction Wage Groups (how deduction alters taxable wages)
- Deduction Rate Groups (rate plans, effective dates, limits, formulas)
- Life Insurance Ages (age-banded premium logic)

### Accounting Objects
- Employer Groups (multi-tax-ID contexts)
- Payroll Funds, Departments, Programs → connect to fund accounting
- Due To / Due From controls (interfund transfers)

## Payroll Run as State Machine

| State | Meaning |
|-------|---------|
| Configured | All setup objects exist, sync assumptions met |
| Time finalized | Timesheets and external time imports posted |
| Batch prepared | Batch controls, employees, pay types staged |
| Gross calculated | OpenGov computed gross earnings |
| Published | Post-gross events sent to Check |
| Draft available | Check computed draft payroll outputs |
| Review | Admin reviews draft summary and details |
| Approved / Cancelled | Admin finalizes or deletes draft |
| Paid | Check distributes funds and withholdings |
| Transactions imported | OpenGov retrieves results from Check |
| Posted | GL/AP/history entries created in OpenGov |
| Reported | Audit and retirement reports produced |

## Design Rules

- **Split architecture is fundamental** — designs must reflect that some data comes from OpenGov and some from Check
- **GL metadata must survive the round trip** — if semantic context is lost between OpenGov → Check → OpenGov, accounting integrity breaks
- **Don't oversimplify configuration** — the object model is rich for a reason (public-sector pay complexity). Recommend progressive disclosure and guided setup rather than reducing domain fidelity.
- **Benefits and deductions are high-risk sync domains** — they control pre-tax/post-tax correctness and paystub descriptions
- **State retirement reporting** is a durable differentiator AND remaining burden — don't ignore it
- **White-label opacity** — if the UX hides Check entirely, support needs excellent diagnostic tooling to explain failures spanning both systems
- **Payroll administrators think in legacy terms** — don't assume everyone understands the new architecture

## Design Strengths

- Starts from real comparative advantage (government payroll semantics, not generic abstraction)
- Explicit about core objects and calculation structures (strong internal grammar)
- Commercially rational split between gross-pay semantics and payroll servicing
- Preserves administrator workflow continuity through backend changes

## Design Risks

- System-of-record boundaries are still being formalized (which screens mirror to Check?)
- Semantic loss during mapping can silently degrade correctness
- UI fragmentation risk — screen-rich, configuration maze potential
- Legacy PowerHouse process dependencies during transition
- CDC reliability is product-critical — if sync drifts, the architecture fails
