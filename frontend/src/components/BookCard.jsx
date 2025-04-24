import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function BookCard({ book, isLibrarian, isStudent, onBookDeleted }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    quantity: book.quantity,
    inventory_number: book.inventory_number,
    description: book.description || ''
  });
  
  const handleBorrowRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/library/borrow', {
        library_item_id: book.id
      });
      
      setSuccess('Book request submitted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`/api/library/${book.id}`);
      onBookDeleted();
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting book');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await axios.put(`/api/library/${book.id}`, formData);
      
      setSuccess('Book updated successfully!');
      setTimeout(() => {
        setSuccess(null);
        setIsEditing(false);
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating book');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white">
      {book.image_path ? (
        <img 
          src={`/storage/${book.image_path}`} 
          alt={book.title} 
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      
      <div className="p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                min="1"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Inventory Number</label>
              <input
                type="text"
                name="inventory_number"
                value={formData.inventory_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                rows="3"
              />
            </div>
            
            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-3">{success}</div>}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-700">By {book.author}</p>
            <p className="text-gray-500 text-sm">Category: {book.category}</p>
            
            <div className="flex justify-between items-center mt-3">
              <span className={`text-sm ${book.is_available ? 'text-green-600' : 'text-red-600'}`}>
                {book.is_available ? 
                  `Available (${book.available_quantity}/${book.quantity})` : 
                  'Not Available'
                }
              </span>
              <span className="text-xs text-gray-500">#{book.inventory_number}</span>
            </div>
            
            {showDetails && book.description && (
              <div className="mt-3 text-sm text-gray-700">
                <p>{book.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
              
              {isStudent && (
                <button
                  onClick={handleBorrowRequest}
                  disabled={!book.is_available || loading}
                  className={`ml-auto px-3 py-1 text-sm rounded ${
                    book.is_available ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {loading ? 'Processing...' : 'Borrow'}
                </button>
              )}
              
              {isLibrarian && (
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteBook}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            {success && <div className="mt-2 text-green-500 text-sm">{success}</div>}
          </>
        )}
      </div>
    </div>
  );
}