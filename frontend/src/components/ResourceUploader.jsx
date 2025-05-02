import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResourceUploader() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [yearLevel, setYearLevel] = useState('all');
  const [specialization, setSpecialization] = useState('all');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subject options
  const subjects = [
    { value: 'SVT', label: 'SVT' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics & chemistry', label: 'Physics & chemistry' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'History and Geography', label: 'History and Geography' },
    { value: 'French', label: 'French' }
  ];

  // Year level options
  const yearLevels = [
    { value: 'all', label: 'All Years' },
    { value: 'tc', label: 'TC (Tronc Commun)' },
    { value: '1bac', label: '1BAC (First Year)' },
    { value: '2bac', label: '2BAC (Second Year)' }
  ];

  // Base specialization options
  const allSpecializations = [
    { value: 'all', label: 'General (All Specializations)', yearLevels: ['all', 'tc', '1bac', '2bac'] },
    { value: 'science', label: 'Science', yearLevels: ['tc'] },
    { value: 'letter', label: 'Letter', yearLevels: ['tc', '1bac', '2bac'] },
    { value: 'se', label: 'SE (Sciences Expérimentales)', yearLevels: ['1bac'] },
    { value: 'sm', label: 'SM (Sciences Mathématiques)', yearLevels: ['1bac'] },
    { value: 'sh', label: 'SH (Sciences Humaines)', yearLevels: ['1bac', '2bac'] },
    { value: 'spc', label: 'SPC (Sciences Physiques et Chimiques)', yearLevels: ['2bac'] },
    { value: 'svt', label: 'SVT (Sciences de la Vie et de la Terre)', yearLevels: ['1bac', '2bac'] },
    { value: 'smb1', label: 'SMB1 (Sciences Mathématiques B1)', yearLevels: ['2bac'] },
    { value: 'smb2', label: 'SMB2 (Sciences Mathématiques B2)', yearLevels: ['2bac'] },
    { value: 'al', label: 'AL (Arabic et Lettres)', yearLevels: ['1bac', '2bac'] }
  ];

  // Filtered specialization options based on selected year level
  const getFilteredSpecializations = () => {
    return allSpecializations.filter(spec => spec.yearLevels.includes(yearLevel));
  };

  // Fetch resources when component mounts
  useEffect(() => {
    fetchResources();
  }, []);

  // Reset specialization when year level changes
  useEffect(() => {
    // Check if current specialization is valid for selected year level
    const validSpecializations = getFilteredSpecializations().map(spec => spec.value);
    if (!validSpecializations.includes(specialization)) {
      setSpecialization('all');
    }
  }, [yearLevel]);

  // Fetch list of resources
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setMessage({
        type: 'error',
        content: 'Failed to load resources. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage({ type: '', content: '' });
    } else {
      setFile(null);
      setMessage({ type: 'error', content: 'Please select a valid PDF file.' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !subject || !file) {
      setMessage({ type: 'error', content: 'Please fill all required fields and select a PDF file.' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', content: '' });
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('yearLevel', yearLevel);
    formData.append('specialization', specialization);
    formData.append('file', file);

    try {
      const response = await axios.post('/api/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      console.log('Upload response:', response.data);

      // Reset form after successful upload
      setTitle('');
      setSubject('');
      setYearLevel('all');
      setSpecialization('all');
      setFile(null);
      setMessage({ type: 'success', content: 'Resource uploaded successfully!' });
      
      // Refresh resources list
      fetchResources();
    } catch (error) {
      console.error('Error uploading resource:', error);
      
      let errorMessage = 'Failed to upload resource. Please try again.';
      
      // Extract detailed error message if available
      if (error.response) {
        console.log('Error response:', error.response.data);
        
        // If there's a specific error message from the backend
        if (error.response.data && error.response.data.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        }
      }
      
      setMessage({ type: 'error', content: errorMessage });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle resource deletion
  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`/api/resources/${resourceId}`);
        setMessage({ type: 'success', content: 'Resource deleted successfully!' });
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setMessage({ type: 'error', content: 'Failed to delete resource. Please try again.' });
      }
    }
  };

  // Get label for year level based on value
  const getYearLevelLabel = (value) => {
    const yearLevel = yearLevels.find(yl => yl.value === value);
    return yearLevel ? yearLevel.label : value;
  };

  // Get label for specialization based on value
  const getSpecializationLabel = (value) => {
    const specialization = allSpecializations.find(s => s.value === value);
    return specialization ? specialization.label : value;
  };

  // View resource in new tab
  const viewResource = (resource) => {
    window.open(`/api/resources/${resource.id}/download`, '_blank');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Educational Resources</h2>
      
      {/* Message display */}
      {message.content && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.content}
        </div>
      )}
      
      {/* Resource upload form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Year Level
            </label>
            <select
              id="yearLevel"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {yearLevels.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {getFilteredSpecializations().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            PDF File *
          </label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted</p>
        </div>
        
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full p-2 text-white rounded-md ${
            isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Resource'}
        </button>
      </form>
      
      {/* Resources list */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Resources</h3>
        
        {isLoading ? (
          <p className="text-gray-500">Loading resources...</p>
        ) : resources.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getYearLevelLabel(resource.yearLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSpecializationLabel(resource.specialization)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => viewResource(resource)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No resources uploaded yet.</p>
        )}
      </div>
    </div>
  );
}