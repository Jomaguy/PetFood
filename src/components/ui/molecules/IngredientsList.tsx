import React from 'react';

export interface Ingredient {
  name: string;
  isHighlighted?: boolean;
  description?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[] | string[];
  className?: string;
}

export const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients, className = '' }) => {
  // Check if ingredients are provided as simple strings or as Ingredient objects
  const isObjectArray = ingredients.length > 0 && typeof ingredients[0] !== 'string';
  
  // If ingredients are just strings, convert them to Ingredient objects
  const ingredientObjects: Ingredient[] = isObjectArray 
    ? (ingredients as Ingredient[]) 
    : (ingredients as string[]).map(name => ({ name }));

  return (
    <div className={`${className}`}>
      {ingredientObjects.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {ingredientObjects.map((ingredient, index) => {
            const isLast = index === ingredientObjects.length - 1;
            
            return (
              <div key={index} className="group relative inline-flex items-center">
                <span 
                  className={`${ingredient.isHighlighted 
                    ? 'font-medium text-primary-700' 
                    : 'text-gray-700'} text-sm`}
                >
                  {ingredient.name}{!isLast && ','}
                </span>
                
                {ingredient.description && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-48 bg-white border border-gray-200 text-xs rounded py-2 px-3 shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="font-bold mb-1">{ingredient.name}</p>
                    <p className="text-gray-600">{ingredient.description}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No ingredients listed for this product.</p>
      )}
    </div>
  );
};

export default IngredientsList; 