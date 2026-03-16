/**
 * CDS-Assist: Unit-level validation helpers for Figma designs.
 *
 * Pure functions for matching node names to DS components and
 * suggesting token replacements. No Figma API dependency.
 */

// ---------------------------------------------------------------------------
// Component name matching
// ---------------------------------------------------------------------------

/**
 * Check if a node name looks like a DS component that should be an instance.
 * Returns the matched DS component name, or null.
 */
export function matchDSComponentName(
  nodeName: string,
  dsComponentNames: string[]
): string | null {
  const lower = nodeName.toLowerCase().trim();
  for (const dsName of dsComponentNames) {
    const dsLower = dsName.toLowerCase();
    if (lower === dsLower) return dsName;
    if (lower.startsWith(dsLower + '/')) return dsName;
    if (lower.startsWith(dsLower + ' ')) return dsName;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Hex color matching
// ---------------------------------------------------------------------------

const CDS_HEX_MAP: Record<string, string> = {
  '#4b3fff': 'primary/main',
  '#eef1fc': 'primary/light',
  '#19009b': 'primary/dark',
  '#546574': 'secondary/main',
  '#e9ecef': 'secondary/light',
  '#2d3748': 'secondary/dark',
  '#d32f2f': 'error/main',
  '#ef5350': 'error/light',
  '#b71c1c': 'error/dark',
  '#ed6c02': 'warning/main',
  '#ff9800': 'warning/light',
  '#e65100': 'warning/dark',
  '#2e7d32': 'success/main',
  '#4caf50': 'success/light',
  '#1b5e20': 'success/dark',
  '#0288d1': 'info/main',
  '#03a9f4': 'info/light',
  '#01579b': 'info/dark',
  '#fafafa': 'background/default',
  '#ffffff': 'background/paper',
  '#f2f2f2': 'background/tertiary',
  '#212121': 'grey/900',
  '#e0e0e0': 'grey/300',
  '#bdbdbd': 'grey/400',
  '#9e9e9e': 'grey/500',
  '#757575': 'grey/600',
};

/**
 * Suggest the nearest CDS token name for a given hex color.
 * Returns null if no close match found (distance > threshold).
 */
export function suggestTokenForHex(
  hex: string,
  threshold = 50
): { tokenName: string; exact: boolean } | null {
  const lower = hex.toLowerCase();

  if (CDS_HEX_MAP[lower]) {
    return { tokenName: CDS_HEX_MAP[lower], exact: true };
  }

  const inputRgb = hexToRgb(lower);
  if (!inputRgb) return null;

  let best: { tokenName: string; dist: number } | null = null;

  for (const [h, name] of Object.entries(CDS_HEX_MAP)) {
    const rgb = hexToRgb(h);
    if (!rgb) continue;
    const dist = Math.sqrt(
      (inputRgb.r - rgb.r) ** 2 +
      (inputRgb.g - rgb.g) ** 2 +
      (inputRgb.b - rgb.b) ** 2
    );
    if (!best || dist < best.dist) {
      best = { tokenName: name, dist };
    }
  }

  if (best && best.dist <= threshold) {
    return { tokenName: best.tokenName, exact: false };
  }

  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}
