import { lazy, Suspense } from 'react';
import { CssBaseline, CircularProgress, Box, GlobalStyles } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DataProvider } from './contexts/DataContext';
import PageTransition from './components/PageTransition';
import { UnifiedChatProvider } from './contexts/UnifiedChatContext';
import { UnifiedChatContainer } from './components/UnifiedChat/UnifiedChatContainer';
import { PRCommentsContainer } from './components/PRComments';
import { PersistentNavigation } from './components/navigation';
import { NavigationRenderedProvider } from './contexts/NavigationRenderedContext';

// Layout components
import { UtilityBillingLayout } from './components/UtilityBillingLayout';
import { EAMLayout } from './components/EAMLayout';
import { PrototypesLayout } from './components/PrototypesLayout';
import { BranchesLayout } from './components/BranchesLayout';
import { ProcurementLayout } from './components/ProcurementLayout';
import { AppBuilderLayout } from './components/AppBuilderLayout';
import { WorkflowBuilderLayout } from './components/WorkflowBuilderLayout';
import { CommandCenterLayout } from './components/CommandCenterLayout';
import { TasksLayout } from './components/TasksLayout';
import { ProgramsLayout } from './components/ProgramsLayout';
import { ReportsLayout } from './components/ReportsLayout';
import { BudgetingLayout } from './components/BudgetingLayout';
import { FinancialsLayout } from './components/FinancialsLayout';
import { PermittingLayout } from './components/PermittingLayout';

// Route layout components
import { AgentStudioLayout } from './components/routes/AgentStudioLayout';
import { UnifiedPortalLayout } from './components/routes/UnifiedPortalLayout';
import MarketingLayout from './components/marketing/MarketingLayout';

// ========== LAZY LOADED PAGES ==========

// Homepage
const HomePage = lazy(() => import('./pages/HomePage'));

// Marketing pages
const MarketingHomePage = lazy(() => import('./pages/marketing/MarketingHomePage'));
const DirectoryPageTemplate = lazy(() => import('./pages/marketing/DirectoryPageTemplate'));
const TerminalPageTemplate = lazy(() => import('./pages/marketing/TerminalPageTemplate'));
const PLCMarketingPage = lazy(() => import('./pages/marketing/PLCMarketingPage'));
const MarketingDocsPage = lazy(() => import('./pages/marketing/MarketingDocsPage'));

// Agent Studio pages (from agent-studio folder)
const DashboardPage = lazy(() => import('./pages/agent-studio/DashboardPage'));
const AgentsListPage = lazy(() => import('./pages/agent-studio/AgentsListPageNew'));
const AgentDetailPage = lazy(() => import('./pages/agent-studio/AgentDetailPage'));
const AgentEditPage = lazy(() => import('./pages/agent-studio/AgentEditPage'));
const SkillsListPage = lazy(() => import('./pages/agent-studio/SkillsListPageNew'));
const SkillEditPage = lazy(() => import('./pages/agent-studio/SkillEditPage'));
const ToolsListPage = lazy(() => import('./pages/agent-studio/ToolsListPageNew'));
const ToolDetailPage = lazy(() => import('./pages/agent-studio/ToolDetailPage'));
const KnowledgePageEnhanced = lazy(() => import('./pages/agent-studio/KnowledgePageEnhanced'));
const ChatInterfacePage = lazy(() => import('./pages/agent-studio/ChatInterfacePage'));

// Repository pages
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const PullRequestsPage = lazy(() => import('./pages/PullRequestsPage'));
const WorktreesPage = lazy(() => import('./pages/WorktreesPage'));

// Seamstress documentation pages
const SeamstressOverview = lazy(() => import('./pages/seamstress/SeamstressOverview'));
const HowItWorksPage = lazy(() => import('./pages/seamstress/HowItWorksPage'));
const SkillsReferencePage = lazy(() => import('./pages/seamstress/SkillsReferencePage'));
const ComponentsPatternsPage = lazy(() => import('./pages/seamstress/ComponentsPatternsPage'));
// GettingStartedPage content merged into SeamstressOverview - route redirects to /seamstress
const BuildingFromFigmaPage = lazy(() => import('./pages/seamstress/BuildingFromFigmaPage'));
const TestingSkillsPage = lazy(() => import('./pages/seamstress/TestingSkillsPage'));
const ThemeEditorTestPage = lazy(() => import('./pages/seamstress/ThemeEditorTestPage'));
const ThemesPage = lazy(() => import('./pages/seamstress/ThemesPage'));
const ContextAnalysisPage = lazy(() => import('./pages/seamstress/ContextAnalysisPage'));
const LogoPlayground = lazy(() => import('./pages/LogoPlayground'));

// Docs pages
const DocsOverview = lazy(() => import('./pages/docs/DocsOverview'));
const ThemeSystem = lazy(() => import('./pages/docs/ThemeSystem'));
const TypographyDocs = lazy(() => import('./pages/docs/Typography'));
const LayoutRules = lazy(() => import('./pages/docs/LayoutRules'));
const ComponentPatterns = lazy(() => import('./pages/docs/ComponentPatterns'));
const DataVisualization = lazy(() => import('./pages/docs/DataVisualization'));
const KeyboardAccessibilityPage = lazy(() => import('./pages/docs/accessibility/KeyboardAccessibilityPage'));
const MobileAccessibilityPage = lazy(() => import('./pages/docs/accessibility/MobileAccessibilityPage'));

// Prototypes
const PrototypesIndexPage = lazy(() => import('./pages/PrototypesIndexPage'));

// Procurement pages
const ProcurementDashboard = lazy(() => import('./pages/procurement/ProcurementDashboard'));
const ProjectsListPage = lazy(() => import('./pages/procurement/projects/ProjectsListPage'));
const ProjectPropertiesPage = lazy(() => import('./pages/procurement/projects/ProjectPropertiesPage'));
const ProjectManagePage = lazy(() => import('./pages/procurement/projects/ProjectManagePage'));
const DocumentBuilderPage = lazy(() => import('./pages/procurement/projects/DocumentBuilderPage'));
const DocumentBuilderSimplePage = lazy(() => import('./pages/procurement/projects/DocumentBuilderSimplePage'));
const TemplatesPage = lazy(() => import('./pages/procurement/TemplatesPage'));
const ProcurementProjectsPage = lazy(() => import('./pages/examples/procurement/ProcurementProjectsPage'));
const ChartAlternativesDemo = lazy(() => import('./pages/procurement/ChartAlternativesDemo'));

// EAM pages
const EAMDashboard = lazy(() => import('./pages/eam/EAMDashboard'));
const EAMAnalyticsDashboard = lazy(() => import('./pages/eam/EAMAnalyticsDashboard'));

// Utility Billing pages
const BillingHomePage = lazy(() => import('./pages/utility-billing/BillingHomePage'));
const CutoffPage = lazy(() => import('./pages/utility-billing/CutoffPage'));
const AccountNumberFormatPage = lazy(() => import('./pages/utility-billing/AccountNumberFormatPage'));
const AccountNumberFormatPageV2 = lazy(() => import('./pages/utility-billing/AccountNumberFormatPageV2'));
const AccountNumberFormatPageBackup = lazy(() => import('./pages/utility-billing/AccountNumberFormatPage.backup'));
const CustomerPortalPage = lazy(() => import('./pages/utility-billing/CustomerPortalPage'));
const AnalyticsPage = lazy(() => import('./pages/utility-billing/AnalyticsPage'));
const AccountValidationPage = lazy(() => import('./pages/utility-billing/AccountValidationPage'));
const CreateAccountWizard = lazy(() => import('./pages/utility-billing/CreateAccountWizard'));
const AddAdjustmentPage = lazy(() => import('./pages/AddAdjustmentPage'));

// App Builder pages
const AppBuilderPage = lazy(() => import('./pages/AppBuilderPage'));
const PermitLicenseDashboard = lazy(() => import('./pages/app-builder/PermitLicenseDashboard'));

// Workflow Builder
const WorkflowBuilderPage = lazy(() => import('./pages/WorkflowBuilderPage'));

// Command Center
const CommandCenterDashboard = lazy(() => import('./pages/command-center/CommandCenterDashboard'));

// Tasks, Programs, Reports, Budgeting
const TasksPage = lazy(() => import('./pages/TasksPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BudgetingPage = lazy(() => import('./pages/BudgetingPage'));

// Financials
const FinancialsDashboard = lazy(() => import('./pages/financials/FinancialsDashboard'));

// Permitting
const PermittingDashboard = lazy(() => import('./pages/permitting/PermittingDashboard'));
const UserProfilePage = lazy(() => import('./pages/permitting/UserProfilePage'));

// Labs pages
const LabsIndexPage = lazy(() => import('./pages/labs/LabsIndexPage'));
const AIAnimationsPage = lazy(() => import('./pages/labs/AIAnimationsPage'));

// Tax & Revenue pages
const TaxRevenueHomepage = lazy(() => import('./pages/tax-revenue/TaxRevenueHomepage'));

// Public Portal pages
const AccountManagementPage = lazy(() => import('./pages/public-portal/AccountManagementPage'));

// Unified Portal pages
const UnifiedDashboard = lazy(() => import('./pages/public-portal/unified-portal/components/UnifiedDashboard'));
const IdentityLogin = lazy(() => import('./pages/public-portal/unified-portal/components/IdentityLogin'));
const UniversalPaymentEngine = lazy(() => import('./pages/public-portal/unified-portal/components/UniversalPaymentEngine'));
const DocumentVault = lazy(() => import('./pages/public-portal/unified-portal/components/DocumentVault'));
const PermitsPage = lazy(() => import('./pages/public-portal/unified-portal/components/PermitsPage'));
const PropertyLookupPage = lazy(() => import('./pages/public-portal/unified-portal/components/PropertyLookupPage'));
const VendorPortalPage = lazy(() => import('./pages/public-portal/unified-portal/components/VendorPortalPage'));
const ParksPage = lazy(() => import('./pages/public-portal/unified-portal/components/ParksPage'));
const LicensesPage = lazy(() => import('./pages/public-portal/unified-portal/components/LicensesPage'));
const TaxesPage = lazy(() => import('./pages/public-portal/unified-portal/components/TaxesPage'));
const GrantsPage = lazy(() => import('./pages/public-portal/unified-portal/components/GrantsPage'));
const UtilitiesPage = lazy(() => import('./pages/public-portal/unified-portal/components/UtilitiesPage'));
const HistoryPage = lazy(() => import('./pages/public-portal/unified-portal/components/HistoryPage'));
const AccountPage = lazy(() => import('./pages/public-portal/unified-portal/components/AccountPage'));
const SupportPage = lazy(() => import('./pages/public-portal/unified-portal/components/SupportPage'));
const SiteMapPage = lazy(() => import('./pages/public-portal/unified-portal/components/SiteMapPage'));
const CitySwitcherDemo = lazy(() => import('./pages/public-portal/unified-portal/components/CitySwitcherDemo'));

// Legacy agent studio pages (root level - for backwards compatibility)
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcase'));
const MentionDemo = lazy(() => import('./components/mentions/MentionDemo'));
const EAMSchedulerAgentPage = lazy(() => import('./pages/EAMSchedulerAgentPage'));
const AgentWorkspaceDemoPage = lazy(() => import('./pages/AgentWorkspaceDemoPage'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: true,
    },
  },
});

// Detect base path for different deployment environments
// - Local dev / GitHub Pages: served at root "/"
// - Deploy-ee ephemeral: served at "/seamstress-design/"
function getBasePath(): string {
  if (typeof window === 'undefined') return '/';

  const path = window.location.pathname;
  // Check if we're on deploy-ee (path starts with /seamstress-design/)
  if (path.startsWith('/seamstress-design')) {
    return '/seamstress-design';
  }
  return '/';
}

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh'
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          'html, body, #root': {
            margin: 0,
            padding: 0,
            width: '100%',
            minHeight: '100vh',
          }
        }}
      />
      <ErrorBoundary>
        <DataProvider defaultSource="mock">
          <UnifiedChatProvider>
            <BrowserRouter
              basename={getBasePath()}
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
            <NavigationRenderedProvider>
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Main content area - shrinks when chat is open */}
            <Box sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
            <PersistentNavigation>
            <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* ========== HOMEPAGE ========== */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />

            {/* ========== REPOSITORY ROUTES ========== */}
            <Route path="/repo/*" element={
              <BranchesLayout>
                <Routes>
                  <Route index element={<Navigate to="branches" replace />} />
                  <Route path="branches" element={<PageTransition><BranchesPage /></PageTransition>} />
                  <Route path="pull-requests" element={<PageTransition><PullRequestsPage /></PageTransition>} />
                  <Route path="worktrees" element={<PageTransition><WorktreesPage /></PageTransition>} />
                  <Route path="*" element={<Navigate to="branches" replace />} />
                </Routes>
              </BranchesLayout>
            } />
            <Route path="/branches" element={<Navigate to="/repo/branches" replace />} />

            {/* ========== AGENT STUDIO ========== */}
            <Route path="/agent-studio" element={<AgentStudioLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="chat" element={<ChatInterfacePage />} />
              <Route path="agents" element={<AgentsListPage />} />
              <Route path="agents/:id" element={<AgentDetailPage />} />
              <Route path="agents/:id/edit" element={<AgentEditPage />} />
              <Route path="skills" element={<SkillsListPage />} />
              <Route path="skills/:id" element={<SkillEditPage />} />
              <Route path="tools" element={<ToolsListPage />} />
              <Route path="tools/:id" element={<ToolDetailPage />} />
              <Route path="knowledge" element={<KnowledgePageEnhanced />} />
              <Route path="knowledge/:documentId" element={<KnowledgePageEnhanced />} />
              <Route path="showcase" element={<ComponentShowcase />} />
              <Route path="mention-demo" element={<MentionDemo />} />
              <Route path="eam-scheduler" element={<EAMSchedulerAgentPage />} />
              <Route path="workspace-demo" element={<AgentWorkspaceDemoPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ========== SEAMSTRESS DOCUMENTATION ========== */}
            <Route path="/seamstress" element={<PageTransition><SeamstressOverview /></PageTransition>} />
            <Route path="/seamstress/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
            <Route path="/seamstress/skills-reference" element={<PageTransition><SkillsReferencePage /></PageTransition>} />
            <Route path="/seamstress/components-patterns" element={<PageTransition><ComponentsPatternsPage /></PageTransition>} />
            <Route path="/seamstress/getting-started" element={<Navigate to="/seamstress" replace />} />
            <Route path="/seamstress/building-from-figma" element={<PageTransition><BuildingFromFigmaPage /></PageTransition>} />
            <Route path="/seamstress/testing" element={<PageTransition><TestingSkillsPage /></PageTransition>} />
            <Route path="/seamstress/theme-editor" element={<PageTransition><ThemeEditorTestPage /></PageTransition>} />
            <Route path="/seamstress/themes" element={<PageTransition><ThemesPage /></PageTransition>} />
            <Route path="/seamstress/logo" element={<PageTransition><LogoPlayground /></PageTransition>} />
            <Route path="/seamstress/context-analysis" element={<PageTransition><ContextAnalysisPage /></PageTransition>} />
            <Route path="/seamstress/*" element={<PageTransition><SeamstressOverview /></PageTransition>} />

            {/* ========== DOCS ========== */}
            <Route path="/docs" element={<PageTransition><DocsOverview /></PageTransition>} />
            <Route path="/docs/overview" element={<PageTransition><DocsOverview /></PageTransition>} />
            <Route path="/docs/theme-system" element={<PageTransition><ThemeSystem /></PageTransition>} />
            <Route path="/docs/typography" element={<PageTransition><TypographyDocs /></PageTransition>} />
            <Route path="/docs/layout-rules" element={<PageTransition><LayoutRules /></PageTransition>} />
            <Route path="/docs/component-patterns" element={<PageTransition><ComponentPatterns /></PageTransition>} />
            <Route path="/docs/data-visualization" element={<PageTransition><DataVisualization /></PageTransition>} />
            <Route path="/docs/keyboard" element={<PageTransition><KeyboardAccessibilityPage /></PageTransition>} />
            <Route path="/docs/mobile" element={<PageTransition><MobileAccessibilityPage /></PageTransition>} />
            {/* Redirects for old accessibility URLs */}
            <Route path="/docs/accessibility" element={<Navigate to="/docs/keyboard" replace />} />
            <Route path="/docs/accessibility/keyboard-guidelines" element={<Navigate to="/docs/keyboard" replace />} />
            <Route path="/docs/accessibility/mobile-guidelines" element={<Navigate to="/docs/mobile" replace />} />

            {/* ========== PROTOTYPES ========== */}
            <Route path="/prototypes" element={
              <PageTransition>
                <PrototypesLayout>
                  <PrototypesIndexPage />
                </PrototypesLayout>
              </PageTransition>
            } />
            <Route path="/prototypes/*" element={
              <PageTransition>
                <PrototypesLayout>
                  <Routes>
                    <Route path="agent-studio" element={<Navigate to="/agent-studio/dashboard" replace />} />
                    <Route path="eam-dashboard" element={<Navigate to="/eam/dashboard" replace />} />
                    <Route path="utility-billing" element={<Navigate to="/utility-billing" replace />} />
                    <Route path="workspace" element={<Navigate to="/agent-studio/workspace-demo" replace />} />
                    <Route path="eam-scheduler" element={<Navigate to="/agent-studio/eam-scheduler" replace />} />
                    <Route path="showcase" element={<Navigate to="/agent-studio/showcase" replace />} />
                    <Route path="*" element={<Navigate to="/prototypes" replace />} />
                  </Routes>
                </PrototypesLayout>
              </PageTransition>
            } />

            {/* ========== PROCUREMENT ========== */}
            <Route path="/procurement/*" element={
              <ProcurementLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PageTransition><ProcurementDashboard /></PageTransition>} />
                  <Route path="projects" element={<PageTransition><ProjectsListPage /></PageTransition>} />
                  <Route path="projects/new" element={<PageTransition><ProjectPropertiesPage /></PageTransition>} />
                  <Route path="projects/:projectId" element={<PageTransition><ProjectManagePage /></PageTransition>} />
                  <Route path="projects/:projectId/edit" element={<PageTransition><ProjectPropertiesPage /></PageTransition>} />
                  <Route path="projects/:projectId/documents/:documentId" element={<PageTransition><DocumentBuilderPage /></PageTransition>} />
                  <Route path="projects/:projectId/documents/:documentId/simple" element={<PageTransition><DocumentBuilderSimplePage /></PageTransition>} />
                  <Route path="templates" element={<PageTransition><TemplatesPage /></PageTransition>} />
                  <Route path="projects-example" element={<PageTransition><ProcurementProjectsPage /></PageTransition>} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProcurementLayout>
            } />

            {/* ========== EAM ========== */}
            <Route path="/eam/*" element={
              <EAMLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PageTransition><EAMDashboard /></PageTransition>} />
                  <Route path="analytics" element={<PageTransition><EAMAnalyticsDashboard /></PageTransition>} />
                  <Route path="work-orders" element={<div>Work Orders Coming Soon</div>} />
                  <Route path="assets" element={<div>Assets Coming Soon</div>} />
                  <Route path="maintenance" element={<div>Maintenance Coming Soon</div>} />
                  <Route path="inventory" element={<div>Inventory Coming Soon</div>} />
                  <Route path="reports" element={<div>Reports Coming Soon</div>} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </EAMLayout>
            } />

            {/* ========== UTILITY BILLING ========== */}
            <Route path="/utility-billing/*" element={
              <UtilityBillingLayout>
                <Routes>
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<PageTransition><BillingHomePage /></PageTransition>} />
                  <Route path="dashboard" element={<div>Billing Dashboard Coming Soon</div>} />
                  <Route path="analytics" element={<PageTransition><AnalyticsPage /></PageTransition>} />
                  <Route path="accounts/*" element={<div>Account Management Coming Soon</div>} />
                  <Route path="accounts/create" element={<PageTransition><CreateAccountWizard /></PageTransition>} />
                  <Route path="operations/*" element={<div>Billing Operations Coming Soon</div>} />
                  <Route path="payments/*" element={<div>Payment Processing Coming Soon</div>} />
                  <Route path="reports/*" element={<div>Billing Reports Coming Soon</div>} />
                  <Route path="workflows/cutoff" element={<PageTransition><CutoffPage /></PageTransition>} />
                  <Route path="customer-portal" element={<PageTransition><CustomerPortalPage /></PageTransition>} />
                  <Route path="admin/*" element={<div>Billing Administration Coming Soon</div>} />
                  <Route path="admin/account-validation" element={<PageTransition><AccountValidationPage /></PageTransition>} />
                  <Route path="settings/account-number-format" element={<PageTransition><AccountNumberFormatPage /></PageTransition>} />
                  <Route path="settings/account-number-format-v2" element={<PageTransition><AccountNumberFormatPageV2 /></PageTransition>} />
                  <Route path="settings/account-number-format-backup" element={<PageTransition><AccountNumberFormatPageBackup /></PageTransition>} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </UtilityBillingLayout>
            } />
            {/* Legacy redirect from /billing to /utility-billing */}
            <Route path="/billing/*" element={<Navigate to="/utility-billing" replace />} />
            <Route path="/billing" element={<Navigate to="/utility-billing" replace />} />

            {/* ========== APP BUILDER ========== */}
            <Route path="/app-builder/*" element={
              <AppBuilderLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PageTransition><PermitLicenseDashboard /></PageTransition>} />
                  <Route path="library" element={<PageTransition><AppBuilderPage /></PageTransition>} />
                  <Route path="templates" element={<PageTransition><AppBuilderPage /></PageTransition>} />
                  <Route path="settings" element={<PageTransition><AppBuilderPage /></PageTransition>} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AppBuilderLayout>
            } />

            {/* ========== WORKFLOW BUILDER ========== */}
            <Route path="/workflow-builder" element={
              <PageTransition>
                <WorkflowBuilderLayout>
                  <WorkflowBuilderPage />
                </WorkflowBuilderLayout>
              </PageTransition>
            } />

            {/* ========== COMMAND CENTER ========== */}
            <Route path="/command-center" element={
              <PageTransition>
                <CommandCenterLayout>
                  <CommandCenterDashboard />
                </CommandCenterLayout>
              </PageTransition>
            } />

            {/* ========== TASKS ========== */}
            <Route path="/tasks" element={
              <PageTransition>
                <TasksLayout>
                  <TasksPage />
                </TasksLayout>
              </PageTransition>
            } />

            {/* ========== PROGRAMS ========== */}
            <Route path="/programs" element={
              <PageTransition>
                <ProgramsLayout>
                  <ProgramsPage />
                </ProgramsLayout>
              </PageTransition>
            } />

            {/* ========== REPORTS ========== */}
            <Route path="/reports" element={
              <PageTransition>
                <ReportsLayout>
                  <ReportsPage />
                </ReportsLayout>
              </PageTransition>
            } />

            {/* ========== BUDGETING ========== */}
            <Route path="/budgeting" element={
              <PageTransition>
                <BudgetingLayout>
                  <BudgetingPage />
                </BudgetingLayout>
              </PageTransition>
            } />

            {/* ========== FINANCIALS ========== */}
            <Route path="/financials/*" element={
              <FinancialsLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PageTransition><FinancialsDashboard /></PageTransition>} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </FinancialsLayout>
            } />

            {/* ========== PERMITTING ========== */}
            <Route path="/permitting/*" element={
              <PermittingLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PageTransition><PermittingDashboard /></PageTransition>} />
                  <Route path="profile" element={<PageTransition><UserProfilePage /></PageTransition>} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </PermittingLayout>
            } />

            {/* ========== LABS ========== */}
            <Route path="/labs" element={<PageTransition><LabsIndexPage /></PageTransition>} />
            <Route path="/labs/ai-animations" element={<PageTransition><AIAnimationsPage /></PageTransition>} />

            {/* ========== MARKETING ========== */}
            <Route path="/marketing" element={<MarketingLayout />}>
              <Route index element={<MarketingHomePage />} />
              <Route path="docs" element={<MarketingDocsPage />} />
              <Route path="products/erp" element={<DirectoryPageTemplate />} />
              <Route path="products/permitting" element={<PLCMarketingPage />} />
              <Route path="platform/agent-studio" element={<TerminalPageTemplate />} />
            </Route>

            {/* ========== UNIFIED PORTAL (with scoped providers) ========== */}
            <Route path="/unified-portal" element={<UnifiedPortalLayout />}>
              <Route index element={<UnifiedDashboard />} />
              <Route path="login" element={<IdentityLogin />} />
              <Route path="pay" element={<UniversalPaymentEngine />} />
              <Route path="documents" element={<DocumentVault />} />
              <Route path="permits" element={<PermitsPage />} />
              <Route path="permits/lookup" element={<PropertyLookupPage />} />
              <Route path="parks" element={<ParksPage />} />
              <Route path="licenses" element={<LicensesPage />} />
              <Route path="taxes" element={<TaxesPage />} />
              <Route path="utilities" element={<UtilitiesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="grants" element={<GrantsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="sitemap" element={<SiteMapPage />} />
              <Route path="city-switcher" element={<CitySwitcherDemo />} />
            </Route>

            {/* ========== PUBLIC PORTAL ========== */}
            {/* Legacy public-portal redirects to unified-portal */}
            <Route path="/public-portal" element={<Navigate to="/unified-portal" replace />} />
            <Route path="/public-portal/support" element={<Navigate to="/unified-portal/support" replace />} />
            <Route path="/public-portal/account" element={<PageTransition><AccountManagementPage /></PageTransition>} />
            <Route path="/public-portal/payment" element={<Navigate to="/unified-portal/pay" replace />} />
            <Route path="/public-portal/history" element={<Navigate to="/unified-portal/history" replace />} />
            {/* Catch-all redirect for any other public-portal routes */}
            <Route path="/public-portal/*" element={<Navigate to="/unified-portal" replace />} />

            {/* ========== VENDOR PORTAL ========== */}
            <Route path="/vendor-portal" element={<PageTransition><VendorPortalPage /></PageTransition>} />

            {/* ========== TAX & REVENUE ========== */}
            <Route path="/tax-revenue" element={<PageTransition><TaxRevenueHomepage /></PageTransition>} />

            {/* ========== STANDALONE ROUTES ========== */}
            <Route path="/chart-alternatives" element={<PageTransition><ChartAlternativesDemo /></PageTransition>} />
            <Route path="/adjustments-example" element={
              <PageTransition><UtilityBillingLayout><AddAdjustmentPage /></UtilityBillingLayout></PageTransition>
            } />

            {/* ========== LEGACY REDIRECTS ========== */}
            {/* Redirect old root-level agent studio paths to new /agent-studio/* paths */}
            <Route path="/dashboard" element={<Navigate to="/agent-studio/dashboard" replace />} />
            <Route path="/agents" element={<Navigate to="/agent-studio/agents" replace />} />
            <Route path="/agents/:id" element={<Navigate to="/agent-studio/agents/:id" replace />} />
            <Route path="/skills" element={<Navigate to="/agent-studio/skills" replace />} />
            <Route path="/tools" element={<Navigate to="/agent-studio/tools" replace />} />
            <Route path="/knowledge" element={<Navigate to="/agent-studio/knowledge" replace />} />
            <Route path="/showcase" element={<Navigate to="/agent-studio/showcase" replace />} />

            {/* ========== CATCH-ALL FALLBACK ========== */}
            {/* Show homepage for unknown routes instead of redirecting */}
            <Route path="*" element={<PageTransition><HomePage /></PageTransition>} />
            </Routes>
            </Suspense>
            </PersistentNavigation>
            </Box>
            {/* Unified Chat Container - renders chat sidebar/modal panel */}
            <UnifiedChatContainer />
            {/* PR Comments - renders FAB + panel when PR context detected */}
            <PRCommentsContainer />
            </Box>
            </NavigationRenderedProvider>
            </BrowserRouter>
          </UnifiedChatProvider>
        </DataProvider>
      </ErrorBoundary>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
