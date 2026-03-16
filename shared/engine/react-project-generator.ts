/**
 * React Project Generator for CDS-Assist
 *
 * Scaffolds production-ready Vite + React + TypeScript projects
 * using the CDS Design System. The generator reads template files
 * from shared/templates/ and applies project-specific substitutions.
 *
 * Usage by the AI agent:
 *   1. Parse user prompt → extract project name, suite name, pages needed
 *   2. Call scaffoldProject() to create the base project
 *   3. Call addPage() for each additional page beyond the default dashboard
 *   4. Call addRoute() to wire pages into App.tsx
 *   5. Run npm install && npm run dev → verify in browser
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProjectConfig {
  projectSlug: string;
  projectDescription: string;
  appTitle: string;
  suiteName: string;
  suiteSlug: string;
  layoutName: string;
  outputDir: string;
  additionalDeps?: Record<string, string>;
  pages?: PageConfig[];
}

export interface PageConfig {
  name: string;
  slug: string;
  pattern: 'dashboard' | 'list' | 'detail' | 'form' | 'settings';
  route: string;
}

interface TemplateVars {
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Template engine
// ---------------------------------------------------------------------------

const TEMPLATE_DIR = path.resolve(__dirname, '..', 'templates');

function readTemplate(relativePath: string): string {
  const fullPath = path.join(TEMPLATE_DIR, relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
}

function applyVars(content: string, vars: TemplateVars): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, value);
  }
  return result;
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ---------------------------------------------------------------------------
// Project scaffolding
// ---------------------------------------------------------------------------

export function scaffoldProject(config: ProjectConfig): string[] {
  const vars: TemplateVars = {
    PROJECT_SLUG: config.projectSlug,
    PROJECT_DESCRIPTION: config.projectDescription,
    APP_TITLE: config.appTitle,
    SUITE_DISPLAY_NAME: config.suiteName,
    SUITE_SLUG: config.suiteSlug,
    LAYOUT_NAME: config.layoutName,
    OPEN_BRACE: '{',
  };

  const out = config.outputDir;
  const created: string[] = [];

  const templateMap: Record<string, string> = {
    'package.json.template': 'package.json',
    'index.html.template': 'index.html',
    'vite.config.ts.template': 'vite.config.ts',
    'tsconfig.json.template': 'tsconfig.json',
    'tsconfig.app.json.template': 'tsconfig.app.json',
    'tsconfig.node.json.template': 'tsconfig.node.json',
    'eslint.config.js.template': 'eslint.config.js',
    '.gitignore.template': '.gitignore',
    'src/main.tsx.template': 'src/main.tsx',
    'src/global.css.template': 'src/global.css',
    'src/vite-env.d.ts.template': 'src/vite-env.d.ts',
    'src/theme/index.ts.template': 'src/theme/index.ts',
    'src/contexts/ThemeContext.tsx.template': 'src/contexts/ThemeContext.tsx',
    'src/components/ErrorBoundary.tsx.template': 'src/components/ErrorBoundary.tsx',
    'src/components/BaseLayout.tsx.template': 'src/components/BaseLayout.tsx',
    'src/config/navBarTypes.ts.template': 'src/config/navBarTypes.ts',
  };

  for (const [templateFile, outputFile] of Object.entries(templateMap)) {
    const content = applyVars(readTemplate(templateFile), vars);
    const filePath = path.join(out, outputFile);
    writeFile(filePath, content);
    created.push(outputFile);
  }

  // Suite-specific files (require slug substitution in filenames)
  const suiteNavContent = applyVars(
    readTemplate('src/config/suiteNavConfig.ts.template'),
    vars,
  );
  const suiteNavPath = path.join(out, `src/config/${config.suiteSlug}NavConfig.ts`);
  writeFile(suiteNavPath, suiteNavContent);
  created.push(`src/config/${config.suiteSlug}NavConfig.ts`);

  const layoutContent = applyVars(
    readTemplate('src/layouts/SuiteLayout.tsx.template'),
    vars,
  );
  const layoutPath = path.join(out, `src/layouts/${config.layoutName}.tsx`);
  writeFile(layoutPath, layoutContent);
  created.push(`src/layouts/${config.layoutName}.tsx`);

  // Default dashboard page
  const dashboardContent = applyVars(
    readTemplate('src/pages/DashboardPage.tsx.template'),
    vars,
  );
  const dashboardPath = path.join(
    out,
    `src/pages/${config.suiteSlug}/DashboardPage.tsx`,
  );
  writeFile(dashboardPath, dashboardContent);
  created.push(`src/pages/${config.suiteSlug}/DashboardPage.tsx`);

  // App.tsx
  const appContent = applyVars(readTemplate('src/App.tsx.template'), vars);
  writeFile(path.join(out, 'src/App.tsx'), appContent);
  created.push('src/App.tsx');

  // Merge additional dependencies if specified
  if (config.additionalDeps && Object.keys(config.additionalDeps).length > 0) {
    const pkgPath = path.join(out, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.dependencies = { ...pkg.dependencies, ...config.additionalDeps };
    writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  }

  return created;
}

// ---------------------------------------------------------------------------
// Page generator (adds pages to existing project)
// ---------------------------------------------------------------------------

export function addPage(
  projectDir: string,
  suiteSlug: string,
  page: PageConfig,
): string {
  const filePath = path.join(
    projectDir,
    `src/pages/${suiteSlug}/${page.name}.tsx`,
  );

  if (fs.existsSync(filePath)) {
    return `SKIP: ${filePath} already exists`;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  return filePath;
}

// ---------------------------------------------------------------------------
// Route helper
// ---------------------------------------------------------------------------

export function generateRouteEntry(page: PageConfig): string {
  return `<Route path="${page.route}" element={<${page.name} />} />`;
}

export function generateLazyImport(suiteSlug: string, page: PageConfig): string {
  return `const ${page.name} = lazy(() => import('./pages/${suiteSlug}/${page.name}'));`;
}

// ---------------------------------------------------------------------------
// Verification helpers
// ---------------------------------------------------------------------------

export interface VerificationResult {
  step: string;
  passed: boolean;
  message: string;
}

export function verifyProjectStructure(projectDir: string): VerificationResult[] {
  const results: VerificationResult[] = [];

  const requiredFiles = [
    'package.json',
    'index.html',
    'vite.config.ts',
    'tsconfig.json',
    'src/main.tsx',
    'src/App.tsx',
    'src/theme/index.ts',
    'src/contexts/ThemeContext.tsx',
    'src/components/BaseLayout.tsx',
    'src/components/ErrorBoundary.tsx',
  ];

  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(projectDir, file));
    results.push({
      step: `File exists: ${file}`,
      passed: exists,
      message: exists ? 'OK' : `MISSING: ${file}`,
    });
  }

  // Check package.json has required deps
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectDir, 'package.json'), 'utf-8'),
    );
    const requiredDeps = [
      '@mui/material',
      '@opengov/capital-mui-theme',
      '@opengov/components-page-header',
      'react',
      'react-router-dom',
    ];
    for (const dep of requiredDeps) {
      const hasDep = dep in (pkg.dependencies || {});
      results.push({
        step: `Dependency: ${dep}`,
        passed: hasDep,
        message: hasDep ? 'OK' : `MISSING dependency: ${dep}`,
      });
    }
  } catch {
    results.push({
      step: 'Parse package.json',
      passed: false,
      message: 'Could not parse package.json',
    });
  }

  return results;
}
