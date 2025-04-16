import { useFormContext } from 'react-hook-form';
import { FormSelect, FormInput, FormGroup } from '../../ui/form';
import { COMMON_DOG_BREEDS, DogProfile } from '../../../types/dogProfile';

export const BasicDetailsStep = () => {
  const { formState: { errors } } = useFormContext<DogProfile>();

  const breedOptions = COMMON_DOG_BREEDS.map(breed => ({
    value: breed,
    label: breed
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
      
      <FormInput 
        name="name"
        label="Dog's Name"
        placeholder="Enter your dog's name"
        required
        error={errors.name?.message}
        maxLength={50}
      />

      <FormSelect
        name="breed"
        label="Breed"
        options={breedOptions}
        placeholder="Search or select a breed"
        required
        error={errors.breed?.message}
        isSearchable
      />
      
      <div className="mt-4 bg-blue-50 p-4 rounded-md text-sm">
        <p className="font-medium text-blue-700">Why this matters:</p>
        <p className="text-blue-600">Your dog's breed helps us understand their specific nutritional needs, as different breeds have different dietary requirements.</p>
      </div>
    </div>
  );
};

export default BasicDetailsStep; 