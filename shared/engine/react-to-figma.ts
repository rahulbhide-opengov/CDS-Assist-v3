/**
 * CDS-Assist: React → Figma Conversion Engine
 *
 * Parses React component patterns and generates Figma CLI commands
 * using CDS design system tokens and variable bindings.
 */

/** Figma render command output */
export interface FigmaCommand {
  type: 'render' | 'ds-create' | 'ds-page' | 'eval' | 'render-batch';
  command: string;
  description: string;
}

/** CDS component mapping: React component → Figma ds create command */
const CDS_COMPONENT_MAP: Record<string, string> = {
  Button: 'button',
  TextField: 'textfield',
  Card: 'card',
  Dialog: 'dialog',
  Chip: 'chip',
  Tooltip: 'tooltip',
  Snackbar: 'snackbar',
  Accordion: 'accordion',
  Avatar: 'avatar',
  Switch: 'switch',
  Radio: 'radio',
  Select: 'select',
  Skeleton: 'skeleton',
  Stepper: 'stepper',
  Timeline: 'timeline',
  DataGrid: 'datatable',
  IconButton: 'iconbutton',
  ButtonGroup: 'buttongroup',
  DatePicker: 'datepicker',
  List: 'list',
  ToggleButton: 'togglebutton',
};

/** CDS page pattern mapping */
const CDS_PAGE_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  form: 'form',
  landing: 'landing',
  settings: 'settings',
};

/** Map a page pattern to Figma commands */
export function pagePatternToFigma(
  pattern: 'list' | 'form' | 'detail' | 'dashboard',
  options: {
    title?: string;
    device?: 'desktop' | 'tablet' | 'mobile';
    theme?: 'light' | 'dark';
  } = {}
): FigmaCommand[] {
  const commands: FigmaCommand[] = [];
  const device = options.device || 'desktop';
  const theme = options.theme || 'light';

  // Always ensure CDS setup first
  commands.push({
    type: 'ds-create',
    command: 'node src/index.js ds setup',
    description: 'Ensure CDS design system variables are pushed',
  });

  if (pattern === 'dashboard') {
    commands.push({
      type: 'ds-page',
      command: `node src/index.js ds page dashboard${device !== 'desktop' ? ' --' + device : ''}`,
      description: `Create CDS dashboard page (${device})`,
    });
  } else if (pattern === 'form') {
    commands.push({
      type: 'ds-page',
      command: `node src/index.js ds page form${device !== 'desktop' ? ' --' + device : ''}`,
      description: `Create CDS form page (${device})`,
    });
  } else if (pattern === 'list' || pattern === 'detail') {
    // Build custom layout with render
    const width = device === 'mobile' ? 390 : device === 'tablet' ? 768 : 1440;
    const title = options.title || (pattern === 'list' ? 'Items' : 'Item Detail');

    commands.push({
      type: 'render',
      command: `node src/index.js render '<Frame name="${title}" w={${width}} flex="col" bg="#fafafa" p={32} gap={24}>
  <Frame name="PageHeader" w="fill" flex="col" gap={8}>
    <Text size={14} color="#666666">Home / ${title}</Text>
    <Text size={20} weight="600" color="#212121" font="DM Sans">${title}</Text>
  </Frame>
  <Frame name="Content" w="fill" flex="col" gap={16} bg="#ffffff" p={24} rounded={4} stroke="#e0e0e0" strokeWidth={1}>
    <Text size={14} color="#666666" font="DM Sans">Content area</Text>
  </Frame>
</Frame>'`,
      description: `Create CDS ${pattern} view (${device})`,
    });
  }

  // Bind to CDS variables
  const frameName = options.title || pattern.charAt(0).toUpperCase() + pattern.slice(1);
  commands.push({
    type: 'ds-create',
    command: `node src/index.js ds bind "${frameName}"${device !== 'desktop' ? ` --device ${device}` : ''}${theme !== 'light' ? ` --theme ${theme}` : ''}`,
    description: `Bind ${frameName} to CDS variables`,
  });

  return commands;
}

/** Map a React MUI component to a Figma ds create command */
export function componentToFigma(
  componentName: string,
  props: Record<string, unknown> = {}
): FigmaCommand | null {
  const cdsName = CDS_COMPONENT_MAP[componentName];
  if (!cdsName) return null;

  const parts = [`node src/index.js ds create ${cdsName}`];

  if (props.variant) parts.push(`-v ${props.variant}`);
  if (props.size) parts.push(`-s ${props.size}`);
  if (props.label) parts.push(`--label "${props.label}"`);
  if (props.color) parts.push(`--color ${props.color}`);
  if (props.disabled) parts.push('--disabled');
  if (props.title) parts.push(`--title "${props.title}"`);

  return {
    type: 'ds-create',
    command: parts.join(' '),
    description: `Create CDS ${componentName} component`,
  };
}

/** Generate responsive Figma frames (Desktop + Tablet + Mobile) */
export function generateResponsiveFrames(
  pageName: string,
  pattern: 'list' | 'form' | 'detail' | 'dashboard'
): FigmaCommand[] {
  const commands: FigmaCommand[] = [];

  commands.push({
    type: 'ds-create',
    command: 'node src/index.js ds setup',
    description: 'Ensure CDS design system is set up',
  });

  for (const device of ['desktop', 'tablet', 'mobile'] as const) {
    commands.push(...pagePatternToFigma(pattern, { title: `${pageName} - ${device}`, device }));
  }

  return commands;
}
