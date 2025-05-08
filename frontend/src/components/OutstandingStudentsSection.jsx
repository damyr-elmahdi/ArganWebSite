import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

export default function OutstandingStudentsSection() {
  const { t } = useTranslation();
  
  // Utility functions (replacing ImageUnity)
  const getImageUrl = (path) => {
    if (path?.startsWith('http') || path?.startsWith('data:')) {
      return path;
    }
    return path;
  };

  const createPlaceholder = (name) => {
    const letter = name ? name.charAt(0).toUpperCase() : 'A';
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#18bebc"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="80" fill="white">${letter}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const formatMark = (mark) => {
    return Number.isInteger(parseFloat(mark)) ? parseInt(mark) : parseFloat(mark).toFixed(1);
  };

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [studentsByGrade, setStudentsByGrade] = useState({});
  const [expandedGrades, setExpandedGrades] = useState({});

  // Grade grouping and labeling
  const gradeOptions = [
    { value: "TC-S", label: t('grades.tc_sciences') },
    { value: "TC-LSH", label: t('grades.tc_letters') },
    { value: "1BAC-SE", label: t('grades.first_bac_sciences') },
    { value: "1BAC-LSH", label: t('grades.first_bac_letters') },
    { value: "2BAC-PC", label: t('grades.second_bac_pc') },
    { value: "2BAC-SVT", label: t('grades.second_bac_svt') },
    { value: "2BAC-SH", label: t('grades.second_bac_humanities') },
    { value: "2BAC-L", label: t('grades.second_bac_letters') }
  ];

  // Get the base grade for grouping
  const getBaseGrade = (gradeWithClass) => {
    const match = gradeWithClass.match(/^(\d*[A-Z]+-[A-Z]+)/);
    return match ? match[1] : gradeWithClass;
  };

  // Get a more readable grade label from a grade code
  const getGradeLabel = (gradeCode) => {
    const baseGrade = getBaseGrade(gradeCode);
    const grade = gradeOptions.find(g => g.value === baseGrade);
    const classSuffix = gradeCode.replace(baseGrade, "");
    return grade ? `${grade.label}${classSuffix}` : gradeCode;
  };

  // Get shorter grade label for section headers
  const getShortGradeLabel = (gradeCode) => {
    const baseGrade = getBaseGrade(gradeCode);
    const classSuffix = gradeCode.replace(baseGrade, "");
    return `${baseGrade}${classSuffix}`;
  };

  useEffect(() => {
    const fetchOutstandingStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/outstanding-students");
        
        setStudents(response.data);
        
        const groupedStudents = {};
        
        response.data.forEach(student => {
          const gradeClass = student.grade;
          
          if (!groupedStudents[gradeClass]) {
            groupedStudents[gradeClass] = [];
          }
          
          groupedStudents[gradeClass].push(student);
        });
        
        Object.keys(groupedStudents).forEach(grade => {
          groupedStudents[grade].sort((a, b) => parseFloat(b.mark) - parseFloat(a.mark));
          
          groupedStudents[grade] = groupedStudents[grade].map((student, index) => ({
            ...student,
            classRank: index + 1
          }));
        });
        
        setStudentsByGrade(groupedStudents);
        
        const initialExpandedState = {};
        Object.keys(groupedStudents).forEach(grade => {
          initialExpandedState[grade] = true;
        });
        setExpandedGrades(initialExpandedState);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching outstanding students:", err);
        setError(t('errors.load_failed'));
        setLoading(false);
      }
    };

    fetchOutstandingStudents();
  }, [t]);

  const openStudentDetails = (student) => {
    setActiveStudent(student);
    document.body.style.overflow = "hidden";
  };

  const closeStudentDetails = () => {
    setActiveStudent(null);
    document.body.style.overflow = "auto";
  };

  const toggleGradeExpansion = (grade) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const renderStars = (rank) => {
    if (rank === 1) {
      return (
        <div className="absolute -top-3 -right-3 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-yellow-500 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="absolute -top-2 -right-2 flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-gray-300 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 -ml-4 text-yellow-400 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="absolute -top-2 -right-3 flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-yellow-300 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 -ml-2 text-yellow-300 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 -ml-2 text-yellow-300 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('outstanding_students.title')}
          </h2>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18bebc]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('outstanding_students.title')}
          </h2>
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              {t('common.try_again')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (students.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('outstanding_students.title')}
          </h2>
          <div className="text-center py-8">
            {t('outstanding_students.empty_message')}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('outstanding_students.title')}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t('outstanding_students.subtitle')}
        </p>

        {Object.keys(studentsByGrade)
          .sort((a, b) => {
            const gradeOrderA = a.startsWith('2') ? 3 : a.startsWith('1') ? 2 : 1;
            const gradeOrderB = b.startsWith('2') ? 3 : b.startsWith('1') ? 2 : 1;
            
            if (gradeOrderA !== gradeOrderB) {
              return gradeOrderB - gradeOrderA;
            }
            
            return a.localeCompare(b);
          })
          .map((grade) => (
            <div key={grade} className="mb-12">
              <div 
                className="flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors mb-6"
                onClick={() => toggleGradeExpansion(grade)}
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {getGradeLabel(grade)}
                </h3>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    {studentsByGrade[grade].length} {t('common.students')}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-gray-500 transform transition-transform ${
                      expandedGrades[grade] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {expandedGrades[grade] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {studentsByGrade[grade]
                    .sort((a, b) => parseFloat(b.mark) - parseFloat(a.mark))
                    .slice(0, 3)
                    .map((student) => (
                      <div
                        key={student.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={() => openStudentDetails(student)}
                      >
                        <div className="p-6">
                          <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                              {student.photo_path ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#18bebc] relative">
                                  <img
                                    src={getImageUrl(student.photo_path)}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = createPlaceholder(student.name);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#165b9f] to-[#18bebc] flex items-center justify-center border-4 border-[#18bebc]">
                                  <span className="text-white text-3xl font-bold">
                                    {student.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              
                              {renderStars(student.classRank)}
                              
                              <div className="absolute -bottom-2 -right-2 bg-[#18bebc] text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-white">
                                {student.classRank}
                              </div>
                            </div>
                            
                            <span className="bg-[#18bebc] text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                              {formatMark(student.mark)}/20
                            </span>
                            
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                              {student.name}
                            </h3>
                            <p className="text-gray-600 text-center">{getShortGradeLabel(student.grade)}</p>
                            <p className="text-gray-500 text-sm mt-2 text-center">
                              {student.achievement || t('outstanding_students.default_achievement')}
                            </p>
                            <button className="mt-4 text-[#18bebc] hover:text-teal-700 text-sm font-medium flex items-center">
                              {t('common.view_details')}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#165b9f] to-[#18bebc] h-2"></div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {activeStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button
                onClick={closeStudentDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center">
                  <div className="relative mb-4">
                    {activeStudent.photo_path ? (
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#18bebc]">
                        <img
                          src={getImageUrl(activeStudent.photo_path)}
                          alt={activeStudent.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = createPlaceholder(activeStudent.name);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[#165b9f] to-[#18bebc] flex items-center justify-center border-4 border-[#18bebc]">
                        <span className="text-white text-5xl font-bold">
                          {activeStudent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {renderStars(activeStudent.classRank)}
                    
                    <div className="absolute -bottom-2 -right-2 bg-[#18bebc] text-white text-md font-bold w-10 h-10 flex items-center justify-center rounded-full border-2 border-white">
                      {activeStudent.classRank}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="bg-[#18bebc] text-white text-lg font-medium px-4 py-2 rounded-full">
                      {formatMark(activeStudent.mark)}/20
                    </span>
                  </div>
                </div>

                <div className="md:w-2/3 md:pl-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {activeStudent.name}
                  </h2>

                  <div className="space-y-3">
                    {activeStudent.student_id && (
                      <p className="text-gray-700">
                        <span className="font-semibold">{t('student_details.student_id')}:</span>{" "}
                        {activeStudent.student_id}
                      </p>
                    )}

                    <p className="text-gray-700">
                      <span className="font-semibold">{t('student_details.grade')}:</span>{" "}
                      {getGradeLabel(activeStudent.grade)}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-semibold">{t('student_details.achievement')}:</span>{" "}
                      {activeStudent.achievement || t('outstanding_students.default_achievement')}
                    </p>

                    <div className="pt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t('student_details.recognition')}
                      </h3>
                      <p className="text-gray-600">
                        {t('student_details.recognition_text', {
                          rank: activeStudent.classRank,
                          grade: getShortGradeLabel(activeStudent.grade),
                          mark: formatMark(activeStudent.mark)
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#165b9f] to-[#18bebc] h-2"></div>
          </div>
        </div>
      )}
    </section>
  );
}