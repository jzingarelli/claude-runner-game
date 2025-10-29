import { createGlobalStyle } from 'styled-components';

export const theme = {
  light: {
    background: '#f5f7fb',
    text: '#0f172a',
    primary: '#2563eb',
  },
  dark: {
    background: '#0b1020',
    text: '#e2e8f0',
    primary: '#60a5fa',
  },
};

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif; background: ${(p: any) => p.theme.background}; color: ${(p: any) => p.theme.text}; }
  a { color: ${(p: any) => p.theme.primary}; }
`;
