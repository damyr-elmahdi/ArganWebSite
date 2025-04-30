import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function QuizTaking() {
  // Get quizId from URL parameters
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true); // For animation
  const [isTimeUp, setIsTimeUp] = useState(false); // Time up state
  
  // Anti-cheat related states
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const MAX_VIOLATIONS = 3; // Maximum number of violations before auto-submit
  
  const timerRef = useRef(null);
  const processingTimeUp = useRef(false);
  const navigate = useNavigate();

  // Fetch quiz data and start attempt
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch quiz data
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);

        // Start quiz attempt
        const startResponse = await axios.post(`/api/quizzes/${quizId}/start`);
        setAttemptId(startResponse.data.attempt_id);

        setLoading(false);
      } catch (err) {
        console.error("Error starting quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuiz();
    
    // Set up anti-cheat listeners when component mounts
    setupAntiCheatListeners();
    
    // Clean up listeners when component unmounts
    return () => {
      removeAntiCheatListeners();
    };
  }, [quizId]);

  // Anti-cheat listeners setup
  const setupAntiCheatListeners = () => {
    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Listen for window blur (when user switches to another application)
    window.addEventListener("blur", handleWindowBlur);
    
    // Block right-click context menu
    document.addEventListener("contextmenu", handleContextMenu);
    
    // Block keyboard shortcuts that could be used for cheating
    document.addEventListener("keydown", handleKeyDown);
  };
  
  // Remove anti-cheat listeners
  const removeAntiCheatListeners = () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
  };
  
  // Handle tab visibility change
  const handleVisibilityChange = () => {
    if (document.hidden && !quizCompleted && attemptId) {
      recordViolation("Tab switched");
    }
  };
  
  // Handle window blur
  const handleWindowBlur = () => {
    if (!quizCompleted && attemptId) {
      recordViolation("Window unfocused");
    }
  };
  
  // Prevent context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };
  
  // Block certain keyboard shortcuts
  const handleKeyDown = (e) => {
    // Block Alt+Tab, Ctrl+Tab, Alt+F4, etc.
    if (
      (e.altKey && (e.key === "Tab" || e.key === "F4")) ||
      (e.ctrlKey && (e.key === "Tab" || e.key === "t" || e.key === "n")) ||
      e.key === "F12" || // Developer tools
      (e.ctrlKey && e.shiftKey && e.key === "I") // Developer tools
    ) {
      e.preventDefault();
      recordViolation("Keyboard shortcut attempt");
      return false;
    }
  };
  
  // Record a violation and check if we should auto-submit
  const recordViolation = (type) => {
    if (autoSubmitting) return; // Don't record violations if already auto-submitting
    
    const newViolations = violations + 1;
    setViolations(newViolations);
    console.warn(`Quiz violation detected: ${type}. Violation ${newViolations}/${MAX_VIOLATIONS}`);
    
    // Show warning
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000); // Hide warning after 5 seconds
    
    // Auto-submit if too many violations
    if (newViolations >= MAX_VIOLATIONS) {
      setAutoSubmitting(true);
      alert("Multiple attempts to leave the quiz detected. Your quiz will be submitted automatically.");
      completeQuiz(true); // Force complete with cheating flag
    }
  };

  // Timer effect
  useEffect(() => {
    if (loading || answerSubmitted || quizCompleted || processingTimeUp.current) return;

    // Reset timer when question changes
    setSecondsLeft(20);
    setIsTimeUp(false);

    // Start countdown
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Time's up - handle as wrong answer
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, loading, answerSubmitted, quizCompleted]);

  // Handle when time runs out
  const handleTimeUp = async () => {
    if (!quiz || answerSubmitted || processingTimeUp.current) return;
    
    processingTimeUp.current = true;
    clearInterval(timerRef.current);
    setAnswerSubmitted(true);
    setIsTimeUp(true);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    try {
      // Find the correct option for display purposes
      const correctOption = currentQuestion.options.find(option => option.is_correct);
      
      // Set answer result to show the correct answer
      setAnswerResult({
        is_correct: false,
        correct_option_id: correctOption?.id,
        time_expired: true  // Add this flag to track that time expired
      });

      // Submit a "time expired" answer with no selected option
      const payload = {
        question_id: currentQuestion.id,
        selected_option_id: null,  // No option selected
        time_expired: true  // Flag to indicate time expired
      };

      await axios.post(`/api/attempts/${attemptId}/answer`, payload);

      // Move to next question after delay
      setTimeout(() => {
        processingTimeUp.current = false;
        moveToNextQuestion();
      }, 3000); // Give slightly longer delay so user can see the correct answer
    } catch (err) {
      console.error("Error submitting time-up answer:", err);
      setError("Failed to submit answer. Please try again.");
      setAnswerSubmitted(false);
      processingTimeUp.current = false;
    }
  };

  // Handle option selection
  const handleOptionSelect = async (optionId) => {
    if (answerSubmitted || !attemptId || processingTimeUp.current) return;

    clearInterval(timerRef.current);
    setSelectedOption(optionId);
    setAnswerSubmitted(true);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    try {
      // First find if this is the correct option before API call for immediate feedback
      const selectedOption = currentQuestion.options.find(
        (option) => option.id === optionId
      );
      const isCorrect = selectedOption?.is_correct || false;

      // Set answer result immediately based on client-side data
      setAnswerResult({
        is_correct: isCorrect,
        correct_option_id: currentQuestion.options.find(
          (option) => option.is_correct
        )?.id
      });

      // Update score if correct
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      const payload = {
        question_id: currentQuestion.id,
        selected_option_id: optionId
      };

      // Send API request in background
      const response = await axios.post(
        `/api/attempts/${attemptId}/answer`,
        payload
      );

      // Just verify our client-side assessment was correct (for data integrity)
      if (response.data.is_correct !== isCorrect) {
        console.warn("Client/server mismatch in answer correctness");
        setAnswerResult({
          is_correct: response.data.is_correct,
          correct_option_id: response.data.correct_option_id,
        });

        // Adjust score if needed
        if (response.data.is_correct && !isCorrect) {
          setScore((prev) => prev + 1);
        } else if (!response.data.is_correct && isCorrect) {
          setScore((prev) => Math.max(0, prev - 1));
        }
      }

      // Move to next question after 2 seconds
      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
      setAnswerSubmitted(false);
    }
  };

  // Move to the next question or finish quiz
  const moveToNextQuestion = () => {
    // Apply exit animation
    setShowQuestion(false);
    
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setAnswerSubmitted(false);
        setAnswerResult(null);
        setIsTimeUp(false); // Reset time up state
        // Apply entrance animation after a brief delay
        setTimeout(() => setShowQuestion(true), 100);
      } else {
        // Quiz finished
        completeQuiz();
      }
    }, 500); // Wait for exit animation to complete
  };

  // Complete the quiz and navigate to results
  const completeQuiz = async (forcedByCheat = false) => {
    try {
      setQuizCompleted(true);
      
      // Add a flag if this was forced by cheating detection
      const completePayload = forcedByCheat ? { forced_completion: true } : {};
      await axios.post(`/api/attempts/${attemptId}/complete`, completePayload);
      
      // Navigate to results page
      navigate(`/student/quiz-results/${attemptId}`);
    } catch (err) {
      console.error("Error completing quiz:", err);
      setError("Failed to complete quiz. Please try again.");
    }
  };

  // Listen for browser closing/refreshing attempts
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!quizCompleted && attemptId) {
        // Cancel the event as stated by the standard
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = 'Are you sure you want to leave? Your quiz will be submitted automatically.';
        
        // Try to submit the quiz
        completeQuiz(true);
        
        // This is to give time for the quiz to be submitted
        // However, this won't reliably work for all browser closing scenarios
        const startTime = Date.now();
        while (Date.now() - startTime < 1000) {
          // Busy wait to give the request time to fire
          // This is a hack and won't be reliable for all cases
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizCompleted, attemptId]);

  // Calculate timer circle progress
  const calculateTimerProgress = () => {
    const totalTime = 20; // Total time in seconds
    return ((totalTime - secondsLeft) / totalTime) * 100;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (secondsLeft > 10) return "#4ade80"; // Green
    if (secondsLeft > 5) return "#facc15"; // Yellow
    return "#ef4444"; // Red
  };

  // Calculate clock hands rotation angle based on time remaining
  const calculateHourHandAngle = () => {
    const totalTime = 20;
    const elapsed = totalTime - secondsLeft;
    return (elapsed / totalTime) * 360;
  };

  const calculateMinuteHandAngle = () => {
    const totalTime = 20;
    const elapsed = totalTime - secondsLeft;
    return (elapsed / totalTime) * 360 * 2; // 2x speed of hour hand
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading quiz...</h2>
          <div className="mt-4 w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
            onClick={() => navigate("/student-dashboard")}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Quiz not found or has no questions.
          </h2>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      {/* Anti-cheat warning */}
      {showWarning && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white py-3 px-6 text-center z-50 animate-slideDown">
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-bold">Warning: Attempting to leave the quiz is not allowed.</span>
            <span className="ml-2">
              Violation {violations}/{MAX_VIOLATIONS}
            </span>
          </div>
          <div className="text-sm mt-1">
            Your quiz will be automatically submitted after {MAX_VIOLATIONS} violations.
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <div className="flex items-center">
          <span className="mr-4 font-medium">
            Question {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>

          {/* Clock Timer */}
          <div className="relative w-16 h-16">
            {/* Circular progress bar */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle with stroke-dasharray animation */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getTimerColor()}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={
                  (283 * (100 - calculateTimerProgress())) / 100
                }
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Center clock face */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              {/* Clock hands */}
              <div className="relative w-8 h-8">
                <div
                  className="absolute w-1 h-3 bg-gray-800 left-1/2 top-1/2 -ml-0.5 -mt-3 origin-bottom transform"
                  style={{
                    transform: `translateX(-50%) rotate(${calculateHourHandAngle()}deg)`,
                  }}
                ></div>
                <div
                  className="absolute w-0.5 h-2 bg-gray-600 left-1/2 top-1/2 -ml-0.5 -mt-2 origin-bottom transform"
                  style={{
                    transform: `translateX(-50%) rotate(${calculateMinuteHandAngle()}deg)`,
                  }}
                ></div>
                <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Digital timer */}
            <div
              className={`absolute bottom-0 left-0 w-full text-center text-sm font-bold ${
                secondsLeft <= 5
                  ? "text-red-600 animate-pulse"
                  : "text-gray-800"
              }`}
            >
              {secondsLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Question content with fade animations */}
      <div
        className={`transition-opacity duration-500 ${
          showQuestion ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() =>
                  !answerSubmitted && handleOptionSelect(option.id)
                }
                disabled={answerSubmitted}
                className={`w-full text-left p-4 border rounded-lg transition-all duration-300 
                  ${
                    answerSubmitted
                      ? option.id === answerResult?.correct_option_id
                        ? "bg-green-100 border-green-500 transform scale-105"
                        : selectedOption === option.id
                        ? "bg-red-100 border-red-500"
                        : "bg-gray-50 border-gray-300"
                      : selectedOption === option.id
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100 hover:shadow-md border-gray-300"
                  }
                  ${!answerSubmitted && "hover:translate-x-1"}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: showQuestion
                    ? `fadeSlideIn 0.5s ease-out ${index * 0.1}s both`
                    : "",
                }}
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>

        {answerSubmitted && (
          <div
            className={`p-4 rounded mb-4 animate-fadeIn ${
              answerResult?.is_correct ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="font-medium">
              {answerResult?.is_correct
                ? "Correct! Well done."
                : isTimeUp
                ? "Time's up! The correct answer is highlighted."
                : "Incorrect. The correct answer is highlighted."}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="bg-gray-100 px-4 py-2 rounded-full">
            <span className="font-medium">
              Score: {score}/{currentQuestionIndex + 1}
            </span>
          </div>
          
          {/* Violations indicator */}
          {violations > 0 && (
            <div className="bg-red-100 px-4 py-2 rounded-full">
              <span className="font-medium text-red-700">
                Violations: {violations}/{MAX_VIOLATIONS}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Global animation styles */}
      <style jsx="true">{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}