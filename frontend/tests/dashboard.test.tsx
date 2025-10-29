import { render, screen } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';

it('renders dashboard charts', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
