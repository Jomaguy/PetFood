import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export interface NutritionalValue {
  protein: number;
  fat: number;
  fiber: number;
  carbs?: number;
  moisture?: number;
  caloriesPerCup?: number;
}

interface NutritionalInfoProps {
  nutritionalValues: NutritionalValue;
  className?: string;
}

interface TooltipContentProps {
  title: string;
  content: string;
}

const TooltipContent: React.FC<TooltipContentProps> = ({ title, content }) => (
  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <div className="font-bold mb-1">{title}</div>
    <p>{content}</p>
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
  </div>
);

export const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ nutritionalValues, className = '' }) => {
  // Calculate progress bar widths based on typical ranges
  const getProgressWidth = (value: number, nutrient: 'protein' | 'fat' | 'fiber' | 'carbs' | 'moisture') => {
    const maxValues = {
      protein: 40, // Max expected protein %
      fat: 30,     // Max expected fat %
      fiber: 10,   // Max expected fiber %
      carbs: 60,   // Max expected carbs %
      moisture: 85, // Max expected moisture %
    };
    
    // Calculate width percentage capped at 100%
    const percentage = Math.min(100, (value / maxValues[nutrient]) * 100);
    return `${percentage}%`;
  };

  // Determine color based on value ranges
  const getColorClass = (value: number, nutrient: 'protein' | 'fat' | 'fiber' | 'carbs' | 'moisture') => {
    // Different color scales based on nutrient type
    switch (nutrient) {
      case 'protein':
        if (value < 20) return 'bg-blue-300';
        if (value < 30) return 'bg-blue-500';
        return 'bg-blue-700';
      case 'fat':
        if (value < 10) return 'bg-yellow-300';
        if (value < 20) return 'bg-yellow-500';
        return 'bg-yellow-700';
      case 'fiber':
        if (value < 3) return 'bg-green-300';
        if (value < 6) return 'bg-green-500';
        return 'bg-green-700';
      case 'carbs':
        if (value < 20) return 'bg-purple-300';
        if (value < 40) return 'bg-purple-500';
        return 'bg-purple-700';
      case 'moisture':
        if (value < 30) return 'bg-cyan-300';
        if (value < 60) return 'bg-cyan-500';
        return 'bg-cyan-700';
      default:
        return 'bg-gray-500';
    }
  };

  // Tooltip content for each nutrient
  const tooltipContent = {
    protein: {
      title: 'Protein',
      content: 'Essential for muscle development, immune function, and overall health. Higher values often indicate meat-rich foods.'
    },
    fat: {
      title: 'Fat',
      content: 'Provides energy, supports cell growth, and helps absorb vitamins. Quality fats are important for skin, coat, and brain health.'
    },
    fiber: {
      title: 'Fiber',
      content: 'Supports digestive health and regularity. Helps with weight management and can be beneficial for dogs with certain digestive issues.'
    },
    carbs: {
      title: 'Carbohydrates',
      content: 'Provides energy and can include grains, fruits, and vegetables. Some dogs do better on lower-carb diets.'
    },
    moisture: {
      title: 'Moisture',
      content: 'Indicates the water content of the food. Wet foods have higher moisture content than kibble, which can help with hydration.'
    },
    calories: {
      title: 'Calories',
      content: 'Measure of energy content. Important for determining proper portion sizes based on your dog\'s size, age, and activity level.'
    }
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {/* Protein */}
        <div className="group relative">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Protein</span>
              <button className="ml-1 focus:outline-none" aria-label="Protein information">
                <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <span className="text-sm font-bold text-gray-900">{nutritionalValues.protein}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getColorClass(nutritionalValues.protein, 'protein')}`} 
              style={{ width: getProgressWidth(nutritionalValues.protein, 'protein') }}
            ></div>
          </div>
          <TooltipContent {...tooltipContent.protein} />
        </div>

        {/* Fat */}
        <div className="group relative">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Fat</span>
              <button className="ml-1 focus:outline-none" aria-label="Fat information">
                <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <span className="text-sm font-bold text-gray-900">{nutritionalValues.fat}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getColorClass(nutritionalValues.fat, 'fat')}`} 
              style={{ width: getProgressWidth(nutritionalValues.fat, 'fat') }}
            ></div>
          </div>
          <TooltipContent {...tooltipContent.fat} />
        </div>

        {/* Fiber */}
        <div className="group relative">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Fiber</span>
              <button className="ml-1 focus:outline-none" aria-label="Fiber information">
                <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <span className="text-sm font-bold text-gray-900">{nutritionalValues.fiber}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getColorClass(nutritionalValues.fiber, 'fiber')}`} 
              style={{ width: getProgressWidth(nutritionalValues.fiber, 'fiber') }}
            ></div>
          </div>
          <TooltipContent {...tooltipContent.fiber} />
        </div>

        {/* Carbs (if available) */}
        {nutritionalValues.carbs !== undefined && (
          <div className="group relative">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">Carbohydrates</span>
                <button className="ml-1 focus:outline-none" aria-label="Carbohydrates information">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <span className="text-sm font-bold text-gray-900">{nutritionalValues.carbs}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getColorClass(nutritionalValues.carbs, 'carbs')}`} 
                style={{ width: getProgressWidth(nutritionalValues.carbs, 'carbs') }}
              ></div>
            </div>
            <TooltipContent {...tooltipContent.carbs} />
          </div>
        )}

        {/* Moisture (if available) */}
        {nutritionalValues.moisture !== undefined && (
          <div className="group relative">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">Moisture</span>
                <button className="ml-1 focus:outline-none" aria-label="Moisture information">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <span className="text-sm font-bold text-gray-900">{nutritionalValues.moisture}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getColorClass(nutritionalValues.moisture, 'moisture')}`} 
                style={{ width: getProgressWidth(nutritionalValues.moisture, 'moisture') }}
              ></div>
            </div>
            <TooltipContent {...tooltipContent.moisture} />
          </div>
        )}

        {/* Calories */}
        {nutritionalValues.caloriesPerCup !== undefined && (
          <div className="group relative mt-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  <span className="font-bold text-gray-900">{nutritionalValues.caloriesPerCup}</span> calories per cup
                </span>
                <button className="ml-1 focus:outline-none" aria-label="Calorie information">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <TooltipContent {...tooltipContent.calories} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionalInfo; 