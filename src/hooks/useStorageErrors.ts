import { useState, useCallback, useEffect } from 'react';
import { StorageError, StorageErrorType } from '../utils/errorHandling';
import { useStorageError } from '../context/StorageErrorContext';
import { isStorageAvailable, getStorageUsage } from '../utils/storageUtils';

interface UseStorageErrorsOptions {
  /** Whether to check for storage availability on mount */
  checkAvailability?: boolean;
  /** Whether to check storage space on mount */
  checkStorageSpace?: boolean;
  /** Warning threshold percentage (default: 80) */
  warningThreshold?: number;
  /** Automatically retry operations that failed due to storage space */
  autoRetryOnCleanup?: boolean;
}

interface UseStorageErrorsReturn {
  /** The current storage error, if any */
  error: StorageError | null;
  /** Whether local storage is available */
  isAvailable: boolean;
  /** Current storage usage information */
  usage: { used: number; available?: number; percentUsed?: number };
  /** Whether storage is nearly full (over threshold) */
  isNearlyFull: boolean;
  /** Clear the current error */
  clearError: () => void;
  /** Check if storage is available */
  checkAvailability: () => boolean;
  /** Check current storage usage */
  checkStorageSpace: () => void;
  /** Manually report a storage error */
  reportError: (error: Error | string, type?: StorageErrorType) => void;
}

/**
 * Hook for managing storage errors and status
 */
export function useStorageErrors({
  checkAvailability = true,
  checkStorageSpace = true,
  warningThreshold = 80,
  autoRetryOnCleanup = false
}: UseStorageErrorsOptions = {}): UseStorageErrorsReturn {
  const { error, setError, clearError } = useStorageError();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [usage, setUsage] = useState<{ used: number; available?: number; percentUsed?: number }>({ used: 0 });
  const [isNearlyFull, setIsNearlyFull] = useState<boolean>(false);
  
  // Check if storage is available
  const checkAvailabilityFn = useCallback(() => {
    const available = isStorageAvailable();
    setIsAvailable(available);
    
    if (!available) {
      setError(new StorageError(
        'Local storage is not available in your browser.',
        StorageErrorType.STORAGE_UNAVAILABLE
      ));
    }
    
    return available;
  }, [setError]);
  
  // Check current storage usage
  const checkStorageSpaceFn = useCallback(() => {
    if (!isAvailable) return;
    
    const currentUsage = getStorageUsage();
    setUsage(currentUsage);
    
    const nearlyFull = !!currentUsage.percentUsed && currentUsage.percentUsed > warningThreshold;
    setIsNearlyFull(nearlyFull);
    
    if (nearlyFull) {
      setError(new StorageError(
        `Storage is nearly full (${Math.round(currentUsage.percentUsed || 0)}% used).`,
        StorageErrorType.STORAGE_QUOTA_EXCEEDED
      ));
    }
  }, [isAvailable, warningThreshold, setError]);
  
  // Report a storage error
  const reportError = useCallback((errorArg: Error | string, type?: StorageErrorType) => {
    if (typeof errorArg === 'string') {
      setError(new StorageError(errorArg, type || StorageErrorType.UNKNOWN_ERROR));
    } else {
      setError(new StorageError(
        errorArg.message,
        type || StorageErrorType.UNKNOWN_ERROR,
        { originalError: errorArg }
      ));
    }
  }, [setError]);
  
  // Initial checks
  useEffect(() => {
    if (checkAvailability) {
      checkAvailabilityFn();
    }
    
    if (checkStorageSpace && isAvailable) {
      checkStorageSpaceFn();
    }
  }, [checkAvailability, checkStorageSpace, checkAvailabilityFn, checkStorageSpaceFn, isAvailable]);
  
  return {
    error,
    isAvailable,
    usage,
    isNearlyFull,
    clearError,
    checkAvailability: checkAvailabilityFn,
    checkStorageSpace: checkStorageSpaceFn,
    reportError
  };
} 