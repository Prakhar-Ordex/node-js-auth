import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { decryptQueryParams } from '../utils/dataEncrypt';

export const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [urlData, setUrlData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const navigate = useNavigate();

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      const { answers: savedAnswers, currentQuestion: savedCurrentQuestion } = JSON.parse(savedProgress);
      setAnswers(savedAnswers);
      setCurrentQuestion(savedCurrentQuestion);
    }
  }, []);

  // Save progress to localStorage whenever answers or currentQuestion changes
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('quizProgress', JSON.stringify({
        answers,
        currentQuestion,
      }));
    }
  }, [answers, currentQuestion]);

  useEffect(() => {
    const encryptedParams = searchParams.get('data');
    if (encryptedParams) {
      const decryptedData = decryptQueryParams(encryptedParams);
      setUrlData(decryptedData);
      if (decryptedData) {
        fetchQuestions(decryptedData);
        // Set 30-minute timer
        setTimeRemaining(30 * 60);
      } else {
        toast.error('Link has expired or is invalid');
        navigate('/');
      }
    } else {
      navigate('*');
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const fetchQuestions = async (decryptedData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/apis/questions?type=${decryptedData.type}&title=${decryptedData.title}`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const passingScore = Math.ceil(questions.length * 0.85);

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateScore = async () => {
    const resultData = { answers, title: urlData.title, type: urlData.type };

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:3000/apis/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        if (response.status === 410) {
          toast.warn("Please SignIn or SignUp to generate your certificate");
          navigate('/signin?redirect=certificate');
          return;
        }
        throw new Error('Failed to submit quiz results');
      }

      const result = await response.json();
      localStorage.removeItem('quizProgress'); // Clear saved progress after submission
      sessionStorage.setItem('pendingQuizResult', JSON.stringify(result));
      navigate('/result/quiz?redirect=testStatus');

    } catch (error) {
      console.error('Error submitting results:', error);
      toast.error(error.message || 'Failed to process quiz results');
      navigate('/skill-tests');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              {urlData?.title}
            </h1>
            {timeRemaining !== null && (
              <div className={`text-lg font-semibold ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-600'}`}>
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Passing Score: {passingScore}/{questions.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = answers[questions[currentQuestion].id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'}`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-left">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200
                ${currentQuestion === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800'}`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={answers[questions[currentQuestion].id] === undefined}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200
                ${answers[questions[currentQuestion].id] === undefined
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
            >
              {currentQuestion === questions.length - 1 ? (
                isSubmitting ? 'Submitting...' : 'Finish'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;