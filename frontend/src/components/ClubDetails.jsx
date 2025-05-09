import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import argan from "../assets/argan.png";
import { useTranslation } from 'react-i18next';

export default function ClubDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true);
        // Fetch club details
        const clubResponse = await axios.get(`/api/clubs/${id}`);
        setClub(clubResponse.data);

        // Fetch club members
        const membersResponse = await axios.get(`/api/clubs/${id}/members`);
        setMembers(membersResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching club details:', err);
        setError(t('clubDetails.fetchError'));
        setLoading(false);
        
        // Fallback data for development or when API fails
        if (process.env.NODE_ENV === 'development') {
          setClub({
            id: parseInt(id),
            name: t('clubs.scienceClub.name'),
            description: t('clubs.scienceClub.description'),
            activities: t('clubDetails.fallbackActivities'),
            meeting_schedule: t('clubDetails.fallbackSchedule')
          });
          
          setMembers([
            { id: 1, name: 'Sarah Johnson', role: 'leader', user: { name: 'Sarah Johnson', email: 'sarah@example.com' } },
            { id: 2, name: 'David Chen', role: 'member', user: { name: 'David Chen', email: 'david@example.com' } },
            { id: 3, name: 'Maria Garcia', role: 'member', user: { name: 'Maria Garcia', email: 'maria@example.com' } }
          ]);
        }
      }
    };

    fetchClubDetails();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src={argan} alt={t('common.schoolName')} className="w-full h-full object-contain animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">{t('clubDetails.loading')}</h2>
        </div>
      </div>
    );
  }

  if (error && !club) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <Link to="/" className="mt-4 inline-block text-[#18bebc] hover:underline">
            {t('common.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!club) return null;

  const getRoleTranslation = (role) => {
    // Capitalize first letter of the role
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    
    // Map the role to a translation key and translate it
    return t(`clubDetails.roles.${role}`, normalizedRole);
  };

  return (
    <div className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-[#18bebc] hover:underline mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backToHome')}
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
            <span className="text-6xl">🧩</span>
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{club.description}</p>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('clubDetails.activitiesHeading')}</h2>
              <p className="text-gray-600">{club.activities}</p>
            </div>
            
            {club.meeting_schedule && (
              <div className="mb-8 p-4 bg-teal-50 rounded-lg border border-teal-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('clubDetails.scheduleHeading')}</h3>
                <p className="text-gray-600">{club.meeting_schedule}</p>
              </div>
            )}
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('clubDetails.membersHeading')}</h2>
              
              {members.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('clubDetails.nameColumn')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('clubDetails.roleColumn')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{member.user?.name || member.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.role === 'leader' 
                                ? 'bg-green-100 text-green-800' 
                                : member.role === 'assistant' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {getRoleTranslation(member.role)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">{t('clubDetails.noMembers')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}