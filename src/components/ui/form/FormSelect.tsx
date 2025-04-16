import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from '../atoms/Select';
import FormGroup from './FormGroup';
import Label from './Label';

type OptionType = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface FormSelectProps {
  name: string;
  label?: string;
  options: OptionType[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  required = false,
  helpText,
  className = '',
  selectClassName = '',
  disabled = false,
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
          <Select
            id={name}
            options={options}
            placeholder={placeholder}
            className={selectClassName}
            disabled={disabled}
            required={required}
            error={error}
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

export default FormSelect; 