import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OutstandingStudentsSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMark, setNewMark] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data and outstanding students on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user details
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const userResponse = await axios.get('/api/user');
          setUser(userResponse.data);
        }
        
        // Get outstanding students data
        const response = await axios.get('/api/outstanding-students');
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load outstanding students. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user is an administrator
  const isAdmin = user?.role === 'administrator';

  // Handle updating an existing student's mark
  const handleUpdateMark = async (studentId) => {
    if (!newMark[studentId] || newMark[studentId] === '') return;
    
    try {
      const response = await axios.put(`/api/outstanding-students/${studentId}`, {
        mark: newMark[studentId]
      });
      
      // Update students list with the updated mark
      setStudents(students.map(student => 
        student.id === studentId ? { ...student, mark: newMark[studentId] } : student
      ));
      
      // Reset editing state
      setEditingStudent(null);
      setNewMark(prev => ({...prev, [studentId]: ''}));
    } catch (err) {
      console.error('Error updating mark:', err);
      alert('Failed to update student mark. Please try again.');
    }
  };

  // Handle adding a new mark for a student who doesn't have one yet
  const handleAddMark = async (studentId) => {
    if (!newMark[studentId] || newMark[studentId] === '') return;
    
    try {
      const response = await axios.post('/api/outstanding-students', {
        student_id: studentId,
        mark: newMark[studentId]
      });
      
      // Update the students list with the newly added mark
      setStudents(students.map(student => 
        student.id === studentId ? { ...student, mark: newMark[studentId] } : student
      ));
      
      // Reset the input field for this student
      setNewMark(prev => ({...prev, [studentId]: ''}));
    } catch (err) {
      console.error('Error adding mark:', err);
      alert('Failed to add student mark. Please try again.');
    }
  };

  // Handle input change for mark field
  const handleMarkChange = (studentId, value) => {
    setNewMark(prev => ({...prev, [studentId]: value}));
  };

  // Toggle editing mode for a student
  const toggleEditMode = (studentId) => {
    if (editingStudent === studentId) {
      setEditingStudent(null);
    } else {
      setEditingStudent(studentId);
      // Pre-fill the input with current mark if it exists
      const student = students.find(s => s.id === studentId);
      if (student && student.mark) {
        setNewMark(prev => ({...prev, [studentId]: student.mark}));
      }
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Outstanding Students</h2>
            <p className="mt-2">Loading outstanding students...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Outstanding Students</h2>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Outstanding Students</h2>
          <p className="mt-2 text-lg text-gray-600">
            Recognizing excellence in our student community
          </p>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No outstanding students to display at this time.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                    </div>
                    {student.mark && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {student.mark}
                      </span>
                    )}
                  </div>
                  
                  {/* Admin controls for adding/editing marks */}
                  {isAdmin && (
                    <div className="mt-4">
                      {editingStudent === student.id ? (
                        <div className="flex mt-2">
                          <input
                            type="text"
                            className="flex-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={newMark[student.id] || ''}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            placeholder="Enter mark"
                          />
                          <button
                            onClick={() => handleUpdateMark(student.id)}
                            className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => toggleEditMode(student.id)}
                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleEditMode(student.id)}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#18bebc] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          {student.mark ? 'Edit Mark' : 'Add Mark'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}