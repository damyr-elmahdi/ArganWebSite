import { Link } from 'react-router-dom';

export default function NewsSection() {
  // Sample news items
  const newsItems = [
    {
      id: 1,
      title: "New Science Lab Equipment Arrives",
      excerpt: "Our science department received state-of-the-art equipment to enhance student learning experiences in physics and chemistry.",
      date: "April 10, 2025"
    },
    {
      id: 2,
      title: "Higher Education Fair Next Month",
      excerpt: "Representatives from top universities will be on campus to discuss admission requirements and scholarship opportunities.",
      date: "April 5, 2025"
    },
    {
      id: 3,
      title: "Student Achievement Award Winners",
      excerpt: "Congratulations to all students recognized at this year's Achievement Awards ceremony for their outstanding academic performance.",
      date: "March 28, 2025"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
          <Link to="/news" className="text-orange-600 hover:underline">View All News</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.map(news => (
            <div key={news.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="bg-orange-100 h-40"></div>
              <div className="p-4">
                <span className="text-sm text-gray-500">{news.date}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.excerpt}</p>
                <Link to={`/news/${news.id}`} className="text-orange-600 hover:underline">Read more</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}