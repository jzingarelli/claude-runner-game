/**
 * Line Chart Component (using Recharts)
 */

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{ [key: string]: string | number }>;
}

const LineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" stroke="#2196F3" />
        <Line type="monotone" dataKey="likes" stroke="#4CAF50" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
