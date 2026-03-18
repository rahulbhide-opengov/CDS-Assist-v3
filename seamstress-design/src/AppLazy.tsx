import { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { theme } from './theme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { MentionProvider } from './contexts/MentionProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load all pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AgentsListPage = lazy(() => import('./pages/AgentsListPageNew'));
const AgentDetailPage = lazy(() => import('./pages/AgentDetailPage'));
const AgentEditPage = lazy(() => import('./pages/AgentEditPage'));
const SkillsListPage = lazy(() => import('./pages/SkillsListPageNew'));
const SkillEditPage = lazy(() => import('./pages/SkillEditPage'));
const ToolsListPage = lazy(() => import('./pages/ToolsListPageNew'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const KnowledgePageEnhanced = lazy(() => import('./pages/agent-studio/KnowledgePageEnhanced'));
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcase'));
const MentionDemo = lazy(() => import('./components/mentions/MentionDemo'));
const LogoPlayground = lazy(() => import('./pages/LogoPlayground'));
const ChatInterfacePage = lazy(() => import('./pages/agent-studio/ChatInterfacePage'));

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

function AppLazy() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter
          basename={import.meta.env.BASE_URL}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <MentionProvider>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/showcase" element={<ComponentShowcase />} />
                  <Route path="/knowledge" element={<KnowledgePageEnhanced />} />
                  <Route path="/mention-demo" element={<MentionDemo />} />
                  <Route path="/seamstress/logo" element={<LogoPlayground />} />
                  <Route path="/chat" element={<ChatInterfacePage />} />
                  <Route path="/agents" element={<AgentsListPage />} />
                  <Route path="/agents/:id/edit" element={<AgentEditPage />} />
                  <Route path="/agents/:id" element={<AgentDetailPage />} />
                  <Route path="/skills" element={<SkillsListPage />} />
                  <Route path="/skills/:id" element={<SkillEditPage />} />
                  <Route path="/tools" element={<ToolsListPage />} />
                  <Route path="/tools/:id" element={<ToolDetailPage />} />
                </Routes>
              </Suspense>
            </AppLayout>
          </MentionProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default AppLazy;