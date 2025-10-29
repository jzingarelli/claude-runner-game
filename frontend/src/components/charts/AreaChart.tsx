import { AreaChart as RAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface AreaChartProps { data: Array<{ x: string | number; y: number }>; color?: string; }

export default function AreaChart({ data, color = '#34d399' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="y" stroke={color} fill={color} fillOpacity={0.3} />
      </RAreaChart>
    </ResponsiveContainer>
  );
}
