'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  onCreateProfileClick: () => void;
}

/**
 * Empty state component shown when no dog profiles exist
 */
export default function EmptyState({ onCreateProfileClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 my-8">
      <div className="mb-6">
        {/* Placeholder for illustration - replace with actual image if available */}
        <svg
          className="w-24 h-24 text-gray-400 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Dog Profiles Yet</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Create your first dog profile to get personalized food recommendations tailored to your pet's needs.
      </p>
      <button
        onClick={onCreateProfileClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create First Profile
      </button>
    </div>
  );
} 