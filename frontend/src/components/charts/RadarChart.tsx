import { RadarChart as RRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';

export interface RadarChartProps { data: Array<{ metric: string; value: number }>; color?: string; }

export default function RadarChart({ data, color = '#f59e0b' }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RRadarChart data={data} outerRadius={100}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis />
        <Tooltip />
        <Radar name="Metrics" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
      </RRadarChart>
    </ResponsiveContainer>
  );
}
