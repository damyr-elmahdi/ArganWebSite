import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function StudentBorrowingsTable() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');

  useEffect(() => {
    fetchBorrowings();
  }, [activeStatus]);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/library/my-requests');
      
      let filteredRequests = response.data;
      if (activeStatus !== 'all') {
        filteredRequests = response.data.filter(req => req.status === activeStatus);
      }
      
      setBorrowings(filteredRequests);
    } catch (error) {
      setError('Failed to load your borrowing history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getStatusBadge = (status, dueDate) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let icon = null;
    
    switch (status) {
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <Clock className="w-3 h-3 mr-1" />;
        break;
      case 'approved':
        if (isOverdue(dueDate)) {
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          icon = <AlertCircle className="w-3 h-3 mr-1" />;
        } else {
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          icon = <Book className="w-3 h-3 mr-1" />;
        }
        break;
      case 'returned':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        icon = <CheckCircle className="w-3 h-3 mr-1" />;
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <XCircle className="w-3 h-3 mr-1" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status === 'approved' && isOverdue(dueDate) ? 'Overdue' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">My Borrowing History</h2>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveStatus('all')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveStatus('pending')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveStatus('approved')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeStatus === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Currently Borrowed
        </button>
        <button
          onClick={() => setActiveStatus('returned')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeStatus === 'returned' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Returned
        </button>
        <button
          onClick={() => setActiveStatus('rejected')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeStatus === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Rejected
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : borrowings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Book className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No borrowing records found</h3>
          <p className="text-gray-500">
            {activeStatus === 'all' 
              ? "You haven't requested any books yet." 
              : `You don't have any ${activeStatus} book requests.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeStatus === 'approved' ? 'Due Date' : 
                   activeStatus === 'returned' ? 'Return Date' : 
                   activeStatus === 'rejected' ? 'Notes' : 'Details'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowings.map((borrowing) => (
                <tr key={borrowing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{borrowing.library_item.title}</div>
                    <div className="text-sm text-gray-500">by {borrowing.library_item.author}</div>
                    <div className="text-xs text-gray-400 mt-1">Inventory #: {borrowing.library_item.inventory_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(borrowing.status, borrowing.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(borrowing.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {borrowing.status === 'approved' && (
                      <div>
                        <div className={`text-sm ${isOverdue(borrowing.due_date) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          Due: {formatDate(borrowing.due_date)}
                        </div>
                        <div className={`text-xs mt-1 ${isOverdue(borrowing.due_date) ? 'text-red-500' : 'text-gray-500'}`}>
                          {getDaysRemaining(borrowing.due_date)}
                        </div>
                      </div>
                    )}
                    {borrowing.status === 'returned' && (
                      <div className="text-sm text-gray-600">
                        {formatDate(borrowing.return_date)}
                      </div>
                    )}
                    {borrowing.status === 'rejected' && (
                      <div className="text-sm text-gray-600">
                        {borrowing.notes || 'No reason provided'}
                      </div>
                    )}
                    {borrowing.status === 'pending' && (
                      <div className="text-sm text-yellow-600">
                        Awaiting approval
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
