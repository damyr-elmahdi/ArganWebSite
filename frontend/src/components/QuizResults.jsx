import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

export default function QuizResults() {
  const { t } = useTranslation(); // Initialize translation hook
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/attempts/${attemptId}/results`);
        console.log('Quiz results data:', response.data); // Log the data for debugging
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(t('quiz_results.error_loading'));
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [attemptId, t]);
  
  const calculatePercentage = () => {
    if (!results || !results.answers || results.answers.length === 0) return 0;
    const totalQuestions = results.answers.length;
    return Math.round((results.score / totalQuestions) * 100);
  };
  
  const getScoreMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return t('quiz_results.score_excellent');
    if (percentage >= 70) return t('quiz_results.score_good');
    if (percentage >= 50) return t('quiz_results.score_not_bad');
    return t('quiz_results.score_keep_practicing');
  };
  
  // Function to determine if an answer was a time expired one
  const isTimeExpiredAnswer = (answer) => {
    return answer.selected_option_id === null && answer.is_correct === false;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('quiz_results.loading')}</h2>
          <div className="mt-4 w-12 h-12 border-4 border-[#18bebc] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700"
          >
            {t('common.return_to_dashboard')}
          </button>
        </div>
      </div>
    );
  }
  
  // Make sure we have valid results data before rendering
  if (!results) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{t('quiz_results.no_data')}</h2>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700"
          >
            {t('common.return_to_dashboard')}
          </button>
        </div>
      </div>
    );
  }
  
  if (!results.quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{t('quiz_results.quiz_not_available')}</h2>
          <p className="mt-2 text-gray-600">{t('quiz_results.quiz_not_loaded')}</p>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700"
          >
            {t('common.return_to_dashboard')}
          </button>
        </div>
      </div>
    );
  }
  
  if (!results.answers || results.answers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-yellow-600">{t('quiz_results.no_answers')}</h2>
          <p className="mt-2 text-gray-600">{t('quiz_results.no_answers_completed')}</p>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700"
          >
            {t('common.return_to_dashboard')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      {/* Check if the quiz was forcibly completed due to anti-cheat detection */}
      {results.forced_completion && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold">{t('quiz_results.anticheat_detected')}</h3>
          </div>
          <p className="mt-2">
            {t('quiz_results.anticheat_message')}
          </p>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{results.quiz.title} - {t('quiz_results.title')}</h1>
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {results.score} / {results.answers.length}
          </div>
          <div className="text-xl mt-2">
            {calculatePercentage()}% - {getScoreMessage()}
          </div>
          <div className="mt-2 text-gray-600">
            {t('quiz_results.completed_on', { date: new Date(results.completed_at).toLocaleString() })}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-4">{t('quiz_results.question_review')}</h2>
        
        <div className="space-y-8">
          {results.answers.map((answer, index) => (
            <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{t('quiz_results.question_number', { number: index + 1 })}</h3>
                <div className="flex items-center">
                  {/* Time expired badge */}
                  {isTimeExpiredAnswer(answer) && (
                    <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800 mr-2">
                      {t('quiz_results.time_expired')}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    answer.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {answer.is_correct ? t('quiz_results.correct') : t('quiz_results.incorrect')}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">{answer.question?.question_text || t('quiz_results.question_not_available')}</p>
              
              <div className="space-y-2">
                {answer.question?.options?.map((option) => (
                  <div 
                    key={option.id} 
                    className={`p-3 rounded-md ${
                      option.is_correct 
                        ? 'bg-green-100 border border-green-500' 
                        : option.id === answer.selected_option_id && !answer.is_correct
                          ? 'bg-red-100 border border-red-500'
                          : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {option.is_correct && (
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      
                      {!option.is_correct && option.id === answer.selected_option_id && (
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      
                      {/* Special indicator for time expired - no option selected */}
                      {isTimeExpiredAnswer(answer) && option.is_correct && (
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                        </svg>
                      )}
                      
                      <span>{option.option_text}</span>
                    </div>
                  </div>
                )) || <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">{t('quiz_results.options_not_available')}</div>}
              </div>
              
              {/* Message for time expired questions */}
              {isTimeExpiredAnswer(answer) && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {t('quiz_results.time_expired_message')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/student-dashboard')}
          className="px-6 py-3 bg-[#18bebc] text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          {t('common.return_to_dashboard')}
        </button>
        <button 
          onClick={() => window.print()}
          className="ml-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
        >
          {t('quiz_results.print_results')}
        </button>
      </div>
      
      {/* Add some print-friendly styles */}
      <style jsx="true">{`
        @media print {
          body {
            padding: 20px;
            font-size: 14px;
          }
          button {
            display: none !important;
          }
          .shadow-md {
            box-shadow: none !important;
          }
          /* Print-specific styling */
          .print-header {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}