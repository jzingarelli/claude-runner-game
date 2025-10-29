import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import AreaChart from '@/components/charts/AreaChart';
import RadarChart from '@/components/charts/RadarChart';

export default function Dashboard() {
  const data = Array.from({ length: 12 }).map((_, i) => ({ x: `M${i+1}`, y: Math.round(Math.random()*1000) }));
  const pie = [
    { name: 'Twitter', value: 400 },
    { name: 'Facebook', value: 300 },
    { name: 'Instagram', value: 300 },
    { name: 'LinkedIn', value: 200 },
  ];
  const radar = [
    { metric: 'Impressions', value: 120 },
    { metric: 'Clicks', value: 98 },
    { metric: 'Likes', value: 86 },
    { metric: 'Comments', value: 99 },
    { metric: 'Shares', value: 85 },
  ];

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <h2>Dashboard</h2>
      <LineChart data={data} />
      <BarChart data={data} />
      <PieChart data={pie} />
      <AreaChart data={data} />
      <RadarChart data={radar} />
    </div>
  );
}
