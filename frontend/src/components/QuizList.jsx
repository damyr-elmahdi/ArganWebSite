import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/api/quizzes');
        setQuizzes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError(t('errors.failedToLoadQuizzes'));
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [t]);
  
  const handleStartQuiz = (quizId) => {
    navigate(`/student/take-quiz/${quizId}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('quizList.loading')}</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
        </div>
      </div>
    );
  }
  
  if (quizzes.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700">{t('quizList.noQuizzes')}</h2>
          <p className="text-gray-500 mt-2">{t('quizList.checkBackLater')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{t('quizList.availableQuizzes')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div 
            key={quiz.id} 
            className="border border-gray-200 rounded-lg p-4 hover:border-teal-400 transition-colors"
          >
            <h3 className="text-lg font-medium">{quiz.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {t('quizList.questionCount', { count: quiz.questions.length })}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                {t('quizList.time', { seconds: quiz.questions.length * 20 })}
              </p>
              <button
                onClick={() => handleStartQuiz(quiz.id)}
                className="mt-3 w-full px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700 flex items-center justify-center"
              >
                <span>{t('quizList.startQuiz')}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}