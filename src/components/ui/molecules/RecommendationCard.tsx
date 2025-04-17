'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ChevronDownIcon, ChevronUpIcon, HeartIcon } from '@heroicons/react/24/outline';
import { NutritionalInfo, NutritionalValue } from './NutritionalInfo';
import { IngredientsList, Ingredient } from './IngredientsList';
import { useUserPreferences } from '@/context/UserPreferencesContext';

export interface RecommendationCardProps {
  id: string;
  title: string;
  brand: string;
  description: string;
  imageSrc: string;
  price?: string;
  rating?: number;
  match?: number; // Percentage match to pet's needs
  onClick?: (id: string) => void;
  className?: string;
  isLoading?: boolean;
  ingredients?: string[] | Ingredient[]; // List of main ingredients - can be simple strings or Ingredient objects with highlighting
  nutritionalHighlights?: NutritionalValue;
  explanations?: string[] | { text: string; importance: 'high' | 'medium' | 'low' }[]; // Reasons why this food is recommended
  dietaryFeatures?: string[]; // Special features like "grain-free", "high-protein", etc.
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  title,
  brand,
  description,
  imageSrc,
  price,
  rating,
  match,
  onClick,
  className = '',
  isLoading = false,
  ingredients = [],
  nutritionalHighlights,
  explanations = [],
  dietaryFeatures = []
}) => {
  const [expanded, setExpanded] = useState(false);
  const { isRecommendationSaved, toggleSavedRecommendation } = useUserPreferences();
  
  const handleClick = () => {
    if (onClick && !isLoading) {
      onClick(id);
    }
  };
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card onClick from firing
    setExpanded(!expanded);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card onClick from firing
    toggleSavedRecommendation(id);
  };

  // Process explanations to handle both string[] and object[] formats
  const formattedExplanations = explanations.map(explanation => {
    if (typeof explanation === 'string') {
      return { text: explanation, importance: 'medium' as const };
    }
    return explanation as { text: string; importance: 'high' | 'medium' | 'low' };
  });

  // Loading state skeleton
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300" />
          <div className="p-4">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </Card>
    );
  }

  // Get importance color class for explanations
  const getImportanceClass = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return 'before:bg-green-500';
      case 'medium': return 'before:bg-blue-400';
      case 'low': return 'before:bg-gray-400';
      default: return 'before:bg-blue-400';
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-transform hover:shadow-lg ${className}`}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${title} by ${brand}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {match && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-sm font-bold px-2 py-1 rounded-full">
            {match}% Match
          </div>
        )}
      </div>
      
      {/* Basic Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{brand}</p>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400" aria-label={`Rated ${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={i < Math.floor(rating) ? 0 : 1.5} 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-3">{description}</p>
        
        {/* Dietary Features Tags */}
        {dietaryFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dietaryFeatures.map((feature, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        {/* Expand/Collapse Button */}
        <button 
          onClick={toggleExpand}
          className="w-full flex items-center justify-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded mb-3"
          aria-expanded={expanded}
          aria-controls={`expandable-content-${id}`}
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Show Details
            </>
          )}
        </button>
        
        {/* Expandable Content */}
        <div 
          id={`expandable-content-${id}`}
          className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Explanation Section */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Why this food is recommended</h4>
            {formattedExplanations.length > 0 ? (
              <ul className="space-y-3">
                {formattedExplanations.map((explanation, index) => (
                  <li 
                    key={index} 
                    className={`relative pl-6 text-sm text-gray-700 before:content-[''] before:absolute before:left-0 before:top-[0.4rem] before:w-3 before:h-3 before:rounded-full ${getImportanceClass(explanation.importance)}`}
                  >
                    {explanation.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No specific explanations available for this recommendation.</p>
            )}
          </div>
          
          {/* Nutritional Information Section */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Nutritional Information</h4>
            {nutritionalHighlights ? (
              <NutritionalInfo nutritionalValues={nutritionalHighlights} />
            ) : (
              <p className="text-sm text-gray-500 italic">Nutritional information not available for this product.</p>
            )}
          </div>
          
          {/* Ingredients Section */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Main Ingredients</h4>
            <IngredientsList ingredients={ingredients} />
          </div>
        </div>
        
        {/* Price and action */}
        <div className="flex items-center justify-between mt-4">
          {price && (
            <p className="font-bold text-gray-900">{price}</p>
          )}
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="secondary" 
              onClick={handleSaveClick}
              className="flex items-center"
            >
              <HeartIcon className={`h-5 w-5 mr-1 ${isRecommendationSaved(id) ? 'text-red-500 fill-red-500' : ''}`} />
              {isRecommendationSaved(id) ? 'Saved' : 'Save'}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleClick}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard; 