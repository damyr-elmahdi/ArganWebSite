import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamManagement = () => {
  const navigate = useNavigate();

  const navigateToExamPeriods = () => {
    navigate('/admin/exam-periods');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Exam Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Create and manage exam periods, schedules, and related settings.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-md font-medium text-gray-900 mb-2">Exam Periods</h4>
            <p className="text-sm text-gray-500 mb-4">
              Manage examination periods, create new periods, and configure their settings.
            </p>
            <button
              onClick={navigateToExamPeriods}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
            >
              Manage Exam Periods
            </button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-md font-medium text-gray-900 mb-2">Student Exam Schedule</h4>
            <p className="text-sm text-gray-500 mb-4">
              View the consolidated exam schedule for students across all classes.
            </p>
            <button
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 cursor-not-allowed"
              disabled
            >
              View Student Schedules (Coming Soon)
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Help & Information</h4>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Quick Guide:</strong> To manage exams, first create an exam period, then set up schedules for each class within that period. Students and teachers will be able to view their respective schedules once published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;