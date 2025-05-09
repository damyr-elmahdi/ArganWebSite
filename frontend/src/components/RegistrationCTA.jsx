import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegistrationCTA() {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-[#d7fcfb]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {t('registration.heading', { schoolName: t('common.schoolName') })}
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('registration.description')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register-student" className="bg-[#18bebc] text-white px-6 py-3 rounded-md font-medium hover:bg-teal-700 transition">
            {t('registration.studentButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}