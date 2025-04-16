import { 
  saveToStorage, 
  loadFromStorage,
  isStorageAvailable,
  getStorageUsage,
  isStorageNearlyFull,
  createBackup,
  restoreFromBackup,
  cleanupOldBackups,
  saveDogProfiles,
  loadDogProfiles,
  saveRecommendations,
  loadRecommendations,
  exportData,
  importData
} from '../storageUtils';
import { StorageKey, DEFAULT_DOG_PROFILES_STORAGE } from '../../types/storageSchema';
import { Gender, ActivityLevel, WeightUnit } from '../../types/dogProfile';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => {
      return Object.keys(store)[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

// Override localStorage in the global namespace for tests
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });
  
  test('isStorageAvailable returns true when localStorage is available', () => {
    const result = isStorageAvailable();
    expect(result).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).toHaveBeenCalled();
  });
  
  test('getStorageUsage calculates usage correctly', () => {
    // Set up some test data
    mockLocalStorage.setItem('test1', 'value1');
    mockLocalStorage.setItem('test2', 'value2');
    
    const usage = getStorageUsage();
    
    expect(usage.used).toBeGreaterThan(0);
    expect(usage.available).toBeDefined();
    expect(usage.percentUsed).toBeDefined();
    expect(usage.percentUsed).toBeGreaterThan(0);
    expect(usage.percentUsed).toBeLessThan(100);
  });
  
  test('isStorageNearlyFull returns false when storage is not full', () => {
    // Small amount of test data
    mockLocalStorage.setItem('test1', 'value1');
    
    const result = isStorageNearlyFull(80);
    expect(result).toBe(false);
  });
  
  test('saveToStorage saves data with versioning', () => {
    const testData = { name: 'Test' };
    saveToStorage('test-key', testData);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', expect.any(String));
    
    // Verify saved data has version and timestamp
    const savedData = JSON.parse(mockLocalStorage.getItem('test-key')!);
    expect(savedData.version).toBeDefined();
    expect(savedData.updatedAt).toBeDefined();
    expect(savedData.data).toEqual(testData);
  });
  
  test('loadFromStorage loads and returns data correctly', () => {
    // Create test data with versioning
    const testData = { name: 'Test' };
    const versionedData = {
      version: '1.0',
      updatedAt: Date.now(),
      data: testData
    };
    mockLocalStorage.setItem('test-key', JSON.stringify(versionedData));
    
    // Load data using default value
    const defaultValue = {
      version: '1.0',
      updatedAt: 0,
      data: { name: 'Default' }
    };
    
    const result = loadFromStorage('test-key', defaultValue);
    
    expect(result.version).toBe('1.0');
    expect(result.data).toEqual(testData);
  });
  
  test('loadFromStorage returns default value when key not found', () => {
    const defaultValue = {
      version: '1.0',
      updatedAt: 0,
      data: { name: 'Default' }
    };
    
    const result = loadFromStorage('non-existent-key', defaultValue);
    
    expect(result).toEqual(defaultValue);
  });
  
  test('createBackup creates a backup of all app data', () => {
    // Set up some test data
    mockLocalStorage.setItem(StorageKey.DOG_PROFILES, JSON.stringify({ data: { profiles: {} } }));
    mockLocalStorage.setItem(StorageKey.SAVED_RECOMMENDATIONS, JSON.stringify({ data: { recommendations: {} } }));
    
    const result = createBackup();
    
    expect(result).toBe(true);
    // Should find one backup key
    const backupKeys = Object.keys(mockLocalStorage).filter(key => 
      key.startsWith(StorageKey.BACKUP_PREFIX)
    );
    expect(backupKeys.length).toBe(1);
    
    // Check backup content
    const backup = JSON.parse(mockLocalStorage.getItem(backupKeys[0])!);
    expect(backup.timestamp).toBeDefined();
    expect(backup.version).toBeDefined();
    expect(backup.dogProfiles).toBeDefined();
    expect(backup.savedRecommendations).toBeDefined();
  });
  
  test('restoreFromBackup restores data from the most recent backup', () => {
    // Create a backup
    const profilesData = JSON.stringify({ 
      version: '1.0',
      updatedAt: Date.now(),
      data: { profiles: { '1': { name: 'Buddy' } } } 
    });
    
    const timestamp = Date.now();
    const backupKey = `${StorageKey.BACKUP_PREFIX}${timestamp}`;
    
    // Create backup data
    const backup = {
      timestamp,
      version: '1.0',
      dogProfiles: profilesData,
      savedRecommendations: null,
      userPreferences: null
    };
    
    mockLocalStorage.setItem(backupKey, JSON.stringify(backup));
    
    // Clear original data
    mockLocalStorage.removeItem(StorageKey.DOG_PROFILES);
    
    // Restore from backup
    const result = restoreFromBackup();
    
    expect(result).toBe(true);
    expect(mockLocalStorage.getItem(StorageKey.DOG_PROFILES)).toBe(profilesData);
  });
  
  test('cleanupOldBackups removes old backups', () => {
    // Create multiple backups with different timestamps
    const timestamps = [
      Date.now(),
      Date.now() - 1000,
      Date.now() - 2000,
      Date.now() - 3000,
      Date.now() - 4000
    ];
    
    timestamps.forEach(ts => {
      const backupKey = `${StorageKey.BACKUP_PREFIX}${ts}`;
      mockLocalStorage.setItem(backupKey, JSON.stringify({ timestamp: ts }));
    });
    
    // Clean up backups, keeping only 3
    const removed = cleanupOldBackups(3);
    
    expect(removed).toBe(2); // Should have removed 2 oldest backups
    
    // Check remaining backups
    const remainingKeys = Object.keys(mockLocalStorage).filter(key => 
      key.startsWith(StorageKey.BACKUP_PREFIX)
    );
    expect(remainingKeys.length).toBe(3);
  });
  
  test('saveDogProfiles saves dog profiles correctly', () => {
    const profiles = {
      '1': {
        id: '1',
        name: 'Buddy',
        breed: 'Labrador',
        age: 3,
        gender: Gender.MALE,
        weight: 30,
        weightUnit: 'kg' as WeightUnit,
        activityLevel: ActivityLevel.MODERATE,
        healthConditions: []
      }
    };
    
    saveDogProfiles(profiles, '1');
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      StorageKey.DOG_PROFILES, 
      expect.any(String)
    );
    
    // Verify data structure
    const savedData = JSON.parse(mockLocalStorage.getItem(StorageKey.DOG_PROFILES)!);
    expect(savedData.data.profiles).toEqual(profiles);
    expect(savedData.data.activeProfileId).toBe('1');
  });
  
  test('loadDogProfiles loads profiles correctly', () => {
    // Set up test dog profiles
    const profiles = {
      '1': {
        id: '1',
        name: 'Buddy',
        breed: 'Labrador',
        age: 3,
        gender: Gender.MALE,
        weight: 30,
        weightUnit: 'kg' as WeightUnit,
        activityLevel: ActivityLevel.MODERATE,
        healthConditions: []
      }
    };
    
    const data = {
      profiles,
      activeProfileId: '1'
    };
    
    const storageData = {
      version: '1.0',
      updatedAt: Date.now(),
      data
    };
    
    mockLocalStorage.setItem(StorageKey.DOG_PROFILES, JSON.stringify(storageData));
    
    // Load profiles
    const result = loadDogProfiles();
    
    expect(result.data.profiles).toEqual(profiles);
    expect(result.data.activeProfileId).toBe('1');
  });
  
  test('loadDogProfiles returns default when no data found', () => {
    const result = loadDogProfiles();
    expect(result).toEqual(DEFAULT_DOG_PROFILES_STORAGE);
  });
  
  test('exportData creates a JSON string with all app data', () => {
    // Set up test data
    const dogProfilesData = {
      version: '1.0',
      updatedAt: Date.now(),
      data: { profiles: { '1': { name: 'Buddy' } } }
    };
    
    mockLocalStorage.setItem(StorageKey.DOG_PROFILES, JSON.stringify(dogProfilesData));
    
    const exportedData = exportData();
    
    // Verify exported data is a valid JSON string
    expect(typeof exportedData).toBe('string');
    
    const parsedData = JSON.parse(exportedData);
    expect(parsedData.schemaVersion).toBeDefined();
    expect(parsedData.exportDate).toBeDefined();
    expect(parsedData.dogProfiles).toBeDefined();
    expect(parsedData.savedRecommendations).toBeDefined();
    expect(parsedData.userPreferences).toBeDefined();
  });
  
  test('importData validates and imports data correctly', () => {
    // Create export data
    const exportData = {
      schemaVersion: '1.0',
      exportDate: new Date().toISOString(),
      dogProfiles: {
        version: '1.0',
        updatedAt: Date.now(),
        data: { 
          profiles: { 
            '1': { 
              id: '1',
              name: 'Buddy',
              breed: 'Labrador',
              age: 3,
              gender: Gender.MALE,
              weight: 30,
              weightUnit: 'kg' as WeightUnit,
              activityLevel: ActivityLevel.MODERATE,
              healthConditions: []
            } 
          },
          activeProfileId: '1'
        }
      },
      savedRecommendations: {
        version: '1.0',
        updatedAt: Date.now(),
        data: {
          recommendations: {},
          savedDates: {}
        }
      },
      userPreferences: {
        version: '1.0',
        updatedAt: Date.now(),
        data: {
          unitSystem: 'metric',
          theme: 'light',
          notifications: true,
          settings: {}
        }
      }
    };
    
    const result = importData(JSON.stringify(exportData));
    
    expect(result).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      StorageKey.DOG_PROFILES, 
      expect.any(String)
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      StorageKey.SAVED_RECOMMENDATIONS, 
      expect.any(String)
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      StorageKey.USER_PREFERENCES, 
      expect.any(String)
    );
  });
  
  test('importData returns false for invalid data', () => {
    const invalidData = {
      // Missing required fields
      someOtherField: true
    };
    
    const result = importData(JSON.stringify(invalidData));
    
    expect(result).toBe(false);
  });
}); 