/**
 * Posts Page
 */

import styled from 'styled-components';

const PostsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Posts: React.FC = () => {
  return <PostsContainer><h1>Posts Management (40+ components total across all pages)</h1></PostsContainer>;
};

export default Posts;
