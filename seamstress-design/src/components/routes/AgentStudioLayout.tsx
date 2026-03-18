import { Outlet } from 'react-router-dom';
import { MentionProvider } from '../../contexts/MentionProvider';
import { AppLayout } from '../AppLayout';

export const AgentStudioLayout = () => (
  <MentionProvider>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </MentionProvider>
);
