import React, { useState } from 'react';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  PlusCircleIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';
import { RecommendationFilterOptions } from '@/types/userPreferences';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Button } from '../atoms/Button';

interface RecommendationFiltersProps {
  className?: string;
  availableBrands: string[];
  availableDietaryFeatures: string[];
  commonIngredients: string[];
}

export const RecommendationFilters: React.FC<RecommendationFiltersProps> = ({
  className = '',
  availableBrands,
  availableDietaryFeatures,
  commonIngredients
}) => {
  const { 
    preferences,
    updateRecommendationFilters,
    resetRecommendationFilters
  } = useUserPreferences();
  
  const { filters } = preferences.recommendationPreferences;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [newIncludeIngredient, setNewIncludeIngredient] = useState('');
  const [newExcludeIngredient, setNewExcludeIngredient] = useState('');
  
  // Count active filters
  const activeFilterCount = 
    filters.dietaryFilters.length + 
    filters.brands.length + 
    filters.includeIngredients.length + 
    filters.excludeIngredients.length + 
    (filters.minProtein !== undefined ? 1 : 0) + 
    (filters.maxProtein !== undefined ? 1 : 0);
  
  const toggleBrand = (brand: string) => {
    const updatedBrands = filters.brands.includes(brand) 
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    updateRecommendationFilters({ brands: updatedBrands });
  };
  
  const toggleDietaryFilter = (filter: string) => {
    const updatedFilters = filters.dietaryFilters.includes(filter)
      ? filters.dietaryFilters.filter(f => f !== filter)
      : [...filters.dietaryFilters, filter];
    
    updateRecommendationFilters({ dietaryFilters: updatedFilters });
  };
  
  const addIngredientToInclude = () => {
    if (newIncludeIngredient && !filters.includeIngredients.includes(newIncludeIngredient)) {
      updateRecommendationFilters({
        includeIngredients: [...filters.includeIngredients, newIncludeIngredient]
      });
      setNewIncludeIngredient('');
    }
  };
  
  const removeIncludeIngredient = (ingredient: string) => {
    updateRecommendationFilters({
      includeIngredients: filters.includeIngredients.filter(i => i !== ingredient)
    });
  };
  
  const addIngredientToExclude = () => {
    if (newExcludeIngredient && !filters.excludeIngredients.includes(newExcludeIngredient)) {
      updateRecommendationFilters({
        excludeIngredients: [...filters.excludeIngredients, newExcludeIngredient]
      });
      setNewExcludeIngredient('');
    }
  };
  
  const removeExcludeIngredient = (ingredient: string) => {
    updateRecommendationFilters({
      excludeIngredients: filters.excludeIngredients.filter(i => i !== ingredient)
    });
  };
  
  const handleProteinMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateRecommendationFilters({ minProtein: value });
  };
  
  const handleProteinMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateRecommendationFilters({ maxProtein: value });
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="font-medium text-gray-800">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? (
            <MinusCircleIcon className="h-5 w-5" />
          ) : (
            <PlusCircleIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {/* Dietary Features */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Dietary Features</h4>
            <div className="flex flex-wrap gap-2">
              {availableDietaryFeatures.map(feature => (
                <button
                  key={feature}
                  onClick={() => toggleDietaryFilter(feature)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.dietaryFilters.includes(feature)
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
          
          {/* Brands */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Brands</h4>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.brands.includes(brand)
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          
          {/* Protein Range */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Protein Content (%)</h4>
            <div className="flex items-center gap-2">
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={filters.minProtein ?? ''}
                  onChange={handleProteinMinChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Min"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={filters.maxProtein ?? ''}
                  onChange={handleProteinMaxChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          
          {/* Include Ingredients */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Must Include Ingredients</h4>
            <div className="flex mb-2">
              <input
                type="text"
                value={newIncludeIngredient}
                onChange={(e) => setNewIncludeIngredient(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                placeholder="Add ingredient..."
                list="common-ingredients"
              />
              <button
                onClick={addIngredientToInclude}
                className="px-3 py-2 bg-primary-600 text-white rounded-r-md text-sm hover:bg-primary-700"
              >
                Add
              </button>
              <datalist id="common-ingredients">
                {commonIngredients.map(ingredient => (
                  <option key={ingredient} value={ingredient} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.includeIngredients.map(ingredient => (
                <div 
                  key={ingredient}
                  className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                >
                  {ingredient}
                  <button onClick={() => removeIncludeIngredient(ingredient)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Exclude Ingredients */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Must Exclude Ingredients</h4>
            <div className="flex mb-2">
              <input
                type="text"
                value={newExcludeIngredient}
                onChange={(e) => setNewExcludeIngredient(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                placeholder="Add ingredient..."
                list="common-ingredients"
              />
              <button
                onClick={addIngredientToExclude}
                className="px-3 py-2 bg-primary-600 text-white rounded-r-md text-sm hover:bg-primary-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.excludeIngredients.map(ingredient => (
                <div 
                  key={ingredient}
                  className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                >
                  {ingredient}
                  <button onClick={() => removeExcludeIngredient(ingredient)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetRecommendationFilters}
              className="text-sm"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationFilters; 