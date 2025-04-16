/**
 * This is a utility file to manually test the dog profile model.
 * This file is not part of the application, it's just for testing purposes.
 */

import { DogProfile, Gender, ActivityLevel, validateDogProfile } from './dogProfile';

// Create a sample valid dog profile
const validProfile: DogProfile = {
  name: 'Buddy',
  breed: 'Labrador Retriever',
  age: 3,
  gender: Gender.MALE,
  weight: 30,
  weightUnit: 'kg',
  activityLevel: ActivityLevel.HIGH,
  healthConditions: ['allergies', 'joint_issues'],
  notes: 'Loves to play fetch'
};

// Create an invalid dog profile (missing required fields)
const invalidProfile = {
  name: '',
  breed: '',
  age: -1,
  gender: 'unknown' as any,
  weight: 0,
  weightUnit: 'stone' as any,
  activityLevel: 'super_high' as any,
  healthConditions: []
};

// Test validation
console.log('Valid profile validation:');
const validResult = validateDogProfile(validProfile);
console.log(validResult);

console.log('\nInvalid profile validation:');
const invalidResult = validateDogProfile(invalidProfile as any);
console.log(invalidResult);

if (invalidResult.errors) {
  console.log('\nDetailed validation errors:');
  console.log(JSON.stringify(invalidResult.errors.format(), null, 2));
} 