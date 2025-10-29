import styled, { createGlobalStyle } from 'styled-components';

const Wrapper = styled.div`
  padding: 24px;
`;

export function Dashboard() {
  return (
    <Wrapper>
      <h1>Enterprise Social Analytics</h1>
      <p>Welcome to your dashboard.</p>
    </Wrapper>
  );
}
