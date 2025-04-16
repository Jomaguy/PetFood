/**
 * TypeScript interfaces for the Dog Food Database
 */

/**
 * Enum for age ranges suitable for dog food
 */
export enum AgeRange {
  PUPPY = 'puppy',
  ADULT = 'adult',
  SENIOR = 'senior'
}

/**
 * Enum for breed sizes suitable for dog food
 */
export enum BreedSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * Enum for dietary indicators
 */
export enum DietaryIndicator {
  GRAIN_FREE = 'grain-free',
  LIMITED_INGREDIENT = 'limited-ingredient',
  WEIGHT_MANAGEMENT = 'weight-management',
  SENSITIVE_STOMACH = 'sensitive-stomach',
  ORGANIC = 'organic',
  RAW = 'raw',
  NATURAL = 'natural',
  HIGH_PROTEIN = 'high-protein'
}

/**
 * Interface for brand information
 */
export interface Brand {
  id: string;
  name: string;
  description: string;
  website: string;
  foundedYear?: number;
  headquarters?: string;
}

/**
 * Interface for food ingredient
 */
export interface Ingredient {
  name: string;
  description?: string;
  potentialAllergen: boolean;
  source?: 'plant' | 'animal' | 'synthetic';
}

/**
 * Interface for nutritional values
 */
export interface NutritionalValue {
  caloriesPerCup: number;
  protein: number; // percentage
  fat: number; // percentage
  fiber: number; // percentage
  moisture: number; // percentage
  carbohydrates: number; // percentage
  omega3?: number; // percentage
  omega6?: number; // percentage
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  glucosamine?: number; // mg per kg
  omega3FattyAcids?: number; // percentage
  phosphorus?: number; // percentage
}

/**
 * Interface for dog food product
 */
export interface Product {
  id: string;
  name: string;
  brandId: string;
  productLine?: string;
  type: 'dry' | 'wet' | 'freeze-dried' | 'raw' | 'treats';
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  ingredients: Ingredient[];
  nutritionalValue: NutritionalValue;
  suitableAges: AgeRange[];
  suitableBreedSizes: BreedSize[];
  dietaryIndicators: DietaryIndicator[];
  specialFeatures?: string[];
  specialFormulations?: string[];
  imageUrl?: string;
  packageSizes: string[];
}

/**
 * Interface for the complete food database
 */
export interface FoodDatabase {
  brands: Brand[];
  products: Product[];
} 