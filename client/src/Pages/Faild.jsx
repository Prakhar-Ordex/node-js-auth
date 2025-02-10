import { useLocation } from "react-router-dom";

export const Failed = () => {
    const query = new URLSearchParams(useLocation().search);
    const score = query.get("score");
    console.log(score)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sorry, You Didn't Pass
          </h2>
          <p className="text-gray-600 mb-8">
            You need to answer at least 13 questions correctly to pass the quiz.
          </p>
          <p className="text-lg font-semibold text-gray-800 mb-8">
            Your Score: <span className="text-red-500">{score}/15</span>
          </p>
          <a
            href="/quiz"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  };
  
  