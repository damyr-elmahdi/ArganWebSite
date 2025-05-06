import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentQuizTab from '../components/StudentQuizTab';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'notifications', 'quizzes'
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
        setError('Failed to load dashboard. Please try logging in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
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
          <h2 className="text-xl font-semibold">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="flex-grow bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
          >
            Logout
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
              Profile
            </button>
            <button
              className={`${
                activeTab === "notifications"
                  ? "border-teal-400 text-[#18bebc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
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
              Quizzes
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Student Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and academic information.</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.student?.student_id}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Grade</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.student?.grade}</dd>
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
                        Teacher Absence Notifications
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Recent teacher absence announcements.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="text-sm text-[#18bebc] hover:text-teal-400"
                    >
                      View all
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
                                  Teacher {notification.teacher_name} will be absent
                                </p>
                                <p className="text-sm text-gray-500">
                                  From {new Date(notification.start_date).toLocaleDateString()} to {new Date(notification.end_date).toLocaleDateString()}
                                </p>
                                {notification.reason && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    Reason: {notification.reason}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-[#18bebc] hover:text-teal-400"
                              >
                                Mark as read
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Courses</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Current courses and progress.</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">You are not enrolled in any courses yet.</p>
                  </div>
                </div>
              </div>
              
              {/* Preview of available quizzes */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Available Quizzes</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Quizzes ready for you to take.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="text-sm text-[#18bebc] hover:text-teal-400"
                  >
                    View all quizzes
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5">
                    <p className="text-sm text-gray-500">Go to the Quizzes tab to view and take available quizzes.</p>
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
                  Teacher Absence Notifications
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  All teacher absence announcements.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {notificationsLoading ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">Loading notifications...</p>
                  </div>
                ) : absenceNotifications.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {absenceNotifications.map((notification) => (
                      <li key={notification.id} className={`px-4 py-4 ${!notification.is_read ? 'bg-teal-50' : ''}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Teacher {notification.teacher_name} will be absent
                            </p>
                            <p className="text-sm text-gray-500">
                              From {new Date(notification.start_date).toLocaleDateString()} to {new Date(notification.end_date).toLocaleDateString()}
                            </p>
                            {notification.reason && (
                              <p className="mt-1 text-sm text-gray-500">
                                Reason: {notification.reason}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                              Announced: {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-[#18bebc] hover:text-teal-400"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">No absence notifications at this time.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <StudentQuizTab />
          )}
        </div>
      </main>
    </div>
  );
}