import React from 'react';
import { ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { RecommendationSortOptions } from '@/types/userPreferences';

interface RecommendationSorterProps {
  className?: string;
}

export const RecommendationSorter: React.FC<RecommendationSorterProps> = ({
  className = ''
}) => {
  const { 
    preferences, 
    updateRecommendationSort 
  } = useUserPreferences();
  
  const { sort } = preferences.recommendationPreferences;
  
  const sortOptions = [
    { value: 'match', label: 'Match Score' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'protein', label: 'Protein Content' }
  ];
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value as RecommendationSortOptions['sortBy'];
    updateRecommendationSort({ sortBy });
  };
  
  const toggleSortDirection = () => {
    const newDirection = sort.sortDirection === 'asc' ? 'desc' : 'asc';
    updateRecommendationSort({ sortDirection: newDirection });
  };
  
  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <label htmlFor="sort-select" className="text-sm text-gray-600">
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={sort.sortBy}
          onChange={handleSortChange}
          className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>
      
      <button
        onClick={toggleSortDirection}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
          sort.sortDirection === 'desc' ? 'text-gray-700' : 'text-gray-400'
        }`}
        aria-label={`Sort ${sort.sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        title={`Current: ${sort.sortDirection === 'asc' ? 'Low to High' : 'High to Low'}`}
      >
        <ArrowsUpDownIcon className={`h-5 w-5 transform ${sort.sortDirection === 'asc' ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default RecommendationSorter; 