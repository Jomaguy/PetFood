import { DogProfile } from './dogProfile';
import { FoodRecommendation } from '../utils/recommendationAlgorithm';

/**
 * Schema version for storage
 * Increment this when making breaking changes to storage schemas
 */
export const SCHEMA_VERSION = '1.0';

/**
 * Base schema for all stored data with versioning support
 */
export interface BaseStorageSchema<T> {
  /** Schema version */
  version: string;
  /** Last updated timestamp */
  updatedAt: number;
  /** Actual data */
  data: T;
}

/**
 * Dog profiles storage schema
 */
export interface DogProfilesStorageSchema extends BaseStorageSchema<{
  /** Map of profile IDs to profiles */
  profiles: Record<string, DogProfile>;
  /** ID of the active profile */
  activeProfileId?: string;
}> {}

/**
 * Saved recommendation storage schema
 */
export interface SavedRecommendationsStorageSchema extends BaseStorageSchema<{
  /** Map of product IDs to saved recommendations */
  recommendations: Record<string, FoodRecommendation>;
  /** Date each recommendation was saved */
  savedDates: Record<string, number>;
}> {}

/**
 * User preferences storage schema
 */
export interface UserPreferencesStorageSchema extends BaseStorageSchema<{
  /** Unit system preference (metric/imperial) */
  unitSystem: 'metric' | 'imperial';
  /** UI theme preference */
  theme: 'light' | 'dark' | 'system';
  /** Notification preferences */
  notifications: boolean;
  /** Other user settings */
  settings: Record<string, any>;
}> {}

/**
 * Storage keys for local storage
 */
export enum StorageKey {
  DOG_PROFILES = 'petfood_dog_profiles',
  SAVED_RECOMMENDATIONS = 'petfood_saved_recommendations',
  USER_PREFERENCES = 'petfood_user_preferences',
  STORAGE_VERSION = 'petfood_storage_version',
  BACKUP_PREFIX = 'petfood_backup_'
}

/**
 * Default values for dog profiles storage
 */
export const DEFAULT_DOG_PROFILES_STORAGE: DogProfilesStorageSchema = {
  version: SCHEMA_VERSION,
  updatedAt: Date.now(),
  data: {
    profiles: {},
    activeProfileId: undefined
  }
};

/**
 * Default values for saved recommendations storage
 */
export const DEFAULT_SAVED_RECOMMENDATIONS_STORAGE: SavedRecommendationsStorageSchema = {
  version: SCHEMA_VERSION,
  updatedAt: Date.now(),
  data: {
    recommendations: {},
    savedDates: {}
  }
};

/**
 * Default values for user preferences storage
 */
export const DEFAULT_USER_PREFERENCES_STORAGE: UserPreferencesStorageSchema = {
  version: SCHEMA_VERSION,
  updatedAt: Date.now(),
  data: {
    unitSystem: 'metric',
    theme: 'system',
    notifications: true,
    settings: {}
  }
}; 