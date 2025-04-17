import React, { ReactNode } from 'react';
import { DogProfilesProvider } from './DogProfileContext';
import { FoodDatabaseProvider } from './FoodDatabaseContext';
import { UserPreferencesProvider } from './UserPreferencesContext';
import { StorageErrorProvider } from './StorageErrorContext';
import { StorageInitializer } from './StorageInitializer';

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that includes all application contexts
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  return (
    <StorageErrorProvider autoDismiss={30000}>
      <UserPreferencesProvider>
        <DogProfilesProvider>
          <FoodDatabaseProvider>
            <StorageInitializer>
              {children}
            </StorageInitializer>
          </FoodDatabaseProvider>
        </DogProfilesProvider>
      </UserPreferencesProvider>
    </StorageErrorProvider>
  );
}; 