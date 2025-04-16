import { z } from 'zod';

// Enums for categorical fields
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ActivityLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

// Health condition type
export type HealthCondition = {
  id: string;
  name: string;
  description?: string;
  severity?: 'mild' | 'moderate' | 'severe';
};

// Common health conditions for dogs
export const COMMON_HEALTH_CONDITIONS: HealthCondition[] = [
  { id: 'allergies', name: 'Allergies', description: 'Food or environmental allergies' },
  { id: 'obesity', name: 'Obesity', description: 'Overweight condition requiring dietary management' },
  { id: 'joint_issues', name: 'Joint Issues', description: 'Arthritis, hip dysplasia, or other joint problems' },
  { id: 'diabetes', name: 'Diabetes', description: 'Diabetes mellitus requiring special dietary needs' },
  { id: 'kidney_disease', name: 'Kidney Disease', description: 'Chronic kidney disease or renal issues' },
  { id: 'heart_disease', name: 'Heart Disease', description: 'Cardiac conditions requiring sodium control' },
  { id: 'pancreatitis', name: 'Pancreatitis', description: 'Inflammation of the pancreas requiring low-fat diet' },
  { id: 'dental_issues', name: 'Dental Issues', description: 'Teeth or gum problems' },
  { id: 'gi_issues', name: 'Gastrointestinal Issues', description: 'Sensitive stomach, IBD, or other digestive problems' },
  { id: 'skin_conditions', name: 'Skin Conditions', description: 'Dermatitis, hot spots, or other skin problems' }
];

// Weight unit type
export type WeightUnit = 'kg' | 'lbs';

// Main dog profile interface
export interface DogProfile {
  id?: string;
  name: string;
  breed: string;
  age: number;
  gender: Gender;
  weight: number;
  weightUnit: WeightUnit;
  activityLevel: ActivityLevel;
  healthConditions: string[]; // Array of health condition IDs
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Zod validation schema for dog profile
export const dogProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Dog's name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Please select a gender" }) }),
  weight: z.number().positive("Weight must be greater than 0"),
  weightUnit: z.enum(['kg', 'lbs'], { errorMap: () => ({ message: "Please select a weight unit" }) }),
  activityLevel: z.nativeEnum(ActivityLevel, { errorMap: () => ({ message: "Please select an activity level" }) }),
  healthConditions: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Type definition from the Zod schema
export type DogProfileSchema = z.infer<typeof dogProfileSchema>;

// Default/initial values for a dog profile
export const DEFAULT_DOG_PROFILE: DogProfile = {
  name: '',
  breed: '',
  age: 0,
  gender: Gender.MALE,
  weight: 0,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.MODERATE,
  healthConditions: [],
  notes: ''
};

// List of common dog breeds for selection
export const COMMON_DOG_BREEDS = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'German Shorthaired Pointer',
  'Dachshund',
  'Pembroke Welsh Corgi',
  'Australian Shepherd',
  'Yorkshire Terrier',
  'Boxer',
  'Siberian Husky',
  'Cavalier King Charles Spaniel',
  'Great Dane',
  'Miniature Schnauzer',
  'Doberman Pinscher',
  'Shih Tzu',
  'Boston Terrier',
  'Bernese Mountain Dog',
  'Pomeranian',
  'Havanese',
  'Shetland Sheepdog',
  'Brittany',
  'English Springer Spaniel',
  'Chihuahua',
  'Cocker Spaniel',
  'Border Collie',
  'Mixed Breed'
];

// Helper function to validate a dog profile
export function validateDogProfile(profile: DogProfile): { success: boolean; errors?: z.ZodError } {
  try {
    dogProfileSchema.parse(profile);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Example usage:
// const sampleProfile: DogProfile = {
//   name: 'Buddy',
//   breed: 'Labrador Retriever',
//   age: 3,
//   gender: Gender.MALE,
//   weight: 30,
//   weightUnit: 'kg',
//   activityLevel: ActivityLevel.HIGH,
//   healthConditions: ['allergies'],
//   notes: 'Loves to play fetch'
// };
// 
// const validation = validateDogProfile(sampleProfile);
// if (validation.success) {
//   console.log('Profile is valid!');
// } else {
//   console.error('Validation errors:', validation.errors?.format());
// } 