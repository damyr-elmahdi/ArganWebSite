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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Argan High School</h1>
          <p className="text-lg max-w-2xl">
            Committed to excellence in education, fostering growth, and preparing students for success since 2010.
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
              onClick={() => setActiveTab('mission')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'mission' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Mission & Values
            </button>
            <button 
              onClick={() => setActiveTab('faculty')}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md transition ${
                activeTab === 'faculty' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Faculty & Staff
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Argan High School</h2>
              <p className="text-gray-600 mb-4">
                Argan High School is a premier educational institution dedicated to preparing students 
                for college and beyond. With a focus on academic excellence, character development, 
                and community engagement, we provide a well-rounded education that empowers students 
                to reach their full potential.
              </p>
              <p className="text-gray-600 mb-4">
                Our school offers a rigorous curriculum, experienced faculty, and modern facilities 
                designed to support learning in all disciplines. We believe in fostering critical 
                thinking, creativity, and collaboration among our students, preparing them to become 
                successful and responsible citizens in an increasingly complex world.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">40+</div>
                  <div className="text-sm text-gray-600">Faculty Members</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">15</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">20+</div>
                  <div className="text-sm text-gray-600">Extracurricular Activities</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-64 rounded-lg shadow-md flex items-center justify-center">
                {/* INCREASED LOGO SIZE */}
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
                    <h3 className="text-xl font-bold text-gray-800">2010: Foundation</h3>
                    <p className="text-gray-600 mt-2">
                      Argan High School was established with a vision to provide quality education 
                      to the community. The school began with just 150 students and 10 dedicated teachers.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2015: Expansion</h3>
                    <p className="text-gray-600 mt-2">
                      The school expanded its facilities, adding new classrooms, a modern library, 
                      and state-of-the-art science laboratories to accommodate growing enrollment.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2018: Academic Excellence</h3>
                    <p className="text-gray-600 mt-2">
                      Argan High School received official recognition for academic excellence, 
                      with our graduates achieving outstanding results in national examinations 
                      and university admissions.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2023: Technology Integration</h3>
                    <p className="text-gray-600 mt-2">
                      The school implemented a comprehensive technology plan, integrating digital 
                      learning tools and resources to enhance the educational experience and prepare 
                      students for the digital age.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-orange-600"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">2025: Present Day</h3>
                    <p className="text-gray-600 mt-2">
                      Today, Argan High School continues to grow and evolve, maintaining its 
                      commitment to educational excellence while adapting to meet the changing 
                      needs of students in the 21st century.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other tabs remain the same */}
        {activeTab === 'mission' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                Argan High School is dedicated to providing a challenging and supportive educational 
                environment that empowers students to achieve academic excellence, develop personal 
                integrity, and become responsible global citizens prepared for the challenges of 
                higher education and beyond.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be recognized as a leading educational institution that inspires lifelong learning, 
                fosters innovation, and nurtures the intellectual, social, and emotional development 
                of every student.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Core Values</h2>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-600">Excellence</h3>
                  <p className="text-gray-600 mt-1">
                    We strive for excellence in all academic, athletic, and artistic pursuits.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-600">Integrity</h3>
                  <p className="text-gray-600 mt-1">
                    We promote honesty, ethical behavior, and personal responsibility.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-600">Respect</h3>
                  <p className="text-gray-600 mt-1">
                    We value diversity and treat others with dignity and kindness.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-600">Innovation</h3>
                  <p className="text-gray-600 mt-1">
                    We encourage creative thinking, problem-solving, and embracing new ideas.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-600">Community</h3>
                  <p className="text-gray-600 mt-1">
                    We foster meaningful relationships and service to others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Rest of the tabs continue... */}
      </div>
      
      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Argan High School offers a nurturing environment where students can thrive academically, 
            socially, and personally. We invite you to be part of our educational journey.
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