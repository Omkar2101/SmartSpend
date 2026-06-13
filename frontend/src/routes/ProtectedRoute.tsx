/**
 * Protected Route wrapper component
 * Ensures only authenticated users can access the route
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '../components/common/MockAuth';
import ROUTES from './routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * Uses Clerk's built-in SignedIn and SignedOut components
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to={ROUTES.SIGNIN} replace />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
