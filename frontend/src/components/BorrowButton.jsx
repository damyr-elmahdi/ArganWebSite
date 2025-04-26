import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

export default function BorrowButton({ bookId, isAvailable, onRequestSent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleBorrowRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await axios.post('/api/library/borrowing-requests', {
        library_item_id: bookId
      });
      
      // Show success message or update UI
      if (onRequestSent) {
        onRequestSent();
      }
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to request book');
      console.error('Error requesting book:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleBorrowRequest}
        disabled={!isAvailable || isLoading}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
          isAvailable 
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
        ) : (
          <BookOpen className="w-4 h-4 mr-2" />
        )}
        {isAvailable ? 'Borrow Book' : 'Not Available'}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}