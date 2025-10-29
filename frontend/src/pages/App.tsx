import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Dashboard from './Dashboard';
import UsersPage from './UsersPage';
import PostsPage from './PostsPage';
import ReportsPage from './ReportsPage';
import AnalyticsPage from './AnalyticsPage';
import SettingsPage from './SettingsPage';
import BillingPage from './BillingPage';
import NotificationsPage from './NotificationsPage';
import WebhooksPage from './WebhooksPage';
import FilesPage from './FilesPage';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  padding: 16px; border-right: 1px solid rgba(0,0,0,0.1); position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; gap: 8px;
`;

const Main = styled.main` padding: 24px; `;

export default function App() {
  return (
    <Layout>
      <Sidebar>
        <h3>Analytics</h3>
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/webhooks">Webhooks</Link>
        <Link to="/files">Files</Link>
        <Link to="/settings">Settings</Link>
      </Sidebar>
      <Main>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/webhooks" element={<WebhooksPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Main>
    </Layout>
  );
}
