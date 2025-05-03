import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import schoolLogo from '../assets/argan.png';

const StudentRegistrationForm = () => {
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
    { value: "TC-S", label: "TC - Sciences" },
    { value: "TC-LSH", label: "TC - Lettres et Sciences Humaines" },
    { value: "1BAC-SE", label: "1BAC - Sciences Expérimentales" },
    { value: "1BAC-LSH", label: "1BAC - Lettres et Sciences Humaines" },
    { value: "2BAC-PC", label: "2BAC - PC (Physique-Chimie)" },
    { value: "2BAC-SVT", label: "2BAC - SVT (Sciences de la Vie et de la Terre)" },
    { value: "2BAC-SH", label: "2BAC - Sciences Humaines" },
    { value: "2BAC-L", label: "2BAC - Lettres" },
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
      errors.studentName = "Le nom de l'étudiant est requis";
    }
    
    if (!formData.academicLevel) {
      errors.academicLevel = "Le niveau académique est requis";
    }
    
    if (!formData.parentName.trim()) {
      errors.parentName = "Le nom du parent est requis";
    }
    
    if (!formData.parentProfession.trim()) {
      errors.parentProfession = "La profession du parent est requise";
    }
    
    if (!formData.fatherPhone.trim()) {
      errors.fatherPhone = "Le téléphone du père est requis";
    } else if (!/^\d{8,15}$/.test(formData.fatherPhone.replace(/\D/g, ''))) {
      errors.fatherPhone = "Numéro de téléphone invalide";
    }
    
    if (!formData.motherPhone.trim()) {
      errors.motherPhone = "Le téléphone de la mère est requis";
    } else if (!/^\d{8,15}$/.test(formData.motherPhone.replace(/\D/g, ''))) {
      errors.motherPhone = "Numéro de téléphone invalide";
    }
    
    if (formData.studentPhone && !/^\d{8,15}$/.test(formData.studentPhone.replace(/\D/g, ''))) {
      errors.studentPhone = "Numéro de téléphone invalide";
    }
    
    if (!formData.address.trim()) {
      errors.address = "L'adresse est requise";
    }
    
    if (formData.civilStatus === 'orphan' && !formData.deathDate) {
      errors.deathDate = "La date de décès est requise pour les orphelins";
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
        'Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.'
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
      setError('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <img src={schoolLogo} alt="Logo de l'école" className="h-20 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Formulaire d'Inscription</h1>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Informations de l'étudiant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet de l'étudiant: <span className="text-red-500">*</span>
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
                  Niveau académique: <span className="text-red-500">*</span>
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.academicLevel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Sélectionnez un niveau</option>
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
                  École précédente:
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
                  Numéro de téléphone de l'étudiant:
                </label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.studentPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Ex: 06XXXXXXXX"
                />
                {validationErrors.studentPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.studentPhone}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">Informations du parent/tuteur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet du père ou du tuteur: <span className="text-red-500">*</span>
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
                  Profession du père ou du tuteur: <span className="text-red-500">*</span>
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
                  Numéro de téléphone du père: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.fatherPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Ex: 06XXXXXXXX"
                />
                {validationErrors.fatherPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.fatherPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone de la mère: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${validationErrors.motherPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Ex: 06XXXXXXXX"
                />
                {validationErrors.motherPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.motherPhone}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">Adresse et situation familiale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de résidence: <span className="text-red-500">*</span>
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
                  État civil: <span className="text-red-500">*</span>
                </label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="together">Parents ensemble</option>
                  <option value="divorced">Parents divorcés</option>
                  <option value="orphan">Orphelin</option>
                </select>
              </div>

              {formData.civilStatus === 'orphan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de décès du père: <span className="text-red-500">*</span>
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
                Notes additionnelles:
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Informations supplémentaires que vous souhaitez partager"
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
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Traitement...' : 'Soumettre'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Inscription réussie!</p>
              <p>Votre formulaire d'inscription a été soumis avec succès.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Options de téléchargement:</h3>
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
                  <span className="ml-2">Version standard</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="pdfOption" 
                    value="mpdf" 
                    checked={pdfOption === 'mpdf'}
                    onChange={() => setPdfOption('mpdf')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Version améliorée</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Génération...' : 'Télécharger PDF'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationForm;