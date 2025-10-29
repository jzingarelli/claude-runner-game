import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import LineChart from '@/components/charts/LineChart';

export default function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ['summary'], queryFn: async () => (await api.get('/analytics/summary', { params: { from: new Date(Date.now()-7*864e5).toISOString(), to: new Date().toISOString() } })).data });
  const mapped = (data?.data || []).map((d: any, i: number) => ({ x: d.type || i, y: d.count }));
  return (
    <div>
      <h2>Analytics</h2>
      <LineChart data={mapped} />
    </div>
  );
}
