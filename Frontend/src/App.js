import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { useLocation } from 'react-router-dom';

import Login from './features/auth/Login';
import Sigup from './features/auth/Sigup';
import CardList from './features/card/CardList';
import AddCard from './features/card/AddCard';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isPublicAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isPublicAuthPage && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sigup />} />

        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/cards" replace /> : <Navigate to="/login" replace />}
        />

        {/* Protected Routes - Only show CardList after login */}
        <Route 
          path="/cards" 
          element={
            <PrivateRoute>
              <CardList />
            </PrivateRoute>
          } 
        />

        <Route
          path="/add-card"
          element={
            <PrivateRoute>
              <AddCard />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/cards" : "/login"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App
