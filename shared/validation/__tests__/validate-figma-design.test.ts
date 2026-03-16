/**
 * Tests for Figma design validation helpers.
 */

import { describe, it, expect } from 'vitest';
import { matchDSComponentName, suggestTokenForHex } from '../validate-figma-design';

describe('matchDSComponentName', () => {
  const dsNames = ['button', 'textfield', 'card', 'chip', 'avatar', 'dialog'];

  it('matches exact name (case-insensitive)', () => {
    expect(matchDSComponentName('Button', dsNames)).toBe('button');
    expect(matchDSComponentName('CARD', dsNames)).toBe('card');
    expect(matchDSComponentName('chip', dsNames)).toBe('chip');
  });

  it('matches name with variant suffix (slash)', () => {
    expect(matchDSComponentName('Button/Primary', dsNames)).toBe('button');
    expect(matchDSComponentName('Card/Elevated', dsNames)).toBe('card');
  });

  it('matches name with space suffix', () => {
    expect(matchDSComponentName('Button Primary', dsNames)).toBe('button');
  });

  it('returns null for non-matching names', () => {
    expect(matchDSComponentName('PageHeader', dsNames)).toBeNull();
    expect(matchDSComponentName('CustomFrame', dsNames)).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(matchDSComponentName('', dsNames)).toBeNull();
  });
});

describe('suggestTokenForHex', () => {
  it('finds exact CDS primary color', () => {
    const result = suggestTokenForHex('#4b3fff');
    expect(result).toEqual({ tokenName: 'primary/main', exact: true });
  });

  it('finds exact CDS error color', () => {
    const result = suggestTokenForHex('#d32f2f');
    expect(result).toEqual({ tokenName: 'error/main', exact: true });
  });

  it('is case-insensitive', () => {
    const result = suggestTokenForHex('#4B3FFF');
    expect(result).toEqual({ tokenName: 'primary/main', exact: true });
  });

  it('finds nearest token for close-enough color', () => {
    const result = suggestTokenForHex('#4a3efe');
    expect(result).not.toBeNull();
    expect(result!.tokenName).toBe('primary/main');
    expect(result!.exact).toBe(false);
  });

  it('returns null for color far from any CDS token', () => {
    const result = suggestTokenForHex('#ff00ff', 30);
    expect(result).toBeNull();
  });

  it('handles background colors', () => {
    expect(suggestTokenForHex('#fafafa')).toEqual({ tokenName: 'background/default', exact: true });
    expect(suggestTokenForHex('#ffffff')).toEqual({ tokenName: 'background/paper', exact: true });
  });

  it('handles grey scale', () => {
    expect(suggestTokenForHex('#212121')).toEqual({ tokenName: 'grey/900', exact: true });
    expect(suggestTokenForHex('#e0e0e0')).toEqual({ tokenName: 'grey/300', exact: true });
  });
});
