import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { decryptQueryParams } from '../utils/dataEncrypt';

// Quiz Component
export const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [urlData, setUrlData] = useState(null)
  

  const navigate = useNavigate();

  useEffect(() => {
    const encryptedParams = searchParams.get('data');
    if (encryptedParams) {
      const decryptedData = decryptQueryParams(encryptedParams);
      setUrlData(decryptedData)
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

  const calculateScore = async () => {
    const data = {answers,title:urlData.title,type:urlData.type}
    sessionStorage.setItem('pendingQuizResult', JSON.stringify(data));
    navigate('/result/quiz?redirect=testStatus')
  };

  if (!questions.length) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <span className="text-gray-600">
              Score needed: {passingScore}/{questions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-4">{questions[currentQuestion].question}</h3>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border ${answers[questions[currentQuestion].id] === index
                  ? 'bg-blue-50 border-blue-500'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={answers[questions[currentQuestion].id] === undefined}
            className={`px-6 py-2 rounded-lg ${answers[questions[currentQuestion].id] === undefined
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            {
              isLoading ? 'Submitting...' : currentQuestion === questions.length - 1 ? 'Finish' : 'Next'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
