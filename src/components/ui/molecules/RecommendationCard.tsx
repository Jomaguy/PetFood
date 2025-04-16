import React from 'react';
import Image from 'next/image';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';

export interface RecommendationCardProps {
  id: string;
  title: string;
  brand: string;
  description: string;
  imageSrc: string;
  price?: string;
  rating?: number;
  match?: number; // Percentage match to pet's needs
  onClick?: (id: string) => void;
  className?: string;
  isLoading?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  title,
  brand,
  description,
  imageSrc,
  price,
  rating,
  match,
  onClick,
  className = '',
  isLoading = false,
}) => {
  const handleClick = () => {
    if (onClick && !isLoading) {
      onClick(id);
    }
  };

  // Loading state skeleton
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300" />
          <div className="p-4">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`overflow-hidden transition-transform hover:shadow-lg ${className}`} 
      onClick={handleClick}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${title} by ${brand}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {match && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-sm font-bold px-2 py-1 rounded-full">
            {match}% Match
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{brand}</p>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400" aria-label={`Rated ${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={i < Math.floor(rating) ? 0 : 1.5} 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-3">{description}</p>
        
        {/* Price and action */}
        <div className="flex items-center justify-between mt-4">
          {price && (
            <p className="font-bold text-gray-900">{price}</p>
          )}
          <Button 
            variant="primary" 
            className="ml-auto"
            onClick={handleClick}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard; 