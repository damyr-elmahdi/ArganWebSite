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
    <div className="language-switcher">
      <span>{t('common.language')}: </span>
      <button onClick={() => changeLanguage('en')}>{t('common.english')}</button>
      <button onClick={() => changeLanguage('fr')}>{t('common.french')}</button>
      <button onClick={() => changeLanguage('ar')}>{t('common.arabic')}</button>
    </div>
  );
};

export default LanguageSwitcher;