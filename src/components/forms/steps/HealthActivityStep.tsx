import { useFormContext, Controller } from 'react-hook-form';
import { FormSelect, FormGroup, FormCheckbox, Label } from '../../ui/form';
import { 
  DogProfile, 
  ActivityLevel, 
  COMMON_HEALTH_CONDITIONS 
} from '../../../types/dogProfile';

export const HealthActivityStep = () => {
  const { control, formState: { errors }, register, watch } = useFormContext<DogProfile>();
  
  // Options for activity level
  const activityOptions = [
    { value: ActivityLevel.LOW, label: 'Low - Mostly inactive, occasional walks' },
    { value: ActivityLevel.MODERATE, label: 'Moderate - Regular walks, some play time' },
    { value: ActivityLevel.HIGH, label: 'High - Daily exercise, active playtime' },
    { value: ActivityLevel.VERY_HIGH, label: 'Very High - Working dog, extensive activity' }
  ];
  
  // Get the currently selected health conditions
  const selectedHealthConditions = watch('healthConditions') || [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Health & Activity Information</h2>
      
      {/* Activity Level */}
      <FormSelect
        name="activityLevel"
        label="Activity Level"
        options={activityOptions}
        required
        error={errors.activityLevel?.message}
        helperText="Select the option that best matches your dog's daily activity"
      />
      
      {/* Health Conditions */}
      <FormGroup>
        <Label htmlFor="health-conditions">Health Conditions</Label>
        <p className="text-sm text-gray-500 mb-2">Select any health conditions your dog has</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {COMMON_HEALTH_CONDITIONS.map((condition) => (
            <div 
              key={condition.id} 
              className={`flex items-start p-3 rounded-lg border ${
                selectedHealthConditions.includes(condition.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center h-5">
                <input
                  id={`health-${condition.id}`}
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  value={condition.id}
                  {...register('healthConditions')}
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={`health-${condition.id}`} 
                  className="font-medium text-gray-700 block"
                >
                  {condition.name}
                </label>
                {condition.description && (
                  <p className="text-gray-500 mt-1">{condition.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </FormGroup>
      
      {/* Notes */}
      <FormGroup>
        <Label htmlFor="notes">Additional Notes</Label>
        <textarea
          id="notes"
          rows={3}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md ${
            errors.notes ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Any additional information about your dog's diet, habits, preferences..."
          {...register('notes')}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </FormGroup>
      
      <div className="mt-2 bg-blue-50 p-4 rounded-md text-sm">
        <p className="font-medium text-blue-700">Why this matters:</p>
        <p className="text-blue-600">Your dog's activity level and health conditions greatly affect their nutritional needs. This information helps us recommend food that supports their specific health profile.</p>
      </div>
    </div>
  );
};

export default HealthActivityStep; 