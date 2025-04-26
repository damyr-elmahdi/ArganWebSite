import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, IdCard, Clock, Edit, Save, X, Key, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LibrarianProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    current_password: '',
  });
  
  useEffect(() => {
    if (user && (user.role === 'librarian' || user.role === 'administrator')) {
      fetchLibrarianProfile();
    }
  }, [user]);
  
  const fetchLibrarianProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/librarians/profile');
      
      // Handle the special case for administrators without librarian profiles
      if (response.data.message === 'You are an administrator without a librarian profile') {
        setProfile({
          user: response.data.user,
          is_admin_only: true
        });
        
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          password: '',
          current_password: '',
        });
      } else {
        setProfile(response.data);
        
        // Initialize form with current data
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          password: '',
          current_password: '',
        });
      }
    } catch (err) {
      setError('Failed to load your profile. Please try again later.');
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveError(null);
      
      // Only include password if it's provided
      const dataToSubmit = {...formData};
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.current_password;
      }
      
      // For administrators without librarian profiles
      if (profile.is_admin_only) {
        // This would need a separate user update endpoint
        // You may need to create this endpoint
        await axios.put('/api/user/update', dataToSubmit);
      } else {
        // For regular librarians
        await axios.put(`/api/librarians/${profile.id}`, dataToSubmit);
      }
      
      setSaveSuccess(true);
      setEditing(false);
      fetchLibrarianProfile();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to update profile.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  if (!user || (user.role !== 'librarian' && user.role !== 'administrator')) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">You don't have access to this page.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center p-8">
        <p>No librarian profile found for your account.</p>
      </div>
    );
  }
  
  // If the user is an administrator without a librarian profile
  if (profile.is_admin_only) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h1 className="text-xl font-semibold text-white">Administrator Profile</h1>
          </div>
          
          <div className="p-6">
            {saveSuccess && (
              <div className="mb-6 p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Profile updated successfully!
              </div>
            )}
            
            {!editing ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                      {profile.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-900">{profile.user.name}</h2>
                      <p className="text-gray-500">Role: Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Mail className="w-5 h-5 mr-2 text-purple-600" />
                      <h3 className="font-medium">Email Address</h3>
                    </div>
                    <p className="text-gray-600">{profile.user.email}</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      <h3 className="font-medium">Account Status</h3>
                    </div>
                    <p className="text-gray-600">Active</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700">
                    You are an administrator without a librarian profile. You can still manage all library functions, but you don't have a librarian staff ID.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setSaveError(null);
                      // Reset form data to current profile data
                      setFormData({
                        name: profile.user.name,
                        email: profile.user.email,
                        password: '',
                        current_password: '',
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-4">
                        <Key className="w-5 h-5 mr-2 text-gray-500" />
                        <h3 className="font-medium">Password Update (Optional)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                          />
                          <p className="text-xs text-gray-500 mt-1">Required to change password</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            minLength={8}
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {saveError && (
                    <div className="mt-6 p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-center">
                      <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{saveError}</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // For regular librarians
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Librarian Profile</h1>
        </div>
        
        <div className="p-6">
          {saveSuccess && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center">
              <Save className="w-5 h-5 mr-2" />
              Profile updated successfully!
            </div>
          )}
          
          {!editing ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {profile.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-900">{profile.user.name}</h2>
                    <p className="text-gray-500">Role: Librarian</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">Email Address</h3>
                  </div>
                  <p className="text-gray-600">{profile.user.email}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <IdCard className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">Staff ID</h3>
                  </div>
                  <p className="text-gray-600">{profile.staff_id}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">Member Since</h3>
                  </div>
                  <p className="text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">Account Status</h3>
                  </div>
                  <p className="text-gray-600">Active</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => {
                    setEditing(false);
                    setSaveError(null);
                    // Reset form data to current profile data
                    setFormData({
                      name: profile.user.name,
                      email: profile.user.email,
                      password: '',
                      current_password: '',
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staff ID
                    </label>
                    <input
                      type="text"
                      name="staff_id"
                      value={profile.staff_id}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Staff ID cannot be changed</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center mb-4">
                      <Key className="w-5 h-5 mr-2 text-gray-500" />
                      <h3 className="font-medium">Password Update (Optional)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="current_password"
                          value={formData.current_password}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">Required to change password</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {saveError && (
                  <div className="mt-6 p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p>{saveError}</p>
                  </div>
                )}
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}