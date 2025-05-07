import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ExamManagement from '../components/exam/ExamManagement';
import StudentExamView from '../components/exam/StudentExamView';

const ExamRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render appropriate component based on user role
  return (
    <Routes>
      {user.role === 'administrator' && (
        <Route path="manage" element={<ExamManagement />} />
      )}
      <Route path="view" element={<StudentExamView />} />
      <Route path="/" element={
        user.role === 'administrator' 
          ? <Navigate to="/exams/manage" /> 
          : <Navigate to="/exams/view" />
      } />
    </Routes>
  );
};

export default ExamRoutes;