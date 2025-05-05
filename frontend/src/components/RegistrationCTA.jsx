import { Link } from 'react-router-dom';

export default function RegistrationCTA({ schoolName }) {
   return (
     <section className="py-12 bg-[#d7fcfb]">
       <div className="container mx-auto px-4 text-center">
         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ready to Join {schoolName}?</h2>
         <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
           Take the first step towards a bright future with our comprehensive educational programs.
         </p>
         <div className="flex flex-wrap justify-center gap-4">
           <Link to="/register-student" className="bg-[#18bebc] text-white px-6 py-3 rounded-md font-medium hover:bg-teal-700 transition">Register as New Student</Link>
         </div>
       </div>
     </section>
   );
 }