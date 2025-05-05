import { Link } from 'react-router-dom';

export default function Hero({ schoolName, foundedYear }) {
  return (
    <section className="bg-gradient-to-r from-[#1975be] to-[#165b9f] text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to {schoolName}</h2>
            <p className="text-lg mb-6">Providing quality education and fostering academic excellence since {foundedYear}.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register-student" className="bg-[#85aa2f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#6b3012] transition">Apply Now</Link>
              <Link to="/about" className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-[#165b9f] transition">Learn More</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-[#165b9f] font-bold text-xl mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">📝</span>
                  <Link to="/register" className="hover:text-[#18bebc]">Registration Information</Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📚</span>
                  <Link to="/library" className="hover:text-[#18bebc]">Library</Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔍</span>
                  <Link to="/academics" className="hover:text-[#18bebc]">Academic Resources</Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📰</span>
                  <Link to="/news" className="hover:text-[#18bebc]">Latest News</Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <Link to="/contact" className="hover:text-[#18bebc]">Contact Administration</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}