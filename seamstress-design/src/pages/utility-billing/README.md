# Account Number Format Page

## Overview

The Account Number Format page allows Utility Billing supervisors to configure the format for three types of identifiers:
- **Service Address Numbers** (up to 20 characters, 1-3 segments)
- **Account Numbers** (up to 25 characters, 1-4 segments)
- **Customer Numbers** (up to 20 characters, 1-3 segments)

## Features

### Format Configuration
Each format section includes:
- **Character Limit**: Maximum total characters for the complete number
- **Delimiter**: Separator between segments (None, Dash, or Period)
- **Segments**: Dynamic configuration of 1-4 segments (varies by format type)
- **Live Preview**: Real-time preview of the formatted number
- **Character Counter**: Tracks used characters vs. limit

### Segment Configuration
Each segment includes:
- **Segment Name**: Descriptive name (max 25 characters)
- **Segment Code**: Short code identifier (max 4 characters)
- **Segment Type**: Selection from available options (varies by format)
- **Conditional Fields**: Additional fields based on selected type

### Segment Types

#### Service Address Number
- **Billing Cycle**: Uses existing billing cycle codes
- **Route**: Uses existing route identifiers
- **Value List**: Custom list of values with configurable character limit (max 10)
- **New Sequential ID**: Auto-generated sequential number with configurable character limit (max 10)

#### Account Number
All Service Address options plus:
- **Service Address Number**: References the configured service address format
- **Resident Number**: Sequential number for multiple accounts at one address (max 4 characters)

#### Customer Number
Same options as Service Address Number, with Sequential ID supporting up to 20 characters.

## User Story

**As a UB supervisor**
I want to format my account numbers
So that service lookup is efficient and creating new accounts is automated.

## Business Value

- **Unique Identifiers**: Ensures consistency across billing cycles and routes
- **Data Validation**: Makes it easier to validate incoming data
- **Integration**: Simplifies integration with 3rd party vendors and external agencies
- **Automation**: Automates account number generation when creating new accounts

## Technical Implementation

### Component Structure
```
AccountNumberFormatPage.tsx
├── SegmentEditor<T>          # Reusable segment configuration component
├── FormatSection<T>           # Section for each format type
└── Main Page Component        # Orchestrates three format sections
```

### Type System
- Strongly typed with TypeScript
- Generic components support different segment types
- Type-safe validation prevents invalid configurations

### State Management
- Three independent format configurations
- Change tracking for unsaved changes warning
- Real-time preview generation
- Validation on save

### Validation Rules
1. All segments must have a name and code
2. Character limits must be within allowed ranges
3. Segment types cannot be reused within same format
4. Required character limits for specific segment types
5. Total character usage cannot exceed format limit

## Navigation

### Access Points
1. **Administration Menu** → Configuration → Account Number Format
2. **Settings Tray** → Account Number Format
3. **Direct URL**: `/billing/settings/account-number-format`

### Breadcrumbs
Settings → Account Number Format

## UI Components

### Technologies Used
- **React**: Component framework
- **TypeScript**: Type safety
- **Material-UI**: UI components
- **@opengov/components-page-header**: Page header
- **React Router**: Navigation

### Follows OpenGov Patterns
- ✅ PageHeaderComposable at top
- ✅ Theme tokens (no hardcoded values)
- ✅ Loading, error, and success states
- ✅ Proper import order (React → OpenGov → MUI → Local)
- ✅ Entity-scoped routing
- ✅ isDirty tracking with unsaved changes warning

## Future Enhancements

Per the Integration Requirements document, the following integrations are planned:

### Adding a New Customer
- Update Customer Number mask field to match configured format
- Show segment selection dropdowns
- Add "Generate Next Number" button for sequential segments

### Adding a New Account
- Update Account Number mask field to match configured format
- Show segment selection dropdowns
- Add "Generate Next Number" button for sequential segments

### Adding a New Service Address
- Update Service Number mask field to match configured format
- Show segment selection dropdowns
- Add "Generate Next Number" button for sequential segments

## Example Configuration

### Service Address Number
```
Configuration:
- Character Limit: 20
- Delimiter: Dash (-)
- Segments:
  1. Route (RT) - Type: Route
  2. Sequential ID (ID) - Type: Sequential ID (6 chars)

Preview: R01-000123
```

### Account Number
```
Configuration:
- Character Limit: 25
- Delimiter: Dash (-)
- Segments:
  1. Service Address (SA) - Type: Service Address Number
  2. Resident Number (RN) - Type: Resident Number (2 chars)

Preview: R01-000123-01
```

### Customer Number
```
Configuration:
- Character Limit: 20
- Delimiter: Period (.)
- Segments:
  1. Billing Cycle (BC) - Type: Billing Cycle
  2. Sequential ID (ID) - Type: Sequential ID (6 chars)

Preview: BC.000456
```

## Testing

To test the page:
1. Navigate to `/billing/settings/account-number-format`
2. Configure each format section
3. Verify live preview updates
4. Verify character counter tracks usage
5. Test segment type restrictions (no duplicates)
6. Test validation on save
7. Test unsaved changes warning on cancel

## Related Files

- **Component**: `/src/pages/utility-billing/AccountNumberFormatPage.tsx`
- **Routes**: `/src/App.tsx`
- **Navigation Config**: `/src/config/utilityBillingNavConfig.ts`
- **Layout**: `/src/components/UtilityBillingLayout.tsx`
- **Page Styles**: `/src/theme/pageStyles.ts`

## Design Reference

Figma Design: https://www.figma.com/design/xxGn6b8qSBLOOjlnxmwrAA/Account-Format?node-id=3-63435

## Status

✅ **Complete**
- Three format sections implemented
- All segment types supported
- Live preview generation
- Validation and error handling
- Navigation integrated
- Follows all OpenGov/Seamstress patterns

🔄 **Future Work**
- Integration with account/customer/service address creation forms
- Generate next number API integration
- Validation against existing numbers
- Import/export configuration
