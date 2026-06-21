/**
 * Main App Component
 * Application entry point with routing and providers
 */

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MockAuthProvider } from './components/common/MockAuth';
import AppRouter from './routes/AppRouter';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MockAuthProvider>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#0f7b44', secondary: '#fff' },
              style: { border: '1px solid rgba(15,123,68,0.2)', background: '#fff' },
            },
            error: {
              iconTheme: { primary: '#eb5757', secondary: '#fff' },
              style: { border: '1px solid rgba(235,87,87,0.2)', background: '#fff' },
            },
          }}
        />
      </MockAuthProvider>
    </QueryClientProvider>
  );
}

export default App;


