export default function Hero({ schoolName, foundedYear }) {
   return (
     <section className="bg-gradient-to-r from-green-500 to-green-700 text-white">
       <div className="container mx-auto px-4 py-16 md:py-24">
         <div className="grid md:grid-cols-2 gap-8 items-center">
           <div>
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to {schoolName}</h2>
             <p className="text-lg mb-6">Providing quality education and fostering academic excellence since {foundedYear}.</p>
             <div className="flex flex-wrap gap-4">
               <a href="#" className="bg-white text-green-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">Apply Now</a>
               <a href="#" className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-green-600 transition">Learn More</a>
             </div>
           </div>
           <div className="hidden md:block">
             <div className="bg-white p-6 rounded-lg shadow-xl">
               <h3 className="text-green-600 font-bold text-xl mb-4">Quick Links</h3>
               <ul className="space-y-3 text-gray-700">
                 <li className="flex items-center">
                   <span className="mr-2">📝</span>
                   <a href="#" className="hover:text-green-600">Registration Information</a>
                 </li>
                 <li className="flex items-center">
                   <span className="mr-2">🗓️</span>
                   <a href="#" className="hover:text-green-600">Academic Calendar</a>
                 </li>
                 <li className="flex items-center">
                   <span className="mr-2">📚</span>
                   <a href="#" className="hover:text-green-600">Library Catalog</a>
                 </li>
                 <li className="flex items-center">
                   <span className="mr-2">🔍</span>
                   <a href="#" className="hover:text-green-600">Academic Resources</a>
                 </li>
                 <li className="flex items-center">
                   <span className="mr-2">📞</span>
                   <a href="#" className="hover:text-green-600">Contact Administration</a>
                 </li>
               </ul>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 }
 