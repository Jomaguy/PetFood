'use client';

import { useDogProfiles, useFoodDatabase, useUserPreferences } from '@/context';
import { DEFAULT_DOG_PROFILE, Gender, ActivityLevel } from '@/types/dogProfile';
import { Button } from './atoms/Button';
import { resetAppData } from '@/context/StorageInitializer';

/**
 * Debug component to display current context values
 * This is for testing purposes only and should not be used in production
 */
export const ContextDebugger = () => {
  // Get contexts
  const dogProfiles = useDogProfiles();
  const foodDatabase = useFoodDatabase();
  const userPreferences = useUserPreferences();
  
  // Create a sample dog profile
  const createSampleDogProfile = () => {
    const sampleProfile = {
      ...DEFAULT_DOG_PROFILE,
      name: 'Sample Dog ' + Math.floor(Math.random() * 100),
      breed: 'Mixed Breed',
      age: 3,
      gender: Gender.MALE,
      weight: 25,
      weightUnit: 'kg' as const,
      activityLevel: ActivityLevel.MODERATE,
      healthConditions: ['allergies'],
      notes: 'This is a sample dog profile created for testing'
    };
    
    const profileId = dogProfiles.addProfile(sampleProfile);
    console.log('Created profile with ID:', profileId);
  };
  
  return (
    <div className="p-4 mt-8 bg-slate-100 rounded-lg text-slate-800">
      <h2 className="text-lg font-bold mb-4">Context Debug Info</h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={createSampleDogProfile}
        >
          Add Sample Dog
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => userPreferences.toggleTheme()}
        >
          Toggle Theme
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => userPreferences.toggleUnitSystem()}
        >
          Toggle Units
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (dogProfiles.profiles.length > 0) {
              const firstProfileId = dogProfiles.profiles[0].id;
              if (firstProfileId) {
                dogProfiles.deleteProfile(firstProfileId);
              }
            }
          }}
        >
          Delete First Dog
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (confirm('This will reset all app data. Are you sure?')) {
              resetAppData();
            }
          }}
        >
          Reset All Data
        </Button>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">Dog Profiles:</h3>
        <pre className="bg-slate-200 p-2 rounded text-xs mt-1 overflow-auto max-h-40">
          {JSON.stringify({
            profiles: dogProfiles.profiles,
            currentProfile: dogProfiles.currentProfile
          }, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">Food Database:</h3>
        <div className="bg-slate-200 p-2 rounded text-xs mt-1">
          <p>Loading: {foodDatabase.isLoading ? 'true' : 'false'}</p>
          <p>Error: {foodDatabase.error ? foodDatabase.error.message : 'none'}</p>
          <p>Brands: {foodDatabase.database?.brands.length || 0}</p>
          <p>Products: {foodDatabase.database?.products.length || 0}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">User Preferences:</h3>
        <pre className="bg-slate-200 p-2 rounded text-xs mt-1 overflow-auto max-h-40">
          {JSON.stringify(userPreferences.preferences, null, 2)}
        </pre>
      </div>
    </div>
  );
}; 