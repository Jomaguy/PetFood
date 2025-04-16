import React from 'react';
import { useFormContext } from 'react-hook-form';
import Button from '../atoms/Button';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Submitting...',
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
}) => {
  const { formState } = useFormContext();
  const isSubmitting = formState.isSubmitting || isLoading;
  
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={`relative ${className}`}
      disabled={disabled || isSubmitting}
      fullWidth={fullWidth}
    >
      {isSubmitting ? (
        <>
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingText}
          </span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton; 