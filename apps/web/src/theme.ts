import { createGlobalStyle } from 'styled-components';

export const theme = {
  light: {
    background: '#ffffff',
    text: '#111111',
    primary: '#3b82f6',
  },
  dark: {
    background: '#0b1020',
    text: '#f3f4f6',
    primary: '#60a5fa',
  },
};

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji; background: ${(p: any) => p.theme.background}; color: ${(p: any) => p.theme.text}; }
  a { color: ${(p: any) => p.theme.primary}; text-decoration: none; }
`;
