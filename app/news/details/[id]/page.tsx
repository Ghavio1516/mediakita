"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import NewsComments from "../../../components/NewsComments";

interface NewsDetail {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  const fetchNewsDetail = async () => {
    try {
      const response = await axios.get(`/api/news/${params.id}`);
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news detail:", error);
      setError("Failed to load news");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error || "News not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* News Content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative aspect-video">
            <img
              src={news.thumbnail}
              alt={news.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>
            <div className="text-gray-500 mb-6">
              {new Date(news.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <NewsComments newsId={params.id} />
        </section>
      </div>
    </div>
  );
}
