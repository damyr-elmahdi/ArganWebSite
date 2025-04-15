import { useState } from 'react';

export default function Header({ schoolName, ministry, tagline }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Extract first letters for logo
  const schoolInitials = schoolName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2);

  const ministryInitials = ministry
    .split(' ')
    .filter(word => word[0] && word[0] === word[0].toUpperCase())
    .map(word => word[0])
    .join('');

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* School Logo */}
          <div className="bg-green-600 text-white p-2 rounded-md flex items-center justify-center w-12 h-12">
            <span className="text-xl font-bold">{schoolInitials}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{schoolName}</h1>
            <p className="text-sm text-gray-600">{tagline}</p>
          </div>
        </div>
        
        {/* Ministry Logo (Mobile: Hidden, Desktop: Visible) */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="bg-red-600 text-white p-2 rounded-md flex items-center justify-center w-10 h-10">
            <span className="text-sm font-bold">{ministryInitials}</span>
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
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">Home</a>
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">About</a>
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">Academics</a>
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">News</a>
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">Events</a>
          <a href="#" className="text-gray-800 hover:text-green-600 font-medium">Library</a>
          <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Login</a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3 py-3">
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">Home</a>
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">About</a>
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">Academics</a>
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">News</a>
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">Events</a>
              <a href="#" className="text-gray-800 hover:text-green-600 font-medium py-1">Library</a>
              <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-center">Login</a>
            </nav>
            
            {/* Ministry Logo (Mobile) */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200">
              <div className="bg-red-600 text-white p-2 rounded-md flex items-center justify-center w-8 h-8">
                <span className="text-xs font-bold">{ministryInitials}</span>
              </div>
              <span className="text-xs text-gray-600">{ministry}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}