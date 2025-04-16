'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDogProfiles } from './DogProfileContext';
import { useFoodDatabase } from './FoodDatabaseContext';
import { useUserPreferences } from './UserPreferencesContext';
import { clearAllStorageData, isLocalStorageAvailable } from '../utils/localStorage';

interface StorageInitializerProps {
  children: ReactNode;
}

/**
 * Component that coordinates the initialization of context providers from storage
 * and provides methods for managing storage
 */
export function StorageInitializer({ children }: StorageInitializerProps) {
  const dogProfiles = useDogProfiles();
  const foodDatabase = useFoodDatabase();
  const userPreferences = useUserPreferences();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if all context providers are initialized
  useEffect(() => {
    const allInitialized = 
      'initialized' in dogProfiles && 
      'initialized' in foodDatabase && 
      'initialized' in userPreferences;
    
    if (allInitialized) {
      setIsInitialized(true);
    }
  }, [dogProfiles, foodDatabase, userPreferences]);
  
  // Handle local storage errors
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setError(new Error('Local storage is not available. Changes will not be persisted.'));
    }
  }, []);
  
  if (error) {
    // Could display an error message here or just silently continue
    console.error('Storage initialization error:', error);
  }
  
  // Simple loading screen if needed
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your saved data...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

/**
 * Reset all application data in local storage
 */
export function resetAppData(): void {
  clearAllStorageData();
  window.location.reload();
} 