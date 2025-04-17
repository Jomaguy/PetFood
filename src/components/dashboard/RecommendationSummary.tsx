'use client';

import React, { useMemo } from 'react';
import { DogProfile } from '@/types/dogProfile';
import { generateFoodRecommendations } from '@/utils/recommendationAlgorithm';
import Link from 'next/link';

interface RecommendationSummaryProps {
  profile: DogProfile;
  minimal?: boolean;
}

/**
 * Component to display a summary of food recommendations for a dog profile
 */
export default function RecommendationSummary({ profile, minimal = false }: RecommendationSummaryProps) {
  // Generate recommendations for the profile
  const recommendations = useMemo(() => {
    return generateFoodRecommendations(profile, {
      maxRecommendations: 3,
      includeExplanations: true
    });
  }, [profile]);

  // Check if we have recommendations
  const hasRecommendations = recommendations.length > 0;
  
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
          
          {hasRecommendations ? (
            <>
              <ul className="list-disc list-inside space-y-1">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="mb-3">
                    <span className="font-semibold">{rec.product.name}</span> - {rec.matchQuality} match
                    <div className="ml-5 text-xs mt-1">
                      {rec.reasons.slice(0, 2).map((reason, ridx) => (
                        <div key={ridx}>{reason}</div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <Link href="/recommendations" className="text-blue-600 hover:text-blue-800 font-medium">
                  View all recommendations →
                </Link>
              </div>
            </>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
} 