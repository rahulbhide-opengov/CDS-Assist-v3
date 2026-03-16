# OpenGov Enterprise Asset Management (EAM) — Product Reference

Read this file when designing screens for asset management, work orders, inspections, GIS/map views, scenario planning, requests/311, or field worker experiences.

**Trigger keywords:** EAM, asset management, enterprise asset management, Cartegraph, work order, task, inspection, GIS, map, Esri, ArcGIS, scenario builder, field, maintenance, SeeClickFix, 311

---

## Product Identity

**Current name**: Enterprise Asset Management (EAM)
**Legacy names**: Cartegraph Asset Management, Cartegraph Asset Management Classic, Cartegraph One

When asked about "Cartegraph" — answer using Enterprise Asset Management and note the rename.

Cloud-only, mobile-first asset and operations management for government teams: field workers, supervisors, asset managers, and administrators.

## Core Capabilities

### Assets
- Create, edit, locate, and relate assets (point, line, polygon)
- Container/component relationships, linked assets
- Asset detail views, attachments, inspections, map-based editing

### Work Management
- **Tasks**: asset or non-asset tasks, assignment to laborers or crews, field completion
- **Work Orders**: group tasks, repeating schedules, cost/resource tracking
- Three distinct record types: Requests → Tasks → Work Orders

### Requests & 311
- Native requests in EAM + external integrations (SeeClickFix, Salesforce 311, Daupler)
- SeeClickFix is the primary citizen engagement layer — synchronizes requests bidirectionally
- Request details + photos flow in, completion comments route back to requester

### Resources
- Labor, equipment, materials tracking
- Resource entry is part of work completion (cost accuracy, planning, reporting)
- Material planning and material locations

### Inspections
- PCI inspections, advanced inspection models
- Inspection history informs condition, replacement timing, planning

### Maps & GIS
**GIS is first-class, not peripheral.** Deep ArcGIS integration:
- Map-based viewing, editing, layer management, symbology
- Offline maps with preparation/upload
- Bi-directional Esri synchronization (display + edit + sync + data association)
- Utility/geometric network cases have special geometry-edit restrictions

### Reporting & Dashboards
- Reports, dashboard gadgets, exports, analytics
- Report creation point determines where it's available (detail view, list view, reports page)

### Scenario Builder & Capital Planning
- Forecast-driven planning, prioritization, conversion to real projects/work orders
- Cross-Asset Scenarios: multi-asset planning in shared workspace
- Runtime scales with asset count, plan years, and missing performance curves — don't promise instant results

### AI Agent
- Built-in conversational assistant — plain-language questions, answers, visualizations, recommendations
- Links explanations back to original records
- Describe as conversational query + insight + recommendation, not arbitrary external knowledge

## Current vs Legacy Experience

| Experience | Description |
|-----------|-------------|
| **New UI** (Enterprise Asset Management) | Modern, cross-device, mobile-first, cloud-only |
| **Classic UI** | Legacy web-only, still used for some admin. Links from New UI open Classic in new tab. Expected discontinued 2026. |
| **Cartegraph One** | Older mobile/web app branding — capabilities overlap with modern mobile workflow |

**Rules**:
- Don't assume every Classic feature is fully native in New UI yet
- Don't assume tablet/browser support for Classic-linked admin pages on smaller devices
- Some Resources/Scenarios/Administration links are not available on phones or tablets
- New features are added only to the New UI

## GIS Integration Model

- ArcGIS integration architecture: web server, app server, database server, ArcGIS Server, ArcMap/Pro
- Requests use two-way integration with Esri point features
- Asset associations synchronize attachments, poll GIS for changes, map geodatabase attributes
- **One-way vs two-way sync are explicitly different** — don't conflate them

## Mobile & Offline

- Intentionally field-centric
- Supports: mobile asset collection, task completion, attachments, barcode scanning, map use, offline workflows
- **Offline is not magical**: requires offline map setup, layer selection, record-volume management
- Too many records → reduce layers or map extent
- Barcode support is broad but not every format on every platform

## Adjacent Products (NOT interchangeable with core EAM)

| Product | What it is |
|---------|-----------|
| **Facility Management Solutions (FMS)** | Separate facility/space/property management — sites, buildings, floors, spaces, FICM classification, indirect cost recovery |
| **SEMS** | Separate water/wastewater compliance — sampling, cross-connection control, backflow, eDMR, drinking water/wastewater modules |
| **SeeClickFix** | Citizen engagement/request management — not a replacement for full asset and work management |
| **Adoption Toolkit** | In-app guidance and analytics layer — guides, segmentation, adoption tracking |

## Design Rules

- Treat GIS as both visualization AND system-of-record synchronization — not a simple basemap add-on
- Don't collapse requests, tasks, and work orders into one concept
- Requests are intake → Tasks are executable work → Work Orders group work
- Offline design: mention map setup requirements, layer selection, record-volume constraints
- Scenario Builder is strategic planning, not just reporting — avoid claiming instant results at all scales
- Don't mix FMS or SEMS answers with generic EAM assumptions
- Fleet: some competitors are stronger in deep fleet — avoid overclaiming

## Design Strengths

- Purpose-built for government/public sector
- Deep bi-directional Esri GIS integration (major differentiator)
- Mobile and offline field workflows
- Scenario Builder / capital planning
- Broad infrastructure domain support (facilities, parks, signals, stormwater, transportation, wastewater)
- AI Agent for conversational query + insight

## Design Critique Points

- Report creation point determines visibility — confusing for users ("my report doesn't appear")
- Some Classic features not yet in New UI — creates uncertainty
- Admin pages may not work on phones/tablets
- Scenario runtime can be significant at scale (50K+ assets, 30-70 min)
- Data quality drives planning quality — surface this dependency
