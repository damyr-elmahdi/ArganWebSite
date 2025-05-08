import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ContactForm({ schoolEmail }) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = t('contact.errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      errors.email = t('contact.errors.emailRequired');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = t('contact.errors.emailInvalid');
    }
    
    if (!formData.subject.trim()) {
      errors.subject = t('contact.errors.subjectRequired');
    }
    
    if (!formData.message.trim()) {
      errors.message = t('contact.errors.messageRequired');
    } else if (formData.message.length < 10) {
      errors.message = t('contact.errors.messageLength');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send data to Laravel backend API endpoint
      const response = await axios.post('/api/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitError(response.data.message || t('contact.errors.sendFailed'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response && error.response.data.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          serverErrors[key] = error.response.data.errors[key][0];
        });
        setFormErrors(serverErrors);
      } else {
        setSubmitError(t('contact.errors.sendFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setFormErrors({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {submitSuccess ? (
        <div className="text-center py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('contact.success.title')}</h3>
          <p className="text-gray-600 mb-6">{t('contact.success.message')}</p>
          <button 
            onClick={resetForm}
            className="bg-[#18bebc] text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
          >
            {t('contact.success.sendAnother')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">{t('contact.form.name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">{t('contact.form.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-1">{t('contact.form.subject')}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                formErrors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.subject && <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">{t('contact.form.message')}</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                formErrors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
          </div>
          
          {submitError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {submitError}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#18bebc] text-white py-3 rounded-md font-medium hover:bg-teal-700 transition disabled:bg-teal-300"
          >
            {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
          </button>
        </form>
      )}
    </div>
  );
}