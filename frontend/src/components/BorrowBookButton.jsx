import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function BorrowBookButton({ bookId, onBorrowed }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBorrowBook = async () => {
    if (!user) {
      alert('Please log in to borrow books');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Borrowing book:', {bookId, userId: user.id});
      
      const response = await axios.post(`/api/library/${bookId}/borrow`, {
        student_id: user.id
      });
      
      console.log('Borrow response:', response.data);
      setSuccess('Book borrowed successfully!');
      
      if (typeof onBorrowed === 'function') {
        onBorrowed(response.data);
      }
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error borrowing book:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Request setup error: ' + error.message);
      }
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Only show for students
  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="mt-3">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
      
      <button
        onClick={handleBorrowBook}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Requesting...
          </>
        ) : (
          'Borrow this Book'
        )}
      </button>
    </div>
  );
}