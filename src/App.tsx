
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Context
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdminMasterDashboard from '@/pages/AdminMasterDashboard';
import Teams from '@/pages/Teams';
import Members from '@/pages/Members';
import Events from '@/pages/Events';
import Music from '@/pages/Music';
import Settings from '@/pages/Settings';

// Components
import LoadingScreen from '@/components/LoadingScreen';

const queryClient = new QueryClient();

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Componente para rotas do admin master
const AdminMasterRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdminMaster, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdminMaster) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user, isAdminMaster, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          {/* Admin Master Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminMasterRoute>
                <AdminMasterDashboard />
              </AdminMasterRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {isAdminMaster ? <AdminMasterDashboard /> : <Dashboard />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/members" 
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/music" 
            element={
              <ProtectedRoute>
                <Music />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
