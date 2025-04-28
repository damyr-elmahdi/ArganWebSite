import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuizResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/attempts/${attemptId}/results`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load quiz results. Please try again.');
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [attemptId]);
  
  const calculatePercentage = () => {
    if (!results) return 0;
    const totalQuestions = results.answers.length;
    return Math.round((results.score / totalQuestions) * 100);
  };
  
  const getScoreMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 70) return 'Good job!';
    if (percentage >= 50) return 'Not bad!';
    return 'Keep practicing!';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading results...</h2>
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
            onClick={() => navigate('/student/dashboard')}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  if (!results) return null;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{results.quiz.title} - Results</h1>
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {results.score} / {results.answers.length}
          </div>
          <div className="text-xl mt-2">
            {calculatePercentage()}% - {getScoreMessage()}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-4">Question Review</h2>
        
        <div className="space-y-8">
          {results.answers.map((answer, index) => (
            <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Question {index + 1}</h3>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  answer.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {answer.is_correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p className="text-gray-800 mb-4">{answer.question.question_text}</p>
              
              <div className="space-y-2">
                {answer.question.options.map((option) => (
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
                      
                      <span>{option.option_text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/student/dashboard')}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}