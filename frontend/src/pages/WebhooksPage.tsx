import { useList } from '@/hooks/useApi';

export default function WebhooksPage() {
  const { data } = useList<{ data: any[]; total: number }>('webhooks', '/api/v1/webhooks/endpoints');
  return (
    <div>
      <h2>Webhooks</h2>
      <ul>
        {(data?.data || []).map((w: any) => (
          <li key={w._id}>{w.url} - {w.enabled ? 'Enabled' : 'Disabled'}</li>
        ))}
      </ul>
    </div>
  );
}
