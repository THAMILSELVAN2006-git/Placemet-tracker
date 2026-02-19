import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Loading from './components/Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'mentor':
      return <MentorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading application..." />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/unauthorized"
        element={
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
          </div>
        }
      />
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;