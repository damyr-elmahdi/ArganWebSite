import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import NewsManagement from "../components/NewsManagement";
import EventsManagement from "../components/EventsManagement";
import TeacherQuizzes from "../components/TeacherQuizzes";
import QuizCreator from "../components/QuizCreator";
import TeacherResourceDashboard from "../components/TeacherResourceDashboard";

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'classes', 'quizzes', 'news', 'events', 'resources'
  const [showQuizCreator, setShowQuizCreator] = useState(false); // To toggle between quiz list and creator
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("/api/user");

        if (response.data.role !== "teacher") {
          navigate("/login");
          return;
        }

        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(t("dashboard.errors.failedToLoad"));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, t]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
      // Force logout on client side even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Handle quiz creation toggle
  const toggleQuizCreator = () => {
    setShowQuizCreator(!showQuizCreator);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return t("common.notSpecified");
    const date = new Date(dateString);
    const userLang = navigator.language || navigator.userLanguage || 'en-US';
    return date.toLocaleDateString(userLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t("dashboard.loading")}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <p>{t("dashboard.redirecting")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-grow bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("teacher.dashboard.title")}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {t("common.status")}:{" "}
              <span
                className={`font-medium ${
                  user.teacher?.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.teacher?.is_active ? t("absenceManagement.status.active") : t("status.inactive")}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
            >
              {t("common.logout")}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              className={`${
                activeTab === "profile"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("profile")}
            >
              {t("dashboard.tabs.profile")}
            </button>
            <button
              className={`${
                activeTab === "classes"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("classes")}
            >
              {t("dashboard.tabs.classes")}
            </button>
            <button
              className={`${
                activeTab === "quizzes"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab("quizzes");
                setShowQuizCreator(false); // Reset to quiz list view when switching to quizzes tab
              }}
            >
              {t("dashboard.tabs.quizzes")}
            </button>
            <button
              className={`${
                activeTab === "resources"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("resources")}
            >
              {t("dashboard.tabs.resources")}
            </button>
            <button
              className={`${
                activeTab === "news"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("news")}
            >
              {t("dashboard.tabs.news")}
            </button>
            <button
              className={`${
                activeTab === "events"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("events")}
            >
              {t("dashboard.tabs.events")}
            </button>
          </nav>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t("teacher.profile.title")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {t("teacher.profile.subtitle")}
                  </p>
                </div>

              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.fullName")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.email")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.employeeId")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.teacher?.employee_id || t("common.notAssigned")}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.department")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.teacher?.department || t("common.notAssigned")}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.position")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.teacher?.position || t("common.notSpecified")}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.specialization")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.teacher?.specialization || t("common.notSpecified")}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("teacher.profile.hireDate")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.teacher?.hire_date
                        ? formatDate(user.teacher.hire_date)
                        : t("common.notSpecified")}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("common.status")}
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.teacher?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.teacher?.is_active ? t("absenceManagement.status.active") : t("absenceManagement.status.inactive")}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === "classes" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t("teacher.classes.title")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {t("teacher.classes.subtitle")}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5">
                  <p className="text-sm text-gray-500">
                    {t("teacher.classes.noClassesYet")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div>
              {/* Quiz Creator Toggle Button */}
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => navigate("/teacher/quizzes/create")}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
                >
                  {t("quiz.teacher.createNew")}
                </button>
              </div>

              {/* Show Quiz List */}
              <TeacherQuizzes />
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && <TeacherResourceDashboard />}

          {/* News Management Tab */}
          {activeTab === "news" && <NewsManagement />}

          {/* Events Management Tab */}
          {activeTab === "events" && <EventsManagement />}
        </div>
      </main>
    </div>
  );
}