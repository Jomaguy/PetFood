'use client';

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { NutritionalInfo } from './NutritionalInfo';
import { IngredientsList } from './IngredientsList';
import { Button } from '../atoms/Button';

interface RecommendationCompareProps {
  recommendations: any[]; // Using any for now, could be replaced with a specific type
  onClose: () => void;
  className?: string;
}

export const RecommendationCompare: React.FC<RecommendationCompareProps> = ({
  recommendations,
  onClose,
  className = ''
}) => {
  const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null);
  const { isRecommendationSaved, toggleSavedRecommendation } = useUserPreferences();
  
  // Calculate property with maximum value for highlighting
  const getMaxValuesIndices = () => {
    const properties = [
      { key: 'nutritionalHighlights.protein', label: 'Protein' },
      { key: 'nutritionalHighlights.fat', label: 'Fat' },
      { key: 'nutritionalHighlights.fiber', label: 'Fiber' },
      { key: 'match', label: 'Match' },
      { key: 'rating', label: 'Rating' }
    ];
    
    const maxIndices: Record<string, number> = {};
    
    properties.forEach(prop => {
      let maxVal = -Infinity;
      let maxIndex = -1;
      
      recommendations.forEach((rec, index) => {
        const value = prop.key.split('.').reduce((obj, key) => obj?.[key], rec);
        if (value !== undefined && value > maxVal) {
          maxVal = value;
          maxIndex = index;
        }
      });
      
      if (maxIndex !== -1) {
        maxIndices[prop.key] = maxIndex;
      }
    });
    
    return maxIndices;
  };
  
  const maxValuesIndices = getMaxValuesIndices();
  
  // Handle keydown for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  if (recommendations.length === 0) {
    return null;
  }
  
  // Format price as number for comparison
  const formatPriceAsNumber = (price: string) => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  };
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Compare Dog Foods</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close comparison"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Comparison Content */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-gray-600 font-medium w-[200px]">Product</th>
                {recommendations.map((rec, index) => (
                  <th 
                    key={rec.id}
                    className={`p-4 min-w-[250px] ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    }`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 relative mb-2 overflow-hidden rounded-lg">
                        <img
                          src={rec.imageSrc}
                          alt={rec.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 text-center">{rec.title}</h3>
                      <p className="text-sm text-gray-500">{rec.brand}</p>
                      
                      <div className="flex items-center mt-2 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleSavedRecommendation(rec.id)}
                          className="text-xs px-2 py-1"
                        >
                          {isRecommendationSaved(rec.id) ? (
                            <span className="flex items-center">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Saved
                            </span>
                          ) : (
                            'Save'
                          )}
                        </Button>
                        
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs px-2 py-1"
                          onClick={() => window.open(`/product/${rec.id}`, '_blank')}
                        >
                          <span className="flex items-center">
                            <ArrowTopRightOnSquareIcon className="h-3 w-3 mr-1" />
                            View
                          </span>
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Match */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Match</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`match-${rec.id}`}
                    className={`p-4 text-center ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    } ${maxValuesIndices['match'] === index ? 'font-bold text-green-600' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.match ? `${rec.match}%` : 'N/A'}
                  </td>
                ))}
              </tr>
              
              {/* Price */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Price</td>
                {recommendations.map((rec, index) => {
                  const prices = recommendations.map(r => formatPriceAsNumber(r.price));
                  const minPrice = Math.min(...prices.filter(p => p > 0));
                  const isMinPrice = rec.price && formatPriceAsNumber(rec.price) === minPrice;
                  
                  return (
                    <td 
                      key={`price-${rec.id}`}
                      className={`p-4 text-center ${
                        highlightedColumn === index ? 'bg-blue-50' : ''
                      } ${isMinPrice ? 'font-bold text-green-600' : ''}`}
                      onMouseEnter={() => setHighlightedColumn(index)}
                      onMouseLeave={() => setHighlightedColumn(null)}
                    >
                      {rec.price || 'N/A'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Rating */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Rating</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`rating-${rec.id}`}
                    className={`p-4 text-center ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    } ${maxValuesIndices['rating'] === index ? 'font-bold text-green-600' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.rating 
                      ? <div className="flex items-center justify-center">
                          <span className="mr-1">{rec.rating.toFixed(1)}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              
              {/* Protein */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Protein</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`protein-${rec.id}`}
                    className={`p-4 text-center ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    } ${maxValuesIndices['nutritionalHighlights.protein'] === index ? 'font-bold text-green-600' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.nutritionalHighlights?.protein
                      ? `${rec.nutritionalHighlights.protein}%` 
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              
              {/* Fat */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Fat</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`fat-${rec.id}`}
                    className={`p-4 text-center ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    } ${maxValuesIndices['nutritionalHighlights.fat'] === index ? 'font-bold text-green-600' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.nutritionalHighlights?.fat
                      ? `${rec.nutritionalHighlights.fat}%` 
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              
              {/* Fiber */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Fiber</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`fiber-${rec.id}`}
                    className={`p-4 text-center ${
                      highlightedColumn === index ? 'bg-blue-50' : ''
                    } ${maxValuesIndices['nutritionalHighlights.fiber'] === index ? 'font-bold text-green-600' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.nutritionalHighlights?.fiber
                      ? `${rec.nutritionalHighlights.fiber}%` 
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              
              {/* Features */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Features</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`features-${rec.id}`}
                    className={`p-4 ${highlightedColumn === index ? 'bg-blue-50' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    {rec.dietaryFeatures && rec.dietaryFeatures.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {rec.dietaryFeatures.map((feature: string, i: number) => (
                          <span 
                            key={i} 
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    ) : 'None'}
                  </td>
                ))}
              </tr>
              
              {/* Ingredients */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium text-gray-700">Key Ingredients</td>
                {recommendations.map((rec, index) => (
                  <td 
                    key={`ingredients-${rec.id}`}
                    className={`p-4 ${highlightedColumn === index ? 'bg-blue-50' : ''}`}
                    onMouseEnter={() => setHighlightedColumn(index)}
                    onMouseLeave={() => setHighlightedColumn(null)}
                  >
                    <div className="max-h-40 overflow-y-auto">
                      {rec.ingredients && rec.ingredients.length > 0 ? (
                        <IngredientsList 
                          ingredients={rec.ingredients.slice(0, 5)} 
                          className="text-center"
                        />
                      ) : 'Not available'}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCompare; 