'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { 
  UserPreferences, 
  DEFAULT_USER_PREFERENCES, 
  RecommendationFilterOptions, 
  RecommendationSortOptions 
} from '../types/userPreferences';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage, isLocalStorageAvailable } from '../utils/localStorage';

/**
 * State interface for the user preferences context
 */
interface UserPreferencesState {
  /**
   * The user preferences
   */
  preferences: UserPreferences;
  
  /**
   * Indicates if data has been initialized from storage
   */
  initialized: boolean;
}

/**
 * Actions interface for user preferences
 */
interface UserPreferencesActions {
  /**
   * Update user preferences
   */
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  /**
   * Set the active dog profile ID
   */
  setActiveDogProfileId: (profileId: string | undefined) => void;
  
  /**
   * Toggle between light and dark theme
   */
  toggleTheme: () => void;
  
  /**
   * Switch unit system between metric and imperial
   */
  toggleUnitSystem: () => void;
  
  /**
   * Toggle notifications on/off
   */
  toggleNotifications: () => void;
  
  /**
   * Reset preferences to defaults
   */
  resetPreferences: () => void;
  
  /**
   * Save or unsave a recommendation
   */
  toggleSavedRecommendation: (productId: string) => void;
  
  /**
   * Check if a recommendation is saved
   */
  isRecommendationSaved: (productId: string) => boolean;
  
  /**
   * Get all saved recommendation product IDs
   */
  getSavedRecommendations: () => string[];
  
  /**
   * Update recommendation filters
   */
  updateRecommendationFilters: (filters: Partial<RecommendationFilterOptions>) => void;
  
  /**
   * Update recommendation sorting
   */
  updateRecommendationSort: (sort: Partial<RecommendationSortOptions>) => void;
  
  /**
   * Reset recommendation filters to defaults
   */
  resetRecommendationFilters: () => void;
}

/**
 * Initial state for user preferences
 */
const initialUserPreferencesState: UserPreferencesState = {
  preferences: DEFAULT_USER_PREFERENCES,
  initialized: false
};

/**
 * Combined type for state and actions
 */
type UserPreferencesContextType = UserPreferencesState & UserPreferencesActions;

/**
 * User preferences context for providing access to user settings
 */
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

/**
 * Props for the user preferences provider component
 */
interface UserPreferencesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for user preferences context
 */
export function UserPreferencesProvider({ children }: UserPreferencesProviderProps) {
  const [state, setState] = useState<UserPreferencesState>(initialUserPreferencesState);
  const [storageAvailable] = useState<boolean>(isLocalStorageAvailable());
  
  // Load preferences from local storage on mount
  useEffect(() => {
    if (!storageAvailable) {
      console.warn('Local storage is not available. User preferences will not persist.');
      setState(prev => ({ ...prev, initialized: true }));
      return;
    }
    
    try {
      const savedState = loadFromLocalStorage<UserPreferencesState>(
        STORAGE_KEYS.USER_PREFERENCES, 
        { ...initialUserPreferencesState, initialized: true }
      );
      
      setState({
        preferences: savedState.preferences,
        initialized: true
      });
    } catch (error) {
      console.error('Error loading user preferences from storage:', error);
      setState(prev => ({ ...prev, initialized: true }));
    }
  }, [storageAvailable]);
  
  // Save preferences to local storage whenever they change
  useEffect(() => {
    // Skip initial save before data is initialized
    if (!state.initialized || !storageAvailable) return;
    
    saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, state);
  }, [state, storageAvailable]);
  
  /**
   * Update user preferences
   */
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        ...newPreferences,
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  /**
   * Set the active dog profile ID
   */
  const setActiveDogProfileId = useCallback((profileId: string | undefined) => {
    updatePreferences({ activeDogProfileId: profileId });
  }, [updatePreferences]);
  
  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    setState(prevState => {
      const currentTheme = prevState.preferences.theme;
      let newTheme: UserPreferences['theme'];
      
      // Cycle through themes: light -> dark -> system -> light
      switch (currentTheme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'system';
          break;
        case 'system':
        default:
          newTheme = 'light';
      }
      
      return {
        ...prevState,
        preferences: {
          ...prevState.preferences,
          theme: newTheme,
          lastUpdated: new Date()
        }
      };
    });
  }, []);
  
  /**
   * Switch unit system between metric and imperial
   */
  const toggleUnitSystem = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        unitSystem: prevState.preferences.unitSystem === 'metric' ? 'imperial' : 'metric',
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  /**
   * Toggle notifications on/off
   */
  const toggleNotifications = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        notifications: !prevState.preferences.notifications,
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    setState({
      preferences: {
        ...DEFAULT_USER_PREFERENCES,
        lastUpdated: new Date()
      },
      initialized: true
    });
  }, []);
  
  /**
   * Save or unsave a recommendation
   */
  const toggleSavedRecommendation = useCallback((productId: string) => {
    setState(prevState => {
      const newSavedRecommendations = { ...prevState.preferences.savedRecommendations };
      
      if (newSavedRecommendations[productId]) {
        delete newSavedRecommendations[productId];
      } else {
        newSavedRecommendations[productId] = true;
      }
      
      return {
        ...prevState,
        preferences: {
          ...prevState.preferences,
          savedRecommendations: newSavedRecommendations,
          lastUpdated: new Date()
        }
      };
    });
  }, []);
  
  /**
   * Check if a recommendation is saved
   */
  const isRecommendationSaved = useCallback((productId: string) => {
    return !!state.preferences.savedRecommendations[productId];
  }, [state.preferences.savedRecommendations]);
  
  /**
   * Get all saved recommendation product IDs
   */
  const getSavedRecommendations = useCallback(() => {
    return Object.keys(state.preferences.savedRecommendations);
  }, [state.preferences.savedRecommendations]);
  
  /**
   * Update recommendation filters
   */
  const updateRecommendationFilters = useCallback((filters: Partial<RecommendationFilterOptions>) => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        recommendationPreferences: {
          ...prevState.preferences.recommendationPreferences,
          filters: {
            ...prevState.preferences.recommendationPreferences.filters,
            ...filters
          }
        },
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  /**
   * Update recommendation sorting
   */
  const updateRecommendationSort = useCallback((sort: Partial<RecommendationSortOptions>) => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        recommendationPreferences: {
          ...prevState.preferences.recommendationPreferences,
          sort: {
            ...prevState.preferences.recommendationPreferences.sort,
            ...sort
          }
        },
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  /**
   * Reset recommendation filters to defaults
   */
  const resetRecommendationFilters = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        recommendationPreferences: {
          ...prevState.preferences.recommendationPreferences,
          filters: DEFAULT_USER_PREFERENCES.recommendationPreferences.filters
        },
        lastUpdated: new Date()
      }
    }));
  }, []);
  
  // Combine state and actions
  const value: UserPreferencesContextType = {
    ...state,
    updatePreferences,
    setActiveDogProfileId,
    toggleTheme,
    toggleUnitSystem,
    toggleNotifications,
    resetPreferences,
    toggleSavedRecommendation,
    isRecommendationSaved,
    getSavedRecommendations,
    updateRecommendationFilters,
    updateRecommendationSort,
    resetRecommendationFilters
  };
  
  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

/**
 * Custom hook to use the user preferences context
 * @returns User preferences context state and actions
 * @throws Error if used outside of a UserPreferencesProvider
 */
export function useUserPreferences(): UserPreferencesContextType {
  const context = useContext(UserPreferencesContext);
  
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  return context;
} 