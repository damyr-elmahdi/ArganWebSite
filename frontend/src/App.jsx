import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './services/axios'; // Import axios config

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import News from './pages/News';
import Events from './pages/Events';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

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

export default function App() {
  // School information as a central source of truth
  const schoolInfo = {
    name: "Argan High School",
    ministry: "Ministry of Education and Early Childhood Education",
    tagline: "Nurturing Minds, Building Futures",
    address: "123 Education Street, Anytown, ST 12345",
    phone: "(555) 123-4567",
    email: "info@arganhighschool.edu",
    foundedYear: 2010,
    currentYear: new Date().getFullYear()
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header schoolName={schoolInfo.name} ministry={schoolInfo.ministry} tagline={schoolInfo.tagline} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home schoolInfo={schoolInfo} />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/library" element={<Library />} />
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
          <Route path="/dashboard" element={<DashboardRedirect />} />
        </Routes>
        <Footer schoolInfo={schoolInfo} />
      </div>
    </Router>
  );
}