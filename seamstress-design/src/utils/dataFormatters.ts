export const dataFormatters = {
  currency: (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0.00';

    const isNegative = num < 0;
    const absValue = Math.abs(num);

    if (absValue >= 1000000000) {
      return `${isNegative ? '-' : ''}$${(absValue / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      return `${isNegative ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${isNegative ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    }
  },

  currencyFull: (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  },

  percentage: (value: number, decimals: number = 1): string => {
    if (isNaN(value)) return '0%';
    return `${value.toFixed(decimals)}%`;
  },

  percentageChange: (oldValue: number, newValue: number): string => {
    if (oldValue === 0) return newValue > 0 ? '+∞%' : '0%';
    const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
    const formatted = Math.abs(change).toFixed(1);
    if (change > 0) return `+${formatted}%`;
    if (change < 0) return `-${formatted}%`;
    return '0%';
  },

  number: (value: number, decimals: number = 0): string => {
    if (isNaN(value)) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  variance: (actual: number, budget: number): {
    amount: string;
    percentage: string;
    status: 'over' | 'under' | 'on-target';
    indicator: string;
  } => {
    const diff = actual - budget;
    const percentDiff = budget !== 0 ? (diff / Math.abs(budget)) * 100 : 0;

    let status: 'over' | 'under' | 'on-target';
    let indicator: string;

    if (Math.abs(percentDiff) < 1) {
      status = 'on-target';
      indicator = '🟢';
    } else if (diff > 0) {
      status = 'over';
      indicator = percentDiff > 10 ? '🔴' : '🟡';
    } else {
      status = 'under';
      indicator = '🟢';
    }

    return {
      amount: dataFormatters.currencyFull(diff),
      percentage: dataFormatters.percentageChange(budget, actual),
      status,
      indicator,
    };
  },

  fiscalPeriod: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const month = d.getMonth();
    const year = d.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} FY${year}`;
  },

  shortDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  },

  trend: (current: number, previous: number): {
    direction: 'up' | 'down' | 'stable';
    arrow: string;
    color: string;
  } => {
    const threshold = 0.01; // 1% threshold for stability
    const change = previous !== 0 ? (current - previous) / Math.abs(previous) : 0;

    if (Math.abs(change) < threshold) {
      return { direction: 'stable', arrow: '→', color: '#616161' };
    } else if (change > 0) {
      return { direction: 'up', arrow: '↑', color: '#2e7d32' };
    } else {
      return { direction: 'down', arrow: '↓', color: '#d32f2f' };
    }
  },

  riskLevel: (variance: number, threshold: number = 10): {
    level: 'low' | 'medium' | 'high' | 'critical';
    color: string;
    indicator: string;
  } => {
    const absVariance = Math.abs(variance);

    if (absVariance < threshold * 0.5) {
      return { level: 'low', color: '#2e7d32', indicator: '🟢' };
    } else if (absVariance < threshold) {
      return { level: 'medium', color: '#ed6c02', indicator: '🟡' };
    } else if (absVariance < threshold * 2) {
      return { level: 'high', color: '#d32f2f', indicator: '🔴' };
    } else {
      return { level: 'critical', color: '#d32f2f', indicator: '🚨' };
    }
  },

  tableRow: (data: Record<string, string | number | boolean>, highlight: boolean = false): string => {
    const values = Object.values(data).map(v => {
      if (typeof v === 'number') {
        return v < 0 ? dataFormatters.currencyFull(v) : dataFormatters.currency(v);
      }
      return String(v);
    });

    const separator = ' | ';
    const row = values.join(separator);
    return highlight ? `**${row}**` : row;
  },

  burnRate: (spent: number, budget: number, periodsElapsed: number, totalPeriods: number): {
    rate: number;
    status: 'under' | 'on-track' | 'over';
    projection: number;
    message: string;
  } => {
    const expectedSpend = (budget * periodsElapsed) / totalPeriods;
    const rate = (spent / expectedSpend) * 100;
    const projection = (spent / periodsElapsed) * totalPeriods;

    let status: 'under' | 'on-track' | 'over';
    let message: string;

    if (rate < 95) {
      status = 'under';
      message = `Underspending by ${dataFormatters.percentage(100 - rate)}`;
    } else if (rate <= 105) {
      status = 'on-track';
      message = 'Spending on track with budget';
    } else {
      status = 'over';
      message = `Overspending by ${dataFormatters.percentage(rate - 100)}`;
    }

    return {
      rate: rate / 100,
      status,
      projection,
      message,
    };
  },

  fundType: (code: string): string => {
    const fundTypes: Record<string, string> = {
      'GF': 'General Fund',
      'SF': 'Special Revenue Fund',
      'DSF': 'Debt Service Fund',
      'CPF': 'Capital Project Fund',
      'EF': 'Enterprise Fund',
      'ISF': 'Internal Service Fund',
      'PTF': 'Pension Trust Fund',
      'PF': 'Permanent Fund',
    };
    return fundTypes[code] || code;
  },

  department: (code: string): string => {
    // This would typically come from a configuration or API
    const departments: Record<string, string> = {
      'PW': 'Public Works',
      'PS': 'Public Safety',
      'PR': 'Parks & Recreation',
      'IT': 'Information Technology',
      'HR': 'Human Resources',
      'FIN': 'Finance',
      'ADMIN': 'Administration',
      'LIB': 'Library',
      'CD': 'Community Development',
    };
    return departments[code] || code;
  },

  exportFileName: (type: string, date: Date = new Date()): string => {
    const timestamp = date.toISOString().split('T')[0];
    const sanitizedType = type.replace(/\s+/g, '_').toLowerCase();
    return `${sanitizedType}_${timestamp}.xlsx`;
  },
};

export const generateTableMarkdown = (
  headers: string[],
  rows: (string | number | boolean)[][],
  alignments?: ('left' | 'center' | 'right')[]
): string => {
  const alignmentMap = {
    left: ':---',
    center: ':---:',
    right: '---:',
  };

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `|${headers.map((_, i) =>
    ` ${alignmentMap[alignments?.[i] || 'left']} `
  ).join('|')}|`;

  const dataRows = rows.map(row =>
    `| ${row.map((cell, i) => {
      if (typeof cell === 'number' && headers[i].toLowerCase().includes('amount')) {
        return dataFormatters.currency(cell);
      }
      return String(cell);
    }).join(' | ')} |`
  ).join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
};

export const generateChartData = (
  labels: string[],
  datasets: { label: string; data: number[]; color?: string }[]
): string => {
  // This would generate chart configuration for visualization components
  // For now, return a text representation
  const maxValue = Math.max(...datasets.flatMap(d => d.data));
  const scale = 50 / maxValue;

  let chart = '```\n';
  datasets.forEach(dataset => {
    chart += `${dataset.label}:\n`;
    labels.forEach((label, i) => {
      const barLength = Math.round(dataset.data[i] * scale);
      const bar = '█'.repeat(barLength);
      chart += `  ${label.padEnd(15)} ${bar} ${dataFormatters.currency(dataset.data[i])}\n`;
    });
    chart += '\n';
  });
  chart += '```';

  return chart;
};