import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  error,
  helperText,
  type = 'text',
  required,
  className = '',
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <div className="form-control w-full">
      <label className="block mb-2" htmlFor={name}>
        <span className="text-gray-700 font-medium text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            className={`input input-bordered w-full text-gray-900 ${error ? 'input-error' : ''} ${className}`}
            {...field}
            onChange={(e) => {
              const value = e.target.value;
              if (type === 'number' && value !== '') {
                field.onChange(parseFloat(value));
              } else {
                field.onChange(value);
              }
            }}
            value={field.value ?? ''}
            {...props}
          />
        )}
      />
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput; 