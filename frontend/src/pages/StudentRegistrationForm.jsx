import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import schoolLogo from '../assets/school-logo.png'; // Assurez-vous d'avoir un logo dans vos assets

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
    signature: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const signatureRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataURL, setSignatureDataURL] = useState('');

  // Fonction pour initialiser le canvas de signature
  const initializeCanvas = () => {
    const canvas = signatureRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Gestion du début du dessin
  const startDrawing = (e) => {
    const canvas = signatureRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  // Gestion du dessin en cours
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = signatureRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Gestion de la fin du dessin
  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = signatureRef.current;
      setSignatureDataURL(canvas.toDataURL('image/png'));
    }
  };

  // Réinitialiser le canvas
  const clearSignature = () => {
    const canvas = signatureRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSignatureDataURL('');
  };

  // Initialiser le canvas au chargement du composant
  React.useEffect(() => {
    if (signatureRef.current) {
      initializeCanvas();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Inclure la signature dans les données du formulaire
      const dataToSubmit = {
        ...formData,
        signature: signatureDataURL,
        submissionDate: new Date().toISOString()
      };

      const response = await axios.post('/api/registrations', dataToSubmit);
      setRegistrationId(response.data.id);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la soumission du formulaire.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/registrations/${registrationId}/download-packet`, {
        responseType: 'blob'
      });
      
      // Créer un objet URL pour le blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Créer un élément <a> temporaire pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inscription_${formData.studentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      setError('Erreur lors du téléchargement du PDF');
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet de l'étudiant:
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau académique:
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionnez un niveau</option>
                  <option value="1ère année">1ère année</option>
                  <option value="2ème année">2ème année</option>
                  <option value="3ème année">3ème année</option>
                  <option value="4ème année">4ème année</option>
                  <option value="5ème année">5ème année</option>
                  <option value="6ème année">6ème année</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet du père ou du tuteur:
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession du père ou du tuteur:
                </label>
                <input
                  type="text"
                  name="parentProfession"
                  value={formData.parentProfession}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone du père:
                </label>
                <input
                  type="tel"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone de la mère:
                </label>
                <input
                  type="tel"
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de résidence:
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  État civil:
                </label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="together">Parents ensemble</option>
                  <option value="divorced">Parents divorcés</option>
                  <option value="orphan">Orphelin</option>
                </select>
              </div>

              {formData.civilStatus === 'orphan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de décès du père:
                  </label>
                  <input
                    type="date"
                    name="deathDate"
                    value={formData.deathDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature du père ou du tuteur:
              </label>
              <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                <canvas
                  ref={signatureRef}
                  width="500"
                  height="150"
                  className="border border-gray-400 bg-white w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                ></canvas>
                <button 
                  type="button" 
                  onClick={clearSignature}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Effacer
                </button>
              </div>
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
            
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
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