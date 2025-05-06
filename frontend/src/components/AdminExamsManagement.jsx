// frontend/src/components/AdminExamsManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  getExams, 
  createExam, 
  updateExam, 
  deleteExam 
} from '../services/examService';
import { format } from 'date-fns';
import axios from 'axios';

const AdminExamsManagement = () => {
  const [exams, setExams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [filterClass, setFilterClass] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exam_date: '',
    start_time: '',
    end_time: '',
    teacher_id: '',
    subject_id: '',
    class_name: '',
    room: '',
    status: 'scheduled'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch exams
        const { data: examsData } = await getExams();
        setExams(examsData);
        
        // Fetch teachers
        const teachersResponse = await axios.get('/api/teachers');
        setTeachers(teachersResponse.data);
        
        // Fetch subjects
        const subjectsResponse = await axios.get('/api/subjects');
        setSubjects(subjectsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingExam) {
        await updateExam(editingExam.id, formData);
      } else {
        await createExam(formData);
      }
      
      // Refresh exam list
      const { data } = await getExams();
      setExams(data);
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Failed to save exam. Please check your inputs and try again.');
      console.error(err);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      exam_date: exam.exam_date,
      start_time: exam.start_time,
      end_time: exam.end_time,
      teacher_id: exam.teacher_id,
      subject_id: exam.subject_id,
      class_name: exam.class_name,
      room: exam.room || '',
      status: exam.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(id);
        // Refresh exam list
        const { data } = await getExams();
        setExams(data);
      } catch (err) {
        setError('Failed to delete exam. Please try again later.');
        console.error(err);
      }
    }
  };

  const openModal = () => {
    resetForm();
    setEditingExam(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      exam_date: '',
      start_time: '',
      end_time: '',
      teacher_id: '',
      subject_id: '',
      class_name: '',
      room: '',
      status: 'scheduled'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading exam data...</p>
      </div>
    );
  }

  // Get unique class names
  const uniqueClasses = [...new Set(exams.map(exam => exam.class_name))];

  // Apply class filter if selected
  const filteredExams = filterClass 
    ? exams.filter(exam => exam.class_name === filterClass)
    : exams;

  // Group exams by date
  const examsByDate = filteredExams.reduce((acc, exam) => {
    const date = exam.exam_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(examsByDate).sort();

  // Function to filter exams by class
  const filterExams = (e) => {
    setFilterClass(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Exam Management</h2>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="w-full md:w-48">
            <select
              value={filterClass}
              onChange={filterExams}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Add New Exam
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {filteredExams.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No exams found</h3>
          <p className="mt-1 text-gray-500">
            Get started by creating your first exam.
          </p>
        </div>
      ) : (
        <div>
          {sortedDates.map((date) => (
            <div key={date} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gray-100 p-3 rounded-md">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
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
                        Class
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                        Room
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                        Actions
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
                          {exam.class_name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900 border-b">
                          {exam.room || 'TBA'}
                        </td>
                        <td className="py-4 px-4 text-sm border-b">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${exam.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            exam.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}
                          >
                            {exam.status === 'scheduled' ? 'Scheduled' :
                            exam.status === 'in_progress' ? 'In Progress' :
                            exam.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900 border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(exam)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(exam.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Exam Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingExam ? 'Edit Exam' : 'Add New Exam'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Exam Date */}
                <div>
                  <label htmlFor="exam_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Date*
                  </label>
                  <input
                    type="date"
                    name="exam_date"
                    id="exam_date"
                    value={formData.exam_date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Class */}
                <div>
                  <label htmlFor="class_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Class*
                  </label>
                  <input
                    type="text"
                    name="class_name"
                    id="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 10A, 11B"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time*
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    id="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time*
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    id="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Teacher */}
                <div>
                  <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher*
                  </label>
                  <select
                    name="teacher_id"
                    id="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.user?.name || `Teacher ID: ${teacher.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject*
                  </label>
                  <select
                    name="subject_id"
                    id="subject_id"
                    value={formData.subject_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    id="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="e.g., A101, Science Lab"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  {editingExam ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExamsManagement;