import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // In a real application, this would check with your backend
    const checkAuthStatus = () => {
      // For demo purposes, we're using localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      setIsAuthenticated(isLoggedIn && isAdmin);
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18bebc]"></div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Checking authorization...</h2>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}