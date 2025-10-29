/**
 * Header Component
 */

import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';

const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.light.surface};
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.light.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <h2>Welcome, {user?.firstName}!</h2>
      </HeaderLeft>
      <HeaderRight>
        <IconButton onClick={() => dispatch(toggleTheme())}>
          {mode === 'light' ? '🌙' : '☀️'}
        </IconButton>
        <IconButton>
          🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
        </IconButton>
        <UserAvatar>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </UserAvatar>
        <IconButton onClick={handleLogout}>🚪</IconButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
