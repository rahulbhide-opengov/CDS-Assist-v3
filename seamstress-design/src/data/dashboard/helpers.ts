/**
 * Mock Data Generation Helpers
 */

import type { TimeSeriesDataPoint } from './types';

export function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString());
  }
  return dates;
}

export function generateTimeSeriesData(days: number, baseValue: number, variance: number): TimeSeriesDataPoint[] {
  const dates = generateDateRange(days);
  return dates.map(timestamp => ({
    timestamp,
    value: Math.max(0, Math.floor(baseValue + (Math.random() - 0.5) * variance))
  }));
}

export function randomPastDate(maxDaysAgo: number): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}
