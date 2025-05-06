// frontend/src/components/StudentExamsWidget.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExams } from '../services/examService';
import { format } from 'date-fns';

const StudentExamsWidget = ({ className }) => {
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get student's class from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentClass = user?.student?.class_name || '';

  useEffect(() => {
    const fetchUpcomingExams = async () => {
      try {
        setLoading(true);
        
        // Get today's date
        const today = new Date();
        const formattedDate = format(today, 'yyyy-MM-dd');
        
        // Get exams for the student's class that are scheduled for today or later
        const filters = {
          class: studentClass,
          start_date: formattedDate
        };
        
        const { data } = await getExams(filters);
        
        // Sort by date and limit to 5 most recent
        const sortedExams = data.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)).slice(0, 5);
        
        setUpcomingExams(sortedExams);
        setLoading(false);
      } catch (err) {
        setError('Failed to load upcoming exams');
        setLoading(false);
        console.error(err);
      }
    };

    if (studentClass) {
      fetchUpcomingExams();
    } else {
      setLoading(false);
    }
  }, [studentClass]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Exams</h3>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Exams</h3>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Exams</h3>
        <Link to="/exams" className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>

      {upcomingExams.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming exams scheduled.</p>
      ) : (
        <div className="space-y-3">
          {upcomingExams.map((exam) => (
            <div key={exam.id} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">{exam.subject.name}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(exam.exam_date), 'MMM d')}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-700">{exam.title}</div>
              <div className="mt-1 text-xs text-gray-500">
                {format(new Date(`2021-01-01T${exam.start_time}`), 'h:mm a')} - 
                {format(new Date(`2021-01-01T${exam.end_time}`), ' h:mm a')} | 
                Room: {exam.room || 'TBA'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExamsWidget;