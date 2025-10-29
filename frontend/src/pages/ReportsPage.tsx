import { useList } from '@/hooks/useApi';
import DataTable from '@/components/tables/DataTable';

export default function ReportsPage() {
  const { data } = useList<{ data: any[]; total: number }>('reports', '/api/v1/reports');
  const rows = (data?.data || []).map((r: any) => ({ id: r._id, name: r.name, status: r.status }));
  return (
    <div>
      <h2>Reports</h2>
      <DataTable columns={[{ key: 'name', header: 'Name' }, { key: 'status', header: 'Status' }]} rows={rows} />
    </div>
  );
}
