import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";
import DevSignature from './DevSignature';

export default function Footer({ schoolInfo }) {
  const { name, ministry, address, phone, fax, email, currentYear } = schoolInfo;
  const schoolName = name || "Argane High School";
  const { t } = useTranslation();

  return (
    <footer className="bg-[#72b8ff] text-black relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="w-20 h-20">
                <img src={argan} alt={t('school.name', { schoolName })} className="w-full h-full object-contain" />
              </Link>
              <h3 className="font-bold">{t('school.name', { schoolName })}</h3>
            </div>
            <p className="text-black-600 text-sm mb-4">
              {t('school.address', { address })}<br />
              {t('contact.phone')}: {phone}<br />
              {t('contact.fax')}: {fax}<br />
              {t('contact.email')}: {email}
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-black-600 hover:text-black-800 relative group" aria-label={t('social.instagram')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {t('social.instagram')}
                </span>
              </a>
              <a href="https://www.facebook.com/lycee.argan" className="text-black-600 hover:text-black-800 relative group" aria-label={t('social.facebook')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {t('social.facebook')}
                </span>
              </a>
              <a href="https://x.com" className="text-black-600 hover:text-black-800 relative group" aria-label={t('social.twitter')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"/>
                </svg>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {t('social.twitter')}
                </span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-black-600">
              <li><Link to="/about" className="hover:text-black-800">{t('nav.about')}</Link></li>
              <li><Link to="/academics" className="hover:text-black-800">{t('nav.academics')}</Link></li>
              <li><Link to="/register" className="hover:text-black-800">{t('nav.admissions')}</Link></li>
              <li><Link to="/news" className="hover:text-black-800">{t('nav.newsEvents')}</Link></li>
              <li><Link to="/library" className="hover:text-black-800">{t('nav.library')}</Link></li>
              <li><Link to="/contact" className="hover:text-black-800">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-black-600">
              <li><a href="/academics#curriculum" className="hover:text-black-800">{t('resources.curriculum')}</a></li>
              <li><a href="/academics#schedule" className="hover:text-black-800">{t('resources.schedule')}</a></li>
              <li><a href="/library#books" className="hover:text-black-800">{t('resources.bookCatalog')}</a></li>
              <li><a href="/news#upcoming" className="hover:text-black-800">{t('resources.upcomingEvents')}</a></li>
              <li><Link to="/contact" className="hover:text-black-800">{t('resources.supportServices')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black-300 mt-8 pt-6 text-center text-black-600 text-sm">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-20 h-20">
              <img src={Ministry} alt={t('school.ministryLogoAlt')} className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-black-600">
              {t('footer.accreditedBy', { ministry })}
            </span>
          </div>
          <p>{t('footer.copyright', { year: currentYear, name })}</p>
        </div>
      </div>
      
      {/* Add DevSignature component */}
      <DevSignature />
    </footer>
  );
}