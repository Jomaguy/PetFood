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
  try {
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
  } catch (e) {
    console.error('Error calculating storage usage:', e);
    return { used: 0 };
  }
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
 * @throws Error if storage is not available or saving fails
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available');
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
    console.error(`Error saving to storage (${key}):`, error);
    throw new Error(`Failed to save data to storage: ${error instanceof Error ? error.message : String(error)}`);
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
  
  try {
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
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Create a backup of all application data
 * @returns true if backup successful, false otherwise
 */
export function createBackup(): boolean {
  if (!isStorageAvailable()) {
    console.warn('Local storage is not available, cannot create backup');
    return false;
  }
  
  try {
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
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
}

/**
 * Restore data from the most recent backup
 * @returns true if restore successful, false otherwise
 */
export function restoreFromBackup(): boolean {
  if (!isStorageAvailable()) {
    console.warn('Local storage is not available, cannot restore backup');
    return false;
  }
  
  try {
    // Find the latest backup
    let latestBackupKey: string | null = null;
    let latestTimestamp = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX)) {
        const timestamp = parseInt(key.replace(StorageKey.BACKUP_PREFIX, ''), 10);
        if (!isNaN(timestamp) && timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
          latestBackupKey = key;
        }
      }
    }
    
    if (!latestBackupKey) {
      console.warn('No backup found');
      return false;
    }
    
    // Restore from backup
    const serializedBackup = localStorage.getItem(latestBackupKey);
    if (!serializedBackup) {
      return false;
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
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
}

/**
 * Remove old backups, keeping only the most recent ones
 * @param keepCount Number of recent backups to keep (default: 3)
 * @returns number of backups removed
 */
export function cleanupOldBackups(keepCount: number = 3): number {
  if (!isStorageAvailable()) {
    return 0;
  }
  
  try {
    // Find all backups and their timestamps
    const backups: { key: string; timestamp: number }[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(StorageKey.BACKUP_PREFIX)) {
        const timestamp = parseInt(key.replace(StorageKey.BACKUP_PREFIX, ''), 10);
        if (!isNaN(timestamp)) {
          backups.push({ key, timestamp });
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
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
    return 0;
  }
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
}

/**
 * Import user data from a JSON string
 * @param jsonData JSON string with user data
 * @returns true if import successful, false otherwise
 */
export function importData(jsonData: string): boolean {
  try {
    const importedData = JSON.parse(jsonData);
    
    // Validate imported data
    if (!importedData.schemaVersion || !importedData.exportDate) {
      throw new Error('Invalid export data format');
    }
    
    // Version check and potential migration would go here
    
    // Import data with backup first
    createBackup();
    
    if (importedData.dogProfiles?.data?.profiles) {
      saveToStorage(StorageKey.DOG_PROFILES, importedData.dogProfiles.data);
    }
    
    if (importedData.savedRecommendations?.data?.recommendations) {
      saveToStorage(StorageKey.SAVED_RECOMMENDATIONS, importedData.savedRecommendations.data);
    }
    
    if (importedData.userPreferences?.data) {
      saveToStorage(StorageKey.USER_PREFERENCES, importedData.userPreferences.data);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
} 