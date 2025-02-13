import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r text-center p-6">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to QuizMaster!</h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl">
        Test your knowledge with our fun and engaging quizzes. Challenge yourself and improve your skills!
      </p>
      <Link
        to="/skill-tests"
        className="bg-white text-blue-600 hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300"
      >
        Start Quiz
      </Link>
    </div>
  );
};

export default Home;
