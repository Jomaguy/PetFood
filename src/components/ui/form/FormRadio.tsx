import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Radio from '../atoms/Radio';
import FormGroup from './FormGroup';
import Label from './Label';

type RadioOptionType = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface FormRadioProps {
  name: string;
  label?: string;
  options: RadioOptionType[];
  required?: boolean;
  helpText?: string;
  className?: string;
  radioClassName?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  inline?: boolean;
  onChange?: (value: string) => void;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  name,
  label,
  options,
  required = false,
  helpText,
  className = '',
  radioClassName = '',
  disabled = false,
  hideLabel = false,
  inline = false,
  onChange,
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormGroup className={className} error={error} helpText={helpText}>
      {label && !hideLabel && (
        <Label htmlFor={`${name}-group`} required={required}>
          {label}
        </Label>
      )}
      
      <div 
        className={`${inline ? 'flex flex-wrap gap-4' : 'space-y-2'}`}
        id={`${name}-group`}
        role="radiogroup"
        aria-labelledby={label && !hideLabel ? `${name}-group-label` : undefined}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              {options.map((option) => (
                <Radio
                  key={option.value}
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  label={option.label}
                  checked={field.value === option.value}
                  className={radioClassName}
                  disabled={disabled || option.disabled}
                  required={required}
                  error={error}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.checked) {
                      onChange?.(e.target.value);
                    }
                  }}
                />
              ))}
            </>
          )}
        />
      </div>
    </FormGroup>
  );
};

export default FormRadio; 