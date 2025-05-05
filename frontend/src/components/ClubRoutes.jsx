import { Routes, Route } from 'react-router-dom';
import ClubsSection from '../components/ClubsSection';
import ClubDetails from '../components/ClubDetails';
import ClubManagement from '../components/ClubManagement';
import ProtectedRoute from './ProtectedRoute'; // Assuming you have a protected route component

export default function ClubRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ClubsSection />} />
      <Route path="/:id" element={<ClubDetails />} />
      
      {/* Admin routes - protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <ClubManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/:id" 
        element={
          <ProtectedRoute>
            <ClubManagement />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}