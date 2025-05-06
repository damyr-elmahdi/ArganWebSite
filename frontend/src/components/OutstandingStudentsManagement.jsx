import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function OutstandingStudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form states
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    grade: '',
    mark: '',
    achievement: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Grade options for Moroccan system
  const gradeOptions = [
    { value: "TC-S", label: "TC - Sciences" },
    { value: "TC-LSH", label: "TC - Lettres et Sciences Humaines" },
    { value: "1BAC-SE", label: "1BAC - Sciences Expérimentales" },
    { value: "1BAC-LSH", label: "1BAC - Lettres et Sciences Humaines" },
    { value: "2BAC-PC", label: "2BAC - PC (Physique-Chimie)" },
    { value: "2BAC-SVT", label: "2BAC - SVT (Sciences de la Vie et de la Terre)" },
    { value: "2BAC-SH", label: "2BAC - Sciences Humaines" },
    { value: "2BAC-L", label: "2BAC - Lettres" },
  ];

  // Fetch students when component mounts
  useEffect(() => {
    fetchOutstandingStudents();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      name: '',
      grade: '',
      mark: '',
      achievement: ''
    });
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormMode('add');
    setSelectedStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add photo to form data if exists
      if (photo) {
        submitData.append('photo', photo);
      }
      
      if (formMode === 'add') {
        await axios.post('/api/outstanding-students', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Student added successfully!');
      } else {
        await axios.post(`/api/outstanding-students/${selectedStudent.id}?_method=PUT`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Student updated successfully!');
      }
      
      fetchOutstandingStudents();
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving outstanding student:', err);
      setError('Failed to save student. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleEdit = (student) => {
    setFormMode('edit');
    setSelectedStudent(student);
    setFormData({
      student_id: student.student_id || '',
      name: student.name,
      grade: student.grade,
      mark: student.mark,
      achievement: student.achievement || ''
    });
    
    // Show current photo if available
    if (student.photo_path) {
      setPhotoPreview(`/${student.photo_path}`);
    } else {
      setPhotoPreview(null);
    }
    
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/outstanding-students/${id}`);
      setSuccess('Student removed successfully!');
      fetchOutstandingStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting outstanding student:', err);
      setError('Failed to remove student. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Outstanding Students Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Add, edit, or remove students from the Outstanding Students showcase.
        </p>
      </div>

      {/* Success or Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Form for adding/editing outstanding students */}
      <div className="border-t border-gray-200 p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          {formMode === 'add' ? 'Add New Outstanding Student' : 'Edit Student'}
        </h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                name="student_id"
                id="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                className="mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter student ID"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter student name"
              />
            </div>
            
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Grade/Class
              </label>
              <select
                name="grade"
                id="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select a grade</option>
                {gradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="mark" className="block text-sm font-medium text-gray-700">
                Mark (/20)
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                min="0"
                max="20"
                step="0.25"
                value={formData.mark}
                onChange={handleInputChange}
                required
                className="mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter mark (out of 20)"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="achievement" className="block text-sm font-medium text-gray-700">
                Achievement (Optional)
              </label>
              <input
                type="text"
                name="achievement"
                id="achievement"
                value={formData.achievement}
                onChange={handleInputChange}
                className="mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter specific achievement or leave blank"
              />
            </div>
            
            {/* Photo Upload Field */}
            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Student Photo (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-6">
                {photoPreview && (
                  <div className="flex-shrink-0">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="h-24 w-24 object-cover rounded-md" 
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#18bebc] file:text-white
                    hover:file:bg-teal-700"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                JPG, JPEG or PNG. Max 2MB.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {formMode === 'add' ? 'Add Student' : 'Update Student'}
            </button>
            
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of current outstanding students */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Current Outstanding Students</h4>
        
        {loading ? (
          <p className="text-gray-500">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">No outstanding students added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade/Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mark
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.photo_path ? (
                        <img 
                          src={`/${student.photo_path}`} 
                          alt={student.name} 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No photo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.student_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.mark}/20
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.achievement || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-[#18bebc] hover:text-teal-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}