import React from 'react';
import { useTranslation } from 'react-i18next';
import academics from '../assets/argane.jpg';

export default function Academics() {
  const { t } = useTranslation();

  // Academic programs
  const programs = [
    {
      id: 1,
      title: t('academics.programs.pc.title'),
      description: t('academics.programs.pc.description'),
      icon: "🔬",
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: t('academics.programs.svt.title'),
      description: t('academics.programs.svt.description'),
      icon: "🧬",
      color: "bg-teal-100"
    },
    {
      id: 3,
      title: t('academics.programs.math.title'),
      description: t('academics.programs.math.description'),
      icon: "📊",
      color: "bg-green-100"
    },
    {
      id: 4,
      title: t('academics.programs.literary.title'),
      description: t('academics.programs.literary.description'),
      icon: "📚",
      color: "bg-yellow-100"
    },
    {
      id: 5,
      title: t('academics.programs.arts.title'),
      description: t('academics.programs.arts.description'),
      icon: "🎭",
      color: "bg-red-100"
    },
    {
      id: 6,
      title: t('academics.programs.environmental.title'),
      description: t('academics.programs.environmental.description'),
      icon: "🌱",
      color: "bg-indigo-100"
    }
  ];

  // Updated faculty members with names and icons
  const faculty = [
    {
      id: 1,
      name: t('academics.faculty.principal.name'),
      position: t('academics.faculty.principal.position'),
      icon: "👨‍💼",
      iconColor: "bg-blue-100"
    },
    {
      id: 2,
      name: t('academics.faculty.supervisor.name'),
      position: t('academics.faculty.supervisor.position'),
      icon: "👨‍🏫",
      iconColor: "bg-green-100"
    },
    {
      id: 3,
      name: t('academics.faculty.guardian1.name'),
      position: t('academics.faculty.guardian1.position'),
      icon: "👨‍💻",
      iconColor: "bg-yellow-100"
    },
    {
      id: 4,
      name: t('academics.faculty.guardian2.name'),
      position: t('academics.faculty.guardian2.position'),
      icon: "👨‍💻",
      iconColor: "bg-purple-100"
    },
    {
      id: 5,
      name: t('academics.faculty.economizer.name'),
      position: t('academics.faculty.economizer.position'),
      icon: "💼",
      iconColor: "bg-red-100"
    }
  ];

  // Academic achievements based on actual accomplishments
  const achievements = [
    t('academics.achievements.item1'),
    t('academics.achievements.item2'),
    t('academics.achievements.item3'),
    t('academics.achievements.item4'),
    t('academics.achievements.item5')
  ];

  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('academics.hero.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('academics.hero.description')}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('academics.overview.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('academics.overview.paragraph1')}
              </p>
              <p className="text-gray-600 mb-6">
                {t('academics.overview.paragraph2')}
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">{t('academics.overview.stat1')}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">{t('academics.overview.stat2')}</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
                  <img src={academics} alt={t('academics.overview.imageAlt')} className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('academics.programsSection.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(program => (
              <div key={program.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className={`h-24 ${program.color} flex items-center justify-center`}>
                  <span className="text-4xl">{program.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Structure */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('academics.curriculum.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌱</span>
                {t('academics.curriculum.common.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.curriculum.common.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.common.point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.common.point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.common.point3')}
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌿</span>
                {t('academics.curriculum.first.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.curriculum.first.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.first.point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.first.point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.first.point3')}
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                {t('academics.curriculum.second.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.curriculum.second.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.second.point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.second.point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {t('academics.curriculum.second.point3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty - UPDATED with icons instead of images */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('academics.faculty.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {faculty.map(member => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md p-4 text-center">
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${member.iconColor} flex items-center justify-center`}>
                  <span className="text-4xl">{member.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                <p className="text-blue-600 text-sm">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic achievements */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('academics.achievements.title')}</h2>
              <p className="text-gray-600 mb-6">
                {t('academics.achievements.description')}
              </p>
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">🏆</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">2014s</div>
                  <div className="text-sm text-gray-600">{t('academics.stats.established')}</div>
                </div>
              </div>
              <div className="bg-green-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">{t('academics.stats.program')}</div>
                </div>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">Top</div>
                  <div className="text-sm text-gray-600">{t('academics.stats.rankings')}</div>
                </div>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">Tiznit</div>
                  <div className="text-sm text-gray-600">{t('academics.stats.region')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Activities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('academics.activities.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🎭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('academics.activities.cultural.title')}</h3>
              <p className="text-gray-600">
                {t('academics.activities.cultural.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🌳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('academics.activities.environmental.title')}</h3>
              <p className="text-gray-600">
                {t('academics.activities.environmental.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('academics.activities.recognition.title')}</h3>
              <p className="text-gray-600">
                {t('academics.activities.recognition.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action .*/}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('academics.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('academics.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.href = '/contact'} className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">
              {t('academics.cta.button')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}