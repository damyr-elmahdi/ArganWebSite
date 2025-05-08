import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { useTranslation } from 'react-i18next';
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";

export default function Header({ schoolName, ministry, tagline }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update the document direction for RTL support (Arabic)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setIsLangDropdownOpen(false);
  };

  // Get current language name for display
  const getCurrentLanguageName = () => {
    switch (i18n.language) {
      case 'en': return t('common.english');
      case 'fr': return t('common.french');
      case 'ar': return t('common.arabic');
      default: return t('common.english');
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* School Logo - Made clickable with Link */}
          <Link to="/" className="flex items-center justify-center w-20 h-20">
            <img src={argan} alt={t('school.name', { schoolName })} className="w-full h-full object-contain" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t('school.name', { schoolName })}</h1>
            <p className="text-sm text-gray-600">{t('school.tagline', { tagline })}</p>
          </div>
        </div>
        
        {/* Ministry Logo */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center justify-center w-16 h-16">
            <img src={Ministry} alt={t('school.ministryLogoAlt')} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs text-gray-600">{t('school.ministry', { ministry })}</span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
          aria-label={t('nav.toggleMenu')}
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
          <Link to="/" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.home')}</Link>
          <Link to="/about" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.about')}</Link>
          <Link to="/academics" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.academics')}</Link>
          <Link to="/news" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.news')}</Link>
          <Link to="/events" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.events')}</Link>
          <Link to="/library" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.library')}</Link>
          <Link to="/resources" className="text-gray-800 hover:text-[#18bebc] font-medium">{t('nav.resources')}</Link>
          
          {/* Language Switcher - Desktop */}
          <div className="relative">
            <button 
              onClick={toggleLangDropdown}
              className="text-gray-800 hover:text-[#18bebc] font-medium flex items-center"
            >
              {getCurrentLanguageName()}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isLangDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
              </svg>
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-[#18bebc] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('common.english')}
                </button>
                <button 
                  onClick={() => changeLanguage('fr')}
                  className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'fr' ? 'bg-[#18bebc] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('common.french')}
                </button>
                <button 
                  onClick={() => changeLanguage('ar')}
                  className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'ar' ? 'bg-[#18bebc] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('common.arabic')}
                </button>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition flex items-center"
              >
                {t('auth.welcome', { name: user?.name?.split(' ')[0] })}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#18bebc] hover:text-white">{t('auth.dashboard')}</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-100"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition">{t('auth.login')}</Link>
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
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.home')}</Link>
              <Link to="/about" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.about')}</Link>
              <Link to="/academics" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.academics')}</Link>
              <Link to="/news" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.news')}</Link>
              <Link to="/events" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.events')}</Link>
              <Link to="/library" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.library')}</Link>
              <Link to="/resources" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('nav.resources')}</Link>
              
              {/* Language Switcher - Mobile */}
              <div className="py-1 border-t border-gray-100 mt-1">
                <p className="text-sm text-gray-500 mb-2">{t('common.language')}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1 text-sm rounded ${i18n.language === 'en' ? 'bg-[#18bebc] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {t('common.english')}
                  </button>
                  <button 
                    onClick={() => changeLanguage('fr')}
                    className={`px-3 py-1 text-sm rounded ${i18n.language === 'fr' ? 'bg-[#18bebc] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {t('common.french')}
                  </button>
                  <button 
                    onClick={() => changeLanguage('ar')}
                    className={`px-3 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-[#18bebc] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {t('common.arabic')}
                  </button>
                </div>
              </div>
              
              {/* Conditional rendering for mobile menu */}
              <div className="pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="text-gray-800 hover:text-[#18bebc] font-medium py-1">{t('auth.dashboard')}</Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-gray-800 hover:text-[#18bebc] font-medium py-1"
                    >
                      {t('auth.logout')}
                    </button>
                  </>
                ) : (
                  <Link to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="bg-[#165b9f] text-white px-4 py-2 rounded-md hover:bg-[#18395a] transition block text-center">{t('auth.login')}</Link>
                )}
              </div>
            </nav>
            
            {/* Ministry Logo (Mobile) */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200">
              <div className="w-12 h-12">
                <img src={Ministry} alt={t('school.ministryLogoAlt')} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-gray-600">{t('school.ministry', { ministry })}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}