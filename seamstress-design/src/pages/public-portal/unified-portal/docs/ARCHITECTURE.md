# Unified Public Portal - Architecture Document

## Executive Summary

The Unified Public Portal is a comprehensive, mobile-first government services platform that consolidates all citizen-government interactions into a single, accessible interface. This architecture supports unlimited bill types, permit categories, tax payments, grant applications, and vendor management workflows.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           UNIFIED PUBLIC PORTAL                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        PRESENTATION LAYER                                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │
│  │  │   Web    │ │  Mobile  │ │   PWA    │ │  Kiosk   │ │   API    │      │    │
│  │  │  Portal  │ │   App    │ │          │ │  Mode    │ │  Clients │      │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      API GATEWAY LAYER                                   │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │
│  │  │   Auth     │ │   Rate     │ │   Load     │ │   API      │           │    │
│  │  │   Guard    │ │  Limiting  │ │  Balancer  │ │  Versioning│           │    │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      CORE SERVICES LAYER                                 │    │
│  │                                                                          │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │  Identity   │  │  Unified    │  │  Workflow   │  │  Document   │    │    │
│  │  │  Service    │  │  Dashboard  │  │  Engine     │  │  Vault      │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  │                                                                          │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │  Payment    │  │  Notifi-    │  │  Search     │  │  Analytics  │    │    │
│  │  │  Engine     │  │  cations    │  │  Service    │  │  Service    │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      DOMAIN SERVICES LAYER                               │    │
│  │                                                                          │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │    │
│  │  │ Utility │ │ Permit  │ │   Tax   │ │ Grants  │ │  Parks  │           │    │
│  │  │ Billing │ │ License │ │ Service │ │  & GAB  │ │  & Rec  │           │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │    │
│  │                                                                          │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                                    │    │
│  │  │ Vendor  │ │Property │ │ Misc    │                                    │    │
│  │  │ Procure │ │ Service │ │ Bills   │                                    │    │
│  │  └─────────┘ └─────────┘ └─────────┘                                    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      INTEGRATION LAYER                                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │
│  │  │ Legacy   │ │ Payment  │ │   GIS    │ │   ERP    │ │  Third   │      │    │
│  │  │ Adapters │ │Processors│ │ Systems  │ │ Finance  │ │  Party   │      │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      DATA LAYER                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │
│  │  │PostgreSQL│ │  Redis   │ │  S3/Blob │ │Elastic-  │ │  Audit   │      │    │
│  │  │  (Main)  │ │ (Cache)  │ │(Documents│ │  search  │ │  Logs    │      │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React 18 + TypeScript | Component-based, strong typing, large ecosystem |
| UI Library | MUI v5 + OpenGov Capital | Government-compliant design system |
| State Management | Zustand + React Query | Lightweight, excellent caching |
| Forms | React Hook Form + Zod | Performance, validation |
| Routing | React Router v6 | Nested routes, lazy loading |
| PWA | Workbox | Offline support, push notifications |
| Accessibility | @axe-core/react | WCAG 2.2 AA compliance |

### Backend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| API Gateway | Kong / AWS API Gateway | Rate limiting, auth, routing |
| Core Services | Node.js + NestJS | TypeScript, modular, enterprise-ready |
| Workflow Engine | Temporal.io | Durable workflows, retries |
| Auth | Keycloak / Auth0 | SSO, RBAC, ABAC, MFA |
| Search | Elasticsearch | Full-text, faceted search |
| Cache | Redis | Session, rate limiting, cache |

### Database
| Type | Technology | Use Case |
|------|------------|----------|
| Primary | PostgreSQL 15 | Transactional data, ACID |
| Document | MongoDB (optional) | Flexible schemas, forms |
| Cache | Redis | Sessions, hot data |
| Search | Elasticsearch | Universal search index |
| Files | S3 / Azure Blob | Document vault |

### Infrastructure
| Component | Technology |
|-----------|------------|
| Container | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Datadog / Prometheus |
| Logging | ELK Stack |
| CDN | CloudFront / Cloudflare |

---

## Multi-Entity Relationship Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IDENTITY & ENTITY MODEL                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────────────┐                                                         │
│   │    USER       │◄──────────────────────────────────────────────┐        │
│   │  (Identity)   │                                                │        │
│   └───────┬───────┘                                                │        │
│           │ has many                                               │        │
│           ▼                                                        │        │
│   ┌───────────────┐         ┌───────────────┐                     │        │
│   │ ENTITY_ROLE   │────────►│    ENTITY     │                     │        │
│   │  (Junction)   │         │  (Polymorphic)│                     │        │
│   │               │         └───────┬───────┘                     │        │
│   │ - role_type   │                 │                             │        │
│   │ - permissions │                 │ entity_type                 │        │
│   │ - delegated_by│                 ▼                             │        │
│   └───────────────┘   ┌─────────────┴─────────────┐               │        │
│                       │                           │               │        │
│           ┌───────────┴───────────┐   ┌──────────┴──────────┐   │        │
│           ▼                       ▼   ▼                      ▼   │        │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐     │        │
│   │   HOUSEHOLD   │   │   BUSINESS    │   │  ORGANIZATION │     │        │
│   │               │   │               │   │  (Nonprofit)  │     │        │
│   │ - address     │   │ - ein         │   │  - ein        │     │        │
│   │ - members[]   │   │ - license_num │   │  - 501c_type  │     │        │
│   │ - parcels[]   │   │ - dba_name    │   │  - mission    │     │        │
│   └───────────────┘   └───────────────┘   └───────────────┘     │        │
│                                                                   │        │
│   ┌───────────────┐   ┌───────────────┐                          │        │
│   │    SCHOOL     │   │    VENDOR     │                          │        │
│   │               │   │               │◄─────────────────────────┘        │
│   │ - district_id │   │ - vendor_num  │   (User can be vendor contact)   │
│   │ - grade_levels│   │ - certif[]    │                                   │
│   │ - enrollment  │   │ - contracts[] │                                   │
│   └───────────────┘   └───────────────┘                                   │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Definitions

### 1. Identity Service
- User registration & authentication
- Multi-factor authentication (MFA)
- SSO integration (SAML, OIDC)
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Entity relationship management
- Delegated access (power of attorney, authorized agents)

### 2. Unified Dashboard Service
- Aggregates data from all domain services
- Personalized views per entity type
- Action items & deadlines
- Quick actions
- Universal search integration

### 3. Workflow Engine Service
- Generic workflow definitions
- State machine management
- Task assignment & routing
- SLA tracking
- Approval chains
- Document requirements
- Integration hooks

### 4. Payment Engine Service
- Unified payment processing
- Multiple payment methods (Card, ACH, Apple Pay, Google Pay)
- Payment plans & autopay
- Partial payments
- Refunds & adjustments
- PCI-DSS compliance
- Receipt generation

### 5. Document Vault Service
- Secure document storage
- Version control
- Expiration tracking
- OCR & data extraction
- Document templates
- E-signature integration

### 6. Notification Service
- Email notifications
- SMS notifications
- Push notifications
- In-app notifications
- Notification preferences
- Template management
- Delivery tracking

### 7. Search Service
- Universal search across all entities
- Faceted search
- Auto-complete
- Search analytics
- Index management

---

## Security Architecture

### Authentication Flow
```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────►│ Gateway  │────►│ Keycloak │────►│ Services │
└──────┘     └──────────┘     └──────────┘     └──────────┘
    │              │                │                │
    │   1. Login   │                │                │
    │─────────────►│                │                │
    │              │  2. Auth Req   │                │
    │              │───────────────►│                │
    │              │                │                │
    │              │  3. JWT Token  │                │
    │              │◄───────────────│                │
    │  4. Token    │                │                │
    │◄─────────────│                │                │
    │              │                │                │
    │  5. API Call │                │                │
    │─────────────►│  6. Validate   │                │
    │              │───────────────►│                │
    │              │                │  7. Call       │
    │              │────────────────────────────────►│
    │              │                │                │
    │  8. Response │◄───────────────────────────────│
    │◄─────────────│                │                │
```

### Security Layers
1. **Network**: WAF, DDoS protection, TLS 1.3
2. **Application**: Input validation, CSRF, XSS prevention
3. **Data**: Field-level encryption, data masking
4. **Audit**: Comprehensive logging, SIEM integration
5. **Compliance**: SOC 2, FedRAMP-ready, CJIS-compatible

---

## API Gateway Contract

### Base URL Structure
```
https://api.portal.gov/v1/{service}/{resource}
```

### Core Endpoints
| Service | Endpoint | Description |
|---------|----------|-------------|
| Identity | `/identity/users` | User management |
| Identity | `/identity/entities` | Entity management |
| Identity | `/identity/roles` | Role assignment |
| Dashboard | `/dashboard/summary` | Dashboard data |
| Dashboard | `/dashboard/actions` | Action items |
| Payments | `/payments/transactions` | Payment processing |
| Payments | `/payments/methods` | Payment methods |
| Payments | `/payments/plans` | Payment plans |
| Documents | `/documents/upload` | Document upload |
| Documents | `/documents/vault` | Document retrieval |
| Workflow | `/workflow/applications` | Applications |
| Workflow | `/workflow/tasks` | Task management |
| Search | `/search/query` | Universal search |
| Notifications | `/notifications/send` | Send notifications |
| Notifications | `/notifications/preferences` | User preferences |

---

## Frontend Routing Map

```
/                                    → Redirect to /dashboard or /login
/login                               → Login page
/register                            → Registration wizard
/forgot-password                     → Password reset
/mfa                                 → MFA verification

/dashboard                           → Unified dashboard
/dashboard/actions                   → Action items
/dashboard/deadlines                 → Upcoming deadlines

/bills                               → All bills (unified view)
/bills/:type                         → Bills by type (utility, tax, permit, etc.)
/bills/:id                           → Bill detail
/bills/:id/pay                       → Payment flow

/permits                             → Permit applications
/permits/apply/:type                 → New permit application
/permits/:id                         → Permit detail/status
/permits/:id/documents               → Required documents

/licenses                            → License management
/licenses/apply/:type                → New license application
/licenses/:id                        → License detail
/licenses/:id/renew                  → Renewal flow

/taxes                               → Tax overview
/taxes/property                      → Property tax
/taxes/business                      → Business tax
/taxes/:id/pay                       → Tax payment

/grants                              → Grant opportunities
/grants/apply/:id                    → Grant application
/grants/applications/:id             → Application status

/vendor                              → Vendor portal
/vendor/opportunities                → Bid opportunities
/vendor/contracts                    → Active contracts
/vendor/invoices                     → Invoice management

/parks                               → Parks & Recreation
/parks/programs                      → Program registration
/parks/facilities                    → Facility rentals
/parks/reservations                  → My reservations

/documents                           → Document vault
/documents/upload                    → Upload document
/documents/:id                       → Document detail

/account                             → Account settings
/account/profile                     → Profile management
/account/entities                    → Manage entities
/account/payment-methods             → Payment methods
/account/notifications               → Notification preferences
/account/security                    → Security settings
/account/delegates                   → Authorized users

/help                                → Help & support
/help/faq                            → FAQ
/help/contact                        → Contact support

/search                              → Search results
```

---

## 12 Synthetic Personas

| Persona | Entity Type | Primary Use Cases |
|---------|-------------|-------------------|
| Maria (Renter) | Household | Utility bills, parking permits |
| James (Homeowner) | Household | Property tax, building permits, utilities |
| Chen Family | Household | Multi-member, utilities, parks programs |
| Sarah (Small Biz) | Business | Business license, taxes, permits |
| TechCorp Inc | Business | Multiple permits, vendor registration |
| Community Kitchen | Nonprofit | Grants, permits, tax exemption |
| Lincoln Elementary | School | Facility use, permits, programs |
| BuildRight LLC | Vendor | Bids, contracts, invoices |
| Property Manager | Multi-Entity | Multiple properties, bulk payments |
| City Employee | Internal | Process applications, support |
| Senior Resident | Household | Accessibility, assistance programs |
| New Resident | Household | Onboarding, registration |

---

## Next Steps

1. ✅ Architecture documentation
2. → Database schema implementation
3. → Core service scaffolding
4. → Identity & Auth components
5. → Dashboard implementation
6. → Payment engine
7. → Domain services
8. → Integration layer

---

*Document Version: 1.0*
*Last Updated: December 2025*

