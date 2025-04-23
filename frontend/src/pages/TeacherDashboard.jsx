import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsManagement from '../components/NewsManagement';
import EventsManagement from '../components/EventsManagement';

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'classes', 'quizzes', 'news', 'events'
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
        
        if (response.data.role !== 'teacher') {
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
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Status: <span className={`font-medium ${user.teacher?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user.teacher?.is_active ? 'Active' : 'Inactive'}
              </span>
            </span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Logout
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
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`${
                activeTab === 'classes'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('classes')}
            >
              Classes
            </button>
            <button
              className={`${
                activeTab === 'quizzes'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
            <button
              className={`${
                activeTab === 'news'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('news')}
            >
              News
            </button>
            <button
              className={`${
                activeTab === 'events'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
          </nav>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Teacher Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and professional information.</p>
                </div>
                <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                  Edit Profile
                </button>
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
                    <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.teacher?.employee_id || 'Not assigned'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.teacher?.department || 'Not assigned'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Position</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.teacher?.position || 'Not specified'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.teacher?.specialization || 'Not specified'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.teacher?.hire_date ? formatDate(user.teacher.hire_date) : 'Not specified'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.teacher?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.teacher?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
          
          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Classes</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Courses you're teaching.</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5">
                  <p className="text-sm text-gray-500">No classes assigned yet.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Quizzes</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Assessments you've created.</p>
                </div>
                <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                  Create Quiz
                </button>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5">
                  <p className="text-sm text-gray-500">No quizzes created yet.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* News Management Tab */}
          {activeTab === 'news' && <NewsManagement />}
          
          {/* Events Management Tab */}
          {activeTab === 'events' && <EventsManagement />}
        </div>
      </main>
    </div>
  );
}