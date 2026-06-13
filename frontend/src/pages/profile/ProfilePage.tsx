/**
 * Profile Page Component
 * User profile information
 */

import React from 'react';
import { useCurrentUser } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <h1>👤 Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <h2>{user?.name || user?.email}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>User ID</label>
            <p>{user?.id}</p>
          </div>
          <div className="info-group">
            <label>Clerk ID</label>
            <p>{user?.clerkId}</p>
          </div>
          <div className="info-group">
            <label>Member Since</label>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;