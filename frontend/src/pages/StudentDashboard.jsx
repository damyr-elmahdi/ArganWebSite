import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import StudentQuizTab from '../components/StudentQuizTab';
import StudentExamView from '../components/exam/StudentExamView';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'notifications', 'quizzes', 'exams'
  const [absenceNotifications, setAbsenceNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/user');
        
        if (response.data.role !== 'student') {
          navigate('/login');
          return;
        }
        
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(t('dashboard.errors.failedToLoad'));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, t]);
  
  // Fetch absence notifications when dashboard loads
  useEffect(() => {
    const fetchAbsenceNotifications = async () => {
      if (!user) return;
      
      try {
        setNotificationsLoading(true);
        const response = await axios.get('/api/absence-notifications');
        setAbsenceNotifications(response.data);
      } catch (err) {
        console.error('Error fetching absence notifications:', err);
      } finally {
        setNotificationsLoading(false);
      }
    };
    
    fetchAbsenceNotifications();
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      // Force logout on client side even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/absence-notifications/${notificationId}/read`);
      // Update the local state
      setAbsenceNotifications(
        absenceNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const getUnreadNotificationsCount = () => {
    return absenceNotifications.filter(notification => !notification.is_read).length;
  };
  
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('dashboard.loading')}</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <p>{t('dashboard.redirecting')}</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="flex-grow bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
          >
            {t('common.logout')}
          </button>
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
              {t('dashboard.tabs.profile')}
            </button>
            <button
              className={`${
                activeTab === "notifications"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab("notifications")}
            >
              {t('dashboard.tabs.notifications')}
              {getUnreadNotificationsCount() > 0 && (
                <span className="ml-2 bg-[#18bebc] text-white text-xs rounded-full px-2 py-1">
                  {getUnreadNotificationsCount()}
                </span>
              )}
            </button>
            <button
              className={`${
                activeTab === "quizzes"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("quizzes")}
            >
              {t('dashboard.tabs.quizzes')}
            </button>
            <button
              className={`${
                activeTab === "exams"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("exams")}
            >
              {t('dashboard.tabs.exams')}
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t('dashboard.profile.title')}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('dashboard.profile.subtitle')}</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{t('dashboard.profile.fullName')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{t('dashboard.profile.email')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{t('dashboard.profile.studentId')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.student?.student_id}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{t('dashboard.profile.grade')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.student?.grade}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{t('dashboard.profile.class')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.student?.class_code}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Show latest 3 unread notifications if any */}
              {getUnreadNotificationsCount() > 0 && (
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('dashboard.notifications.title')}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {t('dashboard.notifications.subtitle')}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="text-sm text-[#18bebc] hover:text-teal-400"
                    >
                      {t('dashboard.notifications.viewAll')}
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {absenceNotifications
                        .filter(notification => !notification.is_read)
                        .slice(0, 3)
                        .map((notification) => (
                          <li key={notification.id} className="px-4 py-4">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {t('dashboard.notifications.teacherAbsent', { teacherName: notification.teacher_name })}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {t('dashboard.notifications.dateRange', {
                                    startDate: new Date(notification.start_date).toLocaleDateString(),
                                    endDate: new Date(notification.end_date).toLocaleDateString()
                                  })}
                                </p>
                                {notification.reason && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {t('dashboard.notifications.reason', { reason: notification.reason })}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-[#18bebc] hover:text-teal-400"
                              >
                                {t('dashboard.notifications.markAsRead')}
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Placeholder for courses section */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t('dashboard.courses.title')}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('dashboard.courses.subtitle')}</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">{t('dashboard.courses.notEnrolled')}</p>
                  </div>
                </div>
              </div>
              
              {/* Preview of available quizzes */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{t('dashboard.quizzes.title')}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('dashboard.quizzes.subtitle')}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="text-sm text-[#18bebc] hover:text-teal-400"
                  >
                    {t('dashboard.quizzes.viewAll')}
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">{t('dashboard.quizzes.goToTab')}</p>
                  </div>
                </div>
              </div>
              
              {/* Preview of available exams */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{t('dashboard.exams.title')}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('dashboard.exams.subtitle')}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('exams')}
                    className="text-sm text-[#18bebc] hover:text-teal-400"
                  >
                    {t('dashboard.exams.viewAll')}
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">{t('dashboard.exams.goToTab')}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('dashboard.notifications.title')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {t('dashboard.notifications.allAnnouncements')}
                </p>
              </div>
              <div className="border-t border-gray-200">
                {notificationsLoading ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">{t('dashboard.notifications.loading')}</p>
                  </div>
                ) : absenceNotifications.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {absenceNotifications.map((notification) => (
                      <li key={notification.id} className={`px-4 py-4 ${!notification.is_read ? 'bg-teal-50' : ''}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {t('dashboard.notifications.teacherAbsent', { teacherName: notification.teacher_name })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('dashboard.notifications.dateRange', {
                                startDate: new Date(notification.start_date).toLocaleDateString(),
                                endDate: new Date(notification.end_date).toLocaleDateString()
                              })}
                            </p>
                            {notification.reason && (
                              <p className="mt-1 text-sm text-gray-500">
                                {t('dashboard.notifications.reason', { reason: notification.reason })}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                              {t('dashboard.notifications.announced', {
                                date: new Date(notification.created_at).toLocaleString()
                              })}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-[#18bebc] hover:text-teal-400"
                            >
                              {t('dashboard.notifications.markAsRead')}
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">{t('dashboard.notifications.noNotifications')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <StudentQuizTab />
          )}
          
          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <StudentExamView />
          )}
        </div>
      </main>
    </div>
  );
}