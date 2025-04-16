'use client';

import React from 'react';
import { DogProfile, COMMON_HEALTH_CONDITIONS } from '@/types/dogProfile';
import { useDogProfiles } from '@/context/DogProfileContext';
import RecommendationSummary from './RecommendationSummary';

interface ProfileDetailProps {
  profileId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export default function ProfileDetail({ profileId, onBack, onEdit }: ProfileDetailProps) {
  const { profiles, currentProfile, setCurrentProfile } = useDogProfiles();
  
  // Find the profile by ID
  const profile = profiles.find(p => p.id === profileId);
  
  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Check if this is the active profile
  const isActive = currentProfile?.id === profile.id;
  
  // Set profile as active
  const handleSetActive = () => {
    setCurrentProfile(profile.id || '');
  };
  
  // Get health condition names from IDs
  const healthConditionNames = profile.healthConditions.map(id => {
    const condition = COMMON_HEALTH_CONDITIONS.find(c => c.id === id);
    return condition ? condition.name : id;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header with back button */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(profileId)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded transition-colors"
          >
            Edit Profile
          </button>
          {!isActive && (
            <button
              onClick={handleSetActive}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded transition-colors"
            >
              Set as Active
            </button>
          )}
        </div>
      </div>
      
      {/* Profile image and name */}
      <div className="px-6 py-6 flex flex-col items-center sm:flex-row sm:items-start">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 flex items-center justify-center">
          {/* Placeholder for profile image */}
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-600 text-lg">{profile.breed}</p>
          
          {isActive && (
            <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              Active Profile
            </span>
          )}
        </div>
      </div>
      
      {/* Profile details */}
      <div className="px-6 pb-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Basic Information</h4>
            <ul className="mt-2 space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{profile.age} {profile.age === 1 ? 'year' : 'years'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{profile.gender}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{profile.weight} {profile.weightUnit}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Activity Level:</span>
                <span className="font-medium">{profile.activityLevel}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Health Conditions</h4>
            {healthConditionNames.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {healthConditionNames.map((condition, index) => (
                  <li key={index} className="text-gray-800">
                    • {condition}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-600 italic">No health conditions specified</p>
            )}
          </div>
        </div>
        
        {profile.notes && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-700">Notes</h4>
            <p className="mt-2 text-gray-800 whitespace-pre-line">{profile.notes}</p>
          </div>
        )}
      </div>
      
      {/* Recommendations section */}
      <div className="px-6 pb-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">
          Recommendations
        </h3>
        <RecommendationSummary profile={profile} />
      </div>
    </div>
  );
} 