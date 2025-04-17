'use client';

import { useEffect, useRef, useState } from 'react';
import { createBackup, cleanupOldBackups, isStorageAvailable } from '../utils/storageUtils';

interface UseAutoBackupOptions {
  /** Interval in milliseconds between backups (default: 24 hours) */
  backupInterval?: number;
  /** Number of backups to keep (default: 5) */
  keepCount?: number;
  /** Whether to enable automatic backups (default: true) */
  enabled?: boolean;
}

/**
 * Hook for automatic scheduled backups of application data
 */
export function useAutoBackup({
  backupInterval = 24 * 60 * 60 * 1000, // 24 hours
  keepCount = 5,
  enabled = true
}: UseAutoBackupOptions = {}) {
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Function to perform backup
  const performBackup = () => {
    if (!enabled || !isStorageAvailable()) {
      return;
    }
    
    try {
      // Create backup
      const success = createBackup();
      
      if (success) {
        // Clean up old backups
        cleanupOldBackups(keepCount);
        setLastBackup(new Date());
        setBackupStatus('success');
        setError(null);
      } else {
        throw new Error('Backup creation failed');
      }
    } catch (err) {
      setBackupStatus('error');
      setError(err instanceof Error ? err : new Error('Unknown error during backup'));
      console.error('Auto backup failed:', err);
    }
  };
  
  // Set up timer for scheduled backups
  useEffect(() => {
    if (!enabled) return;
    
    // Perform initial backup
    performBackup();
    
    // Set up interval for future backups
    const timerId = window.setInterval(performBackup, backupInterval);
    timerRef.current = timerId;
    
    // Clean up on unmount
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [enabled, backupInterval]);
  
  // Manually trigger a backup
  const triggerBackup = () => {
    performBackup();
  };
  
  return {
    lastBackup,
    backupStatus,
    error,
    triggerBackup
  };
} 