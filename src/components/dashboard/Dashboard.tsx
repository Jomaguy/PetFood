'use client';

import React, { useState } from 'react';
import { useDogProfiles } from '@/context/DogProfileContext';
import ProfileCard from './ProfileCard';
import EmptyState from './EmptyState';
import ProfileModal from './ProfileModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProfileDetail from './ProfileDetail';

/**
 * Dashboard component for displaying dog profiles
 */
export default function Dashboard() {
  // Access dog profiles from context
  const { 
    profiles, 
    currentProfile, 
    setCurrentProfile,
    deleteProfile
  } = useDogProfiles();
  
  // State for profile management
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // State for profile detail view
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  // Handler for opening create profile modal
  const handleCreateProfile = () => {
    setEditingProfileId(null);
    setIsProfileModalOpen(true);
  };
  
  // Handler for opening edit profile modal
  const handleEditProfile = (id: string) => {
    setEditingProfileId(id);
    setIsProfileModalOpen(true);
  };
  
  // Handler for viewing a profile
  const handleViewProfile = (id: string) => {
    setSelectedProfileId(id);
  };
  
  // Handler for returning to the profile list
  const handleBackToProfiles = () => {
    setSelectedProfileId(null);
  };
  
  // Handler for initiating profile deletion
  const handleDeleteProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setProfileToDelete({ id, name: profile.name });
      setDeleteDialogOpen(true);
    }
  };
  
  // Handler for confirming profile deletion
  const confirmDeleteProfile = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete.id);
      setProfileToDelete(null);
      
      // If deleted profile was selected, return to profile list
      if (selectedProfileId === profileToDelete.id) {
        setSelectedProfileId(null);
      }
    }
  };
  
  // Handler for setting active profile
  const handleSetActiveProfile = (id: string) => {
    setCurrentProfile(id);
  };
  
  // Close modal handler
  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
    setEditingProfileId(null);
  };
  
  // Render profile detail view if a profile is selected
  if (selectedProfileId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileDetail 
          profileId={selectedProfileId}
          onBack={handleBackToProfiles}
          onEdit={handleEditProfile}
        />
      </div>
    );
  }
  
  // Otherwise render the profiles list (dashboard)
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Dog Profiles</h1>
        
        {profiles.length > 0 && (
          <button
            onClick={handleCreateProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create New Profile
          </button>
        )}
      </div>
      
      {/* Conditional rendering based on profiles existence */}
      {profiles.length === 0 ? (
        <EmptyState onCreateProfileClick={handleCreateProfile} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isActive={currentProfile?.id === profile.id}
              onView={handleViewProfile}
              onEdit={handleEditProfile}
              onDelete={handleDeleteProfile}
              onSetActive={handleSetActiveProfile}
            />
          ))}
        </div>
      )}
      
      {/* Profile creation/editing modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        profileId={editingProfileId || undefined}
      />
      
      {/* Delete confirmation dialog */}
      {profileToDelete && (
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeleteProfile}
          profileName={profileToDelete.name}
        />
      )}
    </div>
  );
} 