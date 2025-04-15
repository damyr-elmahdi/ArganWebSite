export default function Footer({ schoolInfo }) {
   const { name, ministry, address, phone, email, currentYear } = schoolInfo;
   
   // Extract initials for logos
   const schoolInitials = name
     .split(' ')
     .map(word => word[0])
     .join('')
     .substring(0, 2);
 
   const ministryInitials = ministry
     .split(' ')
     .filter(word => word[0] && word[0] === word[0].toUpperCase())
     .map(word => word[0])
     .join('');
 
   return (
     <footer className="bg-gray-800 text-white">
       <div className="container mx-auto px-4 py-12">
         <div className="grid md:grid-cols-4 gap-8">
           <div>
             <div className="flex items-center space-x-2 mb-4">
               <div className="bg-green-600 text-white p-1 rounded-md flex items-center justify-center w-8 h-8">
                 <span className="text-xs font-bold">{schoolInitials}</span>
               </div>
               <h3 className="font-bold">{name}</h3>
             </div>
             <p className="text-gray-400 text-sm mb-4">
               {address}<br />
               Phone: {phone}<br />
               Email: {email}
             </p>
             <div className="flex space-x-3">
               <a href="#" className="text-gray-400 hover:text-white">
                 <span>📱</span>
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <span>📘</span>
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <span>📷</span>
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <span>🐦</span>
               </a>
             </div>
           </div>
           
           <div>
             <h3 className="font-bold text-lg mb-4">Quick Links</h3>
             <ul className="space-y-2 text-gray-400">
               <li><a href="#" className="hover:text-white">About Us</a></li>
               <li><a href="#" className="hover:text-white">Academics</a></li>
               <li><a href="#" className="hover:text-white">Admissions</a></li>
               <li><a href="#" className="hover:text-white">Campus Life</a></li>
               <li><a href="#" className="hover:text-white">News & Events</a></li>
               <li><a href="#" className="hover:text-white">Contact Us</a></li>
             </ul>
           </div>
           
           <div>
             <h3 className="font-bold text-lg mb-4">Resources</h3>
             <ul className="space-y-2 text-gray-400">
               <li><a href="#" className="hover:text-white">Student Portal</a></li>
               <li><a href="#" className="hover:text-white">Library Catalog</a></li>
               <li><a href="#" className="hover:text-white">Academic Calendar</a></li>
               <li><a href="#" className="hover:text-white">Quiz Platform</a></li>
               <li><a href="#" className="hover:text-white">Subject Resources</a></li>
               <li><a href="#" className="hover:text-white">Support Services</a></li>
             </ul>
           </div>
           
           <div>
             <h3 className="font-bold text-lg mb-4">Subscribe to Newsletter</h3>
             <p className="text-gray-400 text-sm mb-4">
               Stay updated with school news, events, and announcements.
             </p>
             <form className="mb-4">
               <div className="flex">
                 <input 
                   type="email" 
                   placeholder="Your email" 
                   className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none"
                 />
                 <button 
                   type="submit" 
                   className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition"
                 >
                   Subscribe
                 </button>
               </div>
             </form>
             <div className="flex items-center space-x-2">
               <div className="bg-red-600 text-white p-1 rounded-md flex items-center justify-center w-6 h-6">
                 <span className="text-xs font-bold">{ministryInitials}</span>
               </div>
               <span className="text-xs text-gray-400">Accredited by the {ministry}</span>
             </div>
           </div>
         </div>
         
         <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
           <p>&copy; {currentYear} {name}. All rights reserved.</p>
         </div>
       </div>
     </footer>
   );
 }