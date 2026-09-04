import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages – Public
import Home from './pages/Home';
import Login from './pages/auth/Login';
import VisitorLogin from './pages/auth/VisitorLogin';
import Unauthorized from './pages/auth/Unauthorized';

// Pages – Shared
import MapView from './pages/Map';

// Pages – Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Pages – Student
import StudentDashboard from './pages/student/StudentDashboard';
import CampusExplorer from './pages/student/CampusExplorer';

// Pages – Visitor
import VisitorDashboard from './pages/visitor/VisitorDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '2rem' }}>⏳</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/visitor-login" element={<VisitorLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes — wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            {/* Visitor Routes */}
            <Route path="/visitor" element={
              <ProtectedRoute allowedRoles={['VISITOR']}>
                <VisitorDashboard />
              </ProtectedRoute>
            } />

            {/* Shared – Campus Explorer (Student + Visitor) */}
            <Route path="/campus" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STUDENT', 'VISITOR']}>
                <CampusExplorer />
              </ProtectedRoute>
            } />
            
            {/* Shared – Map & Route Finder */}
            <Route path="/map" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STUDENT', 'VISITOR']}>
                <MapView />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
