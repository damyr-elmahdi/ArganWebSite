import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
    // Student fields
    grade: "",
    stream: "",
    // Teacher fields
    employee_id: "",
    department: "",
    position: "",
    specialization: "",
    hire_date: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Get the available streams based on the selected grade
  const getStreamsForGrade = (grade) => {
    switch (grade) {
      case "TC":
        return [
          { value: "S", label: "Sciences" },
          { value: "LSH", label: "Lettres et Sciences Humaines" },
        ];
      case "1BAC":
        return [
          { value: "SE", label: "Sciences Expérimentales" },
          { value: "LSH", label: "Lettres et Sciences Humaines" },
        ];
      case "2BAC":
        return [
          { value: "PC", label: "PC (Physique-Chimie)" },
          { value: "SVT", label: "SVT (Sciences de la Vie et de la Terre)" },
          { value: "SH", label: "Sciences Humaines" },
          { value: "L", label: "Lettres" },
        ];
      default:
        return [];
    }
  };

  // Available departments for teachers
  const departments = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Languages", label: "Languages" },
    { value: "Social Studies", label: "Social Studies" },
    { value: "Arts", label: "Arts" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Islamic Studies", label: "Islamic Studies" },
  ];

  // Available positions for teachers
  const positions = [
    { value: "Teacher", label: "Teacher" },
    { value: "Head of Department", label: "Head of Department" },
    { value: "Coordinator", label: "Coordinator" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Reset stream when grade changes
      if (name === "grade") {
        newData.stream = "";
      }

      return newData;
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Prepare data for submission
    const dataToSubmit = { ...formData };

    // Format student data
    if (formData.role === "student" && formData.grade && formData.stream) {
      dataToSubmit.grade = `${formData.grade}-${formData.stream}`;
      delete dataToSubmit.stream;
    }

    // Remove irrelevant fields based on role
    if (formData.role === "student") {
      delete dataToSubmit.employee_id;
      delete dataToSubmit.department;
      delete dataToSubmit.position;
      delete dataToSubmit.specialization;
      delete dataToSubmit.hire_date;
    } else if (formData.role === "teacher") {
      delete dataToSubmit.grade;
      delete dataToSubmit.stream;
    } else {
      // For administrators
      delete dataToSubmit.employee_id;
      delete dataToSubmit.department;
      delete dataToSubmit.position;
      delete dataToSubmit.specialization;
      delete dataToSubmit.hire_date;
      delete dataToSubmit.grade;
      delete dataToSubmit.stream;
    }

    try {
      const response = await axios.post("/api/register", dataToSubmit);

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set default Authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Redirect based on user role
      const { role } = response.data.user;
      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "administrator") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.errors
      ) {
        // Handle validation errors
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const streams = getStreamsForGrade(formData.grade);

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Register</h2>
          <p className="mt-2 text-gray-600">
            Create your Argan High School account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                I am a:
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>

            {/* Student-specific fields */}
            {formData.role === "student" && (
              <>
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade Level
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    value={formData.grade}
                    onChange={handleChange}
                    disabled={isLoading}
                    required={formData.role === "student"}
                  >
                    <option value="">Select Grade</option>
                    <option value="TC">TC (Tronc Commun)</option>
                    <option value="1BAC">
                      1BAC (Première année Baccalauréat)
                    </option>
                    <option value="2BAC">
                      2BAC (Deuxième année Baccalauréat)
                    </option>
                  </select>
                </div>

                {formData.grade && streams.length > 0 && (
                  <div>
                    <label
                      htmlFor="stream"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stream
                    </label>
                    <select
                      id="stream"
                      name="stream"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                      value={formData.stream}
                      onChange={handleChange}
                      disabled={isLoading}
                      required={formData.grade !== ""}
                    >
                      <option value="">Select Stream</option>
                      {streams.map((stream) => (
                        <option key={stream.value} value={stream.value}>
                          {stream.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Teacher-specific fields */}
            {formData.role === "teacher" && (
              <>
                <div>
                  <label
                    htmlFor="employee_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee ID
                  </label>
                  <input
                    id="employee_id"
                    name="employee_id"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    placeholder="T00000"
                    value={formData.employee_id}
                    onChange={handleChange}
                    disabled={isLoading}
                    required={formData.role === "teacher"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: T followed by 5 digits (e.g., T10001)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isLoading}
                    required={formData.role === "teacher"}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    placeholder="e.g., Algebra, Physics, French Literature"
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="hire_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hire Date
                  </label>
                  <input
                    id="hire_date"
                    name="hire_date"
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-400 focus:border-teal-400"
                    value={formData.hire_date}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-[#18bebc] focus:ring-teal-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-[#18bebc] hover:text-teal-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#18bebc] hover:text-teal-400">
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#18bebc] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#18bebc] hover:text-teal-400"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
