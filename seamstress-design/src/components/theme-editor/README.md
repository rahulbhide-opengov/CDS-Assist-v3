# Theme Editor

A comprehensive theme editor for creating and managing custom color themes in Seamstress. This editor appears as a persistent drawer that slides in from the right, allowing you to work on your theme while viewing the live results on the page.

## Features

### ✨ Core Functionality

- **Create Custom Themes**: Create new color themes based on light or dark mode defaults
- **Pre-populated Defaults**: All themes start with complete default color values
- **Visual Customization Indicators**: See which colors you've customized vs. defaults
- **Edit All Theme Colors**: Modify all color categories:
  - Primary, Secondary, Error, Warning, Info, Success
  - Text (primary, secondary, disabled)
  - Background (default, paper, secondary)
  - Divider
  - Action states (active, hover, selected, disabled, etc.)
- **Design Token Selection**: Choose colors from Capital Design System tokens
  - Browse by category (Foundations, Semantic)
  - Search by name, path, or value
  - Visual color preview
  - Display token path and value
- **Theme Management**:
  - Save themes to localStorage
  - Load and edit existing themes
  - Delete themes
  - Apply themes with live preview
- **Import/Export**: Export themes as JSON and import from files

### 🎨 User Interface

- **Searchable Color Picker**: Find design tokens quickly with search functionality
- **Organized Color Categories**: Colors grouped by semantic categories with expansion panels
- **Visual Feedback**: See real-time color previews before applying
- **Token Information**: Display token path and hex value for each color
- **Active Theme Indicator**: Visual indicator showing which theme is currently active

## Usage

### Opening the Theme Editor

The theme editor is integrated into the utility tray:

1. **Via Utility Tray**: Click the palette icon (🎨) in the utility tray (top right)
2. **Via Direct URL**: Navigate to `/seamstress/theme-editor` and click "Open Theme Editor"

The editor opens as a **persistent drawer** from the right side:
- Stays open while you work
- See live theme changes on the page
- Close anytime with the X button or click outside

### Creating a New Theme

1. Select "Create New Theme" from the theme dropdown (or leave it empty)
2. Enter a theme name and optional description
3. **Choose Light or Dark mode** - this determines the default colors your theme starts with
4. Click "Create New Theme" - all colors are now pre-populated with defaults!
5. Click on any color box to customize it:
   - Colors with a blue border and "Custom" badge have been customized
   - Colors with a gray border are using default values
6. Search or browse for a design token in the color picker
7. Select a color to apply it
8. Click "Save Theme" when done

### Applying a Theme

1. Select a theme from the dropdown
2. Click "Apply Theme"
3. The theme will be applied immediately (no page reload required)

### Exporting a Theme

1. Select a theme from the dropdown
2. Click "Export"
3. Save the JSON file to your computer

### Importing a Theme

1. Click "Import"
2. Select a previously exported theme JSON file
3. The theme will be added to your saved themes

## Architecture

### Components

- **ThemeEditorDialog**: Main dialog component with theme management UI
- **ColorTokenPicker**: Searchable color token selector with preview
- **ThemeEditorUtility**: Wrapper component for utility tray integration

### Hooks

- **useThemeEditor**: Manages theme CRUD operations, storage, and application
- **useThemeMode**: Extended to support custom themes alongside light/dark mode

### Types

- **SavedTheme**: Represents a saved custom theme
- **ThemeColorConfig**: Complete theme color configuration
- **ColorMapping**: Maps theme color keys to design tokens
- **ColorToken**: Represents a design token with metadata

### Utilities

- **extractColorTokens**: Extracts all color tokens from capitalDesignTokens
- **groupTokensByCategory**: Groups tokens for organized display
- **filterTokens**: Filters tokens by search query
- **getTokenValue**: Gets the value of a token by path

## Theme Storage

Themes are stored in localStorage using two keys:

- `seamstress_custom_themes`: Array of all saved themes
- `seamstress_active_theme`: ID of the currently active theme

## Integration with Theme System

The theme editor integrates seamlessly with the existing Seamstress theme system:

1. **Base Theme**: Each custom theme selects light or dark mode as its base
2. **Default Population**: All colors start with defaults from `createSeamstressTheme(mode)`
3. **Custom Colors**: Only customized colors override the base theme
4. **Live Switching**: Uses React Context to apply themes without page reload
5. **Token Validation**: All colors map to valid Capital Design System tokens
6. **Mode Preservation**: Custom themes remember their base mode (light/dark)

## Color Categories

The theme editor supports all MUI theme color properties:

### Palette Colors (4 properties each)
- Primary (main, light, dark, contrastText)
- Secondary (main, light, dark, contrastText)
- Error (main, light, dark, contrastText)
- Warning (main, light, dark, contrastText)
- Info (main, light, dark, contrastText)
- Success (main, light, dark, contrastText)

### Text Colors
- text.primary
- text.secondary
- text.disabled

### Background Colors
- background.default
- background.paper
- background.secondary

### Other Colors
- divider

### Action Colors
- action.active
- action.hover
- action.selected
- action.disabled
- action.disabledBackground
- action.focus

## Design System Compliance

All colors in the theme editor must be selected from the Capital Design System tokens, ensuring:

- Consistent color usage across the application
- Accessibility compliance
- Design-dev parity
- Easy maintenance and updates

## Future Enhancements

Potential improvements for future versions:

- [ ] Typography customization
- [ ] Spacing/layout customization
- [ ] Component-specific style overrides
- [ ] Theme preview with live component samples
- [ ] Theme sharing (export as shareable link)
- [ ] Theme templates (pre-configured themes)
- [ ] Bulk color operations (adjust all colors by hue/saturation)
- [ ] Color palette generation (complementary colors)
- [ ] Accessibility contrast checking
- [ ] Version history/undo-redo

## API Reference

### useThemeEditor Hook

```typescript
const {
  savedThemes,           // Array of all saved themes
  currentTheme,          // Currently editing theme
  activeThemeId,         // ID of active theme
  createNewTheme,        // Create new theme
  updateThemeColor,      // Update a color in current theme
  saveTheme,             // Save/update theme
  deleteTheme,           // Delete theme by ID
  applyTheme,            // Apply theme by ID
  exportTheme,           // Export theme to JSON
  importTheme,           // Import theme from JSON string
  loadTheme,             // Load theme for editing
  setCurrentTheme,       // Set current editing theme
  convertToMuiTheme,     // Convert to MUI theme object
  getActiveTheme,        // Get active theme object
} = useThemeEditor();
```

### ThemeEditorDialog Props

```typescript
interface ThemeEditorDialogProps {
  open: boolean;      // Dialog open state
  onClose: () => void; // Close handler
}
```

### ColorTokenPicker Props

```typescript
interface ColorTokenPickerProps {
  open: boolean;                          // Dialog open state
  onClose: () => void;                    // Close handler
  onSelect: (mapping: ColorMapping) => void; // Color selection handler
  currentValue?: string;                  // Currently selected color value
  colorKey: string;                       // The color key being edited
}
```

## Notes

- Colors are stored as token paths, ensuring they always resolve to the latest token values
- The theme editor respects the current light/dark mode setting
- Custom themes override only the specified colors, leaving others at default values
- All theme operations are synchronous and immediately reflected in the UI
