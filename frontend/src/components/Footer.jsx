import { Link } from 'react-router-dom';
import argan from "../assets/argan.png";
import Ministry from "../assets/Ministry.png";

export default function Footer({ schoolInfo }) {
  const { name, ministry, address, phone, email, currentYear } = schoolInfo;
  
  return (
    <footer className="bg-orange-300 text-black-800">
      {/* Changed background to lighter color for better visibility of dark Ministry logo */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* Make Argan logo clickable */}
              <Link to="/" className="w-20 h-20">
                <img src={argan} alt="Argan High School" className="w-full h-full object-contain" />
              </Link>
              <h3 className="font-bold">{name}</h3>
            </div>
            <p className="text-black-600 text-sm mb-4">
              {address}<br />
              Phone: {phone}<br />
              Email: {email}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-black-600 hover:text-black-800">
                <span>📱</span>
              </a>
              <a href="#" className="text-black-600 hover:text-black-800">
                <span>📘</span>
              </a>
              <a href="#" className="text-black-600 hover:text-black-800">
                <span>📷</span>
              </a>
              <a href="#" className="text-black-600 hover:text-black-800">
                <span>🐦</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-black-600">
              <li><Link to="/about" className="hover:text-black-800">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-black-800">Academics</Link></li>
              <li><Link to="/register" className="hover:text-black-800">Admissions</Link></li>
              <li><Link to="/news" className="hover:text-black-800">News & Events</Link></li>
              <li><Link to="/library" className="hover:text-black-800">Library</Link></li>
              <li><Link to="/contact" className="hover:text-black-800">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-black-600">
              <li><a href="#" className="hover:text-black-800">Student Portal</a></li>
              <li><Link to="/library" className="hover:text-black-800">Library Catalog</Link></li>
              <li><a href="#" className="hover:text-black-800">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-black-800">Quiz Platform</a></li>
              <li><a href="#" className="hover:text-black-800">Subject Resources</a></li>
              <li><a href="#" className="hover:text-black-800">Support Services</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black-300 mt-8 pt-6 text-center text-black-600 text-sm">
          {/* Keep Ministry logo in its original position with text */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-20 h-20">
              <img src={Ministry} alt="Ministry Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-black-600">Accredited by the {ministry}</span>
          </div>
          <p>&copy; {currentYear} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}