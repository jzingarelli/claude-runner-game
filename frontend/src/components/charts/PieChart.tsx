import { PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface PieChartProps { data: Array<{ name: string; value: number }>; colors?: string[] }

export default function PieChart({ data, colors = ['#2563eb', '#60a5fa', '#34d399', '#fbbf24'] }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RPieChart>
        <Tooltip />
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </RPieChart>
    </ResponsiveContainer>
  );
}
