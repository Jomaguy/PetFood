'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { DogProfile, dogProfileSchema, DEFAULT_DOG_PROFILE } from '../../types/dogProfile';
import { Button } from '../ui/atoms/Button';
import { BasicDetailsStep, BasicInfoStep, HealthActivityStep } from './steps';

const TOTAL_STEPS = 3;

export const DogProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm<DogProfile>({
    resolver: zodResolver(dogProfileSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_DOG_PROFILE
  });

  const { handleSubmit, formState: { errors, isValid }, trigger } = methods;

  const onSubmit = (data: DogProfile) => {
    console.log('Form submitted:', data);
    // TODO: Handle form submission
  };

  const nextStep = async () => {
    // Validate the current step fields before proceeding
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Helper to get the fields that should be validated at each step
  const getFieldsToValidate = (step: number): (keyof DogProfile)[] => {
    switch (step) {
      case 1:
        return ['name', 'breed'];
      case 2:
        return ['age', 'gender', 'weight', 'weightUnit'];
      case 3:
        return ['activityLevel'];
      default:
        return [];
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-4">
        <div className="flex justify-between mb-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step === currentStep ? 'bg-blue-500 text-white border-blue-500' : 
                  step < currentStep ? 'bg-green-500 text-white border-green-500' : 
                  'bg-white text-gray-500 border-gray-300'}`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Your Dog's Profile</h1>
        
        {renderProgressBar()}
        
        <div className="mb-6">
          {currentStep === 1 && <BasicDetailsStep />}
          {currentStep === 2 && <BasicInfoStep />}
          {currentStep === 3 && <HealthActivityStep />}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            onClick={previousStep}
            disabled={currentStep === 1}
            className={`${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </Button>
          
          {currentStep === TOTAL_STEPS ? (
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Profile
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Step
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}; 