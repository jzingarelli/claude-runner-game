import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (res.ok) {
      dispatch(setAuth({ access: data.tokens.access, refresh: data.tokens.refresh, user: data.user }));
    } else {
      alert(data.error?.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320, margin: '40px auto' }}>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
