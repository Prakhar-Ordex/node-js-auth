import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuestionResultCard = ({ question, userAnswer, isCorrect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  index === question.correctAnswer
                    ? 'bg-green-50 border-2 border-green-200'
                    : index === userAnswer
                    ? 'bg-red-50 border-2 border-red-200'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className={`flex-1 ${
                    index === question.correctAnswer
                      ? 'text-green-700'
                      : index === userAnswer
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                  {index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {index === userAnswer && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowResult = ({ result, questions }) => {
  console.log(result)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            {result?.passingStatus ? (
              <>
                <div className="text-green-500 mb-4 animate-fadeIn animate-bounce">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                  Congratulations! You Passed!
                </h2>
              </>
            ) : (
              <>
                <div className="text-red-500 mb-4  animate-fadeIn animate-bounce">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Sorry, You Didn't Pass
                </h2>
              </>
            )}
            {
              !result.passingStatus &&
              <p className="text-gray-600 mb-4 text-lg">
                      You need to answer at least <span className="font-semibold text-red-500">{result.passingScore}</span> questions correctly to pass the quiz.
                </p>
            }
            <p className="text-xl font-semibold text-gray-800 mb-4">
            Your Score: <span className={`text-2xl ${result.passingStatus ? 'text-green-500' : 'text-red-500'}`}>
                {result.score}/{result.totalQuestions}
              </span>
            </p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <Link
                to="/skill-tests"
                className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transform transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Try Another Quiz
              </Link>
              {result.passingStatus && (
                <Link
                  to={`/certificate/${result.certificateID}`}
                  className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transform transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-lg"
                >
                  View Certificate
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Detailed Results</h3>
            {questions.map((question, index) => (
              <QuestionResultCard
                key={index}
                question={question}
                userAnswer={result.answers[question.id]}
                isCorrect={result.answers[question.id] === question.correctAnswer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowResult;