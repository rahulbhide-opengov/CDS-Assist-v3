/**
 * DesignTokensSection
 *
 * Displays design tokens from marketing-styles.ts including:
 * - Color palette swatches
 * - Typography examples
 * - Layout pattern demos
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Grid, Collapse, Button, useTheme } from '@mui/material';
import { Code as CodeIcon, CodeOff as CodeOffIcon } from '@mui/icons-material';
import { cdsColors } from '../../../theme/cds';
import { CodeBlock } from '../../docs';
import {
  displayHeading,
  sectionHeading,
  sectionSubheading,
  eyebrowLabel,
  articleHeading,
  articleBody,
  splitSection,
  threeColumnGrid,
  statsGrid,
  featureCard,
  arrowList,
} from '../../../theme/marketing-styles';
import {
  typographyTokens,
  layoutTokens,
} from '../../../data/marketingDocsData';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';
import { FOUNDATION, MIDNIGHT } from '../../../theme/marketing-palette';

const colors = cdsColors;

interface TokenBlockProps {
  title: string;
  children: React.ReactNode;
  code?: string;
}

const TokenBlock: React.FC<TokenBlockProps> = ({ title, children, code }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '4px',
        overflow: 'hidden',
        mb: 3,
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        {code && (
          <Button
            size="small"
            variant="outlined"
            startIcon={showCode ? <CodeOffIcon /> : <CodeIcon />}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide' : 'Code'}
          </Button>
        )}
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
      {code && (
        <Collapse in={showCode}>
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <CodeBlock>{code}</CodeBlock>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

// Theme System palette mapping for documentation
const paletteMapping = [
  { token: 'background', muiPath: 'palette.background.default', light: FOUNDATION.background, dark: MIDNIGHT.background },
  { token: 'surface', muiPath: 'palette.background.paper', light: FOUNDATION.surface, dark: MIDNIGHT.surface },
  { token: 'foreground', muiPath: 'palette.text.primary', light: FOUNDATION.foreground, dark: MIDNIGHT.foreground },
  { token: 'muted', muiPath: 'palette.text.secondary', light: FOUNDATION.muted, dark: MIDNIGHT.muted },
  { token: 'accent', muiPath: 'palette.primary.main', light: FOUNDATION.accent, dark: MIDNIGHT.accent },
  { token: 'border', muiPath: 'palette.divider', light: FOUNDATION.border, dark: MIDNIGHT.border },
  { token: 'hoverBg', muiPath: 'palette.action.hover', light: FOUNDATION.hoverBg, dark: MIDNIGHT.hoverBg },
];

export const DesignTokensSection: React.FC = () => {
  const theme = useTheme();
  const { marketingMode, isDark } = useMarketingTheme();

  return (
    <Box>
      {/* Theme System */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
      >
        Theme System
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        The marketing theme extends MUI's <code>capitalMuiTheme</code> with FOUNDATION (light) and MIDNIGHT (dark) palettes.
        All MUI components automatically respond to theme changes.
      </Typography>

      <TokenBlock
        title="Architecture"
        code={`// MarketingThemeProvider structure
MarketingThemeProvider
├── MarketingThemeContext.Provider (state + toggle function)
│   └── MuiThemeProvider (theme={createMarketingTheme(mode)})
│       └── children (all MUI components auto-themed)`}
      >
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.8, color: 'text.primary' }}>
          <Box>MarketingThemeProvider</Box>
          <Box sx={{ pl: 2, color: 'text.secondary' }}>├── MarketingThemeContext.Provider <Typography component="span" sx={{ color: 'primary.main', fontSize: 'inherit' }}>(state + toggle)</Typography></Box>
          <Box sx={{ pl: 4, color: 'text.secondary' }}>└── MuiThemeProvider <Typography component="span" sx={{ color: 'primary.main', fontSize: 'inherit' }}>(theme={'{'}createMarketingTheme(mode){'}'})</Typography></Box>
          <Box sx={{ pl: 6, color: 'text.secondary' }}>└── children <Typography component="span" sx={{ color: 'success.main', fontSize: 'inherit' }}>(auto-themed)</Typography></Box>
        </Box>
      </TokenBlock>

      <TokenBlock
        title="Color Palette Mapping"
        code={`// Marketing tokens → MUI palette paths
| Token       | MUI Path                  |
|-------------|---------------------------|
| background  | palette.background.default |
| surface     | palette.background.paper   |
| foreground  | palette.text.primary       |
| muted       | palette.text.secondary     |
| accent      | palette.primary.main       |
| border      | palette.divider            |
| hoverBg     | palette.action.hover       |`}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 200px 1fr 1fr',
              gap: 0,
              minWidth: 600,
            }}
          >
            {/* Header */}
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', fontWeight: 600, fontSize: '0.75rem', borderBottom: 1, borderColor: 'divider' }}>Token</Box>
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', fontWeight: 600, fontSize: '0.75rem', borderBottom: 1, borderColor: 'divider' }}>MUI Path</Box>
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', fontWeight: 600, fontSize: '0.75rem', borderBottom: 1, borderColor: 'divider' }}>FOUNDATION</Box>
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', fontWeight: 600, fontSize: '0.75rem', borderBottom: 1, borderColor: 'divider' }}>MIDNIGHT</Box>
            {/* Rows */}
            {paletteMapping.map((row, i) => (
              <React.Fragment key={row.token}>
                <Box sx={{ p: 1.5, fontFamily: 'monospace', fontSize: '0.75rem', borderBottom: i < paletteMapping.length - 1 ? 1 : 0, borderColor: 'divider', color: 'primary.main' }}>{row.token}</Box>
                <Box sx={{ p: 1.5, fontFamily: 'monospace', fontSize: '0.75rem', borderBottom: i < paletteMapping.length - 1 ? 1 : 0, borderColor: 'divider', color: 'text.secondary' }}>{row.muiPath}</Box>
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: i < paletteMapping.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: row.light, border: 1, borderColor: 'divider', flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '0.625rem', color: 'text.secondary' }}>{row.light}</Typography>
                </Box>
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: i < paletteMapping.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: row.dark, border: 1, borderColor: 'divider', flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '0.625rem', color: 'text.secondary' }}>{row.dark}</Typography>
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : colors.gray50, borderRadius: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Current mode: <strong style={{ color: theme.palette.primary.main }}>{marketingMode.toUpperCase()}</strong> ({isDark ? 'MIDNIGHT' : 'FOUNDATION'})
          </Typography>
        </Box>
      </TokenBlock>

      <TokenBlock
        title="Usage: useMarketingTheme()"
        code={`import { useMarketingTheme } from '@/contexts/MarketingThemeContext';

const MyComponent = () => {
  const { marketingMode, toggleMarketingTheme, marketingColors, isDark } = useMarketingTheme();

  return (
    <Box sx={{ bgcolor: marketingColors.background }}>
      <Button onClick={toggleMarketingTheme}>
        Switch to {isDark ? 'Light' : 'Dark'}
      </Button>
    </Box>
  );
};`}
      >
        <Stack spacing={2}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Use <code>useMarketingTheme()</code> for backward compatibility or when you need:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, color: 'text.secondary', fontSize: '0.875rem', '& li': { mb: 0.5 } }}>
            <li>Access to <code>toggleMarketingTheme()</code> function</li>
            <li>Direct color values via <code>marketingColors</code></li>
            <li>Current mode check via <code>isDark</code></li>
          </Box>
        </Stack>
      </TokenBlock>

      <TokenBlock
        title="Usage: MUI Theme Tokens (Recommended)"
        code={`// Option 1: sx prop with theme paths (recommended)
<Box sx={{ bgcolor: 'background.default' }}>
  <Typography sx={{ color: 'text.primary' }}>Hello</Typography>
  <Paper sx={{ bgcolor: 'background.paper' }}>Card</Paper>
</Box>

// Option 2: useTheme() for programmatic access
import { useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  return <div style={{ color: theme.palette.text.primary }} />;
};`}
      >
        <Stack spacing={2}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Prefer MUI theme tokens for automatic theme responsiveness:
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>background.paper</Typography>
                <Typography sx={{ color: 'text.primary' }}>text.primary</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>text.secondary</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>action.hover</Typography>
                <Typography sx={{ color: 'primary.main' }}>primary.main</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>divider color</Typography>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </TokenBlock>

      <TokenBlock
        title="createMarketingTheme()"
        code={`// src/theme/marketing-theme.ts
import { createTheme } from '@mui/material/styles';
import { cdsTheme } from './cds';
import { FOUNDATION, MIDNIGHT } from './marketing-palette';

export const createMarketingTheme = (mode: 'light' | 'dark' = 'light') => {
  const palette = mode === 'light' ? FOUNDATION : MIDNIGHT;

  return createTheme(capitalMuiTheme, {
    palette: {
      mode,
      primary: { main: palette.accent },
      background: {
        default: palette.background,
        paper: palette.surface,
      },
      text: {
        primary: palette.foreground,
        secondary: palette.muted,
      },
      divider: palette.border,
      action: { hover: palette.hoverBg },
    },
  });
};`}
      >
        <Stack spacing={2}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            The theme factory extends <code>capitalMuiTheme</code> with marketing-specific overrides.
            This ensures CDS components work correctly while marketing colors are applied.
          </Typography>
          <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : colors.gray50, borderRadius: 1 }}>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
              theme.palette.mode: <strong>{theme.palette.mode}</strong>
            </Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
              theme.palette.primary.main: <strong>{theme.palette.primary.main}</strong>
            </Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
              theme.palette.background.default: <strong>{theme.palette.background.default}</strong>
            </Typography>
          </Box>
        </Stack>
      </TokenBlock>

      {/* Typography */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 3, mt: 6 }}
      >
        Typography
      </Typography>

      <TokenBlock
        title="displayHeading"
        code={`import { displayHeading } from '@/theme/marketing-styles';

<Typography sx={displayHeading}>
  Hero headline text
</Typography>`}
      >
        <Typography sx={displayHeading}>Hero headline text</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 2, fontFamily: 'monospace' }}>
          {typographyTokens.find((t) => t.name === 'displayHeading')?.styles}
        </Typography>
      </TokenBlock>

      <TokenBlock
        title="sectionHeading"
        code={`import { sectionHeading } from '@/theme/marketing-styles';

<Typography sx={sectionHeading}>
  Section title
</Typography>`}
      >
        <Typography sx={sectionHeading}>Section title</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 2, fontFamily: 'monospace' }}>
          {typographyTokens.find((t) => t.name === 'sectionHeading')?.styles}
        </Typography>
      </TokenBlock>

      <TokenBlock
        title="eyebrowLabel"
        code={`import { eyebrowLabel } from '@/theme/marketing-styles';

<Typography sx={eyebrowLabel}>
  Section Label
</Typography>`}
      >
        <Typography sx={eyebrowLabel}>Section Label</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 2, fontFamily: 'monospace' }}>
          {typographyTokens.find((t) => t.name === 'eyebrowLabel')?.styles}
        </Typography>
      </TokenBlock>

      <TokenBlock
        title="articleHeading + articleBody"
        code={`import { articleHeading, articleBody } from '@/theme/marketing-styles';

<Typography sx={articleHeading}>
  Article Title
</Typography>
<Box sx={articleBody}>
  <p>Article body text with proper line height...</p>
</Box>`}
      >
        <Typography sx={articleHeading}>Article Title</Typography>
        <Box sx={{ ...articleBody, mt: 2 }}>
          <Typography component="p">
            Article body text with proper line height for comfortable reading.
            This style is optimized for long-form content like blog posts and
            case studies.
          </Typography>
        </Box>
      </TokenBlock>

      {/* Layout Patterns */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 3, mt: 6 }}
      >
        Layout Patterns
      </Typography>

      <TokenBlock
        title="splitSection"
        code={`import { splitSection } from '@/theme/marketing-styles';

<Box sx={splitSection}>
  <Box>Left content (image)</Box>
  <Box>Right content (text)</Box>
</Box>`}
      >
        <Box sx={splitSection}>
          <Box
            sx={{
              height: 200,
              bgcolor: 'action.hover',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.disabled',
            }}
          >
            Image Column
          </Box>
          <Box>
            <Typography sx={eyebrowLabel}>Why OpenGov</Typography>
            <Typography sx={sectionHeading}>
              Transform your operations
            </Typography>
            <Typography sx={sectionSubheading}>
              Modern cloud software built specifically for government needs.
            </Typography>
          </Box>
        </Box>
      </TokenBlock>

      <TokenBlock
        title="threeColumnGrid"
        code={`import { threeColumnGrid, featureCard } from '@/theme/marketing-styles';

<Box sx={threeColumnGrid}>
  <Box sx={featureCard}>Card 1</Box>
  <Box sx={featureCard}>Card 2</Box>
  <Box sx={featureCard}>Card 3</Box>
</Box>`}
      >
        <Box sx={threeColumnGrid}>
          {[1, 2, 3].map((n) => (
            <Box key={n} sx={featureCard}>
              <Typography sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Feature {n}</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Feature description text explaining the benefit.
              </Typography>
            </Box>
          ))}
        </Box>
      </TokenBlock>

      <TokenBlock
        title="statsGrid"
        code={`import { statsGrid, statValue, statLabel } from '@/theme/marketing-styles';

<Box sx={statsGrid}>
  <Box>
    <Typography sx={statValue}>2,000+</Typography>
    <Typography sx={statLabel}>Customers</Typography>
  </Box>
</Box>`}
      >
        <Box sx={statsGrid}>
          {[
            { value: '2,000+', label: 'Customers' },
            { value: '$20B', label: 'Managed' },
            { value: '50', label: 'States' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 300,
                  lineHeight: 1,
                  color: 'primary.main',
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mt: 1,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </TokenBlock>

      <TokenBlock
        title="arrowList"
        code={`import { arrowList } from '@/theme/marketing-styles';

<Box component="ul" sx={arrowList}>
  <li>First benefit</li>
  <li>Second benefit</li>
  <li>Third benefit</li>
</Box>`}
      >
        <Box component="ul" sx={arrowList}>
          <li>Streamlined workflows and faster approvals</li>
          <li>Real-time visibility into operations</li>
          <li>Built specifically for government</li>
        </Box>
      </TokenBlock>

      {/* Token Reference Table */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 3, mt: 6 }}
      >
        Token Reference
      </Typography>

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
            bgcolor: 'action.hover',
            borderBottom: 1,
            borderColor: 'divider',
            py: 1.5,
            px: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>Token</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>Description</Typography>
        </Box>
        {layoutTokens.map((token, index) => (
          <Box
            key={token.name}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
              borderBottom:
                index < layoutTokens.length - 1
                  ? 1
                  : 0,
              borderColor: 'divider',
              py: 1.5,
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                color: 'primary.main',
              }}
            >
              {token.name}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {token.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
