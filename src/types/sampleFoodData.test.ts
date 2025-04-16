import { FoodDatabase } from './foodTypes';
import sampleData from '../data/sampleFoodData.json';

/**
 * This file serves as a validation test for the sample data
 * It verifies that our data structure conforms to the TypeScript interfaces
 */

// Type assertion to validate the imported JSON against our FoodDatabase interface
const validatedData: FoodDatabase = sampleData as FoodDatabase;

// Check that we have the required minimum number of items
const verifyDataRequirements = () => {
  // Check that we have at least 5 brands
  if (validatedData.brands.length < 5) {
    throw new Error(`Insufficient brands: ${validatedData.brands.length} (minimum: 5)`);
  }

  // Check that we have at least 20 products
  if (validatedData.products.length < 20) {
    throw new Error(`Insufficient products: ${validatedData.products.length} (minimum: 20)`);
  }

  // Check for diverse product types
  const productTypes = new Set(validatedData.products.map(p => p.type));
  if (productTypes.size < 3) {
    throw new Error(`Insufficient product types: ${Array.from(productTypes).join(', ')} (minimum: 3 types)`);
  }

  // Check for diverse age ranges
  const ageRanges = new Set(validatedData.products.flatMap(p => p.suitableAges));
  if (ageRanges.size < 3) {
    throw new Error(`Insufficient age ranges: ${Array.from(ageRanges).join(', ')} (should have puppy, adult, senior)`);
  }

  // Check for diverse breed sizes
  const breedSizes = new Set(validatedData.products.flatMap(p => p.suitableBreedSizes));
  if (breedSizes.size < 3) {
    throw new Error(`Insufficient breed sizes: ${Array.from(breedSizes).join(', ')} (should have small, medium, large)`);
  }

  // Check for diverse dietary indicators
  const dietaryIndicators = new Set(validatedData.products.flatMap(p => p.dietaryIndicators));
  if (dietaryIndicators.size < 4) {
    throw new Error(`Insufficient dietary indicators: ${Array.from(dietaryIndicators).join(', ')} (minimum: 4 types)`);
  }

  return {
    brandCount: validatedData.brands.length,
    productCount: validatedData.products.length,
    productTypes: Array.from(productTypes),
    ageRanges: Array.from(ageRanges),
    breedSizes: Array.from(breedSizes),
    dietaryIndicators: Array.from(dietaryIndicators)
  };
};

// Export for potential use in other files
export const dataValidation = {
  data: validatedData,
  validate: verifyDataRequirements
};

// Self-executing validation when imported
try {
  const results = verifyDataRequirements();
  console.log('✅ Sample data validation passed:', results);
} catch (error) {
  console.error('❌ Sample data validation failed:', error.message);
} 