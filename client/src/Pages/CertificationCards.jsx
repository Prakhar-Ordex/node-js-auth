import React, { useEffect, useState } from 'react';
// import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { generateEncryptedParams } from '../utils/dataEncrypt';


// Role icon SVG component
const RoleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full">
    <path d="M64 16c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M64 36c-15.5 0-28 12.5-28 28s12.5 28 28 28 28-12.5 28-28-12.5-28-28-28z" fill="none" stroke="currentColor" strokeWidth="4" />
    <rect x="56" y="56" width="16" height="16" rx="2" fill="currentColor" />
    <path d="M40 88v8h48v-8" fill="none" stroke="currentColor" strokeWidth="4" />
  </svg>
);

// Skill icon SVG component
const SkillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full">
    <path d="M24 32l40-16 40 16v48L64 96 24 80V32z" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M64 32v48M24 32l40 16 40-16" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="64" cy="32" r="8" fill="currentColor" />
    <circle cx="24" cy="32" r="8" fill="currentColor" />
    <circle cx="104" cy="32" r="8" fill="currentColor" />
  </svg>
);

const CertificationCards = () => {
  const [rolesCertifications, setRolesCertifications] = useState([]);
  const [skillsCertifications, setSkillsCertifications] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/apis/allquiz');
        const data = await response.json();

        const roleCertificateData = data?.filter((item) => item.type.trim() === "role");
        const skillCertificateData = data?.filter((item) => item.type.trim() === "skill");

        setRolesCertifications(roleCertificateData);
        setSkillsCertifications(skillCertificateData);
      } catch (error) {
        console.error('Failed to fetch certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const CertificationCard = ({ title, type }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between min-h-[200px] relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
        </div>
        <div>
          <Link
            to={`/quiz/${title}?data=${generateEncryptedParams(title, type)}`}
            onClick={()=> localStorage.removeItem('quizProgress')}
            className="mt-4 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Get Certified
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 w-32 h-32 text-gray-100">
          {type === "role" ? <RoleIcon /> : <SkillIcon />}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl">Loading.......</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <section className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Get Your Roles Certified</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesCertifications.map((cert, index) => (
            <CertificationCard key={index} {...cert} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4 ">Get Your Skills Certified</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsCertifications.map((cert, index) => (
            <CertificationCard key={index} {...cert} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CertificationCards;