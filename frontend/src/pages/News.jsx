import React, { useState, useEffect } from 'react';
import { getNews, getNewsItem } from '../services/newsService';
import { format } from 'date-fns';
import { useParams, Link } from 'react-router-dom';

export default function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentNews, setCurrentNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const newsId = params.id;

  useEffect(() => {
    if (newsId) {
      fetchSingleNews(newsId);
    } else {
      fetchNewsList(currentPage);
    }
  }, [newsId, currentPage]);

  const fetchNewsList = async (page) => {
    try {
      setLoading(true);
      const response = await getNews(page);
      setNewsItems(response.data);
      setTotalPages(response.last_page || 1);
      setLoading(false);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      setLoading(false);
    }
  };

  const fetchSingleNews = async (id) => {
    try {
      setLoading(true);
      const response = await getNewsItem(id);
      setCurrentNews(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load the news article. Please try again later.');
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Renders a single news article view
  const renderNewsDetail = () => {
    if (!currentNews) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-orange-100 h-64 w-full"></div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500">
              {format(new Date(currentNews.published_at), 'MMMM d, yyyy')}
            </span>
            {currentNews.author && (
              <>
                <span className="mx-2">•</span>
                <span className="text-sm text-gray-500">By {currentNews.author.name}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{currentNews.title}</h1>
          
          <div className="prose prose-orange max-w-none">
            {currentNews.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link to="/news" className="text-orange-600 hover:underline">
              ← Back to all news
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Renders the news list view
  const renderNewsList = () => {
    return (
      <>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">School News</h1>
        
        {newsItems.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">No news articles found</h3>
            <p className="text-gray-600 mt-2">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map(news => (
              <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="bg-orange-100 h-48"></div>
                <div className="p-4">
                  <span className="text-sm text-gray-500">
                    {format(new Date(news.published_at), 'MMMM d, yyyy')}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.content.substring(0, 150)}
                    {news.content.length > 150 ? '...' : ''}
                  </p>
                  <Link to={`/news/${news.id}`} className="text-orange-600 hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === i + 1
                      ? 'z-10 bg-orange-600 border-orange-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </>
    );
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : newsId ? renderNewsDetail() : renderNewsList()}
    </main>
  );
}