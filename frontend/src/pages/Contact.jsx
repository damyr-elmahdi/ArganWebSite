import ContactForm from "../components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "react-feather";

export default function Contact({ schoolInfo }) {
  const { name, address, phone,fax, email, operatingHours } = schoolInfo;

  return (
    <main className="flex-grow">
      {/* Header Banner */}
      <section className="bg-[#18bebc] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">
            We'd love to hear from you. Reach out to {name} with any questions
            or inquiries.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Get In Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Our Location</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Phone</h3>
                    <p className="text-gray-600">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Fax</h3>
                    <p className="text-gray-600">{fax}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Email</h3>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-teal-100 p-3 rounded-full text-[#18bebc]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Operating Hours</h3>
                    <p className="text-gray-600">
                      Monday - sturday: {operatingHours}
                    </p>
                    <p className="text-gray-600">sunday: Closed</p>
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
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send Us a Message
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
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                What are the school hours?
              </h3>
              <p className="text-gray-600">
                Our regular school hours are {operatingHours}, Monday through
                Friday.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                How can I schedule a school tour?
              </h3>
              <p className="text-gray-600">
                You can schedule a tour by contacting our admissions office
                through this form or calling us directly.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                When is the enrollment period?
              </h3>
              <p className="text-gray-600">
                General enrollment for the next academic year begins in January
                and ends in April.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                How can I check my child's academic progress?
              </h3>
              <p className="text-gray-600">
                Parents can access academic reports through our parent portal or
                schedule a meeting with teachers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
