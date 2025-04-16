/**
 * Utility functions for enhanced error handling and logging
 */

// Define different types of storage errors
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

// Custom storage error class
export class StorageError extends Error {
  type: StorageErrorType;
  details?: any;
  timestamp: Date;

  constructor(
    message: string,
    type: StorageErrorType = StorageErrorType.UNKNOWN_ERROR,
    details?: any
  ) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date();

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, StorageError.prototype);
  }

  // Get human-readable error message
  getUserFriendlyMessage(): string {
    switch (this.type) {
      case StorageErrorType.STORAGE_UNAVAILABLE:
        return 'Local storage is not available in your browser. Please enable cookies and local storage in your browser settings.';
      
      case StorageErrorType.STORAGE_QUOTA_EXCEEDED:
        return 'Storage space is full. Please delete some data or export your data as a backup.';
      
      case StorageErrorType.PARSE_ERROR:
        return 'Could not read stored data due to a format error. Your data might be corrupted.';
      
      case StorageErrorType.WRITE_ERROR:
        return 'Failed to save data to storage. Please check your browser settings.';
      
      case StorageErrorType.READ_ERROR:
        return 'Failed to read data from storage. Please check your browser settings.';
      
      case StorageErrorType.VERSION_MISMATCH:
        return 'The data format has changed since your last visit. Some data may need to be migrated.';
      
      case StorageErrorType.BACKUP_ERROR:
        return 'Failed to create a backup of your data.';
      
      case StorageErrorType.RESTORE_ERROR:
        return 'Failed to restore data from backup. The backup might be corrupted or missing.';
      
      case StorageErrorType.EXPORT_ERROR:
        return 'Failed to export data. Please try again later.';
      
      case StorageErrorType.IMPORT_ERROR:
        return 'Failed to import data. The file might be corrupted or in an invalid format.';
      
      default:
        return this.message || 'An unknown error occurred while accessing storage.';
    }
  }
}

// Error handler for storage operations
export function handleStorageError(
  error: unknown,
  operation: string,
  errorType?: StorageErrorType
): StorageError {
  // Map the error to a StorageError type
  let storageError: StorageError;
  
  if (error instanceof StorageError) {
    // Already a StorageError, just return it
    return error;
  } else if (error instanceof Error) {
    // Convert standard Error to StorageError
    const type = errorType || determineErrorType(error, operation);
    storageError = new StorageError(
      error.message || `Error during ${operation}`,
      type,
      { originalError: error, stack: error.stack }
    );
  } else {
    // Handle non-Error objects
    storageError = new StorageError(
      String(error) || `Unknown error during ${operation}`,
      errorType || StorageErrorType.UNKNOWN_ERROR,
      { originalError: error }
    );
  }
  
  // Log the error for debugging
  logStorageError(storageError, operation);
  
  return storageError;
}

// Determine error type from error message or stack trace
function determineErrorType(error: Error, operation: string): StorageErrorType {
  const errorMsg = error.message.toLowerCase();
  const errorStack = error.stack?.toLowerCase() || '';
  
  if (errorMsg.includes('quota') || errorMsg.includes('exceed') || errorMsg.includes('full')) {
    return StorageErrorType.STORAGE_QUOTA_EXCEEDED;
  } else if (errorMsg.includes('parse') || errorMsg.includes('json') || errorMsg.includes('format')) {
    return StorageErrorType.PARSE_ERROR;
  } else if (!window.localStorage || operation.includes('unavailable')) {
    return StorageErrorType.STORAGE_UNAVAILABLE;
  } else if (operation.includes('write') || operation.includes('save')) {
    return StorageErrorType.WRITE_ERROR;
  } else if (operation.includes('read') || operation.includes('load')) {
    return StorageErrorType.READ_ERROR;
  } else if (operation.includes('version') || operation.includes('migration')) {
    return StorageErrorType.VERSION_MISMATCH;
  } else if (operation.includes('backup')) {
    return StorageErrorType.BACKUP_ERROR;
  } else if (operation.includes('restore')) {
    return StorageErrorType.RESTORE_ERROR;
  } else if (operation.includes('export')) {
    return StorageErrorType.EXPORT_ERROR;
  } else if (operation.includes('import')) {
    return StorageErrorType.IMPORT_ERROR;
  }
  
  return StorageErrorType.UNKNOWN_ERROR;
}

// Enhanced error logging function
export function logStorageError(error: StorageError, operation: string): void {
  console.group(`Storage Error: ${operation}`);
  console.error(`[${error.timestamp.toISOString()}] ${error.name}: ${error.message}`);
  console.error(`Type: ${error.type}`);
  console.error(`User friendly message: ${error.getUserFriendlyMessage()}`);
  if (error.details) {
    console.error('Details:', error.details);
  }
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  console.groupEnd();

  // In a production app, you might want to send this to a logging service
  // logToService(error, operation);
}

// Try-catch wrapper for storage operations
export function tryCatchStorage<T>(
  operation: () => T,
  operationName: string,
  errorType?: StorageErrorType
): { result: T | null; error: StorageError | null } {
  try {
    const result = operation();
    return { result, error: null };
  } catch (err) {
    const error = handleStorageError(err, operationName, errorType);
    return { result: null, error };
  }
} 