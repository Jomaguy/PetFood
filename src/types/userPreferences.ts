/**
 * TypeScript interfaces for User Preferences
 */

/**
 * Interface for recommendation filters
 */
export interface RecommendationFilterOptions {
  /**
   * Dietary preferences for filtering (e.g., grain-free, high-protein)
   */
  dietaryFilters: string[];
  
  /**
   * Minimum protein percentage
   */
  minProtein?: number;
  
  /**
   * Maximum protein percentage
   */
  maxProtein?: number;
  
  /**
   * Filter by selected brands
   */
  brands: string[];
  
  /**
   * Ingredients to include in results
   */
  includeIngredients: string[];
  
  /**
   * Ingredients to exclude from results
   */
  excludeIngredients: string[];
}

/**
 * Interface for recommendation sorting options
 */
export interface RecommendationSortOptions {
  /**
   * Sort field
   */
  sortBy: 'match' | 'price' | 'rating' | 'protein' | 'relevance';
  
  /**
   * Sort direction
   */
  sortDirection: 'asc' | 'desc';
}

/**
 * Interface for user preferences
 */
export interface UserPreferences {
  /**
   * Preferred unit system for the application
   */
  unitSystem: 'metric' | 'imperial';
  
  /**
   * ID of the currently active dog profile
   */
  activeDogProfileId?: string;
  
  /**
   * Whether to enable notifications
   */
  notifications: boolean;
  
  /**
   * Theme preference for the application
   */
  theme: 'light' | 'dark' | 'system';
  
  /**
   * Saved food recommendations by product ID
   */
  savedRecommendations: Record<string, boolean>;
  
  /**
   * Preferences for recommendation filtering and sorting
   */
  recommendationPreferences: {
    /**
     * Filtering options for recommendations
     */
    filters: RecommendationFilterOptions;
    
    /**
     * Sorting options for recommendations
     */
    sort: RecommendationSortOptions;
  };
  
  /**
   * Date when preferences were last updated
   */
  lastUpdated?: Date;
}

/**
 * Default/initial values for user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  unitSystem: 'metric',
  notifications: true,
  theme: 'system',
  savedRecommendations: {},
  recommendationPreferences: {
    filters: {
      dietaryFilters: [],
      brands: [],
      includeIngredients: [],
      excludeIngredients: []
    },
    sort: {
      sortBy: 'match',
      sortDirection: 'desc'
    }
  }
}; 