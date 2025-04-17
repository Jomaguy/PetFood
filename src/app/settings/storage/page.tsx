'use client';

import React from 'react';
import StorageDashboard from '../../../components/storage/StorageDashboard';

export default function StorageManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Storage Management</h1>
      <StorageDashboard />
    </div>
  );
} 