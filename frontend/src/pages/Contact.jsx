import React from "react";
import ContactForm from "../components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "react-feather";
import { useTranslation } from 'react-i18next';

export default function Contact({ schoolInfo }) {
  const { t } = useTranslation();
  const { name, address, phone, fax, email, operatingHours } = schoolInfo;

  return (
    <main className="flex-grow">
      {/* Header Banner */}
      <section className="bg-[#18bebc] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{t('contact.title')}</h1>
          <p className="text-lg">
            {t('contact.subtitle', { name })}
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t('contact.getInTouch')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t('contact.ourLocation')}</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t('contact.phone')}</h3>
                    <p className="text-gray-600">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t('contact.fax')}</h3>
                    <p className="text-gray-600">{fax}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t('contact.email')}</h3>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t('contact.operatingHours')}</h3>
                    <p className="text-gray-600">
                      {t('contact.mondayToSaturday', { hours: operatingHours })}
                    </p>
                    <p className="text-gray-600">{t('contact.sunday')}</p>
                  </div>
                </div>
              </div>

              {/* Map (placeholder) */}
              <div className="mt-8 h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://shorturl.at/zLW9a"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('contact.mapTitle')}
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t('contact.sendMessage')}
              </h2>
              <ContactForm schoolEmail={email} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('contact.faqTitle')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                {t('contact.faq.schoolHours.question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq.schoolHours.answer', { hours: operatingHours })}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                {t('contact.faq.tour.question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq.tour.answer')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                {t('contact.faq.enrollment.question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq.enrollment.answer')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                {t('contact.faq.progress.question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq.progress.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}