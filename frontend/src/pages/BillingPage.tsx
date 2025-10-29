import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export default function BillingPage() {
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: async () => (await api.get('/billing/plans')).data });
  return (
    <div>
      <h2>Billing</h2>
      <ul>
        {(plans || []).map((p: any) => (
          <li key={p._id}>{p.name} - ${(p.priceMonthlyCents/100).toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}
