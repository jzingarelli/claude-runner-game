import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function Users() {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/v1/users', { headers: { Authorization: `Bearer ${token}` } });
      return res.json();
    },
  });
  return (
    <div style={{ padding: 16 }}>
      <h2>Users</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
