import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface BarChartProps { data: Array<{ x: string | number; y: number }>; color?: string; }

export default function BarChart({ data, color = '#60a5fa' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="y" fill={color} />
      </RBarChart>
    </ResponsiveContainer>
  );
}
