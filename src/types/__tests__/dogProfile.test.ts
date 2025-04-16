import { 
  DogProfile, 
  Gender, 
  ActivityLevel, 
  validateDogProfile, 
  COMMON_DOG_BREEDS,
  COMMON_HEALTH_CONDITIONS
} from '../dogProfile';

// Test valid dog profile
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

// Test invalid dog profile (missing required fields)
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

describe('Dog Profile Model', () => {
  test('Valid profile passes validation', () => {
    const result = validateDogProfile(validProfile);
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test('Invalid profile fails validation', () => {
    const result = validateDogProfile(invalidProfile as any);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  test('Common dog breeds are available', () => {
    expect(COMMON_DOG_BREEDS.length).toBeGreaterThan(0);
    expect(COMMON_DOG_BREEDS).toContain('Labrador Retriever');
    expect(COMMON_DOG_BREEDS).toContain('Mixed Breed');
  });

  test('Common health conditions are available', () => {
    expect(COMMON_HEALTH_CONDITIONS.length).toBeGreaterThan(0);
    expect(COMMON_HEALTH_CONDITIONS.find(c => c.id === 'allergies')).toBeDefined();
    expect(COMMON_HEALTH_CONDITIONS.find(c => c.id === 'obesity')).toBeDefined();
  });
}); 