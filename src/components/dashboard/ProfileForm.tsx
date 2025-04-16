'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DogProfile, Gender, ActivityLevel, dogProfileSchema, COMMON_DOG_BREEDS, COMMON_HEALTH_CONDITIONS } from '@/types/dogProfile';
import { useDogProfiles } from '@/context/DogProfileContext';

interface ProfileFormProps {
  profileId?: string;
  onClose: () => void;
}

export default function ProfileForm({ profileId, onClose }: ProfileFormProps) {
  const { profiles, addProfile, updateProfile } = useDogProfiles();
  
  // Find the profile to edit if profileId is provided
  const profileToEdit = profileId 
    ? profiles.find(profile => profile.id === profileId) 
    : undefined;
  
  // Set up form with React Hook Form
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<DogProfile>({
    resolver: zodResolver(dogProfileSchema),
    defaultValues: profileToEdit || {
      name: '',
      breed: '',
      age: 0,
      gender: Gender.MALE,
      weight: 0,
      weightUnit: 'kg',
      activityLevel: ActivityLevel.MODERATE,
      healthConditions: [],
      notes: ''
    }
  });
  
  // Reset form when profileId changes
  useEffect(() => {
    if (profileToEdit) {
      reset(profileToEdit);
    } else {
      reset({
        name: '',
        breed: '',
        age: 0,
        gender: Gender.MALE,
        weight: 0,
        weightUnit: 'kg',
        activityLevel: ActivityLevel.MODERATE,
        healthConditions: [],
        notes: ''
      });
    }
  }, [profileToEdit, reset]);
  
  // Submit handler
  const onSubmit = async (data: DogProfile) => {
    try {
      if (profileId) {
        // Update existing profile
        updateProfile(profileId, data);
      } else {
        // Add new profile
        addProfile(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error could be displayed to user here
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Dog's Name
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="name"
              placeholder="Enter your dog's name"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      
      {/* Breed field */}
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
          Breed
        </label>
        <Controller
          name="breed"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="breed"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.breed ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a breed</option>
              {COMMON_DOG_BREEDS.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          )}
        />
        {errors.breed && (
          <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
        )}
      </div>
      
      {/* Age field */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age (years)
        </label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              id="age"
              min="0"
              step="0.5"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>
      
      {/* Gender field */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">Gender</span>
        <div className="flex space-x-4">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    checked={field.value === Gender.MALE}
                    onChange={() => field.onChange(Gender.MALE)}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    checked={field.value === Gender.FEMALE}
                    onChange={() => field.onChange(Gender.FEMALE)}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </>
            )}
          />
        </div>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>
      
      {/* Weight field */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="weight"
                min="0"
                step="0.1"
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>
        
        <div className="w-24">
          <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <Controller
            name="weightUnit"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="weightUnit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            )}
          />
        </div>
      </div>
      
      {/* Activity Level field */}
      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Activity Level
        </label>
        <Controller
          name="activityLevel"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="activityLevel"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.activityLevel ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={ActivityLevel.LOW}>Low</option>
              <option value={ActivityLevel.MODERATE}>Moderate</option>
              <option value={ActivityLevel.HIGH}>High</option>
              <option value={ActivityLevel.VERY_HIGH}>Very High</option>
            </select>
          )}
        />
        {errors.activityLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>
        )}
      </div>
      
      {/* Health Conditions field */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">Health Conditions</span>
        <Controller
          name="healthConditions"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 mt-1">
              {COMMON_HEALTH_CONDITIONS.map((condition) => (
                <label key={condition.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                    checked={field.value.includes(condition.id)}
                    onChange={(e) => {
                      const updatedConditions = e.target.checked
                        ? [...field.value, condition.id]
                        : field.value.filter((id) => id !== condition.id);
                      field.onChange(updatedConditions);
                    }}
                  />
                  <span className="ml-2 text-sm">{condition.name}</span>
                </label>
              ))}
            </div>
          )}
        />
      </div>
      
      {/* Notes field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="notes"
              rows={3}
              placeholder="Any additional information about your dog"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          )}
        />
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : profileId ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
} 