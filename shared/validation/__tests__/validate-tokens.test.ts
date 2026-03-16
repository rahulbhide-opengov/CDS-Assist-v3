import { describe, it, expect } from 'vitest';
import { validateNoHardcodedColors, validateNoHardcodedSpacing } from '../validate-tokens';

describe('validateNoHardcodedColors', () => {
  it('detects hardcoded hex colors not in CDS palette', () => {
    const code = 'color: "#3b82f6"';
    const results = validateNoHardcodedColors(code);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].severity).toBe('error');
  });

  it('allows CDS palette colors', () => {
    const code = 'color: "#4b3fff"';
    const results = validateNoHardcodedColors(code);
    expect(results.length).toBe(0);
  });

  it('allows CDS semantic colors', () => {
    const code = 'color: "#d32f2f"';
    const results = validateNoHardcodedColors(code);
    expect(results.length).toBe(0);
  });

  it('allows CDS background colors', () => {
    const code = 'color: "#fafafa"';
    const results = validateNoHardcodedColors(code);
    expect(results.length).toBe(0);
  });

  it('detects forbidden blue primary', () => {
    const code = 'color: "#3b82f6"';
    const results = validateNoHardcodedColors(code);
    expect(results.some(r => r.message.includes('#3b82f6'))).toBe(true);
  });
});

describe('validateNoHardcodedSpacing', () => {
  it('detects non-CDS spacing values', () => {
    const code = 'padding: "13px"';
    const results = validateNoHardcodedSpacing(code);
    expect(results.length).toBeGreaterThan(0);
  });

  it('allows CDS spacing values', () => {
    const code = 'padding: "16px"';
    const results = validateNoHardcodedSpacing(code);
    expect(results.length).toBe(0);
  });
});
