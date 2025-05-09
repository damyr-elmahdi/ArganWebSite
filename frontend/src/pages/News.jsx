import React, { useState, useEffect } from "react";
import { getNews, getNewsItem } from "../services/newsService";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import CommentSection from "../components/CommentSection";
import ImageModal from "../components/ImageModal";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

export default function News() {
  const { t } = useTranslation(); // Initialize the translation function
  const [newsItems, setNewsItems] = useState([]);
  const [currentNews, setCurrentNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const newsId = params.id;
  
  // State for the image modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

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
      setError(t('news.errors.failedToLoad'));
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
      setError(t('news.errors.failedToLoadArticle'));
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Function to open the modal with the image
  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  // Renders a single news article view
  const renderNewsDetail = () => {
    if (!currentNews) return null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {currentNews.image_path ? (
          <div className="w-full bg-gray-50 flex items-center justify-center py-4">
            <img
              src={currentNews.image_url || getImageUrl(currentNews.image_path)}
              alt={currentNews.title}
              className="max-w-full max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openImageModal(currentNews.image_url || getImageUrl(currentNews.image_path))}
            />
          </div>
        ) : (
          <div className="bg-teal-100 h-64 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500">
              {format(new Date(currentNews.published_at), "MMMM d, yyyy")}
            </span>
            {currentNews.author && (
              <>
                <span className="mx-2">•</span>
                <span className="text-sm text-gray-500">
                  {t('news.byAuthor', { author: currentNews.author.name })}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {currentNews.title}
          </h1>

          <div className="prose prose-teal max-w-none">
            {currentNews.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Comment Section */}
          <CommentSection newsId={currentNews.id} />

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link to="/news" className="text-[#18bebc] hover:underline">
              {t('news.backToAllNews')}
            </Link>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal 
          isOpen={modalOpen}
          imageUrl={modalImage}
          imageAlt={currentNews.title}
          onClose={() => setModalOpen(false)}
        />
      </div>
    );
  };

  // The rest of the News component remains unchanged
  const renderNewsList = () => {
    return (
      <>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('news.title')}</h1>

        {newsItems.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              {t('news.noArticlesFound')}
            </h3>
            <p className="text-gray-600 mt-2">{t('news.checkBackLater')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                {news.image_path ? (
                  <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center rounded-t-lg">
                    <img
                      src={news.image_url || getImageUrl(news.image_path)}
                      alt={news.title}
                      className="max-h-48 max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="bg-teal-100 h-48 rounded-t-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <span className="text-sm text-gray-500">
                    {format(new Date(news.published_at), "MMMM d, yyyy")}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.content.substring(0, 150)}
                    {news.content.length > 150 ? "..." : ""}
                  </p>
                  <Link
                    to={`/news/${news.id}`}
                    className="text-[#18bebc] hover:underline"
                  >
                    {t('news.readMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label={t('news.paginationLabel')}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t('news.pagination.previous')}
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === i + 1
                      ? "z-10 bg-[#18bebc] border-[#18bebc] text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } text-sm font-medium`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t('news.pagination.next')}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bebc]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : newsId ? (
        renderNewsDetail()
      ) : (
        renderNewsList()
      )}
    </main>
  );
}