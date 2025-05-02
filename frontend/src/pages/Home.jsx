import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import EventsSection from '../components/EventsSection';
import ResourceViewer from '../components/ResourceViewer'; // Import the new ResourceViewer component
import StudentRegistrationForm from '../components/StudentRegistrationForm'; 
import argan from "../assets/argan.png";


import { useState, useEffect } from 'react';

export default function Home({ schoolInfo }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src={argan} alt="Argan High School" className="w-full h-full object-contain animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      {/* Banner announcement */}
      <div className="bg-blue-600 text-white text-center py-2 px-4">
        <div className="container mx-auto">
          <p className="text-sm font-medium">
            Enrollment for the 2025-2026 academic year is now open! 
            <a href="#" className="underline ml-2 hover:text-blue-100">Click here for details</a>
          </p>
        </div>
      </div>
      
      {/* Hero section */}
      <Hero schoolName={schoolInfo.name} foundedYear={schoolInfo.foundedYear} />
      
      {/* Welcome message */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
                {/* This would be a school video or image */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
                  <img src={argan} alt="Argan High School" className="w-90 h-80 object-contain" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">A Tradition of Excellence</h2>
              <p className="text-gray-600 mb-4">
                Since {schoolInfo.foundedYear}, {schoolInfo.name} has been committed to providing 
                quality education that prepares students for success in their academic 
                and professional journeys. Our dedicated faculty and comprehensive curriculum 
                ensure that every student receives the attention and resources they need to excel.
              </p>
              <p className="text-gray-600 mb-6">
                We foster a supportive learning environment where creativity, critical thinking, 
                and character development are prioritized alongside academic achievement.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">95%</div>
                  <div className="text-sm text-gray-600">Graduation Rate</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">85%</div>
                  <div className="text-sm text-gray-600">University Acceptance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* News section */}
      <NewsSection />
      
      {/* Events section */}
      <EventsSection />
      
      {/* Featured programs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured Academic Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-40 bg-green-100 flex items-center justify-center">
                <span className="text-4xl">🧪</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Science & Technology</h3>
                <p className="text-gray-600 mb-4">
                  State-of-the-art laboratories and innovative teaching approaches 
                  for future scientists and engineers.
                </p>
                <a href="#" className="text-orange-600 hover:underline">Learn more</a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-40 bg-blue-100 flex items-center justify-center">
                <span className="text-4xl">🎭</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Arts & Humanities</h3>
                <p className="text-gray-600 mb-4">
                  Express creativity and develop critical thinking through our 
                  comprehensive arts and humanities curriculum.
                </p>
                <a href="#" className="text-orange-600 hover:underline">Learn more</a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-40 bg-yellow-100 flex items-center justify-center">
                <span className="text-4xl">🌍</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Global Studies</h3>
                <p className="text-gray-600 mb-4">
                  Prepare for the global marketplace with language studies 
                  and international perspectives.
                </p>
                <a href="#" className="text-orange-600 hover:underline">Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resources section */}
      <ResourceViewer />
      
      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Community Says</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full mr-4 flex items-center justify-center text-orange-600 font-bold">
                  MS
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Mia Sanders</h3>
                  <p className="text-sm text-gray-600">Parent of 2 students</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The supportive environment at Argan High School has helped my children thrive both 
                academically and socially. The teachers genuinely care about each student's success."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full mr-4 flex items-center justify-center text-orange-600 font-bold">
                  JT
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">James Thompson</h3>
                  <p className="text-sm text-gray-600">Former Student, Class of 2023</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The education I received at Argan prepared me well for university. The challenging 
                curriculum and extracurricular activities helped me develop skills that I use every day."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Registration CTA */}
      <StudentRegistrationForm  />
    </main>
  );
}