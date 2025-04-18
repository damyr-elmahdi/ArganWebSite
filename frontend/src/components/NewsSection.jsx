import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/newsService';
import { format } from 'date-fns';

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const response = await getNews(1); // Get first page of news
        
        // Extract only the first 3 news items
        const latestNews = response.data.slice(0, 3);
        setNewsItems(latestNews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching latest news:', err);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Fallback data if API call fails or returns no news
  const fallbackNews = [
    {
      id: 1,
      title: "New Science Lab Equipment Arrives",
      content: "Our science department received state-of-the-art equipment to enhance student learning experiences in physics and chemistry.",
      published_at: "2025-04-10T09:30:00"
    },
    {
      id: 2,
      title: "Higher Education Fair Next Month",
      content: "Representatives from top universities will be on campus to discuss admission requirements and scholarship opportunities.",
      published_at: "2025-04-05T14:00:00"
    },
    {
      id: 3,
      title: "Student Achievement Award Winners",
      content: "Congratulations to all students recognized at this year's Achievement Awards ceremony for their outstanding academic performance.",
      published_at: "2025-03-28T16:45:00"
    }
  ];

  // Use fallback data if needed
  const newsToDisplay = newsItems.length > 0 ? newsItems : error ? fallbackNews : [];

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
          <Link to="/news" className="text-orange-600 hover:underline">View All News</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {newsToDisplay.map(news => (
              <div key={news.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                <div className="bg-orange-100 h-40"></div>
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-sm text-gray-500">
                    {format(new Date(news.published_at), 'MMMM d, yyyy')}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{getExcerpt(news.content)}</p>
                  <Link to={`/news/${news.id}`} className="text-orange-600 hover:underline mt-auto">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}