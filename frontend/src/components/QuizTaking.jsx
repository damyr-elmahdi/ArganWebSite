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
  const timerRef = useRef(null);
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
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (loading || answerSubmitted || quizCompleted) return;

    // Reset timer when question changes
    setSecondsLeft(20);

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
    if (!quiz || answerSubmitted) return;

    // Mark as no answer selected
    await handleOptionSelect(null, true);
  };

  // Handle option selection
  const handleOptionSelect = async (optionId, isTimeUp = false) => {
    if (answerSubmitted || !attemptId) return;

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
        )?.id,
      });

      // Update score if correct
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      // If time's up and no selection, use a placeholder
      const payload = {
        question_id: currentQuestion.id,
        selected_option_id: optionId || currentQuestion.options[0].id, // Use first option as placeholder if time's up
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
          is_correct: optionId && response.data.is_correct,
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
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
      setAnswerResult(null);
    } else {
      // Quiz finished
      completeQuiz();
    }
  };

  // Complete the quiz and navigate to results
  const completeQuiz = async () => {
    try {
      setQuizCompleted(true);
      await axios.post(`/api/attempts/${attemptId}/complete`);
      navigate(`/student/quiz-results/${attemptId}`);
    } catch (err) {
      console.error("Error completing quiz:", err);
      setError("Failed to complete quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading quiz...</h2>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <div className="flex items-center">
          <span className="mr-2">
            Question {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
          <div
            className={`font-bold text-lg ${
              secondsLeft <= 5 ? "text-red-600" : "text-gray-700"
            }`}
          >
            {secondsLeft}s
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !answerSubmitted && handleOptionSelect(option.id)}
              disabled={answerSubmitted}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${
                answerSubmitted
                  ? option.id === answerResult?.correct_option_id
                    ? "bg-green-100 border-green-500"
                    : selectedOption === option.id
                    ? "bg-red-100 border-red-500"
                    : "bg-gray-50 border-gray-300"
                  : selectedOption === option.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {option.option_text}
            </button>
          ))}
        </div>
      </div>

      {answerSubmitted && (
        <div
          className={`p-4 rounded mb-4 ${
            answerResult?.is_correct ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p className="font-medium">
            {answerResult?.is_correct
              ? "Correct! Well done."
              : "Incorrect. Moving to next question..."}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">
            Score: {score}/{currentQuestionIndex + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
