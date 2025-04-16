import React from 'react';
import { RecommendationsList } from '@/components/ui/molecules/RecommendationsList';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Food Recommendations</h1>
        <p className="text-gray-700">
          Based on your dog's profile, we recommend the following foods. 
          You can filter, sort, and compare options to find the best match for your pet's needs.
        </p>
      </div>
      
      <RecommendationsList />
    </div>
  );
} 