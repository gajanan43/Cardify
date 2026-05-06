import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Cardify</h1>
            {isAuthenticated && user && (
              <span className="text-sm bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full">
                {user.sub || user.username || 'User'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/add-card')}
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded font-medium transition"
              >
                Add Card
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-medium transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar