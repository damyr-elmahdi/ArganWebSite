import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import NewsManagement from "../components/NewsManagement";
import EventsManagement from "../components/EventsManagement";
import AbsenceManagement from "../components/AbsenceManagement";
import UserManagement from "../components/UserManagement";
import ClubManagement from "../components/ClubManagement";
import OutstandingStudentsManagement from "../components/OutstandingStudentsManagement";
import ExamManagement from "../components/exam/ExamManagement";

export default function AdminDashboard() {
  const { t } = useTranslation(); // Initialize the translation hook
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'registrations', 'news', 'events', 'absences', 'users', 'clubs', 'outstanding', 'exams'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Get user data
        const userResponse = await axios.get("/api/user");

        if (userResponse.data.role !== "administrator") {
          navigate("/login");
          return;
        }

        setUser(userResponse.data);

        // Get registrations
        try {
          const registrationsResponse = await axios.get("/api/registrations");
          // Handle both pagination format and direct array format
          if (registrationsResponse.data && registrationsResponse.data.data) {
            // Pagination object response
            setRegistrations(registrationsResponse.data.data);
          } else if (Array.isArray(registrationsResponse.data)) {
            // Direct array response
            setRegistrations(registrationsResponse.data);
          } else {
            // Empty response
            setRegistrations([]);
          }
        } catch (registrationsError) {
          console.error("Error fetching registrations:", registrationsError);
          console.error("Response data:", registrationsError.response?.data);
          // We don't redirect here, just show the error in the registrations section
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(t("admin.error.failedToLoad"));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleMarkProcessed = async (registrationId) => {
    try {
      await axios.patch(`/api/registrations/${registrationId}/mark-processed`);
      // Update local state
      setRegistrations(
        registrations.map((reg) =>
          reg.id === registrationId ? { ...reg, processed: true } : reg
        )
      );
    } catch (err) {
      console.error("Error marking registration as processed:", err);
      alert(t("admin.error.failedToUpdateRegistration"));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("common.na");
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t("admin.loading")}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <p>{t("admin.redirecting")}</p>
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
            {t("admin.dashboard.title")}
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
          >
            {t("common.logout")}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button
              className={`${
                activeTab === "profile"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("profile")}
            >
              {t("admin.tabs.profile")}
            </button>
            <button
              className={`${
                activeTab === "users"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("users")}
            >
              {t("admin.tabs.userManagement")}
            </button>
            <button
              className={`${
                activeTab === "registrations"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("registrations")}
            >
              {t("admin.tabs.registrations")}
            </button>
            <button
              className={`${
                activeTab === "news"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("news")}
            >
              {t("admin.tabs.newsManagement")}
            </button>
            <button
              className={`${
                activeTab === "events"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("events")}
            >
              {t("admin.tabs.eventsManagement")}
            </button>
            <button
              className={`${
                activeTab === "exams"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("exams")}
            >
              {t("admin.tabs.examManagement")}
            </button>
            <button
              className={`${
                activeTab === "absences"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("absences")}
            >
              {t("admin.tabs.teacherAbsences")}
            </button>
            <button
              className={`${
                activeTab === "clubs"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("clubs")}
            >
              {t("admin.tabs.clubs")}
            </button>
            <button
              className={`${
                activeTab === "outstanding"
                  ? "border-teal-500 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("outstanding")}
            >
              {t("admin.tabs.outstandingStudents")}
            </button>
          </nav>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t("admin.profile.title")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {t("admin.profile.subtitle")}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("admin.profile.fullName")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("admin.profile.emailAddress")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("admin.profile.adminLevel")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.administrator?.admin_level || t("admin.profile.basic")}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("admin.profile.department")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.administrator?.department || t("admin.profile.general")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && <UserManagement />}

          {/* Registrations Tab */}
          {activeTab === "registrations" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t("admin.registrations.title")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {t("admin.registrations.subtitle")}
                </p>
              </div>
              <div className="border-t border-gray-200">
                {registrations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("admin.registrations.table.name")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("admin.registrations.table.studentPhone")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("admin.registrations.table.registrationDate")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("admin.registrations.table.status")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("admin.registrations.table.actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {registrations.map((registration) => (
                          <tr key={registration.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {registration.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {registration.student_phone || t("common.na")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(registration.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {registration.processed ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {t("admin.registrations.status.processed")}
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {t("admin.registrations.status.pending")}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {registration.info_packet_path && (
                                <a
                                  href={`/api/registrations/${registration.id}/download-packet`}
                                  className="text-[#18bebc] hover:text-teal-900 mr-4"
                                >
                                  {t("admin.registrations.actions.downloadPacket")}
                                </a>
                              )}
                              {!registration.processed && (
                                <button
                                  onClick={() =>
                                    handleMarkProcessed(registration.id)
                                  }
                                  className="text-[#18bebc] hover:text-teal-900"
                                >
                                  {t("admin.registrations.actions.markProcessed")}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">
                      {t("admin.registrations.noRegistrations")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* News Management Tab */}
          {activeTab === "news" && <NewsManagement />}

          {/* Events Management Tab */}
          {activeTab === "events" && <EventsManagement />}

          {/* Exam Management Tab */}
          {activeTab === "exams" && <ExamManagement />}

          {/* Teacher Absences Tab */}
          {activeTab === "absences" && <AbsenceManagement />}
          
          {/* Club Management Tab */}
          {activeTab === "clubs" && <ClubManagement />}
          
          {/* Outstanding Students Management Tab */}
          {activeTab === "outstanding" && <OutstandingStudentsManagement />}
        </div>
      </main>
    </div>
  );
}