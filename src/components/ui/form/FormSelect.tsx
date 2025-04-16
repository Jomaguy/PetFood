import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  isSearchable?: boolean;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  required,
  error,
  helperText,
  isSearchable = false,
  className = '',
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
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            isSearchable={isSearchable}
            className={`${className}`}
            classNamePrefix="select"
            value={options.find(option => option.value === field.value) || null}
            onChange={(option) => field.onChange(option?.value)}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                '&:hover': {
                  borderColor: error ? '#ef4444' : '#3b82f6'
                }
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
                color: state.isSelected ? 'white' : '#111827',
                '&:active': {
                  backgroundColor: '#3b82f6'
                }
              }),
              singleValue: (base) => ({
                ...base,
                color: '#111827'
              }),
              input: (base) => ({
                ...base,
                color: '#111827'
              })
            }}
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

export default FormSelect; 