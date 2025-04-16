import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '../atoms/Input';
import FormGroup from './FormGroup';
import Label from './Label';

interface FormInputProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
  hideLabel?: boolean;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  helpText,
  className = '',
  inputClassName = '',
  disabled = false,
  readOnly = false,
  autoComplete,
  min,
  max,
  hideLabel = false,
  onBlur,
  onChange,
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormGroup className={className} error={error} helpText={helpText}>
      {label && !hideLabel && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            className={inputClassName}
            disabled={disabled}
            required={required}
            error={error}
            autoComplete={autoComplete}
            min={min}
            max={max}
            ariaLabel={hideLabel ? label : undefined}
            {...field}
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value);
            }}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.();
            }}
          />
        )}
      />
    </FormGroup>
  );
};

export default FormInput; 