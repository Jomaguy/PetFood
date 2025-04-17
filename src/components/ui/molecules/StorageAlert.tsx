'use client';

import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { isStorageNearlyFull, getStorageUsage, restoreFromBackup, isStorageAvailable } from '../../../utils/storageUtils';

interface StorageAlertProps {
  /** Custom threshold percentage for warnings (default: 80) */
  threshold?: number;
  /** Check interval in milliseconds (default: 5 minutes) */
  checkInterval?: number;
  /** Whether to show the alert (default: true) */
  enabled?: boolean;
}

/**
 * Component that displays storage alerts and warnings to users
 */
export const StorageAlert: React.FC<StorageAlertProps> = ({
  threshold = 80,
  checkInterval = 5 * 60 * 1000, // 5 minutes
  enabled = true
}) => {
  const [isNearlyFull, setIsNearlyFull] = useState<boolean>(false);
  const [percentUsed, setPercentUsed] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check storage status
  const checkStorage = () => {
    if (!enabled || !isStorageAvailable()) return;
    
    try {
      // Check if storage is nearly full
      const nearlyFull = isStorageNearlyFull(threshold);
      setIsNearlyFull(nearlyFull);
      
      // Get percentage used
      const usage = getStorageUsage();
      if (usage.percentUsed) {
        setPercentUsed(Math.round(usage.percentUsed));
      }
      
      // Show alert if storage is nearly full
      if (nearlyFull) {
        setShowAlert(true);
      }
    } catch (err) {
      setError('Error checking storage status');
      console.error('Storage check error:', err);
    }
  };
  
  // Restore from backup
  const handleRestore = () => {
    try {
      const success = restoreFromBackup();
      if (success) {
        setError(null);
        setShowAlert(false);
        // Re-check storage after restore
        setTimeout(checkStorage, 500);
      } else {
        setError('No backup available to restore');
      }
    } catch (err) {
      setError('Failed to restore from backup');
      console.error('Restore error:', err);
    }
  };
  
  // Dismiss the alert
  const dismissAlert = () => {
    setShowAlert(false);
  };
  
  // Set up periodic storage checks
  useEffect(() => {
    if (!enabled) return;
    
    // Initial check
    checkStorage();
    
    // Set up interval
    const intervalId = setInterval(checkStorage, checkInterval);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, threshold, checkInterval]);
  
  // Don't render anything if no alert to show
  if (!showAlert || !isNearlyFull) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Storage Warning</h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>
              Your browser storage is {percentUsed}% full. To avoid data loss, consider:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Exporting your data as a backup</li>
              <li>Removing unused dog profiles</li>
              <li>Clearing old saved recommendations</li>
            </ul>
            {error && (
              <p className="mt-2 text-red-600 text-xs">{error}</p>
            )}
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors"
              onClick={handleRestore}
            >
              Restore from Backup
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors"
              onClick={checkStorage}
            >
              Check Again
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 ml-2 text-yellow-400 hover:text-yellow-500"
          onClick={dismissAlert}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}; 