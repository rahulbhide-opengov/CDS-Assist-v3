# OpenGov Chart of Accounts (CoA) — Product Reference

Read this file when designing screens for chart of accounts management, account structures, segment configuration, fund rules, hierarchy management, or financial data products.

**Trigger keywords:** chart of accounts, CoA, segment, account number, fund, object, hierarchy, category, account group, dimension, standard dataset

---

## Product Identity

The Chart of Accounts (CoA) suite is a platform data product evolving from legacy-centered capability into a standalone service with central APIs, validation, and downstream data products. It is the **single source of truth** for account structures regardless of source system (FIN, B&P, legacy Data Manager, migration).

**This is not a flat lookup table.** It is a managed domain with schema, validation, change tracking, reporting semantics, and lifecycle operations.

## Domain Terminology

| Term | Definition |
|------|-----------|
| **CoA instance** | One chart of accounts definition bound to an entity |
| **Segment** | A positional component of an account number (Fund, Object, Department, Program, Project, user-defined) |
| **Segment code** | A concrete code value for one segment, with optional description |
| **Account** | A fully qualified account number composed of codes across all segments + metadata (type, description, status) |
| **Fund configuration** | Rules determining which segments are enabled for a specific fund code |
| **Hierarchy / category mapping** | Parent-child rollup structure for categorizing codes for reporting |
| **Account group** | Higher-level grouping for reporting and dashboards (in-progress design) |
| **Standard dataset / dimension** | Downstream platform-managed data artifacts for joins, aggregate lenses, reporting |

## Service Map

| Component | Responsibility | Maturity |
|-----------|---------------|----------|
| **CoA Management API** | Provision, describe, update, list, delete CoA definitions | Defined and performance-tested |
| **Publish Accounts API** | Atomic upsert of accounts into a CoA | Defined and performance-tested |
| **Fund Configuration API** | Per-fund segment enablement rules | Named but not fully specified |
| **Account Lookup API** | Resolve current account state by ID or segment-code mapping | Named but not fully specified |
| **Publish Segment Codes API** | Create/update individual segment codes | Proposed direction |
| **Get Segment Codes API** | Fetch codes within a segment | Proposed direction |
| **CoA Hierarchies API** | Manage category levels/rollups/hierarchies | Explicitly unsettled |
| **CoA Standard Data Processor** | Transform account events into standard datasets/dimensions | Approved design |
| **Account Groups / Multiple Hierarchies** | Flexible reporting model beyond single hierarchy per segment | In progress / partially designed |

## Key Validation Rules (CoA Management)

- Fund and Object segment types are **required** and must be enabled at creation
- Maximum 13 segments
- Only one segment per type (except unknown/user-defined)
- Account-number separators: count = segments - 1; supported: `.` and `-`
- **Immutable after creation**: number and order of segments, segment type once enabled, defaultSegmentCode once enabled
- Segments cannot be disabled once enabled

## Key Validation Rules (Publish Accounts)

- Atomic upserts — up to 1000 accounts, all-or-nothing rollback on validation failure
- Synchronous validation (deliberate deviation from pure event sourcing — clients need immediate errors)
- Every account must have client-provided UUID, accountType (immutable once set)
- Must provide a code for every segment position (including disabled segments)
- Disabled segments must use NOCODE; Fund segment cannot use NOCODE
- Object codes must be unique per accountType

## Architecture

- **Transactional outbox pattern**: domain state + outbox record in same transaction → Debezium → Kafka events in commit order
- **Aurora Serverless** for lower operational overhead, variable-workload suitability
- Synchronous validation for UX + reliable async downstream eventing
- **Backfill**: subscribe to account-updated events from legacy Delphius, replicate into new service

## Hierarchy & Reporting (Current Limitations)

| Area | Current state |
|------|-------------|
| Hierarchy flexibility | Only one hierarchy per segment — limiting alternate reporting views |
| Grouping model | Account groups are primarily backend constructs, not user-managed |
| Cross-segment grouping | Current model struggles with "Personnel Expenses in Fund 101" |
| UI support | Users cannot visualize or edit hierarchies graphically |
| Reporting dependency | MDS/reporting expect fixed semantic mappings and flattened hierarchies |

**Multiple hierarchies (in-progress)**: Introduces explicit Hierarchy concept with scoped relationships. Groups may be reusable across hierarchies, but must maintain tree structure for current reporting technology (Logi). Still constrained — not a full DAG model.

**Agent rule**: When asked about account groups, multiple hierarchies, or reusable groups — answer in terms of **proposed direction and trade-offs**, not fully implemented features.

## Performance Targets

| Operation | Latency SLO | Throughput |
|-----------|------------|-----------|
| Create CoA | 95% < 100ms | 60 write req/min |
| Update CoA | 95% < 100ms (2s e2e) | 60 write req/min |
| Describe/List CoA | 95% < 150ms | 1500 req/min |
| Publish Accounts | 95% < 10s | 200 req/min |

## Design Rules

- **Differentiate current-state from proposed future.** Many hierarchy features are still being designed.
- **Treat CoA as a domain product**, not merely a list of APIs. It has schema, validation, change tracking, reporting semantics, lifecycle.
- **Synchronous atomic validation** is a deliberate choice — clients like B&P need immediate feedback.
- **Stable base datasets vs mutable reporting dimensions** are distinct architectural concepts — don't conflate them.
- **Immutability constraints** protect integrity but make mistakes expensive — surface the consequences clearly in admin UX.
- **Hierarchy UI is needed** — current lack of graphical hierarchy management is a real gap.

## Design Strengths

- Clear source-of-truth ambition
- Strong validation discipline at write time (essential for accounting)
- Atomic account publish semantics (no partial corruption)
- Pragmatic event architecture (transactional outbox)
- Explicit performance/latency budgets
- Migration-aware design (backfill and legacy coexistence are first-class)

## Design Risks

- Sync validation may hit throughput ceilings at scale
- Hierarchy ambition exceeds current reporting tool capabilities (Logi constraint)
- Reusable groups across hierarchies may create DAG-like downstream pain
- Several core APIs (account lookup, fund config) are referenced but not fully specified
- Legacy Delphius dependencies still drive backfill and event shape
- Aurora Serverless cold-start risk for high-traffic lookup scenarios
