import React, { useEffect } from 'react';
import {
  ClerkProvider as RealClerkProvider,
  useAuth as useRealAuth,
  useUser as useRealUser,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  SignInButton as RealSignInButton,
  SignUpButton as RealSignUpButton,
  UserButton as RealUserButton,
  RedirectToSignIn as RealRedirectToSignIn,
} from '@clerk/clerk-react';

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error("Missing Clerk Publishable Key in .env file!");
  }
  return (
    <RealClerkProvider publishableKey={publishableKey}>
      <TokenLogger />
      {children}
    </RealClerkProvider>
  );
};

// Internal component to log tokens when authenticated
const TokenLogger: React.FC = () => {
  const { getToken, isSignedIn } = useRealAuth();

  useEffect(() => {
    if (isSignedIn) {
      getToken().then((token) => {
        console.log("=========================================");
        console.log("CLERK AUTHENTICATION SUCCESSFUL!");
        console.log("BEARER TOKEN FOR BACKEND TESTING:");
        console.log(`Bearer ${token}`);
        console.log("=========================================");
      }).catch(err => {
        console.error("Failed to retrieve Clerk token:", err);
      });
    }
  }, [isSignedIn, getToken]);

  return null;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAuth = useRealAuth;
export const useUser = useRealUser;
export const SignedIn = RealSignedIn;
export const SignedOut = RealSignedOut;
export const SignInButton = RealSignInButton;
export const SignUpButton = RealSignUpButton;
export const UserButton = RealUserButton;
export const RedirectToSignIn = RealRedirectToSignIn;
