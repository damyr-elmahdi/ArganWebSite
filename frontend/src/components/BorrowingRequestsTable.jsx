import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BorrowingRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  
  useEffect(() => {
    fetchRequests();
  }, [activeTab]);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/library/borrowing-requests', {
        params: {
          status: activeTab
        }
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
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve request');
    }
  };
  
  const handleReject = async (requestId) => {
    const notes = prompt('Optional: Enter a reason for rejection');
    
    try {
      await axios.post(`/api/library/borrowing-requests/${requestId}/reject`, {
        notes
      });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject request');
    }
  };
  
  const handleReturn = async (requestId) => {
    try {
      await axios.post(`/api/library/borrowing-requests/${requestId}/return`);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark book as returned');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Book Borrowing Requests</h2>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1 rounded ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-3 py-1 rounded ${activeTab === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab('returned')}
          className={`px-3 py-1 rounded ${activeTab === 'returned' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Returned
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-3 py-1 rounded ${activeTab === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Rejected
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No {activeTab} borrowing requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'approved' && 'Due Date'}
                  {activeTab === 'returned' && 'Return Date'}
                  {activeTab === 'rejected' && 'Notes'}
                  {activeTab === 'pending' && 'Actions'}
                </th>
                {activeTab === 'approved' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.student.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.library_item.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      by {request.library_item.author}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.created_at)}
                  </td>
                  {activeTab === 'pending' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="text-green-600 hover:text-green-800 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Reject
                      </button>
                    </td>
                  )}
                  {activeTab === 'approved' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.due_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleReturn(request.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mark Returned
                        </button>
                      </td>
                    </>
                  )}
                  {activeTab === 'returned' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.return_date)}
                    </td>
                  )}
                  {activeTab === 'rejected' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.notes || 'No reason provided'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}