import React from 'react';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  optionalText?: string;
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = '',
  optionalText = '(optional)',
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
      {required ? (
        <span className="text-red-500 ml-1">*</span>
      ) : (
        <span className="text-gray-400 text-xs ml-1">{optionalText}</span>
      )}
    </label>
  );
};

export default Label; 