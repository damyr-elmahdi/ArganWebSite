import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeasherDashboard'
import AdminDashboard from './pages/AdminDashboard';
import './services/axios'; // Import axios config

// Auth guard component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has allowed role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (user.role === 'administrator') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with role-based access */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/teacher-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect based on user role */}
          <Route 
            path="/dashboard" 
            element={<DashboardRedirect />} 
          />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component to redirect to appropriate dashboard
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  } else if (user.role === 'teacher') {
    return <Navigate to="/teacher-dashboard" replace />;
  } else if (user.role === 'administrator') {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default App;