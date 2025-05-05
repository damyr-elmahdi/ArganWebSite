import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OutstandingStudentsSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutstandingStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/outstanding-students');
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching outstanding students:', err);
        setError('Failed to load outstanding students');
        setLoading(false);
      }
    };

    fetchOutstandingStudents();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Outstanding Students</h2>
          <div className="text-center py-8">Loading outstanding students...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Outstanding Students</h2>
          <div className="text-center py-8 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (students.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Outstanding Students</h2>
          <div className="text-center py-8">No outstanding students to display at this time.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Outstanding Students</h2>
        <p className="text-center text-gray-600 mb-8">
          Recognizing our top-performing students for their exceptional academic achievements.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                  <span className="bg-[#18bebc] text-white text-sm font-medium px-3 py-1 rounded-full">
                    {student.mark}%
                  </span>
                </div>
                <p className="text-gray-600">{student.grade}</p>
                <p className="text-gray-500 text-sm mt-2">{student.achievement || 'Outstanding Academic Performance'}</p>
              </div>
              <div className="bg-gradient-to-r from-[#165b9f] to-[#18bebc] h-2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}