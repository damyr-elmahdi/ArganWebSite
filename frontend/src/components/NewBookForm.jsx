import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function NewBookForm({ onBookCreated }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    quantity: 1,
    inventory_number: '',
    description: '',
    image: null
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'quantity' ? parseInt(value) : value 
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object to send files
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      
      await axios.post('/api/library', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        category: '',
        quantity: 1,
        inventory_number: '',
        description: '',
        image: null
      });
      setPreview(null);
      
      // Notify parent component
      onBookCreated();
      
    } catch (error) {
      setError(error.response?.data?.message || t('library.errors.addBookFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('library.newBook.title')}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.title')} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.author')} *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.category')} *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.quantity')} *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.inventoryNumber')} *
            </label>
            <input
              type="text"
              name="inventory_number"
              value={formData.inventory_number}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.image')}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('library.newBook.fields.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
          
          {preview && (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('library.newBook.imagePreview')}
              </label>
              <img 
                src={preview} 
                alt={t('library.newBook.imagePreviewAlt')} 
                className="h-48 object-contain border rounded"
              />
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-4">{error}</div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? t('library.newBook.addingBook') : t('library.newBook.addBook')}
          </button>
        </div>
      </form>
    </div>
  );
}