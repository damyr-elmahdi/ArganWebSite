import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuizResultsViewer() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(quizResponse.data);
        
        // Fetch quiz attempts
        const attemptsResponse = await axios.get(`/api/results?quiz_id=${quizId}`);
        setAttempts(attemptsResponse.data.data); // Assuming paginated response
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError('Failed to load quiz information. Please try again.');
        setLoading(false);
      }
    };
    
    fetchQuizAndAttempts();
  }, [quizId]);
  
  const viewAttemptDetails = async (attemptId) => {
    setSelectedAttempt(attemptId);
    setDetailsLoading(true);
    
    try {
      const response = await axios.get(`/api/results/${attemptId}`);
      setAttemptDetails(response.data);
      setDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching attempt details:', err);
      setError('Failed to load attempt details. Please try again.');
      setDetailsLoading(false);
    }
  };

  // Helper function to determine if an answer was a time expiration (no selected option)
  const isTimeExpired = (answer) => {
    return answer.selected_option_id === null;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading quiz results...</h2>
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
            onClick={() => navigate('/teacher/quizzes')}
            className="mt-4 px-4 py-2 bg-[#18bebc] text-white rounded hover:bg-teal-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }
  
  if (!quiz) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title} - Results</h2>
          <p className="text-gray-500">View all student attempts for this quiz</p>
        </div>
        <button
          onClick={() => navigate('/teacher/quizzes')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to Quizzes
        </button>
      </div>
      
      {attempts.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No students have attempted this quiz yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Attempts list */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Student Attempts
                </h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {attempts.map((attempt) => (
                  <li 
                    key={attempt.id}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                      selectedAttempt === attempt.id ? 'bg-teal-50' : ''
                    }`}
                    onClick={() => viewAttemptDetails(attempt.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {attempt.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(attempt.completed_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                          (attempt.score / (quiz.questions ? quiz.questions.length : 0)) >= 0.7
                            ? 'bg-green-100 text-green-800'
                            : (attempt.score / (quiz.questions ? quiz.questions.length : 0)) >= 0.4
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.score} / {quiz.questions ? quiz.questions.length : "?"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right column - Attempt details */}
          <div className="lg:col-span-2">
            {selectedAttempt ? (
              detailsLoading ? (
                <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
                  <p>Loading attempt details...</p>
                </div>
              ) : attemptDetails ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {attemptDetails.user.name}'s Answers
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Completed on {new Date(attemptDetails.completed_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">
                          {attemptDetails.score} / {quiz.questions ? quiz.questions.length : attemptDetails.answers.length}
                        </span>
                        <p className="text-sm text-gray-500 text-right">
                          {Math.round((attemptDetails.score / (quiz.questions ? quiz.questions.length : attemptDetails.answers.length)) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Legend for answer status */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium mb-2">Answer Legend:</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></span>
                        <span className="text-sm">Correct Answer</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></span>
                        <span className="text-sm">Incorrect Answer</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></span>
                        <span className="text-sm">Time Expired (Missed)</span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                    {attemptDetails.answers.map((answer, index) => (
                      <li key={answer.id} className="p-4">
                        <div className="mb-2">
                          <span className="font-medium">Question {index + 1}: </span>
                          <span>{answer.question.question_text}</span>
                          
                          {/* Time expired indicator */}
                          {isTimeExpired(answer) && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Time Expired
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {answer.question.options.map((option) => {
                            // Determine the appropriate styling class
                            let optionClass = "bg-gray-50 border border-gray-200";
                            
                            if (option.is_correct) {
                              optionClass = "bg-green-50 border border-green-300";
                            } else if (answer.selected_option_id === option.id) {
                              optionClass = "bg-red-50 border border-red-300";
                            } else if (isTimeExpired(answer) && option.is_correct) {
                              optionClass = "bg-blue-50 border border-blue-300";
                            }
                            
                            return (
                              <div 
                                key={option.id} 
                                className={`p-3 rounded-md ${optionClass}`}
                              >
                                <div className="flex items-start">
                                  {option.is_correct && (
                                    <span className="text-green-500 mr-2">✓</span>
                                  )}
                                  {!option.is_correct && answer.selected_option_id === option.id && (
                                    <span className="text-red-500 mr-2">✗</span>
                                  )}
                                  <span>{option.option_text || "No text available"}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <p className="text-gray-500">Select a student attempt to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}