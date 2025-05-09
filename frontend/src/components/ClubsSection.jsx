import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ClubsSection() {
  const { t } = useTranslation();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/clubs');
        
        // Check if the response is valid and has data
        if (response.data && Array.isArray(response.data)) {
          setClubs(response.data);
        } else {
          console.warn('Unexpected response format:', response.data);
          // Use fallback data
          setClubs([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError(t('clubs.fetchError'));
        setClubs([]); // Ensure clubs is an array even on error
        setLoading(false);
      }
    };

    fetchClubs();
  }, [t]);

  // Fallback data for initial development or when API fails
  const fallbackClubs = [
    {
      id: 1,
      name: t('clubs.scienceClub.name'),
      description: t('clubs.scienceClub.description'),
      activities: t('clubs.scienceClub.activities')
    },
    {
      id: 2,
      name: t('clubs.debateClub.name'),
      description: t('clubs.debateClub.description'),
      activities: t('clubs.debateClub.activities')
    },
    {
      id: 3,
      name: t('clubs.artClub.name'),
      description: t('clubs.artClub.description'),
      activities: t('clubs.artClub.activities')
    }
  ];

  // Use fallback data if loading fails or no clubs are returned
  const displayClubs = clubs.length > 0 ? clubs : fallbackClubs;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('clubs.heading')}</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18bebc]"></div>
          </div>
        ) : error ? (
          <div>
            <div className="text-center text-yellow-500 mb-4">{error}</div>
            <div className="grid md:grid-cols-3 gap-6">
              {fallbackClubs.map(club => (
                <div key={club.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="h-40 bg-teal-100 flex items-center justify-center">
                    <span className="text-4xl">🧩</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {club.description}
                    </p>
                    <Link 
                      to={`/clubs/${club.id}`} 
                      className="text-[#18bebc] hover:underline inline-flex items-center"
                    >
                      {t('clubs.seeMore')}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {displayClubs.map(club => (
              <div key={club.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                <div className="h-40 bg-teal-100 flex items-center justify-center">
                  {/* Club icon/image would go here */}
                  <span className="text-4xl">🧩</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {club.description}
                  </p>
                  <Link 
                    to={`/clubs/${club.id}`} 
                    className="text-[#18bebc] hover:underline inline-flex items-center"
                  >
                    {t('clubs.seeMore')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}