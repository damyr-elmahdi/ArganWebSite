import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";

export default function About() {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useTranslation();

  return (
    <main className="flex-grow bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-lg max-w-2xl">
            {t('about.subtitle')}
          </p>
        </div>
      </section>
      
      {/* Tab Navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-6 py-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'overview' ? 'bg-teal-100 text-[#18bebc]' : 'text-gray-600 hover:text-[#18bebc]'
              }`}
            >
              {t('about.tabs.overview')}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'history' ? 'bg-teal-100 text-[#18bebc]' : 'text-gray-600 hover:text-[#18bebc]'
              }`}
            >
              {t('about.tabs.history')}
            </button>
            <button 
              onClick={() => setActiveTab('programs')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'programs' ? 'bg-teal-100 text-[#18bebc]' : 'text-gray-600 hover:text-[#18bebc]'
              }`}
            >
              {t('about.tabs.programs')}
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'achievements' ? 'bg-teal-100 text-[#18bebc]' : 'text-gray-600 hover:text-[#18bebc]'
              }`}
            >
              {t('about.tabs.achievements')}
            </button>
            <button 
              onClick={() => setActiveTab('facilities')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'facilities' ? 'bg-teal-100 text-[#18bebc]' : 'text-gray-600 hover:text-[#18bebc]'
              }`}
            >
              {t('about.tabs.facilities')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.overview.welcome')}</h2>
              <p className="text-gray-600 mb-4">
                {t('about.overview.description1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('about.overview.description2')}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#18bebc]">{t('about.overview.stats.years.value')}</div>
                  <div className="text-sm text-gray-600">{t('about.overview.stats.years.label')}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#18bebc]">{t('about.overview.stats.tracks.value')}</div>
                  <div className="text-sm text-gray-600">{t('about.overview.stats.tracks.label')}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#18bebc]">{t('about.overview.stats.established.value')}</div>
                  <div className="text-sm text-gray-600">{t('about.overview.stats.established.label')}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#18bebc]">{t('about.overview.stats.activities.value')}</div>
                  <div className="text-sm text-gray-600">{t('about.overview.stats.activities.label')}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-gradient-to-r from-teal-400 to-teal-500 h-64 rounded-lg shadow-md flex items-center justify-center">
                <img src={argan} alt={t('about.images.schoolLogo')} className="w-48 h-48 object-contain bg-white p-3 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 h-40 rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-6xl">🏫</span>
                </div>
                <div className="bg-green-100 h-40 rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-6xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.history.title')}</h2>
            <div className="relative">
              {/* Timeline. */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-200"></div>
              
              {/* Timeline events */}
              <div className="space-y-8 relative ml-12">
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('about.history.events.establishment.title')}</h3>
                    <p className="text-gray-600 mt-2">
                      {t('about.history.events.establishment.description')}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('about.history.events.cultural.title')}</h3>
                    <p className="text-gray-600 mt-2">
                      {t('about.history.events.cultural.description')}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('about.history.events.excellence.title')}</h3>
                    <p className="text-gray-600 mt-2">
                      {t('about.history.events.excellence.description')}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('about.history.events.environmental.title')}</h3>
                    <p className="text-gray-600 mt-2">
                      {t('about.history.events.environmental.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'programs' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.programs.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('about.programs.description')}
            </p>
            
            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">{t('about.programs.commonCore.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.programs.commonCore.description')}
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">{t('about.programs.firstBac.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.programs.firstBac.description')}
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>{t('about.programs.firstBac.streams.literary')}</li>
                  <li>{t('about.programs.firstBac.streams.mathematical')}</li>
                  <li>{t('about.programs.firstBac.streams.experimental')}</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">{t('about.programs.secondBac.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.programs.secondBac.description')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.achievements.title')}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('about.achievements.academic.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.achievements.academic.description')}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('about.achievements.cultural.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.achievements.cultural.description')}
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    <span className="font-semibold">{t('about.achievements.cultural.events.evening.title')}</span> {t('about.achievements.cultural.events.evening.description')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('about.achievements.cultural.events.excellence.title')}</span> {t('about.achievements.cultural.events.excellence.description')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('about.achievements.cultural.events.unesco.title')}</span> {t('about.achievements.cultural.events.unesco.description')}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('about.achievements.environmental.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.achievements.environmental.description')}
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    {t('about.achievements.environmental.projects.video')}
                  </li>
                  <li>
                    {t('about.achievements.environmental.projects.photo')}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('about.achievements.community.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.achievements.community.description')}
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    {t('about.achievements.community.initiatives.notebooks')}
                  </li>
                  <li>
                    {t('about.achievements.community.initiatives.media')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'facilities' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.facilities.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('about.facilities.description')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-[#18bebc] text-lg">{t('about.facilities.list.auditorium.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.facilities.list.auditorium.description')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-[#18bebc] text-lg">{t('about.facilities.list.classrooms.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.facilities.list.classrooms.description')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-[#18bebc] text-lg">{t('about.facilities.list.campus.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.facilities.list.campus.description')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-[#18bebc] text-lg">{t('about.facilities.list.resources.title')}</h3>
                <p className="text-gray-600 mt-2">
                  {t('about.facilities.list.resources.description')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.cta.title')}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-[#18bebc] text-white px-6 py-3 rounded-md font-medium hover:bg-teal-700 transition">
              {t('about.cta.buttons.apply')}
            </Link>
            <Link to="/contact" className="bg-white text-[#18bebc] border border-[#18bebc] px-6 py-3 rounded-md font-medium hover:bg-teal-50 transition">
              {t('about.cta.buttons.contact')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}