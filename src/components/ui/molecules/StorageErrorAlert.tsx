import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { StorageError, StorageErrorType } from '../../../utils/errorHandling';

interface StorageErrorAlertProps {
  /** The error to display */
  error: StorageError | null;
  /** Callback when user dismisses the alert */
  onDismiss?: () => void;
  /** Duration in ms to auto-dismiss (0 for no auto-dismiss) */
  autoDismiss?: number;
  /** Position of the alert (default: 'bottom-right') */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Whether the alert is visible (controlled mode) */
  isVisible?: boolean;
}

/**
 * Component that displays storage errors with different severity levels
 */
export const StorageErrorAlert: React.FC<StorageErrorAlertProps> = ({
  error,
  onDismiss,
  autoDismiss = 0,
  position = 'bottom-right',
  isVisible: controlledVisible
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!error);
  
  // Determine severity based on error type
  const getSeverity = (): 'error' | 'warning' | 'info' => {
    if (!error) return 'info';
    
    switch (error.type) {
      case StorageErrorType.STORAGE_UNAVAILABLE:
      case StorageErrorType.STORAGE_QUOTA_EXCEEDED:
      case StorageErrorType.WRITE_ERROR:
      case StorageErrorType.READ_ERROR:
        return 'error';
        
      case StorageErrorType.PARSE_ERROR:
      case StorageErrorType.BACKUP_ERROR:
      case StorageErrorType.RESTORE_ERROR:
      case StorageErrorType.EXPORT_ERROR:
      case StorageErrorType.IMPORT_ERROR:
        return 'warning';
        
      case StorageErrorType.VERSION_MISMATCH:
      default:
        return 'info';
    }
  };
  
  // Get alert styles based on severity
  const getAlertStyles = () => {
    const severity = getSeverity();
    
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />,
          title: 'Storage Error',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          buttonBg: 'bg-red-100 hover:bg-red-200',
          buttonText: 'text-red-800',
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />,
          title: 'Storage Warning',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          buttonBg: 'bg-yellow-100 hover:bg-yellow-200',
          buttonText: 'text-yellow-800',
          iconColor: 'text-yellow-400'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />,
          title: 'Storage Information',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          buttonBg: 'bg-blue-100 hover:bg-blue-200',
          buttonText: 'text-blue-800',
          iconColor: 'text-blue-400'
        };
    }
  };
  
  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  // Handle dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  // Set up auto-dismiss timer
  useEffect(() => {
    if (autoDismiss > 0 && error) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, autoDismiss]);
  
  // Update visibility when error changes
  useEffect(() => {
    if (error && controlledVisible === undefined) {
      setIsVisible(true);
    } else if (!error && controlledVisible === undefined) {
      setIsVisible(false);
    }
  }, [error]);
  
  // Use controlled visibility if provided
  useEffect(() => {
    if (controlledVisible !== undefined) {
      setIsVisible(controlledVisible);
    }
  }, [controlledVisible]);
  
  // Don't render if no error or not visible
  if (!error || !isVisible) {
    return null;
  }
  
  const styles = getAlertStyles();
  
  return (
    <div className={`fixed ${getPositionStyles()} max-w-md ${styles.bg} border ${styles.border} rounded-lg shadow-md p-4 z-50`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>{styles.title}</h3>
          <div className={`mt-1 text-sm ${styles.textColor}`}>
            <p>{error.getUserFriendlyMessage()}</p>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded ${styles.buttonBg} ${styles.buttonText} transition-colors`}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
        <button
          type="button"
          className={`flex-shrink-0 ml-2 ${styles.iconColor} hover:opacity-75`}
          onClick={handleDismiss}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}; 