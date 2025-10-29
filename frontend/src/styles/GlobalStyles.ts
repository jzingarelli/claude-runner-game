/**
 * Global Styles
 */

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.light.text};
    background-color: ${({ theme }) => theme.colors.light.background};
    transition: background-color ${({ theme }) => theme.transitions.medium};
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 { font-size: ${({ theme }) => theme.typography.fontSize.xxl}; }
  h2 { font-size: ${({ theme }) => theme.typography.fontSize.xl}; }
  h3 { font-size: ${({ theme }) => theme.typography.fontSize.lg}; }

  a {
    color: ${({ theme }) => theme.colors.light.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${({ theme }) => theme.colors.light.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm};
    transition: border-color ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.light.primary};
    }
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.light.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.light.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};

    &:hover {
      background: ${({ theme }) => theme.colors.light.textSecondary};
    }
  }

  /* Dark mode support (add when theme is dark) */
  [data-theme="dark"] & {
    body {
      color: ${({ theme }) => theme.colors.dark.text};
      background-color: ${({ theme }) => theme.colors.dark.background};
    }
  }
`;

export default GlobalStyles;
