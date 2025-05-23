import React from 'react';

interface CheckboxProps {
  id: string;
  name: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  className = '',
  error,
  ariaLabel,
  ariaDescribedBy,
}) => {
  const baseClasses = 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const errorClasses = error ? 'border-red-500' : '';

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel || label}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
          className={`${baseClasses} ${disabledClasses} ${errorClasses} ${className}`}
        />
      </div>
      {label && (
        <div className="ml-2 text-sm">
          <label htmlFor={id} className={`font-medium text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox; 