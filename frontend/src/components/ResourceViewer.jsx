import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResourceViewer() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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

  // Specialization options
  const specializations = [
    { value: '', label: 'All Specializations' },
    { value: 'all', label: 'General (All Specializations)' },
    { value: 'se', label: 'SE (Sciences Expérimentales)' }, 
    { value: 'sm', label: 'SM (Sciences Mathématiques)' },
    { value: 'svt', label: 'SVT (Sciences de la Vie et de la Terre)' },
    { value: 'sh', label: 'SH (Sciences Humaines)' },
    { value: 'al', label: 'AL (Arts et Lettres)' }
  ];

  // Fetch resources when component mounts
  useEffect(() => {
    fetchResources();
  }, []);

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
      (filters.yearLevel === '' || resource.yearLevel === filters.yearLevel) &&
      (filters.specialization === '' || resource.specialization === filters.specialization)
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
    const specialization = specializations.find(s => s.value === value);
    return specialization ? specialization.label : value;
  };

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
              {specializations.map(option => (
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
                    <a 
                      href={resource.fileUrl} 
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