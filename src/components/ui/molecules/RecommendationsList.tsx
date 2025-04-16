import React, { useState, useMemo } from 'react';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationFilters } from './RecommendationFilters';
import { RecommendationSorter } from './RecommendationSorter';
import { RecommendationCompare } from './RecommendationCompare';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Button } from '../atoms/Button';
import { ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline';

interface RecommendationsListProps {
  isLoading?: boolean;
}

const sampleRecommendations = [
  {
    id: 'p1',
    title: 'Adult Chicken & Rice Formula',
    brand: 'Premium Paws',
    description: 'Complete and balanced nutrition for adult dogs',
    imageSrc: 'https://placehold.co/400x300/e9e3d3/2c5e4e?text=Premium+Dog+Food',
    price: '$45.99',
    rating: 4.7,
    match: 98,
    ingredients: ['Chicken', 'Brown Rice', 'Chicken Meal', 'Oatmeal', 'Barley'],
    nutritionalHighlights: {
      protein: 26,
      fat: 16,
      fiber: 4,
      caloriesPerCup: 364
    },
    explanations: [
      'Specifically formulated for adult dogs',
      'Contains quality protein from real chicken',
      'Balanced nutrients for daily energy needs',
      'Added vitamins and minerals for immune support'
    ],
    dietaryFeatures: ['Natural', 'Joint Health Support']
  },
  {
    id: 'p2',
    title: 'Puppy Growth Formula',
    brand: 'Premium Paws',
    description: 'Nutrient-rich formula for growing puppies',
    imageSrc: 'https://placehold.co/400x300/f0ebe0/2c5e4e?text=Puppy+Formula',
    price: '$49.99',
    rating: 4.8,
    match: 85,
    ingredients: ['Chicken', 'Chicken Meal', 'Brown Rice', 'Fish Oil'],
    nutritionalHighlights: {
      protein: 30,
      fat: 20,
      fiber: 3.5,
      caloriesPerCup: 380
    },
    explanations: [
      'Higher protein content for growth and development',
      'DHA from fish oil for brain development',
      'Balanced calcium and phosphorus for bone health'
    ],
    dietaryFeatures: ['Natural', 'Brain Development', 'Bone Health']
  },
  {
    id: 'p3',
    title: 'Senior Vitality Blend',
    brand: 'Premium Paws',
    description: 'Balanced nutrition to support aging dogs',
    imageSrc: 'https://placehold.co/400x300/e3e6e3/2c5e4e?text=Senior+Formula',
    price: '$47.99',
    rating: 4.5,
    match: 90,
    ingredients: ['Chicken', 'Brown Rice', 'Sweet Potatoes', 'Glucosamine'],
    nutritionalHighlights: {
      protein: 24,
      fat: 12,
      fiber: 5,
      caloriesPerCup: 340
    },
    explanations: [
      'Lower calories for less active senior dogs',
      'Added glucosamine for joint support',
      'Moderate protein levels to maintain muscle mass',
      'Added antioxidants for immune health'
    ],
    dietaryFeatures: ['Joint Support', 'Digestive Health', 'Immune Support']
  },
  {
    id: 'p4',
    title: 'Grain-Free Turkey & Sweet Potato',
    brand: 'Natural Balance',
    description: 'Limited ingredient diet for sensitive dogs',
    imageSrc: 'https://placehold.co/400x300/e9e9d3/3e2c4e?text=Grain+Free',
    price: '$52.99',
    rating: 4.6,
    match: 82,
    ingredients: ['Turkey', 'Sweet Potato', 'Peas', 'Canola Oil'],
    nutritionalHighlights: {
      protein: 22,
      fat: 14,
      fiber: 4.5,
      caloriesPerCup: 350
    },
    explanations: [
      'Grain-free formula for dogs with sensitivities',
      'Limited ingredients reduce potential allergens',
      'Quality protein from single animal source',
      'Complex carbohydrates from sweet potatoes'
    ],
    dietaryFeatures: ['Grain-Free', 'Limited Ingredient', 'Sensitive Stomach']
  },
  {
    id: 'p5',
    title: 'Weight Management Formula',
    brand: 'Healthy Hound',
    description: 'Reduced calorie formula for weight control',
    imageSrc: 'https://placehold.co/400x300/d9e3e3/4e2c2c?text=Weight+Management',
    price: '$48.99',
    rating: 4.3,
    match: 75,
    ingredients: ['Chicken Meal', 'Brown Rice', 'Peas', 'Carrots', 'Apples'],
    nutritionalHighlights: {
      protein: 28,
      fat: 10,
      fiber: 7,
      caloriesPerCup: 310
    },
    explanations: [
      'Reduced calorie content for weight management',
      'Higher fiber content to help dogs feel full',
      'Lean protein sources to maintain muscle mass',
      'L-carnitine to support fat metabolism'
    ],
    dietaryFeatures: ['Weight Control', 'High Fiber', 'Low Fat']
  },
  {
    id: 'p6',
    title: 'Salmon & Brown Rice Formula',
    brand: 'Wild Coast',
    description: 'Fish-based diet rich in omega fatty acids',
    imageSrc: 'https://placehold.co/400x300/e1e1e3/4e2c2c?text=Salmon+Formula',
    price: '$54.99',
    rating: 4.9,
    match: 88,
    ingredients: ['Salmon', 'Brown Rice', 'Salmon Meal', 'Flaxseed', 'Carrots'],
    nutritionalHighlights: {
      protein: 25,
      fat: 15,
      fiber: 3.5,
      caloriesPerCup: 360
    },
    explanations: [
      'Rich in omega-3 fatty acids for skin and coat health',
      'Novel protein source for dogs with sensitivities',
      'Natural anti-inflammatory properties',
      'Supports immune system function'
    ],
    dietaryFeatures: ['Omega Rich', 'Skin & Coat Health', 'Novel Protein']
  }
];

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ isLoading = false }) => {
  const { 
    preferences, 
    toggleSavedRecommendation, 
    isRecommendationSaved,
    getSavedRecommendations
  } = useUserPreferences();
  
  // State for comparison modal
  const [showCompare, setShowCompare] = useState(false);
  
  // State for selected recommendations (for comparison)
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  
  // Extract unique brands and dietary features for filters
  const availableBrands = useMemo(() => {
    return [...new Set(sampleRecommendations.map(item => item.brand))];
  }, []);
  
  const availableDietaryFeatures = useMemo(() => {
    const allFeatures = sampleRecommendations.flatMap(item => item.dietaryFeatures || []);
    return [...new Set(allFeatures)];
  }, []);
  
  const commonIngredients = useMemo(() => {
    // Get all ingredients from all products
    const allIngredients = sampleRecommendations.flatMap(item => 
      item.ingredients?.map(i => typeof i === 'string' ? i : i.name) || []
    );
    
    // Count occurrences
    const counts = allIngredients.reduce((acc, ingredient) => {
      acc[ingredient] = (acc[ingredient] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Return ingredients that appear in at least 2 products
    return Object.entries(counts)
      .filter(([_, count]) => count >= 2)
      .map(([ingredient]) => ingredient);
  }, []);
  
  // Get filter and sort preferences
  const { filters, sort } = preferences.recommendationPreferences;
  
  // Toggle selection of a recommendation for comparison
  const toggleRecommendationSelection = (id: string) => {
    setSelectedRecommendations(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        // Limit to 3 selections for comparison
        if (prev.length >= 3) {
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };
  
  const handleCardClick = (id: string) => {
    console.log(`Clicked card with id: ${id}`);
    // In the future, this could navigate to a detailed view
  };
  
  const handleSaveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleSavedRecommendation(id);
  };
  
  const handleCompareClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleRecommendationSelection(id);
  };
  
  // Apply filters and sorting to recommendations
  const filteredAndSortedRecommendations = useMemo(() => {
    let result = [...sampleRecommendations];
    
    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(rec => filters.brands.includes(rec.brand));
    }
    
    // Apply dietary features filter
    if (filters.dietaryFilters.length > 0) {
      result = result.filter(rec => 
        rec.dietaryFeatures && 
        filters.dietaryFilters.some(filter => rec.dietaryFeatures.includes(filter))
      );
    }
    
    // Apply protein range filters
    if (filters.minProtein !== undefined) {
      result = result.filter(rec => 
        rec.nutritionalHighlights && 
        rec.nutritionalHighlights.protein >= filters.minProtein!
      );
    }
    
    if (filters.maxProtein !== undefined) {
      result = result.filter(rec => 
        rec.nutritionalHighlights && 
        rec.nutritionalHighlights.protein <= filters.maxProtein!
      );
    }
    
    // Apply ingredient inclusion filter
    if (filters.includeIngredients.length > 0) {
      result = result.filter(rec => {
        if (!rec.ingredients || rec.ingredients.length === 0) return false;
        
        const recIngredients = rec.ingredients.map(ing => 
          typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()
        );
        
        return filters.includeIngredients.every(ingredient => 
          recIngredients.includes(ingredient.toLowerCase())
        );
      });
    }
    
    // Apply ingredient exclusion filter
    if (filters.excludeIngredients.length > 0) {
      result = result.filter(rec => {
        if (!rec.ingredients || rec.ingredients.length === 0) return true;
        
        const recIngredients = rec.ingredients.map(ing => 
          typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()
        );
        
        return !filters.excludeIngredients.some(ingredient => 
          recIngredients.includes(ingredient.toLowerCase())
        );
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const multiplier = sort.sortDirection === 'asc' ? 1 : -1;
      
      switch (sort.sortBy) {
        case 'match':
          return multiplier * ((b.match || 0) - (a.match || 0));
        
        case 'rating':
          return multiplier * ((b.rating || 0) - (a.rating || 0));
        
        case 'price':
          const aPrice = a.price ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : 0;
          const bPrice = b.price ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : 0;
          return multiplier * (aPrice - bPrice);
        
        case 'protein':
          const aProtein = a.nutritionalHighlights?.protein || 0;
          const bProtein = b.nutritionalHighlights?.protein || 0;
          return multiplier * (bProtein - aProtein);
        
        default:
          return 0;
      }
    });
    
    return result;
  }, [filters, sort, sampleRecommendations]);
  
  // Get all recommendations for comparison
  const recommendationsForComparison = useMemo(() => {
    return sampleRecommendations.filter(rec => selectedRecommendations.includes(rec.id));
  }, [selectedRecommendations]);
  
  // Get count of saved recommendations
  const savedRecommendationsCount = getSavedRecommendations().length;
  
  // View for saved recommendations only
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  
  // Apply saved filter if necessary
  const finalRecommendations = useMemo(() => {
    if (showSavedOnly) {
      return filteredAndSortedRecommendations.filter(rec => 
        isRecommendationSaved(rec.id)
      );
    }
    return filteredAndSortedRecommendations;
  }, [filteredAndSortedRecommendations, showSavedOnly, isRecommendationSaved]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <RecommendationCard
            key={`loading-${i}`}
            id={`loading-${i}`}
            title=""
            brand=""
            description=""
            imageSrc=""
            isLoading={true}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Filters */}
        <RecommendationFilters 
          availableBrands={availableBrands}
          availableDietaryFeatures={availableDietaryFeatures}
          commonIngredients={commonIngredients}
          className="w-full sm:w-auto"
        />
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Saved toggle button */}
          <Button
            variant={showSavedOnly ? "primary" : "secondary"}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="whitespace-nowrap"
          >
            <HeartIcon className="h-4 w-4 mr-1" />
            {showSavedOnly ? 'All Recommendations' : `Saved (${savedRecommendationsCount})`}
          </Button>
          
          {/* Compare button - only show when items are selected */}
          {selectedRecommendations.length > 0 && (
            <Button
              variant="primary"
              onClick={() => setShowCompare(true)}
              className="whitespace-nowrap"
            >
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Compare ({selectedRecommendations.length})
            </Button>
          )}
          
          {/* Sorter */}
          <RecommendationSorter className="ml-auto" />
        </div>
      </div>
      
      {finalRecommendations.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="relative">
              <RecommendationCard
                id={recommendation.id}
                title={recommendation.title}
                brand={recommendation.brand}
                description={recommendation.description}
                imageSrc={recommendation.imageSrc}
                price={recommendation.price}
                rating={recommendation.rating}
                match={recommendation.match}
                ingredients={recommendation.ingredients}
                nutritionalHighlights={recommendation.nutritionalHighlights}
                explanations={recommendation.explanations}
                dietaryFeatures={recommendation.dietaryFeatures}
                onClick={handleCardClick}
                className={selectedRecommendations.includes(recommendation.id) ? 'ring-2 ring-primary-500' : ''}
              />
              
              {/* Action buttons overlay */}
              <div className="absolute top-2 left-2 flex space-x-2">
                {/* Save button */}
                <button
                  onClick={(e) => handleSaveClick(e, recommendation.id)}
                  className={`p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ${
                    isRecommendationSaved(recommendation.id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                  aria-label={isRecommendationSaved(recommendation.id) ? 'Unsave recommendation' : 'Save recommendation'}
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
                
                {/* Compare checkbox */}
                <button
                  onClick={(e) => handleCompareClick(e, recommendation.id)}
                  className={`p-2 rounded-full shadow-md ${
                    selectedRecommendations.includes(recommendation.id)
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                  aria-label={
                    selectedRecommendations.includes(recommendation.id)
                      ? 'Remove from comparison'
                      : 'Add to comparison'
                  }
                >
                  <ChartBarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Comparison Modal */}
      {showCompare && (
        <RecommendationCompare
          recommendations={recommendationsForComparison}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}; 