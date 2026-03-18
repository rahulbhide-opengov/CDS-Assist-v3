/**
 * Keyboard Accessibility Data
 * Comprehensive keyboard shortcut definitions organized by category
 */

export interface KeyboardShortcut {
  keys: string[];
  action: string;
  behavior?: string;
  context?: string;
  notes?: string;
}

export interface ShortcutCategory {
  id: string;
  title: string;
  description: string;
  shortcuts: KeyboardShortcut[];
}

// ============================================
// TAB 1: NAVIGATION PATTERNS
// ============================================

export const pageNavigationShortcuts: ShortcutCategory = {
  id: 'page-navigation',
  title: 'Page & Application Navigation',
  description: 'Core keyboard patterns for moving through pages and applications',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Move to next focusable element',
      behavior: 'Sequential forward navigation through interactive elements',
      context: 'Global',
    },
    {
      keys: ['Shift', 'Tab'],
      action: 'Move to previous focusable element',
      behavior: 'Sequential backward navigation through interactive elements',
      context: 'Global',
    },
    {
      keys: ['Enter'],
      action: 'Activate focused element',
      behavior: 'Triggers click action on buttons, links, and interactive elements',
      context: 'Buttons, Links',
    },
    {
      keys: ['Space'],
      action: 'Activate or toggle',
      behavior: 'Toggles checkboxes, selects options, activates buttons',
      context: 'Buttons, Checkboxes',
    },
    {
      keys: ['Esc'],
      action: 'Cancel or close',
      behavior: 'Closes modals, menus, dropdowns; cancels current operation',
      context: 'Global',
    },
  ],
};

export const skipLinkShortcuts: ShortcutCategory = {
  id: 'skip-links',
  title: 'Skip Links & Landmarks',
  description: 'Patterns for efficient page navigation using skip links and ARIA landmarks',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Reveal skip link (first Tab on page)',
      behavior: 'First Tab press reveals "Skip to main content" link',
      context: 'Page Load',
      notes: 'Skip link should be the first focusable element',
    },
    {
      keys: ['Enter'],
      action: 'Activate skip link',
      behavior: 'Jumps focus to main content area, bypassing navigation',
      context: 'Skip Link',
    },
  ],
};

export const gridNavigationShortcuts: ShortcutCategory = {
  id: 'grid-navigation',
  title: 'Grid & Calendar Navigation',
  description: 'Arrow key patterns for data grids, calendars, and matrix layouts',
  shortcuts: [
    {
      keys: ['↑'],
      action: 'Move up one cell/row',
      behavior: 'Moves focus to the cell directly above',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['↓'],
      action: 'Move down one cell/row',
      behavior: 'Moves focus to the cell directly below',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['←'],
      action: 'Move left one cell',
      behavior: 'Moves focus to the cell on the left',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['→'],
      action: 'Move right one cell',
      behavior: 'Moves focus to the cell on the right',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['Home'],
      action: 'Move to first cell in row',
      behavior: 'Jumps to the beginning of the current row',
      context: 'DataGrid',
    },
    {
      keys: ['End'],
      action: 'Move to last cell in row',
      behavior: 'Jumps to the end of the current row',
      context: 'DataGrid',
    },
    {
      keys: ['Ctrl', 'Home'],
      action: 'Move to first cell in grid',
      behavior: 'Jumps to the top-left cell of the grid',
      context: 'DataGrid',
    },
    {
      keys: ['Ctrl', 'End'],
      action: 'Move to last cell in grid',
      behavior: 'Jumps to the bottom-right cell of the grid',
      context: 'DataGrid',
    },
    {
      keys: ['Page Up'],
      action: 'Move up one page',
      behavior: 'Scrolls up by viewport height, moves focus accordingly',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['Page Down'],
      action: 'Move down one page',
      behavior: 'Scrolls down by viewport height, moves focus accordingly',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['Enter'],
      action: 'Enter cell edit mode / Select date',
      behavior: 'Opens cell for editing or selects the focused date',
      context: 'DataGrid, Calendar',
    },
    {
      keys: ['Esc'],
      action: 'Exit cell edit mode',
      behavior: 'Cancels edit and returns to navigation mode',
      context: 'DataGrid',
    },
  ],
};

export const mapNavigationShortcuts: ShortcutCategory = {
  id: 'map-navigation',
  title: 'Map & Geospatial Navigation',
  description: 'Keyboard controls for interactive maps and geospatial components',
  shortcuts: [
    {
      keys: ['↑', '↓', '←', '→'],
      action: 'Pan map',
      behavior: 'Moves the map view in the arrow direction',
      context: 'Map',
    },
    {
      keys: ['+'],
      action: 'Zoom in',
      behavior: 'Increases map zoom level',
      context: 'Map',
    },
    {
      keys: ['-'],
      action: 'Zoom out',
      behavior: 'Decreases map zoom level',
      context: 'Map',
    },
    {
      keys: ['Tab'],
      action: 'Navigate between markers',
      behavior: 'Cycles through map markers and controls',
      context: 'Map',
    },
    {
      keys: ['Enter'],
      action: 'Open marker popup',
      behavior: 'Opens the info popup for the focused marker',
      context: 'Map Marker',
    },
    {
      keys: ['Esc'],
      action: 'Close marker popup',
      behavior: 'Closes any open marker popup',
      context: 'Map Marker',
    },
  ],
};

export const tableNavigationShortcuts: ShortcutCategory = {
  id: 'table-navigation',
  title: 'Table Navigation',
  description: 'Keyboard patterns for navigating and interacting with data tables',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Move between table sections',
      behavior: 'Moves between toolbar, headers, body, and pagination',
      context: 'Table',
    },
    {
      keys: ['↑', '↓'],
      action: 'Navigate rows',
      behavior: 'Moves focus between rows in the table body',
      context: 'Table Body',
    },
    {
      keys: ['Enter'],
      action: 'Activate row action / Sort column',
      behavior: 'Triggers primary action on row; sorts when on header',
      context: 'Table',
    },
    {
      keys: ['Space'],
      action: 'Select/deselect row',
      behavior: 'Toggles row selection checkbox',
      context: 'Table Body',
    },
    {
      keys: ['Ctrl', 'A'],
      action: 'Select all rows',
      behavior: 'Selects all rows on current page',
      context: 'Table',
    },
  ],
};

// ============================================
// TAB 2: INTERACTIONS
// ============================================

export const zAxisInteractionShortcuts: ShortcutCategory = {
  id: 'z-axis-interaction',
  title: 'Element Interactions (Z-Axis)',
  description: 'Patterns for entering and exiting nested content like cards and expandable sections',
  shortcuts: [
    {
      keys: ['Enter'],
      action: 'Enter card/container',
      behavior: 'Moves focus into the card to access internal actions',
      context: 'Card, Expandable',
      notes: 'First Enter enters the container; subsequent Tabs navigate within',
    },
    {
      keys: ['Esc'],
      action: 'Exit card/container',
      behavior: 'Returns focus to the card container itself',
      context: 'Card, Expandable',
    },
    {
      keys: ['Tab'],
      action: 'Navigate within container',
      behavior: 'Moves between interactive elements inside the container',
      context: 'Card, Expandable',
    },
    {
      keys: ['F2'],
      action: 'Toggle edit mode',
      behavior: 'Enters edit mode for editable cards/cells',
      context: 'Editable Content',
    },
  ],
};

export const itemSelectionShortcuts: ShortcutCategory = {
  id: 'item-selection',
  title: 'Item Selection',
  description: 'Keyboard patterns for selecting single or multiple items',
  shortcuts: [
    {
      keys: ['Space'],
      action: 'Toggle item selection',
      behavior: 'Selects or deselects the focused item',
      context: 'List, Grid, Table',
    },
    {
      keys: ['Shift', '↑'],
      action: 'Extend selection up',
      behavior: 'Adds the item above to the selection',
      context: 'List, Grid',
    },
    {
      keys: ['Shift', '↓'],
      action: 'Extend selection down',
      behavior: 'Adds the item below to the selection',
      context: 'List, Grid',
    },
    {
      keys: ['Shift', 'Click'],
      action: 'Range select',
      behavior: 'Selects all items between last selected and clicked item',
      context: 'List, Grid, Table',
      notes: 'Keyboard equivalent: Shift + Arrow keys',
    },
    {
      keys: ['Ctrl', 'A'],
      action: 'Select all',
      behavior: 'Selects all items in the current container',
      context: 'List, Grid, Table',
    },
    {
      keys: ['Ctrl', 'Shift', 'A'],
      action: 'Deselect all',
      behavior: 'Clears all selections',
      context: 'List, Grid, Table',
    },
    {
      keys: ['Ctrl', 'Space'],
      action: 'Add to selection without moving',
      behavior: 'Toggles selection without moving focus',
      context: 'List, Grid',
    },
  ],
};

export const moveSelectionShortcuts: ShortcutCategory = {
  id: 'move-selection',
  title: 'Move Selections (Keyboard Drag-and-Drop)',
  description: 'Keyboard alternatives to drag-and-drop for moving items',
  shortcuts: [
    {
      keys: ['Space'],
      action: 'Pick up item',
      behavior: 'Grabs the focused item for moving (announced by screen reader)',
      context: 'Sortable List',
      notes: 'Visual indicator should show item is "grabbed"',
    },
    {
      keys: ['↑', '↓'],
      action: 'Move item in list',
      behavior: 'Moves grabbed item up or down in the list',
      context: 'Sortable List',
    },
    {
      keys: ['←', '→'],
      action: 'Move item between columns',
      behavior: 'Moves grabbed item to adjacent column (Kanban boards)',
      context: 'Kanban, Multi-column',
    },
    {
      keys: ['Space', 'Enter'],
      action: 'Drop item',
      behavior: 'Places the item in its new position',
      context: 'Sortable List',
    },
    {
      keys: ['Esc'],
      action: 'Cancel move',
      behavior: 'Returns item to original position',
      context: 'Sortable List',
    },
  ],
};

export const reorderSelectionShortcuts: ShortcutCategory = {
  id: 'reorder-selection',
  title: 'Reorder Selections',
  description: 'Patterns for reordering items within grid cells or containers',
  shortcuts: [
    {
      keys: ['Ctrl', '↑'],
      action: 'Move item up in cell',
      behavior: 'Reorders item up within the current cell/container',
      context: 'Multi-value Cell',
    },
    {
      keys: ['Ctrl', '↓'],
      action: 'Move item down in cell',
      behavior: 'Reorders item down within the current cell/container',
      context: 'Multi-value Cell',
    },
    {
      keys: ['Ctrl', 'Shift', 'Home'],
      action: 'Move to top',
      behavior: 'Moves item to the first position',
      context: 'Multi-value Cell',
    },
    {
      keys: ['Ctrl', 'Shift', 'End'],
      action: 'Move to bottom',
      behavior: 'Moves item to the last position',
      context: 'Multi-value Cell',
    },
  ],
};

// ============================================
// TAB 3: COMPONENTS
// ============================================

export const formInputShortcuts: ShortcutCategory = {
  id: 'form-input',
  title: 'Forms & Input Fields',
  description: 'Keyboard patterns for form navigation and submission',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Move to next field',
      behavior: 'Advances focus to the next form control',
      context: 'Form',
    },
    {
      keys: ['Shift', 'Tab'],
      action: 'Move to previous field',
      behavior: 'Returns focus to the previous form control',
      context: 'Form',
    },
    {
      keys: ['Enter'],
      action: 'Submit form (from input)',
      behavior: 'Submits the form when focus is on a text input',
      context: 'Form',
      notes: 'Only in single-line inputs; multiline uses Enter for new lines',
    },
    {
      keys: ['Space'],
      action: 'Toggle checkbox/radio',
      behavior: 'Toggles checkbox; selects radio button',
      context: 'Checkbox, Radio',
    },
    {
      keys: ['↑', '↓'],
      action: 'Navigate radio group',
      behavior: 'Moves selection between radio options',
      context: 'Radio Group',
    },
  ],
};

export const dropdownShortcuts: ShortcutCategory = {
  id: 'dropdown',
  title: 'Dropdowns & Autocomplete',
  description: 'Keyboard patterns for dropdown menus and autocomplete components',
  shortcuts: [
    {
      keys: ['Enter', 'Space', '↓'],
      action: 'Open dropdown',
      behavior: 'Opens the dropdown menu and focuses first option',
      context: 'Select, Autocomplete',
    },
    {
      keys: ['↑', '↓'],
      action: 'Navigate options',
      behavior: 'Moves highlight between dropdown options',
      context: 'Dropdown Menu',
    },
    {
      keys: ['Enter'],
      action: 'Select option',
      behavior: 'Selects the highlighted option and closes dropdown',
      context: 'Dropdown Menu',
    },
    {
      keys: ['Esc'],
      action: 'Close dropdown',
      behavior: 'Closes dropdown without selecting; restores previous value',
      context: 'Dropdown Menu',
    },
    {
      keys: ['Home'],
      action: 'Jump to first option',
      behavior: 'Moves highlight to the first option',
      context: 'Dropdown Menu',
    },
    {
      keys: ['End'],
      action: 'Jump to last option',
      behavior: 'Moves highlight to the last option',
      context: 'Dropdown Menu',
    },
    {
      keys: ['Type characters'],
      action: 'Typeahead search',
      behavior: 'Jumps to first option matching typed characters',
      context: 'Dropdown Menu',
      notes: 'Character buffer clears after brief pause',
    },
  ],
};

export const modalShortcuts: ShortcutCategory = {
  id: 'modal',
  title: 'Modals, Drawers & Panels',
  description: 'Keyboard patterns for overlay components with focus management',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Navigate within modal (trapped)',
      behavior: 'Cycles through focusable elements within the modal only',
      context: 'Modal, Drawer',
      notes: 'Focus should never escape to page content behind modal',
    },
    {
      keys: ['Shift', 'Tab'],
      action: 'Navigate backward (trapped)',
      behavior: 'Reverse cycles through modal elements',
      context: 'Modal, Drawer',
    },
    {
      keys: ['Esc'],
      action: 'Close modal/drawer',
      behavior: 'Closes the overlay and returns focus to trigger element',
      context: 'Modal, Drawer, Panel',
    },
    {
      keys: ['Enter'],
      action: 'Confirm/Submit',
      behavior: 'Activates the primary action button if focused, or submits form',
      context: 'Modal Dialog',
    },
  ],
};

export const dashboardShortcuts: ShortcutCategory = {
  id: 'dashboard',
  title: 'Dashboards & Widgets',
  description: 'Keyboard patterns for dashboard layouts and widget interactions',
  shortcuts: [
    {
      keys: ['Tab'],
      action: 'Navigate between widgets',
      behavior: 'Moves focus between dashboard widgets/cards',
      context: 'Dashboard',
    },
    {
      keys: ['Enter'],
      action: 'Enter widget',
      behavior: 'Moves focus into widget to access internal controls',
      context: 'Dashboard Widget',
    },
    {
      keys: ['Esc'],
      action: 'Exit widget',
      behavior: 'Returns focus to widget container',
      context: 'Dashboard Widget',
    },
    {
      keys: ['F2'],
      action: 'Enter widget edit mode',
      behavior: 'Enables editing widget configuration',
      context: 'Editable Widget',
    },
    {
      keys: ['Ctrl', '↑', '↓', '←', '→'],
      action: 'Resize widget',
      behavior: 'Adjusts widget size in edit mode',
      context: 'Widget Edit Mode',
    },
  ],
};

// ============================================
// TAB 4: REFERENCE
// ============================================

export const focusManagementShortcuts: ShortcutCategory = {
  id: 'focus-management',
  title: 'Advanced Focus Considerations',
  description: 'Guidelines for managing focus in complex interactions',
  shortcuts: [
    {
      keys: ['Auto'],
      action: 'Initial focus placement',
      behavior: 'Focus moves to first interactive element or specified target',
      context: 'Modal Open, Page Load',
      notes: 'Use autofocus or manual focus management',
    },
    {
      keys: ['Auto'],
      action: 'Focus return',
      behavior: 'Focus returns to trigger element when overlay closes',
      context: 'Modal Close, Dropdown Close',
      notes: 'Critical for screen reader users',
    },
    {
      keys: ['Tab', 'Shift+Tab'],
      action: 'Focus trap',
      behavior: 'Focus cycles within container, never escaping',
      context: 'Modal, Dialog',
      notes: 'Required for WCAG 2.4.3 Focus Order',
    },
  ],
};

export const liveAnnouncementShortcuts: ShortcutCategory = {
  id: 'live-announcements',
  title: 'Live Announcements',
  description: 'ARIA live region patterns for dynamic content updates',
  shortcuts: [
    {
      keys: ['Auto'],
      action: 'Polite announcement',
      behavior: 'Screen reader announces after current speech completes',
      context: 'Status Updates',
      notes: 'Use aria-live="polite" for non-urgent updates',
    },
    {
      keys: ['Auto'],
      action: 'Assertive announcement',
      behavior: 'Screen reader interrupts to announce immediately',
      context: 'Error Messages, Alerts',
      notes: 'Use aria-live="assertive" sparingly for urgent info',
    },
    {
      keys: ['Auto'],
      action: 'Role alert',
      behavior: 'Automatically assertive; announces immediately',
      context: 'Error States',
      notes: 'role="alert" implies aria-live="assertive"',
    },
  ],
};

export const tabindexPolicy: ShortcutCategory = {
  id: 'tabindex-policy',
  title: 'Appendix: Tabindex Policy',
  description: 'Guidelines for using tabindex values correctly',
  shortcuts: [
    {
      keys: ['tabindex="0"'],
      action: 'Add to tab order',
      behavior: 'Element becomes focusable in natural DOM order',
      context: 'Custom interactive elements',
      notes: 'Use for custom buttons, clickable divs, etc.',
    },
    {
      keys: ['tabindex="-1"'],
      action: 'Programmatic focus only',
      behavior: 'Element can receive focus via JavaScript, not Tab',
      context: 'Focus targets, modal containers',
      notes: 'Use for focus management destinations',
    },
    {
      keys: ['tabindex>0'],
      action: 'AVOID - Explicit order',
      behavior: 'Forces element earlier in tab sequence',
      context: 'Never recommended',
      notes: 'Breaks natural flow; creates maintenance burden',
    },
  ],
};

export const cssUtilities: ShortcutCategory = {
  id: 'css-utilities',
  title: 'Appendix: CSS Utilities',
  description: 'Helper classes for accessibility',
  shortcuts: [
    {
      keys: ['.visually-hidden'],
      action: 'Hide visually, keep for screen readers',
      behavior: 'Content is invisible but read by assistive technology',
      context: 'SR-only labels, skip links',
      notes: 'Also known as .sr-only',
    },
    {
      keys: [':focus-visible'],
      action: 'Show focus ring only for keyboard',
      behavior: 'Displays focus indicator for keyboard users, not mouse',
      context: 'All interactive elements',
      notes: 'Prefer over :focus for better UX',
    },
    {
      keys: ['outline: none'],
      action: 'AVOID - Removes focus indicator',
      behavior: 'Removes visible focus state',
      context: 'Never without replacement',
      notes: 'Always provide alternative focus styling',
    },
  ],
};

// ============================================
// ORGANIZED BY TAB
// ============================================

export const navigationPatterns = [
  pageNavigationShortcuts,
  skipLinkShortcuts,
  gridNavigationShortcuts,
  mapNavigationShortcuts,
  tableNavigationShortcuts,
];

export const interactionPatterns = [
  zAxisInteractionShortcuts,
  itemSelectionShortcuts,
  moveSelectionShortcuts,
  reorderSelectionShortcuts,
];

export const componentPatterns = [
  formInputShortcuts,
  dropdownShortcuts,
  modalShortcuts,
  dashboardShortcuts,
];

export const referencePatterns = [
  focusManagementShortcuts,
  liveAnnouncementShortcuts,
  tabindexPolicy,
  cssUtilities,
];

// ============================================
// DO/DON'T GUIDELINES
// ============================================

export interface Guideline {
  type: 'do' | 'dont';
  text: string;
  context?: string;
}

export const focusGuidelines: Guideline[] = [
  { type: 'do', text: 'Always provide visible focus indicators', context: 'All interactive elements' },
  { type: 'do', text: 'Return focus to trigger element when closing overlays', context: 'Modals, Dropdowns' },
  { type: 'do', text: 'Trap focus within modal dialogs', context: 'Modal, Dialog' },
  { type: 'do', text: 'Use tabindex="0" for custom interactive elements', context: 'Custom components' },
  { type: 'dont', text: 'Never use tabindex greater than 0', context: 'All elements' },
  { type: 'dont', text: 'Never remove focus outlines without replacement styling', context: 'All elements' },
  { type: 'dont', text: 'Never trap focus in non-modal content', context: 'Page content' },
  { type: 'dont', text: 'Never auto-focus elements on page load without user action', context: 'Page load' },
];

export const keyboardGuidelines: Guideline[] = [
  { type: 'do', text: 'Support both Enter and Space for button activation', context: 'Buttons' },
  { type: 'do', text: 'Use arrow keys for navigation within composite widgets', context: 'Menus, Tabs, Grids' },
  { type: 'do', text: 'Allow Escape to cancel operations and close overlays', context: 'Modals, Menus' },
  { type: 'do', text: 'Provide keyboard alternatives to drag-and-drop', context: 'Sortable lists' },
  { type: 'dont', text: 'Dont require mouse-only interactions', context: 'All features' },
  { type: 'dont', text: 'Dont use keyboard shortcuts that conflict with browser/AT shortcuts', context: 'Custom shortcuts' },
  { type: 'dont', text: 'Dont change focus unexpectedly without user action', context: 'Focus management' },
];
