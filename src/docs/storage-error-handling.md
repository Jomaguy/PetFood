# Storage Error Handling System

This document explains the storage error handling system implemented in the PetFood application.

## Overview

The storage error handling system provides consistent error handling for all localStorage operations. It includes:

- Custom error types
- User-friendly error messages
- Visual feedback through alert components
- Global error state management
- Utilities for testing and debugging

## Components

### 1. Storage Error Types

The system defines specific error types in `errorHandling.ts`:

```typescript
export enum StorageErrorType {
  STORAGE_UNAVAILABLE = 'storage_unavailable',
  STORAGE_QUOTA_EXCEEDED = 'storage_quota_exceeded',
  PARSE_ERROR = 'parse_error',
  WRITE_ERROR = 'write_error',
  READ_ERROR = 'read_error',
  VERSION_MISMATCH = 'version_mismatch',
  BACKUP_ERROR = 'backup_error',
  RESTORE_ERROR = 'restore_error',
  EXPORT_ERROR = 'export_error',
  IMPORT_ERROR = 'import_error',
  UNKNOWN_ERROR = 'unknown_error'
}
```

### 2. StorageError Class

A custom error class that provides additional context and user-friendly messages:

```typescript
export class StorageError extends Error {
  type: StorageErrorType;
  details?: any;
  timestamp: Date;
  
  // ...constructor
  
  getUserFriendlyMessage(): string {
    // Returns a user-friendly message based on error type
  }
}
```

### 3. Error Handling Functions

- `handleStorageError`: Converts different error types to a consistent StorageError format
- `tryCatchStorage`: A wrapper function for storage operations that handles errors
- `determineErrorType`: Analyzes error messages to determine the most likely error type
- `logStorageError`: Enhanced error logging for debugging

### 4. UI Components

#### StorageErrorAlert

A customizable alert component that displays storage errors with appropriate styling based on severity:

```tsx
<StorageErrorAlert 
  error={storageError}
  onDismiss={() => setError(null)}
  autoDismiss={5000}
  position="bottom-right"
/>
```

#### StorageAlert

A component that displays warnings when storage is nearly full:

```tsx
<StorageAlert threshold={80} />
```

### 5. Context Provider

The `StorageErrorContext` provides global access to storage errors:

```tsx
const { error, setError, clearError } = useStorageError();
```

## Usage Examples

### Basic Error Handling

```typescript
import { tryCatchStorage } from '../utils/errorHandling';

function saveData(key: string, data: any) {
  const { result, error } = tryCatchStorage(
    () => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    'saveData'
  );
  
  if (error) {
    // Handle error
    console.error(error.getUserFriendlyMessage());
    return false;
  }
  
  return true;
}
```

### Using the useStorageErrors Hook

```tsx
import { useStorageErrors } from '../hooks/useStorageErrors';

function MyComponent() {
  const { 
    error, 
    isAvailable, 
    usage, 
    isNearlyFull,
    reportError
  } = useStorageErrors();
  
  // Component logic
  
  return (
    <div>
      {isNearlyFull && <p>Warning: Storage space is limited</p>}
      {/* Rest of component */}
    </div>
  );
}
```

### Manual Error Reporting

```typescript
import { StorageErrorType } from '../utils/errorHandling';
import { useStorageError } from '../context/StorageErrorContext';

function ImportData(data: string) {
  const { setError } = useStorageError();
  
  try {
    // Parse and import data
    const parsedData = JSON.parse(data);
    // ...import logic
  } catch (err) {
    if (err instanceof Error) {
      setError(new StorageError(
        `Failed to import data: ${err.message}`,
        StorageErrorType.IMPORT_ERROR,
        { originalError: err }
      ));
    }
    return false;
  }
  
  return true;
}
```

## Testing Storage Errors

The application includes a debug page at `/storage-debug` that allows you to:

- Check storage availability and usage
- Simulate different error types
- Test storage operations
- Fill storage with test data to trigger quota exceeded errors

## Best Practices

1. Always use `tryCatchStorage` for localStorage operations
2. Handle errors gracefully with appropriate user feedback
3. Provide recovery options when possible (e.g., clear data, restore from backup)
4. Log errors for debugging but show user-friendly messages to users
5. Test storage error scenarios regularly 