/**
 * Local storage utility functions
 */

// Constants for storage keys
export const STORAGE_KEYS = {
  DOG_PROFILES: 'petfood_dog_profiles',
  FOOD_DATABASE: 'petfood_food_database',
  USER_PREFERENCES: 'petfood_user_preferences',
  STORAGE_VERSION: 'petfood_storage_version'
};

// Current storage version
export const CURRENT_STORAGE_VERSION = '1.0';

/**
 * Interface for versioned storage data
 */
interface VersionedData<T> {
  version: string;
  data: T;
  timestamp: number;
}

/**
 * Save data to local storage with versioning
 * @param key Storage key
 * @param data Data to store
 * @returns true if successful, false otherwise
 */
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const versionedData: VersionedData<T> = {
      version: CURRENT_STORAGE_VERSION,
      data,
      timestamp: Date.now()
    };
    
    const serialized = JSON.stringify(versionedData);
    localStorage.setItem(key, serialized);
    localStorage.setItem(STORAGE_KEYS.STORAGE_VERSION, CURRENT_STORAGE_VERSION);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Load data from local storage with version checking
 * @param key Storage key
 * @param defaultValue Default value if data not found or invalid
 * @returns The stored data or the default value
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    
    if (!serialized) {
      return defaultValue;
    }
    
    const versionedData = JSON.parse(serialized) as VersionedData<T>;
    
    // Check if version matches
    if (versionedData.version !== CURRENT_STORAGE_VERSION) {
      console.warn(`Storage version mismatch for ${key}. Expected ${CURRENT_STORAGE_VERSION}, got ${versionedData.version}`);
      // Here we could implement migration logic for different versions
      // For now, just return the default value
      return defaultValue;
    }
    
    return versionedData.data;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Clear all application data from local storage
 */
export function clearAllStorageData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if local storage is available
 * @returns true if local storage is available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
} 