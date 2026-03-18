/**
 * Number Format Generator
 * Generates account, customer, and service address numbers based on format configuration
 * Updated: 2026-01-12
 */

// Types matching AccountNumberFormatPageV2
type DelimiterType = 'none' | 'dash' | 'period';

interface BaseSegment {
  id: string;
  name: string;
  code: string;
  type: string;
  characterLimit?: number;
  valueList?: string[];
}

interface FormatConfig<T extends BaseSegment> {
  characterLimit: number;
  delimiter: DelimiterType;
  segments: T[];
}

// Simple counter state (in production this would be stored in database)
const counters = {
  serviceAddress: 123462,
  account: 1790,
  customer: 7,
};

/**
 * Generate a number based on format configuration
 */
function generateNumber<T extends BaseSegment>(
  config: FormatConfig<T>,
  overrides?: {
    billingCycle?: string;
    route?: string;
    serviceAddressNumber?: string;
  }
): string {
  const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';

  const segmentValues = config.segments
    .filter(s => s.type && s.code && s.name)
    .map((segment) => {
      // Billing Cycle
      if (segment.type === 'billing_cycle') {
        return overrides?.billingCycle || '1';
      }

      // Route
      if (segment.type === 'route') {
        return overrides?.route || '05';
      }

      // Service Address Number
      if (segment.type === 'service_address') {
        return overrides?.serviceAddressNumber || '12345678';
      }

      // Value List - use first value or code as fallback
      if (segment.type === 'value_list') {
        if (segment.valueList && segment.valueList.length > 0) {
          return segment.valueList[0];
        }
        return segment.code;
      }

      // Sequential ID
      if (segment.type === 'sequential_id') {
        const length = segment.characterLimit || 3;
        // Use code as a key to track different sequential counters
        const counterKey = `sequential_${segment.code}`;
        return '1'.padStart(length, '0');
      }

      // Resident Number
      if (segment.type === 'resident_number') {
        const length = segment.characterLimit || 2;
        return '1'.padStart(length, '0');
      }

      // Default to code
      return segment.code;
    });

  return segmentValues.join(delimiter);
}

/**
 * Get default service address format configuration
 */
export function getDefaultServiceAddressConfig(): FormatConfig<BaseSegment> {
  return {
    characterLimit: 20,
    delimiter: 'none',
    segments: [
      {
        id: 'sa_segment_1',
        name: 'Sequential ID',
        code: 'SA',
        type: 'sequential_id',
        characterLimit: 6,
      },
    ],
  };
}

/**
 * Get default account format configuration
 */
export function getDefaultAccountConfig(): FormatConfig<BaseSegment> {
  return {
    characterLimit: 25,
    delimiter: 'dash',
    segments: [
      {
        id: 'ac_segment_1',
        name: 'Billing Cycle',
        code: 'BC',
        type: 'billing_cycle',
      },
      {
        id: 'ac_segment_2',
        name: 'Service Address',
        code: 'SA',
        type: 'service_address',
      },
      {
        id: 'ac_segment_3',
        name: 'Resident',
        code: 'RES',
        type: 'resident_number',
        characterLimit: 1,
      },
    ],
  };
}

/**
 * Get default customer format configuration
 */
export function getDefaultCustomerConfig(): FormatConfig<BaseSegment> {
  return {
    characterLimit: 20,
    delimiter: 'dash',
    segments: [
      {
        id: 'cu_segment_1',
        name: 'Customer Type',
        code: 'CT',
        type: 'value_list',
        characterLimit: 2,
        valueList: ['14', '15', '16'],
      },
      {
        id: 'cu_segment_2',
        name: 'Year',
        code: 'YR',
        type: 'value_list',
        characterLimit: 4,
        valueList: ['0000'],
      },
      {
        id: 'cu_segment_3',
        name: 'Sequential ID',
        code: 'SEQ',
        type: 'sequential_id',
        characterLimit: 2,
      },
    ],
  };
}

/**
 * Generate a new service address number
 */
export function generateServiceAddressNumber(): string {
  const config = getDefaultServiceAddressConfig();
  const number = counters.serviceAddress++;

  // Override sequential ID with actual counter
  const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';
  const segment = config.segments[0];
  const length = segment.characterLimit || 6;

  return number.toString().padStart(length, '0');
}

/**
 * Generate a new account number
 */
export function generateAccountNumber(
  serviceAddressNumber: string,
  billingCycle?: string,
  residentNumber?: number
): string {
  const config = getDefaultAccountConfig();
  const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';

  const segments = [];

  for (const segment of config.segments) {
    if (segment.type === 'billing_cycle') {
      segments.push(billingCycle || '1');
    } else if (segment.type === 'service_address') {
      segments.push(serviceAddressNumber);
    } else if (segment.type === 'resident_number') {
      const length = segment.characterLimit || 1;
      const num = residentNumber !== undefined ? residentNumber : 1;
      segments.push(num.toString().padStart(length, '0'));
    } else {
      segments.push(segment.code);
    }
  }

  return segments.join(delimiter);
}

/**
 * Generate a new customer number
 */
export function generateCustomerNumber(customerType: 'individual' | 'business' = 'individual'): string {
  const config = getDefaultCustomerConfig();
  const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';

  const segments = [];
  const counter = counters.customer++;

  for (const segment of config.segments) {
    if (segment.type === 'value_list' && segment.valueList && segment.valueList.length > 0) {
      // For customer type, use first value (14 for individual, 15 for business)
      if (segment.name === 'Customer Type') {
        segments.push(customerType === 'individual' ? '14' : '15');
      } else {
        // For other value lists like year, use first value
        segments.push(segment.valueList[0]);
      }
    } else if (segment.type === 'sequential_id') {
      const length = segment.characterLimit || 2;
      segments.push(counter.toString().padStart(length, '0'));
    } else {
      segments.push(segment.code);
    }
  }

  return segments.join(delimiter);
}

/**
 * Format a number according to configuration (for display purposes)
 */
export function formatNumber(
  value: string,
  config: FormatConfig<BaseSegment>
): string {
  if (!value) return '';

  const delimiter = config.delimiter === 'dash' ? '-' : config.delimiter === 'period' ? '.' : '';

  // If already has delimiters, return as-is
  if (value.includes(delimiter)) return value;

  // Otherwise, try to add delimiters based on segment lengths
  let formatted = value;
  let position = 0;
  const parts: string[] = [];

  for (const segment of config.segments) {
    const length = segment.characterLimit || segment.code.length;
    const part = formatted.substring(position, position + length);
    if (part) {
      parts.push(part);
      position += length;
    }
  }

  return parts.join(delimiter);
}
