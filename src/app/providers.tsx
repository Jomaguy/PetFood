'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { AppContextProvider } from '@/context';
import { StorageManager } from '@/components/StorageManager';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContextProvider>
        <StorageManager>
          {children}
        </StorageManager>
      </AppContextProvider>
    </ThemeProvider>
  );
} 