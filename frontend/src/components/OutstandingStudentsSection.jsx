import { useState, useEffect } from "react";
import axios from "axios";

export default function OutstandingStudentsSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);

  // Function to get the label for a grade code
  const getGradeLabel = (gradeCode) => {
    const gradeOptions = [
      { value: "TC-S", label: "TC - Sciences" },
      { value: "TC-LSH", label: "TC - Lettres et Sciences Humaines" },
      { value: "1BAC-SE", label: "1BAC - Sciences Expérimentales" },
      { value: "1BAC-LSH", label: "1BAC - Lettres et Sciences Humaines" },
      { value: "2BAC-PC", label: "2BAC - PC (Physique-Chimie)" },
      {
        value: "2BAC-SVT",
        label: "2BAC - SVT (Sciences de la Vie et de la Terre)",
      },
      { value: "2BAC-SH", label: "2BAC - Sciences Humaines" },
      { value: "2BAC-L", label: "2BAC - Lettres" },
    ];

    const grade = gradeOptions.find((g) => g.value === gradeCode);
    return grade ? grade.label : gradeCode;
  };

  // Improved function to handle image URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // Direct URL case (from updated controller)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Handle both storage/path format and /storage/path format
    const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
    
    if (pathWithoutLeadingSlash.includes('storage/')) {
      // Extract the part after 'storage/'
      const pathAfterStorage = pathWithoutLeadingSlash.split('storage/')[1];
      return `${window.location.origin}/storage/${pathAfterStorage}`;
    }
    
    // Default case - just prepend with origin
    return `${window.location.origin}/${pathWithoutLeadingSlash}`;
  };

  useEffect(() => {
    const fetchOutstandingStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/outstanding-students");
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching outstanding students:", err);
        setError("Failed to load outstanding students");
        setLoading(false);
      }
    };

    fetchOutstandingStudents();
  }, []);

  // Function to open student details modal
  const openStudentDetails = (student) => {
    setActiveStudent(student);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  // Function to close student details modal
  const closeStudentDetails = () => {
    setActiveStudent(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Helper function to create placeholder image when image fails to load
  const createPlaceholderImage = (name) => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='36' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E${initial}%3C/text%3E%3C/svg%3E`;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Outstanding Students
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
            Outstanding Students
          </h2>
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
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
            Outstanding Students
          </h2>
          <div className="text-center py-8">
            No outstanding students to display at this time.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Outstanding Students
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Recognizing our top-performing students for their exceptional academic
          achievements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => openStudentDetails(student)}
            >
              <div className="relative h-48">
                {student.photo_path ? (
                  <img
                    src={getImageUrl(student.photo_path)}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = createPlaceholderImage(student.name);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#165b9f] to-[#18bebc] flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-0 right-0 m-2">
                  <span className="bg-[#18bebc] text-white text-sm font-medium px-3 py-1 rounded-full">
                    {student.mark}/20
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {student.name}
                </h3>
                <p className="text-gray-600">{getGradeLabel(student.grade)}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {student.achievement ||
                    "Performance académique exceptionnelle"}
                </p>
                <button className="mt-4 text-[#18bebc] hover:text-teal-700 text-sm font-medium flex items-center">
                  View Details
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
              <div className="bg-gradient-to-r from-[#165b9f] to-[#18bebc] h-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Details Modal */}
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
                <div className="md:w-1/3 mb-4 md:mb-0">
                  {activeStudent.photo_path ? (
                    <img
                      src={getImageUrl(activeStudent.photo_path)}
                      alt={activeStudent.name}
                      className="w-full h-auto rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = createPlaceholderImage(activeStudent.name);
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-r from-[#165b9f] to-[#18bebc] rounded-lg flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {activeStudent.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <span className="bg-[#18bebc] text-white text-lg font-medium px-4 py-2 rounded-full">
                      {activeStudent.mark}/20
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
                        <span className="font-semibold">Student ID:</span>{" "}
                        {activeStudent.student_id}
                      </p>
                    )}

                    <p className="text-gray-700">
                      <span className="font-semibold">Grade/Class:</span>{" "}
                      {getGradeLabel(activeStudent.grade)}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-semibold">Achievement:</span>{" "}
                      {activeStudent.achievement ||
                        "Performance académique exceptionnelle"}
                    </p>

                    <div className="pt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Recognition
                      </h3>
                      <p className="text-gray-600">
                        This student has demonstrated exceptional academic
                        performance, earning recognition among our outstanding
                        students with a remarkable score of {activeStudent.mark}
                        /20.
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