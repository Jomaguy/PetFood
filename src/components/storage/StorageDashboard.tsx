'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  cleanupStorage, 
  createBackup, 
  downloadExportedData, 
  getStorageStats, 
  importDataFromFile 
} from '../../utils/storageUtils';
import { StorageError } from '../../utils/errorHandling';

type MergeStrategy = 'replace' | 'merge' | 'keep-newer';

const StorageDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReturnType<typeof getStorageStats> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cleanupDays, setCleanupDays] = useState<number>(90);
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load storage stats on component mount
  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    try {
      const currentStats = getStorageStats();
      setStats(currentStats);
      setError(null);
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.getUserFriendlyMessage());
      } else {
        setError('Failed to load storage statistics.');
      }
    }
  };

  const handleExport = () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const filename = `petfood-export-${new Date().toISOString().split('T')[0]}.json`;
      const success = downloadExportedData(filename);
      
      if (success) {
        setStatusMessage(`Data successfully exported to ${filename}`);
      } else {
        setError('Failed to export data.');
      }
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.getUserFriendlyMessage());
      } else {
        setError('An unexpected error occurred during export.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const file = e.target.files[0];
      
      const success = await importDataFromFile(file, mergeStrategy);
      
      if (success) {
        setStatusMessage(`Data successfully imported using "${mergeStrategy}" strategy`);
        refreshStats();
      } else {
        setError('Failed to import data. The file might be invalid or corrupted.');
      }
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.getUserFriendlyMessage());
      } else {
        setError('An unexpected error occurred during import.');
      }
    } finally {
      setIsLoading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBackup = () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const success = createBackup();
      
      if (success) {
        setStatusMessage('Manual backup created successfully');
        refreshStats();
      } else {
        setError('Failed to create backup.');
      }
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.getUserFriendlyMessage());
      } else {
        setError('An unexpected error occurred during backup creation.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const result = cleanupStorage(cleanupDays);
      
      if (result.total > 0) {
        setStatusMessage(
          `Cleanup completed: Removed ${result.recommendations} old recommendations and ${result.oldBackups} old backups`
        );
      } else {
        setStatusMessage('No data needed to be cleaned up');
      }
      
      refreshStats();
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.getUserFriendlyMessage());
      } else {
        setError('An unexpected error occurred during cleanup.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Storage Management</h1>
      
      {/* Status and Errors */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}
      
      {statusMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {statusMessage}
        </div>
      )}
      
      {/* Storage Statistics */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Storage Usage</h2>
        
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Usage Statistics:</h3>
              <ul className="mt-2 space-y-1">
                <li>Used Space: {formatBytes(stats.usage.used)}</li>
                {stats.usage.available && (
                  <li>Available Space: {formatBytes(stats.usage.available)}</li>
                )}
                {stats.usage.percentUsed && (
                  <li>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          stats.usage.percentUsed > 80 ? 'bg-red-600' : 
                          stats.usage.percentUsed > 60 ? 'bg-yellow-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(stats.usage.percentUsed, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{stats.usage.percentUsed.toFixed(1)}% Used</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Stored Items:</h3>
              <ul className="mt-2 space-y-1">
                <li>Dog Profiles: {stats.counts.dogProfiles}</li>
                <li>Saved Recommendations: {stats.counts.savedRecommendations}</li>
                <li>Backups: {stats.counts.backups}</li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-medium">Last Updated:</h3>
              <ul className="mt-2 space-y-1">
                <li>Dog Profiles: {formatDate(stats.lastUpdated.dogProfiles)}</li>
                <li>Recommendations: {formatDate(stats.lastUpdated.savedRecommendations)}</li>
                <li>Last Backup: {formatDate(stats.lastUpdated.backups)}</li>
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading statistics...</p>
        )}
        
        <button
          className="mt-4 py-1 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          onClick={refreshStats}
          disabled={isLoading}
        >
          Refresh Stats
        </button>
      </div>
      
      {/* Data Export/Import */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Data Export & Import</h2>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download all your data (profiles, recommendations, preferences) as a JSON file.
            </p>
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
              onClick={handleExport}
              disabled={isLoading}
            >
              {isLoading ? 'Exporting...' : 'Export All Data'}
            </button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Import data from a previously exported JSON file.
            </p>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merge Strategy:
              </label>
              <select
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={mergeStrategy}
                onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
                disabled={isLoading}
              >
                <option value="replace">Replace All (overwrite existing data)</option>
                <option value="merge">Merge (keep existing + add new)</option>
                <option value="keep-newer">Keep Newer (based on timestamps)</option>
              </select>
            </div>
            
            <label className="block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center cursor-pointer">
              {isLoading ? 'Importing...' : 'Import Data'}
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
                disabled={isLoading}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Storage Maintenance */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Storage Maintenance</h2>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Create Backup</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create a manual backup of all your current data.
            </p>
            <button
              className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
              onClick={handleBackup}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Manual Backup'}
            </button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Clean Up Old Data</h3>
            <p className="text-sm text-gray-600 mb-1">
              Remove recommendations older than the specified number of days.
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <input
                type="range"
                min="30"
                max="365"
                step="30"
                value={cleanupDays}
                onChange={(e) => setCleanupDays(parseInt(e.target.value))}
                className="w-full"
                disabled={isLoading}
              />
              <span>{cleanupDays} days</span>
            </div>
            
            <button
              className="py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full"
              onClick={handleCleanup}
              disabled={isLoading}
            >
              {isLoading ? 'Cleaning...' : 'Clean Up Old Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageDashboard; 