import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import Notifications from './pages/Notifications';

function RequireAuth({ children }: { children: JSX.Element }) {
  const authed = useSelector((s: RootState) => Boolean(s.auth.accessToken));
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/notifications">Notifications</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      </Routes>
    </div>
  );
}
