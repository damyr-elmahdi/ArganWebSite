import React from 'react';
import academics from '../assets/argane.jpg';

export default function Academics() {
  // Academic programs
  const programs = [
    {
      id: 1,
      title: "PC Stream (Physics-Chemistry)",
      description: "Our PC stream focuses on advanced physics and chemistry concepts with rigorous mathematical applications. Students develop strong analytical and experimental skills in our laboratories, preparing them for university studies in engineering and physical sciences.",
      icon: "🔬",
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: "SVT Stream (Life & Earth Sciences)",
      description: "The SVT stream emphasizes biology, geology, and ecological sciences. Students engage in laboratory work and field studies, preparing for university programs in medicine, biology, environmental science, and related fields.",
      icon: "🧬",
      color: "bg-teal-100"
    },
    {
      id: 3,
      title: "Mathematics Stream",
      description: "The mathematics stream at Argane Secondary School emphasizes advanced mathematical concepts with applications in physics and chemistry. This rigorous program prepares students for competitive university programs.",
      icon: "📊",
      color: "bg-green-100"
    },
    {
      id: 4,
      title: "Literary Stream",
      description: "Our literary program focuses on Arabic and French literature, philosophy, and humanities. Students develop critical thinking and communication skills while exploring cultural and historical texts.",
      icon: "📚",
      color: "bg-yellow-100"
    },
    {
      id: 5,
      title: "Arts & Culture",
      description: "Our school promotes artistic expression through various cultural activities including Amazigh dance, theater, music, and visual arts. Students showcase their talents in regular performances and exhibitions.",
      icon: "🎭",
      color: "bg-red-100"
    },
    {
      id: 6,
      title: "Environmental Education",
      description: "We emphasize environmental awareness through special projects and activities. Our students participate in environmental journalism competitions and community initiatives related to sustainability.",
      icon: "🌱",
      color: "bg-indigo-100"
    }
  ];

  // Updated faculty members with names and icons
  const faculty = [
    {
      id: 1,
      name: "Abdel Fattah Ait Baahmed",
      position: "High School Principal",
      icon: "👨‍💼",
      iconColor: "bg-blue-100"
    },
    {
      id: 2,
      name: "Mohamed Rhaidour",
      position: "Supervisor",
      icon: "👨‍🏫",
      iconColor: "bg-green-100"
    },
    {
      id: 3,
      name: "Mohamed Asoufi",
      position: "General Guardian",
      icon: "👨‍💻",
      iconColor: "bg-yellow-100"
    },
    {
      id: 4,
      name: "Mohamed Amkhad",
      position: "General Guardian",
      icon: "👨‍💻",
      iconColor: "bg-purple-100"
    },
    {
      id: 5,
      name: "Ali Sadik",
      position: "Economizer",
      icon: "💼",
      iconColor: "bg-red-100"
    }
  ];

  // Academic achievements based on actual accomplishments
  const achievements = [
    "Mohammed VI Foundation's 'Young Journalists for the Environment' Competition Entry (2023)",
    "Environmental Photography Prize - 'Where to? Who Stops the Sprawl?' (2023)",
    "Celebration of Excellence Ceremony for Top Academic Achievers (2017)",
    "Artistic-Educational Evening 'Success for All' Performance (2015)",
    "Distinguished Academic Results in Provincial Rankings"
  ];

  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Academic Excellence</h1>
          <p className="text-xl max-w-3xl mx-auto">
            At Argane Secondary School in Tiznit, we provide a comprehensive education 
            that prepares students for success in the national Baccalauréat and beyond.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Academic Approach</h2>
              <p className="text-gray-600 mb-4">
                Argane Secondary School (الثانوية التأهيلية أركان) follows the Moroccan national curriculum 
                with a focus on academic excellence and student engagement. Our lycée offers the standard 
                three-year upper secondary program with specialty streams.
              </p>
              <p className="text-gray-600 mb-6">
                Although relatively new, our school has quickly earned a distinguished 
                reputation among the province's secondary schools for both academic results 
                and educational influence. We emphasize community engagement and celebrate student achievement.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Years of Upper Secondary</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">Specialized Streams</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
                  <img src={academics} alt="Academic Environment" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Academic Programs</h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Curriculum Structure</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌱</span>
                Common Core (Tronc Commun)
              </h3>
              <p className="text-gray-600 mb-4">
                The first year of upper secondary follows a common curriculum for all students, 
                providing foundational knowledge across core subjects.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Core subjects including Arabic, foreign languages, and Islamic education
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Foundation mathematics and sciences
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Standardized regional exams at year's end
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌿</span>
                First Baccalaureate (Première)
              </h3>
              <p className="text-gray-600 mb-4">
                Students select specialized streams based on interests and aptitudes,
                beginning focused study in their chosen field.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Specialized tracks (PC, SVT, literary, mathematics)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  In-depth study of stream-specific subjects
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Preparation for final year studies
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                Second Baccalaureate (Terminale)
              </h3>
              <p className="text-gray-600 mb-4">
                The final year of lycée culminates in the national Baccalauréat examination,
                which determines university eligibility.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Advanced study in specialized streams
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Comprehensive national Baccalauréat exams
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  University preparation and career guidance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty - UPDATED with icons instead of images */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Faculty</h2>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Academic Achievements</h2>
              <p className="text-gray-600 mb-6">
                Our students have participated in various competitions and projects, demonstrating
                their academic abilities and commitment to excellence. We regularly celebrate
                student achievements through special ceremonies and events.
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
                  <div className="text-sm text-gray-600">Established In</div>
                </div>
              </div>
              <div className="bg-green-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Year Program</div>
                </div>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">Top</div>
                  <div className="text-sm text-gray-600">Provincial Rankings</div>
                </div>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">Tiznit</div>
                  <div className="text-sm text-gray-600">Souss-Massa Region</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Activities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">School Activities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🎭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cultural Events</h3>
              <p className="text-gray-600">
                We regularly host artistic and cultural events featuring Amazigh (Ahwash) dances, 
                songs, plays in both Amazigh and French, and other performances to celebrate our heritage.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🌳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Environmental Initiatives</h3>
              <p className="text-gray-600">
                Our students participate in environmental journalism competitions and projects,
                including work on plastic pollution and sustainability in our local community.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Recognition</h3>
              <p className="text-gray-600">
                We celebrate student achievement through special ceremonies that honor top performers
                from all grade levels and recognize excellence in academics and extracurricular activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Arganee Secondary School?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Begin your journey toward the Baccalauréat at one of Tiznit's distinguished secondary schools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.href = '/contact'} className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}