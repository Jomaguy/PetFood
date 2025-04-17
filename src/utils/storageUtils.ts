import { 
  BaseStorageSchema, 
  SCHEMA_VERSION, 
  StorageKey,
  DEFAULT_DOG_PROFILES_STORAGE,
  DEFAULT_SAVED_RECOMMENDATIONS_STORAGE,
  DEFAULT_USER_PREFERENCES_STORAGE,
  DogProfilesStorageSchema,
  SavedRecommendationsStorageSchema,
  UserPreferencesStorageSchema
} from '../types/storageSchema';
import { DogProfile } from '../types/dogProfile';
import { FoodRecommendation } from './recommendationAlgorithm';
import { StorageError, StorageErrorType, handleStorageError, tryCatchStorage } from './errorHandling';

/**
 * Check if local storage is available
 * @returns true if available, false otherwise
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey) === 'test';
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
}

/**
 * Get the estimated local storage space usage in bytes
 * @returns Object containing used space and available space (if possible to determine)
 */
export function getStorageUsage(): { used: number; available?: number; percentUsed?: number } {
  const { result, error } = tryCatchStorage(() => {
    let totalSize = 0;
    
    // Estimate space used by iterating through all keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to bytes (approximate as 2 bytes per character in UTF-16)
    const usedBytes = totalSize * 2;
    
    // Local storage limit is typically 5MB, but this varies by browser
    const estimatedLimit = 5 * 1024 * 1024;
    
    return {
      used: usedBytes,
      available: estimatedLimit - usedBytes,
      percentUsed: (usedBytes / estimatedLimit) * 100
    };
  }, 'getStorageUsage');
  
  if (error) {
    return { used: 0 };
  }
  
  return result || { used: 0 };
}

/**
 * Check if storage is nearly full (over specified threshold)
 * @param thresholdPercent Percentage threshold (default: 80%)
 * @returns true if storage usage is over threshold
 */
export function isStorageNearlyFull(thresholdPercent: number = 80): boolean {
  const usage = getStorageUsage();
  return !!usage.percentUsed && usage.percentUsed > thresholdPercent;
}

/**
 * Save data to local storage with versioning
 * @param key Storage key
 * @param data Data to save
 * @throws StorageError if storage is not available or saving fails
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (!isStorageAvailable()) {
    throw new StorageError(
      'Local storage is not available',
      StorageErrorType.STORAGE_UNAVAILABLE
    );
  }
  
  // Check if storage is nearly full
  if (isStorageNearlyFull()) {
    console.warn('Local storage is nearly full. Consider cleaning up old data.');
  }
  
  try {
    // Create versioned data container
    const storageData: BaseStorageSchema<T> = {
      version: SCHEMA_VERSION,
      updatedAt: Date.now(),
      data
    };
    
    // Serialize and save
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    // Determine if this is a quota error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new StorageError(
        'Storage quota exceeded',
        StorageErrorType.STORAGE_QUOTA_EXCEEDED,
        { originalError: error }
      );
    }
    
    throw handleStorageError(
      error, 
      `saveToStorage(${key})`, 
      StorageErrorType.WRITE_ERROR
    );
  }
}

/**
 * Load data from local storage with version checking
 * @param key Storage key
 * @param defaultValue Default value if not found or invalid
 * @returns The stored data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: BaseStorageSchema<T>): BaseStorageSchema<T> {
  if (!isStorageAvailable()) {
    console.warn('Local storage is not available');
    return defaultValue;
  }
  
  const { result, error } = tryCatchStorage(() => {
    // Get serialized data
    const serialized = localStorage.getItem(key);
    
    if (!serialized) {
      return defaultValue;
    }
    
    // Parse serialized data
    const parsedData = JSON.parse(serialized) as BaseStorageSchema<T>;
    
    // Version check
    if (parsedData.version !== SCHEMA_VERSION) {
      console.warn(`Storage schema version mismatch for ${key}. Expected ${SCHEMA_VERSION}, got ${parsedData.version}`);
      // Here we would add migration logic for different versions
      // For now just return default
      return defaultValue;
    }
    
    return parsedData;
  }, `loadFromStorage(${key})`);
  
  if (error) {
    // Attempt to recover from backup on error
    const backupResult = tryRestoreItemFromBackup(key);
    if (backupResult.success && backupResult.data) {
      try {
        const parsedBackup = JSON.parse(backupResult.data) as BaseStorageSchema<T>;
        return parsedBackup;
      } catch (e) {
        // If backup parsing fails, return default
        return defaultValue;
      }
    }
    
    return defaultValue;
  }
  
  return result || defaultValue;
}

/**
 * Try to restore a single item from its backup
 * @param key The key of the item to restore
 * @returns Success status and data if successful
 */
function tryRestoreItemFromBackup(key: string): { success: boolean; data: string | null } {
  try {
    // Find backups for this specific key
    const backupKey = `${StorageKey.BACKUP_PREFIX}${key}`;
    const backupData = localStorage.getItem(backupKey);
    
    if (backupData) {
      // Restore from backup
      localStorage.setItem(key, backupData);
      return { success: true, data: backupData };
    }
    
    return { success: false, data: null };
  } catch (e) {
    return { success: false, data: null };
  }
}

/**
 * Create a backup of all application data
 * @returns true if backup successful, false otherwise
 */
export function createBackup(): boolean {
  const { result, error } = tryCatchStorage(() => {
    if (!isStorageAvailable()) {
      throw new StorageError(
        'Local storage is not available, cannot create backup',
        StorageErrorType.STORAGE_UNAVAILABLE
      );
    }
    
    const timestamp = Date.now();
    const backupKey = `${StorageKey.BACKUP_PREFIX}${timestamp}`;
    
    // Create a backup object with all app data
    const backup = {
      timestamp,
      version: SCHEMA_VERSION,
      dogProfiles: localStorage.getItem(StorageKey.DOG_PROFILES),
      savedRecommendations: localStorage.getItem(StorageKey.SAVED_RECOMMENDATIONS),
      userPreferences: localStorage.getItem(StorageKey.USER_PREFERENCES)
    };
    
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    // Also create individual backups of each key
    if (backup.dogProfiles) {
      localStorage.setItem(`${StorageKey.BACKUP_PREFIX}${StorageKey.DOG_PROFILES}`, backup.dogProfiles);
    }
    
    if (backup.savedRecommendations) {
      localStorage.setItem(`${StorageKey.BACKUP_PREFIX}${StorageKey.SAVED_RECOMMENDATIONS}`, backup.savedRecommendations);
    }
    
    if (backup.userPreferences) {
      localStorage.setItem(`${StorageKey.BACKUP_PREFIX}${StorageKey.USER_PREFERENCES}`, backup.userPreferences);
    }
    
    return true;
  }, 'createBackup', StorageErrorType.BACKUP_ERROR);
  
  return result === true;
}

/**
 * Restore data from the most recent backup
 * @returns true if restore successful, false otherwise
 */
export function restoreFromBackup(): boolean {
  const { result, error } = tryCatchStorage(() => {
    if (!isStorageAvailable()) {
      throw new StorageError(
        'Local storage is not available, cannot restore backup',
        StorageErrorType.STORAGE_UNAVAILABLE
      );
    }
    
    // Find the latest backup
    let latestBackupKey: string | null = null;
    let latestTimestamp = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX) && !key.includes(StorageKey.DOG_PROFILES) && 
          !key.includes(StorageKey.SAVED_RECOMMENDATIONS) && !key.includes(StorageKey.USER_PREFERENCES)) {
        try {
          const timestamp = parseInt(key.replace(StorageKey.BACKUP_PREFIX, ''), 10);
          if (!isNaN(timestamp) && timestamp > latestTimestamp) {
            latestTimestamp = timestamp;
            latestBackupKey = key;
          }
        } catch (e) {
          // Skip keys that don't have valid timestamps
          continue;
        }
      }
    }
    
    if (!latestBackupKey) {
      throw new StorageError(
        'No backup found',
        StorageErrorType.RESTORE_ERROR
      );
    }
    
    // Restore from backup
    const serializedBackup = localStorage.getItem(latestBackupKey);
    if (!serializedBackup) {
      throw new StorageError(
        'Backup is empty or corrupted',
        StorageErrorType.RESTORE_ERROR
      );
    }
    
    const backup = JSON.parse(serializedBackup);
    
    if (backup.dogProfiles) {
      localStorage.setItem(StorageKey.DOG_PROFILES, backup.dogProfiles);
    }
    
    if (backup.savedRecommendations) {
      localStorage.setItem(StorageKey.SAVED_RECOMMENDATIONS, backup.savedRecommendations);
    }
    
    if (backup.userPreferences) {
      localStorage.setItem(StorageKey.USER_PREFERENCES, backup.userPreferences);
    }
    
    return true;
  }, 'restoreFromBackup', StorageErrorType.RESTORE_ERROR);
  
  return result === true;
}

/**
 * Remove old backups, keeping only the most recent ones
 * @param keepCount Number of recent backups to keep (default: 3)
 * @returns number of backups removed
 */
export function cleanupOldBackups(keepCount: number = 3): number {
  const { result, error } = tryCatchStorage(() => {
    if (!isStorageAvailable()) {
      return 0;
    }
    
    // Find all backups and their timestamps
    const backups: { key: string; timestamp: number }[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX) && !key.includes(StorageKey.DOG_PROFILES) && 
          !key.includes(StorageKey.SAVED_RECOMMENDATIONS) && !key.includes(StorageKey.USER_PREFERENCES)) {
        try {
          const timestamp = parseInt(key.replace(StorageKey.BACKUP_PREFIX, ''), 10);
          if (!isNaN(timestamp)) {
            backups.push({ key, timestamp });
          }
        } catch (e) {
          // Skip keys that don't have valid timestamps
          continue;
        }
      }
    }
    
    // Sort by timestamp (newest first)
    backups.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove old backups keeping the most recent ones
    let removedCount = 0;
    if (backups.length > keepCount) {
      const toRemove = backups.slice(keepCount);
      toRemove.forEach(backup => {
        localStorage.removeItem(backup.key);
        removedCount++;
      });
    }
    
    return removedCount;
  }, 'cleanupOldBackups');
  
  return result || 0;
}

/**
 * Save dog profiles to storage
 * @param profiles Map of dog profiles by ID
 * @param activeProfileId ID of the active profile (optional)
 */
export function saveDogProfiles(
  profiles: Record<string, DogProfile>, 
  activeProfileId?: string
): void {
  const data: DogProfilesStorageSchema['data'] = {
    profiles,
    activeProfileId
  };
  
  saveToStorage<DogProfilesStorageSchema['data']>(StorageKey.DOG_PROFILES, data);
}

/**
 * Load dog profiles from storage
 * @returns The stored dog profiles or default empty data
 */
export function loadDogProfiles(): DogProfilesStorageSchema {
  return loadFromStorage<DogProfilesStorageSchema['data']>(
    StorageKey.DOG_PROFILES, 
    DEFAULT_DOG_PROFILES_STORAGE
  );
}

/**
 * Save saved recommendations to storage
 * @param recommendations Map of saved recommendations by product ID
 */
export function saveRecommendations(recommendations: Record<string, FoodRecommendation>): void {
  const { result, error } = tryCatchStorage(() => {
    const savedDates: Record<string, number> = {};
    
    // Update timestamps for any new recommendations
    Object.keys(recommendations).forEach(id => {
      // Use existing timestamp if available, otherwise use current time
      savedDates[id] = Date.now();
    });
    
    const data: SavedRecommendationsStorageSchema['data'] = {
      recommendations,
      savedDates
    };
    
    saveToStorage<SavedRecommendationsStorageSchema['data']>(StorageKey.SAVED_RECOMMENDATIONS, data);
  }, 'saveRecommendations');
  
  if (error) {
    throw error;
  }
}

/**
 * Load saved recommendations from storage
 * @returns The stored recommendations or default empty data
 */
export function loadRecommendations(): SavedRecommendationsStorageSchema {
  return loadFromStorage<SavedRecommendationsStorageSchema['data']>(
    StorageKey.SAVED_RECOMMENDATIONS, 
    DEFAULT_SAVED_RECOMMENDATIONS_STORAGE
  );
}

/**
 * Export all user data to a downloadable JSON file
 * @returns JSON string of all user data
 */
export function exportData(): string {
  const { result, error } = tryCatchStorage(() => {
    const dogProfiles = loadDogProfiles();
    const savedRecommendations = loadRecommendations();
    const userPreferences = loadFromStorage<UserPreferencesStorageSchema['data']>(
      StorageKey.USER_PREFERENCES,
      DEFAULT_USER_PREFERENCES_STORAGE
    );
    
    const exportData = {
      schemaVersion: SCHEMA_VERSION,
      exportDate: new Date().toISOString(),
      dogProfiles,
      savedRecommendations,
      userPreferences
    };
    
    return JSON.stringify(exportData, null, 2);
  }, 'exportData', StorageErrorType.EXPORT_ERROR);
  
  if (error) {
    throw error;
  }
  
  return result || '{}';
}

/**
 * Import user data from a JSON string
 * @param jsonData JSON string with user data
 * @returns true if import successful, false otherwise
 */
export function importData(jsonData: string): boolean {
  return importDataWithStrategy(jsonData, 'replace');
}

/**
 * Cleanup old or unused data from storage based on age threshold
 * @param olderThanDays Number of days after which data is considered old (default: 90)
 * @returns Object with counts of items cleaned up by category
 */
export function cleanupStorage(olderThanDays: number = 90): { 
  recommendations: number; 
  oldBackups: number;
  total: number;
} {
  const { result, error } = tryCatchStorage(() => {
    if (!isStorageAvailable()) {
      return { recommendations: 0, oldBackups: 0, total: 0 };
    }
    
    const now = Date.now();
    const ageThreshold = now - (olderThanDays * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    let removedRecommendations = 0;
    
    // Clean up old saved recommendations
    const savedRecommendations = loadRecommendations();
    if (savedRecommendations?.data?.recommendations && savedRecommendations?.data?.savedDates) {
      const { recommendations, savedDates } = savedRecommendations.data;
      const updatedRecommendations: Record<string, FoodRecommendation> = {};
      const updatedSavedDates: Record<string, number> = {};
      
      Object.entries(recommendations).forEach(([id, recommendation]) => {
        const savedDate = savedDates[id] || 0;
        
        // Keep recommendations newer than the threshold
        if (savedDate > ageThreshold) {
          updatedRecommendations[id] = recommendation;
          updatedSavedDates[id] = savedDate;
        } else {
          removedRecommendations++;
        }
      });
      
      // Only save if we removed any recommendations
      if (removedRecommendations > 0) {
        saveToStorage(StorageKey.SAVED_RECOMMENDATIONS, {
          recommendations: updatedRecommendations,
          savedDates: updatedSavedDates
        });
      }
    }
    
    // Clean up old backups
    const oldBackups = cleanupOldBackups(3); // Keep 3 most recent backups
    
    const totalRemoved = removedRecommendations + oldBackups;
    
    return { 
      recommendations: removedRecommendations, 
      oldBackups, 
      total: totalRemoved 
    };
  }, 'cleanupStorage', StorageErrorType.CLEANUP_ERROR);
  
  return result || { recommendations: 0, oldBackups: 0, total: 0 };
}

/**
 * Download exported data as a JSON file
 * @param filename Custom filename (default: 'petfood-data-export.json')
 * @returns true if download initiated successfully, false otherwise
 */
export function downloadExportedData(filename: string = 'petfood-data-export.json'): boolean {
  const { result, error } = tryCatchStorage(() => {
    const exportString = exportData();
    
    // Create a Blob with the data
    const blob = new Blob([exportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
    
    return true;
  }, 'downloadExportedData', StorageErrorType.EXPORT_ERROR);
  
  return result === true;
}

/**
 * Import data from an uploaded file
 * @param file The uploaded File object
 * @param mergeStrategy How to handle existing data ('replace', 'merge', 'keep-newer')
 * @returns Promise resolving to true if import successful, false otherwise
 */
export async function importDataFromFile(
  file: File, 
  mergeStrategy: 'replace' | 'merge' | 'keep-newer' = 'replace'
): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importDataWithStrategy(jsonData, mergeStrategy);
        resolve(success);
      } catch (error) {
        console.error('Error importing data from file:', error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(false);
    };
    
    reader.readAsText(file);
  });
}

/**
 * Import data with the specified merge strategy
 * @param jsonData JSON string with user data
 * @param mergeStrategy How to handle existing data ('replace', 'merge', 'keep-newer')
 * @returns true if import successful, false otherwise
 */
export function importDataWithStrategy(
  jsonData: string, 
  mergeStrategy: 'replace' | 'merge' | 'keep-newer' = 'replace'
): boolean {
  const { result, error } = tryCatchStorage(() => {
    const importedData = JSON.parse(jsonData);
    
    // Validate imported data
    if (!importedData.schemaVersion || !importedData.exportDate) {
      throw new StorageError(
        'Invalid export data format',
        StorageErrorType.IMPORT_ERROR
      );
    }
    
    // Create backup before making any changes
    createBackup();
    
    // Handle dog profiles based on merge strategy
    if (importedData.dogProfiles?.data?.profiles) {
      if (mergeStrategy === 'replace') {
        // Simply replace existing data
        saveToStorage(StorageKey.DOG_PROFILES, importedData.dogProfiles.data);
      } else {
        // Merge or keep-newer strategies
        const existingProfiles = loadDogProfiles();
        
        if (existingProfiles?.data?.profiles) {
          const mergedProfiles = { ...existingProfiles.data };
          
          // Process each imported profile
          Object.entries(importedData.dogProfiles.data.profiles).forEach(([id, profile]) => {
            const existingProfile = mergedProfiles.profiles[id];
            
            if (!existingProfile) {
              // Profile doesn't exist in current data, add it
              mergedProfiles.profiles[id] = profile as DogProfile;
            } else if (mergeStrategy === 'keep-newer') {
              // Compare update timestamps and keep newer
              const importedTimestamp = importedData.dogProfiles.updatedAt || 0;
              const existingTimestamp = existingProfiles.updatedAt || 0;
              
              if (importedTimestamp > existingTimestamp) {
                mergedProfiles.profiles[id] = profile as DogProfile;
              }
            } else {
              // For 'merge' strategy, always update
              mergedProfiles.profiles[id] = profile as DogProfile;
            }
          });
          
          // Save merged profiles
          saveToStorage(StorageKey.DOG_PROFILES, mergedProfiles);
        } else {
          // No existing profiles, just import
          saveToStorage(StorageKey.DOG_PROFILES, importedData.dogProfiles.data);
        }
      }
    }
    
    // Handle recommendations with similar merge strategy
    if (importedData.savedRecommendations?.data?.recommendations) {
      if (mergeStrategy === 'replace') {
        saveToStorage(StorageKey.SAVED_RECOMMENDATIONS, importedData.savedRecommendations.data);
      } else {
        const existingRecommendations = loadRecommendations();
        
        if (existingRecommendations?.data?.recommendations) {
          const mergedRecommendations = { 
            recommendations: { ...existingRecommendations.data.recommendations },
            savedDates: { ...existingRecommendations.data.savedDates }
          };
          
          // Process each imported recommendation
          Object.entries(importedData.savedRecommendations.data.recommendations).forEach(([id, recommendation]) => {
            const existingRecommendation = mergedRecommendations.recommendations[id];
            const importedSavedDate = importedData.savedRecommendations.data.savedDates?.[id] || 0;
            const existingSavedDate = mergedRecommendations.savedDates[id] || 0;
            
            if (!existingRecommendation) {
              // Recommendation doesn't exist, add it
              mergedRecommendations.recommendations[id] = recommendation as FoodRecommendation;
              mergedRecommendations.savedDates[id] = importedSavedDate;
            } else if (mergeStrategy === 'keep-newer' && importedSavedDate > existingSavedDate) {
              // 'keep-newer' strategy - update if imported is newer
              mergedRecommendations.recommendations[id] = recommendation as FoodRecommendation;
              mergedRecommendations.savedDates[id] = importedSavedDate;
            } else if (mergeStrategy === 'merge') {
              // 'merge' strategy - always update
              mergedRecommendations.recommendations[id] = recommendation as FoodRecommendation;
              mergedRecommendations.savedDates[id] = importedSavedDate;
            }
          });
          
          // Save merged recommendations
          saveToStorage(StorageKey.SAVED_RECOMMENDATIONS, mergedRecommendations);
        } else {
          // No existing recommendations, just import
          saveToStorage(StorageKey.SAVED_RECOMMENDATIONS, importedData.savedRecommendations.data);
        }
      }
    }
    
    // Handle user preferences
    if (importedData.userPreferences?.data) {
      if (mergeStrategy === 'replace') {
        saveToStorage(StorageKey.USER_PREFERENCES, importedData.userPreferences.data);
      } else {
        const existingPreferences = loadFromStorage<UserPreferencesStorageSchema['data']>(
          StorageKey.USER_PREFERENCES,
          DEFAULT_USER_PREFERENCES_STORAGE
        );
        
        if (existingPreferences?.data) {
          if (mergeStrategy === 'keep-newer') {
            const importedTimestamp = importedData.userPreferences.updatedAt || 0;
            const existingTimestamp = existingPreferences.updatedAt || 0;
            
            if (importedTimestamp > existingTimestamp) {
              saveToStorage(StorageKey.USER_PREFERENCES, importedData.userPreferences.data);
            }
          } else {
            // For 'merge' strategy, merge objects
            const mergedPreferences = {
              ...existingPreferences.data,
              ...importedData.userPreferences.data
            };
            saveToStorage(StorageKey.USER_PREFERENCES, mergedPreferences);
          }
        } else {
          // No existing preferences, just import
          saveToStorage(StorageKey.USER_PREFERENCES, importedData.userPreferences.data);
        }
      }
    }
    
    return true;
  }, 'importDataWithStrategy', StorageErrorType.IMPORT_ERROR);
  
  return result === true;
}

/**
 * Get statistics about storage usage and item counts
 * @returns Object with storage usage statistics
 */
export function getStorageStats(): {
  usage: { used: number; available?: number; percentUsed?: number };
  counts: { dogProfiles: number; savedRecommendations: number; backups: number };
  lastUpdated: { dogProfiles?: number; savedRecommendations?: number; backups?: number };
} {
  const { result, error } = tryCatchStorage(() => {
    // Get storage usage
    const usage = getStorageUsage();
    
    // Count items
    const dogProfiles = loadDogProfiles();
    const savedRecommendations = loadRecommendations();
    
    // Count backups
    let backupCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX) && !key.includes(StorageKey.DOG_PROFILES) && 
          !key.includes(StorageKey.SAVED_RECOMMENDATIONS) && !key.includes(StorageKey.USER_PREFERENCES)) {
        backupCount++;
      }
    }
    
    // Get profile and recommendation counts
    const profileCount = dogProfiles?.data?.profiles ? Object.keys(dogProfiles.data.profiles).length : 0;
    const recommendationCount = savedRecommendations?.data?.recommendations 
      ? Object.keys(savedRecommendations.data.recommendations).length 
      : 0;
    
    return {
      usage,
      counts: {
        dogProfiles: profileCount,
        savedRecommendations: recommendationCount,
        backups: backupCount
      },
      lastUpdated: {
        dogProfiles: dogProfiles?.updatedAt,
        savedRecommendations: savedRecommendations?.updatedAt,
        backups: getLatestBackupTimestamp()
      }
    };
  }, 'getStorageStats');
  
  return result || {
    usage: { used: 0 },
    counts: { dogProfiles: 0, savedRecommendations: 0, backups: 0 },
    lastUpdated: {}
  };
}

/**
 * Get the timestamp of the most recent backup
 * @returns Timestamp of the most recent backup, or undefined if none exists
 */
function getLatestBackupTimestamp(): number | undefined {
  const { result } = tryCatchStorage(() => {
    let latestTimestamp: number | undefined;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX) && !key.includes(StorageKey.DOG_PROFILES) && 
          !key.includes(StorageKey.SAVED_RECOMMENDATIONS) && !key.includes(StorageKey.USER_PREFERENCES)) {
        try {
          const timestamp = parseInt(key.replace(StorageKey.BACKUP_PREFIX, ''), 10);
          if (!isNaN(timestamp) && (!latestTimestamp || timestamp > latestTimestamp)) {
            latestTimestamp = timestamp;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    return latestTimestamp;
  }, 'getLatestBackupTimestamp');
  
  return result || undefined;
} 