import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  error?: string;
  helpText?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
  id,
  error,
  helpText,
}) => {
  return (
    <div className={`mb-4 ${className}`} id={id}>
      {children}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormGroup; 