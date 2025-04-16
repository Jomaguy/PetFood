import { z } from 'zod';

// Basic field validations
export const stringSchema = z.string();
export const numberSchema = z.number();
export const booleanSchema = z.boolean();
export const dateSchema = z.date();

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL');

// Field creation helpers with common validation options
export const createRequiredString = (message = 'This field is required') =>
  z.string().min(1, { message });

export const createMaxLengthString = (max: number, message?: string) =>
  z.string().max(max, { message: message || `Must be at most ${max} characters` });

export const createMinMaxLengthString = (min: number, max: number, message?: string) =>
  z.string().min(min, { message: message || `Must be at least ${min} characters` })
    .max(max, { message: message || `Must be at most ${max} characters` });

export const createNumberRange = (min: number, max: number, message?: string) =>
  z.number().min(min, { message: message || `Must be at least ${min}` })
    .max(max, { message: message || `Must be at most ${max}` });

export const createNumericString = (message = 'Must contain only numbers') =>
  z.string().regex(/^[0-9]+$/, { message });

// Type helpers
export type FormSchema<T extends z.ZodType<any, any>> = z.infer<T>; 