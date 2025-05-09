import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function QuizCreator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([
    { 
      question_text: '', 
      options: [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ] 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState([
    { id: 1, name: t('subjects.mathematics') },
    { id: 2, name: t('subjects.science') },
    { id: 3, name: t('subjects.history') },
    { id: 4, name: t('subjects.english') },
    { id: 5, name: t('subjects.computerScience') },
  ]);

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ]
      }
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError(t('quizCreator.errors.minOneQuestion'));
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
      setError(t('quizCreator.errors.maxOptions'));
      return;
    }
    
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      option_text: '',
      is_correct: false
    });
    setQuestions(newQuestions);
  };

  // Remove an option from a question
  const removeOption = (questionIndex, optionIndex) => {
    if (questions[questionIndex].options.length <= 3) {
      setError(t('quizCreator.errors.minOptions'));
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
      setError(t('quizCreator.errors.titleRequired'));
      return false;
    }
    
    if (!subject) {
      setError(t('quizCreator.errors.subjectRequired'));
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question_text.trim()) {
        setError(t('quizCreator.errors.questionTextRequired', { number: i + 1 }));
        return false;
      }
      
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].option_text.trim()) {
          setError(t('quizCreator.errors.optionRequired', { optionNumber: j + 1, questionNumber: i + 1 }));
          return false;
        }
      }
      
      // Check if there's a correct option set
      const hasCorrectOption = questions[i].options.some(option => option.is_correct);
      if (!hasCorrectOption) {
        setError(t('quizCreator.errors.correctOptionRequired', { number: i + 1 }));
        return false;
      }
    }
    
    return true;
  };

  // Submit the quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('/api/quizzes', {
        title,
        subject_id: subject,
        questions
      });
      
      setLoading(false);
      navigate('/teacher-dashboard');
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(t('quizCreator.errors.createFailed'));
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pb-2 border-b border-gray-200">
          {t('quizCreator.title')}
        </h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{t('quizCreator.quizDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizCreator.quizTitle')}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                  placeholder={t('quizCreator.titlePlaceholder')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizCreator.subject')}
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                  required
                >
                  <option value="">{t('quizCreator.selectSubject')}</option>
                  {subjects.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Questions */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">{t('quizCreator.questionsSection')}</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {t('quizCreator.addQuestion')}
              </button>
            </div>
            
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow transition duration-150">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <h4 className="font-medium text-lg text-gray-800">
                    {t('quizCreator.questionNumber', { number: qIndex + 1 })}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {t('quizCreator.remove')}
                  </button>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizCreator.questionText')}
                  </label>
                  <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                    placeholder={t('quizCreator.questionPlaceholder')}
                    required
                  />
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">{t('quizCreator.options')}</span>
                    {question.options.length < 4 && (
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center transition duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {t('quizCreator.addOption')}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <input
                          type="radio"
                          name={`correct-option-${qIndex}`}
                          checked={option.is_correct}
                          onChange={() => setCorrectOption(qIndex, oIndex)}
                          className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 transition duration-150"
                          required
                        />
                        <input
                          type="text"
                          value={option.option_text}
                          onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                          placeholder={t('quizCreator.optionPlaceholder', { number: oIndex + 1 })}
                          required
                        />
                        {question.options.length > 3 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-600 hover:text-red-800 transition duration-150"
                            aria-label="Remove option"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/teacher-dashboard')}
              className="mr-3 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition duration-150"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('quizCreator.creating')}
                </span>
              ) : t('quizCreator.createQuiz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}