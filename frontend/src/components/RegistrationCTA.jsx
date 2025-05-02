export default function RegistrationCTA({ schoolName }) {
   return (
     <section className="py-12 bg-orange-50">
       <div className="container mx-auto px-4 text-center">
         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ready to Join {schoolName}?</h2>
         <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
           Take the first step towards a bright future with our comprehensive educational programs.
         </p>
         <div className="flex flex-wrap justify-center gap-4">
           <a href="#" className="bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 transition">Register as New Student</a>

         </div>
       </div>
     </section>
   );
 }
 