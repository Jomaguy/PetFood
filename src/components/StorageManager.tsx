'use client';

import React, { useEffect } from 'react';
import { useAutoBackup } from '../hooks/useAutoBackup';
import { StorageAlert } from './ui/molecules/StorageAlert';
import { useStorageError } from '../context/StorageErrorContext';
import { StorageError, StorageErrorType } from '../utils/errorHandling';

interface StorageManagerProps {
  /** Children to render */
  children: React.ReactNode;
  /** Auto backup interval in milliseconds (default: 24 hours) */
  backupInterval?: number;
  /** Number of backups to keep (default: 5) */
  keepCount?: number;
  /** Whether to enable automatic backups (default: true) */
  enableBackups?: boolean;
  /** Warning threshold percentage for storage (default: 80) */
  warningThreshold?: number;
}

/**
 * Component that manages local storage features including automatic backups and error handling
 */
export const StorageManager: React.FC<StorageManagerProps> = ({
  children,
  backupInterval = 24 * 60 * 60 * 1000, // 24 hours
  keepCount = 5,
  enableBackups = true,
  warningThreshold = 80
}) => {
  const { setError } = useStorageError();
  
  // Set up automatic backups
  const { lastBackup, backupStatus, error, triggerBackup } = useAutoBackup({
    backupInterval,
    keepCount,
    enabled: enableBackups
  });
  
  // Handle backup errors
  useEffect(() => {
    if (backupStatus === 'error' && error) {
      // Convert to StorageError and report to context
      const storageError = new StorageError(
        `Auto backup failed: ${error.message}`,
        StorageErrorType.BACKUP_ERROR,
        { originalError: error }
      );
      
      setError(storageError);
      console.error('Auto backup failed:', error);
    } else if (backupStatus === 'success' && lastBackup) {
      console.log(`Auto backup successful at ${lastBackup.toLocaleString()}`);
    }
  }, [backupStatus, lastBackup, error, setError]);
  
  return (
    <>
      {/* Render children */}
      {children}
      
      {/* Storage alert for warnings */}
      <StorageAlert threshold={warningThreshold} />
    </>
  );
}; 