/**
 * Sidebar Navigation Component
 */

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.light.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.light.border};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(-100%);
    transition: transform ${({ theme }) => theme.transitions.medium};

    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.light.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.light.text};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.light.border};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.light.primary};
    color: white;
  }
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Logo>Analytics</Logo>
      <Nav>
        <NavItem to="/dashboard">📊 Dashboard</NavItem>
        <NavItem to="/posts">📝 Posts</NavItem>
        <NavItem to="/analytics">📈 Analytics</NavItem>
        <NavItem to="/reports">📄 Reports</NavItem>
        <NavItem to="/team">👥 Team</NavItem>
        <NavItem to="/billing">💳 Billing</NavItem>
        <NavItem to="/settings">⚙️ Settings</NavItem>
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;
