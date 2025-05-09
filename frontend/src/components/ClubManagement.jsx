import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ClubManagement() {
  const { t } = useTranslation();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubMembers, setClubMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete', 'member'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activities: '',
    meeting_schedule: ''
  });
  const [memberFormData, setMemberFormData] = useState({
    user_id: '',
    role: 'member'
  });
  const [userSearchInput, setUserSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (selectedClub) {
      fetchClubMembers(selectedClub.id);
    }
  }, [selectedClub]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/clubs');
      setClubs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setError(t('clubs.management.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchClubMembers = async (clubId) => {
    try {
      const response = await axios.get(`/api/clubs/${clubId}/members`);
      setClubMembers(response.data);
    } catch (err) {
      console.error('Error fetching club members:', err);
      setError(t('clubs.management.errors.memberLoadFailed'));
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setAvailableUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setAvailableUsers(response.data);
      } else {
        console.error('Expected paginated users or array but got:', response.data);
        setAvailableUsers([]);
        setError(t('common.errors.generic'));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('common.errors.generic'));
      setAvailableUsers([]);
    }
  };

  const handleUserSearch = (e) => {
    const searchTerm = e.target.value;
    setUserSearchInput(searchTerm);
    
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
      setShowUserSuggestions(false);
      return;
    }
    
    const filtered = availableUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.id.toString().includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
    setShowUserSuggestions(true);
  };

  const selectUser = (user) => {
    setMemberFormData({
      ...memberFormData,
      user_id: user.id
    });
    setUserSearchInput(user.name);
    setShowUserSuggestions(false);
  };

  const handleSelectClub = (club) => {
    setSelectedClub(club);
    setError(null);
  };

  const openModal = (type, club = null) => {
    setModalType(type);
    setModalVisible(true);
    setError(null);

    if (type === 'create') {
      setFormData({
        name: '',
        description: '',
        activities: '',
        meeting_schedule: ''
      });
    } else if (type === 'edit' && club) {
      setFormData({
        name: club.name,
        description: club.description,
        activities: club.activities,
        meeting_schedule: club.meeting_schedule || ''
      });
    } else if (type === 'member') {
      fetchUsers();
      setMemberFormData({
        user_id: '',
        role: 'member'
      });
      setUserSearchInput('');
      setFilteredUsers([]);
      setShowUserSuggestions(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType('');
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setMemberFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/clubs', formData);
      setClubs(prev => [...prev, response.data]);
      closeModal();
      setError(null);
    } catch (err) {
      console.error('Error creating club:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else {
        setError(t('clubs.management.errors.createFailed'));
      }
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/clubs/${selectedClub.id}`, formData);
      setClubs(prev => prev.map(club => club.id === selectedClub.id ? response.data : club));
      setSelectedClub(response.data);
      closeModal();
      setError(null);
    } catch (err) {
      console.error('Error updating club:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else {
        setError(t('clubs.management.errors.updateFailed'));
      }
    }
  };

  const handleDeleteClub = async () => {
    try {
      await axios.delete(`/api/clubs/${selectedClub.id}`);
      setClubs(prev => prev.filter(club => club.id !== selectedClub.id));
      setSelectedClub(null);
      closeModal();
      setError(null);
    } catch (err) {
      console.error('Error deleting club:', err);
      setError(t('clubs.management.errors.deleteFailed'));
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!memberFormData.user_id) {
      setError(t('clubs.management.errors.selectUser'));
      return;
    }
    
    try {
      const response = await axios.post(`/api/clubs/${selectedClub.id}/members`, memberFormData);
      setClubMembers(prev => [...prev, response.data]);
      closeModal();
      setError(null);
    } catch (err) {
      console.error('Error adding member:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else {
        setError(t('clubs.management.errors.memberAddFailed'));
      }
    }
  };

  const handleUpdateMember = async (memberId, newRole) => {
    try {
      const memberToUpdate = clubMembers.find(member => member.id === memberId);
      const response = await axios.put(`/api/clubs/${selectedClub.id}/members/${memberId}`, {
        user_id: memberToUpdate.user_id || memberToUpdate.user.id,
        role: newRole
      });
      
      setClubMembers(prev => prev.map(member => 
        member.id === memberId ? response.data : member
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating member:', err);
      setError(t('clubs.management.errors.memberUpdateFailed'));
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.delete(`/api/clubs/${selectedClub.id}/members/${memberId}`);
      setClubMembers(prev => prev.filter(member => member.id !== memberId));
      setError(null);
    } catch (err) {
      console.error('Error removing member:', err);
      setError(t('clubs.management.errors.memberRemoveFailed'));
    }
  };

  const viewClubDetails = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('clubs.management.title')}</h1>
          <button
            onClick={() => openModal('create')}
            className="bg-[#18bebc] hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('clubs.management.createNew')}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Club List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-1">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="text-lg font-medium text-gray-800">{t('clubs.management.table.title')}</h2>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#18bebc]"></div>
                </div>
              ) : clubs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {t('clubs.management.noClubs')}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {clubs.map(club => (
                    <li key={club.id}>
                      <button
                        onClick={() => handleSelectClub(club)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition duration-150 ${selectedClub?.id === club.id ? 'bg-teal-50 border-l-4 border-[#18bebc]' : ''}`}
                      >
                        <h3 className="font-medium text-gray-800">{club.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{club.description}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Club Details and Members */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
            {selectedClub ? (
              <>
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-800">{selectedClub.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewClubDetails(selectedClub.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('common.view')}
                    </button>
                    <button
                      onClick={() => openModal('edit', selectedClub)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => openModal('delete')}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800">{t('clubs.management.details.title')}</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500">{t('clubs.management.details.description')}</h4>
                        <p className="text-gray-700">{selectedClub.description}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500">{t('clubs.management.details.activities')}</h4>
                        <p className="text-gray-700">{selectedClub.activities}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">{t('clubs.management.details.meetingSchedule')}</h4>
                        <p className="text-gray-700">{selectedClub.meeting_schedule || t('clubs.management.details.notSpecified')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">{t('clubs.management.members.title')}</h3>
                      <button
                        onClick={() => openModal('member')}
                        className="bg-[#18bebc] hover:bg-teal-600 text-white px-3 py-1 text-sm rounded-md flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        {t('clubs.management.members.add')}
                      </button>
                    </div>
                    
                    {clubMembers.length > 0 ? (
                      <div className="overflow-x-auto bg-white border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('clubs.management.members.name')}</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('clubs.management.members.role')}</th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('clubs.management.members.actions')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {clubMembers.map(member => (
                              <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {member.user?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="relative inline-block">
                                    <select
                                      value={member.role}
                                      onChange={(e) => handleUpdateMember(member.id, e.target.value)}
                                      className="form-select rounded-md border-gray-300 focus:ring-[#18bebc] focus:border-[#18bebc] text-sm"
                                    >
                                      <option value="member">{t('clubs.management.members.roles.member')}</option>
                                      <option value="leader">{t('clubs.management.members.roles.leader')}</option>
                                      <option value="assistant">{t('clubs.management.members.roles.assistant')}</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    {t('common.remove')}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                        {t('clubs.management.members.empty')}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-3-3H7m0 0a3 3 0 00-3 3v2m12-3a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3-3a3 3 0 00-3-3m0 0H7" />
                </svg>
                <p className="mt-4">{t('clubs.management.selectClubPrompt')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit/Delete Club or Add Member. */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'create' && t('clubs.management.modal.createTitle')}
                {modalType === 'edit' && t('clubs.management.modal.editTitle')}
                {modalType === 'delete' && t('clubs.management.modal.deleteTitle')}
                {modalType === 'member' && t('clubs.management.modal.memberTitle')}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                  <p>{error}</p>
                </div>
              )}

              {modalType === 'delete' ? (
                <div>
                  <p className="text-red-600 mb-4">
                    {t('clubs.management.modal.deleteConfirmation', { name: selectedClub?.name })}
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleDeleteClub}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ) : modalType === 'member' ? (
                <form onSubmit={handleAddMember}>
                  <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_search">
                      {t('clubs.management.members.form.user')}
                    </label>
                    <input
                      type="text"
                      id="user_search"
                      name="user_search"
                      value={userSearchInput}
                      onChange={handleUserSearch}
                      onFocus={() => userSearchInput.trim() !== '' && setShowUserSuggestions(true)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t('clubs.management.members.form.searchPlaceholder')}
                      required
                    />
                    {showUserSuggestions && filteredUsers.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-48 overflow-y-auto border border-gray-300">
                        {filteredUsers.map(user => (
                          <div 
                            key={user.id} 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectUser(user)}
                          >
                            {user.name} (ID: {user.id})
                          </div>
                        ))}
                      </div>
                    )}
                    {showUserSuggestions && filteredUsers.length === 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                        <div className="px-4 py-2 text-gray-500">{t('clubs.management.members.form.noUsersFound')}</div>
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                      {t('clubs.management.members.form.role')}
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={memberFormData.role}
                      onChange={handleMemberInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="member">{t('clubs.management.members.roles.member')}</option>
                      <option value="leader">{t('clubs.management.members.roles.leader')}</option>
                      <option value="assistant">{t('clubs.management.members.roles.assistant')}</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#18bebc] hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                    >
                      {t('clubs.management.buttons.addMember')}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={modalType === 'create' ? handleCreateClub : handleUpdateClub}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      {t('clubs.management.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t('clubs.management.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      {t('clubs.management.form.description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t('clubs.management.form.descriptionPlaceholder')}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activities">
                      {t('clubs.management.form.activities')}
                    </label>
                    <textarea
                      id="activities"
                      name="activities"
                      value={formData.activities}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t('clubs.management.form.activitiesPlaceholder')}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meeting_schedule">
                      {t('clubs.management.form.meetingSchedule')}
                    </label>
                    <input
                      type="text"
                      id="meeting_schedule"
                      name="meeting_schedule"
                      value={formData.meeting_schedule}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t('clubs.management.form.meetingSchedulePlaceholder')}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#18bebc] hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                    >
                      {modalType === 'create' ? t('clubs.management.buttons.create') : t('clubs.management.buttons.update')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}