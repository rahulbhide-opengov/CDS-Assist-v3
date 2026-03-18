// Type definitions for Figma variable collections
// These types ensure type safety when mapping Figma variables to code

import type { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Figma variable collection types
export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: FigmaVariableMode[];
  variables: FigmaVariable[];
}

export interface FigmaVariableMode {
  id: string;
  name: 'Light' | 'Dark' | 'Default';
}

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaVariableValue>;
  scopes?: FigmaVariableScope[];
}

export type FigmaVariableValue =
  | { type: 'COLOR'; value: string }
  | { type: 'FLOAT'; value: number }
  | { type: 'STRING'; value: string }
  | { type: 'BOOLEAN'; value: boolean }
  | { type: 'ALIAS'; value: string }; // Reference to another variable

export type FigmaVariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR';

// Mapping between Figma variable names and design token paths
export interface FigmaToTokenMapping {
  // Color mappings
  'color/primary/base': keyof typeof capitalDesignTokens.foundations.colors;
  'color/primary/light': keyof typeof capitalDesignTokens.foundations.colors;
  'color/primary/dark': keyof typeof capitalDesignTokens.foundations.colors;
  'color/semantic/success': keyof typeof capitalDesignTokens.semanticColors.foreground;
  'color/semantic/error': keyof typeof capitalDesignTokens.semanticColors.foreground;
  'color/semantic/warning': keyof typeof capitalDesignTokens.semanticColors.foreground;
  'color/semantic/info': keyof typeof capitalDesignTokens.semanticColors.foreground;

  // Spacing mappings
  'spacing/xs': keyof typeof capitalDesignTokens.foundations.units;
  'spacing/sm': keyof typeof capitalDesignTokens.foundations.units;
  'spacing/md': keyof typeof capitalDesignTokens.foundations.units;
  'spacing/lg': keyof typeof capitalDesignTokens.foundations.units;
  'spacing/xl': keyof typeof capitalDesignTokens.foundations.units;

  // Typography mappings
  'typography/heading/1': keyof typeof capitalDesignTokens.foundations.typography.fontSize;
  'typography/heading/2': keyof typeof capitalDesignTokens.foundations.typography.fontSize;
  'typography/heading/3': keyof typeof capitalDesignTokens.foundations.typography.fontSize;
  'typography/body/default': keyof typeof capitalDesignTokens.foundations.typography.fontSize;
  'typography/body/small': keyof typeof capitalDesignTokens.foundations.typography.fontSize;

  // Border radius mappings
  'radius/small': number;
  'radius/medium': number;
  'radius/large': number;
  'radius/full': number;
}

// Component property mappings
export interface FigmaComponentProperties {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'hover' | 'active' | 'disabled';
  icon?: boolean;
  label?: string;
}

// Validated token reference type
export type ValidatedTokenReference<T extends keyof FigmaToTokenMapping> = {
  figmaVariable: T;
  tokenPath: FigmaToTokenMapping[T];
  value: string | number;
  validated: boolean;
};

// Runtime validation result
export interface TokenValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  mappedTokens: ValidatedTokenReference<keyof FigmaToTokenMapping>[];
}

// Helper type for extracting color tokens
export type ColorToken = Extract<keyof FigmaToTokenMapping, `color/${string}`>;

// Helper type for extracting spacing tokens
export type SpacingToken = Extract<keyof FigmaToTokenMapping, `spacing/${string}`>;

// Helper type for extracting typography tokens
export type TypographyToken = Extract<keyof FigmaToTokenMapping, `typography/${string}`>;

// Figma file reference
export interface FigmaFileReference {
  fileKey: string;
  nodeId?: string;
  fileName?: string;
  lastSynced?: Date;
}

// Sync metadata
export interface FigmaSyncMetadata {
  file: FigmaFileReference;
  collections: FigmaVariableCollection[];
  lastSyncTime: Date;
  version: string;
}