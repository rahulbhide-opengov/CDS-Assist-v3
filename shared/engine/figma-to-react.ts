/**
 * CDS-Assist: Figma → React Conversion Engine
 *
 * Reads Figma frame data and generates React/MUI component code
 * using CDS Design System tokens.
 */

/** Figma node representation (simplified from MCP get_design_context output) */
export interface FigmaNode {
  id: string;
  name: string;
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'ELLIPSE' | 'COMPONENT' | 'INSTANCE' | 'GROUP';
  width?: number;
  height?: number;
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  cornerRadius?: number;
  fills?: Array<{ type: string; color?: { r: number; g: number; b: number; a?: number } }>;
  strokes?: Array<{ type: string; color?: { r: number; g: number; b: number } }>;
  characters?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  children?: FigmaNode[];
  boundVariables?: Record<string, { id: string; name: string }>;
}

/** Generated React component output */
export interface ReactOutput {
  componentName: string;
  code: string;
  imports: string[];
  types: string;
}

// CDS color map for reverse-lookup (RGB → CDS token name)
const CDS_COLOR_MAP: Record<string, string> = {
  '75,63,255': 'primary.main',
  '238,241,252': 'primary.light',
  '25,0,155': 'primary.dark',
  '84,101,116': 'secondary.main',
  '233,236,239': 'secondary.light',
  '45,55,72': 'secondary.dark',
  '211,47,47': 'error.main',
  '237,108,2': 'warning.main',
  '46,125,50': 'success.main',
  '2,136,209': 'info.main',
  '250,250,250': 'background.default',
  '255,255,255': 'background.paper',
  '33,33,33': 'text.primary',
  '224,224,224': 'divider',
};

/** Convert RGB to nearest CDS token reference */
export function rgbToCDSToken(r: number, g: number, b: number): string {
  const r8 = Math.round(r * 255);
  const g8 = Math.round(g * 255);
  const b8 = Math.round(b * 255);
  const key = `${r8},${g8},${b8}`;

  if (CDS_COLOR_MAP[key]) return CDS_COLOR_MAP[key];

  // Find nearest CDS color by Euclidean distance
  let nearest = 'text.primary';
  let minDist = Infinity;
  for (const [rgb, token] of Object.entries(CDS_COLOR_MAP)) {
    const [cr, cg, cb] = rgb.split(',').map(Number);
    const dist = Math.sqrt((r8 - cr) ** 2 + (g8 - cg) ** 2 + (b8 - cb) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = token;
    }
  }
  return nearest;
}

/** Map Figma fontSize to CDS Typography variant */
export function fontSizeToCDSVariant(size: number, weight: number): string {
  if (size >= 48 && weight >= 600) return 'h1';
  if (size >= 32 && weight >= 600) return 'h2';
  if (size >= 24 && weight >= 600) return 'h3';
  if (size >= 20 && weight >= 600) return 'h4';
  if (size >= 16 && weight >= 600) return 'h5';
  if (size >= 14 && weight >= 600) return 'h6';
  if (size >= 16) return 'subtitle1';
  if (size >= 14 && weight >= 500) return 'subtitle2';
  if (size >= 14) return 'body1';
  if (size >= 12) return 'body2';
  return 'caption';
}

/** Map Figma cornerRadius to CDS token */
export function cornerRadiusToCDS(radius: number): string {
  if (radius === 0) return '0';
  if (radius <= 2) return '0.5'; // 2px = extraSmall
  if (radius <= 4) return '1'; // 4px = small (default)
  if (radius <= 8) return '2'; // 8px = medium
  if (radius <= 12) return '3'; // 12px = large
  if (radius >= 50) return "'50%'"; // circular
  return '1'; // default to CDS 4px
}

/** Map Figma spacing to CDS spacing factor */
export function spacingToCDS(px: number): number {
  return Math.round(px / 4); // CDS uses 4px base
}

/** Convert a single Figma node to React JSX */
export function nodeToJSX(node: FigmaNode, indent: number = 0): string {
  const pad = '  '.repeat(indent);

  if (node.type === 'TEXT') {
    const variant = fontSizeToCDSVariant(node.fontSize || 14, node.fontWeight || 400);
    const colorToken = node.fills?.[0]?.color
      ? rgbToCDSToken(node.fills[0].color.r, node.fills[0].color.g, node.fills[0].color.b)
      : 'text.primary';
    return `${pad}<Typography variant="${variant}" color="${colorToken}">${node.characters || ''}</Typography>`;
  }

  if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    const sxParts: string[] = [];

    if (node.layoutMode === 'HORIZONTAL') {
      sxParts.push("display: 'flex'", "flexDirection: 'row'");
    } else if (node.layoutMode === 'VERTICAL') {
      sxParts.push("display: 'flex'", "flexDirection: 'column'");
    }

    if (node.itemSpacing) sxParts.push(`gap: ${spacingToCDS(node.itemSpacing)}`);
    if (node.paddingTop) sxParts.push(`pt: ${spacingToCDS(node.paddingTop)}`);
    if (node.paddingRight) sxParts.push(`pr: ${spacingToCDS(node.paddingRight)}`);
    if (node.paddingBottom) sxParts.push(`pb: ${spacingToCDS(node.paddingBottom)}`);
    if (node.paddingLeft) sxParts.push(`pl: ${spacingToCDS(node.paddingLeft)}`);
    if (node.cornerRadius) sxParts.push(`borderRadius: ${cornerRadiusToCDS(node.cornerRadius)}`);

    if (node.fills?.[0]?.color) {
      const c = node.fills[0].color;
      sxParts.push(`bgcolor: '${rgbToCDSToken(c.r, c.g, c.b)}'`);
    }

    if (node.width) sxParts.push(`width: ${node.width}`);
    if (node.height) sxParts.push(`height: ${node.height}`);

    const sx = sxParts.length > 0 ? ` sx={{ ${sxParts.join(', ')} }}` : '';
    const children = node.children?.map(c => nodeToJSX(c, indent + 1)).join('\n') || '';

    return `${pad}<Box${sx}>\n${children}\n${pad}</Box>`;
  }

  return `${pad}{/* ${node.type}: ${node.name} */}`;
}

/** Generate a full React component from a Figma node tree */
export function generateReactComponent(rootNode: FigmaNode, componentName: string): ReactOutput {
  const jsx = nodeToJSX(rootNode, 2);

  const imports = [
    "import { Box, Typography } from '@mui/material';",
  ];

  const code = `${imports.join('\n')}

export function ${componentName}() {
  return (
${jsx}
  );
}

export default ${componentName};
`;

  return {
    componentName,
    code,
    imports,
    types: '',
  };
}
