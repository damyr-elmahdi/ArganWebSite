import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ schoolName, ministry, tagline }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* School Logo */}
          <div className="flex items-center justify-center w-12 h-12">
            <img src="/argan.jpg" alt="Argan High School" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{schoolName}</h1>
            <p className="text-sm text-gray-600">{tagline}</p>
          </div>
        </div>
        
        {/* Ministry Logo (Mobile: Hidden, Desktop: Visible) */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10">
            <img src="/Ministry.jpg" alt="Ministry Logo" className="w-full h-full object-contain" />
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
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-800 hover:text-orange-600 font-medium">Home</Link>
          <Link to="/about" className="text-gray-800 hover:text-orange-600 font-medium">About</Link>
          <Link to="/academics" className="text-gray-800 hover:text-orange-600 font-medium">Academics</Link>
          <Link to="/news" className="text-gray-800 hover:text-orange-600 font-medium">News</Link>
          <Link to="/events" className="text-gray-800 hover:text-orange-600 font-medium">Events</Link>
          <Link to="/library" className="text-gray-800 hover:text-orange-600 font-medium">Library</Link>
          <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">Login</Link>
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
              <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-center">Login</Link>
            </nav>
            
            {/* Ministry Logo (Mobile) */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200">
              <div className="w-8 h-8">
                <img src="/Ministry.jpg" alt="Ministry Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-600">{ministry}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}