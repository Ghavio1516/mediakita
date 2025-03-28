"use client";

import React, { useEffect, useState } from 'react';

// Mendefinisikan tipe data untuk props
interface NewsDetailsProps {
  news: {
    title: string;
    thumbnail: string;
    content: string;
  } | null;
}

const NewsDetails = ({ params }: { params: { news_id: string } }) => {
  const [news, setNews] = useState<NewsDetailsProps['news'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsById = async (news_id: string) => {
      try {
        const res = await fetch(`/api/news/${news_id}`);
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        } else {
          setError('News not found');
        }
      } catch (err) {
        setError('An error occurred while fetching news');
      } finally {
        setLoading(false);
      }
    };

    if (params.news_id) {
      fetchNewsById(params.news_id);
    }
  }, [params.news_id]);

  // Function to handle rich text content rendering
  const formatContent = (content: string) => {
    // Create a div element to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Return the content as dangerouslySetInnerHTML
    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!news) {
    return <div>News not found</div>;
  }

  return (
    <div className="space-y-8 py-8 px-6">
      <h1 className="text-3xl font-bold text-center">{news.title}</h1>
      <img
        src={news.thumbnail}
        alt={news.title}
        className="mx-auto max-w-[80vw] h-[500px] object-cover rounded-2xl"
      />
      <div className="max-w-[80vw] mx-auto">
        {/* Format and render content with line breaks */}
        <div>{formatContent(news.content)}</div>
      </div>
    </div>
  );
};

export default NewsDetails;
