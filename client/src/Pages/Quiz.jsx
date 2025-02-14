import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { decryptQueryParams } from '../utils/dataEncrypt';
import { API } from '../constant/api';
import LoadingSpinner from '../components/LoadingSpinner';

export const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [urlData, setUrlData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const navigate = useNavigate();

  // Load saved progress and timer from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizProgress');
    console.log(savedProgress)
    if (savedProgress) {
      const {
        answers: savedAnswers,
        currentQuestion: savedCurrentQuestion,
        timeRemaining: savedTimeRemaining,
        startTime: savedStartTime
      } = JSON.parse(savedProgress);

      setAnswers(savedAnswers);
      setCurrentQuestion(savedCurrentQuestion);

      // Calculate remaining time based on saved start time
      if (savedStartTime && savedTimeRemaining) {
        const elapsedTime = Math.floor((Date.now() - savedStartTime) / 1000);
        const remainingTime = Math.max(0, savedTimeRemaining - elapsedTime);
        setTimeRemaining(remainingTime);
      }
    }
  }, []);

  // Save progress and timer to localStorage
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('quizProgress', JSON.stringify({
        answers,
        currentQuestion,
        timeRemaining,
        startTime: Date.now() // Save current timestamp
      }));
    }
  }, [answers, currentQuestion, timeRemaining]);

  useEffect(() => {
    const encryptedParams = searchParams.get('data');
    if (encryptedParams) {
      const decryptedData = decryptQueryParams(encryptedParams);
      setUrlData(decryptedData);
      if (decryptedData) {
        fetchQuestions(decryptedData);
        // Only set initial time if it's not already set
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
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpModal(true); // Show modal instead of auto-submitting
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Add event handlers to prevent copying
  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };

  const preventRightClick = (e) => {
    e.preventDefault();
    return false;
  };

  // Add these to your existing useEffect that runs on mount
  useEffect(() => {
    // Disable text selection for the entire document
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';

    // Add event listeners
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('contextmenu', preventRightClick);

    // Cleanup function
    return () => {
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
      document.body.style.msUserSelect = 'auto';
      document.body.style.mozUserSelect = 'auto';

      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);

  const fetchQuestions = async (decryptedData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API}/apis/questions?type=${decryptedData.type}&title=${decryptedData.title}`, {
        credentials: 'include'
      });
      const { questions, totalTime } = await response.json(); // Destructure questions and totalTime from response

      if (!response.ok) {
        if (response.status === 410) {
          toast.error("You Don't have account please login first");
          navigate('/signin?redirect=questions');
          return;
        }
        throw new Error("Failed to fetch questions.")
      }

      setQuestions(questions);
      console.log(timeRemaining)
      // Check if we have saved progress
      const savedProgress = localStorage.getItem('quizProgress');
      // if (savedProgress) {
      //   const { timeRemaining: savedTimeRemaining, startTime: savedStartTime } = JSON.parse(savedProgress);

      //   if (savedStartTime && savedTimeRemaining !== null) {
      //     const elapsedTime = Math.floor((Date.now() - savedStartTime) / 1000);
      //     const remainingTime = Math.max(0, savedTimeRemaining - elapsedTime);
      //     setTimeRemaining(remainingTime);
      //     return;
      //   }
      // }

      // If no saved time, set from API response
      // setTimeRemaining(totalTime);

      // if (timeRemaining === null) {
      //   console.log("first")
      //   setTimeRemaining(totalTime); // Set timeRemaining to totalTime in seconds
      // }

      if(!savedProgress){
        setTimeRemaining(totalTime); // Set timeRemaining to totalTime in seconds
      }
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
      const response = await fetch(`${API}/apis/submit`, {
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

  // Handle back button click in time-up modal
  const handleBack = () => {
    localStorage.removeItem('quizProgress');
    navigate('/skill-tests');
  };

  if (isLoading || !questions.length) {
    return <LoadingSpinner/>
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Time's Up!
              </h3>
              <p className="text-gray-600 mb-6">
                Your time has expired. Would you like to submit your answers or return to the tests page?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Back to Tests
                </button>
                <button
                  onClick={calculateScore}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answers'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="bg-gray-50 p-6 rounded-lg select-none"
            onCopy={preventCopyPaste}
            onPaste={preventCopyPaste}
            onContextMenu={preventRightClick}
          >
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
                    onCopy={preventCopyPaste}
                    onPaste={preventCopyPaste}
                    onContextMenu={preventRightClick}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 select-none
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
              disabled={answers[questions[currentQuestion].id] === undefined  || isSubmitting}
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