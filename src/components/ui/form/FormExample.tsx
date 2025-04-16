import React from 'react';
import { z } from 'zod';
import { Form, FormInput, FormSelect, FormCheckbox, FormRadio, SubmitButton } from './';
import { useZodForm } from '../../../utils/validation/form';

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  petType: z.string().min(1, 'Please select a pet type'),
  size: z.string().min(1, 'Please select a size'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  })
});

// Infer TypeScript type from schema
type FormValues = z.infer<typeof formSchema>;

const FormExample: React.FC = () => {
  // Initialize the form with validation schema
  const methods = useZodForm(formSchema, {
    defaultValues: {
      name: '',
      email: '',
      petType: '',
      size: '',
      agreeToTerms: false
    }
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    // This would typically be an API call
    console.log('Form submitted with:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} className="space-y-6">
      <FormInput
        name="name"
        label="Full Name"
        required
        placeholder="Enter your full name"
      />

      <FormInput
        name="email"
        label="Email Address"
        type="email"
        required
        placeholder="Enter your email address"
        helpText="We'll never share your email with anyone else."
      />

      <FormSelect
        name="petType"
        label="Pet Type"
        required
        options={[
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat' },
          { value: 'bird', label: 'Bird' },
          { value: 'other', label: 'Other' }
        ]}
        placeholder="Select your pet type"
      />
      
      <FormRadio
        name="size"
        label="Pet Size"
        required
        options={[
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ]}
        inline
      />

      <FormCheckbox
        name="agreeToTerms"
        label="I agree to the terms and conditions"
        required
      />
      
      <div className="pt-4">
        <SubmitButton>Submit Form</SubmitButton>
      </div>
    </Form>
  );
};

export default FormExample; 