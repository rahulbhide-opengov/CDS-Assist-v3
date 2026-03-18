# Procurement Module

This module contains the Procurement application pages built following OpenGov and Seamstress patterns.

## Pages

### ProcurementProjectDetailPage

**Route:** `/procurement/projects/:project_title`

**Example:** `/procurement/projects/agricultural-supplies`

A comprehensive procurement project detail page showcasing:

#### Features

1. **Page Header**
   - Project title with status badge (OPEN/CLOSED/PENDING/CANCELLED)
   - Status history link
   - Follow/Following button with follower count
   - Reports action button
   - Project metadata (Template, Department)

2. **Workflow Stages**
   - Collapsible stage cards with status indicators
   - Three states: Complete, In Progress, Pending
   - Visual icons for each stage (CheckCircle for complete, Star for in-progress)

3. **Workflow Subsections**
   - Builder subsection (completed)
   - Sourcing subsection (in progress with badge)
   - 8 action cards in responsive grid:
     - Edit Post (pencil icon)
     - View Post (flag icon)
     - Addenda & Notices (link icon)
     - Question & Answer (send icon)
     - RSVP Manager (calendar icon)
     - Submitted Responses (inbox icon)
     - Vendor Analytics (chart icon)

4. **Sidebar Actions**
   - **Next Action Card**: Share Project (green button with external link icon)
   - **Other Actions Card**: 6 additional actions
     - Invite Collaborators
     - Discover Vendors
     - Invite Vendors
     - Public Display Options
     - Retract Post
     - Create Associated Project

5. **Floating Chat Button**
   - Fixed position bottom-right
   - Blue background with chat icon

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Page Header (Title, Status, Actions)               │
├─────────────────────────────────────┬───────────────┤
│ Main Content (Workflow Stages)      │ Sidebar       │
│                                      │ - Next Action │
│ ┌─────────────────────────────┐    │ - Actions     │
│ │ Project Request (Complete)  │    │               │
│ └─────────────────────────────┘    │               │
│                                      │               │
│ ┌─────────────────────────────┐    │               │
│ │ Solicitation (In Progress)  │    │               │
│ │ ├─ Builder (Complete)        │    │               │
│ │ └─ Sourcing (In Progress)   │    │               │
│ │    └─ [Action Cards Grid]   │    │               │
│ └─────────────────────────────┘    │               │
└─────────────────────────────────────┴───────────────┘
                                           [Chat 💬]
```

#### Components Used

- **@opengov/components-page-header** - PageHeaderComposable
- **@mui/material** - Box, Typography, Button, Stack, Paper, Chip, Grid, Card, etc.
- **@mui/icons-material** - Various action icons

#### Design Patterns

1. **Seamstress Principles**
   - PageHeaderComposable at top
   - Theme tokens for all styling (no hardcoded colors)
   - Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
   - Proper spacing with 8px grid system

2. **State Management**
   - Loading state with CircularProgress
   - Error state with Alert
   - Collapsible sections with expand/collapse icons
   - Follow/Unfollow toggle state

3. **OpenGov Patterns**
   - Status badges with color coding
   - Action cards with hover effects
   - Sidebar layout for contextual actions
   - Floating action button for quick access

## Layout

**ProcurementLayout** (in `/src/components/ProcurementLayout.tsx`)

- Full navbar with app name "Procurement"
- Navigation items: Requests, Projects, Contracts, Vendors, Dashboards, Analytics, Insights
- Search functionality with type filters
- Theme switcher
- OG Assist integration
- Utility tray with notifications, settings, help

## Configuration

**procurementNavBarConfig.ts** (in `/src/config/`)

Contains navbar configuration including:
- Menu options
- Utility tray options
- Notification badges
- Help and settings menus
- Profile settings

## Routing

Routes are defined in `/src/App.tsx`:

```tsx
/procurement/*
  /projects/:project_title  → ProcurementProjectDetailPage
  /projects                 → Projects List (Coming Soon)
  /requests                 → Requests (Coming Soon)
  /contracts                → Contracts (Coming Soon)
  /vendors                  → Vendors (Coming Soon)
  /dashboards               → Dashboards (Coming Soon)
  /analytics                → Analytics (Coming Soon)
  /insights                 → Insights (Coming Soon)
```

## Mock Data

The page currently uses mock data for demonstration:

```typescript
{
  title: 'AGRICULTURAL SUPPLIES',
  status: 'open',
  template: 'BID',
  department: 'Parks Department, Buildings & Grounds',
  followers: 2,
  workflow: [/* stages */]
}
```

## Usage

Navigate to: `http://localhost:5173/procurement/projects/agricultural-supplies`

Or access via the Prototypes index: `http://localhost:5173/prototypes`

## Future Enhancements

1. **Projects List Page** - DataGrid with search/filters
2. **API Integration** - Replace mock data with real API calls
3. **Form Pages** - Create/Edit project forms
4. **Vendor Management** - Vendor discovery and invitation flows
5. **Document Upload** - File attachments for addenda
6. **Q&A System** - Real-time question and answer functionality
7. **Analytics Dashboard** - Vendor response analytics
8. **Notifications** - Real-time updates for project changes
