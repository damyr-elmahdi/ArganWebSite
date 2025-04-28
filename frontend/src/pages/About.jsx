import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";
export default function About() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="flex-grow bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Arkan Secondary School</h1>
          <p className="text-lg max-w-2xl">
            A distinguished lycée qualifiant in Tiznit committed to academic excellence and community engagement.
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
                activeTab === 'overview' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'history' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('programs')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'programs' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Educational Programs
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'achievements' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Achievements
            </button>
            <button 
              onClick={() => setActiveTab('facilities')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'facilities' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Facilities
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Arkan Secondary School</h2>
              <p className="text-gray-600 mb-4">
                Arkan Secondary School (الثانوية التأهيلية أركان) is an upper-secondary lycée qualifiant 
                located in the city of Tiznit in the Souss-Massa region of Morocco. Established in the 2010s, 
                our school has quickly earned a distinguished place among the province's secondary schools 
                in terms of academic results and educational influence.
              </p>
              <p className="text-gray-600 mb-4">
                Our school offers the standard Moroccan educational pathway with classes for the common core 
                (جذوع مشتركة), Premier Baccalauréat (1ère bac), and Terminal Baccalauréat (2ème bac). We are 
                committed to academic excellence, cultural engagement, and community development.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Academic Years</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">Multiple</div>
                  <div className="text-sm text-gray-600">Academic Tracks</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">2010s</div>
                  <div className="text-sm text-gray-600">Year Established</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">Numerous</div>
                  <div className="text-sm text-gray-600">Cultural Activities</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-64 rounded-lg shadow-md flex items-center justify-center">
                <img src={argan} alt="School Logo" className="w-48 h-48 object-contain bg-white p-3 rounded-full" />
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our History</h2>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-200"></div>
              
              {/* Timeline events */}
              <div className="space-y-8 relative ml-12">
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2010s: Establishment</h3>
                    <p className="text-gray-600 mt-2">
                      Arkan Secondary School was established in the 2010s as a new lycée qualifiant in the city of Tiznit,
                      with a mission to provide quality upper-secondary education to the local community.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2015: Cultural Development</h3>
                    <p className="text-gray-600 mt-2">
                      The school organized its "Artistic-Educational Evening" under the motto "Success for All", 
                      featuring recitations, Amazigh (Ahwash) dances, songs, and plays in both Amazigh and French.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2017: Recognition of Excellence</h3>
                    <p className="text-gray-600 mt-2">
                      Arkan Secondary School hosted a "Celebration of Excellence" ceremony to honor top-achieving students
                      from all academic levels, and earned distinction among the province's secondary schools for academic results.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2023: Environmental Engagement</h3>
                    <p className="text-gray-600 mt-2">
                      Students participated in the Mohammed VI Foundation's "Young Journalists for the Environment" competition,
                      submitting a video report about plastic waste in Tiznit and winning a prize for an environmental photograph.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'programs' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Educational Programs</h2>
            <p className="text-gray-600 mb-6">
              Following the standard Moroccan educational system, our lycée offers a three-year upper secondary program:
            </p>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">Tronc Commun (Common Core)</h3>
                <p className="text-gray-600 mt-2">
                  The first year provides a common curriculum for all students. At the end of this year,
                  students take standardized regional exams and are then tracked into specific streams
                  based on their choices and results.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">First Baccalaureate Year (1ère Bac)</h3>
                <p className="text-gray-600 mt-2">
                  In this second year, students begin specializing in their chosen streams, which may include:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>General/Literary Studies</li>
                  <li>Mathematical/Scientific Studies</li>
                  <li>Sciences Expérimentales (Life and Earth Sciences)</li>
                  <li>Economics and Management</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800">Second Baccalaureate Year (2ème Bac)</h3>
                <p className="text-gray-600 mt-2">
                  The final year continues students' specialization in their chosen streams. All students
                  take the national Baccalauréat exam at the end of this year, which is required for 
                  university admission.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements and Community Engagement</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Academic Excellence</h3>
                <p className="text-gray-600 mt-2">
                  As reported in 2017, our lycée has quickly "earned a distinguished place among the province's 
                  secondary schools in terms of academic results and educational influence."
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">Cultural Events</h3>
                <p className="text-gray-600 mt-2">
                  Our school regularly hosts cultural and educational events that showcase student talents and recognize achievements:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    <span className="font-semibold">Artistic-Educational Evening (2015):</span> Featured recitations, 
                    Amazigh dances, songs, and theatrical performances
                  </li>
                  <li>
                    <span className="font-semibold">Celebration of Excellence (2017):</span> Recognized top students 
                    and included a moral theater performance about exam ethics
                  </li>
                  <li>
                    <span className="font-semibold">UNESCO's World Argan Tree Day:</span> Organized a cultural week 
                    with exhibitions, mural painting, and scientific talks
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">Environmental Engagement</h3>
                <p className="text-gray-600 mt-2">
                  Our students actively participate in environmental awareness and conservation efforts:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    Video report on plastic waste in Tiznit submitted to the Mohammed VI Foundation's 
                    "Young Journalists for the Environment" competition (2023)
                  </li>
                  <li>
                    Award-winning environmental photograph titled "Where to? Who Stops the Sprawl?" 
                    highlighting pollution threatening local date-palm groves (2023)
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800">Community Support</h3>
                <p className="text-gray-600 mt-2">
                  Our school benefits from strong community and parent involvement:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>
                    In the 2016/2017 school year, parents through the parent-teacher association donated 
                    1,000 large notebooks to distribute to all Arkan students
                  </li>
                  <li>
                    This initiative was covered by local media as an example of community mobilization 
                    for quality education
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'facilities' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Facilities</h2>
            <p className="text-gray-600 mb-6">
              While detailed information on Arkan's facilities is not extensively documented, 
              our school is equipped with essential educational spaces to support student learning and activities:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-600 text-lg">Auditorium/School Hall</h3>
                <p className="text-gray-600 mt-2">
                  Our school has a dedicated space (قاعة أو فضاء المؤسسة) for hosting cultural events,
                  ceremonies, and student performances.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-600 text-lg">Classrooms</h3>
                <p className="text-gray-600 mt-2">
                  Modern classrooms equipped for the different educational levels and streams: common core,
                  first baccalaureate, and second baccalaureate.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-600 text-lg">Campus Grounds</h3>
                <p className="text-gray-600 mt-2">
                  Outdoor areas that accommodate exhibitions, cultural activities, and student gatherings.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-600 text-lg">Educational Resources</h3>
                <p className="text-gray-600 mt-2">
                  Learning materials and resources to support the national curriculum across all streams and specializations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Academic Community</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Arkan Secondary School offers a supportive environment where students can excel academically
            and develop personally through diverse educational and cultural experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 transition">
              Apply Now
            </Link>
            <Link to="/contact" className="bg-white text-orange-600 border border-orange-600 px-6 py-3 rounded-md font-medium hover:bg-orange-50 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}