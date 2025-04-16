'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { DogProfile, DEFAULT_DOG_PROFILE, validateDogProfile } from '../types/dogProfile';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage, isLocalStorageAvailable } from '../utils/localStorage';

/**
 * State interface for the dog profiles context
 */
interface DogProfilesState {
  /**
   * Array of all saved dog profiles
   */
  profiles: DogProfile[];
  
  /**
   * Currently active dog profile
   */
  currentProfile: DogProfile | null;

  /**
   * Indicates if data has been initialized from storage
   */
  initialized: boolean;
}

/**
 * Interface for the actions that can be performed on dog profiles
 */
interface DogProfilesActions {
  /**
   * Add a new dog profile
   */
  addProfile: (profile: DogProfile) => string;
  
  /**
   * Update an existing dog profile
   */
  updateProfile: (id: string, profile: Partial<DogProfile>) => boolean;
  
  /**
   * Delete a dog profile
   */
  deleteProfile: (id: string) => boolean;
  
  /**
   * Set the currently active dog profile
   */
  setCurrentProfile: (id: string) => boolean;
  
  /**
   * Clear the currently active dog profile
   */
  clearCurrentProfile: () => void;
  
  /**
   * Sort profiles by a given field
   */
  sortProfiles: (field: keyof DogProfile, ascending?: boolean) => DogProfile[];
  
  /**
   * Filter profiles by a given criteria
   */
  filterProfiles: (criteria: Partial<DogProfile>) => DogProfile[];
}

/**
 * Initial state for dog profiles
 */
const initialDogProfilesState: DogProfilesState = {
  profiles: [],
  currentProfile: null,
  initialized: false
};

/**
 * Combined interface for state and actions
 */
type DogProfilesContextType = DogProfilesState & DogProfilesActions;

/**
 * Dog profiles context for providing access to dog profile data
 */
const DogProfilesContext = createContext<DogProfilesContextType | undefined>(undefined);

/**
 * Props for the dog profiles provider component
 */
interface DogProfilesProviderProps {
  children: ReactNode;
}

/**
 * Generate a unique ID for a dog profile
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Provider component for dog profiles context
 */
export function DogProfilesProvider({ children }: DogProfilesProviderProps) {
  // State for dog profiles
  const [state, setState] = useState<DogProfilesState>(initialDogProfilesState);
  const [storageAvailable] = useState<boolean>(isLocalStorageAvailable());
  
  // Load profiles from local storage on mount
  useEffect(() => {
    if (!storageAvailable) {
      console.warn('Local storage is not available. Dog profiles will not persist.');
      setState(prev => ({ ...prev, initialized: true }));
      return;
    }
    
    try {
      const savedState = loadFromLocalStorage<DogProfilesState>(
        STORAGE_KEYS.DOG_PROFILES, 
        { ...initialDogProfilesState, initialized: true }
      );
      
      // Validate all loaded profiles
      const validProfiles = savedState.profiles.filter(profile => {
        const validation = validateDogProfile(profile);
        if (!validation.success) {
          console.warn(`Invalid dog profile found in storage:`, profile);
        }
        return validation.success;
      });
      
      setState({
        profiles: validProfiles,
        currentProfile: savedState.currentProfile,
        initialized: true
      });
    } catch (error) {
      console.error('Error loading dog profiles from storage:', error);
      setState(prev => ({ ...prev, initialized: true }));
    }
  }, [storageAvailable]);
  
  // Save profiles to local storage whenever they change
  useEffect(() => {
    // Skip initial save before data is initialized
    if (!state.initialized || !storageAvailable) return;
    
    saveToLocalStorage(STORAGE_KEYS.DOG_PROFILES, state);
  }, [state, storageAvailable]);
  
  /**
   * Add a new dog profile
   */
  const addProfile = useCallback((profile: DogProfile): string => {
    const id = profile.id || generateId();
    const newProfile = { 
      ...profile, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date() 
    };
    
    // Validate the profile before adding
    const validation = validateDogProfile(newProfile);
    if (!validation.success) {
      throw new Error(`Invalid dog profile: ${validation.errors?.toString()}`);
    }
    
    setState(prevState => ({
      ...prevState,
      profiles: [...prevState.profiles, newProfile],
      // If this is the first profile, set it as current
      currentProfile: prevState.profiles.length === 0 ? newProfile : prevState.currentProfile
    }));
    
    return id;
  }, []);
  
  /**
   * Update an existing dog profile
   */
  const updateProfile = useCallback((id: string, profileUpdate: Partial<DogProfile>): boolean => {
    let updated = false;
    
    setState(prevState => {
      const profileIndex = prevState.profiles.findIndex(p => p.id === id);
      
      if (profileIndex === -1) return prevState;
      
      const updatedProfile = {
        ...prevState.profiles[profileIndex],
        ...profileUpdate,
        updatedAt: new Date()
      };
      
      // Validate the updated profile
      const validation = validateDogProfile(updatedProfile);
      if (!validation.success) {
        console.error(`Invalid profile update: ${validation.errors?.toString()}`);
        return prevState;
      }
      
      const updatedProfiles = [...prevState.profiles];
      updatedProfiles[profileIndex] = updatedProfile;
      
      // Update current profile if it was the one updated
      const updatedCurrentProfile = 
        prevState.currentProfile?.id === id 
          ? updatedProfile 
          : prevState.currentProfile;
      
      updated = true;
      
      return {
        ...prevState,
        profiles: updatedProfiles,
        currentProfile: updatedCurrentProfile
      };
    });
    
    return updated;
  }, []);
  
  /**
   * Delete a dog profile
   */
  const deleteProfile = useCallback((id: string): boolean => {
    let deleted = false;
    
    setState(prevState => {
      const filteredProfiles = prevState.profiles.filter(p => p.id !== id);
      
      // If no profiles were filtered out, the profile doesn't exist
      if (filteredProfiles.length === prevState.profiles.length) {
        return prevState;
      }
      
      deleted = true;
      
      // If the deleted profile was the current one, set currentProfile to null
      const updatedCurrentProfile = 
        prevState.currentProfile?.id === id 
          ? null 
          : prevState.currentProfile;
      
      return {
        ...prevState,
        profiles: filteredProfiles,
        currentProfile: updatedCurrentProfile
      };
    });
    
    return deleted;
  }, []);
  
  /**
   * Set the currently active dog profile
   */
  const setCurrentProfile = useCallback((id: string): boolean => {
    let success = false;
    
    setState(prevState => {
      const profile = prevState.profiles.find(p => p.id === id);
      
      if (!profile) return prevState;
      
      success = true;
      
      return {
        ...prevState,
        currentProfile: profile
      };
    });
    
    return success;
  }, []);
  
  /**
   * Clear the currently active dog profile
   */
  const clearCurrentProfile = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentProfile: null
    }));
  }, []);
  
  /**
   * Sort profiles by a given field
   */
  const sortProfiles = useCallback((field: keyof DogProfile, ascending: boolean = true): DogProfile[] => {
    return [...state.profiles].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return ascending 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return ascending 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [state.profiles]);
  
  /**
   * Filter profiles by a given criteria
   */
  const filterProfiles = useCallback((criteria: Partial<DogProfile>): DogProfile[] => {
    return state.profiles.filter(profile => {
      return Object.entries(criteria).every(([key, value]) => {
        const profileValue = profile[key as keyof DogProfile];
        
        // Handle arrays (like healthConditions)
        if (Array.isArray(value) && Array.isArray(profileValue)) {
          return value.every(v => profileValue.includes(v));
        }
        
        return profileValue === value;
      });
    });
  }, [state.profiles]);
  
  // Combine state and actions
  const value: DogProfilesContextType = {
    ...state,
    addProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    clearCurrentProfile,
    sortProfiles,
    filterProfiles
  };
  
  return (
    <DogProfilesContext.Provider value={value}>
      {children}
    </DogProfilesContext.Provider>
  );
}

/**
 * Custom hook to use the dog profiles context
 * @returns Dog profiles context state and actions
 * @throws Error if used outside of a DogProfilesProvider
 */
export function useDogProfiles(): DogProfilesContextType {
  const context = useContext(DogProfilesContext);
  
  if (context === undefined) {
    throw new Error('useDogProfiles must be used within a DogProfilesProvider');
  }
  
  return context;
} 