import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function usePermissions() {
  const roles = useSelector((s: RootState) => s.auth.user?.roles ?? []);
  const hasRole = (...required: string[]) => roles.some((r) => required.includes(r));
  return { roles, hasRole };
}
