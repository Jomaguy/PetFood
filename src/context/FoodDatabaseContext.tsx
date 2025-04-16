'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { FoodDatabase, Product, Brand, AgeRange, BreedSize, DietaryIndicator } from '../types/foodTypes';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage, isLocalStorageAvailable } from '../utils/localStorage';

/**
 * State interface for the food database context
 */
interface FoodDatabaseState {
  /**
   * The complete food database
   */
  database: FoodDatabase | null;
  
  /**
   * Loading state for the database
   */
  isLoading: boolean;
  
  /**
   * Error state for the database
   */
  error: Error | null;

  /**
   * Indicates if data has been initialized from storage
   */
  initialized: boolean;
}

/**
 * Interface for food database actions
 */
interface FoodDatabaseActions {
  /**
   * Load the food database from a source
   */
  loadDatabase: (source?: string) => Promise<void>;
  
  /**
   * Get food by brand name
   */
  getFoodsByBrand: (brandName: string) => Product[];
  
  /**
   * Get foods suitable for a specific age range
   */
  getFoodsByAgeRange: (ageRange: AgeRange) => Product[];
  
  /**
   * Get foods suitable for a specific breed size
   */
  getFoodsByBreedSize: (breedSize: BreedSize) => Product[];
  
  /**
   * Get foods with a specific dietary indicator
   */
  getFoodsByDietaryIndicator: (indicator: DietaryIndicator) => Product[];
  
  /**
   * Get foods that include or exclude a specific ingredient
   */
  getFoodsByIngredient: (ingredient: string, includeExclude: 'include' | 'exclude') => Product[];
  
  /**
   * Get foods within a specific nutritional range
   */
  getFoodsByNutritionalRange: (nutrient: keyof Product['nutritionalValue'], min: number, max: number) => Product[];
  
  /**
   * Get brand by ID
   */
  getBrandById: (brandId: string) => Brand | undefined;
  
  /**
   * Search foods by name
   */
  searchFoods: (query: string) => Product[];
}

/**
 * Initial state for the food database
 */
const initialFoodDatabaseState: FoodDatabaseState = {
  database: null,
  isLoading: false,
  error: null,
  initialized: false
};

/**
 * Combined type for state and actions
 */
type FoodDatabaseContextType = FoodDatabaseState & FoodDatabaseActions;

/**
 * Food database context for providing access to food data
 */
const FoodDatabaseContext = createContext<FoodDatabaseContextType | undefined>(undefined);

/**
 * Props for the food database provider component
 */
interface FoodDatabaseProviderProps {
  children: ReactNode;
}

/**
 * Provider component for food database context
 */
export function FoodDatabaseProvider({ children }: FoodDatabaseProviderProps) {
  const [state, setState] = useState<FoodDatabaseState>(initialFoodDatabaseState);
  const [storageAvailable] = useState<boolean>(isLocalStorageAvailable());
  
  /**
   * Load the food database from a source
   */
  const loadDatabase = useCallback(async (source: string = '/api/food-database') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // First check if we have cached data in local storage
      if (storageAvailable) {
        const cachedData = loadFromLocalStorage<FoodDatabaseState>(
          STORAGE_KEYS.FOOD_DATABASE, 
          initialFoodDatabaseState
        );
        
        if (cachedData.database) {
          console.log('Using cached food database from local storage');
          setState(prev => ({ 
            ...prev, 
            database: cachedData.database, 
            isLoading: false,
            initialized: true 
          }));
          return;
        }
      }
      
      // If no cached data, load from API
      // In a real app, this would be an API call
      // For now, we'll simulate loading the database
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, return an empty database
      // This would be replaced with actual data in a real implementation
      const database: FoodDatabase = {
        brands: [],
        products: []
      };
      
      setState(prev => ({ 
        ...prev, 
        database, 
        isLoading: false,
        initialized: true
      }));
      
      // Save to local storage if available
      if (storageAvailable) {
        saveToLocalStorage(STORAGE_KEYS.FOOD_DATABASE, {
          database,
          isLoading: false,
          error: null,
          initialized: true
        });
      }
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      
      setState(prev => ({ 
        ...prev, 
        error: errorObject,
        isLoading: false,
        initialized: true
      }));
      
      console.error('Error loading food database:', errorObject);
    }
  }, [storageAvailable]);
  
  /**
   * Get foods by brand name
   */
  const getFoodsByBrand = useCallback((brandName: string): Product[] => {
    if (!state.database) return [];
    
    const brand = state.database.brands.find(
      b => b.name.toLowerCase() === brandName.toLowerCase()
    );
    
    if (!brand) return [];
    
    return state.database.products.filter(p => p.brandId === brand.id);
  }, [state.database]);
  
  /**
   * Get foods suitable for a specific age range
   */
  const getFoodsByAgeRange = useCallback((ageRange: AgeRange): Product[] => {
    if (!state.database) return [];
    
    return state.database.products.filter(p => 
      p.suitableAges.includes(ageRange)
    );
  }, [state.database]);
  
  /**
   * Get foods suitable for a specific breed size
   */
  const getFoodsByBreedSize = useCallback((breedSize: BreedSize): Product[] => {
    if (!state.database) return [];
    
    return state.database.products.filter(p => 
      p.suitableBreedSizes.includes(breedSize)
    );
  }, [state.database]);
  
  /**
   * Get foods with a specific dietary indicator
   */
  const getFoodsByDietaryIndicator = useCallback((indicator: DietaryIndicator): Product[] => {
    if (!state.database) return [];
    
    return state.database.products.filter(p => 
      p.dietaryIndicators.includes(indicator)
    );
  }, [state.database]);
  
  /**
   * Get foods that include or exclude a specific ingredient
   */
  const getFoodsByIngredient = useCallback((ingredient: string, includeExclude: 'include' | 'exclude'): Product[] => {
    if (!state.database) return [];
    
    const normalizedIngredient = ingredient.toLowerCase();
    
    return state.database.products.filter(product => {
      const hasIngredient = product.ingredients.some(
        i => i.name.toLowerCase().includes(normalizedIngredient)
      );
      
      return includeExclude === 'include' ? hasIngredient : !hasIngredient;
    });
  }, [state.database]);
  
  /**
   * Get foods within a specific nutritional range
   */
  const getFoodsByNutritionalRange = useCallback((
    nutrient: keyof Product['nutritionalValue'], 
    min: number, 
    max: number
  ): Product[] => {
    if (!state.database) return [];
    
    return state.database.products.filter(product => {
      const value = product.nutritionalValue[nutrient];
      
      // Skip if the nutrient is not defined
      if (value === undefined || typeof value !== 'number') return false;
      
      return value >= min && value <= max;
    });
  }, [state.database]);
  
  /**
   * Get brand by ID
   */
  const getBrandById = useCallback((brandId: string): Brand | undefined => {
    if (!state.database) return undefined;
    
    return state.database.brands.find(b => b.id === brandId);
  }, [state.database]);
  
  /**
   * Search foods by name
   */
  const searchFoods = useCallback((query: string): Product[] => {
    if (!state.database || !query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return state.database.products.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
  }, [state.database]);
  
  // Load the database on mount
  useEffect(() => {
    if (!state.initialized) {
      loadDatabase();
    }
  }, [state.initialized, loadDatabase]);
  
  // Combine state and actions
  const value: FoodDatabaseContextType = {
    ...state,
    loadDatabase,
    getFoodsByBrand,
    getFoodsByAgeRange,
    getFoodsByBreedSize,
    getFoodsByDietaryIndicator,
    getFoodsByIngredient,
    getFoodsByNutritionalRange,
    getBrandById,
    searchFoods
  };
  
  return (
    <FoodDatabaseContext.Provider value={value}>
      {children}
    </FoodDatabaseContext.Provider>
  );
}

/**
 * Custom hook to use the food database context
 * @returns Food database context state and actions
 * @throws Error if used outside of a FoodDatabaseProvider
 */
export function useFoodDatabase(): FoodDatabaseContextType {
  const context = useContext(FoodDatabaseContext);
  
  if (context === undefined) {
    throw new Error('useFoodDatabase must be used within a FoodDatabaseProvider');
  }
  
  return context;
} 