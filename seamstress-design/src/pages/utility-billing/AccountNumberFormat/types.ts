// ============================================================================
// CONSTANTS
// ============================================================================

export const FIELD_CONSTRAINTS = {
  SEGMENT_NAME_MAX: 25,
  SEGMENT_CODE_MAX: 4,
  SERVICE_ADDRESS_CHAR_LIMIT: 20,
  ACCOUNT_CHAR_LIMIT: 25,
  CUSTOMER_CHAR_LIMIT: 20,
  VALUE_LIST_CHAR_LIMIT: 10,
  SEQUENTIAL_ID_CHAR_LIMIT: 10,
  SEQUENTIAL_ID_CUSTOMER_CHAR_LIMIT: 20,
  RESIDENT_NUMBER_CHAR_LIMIT: 4,
  MAX_SERVICE_ADDRESS_SEGMENTS: 3,
  MAX_ACCOUNT_SEGMENTS: 4,
  MAX_CUSTOMER_SEGMENTS: 3,
} as const;

export const TYPOGRAPHY_SIZES = {
  LABEL: '0.875rem',
  DESCRIPTION: '0.75rem',
  HEADER: '1.25rem',
  CAPTION: '0.75rem',
  BUTTON: '0.8125rem',
} as const;

// Reusable input field styles
export const inputFieldStyles = {
  '& .MuiInputBase-root': {
    fontSize: TYPOGRAPHY_SIZES.LABEL,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: '2px',
    },
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px',
    },
  },
};

// Reusable select field styles
export const selectFieldStyles = {
  fontSize: TYPOGRAPHY_SIZES.LABEL,
  borderRadius: '4px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
    borderWidth: '2px',
  },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
  },
};

// Segment type descriptions for tooltips
export const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  billing_cycle: 'This segment will display the billing cycle associated with the account',
  route: 'This segment will display the route number associated with the account',
  value_list: 'This segment will display a value from your predefined list',
  sequential_id: 'This segment will display a sequential identifier',
  service_address: 'This segment will display the service address number',
  resident_number: 'This segment will display the resident number',
};

// ============================================================================
// TYPES
// ============================================================================

export type DelimiterType = 'none' | 'dash' | 'period';

export type ServiceAddressSegmentType = 'billing_cycle' | 'route' | 'value_list' | 'sequential_id';
export type AccountSegmentType = ServiceAddressSegmentType | 'service_address' | 'resident_number';
export type CustomerSegmentType = ServiceAddressSegmentType;

export interface ValueListItem {
  name: string;
  code: string;
}

export interface BaseSegment {
  id: string;
  name: string;
  code: string;
  type: string;
  characterLimit?: number;
  valueList?: ValueListItem[];
}

export interface ServiceAddressSegment extends BaseSegment {
  type: ServiceAddressSegmentType;
}

export interface AccountSegment extends BaseSegment {
  type: AccountSegmentType;
}

export interface CustomerSegment extends BaseSegment {
  type: CustomerSegmentType;
}

export interface FormatConfig<T extends BaseSegment> {
  characterLimit: number;
  delimiter: DelimiterType;
  segments: T[];
}

// TabPanel Props
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
