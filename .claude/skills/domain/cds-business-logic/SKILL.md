---
name: CDS Business Logic
description: State management, forms, data fetching, and error handling patterns for CDS applications. Use when implementing data flows, forms, or API integration.
---

# CDS Business Logic

## State Management

- **Zustand** — Typed stores for global/domain state

---

## Form Validation

- **react-hook-form** + **yup** for validation

---

## Data Fetching

- Proper cleanup with **AbortController**
- Cancel requests on unmount

---

## Optimistic Updates

- Apply UI changes immediately
- Rollback on failure

---

## Debounced Search

- **300ms** debounce for search inputs

---

## Loading States

| Context | Component |
|---------|-----------|
| Initial load | Skeleton |
| Actions (submit, delete) | CircularProgress |

---

## Error Handling

- **ErrorState** type with `message` and `retryable` flag
- Provide retry action when `retryable` is true

---

## Mock Data

- **@faker-js/faker** for mock data
- **Seeded** for consistency across runs

---

## Keywords

state, form, validation, api, fetch, data, zustand
