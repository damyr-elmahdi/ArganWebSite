import React from 'react';
import { Link } from 'react-router-dom';
import academics from '../assets/academia.png'

export default function Academics() {
  // Academic programs
  const programs = [
    {
      id: 1,
      title: "Science & Technology",
      description: "Our science and technology program provides students with hands-on experience in our state-of-the-art laboratories. Students explore physics, chemistry, biology, and computer science with project-based learning approaches.",
      icon: "🧪",
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: "Mathematics",
      description: "The mathematics program at Argan High School emphasizes both theoretical foundations and practical applications. Students develop strong problem-solving skills through challenging coursework and competitions.",
      icon: "📊",
      color: "bg-green-100"
    },
    {
      id: 3,
      title: "Humanities & Social Sciences",
      description: "Our humanities program encourages critical thinking and effective communication. Students explore literature, history, philosophy, and social studies with a focus on developing well-rounded perspectives.",
      icon: "📚",
      color: "bg-yellow-100"
    },
    {
      id: 4,
      title: "Arts & Music",
      description: "The arts program fosters creativity and self-expression through visual arts, music, drama, and design. Students showcase their talents in regular exhibitions and performances throughout the academic year.",
      icon: "🎭",
      color: "bg-purple-100"
    },
    {
      id: 5,
      title: "Physical Education",
      description: "Our physical education program promotes healthy lifestyles and teamwork through various sports and fitness activities. Students learn the importance of discipline, perseverance, and sportsmanship.",
      icon: "🏆",
      color: "bg-red-100"
    },
    {
      id: 6,
      title: "Language Studies",
      description: "The language studies program offers instruction in multiple languages, preparing students for global opportunities. Classes focus on communication skills, cultural understanding, and practical application.",
      icon: "🌐",
      color: "bg-indigo-100"
    }
  ];

  // Faculty members
  const faculty = [
    {
      id: 1,
      name: "Dr. Sophia Chen",
      position: "Head of Science Department",
      credentials: "Ph.D. in Physics, Stanford University",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      name: "Prof. Michael Okafor",
      position: "Head of Mathematics Department",
      credentials: "M.Sc. in Mathematics, MIT",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      name: "Dr. Emma Rodriguez",
      position: "Head of Humanities Department",
      credentials: "Ph.D. in Literature, Oxford University",
      image: "/api/placeholder/120/120"
    },
    {
      id: 4,
      name: "Mr. David Kim",
      position: "Head of Arts Department",
      credentials: "MFA, Julliard School of Music",
      image: "/api/placeholder/120/120"
    }
  ];

  // Academic achievements
  const achievements = [
    "National Science Competition - 1st Place (2024)",
    "International Math Olympiad - Gold Medal (2024)",
    "Regional Debate Championship - Winners (2023)",
    "State Arts Exhibition - Outstanding School Award (2024)",
    "National Language Contest - Top 5 Finalists (2023)"
  ];

  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Academic Excellence</h1>
          <p className="text-xl max-w-3xl mx-auto">
            At Argan High School, we provide a rigorous and comprehensive education 
            that prepares students for success in college and beyond.
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
                Argan High School offers a balanced curriculum that combines academic rigor with 
                creative exploration. Our teaching methodology emphasizes critical thinking, 
                problem-solving, and effective communication skills.
              </p>
              <p className="text-gray-600 mb-6">
                We maintain small class sizes to ensure personalized attention for each student, 
                with dedicated faculty who are experts in their fields and passionate about education.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">12:1</div>
                  <div className="text-sm text-gray-600">Student-Teacher Ratio</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">25+</div>
                  <div className="text-sm text-gray-600">Advanced Placement Courses</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                {/* Placeholder for academic image */}
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
                  <a href="#" className="text-blue-600 hover:underline">Learn more</a>
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
                Junior Years (Grades 7-8)
              </h3>
              <p className="text-gray-600 mb-4">
                Foundation years focus on building core skills across all subjects. 
                Students explore various disciplines to discover their interests and strengths.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Core subjects in mathematics, science, English, and social studies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Introduction to foreign languages
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Exploratory courses in arts, technology, and physical education
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌿</span>
                Middle Years (Grades 9-10)
              </h3>
              <p className="text-gray-600 mb-4">
                Students delve deeper into subjects with more specialized content, 
                preparing for advanced studies in the senior years.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Advanced core subjects with specialized topics
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Elective courses based on student interests
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Introduction to pre-AP courses
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                Senior Years (Grades 11-12)
              </h3>
              <p className="text-gray-600 mb-4">
                Focus on college preparation with specialized courses and 
                advanced placement options to earn university credits.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Advanced Placement (AP) and honors courses
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Specialized electives in various career paths
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  College counseling and career preparation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Faculty</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map(member => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md p-4 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.credentials}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
              View All Faculty
            </a>
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
                Our students consistently excel in regional and national competitions, 
                demonstrating the strength of our academic programs and the dedication 
                of our students and faculty.
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
                  <div className="text-4xl font-bold text-blue-600 mb-2">97%</div>
                  <div className="text-sm text-gray-600">College Acceptance Rate</div>
                </div>
              </div>
              <div className="bg-green-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">45+</div>
                  <div className="text-sm text-gray-600">Academic Competitions</div>
                </div>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">AP Exam Pass Rate</div>
                </div>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">18</div>
                  <div className="text-sm text-gray-600">National Merit Scholars</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Academic Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Learning Commons</h3>
              <p className="text-gray-600">
                Our modern library and learning commons provides students with access to extensive 
                digital and physical resources, quiet study spaces, and collaborative work areas.
              </p>
              <Link to="/library" className="text-blue-600 hover:underline block mt-4">
                Visit Library
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">💻</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Technology Integration</h3>
              <p className="text-gray-600">
                Every classroom is equipped with modern technology to enhance learning experiences. 
                Our 1:1 laptop program ensures students have the tools they need to succeed.
              </p>
              <a href="#" className="text-blue-600 hover:underline block mt-4">
                Tech Resources
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Support</h3>
              <p className="text-gray-600">
                We offer tutoring services, study groups, and academic counseling to support students 
                in achieving their academic goals and addressing any learning challenges.
              </p>
              <a href="#" className="text-blue-600 hover:underline block mt-4">
                Support Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Academic Excellence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Argan High School and embark on an educational journey that prepares you for success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">
              Apply Now
            </Link>
            <a href="#" className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
              Schedule a Visit
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}