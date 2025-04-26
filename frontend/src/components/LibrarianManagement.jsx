import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LibrarianManagement() {
  const { user } = useAuth();
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    staff_id: '',
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  
  useEffect(() => {
    fetchLibrarians();
  }, []);
  
  const fetchLibrarians = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/librarians');
      setLibrarians(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load librarians. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      staff_id: '',
    });
    setFormError(null);
    setFormSuccess(null);
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError(null);
      
      const response = await axios.post('/api/librarians', formData);
      
      setFormSuccess('Librarian added successfully!');
      resetForm();
      setShowAddForm(false);
      fetchLibrarians();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add librarian. Please check the form and try again.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleEditClick = (librarian) => {
    setEditingLibrarian(librarian);
    setFormData({
      name: librarian.user.name,
      email: librarian.user.email,
      password: '',
      staff_id: librarian.staff_id,
    });
    setShowAddForm(false);
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError(null);
      
      // Only include password if it's provided
      const dataToSubmit = {...formData};
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      await axios.put(`/api/librarians/${editingLibrarian.id}`, dataToSubmit);
      
      setFormSuccess('Librarian updated successfully!');
      setTimeout(() => {
        setFormSuccess(null);
        setEditingLibrarian(null);
        resetForm();
        fetchLibrarians();
      }, 2000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update librarian.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteClick = (librarian) => {
    setDeleteTarget(librarian);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      setFormLoading(true);
      await axios.delete(`/api/librarians/${deleteTarget.id}`);
      setFormSuccess('Librarian deleted successfully!');
      setShowDeleteConfirm(false);
      fetchLibrarians();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete librarian.');
      console.error(err);
    } finally {
      setFormLoading(false);
      setDeleteTarget(null);
    }
  };
  
  // Check if user is authorized to manage librarians
  if (!user || user.role !== 'administrator') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to manage librarians.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Librarian Management</h1>
        {!showAddForm && !editingLibrarian && (
          <button 
            onClick={() => {
              setShowAddForm(true);
              resetForm();
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Librarian
          </button>
        )}
      </div>
      
      {/* Add/Edit Form */}
      {(showAddForm || editingLibrarian) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingLibrarian ? 'Edit Librarian' : 'Add New Librarian'}
          </h2>
          
          <form onSubmit={editingLibrarian ? handleEditSubmit : handleAddSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID *
                </label>
                <input
                  type="text"
                  name="staff_id"
                  value={formData.staff_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingLibrarian ? 'Password (leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required={!editingLibrarian}
                  minLength={8}
                />
              </div>
            </div>
            
            {formError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                {formError}
              </div>
            )}
            
            {formSuccess && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
                {formSuccess}
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingLibrarian(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                disabled={formLoading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={formLoading}
              >
                {formLoading ? 'Processing...' : editingLibrarian ? 'Update Librarian' : 'Add Librarian'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Librarians List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : librarians.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No librarians found</h3>
            <p className="text-gray-500">
              Add your first librarian using the button above.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered On
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {librarians.map((librarian) => (
                <tr key={librarian.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {librarian.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{librarian.user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {librarian.staff_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {librarian.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(librarian.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditClick(librarian)}
                      className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(librarian)}
                      className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete librarian <strong>{deleteTarget.user.name}</strong> with staff ID <strong>{deleteTarget.staff_id}</strong>? This action cannot be undone.
            </p>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                {formError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={formLoading}
              >
                Cancel
              </button>
              
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}