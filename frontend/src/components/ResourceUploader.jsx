import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ResourceUploader() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [yearLevel, setYearLevel] = useState('all');
  const [specialization, setSpecialization] = useState('all');
  const [file, setFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewResource, setPreviewResource] = useState(null);
  const fileInputRef = useRef(null);

  // Subject options
  const subjects = [
    { value: 'SVT', label: t('subjects.svt') },
    { value: 'Mathematics', label: t('subjects.mathematics') },
    { value: 'Physics & chemistry', label: t('subjects.physics_chemistry') },
    { value: 'Arabic', label: t('subjects.arabic') },
    { value: 'History and Geography', label: t('subjects.history_geography') },
    { value: 'French', label: t('subjects.french') }
  ];

  // Year level options
  const yearLevels = [
    { value: 'all', label: t('yearLevels.all') },
    { value: 'tc', label: t('yearLevels.tc') },
    { value: '1bac', label: t('yearLevels.1bac') },
    { value: '2bac', label: t('yearLevels.2bac') }
  ];

  // Base specialization options
  const allSpecializations = [
    { value: 'all', label: t('specializations.all'), yearLevels: ['all', 'tc', '1bac', '2bac'] },
    { value: 'science', label: t('specializations.science'), yearLevels: ['tc'] },
    { value: 'letter', label: t('specializations.letter'), yearLevels: ['tc', '1bac', '2bac'] },
    { value: 'se', label: t('specializations.se'), yearLevels: ['1bac'] },
    { value: 'sm', label: t('specializations.sm'), yearLevels: ['1bac'] },
    { value: 'sh', label: t('specializations.sh'), yearLevels: ['1bac', '2bac'] },
    { value: 'spc', label: t('specializations.spc'), yearLevels: ['2bac'] },
    { value: 'svt', label: t('specializations.svt'), yearLevels: ['1bac', '2bac'] },
    { value: 'smb1', label: t('specializations.smb1'), yearLevels: ['2bac'] },
    { value: 'smb2', label: t('specializations.smb2'), yearLevels: ['2bac'] },
    { value: 'al', label: t('specializations.al'), yearLevels: ['1bac', '2bac'] }
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

  // Clean up object URL when component unmounts or when file changes
  useEffect(() => {
    return () => {
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
      }
    };
  }, [pdfPreview]);

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
        content: t('resourceUploader.errors.fetchFailed')
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
      // Create a preview URL for the PDF
      const previewUrl = URL.createObjectURL(selectedFile);
      setPdfPreview(previewUrl);
      setMessage({ type: '', content: '' });
    } else {
      setFile(null);
      setPdfPreview(null);
      setMessage({ type: 'error', content: t('resourceUploader.errors.invalidPdf') });
    }
  };

  // Clear the form
  const clearForm = () => {
    setTitle('');
    setSubject('');
    setYearLevel('all');
    setSpecialization('all');
    setFile(null);
    setPdfPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !subject || !file) {
      setMessage({ type: 'error', content: t('resourceUploader.errors.missingFields') });
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
      clearForm();
      setMessage({ type: 'success', content: t('resourceUploader.success.uploadComplete') });
      
      // Refresh resources list
      fetchResources();
    } catch (error) {
      console.error('Error uploading resource:', error);
      
      let errorMessage = t('resourceUploader.errors.uploadFailed');
      
      // Extract detailed error message if available
      if (error.response) {
        console.log('Error response:', error.response.data);
        
        // If there's a specific error message from the backend
        if (error.response.data && error.response.data.error) {
          errorMessage = `${t('resourceUploader.errors.errorPrefix')}: ${error.response.data.error}`;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `${t('resourceUploader.errors.errorPrefix')}: ${error.response.data.message}`;
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
    if (window.confirm(t('resourceUploader.confirmations.deleteResource'))) {
      try {
        await axios.delete(`/api/resources/${resourceId}`);
        setMessage({ type: 'success', content: t('resourceUploader.success.deleteComplete') });
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setMessage({ type: 'error', content: t('resourceUploader.errors.deleteFailed') });
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

  // Open PDF preview modal
  const openPdfPreview = (resource) => {
    setPreviewResource(resource);
  };

  // Close PDF preview modal
  const closePdfPreview = () => {
    setPreviewResource(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{t('resourceUploader.title')}</h2>
      
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
              {t('resourceUploader.form.title')} *
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
              {t('resourceUploader.form.subject')} *
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">{t('resourceUploader.form.selectSubject')}</option>
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
              {t('resourceUploader.form.yearLevel')}
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
              {t('resourceUploader.form.specialization')}
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
            {t('resourceUploader.form.pdfFile')} *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{t('resourceUploader.form.pdfOnly')}</p>
        </div>
        
        {/* PDF Preview */}
        {pdfPreview && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('resourceUploader.preview.title')}</h4>
            <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '400px' }}>
              <iframe 
                src={pdfPreview} 
                className="w-full h-full" 
                title={t('resourceUploader.preview.iframeTitle')} 
              />
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('resourceUploader.uploading')}: {uploadProgress}%</p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full p-2 text-white rounded-md ${
              isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isUploading ? t('resourceUploader.buttons.uploading') : t('resourceUploader.buttons.upload')}
          </button>
          
          <button
            type="button"
            onClick={clearForm}
            className="w-1/4 p-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            {t('resourceUploader.buttons.clear')}
          </button>
        </div>
      </form>
      
      {/* Resources list */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('resourceUploader.resourcesList.title')}</h3>
        
        {isLoading ? (
          <p className="text-gray-500">{t('resourceUploader.resourcesList.loading')}</p>
        ) : resources.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceUploader.resourcesList.columns.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceUploader.resourcesList.columns.subject')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceUploader.resourcesList.columns.yearLevel')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceUploader.resourcesList.columns.specialization')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceUploader.resourcesList.columns.actions')}</th>
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
                        onClick={() => openPdfPreview(resource)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        {t('resourceUploader.buttons.view')}
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('resourceUploader.buttons.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">{t('resourceUploader.resourcesList.empty')}</p>
        )}
      </div>
      
      {/* PDF Viewer Modal */}
      {previewResource && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">{previewResource.title}</h3>
              <button 
                onClick={closePdfPreview}
                className="text-gray-500 hover:text-gray-700"
                aria-label={t('resourceUploader.preview.close')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe 
                src={previewResource.viewUrl}
                className="w-full h-full"
                title={previewResource.title}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}