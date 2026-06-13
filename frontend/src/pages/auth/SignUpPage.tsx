/**
 * Sign Up Page Component
 * Clerk-managed sign up page
 */

import React from 'react';
import { SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/routes';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isSignedIn, navigate]);

  return (
    <div style={{ width: '100%' }}>
      <SignUp
        signInUrl={ROUTES.SIGNIN}
        redirectUrl={ROUTES.DASHBOARD}
      />
    </div>
  );
};

export default SignUpPage;
