'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StorageError } from '../utils/errorHandling';
import { StorageErrorAlert } from '../components/ui/molecules/StorageErrorAlert';

interface StorageErrorContextType {
  /** The current storage error or null if none */
  error: StorageError | null;
  /** Set or clear the current storage error */
  setError: (error: StorageError | null) => void;
  /** Clear the current storage error */
  clearError: () => void;
}

const StorageErrorContext = createContext<StorageErrorContextType | undefined>(undefined);

interface StorageErrorProviderProps {
  children: ReactNode;
  /** Whether to automatically dismiss alerts after a period (in ms, 0 for no auto-dismiss) */
  autoDismiss?: number;
  /** Position of the alert (default: 'bottom-right') */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Provider component for managing storage errors across the application
 */
export const StorageErrorProvider: React.FC<StorageErrorProviderProps> = ({ 
  children,
  autoDismiss = 0,
  position = 'bottom-right'
}) => {
  const [error, setError] = useState<StorageError | null>(null);
  
  const clearError = () => {
    setError(null);
  };
  
  return (
    <StorageErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
      <StorageErrorAlert 
        error={error} 
        onDismiss={clearError} 
        autoDismiss={autoDismiss}
        position={position}
      />
    </StorageErrorContext.Provider>
  );
};

/**
 * Custom hook to access the storage error context
 */
export function useStorageError(): StorageErrorContextType {
  const context = useContext(StorageErrorContext);
  
  if (context === undefined) {
    throw new Error('useStorageError must be used within a StorageErrorProvider');
  }
  
  return context;
} 