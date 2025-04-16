'use client';

import { ReactNode } from 'react';
import { DogProfilesProvider } from './DogProfileContext';
import { FoodDatabaseProvider } from './FoodDatabaseContext';
import { UserPreferencesProvider } from './UserPreferencesContext';
import { StorageInitializer } from './StorageInitializer';

/**
 * Props for the AppContextProvider component
 */
interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that wraps all context providers in the application
 * @param children React children to be wrapped with all providers
 */
const AppContextProvider = ({ children }: AppContextProviderProps) => {
  return (
    <UserPreferencesProvider>
      <DogProfilesProvider>
        <FoodDatabaseProvider>
          <StorageInitializer>
            {children}
          </StorageInitializer>
        </FoodDatabaseProvider>
      </DogProfilesProvider>
    </UserPreferencesProvider>
  );
};

export default AppContextProvider; 