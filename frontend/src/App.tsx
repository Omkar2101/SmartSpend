/**
 * Main App Component
 * Application entry point with routing and providers
 */

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
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
      </MockAuthProvider>
    </QueryClientProvider>
  );
}

export default App;


