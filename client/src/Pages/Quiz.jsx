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
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const encryptedParams = searchParams.get('data');
    if (encryptedParams) {
      const decryptedData = decryptQueryParams(encryptedParams);
      setUrlData(decryptedData);
      if (decryptedData) {
        fetchQuestions(decryptedData);
      } else {
        toast.error('Link has expired or is invalid');
        navigate('/');
      }
    } else {
      navigate('*');
    }
  }, []);

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

  const calculateScore = async () => {
    const resultData = { answers, title: urlData.title, type: urlData.type };

    try {
      setIsSubmiting(true);
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
        throw new Error(result.message || 'Failed to submit quiz results');
      }

      const result = await response.json();

      sessionStorage.setItem('pendingQuizResult', JSON.stringify(result));
      navigate('/result/quiz?redirect=testStatus');

    } catch (error) {
      console.error('Error submitting results:', error);
      toast.error(error.message || 'Failed to process quiz results');
      navigate('/skill-tests');
    } finally {
      setIsSubmiting(false);
    }

  };

  if (isLoading || !questions.length) return <div className="text-center text-xl font-semibold py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Quiz Title */}
        {urlData?.title && (
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">{urlData.title}</h1>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <span className="text-gray-600 text-lg">
              Passing Score: {passingScore}/{questions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question & Options */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 text-gray-900">{questions[currentQuestion].question}</h3>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border transition duration-200
                  ${answers[questions[currentQuestion].id] === index
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-100'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition duration-200
              ${currentQuestion === 0
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={answers[questions[currentQuestion].id] === undefined}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition duration-200
              ${answers[questions[currentQuestion].id] === undefined
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            {currentQuestion === questions.length - 1 ? isSubmiting ? 'Loading...' : 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};