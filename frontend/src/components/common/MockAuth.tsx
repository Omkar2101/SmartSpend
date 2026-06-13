import React, { createContext, useContext, useState, useEffect } from 'react';
import mockDb from '../../utils/mockDb';

// Authentication state stored in localStorage
const AUTH_KEY = 'smartspend_is_logged_in';

interface AuthContextType {
  isSignedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: true,
  login: () => {},
  logout: () => {}
});

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    // Default to true so user is logged in on first load, like a sandbox
    return stored === null ? true : stored === 'true';
  });

  const login = () => {
    setIsSignedIn(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const logout = () => {
    setIsSignedIn(false);
    localStorage.setItem(AUTH_KEY, 'false');
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ClerkProvider: React.FC<{ children: React.ReactNode, publishableKey?: string }> = ({ children }) => {
  return <MockAuthProvider>{children}</MockAuthProvider>;
};

export const useAuth = () => {
  const { isSignedIn, logout } = useContext(AuthContext);
  return {
    isSignedIn,
    isLoaded: true,
    userId: 'usr_1',
    sessionId: 'sess_1',
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    signOut: logout,
    getToken: async () => 'mock_token'
  };
};

export const useUser = () => {
  const { isSignedIn } = useContext(AuthContext);
  const user = mockDb.getUser();
  
  return {
    isSignedIn,
    isLoaded: true,
    user: isSignedIn ? {
      id: user.id,
      primaryEmailAddress: { emailAddress: user.email },
      emailAddresses: [{ emailAddress: user.email }],
      fullName: user.name || 'Omkar',
      firstName: user.name || 'Omkar',
      lastName: '',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' // beautiful generic avatar
    } : null
  };
};

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);
  return !isSignedIn ? <>{children}</> : null;
};

export const SignInButton: React.FC = () => {
  const { login } = useContext(AuthContext);
  return (
    <button className="btn btn-primary" onClick={login} style={{ cursor: 'pointer' }}>
      Sign In
    </button>
  );
};

export const SignUpButton: React.FC = () => {
  const { login } = useContext(AuthContext);
  return (
    <button className="btn btn-secondary" onClick={login} style={{ cursor: 'pointer' }}>
      Sign Up
    </button>
  );
};

export const RedirectToSignIn: React.FC = () => {
  useEffect(() => {
    // Force redirect to login page
    window.location.href = '/sign-in';
  }, []);
  return null;
};

// Beautiful User dropdown profile widget modeled after Notion
export const UserButton: React.FC = () => {
  const { user } = useUser();
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="mock-user-button-container" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button 
        className="mock-avatar-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          overflow: 'hidden'
        }}
      >
        <img 
          src={user.imageUrl} 
          alt={user.fullName} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </button>

      {isOpen && (
        <div 
          className="mock-user-dropdown"
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            width: '220px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000,
            padding: '8px 0',
            textAlign: 'left'
          }}
        >
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{user.fullName}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div style={{ padding: '4px 0' }}>
            <a 
              href="/profile" 
              style={{
                display: 'block',
                padding: '6px 12px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
              className="dropdown-item-hover"
              onClick={() => setIsOpen(false)}
            >
              👤 View Profile
            </a>
            <a 
              href="/settings" 
              style={{
                display: 'block',
                padding: '6px 12px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
              className="dropdown-item-hover"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </a>
            <button 
              onClick={() => {
                logout();
                setIsOpen(false);
                window.location.href = '/';
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '6px 12px',
                fontSize: '13px',
                color: 'var(--accent-red)',
                cursor: 'pointer',
                borderTop: '1px solid var(--border-color)',
                marginTop: '4px'
              }}
              className="dropdown-item-hover"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
