import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isLogin } from '../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(()=>{
    setLogin(isLogin())
},[location])

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.status === 202) {
        localStorage.clear();
        navigate('/');
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src="/api/placeholder/36/36"
              alt="Logo" 
              className="w-9 h-9"
            />
            <span className="text-xl font-semibold text-gray-800">
              Brand
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Home
              </Link>
              <Link 
                to="/users" 
                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Users
              </Link>
              <Link 
                to="/profile" 
                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Profile
              </Link>
              <Link 
                to="/skill-tests" 
                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Quiz
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {login ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden"
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                to="/users"
                className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                Users
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link
                to="/skill-tests"
                className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                Quiz
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;