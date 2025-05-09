import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import EventsSection from '../components/EventsSection';
import RegistrationCTA from '../components/RegistrationCTA';
import ClubsSection from '../components/ClubsSection';
import OutstandingStudentsSection from '../components/OutstandingStudentsSection';
import argan from "../assets/argan.png";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function Home({ schoolInfo }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src={argan} alt={t('common.schoolName')} className="w-full h-full object-contain animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">{t('common.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      {/* Banner announcement */}
      <div className="bg-[#165b9f] text-white text-center py-2 px-4">
        <div className="container mx-auto">
          <p className="text-sm font-medium">
            {t('home.banner.welcome')}
          </p>
        </div>
      </div>
      
      {/* Hero section */}
      <Hero schoolName={schoolInfo.name} foundedYear={schoolInfo.foundedYear} />
      
      {/* Welcome message */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
                {/* This would be a school video or image */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-teal-100 to-teal-200">
                  <img src={argan} alt={t('common.schoolName')} className="w-90 h-80 object-contain" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('home.welcome.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('home.welcome.description', { year: schoolInfo.foundedYear, name: schoolInfo.name })}
              </p>
              <p className="text-gray-600 mb-6">
                {t('home.welcome.environment')}
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#18bebc] bg-opacity-20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#165b9f]">95%</div>
                  <div className="text-sm text-gray-600">{t('home.stats.graduationRate')}</div>
                </div>
                <div className="bg-[#18bebc] bg-opacity-20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#165b9f]">85%</div>
                  <div className="text-sm text-gray-600">{t('home.stats.universityAcceptance')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* News section */}
      <NewsSection />
      
      {/* Outstanding Students section */}
      <OutstandingStudentsSection />
      
      {/* Events section */}
      <EventsSection />
      
      {/* Clubs section */}
      <ClubsSection />
      
      {/* Registration CTA */}
      <RegistrationCTA/>
    </main>
  );
}