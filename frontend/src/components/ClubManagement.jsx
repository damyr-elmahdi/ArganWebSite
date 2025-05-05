import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClubManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState({
    name: '',
    description: '',
    activities: '',
    meeting_schedule: ''
  });
  
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // New member form state
  const [newMember, setNewMember] = useState({
    user_id: '',
    role: 'member'
  });
  
  // Edit mode states
  const [editingClub, setEditingClub] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editMemberData, setEditMemberData] = useState({
    user_id: '',
    role: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch club details
        if (id) {
          const clubResponse = await axios.get(`/api/clubs/${id}`);
          setClub(clubResponse.data);
          
          // Fetch club members
          const membersResponse = await axios.get(`/api/clubs/${id}/members`);
          setMembers(membersResponse.data);
        }
        
        // Fetch all users for member selection dropdown
        const usersResponse = await axios.get('/api/users');
        setUsers(usersResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        
        // Add fallback data for development
        if (process.env.NODE_ENV === 'development') {
          setClub({
            id: parseInt(id) || 1,
            name: 'Science Club',
            description: 'Explore the wonders of science through experiments.',
            activities: 'Lab experiments, Science fairs, Guest lectures',
            meeting_schedule: 'Every Tuesday, 3:30 PM'
          });
          
          setMembers([
            { id: 1, user_id: 1, role: 'leader', user: { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com' } },
            { id: 2, user_id: 2, role: 'member', user: { id: 2, name: 'David Chen', email: 'david@example.com' } },
            { id: 3, user_id: 3, role: 'member', user: { id: 3, name: 'Maria Garcia', email: 'maria@example.com' } }
          ]);
          
          setUsers([
            { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com' },
            { id: 2, name: 'David Chen', email: 'david@example.com' },
            { id: 3, name: 'Maria Garcia', email: 'maria@example.com' },
            { id: 4, name: 'John Smith', email: 'john@example.com' },
            { id: 5, name: 'Emma Wilson', email: 'emma@example.com' }
          ]);
        }
      }
    };

    fetchData();
  }, [id]);

  // Handle club form changes
  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClub(prev => ({ ...prev, [name]: value }));
  };

  // Handle new member form changes
  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle edit member form changes
  const handleEditMemberChange = (e) => {
    const { name, value } = e.target;
    setEditMemberData(prev => ({ ...prev, [name]: value }));
  };

  // Save club details
  const handleSaveClub = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (id) {
        // Update existing club
        response = await axios.put(`/api/clubs/${id}`, club);
        setSuccess('Club details updated successfully');
      } else {
        // Create new club
        response = await axios.post('/api/clubs', club);
        navigate(`/admin/clubs/${response.data.id}`);
        setSuccess('Club created successfully');
      }
      
      setClub(response.data);
      setEditingClub(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving club:', err);
      setError('Failed to save club details. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Add new member
  const handleAddMember = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`/api/clubs/${id}/members`, newMember);
      
      // Find the user data to display in the members list
      const userData = users.find(user => user.id === parseInt(newMember.user_id));
      
      // Add the new member to the members list
      setMembers(prev => [...prev, {
        ...response.data,
        user: userData
      }]);
      
      // Reset the form
      setNewMember({
        user_id: '',
        role: 'member'
      });
      
      setSuccess('Member added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
      
      // For development: add the member to the list anyway
      if (process.env.NODE_ENV === 'development') {
        const userData = users.find(user => user.id === parseInt(newMember.user_id));
        
        setMembers(prev => [...prev, {
          id: Math.max(...members.map(m => m.id), 0) + 1,
          user_id: parseInt(newMember.user_id),
          role: newMember.role,
          user: userData
        }]);
        
        setNewMember({
          user_id: '',
          role: 'member'
        });
      }
    }
  };

  // Start editing a member
  const handleEditMember = (member) => {
    setEditingMemberId(member.id);
    setEditMemberData({
      user_id: member.user_id.toString(),
      role: member.role
    });
  };

  // Save edited member
  const handleSaveMember = async (memberId) => {
    try {
      const response = await axios.put(`/api/clubs/${id}/members/${memberId}`, editMemberData);
      
      // Find the user data to display in the members list
      const userData = users.find(user => user.id === parseInt(editMemberData.user_id));
      
      // Update the member in the members list
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...response.data, user: userData } : member
      ));
      
      setEditingMemberId(null);
      setSuccess('Member updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating member:', err);
      setError('Failed to update member. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
      
      // For development: update the member in the list anyway
      if (process.env.NODE_ENV === 'development') {
        const userData = users.find(user => user.id === parseInt(editMemberData.user_id));
        
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { 
            ...member, 
            user_id: parseInt(editMemberData.user_id),
            role: editMemberData.role,
            user: userData
          } : member
        ));
        
        setEditingMemberId(null);
      }
    }
  };

  // Delete member
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the club?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/clubs/${id}/members/${memberId}`);
      
      // Remove the member from the members list
      setMembers(prev => prev.filter(member => member.id !== memberId));
      
      setSuccess('Member removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to remove member. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
      
      // For development: remove the member from the list anyway
      if (process.env.NODE_ENV === 'development') {
        setMembers(prev => prev.filter(member => member.id !== memberId));
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (editingClub) {
      setEditingClub(false);
      
      // Reset club data to original if editing existing club
      if (id) {
        fetchClubDetails();
      }
    }
    
    if (editingMemberId) {
      setEditingMemberId(null);
    }
  };

  // Fetch club details (used after cancelling edit)
  const fetchClubDetails = async () => {
    try {
      const response = await axios.get(`/api/clubs/${id}`);
      setClub(response.data);
    } catch (err) {
      console.error('Error fetching club details:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18bebc]"></div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {id ? 'Manage Club' : 'Create New Club'}
          </h1>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>
        
        {/* Club Details Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Club Details</h2>
              <button 
                onClick={() => setEditingClub(!editingClub)}
                className={`px-4 py-2 rounded-md ${
                  editingClub ? 'bg-gray-200 text-gray-700' : 'bg-[#18bebc] text-white'
                }`}
              >
                {editingClub ? 'Cancel' : 'Edit Details'}
              </button>
            </div>
            
            {editingClub ? (
              <form onSubmit={handleSaveClub}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Club Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={club.name}
                    onChange={handleClubChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={club.description}
                    onChange={handleClubChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activities">
                    Activities
                  </label>
                  <textarea
                    id="activities"
                    name="activities"
                    value={club.activities}
                    onChange={handleClubChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meeting_schedule">
                    Meeting Schedule
                  </label>
                  <input
                    type="text"
                    id="meeting_schedule"
                    name="meeting_schedule"
                    value={club.meeting_schedule || ''}
                    onChange={handleClubChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., Every Tuesday, 3:30 PM"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingClub(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#18bebc] hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Club Name</h3>
                  <p className="text-gray-600">{club.name}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{club.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Activities</h3>
                  <p className="text-gray-600">{club.activities}</p>
                </div>
                
                {club.meeting_schedule && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Meeting Schedule</h3>
                    <p className="text-gray-600">{club.meeting_schedule}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Club Members Management */}
        {id && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Club Members</h2>
              
              {/* Add Member Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Member</h3>
                
                <form onSubmit={handleAddMember} className="flex flex-wrap items-end gap-4">
                  <div className="flex-grow">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
                      User
                    </label>
                    <select
                      id="user_id"
                      name="user_id"
                      value={newMember.user_id}
                      onChange={handleNewMemberChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-48">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={newMember.role}
                      onChange={handleNewMemberChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="member">Member</option>
                      <option value="leader">Leader</option>
                      <option value="assistant">Assistant</option>
                    </select>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="bg-[#18bebc] hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Members List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.length > 0 ? (
                      members.map(member => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{member.user?.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{member.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingMemberId === member.id ? (
                              <select
                                name="role"
                                value={editMemberData.role}
                                onChange={handleEditMemberChange}
                                className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                              >
                                <option value="member">Member</option>
                                <option value="leader">Leader</option>
                                <option value="assistant">Assistant</option>
                              </select>
                            ) : (
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.role === 'leader' 
                                  ? 'bg-green-100 text-green-800' 
                                  : member.role === 'assistant' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {editingMemberId === member.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveMember(member.id)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingMemberId(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditMember(member)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center italic">
                          No members in this club yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}