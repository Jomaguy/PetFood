import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '../atoms/Checkbox';
import FormGroup from './FormGroup';

interface FormCheckboxProps {
  name: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  checkboxClassName?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onChange?: (checked: boolean) => void;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  required = false,
  helpText,
  className = '',
  checkboxClassName = '',
  disabled = false,
  onBlur,
  onChange,
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormGroup className={className} error={error} helpText={helpText}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            id={name}
            name={name}
            label={label}
            checked={field.value || false}
            className={checkboxClassName}
            disabled={disabled}
            required={required}
            error={error}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.checked);
              field.onBlur();
              onBlur?.();
            }}
          />
        )}
      />
    </FormGroup>
  );
};

export default FormCheckbox;
