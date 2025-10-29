import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['health'], queryFn: async () => (await fetch('/health')).json() });
  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
