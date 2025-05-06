// frontend/src/pages/Exams.jsx
import React, { useState, useEffect } from 'react';
import { getExams, getClasses } from '../services/examService';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: classesData } = await getClasses();
        setClasses(classesData);
        
        // Set default class if available
        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(classesData[0].class_name);
        }
        
        const filters = {};
        if (selectedClass) filters.class = selectedClass;
        
        // Add month filter if selected
        if (selectedMonth) {
          const currentYear = new Date().getFullYear();
          filters.start_date = `${currentYear}-${selectedMonth}-01`;
          // Calculate last day of month
          const lastDay = new Date(currentYear, parseInt(selectedMonth), 0).getDate();
          filters.end_date = `${currentYear}-${selectedMonth}-${lastDay}`;
        }
        
        const { data: examsData } = await getExams(filters);
        setExams(examsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam data. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [selectedClass, selectedMonth]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading exam schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Group exams by date
  const examsByDate = exams.reduce((acc, exam) => {
    const date = exam.exam_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(examsByDate).sort();

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Schedule</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map((classItem) => (
                <option key={classItem.class_name} value={classItem.class_name}>
                  {classItem.class_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Month
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No exams found</h3>
            <p className="mt-1 text-gray-500">
              There are no exams scheduled for the selected filters.
            </p>
          </div>
        ) : (
          <div>
            {sortedDates.map((date) => (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 bg-gray-100 p-3 rounded-md">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                          Subject
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                          Time
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                          Teacher
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                          Room
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                          Class
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {examsByDate[date].map((exam) => (
                        <tr key={exam.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900 border-b">
                            <div className="font-medium">{exam.subject.name}</div>
                            <div className="text-gray-500 text-xs mt-1">{exam.title}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 border-b">
                            {format(new Date(`2021-01-01T${exam.start_time}`), 'h:mm a')} - 
                            {format(new Date(`2021-01-01T${exam.end_time}`), ' h:mm a')}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 border-b">
                            {exam.teacher.user?.name || 'Unknown Teacher'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 border-b">
                            {exam.room || 'TBA'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 border-b">
                            {exam.class_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;