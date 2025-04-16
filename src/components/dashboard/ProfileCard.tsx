'use client';

import React from 'react';
import Image from 'next/image';
import { DogProfile } from '@/types/dogProfile';
import RecommendationSummary from './RecommendationSummary';

interface ProfileCardProps {
  profile: DogProfile;
  isActive?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

/**
 * Profile card component for displaying a dog profile in the dashboard
 */
export default function ProfileCard({
  profile,
  isActive = false,
  onView,
  onEdit,
  onDelete,
  onSetActive
}: ProfileCardProps) {
  const { id, name, breed, age, gender, weight, weightUnit } = profile;
  
  // Fallback ID for safety
  const profileId = id || '';

  // Placeholder image URL - replace with actual dog breed images or profile photos
  const imagePlaceholder = `/images/dog-placeholder.jpg`;

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white 
      ${isActive ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="relative h-48 w-full bg-gray-200">
        {/* Placeholder image - replace with actual dog images */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Active
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{breed}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          <div>
            <span className="font-medium">Age:</span> {age} {age === 1 ? 'year' : 'years'}
          </div>
          <div>
            <span className="font-medium">Gender:</span> {gender}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Weight:</span> {weight} {weightUnit}
          </div>
        </div>
        
        {/* Recommendation summary */}
        <div className="mb-4">
          <RecommendationSummary profile={profile} minimal={true} />
        </div>
        
        <div className="flex space-x-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => onView(profileId)}
            className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit(profileId)}
            className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(profileId)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 text-xs font-medium rounded transition-colors"
          >
            Delete
          </button>
        </div>
        
        {!isActive && (
          <button
            onClick={() => onSetActive(profileId)}
            className="mt-2 w-full px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition-colors"
          >
            Set as Active
          </button>
        )}
      </div>
    </div>
  );
} 