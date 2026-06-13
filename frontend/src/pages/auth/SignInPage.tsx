/**
 * Sign In Page Component
 * Clerk-managed sign in page
 */

import React from 'react';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/routes';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isSignedIn, navigate]);

  return (
    <div style={{ width: '100%' }}>
      <SignIn
        signUpUrl={ROUTES.SIGNUP}
        redirectUrl={ROUTES.DASHBOARD}
      />
    </div>
  );
};

export default SignInPage;
