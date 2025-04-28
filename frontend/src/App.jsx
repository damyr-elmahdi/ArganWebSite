import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./services/axios";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import News from "./pages/News";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import QuizTaking from "./components/QuizTaking";
import QuizResults from "./components/QuizResults";
import QuizResultsViewer from "./components/QuizResultsViewer";
import QuizEditor from "./components/QuizEditor";
import TeacherQuizzes from './components/TeacherQuizzes';
import QuizCreator from './components/QuizCreator';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard
    if (user.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    } else if (user.role === "teacher") {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (user.role === "administrator") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === "librarian") {
      return <Navigate to="/librarian-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Component to redirect to appropriate dashboard
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  } else if (user.role === "teacher") {
    return <Navigate to="/teacher-dashboard" replace />;
  } else if (user.role === "administrator") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user.role === "librarian") {
    return <Navigate to="/librarian-dashboard" replace />;
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
    address: "Tiznit, Morocco",
    phone: "(555) 123-4567",
    email: "info@arganhighschool.edu",
    foundedYear: 2014,
    currentYear: new Date().getFullYear(),
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header
            schoolName={schoolInfo.name}
            ministry={schoolInfo.ministry}
            tagline={schoolInfo.tagline}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home schoolInfo={schoolInfo} />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<News />} />{" "}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Password reset routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* Protected routes with role-based access */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/librarian-dashboard"
              element={
                <ProtectedRoute allowedRoles={["librarian", "administrator"]}>
                  <LibrarianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["administrator"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Quiz related routes */}
            <Route
              path="/student/take-quiz/:quizId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <div className="flex-grow container mx-auto px-4 py-8">
                    <QuizTaking quizId={":quizId"} />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
            <Route path="/teacher/quizzes/create" element={<QuizCreator />} />
            <Route
              path="/teacher/quizzes/:quizId/edit"
              element={<QuizEditor />}
            />
            <Route
              path="/student/quiz-results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <div className="flex-grow container mx-auto px-4 py-8">
                    <QuizResults />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/quiz-results/:quizId"
              element={
                <ProtectedRoute allowedRoles={["teacher", "administrator"]}>
                  <div className="flex-grow container mx-auto px-4 py-8">
                    <QuizResultsViewer />
                  </div>
                </ProtectedRoute>
              }
            />
            {/* Redirect based on user role */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
          </Routes>
          <Footer schoolInfo={schoolInfo} />
        </div>
      </Router>
    </AuthProvider>
  );
}
