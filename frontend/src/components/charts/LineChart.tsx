import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface LineChartProps { data: Array<{ x: string | number; y: number }>; color?: string; }

export default function LineChart({ data, color = '#2563eb' }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
