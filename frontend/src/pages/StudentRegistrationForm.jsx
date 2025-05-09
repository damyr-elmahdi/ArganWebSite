import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import schoolLogo from '../assets/argan.png';

const StudentRegistrationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    academicLevel: '',
    parentName: '',
    parentProfession: '',
    fatherPhone: '',
    motherPhone: '',
    studentPhone: '',
    address: '',
    civilStatus: 'together', // "together", "divorced", "orphan"
    deathDate: '',
    previousSchool: '',
    additionalNotes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [pdfOption, setPdfOption] = useState('standard'); // 'standard' or 'mpdf'

  const gradeOptions = [
    { value: "TC-S", label: t('academicLevels.tcSciences') },
    { value: "TC-LSH", label: t('academicLevels.tcHumanities') },
    { value: "1BAC-SE", label: t('academicLevels.1bacSciExp') },
    { value: "1BAC-LSH", label: t('academicLevels.1bacHumanities') },
    { value: "2BAC-PC", label: t('academicLevels.2bacPhysicsChem') },
    { value: "2BAC-SVT", label: t('academicLevels.2bacLifeSciences') },
    { value: "2BAC-SH", label: t('academicLevels.2bacHumanities') },
    { value: "2BAC-L", label: t('academicLevels.2bacLiterature') },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.studentName.trim()) {
      errors.studentName = t('validation.studentNameRequired');
    }
    
    if (!formData.academicLevel) {
      errors.academicLevel = t('validation.academicLevelRequired');
    }
    
    if (!formData.parentName.trim()) {
      errors.parentName = t('validation.parentNameRequired');
    }
    
    if (!formData.parentProfession.trim()) {
      errors.parentProfession = t('validation.parentProfessionRequired');
    }
    
    if (!formData.fatherPhone.trim()) {
      errors.fatherPhone = t('validation.fatherPhoneRequired');
    } else if (!/^\d{8,15}$/.test(formData.fatherPhone.replace(/\D/g, ''))) {
      errors.fatherPhone = t('validation.invalidPhone');
    }
    
    if (!formData.motherPhone.trim()) {
      errors.motherPhone = t('validation.motherPhoneRequired');
    } else if (!/^\d{8,15}$/.test(formData.motherPhone.replace(/\D/g, ''))) {
      errors.motherPhone = t('validation.invalidPhone');
    }
    
    if (formData.studentPhone && !/^\d{8,15}$/.test(formData.studentPhone.replace(/\D/g, ''))) {
      errors.studentPhone = t('validation.invalidPhone');
    }
    
    if (!formData.address.trim()) {
      errors.address = t('validation.addressRequired');
    }
    
    if (formData.civilStatus === 'orphan' && !formData.deathDate) {
      errors.deathDate = t('validation.deathDateRequired');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Prepare data for backend
      const dataToSubmit = {
        studentName: formData.studentName,
        academicLevel: formData.academicLevel,
        parentName: formData.parentName,
        parentProfession: formData.parentProfession,
        fatherPhone: formData.fatherPhone,
        motherPhone: formData.motherPhone,
        studentPhone: formData.studentPhone || null,
        address: formData.address,
        civilStatus: formData.civilStatus,
        deathDate: formData.civilStatus === 'orphan' ? formData.deathDate : null,
        previousSchool: formData.previousSchool || null,
        additionalNotes: formData.additionalNotes || null
      };

      const response = await axios.post('/api/registrations', dataToSubmit);
      setRegistrationId(response.data.id);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err.response?.data?.message || 
        t('errors.submissionError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = `/api/registrations/${registrationId}/generate-pdf`;
      
      // Use mpdf if selected
      if (pdfOption === 'mpdf') {
        endpoint = `/api/registrations/${registrationId}/generate-pdf-with-mpdf`;
      }
      
      const response = await axios.get(endpoint, {
        responseType: 'blob'
      });
      
      // Create URL for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create temporary <a> element for download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inscription_${formData.studentName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF download error:', err);
      setError(t('errors.pdfDownloadError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <img src={schoolLogo} alt={t('common.schoolLogo')} className="h-20 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">{t('registration.title')}</h1>
          <p className="text-gray-600">{t('common.date')}: {new Date().toLocaleDateString(t('common.locale'))}</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">{t('registration.studentInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.studentName')}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.studentName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {validationErrors.studentName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.studentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.academicLevel')}: <span className="text-red-500">*</span>
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.academicLevel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">{t('common.selectLevel')}</option>
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.academicLevel && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.academicLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.previousSchool')}:
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.studentPhone')}:
                </label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.studentPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder={t('placeholders.phoneExample')}
                />
                {validationErrors.studentPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.studentPhone}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">{t('registration.parentInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.parentName')}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.parentName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {validationErrors.parentName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.parentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.parentProfession')}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentProfession"
                  value={formData.parentProfession}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.parentProfession ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {validationErrors.parentProfession && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.parentProfession}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.fatherPhone')}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.fatherPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder={t('placeholders.phoneExample')}
                />
                {validationErrors.fatherPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.fatherPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.motherPhone')}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.motherPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder={t('placeholders.phoneExample')}
                />
                {validationErrors.motherPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.motherPhone}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">{t('registration.addressAndFamily')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.address')}: <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  rows="2"
                ></textarea>
                {validationErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registration.civilStatus1')}: <span className="text-red-500">*</span>
                </label>
                <select
                  name="civilStatus1"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="together">{t('civilStatus1.together')}</option>
                  <option value="divorced">{t('civilStatus1.divorced')}</option>
                  <option value="orphan">{t('civilStatus1.orphan')}</option>
                </select>
              </div>

              {formData.civilStatus === 'orphan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('registration.deathDate')}: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deathDate"
                    value={formData.deathDate}
                    onChange={handleChange}
                    className={`w-full p-2 border ${validationErrors.deathDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {validationErrors.deathDate && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.deathDate}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('registration.additionalNotes')}:
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder={t('placeholders.additionalNotes')}
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? t('buttons.processing') : t('buttons.submit')}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">{t('success.registrationSuccess')}</p>
              <p>{t('success.formSubmitted')}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">{t('download.options')}:</h3>
              <div className="flex justify-center gap-4 mb-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="pdfOption" 
                    value="standard"
                    checked={pdfOption === 'standard'} 
                    onChange={() => setPdfOption('standard')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{t('download.standardVersion')}</span>
                </label>
                {/* <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="pdfOption" 
                    value="mpdf" 
                    checked={pdfOption === 'mpdf'}
                    onChange={() => setPdfOption('mpdf')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{t('download.enhancedVersion')}</span>
                </label> */}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? t('buttons.generating') : t('buttons.downloadPDF')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {t('buttons.backToHome')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationForm;