import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ShowResult from "./QuestionResultCard";

export const Result = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const { path } = useParams();
  const redirect = query.get("redirect");
  const [isPass, setPass] = useState(null);
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [certificateId, setCertificateID] = useState(null);
  const [passingScore, setPassingScore] = useState(null);
  const result = JSON.parse(sessionStorage.getItem('pendingQuizResult'))

  const getResult = async () => {

    if (!result) {
      toast.error("No quiz result found");
      navigate('/skill-tests');
      return;
    }

    setPass(result.passingStatus);
    setScore(result.score);
    setQuestions(result.totalQuestions);
    setPassingScore(result.passingScore);

    if (result.passingStatus) {
      setCertificateID(result.certificateID);
    }
  }

  useEffect(() => {
    if (score || redirect === "certificate" || redirect === "testStatus" || path === "quiz" || path === "login") {
      getResult();
    } else {
      navigate("/*")
    }
  }, [])

  return (
    <ShowResult result={result} questions={result.questions} />
  )

};

export default Result;