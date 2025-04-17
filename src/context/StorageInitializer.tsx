'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDogProfiles } from './DogProfileContext';
import { useFoodDatabase } from './FoodDatabaseContext';
import { useUserPreferences } from './UserPreferencesContext';
import { clearAllStorageData, isLocalStorageAvailable } from '../utils/localStorage';
import { StorageError, StorageErrorType, registerStorageErrorHandler, unregisterStorageErrorHandler } from '../utils/errorHandling';
import { useStorageError } from './StorageErrorContext';

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
  const { setError } = useStorageError();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Register the error handler
  useEffect(() => {
    registerStorageErrorHandler(setError);
    
    return () => {
      unregisterStorageErrorHandler();
    };
  }, [setError]);
  
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
      setError(new StorageError(
        'Local storage is not available. Changes will not be persisted.',
        StorageErrorType.STORAGE_UNAVAILABLE
      ));
    }
  }, [setError]);
  
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