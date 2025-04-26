import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requested');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    requested: 0,
    returned: 0
  });

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/library/book-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/library/book-requests', {
        params: { status: activeTab }
      });
      setBooks(response.data.data);
    } catch (error) {
      setError('Failed to load book requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReturned = async (bookId, studentId) => {
    try {
      await axios.post(`/api/library/${bookId}/return`, { student_id: studentId });
      
      // Show success message
      alert('Book marked as returned successfully. Inventory updated.');
      
      // Refresh data
      fetchBooks();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark book as returned');
    }
  };
  

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!user || (user.role !== 'librarian' && user.role !== 'administrator')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access the Librarian Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Book Management Dashboard</h1>
        <button 
          onClick={() => {fetchBooks(); fetchStats();}}
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-md">
              <BookOpen className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Books Requested</p>
              <p className="text-xl font-semibold">{stats.requested}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-md">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Books Returned</p>
              <p className="text-xl font-semibold">{stats.returned}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('requested')}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === 'requested'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Requested Books
            {stats.requested > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {stats.requested}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('returned')}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === 'returned'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Return History
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {activeTab === 'requested' && <BookOpen className="h-8 w-8 text-gray-400" />}
              {activeTab === 'returned' && <CheckCircle className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab} books</h3>
            <p className="text-gray-500">
              {activeTab === 'requested' && "There are no books requested by students."}
              {activeTab === 'returned' && "No return history to display."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  {activeTab === 'requested' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                  {activeTab === 'returned' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                  )}
                  {activeTab === 'requested' && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{book.student.name}</div>
                          <div className="text-sm text-gray-500">{book.student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                      <div className="text-xs text-gray-400 mt-1">Inventory #: {book.inventory_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(book.request_date)}
                    </td>
                    
                    {activeTab === 'requested' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Waiting for Return
                        </span>
                      </td>
                    )}
                    
                    {activeTab === 'returned' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(book.return_date)}
                      </td>
                    )}
                    
                    {activeTab === 'requested' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleMarkReturned(book.id, book.student.id)}
                          className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded-md transition-colors"
                        >
                          Mark as Returned
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}