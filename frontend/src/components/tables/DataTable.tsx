import { useMemo, useState } from 'react';

export interface Column<T> { key: keyof T; header: string; render?: (row: T) => React.ReactNode }
export interface DataTableProps<T> { columns: Column<T>[]; rows: T[] }

export default function DataTable<T extends { id: string }>({ columns, rows }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; dir: 'asc' | 'desc' } | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const copy = [...filtered];
    copy.sort((a: any, b: any) => (a[sort.key] > b[sort.key] ? 1 : -1) * (sort.dir === 'asc' ? 1 : -1));
    return copy;
  }, [filtered, sort]);
  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page]);

  return (
    <div>
      <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <table width="100%">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} onClick={() => setSort(sort && sort.key === c.key ? { key: c.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' })}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={String(c.key)}>{c.render ? c.render(r) : String(r[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>
          Page {page} / {Math.max(1, Math.ceil(sorted.length / pageSize))}
        </span>
        <button disabled={page * pageSize >= sorted.length} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
