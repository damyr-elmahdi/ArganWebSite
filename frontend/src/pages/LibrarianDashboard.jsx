import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    returned: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/library/borrowing-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/library/borrowing-requests', {
        params: { status: activeTab }
      });
      setRequests(response.data.data);
    } catch (error) {
      setError('Failed to load borrowing requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`/api/library/borrowing-requests/${requestId}/approve`);
      fetchRequests();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const notes = prompt('Optional: Enter a reason for rejection');
    
    try {
      await axios.post(`/api/library/borrowing-requests/${requestId}/reject`, { notes });
      fetchRequests();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleReturn = async (requestId) => {
    try {
      await axios.post(`/api/library/borrowing-requests/${requestId}/return`);
      fetchRequests();
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
        <h1 className="text-2xl font-bold text-gray-800">Librarian Dashboard</h1>
        <button 
          onClick={() => {fetchRequests(); fetchStats();}}
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-md">
              <BookOpen className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Pending Requests</p>
              <p className="text-xl font-semibold">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-md">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Currently Borrowed</p>
              <p className="text-xl font-semibold">{stats.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-md">
              <RefreshCw className="h-6 w-6 text-purple-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-700">Returned</p>
              <p className="text-xl font-semibold">{stats.returned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-md">
              <XCircle className="h-6 w-6 text-red-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <p className="text-xl font-semibold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Requests
            {stats.pending > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {stats.pending}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === 'approved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Currently Borrowed
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
          
          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === 'rejected'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected Requests
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
        ) : requests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {activeTab === 'pending' && <BookOpen className="h-8 w-8 text-gray-400" />}
              {activeTab === 'approved' && <CheckCircle className="h-8 w-8 text-gray-400" />}
              {activeTab === 'returned' && <RefreshCw className="h-8 w-8 text-gray-400" />}
              {activeTab === 'rejected' && <XCircle className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab} requests</h3>
            <p className="text-gray-500">
              {activeTab === 'pending' && "There are no pending borrowing requests to review."}
              {activeTab === 'approved' && "No books are currently borrowed."}
              {activeTab === 'returned' && "No borrowing history to display."}
              {activeTab === 'rejected' && "No requests have been rejected."}
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
                  {activeTab === 'approved' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  )}
                  {activeTab === 'returned' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                  )}
                  {activeTab === 'rejected' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejection Reason
                    </th>
                  )}
                  {(activeTab === 'pending' || activeTab === 'approved') && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.student.name}</div>
                          <div className="text-sm text-gray-500">{request.student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.library_item.title}</div>
                      <div className="text-sm text-gray-500">by {request.library_item.author}</div>
                      <div className="text-xs text-gray-400 mt-1">Inventory #: {request.library_item.inventory_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    
                    {activeTab === 'approved' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          new Date(request.due_date) < new Date() 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {formatDate(request.due_date)}
                        </span>
                      </td>
                    )}
                    
                    {activeTab === 'returned' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.return_date)}
                      </td>
                    )}
                    
                    {activeTab === 'rejected' && (
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request.notes || 'No reason provided'}
                      </td>
                    )}
                    
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded-md mr-2 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded-md transition-colors"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                    
                    {activeTab === 'approved' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleReturn(request.id)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded-md transition-colors"
                        >
                          Mark Returned
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