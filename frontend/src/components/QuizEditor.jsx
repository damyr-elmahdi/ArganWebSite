import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function QuizEditor() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { t } = useTranslation();
  
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([
    { id: 1, name: t("subjects.mathematics") },
    { id: 2, name: t("subjects.science") },
    { id: 3, name: t("subjects.history") },
    { id: 4, name: t("subjects.english") },
    { id: 5, name: t("subjects.computerScience") },
  ]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        const quiz = response.data;

        setTitle(quiz.title);
        setSubject(quiz.subject_id.toString());

        // Format questions for the editor
        const formattedQuestions = quiz.questions.map((question) => ({
          question_text: question.question_text,
          options: question.options.map((option) => ({
            option_text: option.option_text,
            is_correct: option.is_correct,
          })),
        }));

        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(t("errors.failedToLoadQuiz"));
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, t]);

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { option_text: "", is_correct: true },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ],
      },
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError(t("errors.minimumOneQuestion"));
      return;
    }

    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Update question text
  const updateQuestionText = (index, text) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = text;
    setQuestions(newQuestions);
  };

  // Add an option to a question
  const addOption = (questionIndex) => {
    if (questions[questionIndex].options.length >= 4) {
      setError(t("errors.maximumFourOptions"));
      return;
    }

    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      option_text: "",
      is_correct: false,
    });
    setQuestions(newQuestions);
  };

  // Remove an option from a question
  const removeOption = (questionIndex, optionIndex) => {
    if (questions[questionIndex].options.length <= 3) {
      setError(t("errors.minimumThreeOptions"));
      return;
    }

    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  // Update option text
  const updateOptionText = (questionIndex, optionIndex, text) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].option_text = text;
    setQuestions(newQuestions);
  };

  // Set correct option
  const setCorrectOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, index) => {
      option.is_correct = index === optionIndex;
    });
    setQuestions(newQuestions);
  };

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setError(t("errors.titleRequired"));
      return false;
    }

    if (!subject) {
      setError(t("errors.subjectRequired"));
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question_text.trim()) {
        setError(t("errors.questionTextRequired", { number: i + 1 }));
        return false;
      }

      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].option_text.trim()) {
          setError(
            t("errors.optionRequired", { 
              optionNumber: j + 1, 
              questionNumber: i + 1 
            })
          );
          return false;
        }
      }

      // Check if there's a correct option set
      const hasCorrectOption = questions[i].options.some(
        (option) => option.is_correct
      );
      if (!hasCorrectOption) {
        setError(t("errors.selectCorrectOption", { number: i + 1 }));
        return false;
      }
    }

    return true;
  };

  // Submit the updated quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await axios.put(`/api/quizzes/${quizId}`, {
        title,
        subject_id: subject,
        questions,
      });

      setSaving(false);
      navigate("/teacher-dashboard");
    } catch (err) {
      console.error("Error updating quiz:", err);
      setError(t("errors.failedToUpdateQuiz"));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t("quiz.editor.loading")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t("quiz.editor.title")}</h2>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Quiz Details */}
        <div className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("quiz.editor.quizTitle")}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-400 focus:border-teal-400"
              placeholder={t("quiz.editor.enterQuizTitle")}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("quiz.editor.subject")}
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-400 focus:border-teal-400"
              required
            >
              <option value="">{t("quiz.editor.selectSubject")}</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t("quiz.editor.questions")}</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-teal-600 hover:bg-teal-700"
            >
              {t("quiz.editor.addQuestion")}
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">
                  {t("quiz.editor.questionNumber", { number: qIndex + 1 })}
                </h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t("quiz.editor.remove")}
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("quiz.editor.questionText")}
                </label>
                <input
                  type="text"
                  value={question.question_text}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-400 focus:border-teal-400"
                  placeholder={t("quiz.editor.enterQuestion")}
                  required
                />
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t("quiz.editor.options")}
                  </span>
                  {question.options.length < 4 && (
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-xs text-teal-600 hover:text-teal-800"
                    >
                      {t("quiz.editor.addOption")}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-option-${qIndex}`}
                        checked={option.is_correct}
                        onChange={() => setCorrectOption(qIndex, oIndex)}
                        className="focus:ring-teal-400 h-4 w-4 text-teal-600 border-gray-300"
                        required
                      />
                      <input
                        type="text"
                        value={option.option_text}
                        onChange={(e) =>
                          updateOptionText(qIndex, oIndex, e.target.value)
                        }
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-teal-400 focus:border-teal-400"
                        placeholder={t("quiz.editor.optionPlaceholder", { number: oIndex + 1 })}
                        required
                      />
                      {question.options.length > 3 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/teacher-dashboard")}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-50"
          >
            {saving ? t("common.saving") : t("common.saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}