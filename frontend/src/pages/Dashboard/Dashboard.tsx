/**
 * Dashboard Page
 * Main analytics dashboard
 */

import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import LineChart from '../../components/Charts/LineChart';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartSection = styled.section`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.getDashboard(),
  });

  if (isLoading) return <div>Loading...</div>;

  const metrics = data?.data?.data?.metrics || {};

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        <StatsCard title="Total Views" value={metrics.views || 0} trend={12.5} />
        <StatsCard title="Total Likes" value={metrics.likes || 0} trend={8.3} />
        <StatsCard title="Total Comments" value={metrics.comments || 0} trend={-2.1} />
        <StatsCard title="Engagement Rate" value={`${metrics.engagementRate || 0}%`} trend={5.7} />
      </StatsGrid>

      <ChartSection>
        <h2>Analytics Overview</h2>
        <LineChart data={[]} />
      </ChartSection>
    </DashboardContainer>
  );
};

export default Dashboard;
