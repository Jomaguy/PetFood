import { ZodType, ZodTypeDef } from 'zod';
import { UseFormProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Creates a typed form with Zod validation using React Hook Form
 */
export function useZodForm<TFormValues extends Record<string, any>, Schema extends ZodType<TFormValues, ZodTypeDef, TFormValues>>(
  schema: Schema,
  options?: Omit<UseFormProps<TFormValues>, 'resolver'>
) {
  return useForm<TFormValues>({
    ...options,
    resolver: zodResolver(schema),
  });
}

/**
 * Generic form submission handler
 */
export const handleFormSubmit = async <T>(
  data: T,
  submitFn: (data: T) => Promise<any>,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void
) => {
  try {
    const result = await submitFn(data);
    
    if (onSuccess) {
      onSuccess(result);
    }
    
    return { success: true, data: result };
  } catch (error) {
    if (onError) {
      onError(error);
    }
    
    return { success: false, error };
  }
};

/**
 * Type for form submission states
 */
export type FormSubmissionState = {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
  error?: Error | null;
};

/**
 * Form error handler to transform validation errors into a format usable by UI components
 */
export const getFormErrors = (error: any, fallbackMessage = 'An unexpected error occurred'): string => {
  if (!error) {
    return '';
  }

  // Handle API or service errors
  if (error.message) {
    return error.message;
  }

  // Handle validation errors
  if (error.errors) {
    return error.errors.map((err: any) => err.message).join('. ');
  }

  return fallbackMessage;
}; 