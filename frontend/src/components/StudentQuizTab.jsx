import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizList from './QuizList';

export default function StudentQuizTab() {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get('/api/user/quiz-attempts');
        setQuizAttempts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz attempts:', err);
        setError('Failed to load quiz history.');
        setLoading(false);
      }
    };
    
    fetchAttempts();
  }, []);
  
  return (
    <div className="space-y-6">
      <QuizList />
      
      {/* Quiz History Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <p>Loading your quiz history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : quizAttempts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">You haven't taken any quizzes yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizAttempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attempt.quiz.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attempt.score} / {attempt.quiz.questions.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={`/student/quiz-results/${attempt.id}`} 
                        className="text-[#18bebc] hover:text-teal-800"
                      >
                        View Results
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}