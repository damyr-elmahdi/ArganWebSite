import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../services/newsService";
import { format } from "date-fns";
import { getImageUrl } from "../utils/imageUtils";
import { useTranslation } from "react-i18next";

export default function NewsSection() {
  const { t } = useTranslation();
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
        console.error("Error fetching latest news:", err);
        setError(t('news.errors.loadFailed'));
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, [t]);

  // Use fallback data if needed
  const newsToDisplay = newsItems.length > 0 ? newsItems : [];

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{t('news.latestNews')}</h2>
          <Link to="/news" className="text-[#18bebc] hover:underline">
            {t('news.viewAllNews')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bebc]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {newsToDisplay.map((news) => (
              <div
                key={news.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md h-full flex flex-col"
              >
                {news.image_path ? (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={getImageUrl(news.image_path)}
                      alt={news.title}
                      className="w-full h-auto max-h-48 object-contain mx-auto bg-gray-50"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-teal-100 to-teal-200 h-48 rounded-t-lg flex items-center justify-center">
                    <span className="text-teal-400 text-lg font-semibold">
                      {t('news.noImageAvailable')}
                    </span>
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-sm text-gray-500">
                    {format(new Date(news.published_at), t('dateFormat.long'))}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {getExcerpt(news.content)}
                  </p>
                  <Link
                    to={`/news/${news.id}`}
                    className="text-[#18bebc] hover:underline mt-auto"
                  >
                    {t('news.readMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}