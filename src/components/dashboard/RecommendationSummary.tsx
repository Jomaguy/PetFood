'use client';

import React from 'react';
import { DogProfile } from '@/types/dogProfile';

interface RecommendationSummaryProps {
  profile: DogProfile;
  minimal?: boolean;
}

/**
 * Component to display a summary of food recommendations for a dog profile
 * This is a placeholder until task 8 fully implements recommendations
 */
export default function RecommendationSummary({ profile, minimal = false }: RecommendationSummaryProps) {
  return (
    <div className={`${minimal ? 'p-2' : 'p-4'} bg-blue-50 rounded-lg`}>
      <h4 className={`${minimal ? 'text-sm' : 'text-base'} font-medium text-blue-800 mb-1`}>
        Food Recommendations
      </h4>
      
      {minimal ? (
        <p className="text-xs text-blue-700">
          View personalized food recommendations for {profile.name}
        </p>
      ) : (
        <div className="text-sm text-blue-700">
          <p className="mb-2">
            Based on {profile.name}'s profile, we recommend:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              {profile.age < 1 ? 'Puppy' : profile.age > 7 ? 'Senior' : 'Adult'} formulas appropriate for {profile.breed} dogs
            </li>
            <li>
              Food suitable for {profile.activityLevel.toLowerCase()} activity levels
            </li>
            {profile.healthConditions.length > 0 && (
              <li>
                Specialized nutrition for health management
              </li>
            )}
          </ul>
          <p className="mt-2 text-blue-600 italic text-xs">
            Full recommendations will be implemented in the next task.
          </p>
        </div>
      )}
    </div>
  );
} 