import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResourceViewer() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    yearLevel: '',
    specialization: '',
  });

  // Subject options
  const subjects = [
    { value: '', label: 'All Subjects' },
    { value: 'SVT', label: 'SVT' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics & chemistry', label: 'Physics & chemistry' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'History and Geography', label: 'History and Geography' },
    { value: 'French', label: 'French' }
  ];

  // Year level options
  const yearLevels = [
    { value: '', label: 'All Years' },
    { value: 'all', label: 'General (All Years)' },
    { value: 'tc', label: 'TC (Tronc Commun)' },
    { value: '1bac', label: '1BAC (First Year)' },
    { value: '2bac', label: '2BAC (Second Year)' }
  ];

  // Base specialization options
  const allSpecializations = [
    { value: '', label: 'All Specializations', yearLevels: ['', 'all', 'tc', '1bac', '2bac'] },
    { value: 'all', label: 'General (All Specializations)', yearLevels: ['', 'all', 'tc', '1bac', '2bac'] },
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
    if (!filters.yearLevel) {
      return allSpecializations.filter(spec => spec.yearLevels.includes(''));
    }
    return allSpecializations.filter(spec => spec.yearLevels.includes(filters.yearLevel));
  };

  // Fetch resources when component mounts
  useEffect(() => {
    fetchResources();
  }, []);

  // Reset specialization when year level changes
  useEffect(() => {
    // Check if current specialization is valid for selected year level
    const validSpecializations = getFilteredSpecializations().map(spec => spec.value);
    if (!validSpecializations.includes(filters.specialization)) {
      setFilters(prev => ({ ...prev, specialization: '' }));
    }
  }, [filters.yearLevel]);

  // Fetch list of resources
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/resources');
      setResources(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Apply filters to resources
  const filteredResources = resources.filter(resource => {
    return (
      (filters.subject === '' || resource.subject === filters.subject) &&
      (filters.yearLevel === '' || resource.yearLevel === filters.yearLevel || resource.yearLevel === 'all') &&
      (filters.specialization === '' || resource.specialization === filters.specialization || resource.specialization === 'all')
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // View resource in PDF viewer
  const viewResource = (resource) => {
    setSelectedResource(resource);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Close PDF viewer
  const closeViewer = () => {
    setSelectedResource(null);
    setIsFullScreen(false);
  };

  // If a PDF is being viewed in fullscreen, only show the PDF viewer
  if (selectedResource && isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
          <h3 className="text-lg font-medium truncate">{selectedResource.title}</h3>
          <div className="flex items-center space-x-4">
            <a 
              href={`/api/resources/${selectedResource.id}/download`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-orange-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button 
              onClick={toggleFullScreen}
              className="text-white hover:text-green-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
              </svg>
              Exit Full Screen
            </button>
            <button 
              onClick={closeViewer}
              className="text-white hover:text-red-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe 
            src={`/api/resources/${selectedResource.id}/view`}
            className="w-full h-full"
            title={selectedResource.title}
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Browse Educational Resources</h2>
      
      {/* Filters */}
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Filter Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {subjects.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Year Level
            </label>
            <select
              id="yearLevel"
              name="yearLevel"
              value={filters.yearLevel}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {yearLevels.map(option => (
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
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {getFilteredSpecializations().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* PDF Viewer Modal (non-fullscreen mode) */}
      {selectedResource && !isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-2">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b p-3">
              <h3 className="text-lg font-medium truncate">{selectedResource.title}</h3>
              <div className="flex items-center space-x-4">
                <a 
                  href={`/api/resources/${selectedResource.id}/download`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <button 
                  onClick={toggleFullScreen}
                  className="text-gray-600 hover:text-green-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
                  Full Screen
                </button>
                <button 
                  onClick={closeViewer}
                  className="text-gray-600 hover:text-red-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe 
                src={`/api/resources/${selectedResource.id}/view`}
                className="w-full h-full"
                title={selectedResource.title}
              ></iframe>
            </div>
          </div>
        </div>
      )}
      
      {/* Resources list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getYearLevelLabel(resource.yearLevel)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getSpecializationLabel(resource.specialization)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(resource.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => viewResource(resource)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View
                    </button>
                    <a 
                      href={`/api/resources/${resource.id}/download`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No resources found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
}