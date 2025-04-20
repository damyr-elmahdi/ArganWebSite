// frontend/src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";

export default function Header({ schoolName, ministry, tagline }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // Use the auth context
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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* School Logo - Made clickable with Link */}
          <Link to="/" className="flex items-center justify-center w-20 h-20">
            <img src={argan} alt="Argan High School" className="w-full h-full object-contain" />
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
          <Link to="/" className="text-gray-800 hover:text-orange-600 font-medium">Home</Link>
          <Link to="/about" className="text-gray-800 hover:text-orange-600 font-medium">About</Link>
          <Link to="/academics" className="text-gray-800 hover:text-orange-600 font-medium">Academics</Link>
          <Link to="/news" className="text-gray-800 hover:text-orange-600 font-medium">News</Link>
          <Link to="/events" className="text-gray-800 hover:text-orange-600 font-medium">Events</Link>
          <Link to="/library" className="text-gray-800 hover:text-orange-600 font-medium">Library</Link>
          
          {/* Conditional rendering based on auth context */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition flex items-center"
              >
                Welcome {user?.name?.split(' ')[0]}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">Login</Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3 py-3">
              <Link to="/" className="text-gray-800 hover:text-orange-600 font-medium py-1">Home</Link>
              <Link to="/about" className="text-gray-800 hover:text-orange-600 font-medium py-1">About</Link>
              <Link to="/academics" className="text-gray-800 hover:text-orange-600 font-medium py-1">Academics</Link>
              <Link to="/news" className="text-gray-800 hover:text-orange-600 font-medium py-1">News</Link>
              <Link to="/events" className="text-gray-800 hover:text-orange-600 font-medium py-1">Events</Link>
              <Link to="/library" className="text-gray-800 hover:text-orange-600 font-medium py-1">Library</Link>
              
              {/* Conditional rendering for mobile menu */}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-800 hover:text-orange-600 font-medium py-1">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-800 hover:text-orange-600 font-medium py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-center">Login</Link>
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