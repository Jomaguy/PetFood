import {
  AgeRange,
  BreedSize,
  DietaryIndicator,
  Brand,
  Ingredient,
  NutritionalValue,
  Product,
  FoodDatabase
} from './foodTypes';

// Sample test data that conforms to our interfaces
const sampleBrand: Brand = {
  id: 'b1',
  name: 'Premium Paws',
  description: 'High-quality pet nutrition since 1990',
  website: 'https://premiumpaws.example.com',
  foundedYear: 1990,
  headquarters: 'Portland, OR'
};

const sampleIngredients: Ingredient[] = [
  {
    name: 'Chicken',
    description: 'Fresh deboned chicken',
    potentialAllergen: true,
    source: 'animal'
  },
  {
    name: 'Brown Rice',
    description: 'Whole grain brown rice',
    potentialAllergen: false,
    source: 'plant'
  }
];

const sampleNutrition: NutritionalValue = {
  caloriesPerCup: 364,
  protein: 26,
  fat: 16,
  fiber: 4,
  moisture: 10,
  carbohydrates: 44,
  omega3: 0.5,
  omega6: 2.5,
  vitamins: {
    'Vitamin A': 15000,
    'Vitamin D': 1000,
    'Vitamin E': 150
  },
  minerals: {
    'Calcium': 1.2,
    'Phosphorus': 0.9,
    'Iron': 180
  }
};

const sampleProduct: Product = {
  id: 'p1',
  name: 'Adult Chicken & Rice Formula',
  brandId: 'b1',
  productLine: 'Classic Nutrition',
  type: 'dry',
  priceRange: {
    min: 45.99,
    max: 89.99,
    currency: 'USD'
  },
  description: 'Complete and balanced nutrition for adult dogs',
  ingredients: sampleIngredients,
  nutritionalValue: sampleNutrition,
  suitableAges: [AgeRange.ADULT],
  suitableBreedSizes: [BreedSize.MEDIUM, BreedSize.LARGE],
  dietaryIndicators: [DietaryIndicator.NATURAL],
  specialFeatures: ['Joint Health Support', 'Immune System Support'],
  imageUrl: 'https://example.com/images/adult-chicken-rice.jpg',
  packageSizes: ['5lb', '15lb', '30lb']
};

// Sample complete database
const sampleDatabase: FoodDatabase = {
  brands: [sampleBrand],
  products: [sampleProduct]
};

// This file serves as a type verification test
// If the TypeScript compiler accepts these objects,
// it confirms that our interfaces are working as expected
export const testData = {
  brand: sampleBrand,
  ingredients: sampleIngredients,
  nutrition: sampleNutrition,
  product: sampleProduct,
  database: sampleDatabase
}; 