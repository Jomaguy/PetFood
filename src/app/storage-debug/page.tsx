'use client';

import React, { useState } from 'react';
import { useStorageErrors } from '../../hooks/useStorageErrors';
import { StorageErrorType } from '../../utils/errorHandling';
import { isStorageAvailable, getStorageUsage, isStorageNearlyFull } from '../../utils/storageUtils';

export default function StorageDebugPage() {
  const { 
    error, 
    isAvailable, 
    usage, 
    isNearlyFull, 
    clearError, 
    checkAvailability, 
    checkStorageSpace, 
    reportError 
  } = useStorageErrors();
  
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  
  // Generate test data to fill up storage
  const generateTestData = (sizeInKB: number) => {
    try {
      // Generate a string of specified size
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const iterations = (sizeInKB * 1024) / 2; // Each character is approximately 2 bytes
      
      for (let i = 0; i < iterations; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Save to localStorage
      localStorage.setItem(`test_data_${Date.now()}`, result);
      
      // Check storage space after adding data
      checkStorageSpace();
    } catch (err) {
      if (err instanceof Error) {
        reportError(err, StorageErrorType.STORAGE_QUOTA_EXCEEDED);
      }
    }
  };
  
  // Simulate different storage errors
  const simulateError = (errorType: StorageErrorType) => {
    reportError(`This is a simulated ${errorType} error.`, errorType);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Storage Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Storage Status</h2>
          
          <div className="mb-4">
            <p>
              <strong>Local Storage Available:</strong> {isAvailable ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Storage Usage:</strong> {usage.used ? Math.round(usage.used / 1024) : 0} KB used
              {usage.available ? ` / ${Math.round(usage.available / 1024)} KB available` : ''}
            </p>
            <p>
              <strong>Percentage Used:</strong> {usage.percentUsed ? Math.round(usage.percentUsed) : 0}%
            </p>
            <p>
              <strong>Nearly Full:</strong> {isNearlyFull ? 'Yes' : 'No'}
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => checkAvailability()}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Check Availability
            </button>
            <button
              onClick={() => checkStorageSpace()}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Check Usage
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Test Storage Errors</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Simulate Error Types:</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => simulateError(StorageErrorType.STORAGE_UNAVAILABLE)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Storage Unavailable
              </button>
              <button
                onClick={() => simulateError(StorageErrorType.STORAGE_QUOTA_EXCEEDED)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Quota Exceeded
              </button>
              <button
                onClick={() => simulateError(StorageErrorType.PARSE_ERROR)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Parse Error
              </button>
              <button
                onClick={() => simulateError(StorageErrorType.WRITE_ERROR)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Write Error
              </button>
              <button
                onClick={() => simulateError(StorageErrorType.VERSION_MISMATCH)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Version Mismatch
              </button>
              <button
                onClick={clearError}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Clear Error
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Fill Storage:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => generateTestData(100)}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Add 100KB
              </button>
              <button
                onClick={() => generateTestData(500)}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Add 500KB
              </button>
              <button
                onClick={() => generateTestData(1000)}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Add 1MB
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Manual Storage Operations</h2>
          
          <div className="mb-4">
            <div className="flex mb-2">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Key"
                className="flex-1 border rounded px-2 py-1 mr-2"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value"
                className="flex-1 border rounded px-2 py-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  try {
                    if (key) {
                      localStorage.setItem(key, value);
                      checkStorageSpace();
                    }
                  } catch (err) {
                    if (err instanceof Error) {
                      reportError(err, StorageErrorType.WRITE_ERROR);
                    }
                  }
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={!key}
              >
                Set Item
              </button>
              <button
                onClick={() => {
                  try {
                    if (key) {
                      localStorage.removeItem(key);
                      checkStorageSpace();
                    }
                  } catch (err) {
                    if (err instanceof Error) {
                      reportError(err);
                    }
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!key}
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Current Error</h2>
          
          {error ? (
            <div className="border-l-4 border-red-500 bg-red-50 p-3">
              <p className="font-medium">{error.type}</p>
              <p className="text-sm text-gray-700">{error.message}</p>
              <p className="text-sm font-medium mt-2">User friendly message:</p>
              <p className="text-sm text-gray-700">{error.getUserFriendlyMessage()}</p>
              <button
                onClick={clearError}
                className="mt-2 px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No errors currently.</p>
          )}
        </div>
      </div>
    </div>
  );
} 