'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { AppContextProvider } from '@/context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </ThemeProvider>
  );
} 