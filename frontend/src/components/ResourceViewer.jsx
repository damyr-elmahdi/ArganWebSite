import { useState, useEffect } from 'react';

export default function ResourceViewer() {
  // State for selected subject, year level, and specialization
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [yearLevel, setYearLevel] = useState('all');
  const [specialization, setSpecialization] = useState('all');

  // Educational resources data
  const subjects = [
    { id: 1, title: "SVT", icon: "🧬" },
    { id: 2, title: "Mathematics", icon: "🔢" },
    { id: 3, title: "Physics & chemistry", icon: "⚛️" },
    { id: 4, title: "Arabic", icon: "✏️" },
    { id: 5, title: "History and Geography", icon: "🏹📈" },
    { id: 6, title: "French", icon: "🇫🇷" }
  ];

  // Year level options
  const yearLevels = [
    { value: 'all', label: 'All Years' },
    { value: 'tc', label: 'TC (Tronc Commun)' },
    { value: '1bac', label: '1BAC (First Year)' },
    { value: '2bac', label: '2BAC (Second Year)' }
  ];

  // Specialization options
  const specializations = [
    { value: 'all', label: 'All Specializations' },
    { value: 'se', label: 'SE (Sciences Expérimentales)' }, 
    { value: 'sm', label: 'SM (Sciences Mathématiques)' },
    { value: 'svt', label: 'SVT (Sciences de la Vie et de la Terre)' },
    { value: 'sh', label: 'SH (Sciences Humaines)' },
    { value: 'al', label: 'AL (Arts et Lettres)' }
  ];

  // Sample resources data - in a real app, this would come from an API
  const resourcesData = {
    "SVT": [
      {
        title: "Cellular Biology Introduction",
        type: "pdf",
        link: "/pdfs/svt/cellular-biology.pdf",
        year: "1bac",
        specialization: "svt"
      },
      {
        title: "Ecosystem Dynamics",
        type: "pdf",
        link: "/pdfs/svt/ecosystem-dynamics.pdf",
        year: "2bac",
        specialization: "svt"
      },
      {
        title: "AlloSchool - SVT Resources",
        type: "website",
        link: "https://www.alloschool.com/course/alom-alhiat-oalarz-althania-bak-alom-tajribia",
        year: "all",
        specialization: "all"
      }
    ],
    "Mathematics": [
      {
        title: "Linear Algebra Foundations",
        type: "pdf",
        link: "/pdfs/math/linear-algebra.pdf",
        year: "1bac",
        specialization: "sm"
      },
      {
        title: "Calculus & Integration",
        type: "pdf",
        link: "/pdfs/math/calculus.pdf",
        year: "2bac",
        specialization: "sm"
      },
      {
        title: "AlloSchool - Mathematics",
        type: "website",
        link: "https://www.alloschool.com/course/alriadhiat-althania-bak-alom-fiziaiia",
        year: "all",
        specialization: "all"
      }
    ],
    "Physics & chemistry": [
      {
        title: "Mechanics Fundamentals",
        type: "pdf",
        link: "/pdfs/physics/mechanics.pdf",
        year: "1bac",
        specialization: "sm"
      },
      {
        title: "Organic Chemistry",
        type: "pdf",
        link: "/pdfs/chemistry/organic-chem.pdf",
        year: "2bac",
        specialization: "se"
      },
      {
        title: "AlloSchool - Physics",
        type: "website",
        link: "https://www.alloschool.com/course/alfizia-oalkimia-althania-bak-alom-fiziaiia",
        year: "all",
        specialization: "all"
      }
    ],
    "Arabic": [
      {
        title: "Arabic Literature Analysis",
        type: "pdf",
        link: "/pdfs/arabic/literature.pdf",
        year: "1bac",
        specialization: "al"
      },
      {
        title: "Advanced Arabic Grammar",
        type: "pdf",
        link: "/pdfs/arabic/grammar.pdf",
        year: "2bac",
        specialization: "al"
      },
      {
        title: "AlloSchool - Arabic",
        type: "website",
        link: "https://www.alloschool.com/course/allgha-alrbia-althania-bak-adab",
        year: "all",
        specialization: "all"
      }
    ],
    "History and Geography": [
      {
        title: "World History Overview",
        type: "pdf",
        link: "/pdfs/history/world-history.pdf",
        year: "1bac",
        specialization: "sh"
      },
      {
        title: "Economic Geography",
        type: "pdf",
        link: "/pdfs/geography/economic-geo.pdf",
        year: "2bac",
        specialization: "sh"
      },
      {
        title: "AlloSchool - History & Geography",
        type: "website",
        link: "https://www.alloschool.com/course/altarikh-oaljghrafi-althania-bak-adab",
        year: "all",
        specialization: "all"
      }
    ],
    "French": [
      {
        title: "French Literature Classics",
        type: "pdf",
        link: "/pdfs/french/literature.pdf",
        year: "1bac",
        specialization: "al"
      },
      {
        title: "Advanced French Composition",
        type: "pdf",
        link: "/pdfs/french/composition.pdf",
        year: "2bac",
        specialization: "al"
      },
      {
        title: "AlloSchool - French",
        type: "website",
        link: "https://www.alloschool.com/course/allgha-alfrnsia-althania-bak-adab",
        year: "all",
        specialization: "all"
      }
    ]
  };

  // Filter resources based on selections
  const filteredResources = selectedSubject ? 
    resourcesData[selectedSubject].filter(resource => 
      (yearLevel === 'all' || resource.year === 'all' || resource.year === yearLevel) &&
      (specialization === 'all' || resource.specialization === 'all' || resource.specialization === specialization)
    ) : [];

  // Handle subject selection
  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject.title);
  };

  // Reset selected subject
  const handleBack = () => {
    setSelectedSubject(null);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Educational Resources</h2>
        
        {!selectedSubject ? (
          // Subject selection grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map(subject => (
              <button 
                key={subject.id}
                onClick={() => handleSubjectClick(subject)}
                className="bg-gray-50 p-4 rounded-lg text-center hover:bg-green-50 hover:shadow-md transition flex flex-col items-center"
              >
                <span className="text-3xl mb-2">{subject.icon}</span>
                <span className="font-medium text-gray-800">{subject.title}</span>
              </button>
            ))}
          </div>
        ) : (
          // Resource viewer for selected subject
          <div>
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBack}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <span className="mr-1">←</span> Back to subjects
              </button>
              <h3 className="text-xl font-semibold">{selectedSubject} Resources</h3>
            </div>
            
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="year-level" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Level
                  </label>
                  <select
                    id="year-level"
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    {yearLevels.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    {specializations.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Resources list */}
            <div className="space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <span className="text-2xl">
                          {resource.type === 'pdf' ? '📄' : '🌐'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {resource.type === 'pdf' ? 'PDF Document' : 'Website'} 
                          {resource.year !== 'all' && ` • ${yearLevels.find(y => y.value === resource.year)?.label}`}
                          {resource.specialization !== 'all' && ` • ${specializations.find(s => s.value === resource.specialization)?.label}`}
                        </p>
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                        >
                          {resource.type === 'pdf' ? 'View PDF' : 'Visit Website'} →
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No resources found for the selected filters. Try adjusting your selection.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}