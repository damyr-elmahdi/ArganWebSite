import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";

export default function Header({ schoolName, ministry, tagline }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className=" mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* School Logo - Made clickable with Link */}
          <Link to="/" className="flex items-center justify-center w-20 h-20">
            <img src={argan} alt="Argane High School" className="w-full h-full object-contain" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{schoolName}</h1>
            <p className="text-sm text-gray-600">{tagline}</p>
          </div>
        </div>
        
        {/* Ministry Logo */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center justify-center w-16 h-16">
            <img src={Ministry} alt="Ministry Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs text-gray-600">{ministry}</span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-[#18bebc] font-medium">Home</Link>
          <Link to="/about" className="text-gray-800 hover:text-[#18bebc] font-medium">About</Link>
          <Link to="/academics" className="text-gray-800 hover:text-[#18bebc] font-medium">Academics</Link>
          <Link to="/news" className="text-gray-800 hover:text-[#18bebc] font-medium">News</Link>
          <Link to="/events" className="text-gray-800 hover:text-[#18bebc] font-medium">Events</Link>
          <Link to="/library" className="text-gray-800 hover:text-[#18bebc] font-medium">Library</Link>
          <Link to="/resources" className="text-gray-800 hover:text-[#18bebc] font-medium">Resources</Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition flex items-center"
              >
                Welcome {user?.name?.split(' ')[0]}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#18bebc] hover:text-white">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition">Login</Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3">
              <Link to="/" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Home</Link>
              <Link to="/about" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">About</Link>
              <Link to="/academics" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Academics</Link>
              <Link to="/news" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">News</Link>
              <Link to="/events" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Events</Link>
              <Link to="/library" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Library</Link>
              <Link to="/resources" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Resources</Link>
              
              {/* Conditional rendering for mobile menu */}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-gray-800 hover:text-[#18bebc] font-medium py-1">Dashboard</Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-800 hover:text-[#18bebc] font-medium py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition w-full text-center">Login</Link>
              )}
            </nav>
            
            {/* Ministry Logo (Mobile) */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200">
              <div className="w-12 h-12">
                <img src={Ministry} alt="Ministry Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-600">{ministry}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}