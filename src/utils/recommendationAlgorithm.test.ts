import { 
  DogProfile, 
  Gender, 
  ActivityLevel 
} from '../types/dogProfile';
import { 
  BreedSize, 
  AgeRange,
  DietaryIndicator
} from '../types/foodTypes';
import {
  determineBreedSize,
  mapDogAgeToAgeRange,
  calculateBaseScore,
  applyAgeRule,
  applyBreedSizeRule,
  applyActivityLevelRule,
  applyHealthConditionRules,
  shouldAvoidIngredient,
  generateFoodRecommendations,
  HEALTH_CONDITION_DIETARY_MAP
} from './recommendationAlgorithm';

// Mock food product for testing
const mockProduct = {
  id: 'test-1',
  name: 'Test Product',
  brandId: 'test-brand',
  type: 'dry' as const,
  priceRange: {
    min: 20,
    max: 40,
    currency: 'USD'
  },
  description: 'A test product',
  ingredients: [
    { name: 'Chicken', potentialAllergen: false },
    { name: 'Brown Rice', potentialAllergen: false }
  ],
  nutritionalValue: {
    caloriesPerCup: 350,
    protein: 25,
    fat: 15,
    fiber: 4,
    moisture: 10,
    carbohydrates: 40
  },
  suitableAges: [AgeRange.ADULT],
  suitableBreedSizes: [BreedSize.MEDIUM],
  dietaryIndicators: [],
  packageSizes: ['4lb', '15lb'],
  specialFeatures: ['Balanced nutrition']
};

// Test profiles for different scenarios
const puppyProfile: DogProfile = {
  name: 'Puppy',
  breed: 'Labrador Retriever',
  age: 0.5,
  gender: Gender.MALE,
  weight: 10,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.HIGH,
  healthConditions: []
};

const adultProfile: DogProfile = {
  name: 'Adult',
  breed: 'Beagle',
  age: 4,
  gender: Gender.FEMALE,
  weight: 12,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.MODERATE,
  healthConditions: []
};

const seniorProfile: DogProfile = {
  name: 'Senior',
  breed: 'Poodle',
  age: 10,
  gender: Gender.MALE,
  weight: 7,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.LOW,
  healthConditions: []
};

const smallDogProfile: DogProfile = {
  name: 'Small',
  breed: 'Chihuahua',
  age: 3,
  gender: Gender.FEMALE,
  weight: 3,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.MODERATE,
  healthConditions: []
};

const largeDogProfile: DogProfile = {
  name: 'Large',
  breed: 'Great Dane',
  age: 2,
  gender: Gender.MALE,
  weight: 50,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.MODERATE,
  healthConditions: []
};

// Profiles with specific activity levels
const lowActivityProfile: DogProfile = {
  ...adultProfile,
  activityLevel: ActivityLevel.LOW
};

const highActivityProfile: DogProfile = {
  ...adultProfile,
  activityLevel: ActivityLevel.HIGH
};

const veryHighActivityProfile: DogProfile = {
  ...adultProfile,
  activityLevel: ActivityLevel.VERY_HIGH
};

// Profiles with health conditions
const allergyProfile: DogProfile = {
  ...adultProfile,
  healthConditions: ['allergies']
};

const obesityProfile: DogProfile = {
  ...adultProfile,
  healthConditions: ['obesity']
};

const jointIssuesProfile: DogProfile = {
  ...adultProfile,
  healthConditions: ['joint_issues']
};

const diabetesProfile: DogProfile = {
  ...adultProfile,
  healthConditions: ['diabetes']
};

const multiConditionProfile: DogProfile = {
  ...adultProfile,
  healthConditions: ['allergies', 'obesity', 'joint_issues']
};

// Create a profile with rare/uncommon combination to test fallback logic
const uncommonProfile: DogProfile = {
  name: 'Edge Case',
  breed: 'Mixed Breed',
  age: 0.3, // Very young puppy
  gender: Gender.MALE,
  weight: 60,
  weightUnit: 'kg', // Very large puppy
  activityLevel: ActivityLevel.VERY_HIGH,
  healthConditions: ['allergies', 'joint_issues', 'obesity'] // Multiple conditions
};

describe('Recommendation Algorithm', () => {
  describe('determineBreedSize', () => {
    it('should classify small dogs correctly', () => {
      expect(determineBreedSize(smallDogProfile)).toBe(BreedSize.SMALL);
    });

    it('should classify medium dogs correctly', () => {
      expect(determineBreedSize(adultProfile)).toBe(BreedSize.MEDIUM);
    });

    it('should classify large dogs correctly', () => {
      expect(determineBreedSize(largeDogProfile)).toBe(BreedSize.LARGE);
    });

    it('should convert pounds to kilograms', () => {
      const dogInPounds: DogProfile = {
        ...smallDogProfile,
        weight: 15,
        weightUnit: 'lbs'
      };
      expect(determineBreedSize(dogInPounds)).toBe(BreedSize.SMALL);
    });
  });

  describe('mapDogAgeToAgeRange', () => {
    it('should classify puppies correctly', () => {
      expect(mapDogAgeToAgeRange(0.5)).toBe(AgeRange.PUPPY);
    });

    it('should classify adult dogs correctly', () => {
      expect(mapDogAgeToAgeRange(4)).toBe(AgeRange.ADULT);
    });

    it('should classify senior dogs correctly', () => {
      expect(mapDogAgeToAgeRange(10)).toBe(AgeRange.SENIOR);
    });

    it('should throw error for negative ages', () => {
      expect(() => mapDogAgeToAgeRange(-1)).toThrow();
    });
  });

  describe('calculateBaseScore', () => {
    it('should give high score for perfect match', () => {
      const perfectMatchProduct = {
        ...mockProduct,
        suitableAges: [AgeRange.ADULT],
        suitableBreedSizes: [BreedSize.MEDIUM]
      };
      
      const score = calculateBaseScore(adultProfile, perfectMatchProduct);
      expect(score).toBeGreaterThan(75);
    });

    it('should penalize age-inappropriate foods', () => {
      const ageInappropriateProduct = {
        ...mockProduct,
        suitableAges: [AgeRange.ADULT],
        suitableBreedSizes: [BreedSize.MEDIUM]
      };
      
      const score = calculateBaseScore(puppyProfile, ageInappropriateProduct);
      expect(score).toBeLessThan(50);
    });

    it('should penalize breed size-inappropriate foods', () => {
      const sizeInappropriateProduct = {
        ...mockProduct,
        suitableAges: [AgeRange.ADULT],
        suitableBreedSizes: [BreedSize.SMALL]
      };
      
      const score = calculateBaseScore(largeDogProfile, sizeInappropriateProduct);
      expect(score).toBeLessThan(50);
    });
  });

  describe('applyAgeRule', () => {
    it('should boost score for puppy-appropriate nutrition', () => {
      const puppyProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          protein: 28,
          fat: 18
        },
        specialFeatures: ['Contains DHA for puppy development']
      };
      
      const { score, reasons } = applyAgeRule(puppyProfile, puppyProduct, 50);
      expect(score).toBeGreaterThan(50);
      expect(reasons.length).toBeGreaterThan(0);
    });

    it('should boost score for senior-appropriate nutrition', () => {
      const seniorProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 320,
          fiber: 6
        },
        specialFeatures: ['Joint support for mobility']
      };
      
      const { score, reasons } = applyAgeRule(seniorProfile, seniorProduct, 50);
      expect(score).toBeGreaterThan(50);
      expect(reasons.length).toBeGreaterThan(0);
    });

    it('should handle edge case of very young puppies', () => {
      const veryYoungPuppy: DogProfile = {
        ...puppyProfile,
        age: 0.3
      };
      
      const regularPuppyFood = {
        ...mockProduct,
        specialFeatures: ['For puppies']
      };
      
      const { score: regularScore } = applyAgeRule(veryYoungPuppy, regularPuppyFood, 50);
      
      const starterPuppyFood = {
        ...mockProduct,
        specialFeatures: ['Young puppy formula', 'Starter kit']
      };
      
      const { score: starterScore } = applyAgeRule(veryYoungPuppy, starterPuppyFood, 50);
      
      expect(starterScore).toBeGreaterThan(regularScore);
    });
  });

  describe('applyBreedSizeRule', () => {
    it('should boost score for small breed appropriate features', () => {
      const smallBreedProduct = {
        ...mockProduct,
        specialFeatures: ['Small bite kibble', 'For small breeds']
      };
      
      const { score, reasons } = applyBreedSizeRule(smallDogProfile, smallBreedProduct, 50);
      expect(score).toBeGreaterThan(50);
      expect(reasons.length).toBeGreaterThan(0);
    });

    it('should boost score for large breed puppy appropriate features', () => {
      const largePuppyProfile: DogProfile = {
        ...largeDogProfile,
        age: 0.8
      };
      
      const largeBreedPuppyProduct = {
        ...mockProduct,
        specialFeatures: ['Large breed puppy formula', 'Controlled growth']
      };
      
      const { score, reasons } = applyBreedSizeRule(largePuppyProfile, largeBreedPuppyProduct, 50);
      expect(score).toBeGreaterThan(60);
      expect(reasons.length).toBeGreaterThan(0);
    });

    it('should penalize inappropriate food for large breed puppies', () => {
      const largePuppyProfile: DogProfile = {
        ...largeDogProfile,
        age: 0.8
      };
      
      const regularPuppyProduct = {
        ...mockProduct,
        specialFeatures: ['Regular puppy formula']
      };
      
      const { score, reasons } = applyBreedSizeRule(largePuppyProfile, regularPuppyProduct, 50);
      expect(score).toBeLessThan(50);
      expect(reasons).toContain('Not specially formulated for large breed puppy needs');
    });
  });

  describe('applyActivityLevelRule', () => {
    it('should boost score for low-calorie food for low activity dogs', () => {
      const lowCalorieProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 300,
          fiber: 6
        },
        dietaryIndicators: [DietaryIndicator.WEIGHT_MANAGEMENT]
      };
      
      const { score, reasons } = applyActivityLevelRule(lowActivityProfile, lowCalorieProduct, 50);
      expect(score).toBeGreaterThan(70); // Significant boost
      expect(reasons.length).toBeGreaterThan(0);
      expect(reasons.some(r => r.includes('less active'))).toBeTruthy();
    });

    it('should penalize high-calorie food for low activity dogs', () => {
      const highCalorieProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 450
        }
      };
      
      const { score, reasons } = applyActivityLevelRule(lowActivityProfile, highCalorieProduct, 50);
      expect(score).toBeLessThan(50);
      expect(reasons.some(r => r.includes('too high'))).toBeTruthy();
    });

    it('should boost score for balanced nutrition for moderate activity dogs', () => {
      const balancedProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 350,
          protein: 25,
          fat: 15
        }
      };
      
      const { score, reasons } = applyActivityLevelRule(adultProfile, balancedProduct, 50);
      expect(score).toBeGreaterThan(50);
      expect(reasons.some(r => r.includes('moderately active'))).toBeTruthy();
    });

    it('should boost score for high-protein food for high activity dogs', () => {
      const highProteinProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 420,
          protein: 28,
          fat: 18
        },
        specialFeatures: ['Performance formula', 'Active lifestyle'],
        dietaryIndicators: [DietaryIndicator.HIGH_PROTEIN]
      };
      
      const { score, reasons } = applyActivityLevelRule(highActivityProfile, highProteinProduct, 50);
      expect(score).toBeGreaterThan(75); // Significant boost
      expect(reasons.some(r => r.includes('active dogs'))).toBeTruthy();
    });

    it('should penalize low-calorie food for high activity dogs', () => {
      const lowCalorieProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 320
        }
      };
      
      const { score, reasons } = applyActivityLevelRule(highActivityProfile, lowCalorieProduct, 50);
      expect(score).toBeLessThanOrEqual(50);
      expect(reasons.some(r => r.includes('too low'))).toBeTruthy();
    });

    it('should boost score significantly for performance formulas for very high activity dogs', () => {
      const performanceProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 500,
          protein: 32,
          fat: 22
        },
        specialFeatures: ['Working dog formula', 'Sport performance', 'High energy']
      };
      
      const { score, reasons } = applyActivityLevelRule(veryHighActivityProfile, performanceProduct, 50);
      expect(score).toBeGreaterThan(100); // Very significant boost
      expect(reasons.length).toBeGreaterThan(3); // Multiple positive factors
      expect(reasons.some(r => r.includes('working') || r.includes('sport'))).toBeTruthy();
    });
  });

  describe('shouldAvoidIngredient', () => {
    it('should identify ingredients to avoid', () => {
      expect(shouldAvoidIngredient('Corn Meal', ['corn', 'wheat'])).toBeTruthy();
      expect(shouldAvoidIngredient('Wheat Gluten', ['corn', 'wheat'])).toBeTruthy();
      expect(shouldAvoidIngredient('Chicken Meal', ['beef', 'chicken'])).toBeTruthy();
    });

    it('should handle partial matches correctly', () => {
      expect(shouldAvoidIngredient('Turkey Meal', ['chicken'])).toBeFalsy();
      expect(shouldAvoidIngredient('Beef Liver', ['beef'])).toBeTruthy();
    });

    it('should be case insensitive', () => {
      expect(shouldAvoidIngredient('CORN SYRUP', ['corn'])).toBeTruthy();
      expect(shouldAvoidIngredient('Wheat Flour', ['WHEAT'])).toBeTruthy();
    });

    it('should handle empty arrays correctly', () => {
      expect(shouldAvoidIngredient('Chicken', [])).toBeFalsy();
    });
  });

  describe('applyHealthConditionRules', () => {
    it('should handle dogs with no health conditions', () => {
      const { score, reasons, warnings } = applyHealthConditionRules(adultProfile, mockProduct, 50);
      expect(score).toBe(50); // No change
      expect(reasons.length).toBe(0);
      expect(warnings.length).toBe(0);
    });

    it('should boost score for allergy-appropriate foods', () => {
      const allergyFriendlyProduct = {
        ...mockProduct,
        ingredients: [
          { name: 'Duck', potentialAllergen: false },
          { name: 'Sweet Potato', potentialAllergen: false }
        ],
        dietaryIndicators: [DietaryIndicator.LIMITED_INGREDIENT, DietaryIndicator.NATURAL],
        specialFeatures: ['For dogs with food sensitivities', 'Novel protein']
      };
      
      const { score, reasons, warnings } = applyHealthConditionRules(allergyProfile, allergyFriendlyProduct, 50);
      expect(score).toBeGreaterThan(75); // Significant boost
      expect(reasons.length).toBeGreaterThan(0);
      expect(reasons.some(r => r.includes('allergies'))).toBeTruthy();
      expect(warnings.length).toBe(0);
    });

    it('should penalize and warn about foods with allergens for allergic dogs', () => {
      const allergenicProduct = {
        ...mockProduct,
        ingredients: [
          { name: 'Chicken', potentialAllergen: true },
          { name: 'Corn', potentialAllergen: true },
          { name: 'Wheat', potentialAllergen: true }
        ]
      };
      
      const { score, reasons, warnings } = applyHealthConditionRules(allergyProfile, allergenicProduct, 50);
      expect(score).toBeLessThan(40); // Significant penalty
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].includes('problematic')).toBeTruthy();
    });

    it('should boost score for obesity-appropriate foods', () => {
      const weightManagementProduct = {
        ...mockProduct,
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 300,
          fat: 10,
          fiber: 8
        },
        dietaryIndicators: [DietaryIndicator.WEIGHT_MANAGEMENT],
        specialFeatures: ['Weight control formula', 'Reduced calories']
      };
      
      const { score, reasons } = applyHealthConditionRules(obesityProfile, weightManagementProduct, 50);
      expect(score).toBeGreaterThan(75);
      expect(reasons.some(r => r.includes('obesity'))).toBeTruthy();
    });

    it('should boost score for joint support foods for dogs with joint issues', () => {
      const jointSupportProduct = {
        ...mockProduct,
        specialFeatures: ['Joint support formula', 'Contains glucosamine and chondroitin'],
        dietaryIndicators: [DietaryIndicator.NATURAL]
      };
      
      const { score, reasons } = applyHealthConditionRules(jointIssuesProfile, jointSupportProduct, 50);
      expect(score).toBeGreaterThan(80);
      expect(reasons.some(r => r.includes('joint'))).toBeTruthy();
    });

    it('should handle dogs with multiple health conditions', () => {
      const multiConditionProduct = {
        ...mockProduct,
        ingredients: [
          { name: 'Duck', potentialAllergen: false },
          { name: 'Sweet Potato', potentialAllergen: false }
        ],
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          caloriesPerCup: 320,
          fat: 10
        },
        dietaryIndicators: [DietaryIndicator.LIMITED_INGREDIENT, DietaryIndicator.WEIGHT_MANAGEMENT],
        specialFeatures: ['Joint support formula', 'For sensitive dogs', 'Weight control']
      };
      
      const { score, reasons } = applyHealthConditionRules(multiConditionProfile, multiConditionProduct, 50);
      expect(score).toBeGreaterThan(100); // Very significant boost for meeting multiple conditions
      expect(reasons.length).toBeGreaterThan(3); // Multiple positive factors
    });

    it('should apply special handling for specific conditions like diabetes', () => {
      const diabetesFriendlyProduct = {
        ...mockProduct,
        ingredients: [
          { name: 'Chicken', potentialAllergen: false },
          { name: 'Brown Rice', potentialAllergen: false } // Complex carb, not in avoid list
        ],
        nutritionalValue: {
          ...mockProduct.nutritionalValue,
          protein: 30,
          carbohydrates: 30
        },
        dietaryIndicators: [DietaryIndicator.HIGH_PROTEIN],
        specialFeatures: ['Diabetic support formula', 'Low glycemic']
      };
      
      const { score, reasons } = applyHealthConditionRules(diabetesProfile, diabetesFriendlyProduct, 50);
      expect(score).toBeGreaterThan(80);
      expect(reasons.some(r => r.includes('diabetes'))).toBeTruthy();
    });
  });

  describe('generateFoodRecommendations', () => {
    it('should generate recommendations sorted by score', () => {
      const recommendations = generateFoodRecommendations(adultProfile);
      
      // Check that we have recommendations
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Check that recommendations are sorted by score
      for (let i = 1; i < recommendations.length; i++) {
        expect(recommendations[i-1].score).toBeGreaterThanOrEqual(recommendations[i].score);
      }
      
      // Each recommendation should have product, score, matchQuality and reasons
      recommendations.forEach(rec => {
        expect(rec.product).toBeDefined();
        expect(rec.score).toBeDefined();
        expect(rec.matchQuality).toBeDefined();
        expect(rec.reasons.length).toBeGreaterThan(0);
      });
    });

    it('should assign match qualities correctly', () => {
      const recommendations = generateFoodRecommendations(adultProfile);
      
      const excellentMatches = recommendations.filter(r => r.matchQuality === 'excellent');
      const goodMatches = recommendations.filter(r => r.matchQuality === 'good');
      const acceptableMatches = recommendations.filter(r => r.matchQuality === 'acceptable');
      
      // Check that excellent matches have higher scores than good matches
      if (excellentMatches.length > 0 && goodMatches.length > 0) {
        expect(Math.min(...excellentMatches.map(r => r.score)))
          .toBeGreaterThanOrEqual(goodMatches[0].score);
      }
      
      // Check that good matches have higher scores than acceptable matches
      if (goodMatches.length > 0 && acceptableMatches.length > 0) {
        expect(Math.min(...goodMatches.map(r => r.score)))
          .toBeGreaterThanOrEqual(acceptableMatches[0].score);
      }
    });

    it('should provide appropriate recommendations for dogs with health conditions', () => {
      const recommendationsWithAllergies = generateFoodRecommendations(allergyProfile);
      
      // Recommendations should exist
      expect(recommendationsWithAllergies.length).toBeGreaterThan(0);
      
      // Top recommendations should include mentions of allergies or sensitivities
      const topRecommendation = recommendationsWithAllergies[0];
      const allergyRelatedReasons = topRecommendation.reasons.filter(reason => 
        reason.toLowerCase().includes('allerg') || 
        reason.toLowerCase().includes('sensit')
      );
      
      expect(allergyRelatedReasons.length).toBeGreaterThan(0);
    });

    it('should consider activity level in recommendations', () => {
      const highActivityRecommendations = generateFoodRecommendations(veryHighActivityProfile);
      
      // Top recommendations should mention activity level or performance
      const topRecommendation = highActivityRecommendations[0];
      const activityRelatedReasons = topRecommendation.reasons.filter(reason => 
        reason.toLowerCase().includes('active') || 
        reason.toLowerCase().includes('energy') ||
        reason.toLowerCase().includes('protein')
      );
      
      expect(activityRelatedReasons.length).toBeGreaterThan(0);
    });
  });
});

describe('Enhanced Recommendation Features', () => {
  it('should provide fallback recommendations when strict criteria yields too few results', () => {
    // Create an extremely edge case profile that will need fallbacks
    const extremeEdgeCase: DogProfile = {
      name: 'Extreme Edge',
      breed: 'Mixed Breed',
      age: 0.2, // Very young puppy
      gender: Gender.MALE,
      weight: 80, // Extremely large for a young puppy
      weightUnit: 'kg', 
      activityLevel: ActivityLevel.VERY_HIGH,
      healthConditions: ['allergies', 'joint_issues', 'obesity', 'diabetes', 'kidney disease'] // Multiple complex conditions
    };
    
    // Use options to ensure we get at least 5 recommendations with high min requirement
    // and force relaxation for testing
    const recommendations = generateFoodRecommendations(extremeEdgeCase, { 
      minRecommendations: 5,
      forceRelaxation: true // Force relaxation for test
    });
    
    // Should have at least the requested minimum recommendations
    expect(recommendations.length).toBeGreaterThanOrEqual(5);
    
    // Check for specific fallback/relaxation phrases in the reasons
    const relaxationKeywords = ['relax', 'fallback', 'flexible'];
    
    // Should include at least one recommendation with relaxed criteria
    const relaxedRecommendations = recommendations.filter(r => 
      r.reasons.some(reason => 
        relaxationKeywords.some(keyword => reason.toLowerCase().includes(keyword))
      )
    );
    
    // There should be at least one relaxed recommendation
    expect(relaxedRecommendations.length).toBeGreaterThan(0);
  });
  
  it('should provide brand diversity in recommendations', () => {
    // Get recommendations with high diversity factor
    const recommendations = generateFoodRecommendations(adultProfile, { 
      minRecommendations: 5, 
      diversityFactor: 1.0
    });
    
    // Extract brands
    const brands = recommendations.map(r => r.product.brandId);
    
    // Count unique brands
    const uniqueBrands = new Set(brands);
    
    // With diversity enabled, we should have multiple brands
    expect(uniqueBrands.size).toBeGreaterThan(1);
    
    // Compare with recommendations with no diversity
    const nonDiverseRecommendations = generateFoodRecommendations(adultProfile, { 
      minRecommendations: 5, 
      diversityFactor: 0
    });
    
    // Without diversity factor, recommendations may cluster around fewer brands
    const nonDiverseBrands = new Set(nonDiverseRecommendations.map(r => r.product.brandId));
    
    // The diverse set should have at least as many brands as the non-diverse set
    expect(uniqueBrands.size).toBeGreaterThanOrEqual(nonDiverseBrands.size);
  });
  
  it('should generate detailed explanations for recommendations', () => {
    // Get recommendations with detailed explanations
    const recommendations = generateFoodRecommendations(adultProfile, { 
      includeExplanations: true
    });
    
    // Check structure of explanations
    for (const rec of recommendations) {
      // Should have personalized dog name in first reason
      expect(rec.reasons[0]).toContain(adultProfile.name);
      
      // Should have sections for benefits
      expect(rec.reasons.some(r => r.includes('Top benefits'))).toBeTruthy();
      
      // Should have bullet points
      expect(rec.reasons.some(r => r.startsWith('• '))).toBeTruthy();
      
      // Should have nutritional highlights
      expect(rec.reasons.some(r => r.includes('Nutritional highlights'))).toBeTruthy();
      expect(rec.reasons.some(r => r.includes('protein') && r.includes('fat'))).toBeTruthy();
    }
  });
  
  it('should respect maximum recommendation limit', () => {
    // Set a low max limit
    const maxRecommendations = 3;
    const recommendations = generateFoodRecommendations(adultProfile, { 
      maxRecommendations
    });
    
    // Should not exceed the limit
    expect(recommendations.length).toBeLessThanOrEqual(maxRecommendations);
  });
  
  it('should handle edge cases with multiple health conditions', () => {
    // Profile with multiple health conditions
    const complexHealthProfile: DogProfile = {
      name: 'Complex',
      breed: 'Labrador Retriever',
      age: 8,
      gender: Gender.FEMALE,
      weight: 30,
      weightUnit: 'kg',
      activityLevel: ActivityLevel.LOW,
      healthConditions: ['allergies', 'obesity', 'joint_issues', 'diabetes']
    };
    
    const recommendations = generateFoodRecommendations(complexHealthProfile);
    
    // Should have recommendations despite complex requirements
    expect(recommendations.length).toBeGreaterThan(0);
    
    // Recommendations should address multiple health conditions
    const firstRecommendation = recommendations[0];
    
    // Should mention at least one health condition in reasons
    const hasHealthConditionMentions = firstRecommendation.reasons.some(r => 
      r.toLowerCase().includes('allerg') || 
      r.toLowerCase().includes('weight') ||
      r.toLowerCase().includes('joint') ||
      r.toLowerCase().includes('diabet')
    );
    
    expect(hasHealthConditionMentions).toBeTruthy();
  });
});
