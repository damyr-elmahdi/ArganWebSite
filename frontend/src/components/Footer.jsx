import { Link } from 'react-router-dom';

export default function Footer({ schoolInfo }) {
  const { name, ministry, address, phone, email, currentYear } = schoolInfo;
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8">
                <img src="/argan.jpg" alt="Argan High School" className="w-full h-full object-contain" />
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
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white">Academics</Link></li>
              <li><Link to="/register" className="hover:text-white">Admissions</Link></li>
              <li><Link to="/news" className="hover:text-white">News & Events</Link></li>
              <li><Link to="/library" className="hover:text-white">Library</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Student Portal</a></li>
              <li><Link to="/library" className="hover:text-white">Library Catalog</Link></li>
              <li><a href="#" className="hover:text-white">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white">Quiz Platform</a></li>
              <li><a href="#" className="hover:text-white">Subject Resources</a></li>
              <li><a href="#" className="hover:text-white">Support Services</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6">
              <img src="/Ministry.jpg" alt="Ministry Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-gray-400">Accredited by the {ministry}</span>
          </div>
          <p>&copy; {currentYear} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}