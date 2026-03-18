/**
 * CDS Theme - FULLY RESPONSIVE
 * Main theme configuration using CDS design tokens with responsive values
 * Import and use with Material-UI ThemeProvider
 */

import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import type { ResponsiveValue } from './tokens';
import {
  colorTokens,
  spacingTokens,
  typographyTokens,
  elevationTokens,
  zIndexTokens,
  borderRadiusTokens,
  transitionTokens,
  breakpointTokens,
  sizingTokens,
  componentElevationTokens,
  componentDefaultsTokens,
} from './tokens';

export { colorTokens, spacingTokens, typographyTokens, sizingTokens, borderRadiusTokens, elevationTokens, zIndexTokens, transitionTokens, breakpointTokens, componentElevationTokens, componentDefaultsTokens } from './tokens';

/**
 * Helper Functions for Responsive Values
 */

/**
 * Convert responsive typography token to MUI theme format
 * Creates responsive fontSize and lineHeight using theme.breakpoints.up()
 */
function createResponsiveTypography(
  token: ResponsiveValue<{
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
    letterSpacing: number;
  }>
) {
  return {
    fontSize: `${token.mobile.fontSize}px`,
    lineHeight: `${token.mobile.lineHeight}px`,
    fontWeight: token.mobile.fontWeight,
    letterSpacing: `${token.mobile.letterSpacing}px`,
    '@media (min-width:600px)': {
      fontSize: `${token.tablet.fontSize}px`,
      lineHeight: `${token.tablet.lineHeight}px`,
      fontWeight: token.tablet.fontWeight,
      letterSpacing: `${token.tablet.letterSpacing}px`,
    },
    '@media (min-width:900px)': {
      fontSize: `${token.desktop.fontSize}px`,
      lineHeight: `${token.desktop.lineHeight}px`,
      fontWeight: token.desktop.fontWeight,
      letterSpacing: `${token.desktop.letterSpacing}px`,
    },
  };
}

/**
 * Convert responsive size token to CSS value
 * Returns a string with mobile value and media queries for tablet/desktop
 */
function createResponsiveSize(token: ResponsiveValue<number>): string {
  return `${token.mobile}px`;
}

/**
 * Create responsive size object for MUI components
 * Returns an object with base value and responsive overrides
 */
function createResponsiveSizeObject(token: ResponsiveValue<number>) {
  return {
    minHeight: token.mobile,
    '@media (min-width:600px)': {
      minHeight: token.tablet,
    },
    '@media (min-width:900px)': {
      minHeight: token.desktop,
    },
  };
}

/**
 * Convert responsive spacing token to MUI spacing object
 */
function createResponsiveSpacing(token: ResponsiveValue<number>) {
  return {
    mobile: token.mobile,
    tablet: token.tablet,
    desktop: token.desktop,
  };
}

/**
 * CDS Theme Configuration
 * Complete Material-UI theme with all CDS tokens
 */
const themeOptions: ThemeOptions = {
  // Color Palette
  palette: {
    mode: 'light',
    primary: colorTokens.primary,
    secondary: colorTokens.secondary,
    error: colorTokens.error,
    warning: colorTokens.warning,
    info: colorTokens.info,
    success: colorTokens.success,
    grey: colorTokens.grey,
    text: colorTokens.text,
    background: colorTokens.background,
    action: colorTokens.action,
    divider: colorTokens.divider,
    backdrop: colorTokens.backdrop,
    // CDS State Colors (for direct access)
    primaryStates: colorTokens.primaryStates,
    secondaryStates: colorTokens.secondaryStates,
  },

  // Spacing
  spacing: spacingTokens.base, // 4px base unit

  // Typography - Responsive
  typography: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSize,
    fontWeightLight: typographyTokens.fontWeightLight,
    fontWeightRegular: typographyTokens.fontWeightRegular,
    fontWeightMedium: typographyTokens.fontWeightMedium,
    fontWeightBold: typographyTokens.fontWeightBold,
    // Responsive typography variants
    h1: createResponsiveTypography(typographyTokens.h1),
    h2: createResponsiveTypography(typographyTokens.h2),
    h3: createResponsiveTypography(typographyTokens.h3),
    h4: createResponsiveTypography(typographyTokens.h4),
    h5: createResponsiveTypography(typographyTokens.h5),
    h6: createResponsiveTypography(typographyTokens.h6),
    subtitle1: createResponsiveTypography(typographyTokens.subtitle1),
    subtitle2: createResponsiveTypography(typographyTokens.subtitle2),
    body1: createResponsiveTypography(typographyTokens.body1),
    body2: createResponsiveTypography(typographyTokens.body2),
    button: createResponsiveTypography(typographyTokens.button.medium),
    caption: createResponsiveTypography(typographyTokens.caption),
    overline: createResponsiveTypography(typographyTokens.overline),
    // Component-specific typography (custom extensions)
    badge: { default: createResponsiveTypography(typographyTokens.badge.default) },
    tooltip: { default: createResponsiveTypography(typographyTokens.tooltip.default) },
    dialog: {
      title: createResponsiveTypography(typographyTokens.dialog.title),
      content: createResponsiveTypography(typographyTokens.dialog.content),
    },
    slider: { valueLabel: createResponsiveTypography(typographyTokens.slider.valueLabel) },
    rating: { icon: createResponsiveTypography(typographyTokens.rating.icon) },
    stepper: { label: createResponsiveTypography(typographyTokens.stepper.label) },
    input: {
      labelSm: createResponsiveTypography(typographyTokens.input.labelSm),
      labelMd: createResponsiveTypography(typographyTokens.input.labelMd),
      labelLg: createResponsiveTypography(typographyTokens.input.labelLg),
      valueSm: createResponsiveTypography(typographyTokens.input.valueSm),
      valueMd: createResponsiveTypography(typographyTokens.input.valueMd),
      valueLg: createResponsiveTypography(typographyTokens.input.valueLg),
      helper: createResponsiveTypography(typographyTokens.input.helper),
    },
  } as any, // Cast to any to allow custom typography extensions

  // Shape (Border Radius)
  shape: {
    borderRadius: borderRadiusTokens.small, // 4px default
  },

  // Shadows (Elevation)
  shadows: elevationTokens,

  // Z-Index
  zIndex: zIndexTokens,

  // Transitions
  transitions: {
    duration: transitionTokens.duration,
    easing: transitionTokens.easing,
  },

  // Breakpoints
  breakpoints: {
    values: breakpointTokens.values,
  },

  // Component Overrides - Responsive
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          textTransform: typographyTokens.textTransform,
          fontWeight: typographyTokens.fontWeightMedium,
        },
        sizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.button.small),
          padding: `${sizingTokens.buttonPadding.small.vertical}px ${sizingTokens.buttonPadding.small.horizontal}px`,
          ...createResponsiveTypography(typographyTokens.button.small),
        },
        sizeMedium: {
          ...createResponsiveSizeObject(sizingTokens.button.medium),
          padding: `${sizingTokens.buttonPadding.medium.vertical}px ${sizingTokens.buttonPadding.medium.horizontal}px`,
          ...createResponsiveTypography(typographyTokens.button.medium),
        },
        sizeLarge: {
          ...createResponsiveSizeObject(sizingTokens.button.large),
          padding: `${sizingTokens.buttonPadding.large.vertical}px ${sizingTokens.buttonPadding.large.horizontal}px`,
          ...createResponsiveTypography(typographyTokens.button.large),
        },
        // Primary Color - Contained (Filled) - CDS Blurple states
        containedPrimary: {
          '&:hover': {
            backgroundColor: colorTokens.primary[700], // Blurple 700
            // Overlay with hover state
            backgroundImage: `linear-gradient(${colorTokens.primaryStates.light.hover}, ${colorTokens.primaryStates.light.hover})`,
          },
          '&:active': {
            backgroundImage: `linear-gradient(${colorTokens.primaryStates.light.selected}, ${colorTokens.primaryStates.light.selected})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Primary Color - Outlined - CDS Blurple states
        outlinedPrimary: {
          borderColor: colorTokens.primaryStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
            borderColor: colorTokens.primary[700],
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Primary Color - Text - CDS Blurple states
        textPrimary: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Contained (Filled) - CDS Slate states
        containedSecondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondary[700], // Slate 700
            backgroundImage: `linear-gradient(${colorTokens.secondaryStates.light.hover}, ${colorTokens.secondaryStates.light.hover})`,
          },
          '&:active': {
            backgroundImage: `linear-gradient(${colorTokens.secondaryStates.light.selected}, ${colorTokens.secondaryStates.light.selected})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Outlined - CDS Slate states
        outlinedSecondary: {
          borderColor: colorTokens.secondaryStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
            borderColor: colorTokens.secondary[700],
          },
          '&:active': {
            backgroundColor: colorTokens.secondaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        // Secondary Color - Text - CDS Slate states
        textSecondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.secondaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        // Error Color - CDS error states
        containedError: {
          '&:hover': {
            backgroundColor: colorTokens.error.dark,
            backgroundImage: `linear-gradient(${colorTokens.errorStates.light.hover}, ${colorTokens.errorStates.light.hover})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
        outlinedError: {
          borderColor: colorTokens.errorStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.errorStates.light.hover,
            borderColor: colorTokens.error.main,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
        textError: {
          '&:hover': { backgroundColor: colorTokens.errorStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
        // Warning Color - CDS warning states
        containedWarning: {
          '&:hover': {
            backgroundColor: colorTokens.warning.dark,
            backgroundImage: `linear-gradient(${colorTokens.warningStates.light.hover}, ${colorTokens.warningStates.light.hover})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.warningStates.light.focusVisible}`,
          },
        },
        outlinedWarning: {
          borderColor: colorTokens.warningStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.warningStates.light.hover,
            borderColor: colorTokens.warning.main,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.warningStates.light.focusVisible}`,
          },
        },
        textWarning: {
          '&:hover': { backgroundColor: colorTokens.warningStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.warningStates.light.focusVisible}`,
          },
        },
        // Info Color - CDS info states
        containedInfo: {
          '&:hover': {
            backgroundColor: colorTokens.info.dark,
            backgroundImage: `linear-gradient(${colorTokens.infoStates.light.hover}, ${colorTokens.infoStates.light.hover})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.infoStates.light.focusVisible}`,
          },
        },
        outlinedInfo: {
          borderColor: colorTokens.infoStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.infoStates.light.hover,
            borderColor: colorTokens.info.main,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.infoStates.light.focusVisible}`,
          },
        },
        textInfo: {
          '&:hover': { backgroundColor: colorTokens.infoStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.infoStates.light.focusVisible}`,
          },
        },
        // Success Color - CDS success states
        containedSuccess: {
          '&:hover': {
            backgroundColor: colorTokens.success.dark,
            backgroundImage: `linear-gradient(${colorTokens.successStates.light.hover}, ${colorTokens.successStates.light.hover})`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.successStates.light.focusVisible}`,
          },
        },
        outlinedSuccess: {
          borderColor: colorTokens.successStates.light.outlinedBorder,
          '&:hover': {
            backgroundColor: colorTokens.successStates.light.hover,
            borderColor: colorTokens.success.main,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.successStates.light.focusVisible}`,
          },
        },
        textSuccess: {
          '&:hover': { backgroundColor: colorTokens.successStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.successStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: sizingTokens.touchTarget.min,
          minHeight: sizingTokens.touchTarget.min,
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&:hover': { backgroundColor: colorTokens.primaryStates.light.hover },
          '&:active': { backgroundColor: colorTokens.primaryStates.light.selected },
        },
        colorSecondary: {
          '&:hover': { backgroundColor: colorTokens.secondaryStates.light.hover },
          '&:active': { backgroundColor: colorTokens.secondaryStates.light.selected },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        colorError: {
          '&:hover': { backgroundColor: colorTokens.errorStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
        colorInfo: {
          '&:hover': { backgroundColor: colorTokens.infoStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.infoStates.light.focusVisible}`,
          },
        },
        colorSuccess: {
          '&:hover': { backgroundColor: colorTokens.successStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.successStates.light.focusVisible}`,
          },
        },
        colorWarning: {
          '&:hover': { backgroundColor: colorTokens.warningStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.warningStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: componentDefaultsTokens.textField.variant,
        InputLabelProps: {
          shrink: true,
        },
        rows: 3,
      },
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          textarea: { cursor: 'pointer' },
          maxWidth: '100%',
          '.MuiInputLabel-root, .MuiInputLabel-root.Mui-focused': {
            color: 'inherit',
            position: 'relative' as const,
            transform: 'none',
            '&.MuiInputLabel-outlined': {
              ...(ownerState.size === 'small' && { fontSize: '0.875rem' }),
              ...(ownerState.size === 'large' && { fontSize: '1.25rem' }),
            },
          },
          '.MuiInputLabel-root.Mui-error, .MuiInputLabel-root.Mui-disabled': {
            color: colorTokens.text.primary,
          },
          '.MuiInputBase-multiline': {
            cursor: 'pointer',
            maxWidth: '100%',
            width: '320px',
            height: 'inherit',
            ...(ownerState.size === 'small' && { height: 'inherit' }),
            ...(ownerState.size === 'large' && { height: 'inherit' }),
            alignItems: 'flex-start',
            '.MuiInputAdornment-root': {
              maxHeight: '100%',
              height: '100%',
            },
          },
          '.MuiInputAdornment-root': {
            color: colorTokens.text.secondary,
            button: { color: 'inherit' },
          },
          'input[type="number"]': {
            MozAppearance: 'textfield',
            '&:hover, &:focus': { MozAppearance: 'initial' },
          },
          '.Mui-readOnly': {
            color: colorTokens.text.tertiary,
            background: '#F7F9FE',
          },
        }),
      },
    },

    MuiLink: {
      defaultProps: {
        underline: componentDefaultsTokens.link.underline,
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `${sizingTokens.focusRing.width}px solid ${colorTokens.primaryStates.light.focusVisible}`,
            outlineOffset: `${sizingTokens.focusRing.outlineOffset.link}px`,
            borderRadius: borderRadiusTokens.extraSmall,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          backgroundColor: '#ffffff',
          borderRadius: borderRadiusTokens.small,
          '&.MuiInputBase-colorSuccess .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.success.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline, &:hover.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.primary.main,
            borderWidth: '2px',
          },
          '&.Mui-disabled, &.Mui-disabled:hover': {
            backgroundColor: colorTokens.grey[100],
            borderRadius: borderRadiusTokens.small,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline, &.Mui-disabled:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.grey[600],
            borderRadius: borderRadiusTokens.small,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: ownerState.color !== 'primary' && colorTokens.text.primary,
            borderRadius: borderRadiusTokens.small,
          },
          '&.Mui-focusVisible, &:focus-visible': {
            outline: `2px solid ${colorTokens.primary.main}`,
            outlineOffset: 2,
          },
        }),
        adornedStart: {
          paddingLeft: spacingTokens.base,
          '.MuiSvgIcon-root': {
            fontSize: '1rem',
            '&.MuiSelect-icon': { fontSize: '1.5rem' },
          },
          '.MuiButtonBase-root': { padding: 0 },
        },
        adornedEnd: {
          paddingRight: spacingTokens.base,
          '.MuiButtonBase-root': {
            '&:hover': {
              backgroundColor: 'transparent',
              color: colorTokens.text.primary,
            },
          },
        },
        input: ({ ownerState }: any) => ({
          fontWeight: 400,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '4px 10px',
          ...(ownerState.size === 'small' && { padding: '2px 8px' }),
          ...(ownerState.size === 'large' && { padding: '5.4px 16px' }),
          color: colorTokens.text.primary,
          '&::-webkit-input-placeholder, &::-moz-placeholder, &::placeholder': {
            WebkitTextFillColor: colorTokens.text.tertiary,
            opacity: 1,
          },
          '&.Mui-disabled::-webkit-input-placeholder, &.Mui-disabled::-moz-placeholder, &.Mui-disabled::placeholder': {
            WebkitTextFillColor: colorTokens.text.disabled,
          },
          label: { color: colorTokens.text.primary },
        }),
        multiline: { padding: spacingTokens.base },
        inputMultiline: { padding: 0, lineHeight: '1.25rem' },
        notchedOutline: {
          borderColor: colorTokens.grey[600],
          legend: { width: 0 },
        },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: { margin: 0 },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.input.labelMd),
        },
        sizeSmall: {
          ...createResponsiveTypography(typographyTokens.input.labelSm),
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          paddingBottom: spacingTokens.base / 2,
          color: colorTokens.text.primary,
          fontWeight: 500,
          '&.Mui-focused': { color: 'inherit' },
          '&.MuiInputLabel-formControl, &.MuiInputLabel-shrink': {
            transform: 'none',
            position: 'relative' as const,
          },
          '& .cds-textFieldDescription': {
            color: colorTokens.grey[800],
            paddingTop: spacingTokens.base / 2,
            textWrap: 'wrap',
          },
          '& .cds-textFieldCounter': { color: colorTokens.grey[800] },
          '.cds-textFieldLabelWithCounter': {
            margin: 0,
            display: 'flex',
            justifyContent: 'space-between',
            textWrap: 'wrap',
          },
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          '& .MuiInputLabel-formControl, & .MuiInputLabel-shrink': {
            ...(ownerState.size === 'small' && { fontSize: '0.875rem' }),
          },
        }),
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          'label+&&': { margin: 0 },
          minHeight: '32px',
          ...(ownerState.size === 'small' && { minHeight: '24px' }),
          ...(ownerState.size === 'large' && { minHeight: '40px' }),
          '& .MuiSelect-icon': { right: '8px', fontSize: '1.5rem' },
          '&.Mui-focused': {
            outline: `${sizingTokens.focusRing.width}px solid ${colorTokens.primaryStates.light.focusVisible} !important`,
            outlineOffset: `${sizingTokens.focusRing.outlineOffset.default}px !important`,
            borderRadius: borderRadiusTokens.small,
          },
        }),
        input: ({ ownerState }: any) => ({
          padding: '4px 0',
          ...(ownerState.size === 'small' && {
            fontSize: '0.875rem',
            padding: '2px 0',
          }),
          ...(ownerState.size === 'large' && {
            fontSize: '1.25rem',
            padding: '5.4px 0',
          }),
        }),
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.input.helper),
          marginLeft: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
      },
      defaultProps: {
        elevation: componentElevationTokens.card,
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.circular,
          width: sizingTokens.avatar.medium,
          height: sizingTokens.avatar.medium,
          ...createResponsiveTypography(typographyTokens.avatar.initialsMd),
        },
      },
    },

    MuiAppBar: {
      defaultProps: {
        elevation: componentElevationTokens.appBar,
      },
      styleOverrides: {
        root: {
          minHeight: sizingTokens.appBar.mobile,
          '@media (min-width:900px)': {
            minHeight: sizingTokens.appBar.desktop,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: sizingTokens.drawer.standard,
        },
      },
    },

    MuiBottomNavigation: {
      defaultProps: {
        elevation: componentElevationTokens.bottomNavigation,
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.bottomNavigation.defaultLabel),
        },
        label: {
          ...createResponsiveTypography(typographyTokens.bottomNavigation.actionsLabel),
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          minHeight: sizingTokens.fab.large,
          minWidth: sizingTokens.fab.large,
          borderRadius: borderRadiusTokens.circular,
          textTransform: typographyTokens.textTransform,
          ...createResponsiveTypography(typographyTokens.button.medium),
        },
        sizeSmall: {
          minHeight: sizingTokens.fab.small,
          minWidth: sizingTokens.fab.small,
          ...createResponsiveTypography(typographyTokens.button.small),
        },
        sizeMedium: {
          minHeight: sizingTokens.fab.medium,
          minWidth: sizingTokens.fab.medium,
        },
        extended: {
          borderRadius: borderRadiusTokens.medium,
          padding: `0 ${spacingTokens.values[4]}px`,
          gap: spacingTokens.values[2],
        },
        primary: {
          '&:hover': {
            backgroundColor: colorTokens.primary[900],
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        secondary: {
          '&:hover': {
            backgroundColor: colorTokens.secondary[900],
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        error: {
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
        info: {
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.infoStates.light.focusVisible}`,
          },
        },
        success: {
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.successStates.light.focusVisible}`,
          },
        },
        warning: {
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.warningStates.light.focusVisible}`,
          },
        },
      },
    },

    // Ensure all interactive elements meet touch target requirements
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2,
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': { color: colorTokens.primary[700] },
          '&:hover': { backgroundColor: colorTokens.primaryStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorSecondary: {
          '&.Mui-checked': { color: colorTokens.secondary[700] },
          '&:hover': { backgroundColor: colorTokens.secondaryStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        colorError: {
          '&.Mui-checked': { color: colorTokens.error.main },
          '&:hover': { backgroundColor: colorTokens.errorStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2,
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': { color: colorTokens.primary[700] },
          '&:hover': { backgroundColor: colorTokens.primaryStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorSecondary: {
          '&.Mui-checked': { color: colorTokens.secondary[700] },
          '&:hover': { backgroundColor: colorTokens.secondaryStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.secondaryStates.light.focusVisible}`,
          },
        },
        colorError: {
          '&.Mui-checked': { color: colorTokens.error.main },
          '&:hover': { backgroundColor: colorTokens.errorStates.light.hover },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.errorStates.light.focusVisible}`,
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: (sizingTokens.touchTarget.min - sizingTokens.icon.medium) / 2,
        },
        switchBase: {
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: colorTokens.primary[700],
            '& + .MuiSwitch-track': { backgroundColor: colorTokens.primary[700] },
          },
          '&:hover': { backgroundColor: colorTokens.primaryStates.light.hover },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: colorTokens.secondary[700],
            '& + .MuiSwitch-track': { backgroundColor: colorTokens.secondary[700] },
          },
          '&:hover': { backgroundColor: colorTokens.secondaryStates.light.hover },
        },
        colorError: {
          '&.Mui-checked': {
            color: colorTokens.error.main,
            '& + .MuiSwitch-track': { backgroundColor: colorTokens.error.main },
          },
          '&:hover': { backgroundColor: colorTokens.errorStates.light.hover },
        },
        colorSuccess: {
          '&.Mui-checked': {
            color: colorTokens.success.main,
            '& + .MuiSwitch-track': { backgroundColor: colorTokens.success.main },
          },
          '&:hover': { backgroundColor: colorTokens.successStates.light.hover },
        },
      },
    },

    // Tabs - CDS primary state colors
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: typographyTokens.textTransform,
          fontWeight: typographyTokens.fontWeightMedium,
          ...createResponsiveTypography(typographyTokens.button.medium),
          minHeight: sizingTokens.touchTarget.min,
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-selected': {
            color: colorTokens.primary[700],
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // Chip - CDS state colors
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.extraSmall,
        },
        sizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.chip.small),
          ...createResponsiveTypography(typographyTokens.chip.small),
        },
        sizeMedium: {
          ...createResponsiveSizeObject(sizingTokens.chip.medium),
          ...createResponsiveTypography(typographyTokens.chip.medium),
        },
        colorPrimary: {
          backgroundColor: colorTokens.primary[100],
          color: colorTokens.primary[700],
          '&:hover': { backgroundColor: colorTokens.primary[200] },
        },
        colorSecondary: {
          backgroundColor: colorTokens.secondary[100],
          color: colorTokens.secondary[700],
          '&:hover': { backgroundColor: colorTokens.secondary[200] },
        },
        colorError: {
          backgroundColor: colorTokens.errorOpacity[8],
          color: colorTokens.error.darkText,
          '&:hover': { backgroundColor: colorTokens.errorOpacity[12] },
        },
        colorWarning: {
          backgroundColor: colorTokens.warningOpacity[8],
          color: colorTokens.warning.darkText,
          '&:hover': { backgroundColor: colorTokens.warningOpacity[12] },
        },
        colorInfo: {
          backgroundColor: colorTokens.infoOpacity[8],
          color: colorTokens.info.darkText,
          '&:hover': { backgroundColor: colorTokens.infoOpacity[12] },
        },
        colorSuccess: {
          backgroundColor: colorTokens.successOpacity[8],
          color: colorTokens.success.darkText,
          '&:hover': { backgroundColor: colorTokens.successOpacity[12] },
        },
        outlined: {
          borderColor: colorTokens.divider,
        },
        clickable: {
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&:active': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // List Item - CDS state colors
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // Menu Item - CDS state colors with responsive typography
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.menuItem.default),
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: colorTokens.primaryStates.light.focus,
          },
        },
        dense: {
          ...createResponsiveTypography(typographyTokens.menuItem.dense),
        },
      },
    },

    // Toggle Button - CDS state colors, radius, typography
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: typographyTokens.textTransform,
          borderRadius: borderRadiusTokens.small,
          ...createResponsiveTypography(typographyTokens.button.medium),
          '&:hover': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            color: colorTokens.primary[700],
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        sizeSmall: {
          ...createResponsiveTypography(typographyTokens.button.small),
        },
        sizeLarge: {
          ...createResponsiveTypography(typographyTokens.button.large),
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
        grouped: {
          '&:not(:first-of-type)': {
            borderLeft: `${sizingTokens.border.thin}px solid ${colorTokens.divider}`,
          },
        },
      },
    },

    // Slider - CDS primary colors
    MuiSlider: {
      styleOverrides: {
        root: {
          color: colorTokens.primary[700],
        },
        thumb: {
          '&:hover': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.sliderSpread}px ${colorTokens.primaryStates.light.hover}`,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.sliderSpread}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
        colorSecondary: {
          color: colorTokens.secondary[700],
          '& .MuiSlider-thumb': {
            '&:hover': {
              boxShadow: `0 0 0 ${sizingTokens.focusRing.sliderSpread}px ${colorTokens.secondaryStates.light.hover}`,
            },
            '&.Mui-focusVisible': {
              boxShadow: `0 0 0 ${sizingTokens.focusRing.sliderSpread}px ${colorTokens.secondaryStates.light.focusVisible}`,
            },
          },
        },
        valueLabel: {
          ...createResponsiveTypography(typographyTokens.slider.valueLabel),
          backgroundColor: colorTokens.grey[700],
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    // Table - Responsive sizing and typography
    MuiTableCell: {
      styleOverrides: {
        root: {
          ...createResponsiveSizeObject(sizingTokens.table.cell),
          ...createResponsiveTypography(typographyTokens.table.cell),
          'tbody tr:last-child &': {
            borderBottom: 'none',
          },
        },
        head: {
          ...createResponsiveSizeObject(sizingTokens.table.header),
          ...createResponsiveTypography(typographyTokens.table.header),
          fontWeight: typographyTokens.fontWeightSemiBold,
          backgroundColor: colorTokens.background.tertiary,
        },
        footer: {
          ...createResponsiveTypography(typographyTokens.table.footer),
        },
      },
    },

    // Alert - CDS severity colors and typography
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          ...createResponsiveTypography(typographyTokens.alert.description),
        },
        // Standard variant — light background with dark text
        standardError: {
          backgroundColor: colorTokens.errorOpacity[4],
          color: colorTokens.error.darkText,
        },
        standardSuccess: {
          backgroundColor: colorTokens.successOpacity[4],
          color: colorTokens.success.darkText,
        },
        standardWarning: {
          backgroundColor: colorTokens.warningOpacity[4],
          color: colorTokens.warning.darkText,
        },
        standardInfo: {
          backgroundColor: colorTokens.infoOpacity[4],
          color: colorTokens.info.darkText,
        },
        // Filled variant — solid background with contrast text
        filledError: {
          backgroundColor: colorTokens.error.main,
          color: colorTokens.error.contrastText,
        },
        filledSuccess: {
          backgroundColor: colorTokens.success.main,
          color: colorTokens.success.contrastText,
        },
        filledWarning: {
          backgroundColor: colorTokens.warning.main,
          color: colorTokens.warning.contrastText,
        },
        filledInfo: {
          backgroundColor: colorTokens.info.main,
          color: colorTokens.info.contrastText,
        },
        // Outlined variant — border with light background
        outlinedError: {
          borderColor: colorTokens.error.main,
          color: colorTokens.error.darkText,
          backgroundColor: colorTokens.errorOpacity[4],
        },
        outlinedSuccess: {
          borderColor: colorTokens.success.main,
          color: colorTokens.success.darkText,
          backgroundColor: colorTokens.successOpacity[4],
        },
        outlinedWarning: {
          borderColor: colorTokens.warning.main,
          color: colorTokens.warning.darkText,
          backgroundColor: colorTokens.warningOpacity[4],
        },
        outlinedInfo: {
          borderColor: colorTokens.info.main,
          color: colorTokens.info.darkText,
          backgroundColor: colorTokens.infoOpacity[4],
        },
      },
    },

    MuiAlertTitle: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.alert.title),
        },
      },
    },

    // ========================================
    // DIALOG - CDS tokens for modals/dialogs
    // ========================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadiusTokens.medium,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.dialog.title),
          padding: `${spacingTokens.values[4]}px ${spacingTokens.values[6]}px`,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.dialog.content),
          padding: `${spacingTokens.values[2]}px ${spacingTokens.values[6]}px`,
        },
      },
    },

    MuiDialogContentText: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.dialog.content),
          color: colorTokens.text.secondary,
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: `${spacingTokens.values[2]}px ${spacingTokens.values[6]}px ${spacingTokens.values[4]}px`,
        },
      },
    },

    // ========================================
    // TOOLTIP - CDS styling
    // ========================================
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...createResponsiveTypography(typographyTokens.tooltip.default),
          backgroundColor: colorTokens.grey[700],
          borderRadius: borderRadiusTokens.small,
        },
        arrow: {
          color: colorTokens.grey[700],
        },
      },
    },

    // ========================================
    // BADGE - CDS typography
    // ========================================
    MuiBadge: {
      styleOverrides: {
        badge: {
          ...createResponsiveTypography(typographyTokens.badge.default),
        },
      },
    },

    // ========================================
    // AUTOCOMPLETE - CDS border-radius and spacing
    // ========================================
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadiusTokens.small,
        },
        listbox: {
          padding: `${spacingTokens.values[1]}px 0`,
        },
        option: {
          ...createResponsiveTypography(typographyTokens.body1),
          '&[aria-selected="true"]': {
            backgroundColor: colorTokens.primaryStates.light.selected,
          },
          '&.Mui-focused': {
            backgroundColor: colorTokens.primaryStates.light.hover,
          },
        },
        tag: {
          ...createResponsiveSizeObject(sizingTokens.chipInField.medium),
          ...createResponsiveTypography(typographyTokens.chip.small),
        },
        tagSizeSmall: {
          ...createResponsiveSizeObject(sizingTokens.chipInField.small),
          ...createResponsiveTypography(typographyTokens.chip.small),
        },
      },
    },

    // ========================================
    // SELECT - CDS input tokens
    // ========================================
    MuiSelect: {
      styleOverrides: {
        select: {
          ...createResponsiveTypography(typographyTokens.input.valueMd),
        },
      },
      defaultProps: {
        variant: componentDefaultsTokens.select.variant,
      },
    },

    // ========================================
    // BUTTON GROUP - CDS border-radius
    // ========================================
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
        },
        grouped: {
          '&:not(:last-of-type)': {
            borderColor: colorTokens.divider,
          },
        },
      },
    },

    // ========================================
    // TABS - CDS indicator
    // ========================================
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colorTokens.primary[700],
          height: spacingTokens.values[0.5],
        },
      },
    },

    // ========================================
    // STEPPER - CDS colors and typography
    // ========================================
    MuiStepLabel: {
      styleOverrides: {
        label: {
          ...createResponsiveTypography(typographyTokens.stepper.label),
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: colorTokens.grey[400],
          '&.Mui-active': { color: colorTokens.primary[700] },
          '&.Mui-completed': { color: colorTokens.primary[700] },
        },
      },
    },

    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: colorTokens.divider,
        },
      },
    },

    // ========================================
    // PROGRESS - CDS sizing and colors
    // ========================================
    MuiCircularProgress: {
      defaultProps: {
        thickness: sizingTokens.progress.circularThickness,
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          height: spacingTokens.base,
        },
      },
    },

    // ========================================
    // SKELETON - CDS animation and radius
    // ========================================
    MuiSkeleton: {
      styleOverrides: {
        rectangular: {
          borderRadius: borderRadiusTokens.small,
        },
        rounded: {
          borderRadius: borderRadiusTokens.medium,
        },
      },
      defaultProps: {
        animation: componentDefaultsTokens.skeleton.animation,
      },
    },

    // ========================================
    // SNACKBAR - CDS defaults
    // ========================================
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: componentDefaultsTokens.snackbar.anchorOrigin,
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          ...createResponsiveTypography(typographyTokens.body1),
        },
      },
    },

    // ========================================
    // ACCORDION - CDS surfaces
    // ========================================
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          border: `${sizingTokens.border.thin}px solid ${colorTokens.divider}`,
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: 0,
            borderColor: colorTokens.primary.main,
          },
        },
      },
      defaultProps: {
        disableGutters: componentDefaultsTokens.accordion.disableGutters,
        elevation: componentElevationTokens.none,
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.subtitle2),
          minHeight: sizingTokens.touchTarget.min,
          '&.Mui-expanded': { minHeight: sizingTokens.touchTarget.min },
          '&:focus': { backgroundColor: 'transparent' },
          '&:hover': { backgroundColor: colorTokens.action.hover },
        },
        content: {
          '&.Mui-expanded': { margin: `${spacingTokens.values[3]}px 0` },
        },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.body1),
          padding: `0 ${spacingTokens.values[4]}px ${spacingTokens.values[4]}px`,
        },
      },
    },

    // ========================================
    // CARD sub-components - CDS spacing and typography
    // ========================================
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: spacingTokens.values[4],
          '&:last-child': { paddingBottom: spacingTokens.values[4] },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: spacingTokens.values[4],
        },
        title: {
          ...createResponsiveTypography(typographyTokens.h6),
        },
        subheader: {
          ...createResponsiveTypography(typographyTokens.body2),
          color: colorTokens.text.secondary,
        },
      },
    },

    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: `${spacingTokens.values[2]}px ${spacingTokens.values[4]}px`,
        },
      },
    },

    MuiCardActionArea: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // ========================================
    // TABLE family - CDS state colors and borders
    // ========================================
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          border: `${sizingTokens.border.thin}px solid ${colorTokens.divider}`,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colorTokens.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.primaryStates.light.selected,
            '&:hover': {
              backgroundColor: colorTokens.primaryStates.light.hover,
            },
          },
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.body2),
        },
        selectLabel: {
          ...createResponsiveTypography(typographyTokens.body2),
        },
        displayedRows: {
          ...createResponsiveTypography(typographyTokens.body2),
        },
      },
    },

    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: colorTokens.text.primary,
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // ========================================
    // TOOLBAR - CDS responsive sizing
    // ========================================
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: sizingTokens.appBar.mobile,
          '@media (min-width:900px)': {
            minHeight: sizingTokens.appBar.desktop,
          },
        },
      },
    },

    // ========================================
    // BREADCRUMBS - CDS typography
    // ========================================
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.body1),
        },
        separator: {
          color: colorTokens.text.hint,
        },
      },
    },

    // ========================================
    // PAGINATION - CDS state colors
    // ========================================
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: borderRadiusTokens.small,
          ...createResponsiveTypography(typographyTokens.body2),
          minWidth: sizingTokens.button.medium.desktop,
          height: sizingTokens.button.medium.desktop,
          '&.Mui-selected': {
            backgroundColor: colorTokens.primary[700],
            color: colorTokens.primary.contrastText,
            '&:hover': {
              backgroundColor: colorTokens.primary[900],
            },
          },
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 ${sizingTokens.focusRing.width}px ${colorTokens.primaryStates.light.focusVisible}`,
          },
        },
      },
    },

    // ========================================
    // MENU & POPOVER - CDS surfaces
    // ========================================
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    MuiMenuList: {
      styleOverrides: {
        root: {
          padding: `${spacingTokens.values[1]}px 0`,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadiusTokens.small,
        },
      },
    },

    // ========================================
    // DIVIDER - CDS divider color
    // ========================================
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colorTokens.divider,
        },
      },
    },

    // ========================================
    // LIST family - CDS typography and spacing
    // ========================================
    MuiList: {
      styleOverrides: {
        root: {
          padding: `${spacingTokens.values[1]}px 0`,
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          ...createResponsiveTypography(typographyTokens.body1),
        },
        secondary: {
          ...createResponsiveTypography(typographyTokens.body2),
          color: colorTokens.text.secondary,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: sizingTokens.avatar.medium,
          color: colorTokens.text.tertiary,
        },
      },
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          ...createResponsiveTypography(typographyTokens.caption),
          color: colorTokens.text.secondary,
          lineHeight: `${spacingTokens.values[8]}px`,
        },
      },
    },

    // ========================================
    // RATING - CDS warning color
    // ========================================
    MuiRating: {
      styleOverrides: {
        root: {
          color: colorTokens.warning.main,
          fontSize: sizingTokens.icon.medium,
        },
        iconEmpty: {
          color: colorTokens.grey[300],
        },
        sizeSmall: {
          fontSize: sizingTokens.icon.small,
        },
        sizeLarge: {
          fontSize: sizingTokens.icon.large,
        },
      },
    },

    // ========================================
    // CONTAINER - CDS defaults
    // ========================================
    MuiContainer: {
      defaultProps: {
        maxWidth: componentDefaultsTokens.container.maxWidth,
      },
    },

    // ========================================
    // CSS BASELINE - CDS font and background
    // ========================================
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typographyTokens.fontFamily,
          backgroundColor: colorTokens.background.default,
        },
      },
    },

    // ========================================
    // MODAL & BACKDROP - CDS overlay
    // ========================================
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: colorTokens.backdrop.standard,
        },
      },
    },
  },
};

/**
 * CDS Theme Instance
 * Ready-to-use theme for ThemeProvider with full responsive support
 *
 * @example
 * import { ThemeProvider } from '@mui/material/styles';
 * import { cdsTheme } from './theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={cdsTheme}>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 */
export const cdsTheme = createTheme(themeOptions);

// Export tokens for direct access if needed
export * from './tokens';

// Export theme type for TypeScript
export type CDSTheme = typeof cdsTheme;

// Export helper functions for custom components
export {
  createResponsiveTypography,
  createResponsiveSize,
  createResponsiveSizeObject,
  createResponsiveSpacing,
};

/**
 * Responsive Design System Usage Guide
 * ====================================
 *
 * The CDS theme now fully supports responsive design across 3 breakpoints:
 * - Mobile: < 600px (base values)
 * - Tablet: 600-899px
 * - Desktop: >= 900px
 *
 * RESPONSIVE FEATURES:
 * -------------------
 * 1. Typography: All text styles adapt across breakpoints
 *    - Body text increases from 14px (desktop) to 16px (tablet/mobile)
 *    - Button text adjusts for better touch targets
 *    - Headings maintain hierarchy across all devices
 *
 * 2. Component Sizing: Components scale appropriately
 *    - Buttons: Small (28/32/32), Medium (32/36/36), Large (40/44/44)
 *    - Inputs: Follow similar responsive patterns
 *    - Chips: Scale for better touch interaction
 *    - Tables: Row heights increase on mobile
 *
 * 3. Spacing: Large spacing values adapt to screen size
 *    - Use spacingTokens.responsive for margins/padding that should scale
 *    - Fixed spacing available in spacingTokens.values
 *
 * USING RESPONSIVE VALUES:
 * -----------------------
 * For custom components, use the helper functions:
 *
 * @example
 * import { createResponsiveTypography, sizingTokens } from './theme';
 *
 * const MyComponent = styled('div')({
 *   ...createResponsiveTypography(typographyTokens.body1),
 *   ...createResponsiveSizeObject(sizingTokens.button.medium),
 * });
 *
 * BACKWARD COMPATIBILITY:
 * ----------------------
 * All existing components continue to work as before.
 * The responsive values enhance the design system without breaking changes.
 */
