import { 
  AgeRange, 
  BreedSize, 
  DietaryIndicator, 
  FoodDatabase, 
  Product 
} from "../types/foodTypes";
import foodData from "../data/sampleFoodData.json";

/**
 * The imported food database from JSON file
 */
const foodDatabase: FoodDatabase = foodData as FoodDatabase;

/**
 * Returns all products from a specific brand
 * @param brandName - The name of the brand to filter by
 * @returns Array of products from the specified brand
 * @throws Error if brand name is empty or not found
 */
export function getFoodsByBrand(brandName: string): Product[] {
  if (!brandName || brandName.trim() === "") {
    throw new Error("Brand name cannot be empty");
  }

  // Find the brand ID first
  const brand = foodDatabase.brands.find(
    (b) => b.name.toLowerCase() === brandName.toLowerCase()
  );
  
  if (!brand) {
    throw new Error(`Brand "${brandName}" not found`);
  }

  // Return products that match the brand ID
  return foodDatabase.products.filter((product) => product.brandId === brand.id);
}

/**
 * Returns foods suitable for a specific age range
 * @param ageRange - The age range to filter by
 * @returns Array of products suitable for the specified age range
 * @throws Error if ageRange is invalid
 */
export function getFoodsByAgeRange(ageRange: AgeRange): Product[] {
  // Validate that ageRange is a valid enum value
  if (!Object.values(AgeRange).includes(ageRange)) {
    throw new Error(`Invalid age range: ${ageRange}`);
  }

  return foodDatabase.products.filter((product) => 
    product.suitableAges.includes(ageRange)
  );
}

/**
 * Returns foods suitable for a specific breed size
 * @param breedSize - The breed size to filter by
 * @returns Array of products suitable for the specified breed size
 * @throws Error if breedSize is invalid
 */
export function getFoodsByBreedSize(breedSize: BreedSize): Product[] {
  // Validate that breedSize is a valid enum value
  if (!Object.values(BreedSize).includes(breedSize)) {
    throw new Error(`Invalid breed size: ${breedSize}`);
  }

  return foodDatabase.products.filter((product) => 
    product.suitableBreedSizes.includes(breedSize)
  );
}

/**
 * Returns foods with a specific dietary indicator
 * @param indicator - The dietary indicator to filter by
 * @returns Array of products with the specified dietary indicator
 * @throws Error if indicator is invalid
 */
export function getFoodsByDietaryIndicator(indicator: DietaryIndicator): Product[] {
  // Validate that indicator is a valid enum value
  if (!Object.values(DietaryIndicator).includes(indicator)) {
    throw new Error(`Invalid dietary indicator: ${indicator}`);
  }

  return foodDatabase.products.filter((product) => 
    product.dietaryIndicators.includes(indicator)
  );
}

/**
 * Returns foods that include or exclude a specific ingredient
 * @param ingredient - The ingredient name to search for
 * @param includeExclude - Whether to include or exclude foods with the ingredient
 * @returns Array of products that include or exclude the specified ingredient
 * @throws Error if ingredient is empty
 */
export function getFoodsByIngredient(
  ingredient: string, 
  includeExclude: 'include' | 'exclude'
): Product[] {
  if (!ingredient || ingredient.trim() === "") {
    throw new Error("Ingredient name cannot be empty");
  }

  const normalizedIngredient = ingredient.toLowerCase().trim();

  return foodDatabase.products.filter((product) => {
    const hasIngredient = product.ingredients.some(
      (ing) => ing.name.toLowerCase().includes(normalizedIngredient)
    );

    return includeExclude === 'include' ? hasIngredient : !hasIngredient;
  });
}

/**
 * Returns foods within a specific nutritional range
 * @param nutrient - The nutrient name to filter by (protein, fat, fiber, etc.)
 * @param min - The minimum percentage value
 * @param max - The maximum percentage value
 * @returns Array of products within the specified nutritional range
 * @throws Error if nutrient is invalid or min/max values are invalid
 */
export function getFoodsByNutritionalRange(
  nutrient: string, 
  min: number, 
  max: number
): Product[] {
  if (!nutrient || nutrient.trim() === "") {
    throw new Error("Nutrient name cannot be empty");
  }

  if (min < 0 || max < 0) {
    throw new Error("Nutritional values cannot be negative");
  }

  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value");
  }

  const validNutrients = [
    "protein", 
    "fat", 
    "fiber", 
    "moisture", 
    "carbohydrates", 
    "omega3", 
    "omega6",
    "caloriesPerCup"
  ];

  const normalizedNutrient = nutrient.toLowerCase().trim();
  
  if (!validNutrients.includes(normalizedNutrient)) {
    throw new Error(
      `Invalid nutrient '${nutrient}'. Valid options are: ${validNutrients.join(", ")}`
    );
  }

  return foodDatabase.products.filter((product) => {
    const value = product.nutritionalValue[normalizedNutrient as keyof typeof product.nutritionalValue];
    
    if (typeof value !== 'number') {
      return false;
    }
    
    return value >= min && value <= max;
  });
}

/**
 * Maps a numerical dog age to an AgeRange enum value
 * @param dogAge - The age of the dog in years
 * @returns The corresponding AgeRange enum value
 */
function mapDogAgeToAgeRange(dogAge: number): AgeRange {
  if (dogAge < 0) {
    throw new Error("Dog age cannot be negative");
  }
  
  if (dogAge < 1) {
    return AgeRange.PUPPY;
  } else if (dogAge < 7) {
    return AgeRange.ADULT;
  } else {
    return AgeRange.SENIOR;
  }
}

/**
 * Returns recommended foods based on dog profile
 * @param dogAge - The age of the dog in years
 * @param breedSize - The size of the dog's breed
 * @param dietaryRestrictions - Optional array of dietary restrictions
 * @returns Array of recommended products sorted by relevance
 * @throws Error if parameters are invalid
 */
export function getRecommendedFoods(
  dogAge: number, 
  breedSize: BreedSize, 
  dietaryRestrictions?: DietaryIndicator[]
): Product[] {
  if (dogAge < 0) {
    throw new Error("Dog age cannot be negative");
  }

  if (!Object.values(BreedSize).includes(breedSize)) {
    throw new Error(`Invalid breed size: ${breedSize}`);
  }

  if (dietaryRestrictions) {
    for (const restriction of dietaryRestrictions) {
      if (!Object.values(DietaryIndicator).includes(restriction)) {
        throw new Error(`Invalid dietary indicator: ${restriction}`);
      }
    }
  }

  const ageRange = mapDogAgeToAgeRange(dogAge);
  
  // Start with foods that match the age range and breed size
  let recommendedFoods = foodDatabase.products.filter((product) => 
    product.suitableAges.includes(ageRange) &&
    product.suitableBreedSizes.includes(breedSize)
  );

  // Filter by dietary restrictions if provided
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    recommendedFoods = recommendedFoods.filter((product) => 
      dietaryRestrictions.every((restriction) => 
        product.dietaryIndicators.includes(restriction)
      )
    );
  }

  // Calculate relevance score for sorting
  const scoredFoods = recommendedFoods.map((product) => {
    let score = 0;
    
    // Exact age match is highly relevant
    if (product.suitableAges.length === 1 && product.suitableAges[0] === ageRange) {
      score += 3;
    }
    
    // Exact breed size match is highly relevant
    if (product.suitableBreedSizes.length === 1 && product.suitableBreedSizes[0] === breedSize) {
      score += 3;
    }
    
    // Dietary indicators matching gives extra points
    if (dietaryRestrictions) {
      score += dietaryRestrictions.filter(r => 
        product.dietaryIndicators.includes(r)
      ).length * 2;
    }
    
    // Special features add relevance
    if (product.specialFeatures && product.specialFeatures.length > 0) {
      score += 1;
    }
    
    // Higher protein is often better (simplified logic for demonstration)
    if (product.nutritionalValue.protein > 25) {
      score += 1;
    }
    
    return { product, score };
  });

  // Sort by relevance score (highest first)
  scoredFoods.sort((a, b) => b.score - a.score);
  
  // If no foods match all criteria, return foods that match just age and breed size
  if (scoredFoods.length === 0) {
    return getFoodsByAgeRange(ageRange)
      .filter(product => product.suitableBreedSizes.includes(breedSize));
  }
  
  // Return just the products, sorted by relevance
  return scoredFoods.map(item => item.product);
}

/**
 * Simple demo function that shows how to use the utility functions
 * @returns Demo results as a string
 */
export function runFoodDatabaseDemo(): string {
  let demoResults = "Food Database Demo Results:\n\n";
  
  try {
    // Demo of getFoodsByBrand
    const premiumPawsFoods = getFoodsByBrand("Premium Paws");
    demoResults += `1. Premium Paws foods found: ${premiumPawsFoods.length}\n`;
    demoResults += `   First product: ${premiumPawsFoods[0]?.name}\n\n`;
    
    // Demo of getFoodsByAgeRange
    const puppyFoods = getFoodsByAgeRange(AgeRange.PUPPY);
    demoResults += `2. Puppy foods found: ${puppyFoods.length}\n`;
    demoResults += `   Example: ${puppyFoods[0]?.name}\n\n`;
    
    // Demo of getFoodsByBreedSize
    const smallBreedFoods = getFoodsByBreedSize(BreedSize.SMALL);
    demoResults += `3. Small breed foods found: ${smallBreedFoods.length}\n`;
    demoResults += `   Example: ${smallBreedFoods[0]?.name}\n\n`;
    
    // Demo of getFoodsByDietaryIndicator
    const grainFreeFoods = getFoodsByDietaryIndicator(DietaryIndicator.GRAIN_FREE);
    demoResults += `4. Grain-free foods found: ${grainFreeFoods.length}\n`;
    demoResults += `   Example: ${grainFreeFoods[0]?.name}\n\n`;
    
    // Demo of getFoodsByIngredient
    const chickenFoods = getFoodsByIngredient("Chicken", "include");
    demoResults += `5. Foods with chicken: ${chickenFoods.length}\n`;
    demoResults += `   Example: ${chickenFoods[0]?.name}\n\n`;
    
    // Demo of getFoodsByNutritionalRange
    const highProteinFoods = getFoodsByNutritionalRange("protein", 25, 40);
    demoResults += `6. High protein foods (25-40%): ${highProteinFoods.length}\n`;
    demoResults += `   Example: ${highProteinFoods[0]?.name}\n\n`;
    
    // Demo of getRecommendedFoods
    const recommendedFoods = getRecommendedFoods(
      0.5, // 6 month old puppy
      BreedSize.MEDIUM,
      [DietaryIndicator.GRAIN_FREE]
    );
    demoResults += `7. Recommended foods for 6-month medium breed, grain-free puppy: ${recommendedFoods.length}\n`;
    demoResults += `   Top recommendation: ${recommendedFoods[0]?.name}\n`;
    
  } catch (error) {
    demoResults += `Error running demo: ${error instanceof Error ? error.message : String(error)}`;
  }
  
  return demoResults;
} 