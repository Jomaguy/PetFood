import React from 'react';
import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  className?: string;
  id?: string;
}

export const Form = <T extends FieldValues>({
  children,
  methods,
  onSubmit,
  className = '',
  id,
}: FormProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form; 