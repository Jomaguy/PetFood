import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect, FormGroup, Label } from '../../ui/form';
import { DogProfile, Gender, WeightUnit } from '../../../types/dogProfile';

export const BasicInfoStep = () => {
  // Use form context from the parent form
  const { control, formState: { errors } } = useFormContext<DogProfile>();

  // Options for gender select
  const genderOptions = [
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' }
  ];

  // Options for weight unit
  const weightUnitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      
      {/* Dog's Name */}
      <FormInput 
        name="name"
        label="Dog's Name"
        placeholder="Enter your dog's name"
        required
        error={errors.name?.message}
        maxLength={50}
      />
      
      {/* Age */}
      <FormInput 
        name="age"
        label="Age (years)"
        type="number"
        min={0}
        max={30}
        step={0.5}
        placeholder="Enter your dog's age"
        required
        error={errors.age?.message}
        helperText="You can use decimals for puppies (e.g., 0.5 for 6 months)"
      />
      
      {/* Gender */}
      <FormSelect
        name="gender"
        label="Gender"
        options={genderOptions}
        required
        error={errors.gender?.message}
      />
      
      {/* Weight and Unit (side by side) */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="weight"
          label="Weight"
          type="number"
          min={0.1}
          max={200}
          step={0.1}
          placeholder="Enter weight"
          required
          error={errors.weight?.message}
        />
        
        <FormSelect
          name="weightUnit"
          label="Unit"
          options={weightUnitOptions}
          required
          error={errors.weightUnit?.message}
        />
      </div>
      
      <div className="mt-2 bg-blue-50 p-4 rounded-md text-sm">
        <p className="font-medium text-blue-700">Why this matters:</p>
        <p className="text-blue-600">Your dog's basic information helps us calculate their specific nutritional needs based on their size, age, and metabolism.</p>
      </div>
    </div>
  );
};

export default BasicInfoStep; 