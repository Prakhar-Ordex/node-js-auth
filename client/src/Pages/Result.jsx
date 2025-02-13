import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const Result = () => {
  const navigate = useNavigate  ();
  const query = new URLSearchParams(useLocation().search);
  const {path} = useParams();
  const redirect = query.get("redirect");
  const [isPass, setPass] = useState(null);
  const [score, setScore] = useState(null);
  // const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [certificateId, setCertificateID] = useState(null);
  const [passingScore, setPassingScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const getResult = async () => {
    const resultData = JSON.parse(sessionStorage.getItem('pendingQuizResult'));
    console.log(resultData);
    
    if (!resultData) {
      toast.error("No quiz result found");
      navigate('/skill-tests');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/apis/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 410) {
          toast.warn("Please SignIn or SignUp to generate your certificate");
          navigate('/signin?redirect=certificate');
          return;
        }
        throw new Error(result.message || 'Failed to submit quiz results');
      }

      setPass(result.passingStatus);
      setScore(result.score);
      setQuestions(result.totalQuestions);
      setPassingScore(result.passingScore);
      
      if (result.passingStatus) {
        setCertificateID(result.certificateID);
      }

    } catch (error) {
      console.error('Error submitting results:', error);
      toast.error(error.message || 'Failed to process quiz results');
      navigate('/skill-tests');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (score || redirect === "certificate" || redirect === "testStatus" || path === "quiz" || path === "login") {
      getResult();
    }else{
      navigate("/*")
    }
  }, [])

  if(isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {!isPass ? (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sorry, You Didn't Pass
            </h2>
            <p className="text-gray-600 mb-8">
              You need to answer at least {passingScore} questions correctly to pass the quiz.
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-8">
              Your Score: <span className="text-red-500">{score}/{questions}</span>
            </p>
            <div className="space-x-4">
              <a
                href="/skill-tests"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Try Again
              </a>
              <a
                href="/"
                className="inline-block bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Home
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" height="200">
                <path d="M35 25 L65 25 L60 80 L40 80 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                <path d="M32 25 L68 25 L65 30 L35 30 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                <path d="M35 35 C15 35, 15 55, 35 55" fill="none" stroke="#FFD700" strokeWidth="4" />
                <path d="M65 35 C85 35, 85 55, 65 55" fill="none" stroke="#FFD700" strokeWidth="4" />
                <rect x="45" y="80" width="10" height="15" fill="#DAA520" />
                <rect x="35" y="95" width="30" height="5" fill="#DAA520" />
                <path d="M40 35 L60 35 L57 70 L43 70 Z" fill="#FFF" opacity="0.1" />
                <circle cx="50" cy="50" r="8" fill="#DAA520" />
                <text x="50" y="53" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold">#1</text>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Congratulations! You Passed!
            </h2>
            <p className="text-gray-600 mb-8">
              Great job on completing the quiz successfully!
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-8">
              Your Score: <span className="text-green-500">{score}/{questions}</span>
            </p>
            <div className="space-x-4">
              <Link
                to={`/certificate/${certificateId}`}
                className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Generate Certificate
              </Link>
              <a
                href="/"
                className="inline-block bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Home
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};