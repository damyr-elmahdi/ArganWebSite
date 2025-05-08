import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update the document direction for RTL support (Arabic)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="language-switcher fixed top-4 right-4 bg-white p-2 rounded shadow-md z-50">
      <span className="mr-2">{t('common.language')}: </span>
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded mx-1 ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('common.english')}
      </button>
      <button 
        onClick={() => changeLanguage('fr')} 
        className={`px-2 py-1 rounded mx-1 ${i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('common.french')}
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded mx-1 ${i18n.language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('common.arabic')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;