import { useList } from '@/hooks/useApi';
import DataTable from '@/components/tables/DataTable';

export default function UsersPage() {
  const { data } = useList<{ data: Array<{ id: string; email: string; name: string; roles: string[] }>; total: number }>('users', '/api/v1/users');
  const rows = (data?.data || []).map((u: any) => ({ id: u._id, email: u.email, name: u.name, roles: u.roles.join(', ') }));
  return (
    <div>
      <h2>Users</h2>
      <DataTable columns={[{ key: 'email', header: 'Email' }, { key: 'name', header: 'Name' }, { key: 'roles', header: 'Roles' }]} rows={rows} />
    </div>
  );
}
