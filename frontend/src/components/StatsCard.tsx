/**
 * Stats Card Component
 */

import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

interface Props {
  title: string;
  value: string | number;
  trend?: number;
}

const StatsCard: React.FC<Props> = ({ title, value, trend }) => {
  return (
    <Card>
      <h3>{title}</h3>
      <p>{value}</p>
      {trend !== undefined && <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>}
    </Card>
  );
};

export default StatsCard;
