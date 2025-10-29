import { useList } from '@/hooks/useApi';
import DataTable from '@/components/tables/DataTable';

export default function PostsPage() {
  const { data } = useList<{ data: any[]; total: number }>('posts', '/api/v1/posts');
  const rows = (data?.data || []).map((p: any) => ({ id: p._id, content: p.content, platform: p.platform, publishedAt: p.publishedAt || '-' }));
  return (
    <div>
      <h2>Posts</h2>
      <DataTable columns={[{ key: 'content', header: 'Content' }, { key: 'platform', header: 'Platform' }, { key: 'publishedAt', header: 'Published' }]} rows={rows} />
    </div>
  );
}
