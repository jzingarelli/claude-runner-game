import { Routes, Route, Link } from 'react-router-dom';

function Section({ title }: { title: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>Configure {title.toLowerCase()} settings here.</p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link to="profile">Profile</Link>
        <Link to="security">Security</Link>
        <Link to="notifications">Notifications</Link>
        <Link to="billing">Billing</Link>
        <Link to="teams">Teams</Link>
        <Link to="integrations">Integrations</Link>
        <Link to="webhooks">Webhooks</Link>
        <Link to="appearance">Appearance</Link>
        <Link to="apikeys">API Keys</Link>
        <Link to="preferences">Preferences</Link>
      </nav>
      <div>
        <Routes>
          <Route path="profile" element={<Section title="Profile" />} />
          <Route path="security" element={<Section title="Security" />} />
          <Route path="notifications" element={<Section title="Notifications" />} />
          <Route path="billing" element={<Section title="Billing" />} />
          <Route path="teams" element={<Section title="Teams" />} />
          <Route path="integrations" element={<Section title="Integrations" />} />
          <Route path="webhooks" element={<Section title="Webhooks" />} />
          <Route path="appearance" element={<Section title="Appearance" />} />
          <Route path="apikeys" element={<Section title="API Keys" />} />
          <Route path="preferences" element={<Section title="Preferences" />} />
        </Routes>
      </div>
    </div>
  );
}
